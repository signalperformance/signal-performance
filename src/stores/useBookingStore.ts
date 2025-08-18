import { create } from 'zustand';
import { Booking, ScheduleWithAvailability } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';

interface BookingStore {
  bookings: Booking[];
  scheduleEntries: any[];
  loadBookings: () => Promise<void>;
  loadSchedule: () => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  getUpcomingBookings: (userId: string) => Booking[];
  getScheduleWithAvailability: () => ScheduleWithAvailability[];
  bookSession: (scheduleEntry: ScheduleWithAvailability, userId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  scheduleEntries: [],

  loadBookings: async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          schedule_entry_id,
          booking_date,
          created_at,
          schedule_entries!inner(
            day_of_week,
            start_time,
            class_name,
            session_type
          )
        `);

      if (error) throw error;

      const bookings: Booking[] = data?.map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        scheduleEntryId: b.schedule_entry_id,
        dayKey: b.schedule_entries.day_of_week,
        hour24: parseInt(b.schedule_entries.start_time.split(':')[0]),
        sessionName: b.schedule_entries.class_name,
        sessionType: b.schedule_entries.session_type,
        bookingDate: new Date(b.booking_date),
        createdAt: new Date(b.created_at),
      })) || [];

      set({ bookings });
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  },

  loadSchedule: async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      set({ scheduleEntries: data || [] });
    } catch (error) {
      console.error('Failed to load schedule:', error);
    }
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
    const { bookings, scheduleEntries } = get();
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const scheduleWithDates: ScheduleWithAvailability[] = [];

    // Generate schedule for current week and next week (14 days)
    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = addDays(startOfThisWeek, weekOffset * 7 + dayOffset);
        const dayKey = format(currentDate, 'EEEE').toLowerCase();

        // Find sessions for this day
        const daySessions = scheduleEntries.filter(session => session.day_of_week === dayKey);

        daySessions.forEach((session) => {
          const sessionId = `${dayKey}-${session.start_time}-${weekOffset}-${dayOffset}`;
          const hour24 = parseInt(session.start_time.split(':')[0]);
          
          // Count current bookings for this session on this date
          const currentBookings = bookings.filter(booking => 
            booking.scheduleEntryId === session.id &&
            isSameDay(booking.bookingDate, currentDate)
          ).length;

          scheduleWithDates.push({
            id: sessionId,
            dayKey: session.day_of_week,
            hour24,
            name: session.class_name,
            sessionType: session.session_type,
            maxParticipants: session.max_participants,
            currentBookings,
            date: currentDate,
            scheduleEntryId: session.id,
          });
        });
      }
    }

    return scheduleWithDates;
  },

  bookSession: async (scheduleEntry: ScheduleWithAvailability, userId: string) => {
    try {
      const { bookings } = get();
      
      // Check if user already booked this session
      const existingBooking = bookings.find(booking =>
        booking.userId === userId &&
        booking.scheduleEntryId === (scheduleEntry as any).scheduleEntryId &&
        isSameDay(booking.bookingDate, scheduleEntry.date)
      );

      if (existingBooking) {
        return false; // Already booked
      }

      // Check if session is full
      if (scheduleEntry.currentBookings >= scheduleEntry.maxParticipants) {
        return false; // Session full
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          schedule_entry_id: (scheduleEntry as any).scheduleEntryId,
          booking_date: format(scheduleEntry.date, 'yyyy-MM-dd'),
        })
        .select()
        .single();

      if (error) throw error;

      // Reload bookings to update state
      await get().loadBookings();
      return true;
    } catch (error) {
      console.error('Failed to book session:', error);
      return false;
    }
  },

  cancelBooking: async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // Reload bookings to update state
      await get().loadBookings();
      return true;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return false;
    }
  },
}));