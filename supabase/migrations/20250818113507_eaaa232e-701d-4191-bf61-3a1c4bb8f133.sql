-- Drop existing policies if they exist to avoid conflicts
drop policy if exists "Admins can insert schedule entries" on public.schedule_entries;
drop policy if exists "Admins can update schedule entries" on public.schedule_entries;  
drop policy if exists "Admins can delete schedule entries" on public.schedule_entries;

-- Create new policies to allow authenticated admins (present in admin_users) to manage schedule_entries
-- Uses auth.email() to verify the signed-in Supabase Auth user's email exists in admin_users

-- INSERT
create policy "Admins can insert schedule entries"
  on public.schedule_entries
  for insert
  with check (exists (
    select 1 from public.admin_users au
    where au.email = auth.email()
  ));

-- UPDATE
create policy "Admins can update schedule entries"
  on public.schedule_entries
  for update
  using (exists (
    select 1 from public.admin_users au
    where au.email = auth.email()
  ))
  with check (exists (
    select 1 from public.admin_users au
    where au.email = auth.email()
  ));

-- DELETE
create policy "Admins can delete schedule entries"
  on public.schedule_entries
  for delete
  using (exists (
    select 1 from public.admin_users au
    where au.email = auth.email()
  ));