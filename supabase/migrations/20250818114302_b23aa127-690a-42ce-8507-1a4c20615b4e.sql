-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

-- Create admin policies (authenticated admins present in admin_users table by email)
CREATE POLICY "Admins can select all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Admins can insert profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Admins can update profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email())) 
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()));

CREATE POLICY "Admins can delete profiles" 
ON public.user_profiles 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.admin_users au WHERE au.email = auth.email()));

-- Create client self-access policies (for future client portal updates)
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (id = auth.uid()) 
WITH CHECK (id = auth.uid());

-- Add updated_at trigger to user_profiles
CREATE TRIGGER set_user_profiles_updated_at 
BEFORE UPDATE ON public.user_profiles 
FOR EACH ROW 
EXECUTE PROCEDURE public.update_updated_at_column();