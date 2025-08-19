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
import { Separator } from '@/components/ui/separator';
import { useSessionLimits } from '@/hooks/useSessionLimits';

interface BookingModalProps {
  session: ScheduleWithAvailability | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBooked: boolean;
  canBook: boolean;
  userMembershipPlan: 'basic' | 'pro';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  session,
  isOpen,
  onClose,
  onConfirm,
  isBooked,
  canBook,
  userMembershipPlan,
}) => {
  const { canBookSession, getSessionLimitMessage } = useSessionLimits();
  
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

  const canUserBook = () => {
    if (isBooked) return true; // Can cancel
    if (isFull) return false;
    if (session.sessionType === 'pro' && userMembershipPlan === 'basic') return false;
    if (!canBookSession()) return false; // Check session limits
    return canBook;
  };

  const getBookingMessage = () => {
    if (isBooked) return null;
    if (isFull) return "This session is currently full.";
    if (session.sessionType === 'pro' && userMembershipPlan === 'basic') {
      return "Pro sessions are only available to Pro members. Upgrade your membership to access this session.";
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {session.name}
          </DialogTitle>
          <DialogDescription>
            {isBooked ? 'Manage your booking' : 'Book this training session'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(session.date, 'EEEE, MMM dd')}
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
                ✅ You are booked for this session
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
              Close
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!canUserBook()}
              variant={isBooked ? "destructive" : "default"}
              className="flex-1"
            >
              {isBooked ? 'Cancel Booking' : 'Book Session'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};