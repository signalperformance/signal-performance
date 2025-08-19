-- Secure bookings table: restrict to owners and allow admins full access
-- Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive existing policies
DROP POLICY IF EXISTS "Users can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

-- Admins can manage all bookings
CREATE POLICY "Admins can manage bookings"
ON public.bookings
FOR ALL
USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()));

-- Users: least-privilege access
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookings"
ON public.bookings
FOR DELETE
USING (user_id = auth.uid());