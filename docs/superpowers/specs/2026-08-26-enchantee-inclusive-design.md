# Inclusive French Greeting Design

## Goal

Use the learner-facing compatibility form `Enchanté(e)` for every
daily-greetings translation of “Nice to meet you,” as approved by Dylan.

## Scope

- Change the three existing `Enchanté...` translations in
  `src/content/lessons/dailyGreetings.ts`.
- Keep all English, Chinese, pinyin, explanations, audio paths, and lesson
  structure unchanged.
- Regenerate `pkg/seedgen/data/course.json` and
  `db/seeds/0001_initial_content_admin.sql` from the static lesson source.
- Publish only the changed daily-greetings modules to preview and production
  after review.

## Verification

- A semantic regression test must require all three approved `Enchanté(e)`
  translations and reject the former masculine-only forms.
- Existing course assertions, seed consistency tests, unit tests, lint,
  TypeScript build, and end-to-end tests must remain green.
- Preview and production data must match the committed seed after publication.

## Rollback

The publication step must retain the usual JSONL backups and use the existing
transactional published/draft revision flow so the previous revisions remain
available.
