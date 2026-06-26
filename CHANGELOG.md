# Changelog

All notable changes to Divine Travel are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2026-06-26] - Sprint 10: Analytics Dashboard (Late)

### Added
- Comprehensive analytics dashboard replacing basic stats
- Date range filter (7, 30, 90, all days options)
- Conversion funnel visualization
- Daily leads line chart with recharts
- Source breakdown bar chart with recharts
- Lead priority distribution cards
- Full analytics page at `/admin/analytics`

### Changed
- Admin dashboard redesigned with analytics focus

---

## [2026-06-26] - Sprint 9: Hotel Assistance Module (Late)

### Added
- Hotel assistance module with city-based selection
- `hotel_cities` table admin CRUD interface
- Migration 0005: Added `display_order` column to `enquiry_form_configs`, seeded 5 form configs and 12 hotel cities
- Public `/api/hotel-cities` endpoint for form selection
- DB-driven city dropdown in hotel assistance form
- Hotel Cities link in admin sidebar

---

## [2026-06-26] - Sprint 8: Enquiry Form Configs (Late)

### Added
- Enquiry form configuration system for dynamic form management
- Admin CRUD for enquiry form configs at `/admin/enquiry-form-configs`
- Dynamic field builder UI for form configuration
- 5 pre-configured form templates (seeded)
- Migration 0005: Enhanced `enquiry_form_configs` table with `display_order` and seed data

---

## [2026-06-26] - Navigation Management Overhaul (Late)

### Changed
- Menus manager completely rewritten from simple dialog to full two-panel CMS editor
- Added drag-and-drop reordering for menu items
- Integrated module nav pool system for item selection
- Added badge support for menu items
- Added open-in-new-tab toggle for links
- Improved editor UI/UX for better usability

---

## [2026-06-26] - Production Readiness Audit (Late)

### Security
- **SECURITY FIX**: Added `requireAdminApi()` to GET endpoints on `page-sections` and `content-pages` (were publicly accessible)

### Fixed
- **BUG**: Homepage builder `moveSection()` and `toggleEnabled()` now persist via Supabase (previously updated only local state)
- **SEO**: Airport-transfers listing page converted from static metadata to dynamic `generateMetadata()` + `fetchSeoContext()`
- **UI**: Replaced native `<select>` elements with shadcn `Select` component in `content-pages/new`
- **BUILD**: Removed duplicate Icon import that broke build (`ImageIcon2` in `page-builder-client.tsx`)

### Changed
- Added `logActivity()` calls to `page-sections` and `content-pages` API routes for audit trail
- Added input validation (field allowlists) to `page-sections/[id]` and `content-pages/[id]` PATCH routes
- Template section creation refactored from sequential loop to parallel `Promise.all()`

---

## [2026-06-26] - Sprint 7: Media Library Integration (Mid)

### Added
- Media library integration in page builder
- Image picker component with search capability
- Auto-recognition of image fields in sections
- Multi-image gallery support
- Copy image URL functionality

---

## [2026-06-26] - Sprint 6: Package Detail V2 with PageRenderer (Mid)

### Added
- Package detail pages now wrapped with `<PageRenderer>`
- Section-based itinerary display
- Section-based pricing display
- Section-based FAQ display

### Changed
- Package detail page architecture migrated to PageRenderer pattern

---

## [2026-06-26] - Sprint 5: Pool-Aware Mega-Menu (Mid)

### Added
- Pool-aware mega-menu in header with image card dropdowns
- Desktop: 3-column grid dropdowns for tour/vehicle/transfer menus (up to 6 items with badges)
- Mobile: accordion-style menu with pool items as text links
- Homepage builder live editing with section toggle/reorder/configure
- `fetchNavWithPool()` helper for parallel menu + pool fetching

### Fixed
- Multiple section component bugs

---

## [2026-06-26] - Sprint 4: Section Component Data Integration (Mid)

### Added
- Real data integration for all 22 section components
- Database queries for: `package_grid`, `destination_grid`, `vehicle_grid`, `transfer_grid`
- Database queries for: `testimonials`, `blog_grid`, `faq` (with `source: 'db'`)
- Theme-aware WhatsApp integration in `cta_banner` and `whatsapp_cta`

### Changed
- All data-driven sections now query live database
- Sections fetch from `theme_settings` for dynamic values

---

## [2026-06-26] - Sprint 3: PageRenderer and Seed Data (Mid)

### Added
- `PageRenderer` with fallback pattern deployed to all module detail pages
- Detail pages for: destinations, vehicles, routes, packages (initial)
- Pool-aware navigation system in `lib/nav/fetch.ts`
- Comprehensive seed data (migration 0004):
  - 8 destinations with full details
  - 6 tour packages with inclusions/exclusions
  - 4 vehicles with luggage capacity
  - 3 airport routes with JSON-B vehicle pricing
  - 6 testimonials, 3 blog posts, 11 nav pool entries

### Changed
- Detail page architecture upgraded to progressive enhancement pattern

---

## [2026-06-26] - Sprint 2: Admin Page System and Section Builder (Mid)

### Added
- Content Pages system (`content_pages` table)
- Admin Content Pages manager at `/admin/content-pages`
- Full page builder with 22 section types (add, reorder, toggle, edit, delete)
- Section templates system (9 pre-built templates)
- Nav Pool auto-sync for content entities
- Migration 0003: Seeded 4 content pages with 26 sections

### Changed
- Page management system redesigned with section-based architecture

---

## [2026-06-26] - Sprint 1: Initial Release (Early)

### Added
- Next.js 13.5 App Router project structure
- Supabase integration (public, server, admin clients)
- Complete database schema (`0001_divine_travel_schema.sql`):
  - 20+ tables with RLS enabled
  - Polymorphic `page_sections` table
  - Triggers for `updated_at` management
- Public pages:
  - Homepage with section-based builder
  - Tour listings (divine/domestic/international) and details
  - Packages with full itinerary/pricing/FAQs
  - Vehicle rentals and airport transfers
  - Blog with table of contents and reading time
  - Contact, gallery, FAQ, testimonials, hotel assistance
  - Dynamic CMS renderer, sitemap, robots.txt
- Complete admin panel:
  - Supabase Auth login and protected layout
  - CRUD for all content types
  - Lead management (kanban/table/drawer/notes)
  - Navigation editor, SEO manager, theme editor
  - Media library and activity log
- SEO architecture with three-level override system
- UTM tracking and universal enquiry engine (`/api/leads`)
- 22 section components with config-driven rendering
- Activity logging on all mutations

### Database Changes
- Migration `0001_divine_travel_schema.sql` — complete schema setup
- Migration `0002_fix_page_sections_polymorphic.sql` — polymorphic table fix

---

## [2026-06-23] - Sprint 0: Project Bootstrap

### Added
- Project structure and tooling
- Database schema design (20+ tables)
- Supabase Auth setup
- Admin layout (sidebar, topbar) and login page
- Migration `0001_divine_travel_schema.sql` with:
  - All core tables (destinations, packages, vehicles, etc.)
  - RLS policies on all tables
  - Database triggers for common operations
  - Theme and site settings tables
