import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ClientScheduleView: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Helper function to get translated day names
  const getDayName = (dayIndex: number) => {
    if (language === 'zh') {
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      return dayNames[dayIndex];
    }
    return format(new Date(2023, 0, dayIndex + 1), 'EEE'); // Use a reference date for consistent formatting
  };
  const { 
    getScheduleWithAvailability, 
    bookSession, 
    cancelBooking, 
    getUserBookings, 
    loadBookings, 
    loadSchedule 
  } = useBookingStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const isDateBookable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14);
    
    return checkDate >= today && checkDate <= twoWeeksFromToday;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
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
    if (!isDateBookable(session.date)) return false;
    return true;
  };

  const handleSessionClick = (session: ScheduleWithAvailability) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleBookingConfirm = async () => {
    if (!selectedSession || !user) return;

    // Only handle booking, not cancellation
    const success = await bookSession(selectedSession, user.id);
    if (success) {
      toast({
        title: t('client.booking.success'),
        description: t('client.booking.successMessage'),
      });
    } else {
      toast({
        title: t('client.booking.error'),
        description: t('client.booking.errorMessage'),
        variant: "destructive",
      });
    }

    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const weekDays = getWeekDays();
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Set default selected day to today (or first available day)
  const defaultDay = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // For current week, prefer today if it's available
    if (weekOffset === 0) {
      const weekDayStrs = weekDays.map(day => format(day, 'yyyy-MM-dd'));
      if (weekDayStrs.includes(todayStr)) {
        return todayStr;
      }
    }
    
    // Find first bookable day with sessions, or just first bookable day
    for (const day of weekDays) {
      if (isDateBookable(day)) {
        const sessions = getSessionsForDay(day);
        if (sessions.length > 0) {
          return format(day, 'yyyy-MM-dd');
        }
      }
    }
    
    // Fallback to first bookable day, or first day if all are unbookable
    const firstBookableDay = weekDays.find(day => isDateBookable(day));
    return firstBookableDay ? format(firstBookableDay, 'yyyy-MM-dd') : 
           (weekDays.length > 0 ? format(weekDays[0], 'yyyy-MM-dd') : '');
  }, [weekDays, scheduleWithAvailability, weekOffset]);

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
            <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
              {t('client.schedule.title')}
              {!isMobile && (
                <Badge variant="outline">
                  {language === 'zh' ? 
                    `${format(weekStart, 'M月dd日', { locale: zhCN })} - ${format(weekEnd, 'M月dd日, yyyy年', { locale: zhCN })}` :
                    `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
                  }
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                disabled={weekOffset === 0}
                className={isMobile ? "px-3" : ""}
              >
                <ChevronLeft className="h-4 w-4" />
                {!isMobile && t('client.schedule.previousWeek')}
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                onClick={() => setWeekOffset(weekOffset + 1)}
                disabled={(() => {
                  // Check if next week has any bookable dates
                  const nextWeekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset + 1);
                  const nextWeekDays = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(nextWeekStart);
                    date.setDate(nextWeekStart.getDate() + i);
                    return date;
                  });
                  return !nextWeekDays.some(day => isDateBookable(day));
                })()}
                className={isMobile ? "px-3" : ""}
              >
                {!isMobile && t('client.schedule.nextWeek')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isMobile && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {language === 'zh' ? 
                  `${format(weekStart, 'M月dd日', { locale: zhCN })} - ${format(weekEnd, 'M月dd日, yyyy年', { locale: zhCN })}` :
                  `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
                }
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Day Selection Tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        {isMobile ? (
          <div className="grid grid-cols-7 gap-1 p-1">
            {weekDays.map((date) => {
              const dayStr = format(date, 'yyyy-MM-dd');
              const dayName = getDayName(date.getDay());
              const dateNum = format(date, 'dd');
              const isSelected = selectedDay === dayStr;
              const isPast = isPastDate(date);
              
              return (
                <button
                  key={dayStr}
                  onClick={() => isDateBookable(date) && setSelectedDay(dayStr)}
                  disabled={!isDateBookable(date)}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all min-h-[44px] ${
                    !isDateBookable(date) 
                      ? 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50'
                      : isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-lg font-bold">{dateNum}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-7 h-auto">
            {weekDays.map((date) => {
              const dayStr = format(date, 'yyyy-MM-dd');
              const dayName = getDayName(date.getDay());
              const dateNum = format(date, 'dd');
              const sessions = getSessionsForDay(date);
              const userBookingsCount = sessions.filter(session => isSessionBooked(session)).length;
              const isPast = isPastDate(date);
              
              return (
                <TabsTrigger
                  key={dayStr}
                  value={dayStr}
                  disabled={!isDateBookable(date)}
                  className={`flex flex-col p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                    !isDateBookable(date) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="text-xs font-medium">{dayName}</div>
                  <div className="text-lg font-bold">{dateNum}</div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        )}

        {/* Selected Day Sessions */}
        <TabsContent value={selectedDay} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {language === 'zh' ? 
                    (isMobile ? 
                      format(selectedDate, 'M月dd日', { locale: zhCN }) : 
                      `星期${getDayName(selectedDate.getDay())}, ${format(selectedDate, 'M月dd日', { locale: zhCN })}`
                    ) :
                    (isMobile ? format(selectedDate, 'MMMM dd') : format(selectedDate, 'EEEE, MMMM dd'))
                  }
                  {isToday(selectedDate) && <Badge variant="outline" className="ml-2">{t('client.schedule.today')}</Badge>}
                </span>
                <Badge variant="secondary">
                  {language === 'zh' ? 
                    `${selectedDaySessions.length} 個課程` :
                    `${selectedDaySessions.length} session${selectedDaySessions.length !== 1 ? 's' : ''}`
                  }
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('client.schedule.noSessions')}</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {selectedDaySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isBooked={isSessionBooked(session)}
                      canBook={canUserBookSession(session)}
                      onBook={() => handleSessionClick(session)}
                      isMobile={isMobile}
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