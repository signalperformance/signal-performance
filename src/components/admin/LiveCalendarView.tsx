import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, Calendar as CalendarIcon, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EditLiveClassModal } from './EditLiveClassModal';
import { AddLiveClassModal } from './AddLiveClassModal';
import { 
  format, 
  startOfWeek, 
  addDays, 
  addWeeks, 
  isSameDay, 
  startOfDay,
  endOfDay
} from 'date-fns';

interface LiveScheduleInstance {
  id: string;
  class_date: string;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: 'pro' | 'amateur';
  max_participants: number;
  is_cancelled: boolean;
}

interface Booking {
  id: string;
  user_id: string;
  schedule_entry_id: string;
  booking_date: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface ClassWithBookings extends LiveScheduleInstance {
  bookings: Booking[];
  booking_count: number;
  availability: number;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function LiveCalendarView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [classes, setClasses] = useState<ClassWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassWithBookings | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLiveCalendar();
  }, [currentWeekStart]);

  const loadLiveCalendar = async () => {
    try {
      setLoading(true);
      
      // Get two weeks of data starting from current week
      const weekStart = currentWeekStart;
      const weekEnd = addDays(weekStart, 13); // 2 weeks

      // Load live schedule instances for the two-week period
      const { data: instances, error: instancesError } = await supabase
        .from('live_schedule_instances')
        .select('*')
        .gte('class_date', format(weekStart, 'yyyy-MM-dd'))
        .lte('class_date', format(weekEnd, 'yyyy-MM-dd'))
        .eq('is_cancelled', false)
        .order('class_date')
        .order('start_time');

      if (instancesError) throw instancesError;

      // Load bookings for the same period
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          user_profiles!inner(first_name, last_name)
        `)
        .gte('booking_date', format(weekStart, 'yyyy-MM-dd'))
        .lte('booking_date', format(weekEnd, 'yyyy-MM-dd'));

      if (bookingsError) throw bookingsError;

      // Combine instances with their bookings
      const classesWithBookings: ClassWithBookings[] = (instances || []).map(instance => {
        const instanceBookings = (bookings || []).filter(booking => 
          isSameDay(new Date(booking.booking_date), new Date(instance.class_date)) &&
          // For now, match by class name and time since we don't have direct FK yet
          booking.schedule_entry_id === instance.id
        );

        return {
          ...instance,
          bookings: instanceBookings,
          booking_count: instanceBookings.length,
          availability: instance.max_participants - instanceBookings.length
        };
      });

      setClasses(classesWithBookings);
    } catch (error) {
      console.error('Error loading live calendar:', error);
      toast({
        title: "Error",
        description: "Failed to load live calendar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
  };

  const getClassesForDay = (dayOffset: number) => {
    const targetDate = addDays(currentWeekStart, dayOffset);
    return classes.filter(cls => isSameDay(new Date(cls.class_date), targetDate));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailabilityColor = (availability: number, maxParticipants: number) => {
    const ratio = availability / maxParticipants;
    if (ratio === 0) return 'destructive';
    if (ratio <= 0.3) return 'destructive';
    if (ratio <= 0.6) return 'secondary';
    return 'default';
  };

  const handleEditClass = (classInstance: ClassWithBookings) => {
    setSelectedClass(classInstance);
    setEditModalOpen(true);
  };

  const handleAddClass = (date: Date) => {
    setSelectedDate(date);
    setAddModalOpen(true);
  };

  const handleCloseModals = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setSelectedClass(null);
    setSelectedDate(null);
  };

  const handleUpdateSuccess = () => {
    loadLiveCalendar();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading live calendar...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Calendar</h1>
          <p className="text-muted-foreground">View scheduled classes and bookings for the next 2 weeks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium min-w-[200px] text-center">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 13), 'MMM d, yyyy')}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two-week calendar grid */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 14 }, (_, index) => {
          const dayOffset = index;
          const currentDate = addDays(currentWeekStart, dayOffset);
          const dayClasses = getClassesForDay(dayOffset);
          const isNewWeek = index === 7;

          return (
            <div key={index} className={`space-y-2 ${isNewWeek ? 'border-t-2 border-border pt-4' : ''}`}>
              <div className="text-center">
                <div className="text-sm font-medium">{daysOfWeek[index % 7]}</div>
                <div className="text-lg font-bold">{format(currentDate, 'd')}</div>
                <div className="text-xs text-muted-foreground">{format(currentDate, 'MMM')}</div>
              </div>
              
              <div className="space-y-2">
                {dayClasses.map((cls) => (
                  <Card 
                    key={cls.id} 
                    className={`p-2 cursor-pointer hover:bg-accent transition-colors ${cls.is_cancelled ? 'opacity-60' : ''}`}
                    onClick={() => handleEditClass(cls)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium">{formatTime(cls.start_time)}</div>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant={getAvailabilityColor(cls.availability, cls.max_participants)}
                            className="text-xs"
                          >
                            {cls.availability}/{cls.max_participants}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className={`text-xs font-medium ${cls.is_cancelled ? 'line-through' : ''}`}>
                        {cls.class_name}
                        {cls.is_cancelled && <span className="text-destructive ml-1">(Cancelled)</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={cls.session_type === 'pro' ? 'default' : 'secondary'} className="text-xs">
                          {cls.session_type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {cls.booking_count}
                        </div>
                      </div>
                      
                      {/* Show booked users */}
                      {cls.bookings.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {cls.bookings.slice(0, 2).map((booking, i) => (
                            <div key={booking.id}>
                              {booking.user_profiles?.first_name} {booking.user_profiles?.last_name}
                            </div>
                          ))}
                          {cls.bookings.length > 2 && (
                            <div>+{cls.bookings.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                
                <div className="space-y-1">
                  {dayClasses.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      No classes
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClass(currentDate);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Class
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{classes.length}</p>
                <p className="text-xs text-muted-foreground">Total Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{classes.reduce((sum, cls) => sum + cls.booking_count, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{classes.filter(cls => cls.availability === 0).length}</p>
                <p className="text-xs text-muted-foreground">Full Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((classes.reduce((sum, cls) => sum + cls.booking_count, 0) / 
                    classes.reduce((sum, cls) => sum + cls.max_participants, 0)) * 100) || 0}%
                </p>
                <p className="text-xs text-muted-foreground">Capacity Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EditLiveClassModal
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        classInstance={selectedClass}
        onUpdateClass={handleUpdateSuccess}
        bookingCount={selectedClass?.booking_count || 0}
      />

      <AddLiveClassModal
        isOpen={addModalOpen}
        onClose={handleCloseModals}
        onAddClass={handleUpdateSuccess}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
}