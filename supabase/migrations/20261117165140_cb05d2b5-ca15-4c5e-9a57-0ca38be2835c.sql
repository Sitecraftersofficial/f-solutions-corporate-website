
create type public.app_role as enum ('admin');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;

create table public.categories (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, division text not null check (division in ('human_health','agrovet')), description text, sort_order int not null default 0, created_at timestamptz not null default now());
create table public.animal_types (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, sort_order int not null default 0, created_at timestamptz not null default now());
create table public.products (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, division text not null check (division in ('human_health','agrovet')), category_id uuid references public.categories(id) on delete set null, brand text, short_description text, details text, specifications text, image_url text, document_url text, document_name text, is_prescription boolean not null default false, published boolean not null default false, featured boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.product_animals (product_id uuid references public.products(id) on delete cascade, animal_type_id uuid references public.animal_types(id) on delete cascade, primary key (product_id, animal_type_id));
create table public.partners (id uuid primary key default gen_random_uuid(), name text not null, description text, logo_url text, website text, visible boolean not null default true, sort_order int not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.site_content (key text primary key, value text not null default '', updated_at timestamptz not null default now());
create table public.media (id uuid primary key default gen_random_uuid(), name text not null, url text not null, path text not null, created_at timestamptz not null default now());
create table public.compliance_documents (id uuid primary key default gen_random_uuid(), title text not null, description text, file_url text not null, visible boolean not null default true, created_at timestamptz not null default now());
create table public.enquiries (id uuid primary key default gen_random_uuid(), full_name text not null check (char_length(full_name) between 1 and 120), organization text check (char_length(organization) <= 160), email text not null check (char_length(email) between 3 and 255), phone text check (char_length(phone) <= 40), division text check (division in ('human_health','agrovet','general')), product_id uuid references public.products(id) on delete set null, product_name text check (char_length(product_name) <= 200), quantity text check (char_length(quantity) <= 200), message text not null check (char_length(message) between 1 and 3000), status text not null default 'pending' check (status in ('pending','in_progress','resolved')), internal_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.activity_logs (id uuid primary key default gen_random_uuid(), user_id uuid, action text not null, entity text, details text, created_at timestamptz not null default now());

grant select on public.categories, public.animal_types, public.products, public.product_animals, public.partners, public.site_content, public.compliance_documents to anon, authenticated;
grant insert, update, delete on public.categories, public.animal_types, public.products, public.product_animals, public.partners, public.site_content, public.compliance_documents, public.media to authenticated;
grant select on public.media to authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select, insert on public.activity_logs to authenticated;
grant all on public.categories, public.animal_types, public.products, public.product_animals, public.partners, public.site_content, public.media, public.compliance_documents, public.enquiries, public.activity_logs to service_role;

alter table public.categories enable row level security; alter table public.animal_types enable row level security; alter table public.products enable row level security; alter table public.product_animals enable row level security; alter table public.partners enable row level security; alter table public.site_content enable row level security; alter table public.media enable row level security; alter table public.compliance_documents enable row level security; alter table public.enquiries enable row level security; alter table public.activity_logs enable row level security;

create policy "public read" on public.categories for select using (true);
create policy "admin write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read" on public.animal_types for select using (true);
create policy "admin write" on public.animal_types for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read published" on public.products for select using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read" on public.product_animals for select using (true);
create policy "admin write" on public.product_animals for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read visible" on public.partners for select using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.partners for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read" on public.site_content for select using (true);
create policy "admin write" on public.site_content for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin all" on public.media for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read visible" on public.compliance_documents for select using (visible or public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.compliance_documents for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "anyone can submit" on public.enquiries for insert to anon, authenticated with check (status = 'pending' and internal_notes is null);
create policy "admin read" on public.enquiries for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.enquiries for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.enquiries for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin read" on public.activity_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin insert" on public.activity_logs for insert to authenticated with check (public.has_role(auth.uid(),'admin') and user_id = auth.uid());

create trigger t_products_upd before update on public.products for each row execute function public.update_updated_at_column();
create trigger t_partners_upd before update on public.partners for each row execute function public.update_updated_at_column();
create trigger t_enq_upd before update on public.enquiries for each row execute function public.update_updated_at_column();
create trigger t_content_upd before update on public.site_content for each row execute function public.update_updated_at_column();

insert into public.categories (name, slug, division, description, sort_order) values
('Pharmaceuticals','pharmaceuticals','human_health','Prescription medicines, over-the-counter medicines and other pharmaceutical products.',1),
('Reproductive Health','reproductive-health','human_health','Condoms, lubricants, contraceptives and other reproductive health commodities.',2),
('Medical Devices & Diagnostics','medical-devices-diagnostics','human_health','Glucose monitoring, HbA1c, CRP and ACR testing systems, laboratory and IVD products, strips and consumables.',3),
('Veterinary Medicines','veterinary-medicines','agrovet','Veterinary medicines and animal health treatments.',1),
('Vaccines & Disease Prevention','vaccines-disease-prevention','agrovet','Veterinary vaccines and farm animal disease prevention products.',2),
('Animal Nutrition','animal-nutrition','agrovet','Animal feed, nutritional supplements and livestock nutrition solutions.',3),
('Farm Health Products','farm-health-products','agrovet','Poultry and livestock health support products and other Agrovet supplies.',4);
insert into public.animal_types (name, slug, sort_order) values ('Poultry','poultry',1),('Cattle','cattle',2),('Goats','goats',3),('Sheep','sheep',4),('Other Farm Animals','other-farm-animals',5);
insert into public.partners (name, description, sort_order) values
('DKT International','Reproductive health products and commodities.',1),
('ACON Laboratories','Medical diagnostics and in-vitro diagnostic (IVD) products.',2),
('WAFI','Agrovet and animal health products.',3);
insert into public.site_content (key, value) values
('hero_headline','Reliable Healthcare & Agrovet Supply Solutions in Rwanda'),
('hero_subtext','Delivering high-quality pharmaceuticals, medical devices, and veterinary products through compliant, efficient, and trusted distribution systems.'),
('motto','One World. One Health. One Solution.'),
('company_intro','F-Solutions Ltd is a Rwanda-based company specializing in the importation, distribution, and market access of pharmaceuticals, medical devices, and veterinary products. We aim to improve access to quality healthcare and animal health products through reliable supply systems, partnerships, and customer-focused distribution.'),
('about_who','F-Solutions Ltd is a Rwanda-based company specializing in the importation, distribution, and market access of pharmaceuticals, medical devices, and veterinary products. The company aims to improve access to quality healthcare and animal health products through reliable supply systems, partnerships, and customer-focused distribution.'),
('vision','To become a leading and trusted integrated healthcare and Agrovet solutions provider in Rwanda and across Africa.'),
('mission','To ensure access to safe, effective, and affordable health products through global and local partnerships and efficient, compliant, customer-focused distribution systems.'),
('core_values','Integrity and Compliance
Transparency
Quality Assurance
Customer-Centered Service
Innovation
Partnership and Collaboration
Sustainability'),
('human_health_intro','Pharmaceuticals, reproductive health products, medical devices, diagnostics and healthcare supplies for hospitals, pharmacies, clinics, laboratories and healthcare institutions across Rwanda.'),
('agrovet_intro','Veterinary medicines, vaccines, animal nutrition and farm health products supporting poultry, cattle, goat, sheep and livestock production.'),
('quality_intro','Regulatory compliance, product quality and supply chain reliability are central to how F-Solutions operates.'),
('contact_email','info@fsolutions.rw'),
('contact_location','Kigali, Rwanda'),
('contact_phone',''),
('contact_whatsapp',''),
('contact_address',''),
('footer_text','Importation, distribution and market access of pharmaceuticals, medical devices and veterinary products in Rwanda.'),
('logo_url',''),
('hero_image_url',''),
('human_health_image_url',''),
('agrovet_image_url','');
