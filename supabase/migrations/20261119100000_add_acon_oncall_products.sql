-- ============================================================
-- Add 9 ACON "On Call" products + local image storage setup.
-- Paste this whole file into the Supabase SQL Editor and run it.
-- Idempotent: safe to run multiple times.
--
-- AFTER running: upload the 9 product images to the public
-- "product-images" bucket, inside a folder named "acon", naming each
-- file <slug>.png (slugs listed below).
-- ============================================================

-- 1) Public storage bucket for product images (shared with DKT migration).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Public read access to files in that bucket.
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
for select using (bucket_id = 'product-images');

-- 2) Category for these products.
insert into public.categories (name, slug, division, description, sort_order)
values ('Diabetes Care', 'diabetes-care', 'human_health',
        'Blood glucose monitoring and diabetes management products.', 80)
on conflict (slug) do nothing;

-- 3) The 9 On Call products. image_url = /product-images/acon/<slug>.png
with c as (
  select id from public.categories where slug = 'diabetes-care' limit 1
)
insert into public.products (name, slug, division, category_id, brand, short_description, image_url, published)
select v.name, v.slug, 'human_health', c.id, 'On Call (ACON Laboratories)', v.short_description,
       '/product-images/acon/' || v.slug || '.png', true
from c
cross join (values
  ('On Call Express Family', 'on-call-express-family', 'On Call Express, Express II, Express Mobile and Express Voice Blood Glucose meters to meet all daily diabetes management needs.'),
  ('On Call Pro BGMS', 'on-call-pro-bgms', 'Made specifically to address needs within the long-term care market, the On Call Pro is an optimal choice for healthcare professionals.'),
  ('On Call Stealth Lancing Device', 'on-call-stealth', 'A gentle lancing device — 92% of people said On Call Stealth is less painful than their current lancing device.'),
  ('On Call Extra Family', 'on-call-extra-family', 'On Call Extra, Extra Mobile and Extra Voice Blood Glucose meters meet your daily diabetes management needs. Available for international distribution only.'),
  ('On Call Sure Family', 'on-call-sure-family', 'The On Call Sure family of Blood Glucose meters allows accurate testing of multiple whole blood specimen types including capillary, venous, arterial, and neonatal.'),
  ('On Call GK Dual BGMS', 'on-call-gk-dual', 'A high-performance device providing the ability to test both blood glucose and ß-ketones on the same meter. Available for international distribution only.'),
  ('On Call Vivid BGMS', 'on-call-vivid', 'A Blood Glucose Monitoring System offering accurate and reliable results with hematocrit correction for exceptional diabetes management. Available for international distribution only.'),
  ('On Call GenTouch Lancing Device', 'on-call-gentouch', 'A gentle lancing device — 92% of people said On Call GenTouch is less painful than their current lancing device.'),
  ('On Call MultiPro System', 'on-call-multipro', 'A multi-analyte, benchtop analyzer with a test menu geared toward screening and monitoring of diabetes and kidney disease, as well as assessment and triage of patients with infections and other inflammatory conditions.')
) as v(name, slug, short_description)
on conflict (slug) do nothing;
