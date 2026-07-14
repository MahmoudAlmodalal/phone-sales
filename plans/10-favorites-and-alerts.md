# Phase 10 — Favorites & Price Alerts

**Goal:** SRS User features: favorites list with "then vs now" value, price-drop
alerts with thresholds, triggered automatically by the price-change pipeline.

**Prerequisites:** Phases 04 (auth), 05 (PriceChanged event exists via observer — phase 02).

## API (auth: user)

| Endpoint | Behavior |
|---|---|
| GET `/api/account/favorites` | cards + `price_at_add`, `best_price_now`, `change_pct` |
| POST `/api/account/favorites` `{product_id}` | stores current best price as `price_at_add` |
| DELETE `/api/account/favorites/{product}` | |
| GET `/api/account/alerts` | rows: product, threshold, current best, diff, is_active, triggered_at |
| POST `/api/account/alerts` `{product_id, threshold}` | upsert (unique user+product); validates threshold > 0 |
| PUT `/api/account/alerts/{alert}` `{threshold?, is_active?}` | |
| DELETE `/api/account/alerts/{alert}` | |

## Alert pipeline (backend)
- [ ] `PriceChanged` event (from `ProductPriceObserver`) → queued listener
      `CheckPriceAlerts`: if new **best available price** for the product ≤ any active
      alert threshold (and not already `triggered_at` since last reset) →
      `PriceAlertTriggered` notification (mail + database channels):
      «انخفض سعر {product} إلى {price} ر.س — تحت حدّك {threshold}» + product link.
      Set `triggered_at`; alert stays visible as "تحقق ✓" until user edits/reactivates.
- [ ] Also notify favorites owners on drops ≥ 5% (digest-friendly: throttle 1/product/day/user).
- [ ] Mail template: simple RTL HTML (green header, Mono prices) — visible in Mailpit.

## Frontend
- [ ] Product page alert box (phase 08 stub) fully wired: create/update, active state
      with toggle, guest → login redirect preserving intent.
- [ ] ♡ on ProductCard/product page: optimistic; guest hearts stored locally and
      merged after login (phase 06 store).
- [ ] Account **المفضلة** tab: card grid; each card shows «عند الإضافة: ١,٢٩٩» vs
      «الآن: ١,١٥٠» with green ▼ / red ▲ arrow ("بيشوف إذا انتظاره كان مربحًا" — brief §2.6);
      remove button; empty state: «لسّه ما تابعت أي جوال. تابع واحدًا ومنخبرك أول ما
      ينزل سعره.» + «تصفّح الأكثر انخفاضًا» button.
- [ ] Account **تنبيهات السعر** tab: table المنتج | الحد المطلوب | السعر الحالي |
      الفارق | مفتاح تشغيل; rows meeting threshold get `green-tint` + «تحقق ✓» badge;
      inline threshold edit (Mono input).
- [ ] Navbar bell: unread database-notifications count + dropdown list (mark-read on open).

## Tests
- [ ] Price drop below threshold → notification queued once, `triggered_at` set;
      second drop doesn't re-notify until reactivated.
- [ ] Favorite stores `price_at_add`; listing computes change correctly.
- [ ] Guest merge: local favorites synced on login.

## Definition of Done
- [ ] Seeded "met" alert renders green-tint ✓ row; new alert from product page works end-to-end.
- [ ] Lower a price in tinker → Mailpit shows the RTL alert email; bell badge increments.
