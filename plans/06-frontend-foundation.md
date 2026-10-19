# Phase 06 — Frontend Integration Foundation

**Goal:** turn the existing mock-data frontend into an API-driven app skeleton:
a typed API client, real session/favorites stores, formatters audit, and route
scaffolds for the pages that don't exist yet. After this phase every page phase
(07–09, 14–18) plugs into a ready, typed foundation. NO porting — the UI shell
(Navbar, Footer, components, tokens) already exists.

**Depends on:** 01. Phase 05 endpoint contracts are the type source (mock them
if 05 isn't deployed yet).

**Produces:** typed `lib/api.ts`, updated stores, route scaffolds, kitchen-sink
coverage of shared components.

## Context for the agent

- Existing and to be REUSED as-is: `src/components/*` (all), `src/stores/*`,
  `src/lib/format.ts`, `src/lib/mock-data.ts` (to be phased out page by page —
  do not delete it here; pages still importing it must keep working).
- Existing routes are top-level (`app/search`, `app/login`, …) — keep that
  structure; do NOT introduce a (public) route group.
- Missing routes to scaffold: `product/[slug]`, `store/[slug]`,
  `booking/[number]` and a booking start page, the entire `vendor/*` section.

## Steps

### S1 — Typed API client
- **Do:** Extend `src/lib/api.ts` into a full client: a generic fetch helper
  taking a path and init, base URL from env, bearer attachment from the
  httpOnly cookie on the server (client mutations go through route-handler
  proxies), envelope normalization (data/meta), and a typed ApiError carrying
  422 field errors and the typed `code` values from 00 §5. Add typed wrappers
  for the phase-05 contracts: home, products list, product detail, price
  history, suggest, categories, brands, compared. Define the shared TypeScript
  interfaces (card shape aligned with ProductCard props).
- **Touch:** `frontend/src/lib/api.ts`, `frontend/src/lib/types.ts` (new).
- **Done when:** `npm run build` passes; the kitchen-sink page renders one
  ProductCard from a live (or mocked) products call.

### S2 — Stores wired to reality
- **Do:** compare store: keep sessionStorage persistence, cap at 4 with the
  grey toast «المقارنة تتّسع لأربعة. أزل واحدًا أولًا.» on the 5th, store
  minimal card data (id, slug, name_ar, image, best_price) so the bar renders
  without refetch, and fire the compared ping on add. favorites store:
  optimistic toggle calling the API when authed (phase 10 endpoints — stub the
  call behind an interface for now), localStorage for guests, and a
  merge-on-login hook. session store: confirm the phase-04 wiring (or leave a
  clearly-marked mock behind the same interface if 04 isn't done).
- **Touch:** `frontend/src/stores/compare.ts`, `frontend/src/stores/favorites.ts`,
  `frontend/src/stores/session.ts`.
- **Done when:** adding a 5th compare item shows the toast; compare state
  survives navigation; guest favorites persist across reloads.

### S3 — Formatters audit
- **Do:** Verify `src/lib/format.ts` covers: money (Latin digits in Mono per
  the design — Intl with ar-SA and Latin numerals), percent with direction
  glyphs (▼ 4.1%), relative time («قبل ٧ دقائق»), short date («١٢ مارس»). All
  numeric spans render LTR in Mono. Add whatever is missing; add unit tests if
  a test runner exists, otherwise a kitchen-sink section showing each
  formatter output.
- **Touch:** `frontend/src/lib/format.ts`, kitchen-sink page.
- **Done when:** kitchen-sink shows correct output for each formatter,
  including negative percents and stale dates.

### S4 — Missing route scaffolds
- **Do:** Create minimal, typed page scaffolds (real layout chrome, skeleton
  content, correct metadata titles) for: `app/product/[slug]/page.tsx`,
  `app/store/[slug]/page.tsx`, `app/booking/[number]/page.tsx`, a booking
  start route (`app/booking/new/page.tsx`), and the vendor section —
  `app/vendor/layout.tsx` using the existing DashboardLayout with tabs
  (نظرة عامة · منتجاتي · الاستيراد · الحجوزات · متجري · الربط التقني) plus
  stub pages for each tab. Guarded by the middleware from phase 04 (or
  RoleGuard until 04 lands).
- **Touch:** `frontend/src/app/product/[slug]/*`, `frontend/src/app/store/[slug]/*`,
  `frontend/src/app/booking/*`, `frontend/src/app/vendor/*`.
- **Done when:** every route renders its scaffold with Navbar/Footer or
  dashboard chrome and no console errors; `npm run build` passes.

### S5 — Global chrome check
- **Do:** Verify (and fix where missing): `not-found.tsx` («هذه الصفحة غير
  موجودة…» + search field per brief §2.10), `error.tsx` («تعذّر تحميل
  الأسعار…» + retry), an offline grey top banner driven by the browser online
  event. These mostly exist — this is an audit step, not a rebuild.
- **Touch:** `frontend/src/app/not-found.tsx`, `frontend/src/app/error.tsx`,
  `frontend/src/components/ChromeExtras.tsx`.
- **Done when:** visiting a bogus URL shows the 404 with a working search
  field; killing the network shows the offline banner.

## Phase acceptance
- `npm run build` passes with zero TS errors; all routes (existing + new
  scaffolds) render; compare/favorites behaviors verified in the browser;
  kitchen-sink shows every shared component and formatter state.
