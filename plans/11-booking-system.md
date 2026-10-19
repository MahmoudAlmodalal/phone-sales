# Phase 11 — Smart Booking System (SRS §4)

**Goal:** the platform's hardest feature: 24-hour device holds with an
expected-arrival commitment, a real concurrency lock, expiry + reminders,
vendor notifications — and the 3-star booking flow UI (brief §2.5).

**Depends on:** 04, 08. Config (00 §6): hold_hours 24, max_qty 2,
reminder_hours_before 2, draft_ttl_minutes 30.

**Produces:** booking endpoints, scheduled jobs, `/booking/new` and
`/booking/[number]` pages, vendor booking actions (API side).

## State machine

Bookings are rows in the bookings table using the status enum from phase 02
(draft is a first-class status): draft → (confirm, with row lock) → active →
(vendor «تم الاستلام») completed | (user cancel) cancelled | (expiry sweep
past expires_at) expired | no_show. no_show is chosen over expired when
expected_arrival_at passed without completion or cancellation (fraud scoring
input, phase 12). Stock: decremented atomically at confirm; restored on
cancelled/expired/no_show. Drafts older than draft_ttl_minutes are swept.

## API contracts (auth: user unless noted)

- POST /api/bookings/draft — body: product_price_id, color?, variant?,
  quantity (≤ max_qty), expected_arrival_at. Validates: stock > 0, arrival
  inside the hold window (now+1h … now+hold_hours), user not restricted
  (403 code `restricted` with restricted_until + reason — phase 12), no other
  active booking for the same product+store. Creates a status=draft booking;
  returns draft id + locked-price preview.
- POST /api/bookings/{draft}/confirm — the concurrency-critical endpoint.
  Inside one DB transaction: re-read the product_price row WITH a row-level
  lock; if stock < quantity → 409 code `stock_conflict`, message «نفدت
  الكمية أثناء التأكيد. ما تم خصم أي شيء.», body includes `alternatives`
  (other stores with stock at similar price). Otherwise decrement stock, set
  number (BK-{YY}-{seq} per 00 §6), qr_token, price_locked, expires_at =
  now + hold_hours, status active. Fires BookingConfirmed → instant vendor
  notification (database + mail): «حجز جديد: {product} × {qty} — الوصول
  المتوقع {time}».
- GET /api/bookings/{number} — owner or the store's vendor: status, countdown
  seconds, qr_token, store address/geo, month's cancellation count.
- POST /api/bookings/{number}/cancel — sets cancelled, restores stock, writes
  booking_events(cancelled); response includes the month's cancellation count
  (transparency dialog).
- Vendor: POST /api/vendor/bookings/{number}/complete («تم الاستلام» — unlocks
  the review right, phase 13) and /no-show (writes the fraud event, phase 12).

## Steps

### S1 — Draft endpoint + validation
- **Do:** Implement the draft endpoint with all validations and the
  restricted-user check reading restricted_until.
- **Touch:** backend controller, FormRequest, routes, tests.
- **Done when:** tests — stock 0 rejected; arrival outside window rejected;
  restricted user gets 403 with code restricted; duplicate active booking for
  same product+store rejected.

### S2 — Confirm endpoint with row lock
- **Do:** Implement confirm exactly per the contract (transaction + row lock +
  409 alternatives + number/qr generation + vendor notification).
- **Touch:** backend controller/service, notification, tests.
- **Done when:** race test — two parallel confirms against stock=1 (two DB
  connections or a parallel test runner): exactly one succeeds, stock ends 0,
  the loser gets 409 with a non-empty alternatives list when another store
  has stock.

### S3 — Detail, cancel, vendor transitions
- **Do:** Implement the detail endpoint (owner-or-store-vendor policy),
  cancel (stock restore + event + month count), and the vendor complete /
  no-show endpoints with BookingPolicy authorization.
- **Touch:** backend controllers, policies, tests.
- **Done when:** policy tests pass (stranger 403); cancel restores stock and
  writes the event; complete flips status and records completed_at.

### S4 — Scheduled jobs
- **Do:** Three scheduled tasks: expire — every minute, active bookings past
  expires_at become expired (or no_show when expected_arrival_at passed),
  stock restored, event written, user notified «انتهت صلاحية حجزك…»; remind —
  every 15 min, active bookings within reminder_hours_before of expiry and
  reminder_sent_at null get the reminder «حجزك ينتهي خلال ساعتين — {store
  address}» and reminder_sent_at set (sent once); draft sweep — hourly,
  drafts older than draft_ttl_minutes deleted.
- **Touch:** `backend/routes/console.php`, jobs, tests using time travel.
- **Done when:** time-travel tests — expiry restores stock and picks
  expired-vs-no_show correctly; the reminder fires exactly once.

### S5 — Booking step 1 UI (اختيار)
- **Do:** Build /booking/new (scaffolded in 06): the 3-star step indicator
  (★ ─ ☆ ─ ☆ labelled اختيار / تأكيد / استلام; current star pulsing outline,
  completed filled red — one of the two sanctioned star uses); store cards
  (Mono price + address), color & capacity chips, quantity (max from
  config), expected-arrival picker constrained to the hold window (today/
  tomorrow, time slots); the calm warning line on surface (no alarm icon):
  «الحجز يثبّت السعر والكمية لمدة ٢٤ ساعة. عدم الحضور دون إلغاء يقيّد قدرتك
  على الحجز.» (hold hours rendered from config, not hardcoded). Guest →
  login redirect with return; restricted user → red-text explanation with the
  end date, no form.
- **Touch:** `frontend/src/app/booking/new/*`, step-indicator component.
- **Done when:** the flow renders from a product page's «احجز» button with
  the store preselected; restricted state verified by setting
  restricted_until on the demo user.

### S6 — Step 2 UI (تأكيد — the lock UX)
- **Do:** Summary card; the confirm button's loading state is the TEXT
  «نثبّت لك القطعة…» (not a spinner). Success → step 3. On 409
  stock_conflict: the card shakes once, red message «نفدت الكمية أثناء
  التأكيد. ما تم خصم أي شيء.», and a button «اعرض متاجر أخرى بالسعر نفسه»
  rendering the alternatives inline. No apology wording.
- **Touch:** booking flow components.
- **Done when:** forcing a 409 (set stock 0 mid-flow in tinker) shows the
  shake + alternatives.

### S7 — Step 3 UI (الاستلام — /booking/[number])
- **Do:** Booking number Mono 28px + QR rendered client-side from qr_token
  (small local QR generator — no external service); the countdown — the
  page's only red: HH:MM:SS Mono on star-tint, label «يُلغى الحجز تلقائيًا
  بعد», ticking live and synced from the server's countdown seconds;
  expected-arrival line + store address + static map link; locked-price row.
  Cancel is a grey TEXT link opening a dialog that shows the month counter:
  «هذا إلغاؤك الثاني هذا الشهر. بعد الثالث يُعلَّق الحجز ١٤ يومًا.» → confirm.
- **Touch:** `frontend/src/app/booking/[number]/*`, reuse `Countdown.tsx`.
- **Done when:** the seeded active booking renders number/QR/countdown; the
  countdown matches expires_at; cancel round-trips and shows the counter.

## Phase acceptance
- Full happy path in the browser: select → «نثبّت لك القطعة…» → number + QR +
  ticking countdown; vendor account receives the instant notification;
  Mailpit shows the reminder when expires_at is tweaked; the forced-409 path
  shows shake + alternatives; the race test is green.
