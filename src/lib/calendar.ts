import { format, addHours } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

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

// Taiwan timezone constant
const TAIWAN_TIMEZONE = 'Asia/Taipei';

// Convert booking to calendar event
export const bookingToCalendarEvent = (booking: Booking): CalendarEvent => {
  // Create date in Taiwan timezone
  const startDate = new Date(booking.bookingDate);
  startDate.setHours(booking.hour24, 0, 0, 0);
  const taiwanStartDate = toZonedTime(startDate, TAIWAN_TIMEZONE);
  const taiwanEndDate = addHours(taiwanStartDate, 1); // Assume 1-hour sessions

  return {
    title: `體能課：${booking.sessionName}`,
    startDate: taiwanStartDate,
    endDate: taiwanEndDate,
    description: '',
    location: '2樓, 南勢里9鄰33-6號, Linkou District, New Taipei City, 244'
  };
};

// Format date for ICS file in Taiwan timezone
const formatICSDate = (date: Date): string => {
  return formatInTimeZone(date, TAIWAN_TIMEZONE, "yyyyMMdd'T'HHmmss");
};

// Generate ICS file content
export const generateICS = (event: CalendarEvent): string => {
  const eventId = `${Date.now()}@tennis-studio.com`;
  const reminderTime = new Date(event.startDate.getTime() - 30 * 60 * 1000); // 30 minutes before
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tennis Studio//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Taipei',
    'BEGIN:STANDARD',
    'DTSTART:19701101T000000',
    'TZOFFSETFROM:+0800',
    'TZOFFSETTO:+0800',
    'TZNAME:CST',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${eventId}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART;TZID=Asia/Taipei:${formatICSDate(event.startDate)}`,
    `DTEND;TZID=Asia/Taipei:${formatICSDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${event.title}`,
    'END:VALARM',
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
  link.download = `體能課-${formatInTimeZone(event.startDate, TAIWAN_TIMEZONE, 'yyyy-MM-dd-HH-mm')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Generate Google Calendar URL
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const startDate = formatInTimeZone(event.startDate, TAIWAN_TIMEZONE, "yyyyMMdd'T'HHmmss");
  const endDate = formatInTimeZone(event.endDate, TAIWAN_TIMEZONE, "yyyyMMdd'T'HHmmss");
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || '',
    location: event.location || '',
    ctz: TAIWAN_TIMEZONE
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
  // Convert Taiwan time to ISO for Outlook
  const startDate = formatInTimeZone(event.startDate, TAIWAN_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const endDate = formatInTimeZone(event.endDate, TAIWAN_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
  
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