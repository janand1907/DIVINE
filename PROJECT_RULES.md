# Project Rules

These rules are permanent engineering constraints for the Divine Travel platform. They apply to every contributor, every sprint, every change. They do not expire and may only be changed with explicit team approval.

---

## Architecture Rules

### AR-1: Architecture V3 is frozen

The architecture described in `ARCHITECTURE_V3.md` is the approved design. Do not redesign modules, rename core abstractions, or change the fundamental data model without explicit written approval.

### AR-2: Extend, don't replace

When adding a feature, extend existing patterns. Prefer adding a new column over a new table, a new section type over a new rendering system, a new template over a new builder.

### AR-3: Maintain backward compatibility

Module pages use `PageRenderer` with a fallback. The fallback must always work even when sections are empty. Never remove the fallback from a module page.

### AR-4: No client-side mutations to Supabase

All data mutations from the admin panel go through `/api/admin/*` route handlers. Never call Supabase `insert`, `update`, or `delete` directly from React client components.

### AR-5: RLS on every table

Every new table must have Row Level Security enabled. No exceptions. A table with RLS enabled but no policies is locked — add the 4 required policies (SELECT, INSERT, UPDATE, DELETE) in the same migration.

---

## Development Rules

### DR-1: Build must pass before merge

Every PR and every direct commit must have a passing build:

```
npm run build      — zero errors
npm run typecheck  — zero errors
npm run lint       — zero warnings
```

No exceptions. A broken build blocks all other developers.

### DR-2: Every sprint requires three checks

Before marking any sprint complete, run and confirm all three checks pass. Record the result in `PROJECT_STATUS.md`.

### DR-3: Types in one place

All database row type definitions live in `types/database.ts`. Do not define schema types in component files, API routes, or lib utilities. Import from `@/types/database`.

### DR-4: Supabase client selection is explicit

- `createPublicClient()` — anon key, no cookies. Use in `generateMetadata`, sitemaps, and any code outside a live request.
- `createServerClient()` — SSR session client. Use in server components and route handlers that need the authenticated user.
- `createAdminClient()` — service role key. Use only in `/api/admin/*` route handlers. Never in components.

Using the wrong client is a security defect, not a style issue.

### DR-5: No hardcoded business data

Phone numbers, WhatsApp numbers, addresses, and brand names must come from `theme_settings` or `site_settings` tables. Never hardcode them in component files.

### DR-6: Activity logging is mandatory on admin mutations

Every `create`, `update`, `delete`, `publish`, and `unpublish` action in an admin API route must call `logActivity()` after success. This is not optional.

---

## Content Rules

### CR-1: Nav pool must stay in sync

When adding admin CRUD for a new entity type that will appear in navigation, wire `upsertNavPool()` on create/update and `removeNavPool()` on delete. Add the mapper function to `lib/nav/pool.ts`.

### CR-2: New section types are registered in meta.ts

When adding a new section component, register it in:
1. `lib/sections/meta.ts` — `SECTION_TYPE_META` record
2. `types/database.ts` — `SectionType` union
3. `components/sections/page-renderer.tsx` — `COMPONENTS` map

All three or none. A section that exists in the DB but not in the renderer silently does nothing.

### CR-3: Seed data uses integer for integer columns

When writing SQL seed migrations, always check the column type first. Common traps:
- `vehicles.luggage_capacity` — `integer`, not text
- `packages.duration_days`, `duration_nights` — `integer`
- `testimonials.rating` — `integer`

Use Postgres array syntax for `text[]` columns: `'{"item1","item2"}'`
Use `'[...]'::jsonb` cast for jsonb columns.

---

## Documentation Rules

### DC-1: Update PROJECT_STATUS.md after every sprint

When completing a sprint, update:
- Sprint progress table (mark completed)
- Completed features checklist
- Build status with new date
- Database migration status
- Next recommended task

### DC-2: Update CHANGELOG.md after every sprint

Add an entry at the top under the sprint number and date. Use the Added / Changed / Fixed / Database Changes / Notes structure.

### DC-3: Architecture changes require ARCHITECTURE_V3.md update

If a sprint introduces a new architectural concept (new module, new data pattern, new integration), document it in ARCHITECTURE_V3.md in the relevant section before the sprint is marked complete.

---

## Security Rules

### SR-1: Service role key is server-only

`SUPABASE_SERVICE_ROLE_KEY` must never appear in client-side code, browser bundles, or public environment variables. It is only accessible in `createAdminClient()` which is only called from server-side route handlers.

### SR-2: Validate all API inputs with Zod

Every API route that accepts a request body must validate it with a Zod schema before using any field. Return `422` with `issues` on validation failure. Never trust raw request body fields.

### SR-3: Admin routes are double-guarded

Admin `/api/*` routes have `requireAdminApi()`. Admin page server components have `requireAdmin()`. Middleware provides the outer layer. All three must be present — removing any one layer is a security regression.
