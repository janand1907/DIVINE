ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS social_facebook  text,
  ADD COLUMN IF NOT EXISTS social_instagram text,
  ADD COLUMN IF NOT EXISTS social_twitter   text,
  ADD COLUMN IF NOT EXISTS social_youtube   text,
  ADD COLUMN IF NOT EXISTS social_linkedin  text,
  ADD COLUMN IF NOT EXISTS footer_links     jsonb NOT NULL DEFAULT '[]'::jsonb;