import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookingStore } from '@/stores/useBookingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { AddToCalendarButton } from './AddToCalendarButton';
import { format, isPast, isToday, isTomorrow, addHours } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTranslatedClassName } from '@/lib/classNameTranslation';
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
  const { t, language } = useLanguage();
  const { getUpcomingBookings, cancelBooking, loadBookings, loadSchedule } = useBookingStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const initializeData = async () => {
      await loadSchedule();
      await loadBookings();
    };
    initializeData();
  }, [loadBookings, loadSchedule]);

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
    if (isToday(date)) return t('client.schedule.today');
    if (isTomorrow(date)) return t('client.schedule.tomorrow');
    return language === 'zh' ? 
      format(date, 'EEEE, M月dd日', { locale: zhCN }) :
      format(date, 'EEEE, MMM dd');
  };

  const handleCancelBooking = async (bookingId: string, sessionName: string, date: Date) => {
    // Check if cancellation is within 3 hours of session start
    const now = new Date();
    const threeHoursCutoff = addHours(date, -3);
    
    if (now >= threeHoursCutoff) {
        toast({
          title: t('client.bookings.cancelError'),
          description: t('client.bookings.cancellationPolicy'),
          variant: "destructive",
        });
      return;
    }

    const success = await cancelBooking(bookingId);
    if (success) {
        toast({
          title: t('client.bookings.cancelSuccess'),
          description: t('client.bookings.cancelSuccessMessage'),
        });
    } else {
      toast({
        title: t('client.bookings.cancelFailedTitle'),
        description: t('client.bookings.cancelFailedMessage'),
        variant: "destructive",
      });
    }
  };

  if (upcomingBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('client.bookings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('client.bookings.noBookings')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('client.bookings.noBookingsMessage')}
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
            {t('client.bookings.title')}
            <Badge variant="outline">
              {language === 'zh' ? 
                `${upcomingBookings.length} ${t('client.bookings.upcoming')}` :
                `${upcomingBookings.length} upcoming`
              }
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
                  {language === 'zh' ? 
                    format(date, 'yyyy年M月dd日', { locale: zhCN }) :
                    format(date, 'MMMM dd, yyyy')
                  }
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedBookings.map((booking) => {
                const now = new Date();
                const threeHoursCutoff = addHours(booking.bookingDate, -3);
                const canCancel = !isPast(booking.bookingDate) && now < threeHoursCutoff;

                return (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardContent className={isMobile ? "p-6" : "p-4"}>
                      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-start justify-between'}`}>
                        <div className="space-y-3 flex-1">
                          <div className={`flex items-center ${isMobile ? 'flex-col items-start space-y-2' : 'gap-2'}`}>
                            <h4 className={`font-semibold ${isMobile ? 'text-lg' : ''}`}>
                              {getTranslatedClassName(booking.sessionName, t)}
                            </h4>
                            <Badge 
                              className={getSessionTypeColor(booking.sessionType)}
                              variant="secondary"
                            >
                              {booking.sessionType.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 gap-4'} text-sm text-muted-foreground`}>
                            <div className="flex items-center gap-2">
                              <Clock className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                              <span className={isMobile ? 'text-base' : ''}>
                                {formatTime(booking.hour24)}
                              </span>
                              {(() => {
                                const now = new Date();
                                const threeHoursCutoff = addHours(booking.bookingDate, -3);
                                const isWithinCutoff = now >= threeHoursCutoff;
                                
                                if (isWithinCutoff && !isPast(booking.bookingDate)) {
                                  return (
                                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                      {t('client.bookings.cantCancel')}
                                    </Badge>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center gap-2'}`}>
                          <AddToCalendarButton 
                            booking={booking}
                            variant="outline"
                            size={isMobile ? "default" : "sm"}
                            className={isMobile ? "w-full" : ""}
                          />
                          
                          {canCancel && (
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant={isMobile ? "destructive" : "ghost"}
                                size={isMobile ? "lg" : "sm"}
                                className={isMobile ? "w-full" : "text-destructive hover:text-destructive"}
                              >
                                <X className={`${isMobile ? 'h-5 w-5 mr-2' : 'h-4 w-4'}`} />
                                {isMobile && t('client.bookings.cancelBooking')}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('client.bookings.cancelConfirmTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {language === 'zh' ? 
                                    t('client.bookings.cancelConfirmMessage')
                                      .replace('{sessionName}', booking.sessionName)
                                      .replace('{date}', getDateLabel(booking.bookingDate))
                                      .replace('{time}', formatTime(booking.hour24)) :
                                    `Are you sure you want to cancel your booking for ${booking.sessionName} on ${getDateLabel(booking.bookingDate)} at ${formatTime(booking.hour24)}?`
                                  }
                                  <br /><br />
                                  <span className="text-amber-600 text-sm">
                                    {t('client.bookings.cancelNote')}
                                  </span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('client.bookings.keepBooking')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id, booking.sessionName, booking.bookingDate)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t('client.bookings.cancelBooking')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
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