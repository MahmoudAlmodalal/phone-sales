# Phase 12 — Anti-Fraud & Penalties (SRS §4)

**Goal:** protect vendors from fake bookings: score no-shows (strikes) and
count cancellations (transparency only), auto-restrict and flag accounts,
surface everything transparently to the user, give the admin overrides.

**Depends on:** 11 (booking_events being written).

**Produces:** FraudService, restriction enforcement, account-status card,
admin fraud endpoints.

## Rules (config-driven — fraud.* keys from 00 §6)

| Event | Effect | Window |
|---|---|---|
| no_show (didn't attend, didn't cancel — the SRS trigger) | 1 strike | rolling fraud.no_show_window_days (90) |
| cancelled (self-cancel) | soft count only, shown in the cancel dialog | rolling 30 days |

- 3rd strike (fraud.no_show_threshold): set restricted_until = now +
  fraud.restriction_days, restriction_reason «تكرار عدم الحضور», and
  warning_flag = true. The flag persists after the restriction lapses (the SRS
  profile warning mark) until an admin clears it.
- 2nd strike: warning notification only — «تخلّفت عن حجزين دون إلغاء. التخلف
  الثالث يعلّق الحجز ١٤ يومًا.»
- Restriction is enforced at the booking draft endpoint (phase 11 — 403 code
  restricted with reason + end date).
- Cancellations NEVER cause restriction — only the transparency counter.

## Steps

### S1 — FraudService
- **Do:** A pure, unit-tested service: strikeCount(user) counting no_show
  events in the rolling window; recordEvent(booking, type) called from the
  phase-11 transitions; apply(user) implementing the 2nd/3rd-strike behavior
  above; liftRestriction(user) and clearFlag(user). All thresholds from
  config. Applying a restriction also writes a security_events row (type
  suspicious).
- **Touch:** `backend/app/Services/FraudService.php`, listener on the no_show
  transition, unit tests.
- **Done when:** unit tests — 3 events in window restrict; events outside the
  90-day window don't count; 2nd strike warns without restricting; cancelled
  events never restrict.

### S2 — Admin fraud endpoints
- **Do:** GET /api/admin/users/{user}/fraud (events timeline + strike count),
  POST /api/admin/users/{user}/lift-restriction, POST
  /api/admin/users/{user}/clear-flag. Admin-only via the phase-04 middleware.
  (UI lands in phase 18 — the existing `frontend/src/app/admin/fraud/` page
  will consume these.)
- **Touch:** backend controllers, routes, tests.
- **Done when:** lift → the user can draft a booking again; the flag remains
  until clear-flag is called.

### S3 — Account-status card
- **Do:** The «حالة الحساب» card (brief §2.6) shown in the account profile
  and reused on the booking draft page: normal → «جيدة» green; restricted →
  red «مقيّد حتى {date}» + the reason line; warning flag → star-tint
  background + «تحذير: حجزان دون حضور» (red is allowed — loss/destructive
  category). Data comes from /auth/me (already returns warning_flag,
  restricted_until).
- **Touch:** a shared AccountStatusCard component,
  `frontend/src/app/account/page.tsx`, `frontend/src/app/booking/new/*`.
- **Done when:** setting restricted_until on the demo user in tinker renders
  the red card in both places and the draft form is replaced by the
  explanation.

### S4 — Vendor no-show confirmation
- **Do:** In the vendor bookings list (page built in 15 — if not yet built,
  wire the dialog into the API layer + a kitchen-sink demo), the «لم يحضر»
  action must open a confirm dialog: «سيُسجَّل عدم حضور على حساب العميل»
  (prevents accidental strikes). Red text button, per the red rule.
- **Touch:** `frontend/src/components/dash/ConfirmDialog.tsx` usage, vendor
  booking actions.
- **Done when:** the no-show call only fires after dialog confirmation.

### S5 — End-to-end verification
- **Do:** Scripted flow (seed shortcuts allowed): vendor marks no-show three
  times for a test user → user sees the red restricted card and cannot start
  a booking → admin lifts → user can book; flag still visible until cleared.
- **Touch:** feature test + manual browser pass.
- **Done when:** the full flow passes in a feature test and once manually.

## Phase acceptance
- All S1 unit tests + S5 flow green; restriction, warning, and flag states
  visible in the UI exactly per the red rule; admin overrides work.
