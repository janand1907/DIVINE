# TODO — Remaining Work

**Last Updated:** 2026-06-26 (Post-Sprint 12)  
**Status:** ~98% feature complete. Sprints 0-12 done.

---

## MEDIUM PRIORITY — Nice to Have Before Production

### Email Notifications Infrastructure
**Impact:** Form configs can specify `notify_email` but no emails are sent
**Complexity:** Medium-High (depends on email provider)

`POST /api/leads` creates leads but does not notify anyone by email.

**Work Required:**
1. Choose email provider (Resend recommended for Next.js)
2. When lead is created and `enquiry_form_config.notify_email` is set, send email
3. Email template: lead details, form data, link to admin dashboard
4. Handle failures gracefully (log, don't block lead creation)

**Files Affected:**
- `app/api/leads/route.ts`
- New `lib/email/` directory

---

### CMS Pages Deprecation
**Impact:** Legacy `/admin/cms-pages` route still accessible but no sidebar link
**Complexity:** Low

`cms_pages` table and routes exist but are superseded by `content_pages`. Sidebar link was already removed.

**Recommendation:** Leave as-is (safe legacy access) until client confirms no data in it.

---

## LOW PRIORITY — Future Enhancements

### WhatsApp Template Sending
`enquiry_form_configs.whatsapp_template` field exists but is never used.
Requires WhatsApp Business API integration.

---

### Multi-Language Content Support
Schema uses JSONB for text fields — supports multi-language. UI not implemented.

---

### Supabase Realtime for Live Notifications
Could show live lead alerts in admin without page refresh.
Tables are RLS-enabled and Supabase Realtime-compatible.

---

### PDF Itinerary Generation
Generate downloadable PDFs for tour packages.
Requires react-pdf or puppeteer.

---

### Hotel Properties Table
Currently only `hotel_cities` exists. No hotel property listings.
Would require new table + admin CRUD + public UI.

---

### Automated Test Suite
`tests/critical-path.test.ts` is a stub only. No test coverage.
Requires vitest + Playwright setup.

---

### next/image Migration
Several components use `<img>` with ESLint disable comments.
Should migrate to `next/image` for optimization.

---

## Summary

| Priority | Remaining Items | Blocking? |
|----------|----------------|-----------|
| MEDIUM | 2 | No |
| LOW | 7 | No |

**All CRITICAL and HIGH priority items are complete as of Sprint 12.**

**Recommended next steps for production go-live:**
1. Configure email provider for lead notifications (Resend ~2hrs)
2. Test all forms end-to-end in staging
3. Configure social media links via Site Settings admin
4. Set up Google Analytics / GTM IDs in Site Settings
5. Deploy to production (Netlify config already present)
