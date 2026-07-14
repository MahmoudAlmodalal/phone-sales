# Phase 06 — Frontend Foundation (Porting the Prototype)

**Goal:** port the `design-reference/as3ar-app` prototype's shell into Next.js App
Router: layout, shared components, state stores, typed API client, formatters.
After this phase every page phase (07–09, 14–18) plugs into a ready skeleton.

**Prerequisites:** Phase 01 (scaffold). Phases 04/05 APIs helpful but mockable.

## Route map (React Router → App Router)

| Prototype route | Next.js path | Rendering |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | SSR + streaming |
| `/search` | `(public)/search/page.tsx` | SSR (searchParams) |
| `/product/:id` | `(public)/product/[slug]/page.tsx` | SSR + `generateMetadata` |
| `/compare` | `(public)/compare/page.tsx` | client (reads compare store) |
| `/booking/:id` | `(public)/booking/[number]/page.tsx` | SSR + client countdown |
| — (new) | `(public)/store/[slug]/page.tsx` | SSR (store profile + reviews) |
| `/login` | `(public)/login/page.tsx` | client form |
| `/account/*` | `account/(tabs)` layout + pages | client, guarded |
| `/vendor/*` | `vendor/(tabs)` layout + pages | client, guarded |
| `/admin/*` | `admin/(tabs)` layout + pages | client, guarded |
| `*` | `not-found.tsx` | 404 per brief §2.10 (search field) |

## Tasks

### 1. Layout shell (port 1:1 visually)
- [ ] `components/Navbar.tsx` ← `Navbar.jsx`: sticky green header — logo (3 red stars
      mark), links (تصفح، البائعون), search shortcut, auth area; mobile hamburger.
- [ ] `components/Footer.tsx` ← `Footer.jsx`: ink-black footer, link columns, thin
      trust bar above it.
- [ ] `components/Star.tsx` ← `Star.jsx`: the signature star (filled/outline/size props).
- [ ] `(public)/layout.tsx`: Navbar + children + CompareBar + Footer.
- [ ] `components/DashboardLayout.tsx` ← prototype version: horizontal tabs + content
      area — reused by account/vendor/admin layouts with their tab lists.
- [ ] Do **not** port `DevRoleSwitcher.jsx` / `PlaceholderPage.jsx` (dev artifacts).

### 2. Shared components (port + typed props)
- [ ] `ProductCard.tsx` ← `ProductCard.jsx` — accepts the `ProductCard` API shape
      (phase 05): image, name, "ابتداءً من" best price (Mono 24px), drop/rise badge,
      "من ٧ متاجر · فرق ٢٣٠" muted line, ♡ favorite, ☐ add-to-compare.
- [ ] `PriceTicker.tsx` ← `PriceTicker.jsx` — marquee row, Mono prices, green ▼ /
      red ▲ + pct; pauses on hover and under `prefers-reduced-motion`; stale state.
- [ ] `CompareBar.tsx` ← `CompareBar.jsx` — fixed bottom 72px ink bar (phase 09 wires it).
- [ ] `Badge.tsx` (drop green-tint / rise star-tint / موثّق star), `Skeleton.tsx`
      (pulsing surface rectangles), `Toast.tsx` (grey neutral + red destructive),
      `EmptyState.tsx` (icon + Arabic CTA per brief §2.10), `RatingBar.tsx`
      (number + horizontal bar + count — NEVER stars), `Countdown.tsx`
      (Mono, star-tint bg — used by booking + dashboards).

### 3. State (replaces prototype `AppContext`)
- [ ] `stores/compare.ts` (Zustand + `sessionStorage` persist): ids ≤ 4,
      `toggle/clear`, toast on 5th ("المقارنة تتّسع لأربعة. أزل واحدًا أولًا.").
- [ ] `stores/favorites.ts`: optimistic toggle → API when authed, localStorage for
      guests + merge-on-login.
- [ ] Session: server-side via httpOnly cookie (phase 04); client hook `useSession()`
      reads `/api/session` (role, name, status) — SWR-style revalidation.

### 4. API client & formatters
- [ ] `lib/api.ts`: `apiFetch<T>(path, init?)` — base URL from env, attaches bearer
      from cookie (server) / relies on route-handler proxy (client mutations),
      normalizes `{data, meta}`, throws typed `ApiError` (422 field errors).
      Typed wrappers: `getHome()`, `getProducts(params)`, `getProduct(slug)`, `suggest(q)`, ….
- [ ] `lib/format.ts`:
      `money(1150)` → `"١٬١٥٠ ر.س"` **digits kept Latin in Mono per design (1,150)** —
      decide once: brief mockups use Latin digits in Mono; use `Intl.NumberFormat('ar-SA-u-nu-latn')`.
      `pct(-4.1)` → `▼ 4.1%`, `relTime(date)` → "قبل ٧ دقائق", `date(d)` → "١٢ مارس".
      All numeric spans get `dir="ltr"` + `font-mono`.

### 5. Global chrome
- [ ] `not-found.tsx`: «هذه الصفحة غير موجودة…» + search field.
- [ ] `error.tsx`: «تعذّر تحميل الأسعار. نحاول مجددًا خلال ثوانٍ.» + auto retry button.
- [ ] Offline banner component (grey top bar) via `navigator.onLine` listener.

## Definition of Done
- [ ] All routes render (pages can be stubs) with real Navbar/Footer, RTL, fonts.
- [ ] ProductCard renders correctly from a mocked API item (Storybook-less: a `/dev/kitchen-sink`
      page listing every shared component in all states — kept out of prod build).
- [ ] Compare store: adding 5th item shows the grey toast; state survives navigation.
- [ ] `npm run build` passes with zero TS errors.
