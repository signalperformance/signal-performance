-- Drop the existing SELECT policy for waitlist_entries
DROP POLICY IF EXISTS "Admins can view waitlist entries" ON public.waitlist_entries;

-- Create a more explicit SELECT policy that ensures only authenticated admin users can access the data
CREATE POLICY "Only authenticated admins can view waitlist entries" 
ON public.waitlist_entries 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled (it should already be, but let's be explicit)
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;