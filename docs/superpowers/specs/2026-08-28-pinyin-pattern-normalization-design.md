# Course Pinyin and Useful Pattern Normalization

## Context

The 12 lesson course currently contains sentence pinyin with inconsistent capitalization and exposes many complete sentences as “Useful patterns”. The runtime source is TypeScript, with checked-in JSON and MySQL seed SQL generated from that source.

## Requirements

- Normalize every `pinyin` and `fillPinyin` value to lowercase, including sentence-initial syllables and embedded proper names.
- Preserve approved embedded English terms that are not pinyin: `SIM` and `Wi-Fi`. Standardize the vocabulary’s existing `WiFi` spelling to `Wi-Fi` so the same English term is used consistently.
- Keep only `sentencePatterns` whose Hanzi `pattern` contains an ellipsis placeholder (`……` or `...`).
- Remove every complete-sentence pattern, including patterns that are exact dialogue duplicates or dialogue substrings.
- Keep source, generated course JSON, SQL seed, and runtime seed payloads consistent.
- Add regression guards for lowercase pinyin and ellipsis-only, non-duplicating patterns.

## Chosen approach

Apply the change at the static lesson source. Regenerate `pkg/seedgen/data/course.json` and `db/seeds/0001_initial_content_admin.sql` from that source. Add content-format tests that traverse all pinyin-bearing fields, allow only the approved embedded English terms, validate every Useful pattern, and repeat the pinyin assertion over the generated snapshot, runtime seed payload, and rendered SQL.

This is preferred over a display-layer transformation because display-only logic would leave the source, seed, database, and API payloads inconsistent. It is also preferred over manually editing selected visible examples because a structural traversal catches sentence, vocabulary, practice, and fill pinyin uniformly.

## Expected scope

- 684 source pinyin/fillPinyin fields are audited; 425 currently contain uppercase characters.
- 126 patterns are audited; 43 ellipsis formulas remain and 83 complete-sentence patterns are removed.
- The deleted patterns are already represented in dialogue, so no learner-facing phrase is lost.

## Verification

- Targeted content, semantics, spacing, and seed tests pass.
- Full Vitest suite, Go seed/content tests, lint, and production build pass.
- Regenerating course JSON and SQL is idempotent.
