# Phase 19 — Support Tickets (SRS §5: الدعم الفني والتبليغ)

**Goal:** built-in ticketing so users and vendors report bugs/issues; admin
queue with assignment; email notifications on replies. Tables exist from
phase 02 S5; the admin queue UI lands in phase 18 S5 — this phase delivers
the API and the user/vendor UI.

**Depends on:** 04 (roles).

**Produces:** ticket endpoints, الدعم tabs in account and vendor dashboards.

## API contracts

| Endpoint | Who | Notes |
|---|---|---|
| GET /api/account/tickets | user/vendor | own tickets + unread flag |
| POST /api/account/tickets | user/vendor | subject, category (bug/billing/store/other), priority, body, attachments (≤3, image/pdf, ≤2MB each) → creates ticket + first message |
| GET /api/account/tickets/{id} | owner | thread; marks read |
| POST /api/account/tickets/{id}/messages | owner | reply flips answered → open |
| POST /api/account/tickets/{id}/close | owner | |
| GET /api/admin/tickets?status=&category=&assigned= | admin | queue, oldest-open first |
| POST /api/admin/tickets/{id}/messages | admin | sets answered, emails owner |
| POST /api/admin/tickets/{id}/assign {admin_id} · /close | admin | |

Notifications: owner gets mail + database on an admin reply («تم الرد على
تذكرتك #{id}»); admins get a database notification on new ticket or reopen.

## Steps

### S1 — Owner endpoints
- **Do:** Implement the account ticket endpoints with TicketPolicy
  (owner-only), attachment validation (type/size/count), and the state
  machine open → answered → (owner reply) open → closed.
- **Touch:** backend controllers, policy, FormRequests, tests.
- **Done when:** tests — a stranger gets 403; a vendor sees only their own;
  an oversized or wrong-type attachment is rejected; the state transitions
  hold.

### S2 — Admin endpoints + notifications
- **Do:** Implement the admin queue (oldest-open first), reply (sets
  answered + owner mail), assign, close, and both notification directions.
- **Touch:** backend controllers, notifications, tests.
- **Done when:** an admin reply dispatches the owner notification (visible
  in Mailpit) and flips the status.

### S3 — Account/vendor الدعم tab
- **Do:** Fill the الدعم tab (slot added in phase 14; add the same tab to the
  vendor layout): ticket list with status chips (مفتوحة / تم الرد / مغلقة),
  new-ticket form with attachments, thread view (chat-like bubbles,
  attachments, reply box). Unread badge on the tab, integrated with the
  navbar bell (phase 10).
- **Touch:** `frontend/src/app/account/support/*`,
  `frontend/src/app/vendor/support/*` (+ vendor layout tab).
- **Done when:** filing a ticket with a screenshot works in the browser; the
  unread badge appears after an admin reply.

### S4 — Entry points
- **Do:** Footer link «الإبلاغ عن مشكلة» → the support tab (guests →
  login first with return).
- **Touch:** `frontend/src/components/Footer.tsx`.
- **Done when:** the guest path round-trips through login to the support
  form.

## Phase acceptance
- End-to-end: user files a ticket with a screenshot → admin answers (via
  API/tinker until 18 S5 lands) → user sees the unread badge, reads the
  reply, closes; Mailpit shows the reply email; all policy tests green.
