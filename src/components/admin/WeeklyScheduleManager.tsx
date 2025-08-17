import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Save, Upload } from 'lucide-react';
import { ScheduleEntry, DayOfWeek, ClassType, SessionType } from '@/types/admin';
import { mockSchedule } from '@/data/mockAdminData';
import { AddClassModal } from './AddClassModal';
import { BulkAddClassModal } from './BulkAddClassModal';
import { ScheduleTemplateModal } from './ScheduleTemplateModal';

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface ScheduleTemplate {
  name: string;
  schedule: ScheduleEntry[];
}

export function WeeklyScheduleManager() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<ScheduleTemplate[]>([]);

  const getDaySchedule = (day: DayOfWeek) => {
    return schedule
      .filter(entry => entry.dayOfWeek === day && entry.isActive)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getClassTypeColor = (classType: ClassType) => {
    const colors = {
      mobility: 'bg-blue-100 text-blue-800',
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-green-100 text-green-800',
      power: 'bg-purple-100 text-purple-800',
    };
    return colors[classType];
  };

  const handleAddClass = (classData: Omit<ScheduleEntry, 'id'>) => {
    const newClass: ScheduleEntry = {
      ...classData,
      id: (schedule.length + 1).toString(),
    };
    setSchedule(prev => [...prev, newClass]);
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

  const handleSaveTemplate = (template: ScheduleTemplate) => {
    setSavedTemplates(prev => [...prev, template]);
  };

  const handleLoadTemplate = (templateSchedule: ScheduleEntry[]) => {
    // Generate new IDs for loaded template
    const newSchedule = templateSchedule.map((entry, index) => ({
      ...entry,
      id: (index + 1).toString(),
    }));
    setSchedule(newSchedule);
  };

  const clearSchedule = () => {
    if (confirm('Are you sure you want to clear the entire schedule?')) {
      setSchedule([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Default Weekly Schedule</h2>
          <p className="text-muted-foreground">Set your standard recurring weekly class schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
            <Save className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" onClick={clearSchedule}>
            Clear All
          </Button>
          <Button variant="outline" onClick={() => setIsBulkAddModalOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Add Recurring
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Single Class
          </Button>
        </div>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your schedule efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">Recurring Classes</h4>
              <p className="text-sm text-muted-foreground mb-3">Add the same class to multiple days</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsBulkAddModalOpen(true)}
                className="w-full"
              >
                Add Recurring
              </Button>
            </div>
            
            <div className="p-4 border border-border rounded-lg text-center">
              <Save className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">Save Template</h4>
              <p className="text-sm text-muted-foreground mb-3">Save current schedule as template</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsTemplateModalOpen(true)}
                className="w-full"
              >
                Manage Templates
              </Button>
            </div>
            
            <div className="p-4 border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary mb-1">{schedule.length}</div>
              <h4 className="font-medium mb-1">Total Classes</h4>
              <p className="text-sm text-muted-foreground">In current schedule</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Day View</CardTitle>
          <CardDescription>Select a day to view and manage individual classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                onClick={() => setSelectedDay(day)}
                className="capitalize"
              >
                {day}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule for Selected Day */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{selectedDay} Schedule</CardTitle>
          <CardDescription>
            {getDaySchedule(selectedDay).length} classes scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getDaySchedule(selectedDay).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No classes scheduled for {selectedDay}</p>
                <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Class
                </Button>
              </div>
            ) : (
              getDaySchedule(selectedDay).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium capitalize">{entry.classType}</h4>
                      <Badge
                        variant="secondary"
                        className={getClassTypeColor(entry.classType)}
                      >
                        {entry.classType}
                      </Badge>
                      <Badge variant={entry.sessionType === 'pro' ? 'default' : 'outline'}>
                        {entry.sessionType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{entry.startTime} - {entry.endTime}</span>
                      <span>Max: {entry.maxParticipants} participants</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteClass(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>All classes at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {daysOfWeek.map((day) => {
              const dayClasses = getDaySchedule(day);
              return (
                <div key={day} className="p-3 border border-border rounded-lg">
                  <h4 className="font-medium capitalize mb-2">{day}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {dayClasses.length} classes
                  </p>
                  <div className="space-y-1">
                    {dayClasses.slice(0, 2).map((entry) => (
                      <div key={entry.id} className="text-xs">
                        <span className="font-medium">{entry.startTime}</span>
                        <span className="ml-2 capitalize">{entry.classType}</span>
                      </div>
                    ))}
                    {dayClasses.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{dayClasses.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClass={handleAddClass}
        selectedDay={selectedDay}
      />

      <BulkAddClassModal
        isOpen={isBulkAddModalOpen}
        onClose={() => setIsBulkAddModalOpen(false)}
        onAddClasses={handleAddClasses}
      />

      <ScheduleTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSaveTemplate={handleSaveTemplate}
        onLoadTemplate={handleLoadTemplate}
        currentSchedule={schedule}
        savedTemplates={savedTemplates}
      />
    </div>
  );
}