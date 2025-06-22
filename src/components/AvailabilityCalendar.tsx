import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

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
  totalEvents?: number;
  relevantEvents?: number;
  timezone?: string;
  debugInfo?: {
    searchRange?: string;
    calendarId?: string;
    message?: string;
    suggestedFixes?: string[];
  };
}

const AvailabilityCalendar = ({ children }: AvailabilityCalendarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<AvailabilityStatus>({});
  const [hourlyData, setHourlyData] = useState<HourlyAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHourly, setLoadingHourly] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [debugMode, setDebugMode] = useState(false);

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
      
      console.log(`🔍 Fetching hourly availability for ${dateString}`);
      
      const { data, error } = await supabase.functions.invoke('check-availability', {
        body: { date: dateString }
      });

      if (error) {
        console.error('Error checking hourly availability:', error);
        setHourlyData({
          date: dateString,
          hourlyAvailability: [],
          debugInfo: {
            message: 'Error connecting to calendar service',
            suggestedFixes: ['Check internet connection', 'Verify calendar integration']
          }
        });
        return;
      }

      console.log('📊 Received availability data:', data);
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
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            My Availability
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDebugMode(!debugMode)}
              className="text-xs"
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </Button>
          </DialogTitle>
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
                  <div className="space-y-4">
                    {/* Summary Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Calendar Status</span>
                      </div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>Business hours: 9:00 AM - 6:00 PM</div>
                        {hourlyData.timezone && <div>Timezone: {hourlyData.timezone}</div>}
                        {typeof hourlyData.totalEvents === 'number' && (
                          <div>Total events found: {hourlyData.totalEvents}</div>
                        )}
                        {typeof hourlyData.relevantEvents === 'number' && (
                          <div>Events on this date: {hourlyData.relevantEvents}</div>
                        )}
                      </div>
                    </div>

                    {/* Hourly Slots */}
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
                          <div className="flex items-center gap-2">
                            {slot.available ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            <span className="text-sm">
                              {slot.available ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Debug Information */}
                    {debugMode && hourlyData.debugInfo && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-800">Debug Information</span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {hourlyData.debugInfo.searchRange && (
                            <div>Search range: {hourlyData.debugInfo.searchRange}</div>
                          )}
                          {hourlyData.debugInfo.calendarId && (
                            <div>Calendar ID: {hourlyData.debugInfo.calendarId}</div>
                          )}
                          {hourlyData.debugInfo.message && (
                            <div className="text-red-600 font-medium">{hourlyData.debugInfo.message}</div>
                          )}
                          {hourlyData.debugInfo.suggestedFixes && (
                            <div>
                              <div className="font-medium">Suggested fixes:</div>
                              <ul className="list-disc list-inside ml-2">
                                {hourlyData.debugInfo.suggestedFixes.map((fix, index) => (
                                  <li key={index}>{fix}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
