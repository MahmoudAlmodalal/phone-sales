# Phase 19 — Support Tickets (SRS §5: الدعم الفني والتبليغ)

**Goal:** built-in ticketing so users and vendors report bugs/issues; admin queue
with assignment; email notifications on replies.

**Prerequisites:** Phase 04 (roles). Tables from phase 02.

## API

| Endpoint | Who | Notes |
|---|---|---|
| GET `/api/account/tickets` | user/vendor | own tickets + unread flag |
| POST `/api/account/tickets` | user/vendor | `{subject, category: bug/billing/store/other, priority, body, attachments[]≤3 (img/pdf ≤2MB)}` → creates ticket + first message |
| GET `/api/account/tickets/{id}` | owner | thread; marks read |
| POST `/api/account/tickets/{id}/messages` | owner | reply reopens `answered`→`open` |
| POST `/api/account/tickets/{id}/close` | owner | |
| GET `/api/admin/tickets?status=&category=&assigned=` | admin | queue, oldest-open first |
| POST `/api/admin/tickets/{id}/messages` | admin | sets `answered`, emails owner |
| POST `/api/admin/tickets/{id}/assign` `{admin_id}` / `/close` | admin | |

Notifications: owner gets mail+database on admin reply («تم الرد على تذكرتك #١٤»);
admins get database notification on new ticket / reopen.

## UI
- [ ] User & vendor dashboards gain **الدعم** tab (`/account/support`, `/vendor/support`):
      ticket list (status chips: مفتوحة / تم الرد / مغلقة), new-ticket form,
      thread view (chat-like bubbles, attachments, reply box).
- [ ] Unread badge on the tab + navbar bell integration.
- [ ] Admin tab **التذاكر** in `/admin`: queue table (priority/status/category filters,
      assignee select), thread view with reply + close + assign; SLA hint
      (open > 48h rows tinted `star-tint`).
- [ ] Footer link «الإبلاغ عن مشكلة» → support tab (guests → login first).

## Tests
- [ ] Owner-only access (403 across users); vendor sees own only.
- [ ] Reply state machine: open → answered → (owner reply) open → closed.
- [ ] Attachment validation (type/size/count); notification dispatched on admin reply.

## Definition of Done
- [ ] User files a ticket with a screenshot → admin answers → user sees unread badge,
      reads reply, closes; Mailpit shows the reply email.
