-- Explicit editorial tags used by the homepage goal finder.
begin;
alter table public.reviews add column if not exists goal_tags text[] not null default '{}';
-- Keep the review editor's selected tags when an existing row is updated.
create or replace function public.save_review(p_data jsonb,p_ingredients jsonb,p_faqs jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid; v_old reviews; v_row reviews;
begin
 if not public.is_admin() then raise exception 'Editor access required'; end if;
 v_id=coalesce(nullif(p_data->>'id','')::uuid,gen_random_uuid());
 select * into v_old from reviews where id=v_id;
 p_data=p_data || jsonb_build_object('id',v_id,'created_at',coalesce(v_old.created_at,now()),'updated_at',now(),'published_at',coalesce(v_old.published_at,nullif(p_data->>'published_at','')::timestamptz,case when (p_data->>'is_published')::boolean then now() else null end));
 v_row=jsonb_populate_record(null::reviews,p_data);
 insert into reviews select v_row.* on conflict(id) do update set title=excluded.title,slug=excluded.slug,category_id=excluded.category_id,author_id=excluded.author_id,is_published=excluded.is_published,published_at=excluded.published_at,product_name=excluded.product_name,score=excluded.score,verdict=excluded.verdict,summary=excluded.summary,body=excluded.body,pros=excluded.pros,cons=excluded.cons,affiliate_url=excluded.affiliate_url,affiliate_network=excluded.affiliate_network,product_price=excluded.product_price,price_amount=excluded.price_amount,currency=excluded.currency,third_party_tested=excluded.third_party_tested,money_back_guarantee=excluded.money_back_guarantee,featured_image_url=excluded.featured_image_url,og_image_url=excluded.og_image_url,seo_title=excluded.seo_title,seo_desc=excluded.seo_desc,who_for=excluded.who_for,who_avoid=excluded.who_avoid,score_breakdown=excluded.score_breakdown,goal_tags=excluded.goal_tags;
 delete from review_ingredients where review_id=v_id;
 insert into review_ingredients(review_id,name,dose,evidence_rating,note,sort_order) select v_id,value->>'name',value->>'dose',value->>'evidence_rating',value->>'note',ordinality::integer from jsonb_array_elements(p_ingredients) with ordinality;
 delete from review_faqs where review_id=v_id;
 insert into review_faqs(review_id,question,answer,sort_order) select v_id,value->>'question',value->>'answer',ordinality::integer from jsonb_array_elements(p_faqs) with ordinality;
 return v_id;
end $$;
commit;
