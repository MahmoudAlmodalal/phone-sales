# Phase 18 — Admin Dashboard (brief §2.8, SRS Admin role)

**Goal:** the operations console: system health, users/stores, catalog tree, review
moderation, ads, analytics reports, security log, backups, SEO — dense `surface`
aesthetic, 8px radii, red only as text buttons.

**Prerequisites:** Phases 12, 13, 17. Admin auth with 2FA enforced (04).

## Structure
`src/app/admin/layout.tsx` → DashboardLayout, tabs:
**الصحة · المستخدمون · المتاجر · الكتالوج · التقييمات · الإعلانات · التقارير · الأمان · النسخ · SEO · الأسعار اليدوية**

## Sections & endpoints

### الصحة `/admin` — system health (brief)
- [ ] `GET /api/admin/health`: cron/scrape task cards from `sync_logs`
      (task name | آخر تشغيل | المدة | ✓/✗) — **failed tasks float to top**;
      queue depth; last backup status.
- [ ] Failure card links to its log detail + «تشغيل الآن» re-run button
      (`POST /api/admin/ingest/run/{store}`).

### المستخدمون `/admin/users`
- [ ] Table + search/filter (role, status, flagged): `GET /api/admin/users`.
- [ ] Row actions (SRS: activate/ban): تفعيل، **تعليق** (red *text* + reason dialog),
      إعادة تعيين كلمة مرور (sends reset mail), fraud panel (phase 12: timeline,
      lift restriction, clear flag).

### المتاجر `/admin/stores`
- [ ] Pending-vendor approval queue (`POST /vendors/{user}/approve` — phase 04);
      verify/unverify store; edit ingest config (driver, feed URL, selectors,
      frequency — phase 17); suspend store (hides its prices).

### الكتالوج `/admin/catalog` (SRS: full tree control)
- [ ] Categories: tree view with drag/sort, add/edit/delete (guard: no delete with
      products), CRUD API `/api/admin/categories`.
- [ ] Products: table + create/edit form (name/name_ar/slug/brand/category/specs
      JSON editor grouped/images upload/is_active); brands CRUD.

### التقييمات `/admin/reviews`
- [ ] Moderation queue (phase 13 endpoints): each card shows the review + the
      **linked booking evidence** (number, product, completion date); approve /
      reject-with-reason; filters.

### الإعلانات `/admin/ads` (SRS: ad spaces & campaigns)
- [ ] Slots list (fixed keys); campaigns CRUD: slot, optional store, title, image
      upload, target URL, date range, active toggle; impressions/clicks columns (Mono);
      `GET/POST/PUT /api/admin/campaigns`. Public delivery endpoint
      `GET /api/ads/{slot}` + impression/click pings (wired in phases 07/05 `/go/?ad=`).

### التقارير `/admin/reports` (SRS: advanced performance reports)
- [ ] `GET /api/admin/reports?range=`: traffic (views/clicks/day), bookings funnel
      (drafts→confirmed→completed→no_show), top products & stores, alert conversions,
      user growth. Line/bar SVG charts + **تصدير CSV** per widget
      (`GET …/export?widget=`).

### الأمان `/admin/security`
- [ ] `GET /api/admin/security-events?type=&from=&to=`: timeline of failed logins,
      rate-limit hits, 2FA failures, suspicious/restriction events; IP column with
      count-per-IP rollup; filters by period/type (brief).

### النسخ `/admin/backups` (SRS §8 + brief)
- [ ] `spatie/laravel-backup` status endpoint: «آخر نسخة ناجحة: اليوم ٠٣:٠٠ · ٤١٢ م.ب»,
      destination health, schedule display; «نسخ الآن» button.
- [ ] **Restore behind a type-to-confirm dialog requiring the word «استعادة»**;
      restore itself = documented artisan runbook shown in the dialog (no one-click
      destructive restore in-app; download link for the archive instead).

### SEO `/admin/seo`
- [ ] Sitemap status (last generated, URL count), «إعادة توليد» → job; robots.txt
      preview; missing-meta products count.

### الأسعار اليدوية `/admin/manual-prices` (phase 17 fallback UI)
- [ ] Store selector → its price rows with inline edit (price/stock, source becomes
      `manual`); banner listing currently-failing scrape items to fix first.

## Definition of Done
- [ ] `admin@as3ar.test` (with 2FA) → all tabs functional against seeded data;
      non-admin gets 403 on every `/api/admin/*`.
- [ ] Seeded failed sync appears on top of health board; manual price fix clears it
      from the failing list.
- [ ] Suspend user → they can't login; approve pending vendor → vendor can.
- [ ] All destructive actions are red text buttons with dialogs; restore dialog
      requires typing «استعادة».
