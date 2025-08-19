
-- 1) Payment method enum
create type public.payment_method as enum ('cash', 'card', 'bank_transfer', 'stripe', 'other');

-- 2) Monthly payment records table
create table public.user_payment_records (
  id uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references public.user_profiles(id) on delete cascade,
  period_month date not null,
  is_paid boolean not null default false,
  paid_at date,
  payment_method public.payment_method,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_month unique (user_profile_id, period_month)
);

-- 3) Enable RLS
alter table public.user_payment_records enable row level security;

-- 4) Normalize period_month to first of month
create or replace function public.normalize_period_month()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.period_month is not null then
    new.period_month := date_trunc('month', new.period_month)::date;
  end if;
  return new;
end;
$$;

create trigger user_payment_records_normalize_month
before insert or update on public.user_payment_records
for each row execute procedure public.normalize_period_month();

-- 5) Maintain updated_at
create trigger user_payment_records_set_updated_at
before update on public.user_payment_records
for each row execute procedure public.update_updated_at_column();

-- 6) RLS policies

-- Admins can manage all payment records
create policy "Admins can manage user payment records"
  on public.user_payment_records
  for all
  using (exists (select 1 from public.admin_users au where au.email = auth.email()))
  with check (exists (select 1 from public.admin_users au where au.email = auth.email()));

-- Users can view their own payment records
create policy "Users can view own payment records"
  on public.user_payment_records
  for select
  using (user_profile_id = auth.uid());

-- 7) Helpful index for lookups by user and month
create index idx_user_payment_records_user_month
  on public.user_payment_records(user_profile_id, period_month);
