-- ================================================================
-- RENA FARM — Gallery RLS Fix + Storage Policies
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mykyvloynpiqzmqvwekv/sql
-- ================================================================

-- 1. Drop old conflicting policies
drop policy if exists "gallery_categories_public_read"  on public.gallery_categories;
drop policy if exists "gallery_items_public_read"       on public.gallery_items;
drop policy if exists "gallery_categories_auth_all"     on public.gallery_categories;
drop policy if exists "gallery_items_auth_all"          on public.gallery_items;

-- 2. Anon (public website) — read-only, restricted
create policy "gallery_categories_anon_select"
  on public.gallery_categories for select to anon
  using (is_active = true);

create policy "gallery_items_anon_select"
  on public.gallery_items for select to anon
  using (is_published = true);

-- 3. Authenticated (dashboard) — full access, explicit per-command
create policy "gallery_categories_auth_select"
  on public.gallery_categories for select to authenticated using (true);

create policy "gallery_categories_auth_insert"
  on public.gallery_categories for insert to authenticated with check (true);

create policy "gallery_categories_auth_update"
  on public.gallery_categories for update to authenticated using (true) with check (true);

create policy "gallery_categories_auth_delete"
  on public.gallery_categories for delete to authenticated using (true);

create policy "gallery_items_auth_select"
  on public.gallery_items for select to authenticated using (true);

create policy "gallery_items_auth_insert"
  on public.gallery_items for insert to authenticated with check (true);

create policy "gallery_items_auth_update"
  on public.gallery_items for update to authenticated using (true) with check (true);

create policy "gallery_items_auth_delete"
  on public.gallery_items for delete to authenticated using (true);

-- 4. Storage: allow dashboard users to upload to website-media bucket
do $$
begin
  if not exists (select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='website_media_auth_insert') then
    execute $p$ create policy "website_media_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'website-media') $p$;
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='website_media_auth_update') then
    execute $p$ create policy "website_media_auth_update" on storage.objects for update to authenticated using (bucket_id = 'website-media') $p$;
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='website_media_public_read') then
    execute $p$ create policy "website_media_public_read" on storage.objects for select to anon, authenticated using (bucket_id = 'website-media') $p$;
  end if;
end $$;
