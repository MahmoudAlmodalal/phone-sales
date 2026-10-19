# Phase 03 — Seed Data (Realistic Demo Content)

**Goal:** the database looks like a live Saudi phone market — real model names,
plausible SAR prices, ~90 days of price movement — so every UI screen has real
content (brief rule: realistic content, no Lorem ipsum).

**Depends on:** 02.

**Produces:** factories, seeders, `database/data/phones.php`, placeholder images.

## Context for the agent

- All counts below are targets, not exact contracts (products have 3–7 prices
  each, so totals are approximate).
- Seeded content must also cover the states the EXISTING admin pages render
  (`frontend/src/app/admin/`: users, merchants, reviews, complaints, fraud,
  backup) — e.g. pending vendors, flagged users, pending reviews, open tickets.

## Steps

### S1 — Factories
- **Do:** Factories for User (with role states user/vendor/admin), Store,
  Product (specs JSON generator per category), ProductPrice, Booking, Review,
  SupportTicket, AdCampaign.
- **Touch:** `backend/database/factories/*`.
- **Done when:** tinker can create one of each factory without errors.

### S2 — Accounts, categories, brands (deterministic)
- **Do:** AccountSeeder — demo accounts with password `password`:
  admin@as3ar.test (admin), vendor@as3ar.test (vendor, owns «متجر التقنية»),
  vendor2@as3ar.test (vendor), user@as3ar.test (user); plus one PENDING vendor
  for the approval queue. CategorySeeder — multi-level tree: جوالات → (آيفون،
  سامسونج، شاومي، هواوي، أخرى); إكسسوارات → (شواحن، سماعات، كفرات); أجهزة
  لوحية. BrandSeeder — Apple, Samsung, Xiaomi, Huawei, Google, OnePlus, Honor,
  Oppo, Realme, Nothing with Arabic names.
- **Touch:** `backend/database/seeders/*`.
- **Done when:** the four demo accounts authenticate-hashable rows exist; the
  category tree has depth 2 with correct parents.

### S3 — Products & stores
- **Do:** ProductSeeder driven by a PHP data file `database/data/phones.php`
  listing ~60 real models (name, name_ar, brand, release_year, base price,
  grouped specs: screen size/type, chip, RAM, storage variants, camera MP,
  battery mAh, 5G, weight). Include current flagships and mid-rangers (iPhone
  15/15 Pro/16 Pro Max, Galaxy S24/S24 Ultra/A55/Z Flip6, Xiaomi 14, Redmi
  Note 13 Pro, Pixel 9, Huawei P60, OnePlus 12, Honor Magic6, …). StoreSeeder —
  8 stores with Arabic trade names (متجر التقنية، عالم الجوال، اكسترا فون،
  جوال بلس، …), cities (الرياض، جدة، الدمام), addresses, coordinates; two owned
  by the demo vendors; is_verified mixed. Generate 2–3 solid-color SVG
  placeholder images per product (model name as text) into
  storage/app/public/products/ and link storage — no external downloads.
- **Touch:** `backend/database/data/phones.php`, seeders, storage.
- **Done when:** product count ≈ 60, each with specs groups and images; 8
  stores exist, one vendor pending verification.

### S4 — Prices & history
- **Do:** PriceSeeder — for each product pick 3–7 stores; price = base ± up to
  8%, rounded to a 9-ending (1,149 / 1,199); stock 0–15 with a few zeros for
  the out-of-stock state; affiliate URLs on a fake store domain; source mixed;
  last_synced_at mostly recent with ~15% older than 48h (stale grey state).
  PriceHistorySeeder — bypass the observer; ~90 days per product_price as a
  random walk (±0–2%/day) plus 2–3 event jumps (−5–12% sale, +4% hike); the
  current price must equal the last history point; make ~10 products show a
  big 7-day drop (feeds «أكبر انخفاض اليوم»).
- **Touch:** `backend/database/seeders/*`.
- **Done when:** every product has ≥3 prices; a biggest-7-day-drop query
  returns ≥8 products; for sampled rows the latest history point equals the
  current price.

### S5 — Engagement, bookings, reviews
- **Do:** EngagementSeeder — product_stats daily rows for 30 days (views
  20–900, clicks ≈4% of views); set products.views_count/compares_count
  aggregates. BookingSeeder — for the demo user: 1 active booking (expires in
  ~20h, arrival in ~3h), 2 completed, 1 cancelled, 1 no_show; plus ~30 random
  bookings across stores spread over the last 30 days for vendor KPIs; write
  matching booking_events rows. ReviewSeeder — reviews only for completed
  bookings; ratings weighted 4–5; short Arabic bodies; mostly approved, 3
  pending for the admin queue; recompute stores.rating_avg/rating_count.
- **Touch:** `backend/database/seeders/*`.
- **Done when:** demo user has the five booking states; store aggregates match
  a manual recomputation for one store; 3 reviews pending.

### S6 — Alerts, tickets, ads, sync logs
- **Do:** AlertSeeder — demo user: 3 favorites (one dropped since add, one
  risen), 3 alerts (one already met with triggered_at set). TicketSeeder — 4
  tickets (2 open, 1 answered, 1 closed) with message threads. AdSeeder — the
  3 fixed slots + 2 active campaigns with placeholder images. SyncLogSeeder —
  last 24h of hourly api/scrape logs with 2 recent failures (admin health
  board + fallback demo).
- **Touch:** `backend/database/seeders/*`.
- **Done when:** demo user shows a met alert; ticket states cover the three
  statuses; 2 failed sync_logs exist within the last 24h.

### S7 — Wiring & performance
- **Do:** DatabaseSeeder calling everything in dependency order. Target full
  migrate:fresh --seed under 60 seconds and idempotent on re-run.
- **Touch:** `backend/database/seeders/DatabaseSeeder.php`.
- **Done when:** migrate:fresh --seed completes < 60s with no errors, twice in
  a row.

## Phase acceptance
- Tinker spot checks: product count ≈ 60; every product ≥3 prices; cheapest-
  store query works; demo user has an active booking and a met alert; the
  biggest-drop query returns ≥8 rows; pending vendor + pending reviews + open
  tickets exist for the admin screens.
