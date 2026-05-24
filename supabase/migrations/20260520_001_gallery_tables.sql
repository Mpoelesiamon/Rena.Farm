-- ================================================================
-- RENA FARM — Gallery CMS Tables
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mykyvloynpiqzmqvwekv/sql
-- ================================================================

-- 1. Gallery Categories
create table if not exists public.gallery_categories (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        not null unique,
  description     text,
  cover_image_url text,
  sort_order      integer     default 0,
  is_active       boolean     default true,
  created_at      timestamptz default now()
);

-- 2. Gallery Items
create table if not exists public.gallery_items (
  id              uuid        primary key default gen_random_uuid(),
  category_id     uuid        references public.gallery_categories(id) on delete set null,
  title           text,
  caption         text,
  media_url       text        not null,
  media_type      text        not null default 'image' check (media_type in ('image', 'video')),
  video_embed_url text,
  thumbnail_url   text,
  sort_order      integer     default 0,
  is_featured     boolean     default false,
  is_published    boolean     default true,
  event_id        uuid        references public.events(id) on delete set null,
  uploaded_by     uuid        references public.profiles(id) on delete set null,
  created_at      timestamptz default now()
);

-- 3. Enable RLS
alter table public.gallery_categories enable row level security;
alter table public.gallery_items      enable row level security;

-- 4. Public read policies (anon key can read active/published rows)
create policy "gallery_categories_public_read"
  on public.gallery_categories for select
  to anon, authenticated
  using (is_active = true);

create policy "gallery_items_public_read"
  on public.gallery_items for select
  to anon, authenticated
  using (is_published = true);

-- 5. Authenticated users (dashboard) can manage everything
create policy "gallery_categories_auth_all"
  on public.gallery_categories for all
  to authenticated
  using (true)
  with check (true);

create policy "gallery_items_auth_all"
  on public.gallery_items for all
  to authenticated
  using (true)
  with check (true);

-- Done. Tables are ready for the gallery CMS.
