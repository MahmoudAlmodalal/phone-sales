# Phase 08 — Product Details Page

**Goal:** the conversion core (brief §2.3, SRS §2): all store prices cheapest-first,
price history with insight sentence, alert box, sticky action card, verified store
ratings — SSR for SEO.

**Prerequisites:** Phases 05, 06.

## Layout `(public)/product/[slug]/page.tsx`
Two columns ≥lg: content 60% (right in RTL) + sticky card 40% (left). Stacked on mobile
(card becomes a bottom sticky bar with best price + CTA).

## 1. Sticky best-price card
- [ ] «أفضل سعر الآن» label; price Mono 36px green; «متجر التقنية · محدّث قبل ٣ د».
- [ ] Primary solid green CTA **«اذهب إلى المتجر»** → `/go/{price_id}` (new tab).
      Below it the disclosure line (12px muted): «قد نحصل على عمولة من هذا الرابط.
      السعر لا يتغيّر عليك.»
- [ ] Secondary outlined green **«احجز مسبقًا»** → `/booking/new?product=…&store=…`
      (phase 11) — hidden if no store has stock.
- [ ] Row: ♡ مفضلة (favorites store / API) · ⇄ قارن (compare store, pings `/compared`).

## 2. Product header + gallery
- [ ] Name (Tajawal 32), brand + category breadcrumb links, image gallery
      (main + thumbs, `next/image`).

## 3. Store price table (the SRS "smart dynamic table")
Columns: المتجر | السعر (Mono) | التوفر | آخر تحديث | إجراء.
- [ ] Ordered cheapest→highest (API already sorted). First row `green-tint` bg +
      «أقل سعر» badge.
- [ ] Store cell: name → `/store/[slug]`, verified ✓ if `is_verified`,
      `RatingBar` mini (4.6 + bar + count) — from store reviews (phase 13).
- [ ] التوفر: `متوفر` / `آخر قطعة` (star-tint, stock=1) / `نفدت الكمية` (greyed row,
      kept in position — brief).
- [ ] آخر تحديث: relTime; **muted/faded if > 48h** (config `prices.stale_after_hours`).
- [ ] إجراء: «إلى المتجر» text button via `/go/`; «احجز» outlined when stock>0.

## 4. Price-history chart (brief §2.3)
- [ ] `components/PriceChart.tsx` — hand-rolled responsive SVG (no chart lib):
      green 2px line + soft gradient fill; dashed grey horizontal avg line;
      small red marker at the max point; hover/touch tooltip (date + price + store);
      range tabs ٣٠ يوم / ٩٠ يوم / سنة (client fetch per range).
- [ ] Below the chart, the sentence that matters more than the chart:
      **«أدنى سعر مسجّل: ١,٠٩٠ ر.س في ١٢ مارس.»** from `min_point`.

## 5. Price-alert box (brief §2.3)
- [ ] Inline box: «نبّهني إذا نزل تحت [____] ر.س» + «فعّل التنبيه» button.
      Input pre-filled with the historical low. Guest → redirects to login with `next`.
      Authed → POST alert (phase 10 API); success state shows the active alert +
      toggle. (Render now; wire fully in phase 10.)

## 6. Specs table
- [ ] Two-column rows striped with `surface`, grouped under headers from `specs` JSON
      groups (الشاشة، المعالج، الكاميرا، البطارية، الذاكرة…). Collapsible «عرض كل
      المواصفات» beyond 12 rows.

## 7. Verified reviews section (display only — write flow in phase 13)
- [ ] Header: `4.6` (40px Mono) + bar + «٨٧ تقييمًا موثّقًا» for the **cheapest store**
      by default with a store switcher pill row (reviews are per-store).
- [ ] Review rows: name + small solid red ★ «موثّق» + «تمّ الاستلام في ٤ يونيو» + body.
- [ ] One-line explainer under the header: «التقييم متاح فقط لمن أكمل حجزًا عبر المنصة.»
      **No review button for visitors** (brief).

## 8. SEO (finalized in phase 20, wired now)
- [ ] `generateMetadata`: auto title «سعر {name_ar} — يبدأ من {best_price} ر.س | أسعار»,
      description from name+category+min price (SRS algorithm), OpenGraph image.
- [ ] `<ProductJsonLd>` component: schema.org Product (name, image, brand, offers
      with lowPrice/highPrice/offerCount/availability, aggregateRating from store ratings).

## Store profile page `(public)/store/[slug]/page.tsx` (small, belongs here)
- [ ] Store header (logo, city, address, map link, verified badge, RatingBar large),
      its product grid (`/api/products?store=`), reviews list. SSR + metadata.

## Definition of Done
- [ ] Seeded product renders: correct cheapest-first order, green-tint best row,
      greyed unavailable rows in place, stale timestamps faded.
- [ ] Chart matches seeded history; range tabs refetch; min sentence correct.
- [ ] `/go/` click opens affiliate URL and increments `product_stats.clicks`.
- [ ] View JSON-LD in page source validates in Google Rich Results test (structure-wise).
- [ ] Mobile: sticky bottom CTA bar appears, columns stack.
