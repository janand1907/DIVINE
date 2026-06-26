CREATE TABLE IF NOT EXISTS admin_invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text UNIQUE NOT NULL DEFAULT substr(md5(gen_random_uuid()::text), 1, 32),
  created_by  text NOT NULL,
  email_hint  text,
  used_at     timestamptz,
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_only" ON admin_invites FOR ALL TO service_role USING (true) WITH CHECK (true);