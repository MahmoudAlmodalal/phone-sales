# Phase 15 — Vendor Dashboard (brief §2.7, SRS Vendor role)

**Goal:** the vendor workspace: KPIs, click/visit statistics, store profile editor,
dense products table with inline editing, bookings management, API-keys screen.

**Prerequisites:** Phases 11 (bookings), 05 (product_stats being written). Vendor auth (04).

## Structure
`src/app/vendor/layout.tsx` → DashboardLayout, tabs:
**نظرة عامة · منتجاتي · الاستيراد · الحجوزات · متجري · الربط التقني**
Routes: `/vendor`, `/vendor/products`, `/vendor/import` (phase 16), `/vendor/bookings`,
`/vendor/store`, `/vendor/integration`. Guarded: role vendor + verified store.

## API (auth: vendor, scoped to own store via policy)

| Endpoint | Notes |
|---|---|
| GET `/api/vendor/overview` | KPIs: active_products, bookings_today, conversion (bookings/clicks 30d), cancellation_no_show_rate + threshold flag; series: bookings last 30 days; top products by clicks |
| GET `/api/vendor/stats?range=30d` | per-product rows: views, clicks, bookings (from `product_stats`) — SRS «إحصائيات دقيقة حول النقرات والزيارات» |
| GET `/api/vendor/products?q=&cursor=` | product_price rows joined to product: name, price, stock, is_available, last_synced_at |
| PATCH `/api/vendor/products/{price}` | **only `price` and `stock`** inline-editable (brief); price change flows through observer → history/alerts |
| POST `/api/vendor/products` | attach existing catalog product to store (+price/stock); creating brand-new catalog products stays admin-only, vendor can *request* via ticket |
| DELETE `/api/vendor/products/{price}` | soft: `is_available=false` |
| GET `/api/vendor/bookings?status=&q=` | search by number; actions per phase 11 (`complete`, `no-show`) |
| PUT `/api/vendor/store` | logo, address, city, geo, phone, website — SRS store data |
| GET/POST/DELETE `/api/vendor/api-keys` | shows plaintext once on create; hashed at rest |
| GET `/api/vendor/sync-logs?limit=10` | last 10 sync attempts + status (brief) |

## UI tasks

### نظرة عامة `/vendor`
- [ ] 4 KPI cards; **نسبة الإلغاء/عدم الحضور turns red above threshold** (config, e.g. 15%).
- [ ] Bar chart: bookings/day last 30 days (reuse hand-rolled SVG chart pattern from
      phase 08, vertical bars).
- [ ] «الأكثر نقرًا» mini-table (views/clicks/CTR Mono columns).
- [ ] Unread booking notifications strip.

### منتجاتي `/vendor/products`
- [ ] Dense table (8px radius, compact rows): المنتج | السعر | المخزون | التوفر |
      آخر تحديث | إجراء.
- [ ] **Inline edit** on price & stock cells only: click → Mono input → blur/Enter
      autosaves (debounced PATCH) → tiny hint «حُفظ ١٤:٣٢»; Esc reverts; failed save →
      red text under cell.
- [ ] «آخر تحديث» faded grey when > 48h (gentle pressure to update — brief).
- [ ] Add-product modal: search catalog (`/api/suggest`) → set price/stock.
- [ ] Row action: إيقاف/تفعيل availability (text buttons).

### الحجوزات `/vendor/bookings`
- [ ] List + status filter + search by number; row: number (Mono), product, customer
      first name + phone, expected arrival, countdown if active.
- [ ] Actions: «تم الاستلام» (green solid — closes + unlocks review) and «لم يحضر»
      (red **text** + confirm dialog, phase 12).

### متجري `/vendor/store`
- [ ] Store profile form (logo upload, contacts, address + lat/lng inputs), preview
      of public store card; pending-verification banner if not yet verified.

### الربط التقني `/vendor/integration`
- [ ] API keys table (create/revoke, copy-once toast), webhook URL field,
      last-10 sync log with ✓/✗ chips (from `sync_logs`).
- [ ] Short docs block: how the price API pull works (phase 17), CSV template link (phase 16).

## Tests
- [ ] Vendor sees only own store's rows (policy tests for every endpoint).
- [ ] Inline PATCH price → `price_history` row + alert pipeline fires.
- [ ] Conversion/no-show KPI math against seeded data.

## Definition of Done
- [ ] `vendor@as3ar.test` login → all tabs live with seeded data; inline edit round-trips;
      completing a booking flips it in the user's dashboard too.
