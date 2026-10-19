# Phase 02 — Database Schema (SRS §6 Blueprint)

**Goal:** every table the platform needs, as Laravel migrations with correct
FKs, enums, and indexes, plus Eloquent models, enum classes, and the price
observer. This phase owns the FULL data model — later phases (16, 17) reference
tables defined here instead of inventing their own.

**Depends on:** 01. Postgres running.

**Produces:** all migrations, `app/Models/*`, `app/Enums/*`, ProductPriceObserver.

## Relationships (ERD as text)

| Parent | Child | Cardinality |
|---|---|---|
| users | stores, favorites, price_alerts, bookings, support_tickets | 1‑to‑many |
| categories | categories (parent_id), products | 1‑to‑many (self-referencing tree) |
| brands | products | 1‑to‑many |
| products | product_prices | 1‑to‑many |
| stores | product_prices, reviews, sync_logs, api_keys, imports | 1‑to‑many |
| product_prices | price_history, bookings | 1‑to‑many |
| bookings | reviews | 1‑to‑1 (unique booking_id) |
| bookings | booking_events | 1‑to‑many |
| support_tickets | ticket_messages | 1‑to‑many |
| ad_slots | ad_campaigns | 1‑to‑many |

## Steps

### S1 — Core identity & taxonomy tables
- **Do:** Migrations for: (a) users additions — role enum (user, vendor, admin;
  default user), phone nullable, avatar_path nullable, status enum (active,
  suspended, pending; default active — vendors start pending), warning_flag
  boolean default false, restricted_until timestamptz nullable,
  restriction_reason string nullable, two_factor_secret text nullable,
  two_factor_confirmed_at timestamp nullable. (b) categories — parent_id self
  FK nullable, name, slug unique, icon nullable, sort_order int, is_active
  bool; index (parent_id, sort_order). (c) brands — name, name_ar, slug unique,
  logo_path nullable. (d) stores — user_id FK (vendor owner), name, slug
  unique, logo_path, website_url, address, city, lat/lng decimals nullable,
  phone, email, is_verified bool default false, rating_avg decimal(3,2)
  default 0, rating_count int default 0; indexes on slug and user_id. Include
  the ingest columns here (owned by this phase, used by 17): ingest_driver
  enum (none, api, scrape; default none), ingest_config jsonb nullable,
  ingest_frequency_minutes int default 60.
- **Touch:** `backend/database/migrations/*`.
- **Done when:** migrate fresh + rollback both run clean.

### S2 — Catalog & pricing tables
- **Do:** Migrations for: (a) products — category_id FK, brand_id FK, name,
  name_ar, slug unique, description text, specs jsonb (grouped: screen/
  processor/camera/battery/memory…), images jsonb (array of paths),
  release_year smallint nullable, is_active bool, views_count bigint default 0,
  compares_count bigint default 0; indexes on slug, category_id, brand_id, GIN
  on specs. (b) product_prices — product_id FK, store_id FK, price
  decimal(10,2), currency char(3) default SAR, stock int default 0,
  affiliate_url nullable, is_available bool default true, source enum (api,
  import, scrape, manual; default manual), last_synced_at timestamptz
  nullable; UNIQUE (product_id, store_id); indexes (product_id, price) for
  cheapest-first, store_id, last_synced_at. (c) price_history —
  product_price_id FK, price decimal(10,2), recorded_at timestamptz; index
  (product_price_id, recorded_at).
- **Touch:** `backend/database/migrations/*`.
- **Done when:** inserting a duplicate (product_id, store_id) price row fails
  with a unique-constraint error.

### S3 — User-engagement tables
- **Do:** Migrations for: (a) favorites — user_id FK, product_id FK,
  price_at_add decimal(10,2); unique (user_id, product_id). (b) price_alerts —
  user_id FK, product_id FK, threshold decimal(10,2), is_active bool default
  true, triggered_at timestamptz nullable; unique (user_id, product_id).
  (c) product_stats — product_id FK, store_id FK **nullable** (null = platform-
  wide views), date, views int, clicks int. Because Postgres unique constraints
  ignore NULLs, uniqueness must be a unique EXPRESSION index on (product_id,
  coalesce(store_id, 0), date) — document this in the migration.
- **Touch:** `backend/database/migrations/*`.
- **Done when:** two inserts with product_id=1, store_id=NULL, same date —
  second insert fails.

### S4 — Booking tables
- **Do:** Migrations for: (a) bookings — number string unique (format per
  00 §6: BK-{YY}-{seq}), qr_token uuid unique, user_id / store_id / product_id
  / product_price_id FKs, color and variant strings nullable, quantity
  smallint, price_locked decimal(10,2) nullable (null while draft),
  expected_arrival_at timestamptz, expires_at timestamptz nullable, status
  enum (**draft**, active, completed, cancelled, expired, no_show),
  reminder_sent_at / completed_at / cancelled_at timestamptz nullable.
  Indexes: (user_id, status), (store_id, status), (status, expires_at) for the
  expiry sweep, (status, created_at) for the draft sweep. The draft status is
  part of the enum — the state machine in phase 11 starts at draft.
  (b) booking_events — booking_id FK, user_id FK, type enum (cancelled,
  no_show, completed, expired), created_at; index (user_id, type, created_at)
  for rolling-window strike counts.
- **Touch:** `backend/database/migrations/*`.
- **Done when:** a booking row with status draft and null price_locked inserts
  successfully; the status enum accepts all six values.

### S5 — Reviews, tickets, ads, ops tables
- **Do:** Migrations for: (a) reviews — booking_id FK UNIQUE (one review per
  completed booking), user_id FK, store_id FK, rating smallint 1–5, body text
  nullable, status enum (pending, approved, rejected; default pending),
  **rejection_reason string nullable** (shown to the user on rejection),
  moderated_by FK users nullable, moderated_at. (b) support_tickets — user_id
  FK, subject, category enum (bug, billing, store, other), priority enum (low,
  normal, high), status enum (open, answered, closed), assigned_to FK users
  nullable. ticket_messages — ticket_id FK, user_id FK, body text, attachments
  jsonb nullable, created_at. (c) ad_slots — key unique (home_hero_side,
  search_top, product_sidebar), label, is_active. ad_campaigns — ad_slot_id
  FK, store_id FK nullable, title, image_path, target_url, starts_at, ends_at,
  is_active, impressions bigint, clicks bigint. (d) sync_logs — store_id FK
  nullable, driver enum (api, scrape, import), task string, status enum
  (success, failed, started), message text nullable, items_processed int,
  started_at, finished_at; index (status, started_at). (e) security_events —
  user_id FK nullable, ip, type enum (login_failed, rate_limited, suspicious,
  2fa_failed), meta jsonb, created_at; index (type, created_at). (f) api_keys —
  store_id FK, name, key_hash, last_used_at, revoked_at nullable. (g) imports
  (used by phase 16) — store_id FK, filename, mapping jsonb, total int, ok
  int, failed int, status enum (pending, running, done, failed), error_rows
  jsonb nullable, timestamps.
- **Touch:** `backend/database/migrations/*`.
- **Done when:** full migrate:fresh runs clean; a second review for the same
  booking_id fails the unique constraint.

### S6 — Enum classes & models
- **Do:** PHP backed enums in `app/Enums/` (Role, UserStatus, BookingStatus,
  BookingEventType, ReviewStatus, PriceSource, IngestDriver, TicketStatus,
  TicketCategory, TicketPriority, SyncStatus, ImportStatus,
  SecurityEventType). Eloquent models for every table with casts (jsonb →
  array, enum columns → the enum classes) and relationships mirroring the
  table above. Helpers: an active-products scope and a best-price helper (min
  available price) on Product; isExpired and remainingSeconds on Booking.
- **Touch:** `backend/app/Enums/*`, `backend/app/Models/*`.
- **Done when:** tinker can traverse product → prices → store and booking →
  events without errors; enum casts round-trip.

### S7 — Price observer (single write path for history)
- **Do:** A ProductPrice observer that on create and on every price change
  writes a price_history row and dispatches a PriceChanged event (consumed by
  alerts in phase 10 and ingestion in phase 17). Register it.
- **Touch:** `backend/app/Observers/ProductPriceObserver.php`,
  `backend/app/Events/PriceChanged.php`, provider registration.
- **Done when:** tinker smoke test — create a product with 2 store prices →
  price_history has 2 rows; update one price → a 3rd row appears.

## Phase acceptance
- migrate:fresh and migrate:rollback both clean; observer smoke test passes;
  unique constraints verified for product_prices, favorites, alerts, reviews,
  product_stats (coalesce index); bookings enum includes draft.
