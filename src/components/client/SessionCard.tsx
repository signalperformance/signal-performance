import React from 'react';
import { ScheduleWithAvailability } from '@/types/client';
import { useLanguage } from '@/contexts/LanguageContext';
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
  isMobile?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isBooked = false,
  canBook = true,
  onBook,
  className,
  isMobile = false,
}) => {
  const { t } = useLanguage();
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
        isMobile && "touch-manipulation",
        className
      )}
    >
      <CardContent className={isMobile ? "p-6" : "p-4"}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} text-muted-foreground`} />
            <span className={`font-medium ${isMobile ? 'text-lg' : ''}`}>
              {formatTime(session.hour24)}
            </span>
          </div>
          
          <div className="flex gap-2">
            {spotsLeft <= 3 && spotsLeft > 0 && (
              <Badge variant="outline" className={isMobile ? "text-sm px-3 py-1" : "text-xs"}>
                {spotsLeft} {t('client.session.spotsLeft')}
              </Badge>
            )}
            
            {isFull && (
              <Badge variant="destructive" className={isMobile ? "text-sm px-3 py-1" : "text-xs"}>
                {t('client.session.full')}
              </Badge>
            )}
          </div>
        </div>

        <h4 className={`font-semibold mb-4 ${isMobile ? 'text-xl' : 'text-lg'}`}>
          {session.name}
        </h4>

        <Button 
          onClick={isBooked ? undefined : onBook}
          disabled={isBooked || !canBook || (isFull && !isBooked)}
          variant={isBooked ? "outline" : "default"}
          className="w-full"
          size={isMobile ? "lg" : "sm"}
        >
          {isBooked ? t('client.session.booked') : isFull ? t('client.session.full') : t('client.session.bookSession')}
        </Button>
      </CardContent>
    </Card>
  );
};