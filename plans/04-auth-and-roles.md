# Phase 04 — Authentication, Roles & 2FA

**Goal:** Sanctum token auth with the 4-tier role model (guest = unauthenticated),
vendor sign-up with admin approval, role middleware/policies, login rate limiting,
and TOTP 2FA for sensitive roles (SRS §8).

**Prerequisites:** Phase 02.

## API endpoints (`routes/api.php`)

| Method & path | Body | Response / behavior |
|---|---|---|
| POST `/auth/register` | name, email, password(+confirm), phone? | creates `role=user`, returns `{data:{user, token}}` |
| POST `/auth/register-vendor` | + store_name, city, phone | creates `role=vendor, status=pending` + pending `stores` row; **no token** until approved; returns 202 with explanatory Arabic message |
| POST `/auth/login` | email, password, otp? | rate-limited 5/min/IP; on wrong creds → 422 `"البريد أو كلمة المرور غير صحيحة."` (never says which — brief §2.9); if user has confirmed 2FA and no/invalid `otp` → 409 `{data:{two_factor_required:true}}`; suspended/pending → 403 with reason |
| POST `/auth/logout` | — | revokes current token |
| GET `/auth/me` | — | `{data:{user incl. role, status, warning_flag, restricted_until, store?}}` |
| PUT `/auth/profile` | name, phone, avatar, language | |
| PUT `/auth/password` | current_password, password | |
| POST `/auth/2fa/enable` | — | returns secret + otpauth:// URI (QR on frontend) |
| POST `/auth/2fa/confirm` | otp | sets `two_factor_confirmed_at` |
| POST `/auth/2fa/disable` | password, otp | |

## Backend tasks
- [ ] `pragmarx/google2fa` package for TOTP; encrypt secret at rest.
- [ ] `EnsureRole` middleware (`role:admin`, `role:vendor,admin`) + route groups:
      `/api/account/*` (auth), `/api/vendor/*` (vendor whose store `is_verified`),
      `/api/admin/*` (admin, **2FA confirmed required** — enforce in middleware).
- [ ] Policies: `StorePolicy` (vendor owns store), `BookingPolicy`, `ReviewPolicy`,
      `TicketPolicy` — registered and used with `authorize()` everywhere.
- [ ] Rate limiting: `RateLimiter::for('login', 5/min by ip+email)`; log each failed
      login and each rate-limit hit into `security_events` (type login_failed /
      rate_limited) — consumed by the admin security log (phase 18).
- [ ] Password rules: `Password::min(8)->mixedCase()->numbers()` (Bcrypt is Laravel default — SRS §8).
- [ ] Admin approval endpoint stub `POST /admin/vendors/{user}/approve` → sets user
      `active` + store `is_verified` (full UI in phase 18).

## Frontend tasks
- [ ] `/login` page ported from `design-reference/as3ar-app/src/pages/Auth.jsx`, per
      brief §2.9: split screen — left: three slow-moving flag bands + 3 red stars,
      no marketing copy; right: form (48px fields, labels above, wide green button,
      separate underlined "تسجيل كبائع" link). Tabs: دخول / تسجيل / تسجيل كبائع.
- [ ] Next.js route handler `POST /api/session`: forwards login to Laravel, stores the
      returned token in an **httpOnly secure cookie**; `DELETE` clears it. Server
      components/API calls read the cookie and attach `Authorization: Bearer`.
- [ ] `middleware.ts`: guard `/account/**` (any auth), `/vendor/**` (vendor),
      `/admin/**` (admin) — redirect to `/login?next=…` (preserves destination, like
      the prototype's `ProtectedRoute`).
- [ ] 2FA screens: enable (QR + confirm code) inside account settings; OTP step on
      login when 409 received.
- [ ] Navbar auth state: guest → "دخول" button; authed → name menu (حسابي/لوحتي/خروج)
      — replaces the prototype's `DevRoleSwitcher` (delete it; do not port).

## Tests (Pest)
- [ ] register/login/logout happy paths; wrong password → generic Arabic message.
- [ ] 6th login attempt in a minute → 429 + `security_events` row.
- [ ] pending vendor cannot login; approved vendor can.
- [ ] user token cannot hit `/api/admin/*` (403); admin without 2FA confirmed → 403.
- [ ] 2FA: enable → confirm with valid TOTP → login requires otp.

## Definition of Done
- [ ] All endpoints above implemented + tests green.
- [ ] Login page pixel-matches brief §2.9 (bands animate, stop under `prefers-reduced-motion`).
- [ ] Cookie flow works: login in browser → refresh → `/account` accessible; logout → redirected.
