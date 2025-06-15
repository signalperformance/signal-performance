
-- Enable Row Level Security on the waitlist_entries table
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow public insert access for the waitlist form
CREATE POLICY "Allow public insert for waitlist"
ON public.waitlist_entries
FOR INSERT
WITH CHECK (true);

-- Deny all select access to the waitlist entries
CREATE POLICY "Deny all select access"
ON public.waitlist_entries
FOR SELECT
USING (false);

-- Deny all update access to the waitlist entries
CREATE POLICY "Deny all update access"
ON public.waitlist_entries
FOR UPDATE
USING (false);

-- Deny all delete access to the waitlist entries
CREATE POLICY "Deny all delete access"
ON public.waitlist_entries
FOR DELETE
USING (false);
