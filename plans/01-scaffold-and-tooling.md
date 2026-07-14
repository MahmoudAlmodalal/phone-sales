# Phase 01 — Scaffold & Tooling

**Goal:** empty directory → running Laravel API + Next.js app + Postgres + Mailpit,
with design tokens installed and a healthcheck proving the frontend can reach the backend.

**Prerequisites:** PHP 8.3+, Composer, Node 20+, Docker. Phase 00 read.

## Tasks

### 1. Infrastructure
- [ ] Create `docker-compose.yml` at repo root:
  ```yaml
  services:
    db:
      image: postgres:16
      environment: { POSTGRES_DB: as3ar, POSTGRES_USER: as3ar, POSTGRES_PASSWORD: secret }
      ports: ["5432:5432"]
      volumes: [dbdata:/var/lib/postgresql/data]
    mailpit:
      image: axllent/mailpit
      ports: ["1025:1025", "8025:8025"]
  volumes: { dbdata: }
  ```
- [ ] `docker compose up -d`; verify `psql` connects.

### 2. Backend scaffold
- [ ] `composer create-project laravel/laravel backend`
- [ ] `.env`: `DB_CONNECTION=pgsql`, host/db/user per compose; `MAIL_MAILER=smtp`,
      `MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025`; `QUEUE_CONNECTION=database`;
      `APP_LOCALE=ar`, `APP_TIMEZONE=Asia/Riyadh`; `FRONTEND_URL=http://localhost:3000`.
- [ ] `php artisan install:api` (installs Sanctum, creates `routes/api.php`).
- [ ] CORS (`config/cors.php`): allow `FRONTEND_URL`, `supports_credentials => true`.
- [ ] Create `config/platform.php` with the values from `00-overview.md §6`.
- [ ] Healthcheck route in `routes/api.php`:
      `GET /api/health` → `{ data: { status: 'ok', time: now() } }`.
- [ ] `php artisan migrate` (framework tables) + `php artisan queue:table` if missing.

### 3. Frontend scaffold
- [ ] `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --no-eslint-strict` (accept defaults otherwise).
- [ ] `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`, `API_URL=http://localhost:8000/api`.
- [ ] Root layout `src/app/layout.tsx`: `<html lang="ar" dir="rtl">`; load fonts via
      `next/font/google`: **Tajawal** (700, 800), **IBM Plex Sans Arabic** (400, 500),
      **IBM Plex Mono** (500) — expose as CSS vars `--font-heading`, `--font-sans`, `--font-mono`.
- [ ] Tailwind config: copy the token palette from
      `design-reference/as3ar-app/tailwind.config.js` (colors green/green-deep/green-tint/
      ink/paper/surface/line/muted/star/star-tint; fontFamily heading/sans/mono mapped to the vars).
- [ ] Copy base CSS from `design-reference/as3ar-app/src/index.css`
      (focus ring, selection color, body background `surface`) into `globals.css`,
      adapted to Tailwind v4/postcss as scaffolded.
- [ ] `npm i zustand` (client state for compare/favorites later).
- [ ] Test page `src/app/page.tsx`: server component fetching `${API_URL}/health`
      and rendering the status + an Arabic heading in Tajawal to eyeball fonts/RTL.

### 4. Repo hygiene
- [ ] Root `.gitignore`: `node_modules/`, `vendor/`, `.env*`, `.next/`, `dbdata`.
- [ ] Root `README.md`: 10-line quickstart (copy §8 of `00-overview.md`).
- [ ] Commit: `chore(01): scaffold laravel + next + docker`.

## Files created
`docker-compose.yml`, `backend/**` (Laravel), `frontend/**` (Next), root `README.md`, `.gitignore`.

## Definition of Done
- [ ] `docker compose ps` shows db + mailpit healthy.
- [ ] `curl localhost:8000/api/health` returns `{"data":{"status":"ok",…}}`.
- [ ] `localhost:3000` renders Arabic RTL page showing backend status "ok",
      Tajawal headings visible, focus ring green on Tab.
- [ ] `php artisan test` passes (default tests).

## Verification
```bash
docker compose up -d && curl -s localhost:8000/api/health | jq .
cd frontend && npm run dev   # open http://localhost:3000 — check RTL + fonts + status ok
```
