# Phase 04 — Authentication, Roles & 2FA

**Goal:** Sanctum token auth with the 4-tier role model (guest =
unauthenticated), vendor sign-up with admin approval, role middleware and
policies, login rate limiting, TOTP 2FA for sensitive roles (SRS §8) — wired
into the EXISTING frontend login page and session store.

**Depends on:** 02.

**Produces:** /api/auth/* endpoints, role middleware, policies, Next.js session
route handler + middleware guards, 2FA screens.

## Context for the agent

- Frontend already has: `src/app/login/page.tsx` (login UI per brief §2.9),
  `src/stores/session.ts` (currently mock), `src/components/RoleGuard.tsx`,
  `src/components/Navbar.tsx` (auth area). Wire these — do not rebuild them.
- Error contract for the 2FA challenge is defined in 00 §5: HTTP 422 with
  top-level code `two_factor_required` (NOT 409 — the old 409 contract was a
  bug; 409 is reserved for booking stock conflicts).

## API endpoints (routes/api.php)

| Method & path | Body | Behavior |
|---|---|---|
| POST /auth/register | name, email, password (+confirm), phone? | creates role=user; returns user + token |
| POST /auth/register-vendor | + store_name, city, phone | creates role=vendor status=pending + pending stores row; NO token until approved; 202 with explanatory Arabic message |
| POST /auth/login | email, password, otp? | rate-limited 5/min per ip+email; wrong creds → 422 «البريد أو كلمة المرور غير صحيحة.» (never says which — brief §2.9); confirmed-2FA user without valid otp → 422 code two_factor_required; suspended/pending → 403 with reason |
| POST /auth/logout | — | revokes current token |
| GET /auth/me | — | user incl. role, status, warning_flag, restricted_until, store (if vendor) |
| PUT /auth/profile | name, phone, avatar, language | |
| PUT /auth/password | current_password, password | |
| POST /auth/2fa/enable | — | returns secret + otpauth URI (frontend renders QR) |
| POST /auth/2fa/confirm | otp | sets two_factor_confirmed_at |
| POST /auth/2fa/disable | password, otp | |

## Steps

### S1 — Registration & login endpoints
- **Do:** Implement register, register-vendor, login, logout, me per the table.
  Password rules: min 8, mixed case, numbers (Bcrypt is the Laravel default —
  SRS §8). Login rate limiter 5/min keyed by ip+email; every failed login and
  every rate-limit hit writes a security_events row (login_failed /
  rate_limited).
- **Touch:** `backend/app/Http/Controllers/Api/Auth*`, `backend/routes/api.php`.
- **Done when:** curl happy paths work; 6th login attempt in a minute returns
  429 and a rate_limited security_events row exists.

### S2 — Roles, middleware, policies
- **Do:** EnsureRole middleware usable as role:admin or role:vendor,admin.
  Route groups: /api/account/* (any auth), /api/vendor/* (vendor whose store
  is_verified), /api/admin/* (admin AND 2FA confirmed — enforced in
  middleware). Policies: StorePolicy (vendor owns store), BookingPolicy,
  ReviewPolicy, TicketPolicy — registered now, used by later phases. Admin
  approval endpoint stub POST /admin/vendors/{user}/approve → sets user active
  + store is_verified (full UI in phase 18).
- **Touch:** `backend/app/Http/Middleware/*`, `backend/app/Policies/*`, routes.
- **Done when:** a user token gets 403 on /api/admin/*; an admin without
  confirmed 2FA gets 403; the approve stub flips a pending vendor to active.

### S3 — 2FA (TOTP)
- **Do:** Add a TOTP package (e.g. pragmarx/google2fa); encrypt the secret at
  rest. Implement enable/confirm/disable per the table and the login otp check
  (422 + code two_factor_required when missing/invalid).
- **Touch:** backend auth controllers, User model.
- **Done when:** feature test — enable → confirm with a valid TOTP → login now
  requires otp; invalid otp writes a 2fa_failed security_events row.

### S4 — Session bridge in Next.js
- **Do:** Route handler POST /api/session that forwards login to Laravel and
  stores the returned token in an httpOnly secure cookie (SameSite=Lax);
  DELETE clears it. Server components and server-side API calls read the
  cookie and attach the bearer header (extend `src/lib/api.ts`). Update
  `src/stores/session.ts` to hydrate from a GET /api/session that returns
  role/name/status from /auth/me — replacing its mock data.
- **Touch:** `frontend/src/app/api/session/route.ts`, `frontend/src/lib/api.ts`,
  `frontend/src/stores/session.ts`.
- **Done when:** logging in via the UI sets the cookie; a hard refresh keeps
  the session; logout clears it.

### S5 — Route guards & login page wiring
- **Do:** Next.js middleware guarding /account/** (any auth), /vendor/**
  (vendor), /admin/** (admin), redirecting to /login?next=… preserving the
  destination. Wire the existing login page tabs (دخول / تسجيل / تسجيل كبائع)
  to the real endpoints, including: generic wrong-credentials message, the
  pending-vendor 202 message, and an OTP step shown when the API returns code
  two_factor_required. Update Navbar auth area: guest → «دخول» button; authed →
  name menu (حسابي / لوحتي / خروج) driven by the real session.
- **Touch:** `frontend/src/middleware.ts`, `frontend/src/app/login/page.tsx`,
  `frontend/src/components/Navbar.tsx`, `frontend/src/components/RoleGuard.tsx`.
- **Done when:** guest hitting /account redirects to login and returns after
  auth; vendor cannot open /admin; the OTP step appears for a 2FA user.

### S6 — 2FA screens
- **Do:** Account-settings block: enable (QR from the otpauth URI + confirm
  code input), disable (password + otp). Reuse existing form styles from the
  account pages.
- **Touch:** `frontend/src/app/account/**`.
- **Done when:** enabling 2FA in the browser then logging out and in again
  requires the OTP.

### S7 — Backend test pass
- **Do:** Feature tests: register/login/logout happy paths; generic Arabic
  wrong-credentials message; 429 + security event on the 6th attempt; pending
  vendor cannot login, approved vendor can; role matrix on route groups; 2FA
  enable→confirm→login flow.
- **Touch:** `backend/tests/Feature/Auth*`.
- **Done when:** the auth test suite is green.

## Phase acceptance
- All endpoints implemented with tests green; cookie flow works in the
  browser (login → refresh → /account accessible → logout → redirected);
  Navbar reflects real roles; login page behaviors match brief §2.9 (bands
  animate, stop under prefers-reduced-motion).
