# Content Admin P0 Preflight

Date: 2026-07-26

## Findings

- Worktree: isolated task branch `t37-content-admin-db-api-t2`.
- Repo remote: `origin` is reachable for reading `main`; no push/deploy was attempted.
- Runtime: Node and npm are available locally.
- Dependencies: initial test command could not find `vitest` until dependencies were installed from the existing lockfile.
- Vercel static config: `vercel.json` exists and currently only contains the SPA rewrite to `/index.html`.
- Vercel project link: no local `.vercel/` project link is present in this worktree.
- Existing API routes before this slice: no `api/` directory was present.
- DB env: no `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `VERCEL_POSTGRES_URL`, `PGHOST`, `PGDATABASE`, `PGUSER`, or `PGPASSWORD` values were present in the local shell; no `.env*` files were present.
- Local Postgres CLI: `psql` was not installed.
- E2E dependencies: Playwright CLI is installed and can list the 3 configured E2E tests; browser execution remains to be smoke-tested after API changes.
- Vercel CLI: the latest CLI resolved, but `whoami` did not return within the bounded preflight window, so authenticated deploy readiness is unresolved.

## Blocker/Caveat Status

- **External DB blocker:** applying the migration/seed against a real Postgres database is blocked until a Postgres provider and connection env are supplied.
- **Deploy caveat:** production deploy cannot be verified from this worker because local Vercel project linking/authentication was not confirmed and deploy/push were out of scope.
- **Provider-light path:** implementation continues with SQL migration, generated seed data, and public read API boundaries that can run on Vercel Functions with a standard Postgres connection string.

## 2026-07-27 Environment Gate Refresh

This refresh was run by `dylan-t2-codex` for #t31 / #t40 after the implementation baseline became shareable as `origin/t37-content-admin-db-api-t2` and the runtime-provider merge baseline was reported as `t39-runtime-provider-foundation-merge` / `fac4e53`.

### Verified locally

- **Shared DB/API foundation ref is reachable:** `git ls-remote --heads origin t37-content-admin-db-api-t2` returned `b073e99`.
- **Local worktree baseline is clean:** branch `t40-content-admin-env-preflight` was created from `b073e99`.
- **DB/API artifacts exist:** `api/content/course.ts`, `api/content/lessons/[lessonId].ts`, `db/migrations/0001_content_admin.sql`, and `db/seeds/0001_initial_content_admin.sql` are present.
- **Postgres client package is installed:** `package.json`, `package-lock.json`, and local `node_modules` all contain `pg@8.22.0`.
- **Runtime tools present locally:** Node `v24.15.0` and npm `11.12.1` are available.
- **Vercel SPA rewrite is not itself proof of API breakage:** current Vercel docs state that filesystem entries take precedence before rewrites, so the existing catch-all SPA rewrite should still require a deployed API smoke rather than being treated as a code-level blocker by itself.

### Caveats / blockers

- **Environment blocker — no Postgres connection is present in this shell:** `DATABASE_URL`, `POSTGRES_URL`, `VERCEL_POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `PGHOST`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` were all missing. Real migration/seed cannot be executed from this worker until a provider/env is supplied.
- **Environment blocker — local PostgreSQL CLI is missing:** `psql` is not installed, so SQL cannot be applied with the standard CLI from this runtime even if a connection string is later provided. A Node-based migration runner or installing `psql` are viable alternatives.
- **Deploy/auth caveat — no local Vercel project link is present:** `.vercel/project.json` is missing.
- **Deploy/auth caveat — Vercel auth is unresolved:** no installed `vercel` CLI was found, and bounded `npx --yes vercel@latest whoami` timed out without producing a usable authenticated result.
- **Production smoke blocker — no production URL/env is present:** `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, and `VERCEL_TOKEN` were missing locally, so production API smoke could not be run from this worker.
- **Latest runtime-provider branch is not yet reachable on `origin`:** `git ls-remote --heads origin t39-runtime-provider-foundation-merge` returned no remote head. This does not block the environment gate based on `b073e99`, but it means production deployment/smoke should use a pushed integration branch once the final implementation slice owner publishes one.

### Required owner / environment actions

1. Provide or link a real Postgres provider and inject the production/staging connection env through Vercel project settings or a secrets-safe runtime.
2. Choose the migration execution path:
   - install/use `psql`, or
   - add a bounded Node-based migration/seed runner that reads the existing SQL files and never logs the connection string.
3. Link/auth the Vercel project (`.vercel/project.json` + authenticated deploy path, or a least-privilege deploy hook).
4. Run real migration + seed against the target DB.
5. Deploy a pushed integration branch and smoke:
   - `GET /api/content/course`
   - `GET /api/content/lessons/<known-lesson-id>`
   - one learner route that uses runtime fallback.

## Official Docs Consulted

- Vercel Functions: https://vercel.com/docs/functions
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Vercel routing overview: https://vercel.com/docs/routing
- Vercel project configuration / `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json
