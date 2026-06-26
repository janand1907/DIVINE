# Known Issues, Limitations, and Technical Debt

**Last Updated:** 2026-06-26

---

## Active Issues

### 1. Footer Social Media Links Hardcoded
**Severity:** Low | **Module:** Components (layout/footer.tsx)

Footer social media links hardcoded to generic URLs (facebook.com, twitter.com, etc.) instead of pulling from theme or site settings. Links are not configurable from admin panel.

**Impact:** Must manually update footer component code to change social URLs.

---

### 2. Footer Quick Links Hardcoded
**Severity:** Low | **Module:** Components (layout/footer.tsx)

Footer quick links section (About, Contact, Privacy, etc.) hardcoded in component instead of being driven from database. No admin UI to manage footer navigation.

**Impact:** Footer structure cannot be changed without code modification.

---

### 3. EnquiryForm Section Uses Hardcoded Field Defaults
**Severity:** Medium | **Module:** Sections (sections/enquiry-form.tsx)

EnquiryForm section component uses hardcoded field defaults and does not auto-fetch configuration from `enquiry_form_configs` table by `form_key`. To override form fields, admin must manually copy them into the page section config in the page builder.

**Impact:** Field validation rules, labels, and options defined in enquiry_form_configs are ignored; forms become out of sync with admin configuration.

**Workaround:** Admin must manually enter field configs into page section when building pages.

---

### 4. Homepage Builder Uses Direct Supabase Client Instead of API
**Severity:** Low | **Module:** Admin (admin/homepage-builder/page.tsx)

Homepage builder is the only admin component that uses Supabase client directly (`createClient()`) instead of REST API routes. All other admin CRUD operations go through `/api/admin/*` endpoints, violating the "API Routes as the Admin Boundary" principle.

**Impact:** Less consistent with platform architecture; bypasses potential API-level audit or validation logic that may be added in future.

**Note:** Not a functional bug, but architectural inconsistency.

---

## Limitations

### 5. No Gallery Admin UI
**Severity:** High | **Module:** Gallery (missing)

`gallery_items` table exists with RLS enabled but has no admin CRUD UI. Gallery can only be populated via direct database insert or migration scripts.

**Impact:** Admins cannot manage gallery content through the UI.

---

### 6. No FAQ Admin UI
**Severity:** High | **Module:** FAQ (missing)

`faqs` and `faq_categories` tables exist but no admin pages or API routes for CRUD operations. FAQs cannot be managed through admin panel.

**Impact:** FAQ content can only be seeded via migrations or direct DB manipulation.

---

### 7. No Vehicle Pricing Admin UI
**Severity:** High | **Module:** Vehicles (missing)

`vehicle_pricing` table type defined in database.ts but no admin CRUD UI or API routes implemented. Vehicle pricing tiers and variations cannot be managed from admin.

**Impact:** Vehicle pricing locked to single price fields on vehicle record; no support for tiered or complex pricing.

---

### 8. No Transfer Pricing Admin UI
**Severity:** High | **Module:** Airport Transfers (missing)

`transfer_pricing` table type defined but no admin CRUD UI or API routes. Transfer pricing by route and vehicle type cannot be managed from admin.

**Impact:** Transfer route prices hardcoded in `airport_routes.vehicles` array; no per-vehicle pricing variation.

---

### 9. No Email Notification System
**Severity:** Medium | **Module:** Leads (partial)

`notify_email` field exists in `enquiry_form_configs` table but no SMTP integration or email sending logic implemented. Leads are not automatically emailed to configured notification address.

**Impact:** Admin must manually check leads panel; no passive lead notifications.

---

### 10. No WhatsApp API Integration
**Severity:** Medium | **Module:** Leads (partial)

`whatsapp_template` field exists in `enquiry_form_configs` but no WhatsApp message sending implemented. WhatsApp CTAs and forms cannot trigger automated WhatsApp messages.

**Impact:** WhatsApp integration is UI-only (float button, CTA sections); no automated messaging from form submissions.

---

### 11. Admin User Creation Requires Manual Setup
**Severity:** Medium | **Module:** Admin Auth

No in-app admin invitation or setup flow. New admin users can only be created by manually inviting them to the Supabase project in the Supabase dashboard. No "invite admin user" feature in the app.

**Impact:** Onboarding new admin users requires Supabase dashboard access; not self-service.

---

### 12. No Rate Limiting on Public API Endpoints
**Severity:** High | **Module:** API (public)

Public endpoints `/api/leads` and `/api/callback` lack rate limiting protections at the application level. Only basic in-memory per-IP rate limiting exists on `/api/leads` (5 per minute), which resets when the server restarts.

**Impact:** Vulnerable to form spam and DDoS attacks. Rate limiting is not persistent across server restarts or multiple instances.

---

## Technical Debt

### 13. Legacy CMS Pages Not Removed
**Severity:** Low | **Module:** Admin (cms-pages)

`/admin/cms-pages` still exists and functions but has been superseded by `content_pages` + page builder. Sidebar link was removed but legacy pages and API routes remain in codebase.

**Impact:** Code duplication; potential confusion. No functional impact as feature is hidden from UI.

**Remediation:** Mark API routes as deprecated or remove entirely in next refactor.

---

### 14. Inconsistent Form Components in Admin
**Severity:** Low | **Module:** Components (admin forms)

Some admin pages use native HTML `<input type="checkbox">` instead of shadcn UI Switch/Checkbox components (e.g., `contact-form.tsx`). Inconsistent with design system.

**Impact:** Visual inconsistency in admin UI; not a functional issue.

---

### 15. Critical Path Tests Are Stubs
**Severity:** Medium | **Module:** Tests

`tests/critical-path.test.ts` exists but contains only placeholder/stub tests with no actual test coverage. Critical user flows (lead submission, package booking, etc.) are untested.

**Impact:** No automated regression testing for core features. Risk of breaking changes in future updates.

---

### 16. No Staging Environment Configuration
**Severity:** Medium | **Module:** Deployment / Config

Project deployed directly to production. No staging environment configuration in `netlify.toml` or environment setup for pre-production testing.

**Impact:** All changes tested against live production database. Risk of data corruption or downtime during testing.

---

### 17. Browserslist Database Outdated
**Severity:** Low | **Module:** Build

Build warning: "caniuse-lite is outdated". Browserslist database needs updating.

**Impact:** CSS and JS polyfills may not target correct browsers. Benign warning but should be addressed during next dependency update.

**Fix:** Run `npx update-browserslist-db@latest` in next maintenance window.

---

### 18. Supabase Client Build Warnings
**Severity:** Low | **Module:** Dependencies

`@supabase/supabase-js` package emits build warning: "Critical dependency: the request of a dependency is an expression". This is an upstream issue in the Supabase SDK, not actionable by this project.

**Impact:** Noise in build output; no functional impact.

**Workaround:** Upstream fix required; monitor Supabase SDK releases for resolution.

---

## Summary

| Category | Count |
|----------|-------|
| Active Issues | 4 |
| Limitations (Missing Features) | 8 |
| Technical Debt | 6 |
| **Total** | **18** |

**High Priority (Blocks Core Features):** #5, #6, #7, #8, #12
**Medium Priority (Operational Impact):** #3, #9, #10, #11, #15, #16
**Low Priority (Quality/Consistency):** #1, #2, #4, #13, #14, #17, #18
