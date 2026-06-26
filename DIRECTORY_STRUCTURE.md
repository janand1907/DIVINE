# Directory Structure

**Last Updated:** 2026-06-26

Comprehensive mapping of the Divine Travel codebase including all public-facing pages, admin interfaces, API routes, and shared components.

---

## Root Structure

```
/tmp/cc-agent/68266683/project/
├── app/                          # Next.js App Router (page routes & API endpoints)
├── components/                   # Shared React components (admin & public)
├── hooks/                        # Custom React hooks
├── lib/                          # Shared business logic and utilities
├── public/                       # Static assets (images, guides)
├── supabase/                     # Database schema and migrations
├── types/                        # TypeScript type definitions
├── tests/                        # Test files
├── Documentation files (.md)
├── Configuration files (.json, .ts, .js)
└── Deployment config (netlify.toml)
```

---

## app/ — Next.js Routes

### Root Layout & Utilities

```
app/
├── globals.css                   # Global Tailwind styles, brand CSS variables
├── layout.tsx                    # Root layout wrapper (fonts, providers, analytics)
├── robots.ts                     # Dynamic robots.txt generation
├── sitemap.ts                    # Dynamic sitemap.xml from published entities
```

### (public)/ — Public-Facing Website

```
app/(public)/
├── layout.tsx                    # Public layout (Header, Footer, WhatsApp float)
├── page.tsx                      # Homepage (section-based via HomepageBuilder)
│
├── [slug]/                       # Dynamic CMS content pages
│   └── page.tsx                  # Renders content_pages by slug
│
├── about/                        # About page
│   └── page.tsx                  # Static about content
│
├── airport-transfers/            # Airport & city transfers module
│   ├── page.tsx                  # Transfers listing (DB-driven)
│   └── [slug]/page.tsx           # Transfer route detail with PageRenderer
│
├── blog/                         # Blog module
│   ├── page.tsx                  # Blog listing with search & filters
│   └── [slug]/page.tsx           # Blog post detail with ToC
│
├── contact/                      # Contact form page
│   └── page.tsx                  # Contact enquiry form
│
├── divine-tours/                 # Pilgrimage destinations module
│   ├── page.tsx                  # Destinations listing (DB-driven)
│   └── [slug]/page.tsx           # Destination detail with PageRenderer
│
├── domestic-tours/               # Domestic destinations (same structure as divine-tours)
│   ├── page.tsx
│   └── [slug]/page.tsx
│
├── international-tours/          # International destinations (same structure)
│   ├── page.tsx
│   └── [slug]/page.tsx
│
├── faq/                          # FAQ page
│   └── page.tsx                  # DB-driven FAQs by category
│
├── gallery/                      # Photo gallery
│   └── page.tsx                  # DB-driven gallery grid
│
├── hotel-assistance/             # Hotel booking assistance
│   └── page.tsx                  # Hotel booking enquiry form
│
├── packages/                     # Tour packages module
│   ├── page.tsx                  # Packages listing with filters & search
│   └── [slug]/page.tsx           # Package detail with itinerary, pricing, PageRenderer
│
├── testimonials/                 # Customer testimonials
│   └── page.tsx                  # Testimonials listing (DB-driven)
│
└── vehicle-rentals/              # Vehicle rental module
    ├── page.tsx                  # Vehicles by category (DB-driven)
    └── [slug]/page.tsx           # Vehicle detail with PageRenderer
```

### admin/ — Admin Panel

```
app/admin/
├── (auth)/                       # Unauthenticated admin routes
│   └── login/
│       └── page.tsx              # Admin login form (Supabase auth)
│
└── (protected)/                  # Auth-guarded admin routes (middleware.ts enforces)
    ├── layout.tsx                # Admin layout (sidebar, topbar)
    ├── page.tsx                  # Analytics dashboard (leads funnel, metrics)
    │
    ├── activity/
    │   └── page.tsx              # Activity audit log viewer
    │
    ├── airport-routes/           # Airport routes CRUD
    │   ├── page.tsx              # Airport routes manager
    │   ├── new/page.tsx          # Create new route
    │   └── [id]/edit/page.tsx    # Edit route
    │
    ├── blog/                     # Blog CRUD
    │   ├── page.tsx              # Blog listing
    │   ├── new/page.tsx          # Create blog post
    │   └── [id]/edit/page.tsx    # Edit blog post
    │
    ├── categories/
    │   └── page.tsx              # Package categories manager
    │
    ├── cms-pages/                # Legacy CMS pages (deprecated UI hidden)
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/edit/page.tsx
    │
    ├── content-pages/            # Section-based content pages
    │   ├── page.tsx              # Content pages listing
    │   ├── new/page.tsx          # Create content page
    │   └── [id]/
    │       └── builder/page.tsx  # Page builder (drag-drop sections)
    │
    ├── destinations/
    │   └── page.tsx              # Destinations manager
    │
    ├── enquiry-form-configs/
    │   └── page.tsx              # Enquiry form configs manager (field definitions)
    │
    ├── homepage-builder/
    │   └── page.tsx              # Homepage section manager (enable/disable/reorder)
    │
    ├── hotel-cities/
    │   └── page.tsx              # Hotel cities manager
    │
    ├── leads/
    │   └── page.tsx              # Lead management (kanban + table view, bulk actions)
    │
    ├── media/
    │   └── page.tsx              # Media library (upload, browse, delete)
    │
    ├── menus/
    │   └── page.tsx              # Navigation menu editor (drag-drop, pools)
    │
    ├── packages/                 # Package CRUD
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/edit/page.tsx
    │
    ├── seo-pages/
    │   └── page.tsx              # SEO metadata overrides by path
    │
    ├── site-settings/
    │   └── page.tsx              # Global site config (GTM, GA4, defaults)
    │
    ├── theme/
    │   └── page.tsx              # Theme & branding editor (colors, fonts, presets)
    │
    ├── testimonials/             # Testimonials CRUD
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/edit/page.tsx
    │
    └── vehicles/                 # Vehicle CRUD
        ├── page.tsx
        ├── new/page.tsx
        └── [id]/edit/page.tsx
```

### api/ — API Routes & Endpoints

```
app/api/
├── public endpoints (no auth)
│   ├── activity-log/route.ts     # Client-side activity ingestion
│   ├── callback/route.ts         # Callback request handler (lead creation)
│   ├── hotel-cities/route.ts     # Public hotel cities fetch (GET)
│   └── leads/route.ts            # Lead submission (POST, rate-limited)
│
└── admin/                        # All authenticated admin CRUD endpoints
    ├── airport-routes/
    │   ├── route.ts              # GET (list), POST (create)
    │   └── [id]/route.ts         # GET, PUT (update), DELETE
    │
    ├── blogs/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── categories/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── cms-pages/                # Legacy, deprecated
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── content-pages/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── destinations/
    │   ├── route.ts              # Syncs nav pool on update/delete
    │   └── [id]/route.ts
    │
    ├── enquiry-form-configs/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── hotel-cities/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── media/
    │   ├── route.ts              # Upload, list, delete
    │   └── [id]/route.ts
    │
    ├── nav-items/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── nav-menus/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── nav-pool/
    │   └── route.ts              # Read-only nav pool export
    │
    ├── page-sections/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── packages/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── seo-pages/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── site-settings/
    │   └── route.ts              # Singleton update (GET, PUT)
    │
    ├── testimonials/
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    ├── vehicle-categories/
    │   ├── route.ts              # Syncs nav pool on update/delete
    │   └── [id]/route.ts
    │
    └── vehicles/
        ├── route.ts
        └── [id]/route.ts
```

---

## components/ — Shared Components

### Admin Components

```
components/admin/
├── analytics-charts.tsx          # Recharts (funnel, line chart, bar chart, filters)
├── enquiry-form-configs-manager.tsx  # Enquiry form config CRUD UI
├── homepage-builder-client.tsx   # Homepage section manager (toggle, reorder)
├── hotel-cities-manager.tsx      # Hotel cities CRUD UI
├── kanban-board.tsx              # Lead pipeline kanban (status columns)
├── lead-detail-drawer.tsx        # Lead detail side drawer (notes, actions)
├── leads-manager.tsx             # Dual-view lead manager (kanban + table)
├── media-grid.tsx                # Media library grid display & selection
├── media-picker.tsx              # Media picker dialog (for page builder)
├── media-uploader.tsx            # Media upload form (Supabase storage)
├── menus-manager.tsx             # Full navigation editor (2-panel, drag-drop)
├── page-builder-client.tsx       # Section-based page builder (drag-drop, edit)
├── sidebar.tsx                   # Admin navigation sidebar
├── stat-card.tsx                 # Metric display card
└── [entity]-form.tsx             # 15+ entity CRUD forms (AirportRoute, Blog, Package, etc.)
```

### Layout Components

```
components/layout/
├── header.tsx                    # DB-driven mega-menu header (nav pool)
├── footer.tsx                    # Site footer (partially hardcoded)
├── breadcrumb.tsx                # Breadcrumb trail component
├── json-ld.tsx                   # JSON-LD structured data injection
├── public-layout.tsx             # Public page wrapper
├── section-heading.tsx           # Reusable section title component
└── whatsapp-float.tsx            # Floating WhatsApp contact button
```

### Public Forms

```
components/forms/
├── contact-form.tsx              # Contact page enquiry form
├── hotel-assistance-form.tsx     # Hotel booking assistance form
└── quick-quote-form.tsx          # Quick quote widget (landing page CTA)
```

### Blog Components

```
components/blog/
├── blog-search-client.tsx        # Client-side blog search
└── table-of-contents.tsx         # Auto-generated ToC from markdown
```

### Package Components

```
components/packages/
├── inquiry-form.tsx              # Package-specific enquiry form
├── itinerary.tsx                 # Day-by-day itinerary display
├── package-card.tsx              # Package listing card
├── package-parts.tsx             # Inclusions/exclusions display
├── package-sort-select.tsx       # Sort & filter control
└── sticky-cta.tsx                # Sticky "Book Now" button
```

### Analytics & Tracking

```
components/analytics/
├── analytics-head.tsx            # GTM/GA4/Meta Pixel injection
└── utm-cookie-setter.tsx         # UTM parameter cookie storage
```

### Gallery

```
components/gallery/
└── gallery.tsx                   # Gallery grid component
```

### Home

```
components/home/
├── hero.tsx                      # Homepage hero section
└── [section].tsx                 # 20+ homepage section components
```

### Page Builder Sections (22 Types)

```
components/sections/
├── page-renderer.tsx             # Central dispatcher (polymorphic section router)
│
├── Content & Layout
│   ├── hero-banner.tsx           # Hero with image/video bg, CTA
│   ├── rich-text.tsx             # HTML content renderer
│   ├── image-text-split.tsx      # 2-column image + text layout
│   ├── image-gallery.tsx         # Image gallery display
│   ├── image-banner.tsx          # Full-width image with overlay text
│   ├── video-section.tsx         # Video player embed
│   └── timeline.tsx              # Timeline/process display
│
├── Entity Grids (DB-fetching)
│   ├── package-grid.tsx          # Packages with filters
│   ├── destination-grid.tsx      # Destinations by region
│   ├── vehicle-grid.tsx          # Vehicles by category
│   ├── transfer-grid.tsx         # Airport routes
│   └── blog-grid.tsx             # Blog posts
│
├── Engagement
│   ├── testimonials.tsx          # DB-fetching testimonials carousel
│   ├── faq.tsx                   # Config or DB-driven FAQs
│   ├── enquiry-form.tsx          # Enquiry form (config-driven)
│   ├── cta-banner.tsx            # DB-fetching CTA (WhatsApp theme)
│   └── whatsapp-cta.tsx          # DB-fetching WhatsApp CTA
│
├── Features & Stats
│   ├── feature-cards.tsx         # Feature cards grid
│   ├── statistics.tsx            # Stats/KPIs display
│   └── pricing-cards.tsx         # Pricing tier display
│
└── Integrations
    ├── google-map.tsx            # Embedded Google Map
    └── html-block.tsx            # Raw HTML block renderer
```

### UI Components (shadcn/ui)

```
components/ui/                   # 40+ shadcn UI components
├── button.tsx
├── input.tsx
├── textarea.tsx
├── select.tsx
├── form.tsx
├── card.tsx
├── dialog.tsx
├── drawer.tsx
├── sheet.tsx
├── tabs.tsx
├── accordion.tsx
├── table.tsx
├── badge.tsx
├── alert.tsx
├── toast.tsx
├── toaster.tsx
├── sonner.tsx
├── checkbox.tsx
├── switch.tsx
├── radio-group.tsx
├── label.tsx
├── input-otp.tsx
├── slider.tsx
├── progress.tsx
├── separator.tsx
├── scroll-area.tsx
├── breadcrumb.tsx
├── pagination.tsx
├── avatar.tsx
├── hover-card.tsx
├── popover.tsx
├── tooltip.tsx
├── command.tsx
├── menubar.tsx
├── collapsible.tsx
├── carousel.tsx
├── resizable.tsx
└── skeleton.tsx
```

---

## lib/ — Shared Business Logic

### Activity Logging

```
lib/activity/
├── log.ts                        # Server-side logActivity() function
└── log-client.ts                 # Client-side activity logging helper
```

### Admin Auth

```
lib/admin/
├── api-guard.ts                  # requireAdminApi() for API routes
├── auth-client.ts                # signOut() client function
└── guard.ts                      # requireAdmin() for server components
```

### Homepage

```
lib/homepage/
├── fetch.ts                      # fetchHomepageSections() (server)
└── registry.tsx                  # Homepage section component map
```

### Navigation System

```
lib/nav/
├── fetch.ts                      # fetchNavMenus(), fetchNavPool(), fetchNavWithPool()
└── pool.ts                       # Navigation pool utilities (sync, converters)
```

### Page Builder System

```
lib/sections/
├── meta.ts                       # Section metadata (client-safe, type definitions)
├── registry.ts                   # fetchSections() (server-only, polymorphic dispatch)
└── templates.ts                  # 10 pre-built page templates
```

### SEO System

```
lib/seo/
├── metadata.ts                   # buildMetadata(), fetchSeoContext()
└── json-ld.tsx                   # JSON-LD schema helpers
```

### Supabase

```
lib/supabase/
├── client.ts                     # createClient() (browser/client-side)
└── server.ts                     # createPublicClient(), createServerClient(), createAdminClient()
```

### Theme System

```
lib/theme/
├── theme.ts                      # fetchTheme(), ThemeSettings type
└── theme-provider.tsx            # React context for brand settings
```

### Validation

```
lib/validation/
└── schemas.ts                    # Zod schemas (leadSchema, blogSchema, etc.)
```

### Utilities

```
lib/
└── utils.ts                      # cn() (Tailwind class merge), other utilities
```

---

## supabase/ — Database

### Migrations

```
supabase/migrations/
├── 20260623072331_0001_divine_travel_schema.sql
│   └── Complete Phase 1 schema (16 tables, RLS policies, triggers)
│
├── 20260626074717_0002_fix_page_sections_polymorphic.sql
│   └── Adds content_pages, page_sections, nav_*, enquiry_form_configs, hotel_cities
│
├── 20260626082420_0003_seed_content_pages.sql
│   └── Seeds 4 content pages + 26 page sections
│
├── 20260626084442_0004_seed_demo_data.sql
│   └── Seeds demo entities (destinations, packages, blogs, vehicles, routes)
│
└── 20260626121520_0005_seed_enquiry_form_configs_and_hotel_cities.sql
    └── Seeds enquiry form configs + hotel cities
```

---

## types/ — TypeScript Types

```
types/
└── database.ts                   # All 27+ Row types + Database interface
                                 # Matches Supabase schema (auto-generated)
```

---

## hooks/ — Custom React Hooks

```
hooks/
└── use-toast.ts                  # Toast notification hook (Sonner integration)
```

---

## public/ — Static Assets

```
public/
├── admin-guide.html              # Admin user guide (static HTML)
├── qa-documentation.html         # QA documentation (static HTML)
└── images/
    └── [logo, icons, etc.]       # Static images
```

---

## tests/ — Test Files

```
tests/
└── critical-path.test.ts         # Placeholder critical-path tests (not implemented)
```

---

## Configuration & Deployment

```
Root /
├── .eslintrc.json                # ESLint config
├── components.json               # shadcn/ui config
├── netlify.toml                  # Netlify deployment config
├── next.config.js                # Next.js config
├── middleware.ts                 # Edge middleware (admin auth guard)
├── postcss.config.js             # PostCSS config (Tailwind)
├── tailwind.config.ts            # Tailwind CSS + brand design tokens
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── package-lock.json             # Lockfile
└── Documentation
    ├── ARCHITECTURE_V3.md         # Approved architecture spec
    ├── CHANGELOG.md               # Project changelog
    ├── CONTRIBUTING.md            # Contribution guidelines
    ├── DATABASE_STATUS.md         # Database schema status
    ├── DIRECTORY_STRUCTURE.md     # This file
    ├── KNOWN_ISSUES.md            # Known issues & limitations
    ├── PROJECT_RULES.md           # Development rules
    ├── PROJECT_STATUS.md          # Current sprint status
    ├── README.md                  # Project overview
    └── API_REFERENCE.md           # API endpoint documentation
```

---

## Module Organization by Domain

### Tourism & Content
- **Packages:** `/admin/packages`, `/api/admin/packages`, `components/packages/*`
- **Destinations:** `/admin/destinations`, `/api/admin/destinations`
- **Blog:** `/admin/blog`, `/api/admin/blogs`, `components/blog/*`
- **Testimonials:** `/admin/testimonials`, `/api/admin/testimonials`

### Transport & Rentals
- **Airport Routes:** `/admin/airport-routes`, `/api/admin/airport-routes`
- **Vehicles:** `/admin/vehicles`, `/api/admin/vehicles`, `components/packages/*` (rental grid)
- **Vehicle Categories:** `/api/admin/vehicle-categories`

### Lead Management
- **Leads:** `/admin/leads`, `components/admin/leads-manager.tsx`
- **Enquiry Forms:** `/admin/enquiry-form-configs`, `/api/admin/enquiry-form-configs`
- **Public Forms:** `components/forms/*`

### Navigation & Menus
- **Menus:** `/admin/menus`, `/api/admin/nav-menus`, `/api/admin/nav-items`
- **Navigation Pool:** `/api/admin/nav-pool`
- **Header:** `components/layout/header.tsx` (renders nav)

### Content Pages & Builder
- **Content Pages:** `/admin/content-pages`, `/api/admin/content-pages`
- **Page Sections:** `/api/admin/page-sections`
- **Page Builder:** `/admin/content-pages/[id]/builder`
- **Section Renderer:** `components/sections/page-renderer.tsx`

### Configuration
- **Site Settings:** `/admin/site-settings`, `/api/admin/site-settings`
- **Theme:** `/admin/theme` (no dedicated API, uses SQL)
- **SEO Pages:** `/admin/seo-pages`, `/api/admin/seo-pages`
- **Homepage Builder:** `/admin/homepage-builder` (no dedicated API)

### Media
- **Media Library:** `/admin/media`, `/api/admin/media`
- **Gallery:** `/api/admin/media` (special folder handling)

### Administrative
- **Activity Logs:** `/admin/activity`, `lib/activity/*`
- **Hotel Cities:** `/admin/hotel-cities`, `/api/admin/hotel-cities`
- **Analytics:** `/admin/page.tsx` (dashboard)

---

## Summary

| Component | Count |
|-----------|-------|
| Public pages | 16 |
| Admin pages | 18 |
| API routes (list + detail) | 32 |
| Shared components | 80+ |
| UI components | 40+ |
| Database tables | 27 |
| Migrations | 5 |

**Total Files:** ~400+
**Total Lines of Code:** ~50,000+
