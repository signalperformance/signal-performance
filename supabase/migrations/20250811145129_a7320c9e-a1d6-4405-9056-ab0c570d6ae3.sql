-- Security hardening: role-based access and RLS tightening for waitlist_entries

-- 1) Create app_role enum (idempotent)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Create user_roles table (idempotent)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3) Create helper function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 4) Tighten RLS on waitlist_entries: remove public SELECT and allow only admins to SELECT/UPDATE/DELETE
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing related policies if they exist to avoid duplicates
DROP POLICY IF EXISTS "Anyone can view waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Admins can view waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Admins can update waitlist entries" ON public.waitlist_entries;
DROP POLICY IF EXISTS "Admins can delete waitlist entries" ON public.waitlist_entries;

-- Admin-only access for read and modifications
CREATE POLICY "Admins can view waitlist entries"
ON public.waitlist_entries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update waitlist entries"
ON public.waitlist_entries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete waitlist entries"
ON public.waitlist_entries
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Note: We intentionally keep the existing INSERT policy that allows public submissions
-- ("Anyone can submit waitlist entries") to preserve current behavior. If you'd like to
-- require auth or add rate limiting, let me know and I can add that as well.
