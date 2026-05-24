-- ============================================================
-- RLS AUDIT CHECK SCRIPT
-- Run this in Supabase SQL Editor → inspect the output
-- ============================================================

-- Step 1: Which tables exist in public schema and whether RLS is enabled
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Step 2: All existing policies (run after Step 1 to see what's there)
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual        AS using_expr,
  with_check  AS with_check_expr
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
