-- Migration: Server-side CHECK constraints for input validation
-- Applied 2026-05-24.
-- Uses DO block so re-running is safe (skips existing constraints).
-- Note: ADD CONSTRAINT IF NOT EXISTS is not valid PostgreSQL syntax;
-- use the EXCEPTION WHEN duplicate_object pattern instead.

DO $$
BEGIN
  BEGIN
    ALTER TABLE client_messages ADD CONSTRAINT body_length
      CHECK (char_length(body) BETWEEN 1 AND 2000);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER TABLE client_profiles ADD CONSTRAINT name_length
      CHECK (char_length(full_name) BETWEEN 2 AND 120);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER TABLE client_profiles ADD CONSTRAINT phone_format
      CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s\-]{7,20}$');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER TABLE enquiries ADD CONSTRAINT interest_length
      CHECK (interest IS NULL OR char_length(interest) <= 200);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
