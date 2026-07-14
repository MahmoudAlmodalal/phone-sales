# Phase 20 — SEO, Security Hardening, Testing & Deployment

**Goal:** the final sweep: SRS §7 (SEO) and §8 (security) completed and verified,
end-to-end tests, and a deployment recipe.

**Prerequisites:** all previous phases.

## 1. SEO (SRS §7)

- [ ] **Friendly URLs**: product slugs = `{brand}-{model}` transliterated
      (`samsung-galaxy-s24-ultra`), generated once, unique, never recycled;
      old-slug redirects table if a slug changes (301).
- [ ] **Auto meta algorithm** (finalize the phase-08 stub) —
      title: «سعر {name_ar} — يبدأ من {min_price} ر.س | أسعار»;
      description: «قارن أسعار {name_ar} في {category} عبر {stores_count} متاجر.
      أفضل سعر اليوم {min_price} ر.س. تتبّع السعر واحجز للاستلام من المعرض.»
      Category & search pages get templated metas too.
- [ ] **Schema markup**: `<ProductJsonLd>` verified — Product + Offer(s)
      (lowPrice/highPrice/priceCurrency/offerCount, availability from stock,
      priceValidUntil = last_synced + staleness window) + AggregateRating (store
      ratings) + BreadcrumbList. Validate with Google Rich Results test.
- [ ] **Dynamic sitemap** (SRS: regenerates on new products/stores):
      Laravel `GET /api/sitemap-entries` (products, categories, stores, lastmod) →
      Next `app/sitemap.ts`; regen trigger = model observers bust the entries cache;
      `app/robots.ts` (allow all, disallow /account /vendor /admin, sitemap ref).
- [ ] `next/image` everywhere, alt texts from product names, canonical URLs,
      `hreflang ar`.

## 2. Security hardening checklist (SRS §8 — verify each, add missing)

| Item | Where verified |
|---|---|
| SQLi | Eloquent/bound queries only — grep audit for `DB::raw` with input |
| XSS | React escapes by default; audit any `dangerouslySetInnerHTML` (should be none except JSON-LD script — safe-encode it); Laravel `strip_tags` on rich-ish fields |
| Input validation | FormRequest classes on **every** mutating endpoint — audit list |
| Bcrypt | Laravel default hasher confirmed (`config/hashing.php`) |
| 2FA | enforced middleware on `/api/admin/*`; offered to vendors (phase 04) |
| Rate limits | login 5/min; API global 60/min; `/go/` 30/min; suggest 30/min |
| Security log | `security_events` written from all auth failure paths (phase 04/12) |
| Headers | Next + Laravel: CSP (self + data:), X-Frame-Options DENY, nofollow on `/go/`, HSTS in prod |
| Uploads | images validated/mime-sniffed/re-encoded; stored outside webroot; served via signed/storage routes |
| CSRF | pure token API + httpOnly cookie proxy: SameSite=Lax on the session cookie, origin check in the Next route handler |

- [ ] **Automated encrypted backups** (SRS): `spatie/laravel-backup` —
      daily 03:00 DB + storage, **encrypted archive (password in env)**, destination:
      S3-compatible bucket ("isolated cloud") + local fallback; weekly full;
      retention 30d; failure → admin mail. **Restore drill documented in
      `docs/runbooks/restore.md` and executed once against a scratch DB.**

## 3. Testing

- [ ] Backend: `php artisan test` full suite green (phases 04–19 accumulated);
      coverage focus: booking race, fraud state machine, import edge cases,
      alert pipeline, policies (authorization matrix test hitting every route
      group with every role).
- [ ] Frontend: `npm run build` zero errors; Playwright e2e (against seeded stack):
      1) guest: home → search+filter → product → add compare ×2 → compare page.
      2) user: login → set alert → book (happy path) → see countdown → cancel.
      3) vendor: login → inline price edit → bookings list → complete booking.
      4) user reviews completed booking → admin approves → visible on store page.
- [ ] Accessibility pass: axe on the 4 main public pages; keyboard-only booking flow.
- [ ] Brief compliance review (its own checklist): no red outside the 4 cases,
      no star-ratings anywhere, star only in the 2 signature uses,
      reduced-motion honored.

## 4. Deployment

- [ ] **Frontend → Vercel**: env `API_URL`/`NEXT_PUBLIC_API_URL` → public backend URL;
      image domains config; ISR not required (SSR fine) — optionally cache `/` 5 min.
- [ ] **Backend → VPS (Docker) or Laravel Forge**: php-fpm + nginx, Postgres 16,
      supervisor for `queue:work` + `schedule:work` (or real cron `schedule:run`),
      S3 bucket for backups/uploads, TLS (Let's Encrypt).
- [ ] `docs/deploy.md`: env matrix (dev/prod values for every variable),
      first-deploy checklist (migrate --seed? no — `migrate` + `db:seed --class=AccountSeeder`
      + catalog import), zero-downtime notes (`php artisan down --render`), log rotation.
- [ ] Smoke test in prod: health endpoint, one booking round-trip, sitemap fetch,
      rich-results validation of one product URL.

## Definition of Done
- [ ] Google Rich Results test passes for a product page; sitemap.xml lists all
      seeded products; meta titles/descriptions render per algorithm.
- [ ] Security checklist all ✓ with evidence (test or config reference) noted inline.
- [ ] All Playwright scenarios green on a fresh `migrate:fresh --seed` stack.
- [ ] Deployed preview reachable; restore drill performed and documented.
