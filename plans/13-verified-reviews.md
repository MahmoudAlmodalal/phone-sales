# Phase 13 — Verified Store Reviews (SRS §5)

**Goal:** store reviews gated on a completed booking (one per booking), moderated by
admin, displayed as number+bar (never stars) with the red-star «موثّق» badge.

**Prerequisites:** Phase 11 (completed bookings exist).

## Rules
- Review target = **the store** (SRS: «تقييم المتاجر والمعارض»), keyed `booking_id` unique.
- Eligibility: booking `status=completed` (vendor pressed «تم الاستلام») and no review yet.
- New reviews start `pending`; only `approved` are public and counted in aggregates.

## API

| Endpoint | Notes |
|---|---|
| GET `/api/stores/{slug}/reviews?cursor=` | public, approved only: rating, body, reviewer first name, «تمّ الاستلام في {date}» from the booking, verified badge flag |
| GET `/api/account/reviewables` | user's completed bookings without a review (drives "قيّم" CTAs) |
| POST `/api/account/reviews` `{booking_id, rating 1–5, body?}` | validates eligibility via `ReviewPolicy`; → pending |
| PUT `/api/account/reviews/{id}` | only while pending |
| Admin: GET `/api/admin/reviews?status=pending` | each item includes the linked booking evidence (number, product, dates) — brief §2.8 |
| Admin: POST `/api/admin/reviews/{id}/approve` / `/reject` `{reason?}` | approve → recompute store aggregate |

- [ ] `StoreRatingService::recompute(store)` → `rating_avg` (2dp), `rating_count`
      from approved reviews; called on approve/reject/delete.

## Frontend
- [ ] **Write flow**: account «حجوزاتي» completed cards + «تقييماتي» tab show
      «قيّم المتجر» → modal: rating selector as **5 segment buttons 1–5**
      (NOT stars — brief), textarea, submit → «سيظهر تقييمك بعد المراجعة» toast.
- [ ] «تقييماتي» tab: list with status chips (قيد المراجعة / منشور / مرفوض + سبب).
- [ ] Display components (already stubbed phase 08): `RatingBar` header (`4.6` 40px
      Mono + bar + count), review rows with small solid red ★ + «موثّق» + receipt date;
      explainer line; store switcher on product page; full list on `/store/[slug]`.
- [ ] Admin moderation UI deferred to phase 18 (queue endpoint ready here).

## Tests
- [ ] User with active (not completed) booking cannot post (403).
- [ ] Second review on same booking → 422.
- [ ] Pending review invisible on public endpoints; approve → visible + aggregate updates.
- [ ] Aggregate math: seeded approvals produce expected avg/count.

## Definition of Done
- [ ] End-to-end in browser: vendor completes booking → user reviews → admin approves
      (via API/tinker until phase 18) → review shows on store page + product-page
      store row rating updates, with موثّق badge.
