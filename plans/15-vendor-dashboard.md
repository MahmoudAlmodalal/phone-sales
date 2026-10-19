# Phase 15 — Vendor Dashboard (brief §2.7, SRS Vendor Role) — New Build

**Goal:** the vendor workspace: KPIs, click/visit statistics, store profile
editor, dense products table with inline editing, bookings management,
API-keys screen. The `/vendor/*` section does NOT exist beyond the phase-06
scaffolds — this is a full frontend build plus its API.

**Depends on:** 05 (product_stats being written), 11 (bookings). Vendor auth
from 04.

**Produces:** /api/vendor/* endpoints, live `/vendor/**` pages.

## Context for the agent

- Scaffolds from phase 06: `app/vendor/layout.tsx` (DashboardLayout, tabs
  نظرة عامة · منتجاتي · الاستيراد · الحجوزات · متجري · الربط التقني) + stub
  pages. Reuse `components/dash/*` (DashShell, ConfirmDialog) built for admin.
- Guarding: role vendor AND verified store (phase-04 middleware/route group).
- الاستيراد tab content is phase 16; keep its stub.

## API contracts (auth: vendor, scoped to own store via StorePolicy)

| Endpoint | Notes |
|---|---|
| GET /api/vendor/overview | KPIs: active_products, bookings_today, conversion (bookings/clicks 30d), cancellation+no_show rate with threshold flag; series: bookings/day last 30 days; top products by clicks |
| GET /api/vendor/stats?range=30d | per-product rows: views, clicks, bookings (SRS: precise click/visit stats) |
| GET /api/vendor/products?q=&cursor= | price rows joined to product: name, price, stock, is_available, last_synced_at |
| PATCH /api/vendor/products/{price} | ONLY price and stock are editable (brief); price change flows through the observer → history/alerts |
| POST /api/vendor/products | attach an existing catalog product to the store (+price/stock); creating catalog products stays admin-only — vendors request via ticket |
| DELETE /api/vendor/products/{price} | soft: is_available=false |
| GET /api/vendor/bookings?status=&q= | search by number; actions from phase 11 (complete / no-show) |
| PUT /api/vendor/store | logo, address, city, geo, phone, website |
| GET/POST/DELETE /api/vendor/api-keys | plaintext shown once on create; hashed at rest |
| GET /api/vendor/sync-logs?limit=10 | last sync attempts + status |

## Steps

### S1 — Vendor API: overview + stats
- **Do:** Implement overview and stats endpoints with the KPI math above,
  everything scoped to the authed vendor's store.
- **Touch:** backend controllers, routes, tests.
- **Done when:** KPI math verified against seeded data in tests; another
  vendor's token sees only its own numbers.

### S2 — Vendor API: products, store, keys, logs
- **Do:** Implement the remaining endpoints per the table. PATCH must accept
  only price/stock (reject other fields). API keys: generate, return
  plaintext once, store the hash; revoke sets revoked_at.
- **Touch:** backend controllers, policies, tests.
- **Done when:** policy tests — vendor sees only own rows on every endpoint;
  PATCH price writes a price_history row and fires the alert pipeline.

### S3 — Overview page (نظرة عامة)
- **Do:** 4 KPI cards — the cancellation/no-show card turns red above the
  threshold flag; a vertical-bar SVG chart of bookings/day (reuse the
  phase-08 hand-rolled chart pattern); the «الأكثر نقرًا» mini-table
  (views/clicks/CTR in Mono columns); an unread booking-notifications strip.
- **Touch:** `frontend/src/app/vendor/page.tsx` + components.
- **Done when:** renders live for vendor@as3ar.test with seeded data; the
  threshold flag styling verified by tweaking seed numbers.

### S4 — Products table with inline edit (منتجاتي)
- **Do:** Dense table (compact rows, 8px radius): المنتج | السعر | المخزون |
  التوفر | آخر تحديث | إجراء. Inline edit on price & stock cells only: click
  → Mono input → blur/Enter autosaves (debounced PATCH) → tiny «حُفظ ١٤:٣٢»
  hint; Esc reverts; failed save → red text under the cell. «آخر تحديث»
  faded grey when older than the stale threshold. Add-product modal:
  catalog search via the suggest endpoint → set price/stock. Row action:
  إيقاف/تفعيل availability as text buttons.
- **Touch:** `frontend/src/app/vendor/products/*`.
- **Done when:** an inline price edit round-trips and appears in the public
  product page's price table; Esc/failure paths behave.

### S5 — Bookings page (الحجوزات)
- **Do:** List + status filter + search by number; rows: number (Mono),
  product, customer first name + phone, expected arrival, live countdown when
  active. Actions: «تم الاستلام» (solid green — completes and unlocks the
  review right) and «لم يحضر» (red TEXT + the phase-12 confirm dialog).
- **Touch:** `frontend/src/app/vendor/bookings/*`.
- **Done when:** completing a seeded booking flips it in the user's حجوزاتي
  too; no-show requires dialog confirmation.

### S6 — Store profile + integration pages
- **Do:** متجري: store form (logo upload, contacts, address + lat/lng),
  a preview of the public store card, pending-verification banner when not
  verified. الربط التقني: API-keys table (create with copy-once toast,
  revoke), webhook URL field, last-10 sync log with ✓/✗ chips, and a short
  docs block describing the price API pull (phase 17) and the CSV template
  link (phase 16).
- **Touch:** `frontend/src/app/vendor/store/*`, `frontend/src/app/vendor/integration/*`.
- **Done when:** store edits reflect on /store/[slug]; a created key is
  copyable exactly once and appears hashed in the DB.

## Phase acceptance
- vendor@as3ar.test login → all tabs (except الاستيراد stub) live with seeded
  data; inline edit round-trips through the observer pipeline; policy tests
  green on every endpoint.
