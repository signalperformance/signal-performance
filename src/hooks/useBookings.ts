import { useState, useEffect } from 'react';
import { Booking, ScheduleWithAvailability } from '@/types/client';
import { mockBookings, SESSION_CONFIG } from '@/data/mockClientData';
import { scheduleData } from '@/data/scheduleData';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage or use mock data
    const savedBookings = localStorage.getItem('client-bookings');
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings);
      setBookings(parsed.map((b: any) => ({
        ...b,
        bookingDate: new Date(b.bookingDate),
        createdAt: new Date(b.createdAt),
        // Ensure classDate and startTime exist (for backward compatibility)
        classDate: b.classDate || format(new Date(b.bookingDate), 'yyyy-MM-dd'),
        startTime: b.startTime || `${b.hour24?.toString().padStart(2, '0') || '00'}:${b.minute?.toString().padStart(2, '0') || '00'}:00`,
      })));
    } else {
      setBookings(mockBookings);
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('client-bookings', JSON.stringify(newBookings));
  };

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getUpcomingBookings = (userId: string): Booking[] => {
    const now = new Date();
    return getUserBookings(userId).filter(booking => booking.bookingDate >= now);
  };

  const getScheduleWithAvailability = (): ScheduleWithAvailability[] => {
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const scheduleWithDates: ScheduleWithAvailability[] = [];

    // Generate schedule for current week and next week (14 days)
    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = addDays(startOfThisWeek, weekOffset * 7 + dayOffset);
        const dayKey = format(currentDate, 'EEEE').toLowerCase() as any;

        // Find sessions for this day
        const daySessions = scheduleData.filter(session => session.dayKey === dayKey);

        daySessions.forEach((session, index) => {
          const sessionId = `${dayKey}-${session.hour24}-${weekOffset}-${dayOffset}`;
          
          // Count current bookings for this session on this date
          const currentBookings = bookings.filter(booking => 
            booking.dayKey === dayKey &&
            booking.hour24 === session.hour24 &&
            isSameDay(booking.bookingDate, currentDate)
          ).length;

          scheduleWithDates.push({
            id: sessionId,
            dayKey: session.dayKey,
            hour24: session.hour24,
            minute: 0, // Default to 0 for mock data
            name: session.name,
            sessionType: session.sessionType,
            maxParticipants: SESSION_CONFIG.maxParticipants[session.sessionType],
            currentBookings,
            date: currentDate,
          });
        });
      }
    }

    return scheduleWithDates;
  };

  const bookSession = (scheduleEntry: ScheduleWithAvailability, userId: string): boolean => {
    // Check if user already booked this session
    const existingBooking = bookings.find(booking =>
      booking.userId === userId &&
      booking.dayKey === scheduleEntry.dayKey &&
      booking.hour24 === scheduleEntry.hour24 &&
      isSameDay(booking.bookingDate, scheduleEntry.date)
    );

    if (existingBooking) {
      return false; // Already booked
    }

    // Check if session is full
    if (scheduleEntry.currentBookings >= scheduleEntry.maxParticipants) {
      return false; // Session full
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      scheduleEntryId: scheduleEntry.id,
      dayKey: scheduleEntry.dayKey,
      hour24: scheduleEntry.hour24,
      minute: scheduleEntry.minute,
      sessionName: scheduleEntry.name,
      sessionType: scheduleEntry.sessionType,
      bookingDate: scheduleEntry.date,
      createdAt: new Date(),
      // Generate raw date/time strings for calendar export
      classDate: format(scheduleEntry.date, 'yyyy-MM-dd'),
      startTime: `${scheduleEntry.hour24.toString().padStart(2, '0')}:${scheduleEntry.minute.toString().padStart(2, '0')}:00`,
    };

    saveBookings([...bookings, newBooking]);
    return true;
  };

  const cancelBooking = (bookingId: string): boolean => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    saveBookings(updatedBookings);
    return true;
  };

  return {
    bookings,
    getUserBookings,
    getUpcomingBookings,
    getScheduleWithAvailability,
    bookSession,
    cancelBooking,
  };
};