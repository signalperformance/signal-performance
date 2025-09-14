-- Remove membership_plan column from user_profiles table since everyone gets 16 sessions
ALTER TABLE public.user_profiles DROP COLUMN membership_plan;

-- Drop the membership_plan enum since it's no longer needed
DROP TYPE public.membership_plan;