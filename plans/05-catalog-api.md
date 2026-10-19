# Phase 05 — Catalog API (Public Read Endpoints)

**Goal:** every public read the frontend needs: browse, advanced search with
live suggestions, product detail with cheapest-first store table, price
history, home-page sections, ticker, and affiliate click tracking.

**Depends on:** 03 (seeded data).

**Produces:** all public endpoints below, ProductQueryBuilder service, API
resources, docs/api.http examples.

## Context for the agent

- Response card shape MUST match the props of the existing
  `frontend/src/components/ProductCard.tsx` (read it first; align names, don't
  invent parallel fields).
- /go/{price_id} is a WEB route (00 §5), not under /api.

## Endpoint contracts

### GET /api/categories
Nested tree — id, name, slug, icon, children. Cached 10 min.

### GET /api/brands
List — id, name, name_ar, slug, logo.

### GET /api/products — search/list
Query params: q (name/name_ar/brand, case-insensitive with trigram index);
category (slug, includes descendants); brands[]; price_min/price_max (against
best available price); specs[storage][], specs[ram][], specs[screen][],
specs[battery][] (JSONB filters); store (slug); rating_min (store rating — SRS
filter); bookable=1 (any stock>0); dropped=7d (price fell in last 7 days);
sort: cheapest (default) | biggest_drop | most_viewed | most_compared | newest;
cursor, per_page (≤50).

Response item (card shape): id, slug, name_ar, brand, image, best_price,
stores_count, price_spread (max−min available — the «فرق ٢٣٠» differentiator,
brief §2.2), drop_7d_pct, bookable. Implementation: one query with subselects
or a summary SQL view — no N+1.

### GET /api/products/{slug} — detail
Product (name, description, grouped specs, images, category, brand);
best_price (price, store name+slug, updated-ago); prices array ordered
cheapest→highest with unavailable rows kept in place (brief §2.3) — each row:
store (name, slug, rating_avg, rating_count, city, is_verified), price, stock,
is_available, go_id (the price id for /go/ — raw affiliate_url is never
exposed), last_synced_at; lowest_ever (price, date); stats (views, compares).
Side effect: increment views_count + upsert product_stats (throttled per
session).

### GET /api/products/{slug}/price-history?range=30|90|365
Series of (date, price, store) + min, max, avg, min_point (price, date) —
powers the chart and the «أدنى سعر مسجّل» sentence.

### GET /api/suggest?q=…
≤8 results grouped: products (name_ar, slug, image, best_price), brands,
stores. Fast path: trigram indexes + 60s cache on hot prefixes; frontend
debounces 200ms.

### GET /api/home
ticker (12 top movers: name_ar, slug, best_price, change_pct),
last_update_minutes, biggest_drops (8 cards), most_viewed (8), most_compared
(8), best_deals (8 biggest spread), categories chips, trust counters (stores,
products, price_points). Cached 5 min. Ticker contract: if the latest sync
failed, add ticker_status "stale" + last_success_at — frontend shows the grey
«الأسعار قيد التحديث…» state, never red.

### GET /go/{product_price_id} — web route
302 redirect to the stored affiliate_url; increments product_stats.clicks
(daily upsert) and campaign clicks when an ad param is present. Rate-limit
30/min/IP.

### POST /api/products/{slug}/compared
Fire-and-forget increment of compares_count (called when a product is added to
compare).

## Steps

### S1 — Search infrastructure
- **Do:** Migration enabling the pg_trgm extension + trigram indexes on
  products.name, products.name_ar, brands.name. A ProductQueryBuilder service
  class encapsulating every filter and sort above (unit-testable in
  isolation).
- **Touch:** migration, `backend/app/Services/ProductQueryBuilder.php`.
- **Done when:** unit tests cover each filter and each sort against seeded
  data.

### S2 — List, categories, brands endpoints
- **Do:** Implement /api/products (cursor pagination), /api/categories
  (cached), /api/brands, with API resources for the card shape.
- **Touch:** controllers, `backend/app/Http/Resources/*`, routes.
- **Done when:** sort=biggest_drop surfaces the seeded big-drop products;
  spread math verified against a hand-computed product.

### S3 — Product detail + price history
- **Do:** Implement /api/products/{slug} (ordering + greyed-in-place
  unavailable rows + view counting side effect) and the price-history endpoint
  with range switching.
- **Touch:** controllers, resources.
- **Done when:** detail rows come back cheapest-first with unavailable rows in
  position; min_point matches the seeded historical low for a sampled product.

### S4 — Suggest + home
- **Do:** Implement /api/suggest (grouped, ≤8) and /api/home (all sections,
  5-min cache, stale-ticker contract). Cache busting hook: clearing the home
  cache is a named action later called by the ingestion phase.
- **Touch:** controllers, cache keys.
- **Done when:** suggest for "s24" returns grouped results; /api/home returns
  every section from seed data; manually marking the latest sync_log failed
  makes ticker_status stale.

### S5 — Click tracking web route
- **Do:** Implement GET /go/{price_id} in the web routes: 302 + click upsert +
  optional ad campaign click, rate-limited 30/min/IP.
- **Touch:** `backend/routes/web.php`, controller.
- **Done when:** hitting /go/ redirects and increments the day's clicks row
  exactly once per hit.

### S6 — Contract documentation + tests
- **Do:** Write docs/api.http with a working example request per endpoint.
  Feature tests: each filter & sort returns expected seeded products; suggest
  grouping; /go/ increments and redirects; detail ordering; compared
  increment.
- **Touch:** `backend/docs/api.http`, `backend/tests/Feature/Catalog*`.
- **Done when:** catalog test suite green; every endpoint in docs/api.http
  returns 200 against the seeded dev server.

## Phase acceptance
- All endpoints return the documented shapes; the card shape matches
  ProductCard.tsx props; /api/products responds quickly on seeded data
  (measure with timing middleware — investigate anything over ~150ms locally).
