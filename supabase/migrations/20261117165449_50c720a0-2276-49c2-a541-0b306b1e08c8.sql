
create policy "admin media read" on storage.objects for select to authenticated using (bucket_id='media' and public.has_role(auth.uid(),'admin'));
create policy "admin media insert" on storage.objects for insert to authenticated with check (bucket_id='media' and public.has_role(auth.uid(),'admin'));
create policy "admin media update" on storage.objects for update to authenticated using (bucket_id='media' and public.has_role(auth.uid(),'admin'));
create policy "admin media delete" on storage.objects for delete to authenticated using (bucket_id='media' and public.has_role(auth.uid(),'admin'));

drop policy "public read published" on public.products;
create policy "anon read published" on public.products for select to anon using (published);
create policy "auth read" on public.products for select to authenticated using (published or public.has_role(auth.uid(),'admin'));
drop policy "public read visible" on public.partners;
create policy "anon read visible" on public.partners for select to anon using (visible);
create policy "auth read" on public.partners for select to authenticated using (visible or public.has_role(auth.uid(),'admin'));
drop policy "public read visible" on public.compliance_documents;
create policy "anon read visible" on public.compliance_documents for select to anon using (visible);
create policy "auth read" on public.compliance_documents for select to authenticated using (visible or public.has_role(auth.uid(),'admin'));
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create index on public.enquiries(product_id);
create index on public.product_animals(animal_type_id);
create index on public.products(category_id);
