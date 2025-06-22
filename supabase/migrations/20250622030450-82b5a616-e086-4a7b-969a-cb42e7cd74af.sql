
-- Create appointments table to store booking details
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  timezone TEXT DEFAULT 'Asia/Taipei',
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  google_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create available_time_slots table for scheduling configuration
CREATE TABLE public.available_time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert appointments (public booking)
CREATE POLICY "Anyone can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows reading appointments (for admin/owner)
CREATE POLICY "Admin can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

-- Add RLS for available_time_slots table
ALTER TABLE public.available_time_slots ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read available time slots
CREATE POLICY "Anyone can view available time slots" 
  ON public.available_time_slots 
  FOR SELECT 
  USING (true);

-- Insert default available time slots (weekdays 9 AM to 6 PM)
INSERT INTO public.available_time_slots (day_of_week, start_time, end_time) VALUES
  (1, '09:00:00', '18:00:00'), -- Monday
  (2, '09:00:00', '18:00:00'), -- Tuesday
  (3, '09:00:00', '18:00:00'), -- Wednesday
  (4, '09:00:00', '18:00:00'), -- Thursday
  (5, '09:00:00', '18:00:00'); -- Friday
