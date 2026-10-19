# Phase 17 — Data Ingestion Engine (SRS §3)

**Goal:** the three scheduled price pipelines — vendor API feeds, imports
(done in 16), targeted scraping — plus the SRS fallback: scrape failure →
instant admin alert + manual-entry backup. Everything visible in sync_logs.
The store ingest columns (ingest_driver, ingest_config,
ingest_frequency_minutes) already exist from phase 02 S1.

**Depends on:** 05, 16.

**Produces:** Ingest services + drivers, PriceNormalizer, scheduler entries,
admin manual-price endpoints (UI in 18).

## Architecture (namespaces under app/Services/Ingest)

- PriceSyncService — orchestrator: syncStore(store), syncAll (due stores by
  frequency).
- Drivers/ApiDriver — pulls a store's price feed.
- Drivers/ScrapeDriver — HTTP + CSS-selector extraction.
- Support/PriceNormalizer — turns «١٬١٥٠ ر.س», "1,150 SAR", etc. into 1150.00.

Every run wraps in a sync_logs row (started/finished, items_processed,
status, truncated error message) — feeds the phase-18 health board.

## Steps

### S1 — PriceNormalizer
- **Do:** A pure normalizer handling Arabic-Indic digits, Arabic/Latin
  thousands separators, currency words/suffixes, and whitespace; returns a
  decimal or a typed failure.
- **Touch:** `backend/app/Services/Ingest/Support/PriceNormalizer.php`, unit
  tests.
- **Done when:** unit tests cover Arabic digits, separators, currency
  suffixes, and garbage input.

### S2 — ApiDriver
- **Do:** Expected vendor feed: a GET on the store's configured feed URL
  returning rows of (sku or product_name, price, stock, url), authenticated
  by the store's key from ingest_config. Match rows to the catalog with the
  same matcher as phase 16; upsert product_prices with source api. Per-store
  configuration only — no code per store.
- **Touch:** `backend/app/Services/Ingest/Drivers/ApiDriver.php`, tests with
  faked HTTP.
- **Done when:** a faked feed upserts prices, writes history via the
  observer, and busts the home cache (the phase-05 named action).

### S3 — ScrapeDriver (respectful, ToS-compliant)
- **Do:** For each configured product URL in ingest_config: fetch with a 10s
  timeout and custom UA; check and cache robots.txt (disallow → skip store,
  log it); global politeness rate limit (about 1 request per 2s per host,
  max pages per run, off-hours schedule option, per-store disable flag);
  extract the price via the configured CSS selector (DOM crawler), normalize,
  upsert with source scrape. Failure detection: selector miss / non-numeric
  price / HTTP error marks that product failed in the run summary (structure
  changed = the SRS fallback trigger).
- **Touch:** `backend/app/Services/Ingest/Drivers/ScrapeDriver.php`, tests
  with fixture HTML via faked HTTP.
- **Done when:** tests — selector hit updates the price; selector miss marks
  the item failed and leaves the old price untouched; robots.txt disallow
  skips and logs.

### S4 — Fallback mechanism (SRS §3 verbatim requirement)
- **Do:** Any failed scrape run (or more than N item failures) sends a
  ScrapeFailed notification to ALL admins (mail + database) immediately:
  store, failed items, error samples, link to the manual screen. Existing
  data is NEVER deleted or zeroed on failure — the last good price stays,
  with its aging last_synced_at (which the UI already fades). Admin manual
  entry endpoints: PUT /api/admin/prices/{price} (price, stock, source
  becomes manual) + a per-store bulk variant — the "Admin as Backup" path
  (UI lands in phase 18).
- **Touch:** notification, admin controllers, policies, tests.
- **Done when:** a forced failed run produces the admin notification and the
  old price survives; the manual endpoint updates with source manual.

### S5 — Orchestrator + scheduler
- **Do:** PriceSyncService with syncStore/syncAll and the sync_logs wrapper.
  Consolidate the scheduler (some entries exist from earlier phases):
  ingest sync-all every 15 min (due stores by frequency); booking expire /
  remind (phase 11 — verify present); sync-log pruning of rows older than
  90 days weekly. (Sitemap and backup schedules are phase 20.)
- **Touch:** `backend/app/Services/Ingest/PriceSyncService.php`,
  `backend/routes/console.php`, tests.
- **Done when:** running the sync-all command against fixtures writes
  sync_logs rows; a seeded "broken" store produces the admin alert.

### S6 — End-to-end propagation check
- **Do:** Verify a price changed by ingest propagates everywhere: a new
  price-history chart point, a triggered alert email in Mailpit, and the
  home ticker updated after the cache bust.
- **Touch:** one feature test + a manual pass.
- **Done when:** all three effects observed from a single faked feed change.

## Phase acceptance
- All driver/normalizer/fallback tests green; sync-all works against
  fixtures with correct sync_logs; failure path alerts admins without
  touching existing prices; propagation check passes.
