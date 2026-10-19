# Phase 20 — SEO, Security Hardening, Testing & Deployment

**Goal:** the final sweep: SRS §7 (SEO) and §8 (security) completed and
verified, end-to-end tests, and a deployment recipe.

**Depends on:** all previous phases.

**Produces:** sitemap/robots, finalized meta + schema, security checklist
evidence, encrypted backups + restore runbook, Playwright suite, deploy docs.

## Steps

### S1 — Friendly URLs & redirects
- **Do:** Product slugs = transliterated {brand}-{model}
  (samsung-galaxy-s24-ultra), generated once, unique, never recycled; an
  old-slug redirects table issuing 301s when a slug ever changes.
- **Touch:** backend slug generation, redirect middleware/table, tests.
- **Done when:** renaming a product's slug in tinker leaves the old URL
  301-ing to the new one.

### S2 — Meta algorithm & schema finalization
- **Do:** Finalize the phase-08 stubs. Title: «سعر {name_ar} — يبدأ من
  {min_price} ر.س | أسعار». Description: «قارن أسعار {name_ar} في {category}
  عبر {stores_count} متاجر. أفضل سعر اليوم {min_price} ر.س. تتبّع السعر
  واحجز للاستلام من المعرض.» Category and search pages get templated metas.
  Schema: Product + Offers (lowPrice/highPrice/priceCurrency/offerCount,
  availability from stock, priceValidUntil = last_synced + staleness window)
  + AggregateRating + BreadcrumbList. Canonical URLs, hreflang ar, alt texts
  from product names, next/image everywhere.
- **Touch:** `frontend/src/app/product/[slug]/*`, ProductJsonLd, search/
  category metadata.
- **Done when:** the Google Rich Results test passes for a seeded product
  URL (structure-wise); titles/descriptions match the algorithm.

### S3 — Dynamic sitemap & robots
- **Do:** SRS: the sitemap regenerates on new products/stores. Backend
  endpoint listing sitemap entries (products, categories, stores, lastmod)
  with model observers busting its cache; Next.js sitemap and robots files
  (allow all; disallow /account /vendor /admin; sitemap reference).
- **Touch:** backend endpoint + observers, `frontend/src/app/sitemap.ts`,
  `frontend/src/app/robots.ts`.
- **Done when:** sitemap.xml lists all seeded products; creating a product
  makes it appear without a manual cache clear.

### S4 — Security hardening checklist (SRS §8)
- **Do:** Verify each item and fix gaps, recording evidence (test name or
  config reference) inline in a `docs/security-checklist.md`:
  SQLi — Eloquent/bound queries only, audit raw-query usage with user input;
  XSS — React default escaping, audit any raw-HTML injection (only the
  JSON-LD script, safe-encoded), strip tags on rich-ish fields server-side;
  input validation — FormRequest classes on EVERY mutating endpoint (audit
  list); Bcrypt confirmed as the default hasher; 2FA enforced on
  /api/admin/*; rate limits — login 5/min, global API 60/min, /go/ 30/min,
  suggest 30/min; security_events written from all auth-failure paths;
  headers — CSP (self + data:), X-Frame-Options DENY, nofollow on /go/,
  HSTS in prod; uploads — validated, mime-sniffed, re-encoded, stored
  outside the webroot, served via storage routes; CSRF — SameSite=Lax
  session cookie + origin check in the Next route handler.
- **Touch:** across backend/frontend + `docs/security-checklist.md`.
- **Done when:** every checklist row has evidence; the added rate limits
  return 429 in tests.

### S5 — Encrypted backups + restore drill
- **Do:** Automated encrypted backups (SRS): a backup package (e.g.
  spatie/laravel-backup) — daily 03:00 DB + storage, encrypted archive
  (password in env), destination an S3-compatible bucket ("isolated cloud")
  with local fallback, weekly full, 30-day retention, failure → admin mail.
  Write `docs/runbooks/restore.md` and EXECUTE the restore once against a
  scratch database.
- **Touch:** backend backup config, scheduler, `docs/runbooks/restore.md`.
- **Done when:** a backup artifact exists, is encrypted, and the documented
  restore was performed once against a scratch DB.

### S6 — Test suites
- **Do:** Backend: full suite green with an authorization matrix test
  hitting every route group with every role; coverage focus — booking race,
  fraud state machine, import edge cases, alert pipeline. Frontend: build
  passes with zero TS errors; Playwright e2e against a seeded stack:
  (1) guest — home → search+filter → product → add 2 to compare → compare
  page; (2) user — login → set alert → book happy path → countdown →
  cancel; (3) vendor — login → inline price edit → bookings list → complete
  a booking; (4) review loop — user reviews a completed booking → admin
  approves → visible on the store page.
- **Touch:** `backend/tests/**`, `frontend/e2e/**`, Playwright config.
- **Done when:** all four scenarios green on a fresh seeded stack.

### S7 — Accessibility + brief compliance pass
- **Do:** axe run on the 4 main public pages; a keyboard-only booking flow;
  the brief's own review checklist — no red outside the 4 sanctioned cases,
  no star ratings anywhere, the star only in its 2 signature uses,
  reduced-motion honored (ticker, pulses, countdown).
- **Touch:** fixes wherever found.
- **Done when:** axe reports no critical violations; the checklist passes a
  manual sweep.

### S8 — Deployment
- **Do:** Frontend → Vercel (envs pointing at the public backend URL, image
  domains configured; SSR is fine — optionally cache the homepage 5 min).
  Backend → VPS (Docker) or Laravel Forge: php-fpm + nginx, Postgres 16,
  supervisor for the queue worker and scheduler (or real cron), S3 bucket
  for backups/uploads, TLS. Write `docs/deploy.md`: env matrix (dev/prod
  value for every variable), first-deploy checklist (migrate + the accounts
  seeder + catalog import — NOT the full demo seed), zero-downtime notes,
  log rotation. Prod smoke test: health endpoint, one booking round-trip,
  sitemap fetch, rich-results validation of one product URL.
- **Touch:** deploy configs, `docs/deploy.md`.
- **Done when:** the deployed preview is reachable and the smoke test
  passes.

## Phase acceptance
- Rich-results test passes; sitemap complete; security checklist fully
  evidenced; all Playwright scenarios green on a fresh seeded stack;
  deployed preview reachable; restore drill performed and documented.
