
-- Popular Taxi Routes: categories + route links
CREATE TABLE popular_route_categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  display_order int  NOT NULL DEFAULT 0,
  is_visible    boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE popular_routes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  uuid NOT NULL REFERENCES popular_route_categories(id) ON DELETE CASCADE,
  label        text NOT NULL,
  url          text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX popular_routes_category_idx ON popular_routes(category_id);

-- Tariff table
CREATE TABLE tariff_entries (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle           text NOT NULL,
  seats             int,
  price_4h_40km     numeric,
  price_8h_80km     numeric,
  extra_per_km      numeric,
  extra_per_hour    numeric,
  outstation_price  numeric,
  driver_bata       numeric,
  display_order     int NOT NULL DEFAULT 0,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- RLS: read-only for public (anon + authenticated), full control for authenticated
ALTER TABLE popular_route_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_routes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_entries           ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "select_popular_route_categories" ON popular_route_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "select_popular_routes" ON popular_routes
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "select_tariff_entries" ON tariff_entries
  FOR SELECT TO anon, authenticated USING (true);

-- Admin write
CREATE POLICY "insert_popular_route_categories" ON popular_route_categories
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_popular_route_categories" ON popular_route_categories
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_popular_route_categories" ON popular_route_categories
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "insert_popular_routes" ON popular_routes
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_popular_routes" ON popular_routes
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_popular_routes" ON popular_routes
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "insert_tariff_entries" ON tariff_entries
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_tariff_entries" ON tariff_entries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_tariff_entries" ON tariff_entries
  FOR DELETE TO authenticated USING (true);
