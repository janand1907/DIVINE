-- Make page_sections polymorphic: add entity_type, entity_id, label

ALTER TABLE page_sections DROP CONSTRAINT IF EXISTS page_sections_page_id_fkey;
ALTER TABLE page_sections RENAME COLUMN page_id TO entity_id;
ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS entity_type text NOT NULL DEFAULT 'content_page';
ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS label text;

-- Proper polymorphic index
DROP INDEX IF EXISTS page_sections_page_id_idx;
CREATE INDEX IF NOT EXISTS page_sections_entity_idx
  ON page_sections(entity_type, entity_id, is_enabled, display_order);

-- updated_at triggers (Postgres < 14 doesn't support IF NOT EXISTS for triggers)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_page_sections_touch') THEN
    CREATE TRIGGER trg_page_sections_touch BEFORE UPDATE ON page_sections
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_content_pages_touch') THEN
    CREATE TRIGGER trg_content_pages_touch BEFORE UPDATE ON content_pages
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enquiry_form_configs_touch') THEN
    CREATE TRIGGER trg_enquiry_form_configs_touch BEFORE UPDATE ON enquiry_form_configs
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END $$;
