# Phase 13 — Verified Store Reviews (SRS §5)

**Goal:** store reviews gated on a completed booking (one per booking),
moderated by admin, displayed as number + bar (never stars) with the red-star
«موثّق» badge.

**Depends on:** 11 (completed bookings exist).

**Produces:** review endpoints, StoreRatingService, write-flow UI, admin
moderation endpoints (queue UI in 18).

## Rules

- Review target = the STORE (SRS: تقييم المتاجر والمعارض), keyed by a unique
  booking_id.
- Eligibility: booking status = completed (vendor pressed «تم الاستلام») and
  no review yet — enforced by ReviewPolicy.
- New reviews start pending; only approved ones are public and counted.
- Rejection stores rejection_reason (column added in phase 02) — shown to the
  author in «تقييماتي».

## API contracts

| Endpoint | Notes |
|---|---|
| GET /api/stores/{slug}/reviews?cursor= | public, approved only: rating, body, reviewer first name, «تمّ الاستلام في {date}» from the booking, verified flag |
| GET /api/account/reviewables | user's completed bookings without a review (drives «قيّم» CTAs) |
| POST /api/account/reviews {booking_id, rating 1–5, body?} | eligibility via ReviewPolicy → pending |
| PUT /api/account/reviews/{id} | only while pending |
| GET /api/admin/reviews?status=pending | each item includes the linked booking evidence (number, product, dates) — brief §2.8 |
| POST /api/admin/reviews/{id}/approve · /reject {reason?} | approve/reject → recompute store aggregate; reject stores rejection_reason |

## Steps

### S1 — Public + user endpoints
- **Do:** Implement the store reviews list, reviewables, create, and
  update-while-pending endpoints with ReviewPolicy enforcement.
- **Touch:** backend controllers, policy, routes, tests.
- **Done when:** tests — active (not completed) booking cannot post (403);
  second review on the same booking fails (422); pending reviews are
  invisible publicly.

### S2 — Moderation endpoints + aggregates
- **Do:** Admin list/approve/reject endpoints per the table. A
  StoreRatingService recomputing rating_avg (2dp) and rating_count from
  approved reviews, called on approve/reject/delete.
- **Touch:** backend controllers, `backend/app/Services/StoreRatingService.php`,
  tests.
- **Done when:** approving a seeded pending review makes it public and the
  store aggregate matches a manual recomputation; reject stores the reason.

### S3 — Write-flow UI
- **Do:** In the account area: completed booking cards (حجوزاتي) and the
  «تقييماتي» tab surface «قيّم المتجر» → a modal with the rating selector as
  five SEGMENT BUTTONS 1–5 (never stars — brief), a textarea, and submit →
  toast «سيظهر تقييمك بعد المراجعة».
- **Touch:** `frontend/src/app/account/**` (bookings + a new reviews tab),
  review modal component.
- **Done when:** the demo user can review a seeded completed booking; the
  new review shows as قيد المراجعة.

### S4 — «تقييماتي» status list
- **Do:** The reviews tab lists the user's reviews with status chips (قيد
  المراجعة / منشور / مرفوض + the rejection reason), and edit while pending.
- **Touch:** `frontend/src/app/account/reviews/*` (new route; the account
  layout gains the tab — phase 14 owns the final tab list).
- **Done when:** the three status states render from seeded data, including
  a rejection reason.

### S5 — Display verification
- **Do:** Confirm the phase-08 display sections (product-page reviews with
  store switcher, store-page list, RatingBar aggregates) now reflect
  moderation: approve in the admin API (or tinker until phase 18) → visible
  with the موثّق badge; store row rating updates.
- **Touch:** verification only (fix display bugs if found).
- **Done when:** end-to-end in the browser: vendor completes a booking →
  user reviews → approve → review appears on the store page and the
  product-page store row updates.

## Phase acceptance
- All tests green; the full complete→review→moderate→display loop verified;
  ratings everywhere shown as number + bar + count, star only in the موثّق
  badge.
