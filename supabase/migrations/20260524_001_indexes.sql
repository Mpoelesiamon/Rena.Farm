-- Migration: Performance indexes on foreign key columns
-- Applied 2026-05-24. Postgres does not auto-create FK indexes.

CREATE INDEX IF NOT EXISTS idx_animal_images_animal_id        ON animal_images(animal_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_client_id            ON enquiries(client_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_client_id      ON client_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category_id      ON gallery_items(category_id) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_animals_listing_status         ON animals(listing_status) WHERE listing_status IN ('on_sale','booked','sold');
CREATE INDEX IF NOT EXISTS idx_product_listing_images_listing ON product_listing_images(listing_id);
