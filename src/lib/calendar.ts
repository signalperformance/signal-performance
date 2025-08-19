import { format, addHours } from 'date-fns';

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
}

export interface Booking {
  id: string;
  sessionName: string;
  sessionType: 'pro' | 'amateur';
  bookingDate: Date;
  hour24: number;
}

// Convert booking to calendar event
export const bookingToCalendarEvent = (booking: Booking): CalendarEvent => {
  const startDate = new Date(booking.bookingDate);
  startDate.setHours(booking.hour24, 0, 0, 0);
  const endDate = addHours(startDate, 1); // Assume 1-hour sessions

  return {
    title: `${booking.sessionName} (${booking.sessionType.toUpperCase()})`,
    startDate,
    endDate,
    description: `Tennis session: ${booking.sessionName}\nSession Type: ${booking.sessionType.toUpperCase()}\n\nReminder: Sessions cannot be cancelled within 3 hours of start time.`,
    location: 'Tennis Studio' // Can be made configurable
  };
};

// Format date for ICS file
const formatICSDate = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

// Generate ICS file content
export const generateICS = (event: CalendarEvent): string => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tennis Studio//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@tennis-studio.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  return icsContent;
};

// Download ICS file
export const downloadICS = (event: CalendarEvent): void => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `tennis-session-${format(event.startDate, 'yyyy-MM-dd-HH-mm')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Generate Google Calendar URL
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const startDate = formatICSDate(event.startDate);
  const endDate = formatICSDate(event.endDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || '',
    location: event.location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Generate Apple Calendar URL (same as ICS download)
export const generateAppleCalendarUrl = (event: CalendarEvent): string => {
  // Apple Calendar uses webcal:// protocol with ICS files
  // For web implementation, we'll trigger download instead
  return 'download-ics';
};

// Generate Outlook Calendar URL
export const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const startDate = event.startDate.toISOString();
  const endDate = event.endDate.toISOString();
  
  const params = new URLSearchParams({
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: event.description || '',
    location: event.location || ''
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

export type CalendarService = 'google' | 'apple' | 'outlook' | 'ics';

export const addToCalendar = (booking: Booking, service: CalendarService): void => {
  const event = bookingToCalendarEvent(booking);
  
  switch (service) {
    case 'google':
      window.open(generateGoogleCalendarUrl(event), '_blank');
      break;
    case 'apple':
    case 'ics':
      downloadICS(event);
      break;
    case 'outlook':
      window.open(generateOutlookCalendarUrl(event), '_blank');
      break;
  }
};