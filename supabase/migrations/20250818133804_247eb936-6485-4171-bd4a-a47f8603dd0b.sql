-- Add missing foreign key constraint between bookings and user_profiles
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.user_profiles (id)
  ON DELETE CASCADE;