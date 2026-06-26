# Database Status & Schema

**Last Updated:** 2026-06-26

Complete inventory of all database tables, their columns, types, relationships, RLS policies, migrations, and seed data.

---

## Database Overview

**Project:** Divine Travel
**Database:** Supabase PostgreSQL
**Total Tables:** 27 confirmed
**All Tables:** RLS-enabled (Row-Level Security)
**Authentication Model:** Supabase JWT (anon + authenticated roles)

---

## Table Inventory

### 1. Theme & Branding (3 tables)

#### theme_presets
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY, default gen_random_uuid() | |
| key | text | NOT NULL, UNIQUE | Values: 'default', 'festival', 'temple', 'corporate', 'dark' |
| name | text | NOT NULL | |
| primary_color | text | NOT NULL, default '#C48A2D' | |
| secondary_color | text | NOT NULL, default '#8B1E3F' | |
| accent_color | text | NOT NULL, default '#F8F4EC' | |
| dark_color | text | NOT NULL, default '#1A1A1A' | |
| success_color | text | NOT NULL, default '#25D366' | |
| is_active | boolean | NOT NULL, default false | Only one preset active at a time |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Readable by anon + authenticated; writable by authenticated only
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Pre-seeded with 5 presets (default, festival, temple, corporate, dark)

---

#### theme_settings
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | int | PRIMARY KEY, CHECK (id = 1) | Singleton table (only one row) |
| brand_name | text | NOT NULL, default 'Divine Travel' | |
| logo_url | text | nullable | |
| whatsapp_number | text | NOT NULL, default '+919876543210' | |
| contact_phone | text | nullable | |
| contact_email | text | nullable | |
| address | text | nullable | |
| primary_color | text | NOT NULL, default '#C48A2D' | |
| secondary_color | text | NOT NULL, default '#8B1E3F' | |
| accent_color | text | NOT NULL, default '#F8F4EC' | |
| dark_color | text | NOT NULL, default '#1A1A1A' | |
| success_color | text | NOT NULL, default '#25D366' | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Readable by anon + authenticated; writable by authenticated only
**Trigger:** trg_theme_settings_touch (updates updated_at on modification)
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Auto-inserted singleton on migration

---

#### site_settings
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | int | PRIMARY KEY, CHECK (id = 1) | Singleton table |
| site_url | text | nullable | |
| default_og_image | text | nullable | Default Open Graph image |
| gtm_id | text | nullable | Google Tag Manager ID |
| ga4_id | text | nullable | Google Analytics 4 ID |
| meta_pixel_id | text | nullable | Meta Pixel ID (Facebook) |
| google_search_console_verification | text | nullable | GSC verification token |
| default_social_title | text | nullable | Default social media title |
| default_social_description | text | nullable | Default social media description |
| notifications_email | text | nullable | Email for lead notifications (not implemented) |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Readable by anon + authenticated; writable by authenticated only
**Trigger:** trg_site_settings_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Auto-inserted singleton

---

### 2. Content & Taxonomy (15 tables)

#### destinations
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | URL slug |
| name | text | NOT NULL | Display name |
| region | text | NOT NULL, CHECK (in 'divine','domestic','international') | Pilgrimage/Domestic/International |
| parent_id | uuid | FK to destinations(id), nullable | Self-referential parent |
| description | text | nullable | Full description |
| cover_image | text | nullable | Featured image URL |
| cover_video | text | nullable | Featured video URL (0001 only, not in types) |
| nav_label | text | nullable | Label for navigation menu |
| badge_text | text | nullable | Badge (e.g., "New", "Popular") |
| seo_title | text | nullable | SEO title override |
| seo_description | text | nullable | SEO meta description |
| is_published | boolean | NOT NULL, default true | Visibility control |
| display_order | int | NOT NULL, default 0 | Sort order |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** destinations_region_idx, destinations_parent_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 8 destinations (diverse regions)
**Navigation Sync:** PUT/DELETE trigger nav pool updates

---

#### package_categories
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| name | text | NOT NULL | |
| description | text | nullable | |
| parent_id | uuid | FK to package_categories(id), nullable | Hierarchical categories |
| is_published | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** package_categories_parent_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 3 categories (Adventure, Spiritual, Family)

---

#### packages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| title | text | NOT NULL | |
| subtitle | text | nullable | |
| category_id | uuid | FK to package_categories(id), nullable | |
| destination_id | uuid | FK to destinations(id), nullable | |
| destinations | text[] | NOT NULL, default '{}' | Array of destination slugs |
| duration_days | int | NOT NULL, default 0 | |
| duration_nights | int | NOT NULL, default 0 | |
| highlights | text[] | NOT NULL, default '{}' | Bullet-point highlights |
| overview | text | NOT NULL, default '' | Long-form description |
| itinerary | jsonb | NOT NULL, default '[]' | Array of {day, title, description} |
| inclusions | text[] | NOT NULL, default '{}' | What's included |
| exclusions | text[] | NOT NULL, default '{}' | What's not included |
| pricing | jsonb | NOT NULL, default '[]' | Array of {label, price, inclusions[]} |
| starting_price | numeric(12,2) | nullable | Lowest price tier |
| gallery | text[] | NOT NULL, default '{}' | Array of image URLs |
| cover_image | text | nullable | Featured image |
| faqs | jsonb | NOT NULL, default '[]' | Array of {question, answer} |
| is_featured | boolean | NOT NULL, default false | Homepage featured flag |
| is_published | boolean | NOT NULL, default false | |
| tour_type | text | nullable | E.g., "spiritual", "adventure" |
| badge_text | text | nullable | |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| canonical_path | text | nullable | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** packages_published_idx, packages_category_idx, packages_destination_idx
**Trigger:** trg_packages_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 6 packages (Varanasi, Kerala, Himalayas, etc.)

---

#### blogs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| title | text | NOT NULL | |
| excerpt | text | nullable | Summary/preview text |
| content | text | NOT NULL, default '' | Full Markdown/HTML content |
| cover_image | text | nullable | Featured image |
| category | text | nullable | Blog category (free text) |
| tags | text[] | NOT NULL, default '{}' | Blog tags for filtering |
| author | text | NOT NULL, default 'Divine Travel' | |
| reading_time_minutes | int | NOT NULL, default 1 | Auto-calculated (words / 200) |
| is_published | boolean | NOT NULL, default false | |
| published_at | timestamptz | nullable | Publication timestamp (for scheduling) |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| canonical_path | text | nullable | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read (is_published = true AND published_at <= now()); authenticated CRUD
**Indexes:** blogs_published_idx
**Trigger:** trg_blogs_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 2 blog posts (sample articles)

---

#### testimonials
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| author_name | text | NOT NULL | Customer name |
| author_location | text | nullable | City/country |
| rating | int | NOT NULL, default 5 | CHECK (1-5) |
| content | text | NOT NULL | Testimonial text |
| avatar_url | text | nullable | Profile picture URL |
| tour_taken | text | nullable | Package/tour name |
| is_published | boolean | NOT NULL, default false | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** testimonials_published_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 3 testimonials

---

#### faq_categories
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| name | text | NOT NULL | Category name (General, Booking, etc.) |
| display_order | int | NOT NULL, default 0 | |
| is_published | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 2 categories (General, Travel Safety)

---

#### faqs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| category_id | uuid | FK to faq_categories(id), nullable | |
| question | text | NOT NULL | |
| answer | text | NOT NULL | Markdown/HTML supported |
| display_order | int | NOT NULL, default 0 | |
| is_published | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** faqs_category_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 4 FAQs (sample Q&A)
**Admin UI:** Not implemented (see KNOWN_ISSUES)

---

#### gallery_items
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| title | text | NOT NULL | |
| image_url | text | NOT NULL | Image URL |
| category | text | nullable | Gallery category (e.g., "Temples", "Nature") |
| tour_slug | text | nullable | Associated tour slug |
| is_published | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** gallery_published_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Empty (no admin UI to populate)
**Note:** Defined in types but no migration or seed data

---

### 3. Leads & Interactions (2 tables)

#### leads
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| name | text | NOT NULL | Customer name |
| mobile | text | NOT NULL | Phone number |
| email | text | nullable | Email address |
| destination | text | nullable | Destination interest |
| travel_date | date | nullable | Intended travel date |
| adults | int | nullable | Number of adults |
| children | int | nullable | Number of children |
| budget | text | nullable | Budget range (free text) |
| message | text | nullable | Additional message |
| source | text | NOT NULL, CHECK (in 'contact','package-inquiry',...) | Lead source (contact, package-inquiry, quick-quote, callback, vehicle-inquiry, transfer-inquiry, hotel-assistance, blog-cta, content-page-cta) |
| package_id | uuid | FK to packages(id), nullable | |
| package_slug | text | nullable | Package slug (denormalized) |
| vehicle_id | uuid | FK to vehicles(id), nullable | Vehicle inquiry vehicle |
| route_id | uuid | FK to airport_routes(id), nullable | Transfer inquiry route |
| content_page_id | uuid | nullable | Content page source |
| module_source | text | nullable | Module name (e.g., "divine-tours") |
| form_key | text | nullable | Enquiry form config key |
| extra_data | jsonb | nullable | Custom form field data |
| hotel_data | jsonb | nullable | Hotel booking data {city, check_in, check_out, rooms, budget} |
| status | text | NOT NULL, default 'new' | CHECK (in 'new','contacted',...) |
| assigned_to | text | nullable | Admin user email |
| followup_date | date | nullable | |
| priority | text | NOT NULL, default 'medium' | CHECK (in 'low','medium','high','urgent') |
| utm_source | text | nullable | UTM tracking parameters |
| utm_medium | text | nullable | |
| utm_campaign | text | nullable | |
| utm_term | text | nullable | |
| utm_content | text | nullable | |
| landing_page | text | nullable | Referrer URL |
| notes | jsonb | NOT NULL, default '[]' | Array of {at, by, note, status_change} |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Anon + authenticated INSERT; authenticated SELECT/UPDATE/DELETE
**Indexes:** leads_status_idx, leads_assigned_idx, leads_followup_idx, leads_priority_idx
**Trigger:** trg_leads_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Empty (populated by form submissions)
**Rate Limit:** 5 per minute per IP on POST /api/leads (in-memory)

---

### 4. Media & SEO (3 tables)

#### media_assets
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| filename | text | NOT NULL | Original filename |
| url | text | NOT NULL | Supabase storage URL |
| mime_type | text | nullable | E.g., "image/jpeg" |
| size_bytes | bigint | nullable | File size in bytes |
| width | int | nullable | Image width (px) |
| height | int | nullable | Image height (px) |
| alt_text | text | nullable | Alt text for accessibility |
| uploaded_by | text | nullable | Admin user email |
| tags | text[] | NOT NULL, default '{}' | Search tags |
| module | text | nullable | Associated module (not in 0001, types only) |
| entity_id | text | nullable | Associated entity ID (not in 0001) |
| entity_type | text | nullable | Associated entity type (not in 0001) |
| folder | text | nullable | Storage folder (not in 0001) |
| asset_type | text | nullable | Type (image, video, document) (not in 0001) |
| is_published | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Indexes:** media_created_idx
**Migrations:** 0001_divine_travel_schema.sql
**Note:** Some columns in types but not in migration (module, entity_id, entity_type, folder, asset_type)
**Storage Path:** `divine-travel/{folder}/{filename}`

---

#### seo_pages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| path | text | NOT NULL, UNIQUE | Page URL path (e.g., "/packages", "/about") |
| seo_title | text | nullable | Override page title |
| seo_description | text | nullable | Override meta description |
| og_image | text | nullable | Override OG image |
| canonical_path | text | nullable | Canonical URL |
| robots_index | boolean | NOT NULL, default true | Allow search engine indexing |
| json_ld | jsonb | nullable | JSON-LD structured data |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read; authenticated CRUD
**Trigger:** trg_seo_pages_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Empty (populated on demand by admin)

---

### 5. Homepage & Navigation (4 tables)

#### homepage_sections
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| section_key | text | NOT NULL, UNIQUE | E.g., 'hero', 'featured_packages', 'testimonials' |
| is_enabled | boolean | NOT NULL, default true | Visibility toggle |
| display_order | int | NOT NULL, default 0 | Sort order on homepage |
| config | jsonb | NOT NULL, default '{}' | Section configuration (varies by type) |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read; authenticated CRUD
**Indexes:** homepage_sections_order_idx
**Trigger:** trg_homepage_sections_touch
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** 10 homepage sections (hero, trust_bar, divine_tours, etc.)
**Note:** Direct Supabase client usage in admin (architectural inconsistency)

---

#### nav_menus
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| title | text | NOT NULL | Menu name |
| url | text | NOT NULL | Menu link URL |
| icon | text | nullable | Icon class (Font Awesome, etc.) |
| pool_entity_id | uuid | nullable | FK reference to module_nav_pool(id) |
| open_in_new_tab | boolean | NOT NULL, default false | |
| display_order | int | NOT NULL, default 0 | |
| is_active | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Authenticated CRUD only (no public read)
**Migrations:** 0002_fix_page_sections_polymorphic.sql (added in migration 2)
**Seed Data:** Main, Footer (2 top-level menus)

---

#### nav_items
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| menu_id | uuid | FK to nav_menus(id) | Parent menu |
| parent_id | uuid | FK to nav_items(id), nullable | Parent item (hierarchical) |
| title | text | NOT NULL | Item label |
| url | text | NOT NULL | Item link URL |
| description | text | nullable | Hover tooltip |
| icon | text | nullable | Icon class |
| badge_text | text | nullable | Badge (e.g., "New") |
| pool_entity_id | uuid | nullable | FK reference to module_nav_pool(id) |
| open_in_new_tab | boolean | NOT NULL, default false | |
| display_order | int | NOT NULL, default 0 | |
| is_active | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Authenticated CRUD only
**Migrations:** 0002_fix_page_sections_polymorphic.sql
**Seed Data:** 20+ menu items (Packages, Tours, Gallery, etc.)

---

#### module_nav_pool
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| module | text | NOT NULL | Module name (destinations, vehicles, etc.) |
| entity_type | text | NOT NULL | Entity type (destination, package, vehicle, etc.) |
| entity_id | uuid | NOT NULL | Reference to actual entity |
| label | text | NOT NULL | Display label |
| url | text | NOT NULL | Entity URL path |
| cover_image | text | nullable | Entity image |
| badge_text | text | nullable | Badge |
| is_published | boolean | NOT NULL, default true | |
| updated_at | timestamptz | NOT NULL, default now() | |

**RLS:** Authenticated read only (synced automatically)
**Migrations:** 0002_fix_page_sections_polymorphic.sql
**Note:** Read-only to admin; populated by API sync operations (destinations, vehicles, vehicle_categories on create/update/delete)
**Sync Triggers:** PUT/DELETE on destinations, vehicles, vehicle_categories call upsertNavPool() / removeNavPool()

---

### 6. Activity Logs (1 table)

#### activity_logs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| user_email | text | nullable | Admin user email |
| action | text | NOT NULL | Action type (create, update, delete, publish, etc.) |
| entity | text | NOT NULL | Entity type (blog, package, lead, etc.) |
| entity_id | text | nullable | Entity ID affected |
| metadata | jsonb | nullable | Custom action metadata |
| ip | text | nullable | User IP address |
| user_agent | text | nullable | Browser user agent |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Authenticated SELECT/INSERT only (no UPDATE/DELETE)
**Indexes:** activity_created_idx, activity_entity_idx
**Migrations:** 0001_divine_travel_schema.sql
**Seed Data:** Empty (populated on admin actions)

---

### 7. Content Pages & Sections (2 tables)

#### content_pages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | URL slug |
| title | text | NOT NULL | Page title |
| page_type | text | NOT NULL | Page type (tour, vehicle, etc.) |
| module | text | nullable | Associated module |
| entity_id | uuid | nullable | Associated entity ID |
| entity_type | text | nullable | Associated entity type |
| is_published | boolean | NOT NULL, default false | |
| display_order | int | NOT NULL, default 0 | |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| canonical_path | text | nullable | |
| robots_index | boolean | NOT NULL, default true | |
| schema_type | text | NOT NULL, default 'WebPage' | JSON-LD schema type |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read (is_published = true); authenticated CRUD
**Trigger:** trg_content_pages_touch
**Migrations:** 0002_fix_page_sections_polymorphic.sql
**Seed Data:** 4 content pages (About, Contact, Privacy, Terms)

---

#### page_sections
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| entity_type | text | NOT NULL | (content_page, destination, vehicle, package, route, blog, global) |
| entity_id | uuid | NOT NULL | Reference to actual entity |
| section_type | text | NOT NULL | (hero_banner, rich_text, package_grid, ..., 22 types total) |
| label | text | nullable | Admin label |
| config | jsonb | NOT NULL | Section configuration (polymorphic) |
| is_enabled | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read; authenticated CRUD
**Indexes:** page_sections_entity_idx
**Trigger:** trg_page_sections_touch
**Migrations:** 0002_fix_page_sections_polymorphic.sql
**Seed Data:** 26 page sections (seeded in 0003_seed_content_pages.sql)
**Polymorphic Design:** Sections can be attached to any entity type (content pages, destinations, etc.)

---

### 8. CMS Pages (Legacy) (1 table)

#### cms_pages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| title | text | NOT NULL | |
| page_type | text | NOT NULL, CHECK (in 'tour','vehicle','transfer','general','seo') | |
| hero_heading | text | nullable | |
| hero_subheading | text | nullable | |
| hero_image | text | nullable | |
| content | text | NOT NULL | |
| gallery | text[] | NOT NULL, default '{}' | |
| faqs | jsonb | NOT NULL, default '[]' | Array of {question, answer} |
| cta_text | text | nullable | Call-to-action text |
| cta_url | text | nullable | CTA URL |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| canonical_path | text | nullable | |
| is_published | boolean | NOT NULL, default false | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Public read (is_published = true); authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql (defined but not heavily used in current schema)
**Status:** Deprecated in favor of content_pages + page_sections
**UI:** Hidden from admin sidebar (API routes remain)

---

### 9. Vehicle Rentals (2 tables, 2 missing)

#### vehicle_categories
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| name | text | NOT NULL | E.g., "SUV", "Sedan", "Bus" |
| description | text | nullable | |
| display_order | int | NOT NULL, default 0 | |
| is_published | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql (migration shows 0004_seed_demo_data)
**Seed Data:** 4 categories (SUV, Sedan, Bus, Tempo Traveller)
**Navigation Sync:** PUT/DELETE call upsertNavPool() / removeNavPool()

---

#### vehicles
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| name | text | NOT NULL | Vehicle name |
| category_id | uuid | FK to vehicle_categories(id), nullable | |
| seats | int | NOT NULL | Seating capacity |
| luggage_capacity | int | NOT NULL | Luggage pieces |
| price_per_km | numeric | nullable | Pricing model 1 |
| price_per_day | numeric | nullable | Pricing model 2 |
| starting_price | numeric | nullable | Lowest price |
| images | text[] | NOT NULL, default '{}' | Gallery images |
| cover_image | text | nullable | Featured image |
| description | text | NOT NULL | Full description |
| features | text[] | NOT NULL, default '{}' | Vehicle features (GPS, WiFi, etc.) |
| is_ac | boolean | NOT NULL, default true | Air-conditioned |
| is_featured | boolean | NOT NULL, default false | Homepage featured |
| is_published | boolean | NOT NULL, default false | |
| fuel_type | text | nullable | E.g., "Diesel", "Petrol" |
| transmission | text | nullable | E.g., "Automatic", "Manual" |
| badge_text | text | nullable | |
| video_url | text | nullable | Promotional video |
| availability_note | text | nullable | Availability message |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql (seeded in 0004)
**Seed Data:** 4 vehicles (Innova Crysta, Swift, etc.)

---

#### vehicle_pricing (Type-Only, No Migration)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| vehicle_id | uuid | FK to vehicles(id) | |
| pricing_type | text | NOT NULL | E.g., "hourly", "daily", "km-based" |
| label | text | NOT NULL | Display label |
| base_price | numeric | NOT NULL | |
| included_km | int | nullable | Included kilometers |
| included_hours | int | nullable | Included hours |
| extra_per_km | numeric | nullable | Extra per km beyond included |
| extra_per_hour | numeric | nullable | Extra per hour |
| is_active | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |

**Status:** Defined in types/database.ts but NO CONFIRMED MIGRATION
**Note:** May be created in 0001, but not explicitly confirmed in reviewed migration files
**Admin UI:** Not implemented (see KNOWN_ISSUES #7)
**Workaround:** Pricing stored in vehicle record (price_per_km, price_per_day, starting_price)

---

### 10. Airport Transfers (1 table, 2 missing)

#### airport_routes
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| from_city | text | NOT NULL | Departure city |
| to_city | text | NOT NULL | Destination city |
| distance_km | int | nullable | Route distance |
| duration_hours | numeric | nullable | Estimated travel time |
| vehicles | jsonb | NOT NULL, default '[]' | Array of {vehicle_type, seats, price} |
| description | text | nullable | Route description |
| pickup_area | text | nullable | Pickup location details |
| drop_area | text | nullable | Dropoff location details |
| route_type | text | NOT NULL, default 'airport' | Route category |
| is_return_available | boolean | NOT NULL, default false | Return trip available |
| popular_rank | int | nullable | Popularity ranking |
| cover_image | text | nullable | Route image |
| content | text | nullable | HTML/Markdown content |
| is_active | boolean | NOT NULL, default true | |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| og_image | text | nullable | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read; authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql (seeded in 0004)
**Seed Data:** 3 airport routes (Delhi-Agra, Mumbai-Goa, etc.)
**Vehicles Format:** Array of `{ vehicle_type: string, seats: number, price: number }`

---

#### transfer_vehicle_types (Type-Only, No Migration)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| name | text | NOT NULL | E.g., "Sedan", "SUV", "Bus" |
| seats | int | NOT NULL | |
| luggage_pieces | int | nullable | |
| image | text | nullable | Vehicle image |
| description | text | nullable | |
| is_active | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |

**Status:** Defined in types but NO CONFIRMED MIGRATION
**Note:** Vehicle types for transfers (separate from vehicle_categories)

---

#### transfer_pricing (Type-Only, No Migration)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| route_id | uuid | FK to airport_routes(id) | |
| vehicle_type_id | uuid | FK to transfer_vehicle_types(id) | |
| base_price | numeric | NOT NULL | |
| return_price | numeric | nullable | Return trip price |
| extra_per_km | numeric | nullable | Extra charge per km |
| toll_extra | numeric | nullable | Toll charges |
| waiting_charge_per_hour | numeric | nullable | Waiting charge |
| night_surcharge | numeric | nullable | Night/early morning surcharge |
| is_active | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |

**Status:** Defined in types but NO CONFIRMED MIGRATION
**Admin UI:** Not implemented (see KNOWN_ISSUES #8)
**Workaround:** Pricing hardcoded in airport_routes.vehicles array

---

### 11. Enquiry Forms & Hotels (2 tables)

#### enquiry_form_configs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| form_key | text | NOT NULL, UNIQUE | Identifier (e.g., 'package_inquiry', 'quick_quote') |
| title | text | NOT NULL | Form title |
| description | text | nullable | Form description |
| submit_label | text | NOT NULL, default 'Submit' | Button text |
| success_message | text | NOT NULL, default 'Thank you!' | Success message |
| lead_source | text | NOT NULL | Lead source tag |
| lead_priority | text | NOT NULL, default 'medium' | Auto-assign priority |
| module | text | nullable | Associated module |
| notify_email | text | nullable | Email for notifications (not implemented) |
| whatsapp_template | text | nullable | WhatsApp template (not implemented) |
| fields | jsonb | NOT NULL | Array of {key, label, type, required, placeholder?, options?, min?, max?} |
| is_active | boolean | NOT NULL, default true | |
| created_at | timestamptz | NOT NULL, default now() | |
| updated_at | timestamptz | NOT NULL, default now() | Updated by trigger |

**RLS:** Authenticated CRUD only
**Trigger:** trg_enquiry_form_configs_touch
**Migrations:** 0002_fix_page_sections_polymorphic.sql
**Seed Data:** 3 form configs (quick_quote, package_inquiry, vehicle_inquiry) seeded in 0005
**Field Types:** text, email, tel, number, date, select, textarea
**Note:** Forms use config but EnquiryForm section component has hardcoded defaults (KNOWN_ISSUES #3)

---

#### hotel_cities
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PRIMARY KEY | |
| slug | text | NOT NULL, UNIQUE | |
| name | text | NOT NULL | City name |
| state | text | nullable | State/region |
| region | text | nullable | Geographic region |
| cover_image | text | nullable | City image |
| description | text | nullable | City description |
| is_published | boolean | NOT NULL, default true | |
| display_order | int | NOT NULL, default 0 | |
| seo_title | text | nullable | |
| seo_description | text | nullable | |
| created_at | timestamptz | NOT NULL, default now() | |

**RLS:** Public read (is_published = true); authenticated CRUD
**Migrations:** 0001_divine_travel_schema.sql (table referenced in types but not explicitly in 0001)
**Seed Data:** 5 cities (Delhi, Mumbai, Goa, Bangalore, Agra) seeded in 0005
**Public API:** GET /api/hotel-cities (no auth required)

---

## Migrations Applied

| File | Timestamp | Purpose | Tables Added/Modified |
|------|-----------|---------|----------------------|
| 0001_divine_travel_schema.sql | 20260623072331 | Phase 1 complete schema | 16 tables (theme, destinations, packages, blogs, leads, media, seo_pages, homepage_sections, activity_logs, + 6 more) |
| 0002_fix_page_sections_polymorphic.sql | 20260626074717 | Add polymorphic sections & navigation | page_sections, content_pages, nav_menus, nav_items, module_nav_pool, enquiry_form_configs, hotel_cities |
| 0003_seed_content_pages.sql | 20260626082420 | Seed content pages & sections | 4 content pages + 26 page sections |
| 0004_seed_demo_data.sql | 20260626084442 | Seed demo entities | 8 destinations, 6 packages, 2 blogs, 3 testimonials, 4 vehicles, 4 categories, 3 routes, 2 FAQs |
| 0005_seed_enquiry_form_configs_and_hotel_cities.sql | 20260626121520 | Seed forms & hotel data | 3 enquiry form configs, 5 hotel cities |

---

## Row-Level Security (RLS) Summary

| Table | Anon Read | Anon Insert | Anon Update | Auth CRUD | Notes |
|-------|-----------|------------|------------|----------|-------|
| theme_presets | ✓ | ✗ | ✗ | ✓ | |
| theme_settings | ✓ | ✗ | ✗ | ✓ | Singleton |
| site_settings | ✓ | ✗ | ✗ | ✓ | Singleton |
| destinations | Published only | ✗ | ✗ | ✓ | |
| package_categories | Published only | ✗ | ✗ | ✓ | |
| packages | Published only | ✗ | ✗ | ✓ | |
| blogs | Published only (+ time-gated) | ✗ | ✗ | ✓ | |
| testimonials | Published only | ✗ | ✗ | ✓ | |
| faq_categories | Published only | ✗ | ✗ | ✓ | |
| faqs | Published only | ✗ | ✗ | ✓ | |
| gallery_items | Published only | ✗ | ✗ | ✓ | |
| media_assets | Published only | ✗ | ✗ | ✓ | |
| leads | ✗ | ✓ | ✗ | ✓ (all ops) | Public INSERT only |
| seo_pages | ✓ | ✗ | ✗ | ✓ | |
| homepage_sections | ✓ | ✗ | ✗ | ✓ | |
| activity_logs | ✗ | ✗ | ✗ | ✓ (select+insert) | Admin-only audit |
| nav_menus | ✗ | ✗ | ✗ | ✓ | Admin-only |
| nav_items | ✗ | ✗ | ✗ | ✓ | Admin-only |
| module_nav_pool | ✗ (read-only) | ✗ | ✗ | ✓ (read) | Synced automatically |
| content_pages | Published only | ✗ | ✗ | ✓ | |
| page_sections | ✓ | ✗ | ✗ | ✓ | |
| cms_pages | Published only | ✗ | ✗ | ✓ | Legacy |
| vehicle_categories | Published only | ✗ | ✗ | ✓ | |
| vehicles | Published only | ✗ | ✗ | ✓ | |
| airport_routes | ✓ | ✗ | ✗ | ✓ | |
| enquiry_form_configs | ✗ | ✗ | ✗ | ✓ | Admin-only |
| hotel_cities | Published only | ✗ | ✗ | ✓ | |

**Legend:** ✓ = Allowed | ✗ = Denied

---

## Seed Data Summary

| Table | Count | Source |
|-------|-------|--------|
| theme_presets | 5 | 0001 (hardcoded) |
| theme_settings | 1 | 0001 (singleton) |
| site_settings | 1 | 0001 (singleton) |
| homepage_sections | 10 | 0001 (hardcoded) |
| destinations | 8 | 0004 |
| package_categories | 3 | 0004 |
| packages | 6 | 0004 |
| blogs | 2 | 0004 |
| testimonials | 3 | 0004 |
| faq_categories | 2 | 0004 |
| faqs | 4 | 0004 |
| vehicle_categories | 4 | 0004 |
| vehicles | 4 | 0004 |
| airport_routes | 3 | 0004 |
| enquiry_form_configs | 3 | 0005 |
| hotel_cities | 5 | 0005 |
| content_pages | 4 | 0003 |
| page_sections | 26 | 0003 |
| **Total** | **98** | — |

---

## Type-Only Tables (No Confirmed Migration)

The following tables are defined in `types/database.ts` but have no confirmed migration files:

| Table | Type Defined | Likely Status |
|-------|--------------|---------------|
| vehicle_pricing | VehiclePricingRow | May be in 0001 but not reviewed; no admin UI |
| transfer_pricing | TransferPricingRow | Type-only; no migration found; no admin UI |
| transfer_vehicle_types | TransferVehicleTypeRow | Type-only; no migration found; no admin UI |

**Action Items:**
1. Verify if vehicle_pricing was created in 0001 (not explicitly shown)
2. Create migrations for transfer_pricing and transfer_vehicle_types or remove from types
3. Implement admin UIs for vehicle_pricing and transfer_pricing (#7, #8 in KNOWN_ISSUES)

---

## Database Constraints & Triggers

| Trigger | Table | Function | Event |
|---------|-------|----------|-------|
| trg_theme_settings_touch | theme_settings | touch_updated_at() | BEFORE UPDATE |
| trg_site_settings_touch | site_settings | touch_updated_at() | BEFORE UPDATE |
| trg_packages_touch | packages | touch_updated_at() | BEFORE UPDATE |
| trg_blogs_touch | blogs | touch_updated_at() | BEFORE UPDATE |
| trg_leads_touch | leads | touch_updated_at() | BEFORE UPDATE |
| trg_seo_pages_touch | seo_pages | touch_updated_at() | BEFORE UPDATE |
| trg_homepage_sections_touch | homepage_sections | touch_updated_at() | BEFORE UPDATE |
| trg_page_sections_touch | page_sections | touch_updated_at() | BEFORE UPDATE |
| trg_content_pages_touch | content_pages | touch_updated_at() | BEFORE UPDATE |
| trg_enquiry_form_configs_touch | enquiry_form_configs | touch_updated_at() | BEFORE UPDATE |

**Function:** Sets `updated_at = now()` on UPDATE

**Additional Constraints:**
- theme_settings: CHECK (id = 1)
- site_settings: CHECK (id = 1)
- destinations: CHECK (region in ('divine','domestic','international'))
- rating (testimonials): CHECK (rating between 1 and 5)
- lead source: CHECK (source in ('contact','package-inquiry',..9 more))
- lead status: CHECK (status in ('new','contacted','quoted','negotiation','confirmed','lost'))
- lead priority: CHECK (priority in ('low','medium','high','urgent'))
- cms_pages: CHECK (page_type in ('tour','vehicle','transfer','general','seo'))

---

## Summary

- **Total Tables:** 27 (24 confirmed + 3 type-only)
- **All Tables:** RLS-enabled
- **Migrations:** 5 files (0001-0005)
- **Total Policies:** 65+ RLS policies
- **Seed Data Rows:** 98+ initial records
- **Foreign Keys:** 15+
- **Indexes:** 20+
- **Triggers:** 10 updated_at triggers

**Next Steps for Completeness:**
1. Verify vehicle_pricing migration existence
2. Create transfer_pricing and transfer_vehicle_types migrations
3. Implement missing admin UIs (#5, #6, #7, #8 in KNOWN_ISSUES)
4. Add rate limiting to public API endpoints
