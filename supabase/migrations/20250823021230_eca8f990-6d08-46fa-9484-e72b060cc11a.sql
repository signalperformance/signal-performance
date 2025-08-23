-- Security hardening: remove plaintext password storage and ensure RLS is enabled

-- 1) Ensure RLS is enabled on user_profiles (idempotent)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2) Drop insecure password column if it exists
ALTER TABLE public.user_profiles
  DROP COLUMN IF EXISTS password;