# Phase 07 — Public Pages: Home + Search (API Wiring)

**Goal:** connect the two existing discovery pages to the phase-05 API with
SSR, matching brief §2.1 and §2.2. The pages and their components exist on
mock data — this phase swaps the data source and completes missing behaviors.

**Depends on:** 05, 06.

**Produces:** live `/` and `/search`, shared SearchBox suggestions, ad slots.

## Context for the agent

- Existing: `src/app/page.tsx` (home), `src/app/search/page.tsx`,
  `src/components/HomeSearch.tsx`, `PriceTicker.tsx`, `ProductCard.tsx`,
  `Skeleton.tsx`, `EmptyState.tsx` — all currently fed by `lib/mock-data.ts`.
- Data source: the typed client from phase 06 (`getHome`, `getProducts`,
  `suggest`).

## Steps

### S1 — Home page on live data
- **Do:** Convert the home page to a server component fed by the home
  endpoint: ticker (8–12 items, slow marquee; stale state renders the grey
  «الأسعار قيد التحديث. آخر نجاح: …» line — no red), the giant search field,
  the pulsing «● آخر تحديث للأسعار قبل …» line (pulse off under reduced
  motion), and the sections — «أكبر انخفاض اليوم» on the green-tint band (the
  ONLY tinted section), category chips, «الأكثر مشاهدة», «أفضل العروض»,
  «الأكثر مقارنة», trust bar with Mono numbers. Stream each section with
  Suspense + existing Skeletons. Remove the page's mock-data imports.
- **Touch:** `frontend/src/app/page.tsx`, section components as needed.
- **Done when:** home renders entirely from seed data; every section link
  navigates; the ticker pauses on hover and under reduced motion.

### S2 — Live search suggestions
- **Do:** Upgrade the search box (shared by home and navbar) into a full
  combobox: 200ms debounce into the suggest endpoint; dropdown grouped by
  small headers منتجات / علامات / متاجر; rows with 32px thumb + name + Mono
  best price; matched substring highlighted with green-tint; keyboard nav
  (arrows, Enter, Esc) with ARIA combobox roles; Enter with no selection goes
  to /search?q=.
- **Touch:** `frontend/src/components/HomeSearch.tsx` (or a new shared
  SearchBox it delegates to), `frontend/src/components/Navbar.tsx`.
- **Done when:** typing "s24" shows grouped, highlighted results; full
  keyboard navigation works; screen-reader roles present.

### S3 — Search page: filters ↔ URL
- **Do:** Make the filter rail (sticky, 280px, right side) drive URL
  searchParams and SSR: price dual slider with Mono min/max inputs; brand
  checkbox list with internal search; specs chips (الذاكرة / التخزين / حجم
  الشاشة / البطارية); store select; rating minimum; the two toggles «متاح
  للحجز فقط» and «انخفض سعره خلال ٧ أيام»; «مسح الفلاتر» text button. On
  mobile the rail collapses into a bottom sheet with an active-filter count
  chip. The page server component parses searchParams and fetches the first
  page server-side; client filter changes update the URL shallowly.
- **Touch:** `frontend/src/app/search/page.tsx` + filter components.
- **Done when:** every filter and sort combination updates the URL and the
  results; the browser back button restores the previous filter state.

### S4 — Search results: sort, infinite scroll, states
- **Do:** Sort tabs (الأقل سعرًا · الأكثر انخفاضًا · الأكثر مشاهدة · الأكثر
  مقارنة · الأحدث); result count line («٤٨ نتيجة لـ …»); infinite scroll via
  cursor pagination (IntersectionObserver sentinel + skeleton row); zero
  state per brief §2.10 — «ما في نتائج لـ "…". جرّب اسم أقصر، أو تصفّح
  [سامسونج] [آيفون] [شاومي].» with live brand-chip links, no apology.
- **Touch:** search page + results components.
- **Done when:** scrolling loads the next cursor page; a gibberish query
  renders the zero state with working chips.

### S5 — Ad slots + metadata
- **Do:** Render the home_hero_side and search_top ad slots from the ads
  delivery endpoint (labelled «إعلان» badge, impression ping on view, clicks
  through /go/ with the ad param). Add generateMetadata for /search
  («بحث: {q} — أسعار»).
- **Touch:** an AdSlot component, home + search pages.
- **Done when:** a seeded active campaign renders in both slots and its
  impression counter increments; the search tab title shows the query.

## Phase acceptance
- Home and search fully live from seed data with zero mock-data imports in
  these routes; Lighthouse mobile on `/`: LCP < 2.5s locally, no layout shift
  from ticker/skeletons; suggest, filters, infinite scroll, and zero state all
  verified in the browser.
