# Phase 09 — Comparison System

**Goal:** side-by-side comparison of up to 4 products with the floating compare bar,
per brief §2.4 and SRS §2.

**Prerequisites:** Phases 06 (compare store, CompareBar shell), 08.

## 1. Compare state behavior (already scaffolded in phase 06 — finish it)
- [ ] `toggleCompare(product)` stores `{id, slug, name_ar, image, best_price}` —
      enough to render the bar without refetch; max 4; 5th attempt → grey toast
      «المقارنة تتّسع لأربعة. أزل واحدًا أولًا.»
- [ ] Adding also fires `POST /products/{slug}/compared` (most-compared stat).
- [ ] Persisted in `sessionStorage` («يبقى ظاهرًا عبر كل الصفحات (Session)» — brief).

## 2. Floating CompareBar (all public pages)
- [ ] Slides up from bottom when count ≥ 1: 72px, `ink` bg, white text.
- [ ] Content: up to 4 thumbs (40px, removable ✕ on hover), green button
      «قارن (٣)» → `/compare`, text button «مسح» → `clear()`.
- [ ] Doesn't cover the mobile sticky CTA on product pages (stacks above it);
      respects safe-area inset.

## 3. Compare page `(public)/compare/page.tsx`
Client page reading the store, fetching full details: `GET /api/products/compare?ids=1,2,3`
(add this endpoint: returns detail shape incl. flattened spec rows for the ids, one query).

Table structure:
- [ ] **First column fixed** (attribute names) — RTL: visually the rightmost column;
      horizontal scroll for product columns (`overflow-x`, snap).
- [ ] Header row per product: image, name, remove ✕.
- [ ] **Price row pinned on top and sticky on vertical scroll** — best price Mono +
      store name + «فرق ٢٣٠ ر.س بين المتاجر».
- [ ] Spec rows grouped (same groups as product page). In every row the **best value
      cell** gets `green-tint` bg + weight 600 — comparator map per attribute
      (price: lower better; battery/RAM/storage: higher; screen: neutral-highlight max;
      non-comparable: no highlight).
- [ ] **«إخفاء المتشابه» toggle** — hides rows where all values are identical
      ("هاي الميزة هي كل الفرق بين مقارنة مفيدة وجدول ممل"). Persist choice in the store.
- [ ] Bottom of each column: outlined «احجز» → booking flow, solid «إلى المتجر» via `/go/`.
- [ ] Empty state (0 items): «اختر منتجين أو أكثر للمقارنة» + link to /search.
      With 1 item: table renders + hint «أضف منتجًا آخر للمقارنة».

## 4. Mobile
- [ ] 2 visible columns with horizontal snap-scroll; fixed attribute column narrows
      to 96px; price row remains sticky.

## Tests / Definition of Done
- [ ] Add 4 products from search + product pages → bar shows 4 thumbs; 5th → toast.
- [ ] Bar persists across navigation; «مسح» empties and hides it.
- [ ] Best-value highlighting correct for price (lowest) and battery (highest) on seeded data.
- [ ] Hide-similar removes identical rows and returns them when toggled back.
- [ ] Vertical scroll keeps price row visible; horizontal scroll keeps attribute column fixed.
