# Lesson copy polish design — 2026-08-28

## Goal

Apply the requested copy corrections to the eight affected lesson areas while
keeping the static lesson source authoritative. Generated `course.json` and
the SQL seed must remain deterministic projections of that source.

## Scope and data flow

- Update the four lesson introductions in `src/content/lessons/*.ts`.
- Update hotel, phone-card, help, small-talk, and train dialogue/pattern/
  vocabulary content in the same source files.
- Treat `丢了` and `坏了` as whole translation units only in the two hotel
  explanations; leave other uses of `了` unchanged.
- Add the phone-card explanatory paragraph as a localized dialogue-section
  field, preserving the existing bilingual content model.
- Add requested phrases and ellipsis formulas with lowercase pinyin (except
  approved embedded English terms).
- Remove the three requested small-talk vocabulary entries without
  renumbering the remaining stable IDs.
- Regenerate `pkg/seedgen/data/course.json` and
  `db/seeds/0001_initial_content_admin.sql` from source.

## Validation

Add regression assertions for every requested copy change, including section
intro text, the new phone-card phrase and explanation, whole-word hotel
translations, the two `了` explanations, the new and revised patterns, and
small-talk vocabulary removal. Run the existing content-format guard,
targeted semantic tests, full Vitest, lint, build, and focused Go seed/content
tests. Verify JSON and SQL regeneration are idempotent.
