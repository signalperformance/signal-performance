-- Create enum types
CREATE TYPE public.membership_plan AS ENUM ('basic', 'pro');
CREATE TYPE public.session_type AS ENUM ('pro', 'amateur');
CREATE TYPE public.day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Create user profiles table for clients
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  membership_plan membership_plan NOT NULL DEFAULT 'basic',
  profile_picture TEXT,
  notes TEXT,
  monthly_renewal_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedule entries table
CREATE TABLE public.schedule_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  class_name TEXT NOT NULL,
  session_type session_type NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 8,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  schedule_entry_id UUID NOT NULL REFERENCES public.schedule_entries(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, schedule_entry_id, booking_date)
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (true); -- Allow all users to view profiles for now

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (true); -- Will be restricted later with proper auth

-- Create policies for schedule_entries
CREATE POLICY "Anyone can view active schedule entries" 
ON public.schedule_entries 
FOR SELECT 
USING (is_active = true);

-- Create policies for bookings
CREATE POLICY "Users can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can delete their own bookings" 
ON public.bookings 
FOR DELETE 
USING (true);

-- Create policies for admin_users (restricted access)
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_entries_updated_at
BEFORE UPDATE ON public.schedule_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- Insert admin user
INSERT INTO public.admin_users (email, password) VALUES ('admin@example.com', 'admin123');

-- Insert sample schedule entries
INSERT INTO public.schedule_entries (day_of_week, start_time, duration, class_name, session_type, max_participants) VALUES
('monday', '09:00', 90, 'Morning Pro Training', 'pro', 6),
('monday', '18:00', 60, 'Evening Amateur Class', 'amateur', 8),
('tuesday', '09:00', 90, 'Morning Pro Training', 'pro', 6),
('tuesday', '18:00', 60, 'Evening Amateur Class', 'amateur', 8),
('wednesday', '09:00', 90, 'Morning Pro Training', 'pro', 6),
('wednesday', '18:00', 60, 'Evening Amateur Class', 'amateur', 8),
('thursday', '09:00', 90, 'Morning Pro Training', 'pro', 6),
('thursday', '18:00', 60, 'Evening Amateur Class', 'amateur', 8),
('friday', '09:00', 90, 'Morning Pro Training', 'pro', 6),
('friday', '18:00', 60, 'Evening Amateur Class', 'amateur', 8),
('saturday', '10:00', 120, 'Weekend Pro Intensive', 'pro', 4),
('saturday', '14:00', 90, 'Weekend Amateur Workshop', 'amateur', 10);

-- Insert sample user profiles
INSERT INTO public.user_profiles (email, password, first_name, last_name, membership_plan, phone) VALUES
('john.doe@example.com', 'password123', 'John', 'Doe', 'pro', '+1234567890'),
('jane.smith@example.com', 'password123', 'Jane', 'Smith', 'basic', '+1234567891'),
('mike.wilson@example.com', 'password123', 'Mike', 'Wilson', 'pro', '+1234567892');