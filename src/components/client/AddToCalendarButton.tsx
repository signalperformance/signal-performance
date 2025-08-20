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

  const handleAddToCalendar = (service: CalendarService) => {
    try {
      addToCalendar(booking, service);
      
      if (service === 'ics' || service === 'apple') {
        toast({
          title: "Calendar file downloaded",
          description: "The calendar event file has been downloaded. Open it to add to your calendar.",
        });
      } else {
        toast({
          title: "Opening calendar",
          description: `Opening ${service === 'google' ? 'Google' : 'Outlook'} Calendar in a new tab.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event to calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Calendar className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAddToCalendar('google')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('outlook')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Outlook Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('apple')}>
          <Download className="h-4 w-4 mr-2" />
          Apple Calendar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAddToCalendar('ics')}>
          <Download className="h-4 w-4 mr-2" />
          Download ICS File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};