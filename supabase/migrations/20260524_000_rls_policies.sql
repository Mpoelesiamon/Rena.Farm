-- ============================================================
-- RENA FARM — ROW LEVEL SECURITY POLICIES
-- Run this entire file in Supabase SQL Editor
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE patterns
-- ============================================================

-- ── ENABLE RLS on every table ─────────────────────────────

ALTER TABLE events                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners               ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals                ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_images          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_listings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries              ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages        ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════
-- PUBLIC READ-ONLY TABLES
-- Anyone (anon or authenticated) can SELECT.
-- No writes allowed from the frontend at all.
-- ════════════════════════════════════════════════════════════

-- events
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (is_published = true);

-- awards
DROP POLICY IF EXISTS "awards_public_read" ON awards;
CREATE POLICY "awards_public_read" ON awards
  FOR SELECT USING (is_published = true);

-- certificates
DROP POLICY IF EXISTS "certificates_public_read" ON certificates;
CREATE POLICY "certificates_public_read" ON certificates
  FOR SELECT USING (is_published = true);

-- partners
DROP POLICY IF EXISTS "partners_public_read" ON partners;
CREATE POLICY "partners_public_read" ON partners
  FOR SELECT USING (is_published = true);

-- testimonials
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_published = true);

-- animals (public listing only)
DROP POLICY IF EXISTS "animals_public_read" ON animals;
CREATE POLICY "animals_public_read" ON animals
  FOR SELECT USING (listing_status IN ('on_sale', 'booked', 'sold'));

-- animal_images
DROP POLICY IF EXISTS "animal_images_public_read" ON animal_images;
CREATE POLICY "animal_images_public_read" ON animal_images
  FOR SELECT USING (true);

-- product_listings
DROP POLICY IF EXISTS "product_listings_public_read" ON product_listings;
CREATE POLICY "product_listings_public_read" ON product_listings
  FOR SELECT USING (listing_status = 'active');

-- product_listing_images
DROP POLICY IF EXISTS "product_listing_images_public_read" ON product_listing_images;
CREATE POLICY "product_listing_images_public_read" ON product_listing_images
  FOR SELECT USING (true);

-- gallery_categories
DROP POLICY IF EXISTS "gallery_categories_public_read" ON gallery_categories;
CREATE POLICY "gallery_categories_public_read" ON gallery_categories
  FOR SELECT USING (is_active = true);

-- gallery_items
DROP POLICY IF EXISTS "gallery_items_public_read" ON gallery_items;
CREATE POLICY "gallery_items_public_read" ON gallery_items
  FOR SELECT USING (is_published = true);


-- ════════════════════════════════════════════════════════════
-- ENQUIRIES TABLE
-- Anyone can submit (anonymous contact form + product enquiry).
-- Authenticated users can only read their own submissions.
-- ════════════════════════════════════════════════════════════

-- Anyone (anon or auth) can insert an enquiry
DROP POLICY IF EXISTS "enquiries_public_insert" ON enquiries;
CREATE POLICY "enquiries_public_insert" ON enquiries
  FOR INSERT WITH CHECK (
    -- If client_id is provided it MUST match the authenticated user.
    -- Anonymous submissions must leave client_id NULL.
    client_id IS NULL OR client_id = auth.uid()
  );

-- Authenticated users can only see their own enquiries
DROP POLICY IF EXISTS "enquiries_owner_read" ON enquiries;
CREATE POLICY "enquiries_owner_read" ON enquiries
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND client_id = auth.uid()
  );


-- ════════════════════════════════════════════════════════════
-- CLIENT PROFILES TABLE
-- Each user can only read and update their own profile row.
-- ════════════════════════════════════════════════════════════

-- Read own profile
DROP POLICY IF EXISTS "client_profiles_owner_read" ON client_profiles;
CREATE POLICY "client_profiles_owner_read" ON client_profiles
  FOR SELECT USING (id = auth.uid());

-- Insert own profile (upsert on registration)
DROP POLICY IF EXISTS "client_profiles_owner_insert" ON client_profiles;
CREATE POLICY "client_profiles_owner_insert" ON client_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Update own profile
DROP POLICY IF EXISTS "client_profiles_owner_update" ON client_profiles;
CREATE POLICY "client_profiles_owner_update" ON client_profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- No DELETE from frontend ever


-- ════════════════════════════════════════════════════════════
-- CLIENT MESSAGES TABLE
-- Users can only see their own messages.
-- INSERT is locked down: client_id, sender_id, and sender_role
-- are all enforced at the DB level — a user cannot claim
-- sender_role = 'staff' or send as a different user.
-- ════════════════════════════════════════════════════════════

-- Read own messages
DROP POLICY IF EXISTS "client_messages_owner_read" ON client_messages;
CREATE POLICY "client_messages_owner_read" ON client_messages
  FOR SELECT USING (client_id = auth.uid());

-- Send a message (strict: all identity fields must be correct)
DROP POLICY IF EXISTS "client_messages_owner_insert" ON client_messages;
CREATE POLICY "client_messages_owner_insert" ON client_messages
  FOR INSERT WITH CHECK (
    client_id   = auth.uid() AND
    sender_id   = auth.uid() AND
    sender_role = 'client'
  );

-- Mark messages as read (UPDATE only is_read, no other columns matter)
DROP POLICY IF EXISTS "client_messages_owner_update" ON client_messages;
CREATE POLICY "client_messages_owner_update" ON client_messages
  FOR UPDATE USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());

-- No DELETE from frontend ever


-- ============================================================
-- VERIFICATION — run after applying policies
-- ============================================================
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies WHERE schemaname = 'public'
-- ORDER BY tablename, cmd;
