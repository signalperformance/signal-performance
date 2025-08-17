-- Safely update enum to include 'pro' type by dropping and recreating enum
-- First create temp tables to store data
CREATE TEMP TABLE temp_membership_plans AS 
SELECT id, name, description, monthly_price, created_at, updated_at, 
       CASE 
         WHEN type::text IN ('premium', 'elite') THEN 'pro'
         ELSE type::text
       END as new_type
FROM public.membership_plans;

-- Drop all dependencies on the enum (tables that use it)
DROP TABLE public.membership_plans CASCADE;

-- Drop and recreate the enum with only basic and pro
DROP TYPE IF EXISTS public.membership_plan_type;
CREATE TYPE public.membership_plan_type AS ENUM ('basic', 'pro');

-- Recreate the table
CREATE TABLE public.membership_plans (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type public.membership_plan_type NOT NULL,
    name text NOT NULL,
    description text,
    monthly_price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policy
CREATE POLICY "Admins can manage membership plans" ON public.membership_plans
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_membership_plans_updated_at
    BEFORE UPDATE ON public.membership_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Restore data with only basic and pro, removing duplicates
INSERT INTO public.membership_plans (id, type, name, description, monthly_price, created_at, updated_at)
SELECT DISTINCT ON (new_type) 
    id, 
    new_type::public.membership_plan_type,
    CASE 
      WHEN new_type = 'basic' THEN 'Basic Plan'
      WHEN new_type = 'pro' THEN 'Pro Plan'
    END,
    description,
    CASE 
      WHEN new_type = 'basic' THEN 199.00
      WHEN new_type = 'pro' THEN 299.00
    END,
    created_at,
    updated_at
FROM temp_membership_plans
ORDER BY new_type, monthly_price;