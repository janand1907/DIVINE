# Divine Travel

A production-grade travel company CMS and website for a South India-based tour operator specialising in pilgrimage, leisure, corporate travel, vehicle rentals, and airport transfers.

Built on Next.js 13 App Router and Supabase. Deploys to Netlify with zero additional infrastructure.

---

## Features

### Public Website
- **Homepage** — section-based, fully configurable from admin
- **Tour destinations** — divine, domestic, and international destination pages
- **Tour packages** — full detail pages with itinerary, pricing tiers, inclusions/exclusions, FAQ, inquiry form
- **Vehicle rentals** — fleet listing and individual vehicle pages with pricing
- **Airport transfers** — route listing and detail pages with vehicle options
- **Blog** — articles with table of contents, reading time, and tags
- **CMS pages** — section-based content pages (About Us, Contact, Corporate, Group Tours, and any custom page)
- **Gallery, FAQ, Testimonials, Hotel assistance**
- **Dynamic sitemap and robots.txt**

### Admin Panel
- Full CRUD for all content types (destinations, packages, vehicles, routes, blogs, testimonials)
- **Page builder** — compose any page from 22 pre-built section components
- **Lead management** — kanban pipeline, lead detail drawer, notes, status tracking, UTM attribution
- **Navigation editor** — configure menus and items; auto-populated nav pool from content entities
- **SEO manager** — per-path title, description, og:image, robots overrides
- **Theme editor** — brand colours, WhatsApp number, contact details (no redeploy needed)
- **Site settings** — GTM, GA4, Meta Pixel IDs (no redeploy needed)
- **Media library** — upload, browse, tag assets
- **Activity log** — audit trail for all admin actions

### Platform
- Three-level SEO override system with full Open Graph and Twitter card support
- Universal enquiry engine capturing all form submissions as structured leads
- UTM cookie-based attribution on all leads
- JSON-LD structured data support
- Supabase Auth with middleware-protected admin routes
- Row Level Security on all database tables
- Activity logging on all admin mutations

---

## Tech Stack

- **Framework:** Next.js 13.5.1 (App Router)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS 3.3
- **UI Components:** shadcn/ui + Radix UI
- **Forms:** react-hook-form + Zod
- **Icons:** lucide-react
- **Deployment:** Netlify + @netlify/plugin-nextjs

---

## Installation

### Prerequisites

- Node.js 18+
- A Supabase project (credentials must be in `.env`)
- npm

### Setup

```bash
# Install dependencies
npm install

# Apply database migrations in order from supabase/migrations/
# Use Supabase MCP tools or the Supabase dashboard SQL editor

# Start development server
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `SUPABASE_DB_URL` | Direct database connection URL (for migrations) |

Do not commit `.env` to source control.

---

## Development Setup

```bash
# Development server (hot reload)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build (verify before deploy)
npm run build
```

---

## Database Setup

Migrations live in `supabase/migrations/`. Apply them in order:

| Order | File | Description |
|---|---|---|
| 1 | `*_0001_divine_travel_schema.sql` | Full platform schema |
| 2 | `*_0002_fix_page_sections_polymorphic.sql` | Polymorphic page sections |
| 3 | `*_0003_seed_content_pages.sql` | Demo content pages (About, Contact, Corporate, Group) |
| 4 | `*_0004_seed_demo_data.sql` | Demo destinations, packages, vehicles, routes, testimonials, blogs |

After applying migrations, create an admin user in your Supabase project's Authentication dashboard.

---

## Build Commands

```bash
npm run build      # Production build
npm run start      # Start production server locally
npm run typecheck  # TypeScript check (no emit)
npm run lint       # ESLint
```

---

## Deployment

### Netlify (recommended)

1. Connect the repository to Netlify
2. Set environment variables in Netlify's dashboard
3. Build command: `npm run build`
4. Publish directory: `.next`

The `netlify.toml` and `@netlify/plugin-nextjs` handle all Next.js-specific configuration automatically.

---

## Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE_V3.md](./ARCHITECTURE_V3.md) | Full architecture reference — single source of truth |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Current sprint status, build status, next steps |
| [CHANGELOG.md](./CHANGELOG.md) | Sprint-by-sprint change log |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Coding conventions, migration rules, PR checklist |
| [PROJECT_RULES.md](./PROJECT_RULES.md) | Permanent engineering constraints |

---

## Folder Structure

```
app/
  (public)/              Public website pages
  admin/                 Admin panel (protected)
  api/admin/             Admin REST API routes

components/
  admin/                 Admin UI components
  forms/                 Public enquiry forms
  home/                  Homepage section components
  layout/                Header, footer, breadcrumb
  packages/              Package detail components
  sections/              22 section builder components + PageRenderer
  ui/                    shadcn/ui primitives

lib/
  activity/              Activity logging
  admin/                 Auth guards (server component + API route)
  nav/                   Navigation fetch + nav pool sync
  sections/              Section metadata, fetch, templates
  seo/                   Metadata builder, JSON-LD
  supabase/              Supabase client factories
  theme/                 Theme provider
  validation/            Shared Zod schemas

types/
  database.ts            All TypeScript row types

supabase/
  migrations/            Ordered SQL migration files
```
