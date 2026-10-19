# Phase 14 — User Dashboard Wiring (brief §2.6)

**Goal:** assemble the account area on live data: profile + the tabs whose
backends were built in phases 10/11/13, the account-status card from 12, and
brief-compliant empty states. The account layout and several pages already
exist (`frontend/src/app/account/`) on mock data.

**Depends on:** 10, 11, 12, 13 (their APIs), 06.

**Produces:** fully live `/account/**`.

## Context for the agent

- Existing: `app/account/layout.tsx`, `page.tsx`, `favorites/`, `alerts/`,
  `bookings/` (mock data); `components/DashboardLayout.tsx`.
- Final tab list (single source of truth): **الملف · المفضلة · تنبيهات السعر ·
  حجوزاتي · تقييماتي · الدعم**. The الدعم tab's content lands in phase 19 —
  this phase adds the tab slot with a placeholder if 19 isn't done.
- Routes: /account, /account/favorites, /account/alerts, /account/bookings,
  /account/reviews, /account/support. All guarded by the phase-04 middleware.

## Steps

### S1 — Layout + tab list
- **Do:** Update the account layout to the final tab list above (URL-driven
  active tab, horizontal scroll on mobile), all fed by the real session.
- **Touch:** `frontend/src/app/account/layout.tsx`.
- **Done when:** all six tabs navigate; deep links land on the right tab.

### S2 — Profile page (الملف)
- **Do:** Wire the profile form to the real API: avatar upload (preview +
  multipart), name, email read-only, phone, language; save via the profile
  endpoint with the «حُفظ ١٤:٣٢» success hint. Password-change block via the
  password endpoint. Embed the phase-04 2FA block. Sidebar: the
  AccountStatusCard from phase 12 (جيدة / تحذير / مقيّد حتى…).
- **Touch:** `frontend/src/app/account/page.tsx`.
- **Done when:** edits persist across refresh; wrong current password shows
  the field error; the status card reflects tinker-set restriction.

### S3 — Favorites + alerts tabs
- **Do:** Confirm the phase-10 wiring renders here per brief §2.6 (then-vs-now
  arrows, met-alert green-tint rows, inline threshold edit) and that empty
  states match brief §2.10 tone (action, no apology) with the
  «تصفّح الأكثر انخفاضًا» CTA.
- **Touch:** `frontend/src/app/account/favorites/*`, `frontend/src/app/account/alerts/*`.
- **Done when:** seeded content renders; emptying the data shows the correct
  empty states.

### S4 — Bookings tab (حجوزاتي)
- **Do:** Replace mock data with the user's bookings: cards by status —
  نشط (green chip + LIVE countdown + arrival time + store address + link to
  /booking/[number]), مكتمل (grey + «قيّم المتجر» when reviewable), ملغي
  (name struck through), منتهي/لم يحضر (star-tint note). Status filter chips;
  empty state.
- **Touch:** `frontend/src/app/account/bookings/*`, a bookings list endpoint
  under /api/account if not already present from phase 11.
- **Done when:** the demo user's five seeded states all render; the active
  card's countdown matches the /booking/[number] page.

### S5 — Reviews tab + notifications strip
- **Do:** Mount the phase-13 «تقييماتي» content (reviewables prompt block on
  top, status list below). Add the recent-notifications strip on the profile
  header area (same source as the navbar bell from phase 10).
- **Touch:** `frontend/src/app/account/reviews/*`, `frontend/src/app/account/page.tsx`.
- **Done when:** a booking reminder or alert notification appears in both the
  bell and the strip.

## Phase acceptance
- Demo user login → all six tabs render live seeded content; no mock-data
  imports remain under `app/account/`; tab state in URL; mobile horizontal
  tab scroll works; every empty state matches brief §2.10.
