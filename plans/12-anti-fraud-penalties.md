# Phase 12 — Anti-Fraud & Penalties (SRS §4)

**Goal:** protect vendors from fake bookings: score no-shows (worse) and repeated
cancellations, auto-restrict or flag accounts, surface everything transparently.

**Prerequisites:** Phase 11 (`booking_events` being written).

## Rules (config-driven, `config/platform.php` → `fraud.*`)

| Event | Weight | Window |
|---|---|---|
| `no_show` (didn't attend, didn't cancel — SRS trigger) | 1 strike | rolling 90 days |
| `cancelled` (self-cancel) | soft count only (dialog transparency) | rolling 30 days |

- [ ] `fraud.no_show_threshold = 3` → on the 3rd strike, `FraudService::apply()`:
      set `restricted_until = now()+14 days`, `restriction_reason = 'تكرار عدم الحضور'`,
      and `warning_flag = true` (flag persists after restriction lapses — the SRS
      "علامة تحذيرية بملفه الشخصي").
- [ ] 2nd strike → warning notification only: «تخلّفت عن حجزين دون إلغاء. التخلف
      الثالث يعلّق الحجز ١٤ يومًا.»
- [ ] Restriction enforced at `bookings/draft` (403 with reason + end date — phase 11).
- [ ] Cancellation counter: `POST /cancel` response already returns month count;
      the cancel dialog shows «هذا إلغاؤك الثاني هذا الشهر…» (phase 11 UI).

## Backend tasks
- [ ] `app/Services/FraudService.php`: `strikeCount(user)`, `recordEvent(booking, type)`
      (called from booking transitions), `apply(user)`, `liftRestriction(user)` —
      pure + unit-tested; all thresholds from config.
- [ ] Listener on booking `no_show` transition → FraudService.
- [ ] Admin endpoints: `GET /api/admin/users/{user}/fraud` (events timeline, strikes),
      `POST /api/admin/users/{user}/lift-restriction`, `POST …/clear-flag`
      (admin override — UI in phase 18).
- [ ] `security_events` row (`type: suspicious`) when a restriction is applied.

## Frontend tasks
- [ ] Account profile "حالة الحساب" card (brief §2.6): normally «جيدة» green;
      restricted → **red** «مقيّد حتى ٢٢ يوليو» + clear reason line; warning flag →
      amberless design: star-tint bg + «تحذير: حجزان دون حضور» (red is allowed here —
      it's a loss/destructive category).
- [ ] Booking draft page: restricted state renders the same card + no form.
- [ ] Vendor booking list: no-show button confirmation dialog «سيُسجَّل عدم حضور على
      حساب العميل» (prevents accidental strikes).

## Tests
- [ ] 3 no_show events in window → restricted_until set, 403 on draft, reason correct.
- [ ] Events outside 90-day window don't count.
- [ ] 2nd strike sends warning, doesn't restrict.
- [ ] Admin lift → user can book again; flag remains until cleared.
- [ ] Cancelled bookings never cause restriction (only transparency counter).

## Definition of Done
- [ ] Simulated flow in browser: vendor marks no-show ×3 (seeded shortcuts ok) →
      user sees red restricted card and cannot start a booking; admin lifts it.
