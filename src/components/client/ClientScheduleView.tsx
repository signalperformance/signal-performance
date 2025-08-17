import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { ScheduleWithAvailability } from '@/types/client';
import { SessionCard } from './SessionCard';
import { BookingModal } from './BookingModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const ClientScheduleView: React.FC = () => {
  const { user } = useAuth();
  const { getScheduleWithAvailability, bookSession, cancelBooking, getUserBookings } = useBookings();
  const { toast } = useToast();

  const [selectedSession, setSelectedSession] = useState<ScheduleWithAvailability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week

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
    return scheduleWithAvailability.filter(session => 
      isSameDay(session.date, date)
    ).sort((a, b) => a.hour24 - b.hour24);
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

  const handleBookingConfirm = () => {
    if (!selectedSession || !user) return;

    const isBooked = isSessionBooked(selectedSession);

    if (isBooked) {
      // Cancel booking
      const booking = userBookings.find(b =>
        b.dayKey === selectedSession.dayKey &&
        b.hour24 === selectedSession.hour24 &&
        isSameDay(b.bookingDate, selectedSession.date)
      );
      
      if (booking && cancelBooking(booking.id)) {
        toast({
          title: "Booking cancelled",
          description: `Cancelled ${selectedSession.name} on ${format(selectedSession.date, 'EEEE, MMM dd')}`,
        });
      }
    } else {
      // Book session
      if (bookSession(selectedSession, user.id)) {
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

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weekDays.map((date) => {
          const sessions = getSessionsForDay(date);
          const dayName = format(date, 'EEEE');
          const dateStr = format(date, 'MMM dd');

          return (
            <Card key={date.toISOString()}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {dayName}
                  <div className="text-sm font-normal text-muted-foreground">
                    {dateStr}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sessions scheduled
                  </p>
                ) : (
                  sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isBooked={isSessionBooked(session)}
                      canBook={canUserBookSession(session)}
                      onBook={() => handleSessionClick(session)}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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