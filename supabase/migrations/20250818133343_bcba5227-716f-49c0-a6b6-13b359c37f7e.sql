-- Drop ALL existing foreign key constraints on public.bookings (safety-first for legacy schemas)
DO $$ 
DECLARE 
  r record;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE t.relname = 'bookings'
      AND n.nspname = 'public'
      AND c.contype = 'f'
  LOOP
    EXECUTE format('ALTER TABLE public.bookings DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- Ensure fast lookups on the FK column
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_entry_id 
  ON public.bookings (schedule_entry_id);

-- Add the correct FK to live_schedule_instances
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_schedule_entry_id_fkey
  FOREIGN KEY (schedule_entry_id)
  REFERENCES public.live_schedule_instances (id)
  ON DELETE CASCADE
  NOT VALID;

-- Clean up any legacy/orphaned rows that would violate the FK
DELETE FROM public.bookings 
WHERE schedule_entry_id IS NOT NULL
  AND schedule_entry_id NOT IN (
    SELECT id FROM public.live_schedule_instances
  );

-- Validate now that data is clean
ALTER TABLE public.bookings 
  VALIDATE CONSTRAINT bookings_schedule_entry_id_fkey;