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

Apply order for a fresh provider:

1. `db/migrations/0001_content_admin.sql`
2. `db/seeds/0001_initial_content_admin.sql`

`src/server/content/seed.test.ts` verifies that the checked-in SQL seed stays in sync with the static course source.
