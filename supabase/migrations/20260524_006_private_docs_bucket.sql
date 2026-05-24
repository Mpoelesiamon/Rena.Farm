-- ============================================================
-- Migration: private-docs storage bucket + RLS policies
-- Applied: 2026-05-24
--
-- Creates a private (non-public) bucket for sensitive documents:
--   veterinary certificates, purchase contracts, invoices,
--   animal health records, staff documents.
--
-- Access rules:
--   - No public access at all (bucket.public = false)
--   - Active admin / farm_manager can upload, read, and delete
--   - Other active staff can read only (not upload or delete)
--   - Clients and anonymous users have zero access
--
-- Suggested folder structure inside the bucket:
--   private-docs/animals/{animal_id}/        — health records, vet certs
--   private-docs/sales/{enquiry_id}/         — purchase contracts
--   private-docs/finance/                    — invoices, receipts
--   private-docs/staff/{user_id}/            — staff documents
-- ============================================================


-- ── 1. Create the bucket ─────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'private-docs',
  'private-docs',
  false,          -- NOT public
  20971520,       -- 20 MB per file
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;


-- ── 2. Helper: is the current user active staff? ─────────────

CREATE OR REPLACE FUNCTION public.is_active_staff()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin_or_manager()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'farm_manager')
      AND is_active = true
  )
$$;


-- ── 3. Storage RLS policies ──────────────────────────────────

-- Upload (INSERT): admin and farm_manager only
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'private_docs_upload'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "private_docs_upload"
        ON storage.objects FOR INSERT TO authenticated
        WITH CHECK (
          bucket_id = 'private-docs'
          AND public.is_active_admin_or_manager()
        )
    $p$;
  END IF;
END $$;

-- Read (SELECT): all active staff can read
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'private_docs_read'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "private_docs_read"
        ON storage.objects FOR SELECT TO authenticated
        USING (
          bucket_id = 'private-docs'
          AND public.is_active_staff()
        )
    $p$;
  END IF;
END $$;

-- Update (UPDATE): admin and farm_manager only
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'private_docs_update'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "private_docs_update"
        ON storage.objects FOR UPDATE TO authenticated
        USING (
          bucket_id = 'private-docs'
          AND public.is_active_admin_or_manager()
        )
    $p$;
  END IF;
END $$;

-- Delete (DELETE): admin only
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'private_docs_delete'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "private_docs_delete"
        ON storage.objects FOR DELETE TO authenticated
        USING (
          bucket_id = 'private-docs'
          AND EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
              AND role = 'admin'
              AND is_active = true
          )
        )
    $p$;
  END IF;
END $$;
