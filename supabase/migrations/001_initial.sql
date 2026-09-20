-- Run once against the intended Supabase project. No sample product claims are seeded.
begin;
create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admin_users enable row level security;
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table public.categories(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text default '',buying_guide text default '',seo_title text default '',seo_desc text default '',created_at timestamptz default now());
create table public.authors(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,title text default '',years_experience integer,bio text default '',photo_url text default '',linkedin_url text default '',credentials text[] default '{}',specialisations text[] default '{}',created_at timestamptz default now());
create table public.reviews(
 id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,
 category_id uuid not null references categories(id),author_id uuid not null references authors(id),
 is_published boolean not null default false,published_at timestamptz,updated_at timestamptz not null default now(),
 product_name text not null,score numeric(3,1) check(score between 0 and 10),verdict text default '',summary text default '',body text default '',pros text[] default '{}',cons text[] default '{}',
 affiliate_url text default '',affiliate_network text default '',product_price text default '',price_amount numeric(12,2) check(price_amount>=0),currency text default 'USD',
 third_party_tested boolean default false,money_back_guarantee text default '',featured_image_url text default '',og_image_url text default '',seo_title text default '',seo_desc text default '',
 who_for text default '',who_avoid text default '',score_breakdown jsonb not null default '{}',created_at timestamptz default now(),
 constraint valid_slug check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), constraint publication_date check(not is_published or published_at is not null)
);
create table public.review_ingredients(id uuid primary key default gen_random_uuid(),review_id uuid not null references reviews(id) on delete cascade,name text not null,dose text default '',evidence_rating text check(evidence_rating in ('strong','moderate','weak','none')),note text default '',sort_order integer default 0);
create table public.review_faqs(id uuid primary key default gen_random_uuid(),review_id uuid not null references reviews(id) on delete cascade,question text not null,answer text not null,sort_order integer default 0);
create table public.best_lists(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,category_id uuid not null references categories(id),summary text default '',body text default '',is_published boolean not null default false,published_at timestamptz,updated_at timestamptz not null default now(),seo_title text default '',seo_desc text default '',created_at timestamptz default now());
create table public.best_list_items(id uuid primary key default gen_random_uuid(),best_list_id uuid not null references best_lists(id) on delete cascade,review_id uuid not null references reviews(id),rank integer not null check(rank>0),why_it_made_the_list text default '',unique(best_list_id,review_id),unique(best_list_id,rank));
create table public.best_list_faqs(id uuid primary key default gen_random_uuid(),best_list_id uuid not null references best_lists(id) on delete cascade,question text not null,answer text not null,sort_order integer default 0);
create table public.comparisons(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,category_id uuid not null references categories(id),product_a_id uuid not null references reviews(id),product_b_id uuid not null references reviews(id),summary text default '',body text default '',verdict text default '',is_published boolean not null default false,published_at timestamptz,updated_at timestamptz not null default now(),seo_title text default '',seo_desc text default '',created_at timestamptz default now(),check(product_a_id<>product_b_id));
create table public.articles(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,category_id uuid not null references categories(id),summary text default '',body text default '',is_published boolean not null default false,published_at timestamptz,updated_at timestamptz not null default now(),seo_title text default '',seo_desc text default '',created_at timestamptz default now());
create table public.category_faqs(id uuid primary key default gen_random_uuid(),category_id uuid not null references categories(id) on delete cascade,question text not null,answer text not null,sort_order integer default 0);
create table public.subscribers(id uuid primary key default gen_random_uuid(),email text unique not null,source text default 'website',consent_at timestamptz not null,created_at timestamptz default now());
create table public.community_reviews(id uuid primary key default gen_random_uuid(),review_id uuid not null references reviews(id) on delete cascade,reviewer_name text not null,rating integer not null check(rating between 1 and 5),review_text text not null,is_approved boolean not null default false,moderation_status text not null default 'pending' check(moderation_status in ('pending','approved','rejected')),created_at timestamptz default now());
create table public.api_rate_limits(key text primary key,hits integer not null default 1,window_start timestamptz not null default now());

-- All tables fail closed. Only explicitly approved users can edit.
do $$ declare t text; begin
 foreach t in array array['categories','authors','reviews','review_ingredients','review_faqs','best_lists','best_list_items','best_list_faqs','comparisons','articles','category_faqs','subscribers','community_reviews','api_rate_limits'] loop
 execute format('alter table public.%I enable row level security',t);
 if t<>'api_rate_limits' then execute format('create policy editor_access on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',t); end if;
 end loop;
 foreach t in array array['categories','authors','category_faqs'] loop execute format('create policy public_read on public.%I for select to anon,authenticated using (true)',t); end loop;
 foreach t in array array['reviews','best_lists','comparisons','articles'] loop execute format('create policy published_read on public.%I for select to anon,authenticated using (is_published=true)',t); end loop;
end $$;
create policy published_parent on review_ingredients for select to anon,authenticated using(exists(select 1 from reviews r where r.id=review_id and r.is_published));
create policy published_parent on review_faqs for select to anon,authenticated using(exists(select 1 from reviews r where r.id=review_id and r.is_published));
create policy published_parent on best_list_items for select to anon,authenticated using(exists(select 1 from best_lists b where b.id=best_list_id and b.is_published) and exists(select 1 from reviews r where r.id=review_id and r.is_published));
create policy published_parent on best_list_faqs for select to anon,authenticated using(exists(select 1 from best_lists b where b.id=best_list_id and b.is_published));
create policy approved_read on community_reviews for select to anon,authenticated using(is_approved and exists(select 1 from reviews r where r.id=review_id and r.is_published));
grant usage on schema public to anon,authenticated;
grant select on categories,authors,category_faqs,reviews,review_ingredients,review_faqs,best_lists,best_list_items,best_list_faqs,comparisons,articles,community_reviews to anon,authenticated;
grant select,insert,update,delete on categories,authors,category_faqs,reviews,review_ingredients,review_faqs,best_lists,best_list_items,best_list_faqs,comparisons,articles,community_reviews,subscribers to authenticated;

create function public.touch_content() returns trigger language plpgsql as $$ begin new.updated_at=now(); if new.is_published and new.published_at is null then new.published_at=now(); end if; return new; end $$;
do $$ declare t text; begin foreach t in array array['reviews','best_lists','comparisons','articles'] loop execute format('create trigger content_updated before insert or update on public.%I for each row execute function public.touch_content()',t); end loop; end $$;

-- SECURITY INVOKER preserves RLS, and each save atomically replaces child rows.
create function public.save_review(p_data jsonb,p_ingredients jsonb,p_faqs jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid; v_old reviews; v_row reviews;
begin
 if not public.is_admin() then raise exception 'Editor access required'; end if;
 v_id=coalesce(nullif(p_data->>'id','')::uuid,gen_random_uuid());
 select * into v_old from reviews where id=v_id;
 p_data=p_data || jsonb_build_object('id',v_id,'created_at',coalesce(v_old.created_at,now()),'updated_at',now(),'published_at',coalesce(v_old.published_at,nullif(p_data->>'published_at','')::timestamptz,case when (p_data->>'is_published')::boolean then now() else null end));
 v_row=jsonb_populate_record(null::reviews,p_data);
 insert into reviews select v_row.* on conflict(id) do update set title=excluded.title,slug=excluded.slug,category_id=excluded.category_id,author_id=excluded.author_id,is_published=excluded.is_published,published_at=excluded.published_at,product_name=excluded.product_name,score=excluded.score,verdict=excluded.verdict,summary=excluded.summary,body=excluded.body,pros=excluded.pros,cons=excluded.cons,affiliate_url=excluded.affiliate_url,affiliate_network=excluded.affiliate_network,product_price=excluded.product_price,price_amount=excluded.price_amount,currency=excluded.currency,third_party_tested=excluded.third_party_tested,money_back_guarantee=excluded.money_back_guarantee,featured_image_url=excluded.featured_image_url,og_image_url=excluded.og_image_url,seo_title=excluded.seo_title,seo_desc=excluded.seo_desc,who_for=excluded.who_for,who_avoid=excluded.who_avoid,score_breakdown=excluded.score_breakdown;
 delete from review_ingredients where review_id=v_id;
 insert into review_ingredients(review_id,name,dose,evidence_rating,note,sort_order) select v_id,value->>'name',value->>'dose',value->>'evidence_rating',value->>'note',ordinality::integer from jsonb_array_elements(p_ingredients) with ordinality;
 delete from review_faqs where review_id=v_id;
 insert into review_faqs(review_id,question,answer,sort_order) select v_id,value->>'question',value->>'answer',ordinality::integer from jsonb_array_elements(p_faqs) with ordinality;
 return v_id;
end $$;
create function public.save_collection(p_kind text,p_data jsonb,p_items jsonb,p_faqs jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid; v_published timestamptz;
begin
 if not public.is_admin() or p_kind not in ('best_lists','comparisons','articles') then raise exception 'Editor access required'; end if;
 v_id=coalesce(nullif(p_data->>'id','')::uuid,gen_random_uuid());
 execute format('select published_at from %I where id=$1',p_kind) into v_published using v_id;
 p_data=p_data || jsonb_build_object('id',v_id,'created_at',now(),'updated_at',now(),'published_at',coalesce(v_published,nullif(p_data->>'published_at','')::timestamptz,case when (p_data->>'is_published')::boolean then now() else null end));
 if (p_data->>'is_published')::boolean then
   if p_kind='comparisons' and (select count(*) from reviews where id in ((p_data->>'product_a_id')::uuid,(p_data->>'product_b_id')::uuid) and is_published)<>2 then raise exception 'Both products must be published'; end if;
   if p_kind='best_lists' and exists(select 1 from jsonb_array_elements(p_items) j where not exists(select 1 from reviews r where r.id=(j->>'review_id')::uuid and r.is_published)) then raise exception 'All selected reviews must be published'; end if;
 end if;
 execute format('insert into %1$I select (jsonb_populate_record(null::%1$I,$1)).* on conflict(id) do update set title=excluded.title,slug=excluded.slug,category_id=excluded.category_id,summary=excluded.summary,body=excluded.body,is_published=excluded.is_published,published_at=excluded.published_at,seo_title=excluded.seo_title,seo_desc=excluded.seo_desc%2$s',p_kind,case when p_kind='comparisons' then ',product_a_id=excluded.product_a_id,product_b_id=excluded.product_b_id,verdict=excluded.verdict' else '' end) using p_data;
 if p_kind='best_lists' then
 delete from best_list_items where best_list_id=v_id;
 insert into best_list_items(best_list_id,review_id,rank,why_it_made_the_list) select v_id,(value->>'review_id')::uuid,(value->>'rank')::integer,value->>'why_it_made_the_list' from jsonb_array_elements(p_items);
 delete from best_list_faqs where best_list_id=v_id;
 insert into best_list_faqs(best_list_id,question,answer,sort_order) select v_id,value->>'question',value->>'answer',ordinality::integer from jsonb_array_elements(p_faqs) with ordinality;
 end if;
 return v_id;
end $$;
revoke all on function public.save_review(jsonb,jsonb,jsonb),public.save_collection(text,jsonb,jsonb,jsonb) from public;
grant execute on function public.save_review(jsonb,jsonb,jsonb),public.save_collection(text,jsonb,jsonb,jsonb) to authenticated;

create function public.consume_rate_limit(p_key text,p_limit integer) returns boolean language plpgsql security definer set search_path=public as $$ declare v_hits integer; begin
 delete from api_rate_limits where window_start < now()-interval '1 day';
 insert into api_rate_limits(key,hits,window_start) values(p_key,1,now()) on conflict(key) do update set hits=case when api_rate_limits.window_start<now()-interval '1 minute' then 1 else api_rate_limits.hits+1 end,window_start=case when api_rate_limits.window_start<now()-interval '1 minute' then now() else api_rate_limits.window_start end returning hits into v_hits;
 return v_hits<=p_limit;
end $$;
revoke all on function public.consume_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer) to service_role;

create index on reviews(category_id,is_published,score desc);
create index on reviews(author_id);
create index on review_ingredients(review_id);
create index on review_faqs(review_id);
create index on best_list_items(best_list_id);
create index on community_reviews(review_id,is_approved);

insert into categories(name,slug,description) values('Fat Burners','fat-burners','Weight-management supplement reviews'),('Nootropics','nootropics','Focus and cognitive-health supplement reviews'),('Wellness','wellness','Everyday wellness supplement reviews');
insert into authors(name,slug,title,photo_url,linkedin_url) values('Sumita Bhatti','sumita-bhatti','Clinical Nutritionist','/images/sumita.jpg','https://www.linkedin.com/in/sumita-bhatti-979467368/');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('media','media',true,5242880,array['image/jpeg','image/png','image/webp','image/avif']) on conflict(id) do nothing;
create policy public_media_read on storage.objects for select to anon,authenticated using(bucket_id='media');
create policy editor_media_insert on storage.objects for insert to authenticated with check(bucket_id='media' and (select public.is_admin()));
create policy editor_media_update on storage.objects for update to authenticated using(bucket_id='media' and (select public.is_admin())) with check(bucket_id='media' and (select public.is_admin()));
create policy editor_media_delete on storage.objects for delete to authenticated using(bucket_id='media' and (select public.is_admin()));
commit;
