-- Apply after 001_initial.sql. Configure Clerk as Supabase third-party auth first.
-- Editor membership is provisioned by the database owner, never by public signup.
begin;
create table public.clerk_admin_users (
  clerk_user_id text primary key check (clerk_user_id like 'user\_%' escape '\'),
  created_at timestamptz not null default now()
);
alter table public.clerk_admin_users enable row level security;
revoke all on public.clerk_admin_users from public, anon, authenticated;

-- Preserve existing Supabase editor records without casting Clerk IDs to UUIDs.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.clerk_admin_users
    where clerk_user_id = (select auth.jwt()->>'sub')
  ) or exists (
    select 1 from public.admin_users
    where user_id::text = (select auth.jwt()->>'sub')
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
commit;
