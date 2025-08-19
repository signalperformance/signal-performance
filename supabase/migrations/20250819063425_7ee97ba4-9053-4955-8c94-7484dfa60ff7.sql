-- Secure admin_users: remove plaintext passwords and restrict access
-- 1) Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2) Drop dangerously permissive policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_all" ON public.admin_users;
DROP POLICY IF EXISTS "Public can view admin users" ON public.admin_users;

-- 3) Create a SECURITY DEFINER helper to avoid recursive RLS when checking admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.email()
  );
$$;

-- 4) Lock down access to admin_users to admins only
CREATE POLICY "Admins can manage admin_users"
ON public.admin_users
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5) Remove plaintext password storage
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'password'
  ) THEN
    ALTER TABLE public.admin_users DROP COLUMN password;
  END IF;
END $$;

-- 6) Ensure email is unique to prevent duplicates
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_email_unique'
  ) THEN
    ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_email_unique UNIQUE (email);
  END IF;
END $$;