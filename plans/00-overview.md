# Phase 00 — Project Overview, Conventions & Execution Protocol

Master document for the "أسعار" (As3ar) platform — a smart phone price-comparison
and pre-booking platform, per the SRS (وثيقة المواصفات الفنية والهندسة العامة,
July 2026) and the Claude Design visual-identity brief. Read this file before
executing any phase. Every cross-phase fact (enum values, config keys, endpoint
paths, tab lists) is defined here or in phase 02 — phase files must match these
exactly.

## 1. What we are building

A bilingual-by-design (Arabic RTL UI) platform where:

- **Guests** browse, search, compare phones, and view live per-store price tables.
- **Users** additionally manage a profile, favorites, price-drop alerts, and book
  devices for in-store pickup (pay on arrival — no online payment).
- **Vendors** manage their store, products, and prices (manual, bulk CSV/XLSX, or
  API), see click/visit statistics, and receive instant booking notifications.
- **Admins** control everything: users/stores, category tree, ingest monitoring,
  ad campaigns, analytics reports, review moderation, security log, backups, SEO.

## 2. Current repository state (read before planning any step)

This is NOT a greenfield project. As of July 2026:

- `frontend/` **exists and is built**: Next.js 15 App Router, TypeScript,
  Tailwind, RTL, design tokens installed, running on mock data
  (`src/lib/mock-data.ts`, `src/lib/dash-data.ts`). Shared components exist in
  `src/components/` (Navbar, Footer, Star, ProductCard, PriceTicker, CompareBar,
  Badge, Skeleton, Toast, EmptyState, RatingBar, Countdown, DashboardLayout,
  RoleGuard, HomeSearch, dash/*). Zustand stores exist in `src/stores/`
  (compare, favorites, session, toast). Existing routes (top level, no route
  group): `/`, `/search`, `/compare`, `/login`, `/account` (+ favorites, alerts,
  bookings), `/admin` (+ users, merchants, reviews, complaints, fraud, backup),
  `/dev/kitchen-sink`, plus empty folders for `/product/[slug]`, `/store/[slug]`,
  `/booking/[number]`.
- `backend/` **does not exist** — Laravel is built from phase 01 onward.
- `docker-compose.yml` **does not exist** — created in phase 01.
- There is **no `design-reference/` folder**. The design source of truth is the
  Claude Design document (the `.dc.html` accessed via DesignSync). The existing
  frontend components already implement it; phases must reuse those components,
  never re-port from a prototype.
- `specs/001-role-based-navigation/` holds a Spec Kit spec for navigation work;
  it is informational, not a dependency of these phases.

Consequence: frontend work in phases 06–19 means **wiring existing pages to the
real API and building the missing pages** (`/product/[slug]`, `/store/[slug]`,
`/booking/*`, all of `/vendor/*`, and several admin tabs) — not porting.

## 3. Stack (user-approved decisions)

| Layer | Choice |
|---|---|
| Backend | Laravel 12 (PHP 8.3+), REST API only, Sanctum auth |
| Frontend | Next.js 15+ App Router, TypeScript, Tailwind CSS (already in place) |
| Database | PostgreSQL 16 (Docker for dev) |
| Queue / Cron | Laravel database queue + scheduler (schedule:work in dev) |
| Mail (dev) | Mailpit (Docker, http://localhost:8025) |

## 4. Design conventions (non-negotiable — from the design brief)

- **RTL everywhere**: html dir="rtl" lang="ar"; Tailwind logical props (ms-*, pe-*).
- **Color tokens** (already in the frontend Tailwind config): green #007A3D,
  green-deep #00532A, green-tint #E6F2EB, ink #0E1311, paper #FFFFFF,
  surface #F4F6F5, line #DDE3E0, muted #6B7772, star #CE1126, star-tint #FDECEE.
- **The red rule**: star/star-tint ONLY for (1) booking countdown, (2) price
  increases, (3) destructive actions/errors, (4) last unit / out of stock.
  Never solid red buttons — destructive actions are red *text* buttons.
- **The star rule**: the 5-point red star appears only as (1) booking step
  indicator, (2) «موثّق» verified-review badge. Ratings are NEVER shown as
  stars — always number (4.6) + horizontal bar + review count.
- **Fonts**: headings Tajawal 700/800; body IBM Plex Sans Arabic 400/500;
  all prices/numbers IBM Plex Mono 500, LTR digits inside RTL layout.
- **Shape**: cards 12px radius, inputs 8px, badges 999px; near-zero shadows,
  rely on borders.
- Loading states: pulsing surface skeleton rectangles, never spinners.
- Accessibility: contrast ≥ 4.5:1, visible 2px green focus ring, respect
  prefers-reduced-motion (ticker and pulses stop).

## 5. API conventions

- Base URL: http://localhost:8000/api (env NEXT_PUBLIC_API_URL / API_URL).
- Envelope: success responses wrap the payload in a `data` key with optional
  `meta`; errors return `message` plus a per-field `errors` map (Laravel default).
- **Typed error codes**: when the client must branch on an error (not just show
  it), the error body also carries a top-level `code` string. Defined codes:
  `two_factor_required` (login needs an OTP — HTTP 422),
  `stock_conflict` (booking confirm lost the race — HTTP 409, body includes an
  `alternatives` list), `restricted` (user under booking restriction — HTTP 403,
  body includes `restricted_until` and `reason`).
- Auth: bearer token in the Authorization header; the Next.js server proxies it
  from an httpOnly cookie via a route handler.
- Pagination: cursor-based for product lists (`?cursor=`), page-based for admin
  tables. All list endpoints accept `?per_page` (max 50).
- Locale: API returns Arabic content; keys/enums in English.
- **Web routes (not under /api)**: the affiliate redirect `GET /go/{price_id}`
  lives in the web routes file — it is a browser redirect with click tracking,
  not a JSON endpoint.

## 6. Global config values (single source of truth)

Backend config file `backend/config/platform.php`:

| Key | Value | Source |
|---|---|---|
| booking.hold_hours | 24 | SRS §4 (brief showed 48h — SRS wins; UI reads config) |
| booking.max_qty | 2 | brief §2.5 |
| booking.reminder_hours_before | 2 | SRS §4 |
| booking.draft_ttl_minutes | 30 | drafts swept after this |
| fraud.no_show_threshold | 3 | SRS §4 |
| fraud.no_show_window_days | 90 | rolling strike window |
| fraud.restriction_days | 14 | brief §2.5 |
| compare.max_items | 4 | brief §2.4 |
| prices.stale_after_hours | 48 | brief §2.7 (grey stale prices) |

Booking numbers: format BK-{YY}-{6-digit sequence}, where YY is the two-digit
year at creation time (2026 → BK-26-000173). Never hardcode the year.

## 7. Phase index & dependency graph

| Phase | Title | Depends on |
|---|---|---|
| 01 | Backend scaffold & infrastructure | — |
| 02 | Database schema | 01 |
| 03 | Seed data | 02 |
| 04 | Auth & roles (+2FA) | 02 |
| 05 | Catalog API | 03 |
| 06 | Frontend integration foundation | 01 (05 contracts, mockable) |
| 07 | Public pages: Home + Search wiring | 05, 06 |
| 08 | Product page (new build) | 05, 06 |
| 09 | Comparison wiring | 06, 08 |
| 10 | Favorites & price alerts | 04, 08 |
| 11 | Booking system | 04, 08 |
| 12 | Anti-fraud & penalties | 11 |
| 13 | Verified store reviews | 11 |
| 14 | User dashboard wiring | 10, 11, 12, 13 |
| 15 | Vendor dashboard (new build) | 05, 11 |
| 16 | Bulk import | 15 |
| 17 | Data ingestion engine | 05, 16 |
| 18 | Admin dashboard | 12, 13, 17, 19 |
| 19 | Support tickets | 04 |
| 20 | SEO, security hardening, deploy | all |

Phases 04/05/06 can run in parallel after 03. Frontend phases 07–09 can run in
parallel with backend phases 10–13 once 05 and 06 are done. Phase 19 can run any
time after 04; its admin queue UI lands in 18.

## 8. How to execute a phase with an LLM CLI

Each phase file is a numbered list of steps (S1, S2, …). Each step is sized for
one session of any LLM CLI agent (Claude Code, Codex, Gemini CLI, …) and carries:

- **Do** — one bounded instruction.
- **Touch** — the files/directories it creates or modifies.
- **Done when** — a concrete check (a command to run or behavior to observe).

Protocol: give the agent phase 00 + the phase file + the single step. Run the
step's "Done when" check before moving on. Commit after each step
(commit message pattern: feat(NN): SX short description). Never start a step
whose phase dependencies (table §7) are incomplete. If a step's "Done when"
fails, fix within the same step's scope before advancing.

## 9. How to run (after phase 01)

- Infra: `docker compose up -d` → Postgres :5432, Mailpit :8025.
- Backend: from `backend/` — install Composer deps, migrate with seed, then run
  the dev server (:8000), a queue worker, and the scheduler in three terminals.
- Frontend: from `frontend/` — install npm deps, `npm run dev` (:3000).
- Demo accounts (phase 03): admin@as3ar.test, vendor@as3ar.test,
  vendor2@as3ar.test, user@as3ar.test — password `password` (dev only).

## 10. Definition of Done (project-wide)

- Every SRS section (roles, UX, ingest, booking, extras, DB, SEO, security) is
  traceable to at least one implemented phase.
- Backend test suite green; Playwright happy-path e2e green (phase 20).
- The UI passes the brief's review checklist: no red outside the 4 cases, no
  star ratings, star used only in the 2 signature spots.
