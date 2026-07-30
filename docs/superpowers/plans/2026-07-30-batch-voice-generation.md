# Batch Voice Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the misleading single-item voice replacement flow with an admin-only batch pipeline that regenerates the 179 existing Chinese pronunciation audio targets from an authorized voice profile.

**Architecture:** Reuse the existing admin auth, voice sample, voice generate, draft, publish, and rollback foundations. Add a stable course audio target manifest, batch patch helper with `audioFallback`, `/admin/voice` batch UI, and playback fallback order of generated audio → original audio → zh-CN browser TTS. Provider/storage remain pluggable and return honest 503 responses when not configured.

**Tech Stack:** React 19, React Router, TypeScript, Vitest, Playwright, Vite, existing serverless API entrypoints.

---

### Task 1: Branch and scope lock

**Files:**
- Create: `docs/superpowers/plans/2026-07-30-batch-voice-generation.md`

- [x] **Step 1: Create isolated feature branch**

Run: `git switch -c t42-batch-voice-generation origin/main`
Expected: branch tracks `origin/main` at `6c2a070`.

- [x] **Step 2: Verify baseline tests**

Run: `npm test`
Expected: `28 passed (28)` files and `142 passed (142)` tests before implementation.

- [ ] **Step 3: Commit this plan**

Run: `git add docs/superpowers/plans/2026-07-30-batch-voice-generation.md && git commit -m "docs: plan batch voice generation"`
Expected: plan commit on `t42-batch-voice-generation`.

### Task 2: Target manifest and batch patch helper

**Files:**
- Modify: `src/admin/voiceTypes.ts`
- Modify: `src/admin/voiceTargets.ts`
- Modify: `src/admin/voiceTargets.test.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/schema.ts`

- [ ] **Step 1: Write failing target manifest tests**

Add tests that call `collectCourseVoiceAudioTargets(course.lessons)` and assert: exactly `179` targets, every target has `language: 'zh-CN'`, stable `storageKey` derived from the existing `/audio/...mp3` path, and no title/scenario/translation/explanation/reviewCard content is collected.

- [ ] **Step 2: Write failing batch patch tests**

Add tests for `applyVoiceGenerationBatchToLesson(lesson, approvedResults)` proving multiple targets in the same module are patched together, `audioFallback` is set to the original `/audio/...mp3`, and an existing `audioFallback` is preserved.

- [ ] **Step 3: Implement manifest and patch helpers**

Implement `collectLessonVoiceAudioTargets`, `collectCourseVoiceAudioTargets`, `deriveVoiceTargetStorageKey`, and `applyVoiceGenerationBatchToLesson` with stable IDs for dialogue, sentencePatterns, vocabulary, pronunciation, practice listening/speaking/reading, and shortInput.

- [ ] **Step 4: Update content types/schema**

Add optional `audioFallback?: string` to every existing audio-bearing content type and schema. Do not add English/French audio fields.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- src/admin/voiceTargets.test.ts`
Expected: manifest and batch patch tests pass.
Commit: `feat: add batch voice target manifest`.

### Task 3: Playback fallback and server target metadata

**Files:**
- Modify: `src/lib/speech.ts`
- Modify: `src/lib/speech.test.ts`
- Modify: `src/components/SpeechButton.tsx`
- Modify: components/pages that render `SpeechButton`
- Modify: `src/admin/voiceTypes.ts`
- Modify: `src/server/voice/provider.ts`
- Modify: `src/server/voice/storage.ts`
- Modify: `src/server/voice/adminHttp.ts`
- Modify: `src/server/voice/adminHttp.test.ts`

- [ ] **Step 1: Write failing speech fallback tests**

Add tests proving `speakChinese({ text, audioSrc: generated, fallbackAudioSrc: original })` tries generated first, then original on error/play rejection, then browser TTS only if original fails. Keep existing single `audioSrc` behavior green.

- [ ] **Step 2: Implement playback fallback**

Extend `SpeakChineseOptions` and `SpeechButtonProps` with `fallbackAudioSrc?: string`; update render sites to pass `audioFallback` from content items.

- [ ] **Step 3: Write failing server metadata tests**

Add tests proving generate accepts and forwards `language: 'zh-CN'`, `originalAudio`, and `storageKey`; still rejects unauthenticated/unc onsented requests; and fake storage returns deterministic URLs without writing repo files.

- [ ] **Step 4: Implement server metadata wiring**

Extend target parsing and provider/storage interfaces to include `lessonId`, `targetId`, `moduleType`, `originalAudio`, `storageKey`, and `language: 'zh-CN'`.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- src/lib/speech.test.ts src/server/voice/adminHttp.test.ts src/components/SpeechButton.test.tsx`
Expected: tests pass.
Commit: `feat: add voice playback fallback and batch metadata`.

### Task 4: Admin batch voice generation UI

**Files:**
- Create: `src/pages/AdminVoiceGenerationPage.tsx`
- Create: `src/pages/AdminVoiceGenerationPage.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/pages/AdminLessonsPage.tsx`
- Modify: `src/pages/AdminLessonsPage.test.tsx`
- Modify: `src/pages/AdminLessonEditorPage.tsx`
- Remove or stop importing: `src/components/admin/VoiceReplacementPanel.tsx`
- Modify: `src/admin/api.ts`

- [ ] **Step 1: Write failing admin page tests**

Test `/admin` links to `/admin/voice`; `/admin/voice` authenticates like other admin pages; displays `179 audio targets`; disables generation without consent/profile; shows row failures for provider 503; requires preview and approval before apply; and saves approved results via `/api/admin/content/draft` grouped by affected module.

- [ ] **Step 2: Implement `/admin/voice` route and entry link**

Add route, page, and admin overview CTA labeled `Batch voice generation`. Remove the old per-lesson Voice Replacement panel from `AdminLessonEditorPage` so the primary product path is not misleading.

- [ ] **Step 3: Implement batch UI state machine**

Use row states `pending`, `generating`, `generated`, `failed`, `approved`. Generate pending targets with small concurrency. The UI can test 179 rows while E2E mocks only 1-2 representative generated rows.

- [ ] **Step 4: Implement batch apply to drafts**

Group approved generated results by lesson and affected module; call `saveAdminDraftModule` once per affected module with patch payloads from `applyVoiceGenerationBatchToLesson`. Do not publish.

- [ ] **Step 5: Run focused UI tests and commit**

Run: `npm test -- src/admin/voiceTargets.test.ts src/pages/AdminVoiceGenerationPage.test.tsx src/pages/AdminLessonsPage.test.tsx src/pages/AdminLessonEditorPage.test.tsx`
Expected: tests pass.
Commit: `feat: add admin batch voice generation page`.

### Task 5: E2E, full verification, and review handoff

**Files:**
- Modify: `tests/e2e/admin-smoke.spec.ts`
- Modify: `src/server/content/apiEntrypoints.test.ts` if new entrypoints are added

- [ ] **Step 1: Write/update E2E smoke**

Mock sample/generate/content APIs to cover admin login, `/admin/voice`, representative generation, preview approval, draft apply, unauthenticated voice API 401, and `dialogCount = 0`.

- [ ] **Step 2: Run focused verification**

Run: `npm test -- src/admin/voiceTargets.test.ts src/lib/speech.test.ts src/server/voice/adminHttp.test.ts src/pages/AdminVoiceGenerationPage.test.tsx src/pages/AdminLessonsPage.test.tsx`
Expected: all focused tests pass.

- [ ] **Step 3: Run E2E and full verification**

Run: `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts && npm test && npm run build && npm run lint && git diff --check origin/main..HEAD`
Expected: each command exits 0.

- [ ] **Step 4: Push and request review**

Push `t42-batch-voice-generation` and report branch, commits, verification evidence, and caveat that real provider/storage remain external configuration.
