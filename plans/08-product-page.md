# Phase 08 — Product Details Page (New Build) + Store Profile

**Goal:** the conversion core (brief §2.3, SRS §2): all store prices
cheapest-first, price history with the insight sentence, alert box, sticky
action card, verified store ratings — SSR for SEO. This page does NOT exist
yet (only an empty `app/product/[slug]/` folder from phase 06) — it is a full
build, reusing the existing shared components.

**Depends on:** 05, 06.

**Produces:** `/product/[slug]`, `/store/[slug]`, PriceChart component,
ProductJsonLd component.

## Context for the agent

- Reuse: `RatingBar.tsx`, `Badge.tsx`, `Star.tsx`, `Skeleton.tsx`,
  `ProductPageActions.tsx` (exists — check what it already covers),
  compare/favorites stores.
- Layout: two columns ≥lg — content 60% (right in RTL) + sticky card 40%
  (left); stacked on mobile with a bottom sticky bar (best price + CTA).

## Steps

### S1 — Page frame, header, gallery
- **Do:** Server component fetching the detail endpoint by slug. Product
  header (name Tajawal 32, brand + category breadcrumb links) and image
  gallery (main + thumbs, next/image). 404 to not-found for unknown slugs.
- **Touch:** `frontend/src/app/product/[slug]/page.tsx` + local components.
- **Done when:** a seeded slug renders header + gallery SSR; an unknown slug
  shows the 404 page.

### S2 — Sticky best-price card
- **Do:** «أفضل سعر الآن» label; price Mono 36px green; store + updated-ago
  line. Primary solid green CTA «اذهب إلى المتجر» opening /go/{go_id} in a new
  tab, with the 12px muted disclosure line underneath («قد نحصل على عمولة من
  هذا الرابط. السعر لا يتغيّر عليك.»). Secondary outlined green «احجز مسبقًا»
  linking to the booking start route — hidden when no store has stock. Action
  row: favorite toggle + add-to-compare (fires the compared ping). Mobile:
  the card becomes the bottom sticky bar.
- **Touch:** product page + `ProductPageActions.tsx`.
- **Done when:** CTA opens the affiliate redirect and the click counter
  increments; the booking button hides when all seeded stocks are zero.

### S3 — Store price table
- **Do:** The SRS "smart dynamic table" — columns المتجر | السعر (Mono) |
  التوفر | آخر تحديث | إجراء. Cheapest→highest (API order). First row
  green-tint + «أقل سعر» badge. Store cell links to /store/[slug] with the
  verified mark and a mini RatingBar. التوفر states: متوفر / آخر قطعة
  (star-tint, stock=1) / نفدت الكمية (greyed row kept in position). آخر تحديث
  as relative time, faded when older than the stale threshold (48h, from
  config via the API). Actions: «إلى المتجر» text button via /go/; «احجز»
  outlined when stock>0.
- **Touch:** product page table component.
- **Done when:** seeded product shows correct order, tinted best row, greyed
  unavailable rows in place, and faded stale timestamps.

### S4 — Price-history chart + insight sentence
- **Do:** A hand-rolled responsive SVG chart component (no chart library):
  green 2px line + soft gradient fill, dashed grey average line, small red
  marker at the max point, hover/touch tooltip (date + price + store), range
  tabs ٣٠ يوم / ٩٠ يوم / سنة (client refetch per range). Below it the
  sentence that matters more than the chart: «أدنى سعر مسجّل: {price} ر.س في
  {date}.» from min_point.
- **Touch:** `frontend/src/components/PriceChart.tsx`, product page.
- **Done when:** the chart matches seeded history for a sampled product;
  range tabs refetch; the min sentence equals the seeded historical low.

### S5 — Alert box + specs table
- **Do:** Inline alert box: «نبّهني إذا نزل تحت [____] ر.س» + «فعّل التنبيه»,
  input pre-filled with the historical low; guest → login redirect preserving
  intent; authed → calls the phase-10 endpoint (stub behind the client
  interface until 10 lands), success state shows the active alert + toggle.
  Specs table: two-column striped rows grouped under headers from the specs
  JSON groups; collapsible «عرض كل المواصفات» beyond 12 rows.
- **Touch:** product page components.
- **Done when:** guest click routes to /login?next=…; specs groups render
  from seed data with the collapse behavior.

### S6 — Verified reviews section (display only)
- **Do:** Header: rating number 40px Mono + bar + «{n} تقييمًا موثّقًا» for
  the cheapest store by default, with a store-switcher pill row (reviews are
  per-store). Review rows: first name + small solid red star «موثّق» badge +
  «تمّ الاستلام في {date}» + body. Explainer line: «التقييم متاح فقط لمن
  أكمل حجزًا عبر المنصة.» No write button for visitors (write flow is phase
  13).
- **Touch:** product page review components (reuse RatingBar, Star).
- **Done when:** seeded approved reviews render for the selected store; the
  switcher changes the list; no write UI appears.

### S7 — SEO wiring
- **Do:** generateMetadata — title «سعر {name_ar} — يبدأ من {best_price} ر.س |
  أسعار», description from name + category + min price (SRS algorithm),
  OpenGraph image. A ProductJsonLd component emitting schema.org Product with
  offers (lowPrice/highPrice/offerCount/availability) and aggregateRating from
  store ratings, JSON-safe-encoded. (Finalized/validated in phase 20.)
- **Touch:** product page, `frontend/src/components/ProductJsonLd.tsx`.
- **Done when:** page source shows the meta title per the algorithm and a
  structurally valid JSON-LD block.

### S8 — Store profile page
- **Do:** `/store/[slug]` SSR: store header (logo, city, address, map link,
  verified badge, large RatingBar), the store's product grid via the products
  endpoint filtered by store, and its approved reviews list. Metadata per
  store.
- **Touch:** `frontend/src/app/store/[slug]/page.tsx`.
- **Done when:** a seeded store renders header, grid, and reviews from live
  data.

## Phase acceptance
- Full page verified in the browser against a seeded product: order/tints/
  fading correct, chart + sentence correct, /go/ increments clicks, JSON-LD
  structurally valid, mobile sticky bar appears, store page live.
