ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS footer_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_tagline text DEFAULT NULL;
