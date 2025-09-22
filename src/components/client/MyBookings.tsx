import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingStore } from '@/stores/useBookingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { AddToCalendarButton } from './AddToCalendarButton';
import { format, isPast, isToday, isTomorrow, addHours } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { zhCN, enUS } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { getUpcomingBookings, cancelBooking, loadBookings, loadSchedule } = useBookingStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  useEffect(() => {
    const initializeData = async () => {
      await loadSchedule();
      await loadBookings();
    };
    initializeData();
  }, [loadBookings, loadSchedule]);

  const upcomingBookings = user ? getUpcomingBookings(user.id) : [];

  const formatTime = (hour24: number, minute: number) => {
    const date = new Date();
    date.setHours(hour24, minute, 0, 0);
    return format(date, 'h:mm a');
  };

  const getSessionTypeColor = (sessionType: 'pro' | 'amateur') => {
    return sessionType === 'pro' 
      ? 'bg-signal-gold text-signal-gold-foreground' 
      : 'bg-charcoal text-charcoal-foreground';
  };

  const getDateLabel = (date: Date) => {
    const locale = language === 'zh' ? zhCN : enUS;
    if (isToday(date)) return t('portal.days.today');
    if (isTomorrow(date)) return t('portal.days.tomorrow');
    return format(date, 'EEEE, MMM dd', { locale });
  };

  const getSessionName = (sessionName: string) => {
    const translationKey = `portal.sessionNames.${sessionName}`;
    return t(translationKey) !== translationKey ? t(translationKey) : sessionName;
  };

  const handleCancelBooking = async (bookingId: string, sessionName: string, date: Date) => {
    // Check if cancellation is within 3 hours of session start
    const now = new Date();
    const threeHoursCutoff = addHours(date, -3);
    
    if (now >= threeHoursCutoff) {
      toast({
        title: t('portal.cancel.notAllowed'),
        description: t('portal.cancel.notAllowedDesc'),
        variant: "destructive",
      });
      return;
    }

    const success = await cancelBooking(bookingId);
    const locale = language === 'zh' ? zhCN : enUS;
    if (success) {
      toast({
        title: t('portal.cancel.success'),
        description: `${getSessionName(sessionName)} ${format(date, 'EEEE, MMM dd', { locale })}`,
      });
    } else {
      toast({
        title: t('portal.cancel.failed'),
        description: t('portal.cancel.failedDesc'),
        variant: "destructive",
      });
    }
  };

  if (upcomingBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('portal.bookings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('portal.empty.noBookingsTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('portal.empty.noBookingsDesc')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group bookings by date
  const bookingsByDate = upcomingBookings.reduce((acc, booking) => {
    const dateKey = formatInTimeZone(booking.bookingDate, 'Asia/Taipei', 'yyyy-MM-dd');
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
            {t('portal.bookings.title')}
            <Badge variant="outline">
              {upcomingBookings.length} {t('portal.badges.upcoming')}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {sortedDates.map(dateKey => {
        const bookings = bookingsByDate[dateKey];
        const date = new Date(dateKey + 'T00:00:00+08:00');
        const sortedBookings = bookings.sort((a, b) => a.hour24 - b.hour24);

        return (
          <Card key={dateKey}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {getDateLabel(date)}
                <div className="text-sm font-normal text-muted-foreground">
                  {format(date, 'MMMM dd, yyyy', { locale: language === 'zh' ? zhCN : enUS })}
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
                              {getSessionName(booking.sessionName)}
                            </h4>
                          </div>
                          
                          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 gap-4'} text-sm text-muted-foreground`}>
                            <div className="flex items-center gap-2">
                              <Clock className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                               <span className={isMobile ? 'text-base' : ''}>
                                 {formatTime(booking.hour24, booking.minute)}
                               </span>
                              {(() => {
                                const now = new Date();
                                const threeHoursCutoff = addHours(booking.bookingDate, -3);
                                const isWithinCutoff = now >= threeHoursCutoff;
                                
                                if (isWithinCutoff && !isPast(booking.bookingDate)) {
                                  return (
                                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                      {t('portal.badges.cannotCancel')}
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
                                 {isMobile && t('portal.booking.cancel')}
                              </Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>{t('portal.cancel.title')}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t('portal.cancel.message')} {getSessionName(booking.sessionName)} {getDateLabel(booking.bookingDate)} {formatTime(booking.hour24, booking.minute)}?
                                    <br /><br />
                                    <span className="text-amber-600 text-sm">
                                      {t('portal.cancel.note')}
                                    </span>
                                  </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>{t('portal.cancel.keep')}</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => handleCancelBooking(booking.id, booking.sessionName, booking.bookingDate)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   {t('portal.cancel.confirm')}
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