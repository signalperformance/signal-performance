import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingStore } from '@/stores/useBookingStore';
import { ScheduleWithAvailability } from '@/types/client';
import { SessionCard } from './SessionCard';
import { BookingModal } from './BookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addWeeks, isSameDay, isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const ClientScheduleView: React.FC = () => {
  const { user } = useAuth();
  const { 
    getScheduleWithAvailability, 
    bookSession, 
    cancelBooking, 
    getUserBookings, 
    loadBookings, 
    loadSchedule 
  } = useBookingStore();
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      await loadSchedule();
      await loadBookings();
    };
    initializeData();
  }, [loadBookings, loadSchedule]);

  const [selectedSession, setSelectedSession] = useState<ScheduleWithAvailability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week
  const [selectedDay, setSelectedDay] = useState<string>(''); // Will be set to today's date string

  const userBookings = user ? getUserBookings(user.id) : [];
  const scheduleWithAvailability = getScheduleWithAvailability();

  const getCurrentWeekStart = () => {
    const today = new Date();
    return addWeeks(startOfWeek(today, { weekStartsOn: 1 }), weekOffset);
  };

  const getWeekDays = () => {
    const weekStart = getCurrentWeekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  };

  const getSessionsForDay = (date: Date) => {
    const allSessions = scheduleWithAvailability.filter(session => 
      isSameDay(session.date, date)
    );
    
    // Filter sessions based on user membership level
    const filteredSessions = allSessions.filter(session => {
      if (!user) return false;
      if (user.membershipPlan === 'basic') {
        return session.sessionType === 'amateur';
      } else if (user.membershipPlan === 'pro') {
        return session.sessionType === 'pro';
      }
      return false;
    });
    
    return filteredSessions.sort((a, b) => a.hour24 - b.hour24);
  };

  const isSessionBooked = (session: ScheduleWithAvailability) => {
    return userBookings.some(booking =>
      booking.dayKey === session.dayKey &&
      booking.hour24 === session.hour24 &&
      isSameDay(booking.bookingDate, session.date)
    );
  };

  const canUserBookSession = (session: ScheduleWithAvailability) => {
    if (!user) return false;
    if (session.sessionType === 'pro' && user.membershipPlan === 'basic') return false;
    return true;
  };

  const handleSessionClick = (session: ScheduleWithAvailability) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleBookingConfirm = async () => {
    if (!selectedSession || !user) return;

    const isBooked = isSessionBooked(selectedSession);

    if (isBooked) {
      // Cancel booking
      const booking = userBookings.find(b =>
        b.dayKey === selectedSession.dayKey &&
        b.hour24 === selectedSession.hour24 &&
        isSameDay(b.bookingDate, selectedSession.date)
      );
      
      if (booking && await cancelBooking(booking.id)) {
        toast({
          title: "Booking cancelled",
          description: `Cancelled ${selectedSession.name} on ${format(selectedSession.date, 'EEEE, MMM dd')}`,
        });
      }
    } else {
      // Book session
      const success = await bookSession(selectedSession, user.id);
      if (success) {
        toast({
          title: "Session booked!",
          description: `Booked ${selectedSession.name} on ${format(selectedSession.date, 'EEEE, MMM dd')}`,
        });
      } else {
        toast({
          title: "Booking failed",
          description: "Unable to book session. It may be full or you may already be booked.",
          variant: "destructive",
        });
      }
    }

    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const weekDays = getWeekDays();
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Set default selected day to today (or first day with sessions)
  const defaultDay = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const weekDayStrs = weekDays.map(day => format(day, 'yyyy-MM-dd'));
    
    if (weekDayStrs.includes(todayStr)) {
      return todayStr;
    }
    
    // Find first day with sessions
    for (const day of weekDays) {
      const sessions = getSessionsForDay(day);
      if (sessions.length > 0) {
        return format(day, 'yyyy-MM-dd');
      }
    }
    
    return format(weekDays[0], 'yyyy-MM-dd');
  }, [weekDays, scheduleWithAvailability]);

  // Update selected day when week changes or on first load
  React.useEffect(() => {
    if (!selectedDay || !weekDays.find(day => format(day, 'yyyy-MM-dd') === selectedDay)) {
      setSelectedDay(defaultDay);
    }
  }, [defaultDay, selectedDay, weekDays]);

  const selectedDate = selectedDay ? new Date(selectedDay) : weekDays[0];
  const selectedDaySessions = getSessionsForDay(selectedDate);

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Training Schedule
              <Badge variant="outline">
                {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                disabled={weekOffset === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(Math.min(1, weekOffset + 1))}
                disabled={weekOffset === 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day Selection Tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="grid w-full grid-cols-7 h-auto">
          {weekDays.map((date) => {
            const dayStr = format(date, 'yyyy-MM-dd');
            const dayName = format(date, 'EEE');
            const dateNum = format(date, 'dd');
            const sessions = getSessionsForDay(date);
            const userBookingsCount = sessions.filter(session => isSessionBooked(session)).length;
            
            return (
              <TabsTrigger
                key={dayStr}
                value={dayStr}
                className="flex flex-col p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="text-xs font-medium">{dayName}</div>
                <div className="text-lg font-bold">{dateNum}</div>
                <div className="flex gap-1 mt-1">
                  {sessions.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {sessions.length}
                    </Badge>
                  )}
                  {userBookingsCount > 0 && (
                    <Badge variant="default" className="text-xs px-1 py-0 bg-primary">
                      {userBookingsCount}
                    </Badge>
                  )}
                  {isToday(date) && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Selected Day Sessions */}
        <TabsContent value={selectedDay} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {format(selectedDate, 'EEEE, MMMM dd')}
                  {isToday(selectedDate) && <Badge variant="outline" className="ml-2">Today</Badge>}
                </span>
                <Badge variant="secondary">
                  {selectedDaySessions.length} session{selectedDaySessions.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sessions scheduled for this day</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDaySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isBooked={isSessionBooked(session)}
                      canBook={canUserBookSession(session)}
                      onBook={() => handleSessionClick(session)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <BookingModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSession(null);
        }}
        onConfirm={handleBookingConfirm}
        isBooked={selectedSession ? isSessionBooked(selectedSession) : false}
        canBook={selectedSession ? canUserBookSession(selectedSession) : false}
        userMembershipPlan={user?.membershipPlan || 'basic'}
      />
    </div>
  );
};