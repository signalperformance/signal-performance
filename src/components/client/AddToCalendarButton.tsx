import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAddToCalendar = (service: CalendarService) => {
    try {
      addToCalendar(booking, service);
      
      if (service === 'ics' || service === 'apple') {
        toast({
          title: t('client.calendar.success'),
          description: t('client.calendar.successMessage'),
        });
      } else {
        toast({
          title: t('client.calendar.success'),
          description: t('client.calendar.successMessage'),
        });
      }
    } catch (error) {
      toast({
        title: t('client.calendar.error'),
        description: t('client.calendar.errorMessage'),
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Calendar className="h-4 w-4 mr-2" />
          {t('client.calendar.addToCalendar')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAddToCalendar('google')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('client.calendar.googleCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('outlook')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          {t('client.calendar.outlookCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('apple')}>
          <Download className="h-4 w-4 mr-2" />
          {t('client.calendar.appleCalendar')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('ics')}>
          <Download className="h-4 w-4 mr-2" />
          {t('client.calendar.downloadICS')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};