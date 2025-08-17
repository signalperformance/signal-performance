-- Ensure 'pro' exists and update plans to only Basic and Pro
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t WHERE t.typname = 'membership_plan_type'
  ) THEN
    -- If the enum doesn't exist, create it with basic and pro
    CREATE TYPE public.membership_plan_type AS ENUM ('basic','pro');
  END IF;
END $$;

-- Add 'pro' to enum if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'membership_plan_type' AND e.enumlabel = 'pro'
  ) THEN
    ALTER TYPE public.membership_plan_type ADD VALUE 'pro';
  END IF;
END $$;

-- Update existing plans: convert 'premium' and 'elite' to 'pro'
UPDATE public.membership_plans
SET type = 'pro'::public.membership_plan_type,
    name = 'Pro'
WHERE type::text IN ('premium', 'elite');

-- Optionally remove extra rows of previous 'elite' plans to keep only one Pro plan
-- Keep the lowest priced 'pro' plan and remove any duplicates
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY type ORDER BY monthly_price NULLS LAST) AS rn
  FROM public.membership_plans
  WHERE type::text = 'pro'
)
DELETE FROM public.membership_plans mp
USING ranked r
WHERE mp.id = r.id AND r.rn > 1;

-- Normalize basic plan name
UPDATE public.membership_plans
SET name = 'Basic'
WHERE type::text = 'basic';
