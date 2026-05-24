-- ============================================================
-- Migration: RLS security fixes applied 2026-05-24
-- These were applied directly in Supabase SQL Editor.
-- Documented here for version control.
-- ============================================================

-- FIX 1: Separate is_admin() from is_farm_staff()
-- Both functions were identical (just checked profiles existence),
-- giving ALL staff admin-level delete privileges. Fixed to enforce
-- role = 'admin' for admin operations.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION is_farm_staff()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
  )
$$;

-- FIX 2: Remove enquiries_insert WITH CHECK (true)
-- This blanket policy was overriding the careful anon/auth policies,
-- allowing any user to link an enquiry to any client_id.
DROP POLICY IF EXISTS "enquiries_insert" ON enquiries;

-- FIX 3: Remove loose client_messages_insert policy
-- sender_id = auth.uid() alone did not enforce client_id isolation.
-- "Clients can send messages" already handles this correctly.
DROP POLICY IF EXISTS "client_messages_insert" ON client_messages;

-- FIX 4: Rebind enquiries DELETE policy to authenticated role
-- Was bound to {public} (applies to anon). Rebuilt as authenticated-only.
DROP POLICY IF EXISTS "Admins and managers can delete enquiries" ON enquiries;
CREATE POLICY "Admins and managers can delete enquiries" ON enquiries
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = ANY(ARRAY['admin'::text, 'farm_manager'::text])
    )
  );

-- ── Roles found in public.profiles (as of 2026-05-24) ──────
-- admin          (2 users)  — full access incl. destructive deletes
-- farm_manager   (2 users)  — staff access + can delete enquiries
-- sales          (1 user)   — staff access
-- fodder_foreman (1 user)   — staff access
-- veterinarian   (1 user)   — staff access
-- livestock_worker (3 users) — staff access
