# Admin Voice Visible Targets Design

**Date:** 2026-08-06
**Status:** Product boundary approved; implementation pending
**Task:** #t51
**Repository base:** `9b3450d5d40a057d22e5662db258e832aceee091` (`origin/main` at inspection time)

## Summary

Restrict the target manifest presented and operated by `/admin/voice` to these five module types:

1. Dialogue
2. Sentence Patterns
3. Vocabulary
4. Practice (listening, speaking, and reading prompts)
5. Short Input

The complete course manifest currently contains **182** zh-CN audio targets. Ten are Pronunciation targets—one in each of the ten lessons—so the `/admin/voice` visible total becomes **172 = 182 − 10**.

Implement this as one explicit Admin Voice visibility boundary in `src/admin/voiceTargets.ts`: a positive allowlist-backed `collectAdminVoiceVisibleTargets()` collector derived from the existing complete `collectCourseVoiceAudioTargets()` collector. `AdminVoiceGenerationPage` must build its row state only from that visible collector. Because every page count and operation already derives from row state, this single upstream change removes Pronunciation from rows, totals, generation, approval, and draft apply without weakening the underlying complete collector, generation API, types, content data, files, or replacement/apply helpers.

This is an Admin Voice surface policy, not deletion of a course capability.

## Product Decision

On `/admin/voice`, Pronunciation module targets must not:

- appear as target IDs, labels, module metadata, or cards;
- contribute to the top metric, manifest heading, pending count, generated count, or failed count;
- enter single-target or “Generate all pending” request payloads;
- produce preview/approval rows;
- enter approved-result arrays;
- produce Pronunciation draft patches through “Apply approved to drafts.”

The page must continue to expose Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input targets. Hanzi Recognition has no voice target today and must not gain one.

Generic speech-quality wording remains valid. In particular, copy such as **“Original pronunciation is active,” “Course pronunciation,”** and **“Keep original pronunciation as the default”** describes audio/pronunciation quality and is not a Pronunciation module label. Tests must distinguish those sentences from module-specific signatures rather than banning the word “pronunciation” globally.

## Current Repository Behavior

### Complete target collection

`src/admin/voiceTargets.ts` owns the complete voice manifest and replacement behavior:

- `collectLessonVoiceAudioTargets()` (current lines 132–189) collects Dialogue, Sentence Patterns, Vocabulary, Pronunciation, Practice listening/speaking/reading, and Short Input.
- The Pronunciation branch (current lines 167–177) emits IDs shaped as `pronunciation:<item-id>`, module type `pronunciation`, labels shaped as `<lesson-id> · Pronunciation <n>`, `audioText`, original/current audio, zh-CN language, and a storage key.
- `collectCourseVoiceAudioTargets()` (current lines 191–193) flat-maps the complete lesson collector.
- `collectVoiceReplacementTargets()` (current lines 337–346) is a compatibility adapter over the complete lesson collector.
- `applyVoiceGenerationBatchToLesson()` (current lines 264–335) groups approved results by module, preserves the earliest `audioFallback`, and returns one patch per affected module in deterministic `moduleOrder`.
- Its `pronunciation` case (current lines 298–303) still patches Pronunciation items by ID.
- `applyVoiceReplacementToModule()` (current lines 348–363) delegates single replacements to the batch helper.

The complete collector is deliberately broader than the future Admin Voice page collector. It is also consumed by the server and compatibility helpers, so changing it would violate the approved boundary.

### Current fixture counts

The ten lesson source fixtures contain:

| Complete collector category | Current count | Visible on `/admin/voice` after this change |
| --- | ---: | ---: |
| Dialogue lines | 52 | 52 |
| Sentence Patterns | 30 | 30 |
| Vocabulary | 50 | 50 |
| Pronunciation | 10 | 0 |
| Practice: listening | 10 | 10 |
| Practice: speaking | 10 | 10 |
| Practice: reading | 10 | 10 |
| Short Input | 10 | 10 |
| **Total** | **182** | **172** |

`src/content/course.test.ts` currently proves there are ten lessons, one Pronunciation item per lesson, and 182 non-empty MP3 references. Those are complete-content contracts and remain 182.

### Current `/admin/voice` data flow

`src/pages/AdminVoiceGenerationPage.tsx` currently imports the complete collector and uses it in `buildRows()` (current lines 50–57). After all draft snapshots load, `loadSnapshots()` passes every available `draftLesson` to `buildRows()` (current lines 257–269).

Every relevant page behavior then derives from `rows`:

- `rows.length` drives the top “Audio targets” metric and the manifest heading (current lines 733–743 and 970–976).
- `canGenerateAll` checks for pending/failed rows (current line 253).
- `approvedRows` is filtered from rows and enables apply (current lines 254–255).
- `handleGenerateAllPending()` selects pending/failed rows and generates them with concurrency 3; its success/failure totals count that selection (current lines 581–618).
- `generateOne()` constructs `/api/admin/voice/generate` payloads from each row target (current lines 542–579).
- The card loop renders target IDs, labels, module metadata, text, generation controls, preview audio, and approval checkboxes from rows (current lines 978–1043).
- `handleApplyApproved()` maps approved rows to `VoiceGenerationApprovedResult[]`, calls `applyVoiceGenerationBatchToLesson()`, then saves each returned module patch through `/api/admin/content/draft` (current lines 641–683).

At the approved base, all of those paths therefore include the ten Pronunciation targets.

### Server/API behavior

`src/server/voice/adminHttp.ts` builds `voiceTargetManifest` from the complete `collectCourseVoiceAudioTargets(course.lessons)` (current lines 38–42). `requireManifestTargetMatch()` validates target ID, lesson ID, text, module type, original audio, storage key, and language against that complete manifest before provider/storage work (current lines 111–136 and 238–272).

That server manifest must stay complete at 182. A valid authenticated API request for a Pronunciation target remains supported even though `/admin/voice` no longer originates one. This preserves general generation/API capability and compatibility for other or future authorized clients.

## Goals

1. Make `/admin/voice` expose exactly the current 172 targets belonging to Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input.
2. Establish one reusable, named Admin Voice visible-target collector rather than scattered render-time checks.
3. Make every page row, metric, status total, generate-all input, single-generate input, approval choice, and apply input derive from that visible collection.
4. Preserve ordering, target objects, stable IDs, storage keys, original audio/fallback semantics, and request shape for visible targets.
5. Preserve all Pronunciation content, audio files, schema/types, historical data, server manifest support, and replacement/apply compatibility.
6. Keep Hanzi Recognition outside all voice target collections.
7. Lock both sides of the boundary with tests: the Admin Voice surface excludes Pronunciation while the complete collector/API/apply helpers retain it.

## Non-goals

- Do not delete, rename, move, or rewrite any `public/audio/**/pronunciation-01.mp3` file.
- Do not remove or alter `LessonContent['pronunciation']`, `PronunciationTip`, content schemas, database module types, seed rows, draft/published payloads, history, or public-content reconstruction.
- Do not remove `pronunciation:<id>` from `VoiceAudioTargetId` or `pronunciation` from `VoiceAudioModuleType`/batch patch payload compatibility.
- Do not change `collectLessonVoiceAudioTargets()`, `collectCourseVoiceAudioTargets()`, `collectVoiceReplacementTargets()`, `applyVoiceGenerationBatchToLesson()`, or `applyVoiceReplacementToModule()` to reject Pronunciation.
- Do not narrow `src/server/voice/adminHttp.ts` from its complete 182-target manifest.
- Do not change provider, storage, authentication, profile recording, concurrency, fallback, draft save, publish, or rollback behavior.
- Do not add Hanzi Recognition audio fields or target IDs.
- Do not hide generic descriptive uses of “pronunciation” that refer to spoken audio quality rather than the Pronunciation module.
- Do not edit complete snapshots or test fixtures to remove Pronunciation. Full fixtures must continue to model it.

## Alternatives Considered

### A. Filter only while rendering cards — rejected

The page could retain all 182 rows and skip Pronunciation inside `rows.map()`. This would hide cards but leave the top count at 182, include Pronunciation in pending/generated/failed totals, send Pronunciation generation requests from “Generate all pending,” and permit hidden row state to reach approval/apply logic. It fails the product boundary and creates multiple inconsistent sources of truth.

### B. Remove Pronunciation from the complete collector/types/apply helper — rejected

Changing `collectLessonVoiceAudioTargets()` or `collectCourseVoiceAudioTargets()` would make the page show 172, but it would also narrow the server manifest, break valid direct generation requests, remove replacement/apply compatibility, and conflate UI visibility with domain capability. Removing target/type/apply cases would also risk old data and generated-audio workflows. This directly violates the preservation requirements.

### C. Add an Admin Voice visible-target collector derived from the complete collector — selected

A positive allowlist captures the five approved page module types, filters the complete collector once, and gives the page one source for rows and all downstream operations. The complete collector and helpers remain unchanged. Positive inclusion is preferred over only `moduleType !== 'pronunciation'`: a new voice-capable module will remain hidden from `/admin/voice` until product scope explicitly adds it, and Hanzi Recognition cannot appear accidentally if it ever gains an underlying audio capability later.

## Selected Architecture

### 1. Named Admin Voice visibility boundary

Add the policy beside the existing collectors in `src/admin/voiceTargets.ts`, immediately after `collectCourseVoiceAudioTargets()`:

```ts
const adminVoiceVisibleModuleTypes = new Set<VoiceAudioModuleType>([
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'shortInput',
])

export function collectAdminVoiceVisibleTargets(
  lessons: readonly LessonContent[],
): VoiceAudioTarget[] {
  return collectCourseVoiceAudioTargets(lessons).filter((target) =>
    adminVoiceVisibleModuleTypes.has(target.moduleType),
  )
}
```

Use the shown `Set<VoiceAudioModuleType>` and exported collector name. The five literals are compile-time checked by the generic type; do not export the set or create a second page-local policy.

Contract:

- Input: the same ordered `readonly LessonContent[]` accepted by the complete course collector.
- Source: only `collectCourseVoiceAudioTargets(lessons)`; do not duplicate target construction.
- Inclusion: exactly `dialogue`, `sentencePatterns`, `vocabulary`, `practice`, and `shortInput`.
- Exclusion: `pronunciation`; Hanzi Recognition remains absent because the complete collector does not emit it and the positive allowlist does not include it.
- Output: a new array containing the unchanged target objects in complete-manifest order. Do not rewrite IDs, labels, audio paths, storage keys, language, or text.
- Scope: this collector is for Admin Voice surface visibility. It is not the server’s authorization manifest and must not replace the complete collector outside Admin Voice UI/tests.

Do not add a second per-lesson visible collector, a page-local filter, or operation-specific Pronunciation checks. Those would create redundant policy locations.

### 2. Page integration

In `src/pages/AdminVoiceGenerationPage.tsx`:

- replace the `collectCourseVoiceAudioTargets` import with `collectAdminVoiceVisibleTargets`;
- change only `buildRows()` to map the visible collector;
- leave `VoiceGenerationRow`, `replaceRow`, count derivation, generation handlers, approval logic, and apply logic structurally unchanged.

This is the critical architecture property: the page never creates a Pronunciation row, so no downstream page operation can select one.

### 3. Exact data flow after the change

1. `/admin/voice` loads summaries and complete draft snapshots through existing content APIs.
2. `draftLesson` objects remain complete and still contain Pronunciation, Hanzi Recognition, histories, and old audio data.
3. `buildRows(draftLessons)` calls `collectAdminVoiceVisibleTargets(draftLessons)`.
4. The visible collector calls the complete collector, preserving all target construction and ordering, then keeps only the five approved module types.
5. The current fixture produces 172 rows.
6. `rows.length` shows 172 in both the metric and target-manifest heading.
7. Single generation can receive only a visible row.
8. Generate-all selects only pending/failed visible rows, so at most 172 current requests are emitted and all status totals use that same set.
9. Preview/approval controls exist only for generated visible rows.
10. `approvedRows` can contain only visible targets.
11. `handleApplyApproved()` passes only visible results to the unchanged complete apply helper.
12. The unchanged helper returns only patches for modules present in those results; therefore `/admin/voice` cannot save a `pronunciation` patch.
13. The server continues validating each request against its unchanged complete 182-target manifest.

### 4. No magic production count

Production UI must continue to render `rows.length`; do not hard-code 172 in application code. The exact 172 belongs in fixture-backed tests and acceptance evidence. If course content changes, the visible total should be recomputed from complete content minus all disallowed module targets.

## Compatibility Boundaries

### Must remain unchanged

- `src/admin/voiceTypes.ts`
  - `VoiceAudioTargetId` retains ``pronunciation:${string}``.
  - `VoiceAudioModuleType` retains Pronunciation through its current exclusion-based definition.
  - `VoiceGenerationBatchPatch['payload']` retains `LessonContent['pronunciation']`.
- `src/admin/voiceTargets.ts`
  - complete collection retains Pronunciation;
  - `moduleOrder` retains Pronunciation;
  - `parseTargetId()` accepts Pronunciation IDs;
  - `applyVoiceGenerationBatchToLesson()` retains its Pronunciation patch case;
  - `collectVoiceReplacementTargets()` and `applyVoiceReplacementToModule()` retain behavior.
- `src/server/voice/adminHttp.ts`
  - server manifest remains based on `collectCourseVoiceAudioTargets()` and remains 182 with current fixtures;
  - valid authorized Pronunciation requests remain accepted.
- `src/content/types.ts`, `src/content/schema.ts`, `src/server/content/types.ts`, `src/server/content/seed.ts`, `src/server/content/publicContent.ts`, repositories/stores, and migration/schema code retain Pronunciation payloads.
- `src/content/lessons/*.ts` and `public/audio/**/pronunciation-01.mp3` remain present and unchanged.
- Complete `AdminLessonSnapshot` fixtures retain Pronunciation module metadata, payloads, and history arrays.

### Existing generated/old data

A draft or published lesson may already point a Pronunciation item at generated audio and preserve its original in `audioFallback`. Loading `/admin/voice` must not display, reset, normalize, or overwrite that item. Saving a visible module remains a module-scoped draft operation, so the untouched Pronunciation payload stays in its own revision.

A direct authorized caller may continue to generate a valid Pronunciation replacement through `/api/admin/voice/generate`, and existing helpers may continue to construct a Pronunciation draft patch. The page simply provides no UI path to originate or approve that work.

## Error and Edge Cases

1. **No lesson summaries or no draft lessons:** the visible collector returns `[]`; the existing “No audio targets loaded” state remains, counts are zero, and generate/apply remain disabled.
2. **A lesson has only Pronunciation audio:** its complete target still exists, but it contributes no Admin Voice row. If all loaded lessons are like this, the page uses the same zero-target state.
3. **Pronunciation content is malformed:** complete content/schema/server tests remain responsible. The Admin Voice filter is not validation and must not silently mutate content.
4. **Provider/storage failure:** failure rows and generated/failed totals cover visible rows only. With current fixtures, a full failed batch reports 172 failed, never 182.
5. **Partial visible batch:** existing per-row retry semantics remain. Filtering must not alter row status transitions or concurrency.
6. **Existing generated Pronunciation audio:** it remains in draft/published content but does not become a row via `audioFallback` handling.
7. **Future Pronunciation items:** all remain hidden because the allowlist is module-based, not count- or ID-based.
8. **Future voice-capable module:** it remains hidden until explicitly added to the Admin Voice allowlist and reviewed. This fail-closed behavior is intentional.
9. **Hanzi Recognition:** it has no `audio` field/target today. It remains absent from the complete collector, `VoiceAudioTargetId`, the visible allowlist, rows, and payloads.
10. **Generic copy:** headings and guidance containing lowercase descriptive “pronunciation” remain. Module-specific absence tests must target IDs, labels, metadata, cards, requests, and patches.
11. **Stale state during apply:** the existing page creates row state only after snapshot loading and has no external row-injection path. The visible row source is therefore sufficient; do not weaken the complete apply helper with a global rejection that would break other callers.

## TDD Test Strategy

Implementation must proceed from boundary tests before the page import is changed.

### 1. Collector and helper tests — `src/admin/voiceTargets.test.ts`

Keep the existing complete contracts intact:

- `collectLessonVoiceAudioTargets(lesson)` still includes the Pronunciation target and every existing lesson audio field.
- `collectCourseVoiceAudioTargets(course.lessons)` still returns 182.
- Complete targets remain zh-CN with stable `/audio/`-derived storage keys.

Add focused tests for `collectAdminVoiceVisibleTargets(course.lessons)` that assert all of the following:

- length is exactly 172;
- the complete collector is still 182 and has exactly 10 `moduleType === 'pronunciation'` targets;
- visible module types are exactly `dialogue`, `sentencePatterns`, `vocabulary`, `practice`, and `shortInput`;
- no visible target has `moduleType === 'pronunciation'`;
- no visible target ID starts with `pronunciation:`;
- no visible target label matches the module label shape `· Pronunciation <number>`;
- no visible target ID/module type refers to Hanzi Recognition;
- category counts are Dialogue 52, Sentence Patterns 30, Vocabulary 50, Practice 30, Short Input 10;
- visible target order equals the complete collector’s order after filtering by the five approved module types.

Add or retain an explicit apply-compatibility test outside the page boundary: a valid `pronunciation:<id>` result passed to `applyVoiceGenerationBatchToLesson()` still returns one `moduleType: 'pronunciation'` patch, changes only the matching tip’s `audio`, sets/preserves `audioFallback`, and leaves sibling content unchanged.

This test is essential: it proves the new visibility collector did not become a domain deletion.

### 2. Page tests — `src/pages/AdminVoiceGenerationPage.test.tsx`

Continue returning complete `lessonSnapshot()` fixtures, including `pronunciation` in `modules` and `publishedHistory`. Do not sanitize fixtures before they reach the page.

Update page-specific count assertions from 182 to 172, including:

- initial target heading;
- all setup waits used by recorder/profile tests;
- generate-all success total from `182 generated` to `172 generated`;
- full provider-failure total from `182 failed` to `172 failed`.

Add a dedicated Admin Voice boundary test after complete snapshots load:

- both visible count locations report 172;
- there are no test IDs matching `voice-target-row-pronunciation:`;
- there is no module metadata text exactly matching `pronunciation · zh-CN`;
- there is no module target label matching `· Pronunciation <number>`;
- there is no approval accessible name built from a Pronunciation target label;
- these five representative cards are present: `dialogue:self-intro-line-01`, `sentencePatterns:self-intro-pattern-1`, `vocabulary:self-intro-vocab-1`, `practice:listening:self-intro-listening-1`, and `shortInput:self-intro-short-input-01`;
- generic heading `Original pronunciation is active` remains visible.

Strengthen the existing generate/apply flow:

- after “Generate all pending,” collect all `/api/admin/voice/generate` calls and assert there are 172;
- assert every request target module type is in the five-type allowlist;
- assert no request target ID starts with `pronunciation:` and no request module type is `pronunciation` or `hanziRecognition`;
- in the same integration flow, select and approve one representative generated row for each visible module type:
  - `dialogue:self-intro-line-01`;
  - `sentencePatterns:self-intro-pattern-1`;
  - `vocabulary:self-intro-vocab-1`;
  - `practice:listening:self-intro-listening-1`;
  - `shortInput:self-intro-short-input-01`;
- click “Apply approved to drafts,” collect all `/api/admin/content/draft` calls, and assert their `moduleType` sequence is exactly `dialogue`, `sentencePatterns`, `vocabulary`, `practice`, `shortInput`;
- for Dialogue, Sentence Patterns, Vocabulary, and Practice, assert the representative item's `audio` is its generated URL, `audioFallback` is its original `/audio/` URL, and at least one unselected sibling remains deeply equal to the original fixture;
- for Short Input, assert `audio` and `audioFallback` change as above while every non-audio field remains equal to the original fixture;
- assert no draft request has `moduleType: 'pronunciation'` or `moduleType: 'hanziRecognition'`.

This five-module page integration contract is required because `applyVoiceGenerationBatchToLesson()` has a separate switch branch for each module. Card presence and valid generate-all requests alone do not prove approval-to-draft behavior for all five visible branches.

Do not use `queryByText(/pronunciation/i)` as an absence assertion because approved generic copy intentionally contains that word.

### 3. Server compatibility test — `src/server/voice/adminHttp.test.ts`

Leave the existing “182-target course manifest” test and complete collector import unchanged. Add a valid Pronunciation request case that selects a real Pronunciation target from `collectCourseVoiceAudioTargets(course.lessons)`, sends its exact text and metadata through an authenticated fake-provider/fake-storage handler, and asserts:

- response is 200 with the fake saved URL;
- provider and storage receive the Pronunciation target;
- no manifest-mismatch error occurs.

No production server code should change for this feature. This test prevents an accidental swap from complete to visible collector in `src/server/voice/adminHttp.ts`.

### 4. Complete content tests — no expectation changes

The following complete-data expectations must stay at 182/retain Pronunciation:

- `src/content/course.test.ts`: one Pronunciation item per lesson and 182 shipped non-empty audio files;
- `src/admin/voiceTargets.test.ts`: complete collector 182;
- `src/server/voice/adminHttp.test.ts`: complete 182-target manifest;
- seed, public-content, repository, and snapshot fixtures: Pronunciation entries remain present.

A change that makes these tests expect 172 is a scope regression, not an implementation of this design.

### 5. Browser/E2E tests

#### `tests/e2e/admin-smoke.spec.ts`

Keep its API route mocks based on the complete collector so the mock is capable of accepting Pronunciation, just like the server. Record requests originating from the page and assert the UI policy independently:

- `/admin/voice` shows 172 audio targets;
- no Pronunciation target card/ID/module metadata/approval row exists;
- the generic `Original pronunciation is active` heading remains;
- generate-all emits exactly 172 mocked generate requests;
- every request belongs to the five approved module types;
- no request target ID/module type is Pronunciation or Hanzi Recognition;
- success copy reports 172 generated;
- approving and applying the representative Dialogue row still writes the expected Dialogue payload/fallback;
- no draft request produced by the voice action has `moduleType: 'pronunciation'`.

The existing complete snapshots in this E2E test continue to contain Pronunciation and Hanzi Recognition metadata/history. That demonstrates UI exclusion rather than fixture deletion.

Browser smoke may continue to approve/apply only the representative Dialogue row. The all-five approval-to-draft contract belongs to `AdminVoiceGenerationPage.test.tsx`, where payloads and unchanged siblings can be checked precisely without multiplying browser-smoke state.

#### `tests/e2e/admin-voice-layout.spec.ts`

Change the visible heading expectation to 172. Keep the desktop/mobile layout assertions and representative Dialogue card checks unchanged. No CSS or layout change is expected.

### 6. Production route-mock smoke

Give the existing `tests/e2e/admin-smoke.spec.ts` an optional `ADMIN_SMOKE_BASE_URL`. When set, its initial navigation uses the absolute deployed origin; all `page.route` mocks continue to intercept content, sample, generate, and draft endpoints in the browser. When unset, it keeps the current local Vite base.

After deployment, run the same smoke against the deployed bundle without real provider cost or draft mutation:

```bash
ADMIN_SMOKE_BASE_URL="https://en-fr-chinese-entry-mvp.vercel.app" \
  npm run test:e2e -- tests/e2e/admin-smoke.spec.ts
```

The production smoke passes only if it observes the deployed `/admin/voice` bundle reporting 172, generating exactly 172 route-mocked visible payloads, exposing no Pronunciation module rows/approval controls, creating no Pronunciation draft request, and retaining the generic pronunciation-quality heading. Do not call the real voice provider or real content draft endpoint for this smoke.

## Verification Matrix

Run from the repository root after implementation:

```bash
npm test -- --run \
  src/admin/voiceTargets.test.ts \
  src/pages/AdminVoiceGenerationPage.test.tsx \
  src/server/voice/adminHttp.test.ts \
  src/content/course.test.ts

npm run test:e2e -- \
  tests/e2e/admin-smoke.spec.ts \
  tests/e2e/admin-voice-layout.spec.ts

npm test -- --run
npm run lint
npm run build
git diff --check
```

Expected boundary evidence:

- focused collector/page/browser tests report visible 172;
- complete collector/server/content tests remain 182;
- all ten Pronunciation source records and MP3 files remain;
- source scans show no new Hanzi Recognition voice target;
- the production diff contains no changes to server voice handlers, voice types, content types/schema/data, storage/provider code, or audio files.

## Rollout, Review, Deploy, and Production Smoke

### Review gate

A reviewer must verify:

1. `collectAdminVoiceVisibleTargets()` derives from, rather than replaces or edits, `collectCourseVoiceAudioTargets()`.
2. The policy is a positive five-module allowlist.
3. `AdminVoiceGenerationPage.buildRows()` is the only production consumer changed to the visible collector.
4. Page counts and operations still derive from `rows`; there is no render-only filter.
5. `src/server/voice/adminHttp.ts`, `src/admin/voiceTypes.ts`, complete apply helpers, schemas/data, and audio files are unchanged.
6. Tests prove both exclusion from the page and retention in complete API/apply paths.
7. Generic pronunciation-quality copy remains.

### Deployment

This is a frontend visibility-policy change plus tests. It needs no data migration, seed, backfill, provider configuration, storage change, or feature flag. After reviewer approval, fast-forward or otherwise integrate the immutable reviewed head into the then-current `origin/main`, rerun focused and full verification on the merged head, and push `main`. The repository's existing GitHub/Vercel integration is the deployment trigger; do not introduce a new CLI/project-link dependency for this task.

Record the production deployment ID and require GitHub deployment status `success` for the merged commit. Confirm the fixed production alias resolves to `https://en-fr-chinese-entry-mvp.vercel.app` and serves the new bundle before running the route-mock smoke against that exact origin.

### Post-deploy checks

1. Run the production route-mock smoke above against the exact deployed origin.
2. In that route-mocked production session, confirm both count locations show 172.
3. Confirm representative Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input rows exist.
4. Confirm no card label or technical row metadata identifies the Pronunciation module.
5. Confirm profile/recording controls and generic “Original pronunciation is active” copy remain.
6. Do not call the real Admin content or voice APIs and do not run a real 172-item generation batch; route mocks prove payload scope without credentials, provider cost, or draft mutation.
7. If a rollback is needed, revert the frontend collector/page-consumer change. No data rollback is required because the feature does not mutate content or storage during deployment.

## Acceptance Criteria

1. With the current complete ten-lesson fixtures, `collectCourseVoiceAudioTargets(course.lessons)` returns 182 and includes exactly 10 Pronunciation targets.
2. `collectAdminVoiceVisibleTargets(course.lessons)` returns **172 = 182 − 10**.
3. The visible collector includes only Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input, in existing complete-manifest order.
4. `/admin/voice` displays 172 in its audio-target metric and target-manifest heading.
5. `/admin/voice` exposes no Pronunciation target IDs, module labels, module metadata, cards, preview/approval rows, or count contribution.
6. Single generation and generate-all from `/admin/voice` emit no Pronunciation or Hanzi Recognition payload; current full-batch generated/failed totals use 172.
7. Applying approved rows from `/admin/voice` emits no Pronunciation draft patch.
8. One representative row from each of Dialogue, Sentence Patterns, Vocabulary, Practice, and Short Input completes generation, preview approval, and fallback-preserving draft apply in the same page integration flow; the five draft module types are exact, selected payloads are correct, and unselected siblings/non-audio fields remain unchanged.
9. Hanzi Recognition still has no voice target and is not added to IDs, collectors, UI, requests, or patches.
10. The complete collectors, target/types, server 182-target manifest, direct generation API, and replacement/apply helpers retain Pronunciation compatibility.
11. Full lesson snapshots, schemas, seeds, repositories, public reconstruction, old data, and all ten Pronunciation MP3 files remain intact.
12. Generic descriptive copy such as “Original pronunciation is active” remains visible.
13. Focused unit tests, complete data/server compatibility tests, local route-mocked E2E/layout tests, full Vitest, lint, build, and `git diff --check` pass.
14. The deployed route-mock smoke observes 172 visible/generated targets and zero Pronunciation UI rows, generation payloads, approval rows, or draft patches.

## Repository-Specific File and Symbol Map

### Minimal production changes

| File | Current symbol/behavior | Required change |
| --- | --- | --- |
| `src/admin/voiceTargets.ts` | `collectCourseVoiceAudioTargets()` returns all 182; complete helper/apply support includes Pronunciation | Add private positive five-module policy and exported `collectAdminVoiceVisibleTargets()` derived from the complete collector. Change no existing collector/helper behavior. |
| `src/pages/AdminVoiceGenerationPage.tsx` | `buildRows()` imports/calls `collectCourseVoiceAudioTargets()`; all counts/actions derive from rows | Import/call `collectAdminVoiceVisibleTargets()` in `buildRows()` only. Keep downstream logic and generic copy unchanged. |

### Required test changes

| File | Current sensitive contract | Required coverage |
| --- | --- | --- |
| `src/admin/voiceTargets.test.ts` | Complete lesson collection includes Pronunciation; complete course count is 182; apply fallback/grouping tests | Keep complete assertions; add 172 visible policy/category/order assertions and explicit Pronunciation apply compatibility. |
| `src/pages/AdminVoiceGenerationPage.test.tsx` | Multiple waits/headings use 182; batch success/failure uses 182; complete snapshots include Pronunciation; existing integration approves/applies only Dialogue | Change page-visible expectations to 172; assert no module-specific Pronunciation surface/request/patch; keep generic copy and complete fixtures; strengthen one integration flow to approve/apply representatives from all five visible module types and verify every payload plus unchanged siblings. |
| `src/server/voice/adminHttp.test.ts` | Complete collector builds test target; manifest mismatch test names 182 | Keep 182 contract; add valid direct Pronunciation generation compatibility test. Production server file stays untouched. |
| `tests/e2e/admin-smoke.spec.ts` | Route mocks use complete collector; heading/generated totals are 182; representative Dialogue apply is covered | Keep complete mock manifest; assert 172 page requests and no Pronunciation UI/request/draft action; add optional deployed-origin navigation for production route-mock smoke. |
| `tests/e2e/admin-voice-layout.spec.ts` | Desktop/mobile heading expectation is 182 | Change visible heading to 172; retain layout geometry checks. |

### Files/contracts that must not be narrowed

- `src/admin/voiceTypes.ts`
- `src/server/voice/adminHttp.ts`
- `src/content/types.ts`
- `src/content/schema.ts`
- `src/server/content/types.ts`
- `src/server/content/seed.ts`
- `src/server/content/publicContent.ts`
- `src/content/lessons/*.ts`
- `public/audio/**/pronunciation-01.mp3`
- full snapshot/data fixtures and complete count assertions in `src/content/course.test.ts`

### Current count-sensitive assertions at the approved base

- `src/admin/voiceTargets.test.ts`: complete collector equals 182.
- `src/content/course.test.ts`: complete shipped audio paths equal 182.
- `src/server/voice/adminHttp.test.ts`: manifest mismatch test describes the 182-target complete manifest.
- `src/pages/AdminVoiceGenerationPage.test.tsx`: page heading/setup waits, generated total, and failed total currently expect 182 and must become 172 because they are Admin Voice surface assertions.
- `tests/e2e/admin-smoke.spec.ts`: page heading and generated total currently expect 182 and must become 172.
- `tests/e2e/admin-voice-layout.spec.ts`: page heading currently expects 182 and must become 172.

This split is intentional: **complete/domain/API assertions remain 182; Admin Voice surface assertions become 172.**
