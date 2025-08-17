import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const { getUpcomingBookings, cancelBooking } = useBookings();
  const { toast } = useToast();

  const upcomingBookings = user ? getUpcomingBookings(user.id) : [];

  const formatTime = (hour24: number) => {
    const date = new Date();
    date.setHours(hour24, 0, 0, 0);
    return format(date, 'h:mm a');
  };

  const getSessionTypeColor = (sessionType: 'pro' | 'amateur') => {
    return sessionType === 'pro' 
      ? 'bg-signal-gold text-signal-gold-foreground' 
      : 'bg-charcoal text-charcoal-foreground';
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM dd');
  };

  const handleCancelBooking = (bookingId: string, sessionName: string, date: Date) => {
    if (cancelBooking(bookingId)) {
      toast({
        title: "Booking cancelled",
        description: `Cancelled ${sessionName} on ${format(date, 'EEEE, MMM dd')}`,
      });
    } else {
      toast({
        title: "Cancellation failed",
        description: "Unable to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (upcomingBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
            <p className="text-muted-foreground mb-4">
              You haven't booked any sessions yet. Check the schedule to book your first session!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group bookings by date
  const bookingsByDate = upcomingBookings.reduce((acc, booking) => {
    const dateKey = format(booking.bookingDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, typeof upcomingBookings>);

  // Sort dates and bookings
  const sortedDates = Object.keys(bookingsByDate).sort();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            My Bookings
            <Badge variant="outline">
              {upcomingBookings.length} upcoming
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {sortedDates.map(dateKey => {
        const bookings = bookingsByDate[dateKey];
        const date = new Date(dateKey + 'T00:00:00');
        const sortedBookings = bookings.sort((a, b) => a.hour24 - b.hour24);

        return (
          <Card key={dateKey}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {getDateLabel(date)}
                <div className="text-sm font-normal text-muted-foreground">
                  {format(date, 'MMMM dd, yyyy')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedBookings.map((booking) => {
                const canCancel = !isPast(booking.bookingDate);

                return (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{booking.sessionName}</h4>
                            <Badge 
                              className={getSessionTypeColor(booking.sessionType)}
                              variant="secondary"
                            >
                              {booking.sessionType.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatTime(booking.hour24)}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Main Studio
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Booked on {format(booking.createdAt, 'MMM dd, yyyy')}
                          </div>
                        </div>

                        {canCancel && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your booking for {booking.sessionName} on {getDateLabel(booking.bookingDate)} at {formatTime(booking.hour24)}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id, booking.sessionName, booking.bookingDate)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};