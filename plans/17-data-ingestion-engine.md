# Phase 17 — Data Ingestion Engine (SRS §3)

**Goal:** the three scheduled price pipelines — vendor APIs, imports (done in 16),
targeted scraping — plus the fallback: scrape failure → instant admin alert + manual
entry backup. All visible in `sync_logs`.

**Prerequisites:** Phases 05, 16.

## Architecture

```
app/Services/Ingest/
├─ PriceSyncService.php        # orchestrator: syncStore(store), syncAll()
├─ Drivers/
│  ├─ ApiDriver.php            # pulls store's price feed (JSON contract below)
│  └─ ScrapeDriver.php         # HTTP + selector-based extraction
└─ Support/PriceNormalizer.php # "١٬١٥٠ ر.س", "1,150 SAR" → 1150.00
```
`stores` gains columns (migration): `ingest_driver enum: none, api, scrape (default none)`,
`ingest_config jsonb` (api: feed_url + auth header; scrape: per-product URL template +
CSS selectors for price/availability), `ingest_frequency_minutes int default 60`.

### ApiDriver (stores with official feeds)
- [ ] Expected vendor feed: `GET feed_url` → `[{sku|product_name, price, stock, url}]`,
      auth via the store's key. Match rows to catalog (same matcher as phase 16);
      upsert `product_prices` (source=`api`).
- [ ] Per-store adapter config only — no code per store.

### ScrapeDriver (stores without APIs — SRS: respectful, ToS-compliant)
- [ ] For each configured product URL: fetch (timeout 10s, custom UA, **robots.txt
      checked and cached**; global rate limit e.g. 1 req/2s/host), extract price via
      CSS selector (`symfony/dom-crawler`), normalize, upsert (source=`scrape`).
- [ ] Politeness config: max pages/run, off-hours schedule option, per-store disable flag.
- [ ] **Failure detection**: selector misses / non-numeric price / HTTP errors → that
      product is marked failed in the run summary (structure changed = the SRS fallback trigger).

### Fallback mechanism (SRS §3 — verbatim requirement)
- [ ] Any failed scrape run (or >N item failures) →
      `ScrapeFailed` notification to all admins (mail + database) **immediately**:
      store, failed items, error samples, link to the manual screen.
- [ ] **Existing data is never deleted/zeroed on failure** — last good price stays
      (with its aging `last_synced_at`, which the UI already fades).
- [ ] Admin manual price entry: `PUT /api/admin/prices/{price}` (price, stock,
      source=`manual`) + bulk mini-form per store — the "Admin as Backup" path.
      (UI lands in phase 18; endpoint + policy here.)

## Scheduler (`routes/console.php`) — consolidated (some added in earlier phases)
| Task | Frequency |
|---|---|
| `ingest:sync-all` (due stores by frequency) | every 15 min |
| `alerts` queue processing | queue worker |
| `bookings:expire` / `bookings:remind` | 1 min / 15 min |
| `sitemap:generate` (phase 20) | daily + on product/store create |
| `backup:run` (phase 20) | daily 03:00 |
| `sync-logs:prune` (>90d) | weekly |

Every run wraps in a `sync_logs` row: started/finished, items_processed, status,
message (truncated error detail) — feeds the admin health board.

## Testing strategy (no real external sites)
- [ ] Fixture HTTP server (Laravel `Http::fake`) with fake store pages/feeds.
- [ ] Api driver: feed → prices upserted, history written, cache busted (`/home`).
- [ ] Scrape driver: selector hit; selector miss → failed item + admin notification
      + old price untouched.
- [ ] robots.txt disallow → store skipped + logged.
- [ ] `PriceNormalizer` unit tests (Arabic digits, separators, currency suffixes).

## Definition of Done
- [ ] `php artisan ingest:sync-all` against fixtures: sync_logs rows appear,
      one seeded "broken" store produces the admin alert + shows failed on the
      health board (once phase 18 lands).
- [ ] Prices changed by ingest propagate: history chart new point, triggered alert
      email in Mailpit, home ticker updated after cache bust.
