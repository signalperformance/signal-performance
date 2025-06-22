
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Clock } from 'lucide-react';

interface AvailabilityCalendarProps {
  children: React.ReactNode;
}

interface AvailabilityStatus {
  [date: string]: boolean; // true = available, false = busy
}

interface HourlySlot {
  hour: number;
  time: string;
  available: boolean;
}

interface HourlyAvailability {
  date: string;
  hourlyAvailability: HourlySlot[];
}

const AvailabilityCalendar = ({ children }: AvailabilityCalendarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<AvailabilityStatus>({});
  const [hourlyData, setHourlyData] = useState<HourlyAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHourly, setLoadingHourly] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to check availability for a specific date
  const checkDateAvailability = async (date: Date) => {
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase.functions.invoke('check-availability', {
        body: { date: dateString }
      });

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      // Check if any hour is available (for daily overview)
      const hourlyAvailability = data?.hourlyAvailability || [];
      return hourlyAvailability.some((slot: HourlySlot) => slot.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  // Function to get hourly availability for a specific date
  const getHourlyAvailability = async (date: Date) => {
    setLoadingHourly(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase.functions.invoke('check-availability', {
        body: { date: dateString }
      });

      if (error) {
        console.error('Error checking hourly availability:', error);
        setHourlyData(null);
        return;
      }

      setHourlyData(data);
    } catch (error) {
      console.error('Error checking hourly availability:', error);
      setHourlyData(null);
    } finally {
      setLoadingHourly(false);
    }
  };

  // Load availability for the current month
  const loadMonthAvailability = async (month: Date) => {
    setLoading(true);
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const availabilityPromises = daysInMonth.map(async (day) => {
      const dateString = format(day, 'yyyy-MM-dd');
      const isAvailable = await checkDateAvailability(day);
      return { dateString, isAvailable };
    });

    try {
      const results = await Promise.all(availabilityPromises);
      const newAvailability: AvailabilityStatus = {};
      
      results.forEach(({ dateString, isAvailable }) => {
        newAvailability[dateString] = isAvailable;
      });

      setAvailability(prev => ({ ...prev, ...newAvailability }));
    } catch (error) {
      console.error('Error loading month availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      getHourlyAvailability(date);
    } else {
      setHourlyData(null);
    }
  };

  // Load availability when dialog opens or month changes
  useEffect(() => {
    if (open) {
      loadMonthAvailability(currentMonth);
    }
  }, [open, currentMonth]);

  // Custom day modifier for styling
  const modifiers = {
    available: (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      return availability[dateString] === true;
    },
    busy: (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      return availability[dateString] === false;
    }
  };

  const modifiersStyles = {
    available: {
      backgroundColor: '#22c55e',
      color: 'white',
    },
    busy: {
      backgroundColor: '#ef4444',
      color: 'white',
      opacity: 0.6,
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Availability</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <div className="flex flex-col items-center space-y-4">
            {loading && (
              <div className="text-sm text-muted-foreground">
                Loading availability...
              </div>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border pointer-events-auto"
            />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Has availability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 opacity-60 rounded-full"></div>
                <span>Fully booked</span>
              </div>
            </div>
          </div>

          {/* Hourly Availability Section */}
          <div className="flex-1 min-w-0">
            {selectedDate ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                </div>
                
                {loadingHourly ? (
                  <div className="text-sm text-muted-foreground">
                    Loading hourly availability...
                  </div>
                ) : hourlyData ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      Business hours: 9:00 AM - 6:00 PM
                    </p>
                    <div className="grid gap-2">
                      {hourlyData.hourlyAvailability.map((slot) => (
                        <div
                          key={slot.hour}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            slot.available
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-red-50 border-red-200 text-red-800'
                          }`}
                        >
                          <span className="font-medium">{slot.time}</span>
                          <span className="text-sm">
                            {slot.available ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Failed to load hourly availability
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <Clock className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a date to view hourly availability
                </p>
                <p className="text-sm text-muted-foreground">
                  Business hours: 9:00 AM - 6:00 PM
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityCalendar;
