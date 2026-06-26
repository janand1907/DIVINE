# Changelog

All notable changes to Divine Travel are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## Sprint 3 — 2026-06-26

### Added
- **PageRenderer with fallback pattern** on all module detail pages:
  - `divine-tours/[slug]` — wraps existing layout as fallback
  - `domestic-tours/[slug]` — wraps existing layout as fallback
  - `international-tours/[slug]` — wraps existing layout as fallback
  - `vehicle-rentals/[slug]` — wraps existing layout as fallback
  - `airport-transfers/[slug]` — wraps existing layout as fallback
- **Pool-aware navigation** in `lib/nav/fetch.ts`:
  - `fetchNavPool(module?)` — fetch published pool items, optionally filtered by module
  - `fetchNavWithPool()` — parallel fetch of curated menus + all pool items grouped by module
- **Comprehensive seed data** (migration `0004_seed_demo_data.sql`):
  - 3 vehicle categories (Sedan, SUV, Tempo Traveller)
  - 8 destinations (Tirupati, Chennai, Pondicherry, Madurai, Ooty, Sri Lanka, Singapore, Bali)
  - 6 tour packages with full details, inclusions/exclusions, cover images
  - 4 vehicles (Innova Crysta, Dzire, 12-seat Tempo, Etios) with integer `luggage_capacity`
  - 3 airport routes with jsonb vehicle pricing (Chennai↔Tirupati, Bangalore→Tirupati)
  - 6 testimonials with tour references
  - 3 blog posts (Tirupati guide, Chennai weekend escapes, Tempo Traveller tips)
  - 11 module nav pool entries matching all seeded entities

### Fixed
- Unescaped HTML entities in `airport-transfers/[slug]/page.tsx` and `vehicle-rentals/[slug]/page.tsx` (arrow `→` as `&#8594;`, Rupee `₹` as `&#8377;`, car emoji as `&#128663;`)
- Seed migration failures resolved:
  - `luggage_capacity` column is `integer` — seed now uses numeric values (2, 3, 4, 12) not text
  - `highlights`, `inclusions`, `features`, `tags` use Postgres array syntax `'{"item1","item2"}'`
  - `airport_routes.vehicles` uses `'[...]'::jsonb` cast

### Notes
- PageRenderer uses progressive enhancement: if no sections exist for an entity, the fallback JSX renders. When sections are configured in the builder, they replace the fallback with zero code changes.
- `luggage_capacity` in `types/database.ts` is typed as `number` matching the actual DB integer column.

---

## Sprint 2 — 2026-06-26

### Added
- **Content Pages system** (`content_pages` table) — section-managed pages separate from legacy CMS pages
- **Admin Content Pages manager** (`/admin/content-pages`) — list view with publish toggle, actions
- **Admin Content Pages form** (`/admin/content-pages/new`) — create/edit with template selector
- **Page Builder** (`/admin/content-pages/[id]/builder`) — full drag/reorder builder UI:
  - Add sections from grouped palette (22 section types)
  - Reorder with up/down arrows
  - Toggle visibility per section
  - Edit JSON config inline
  - Delete sections
- **`lib/sections/meta.ts`** — client-safe section type metadata and group definitions
- **`lib/sections/templates.ts`** — 9 pre-built section templates
- **Nav Pool auto-sync** on destinations, vehicle categories, and airport routes:
  - `POST` creates entry in `module_nav_pool`
  - `PUT/PATCH` updates entry
  - `DELETE` removes entry
- **`lib/nav/pool.ts`** — `upsertNavPool()`, `removeNavPool()`, mapper helpers
- **Sidebar nav item** for Content Pages in admin

### Changed
- `lib/sections/registry.ts` refactored to re-export from `meta.ts` (resolves client/server boundary violation)
- Admin API routes for destinations, vehicle categories, and airport routes now call nav pool helpers

### Fixed
- `components/admin/delete-button.tsx` — moved `useRouter()` to component scope (was called inside async handler, violating hooks rules)
- `components/admin/leads-manager.tsx` — converted `fetchLeads` to `useCallback` at component scope (was defined inside `useEffect`)
- Unescaped entity warnings across 6 files — replaced `'` with `&apos;` and `"` with `&quot;`

### Database Changes
- **Migration `0003_seed_content_pages.sql`** applied:
  - 4 content pages (About Us, Contact Us, Corporate Tours, Group Tours)
  - 24 page sections with realistic config jsonb

### Notes
- `components/admin/page-builder-client.tsx` is a client component that must import from `lib/sections/meta.ts` not `lib/sections/registry.ts` to avoid importing `next/headers` on the client side.

---

## Sprint 1 — 2026-06-26

### Added
- Complete Next.js App Router project structure
- Supabase integration (public, server, admin clients)
- Full platform database schema (`0001_divine_travel_schema.sql`):
  - All core tables with RLS enabled
  - `touch_updated_at()` trigger function
  - Polymorphic `page_sections` table (initially with `page_id`, renamed in Sprint 2)
- All public-facing pages:
  - Homepage with section-based HomepageBuilder
  - Divine/domestic/international tours listing and detail
  - Packages listing and full detail (itinerary, pricing, inquiry form)
  - Vehicle rentals listing and detail
  - Airport transfers listing and detail
  - Blog listing and post detail (ToC, reading time)
  - Contact, hotel assistance, gallery, FAQ, testimonials
  - Dynamic CMS page renderer (`/[slug]`)
  - Sitemap.xml and robots.txt
- Complete admin panel:
  - Login with Supabase Auth
  - Protected layout with middleware + server guard
  - Dashboard with stats cards
  - Full CRUD for all content types
  - Lead management (kanban + table + drawer + notes)
  - Navigation menu editor
  - SEO pages manager
  - Site settings and theme editor
  - Media library
  - Activity log
- SEO architecture:
  - Three-level override system
  - `buildMetadata()` and `fetchSeoContext()` helpers
  - Full OG + Twitter card metadata
  - JSON-LD structured data component
- UTM tracking and cookie setter
- Universal enquiry engine (`/api/leads`)
- Activity logging on all admin mutations
- 22 section components (accepting config props)
- Middleware for auth-protected admin routes
- Breadcrumb component with schema.org support

### Database Changes
- **Migration `0001_divine_travel_schema.sql`** — full schema
- **Migration `0002_fix_page_sections_polymorphic.sql`** — renamed `page_id` to `entity_id`, added `entity_type` column, updated index

### Fixed
- Sprint 1 audit fixes (see Sprint 2 Fixed section — applied in same session)

### Notes
- Theme colours, WhatsApp number, and contact details are configurable via `/admin/theme` without redeploy
- Analytics IDs (GTM, GA4, Meta Pixel) are configurable via `/admin/site-settings`
