# Phase 09 — Comparison System (Wiring + Compare Page)

**Goal:** side-by-side comparison of up to 4 products with the floating
compare bar, per brief §2.4 and SRS §2. The CompareBar component, compare
store, and a compare page exist — this phase finishes their behavior and puts
the page on live data.

**Depends on:** 06 (store + bar), 08.

**Produces:** finished CompareBar behavior, live `/compare`, a batch compare
endpoint.

## Steps

### S1 — Batch compare endpoint
- **Do:** Backend: GET /api/products/compare?ids=… returning, in one query,
  the detail shape plus flattened spec rows for up to 4 ids (aligned row keys
  across products so the table can zip them).
- **Touch:** backend controller + resource, routes, a feature test.
- **Done when:** the endpoint returns aligned spec rows for 3 seeded ids in
  one response.

### S2 — CompareBar behavior
- **Do:** Verify/complete the existing bar: slides up when count ≥ 1 (72px,
  ink background, white text); up to 4 thumbs (40px, removable ✕ on hover);
  green «قارن (n)» button to /compare; «مسح» text button clearing the store.
  It must stack above the product page's mobile sticky CTA and respect the
  safe-area inset. Confirm the store behaviors from phase 06 (cap 4, toast on
  5th, sessionStorage persistence, compared ping).
- **Touch:** `frontend/src/components/CompareBar.tsx`, `frontend/src/stores/compare.ts`.
- **Done when:** adding from search and product pages shows thumbs; the bar
  persists across navigation; «مسح» empties and hides it.

### S3 — Compare table
- **Do:** Rebuild `/compare` on the batch endpoint: attribute-name column
  fixed (visually rightmost in RTL) with horizontal snap-scroll for product
  columns; header row per product (image, name, remove ✕); the price row
  pinned on top and sticky on vertical scroll (best price Mono + store +
  «فرق {n} ر.س بين المتاجر»); spec rows grouped like the product page; in
  every row the best-value cell gets green-tint + weight 600 via a
  per-attribute comparator map (price lower-is-better; battery/RAM/storage
  higher; screen highlight max neutrally; non-comparable rows unhighlighted).
  Column footers: outlined «احجز» + solid «إلى المتجر» via /go/.
- **Touch:** `frontend/src/app/compare/page.tsx` + table components.
- **Done when:** best-value highlighting is correct for price (lowest) and
  battery (highest) on seeded data; vertical scroll keeps the price row
  visible; horizontal scroll keeps the attribute column fixed.

### S4 — Hide-similar toggle + edge states
- **Do:** «إخفاء المتشابه» toggle hiding rows where all values are identical
  (the feature that separates a useful comparison from a boring table),
  persisted in the compare store. Empty state (0 items): «اختر منتجين أو أكثر
  للمقارنة» + link to /search. Single item: render the table + hint «أضف
  منتجًا آخر للمقارنة».
- **Touch:** compare page, compare store.
- **Done when:** toggling hides identical rows and restores them; both edge
  states render.

### S5 — Mobile layout
- **Do:** 2 visible product columns with horizontal snap-scroll; the fixed
  attribute column narrows to 96px; the price row stays sticky.
- **Touch:** compare page styles.
- **Done when:** verified at 375px width in the browser.

## Phase acceptance
- Full flow in the browser: add 4 products from mixed pages → bar → compare
  table with correct highlights → hide-similar → remove down to 1 → hint
  state; the 5th add shows the grey toast.
