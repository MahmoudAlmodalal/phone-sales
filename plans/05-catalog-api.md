# Phase 05 — Catalog API (Public Read Endpoints)

**Goal:** every public read the frontend needs: browse, advanced search + live
suggestions, product detail with cheapest-first store table, price history,
home-page sections, ticker, and affiliate click tracking.

**Prerequisites:** Phase 03 (seeded data).

## Endpoints (all public, cached where noted)

### GET `/api/categories`
Nested tree `{id, name, slug, icon, children[]}` — cached 10 min.

### GET `/api/brands`
`{id, name, name_ar, slug, logo}` list.

### GET `/api/products` — the search/list endpoint
Query params:
- `q` (matches name/name_ar/brand, pg `ILIKE` + trigram index)
- `category` (slug; includes descendant categories), `brands[]`
- `price_min`, `price_max` (against best available price)
- `specs[storage][]`, `specs[ram][]`, `specs[screen][]`, `specs[battery][]` (JSONB filters)
- `store` (slug), `rating_min` (store rating — SRS filter), `bookable=1` (any stock>0),
  `dropped=7d` (price fell in last 7 days)
- `sort`: `cheapest` (default) | `biggest_drop` | `most_viewed` | `most_compared` | `newest`
- `cursor`, `per_page` (≤50) — cursor pagination for continuous scroll (SRS §2)

Response item (card shape — matches `ProductCard`):
```json
{ "id": 1, "slug": "samsung-galaxy-s24-ultra", "name_ar": "جالكسي S24 ألترا",
  "brand": "Samsung", "image": "...", "best_price": 1150.00,
  "stores_count": 7, "price_spread": 230.00, "drop_7d_pct": -4.1, "bookable": true }
```
`price_spread` = max−min available price (the "فرق ٢٣٠" line — key differentiator per brief §2.2).
Implementation: single query with subselects / a `product_price_summary` SQL view; avoid N+1.

### GET `/api/products/{slug}` — product detail
`{product (name, description, specs grouped, images, category, brand),
  best_price {price, store{name,slug}, updated_ago},
  prices: [ {store{name, slug, rating_avg, rating_count, city, is_verified},
             price, stock, is_available, affiliate_url→null (use /go/), last_synced_at} ]
             — ordered cheapest→highest, unavailable kept in place greyed (brief §2.3),
  lowest_ever {price, date}, stats {views, compares} }`
Side effect: increment `views_count` + upsert `product_stats` (throttled per session).

### GET `/api/products/{slug}/price-history?range=30|90|365`
`{ series: [{date, price, store}], min, max, avg, min_point {price, date} }`
— powers the chart + the "أدنى سعر مسجّل: ١,٠٩٠ في ١٢ مارس" sentence.

### GET `/api/suggest?q=…` — live suggestions (brief §2.2)
≤8 results grouped: `{products:[{name_ar, slug, image, best_price}], brands:[…], stores:[…]}`.
Target < 80ms: trigram indexes on names; cache hot prefixes 60s. Frontend debounces 200ms.

### GET `/api/home` — one call for the whole homepage
`{ ticker: [12 top movers {name_ar, slug, best_price, change_pct}],
   last_update_minutes, biggest_drops: [8 cards], most_viewed: [8], most_compared: [8],
   best_deals: [8 — biggest spread], categories: chips,
   trust: {stores, products, price_points} }` — cached 5 min.
Ticker empty-state contract: if the latest sync failed, `ticker_status: 'stale'` +
`last_success_at` (frontend shows grey "الأسعار قيد التحديث…" — never red).

### GET `/go/{product_price_id}` — affiliate redirect + click tracking (SRS: vendor click stats)
302 → the stored `affiliate_url`; increments `product_stats.clicks` (daily upsert)
and campaign clicks if `?ad=` present. Rate-limit 30/min/IP. Web route, not API.

### POST `/api/products/{slug}/compared`
Fire-and-forget increment of `compares_count` (called when a product is added to compare).

## Backend tasks
- [ ] `pg_trgm` extension migration + trigram indexes on `products.name`, `name_ar`, `brands.name`.
- [ ] `ProductQueryBuilder` service encapsulating filters/sorts (unit-testable).
- [ ] API Resources: `ProductCardResource`, `ProductDetailResource`, `PriceRowResource`.
- [ ] Response caching (`Cache::remember`) for `/home`, `/categories`; bust on price sync.
- [ ] Tests: each filter & sort returns expected seeded products; spread math; suggest
      grouping; `/go/` increments clicks and redirects; detail orders cheapest-first
      with unavailable greyed-in-place data intact.

## Definition of Done
- [ ] All endpoints return documented shapes (add `docs/api.http` examples file).
- [ ] `GET /api/products?sort=biggest_drop` surfaces the seeded big-drop products.
- [ ] p95 < 150ms locally for `/api/products` on seeded data (check with `ab` or timing middleware).
