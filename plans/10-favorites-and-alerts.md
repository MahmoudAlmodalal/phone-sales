# Phase 10 — Favorites & Price Alerts

**Goal:** SRS user features: favorites with "then vs now" value, price-drop
alerts with thresholds, triggered automatically by the phase-02 price-change
pipeline; notifications visible in the navbar bell and Mailpit.

**Depends on:** 04 (auth), 08 (product page hooks). Uses the PriceChanged
event from phase 02.

**Produces:** /api/account/favorites + /api/account/alerts, the alert
listener + notifications, wired product-page alert box, wired account tabs.

## API contracts (auth: user)

| Endpoint | Behavior |
|---|---|
| GET /api/account/favorites | cards + price_at_add, best_price_now, change_pct |
| POST /api/account/favorites {product_id} | stores current best price as price_at_add |
| DELETE /api/account/favorites/{product} | |
| GET /api/account/alerts | rows: product, threshold, current best, diff, is_active, triggered_at |
| POST /api/account/alerts {product_id, threshold} | upsert (unique user+product); threshold > 0 |
| PUT /api/account/alerts/{alert} {threshold?, is_active?} | editing threshold or re-activating CLEARS triggered_at (re-arms the alert) |
| DELETE /api/account/alerts/{alert} | |

Re-trigger semantics (single source of truth): a triggered alert
(triggered_at set) never notifies again. It re-arms only when the user edits
the threshold or toggles is_active back on — both clear triggered_at.

## Steps

### S1 — Favorites endpoints
- **Do:** Implement the favorites endpoints per the table; the list computes
  best_price_now and change_pct against price_at_add.
- **Touch:** backend controller, resource, routes, tests.
- **Done when:** feature test — favoriting stores the current best price and
  the list computes the change correctly after a price update.

### S2 — Alerts endpoints
- **Do:** Implement the alerts endpoints per the table, including the
  re-arming rule on PUT.
- **Touch:** backend controller, routes, tests.
- **Done when:** feature test — upsert works; editing a triggered alert
  clears triggered_at.

### S3 — Alert pipeline
- **Do:** A queued listener on PriceChanged: when a product's new best
  available price is ≤ an active, un-triggered alert's threshold → send a
  PriceAlertTriggered notification (mail + database channels): «انخفض سعر
  {product} إلى {price} ر.س — تحت حدّك {threshold}» with a product link; set
  triggered_at. Also notify favorites owners on drops ≥ 5%, throttled to one
  notification per product per user per day. RTL HTML mail template (green
  header, Mono prices) visible in Mailpit.
- **Touch:** backend listener, notifications, mail template, tests.
- **Done when:** test — a drop below threshold queues exactly one
  notification and sets triggered_at; a second drop does not re-notify until
  re-armed; the ≥5% favorites digest throttles correctly.

### S4 — Product-page alert box wiring
- **Do:** Replace the phase-08 stub with real calls: create/update the alert,
  show the active state with toggle, guest redirect preserving intent, 422
  errors surfaced inline.
- **Touch:** `frontend/src/app/product/[slug]/` alert component,
  `frontend/src/lib/api.ts` wrappers.
- **Done when:** creating an alert from the product page as the demo user
  round-trips and survives refresh.

### S5 — Favorites wiring + guest merge
- **Do:** Point the favorites store's API interface (phase 06) at the real
  endpoints; implement merge-on-login: local guest favorites are POSTed after
  authentication, then local storage is cleared.
- **Touch:** `frontend/src/stores/favorites.ts`, session login flow.
- **Done when:** hearts set as guest appear in the account favorites after
  logging in.

### S6 — Account tabs on live data
- **Do:** المفضلة tab (`app/account/favorites/`): card grid with «عند
  الإضافة: {n}» vs «الآن: {n}» and green ▼ / red ▲ arrows; remove; empty
  state «لسّه ما تابعت أي جوال…» + «تصفّح الأكثر انخفاضًا» button to
  /search?sort=biggest_drop. تنبيهات السعر tab (`app/account/alerts/`): table
  المنتج | الحد المطلوب | السعر الحالي | الفارق | toggle; met rows get
  green-tint + «تحقق ✓» badge; inline Mono threshold edit.
- **Touch:** `frontend/src/app/account/favorites/*`,
  `frontend/src/app/account/alerts/*`.
- **Done when:** the seeded met alert renders as a green-tint ✓ row; inline
  edit persists.

### S7 — Navbar bell
- **Do:** Unread database-notification count on the navbar bell + dropdown
  list, mark-read on open; backed by a small notifications endpoint pair
  (list + mark-read) under /api/account.
- **Touch:** backend notification endpoints, `frontend/src/components/Navbar.tsx`.
- **Done when:** lowering a price in tinker below the demo user's threshold
  increments the bell badge and shows the notification; the alert email is in
  Mailpit.

## Phase acceptance
- End-to-end: create an alert on the product page → drop the price in tinker
  → Mailpit email + bell notification + green-tint ✓ row in the alerts tab;
  guest-favorite merge verified; all feature tests green.
