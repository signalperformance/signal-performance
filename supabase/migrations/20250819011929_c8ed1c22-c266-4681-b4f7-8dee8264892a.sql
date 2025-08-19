-- Add player_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE player_type AS ENUM ('amateur', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add player_type column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS player_type player_type NOT NULL DEFAULT 'amateur';