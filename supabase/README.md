# Supabase Schema Migrations

## Directory structure

```
supabase/
  migrations/   — SQL files applied to the database, one change per file
  tools/        — Utility query scripts (not migrations; never destructive)
```

## Naming convention

```
YYYYMMDD_NNN_description.sql
```

| Part | Meaning |
|------|---------|
| `YYYYMMDD` | Date the migration was written |
| `NNN` | Zero-padded sequence within that date (`001`, `002`, …) |
| `description` | Snake-case summary of what the migration does |

**Examples:**
- `20260524_001_indexes.sql`
- `20260524_002_check_constraints.sql`
- `20260601_001_audit_log_table.sql`

## How to apply a migration

1. Open **Supabase → SQL Editor** for project `mykyvloynpiqzmqvwekv`
2. Paste the contents of the migration file
3. Run it
4. Add a comment at the top of the file: `-- Applied: YYYY-MM-DD`

All migrations are written to be **idempotent** — safe to re-run using
`IF NOT EXISTS`, `OR REPLACE`, `DO $$ BEGIN … EXCEPTION WHEN duplicate_object`
and `DROP … IF EXISTS` patterns.

## Applied migrations log

| File | Description | Applied |
|------|-------------|---------|
| `20260520_001_gallery_tables.sql` | Gallery categories + items tables, RLS enabled | 2026-05-20 |
| `20260520_002_gallery_rls_storage.sql` | Gallery RLS fix + storage bucket policies | 2026-05-20 |
| `20260524_000_rls_policies.sql` | Full RLS policy set for all public tables | 2026-05-24 |
| `20260524_001_indexes.sql` | Performance indexes on FK columns | 2026-05-24 |
| `20260524_002_check_constraints.sql` | Server-side CHECK constraints for input validation | 2026-05-24 |
| `20260524_003_rls_security_fixes.sql` | Security hardening: is_admin/is_farm_staff separation, policy cleanup | 2026-05-24 |
| `20260524_004_admin_profiles_jwt_hook.sql` | admin_profiles table + JWT custom access token hook | 2026-05-24 |

## Upcoming migrations (planned)

| File | Description |
|------|-------------|
| `20260601_001_audit_log.sql` | Audit log table + triggers on all admin writes (Task 14) |

## Tools

- `tools/rls_audit_check.sql` — Run in SQL Editor to inspect current RLS state across all tables
