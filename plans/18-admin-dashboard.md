# Phase 18 — Admin Dashboard (brief §2.8, SRS Admin Role)

**Goal:** the operations console: system health, users/stores, catalog tree,
review moderation, tickets, ads, analytics reports, security log, backups,
SEO, manual prices — dense surface aesthetic, 8px radii, red only as text
buttons. Several admin pages EXIST on mock data; this phase wires them and
builds the missing tabs.

**Depends on:** 12, 13, 17, 19. Admin auth with enforced 2FA (04).

**Produces:** /api/admin/* endpoints, fully live `/admin/**`.

## Context for the agent

- Existing pages (`frontend/src/app/admin/`): layout + index, `users/`,
  `merchants/`, `reviews/`, `complaints/`, `fraud/`, `backup/` — all on
  `lib/dash-data.ts` mock data. Reuse `components/dash/*` (DashShell,
  ConfirmDialog, MerchantProfileDrawer).
- Tab mapping (existing → wire; missing → build):
  الصحة (index — wire), المستخدمون (users — wire, includes the fraud panel
  consuming phase-12 endpoints; the separate fraud page merges here or stays
  as a sub-view), المتاجر (merchants — wire), التقييمات (reviews — wire),
  التذاكر (complaints — wire to phase-19 admin endpoints), النسخ (backup —
  wire), and NEW tabs: الكتالوج، الإعلانات، التقارير، الأمان، SEO،
  الأسعار اليدوية.

## Steps

### S1 — Health board (الصحة)
- **Do:** GET /api/admin/health: cron/ingest task cards from sync_logs (task
  name | آخر تشغيل | المدة | ✓/✗) with FAILED tasks floating to the top;
  queue depth; last backup status. Wire the admin index page to it; each
  failure card links to its log detail and offers a «تشغيل الآن» re-run
  button calling POST /api/admin/ingest/run/{store}.
- **Touch:** backend controller, `frontend/src/app/admin/page.tsx`.
- **Done when:** the seeded failed sync appears on top; re-run fires the
  ingest for that store.

### S2 — Users (المستخدمون)
- **Do:** GET /api/admin/users with search/filter (role, status, flagged) and
  row actions per SRS: تفعيل, تعليق (red TEXT button + reason dialog),
  password-reset mail, and the fraud panel (phase-12 endpoints: events
  timeline, lift restriction, clear flag). Wire the existing users page (and
  fraud page) to these.
- **Touch:** backend controllers, `frontend/src/app/admin/users/*`,
  `frontend/src/app/admin/fraud/*`.
- **Done when:** suspending a user blocks their login; lift/clear work from
  the UI.

### S3 — Stores (المتاجر)
- **Do:** Wire the merchants page: pending-vendor approval queue (phase-04
  approve endpoint), verify/unverify store, suspend store (hides its prices
  from public endpoints), and the ingest-config editor (driver, feed URL,
  selectors, frequency — the phase-02/17 columns).
- **Touch:** backend controllers, `frontend/src/app/admin/merchants/*`.
- **Done when:** approving the seeded pending vendor lets them log in; a
  suspended store's prices disappear from the product page.

### S4 — Catalog (الكتالوج) — new tab
- **Do:** Categories: tree view with drag/sort, add/edit/delete (guard: no
  delete while products exist) over a CRUD API. Products: table + create/edit
  form (name/name_ar/slug/brand/category/grouped specs JSON editor/images
  upload/is_active). Brands CRUD.
- **Touch:** backend CRUD controllers, `frontend/src/app/admin/catalog/*`.
- **Done when:** creating a product in the UI makes it searchable publicly;
  deleting a category with products is blocked with a clear message.

### S5 — Reviews + tickets queues
- **Do:** Wire the reviews page to the phase-13 moderation endpoints — each
  card shows the review + linked booking evidence (number, product,
  completion date), approve / reject-with-reason, filters. Wire the
  complaints page to the phase-19 admin ticket endpoints — queue table
  (priority/status/category filters, assignee select), thread view with
  reply/close/assign, and the star-tint SLA tint on rows open > 48h.
- **Touch:** `frontend/src/app/admin/reviews/*`, `frontend/src/app/admin/complaints/*`.
- **Done when:** approving a pending review publishes it; an admin reply
  flips a ticket to answered and emails the owner.

### S6 — Ads + reports — new tabs
- **Do:** الإعلانات: slots list (fixed keys) + campaigns CRUD (slot, optional
  store, title, image upload, target URL, date range, active toggle,
  Mono impressions/clicks columns) and the public delivery endpoint
  GET /api/ads/{slot} consumed by phase 07. التقارير: GET /api/admin/reports
  ?range= — traffic (views/clicks per day), bookings funnel
  (draft→active→completed→no_show), top products & stores, alert
  conversions, user growth; SVG line/bar charts + a per-widget «تصدير CSV»
  export endpoint.
- **Touch:** backend controllers, `frontend/src/app/admin/ads/*`,
  `frontend/src/app/admin/reports/*`.
- **Done when:** a campaign created in the UI renders on the homepage slot;
  each report widget matches a hand-checked seeded number and exports CSV.

### S7 — Security + SEO — new tabs
- **Do:** الأمان: GET /api/admin/security-events?type=&from=&to= — timeline
  of failed logins, rate-limit hits, 2FA failures, suspicious/restriction
  events, with an IP column and per-IP count rollup, period/type filters.
  SEO: sitemap status (last generated, URL count), «إعادة توليد» job trigger,
  robots preview, missing-meta products count.
- **Touch:** backend controllers, `frontend/src/app/admin/security/*`,
  `frontend/src/app/admin/seo/*`.
- **Done when:** a failed login appears in the timeline; regenerate updates
  the sitemap timestamp.

### S8 — Backups + manual prices
- **Do:** النسخ: wire the backup page to a status endpoint (last successful
  backup time/size, destination health, schedule display) + a «نسخ الآن»
  trigger; restore stays a DOCUMENTED runbook — the dialog requires typing
  the word «استعادة» and offers an archive download, never a one-click
  in-app restore. الأسعار اليدوية (new): store selector → its price rows
  with inline edit (price/stock via the phase-17 manual endpoints, source
  becomes manual); a banner lists currently-failing scrape items to fix
  first.
- **Touch:** backend controllers, `frontend/src/app/admin/backup/*`,
  `frontend/src/app/admin/manual-prices/*`.
- **Done when:** «نسخ الآن» produces a backup record; a manual price fix
  clears the item from the failing list.

## Phase acceptance
- admin@as3ar.test (with 2FA) → every tab functional against seeded data;
  non-admin gets 403 on all /api/admin/*; no dash-data mock imports remain
  under `app/admin/`; all destructive actions are red text buttons with
  dialogs; the restore dialog requires typing «استعادة».
