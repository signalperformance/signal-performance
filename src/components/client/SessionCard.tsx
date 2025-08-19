import React from 'react';
import { ScheduleWithAvailability } from '@/types/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: ScheduleWithAvailability;
  isBooked?: boolean;
  canBook?: boolean;
  onBook: () => void;
  className?: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isBooked = false,
  canBook = true,
  onBook,
  className,
}) => {
  const isFull = session.currentBookings >= session.maxParticipants;
  const spotsLeft = session.maxParticipants - session.currentBookings;
  
  const getSessionTypeColor = (sessionType: 'pro' | 'amateur') => {
    return sessionType === 'pro' 
      ? 'bg-signal-gold text-signal-gold-foreground' 
      : 'bg-charcoal text-charcoal-foreground';
  };

  const formatTime = (hour24: number) => {
    const date = new Date();
    date.setHours(hour24, 0, 0, 0);
    return format(date, 'h:mm a');
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isBooked && "ring-2 ring-primary",
        isFull && !isBooked && "opacity-60",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatTime(session.hour24)}</span>
          </div>
          
          {spotsLeft <= 3 && spotsLeft > 0 && (
            <Badge variant="outline" className="text-xs">
              {spotsLeft} left
            </Badge>
          )}
          
          {isFull && (
            <Badge variant="destructive" className="text-xs">
              Full
            </Badge>
          )}
        </div>

        <h4 className="font-semibold text-lg mb-4">{session.name}</h4>

        <Button 
          onClick={onBook}
          disabled={!canBook || (isFull && !isBooked)}
          variant={isBooked ? "outline" : "default"}
          className="w-full"
          size="sm"
        >
          {isBooked ? 'Cancel Booking' : isFull ? 'Full' : 'Book Session'}
        </Button>
      </CardContent>
    </Card>
  );
};