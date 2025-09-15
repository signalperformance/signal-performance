-- Add explicit security policies to deny anonymous access to user_profiles table
-- This prevents potential unauthorized access to sensitive personal information

-- Policy to explicitly deny anonymous SELECT access to user_profiles
CREATE POLICY "Deny anonymous access to user profiles"
ON public.user_profiles
FOR SELECT
TO anon
USING (false);

-- Policy to explicitly deny anonymous INSERT access to user_profiles  
CREATE POLICY "Deny anonymous insert to user profiles"
ON public.user_profiles
FOR INSERT
TO anon
WITH CHECK (false);

-- Policy to explicitly deny anonymous UPDATE access to user_profiles
CREATE POLICY "Deny anonymous updates to user profiles" 
ON public.user_profiles
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

-- Policy to explicitly deny anonymous DELETE access to user_profiles
CREATE POLICY "Deny anonymous deletes from user profiles"
ON public.user_profiles
FOR DELETE  
TO anon
USING (false);