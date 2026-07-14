# Phase 07 — Public Pages: Home + Search

**Goal:** the two discovery pages, SSR-rendered from the phase-05 API, matching
brief §2.1 and §2.2 exactly.

**Prerequisites:** Phases 05, 06.

## 7.1 Homepage `(public)/page.tsx` (brief §2.1)

Hero = **live data, not marketing**:
- [ ] `PriceTicker` fed by `getHome().ticker` — 8–12 items, slow marquee.
      Stale state: grey «الأسعار قيد التحديث. آخر نجاح: أمس ١١:٤٠» (no red).
- [ ] Giant search field (56px, 2px green border) — submits to `/search?q=`,
      with the live-suggest dropdown (shared `SearchBox` component, see 7.2).
- [ ] Under it: «● آخر تحديث للأسعار قبل ٧ دقائق» — pulsing green dot
      (pulse off under reduced motion), value from `last_update_minutes`.

Sections (each a server component, streamed with Suspense + skeletons):
- [ ] **أكبر انخفاض اليوم** — `green-tint` background band (the ONLY tinted section),
      3–4 `ProductCard`s from `biggest_drops`.
- [ ] **تصفّح حسب الفئة** — circular category chips → `/search?category=`.
- [ ] **الأكثر مشاهدة** and **أفضل العروض** rows (SRS smart sections) — 4-col grids.
- [ ] **الأكثر مقارنة** — 4-col grid.
- [ ] Ad slot `home_hero_side` (renders active campaign if any — impression ping).
- [ ] Trust bar above footer: «١٢ متجرًا · ٦٤٠ منتجًا متتبَّعًا · ٨٤٠ ألف نقطة سعر» — Mono numbers.

## 7.2 SearchBox + live suggestions (shared, brief §2.2)

- [ ] `components/SearchBox.tsx` (client): debounce 200ms → `suggest(q)`;
      dropdown grouped by small headers `منتجات / علامات / متاجر`;
      each row: 32px thumb + name + best price (Mono, start-aligned left);
      matched substring highlighted with `green-tint`; keyboard nav (↑↓ Enter Esc),
      ARIA combobox roles; Enter with no selection → `/search?q=`.

## 7.3 Search page `(public)/search/page.tsx`

Layout: sticky filter rail (right, 280px) + results column.

**Filter rail** (client component syncing to URL searchParams — SSR reads them):
- [ ] Price range: dual slider, green handles + min/max Mono inputs.
- [ ] Brand: internal search + checkboxes.
- [ ] Specs chips (multi-select): الذاكرة / التخزين / حجم الشاشة / البطارية.
- [ ] Store select; rating minimum (RatingBar-style selector — SRS filter).
- [ ] ☑ متاح للحجز فقط · ☑ انخفض سعره خلال ٧ أيام.
- [ ] "مسح الفلاتر" text button; active-filter count chip on mobile
      (rail collapses into a bottom-sheet on <lg screens).

**Results:**
- [ ] Sort tabs: الأقل سعرًا · الأكثر انخفاضًا · الأكثر مشاهدة · الأكثر مقارنة · الأحدث.
- [ ] Grid of `ProductCard`s; **infinite scroll** via cursor pagination
      (IntersectionObserver sentinel + skeleton row while loading) — SRS "Scroll" navigation.
- [ ] Result count line: «٤٨ نتيجة لـ "سامسونج"».
- [ ] Zero state: «ما في نتائج لـ "…". جرّب اسم أقصر، أو تصفّح [سامسونج] [آيفون] [شاومي].»
      — brand chips are live links (no apology, per brief).
- [ ] Ad slot `search_top` (labelled «إعلان» badge).

## SSR details
- [ ] `page.tsx` is a server component: parses `searchParams`, calls `getProducts()`,
      renders first page server-side (SEO + fast first paint); client takes over for
      filter changes (router.replace with shallow params) and infinite scroll.
- [ ] `generateMetadata` for /search: «بحث: {q} — أسعار».

## Definition of Done
- [ ] Home renders fully from seed data; every section navigates correctly.
- [ ] Suggest dropdown: type "s24" → grouped results with highlight; keyboard nav works.
- [ ] Each filter/sort combination updates URL and results; back button restores state.
- [ ] Infinite scroll loads next cursor page; zero-state renders for gibberish query.
- [ ] Lighthouse (mobile) on `/`: LCP < 2.5s locally, no CLS from ticker/skeletons.
