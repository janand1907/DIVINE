# API Reference

**Last Updated:** 2026-06-26

Complete documentation of all API endpoints organized by domain. All admin endpoints require authentication via Supabase session token.

---

## 1. Public Endpoints (No Auth Required)

### Leads — Create Lead

| Method | Route | Auth | Purpose | Key Request Fields | Response |
|--------|-------|------|---------|-------------------|----------|
| **POST** | `/api/leads` | None (rate-limited) | Submit enquiry/lead from public form | `name` (string), `mobile` (string), `email` (string, opt), `source` (enum), `package_id` (uuid, opt), `destination` (string, opt), `travel_date` (date, opt), `adults` (int, opt), `children` (int, opt), `budget` (string, opt), `message` (string, opt) | `{ id, name, mobile, email, source, created_at, ... }` (LeadRow) |
| **GET** | `/api/hotel-cities` | None | Fetch all published hotel cities for dropdowns | — | `[ { id, name, slug, cover_image, ... } ]` (HotelCityRow[]) |
| **POST** | `/api/callback` | None | Callback request handler (lead creation variant) | `name`, `mobile`, `phone`, `email`, `destination`, `tour_type`, `travel_date`, `message` | `{ id, created_at, ... }` (LeadRow) |
| **POST** | `/api/activity-log` | None | Client-side activity ingestion | `action` (string), `entity` (string), `entityId` (string, opt), `metadata` (object, opt) | `{ success: true }` |

**Rate Limiting on /api/leads:** 5 requests per minute per IP (in-memory, non-persistent)

---

## 2. Authentication

Supabase-managed authentication. No dedicated API routes; handled by Supabase middleware.

| Action | Method | Route | Auth | Purpose |
|--------|--------|-------|------|---------|
| **Admin Login** | POST | (handled by Supabase UI/client) | None | Admin user login via email + password |
| **Admin Logout** | POST | (client-side) | Required | Sign out (see `lib/admin/auth-client.ts`) |
| **Check Session** | GET | (middleware.ts) | — | Edge middleware validates admin auth on `/admin/*` routes |

**Auth Flow:**
1. Admin visits `/admin/login`
2. User enters email + password
3. Supabase authenticates and sets session token in cookies
4. Middleware (`middleware.ts`) validates token on protected routes
5. Admin can access `/admin/(protected)/*` routes

---

## 3. Leads & Enquiries

### Leads — List & CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/leads` | Required | (Not implemented; use page-level filters) | — | — |
| **POST** | `/api/admin/leads` | Required | (Leads created via `/api/leads` public endpoint) | — | — |
| **GET** | `/api/admin/leads/[id]` | Required | (Not standard; use page UI) | — | — |
| **PUT** | `/api/admin/leads/[id]` | Required | Update lead (status, priority, notes, assignment) | `{ status?, priority?, assigned_to?, notes?, followup_date? }` | `{ id, ... }` (updated LeadRow) |
| **DELETE** | `/api/admin/leads/[id]` | Required | Delete lead | — | `{ success: true }` |

**Notes:** Lead management is primarily UI-driven in `/admin/leads/page.tsx` using kanban + table views. Bulk actions (change status, assign, delete) go through this UI, which calls individual update endpoints.

---

### Enquiry Form Configs — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/enquiry-form-configs` | Required | List all enquiry form configs | — | `[ { id, form_key, title, fields, ... } ]` (EnquiryFormConfigRow[]) |
| **POST** | `/api/admin/enquiry-form-configs` | Required | Create enquiry form config | `{ form_key, title, description?, fields, submit_label, success_message, lead_source, lead_priority, notify_email?, whatsapp_template? }` | `{ id, form_key, ... }` (created row) |
| **GET** | `/api/admin/enquiry-form-configs/[id]` | Required | Get single config | — | `{ id, form_key, fields, ... }` (EnquiryFormConfigRow) |
| **PUT** | `/api/admin/enquiry-form-configs/[id]` | Required | Update enquiry form config | `{ form_key?, title?, description?, fields?, submit_label?, success_message?, lead_source?, lead_priority?, notify_email?, whatsapp_template?, is_active? }` | `{ id, ... }` (updated row) |
| **DELETE** | `/api/admin/enquiry-form-configs/[id]` | Required | Delete enquiry form config | — | `{ success: true }` |

**Fields Format:** Array of `{ key, label, type, required, placeholder?, options?, min?, max? }`

---

## 4. Content (Destinations, Packages, Blogs, Testimonials)

### Destinations — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/destinations` | Required | List all destinations | — | `[ { id, slug, name, region, is_published, ... } ]` (DestinationRow[]) |
| **POST** | `/api/admin/destinations` | Required | Create destination | `{ slug, name, region (divine\|domestic\|international), description?, cover_image?, nav_label?, badge_text?, seo_title?, seo_description?, is_published?, display_order? }` | `{ id, slug, ... }` (created row) |
| **GET** | `/api/admin/destinations/[id]` | Required | Get single destination | — | `{ id, slug, name, ... }` (DestinationRow) |
| **PUT** | `/api/admin/destinations/[id]` | Required | Update destination; syncs nav pool | `{ slug?, name?, region?, description?, cover_image?, nav_label?, badge_text?, seo_title?, seo_description?, is_published?, display_order?, parent_id? }` | `{ id, ... }` (updated row) |
| **DELETE** | `/api/admin/destinations/[id]` | Required | Delete destination; removes from nav pool | — | `{ success: true }` |

**Navigation Sync:** PUT & DELETE trigger `upsertNavPool()` / `removeNavPool()` to keep module_nav_pool in sync.

---

### Packages — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/packages` | Required | List all packages | — | `[ { id, slug, title, category_id, is_published, starting_price, ... } ]` (PackageRow[]) |
| **POST** | `/api/admin/packages` | Required | Create package | `{ slug, title, subtitle?, category_id?, destination_id?, destinations[], duration_days, duration_nights, highlights[], overview, itinerary, inclusions[], exclusions[], pricing[], starting_price?, gallery[], cover_image?, faqs[], is_featured?, is_published?, seo_title?, seo_description?, og_image?, canonical_path?, tour_type? }` | `{ id, slug, ... }` (created PackageRow) |
| **GET** | `/api/admin/packages/[id]` | Required | Get single package | — | `{ id, slug, title, ... }` (PackageRow) |
| **PUT** | `/api/admin/packages/[id]` | Required | Update package | `{ slug?, title?, subtitle?, ... [all fields above] }` | `{ id, ... }` (updated PackageRow) |
| **DELETE** | `/api/admin/packages/[id]` | Required | Delete package | — | `{ success: true }` |

**Pricing Format:** Array of `{ label: string, price: string, inclusions: string[] }`
**Itinerary Format:** Array of `{ day: number, title: string, description: string }`
**FAQs Format:** Array of `{ question: string, answer: string }`

---

### Blogs — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/blogs` | Required | List all blog posts | — | `[ { id, slug, title, is_published, published_at, reading_time_minutes, ... } ]` (BlogRow[]) |
| **POST** | `/api/admin/blogs` | Required | Create blog post; auto-calculates reading_time_minutes | `{ slug, title, excerpt?, content, cover_image?, category?, tags[], author?, is_published?, published_at?, seo_title?, seo_description?, og_image?, canonical_path? }` | `{ id, slug, reading_time_minutes, ... }` (created BlogRow) |
| **GET** | `/api/admin/blogs/[id]` | Required | Get single blog | — | `{ id, slug, content, ... }` (BlogRow) |
| **PUT** | `/api/admin/blogs/[id]` | Required | Update blog post | `{ slug?, title?, content?, excerpt?, ... [all fields above] }` | `{ id, ... }` (updated BlogRow) |
| **DELETE** | `/api/admin/blogs/[id]` | Required | Delete blog post | — | `{ success: true }` |

**Reading Time:** Auto-calculated as `Math.max(1, Math.round(words / 200))` minutes.

---

### Testimonials — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/testimonials` | Required | List all testimonials | — | `[ { id, author_name, rating, is_published, ... } ]` (TestimonialRow[]) |
| **POST** | `/api/admin/testimonials` | Required | Create testimonial | `{ author_name, author_location?, rating (1-5), content, avatar_url?, tour_taken?, is_published? }` | `{ id, author_name, ... }` (created TestimonialRow) |
| **GET** | `/api/admin/testimonials/[id]` | Required | Get single testimonial | — | `{ id, author_name, content, ... }` (TestimonialRow) |
| **PUT** | `/api/admin/testimonials/[id]` | Required | Update testimonial | `{ author_name?, author_location?, rating?, content?, avatar_url?, tour_taken?, is_published? }` | `{ id, ... }` (updated TestimonialRow) |
| **DELETE** | `/api/admin/testimonials/[id]` | Required | Delete testimonial | — | `{ success: true }` |

---

## 5. Vehicles & Transport

### Vehicles — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/vehicles` | Required | List all vehicles | — | `[ { id, slug, name, category_id, seats, starting_price, is_published, ... } ]` (VehicleRow[]) |
| **POST** | `/api/admin/vehicles` | Required | Create vehicle | `{ slug, name, category_id?, seats, luggage_capacity, price_per_km?, price_per_day?, starting_price?, images[], cover_image?, description, features[], is_ac?, is_featured?, is_published?, fuel_type?, transmission?, badge_text?, video_url?, availability_note?, seo_title?, seo_description?, og_image? }` | `{ id, slug, ... }` (created VehicleRow) |
| **GET** | `/api/admin/vehicles/[id]` | Required | Get single vehicle | — | `{ id, slug, name, images, ... }` (VehicleRow) |
| **PUT** | `/api/admin/vehicles/[id]` | Required | Update vehicle | `{ slug?, name?, category_id?, ... [all fields above] }` | `{ id, ... }` (updated VehicleRow) |
| **DELETE** | `/api/admin/vehicles/[id]` | Required | Delete vehicle | — | `{ success: true }` |

---

### Vehicle Categories — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/vehicle-categories` | Required | List all vehicle categories | — | `[ { id, slug, name, display_order, is_published, ... } ]` (VehicleCategoryRow[]) |
| **POST** | `/api/admin/vehicle-categories` | Required | Create category; syncs nav pool | `{ slug, name, description?, display_order?, is_published? }` | `{ id, slug, ... }` (created row) |
| **GET** | `/api/admin/vehicle-categories/[id]` | Required | Get single category | — | `{ id, slug, name, ... }` (VehicleCategoryRow) |
| **PUT** | `/api/admin/vehicle-categories/[id]` | Required | Update category; syncs nav pool | `{ slug?, name?, description?, display_order?, is_published? }` | `{ id, ... }` (updated row) |
| **DELETE** | `/api/admin/vehicle-categories/[id]` | Required | Delete category; removes from nav pool | — | `{ success: true }` |

---

### Airport Routes — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/airport-routes` | Required | List all airport routes | — | `[ { id, slug, from_city, to_city, vehicles, is_active, ... } ]` (AirportRouteRow[]) |
| **POST** | `/api/admin/airport-routes` | Required | Create airport route | `{ slug, from_city, to_city, distance_km?, duration_hours?, vehicles (array), description?, pickup_area?, drop_area?, route_type, is_return_available?, popular_rank?, cover_image?, content?, is_active?, seo_title?, seo_description?, og_image? }` | `{ id, slug, ... }` (created AirportRouteRow) |
| **GET** | `/api/admin/airport-routes/[id]` | Required | Get single route | — | `{ id, slug, vehicles, ... }` (AirportRouteRow) |
| **PUT** | `/api/admin/airport-routes/[id]` | Required | Update route | `{ slug?, from_city?, to_city?, vehicles?, ... [all fields above] }` | `{ id, ... }` (updated AirportRouteRow) |
| **DELETE** | `/api/admin/airport-routes/[id]` | Required | Delete route | — | `{ success: true }` |

**Vehicles Format (AirportRouteVehicle):** Array of `{ vehicle_type: string, seats: number, price: number }`

---

## 6. Navigation (Menus, Items, Pool)

### Navigation Menus — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/nav-menus` | Required | List all navigation menus | — | `[ { id, title, url, icon?, display_order, is_active, ... } ]` (NavMenuRow[]) |
| **POST** | `/api/admin/nav-menus` | Required | Create nav menu | `{ title, url, icon?, pool_entity_id?, open_in_new_tab?, display_order?, is_active? }` | `{ id, title, ... }` (created NavMenuRow) |
| **GET** | `/api/admin/nav-menus/[id]` | Required | Get single menu (with items) | — | `{ id, title, nav_items: [ {...}, ... ], ... }` (NavMenuWithItems) |
| **PUT** | `/api/admin/nav-menus/[id]` | Required | Update nav menu | `{ title?, url?, icon?, pool_entity_id?, open_in_new_tab?, display_order?, is_active? }` | `{ id, ... }` (updated NavMenuRow) |
| **DELETE** | `/api/admin/nav-menus/[id]` | Required | Delete nav menu (cascade deletes items) | — | `{ success: true }` |

---

### Navigation Items — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/nav-items` | Required | List all nav items | — | `[ { id, menu_id, title, url, display_order, is_active, ... } ]` (NavItemRow[]) |
| **POST** | `/api/admin/nav-items` | Required | Create nav item | `{ menu_id, parent_id?, title, url, description?, icon?, badge_text?, pool_entity_id?, open_in_new_tab?, display_order?, is_active? }` | `{ id, menu_id, ... }` (created NavItemRow) |
| **GET** | `/api/admin/nav-items/[id]` | Required | Get single nav item | — | `{ id, menu_id, title, ... }` (NavItemRow) |
| **PUT** | `/api/admin/nav-items/[id]` | Required | Update nav item | `{ menu_id?, parent_id?, title?, url?, description?, icon?, badge_text?, pool_entity_id?, open_in_new_tab?, display_order?, is_active? }` | `{ id, ... }` (updated NavItemRow) |
| **DELETE** | `/api/admin/nav-items/[id]` | Required | Delete nav item | — | `{ success: true }` |

---

### Navigation Pool — Read-Only

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/nav-pool` | Required | Export full navigation pool (destinations + vehicles + categories) | — | `{ destinations: [...], vehicles: [...], vehicle_categories: [...], airport_routes: [...] }` |

**Pool Format:** `{ id, module, entity_type, entity_id, label, url, cover_image, badge_text, is_published }`

---

## 7. CMS (Content Pages, Page Sections, Legacy CMS)

### Content Pages — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/content-pages` | Required | List all content pages | — | `[ { id, slug, title, page_type, is_published, ... } ]` (ContentPageRow[]) |
| **POST** | `/api/admin/content-pages` | Required | Create content page | `{ slug, title, page_type?, module?, entity_id?, entity_type?, is_published?, display_order?, seo_title?, seo_description?, og_image?, canonical_path?, robots_index?, schema_type? }` | `{ id, slug, ... }` (created ContentPageRow) |
| **GET** | `/api/admin/content-pages/[id]` | Required | Get single page | — | `{ id, slug, title, page_type, ... }` (ContentPageRow) |
| **PUT** | `/api/admin/content-pages/[id]` | Required | Update content page | `{ slug?, title?, page_type?, module?, entity_id?, entity_type?, is_published?, display_order?, seo_title?, seo_description?, og_image?, canonical_path?, robots_index?, schema_type? }` | `{ id, ... }` (updated ContentPageRow) |
| **DELETE** | `/api/admin/content-pages/[id]` | Required | Delete content page (cascade deletes sections) | — | `{ success: true }` |

---

### Page Sections — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/page-sections` | Required | List page sections | — | `[ { id, entity_type, entity_id, section_type, display_order, is_enabled, ... } ]` (PageSectionRow[]) |
| **POST** | `/api/admin/page-sections` | Required | Create page section | `{ entity_type (content_page\|destination\|vehicle\|...), entity_id, section_type (hero_banner\|rich_text\|...), label?, config (varies by section_type), is_enabled?, display_order? }` | `{ id, entity_type, ... }` (created PageSectionRow) |
| **GET** | `/api/admin/page-sections/[id]` | Required | Get single section | — | `{ id, section_type, config, ... }` (PageSectionRow) |
| **PUT** | `/api/admin/page-sections/[id]` | Required | Update page section | `{ entity_type?, entity_id?, section_type?, label?, config?, is_enabled?, display_order? }` | `{ id, ... }` (updated PageSectionRow) |
| **DELETE** | `/api/admin/page-sections/[id]` | Required | Delete page section | — | `{ success: true }` |

**Section Types:** hero_banner, rich_text, image_text_split, image_gallery, package_grid, destination_grid, vehicle_grid, transfer_grid, blog_grid, testimonials, faq, enquiry_form, cta_banner, whatsapp_cta, and 8 others.

---

### CMS Pages (Legacy) — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/cms-pages` | Required | List legacy CMS pages (deprecated) | — | `[ { id, slug, title, page_type, is_published, ... } ]` (CmsPageRow[]) |
| **POST** | `/api/admin/cms-pages` | Required | Create CMS page (legacy) | `{ slug, title, page_type (tour\|vehicle\|transfer\|general\|seo), hero_heading?, hero_subheading?, hero_image?, content, gallery[], faqs[], cta_text?, cta_url?, seo_title?, seo_description?, og_image?, canonical_path?, is_published? }` | `{ id, slug, ... }` (created CmsPageRow) |
| **GET** | `/api/admin/cms-pages/[id]` | Required | Get single legacy page | — | `{ id, slug, content, ... }` (CmsPageRow) |
| **PUT** | `/api/admin/cms-pages/[id]` | Required | Update legacy CMS page | `{ slug?, title?, content?, gallery[], faqs[], ... [all fields above] }` | `{ id, ... }` (updated CmsPageRow) |
| **DELETE** | `/api/admin/cms-pages/[id]` | Required | Delete legacy CMS page | — | `{ success: true }` |

**Status:** Deprecated in favor of content_pages + page builder. UI link removed from sidebar.

---

## 8. Site Configuration (Settings, Theme, SEO)

### Site Settings — Singleton Update

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/site-settings` | Required | Get global site settings | — | `{ id: 1, site_url, default_og_image, gtm_id, ga4_id, meta_pixel_id, notifications_email, ... }` (SiteSettingsRow) |
| **PUT** | `/api/admin/site-settings` | Required | Update site settings | `{ site_url?, default_og_image?, gtm_id?, ga4_id?, meta_pixel_id?, google_search_console_verification?, default_social_title?, default_social_description?, notifications_email? }` | `{ id: 1, ... }` (updated SiteSettingsRow) |

**Singleton Table:** Only one row with `id = 1` (enforced by CHECK constraint).

---

### Theme (No dedicated API; managed via UI)

**Method:** Theme is managed via `/admin/theme` page which directly updates `theme_settings` table via Supabase client.

| Table | Fields | Method |
|-------|--------|--------|
| **theme_settings** (singleton) | brand_name, logo_url, whatsapp_number, contact_phone, contact_email, address, primary_color, secondary_color, accent_color, dark_color, success_color | UI → Direct Supabase update |
| **theme_presets** | key, name, primary_color, secondary_color, accent_color, dark_color, success_color, is_active | UI → Direct Supabase update |

---

### SEO Pages (Page Overrides) — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/seo-pages` | Required | List all SEO page overrides | — | `[ { id, path, seo_title, seo_description, robots_index, ... } ]` (SeoPageRow[]) |
| **POST** | `/api/admin/seo-pages` | Required | Create SEO override for path | `{ path, seo_title?, seo_description?, og_image?, canonical_path?, robots_index?, json_ld? }` | `{ id, path, ... }` (created SeoPageRow) |
| **GET** | `/api/admin/seo-pages/[id]` | Required | Get single SEO override | — | `{ id, path, seo_title, ... }` (SeoPageRow) |
| **PUT** | `/api/admin/seo-pages/[id]` | Required | Update SEO override | `{ path?, seo_title?, seo_description?, og_image?, canonical_path?, robots_index?, json_ld? }` | `{ id, ... }` (updated SeoPageRow) |
| **DELETE** | `/api/admin/seo-pages/[id]` | Required | Delete SEO override | — | `{ success: true }` |

---

## 9. Media Library

### Media Assets — CRUD + Upload

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/media` | Required | List all media assets (paginated) | Query: `folder?, tags?, type?` | `[ { id, filename, url, mime_type, size_bytes, width, height, alt_text, tags, ... } ]` (MediaAssetRow[]) |
| **POST** | `/api/admin/media` | Required | Upload media file(s) to Supabase storage | FormData: `file` (File), `folder?` (string), `alt_text?` (string), `tags?` (string[]) | `{ id, filename, url, size_bytes, width?, height?, ... }` (created MediaAssetRow) |
| **GET** | `/api/admin/media/[id]` | Required | Get single media asset metadata | — | `{ id, filename, url, alt_text, tags, ... }` (MediaAssetRow) |
| **PUT** | `/api/admin/media/[id]` | Required | Update media metadata | `{ alt_text?, tags?, folder?, asset_type?, is_published? }` | `{ id, ... }` (updated MediaAssetRow) |
| **DELETE** | `/api/admin/media/[id]` | Required | Delete media (from DB + storage) | — | `{ success: true }` |

**Storage Path:** `divine-travel/{folder}/{filename}`

---

## 10. Hotel & Enquiry Configs

### Hotel Cities — CRUD

| Method | Route | Auth | Purpose | Request | Response |
|--------|-------|------|---------|---------|----------|
| **GET** | `/api/admin/hotel-cities` | Required | List all hotel cities | — | `[ { id, slug, name, state, region, is_published, ... } ]` (HotelCityRow[]) |
| **POST** | `/api/admin/hotel-cities` | Required | Create hotel city | `{ slug, name, state?, region?, cover_image?, description?, is_published?, display_order?, seo_title?, seo_description? }` | `{ id, slug, ... }` (created HotelCityRow) |
| **GET** | `/api/admin/hotel-cities/[id]` | Required | Get single hotel city | — | `{ id, slug, name, ... }` (HotelCityRow) |
| **PUT** | `/api/admin/hotel-cities/[id]` | Required | Update hotel city | `{ slug?, name?, state?, region?, cover_image?, description?, is_published?, display_order?, seo_title?, seo_description? }` | `{ id, ... }` (updated HotelCityRow) |
| **DELETE** | `/api/admin/hotel-cities/[id]` | Required | Delete hotel city | — | `{ success: true }` |

---

### Enquiry Form Configs (See Section 3 for full details)

---

## Summary by Domain

| Domain | Public | Admin | Total |
|--------|--------|-------|-------|
| Leads & Enquiries | 3 | 12 | 15 |
| Content (Destinations, Packages, Blogs, Testimonials) | 0 | 20 | 20 |
| Transport (Vehicles, Routes, Categories) | 0 | 15 | 15 |
| Navigation (Menus, Items, Pool) | 0 | 13 | 13 |
| CMS (Content Pages, Sections, Legacy) | 0 | 18 | 18 |
| Configuration (Settings, Theme, SEO) | 0 | 7 | 7 |
| Media Library | 0 | 5 | 5 |
| Hotels & Forms | 1 | 12 | 13 |
| **Total** | **4** | **102** | **106** |

**Rate Limits:**
- `/api/leads`: 5 per minute per IP (in-memory, non-persistent)
- All admin endpoints: Authenticated only (no rate limit defined; consider adding for production)

**Error Handling:**
- 400: Invalid JSON body
- 401: Unauthorized (missing/invalid auth token)
- 422: Validation failed (schema error)
- 500: Server error (Supabase operation failed)
