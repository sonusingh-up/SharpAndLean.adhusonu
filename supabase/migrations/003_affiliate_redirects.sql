begin;
create table public.affiliate_redirects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 200),
  slug text not null unique check (length(slug) between 1 and 140 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  destination text not null check (length(destination) <= 4000 and destination ~ '^https://[^[:space:]]+$'),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.affiliate_redirects enable row level security;
revoke all on public.affiliate_redirects from public, anon, authenticated;
grant select on public.affiliate_redirects to anon, authenticated;
grant insert, update on public.affiliate_redirects to authenticated;
create policy "Public enabled redirects" on public.affiliate_redirects
  for select to anon, authenticated using (enabled);
create policy "Editors read all redirects" on public.affiliate_redirects
  for select to authenticated using ((select public.is_admin()));
create policy "Editors create redirects" on public.affiliate_redirects
  for insert to authenticated with check ((select public.is_admin()));
create policy "Editors update redirects" on public.affiliate_redirects
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
commit;
