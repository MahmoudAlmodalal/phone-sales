# Phase 11 — Smart Booking System (SRS §4)

**Goal:** the platform's hardest feature: 24-hour device holds with expected-arrival
time, a real concurrency lock, expiry + reminders, vendor notifications — and the
3-star booking flow UI (brief §2.5).

**Prerequisites:** Phases 04, 08. Config: `booking.hold_hours=24`, `max_qty=2`,
`reminder_hours_before=2`.

## State machine

```
draft ─confirm(lock)→ active ─vendor "تم الاستلام"→ completed
                       │─user cancel→ cancelled
                       │─expiry sweep (now > expires_at)→ expired / no_show*
* no_show when expected_arrival_at passed without completion/cancellation (phase 12 scoring)
```
Stock: decremented atomically at confirm; restored on cancelled/expired/no_show.

## API (auth: user; restricted users blocked — see phase 12)

### POST `/api/bookings/draft`
`{product_price_id, color?, variant?, quantity≤2, expected_arrival_at}` →
validates stock>0, arrival within hold window (now+1h … now+24h), user not
restricted (`restricted_until`), no other active booking for same product+store.
Returns draft id + locked-price preview. Draft rows expire after 30 min (sweep).

### POST `/api/bookings/{draft}/confirm` — **the concurrency-critical endpoint**
```php
DB::transaction(function () use ($draft) {
    $price = ProductPrice::whereKey($draft->product_price_id)
        ->lockForUpdate()->first();                    // row lock
    abort_if($price->stock < $draft->quantity, 409,
        'نفدت الكمية أثناء التأكيد. ما تم خصم أي شيء.');
    $price->decrement('stock', $draft->quantity);
    return Booking::create([... number => next('BK-24-######'),
        qr_token => uuid, price_locked => $price->price,
        expires_at => now()->addHours(config('platform.booking.hold_hours')),
        status => Active ...]);
});
```
- 409 body includes `alternatives`: other stores with stock at similar price
  (feeds the «اعرض متاجر أخرى بالسعر نفسه» button).
- Fires `BookingConfirmed` → **instant vendor notification** (database + mail):
  «حجز جديد: {product} × {qty} — الوصول المتوقع {time}» (SRS).

### GET `/api/bookings/{number}` — owner or the store's vendor
Full detail: status, countdown seconds, QR token, store address/geo, cancellation count.

### POST `/api/bookings/{number}/cancel`
Sets cancelled, restores stock, writes `booking_events(cancelled)`; response includes
month's cancellation count (for the transparency dialog).

### Vendor: POST `/api/vendor/bookings/{number}/complete` («تم الاستلام») and
`/no-show` — completed unlocks the review right (phase 13); no_show writes the fraud event.

## Scheduled jobs (`routes/console.php`)
- [ ] `bookings:expire` every minute: `status=active AND expires_at < now()` →
      expired (or `no_show` if `expected_arrival_at` passed), restore stock,
      write event, notify user «انتهت صلاحية حجزك…».
- [ ] `bookings:remind` every 15 min: active, `expires_at - now() <= 2h`,
      `reminder_sent_at IS NULL` → reminder notification (SRS: 1–2h before expiry)
      «حجزك ينتهي خلال ساعتين — {store address}» ; set `reminder_sent_at`.
- [ ] `bookings:sweep-drafts` hourly.

## UI — `(public)/booking/…` (brief §2.5)

**Step indicator** (all steps): three signature stars ★ ─ ☆ ─ ☆ labelled
اختيار / تأكيد / استلام; current star has pulsing outline; completed fill `--star`.

### Step 1 — اختيار (`/booking/new?product=`)
- [ ] Store cards (price Mono + address/distance), color & capacity chips,
      quantity (max 2), **expected-arrival picker** (date fixed = today/tomorrow within
      24h window; time slots vs store hours).
- [ ] Calm warning line on `surface` (no alarm icon): «الحجز يثبّت السعر والكمية لمدة
      ٢٤ ساعة. عدم الحضور دون إلغاء يقيّد قدرتك على الحجز.» (copy reads hold from config).
- [ ] Guest → login redirect with return; restricted user → red-text explanation + date.

### Step 2 — التأكيد (Concurrency Lock UX)
- [ ] Summary card; confirm button on click becomes **text state «نثبّت لك القطعة…»**
      (not a generic spinner) while the request runs.
- [ ] Success → immediate step 3. Failure (409) → card shakes **once**, red message
      «نفدت الكمية أثناء التأكيد. ما تم خصم أي شيء.» + button «اعرض متاجر أخرى بالسعر
      نفسه» rendering the `alternatives` list inline. No apology wording.

### Step 3 — الاستلام (`/booking/[number]`)
- [ ] Booking number Mono 28px + QR code (client-rendered from `qr_token`, e.g. tiny
      qr lib or SVG generator — no external service).
- [ ] **Countdown** — the page's only red: `٢٣:١٢:٣٣` Mono on `star-tint`, label
      «يُلغى الحجز تلقائيًا بعد» — live ticking, server-synced.
- [ ] Expected-arrival line + store address + static mini-map link; price-locked row.
- [ ] Cancel = grey **text link** (not a button). Opens dialog showing the counter:
      «هذا إلغاؤك الثاني هذا الشهر. بعد الثالث يُعلَّق الحجز ١٤ يومًا.» → confirm.

## Tests (critical)
- [ ] **Race test**: two parallel confirms on stock=1 → exactly one succeeds, stock=0,
      the other gets 409 (use `pcntl`/two DB connections or sequential with manual lock
      assertion + a `--parallel` pest run).
- [ ] Expiry job restores stock and flips status by expected-arrival rule.
- [ ] Reminder sent once, ~2h before expiry.
- [ ] Cancel restores stock + writes event; vendor complete → review right exists.
- [ ] Restricted user blocked from draft.

## Definition of Done
- [ ] Full happy path in browser: select → «نثبّت لك القطعة…» → number+QR+countdown.
- [ ] Vendor account receives the instant notification; Mailpit shows reminder mail
      when clock is advanced (`travel()` in a test / manual `expires_at` tweak).
- [ ] Forced 409 path shows shake + alternatives.
