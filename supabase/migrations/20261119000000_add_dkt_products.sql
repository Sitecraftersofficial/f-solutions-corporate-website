-- ============================================================
-- Add 49 DKT International products + local image storage setup.
-- Paste this whole file into the Supabase SQL Editor and run it.
-- Idempotent: safe to run multiple times.
--
-- AFTER running: upload the 49 product images to the public
-- "product-images" bucket, inside a folder named "dkt", naming each
-- file <slug>.png (slugs listed below). Products will then display
-- their images from local storage.
-- ============================================================

-- 1) Public storage bucket for product images.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Public read access to files in that bucket.
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
for select using (bucket_id = 'product-images');

-- 2) Category for these products.
insert into public.categories (name, slug, division, description, sort_order)
values ('Reproductive Health', 'reproductive-health', 'human_health',
        'Family planning and reproductive health products.', 90)
on conflict (slug) do nothing;

-- 3) The 49 products. image_url = /product-images/dkt/<slug>.png
with c as (
  select id from public.categories where slug = 'reproductive-health' limit 1
)
insert into public.products (name, slug, division, category_id, brand, short_description, image_url, published)
select v.name, v.slug, 'human_health', c.id, 'DKT International', v.short_description,
       '/product-images/dkt/' || v.slug || '.png', true
from c
cross join (values
  ('Aleze (EC)', 'aleze-ec', 'An emergency contraceptive option intended to help prevent pregnancy after unprotected sex or contraceptive failure.'),
  ('Aleze (IUD)', 'aleze-iud', 'A long-acting, reversible contraceptive option placed inside the uterus to help prevent pregnancy.'),
  ('Aleze (OC)', 'aleze-oc', 'An oral contraceptive brand designed to help prevent pregnancy when used as directed.'),
  ('Althea Silver', 'althea-silver', 'A reproductive-health product brand in DKT''s featured portfolio.'),
  ('Andalan', 'andalan', 'A contraceptive brand offering family-planning options for different needs.'),
  ('Andalan (Diaphragm)', 'andalan-diaphragm', 'A reusable barrier contraceptive designed to cover the cervix and help prevent sperm from entering the uterus.'),
  ('Andalan Oral Contraceptive Pills', 'andalan-oral-contraceptive-pills', 'Birth-control pills taken by mouth to help prevent pregnancy when used correctly.'),
  ('Avibela', 'avibela', 'A contraceptive product brand featured in DKT''s family-planning portfolio.'),
  ('Caya', 'caya', 'A diaphragm-style barrier contraceptive used with contraceptive gel to help prevent pregnancy.'),
  ('Choice', 'choice', 'A sexual and reproductive-health product brand in DKT''s portfolio.'),
  ('Contraplan II', 'contraplan-ii', 'An emergency contraceptive pill brand intended for use after unprotected sex or contraceptive failure.'),
  ('Dianofem', 'dianofem', 'A reproductive-health product brand featured by DKT.'),
  ('Eloira', 'eloira', 'A reproductive-health product brand in DKT''s featured range.'),
  ('Femdien', 'femdien', 'A reproductive-health product brand featured in DKT''s portfolio.'),
  ('Fiesta', 'fiesta', 'A condom brand designed to provide contraception and help reduce the risk of sexually transmitted infections.'),
  ('Fiesta (Lubricant)', 'fiesta-lubricant', 'A personal lubricant intended to reduce friction and make intimate activity more comfortable.'),
  ('Hiwot Trust', 'hiwot-trust', 'A reproductive-health product brand featured by DKT.'),
  ('Ilefem', 'ilefem', 'A reproductive-health product brand in DKT''s featured portfolio.'),
  ('Ipas MVA', 'ipas-mva', 'A manual vacuum aspiration product used by trained healthcare providers in uterine evacuation procedures.'),
  ('Kare', 'kare', 'A reproductive-health product brand featured in DKT''s portfolio.'),
  ('Kiss', 'kiss', 'A sexual-wellness product brand featured in DKT''s featured range.'),
  ('Levofem', 'levofem', 'An oral contraceptive product brand used for pregnancy prevention.'),
  ('Levoplant', 'levoplant', 'A long-acting contraceptive implant placed under the skin by a trained provider to prevent pregnancy.'),
  ('Lydia (Injection)', 'lydia-injection', 'An injectable contraceptive given by a healthcare provider to help prevent pregnancy.'),
  ('Lydia (IUD & IUS)', 'lydia-iud-ius', 'A range listing intrauterine contraceptive options placed inside the uterus for ongoing pregnancy prevention.'),
  ('Lydia (OC)', 'lydia-oc', 'An oral contraceptive pill brand intended for regular pregnancy prevention.'),
  ('Lydia Postpil', 'lydia-postpil', 'An emergency contraceptive product intended for use after unprotected sex or contraceptive failure.'),
  ('MA-Kare', 'ma-kare', 'A reproductive-health product brand featured in DKT''s portfolio.'),
  ('Medfem', 'medfem', 'A reproductive-health product brand featured in DKT''s featured range.'),
  ('MiaCare', 'miacare', 'A reproductive-health product brand featured by DKT.'),
  ('Mifecare', 'mifecare', 'A medication-based reproductive-health product brand in DKT''s portfolio.'),
  ('Mifepak', 'mifepak', 'A medication pack used in medication abortion care under appropriate clinical guidance.'),
  ('Miso Care', 'miso-care', 'A reproductive-health product brand associated with misoprostol-based care.'),
  ('Miso-fem', 'miso-fem', 'A reproductive-health product brand associated with misoprostol-based care.'),
  ('Miso-Íntimo', 'miso-intimo', 'A reproductive-health product brand associated with misoprostol-based care.'),
  ('Miso-Kare', 'miso-kare', 'A reproductive-health product brand associated with misoprostol-based care.'),
  ('Misodia', 'misodia', 'A reproductive-health product brand associated with misoprostol-based care.'),
  ('MVA-Kare', 'mva-kare', 'A manual vacuum aspiration kit used by trained healthcare providers for uterine evacuation.'),
  ('OK', 'ok', 'A condom brand designed to help prevent pregnancy and reduce the risk of sexually transmitted infections.'),
  ('Postpill', 'postpill', 'An emergency contraceptive pill brand intended for use after unprotected sex or contraceptive failure.'),
  ('Prudence (Female Condoms)', 'prudence-female-condoms', 'A female condom worn internally during sex to help prevent pregnancy and reduce STI risk.'),
  ('Prudence (Lubricants)', 'prudence-lubricants', 'A personal lubricant range designed to reduce friction and improve comfort during intimate activity.'),
  ('Prudence (Male Condoms)', 'prudence-male-condoms', 'Male condoms that provide a barrier to help prevent pregnancy and reduce the risk of sexually transmitted infections.'),
  ('Safe-t-kit', 'safe-t-kit', 'A reproductive-health kit intended to support safer care; use and contents depend on the specific kit and local guidance.'),
  ('Seguro', 'seguro', 'A condom brand designed to help prevent pregnancy and reduce the risk of sexually transmitted infections.'),
  ('Silverline', 'silverline', 'A reproductive-health product brand featured in DKT''s portfolio.'),
  ('Sutra', 'sutra', 'A sexual and reproductive-health product brand featured by DKT.'),
  ('Taneciprol', 'taneciprol', 'A reproductive-health product brand featured in DKT''s portfolio.'),
  ('Trust', 'trust', 'A condom brand designed to help prevent pregnancy and reduce the risk of sexually transmitted infections.')
) as v(name, slug, short_description)
on conflict (slug) do nothing;
