-- ============================================================
-- Migration: farms table + farm_id column on all farm-data tables
-- Applied: 2026-05-24
--
-- Adds multi-farm support at the schema level. Currently only
-- Rena Farm exists; the column is populated with its fixed UUID
-- so no existing data is lost.
--
-- Tables updated:
--   events, awards, certificates, partners, testimonials,
--   animals, product_listings, gallery_categories, gallery_items,
--   enquiries, admin_profiles
--
-- Child image tables (animal_images, product_listing_images) are
-- intentionally skipped — they inherit scope via their parent FK.
-- ============================================================


-- ── 1. farms table ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.farms (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  location    text,
  country     text        NOT NULL DEFAULT 'KE',
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "farms_staff_read" ON public.farms;
CREATE POLICY "farms_staff_read" ON public.farms
  FOR SELECT TO authenticated
  USING (public.is_active_staff());

DROP POLICY IF EXISTS "farms_public_read" ON public.farms;
CREATE POLICY "farms_public_read" ON public.farms
  FOR SELECT TO anon
  USING (is_active = true);


-- ── 2. Insert Rena Farm with a stable UUID ───────────────────
--    Using a fixed UUID so all subsequent ALTER TABLE defaults
--    can reference it by a known value.

INSERT INTO public.farms (id, name, slug, location, country)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'Rena Farm',
  'rena-farm',
  'Kajiado Central, Kenya',
  'KE'
)
ON CONFLICT (id) DO NOTHING;


-- ── 3. Add farm_id to each farm-data table ───────────────────
--    Pattern: add nullable, backfill, set NOT NULL + default.

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'events',
    'awards',
    'certificates',
    'partners',
    'testimonials',
    'animals',
    'product_listings',
    'gallery_categories',
    'gallery_items',
    'enquiries',
    'admin_profiles'
  ];
  rena_id uuid := 'a0000001-0000-0000-0000-000000000001';
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Add column if missing (nullable first)
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS farm_id uuid REFERENCES public.farms(id) ON DELETE CASCADE',
      tbl
    );

    -- Backfill existing rows
    EXECUTE format(
      'UPDATE public.%I SET farm_id = $1 WHERE farm_id IS NULL',
      tbl
    ) USING rena_id;

    -- Set default and NOT NULL
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN farm_id SET DEFAULT $1',
      tbl
    ) USING rena_id;

    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN farm_id SET NOT NULL',
      tbl
    );

    -- Index for fast per-farm queries
    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS idx_%s_farm_id ON public.%I(farm_id)',
      tbl, tbl
    );
  END LOOP;
END $$;
