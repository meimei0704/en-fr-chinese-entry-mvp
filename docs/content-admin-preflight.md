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

## Official Docs Consulted

- Vercel Functions: https://vercel.com/docs/functions
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Vercel routing overview: https://vercel.com/docs/routing
