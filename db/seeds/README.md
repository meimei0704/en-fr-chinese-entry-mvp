# Content Admin Seed

The initial seed is generated from the existing static `src/content/course.ts` data by `src/server/content/seed.ts`.
It creates one published revision and one editable draft revision for each fixed lesson module:

1. `lessonMeta`
2. `dialogue`
3. `sentencePatterns`
4. `vocabulary`
5. `practice`
6. `reviewCards`

The generated draft rows copy the published baseline and point `source_revision_id` at the corresponding published revision.
Audio references and lesson structure are not edited by the seed; they are copied from the current static content as-is.

Apply order for a fresh MySQL/TiDB-compatible provider:

1. `db/migrations/0001_content_admin.sql`
2. `db/seeds/0001_initial_content_admin.sql`

Use `MYSQL_DATABASE_URL` for the connection string and keep the value in a local `.env`, Vercel Project Environment Variables, or another secrets-safe channel. Do not commit or print the connection string.

The checked-in helper command is a **fresh bootstrap only** path. It validates that the URL targets a dedicated non-system MySQL database, confirms the selected schema has no existing base tables, and then applies the files in the required order:

```bash
MYSQL_DATABASE_URL="mysql://..." npm run content:mysql:apply
```

Run it only against a content-admin-specific application/test database. Do not apply these tables to a system/default database such as `sys`, `mysql`, `information_schema`, `performance_schema`, `default`, or a generic `test` database.

The seed also guards its bootstrap pointer updates with `current_published_revision_id is null` and `current_draft_revision_id is null`, so an accidental manual seed rerun cannot roll edited module pointers back to the bootstrap revision IDs. The runner still refuses non-fresh schemas before executing SQL; use future migration-only scripts for non-empty DB upgrades.

For runtime/admin-write access, do not reuse the migration/bootstrap credential. Use the least-privilege grant template in `db/grants/content_admin_runtime.sql`: runtime code can `select`/`insert` `module_revisions` but must not have `update`/`delete` on that table, preserving append-only revision history on TiDB-compatible providers that cannot use trigger-based guards. PingCAP's TiDB compatibility docs list triggers and stored procedures as unsupported, so the MySQL port does not depend on them: <https://docs.pingcap.com/tidb/stable/tidb-faq/>.

`src/server/content/seed.test.ts` verifies that the checked-in SQL seed stays in sync with the static course source.
