# Phase 01 — Backend Scaffold & Infrastructure

**Goal:** Docker infra (Postgres 16 + Mailpit), a fresh Laravel 12 API in
`backend/`, platform config, health endpoint, CORS — and the existing frontend
verified to reach the backend. The frontend itself is NOT scaffolded here (it
already exists — see 00 §2).

**Depends on:** — (requires PHP 8.3+, Composer, Node 20+, Docker installed).

**Produces:** `docker-compose.yml`, `backend/` (Laravel), `backend/config/platform.php`,
GET /api/health, updated root README/.gitignore.

## Context for the agent

- `frontend/` is complete and untouched in this phase except one health-check step.
- Env contract: frontend reads NEXT_PUBLIC_API_URL (client) and API_URL (server),
  both http://localhost:8000/api in dev.

## Steps

### S1 — Docker infrastructure
- **Do:** Create a compose file at the repo root with two services: a
  postgres:16 container (database as3ar, user as3ar, password secret, port 5432,
  named volume for data) and a Mailpit container (SMTP 1025, web UI 8025).
  Start it.
- **Touch:** `docker-compose.yml`.
- **Done when:** `docker compose ps` shows both containers running and a psql
  connection to as3ar@localhost:5432 succeeds.

### S2 — Laravel scaffold
- **Do:** Create a new Laravel 12 project in `backend/` via Composer. Configure
  `.env`: pgsql connection matching S1; SMTP mail to Mailpit (host 127.0.0.1,
  port 1025); database queue driver; app locale ar; timezone Asia/Riyadh;
  FRONTEND_URL=http://localhost:3000. Run the API install command (installs
  Sanctum and creates the API routes file). Run the framework migrations and
  ensure the jobs/queue tables exist.
- **Touch:** `backend/**`.
- **Done when:** `php artisan migrate` completes cleanly against Postgres and
  `php artisan test` passes the default suite.

### S3 — CORS + platform config
- **Do:** Configure CORS to allow FRONTEND_URL with credentials support. Create
  `backend/config/platform.php` holding exactly the keys and values from
  00 §6 (booking.*, fraud.*, compare.*, prices.*).
- **Touch:** `backend/config/cors.php`, `backend/config/platform.php`.
- **Done when:** `php artisan tinker` prints 24 for the booking.hold_hours
  config key, and an OPTIONS preflight from origin localhost:3000 to the API
  returns the allow-origin header.

### S4 — Health endpoint
- **Do:** Add GET /api/health returning the standard envelope with status "ok"
  and the server time.
- **Touch:** `backend/routes/api.php`.
- **Done when:** curl to localhost:8000/api/health returns a JSON body whose
  data.status equals "ok".

### S5 — Frontend connectivity check
- **Do:** Add `.env.local` in `frontend/` with NEXT_PUBLIC_API_URL and API_URL
  pointing at the backend. In `frontend/src/lib/api.ts`, ensure the base URL
  comes from those env vars (adjust if it is currently hardcoded or absent) and
  add a small fetch helper for /health. Surface the backend status on the
  kitchen-sink dev page (`src/app/dev/kitchen-sink/`) — do not change any
  public page.
- **Touch:** `frontend/.env.local`, `frontend/src/lib/api.ts`,
  `frontend/src/app/dev/kitchen-sink/**`.
- **Done when:** with both servers running, the kitchen-sink page shows the
  backend health status "ok"; `npm run build` in `frontend/` passes.

### S6 — Repo hygiene
- **Do:** Extend the root `.gitignore` for backend artifacts (vendor/, backend
  .env files) and the Docker data volume. Update the root README with the
  10-line quickstart from 00 §9.
- **Touch:** `.gitignore`, `README.md`.
- **Done when:** `git status` shows no vendor/ or env files as untracked; the
  README quickstart matches 00 §9.

## Phase acceptance
- `docker compose ps` healthy; /api/health returns ok; kitchen-sink page shows
  backend status; default backend tests green; commit history has one commit
  per step.
