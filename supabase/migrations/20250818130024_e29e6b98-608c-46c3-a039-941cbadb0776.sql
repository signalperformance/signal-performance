-- Update bookings table to support both old schedule_entries and new live_schedule_instances
-- Add foreign key to live_schedule_instances (making schedule_entry_id nullable temporarily)
ALTER TABLE public.bookings 
ALTER COLUMN schedule_entry_id DROP NOT NULL;

-- Add foreign key constraint to live_schedule_instances
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_live_schedule_instances 
FOREIGN KEY (schedule_entry_id) REFERENCES public.live_schedule_instances(id);

-- Create index for better performance
CREATE INDEX idx_bookings_schedule_entry_id ON public.bookings(schedule_entry_id);