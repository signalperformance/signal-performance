-- Create user_attendance table to track session attendance
CREATE TABLE public.user_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,
  live_schedule_instance_id UUID NOT NULL,
  attended BOOLEAN DEFAULT NULL, -- NULL = not marked, TRUE = attended, FALSE = no-show
  marked_by_admin_id UUID,
  marked_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id) -- One attendance record per booking
);

-- Enable Row Level Security
ALTER TABLE public.user_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for user_attendance
CREATE POLICY "Admins can manage attendance records" 
ON public.user_attendance 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_users au 
  WHERE au.email = auth.email()
));

CREATE POLICY "Users can view their own attendance" 
ON public.user_attendance 
FOR SELECT 
USING (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_attendance_updated_at
BEFORE UPDATE ON public.user_attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();