# Phase 00 — Project Overview & Conventions

> Master document for the "أسعار" (As3ar) platform — a smart phone price-comparison and
> pre-booking platform, per the SRS (وثيقة المواصفات الفنية والهندسة العامة, July 2026)
> and the Claude Design visual-identity brief. Read this file before executing any phase.

## 1. What we are building

A bilingual-by-design (Arabic RTL UI) platform where:

- **Guests** browse, search, compare phones, and view live per-store price tables.
- **Users** additionally manage a profile, favorites, price-drop alerts, and book devices
  for in-store pickup (pay on arrival — no online payment).
- **Vendors** manage their store, products, and prices (manual, bulk CSV/XLSX, or API),
  see click/visit statistics, and receive instant booking notifications.
- **Admins** control everything: users/stores, category tree, ingest monitoring,
  ad campaigns, analytics reports, review moderation, security log, backups, SEO.

## 2. Stack (user-approved decisions)

| Layer | Choice |
|---|---|
| Backend | **Laravel 12** (PHP 8.3+), REST API only, Sanctum auth |
| Frontend | **Next.js 15+ App Router**, TypeScript, Tailwind CSS |
| Database | **PostgreSQL 16** (Docker for dev) |
| Queue / Cron | Laravel database queue + scheduler (`schedule:work`) |
| Mail (dev) | Mailpit (Docker, http://localhost:8025) |
| UI source | Port of the `design-reference/as3ar-app` prototype (React 18 + Tailwind, RTL) |

## 3. Repository layout

```
phone sales/
├─ plans/                     # these phase documents
├─ design-reference/          # read-only: original prototype + design brief
│  ├─ as3ar-app/              # Vite React prototype (do NOT edit; port from it)
│  └─ design-brief.md         # visual identity — authoritative for all UI work
├─ backend/                   # Laravel 12 API — php artisan serve (:8000)
│  ├─ app/Models/
│  ├─ app/Http/Controllers/Api/
│  ├─ app/Http/Middleware/
│  ├─ app/Services/           # PriceSyncService, BookingService, FraudService…
│  ├─ app/Jobs/               # queued: alerts, imports, scraping, expiry
│  ├─ app/Notifications/
│  ├─ app/Policies/
│  ├─ database/{migrations,seeders,factories}/
│  └─ routes/{api.php,console.php}
├─ frontend/                  # Next.js — npm run dev (:3000)
│  └─ src/
│     ├─ app/(public)/        # SSR pages: /, /search, /product/[slug], /compare, /store/[slug], /login
│     ├─ app/account/         # user dashboard (protected)
│     ├─ app/vendor/          # vendor dashboard (protected)
│     ├─ app/admin/           # admin dashboard (protected)
│     ├─ components/          # ported + new components
│     ├─ lib/api.ts           # typed API client
│     ├─ lib/format.ts        # Arabic number/currency/date formatters
│     └─ stores/              # Zustand: compare, favorites, session
└─ docker-compose.yml         # postgres:16 + mailpit
```

## 4. Design conventions (non-negotiable — from the design brief)

- **RTL everywhere**: `<html dir="rtl" lang="ar">`; Tailwind logical props (`ms-*`, `pe-*`).
- **Color tokens** (Tailwind config): `green #007A3D`, `green-deep #00532A`,
  `green-tint #E6F2EB`, `ink #0E1311`, `paper #FFFFFF`, `surface #F4F6F5`,
  `line #DDE3E0`, `muted #6B7772`, `star #CE1126`, `star-tint #FDECEE`.
- **The red rule**: `star`/`star-tint` ONLY for (1) booking countdown, (2) price
  increases, (3) destructive actions/errors, (4) "last unit / out of stock".
  Never solid red buttons — destructive actions are red *text* buttons.
- **The star rule**: the 5-point red star appears only as (1) booking step indicator,
  (2) "موثّق" verified-review badge. Ratings are NEVER shown as stars — always
  number (`4.6`) + horizontal bar + review count.
- **Fonts**: headings `Tajawal` 700/800; body `IBM Plex Sans Arabic` 400/500;
  **all prices/numbers `IBM Plex Mono` 500**, LTR digits inside RTL layout.
- **Shape**: cards 12px radius, inputs 8px, badges 999px; near-zero shadows
  (`0 1px 2px rgba(14,19,17,.06)`), rely on borders.
- Loading states: pulsing `surface` skeleton rectangles, never spinners.
- Accessibility: contrast ≥ 4.5:1, visible 2px green focus ring,
  respect `prefers-reduced-motion` (ticker and pulses stop).

## 5. API conventions

- Base URL: `http://localhost:8000/api` (env `NEXT_PUBLIC_API_URL`).
- Envelope: success → `{ "data": …, "meta": … }`; error → `{ "message": "...", "errors": {field: [..]} }` (Laravel default).
- Auth: `Authorization: Bearer <sanctum token>`; the Next.js server proxies it from an httpOnly cookie.
- Pagination: cursor-based for product lists (`?cursor=`), page-based for admin tables.
- All list endpoints accept `?per_page` (max 50).
- Locale: API returns Arabic content; keys/enums in English.

## 6. Global config values (single source of truth)

`backend/config/platform.php`:

| Key | Value | Source |
|---|---|---|
| `booking.hold_hours` | **24** | SRS §4 (brief showed 48h — SRS wins; UI reads config) |
| `booking.max_qty` | 2 | brief §2.5 |
| `booking.reminder_hours_before` | 2 | SRS §4 (reminder 1–2h before expiry) |
| `fraud.no_show_threshold` | 3 | SRS §4 (restriction after repeated no-shows) |
| `fraud.restriction_days` | 14 | brief §2.5 |
| `compare.max_items` | 4 | brief §2.4 |
| `prices.stale_after_hours` | 48 | brief §2.7 (grey stale prices) |

## 7. Phase index & dependency graph

| Phase | Title | Depends on |
|---|---|---|
| 01 | Scaffold & tooling | — |
| 02 | Database schema | 01 |
| 03 | Seed data | 02 |
| 04 | Auth & roles (+2FA) | 02 |
| 05 | Catalog API | 03 |
| 06 | Frontend foundation | 01 |
| 07 | Public pages (Home, Search) | 05, 06 |
| 08 | Product page | 05, 06 |
| 09 | Comparison | 06, 08 |
| 10 | Favorites & price alerts | 04, 08 |
| 11 | Booking system | 04, 08 |
| 12 | Anti-fraud & penalties | 11 |
| 13 | Verified store reviews | 11 |
| 14 | User dashboard | 10, 11 |
| 15 | Vendor dashboard | 11 |
| 16 | Bulk import | 15 |
| 17 | Data ingestion engine | 05, 16 |
| 18 | Admin dashboard | 12, 13, 17 |
| 19 | Support tickets | 04 |
| 20 | SEO, security hardening, deploy | all |

Phases 04/05/06 can run in parallel after 03. Frontend phases (07–09) can run in
parallel with backend phases (10–13) once 05+06 are done.

## 8. How to run (after phase 01)

```bash
# infra
docker compose up -d                 # postgres :5432, mailpit :8025

# backend
cd backend
composer install && php artisan migrate --seed
php artisan serve                    # :8000
php artisan queue:work               # separate terminal
php artisan schedule:work            # separate terminal (dev cron)

# frontend
cd frontend
npm install && npm run dev           # :3000
```

Demo accounts (phase 03): `admin@as3ar.test`, `vendor@as3ar.test`,
`user@as3ar.test` — password `password` (dev only).

## 9. Definition of Done (project-wide)

- Every SRS section (roles, UX, ingest, booking, extras, DB, SEO, security) is
  traceable to at least one implemented phase.
- `php artisan test` green; Playwright happy-path e2e green (phase 20).
- The UI passes the brief's review checklist: no red outside the 4 cases, no
  star ratings, star used only in the 2 signature spots.
