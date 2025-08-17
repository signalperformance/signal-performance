import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { ScheduleEntry, DayOfWeek, ClassType } from '@/types/admin';
import { mockSchedule } from '@/data/mockAdminData';
import { BulkAddClassModal } from './BulkAddClassModal';
import { EditClassModal } from './EditClassModal';

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function WeeklyScheduleManager() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ScheduleEntry | null>(null);

  const getDaySchedule = (day: DayOfWeek) => {
    return schedule
      .filter(entry => entry.dayOfWeek === day && entry.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getClassTypeColor = (classType: ClassType) => {
    const colors = {
      mobility: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      strength: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cardio: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      power: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[classType];
  };

  const handleAddClasses = (classesData: Omit<ScheduleEntry, 'id'>[]) => {
    const newClasses = classesData.map((classData, index) => ({
      ...classData,
      id: (schedule.length + index + 1).toString(),
    }));
    setSchedule(prev => [...prev, ...newClasses]);
  };

  const handleDeleteClass = (classId: string) => {
    setSchedule(prev => prev.filter(entry => entry.id !== classId));
  };

  const handleEditClass = (classEntry: ScheduleEntry) => {
    setSelectedClass(classEntry);
    setIsEditModalOpen(true);
  };

  const handleUpdateClass = (updatedClass: ScheduleEntry) => {
    setSchedule(prev => prev.map(entry => 
      entry.id === updatedClass.id ? updatedClass : entry
    ));
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
                          className="bg-muted/50 rounded-lg p-3 space-y-2 group hover:bg-muted/80 transition-colors cursor-pointer"
                          onClick={() => handleEditClass(entry)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={getClassTypeColor(entry.classType)}
                                >
                                  {entry.classType.charAt(0).toUpperCase()}
                                </Badge>
                                <Badge variant={entry.sessionType === 'pro' ? 'default' : 'outline'}>
                                  {entry.sessionType}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">
                                {entry.startTime} ({entry.duration}min)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Max: {entry.maxParticipants}
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
        onUpdateClass={handleUpdateClass}
      />
    </div>
  );
}