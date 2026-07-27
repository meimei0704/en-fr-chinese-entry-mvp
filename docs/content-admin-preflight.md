# Content Admin P0 Preflight

Date: 2026-07-26

> **Current DB decision (2026-07-27):** the product requirement is **MySQL, not PostgreSQL**. PostgreSQL / `pg` / `psql` notes below are preserved as historical preflight evidence only and are superseded for final #t31 execution.

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

## 2026-07-27 PostgreSQL Environment Gate Refresh (superseded)

This refresh was run by `dylan-t2-codex` for #t31 / #t40 after the implementation baseline became shareable as `origin/t37-content-admin-db-api-t2` and the runtime-provider merge baseline was reported as `t39-runtime-provider-foundation-merge` / `fac4e53`.

> Superseded: later on 2026-07-27, the user clarified that the database must be MySQL and not PG. Use the MySQL refresh below as the current gate.

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

## 2026-07-27 MySQL Environment Gate Refresh

This refresh supersedes the PostgreSQL gate. It does not claim the current DB implementation is MySQL-ready; it records the affected surface area and the secrets-safe local preflight result for the new MySQL requirement.

### Verified locally

- **Worktree state:** `t40-content-admin-env-preflight` is clean at `6fc2316` before this MySQL update.
- **MySQL CLI is available locally:** `mysql Ver 8.0.18 for osx10.14 on x86_64 (Homebrew)`.
- **Node/npm remain available locally:** Node `v24.15.0`, npm `11.12.1`.
- **Vercel project link remains absent:** `.vercel/project.json` is still missing.
- **No local `.env*` files are present** in this worktree.
- **Existing migration/seed artifacts are present but PG-specific:** `db/migrations/0001_content_admin.sql` and `db/seeds/0001_initial_content_admin.sql` exist, but they use PostgreSQL syntax and must be ported before any MySQL apply step.

### MySQL-specific blockers / caveats

- **Implementation blocker — current DB foundation is PostgreSQL-specific:** current code still references `pg`, `ContentPostgresRepository`, `$1`-style query placeholders, `POSTGRES_*` env names, `jsonb`, `timestamptz`, `bigserial`, `::jsonb`, `::timestamptz`, PL/pgSQL trigger functions, and PostgreSQL `drop trigger ... on ...` syntax. This foundation can be used as a data-model reference only, not as final MySQL code.
- **Dependency blocker — no MySQL Node driver is installed:** `package.json` / `package-lock.json` do not contain `mysql2` or `mysql`; they still contain `pg`.
- **Environment blocker — no MySQL connection env is present in this shell:** `DATABASE_URL`, `MYSQL_URL`, `MYSQL_DATABASE_URL`, `PLANETSCALE_DATABASE_URL`, `JAWSDB_URL`, `CLEARDB_DATABASE_URL`, `MYSQLHOST`, `MYSQL_HOST`, `MYSQLPORT`, `MYSQL_PORT`, `MYSQLDATABASE`, `MYSQL_DATABASE`, `MYSQLUSER`, `MYSQL_USER`, `MYSQLPASSWORD`, and `MYSQL_PASSWORD` were all missing.
- **Deploy/auth caveat — Vercel auth is still unresolved:** no installed `vercel` CLI was found, and bounded `npx --yes vercel@latest whoami` timed out without a usable authenticated result.
- **Production smoke blocker — no production URL/env is present:** `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, and `VERCEL_TOKEN` were missing locally, so production API smoke cannot be run from this worker.

### MySQL impact assessment / migration slice

1. **Driver/env layer:** replace `pg` / `@types/pg` with a MySQL driver such as `mysql2`; rename repository classes and missing-env errors away from Postgres; support the chosen MySQL env contract (`DATABASE_URL` if it is a MySQL URL, or `MYSQL_*` fields).
2. **Query adapter:** replace PostgreSQL `$1` placeholder rendering with MySQL `?` placeholders and confirm returned row shapes from the chosen driver.
3. **Schema DDL:** port `jsonb` to MySQL `json`, `timestamptz` to `timestamp`/`datetime`, `bigserial` to `bigint auto_increment`, boolean/defaults/checks/index syntax as needed, and trigger definitions to MySQL `delimiter` / `before update` / `before delete` syntax.
4. **Seed SQL:** remove PostgreSQL casts (`::jsonb`, `::timestamptz`), ensure JSON strings are valid for MySQL `json`, and keep the existing draft/published pair semantics.
5. **Invariant tests:** keep the same business gates after the port: public API reads only `published`; draft is never returned by public endpoints; rollback creates a new `published` revision; historical revision rows remain immutable.
6. **Environment gate:** once a MySQL provider/env is supplied, run MySQL migration + seed against the target DB, deploy a pushed integration branch, then smoke `GET /api/content/course`, `GET /api/content/lessons/<known-lesson-id>`, and one learner route using runtime fallback.

### Required owner / environment actions under MySQL

1. Pick/provide the target MySQL provider and connection injection path for Vercel.
2. Confirm whether app code should consume one MySQL URL (`DATABASE_URL` / `MYSQL_URL`) or discrete `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` variables.
3. Approve the Node driver choice (recommended default for a lightweight Vercel Functions implementation: `mysql2`).
4. Keep DB-backed implementation paused for MySQL port/review; DB-agnostic slices can continue.
5. After the MySQL port lands, run real migration + seed and production API smoke with secrets-safe output only.

## 2026-07-27 MySQL Provider / Runner Update

The user confirmed the provider as PingCAP/Pingkai MySQL-compatible cloud service and provided a temporary test URL in the thread. The full URL included credentials, so it must be treated as exposed secret material and must not be copied into code, docs, checkpoints, or logs.

### Current non-secret execution assumptions

- **Provider/protocol:** PingCAP/Pingkai MySQL-compatible service.
- **Runtime env name:** prefer `MYSQL_DATABASE_URL`; `MYSQL_URL` and `DATABASE_URL` remain fallback names in code for portability.
- **Runner path:** Node migration runner using `mysql2`.
- **Apply order:** `db/migrations/0001_content_admin.sql` then `db/seeds/0001_initial_content_admin.sql`.
- **Command:** `npm run content:mysql:apply` with `MYSQL_DATABASE_URL` supplied by a secrets-safe environment.

### Updated verified state

- `mysql2` is now the Node database driver dependency; `pg` / `@types/pg` were removed.
- `ContentMysqlRepository` reads only `current_published_revision_id` and preserves the published-only public API boundary.
- The SQL query adapter now renders MySQL `?` placeholders.
- The migration and generated seed SQL have been ported away from PostgreSQL-only casts/types.
- The migration uses MySQL/TiDB-compatible table constraints and composite foreign keys for published/draft pointer integrity instead of PostgreSQL triggers.
- The runner redacts database URLs before logging.

### Remaining blockers / caveats

- **Credential caveat:** the temporary test credential posted in-thread should be rotated after this task, and preferably before any shared production/pre-production deployment.
- **Database target blocker:** the initially supplied URL targeted a system/default database. Do not apply content-admin DDL there. Create/use a dedicated content-admin application/test database or schema with least-privilege credentials.
- **Safe env injection blocker:** the final/rotated connection string still needs to be injected through a local `.env`, Vercel Project Environment Variables, or another secure channel as `MYSQL_DATABASE_URL`.
- **Deploy/auth caveat:** Vercel project link/auth or a deploy hook is still needed before production smoke.
- **Production smoke blocker:** production URL/token is still needed for deployed API smoke.

## Official Docs Consulted

- Vercel Functions: https://vercel.com/docs/functions
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Vercel routing overview: https://vercel.com/docs/routing
- Vercel project configuration / `vercel.json`: https://vercel.com/docs/project-configuration/vercel-json
