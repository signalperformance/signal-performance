-- Clean up orphaned bookings that don't match live instances
DELETE FROM public.bookings 
WHERE schedule_entry_id NOT IN (
  SELECT id FROM public.live_schedule_instances
);

-- Validate the foreign key constraint now that orphaned data is cleaned
ALTER TABLE public.bookings VALIDATE CONSTRAINT bookings_schedule_entry_id_fkey;