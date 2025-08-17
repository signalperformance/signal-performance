import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ScheduleEntry, DayOfWeek, ClassType, SessionType } from '@/types/admin';
import { mockSchedule } from '@/data/mockAdminData';

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function WeeklyScheduleManager() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Schedule Manager</h2>
          <p className="text-muted-foreground">Manage your weekly class schedule</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Class
        </Button>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Day</CardTitle>
          <CardDescription>Choose a day to view and manage classes</CardDescription>
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
                <Button variant="outline" className="mt-4">
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
                    <Button variant="ghost" size="icon">
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
    </div>
  );
}