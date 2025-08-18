-- Link bookings to live schedule instances for proper joins in PostgREST
-- 1) Ensure the schedule_entry_id column is uuid (it already is) and indexed
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_entry_id ON public.bookings (schedule_entry_id);

-- 2) Add a foreign key from bookings.schedule_entry_id to live_schedule_instances.id
-- Use NOT VALID to avoid failing if legacy rows exist; we'll validate/fix later
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_schedule_entry_id_fkey
  FOREIGN KEY (schedule_entry_id)
  REFERENCES public.live_schedule_instances (id)
  ON DELETE CASCADE
  NOT VALID;
