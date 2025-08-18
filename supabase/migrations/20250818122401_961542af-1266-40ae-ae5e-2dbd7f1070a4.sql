-- Create schedule templates table for reusable weekly patterns
CREATE TABLE public.schedule_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create schedule template entries (the actual classes in a template)
CREATE TABLE public.schedule_template_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.schedule_templates(id) ON DELETE CASCADE,
  day_of_week public.day_of_week NOT NULL,
  start_time time without time zone NOT NULL,
  duration integer NOT NULL,
  class_name text NOT NULL,
  session_type public.session_type NOT NULL,
  max_participants integer NOT NULL DEFAULT 8,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create schedule periods table to assign templates to date ranges
CREATE TABLE public.schedule_periods (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.schedule_templates(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT no_overlapping_periods EXCLUDE USING gist (
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (is_active = true)
);

-- Create live schedule instances table for actual bookable classes
CREATE TABLE public.live_schedule_instances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_entry_id uuid REFERENCES public.schedule_template_entries(id),
  period_id uuid NOT NULL REFERENCES public.schedule_periods(id),
  class_date date NOT NULL,
  start_time time without time zone NOT NULL,
  duration integer NOT NULL,
  class_name text NOT NULL,
  session_type public.session_type NOT NULL,
  max_participants integer NOT NULL DEFAULT 8,
  is_cancelled boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(class_date, start_time, class_name)
);

-- Enable RLS on new tables
ALTER TABLE public.schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_template_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_schedule_instances ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule_templates
CREATE POLICY "Admins can manage schedule templates" ON public.schedule_templates
FOR ALL USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Anyone can view active schedule templates" ON public.schedule_templates
FOR SELECT USING (is_active = true);

-- RLS policies for schedule_template_entries
CREATE POLICY "Admins can manage template entries" ON public.schedule_template_entries
FOR ALL USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Anyone can view template entries" ON public.schedule_template_entries
FOR SELECT USING (EXISTS (SELECT 1 FROM schedule_templates st WHERE st.id = template_id AND st.is_active = true));

-- RLS policies for schedule_periods
CREATE POLICY "Admins can manage schedule periods" ON public.schedule_periods
FOR ALL USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Anyone can view active schedule periods" ON public.schedule_periods
FOR SELECT USING (is_active = true);

-- RLS policies for live_schedule_instances
CREATE POLICY "Admins can manage live schedule instances" ON public.live_schedule_instances
FOR ALL USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Anyone can view active live schedule instances" ON public.live_schedule_instances
FOR SELECT USING (NOT is_cancelled);

-- Add triggers for updated_at
CREATE TRIGGER update_schedule_templates_updated_at
  BEFORE UPDATE ON public.schedule_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_template_entries_updated_at
  BEFORE UPDATE ON public.schedule_template_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_periods_updated_at
  BEFORE UPDATE ON public.schedule_periods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_schedule_instances_updated_at
  BEFORE UPDATE ON public.live_schedule_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a default template from existing schedule_entries
INSERT INTO public.schedule_templates (name, description) 
VALUES ('Default Template', 'Migrated from existing schedule entries');

-- Get the template ID
DO $$
DECLARE
  template_uuid uuid;
BEGIN
  SELECT id INTO template_uuid FROM public.schedule_templates WHERE name = 'Default Template';
  
  -- Copy existing schedule entries to template entries
  INSERT INTO public.schedule_template_entries (
    template_id, day_of_week, start_time, duration, class_name, session_type, max_participants
  )
  SELECT 
    template_uuid, day_of_week, start_time, duration, class_name, session_type, max_participants
  FROM public.schedule_entries 
  WHERE is_active = true;
END $$;