# Content Admin Seed

The initial seed is generated from the existing static `src/content/course.ts` data by `src/server/content/seed.ts`.
It creates one published revision and one editable draft revision for each fixed lesson module:

1. `lessonMeta`
2. `dialogue`
3. `sentencePatterns`
4. `vocabulary`
5. `pronunciation`
6. `hanziRecognition`
7. `practice`
8. `reviewCards`
9. `shortInput`

The generated draft rows copy the published baseline and point `source_revision_id` at the corresponding published revision.
Audio references and lesson structure are not edited by the seed; they are copied from the current static content as-is.

Apply order for a fresh MySQL/TiDB-compatible provider:

1. `db/migrations/0001_content_admin.sql`
2. `db/seeds/0001_initial_content_admin.sql`

Use `MYSQL_DATABASE_URL` for the connection string and keep the value in a local `.env`, Vercel Project Environment Variables, or another secrets-safe channel. Do not commit or print the connection string.

The checked-in helper command applies the files in the required order:

```bash
MYSQL_DATABASE_URL="mysql://..." npm run content:mysql:apply
```

Run it only against a content-admin-specific application/test database. Do not apply these tables to a system/default database.

`src/server/content/seed.test.ts` verifies that the checked-in SQL seed stays in sync with the static course source.
