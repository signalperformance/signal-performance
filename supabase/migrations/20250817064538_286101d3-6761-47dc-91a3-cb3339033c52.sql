-- Create enum for membership plan types
CREATE TYPE public.membership_plan_type AS ENUM ('basic', 'premium', 'elite');

-- Create enum for class types
CREATE TYPE public.class_type AS ENUM ('mobility', 'strength', 'conditioning', 'recovery');

-- Create enum for session levels
CREATE TYPE public.session_level AS ENUM ('pro', 'amateur');

-- Create enum for weekdays
CREATE TYPE public.weekday AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Create clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    handicap TEXT,
    goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create membership plans table
CREATE TABLE public.membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type membership_plan_type NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.membership_plans(id) ON DELETE RESTRICT NOT NULL,
    start_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create weekly class templates table
CREATE TABLE public.weekly_class_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week weekday NOT NULL,
    start_time TIME NOT NULL,
    class_type class_type NOT NULL,
    session_level session_level NOT NULL,
    slots_available INTEGER NOT NULL DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (day_of_week, start_time)
);

-- Create one-on-one slots table
CREATE TABLE public.one_on_one_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week weekday NOT NULL,
    start_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (day_of_week, start_time)
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_class_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_on_one_slots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admins can manage clients" ON public.clients
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage membership plans" ON public.membership_plans
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage memberships" ON public.memberships
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage weekly class templates" ON public.weekly_class_templates
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage one-on-one slots" ON public.one_on_one_slots
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_membership_plans_updated_at
    BEFORE UPDATE ON public.membership_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_class_templates_updated_at
    BEFORE UPDATE ON public.weekly_class_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_one_on_one_slots_updated_at
    BEFORE UPDATE ON public.one_on_one_slots
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default membership plans
INSERT INTO public.membership_plans (name, type, monthly_price, description) VALUES
    ('Basic Plan', 'basic', 199.00, 'Access to group classes and basic amenities'),
    ('Premium Plan', 'premium', 299.00, 'Includes group classes, 1-on-1 sessions, and premium amenities'),
    ('Elite Plan', 'elite', 499.00, 'Full access to all services, unlimited 1-on-1 sessions, and VIP amenities');