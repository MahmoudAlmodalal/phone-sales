# Phase 16 — Bulk Import Wizard (SRS §3, brief §2.7)

**Goal:** vendors update hundreds of products at once via CSV/XLSX with column
mapping, preview, row-level error reporting, and partial import — "the screen
most platforms fail at". Uses the `imports` table defined in phase 02 S5.

**Depends on:** 15.

**Produces:** import endpoints + job, the 4-step wizard at /vendor/import.

## Wizard flow

١. ارفع الملف → ٢. طابق الأعمدة → ٣. المعاينة → ٤. التقرير

## API contracts (auth: vendor)

| Endpoint | Behavior |
|---|---|
| GET /api/vendor/import/template | downloads the template file: columns product_name, brand, price, stock, affiliate_url + 3 example rows |
| POST /api/vendor/import/upload (multipart, ≤10MB, csv/xlsx) | parses header + first 50 rows; returns upload_id, columns, sample_rows, auto_mapping (header-synonym guessing, e.g. «سعر البيع» → price) |
| POST /api/vendor/import/{upload}/map | body: mapping (file column → field); required: a product identifier + price; returns a 5-row preview EXACTLY as it would be saved (matched product, parsed price, stock) |
| POST /api/vendor/import/{upload}/run | dispatches the processing job; returns import id |
| GET /api/vendor/import/{import}/status | polled: progress_pct, processed, ok, failed, done |
| GET /api/vendor/import/{import}/report | summary + row errors, e.g. row 23 «السعر غير رقمي (1,2o0)» |
| GET /api/vendor/import/{import}/failed-rows | downloads a CSV of ONLY the failed rows (original columns) for fix-and-reupload |

## Processing rules (chunked job, 200 rows per chunk)

- Product matching: exact products.name/name_ar (normalized), else a
  brand+model heuristic; unmatched → row error «المنتج غير موجود في الكتالوج».
- Per-row validation: price numeric > 0 (strip thousands separators; catch
  digit-typo values like 1,2o0 with a clear Arabic error), stock integer ≥ 0,
  URL valid when present.
- Valid rows upsert product_prices (source import, last_synced_at now) — the
  phase-02 observer writes history and fires alerts automatically.
- **Partial import**: failures never abort the batch (SRS/brief).
- On finish: a sync_logs row (driver import) + a vendor database notification.

## Steps

### S1 — Template + upload + auto-mapping
- **Do:** Add a spreadsheet package (e.g. maatwebsite/excel). Implement the
  template download and the upload endpoint with header parsing and
  synonym-based auto-mapping. Enforce size/type limits.
- **Touch:** backend controllers, routes, a fixtures folder with test files.
- **Done when:** tests — template downloads; a fixture xlsx uploads and
  auto-maps; an 11MB file and an .exe are rejected.

### S2 — Mapping + preview
- **Do:** Implement the map endpoint: validate required fields, persist the
  mapping on the imports row, return the 5-row as-saved preview.
- **Touch:** backend controller, tests.
- **Done when:** the preview shows the matched product and parsed values for
  a fixture file; missing required mapping is rejected.

### S3 — Processing job + report
- **Do:** The chunked job implementing the processing rules; status, report,
  and failed-rows endpoints; the finish-time sync_log + notification.
- **Touch:** `backend/app/Jobs/ProcessBulkImport.php`, controllers, tests.
- **Done when:** a mixed fixture (140 ok / 6 bad — a 1,2o0 price, an unknown
  product, a negative stock, …) yields exact counts, correct row numbers,
  and a failed-rows CSV containing exactly the 6; prices are actually
  updated with history rows written.

### S4 — Wizard UI steps 1–2
- **Do:** Step 1: drag-drop zone (CSV/XLSX badge), «نزّل القالب» link, inline
  file-validation errors. Step 2: two-column mapper («عمودك: سعر البيع» →
  select «حقلنا: price»), auto-mapped pairs pre-filled with a subtle check,
  unmapped required fields block Next.
- **Touch:** `frontend/src/app/vendor/import/*`.
- **Done when:** a fixture file walks through steps 1–2 in the browser with
  auto-mapping visible.

### S5 — Wizard UI steps 3–4
- **Do:** Step 3: «أول ٥ صفوف كما ستُحفظ» preview table + total row count.
  Step 4: live progress bar (poll 1s) → report «✓ ١٤٠ صفًا جاهزًا · ✗ ٦ صفوف
  بها أخطاء», error list with row numbers, the «نزّل الصفوف الفاشلة فقط»
  button, and «استيراد ملف جديد» restart.
- **Touch:** `frontend/src/app/vendor/import/*`.
- **Done when:** the full wizard run works in the browser with the mixed
  fixture; downloading the failed CSV, fixing it, and re-uploading yields
  6/6 ok.

## Phase acceptance
- S3 test matrix green; the full fix-and-reupload loop verified in the
  browser; a sync_logs import row and vendor notification appear after each
  run.
