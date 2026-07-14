# Phase 03 — Seed Data (Realistic Demo Content)

**Goal:** the database looks like a live Saudi phone market — real model names, plausible
SAR prices, 90 days of price movement — so every UI screen has real content
(brief rule: "استخدم محتوى واقعيًا… لا تستخدم Lorem ipsum").

**Prerequisites:** Phase 02.

## Tasks

### 1. Factories
- [ ] `UserFactory` (role states: `user()`, `vendor()`, `admin()`).
- [ ] `StoreFactory`, `ProductFactory` (specs JSON generator per category),
      `ProductPriceFactory`, `BookingFactory`, `ReviewFactory`,
      `SupportTicketFactory`, `AdCampaignFactory`.

### 2. Static seeders (deterministic, not faker-random)
- [ ] **`AccountSeeder`** — demo accounts, password `password`:
      `admin@as3ar.test` (admin), `vendor@as3ar.test` (vendor, owns "متجر التقنية"),
      `vendor2@as3ar.test`, `user@as3ar.test` (user).
- [ ] **`CategorySeeder`** — tree: جوالات → (آيفون، سامسونج، شاومي، هواوي، أخرى)؛
      إكسسوارات → (شواحن، سماعات، كفرات)؛ أجهزة لوحية. (Multi-level per SRS.)
- [ ] **`BrandSeeder`** — Apple, Samsung, Xiaomi, Huawei, Google, OnePlus, Honor,
      Oppo, Realme, Nothing (with Arabic names).
- [ ] **`ProductSeeder`** — ~60 real models via a PHP data file
      `database/data/phones.php`: name, name_ar, brand, release_year, base price,
      specs (screen size/type, chip, RAM, storage variants, camera MP, battery mAh,
      5G, weight) grouped for the specs table. Examples: iPhone 15 / 15 Pro / 16 Pro Max,
      Galaxy S24 / S24 Ultra / A55 / Z Flip6, Xiaomi 14 / Redmi Note 13 Pro, Pixel 9,
      Huawei P60, OnePlus 12, Honor Magic6 …
- [ ] **`StoreSeeder`** — 8 stores with Arabic trade names (متجر التقنية، عالم الجوال،
      اكسترا فون، جوال بلس، …), cities (الرياض، جدة، الدمام), addresses, coordinates,
      two owned by the demo vendors, `is_verified` mixed.

### 3. Dynamic seeders
- [ ] **`PriceSeeder`** — for each product pick 3–7 stores; price = base ± up to 8%,
      rounded to 9-ending (1,149 / 1,199); stock 0–15 (a few `0` for "نفدت الكمية"
      states); affiliate URLs `https://store.example/p/{slug}`; `source` mixed;
      `last_synced_at` mostly recent, ~15% older than 48h (to show the stale grey state).
- [ ] **`PriceHistorySeeder`** — bypass the observer; generate 90 days per
      product_price with a random walk (±0–2%/day) + 2–3 event jumps (−5–12% "sale",
      +4% "hike") so charts show real shape; ensure current price = last history point.
      Make ~10 products have a big 7-day drop (feeds "أكبر انخفاض اليوم").
- [ ] **`EngagementSeeder`** — `product_stats` daily rows for 30 days (views 20–900,
      clicks ~4% of views); set `products.views_count/compares_count` aggregates.
- [ ] **`BookingSeeder`** — for the demo user: 1 `active` booking (expires in ~20h,
      arrival in ~3h), 2 `completed`, 1 `cancelled`, 1 `no_show`; plus ~30 random
      bookings across stores for vendor KPIs (last 30 days spread — feeds the chart).
      Matching `booking_events` rows.
- [ ] **`ReviewSeeder`** — reviews only for `completed` bookings; ratings weighted
      4–5; short Arabic bodies; mostly `approved`, 3 `pending` (for the admin queue);
      recompute `stores.rating_avg/rating_count`.
- [ ] **`AlertSeeder`** — demo user: 3 favorites (one whose price dropped since add,
      one risen), 3 alerts (one already met → `triggered_at` set).
- [ ] **`TicketSeeder`** — 4 tickets (2 open, 1 answered, 1 closed) with messages.
- [ ] **`AdSeeder`** — 3 slots + 2 active campaigns with placeholder images.
- [ ] **`SyncLogSeeder`** — last 24h of hourly api/scrape logs, 2 recent failures
      (for the admin health board + fallback flow demo).

### 4. Wiring
- [ ] `DatabaseSeeder` calls all in dependency order. Target runtime < 30s.
- [ ] Product images: store 2–3 placeholder images per product under
      `storage/app/public/products/` (generated solid-color SVG placeholders with the
      model name — no external downloads); `php artisan storage:link`.

## Definition of Done
- [ ] `php artisan migrate:fresh --seed` < 60s, no errors, idempotent.
- [ ] Spot checks (tinker):
      `Product::count() ≈ 60`; every product has ≥3 prices; cheapest-store query works;
      `PriceHistory` ≈ 60×5×90 rows; demo user has active booking + met alert.
- [ ] `SELECT` for "biggest 7-day drops" returns ≥ 8 products.

## Verification
```bash
cd backend && php artisan migrate:fresh --seed
php artisan tinker --execute="dump(Product::count(), ProductPrice::count(), PriceHistory::count());"
```
