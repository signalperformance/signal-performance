import React from 'react';
import { ScheduleWithAvailability } from '@/types/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { useSessionLimits } from '@/hooks/useSessionLimits';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingModalProps {
  session: ScheduleWithAvailability | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBooked: boolean;
  canBook: boolean;
  userPlayerType: 'amateur' | 'pro';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  session,
  isOpen,
  onClose,
  onConfirm,
  isBooked,
  canBook,
  userPlayerType,
}) => {
  const { canBookSession, getSessionLimitMessage } = useSessionLimits();
  const { t, language } = useLanguage();
  
  if (!session) return null;

  const isFull = session.currentBookings >= session.maxParticipants;
  const spotsLeft = session.maxParticipants - session.currentBookings;
  const sessionLimitMessage = getSessionLimitMessage();
  
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

  const isDateBookable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const twoWeeksFromToday = new Date(today);
    twoWeeksFromToday.setDate(today.getDate() + 14);
    
    return checkDate >= today && checkDate <= twoWeeksFromToday;
  };

  const canUserBook = () => {
    if (isBooked) return true; // Can cancel
    if (isFull) return false;
    if (session.sessionType !== userPlayerType) return false;
    if (!isDateBookable(session.date)) return false;
    if (!canBookSession()) return false; // Check session limits
    return canBook;
  };

  const getSessionName = (sessionName: string) => {
    const translationKey = `portal.sessionNames.${sessionName}`;
    return t(translationKey) !== translationKey ? t(translationKey) : sessionName;
  };

  const getBookingMessage = () => {
    if (isBooked) return null;
    if (isFull) return t('portal.validation.sessionFull');
    if (!isDateBookable(session.date)) return t('portal.validation.tooFarAdvance');
    if (session.sessionType !== userPlayerType) {
      return `Only ${session.sessionType.toUpperCase()} players can book this session`;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {getSessionName(session.name)}
          </DialogTitle>
          <DialogDescription>
            {isBooked ? t('portal.modal.sessionDetails') : t('portal.modal.confirm')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(session.date, 'EEEE, MMM dd', { locale: language === 'zh' ? zhCN : enUS })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatTime(session.hour24)}</span>
            </div>
          </div>

          <Separator />


          {getBookingMessage() && (
            <div className="bg-muted border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                {getBookingMessage()}
              </p>
            </div>
          )}

          {isBooked && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ {t('portal.badges.booked')}
              </p>
            </div>
          )}

          {sessionLimitMessage && !isBooked && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                {sessionLimitMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('portal.modal.close')}
            </Button>
            {!isBooked && (
              <Button
                onClick={onConfirm}
                disabled={!canUserBook()}
                variant="default"
                className="flex-1"
              >
                {t('portal.booking.book')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};