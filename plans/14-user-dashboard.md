# Phase 14 — User Dashboard (brief §2.6)

**Goal:** assemble the account area: profile + the tabs built in phases 10/11/13
under the ported `DashboardLayout`, with account-status card and empty states.

**Prerequisites:** Phases 10, 11, 12, 13 (their tabs/data), 06 (DashboardLayout).

## Structure
`src/app/account/layout.tsx` → `DashboardLayout` (ported from prototype
`AccountTabs.jsx` / `DashboardLayout.jsx`), tabs:
**الملف · المفضلة · تنبيهات السعر · حجوزاتي · تقييماتي**
Routes: `/account`, `/account/favorites`, `/account/alerts`, `/account/bookings`, `/account/reviews`.
All guarded by middleware (any authenticated role).

## Tasks

### الملف `/account`
- [ ] Form: avatar upload (preview + POST multipart), name, email (read-only),
      phone, language select; save via `PUT /auth/profile`; success hint
      «حُفظ ١٤:٣٢» pattern.
- [ ] Password change block (`PUT /auth/password`, current + new).
- [ ] 2FA block for eligible roles (phase 04 screens embedded).
- [ ] Sidebar **حالة الحساب** card (from phase 12): جيدة / تحذير / مقيّد حتى… states.

### المفضلة `/account/favorites`
- [ ] Grid from phase 10 API; then-vs-now arrows; remove; empty state + CTA
      «تصفّح الأكثر انخفاضًا» → `/search?sort=biggest_drop`.

### تنبيهات السعر `/account/alerts`
- [ ] Phase 10 table; met rows green-tint «تحقق ✓»; inline edit; toggle switch.

### حجوزاتي `/account/bookings`
- [ ] Cards by status: `نشط` (green chip + **live countdown** + arrival time + store
      address + link to `/booking/[number]`), `مكتمل` (grey + «قيّم المتجر» if
      reviewable), `ملغي` (name struck through), `منتهي/لم يحضر` (star-tint note).
- [ ] Filter chips by status; empty state.

### تقييماتي `/account/reviews`
- [ ] Phase 13 list + reviewable bookings prompt block on top.

### Notifications
- [ ] `/account` header area shows recent database notifications (booking reminders,
      alert triggers) — same source as navbar bell (phase 10).

## Definition of Done
- [ ] Demo user login → all five tabs render seeded content correctly; tab state in
      URL; mobile: tabs scroll horizontally.
- [ ] Active booking card countdown ticks and matches `/booking/[number]` page.
- [ ] Every empty state matches brief §2.10 tone (action, no apology).
