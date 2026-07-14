# Phase 16 — Bulk Import Wizard (SRS §3, brief §2.7)

**Goal:** vendors update hundreds of products at once via CSV/XLSX with column
mapping, preview, row-level error reporting, and partial import — "the screen most
platforms fail at".

**Prerequisites:** Phase 15. Package: `maatwebsite/excel` (+ `league/csv`).

## Flow (4 steps, wizard at `/vendor/import`)

```
١. ارفع الملف   →  ٢. طابق الأعمدة  →  ٣. المعاينة  →  ٤. التقرير
```

## API

| Endpoint | Behavior |
|---|---|
| GET `/api/vendor/import/template` | downloads `as3ar-template.xlsx`: columns `product_name, brand, price, stock, affiliate_url` + 3 example rows |
| POST `/api/vendor/import/upload` (multipart, ≤10MB, csv/xlsx) | parses header + first 50 rows; returns `{upload_id, columns: [...], sample_rows, auto_mapping}` — auto-mapping guesses by header synonyms («سعر البيع» → `price`) |
| POST `/api/vendor/import/{upload}/map` | body `{mapping: {file_col → field}}`; required fields: product identifier + price; returns 5-row **preview exactly as it would be saved** (matched product, parsed price, stock) |
| POST `/api/vendor/import/{upload}/run` | dispatches `ProcessBulkImport` job; returns import id |
| GET `/api/vendor/import/{import}/status` | polled: `{progress_pct, processed, ok, failed, done}` |
| GET `/api/vendor/import/{import}/report` | summary + row errors `[{row: 23, error: 'السعر غير رقمي (1,2o0)'}]` |
| GET `/api/vendor/import/{import}/failed-rows` | downloads CSV of **only the failed rows** (original columns) for fix-and-reupload |

## Backend rules (`ProcessBulkImport` job, chunked 200 rows)
- [ ] Product matching: exact `products.name/name_ar` (normalized), else brand+model
      heuristic; unmatched → row error «المنتج غير موجود في الكتالوج».
- [ ] Validation per row: price numeric > 0 (strip thousands separators, catch `1,2o0`
      style → clear Arabic error), stock int ≥ 0, URL valid if present.
- [ ] Valid rows upsert `product_prices` (source=`import`, `last_synced_at=now`) —
      observer writes history/alerts automatically. **Partial import allowed** —
      failures never abort the batch (SRS/brief).
- [ ] `imports` table: `id, store_id, filename, mapping jsonb, total, ok, failed,
      status, error_rows jsonb (or side table), timestamps`.
- [ ] On finish: `sync_logs` row (driver=import) + vendor database notification.

## UI (wizard, numbered steps with progress)
- [ ] **Step 1**: drag-drop zone (CSV/XLSX badge), «نزّل القالب» link, file
      validation errors inline.
- [ ] **Step 2**: two-column mapper — «عمودك: سعر البيع» → select «حقلنا: price»;
      auto-mapped pairs pre-filled with a subtle check; unmapped required fields block Next.
- [ ] **Step 3**: preview table «أول ٥ صفوف كما ستُحفظ» + total row count.
- [ ] **Step 4**: live progress bar (poll 1s) → report:
      «✓ ١٤٠ صفًا جاهزًا · ✗ ٦ صفوف بها أخطاء», error list with row numbers,
      **«نزّل الصفوف الفاشلة فقط»** button, «استيراد ملف جديد» restart.

## Tests
- [ ] Template downloads; upload+auto-map of a fixture xlsx.
- [ ] Mixed file (140 ok / 6 bad incl. `1,2o0` price, unknown product, negative stock)
      → exact counts, correct row numbers, failed-rows CSV contains exactly the 6.
- [ ] Prices actually updated + history rows written; partial import confirmed.
- [ ] 11MB file & .exe rejected.

## Definition of Done
- [ ] Full wizard run in browser with the mixed fixture file; fix failed CSV,
      re-upload, 6/6 ok.
