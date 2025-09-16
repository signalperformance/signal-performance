import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { addToCalendar, type CalendarService } from '@/lib/calendar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Booking {
  id: string;
  sessionName: string;
  sessionType: 'pro' | 'amateur';
  bookingDate: Date;
  hour24: number;
}

interface AddToCalendarButtonProps {
  booking: Booking;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  booking,
  variant = 'outline',
  size = 'sm',
  className
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get translated session name using the standard translation pattern
  const getSessionName = (sessionName: string): string => {
    const translationKey = `portal.sessionNames.${sessionName}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : sessionName;
  };

  const handleAddToCalendar = (service: CalendarService) => {
    try {
      const translatedSessionName = getSessionName(booking.sessionName);
      const calendarTitle = t('portal.calendar.eventTitle');
      addToCalendar(booking, service, translatedSessionName, calendarTitle);
      
      if (service === 'ics' || service === 'apple') {
        toast({
          title: t('portal.calendar.downloaded'),
          description: t('portal.calendar.downloadedDesc'),
        });
      } else {
        const serviceName = service === 'google' ? 'Google' : 'Outlook';
        toast({
          title: t('portal.calendar.opening'),
          description: `${t('portal.calendar.opening')} ${serviceName} Calendar`,
        });
      }
    } catch (error) {
      toast({
        title: t('portal.calendar.error'),
        description: t('portal.calendar.errorDesc'),
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Calendar className="h-4 w-4 mr-2" />
          {t('portal.calendar.title')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAddToCalendar('google')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('portal.calendar.google')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('outlook')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('portal.calendar.outlook')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('apple')}>
          <Download className="h-4 w-4 mr-2" />
          {t('portal.calendar.apple')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('ics')}>
          <Download className="h-4 w-4 mr-2" />
          {t('portal.calendar.download')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};