-- ============================================================
-- Migration: audit_log table + triggers on all admin writes
-- Applied: 2026-05-24
--
-- Every INSERT / UPDATE / DELETE on admin-managed tables is
-- recorded here with the old row, new row, user ID, and timestamp.
-- The trigger is intentionally SECURITY DEFINER so it can always
-- write to audit_log regardless of the calling user's RLS context.
-- ============================================================


-- ── 1. Audit log table ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_log (
  id          bigserial   PRIMARY KEY,
  table_name  text        NOT NULL,
  operation   text        NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
  old_data    jsonb,
  new_data    jsonb,
  changed_by  uuid,       -- auth.uid() at time of change; NULL for system ops
  changed_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for the most common queries: "what changed on table X?" and
-- "what did user Y do?"
CREATE INDEX IF NOT EXISTS idx_audit_log_table     ON public.audit_log(table_name, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user      ON public.audit_log(changed_by, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON public.audit_log(changed_at DESC);

-- RLS: only admins and farm managers can read the audit log;
-- nobody can INSERT/UPDATE/DELETE it directly (triggers only).
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_log_admin_read" ON public.audit_log;
CREATE POLICY "audit_log_admin_read" ON public.audit_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles ap
      WHERE ap.id = auth.uid()
        AND ap.role IN ('admin','farm_manager')
        AND ap.is_active = true
    )
  );


-- ── 2. Trigger function ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (table_name, operation, old_data, new_data, changed_by)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;


-- ── 3. Attach trigger to every admin-managed table ───────────
--    Uses a DO block so re-running is safe.

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
    'animal_images',
    'product_listings',
    'product_listing_images',
    'gallery_categories',
    'gallery_items',
    'admin_profiles',
    'enquiries'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Drop first so re-running is safe
    EXECUTE format('DROP TRIGGER IF EXISTS audit_%I ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE TRIGGER audit_%I
       AFTER INSERT OR UPDATE OR DELETE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.audit_trigger()',
      tbl, tbl
    );
  END LOOP;
END $$;
