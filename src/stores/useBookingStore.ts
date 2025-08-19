import { create } from 'zustand';
import { Booking, ScheduleWithAvailability } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { addDays, startOfWeek, format, isSameDay, addHours } from 'date-fns';

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
          live_schedule_instances!inner(
            class_date,
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
        dayKey: new Date(b.live_schedule_instances.class_date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
        hour24: parseInt(b.live_schedule_instances.start_time.split(':')[0]),
        sessionName: b.live_schedule_instances.class_name,
        sessionType: b.live_schedule_instances.session_type,
        bookingDate: new Date(`${b.live_schedule_instances.class_date}T${b.live_schedule_instances.start_time}`),
        createdAt: new Date(b.created_at),
      })) || [];

      set({ bookings });
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  },

  loadSchedule: async () => {
    try {
      // Load live schedule instances for the next 2 weeks
      const today = new Date();
      const twoWeeksFromNow = new Date(today);
      twoWeeksFromNow.setDate(today.getDate() + 14);

      const { data, error } = await supabase
        .from('live_schedule_instances')
        .select('*')
        .eq('is_cancelled', false)
        .gte('class_date', today.toISOString().split('T')[0])
        .lte('class_date', twoWeeksFromNow.toISOString().split('T')[0])
        .order('class_date')
        .order('start_time');

      if (error) throw error;
      
      // Filter out sessions that have already passed
      const now = new Date();
      const futureEntries = (data || []).filter(instance => {
        const sessionDateTime = new Date(`${instance.class_date}T${instance.start_time}`);
        return sessionDateTime >= now;
      });
      
      set({ scheduleEntries: futureEntries });
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
    const userBookings = getUserBookings(userId);
    console.log('All user bookings:', userBookings);
    console.log('Current time:', now);
    const upcoming = userBookings.filter(booking => {
      console.log('Checking booking:', booking.bookingDate, 'vs now:', now, 'is upcoming:', booking.bookingDate >= now);
      return booking.bookingDate >= now;
    });
    console.log('Upcoming bookings:', upcoming);
    return upcoming;
  },

  getScheduleWithAvailability: () => {
    const { bookings, scheduleEntries } = get();
    const scheduleWithDates: ScheduleWithAvailability[] = [];
    const now = new Date();

    // Use live schedule instances directly and filter by current time
    scheduleEntries.forEach((instance: any) => {
      const instanceDate = new Date(instance.class_date);
      const sessionDateTime = new Date(`${instance.class_date}T${instance.start_time}`);
      
      // Only include sessions that haven't started yet
      if (sessionDateTime >= now) {
        const dayKey = instanceDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const hour24 = parseInt(instance.start_time.split(':')[0]);
        
        // Count current bookings for this instance
        const currentBookings = bookings.filter(booking => 
          booking.scheduleEntryId === instance.id &&
          isSameDay(booking.bookingDate, instanceDate)
        ).length;

        scheduleWithDates.push({
          id: instance.id,
          dayKey,
          hour24,
          name: instance.class_name,
          sessionType: instance.session_type,
          maxParticipants: instance.max_participants,
          currentBookings,
          date: instanceDate,
          scheduleEntryId: instance.id,
        });
      }
    });

    return scheduleWithDates;
  },

  bookSession: async (scheduleEntry: ScheduleWithAvailability, userId: string) => {
    try {
      const { bookings } = get();
      
      console.log('Booking session:', { 
        scheduleEntryId: scheduleEntry.scheduleEntryId, 
        userId, 
        date: scheduleEntry.date 
      });
      
      // Check if user already booked this session
      const existingBooking = bookings.find(booking =>
        booking.userId === userId &&
        booking.scheduleEntryId === scheduleEntry.scheduleEntryId &&
        isSameDay(booking.bookingDate, scheduleEntry.date)
      );

      if (existingBooking) {
        console.log('User already booked this session');
        return false; // Already booked
      }

      // Check session limits - get user's membership plan from Supabase
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('membership_plan')
        .eq('id', userId)
        .single();

      if (userProfile) {
        const totalSessions = userProfile.membership_plan === 'pro' ? 16 : 12;
        
        // Count user's bookings in current 4-week period
        const now = new Date();
        const fourWeeksAgo = new Date(now.getTime() - (4 * 7 * 24 * 60 * 60 * 1000));
        
        const userBookings = bookings.filter(booking =>
          booking.userId === userId &&
          new Date(booking.bookingDate) >= fourWeeksAgo
        );

        if (userBookings.length >= totalSessions) {
          console.log(`User has reached their ${totalSessions} session limit for this 4-week period`);
          return false;
        }
      }

      // Check if session is full
      if (scheduleEntry.currentBookings >= scheduleEntry.maxParticipants) {
        console.log('Session is full');
        return false; // Session full
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          schedule_entry_id: scheduleEntry.scheduleEntryId,
          booking_date: format(scheduleEntry.date, 'yyyy-MM-dd'),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase booking error:', error);
        throw error;
      }

      console.log('Booking successful:', data);

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
      // Get booking details to check if cancellation is allowed
      const { data: bookingData, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          live_schedule_instances!inner(
            class_date,
            start_time
          )
        `)
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;

      // Check 3-hour cancellation policy
      const sessionDateTime = new Date(`${bookingData.live_schedule_instances.class_date}T${bookingData.live_schedule_instances.start_time}`);
      const now = new Date();
      const threeHoursCutoff = addHours(sessionDateTime, -3);

      if (now >= threeHoursCutoff) {
        console.log('Cancellation not allowed: within 3 hours of session start');
        return false;
      }

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