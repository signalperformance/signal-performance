import { create } from 'zustand';
import { Booking, ScheduleWithAvailability } from '@/types/client';
import { mockBookings, SESSION_CONFIG } from '@/data/mockClientData';
import { scheduleData } from '@/data/scheduleData';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';

interface BookingStore {
  bookings: Booking[];
  loadBookings: () => void;
  saveBookings: (bookings: Booking[]) => void;
  getUserBookings: (userId: string) => Booking[];
  getUpcomingBookings: (userId: string) => Booking[];
  getScheduleWithAvailability: () => ScheduleWithAvailability[];
  bookSession: (scheduleEntry: ScheduleWithAvailability, userId: string) => boolean;
  cancelBooking: (bookingId: string) => boolean;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],

  loadBookings: () => {
    const savedBookings = localStorage.getItem('client-bookings');
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings);
      const bookings = parsed.map((b: any) => ({
        ...b,
        bookingDate: new Date(b.bookingDate),
        createdAt: new Date(b.createdAt),
      }));
      set({ bookings });
    } else {
      set({ bookings: mockBookings });
    }
  },

  saveBookings: (newBookings: Booking[]) => {
    set({ bookings: newBookings });
    localStorage.setItem('client-bookings', JSON.stringify(newBookings));
  },

  getUserBookings: (userId: string) => {
    const { bookings } = get();
    return bookings.filter(booking => booking.userId === userId);
  },

  getUpcomingBookings: (userId: string) => {
    const { getUserBookings } = get();
    const now = new Date();
    return getUserBookings(userId).filter(booking => booking.bookingDate >= now);
  },

  getScheduleWithAvailability: () => {
    const { bookings } = get();
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
  },

  bookSession: (scheduleEntry: ScheduleWithAvailability, userId: string) => {
    const { bookings, saveBookings } = get();
    
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
      sessionName: scheduleEntry.name,
      sessionType: scheduleEntry.sessionType,
      bookingDate: scheduleEntry.date,
      createdAt: new Date(),
    };

    saveBookings([...bookings, newBooking]);
    return true;
  },

  cancelBooking: (bookingId: string) => {
    const { bookings, saveBookings } = get();
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    saveBookings(updatedBookings);
    return true;
  },
}));