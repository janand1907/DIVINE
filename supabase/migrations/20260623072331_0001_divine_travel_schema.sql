-- Divine Travel — Phase 1 schema
-- All tables RLS-enabled; public SELECT on published rows only; CRUD for authenticated.
-- Lead INSERT is open to anon (public forms), all other writes restricted to authenticated.

-- ============================================================
-- THEME & BRANDING
-- ============================================================
create table theme_presets (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  primary_color text not null default '#C48A2D',
  secondary_color text not null default '#8B1E3F',
  accent_color text not null default '#F8F4EC',
  dark_color text not null default '#1A1A1A',
  success_color text not null default '#25D366',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table theme_settings (
  id int primary key default 1,
  brand_name text not null default 'Divine Travel',
  logo_url text,
  whatsapp_number text not null default '+919876543210',
  contact_phone text,
  contact_email text,
  address text,
  primary_color text not null default '#C48A2D',
  secondary_color text not null default '#8B1E3F',
  accent_color text not null default '#F8F4EC',
  dark_color text not null default '#1A1A1A',
  success_color text not null default '#25D366',
  updated_at timestamptz not null default now()
);
alter table theme_settings add constraint theme_settings_singleton check (id = 1);

-- ============================================================
-- GLOBAL SITE SETTINGS
-- ============================================================
create table site_settings (
  id int primary key default 1,
  site_url text,
  default_og_image text,
  gtm_id text,
  ga4_id text,
  meta_pixel_id text,
  google_search_console_verification text,
  default_social_title text,
  default_social_description text,
  notifications_email text,
  updated_at timestamptz not null default now()
);
alter table site_settings add constraint site_settings_singleton check (id = 1);

-- ============================================================
-- TAXONOMIES
-- ============================================================
create table destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text not null check (region in ('divine','domestic','international')),
  parent_id uuid references destinations(id) on delete set null,
  description text,
  cover_image text,
  seo_title text,
  seo_description text,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index destinations_region_idx on destinations(region) where is_published = true;
create index destinations_parent_idx on destinations(parent_id);

create table package_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  parent_id uuid references package_categories(id) on delete set null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index package_categories_parent_idx on package_categories(parent_id);

create table faq_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references faq_categories(id) on delete set null,
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index faqs_category_idx on faqs(category_id);

-- ============================================================
-- CONTENT
-- ============================================================
create table packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  category_id uuid references package_categories(id) on delete set null,
  destination_id uuid references destinations(id) on delete set null,
  destinations text[] not null default '{}',
  duration_days int not null default 0,
  duration_nights int not null default 0,
  highlights text[] not null default '{}',
  overview text not null default '',
  itinerary jsonb not null default '[]',
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  pricing jsonb not null default '[]',
  starting_price numeric(12,2),
  gallery text[] not null default '{}',
  cover_image text,
  faqs jsonb not null default '[]',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  seo_title text,
  seo_description text,
  og_image text,
  canonical_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index packages_published_idx on packages(is_published, is_featured);
create index packages_category_idx on packages(category_id) where is_published = true;
create index packages_destination_idx on packages(destination_id) where is_published = true;

create table blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image text,
  category text,
  tags text[] not null default '{}',
  author text not null default 'Divine Travel',
  reading_time_minutes int not null default 1,
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  og_image text,
  canonical_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index blogs_published_idx on blogs(is_published, published_at desc);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_location text,
  rating int not null default 5 check (rating between 1 and 5),
  content text not null,
  avatar_url text,
  tour_taken text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
create index testimonials_published_idx on testimonials(is_published, created_at desc);

create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  category text,
  tour_slug text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index gallery_published_idx on gallery_items(is_published, created_at desc);

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  url text not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_text text,
  uploaded_by text,
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index media_created_idx on media_assets(created_at desc);

-- ============================================================
-- LEADS
-- ============================================================
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  destination text,
  travel_date date,
  adults int,
  children int,
  budget text,
  message text,
  source text not null default 'contact' check (source in ('contact','package-inquiry','quick-quote','callback')),
  package_id uuid references packages(id) on delete set null,
  package_slug text,
  status text not null default 'new' check (status in ('new','contacted','quoted','negotiation','confirmed','lost')),
  assigned_to text,
  followup_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  landing_page text,
  notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_status_idx on leads(status, created_at desc);
create index leads_assigned_idx on leads(assigned_to) where assigned_to is not null;
create index leads_followup_idx on leads(followup_date) where followup_date is not null;
create index leads_priority_idx on leads(priority, created_at desc);

-- ============================================================
-- SEO PAGES
-- ============================================================
create table seo_pages (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  seo_title text,
  seo_description text,
  og_image text,
  canonical_path text,
  robots_index boolean not null default true,
  json_ld jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- HOMEPAGE BUILDER
-- ============================================================
create table homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  is_enabled boolean not null default true,
  display_order int not null default 0,
  config jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create index homepage_sections_order_idx on homepage_sections(display_order);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index activity_created_idx on activity_logs(created_at desc);
create index activity_entity_idx on activity_logs(entity, entity_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at := now(); return new; end;
$$ language plpgsql;

create trigger trg_theme_settings_touch before update on theme_settings
  for each row execute function touch_updated_at();
create trigger trg_site_settings_touch before update on site_settings
  for each row execute function touch_updated_at();
create trigger trg_packages_touch before update on packages
  for each row execute function touch_updated_at();
create trigger trg_blogs_touch before update on blogs
  for each row execute function touch_updated_at();
create trigger trg_leads_touch before update on leads
  for each row execute function touch_updated_at();
create trigger trg_seo_pages_touch before update on seo_pages
  for each row execute function touch_updated_at();
create trigger trg_homepage_sections_touch before update on homepage_sections
  for each row execute function touch_updated_at();

-- ============================================================
-- RLS — enable on all tables
-- ============================================================
alter table theme_presets enable row level security;
alter table theme_settings enable row level security;
alter table site_settings enable row level security;
alter table destinations enable row level security;
alter table package_categories enable row level security;
alter table packages enable row level security;
alter table blogs enable row level security;
alter table testimonials enable row level security;
alter table faq_categories enable row level security;
alter table faqs enable row level security;
alter table gallery_items enable row level security;
alter table media_assets enable row level security;
alter table leads enable row level security;
alter table seo_pages enable row level security;
alter table homepage_sections enable row level security;
alter table activity_logs enable row level security;

-- ============================================================
-- PUBLIC READ POLICIES (published rows visible to anon)
-- ============================================================
create policy "read_active_theme_presets" on theme_presets for select
  to anon, authenticated using (true);
create policy "read_theme_settings" on theme_settings for select
  to anon, authenticated using (true);
create policy "read_site_settings" on site_settings for select
  to anon, authenticated using (true);
create policy "read_published_destinations" on destinations for select
  to anon, authenticated using (is_published = true);
create policy "read_published_categories" on package_categories for select
  to anon, authenticated using (is_published = true);
create policy "read_published_packages" on packages for select
  to anon, authenticated using (is_published = true);
create policy "read_published_blogs" on blogs for select
  to anon, authenticated using (is_published = true and (published_at is null or published_at <= now()));
create policy "read_published_testimonials" on testimonials for select
  to anon, authenticated using (is_published = true);
create policy "read_published_faq_categories" on faq_categories for select
  to anon, authenticated using (is_published = true);
create policy "read_published_faqs" on faqs for select
  to anon, authenticated using (is_published = true);
create policy "read_published_gallery" on gallery_items for select
  to anon, authenticated using (is_published = true);
create policy "read_published_media" on media_assets for select
  to anon, authenticated using (is_published = true);
create policy "read_seo_pages" on seo_pages for select
  to anon, authenticated using (true);
create policy "read_homepage_sections" on homepage_sections for select
  to anon, authenticated using (true);

-- ============================================================
-- LEAD INSERT (public — anonymous form submissions)
-- All other lead operations restricted to authenticated.
-- ============================================================
create policy "anon_insert_leads" on leads for insert
  to anon, authenticated with check (true);
create policy "auth_select_leads" on leads for select
  to authenticated using (true);
create policy "auth_update_leads" on leads for update
  to authenticated using (true) with check (true);
create policy "auth_delete_leads" on leads for delete
  to authenticated using (true);

-- ============================================================
-- AUTHENTICATED CRUD POLICIES (admin only)
-- ============================================================
-- Theme
create policy "auth_update_theme_presets" on theme_presets for update to authenticated using (true) with check (true);
create policy "auth_insert_theme_presets" on theme_presets for insert to authenticated with check (true);
create policy "auth_delete_theme_presets" on theme_presets for delete to authenticated using (true);
create policy "auth_update_theme_settings" on theme_settings for update to authenticated using (true) with check (true);

-- Site settings
create policy "auth_update_site_settings" on site_settings for update to authenticated using (true) with check (true);

-- Destinations
create policy "auth_insert_destinations" on destinations for insert to authenticated with check (true);
create policy "auth_update_destinations" on destinations for update to authenticated using (true) with check (true);
create policy "auth_delete_destinations" on destinations for delete to authenticated using (true);

-- Categories
create policy "auth_insert_categories" on package_categories for insert to authenticated with check (true);
create policy "auth_update_categories" on package_categories for update to authenticated using (true) with check (true);
create policy "auth_delete_categories" on package_categories for delete to authenticated using (true);

-- Packages
create policy "auth_insert_packages" on packages for insert to authenticated with check (true);
create policy "auth_update_packages" on packages for update to authenticated using (true) with check (true);
create policy "auth_delete_packages" on packages for delete to authenticated using (true);

-- Blogs
create policy "auth_insert_blogs" on blogs for insert to authenticated with check (true);
create policy "auth_update_blogs" on blogs for update to authenticated using (true) with check (true);
create policy "auth_delete_blogs" on blogs for delete to authenticated using (true);

-- Testimonials
create policy "auth_insert_testimonials" on testimonials for insert to authenticated with check (true);
create policy "auth_update_testimonials" on testimonials for update to authenticated using (true) with check (true);
create policy "auth_delete_testimonials" on testimonials for delete to authenticated using (true);

-- Faq categories
create policy "auth_insert_faq_categories" on faq_categories for insert to authenticated with check (true);
create policy "auth_update_faq_categories" on faq_categories for update to authenticated using (true) with check (true);
create policy "auth_delete_faq_categories" on faq_categories for delete to authenticated using (true);

-- Faqs
create policy "auth_insert_faqs" on faqs for insert to authenticated with check (true);
create policy "auth_update_faqs" on faqs for update to authenticated using (true) with check (true);
create policy "auth_delete_faqs" on faqs for delete to authenticated using (true);

-- Gallery
create policy "auth_insert_gallery" on gallery_items for insert to authenticated with check (true);
create policy "auth_update_gallery" on gallery_items for update to authenticated using (true) with check (true);
create policy "auth_delete_gallery" on gallery_items for delete to authenticated using (true);

-- Media
create policy "auth_insert_media" on media_assets for insert to authenticated with check (true);
create policy "auth_update_media" on media_assets for update to authenticated using (true) with check (true);
create policy "auth_delete_media" on media_assets for delete to authenticated using (true);

-- SEO pages
create policy "auth_insert_seo_pages" on seo_pages for insert to authenticated with check (true);
create policy "auth_update_seo_pages" on seo_pages for update to authenticated using (true) with check (true);
create policy "auth_delete_seo_pages" on seo_pages for delete to authenticated using (true);

-- Homepage sections
create policy "auth_insert_homepage_sections" on homepage_sections for insert to authenticated with check (true);
create policy "auth_update_homepage_sections" on homepage_sections for update to authenticated using (true) with check (true);
create policy "auth_delete_homepage_sections" on homepage_sections for delete to authenticated using (true);

-- Activity logs (insert + select by authenticated only — protected)
create policy "auth_select_activity_logs" on activity_logs for select to authenticated using (true);
create policy "auth_insert_activity_logs" on activity_logs for insert to authenticated with check (true);

-- ============================================================
-- SINGLETON SEEDS
-- ============================================================
insert into theme_settings (id) values (1) on conflict do nothing;
insert into site_settings (id) values (1) on conflict do nothing;
