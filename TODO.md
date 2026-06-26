# TODO — Remaining Work

**Last Updated:** 2026-06-26 (Post-Audit)
**Status:** 98% feature complete. Below are all remaining tasks prioritized by impact.

---

## CRITICAL — Must Fix Before Client Handoff

These items block production deployment. Fix before releasing to client.

### Footer Configuration — Social Media & Links
**Impact:** Client cannot customize footer without code deploy
**Complexity:** Medium

Footer currently has hardcoded social media links (facebook.com, instagram.com, twitter.com, youtube.com) and hardcoded footer links (About, Blog, FAQ, Contact, etc.). Client needs UI to configure these without redeploy.

**Work Required:**
1. Add `social_facebook`, `social_instagram`, `social_twitter`, `social_youtube` fields to `site_settings` table
2. Add `footer_links` JSONB field to `site_settings` (array of `{label, url, open_new_tab}`)
3. Create admin UI at `/admin/site-settings` section for footer configuration
4. Update footer component to fetch from DB and render dynamically

**Files Affected:**
- `components/layout/footer.tsx` (currently hardcoded)
- `app/(public)/layout.tsx` or shared layout

---

## HIGH PRIORITY — Important Quality Improvements

These improve consistency and reduce client friction. Should complete before day-to-day operations.

### EnquiryForm Section Auto-Fetch Configuration Fields
**Impact:** Form configs created in admin must be manually integrated into sections
**Complexity:** Low

The `EnquiryForm` section component currently uses hardcoded fields. It should optionally fetch configured fields from `enquiry_form_configs` table by `form_key`.

**Work Required:**
1. Update `components/sections/enquiry-form.tsx` to accept `config.form_key` parameter
2. When `form_key` is present, fetch the config from `enquiry_form_configs` and dynamically render fields
3. Fall back to hardcoded defaults if no config found
4. Update page builder to include `form_key` selector in EnquiryForm section editor

**Files Affected:**
- `components/sections/enquiry-form.tsx`
- Page builder section config UI

**Related:** enquiry_form_configs table already stores field definitions; just need to wire it up.

### Homepage Builder — Migrate to REST API
**Impact:** Consistency — currently uses direct Supabase client instead of API routes
**Complexity:** Low-Medium

Homepage builder (toggle/reorder sections) currently calls Supabase client directly. Should use API routes for consistency, auditability, and activity logging.

**Work Required:**
1. Create `POST /api/admin/homepage-sections/reorder` route (takes array of section IDs + new order)
2. Create `PATCH /api/admin/homepage-sections/[id]` route (toggle enabled, update config)
3. Update `components/admin/homepage-builder.tsx` to call REST endpoints instead of Supabase
4. Add `requireAdminApi()` middleware to both routes
5. Add `logActivity()` to both routes

**Files Affected:**
- `components/admin/homepage-builder.tsx`
- `app/api/admin/homepage-sections/` (new routes)

### Admin User Onboarding
**Impact:** Client must manually create users in Supabase; no in-app flow
**Complexity:** Medium

Currently no way to invite admins without direct Supabase dashboard access. Need in-app invite/sign-up flow.

**Work Required:**
1. Create `/admin/users` management page (list current admins, invite new)
2. Add `invited_at`, `invite_code` fields to users or separate `admin_invites` table
3. Create public `/auth/accept-invite/[code]` page for new admins to sign up
4. Send invite emails with link (requires email provider integration)
5. Alternative: simpler version without email — just show invite links for manual sharing

**Files Affected:**
- `app/admin/users/` (new pages)
- `app/auth/accept-invite/` (new page)
- Database (new invite tracking)

---

## MEDIUM PRIORITY — Nice to Have Before Production

These features improve client experience but aren't blocking. Can defer to week 2 if needed.

### Footer Social Links — Database Configuration
**Status:** Blocked by CRITICAL "Footer Configuration"
**Complexity:** Low (dependent task)

Once footer config is complete, add UI for social media URLs:
- LinkedIn profile URL
- Instagram handle (@username)
- YouTube channel
- TikTok profile

---

### Vehicle Pricing Admin UI
**Impact:** Client cannot configure per-vehicle pricing tiers without DB direct access
**Complexity:** Medium

`VehiclePricingRow` type exists in the schema. `vehicles.pricing` JSONB column stores pricing tiers. No admin UI exists.

**Work Required:**
1. Create pricing editor component (add/edit/delete tiers)
2. Add pricing section to vehicle edit form at `/admin/vehicles/[id]`
3. Pricing tier structure: `{pax_count, per_pax_price, notes}`
4. Handle JSONB update in `PUT /api/admin/vehicles/[id]`

**Files Affected:**
- `app/admin/vehicles/` (edit form)
- `app/api/admin/vehicles/[id]` (PATCH handler)

---

### Transfer Pricing Admin UI
**Impact:** Client cannot configure per-route pricing without DB access
**Complexity:** Medium

Similar to vehicle pricing — `airport_routes.vehicles` JSONB column stores pricing by vehicle. No admin UI.

**Work Required:**
1. Create pricing editor for each vehicle on route
2. Add pricing section to route edit form at `/admin/airport-routes/[id]`
3. Pricing structure: `{vehicle_id, per_trip_price, per_pax_price, notes}`
4. Handle JSONB update in `PUT /api/admin/airport-routes/[id]`

**Files Affected:**
- `app/admin/airport-routes/` (edit form)
- `app/api/admin/airport-routes/[id]` (PATCH handler)

---

### Gallery Admin CRUD
**Impact:** Gallery items cannot be managed from admin; must seed directly in DB
**Complexity:** Low

`gallery_items` table exists but no admin interface.

**Work Required:**
1. Create `/admin/gallery` list page
2. Create `/admin/gallery/new` form for uploading images
3. Add edit/delete actions
4. Wire to media library for image selection
5. Create API routes: `GET /api/admin/gallery`, `POST`, `PATCH`, `DELETE`

**Files Affected:**
- `app/admin/gallery/` (new)
- `app/api/admin/gallery/` (new)

---

### FAQ Admin CRUD
**Impact:** FAQs cannot be managed from admin; must seed in DB
**Complexity:** Low-Medium

`faqs` and `faq_categories` tables exist but no admin interface.

**Work Required:**
1. Create `/admin/faqs` list page with category filter
2. Create `/admin/faq-categories` for category management
3. Create `/admin/faqs/new` form
4. Add edit/delete actions
5. Create API routes: `GET/POST/PATCH/DELETE`
6. FAQ section already supports `source: 'db'` — should just work once admin is done

**Files Affected:**
- `app/admin/faqs/` (new)
- `app/admin/faq-categories/` (new)
- `app/api/admin/faqs/` (new)

---

### Email Notifications Infrastructure
**Impact:** Form configs can specify `notify_email` field but no sending implemented
**Complexity:** Medium-High (depends on email provider)

Form config can have `notify_email` and `whatsapp_template` fields, but `POST /api/leads` doesn't send anything.

**Work Required:**
1. Choose email provider (SendGrid, Mailgun, Resend, etc.)
2. When lead is created and `enquiry_form_config.notify_email` is set, send email to that address
3. Email template: lead details, form data, link to admin dashboard
4. Handle failures gracefully (log, don't block lead creation)
5. Optional: add `notify_whatsapp` route for WhatsApp integration

**Files Affected:**
- `app/api/leads` (POST handler)
- Email provider integration (new lib)

---

### CMS Pages Deprecation
**Impact:** Legacy feature clutters admin interface
**Complexity:** Low

Admin page `/admin/pages` for legacy CMS pages exists but sidebar link was removed. Should either fully deprecate or remove.

**Work Required:**
**Option A (Deprecate):**
1. Keep the table but hide from UI
2. Document that this feature is deprecated; use Content Pages instead
3. Leave existing pages accessible but don't create new ones

**Option B (Remove):**
1. Migrate any existing CMS page data to `content_pages`
2. Delete `cms_pages` table
3. Remove `/admin/pages` route
4. Remove related code

**Recommendation:** Option A (safer, keeps backward compatibility)

---

## LOW PRIORITY — Future Enhancements

These are nice-to-have but not required for v1 or production.

### WhatsApp Template Sending
**Status:** Infrastructure exists, not implemented
**Complexity:** High

`enquiry_form_configs.whatsapp_template` field exists but not used. Could send templated WhatsApp messages to inquirers.

**Blocked By:** Email notifications infrastructure (similar pattern)

---

### Multi-Language Content Support
**Status:** Architecture supports it, not implemented
**Complexity:** Medium-High

Database schema uses JSONB for many text fields (title, description, etc.) which can store multiple languages. CMS sections also support language variants. Could add UI to manage translations.

**Work Required:**
1. Add language selector to admin forms
2. Create translation editor UI
3. Add language detection on public site (geolocation or user preference)
4. Render translated content when available, fallback to default

---

### Supabase Realtime for Live Notifications
**Status:** Infrastructure ready, not implemented
**Complexity:** Low-Medium

Could show admin users live lead notifications when new inquiries arrive.

**Work Required:**
1. Set up Supabase Realtime subscriptions in lead management page
2. Toast notification when new lead arrives
3. Auto-refresh kanban/table in real-time

---

### PDF Itinerary Generation
**Status:** Requested feature, not started
**Complexity:** Medium

Generate downloadable PDF itineraries for packages. Would help with email share/print.

**Work Required:**
1. Choose PDF library (react-pdf, puppeteer, etc.)
2. Create PDF template matching package page layout
3. Add download button to package pages
4. Generate server-side or client-side

---

### Hotel Properties Table
**Status:** Only hotel_cities exists, no properties
**Complexity:** Low-Medium

Hotel assistance currently only supports city selection. Could expand to show specific hotels.

**Work Required:**
1. Create `hotel_properties` table (name, city_id, location, contact, website, rating)
2. Add admin CRUD for hotel properties
3. Update hotel assistance form to show hotels by city
4. Update public form UI

---

### Rate Limiting on Public Endpoints
**Status:** Not implemented
**Complexity:** Low-Medium

Public endpoints `/api/leads`, `/api/callback` should have rate limits to prevent abuse.

**Work Required:**
1. Choose rate limiting strategy (IP-based, auth-based, etc.)
2. Add middleware to rate limit endpoints
3. Return 429 Too Many Requests on limit exceeded
4. Consider grace period for legitimate high-volume scenarios

---

### Image Optimization with next/image
**Status:** Currently using `<img>` tags
**Complexity:** Low

Admin-sourced images are rendered with `<img>` tags and ESLint disable comments. Should migrate to `next/image` for optimization.

**Work Required:**
1. Audit all image renders
2. Replace `<img>` with `<Image>` from next/image
3. Remove ESLint disable comments
4. Ensure Supabase Storage URL is configured as image domain

**Files Affected:**
- `components/sections/` (all image-using sections)
- `next.config.js` (add image domain config)

---

### Automated Test Suite
**Impact:** No automated tests exist
**Complexity:** High

`tests/critical-path.test.ts` exists but is incomplete. No test coverage.

**Work Required:**
1. Set up test framework (vitest + Playwright)
2. Write critical path tests:
   - Homepage loads
   - Public pages render correctly
   - Admin login works
   - CRUD operations work
   - Lead creation works
   - SEO metadata renders
3. Set up CI/CD test runs

---

## Summary by Priority

| Priority | Count | Total Effort | Blocking |
|----------|-------|--------------|----------|
| CRITICAL | 1 | 3-5 days | ✅ Yes |
| HIGH | 3 | 2-4 days | ⚠️ Partial |
| MEDIUM | 7 | 7-10 days | ❌ No |
| LOW | 8 | 10+ days | ❌ No |

**Recommended Sequence for Client Handoff:**
1. Complete CRITICAL items (1-2 days)
2. Complete HIGH items (2-3 days)
3. Demo to client with MEDIUM items as "future roadmap"
4. Pick 2-3 MEDIUM items to include before go-live (estimated +3 days)

**Estimated Total to Production-Ready:** 6-8 days
