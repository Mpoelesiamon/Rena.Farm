-- ============================================================
-- Migration: admin_profiles table + JWT custom access token hook
-- Applied: 2026-05-24
--
-- Creates a dedicated admin_profiles table for management platform
-- users and installs a Postgres hook that embeds the user's role
-- into every JWT at sign-in time.
--
-- After running this SQL:
--   1. Go to Supabase → Authentication → Hooks
--   2. Enable "Custom Access Token" hook
--   3. Select function: public.custom_access_token_hook
-- ============================================================


-- ── 1. admin_profiles table ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  role        text        NOT NULL DEFAULT 'staff'
                          CHECK (role IN (
                            'admin',
                            'farm_manager',
                            'sales',
                            'veterinarian',
                            'fodder_foreman',
                            'livestock_worker'
                          )),
  department  text,
  is_active   boolean     NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  CREATE TRIGGER admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can read all profiles; each user can read their own
DROP POLICY IF EXISTS "admin_profiles_self_read"  ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_read" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_write" ON public.admin_profiles;

CREATE POLICY "admin_profiles_self_read" ON public.admin_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "admin_profiles_admin_all" ON public.admin_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin' AND ap.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles ap
      WHERE ap.id = auth.uid() AND ap.role = 'admin' AND ap.is_active = true
    )
  );

-- Index for JWT hook lookup
CREATE INDEX IF NOT EXISTS idx_admin_profiles_id_active
  ON public.admin_profiles(id) WHERE is_active = true;


-- ── 2. JWT custom access token hook ─────────────────────────
--
-- Supabase calls this function every time it mints a JWT.
-- We add two custom claims:
--   user_role  — e.g. "admin", "farm_manager", "client"
--   is_staff   — true / false
--
-- Client apps can read these from the JWT without a DB call:
--   const role = session.user.user_metadata  — NO, use:
--   supabase.auth.getSession() → session.access_token → decode JWT

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims      jsonb;
  user_role   text;
  user_active boolean;
BEGIN
  -- Look up role from admin_profiles
  SELECT role, is_active
  INTO   user_role, user_active
  FROM   public.admin_profiles
  WHERE  id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL AND user_active IS TRUE THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    claims := jsonb_set(claims, '{is_staff}',  'true'::jsonb);
  ELSE
    -- Regular client or inactive staff — treat as client
    claims := jsonb_set(claims, '{user_role}', '"client"'::jsonb);
    claims := jsonb_set(claims, '{is_staff}',  'false'::jsonb);
  END IF;

  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Only the Supabase auth system may call this function
GRANT  EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC, anon, authenticated;
