import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BulkAddClassModal } from './BulkAddClassModal';
import { EditClassModal } from './EditClassModal';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type ClassType = 'mobility' | 'strength' | 'cardio' | 'power';
type SessionType = 'pro' | 'amateur';

interface ScheduleEntry {
  id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: SessionType;
  max_participants: number;
  is_active: boolean;
}

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function WeeklyScheduleManager() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ScheduleEntry | null>(null);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
  };

  const getDaySchedule = (day: DayOfWeek) => {
    return schedule
      .filter(entry => entry.day_of_week === day && entry.is_active)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const getClassTypeColor = (classType: string) => {
    const colors = {
      mobility: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      strength: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cardio: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      power: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[classType as keyof typeof colors] || colors.mobility;
  };

  const getSessionCardColor = (sessionType: SessionType) => {
    return sessionType === 'pro' 
      ? 'bg-signal-gold/20 border-signal-gold/30 hover:bg-signal-gold/30' 
      : 'bg-charcoal/10 border-charcoal/20 hover:bg-charcoal/20';
  };

  const handleAddClasses = async (classesData: any[]) => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .insert(classesData.map(classData => ({
          day_of_week: classData.dayOfWeek,
          start_time: classData.startTime,
          duration: classData.duration,
          class_name: `${classData.classType.toUpperCase()} (${classData.sessionType.toUpperCase()})`,
          session_type: classData.sessionType,
          max_participants: classData.maxParticipants,
          is_active: classData.isActive,
        })));

      if (error) throw error;
      loadSchedule(); // Reload after adding
    } catch (error) {
      console.error('Failed to add classes:', error);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_entries')
        .delete()
        .eq('id', classId);

      if (error) throw error;
      setSchedule(prev => prev.filter(entry => entry.id !== classId));
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const handleEditClass = (classEntry: ScheduleEntry) => {
    setSelectedClass(classEntry);
    setIsEditModalOpen(true);
  };

  const handleUpdateClass = async (updatedClass: ScheduleEntry) => {
    try {
      const { error } = await supabase
        .from('schedule_entries')
        .update({
          start_time: updatedClass.start_time,
          duration: updatedClass.duration,
          class_name: updatedClass.class_name,
          session_type: updatedClass.session_type,
          max_participants: updatedClass.max_participants,
        })
        .eq('id', updatedClass.id);

      if (error) throw error;
      
      setSchedule(prev => prev.map(entry => 
        entry.id === updatedClass.id ? updatedClass : entry
      ));
    } catch (error) {
      console.error('Failed to update class:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
          <p className="text-muted-foreground">Manage your default weekly class schedule</p>
        </div>
        <Button onClick={() => setIsBulkAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Classes
        </Button>
      </div>

      {/* Weekly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calendar</CardTitle>
          <CardDescription>
            Your complete weekly schedule at a glance ({schedule.length} total classes)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => {
              const dayClasses = getDaySchedule(day);
              return (
                <div key={day} className="border border-border rounded-lg p-4 min-h-[200px]">
                  <h3 className="font-semibold capitalize mb-3 text-center border-b border-border pb-2">
                    {day}
                  </h3>
                  <div className="space-y-2">
                    {dayClasses.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No classes
                      </p>
                    ) : (
                      dayClasses.map((entry) => (
                        <div 
                          key={entry.id} 
                          className={`rounded-lg p-3 space-y-2 group transition-colors cursor-pointer border ${getSessionCardColor(entry.session_type)}`}
                          onClick={() => handleEditClass(entry)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={getClassTypeColor(entry.class_name.split(' ')[0].toLowerCase())}
                                >
                                  {entry.class_name.split(' ')[0].charAt(0).toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">
                                {entry.start_time} ({entry.duration}min)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Max: {entry.max_participants}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(entry.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <BulkAddClassModal
        isOpen={isBulkAddModalOpen}
        onClose={() => setIsBulkAddModalOpen(false)}
        onAddClasses={handleAddClasses}
      />

      <EditClassModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        classEntry={selectedClass}
        onUpdateClass={() => {
          setIsEditModalOpen(false);
          setSelectedClass(null);
          loadSchedule();
        }}
      />
    </div>
  );
}