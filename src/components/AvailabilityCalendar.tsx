
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface AvailabilityCalendarProps {
  children: React.ReactNode;
}

interface AvailabilityStatus {
  [date: string]: boolean; // true = available, false = busy
}

const AvailabilityCalendar = ({ children }: AvailabilityCalendarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<AvailabilityStatus>({});
  const [loading, setLoading] = useState(false);
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

      return data?.available || false;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Availability</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {loading && (
            <div className="text-sm text-muted-foreground">
              Loading availability...
            </div>
          )}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            onMonthChange={setCurrentMonth}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border pointer-events-auto"
          />
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 opacity-60 rounded-full"></div>
              <span>Busy</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Green dates are available, red dates are busy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityCalendar;
