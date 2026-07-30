# Admin Voice Replacement MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an admin-only MVP that lets an authenticated admin confirm voice authorization, create or select a voice profile, generate or enter a replacement audio URL for one lesson audio item, preview it, and apply that single audio replacement to the lesson draft.

**Architecture:** Keep real voice cloning and storage behind explicit server adapters. The first production default is disabled and returns clear `503` responses unless a provider/storage adapter is configured, while tests inject fake adapters. The admin UI patches only one existing content module payload and saves it through the existing draft API; existing publish/rollback remains the only way to ship changes.

**Tech Stack:** React + TypeScript + Vitest + Playwright; Vercel-style API entrypoints; existing Basic Auth admin utilities; existing MySQL-backed draft/publish APIs.

---

## File structure

- Create `src/admin/voiceTypes.ts`: shared front-end request/response and target types.
- Create `src/admin/voiceTargets.ts`: pure target collection and single-target payload patching.
- Create `src/admin/voiceTargets.test.ts`: TDD coverage for collection and payload patching.
- Modify `src/admin/api.ts`: add `createAdminVoiceSampleProfile()` and `generateAdminVoiceReplacement()`.
- Create `src/server/voice/provider.ts`: provider interface, disabled provider, fake-injectable resolver.
- Create `src/server/voice/storage.ts`: storage interface, disabled storage, fake-injectable resolver.
- Create `src/server/voice/adminHttp.ts`: admin-only sample/generate HTTP handlers with safe errors.
- Create `src/server/voice/adminHttp.test.ts`: server auth/consent/503/fake success tests.
- Create `api/admin/voice/samples.ts` and `api/admin/voice/generate.ts`: Vercel API entrypoints.
- Modify `src/server/content/apiEntrypoints.test.ts`: include new entrypoints/server voice files in emit list and import assertions.
- Create `src/components/admin/VoiceReplacementPanel.tsx`: admin side-rail panel for consent/profile/generation/manual URL/preview/apply.
- Modify `src/pages/AdminLessonEditorPage.tsx`: mount the panel and wire `saveAdminDraftModule` refresh.
- Modify `src/pages/AdminLessonEditorPage.test.tsx`: cover panel render, consent guard, generate/apply, 503 fallback.
- Modify `tests/e2e/admin-smoke.spec.ts`: mock voice API and cover authenticated replacement draft + unauthenticated API route.
- Modify `src/styles/global.css`: small reusable admin panel styles only if existing styles are insufficient.

## Task 1: Pure audio target collection and patching

- [ ] Write failing tests in `src/admin/voiceTargets.test.ts` using `course.lessons[0]`:
  - `collectVoiceReplacementTargets(lesson)` returns every current `audio` field: dialogue lines, sentence patterns, vocabulary, pronunciation, practice listening/speaking/reading, and shortInput.
  - Applying `dialogue:<line.id>`, `vocabulary:<id>`, `practice:listening:<id>`, and `shortInput:<id>` returns `{ moduleType, payload }` for only that module and keeps unrelated fields unchanged.
- [ ] Run `npm test -- src/admin/voiceTargets.test.ts` and verify RED because `src/admin/voiceTargets.ts` does not exist.
- [ ] Implement `src/admin/voiceTargets.ts` with deterministic target ids and immutable payload copying.
- [ ] Run `npm test -- src/admin/voiceTargets.test.ts` and verify GREEN.

## Task 2: Server voice API adapter layer

- [ ] Write failing tests in `src/server/voice/adminHttp.test.ts`:
  - unauthenticated sample/generate requests return 401 and non-SPA requests include `WWW-Authenticate`.
  - SPA unauthenticated requests return 401 without `WWW-Authenticate`.
  - sample requests without `consentConfirmed: true` return 400.
  - disabled/default storage/provider returns 503 and does not write repo files.
  - injected fake storage/provider returns `profileId` and `audioUrl`.
- [ ] Run `npm test -- src/server/voice/adminHttp.test.ts` and verify RED.
- [ ] Implement `src/server/voice/provider.ts`, `src/server/voice/storage.ts`, and `src/server/voice/adminHttp.ts`.
- [ ] Add `api/admin/voice/samples.ts` and `api/admin/voice/generate.ts`.
- [ ] Update `src/server/content/apiEntrypoints.test.ts` emit/import list.
- [ ] Run `npm test -- src/server/voice/adminHttp.test.ts src/server/content/apiEntrypoints.test.ts` and verify GREEN.

## Task 3: Admin API client and VoiceReplacementPanel UI

- [ ] Extend `src/pages/AdminLessonEditorPage.test.tsx` with failing tests for panel visibility, consent guard, provider 503 message/fallback, and generate → preview → apply draft request body.
- [ ] Run `npm test -- src/pages/AdminLessonEditorPage.test.tsx` and verify RED.
- [ ] Add `src/admin/voiceTypes.ts` and API methods in `src/admin/api.ts`.
- [ ] Implement `src/components/admin/VoiceReplacementPanel.tsx` using existing admin styles and the pure `voiceTargets` helper.
- [ ] Mount `VoiceReplacementPanel` in the editor side column; `onApply` calls existing draft save and refreshes snapshot.
- [ ] Run `npm test -- src/pages/AdminLessonEditorPage.test.tsx src/admin/voiceTargets.test.ts` and verify GREEN.

## Task 4: Browser smoke extension

- [ ] Extend `tests/e2e/admin-smoke.spec.ts` with mocked voice sample/generate routes and an unauthenticated API probe.
- [ ] Run `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts` and verify RED/GREEN after fixes.

## Task 5: Final verification and handoff

- [ ] Run focused verification:
  - `npm test -- src/admin/voiceTargets.test.ts src/server/voice/adminHttp.test.ts src/pages/AdminLessonEditorPage.test.tsx src/components/SpeechButton.test.tsx`
  - `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
- [ ] Run full verification:
  - `npm test`
  - `npm run build`
  - `npm run lint`
- [ ] Commit with message `feat: add admin voice replacement mvp`.
- [ ] Request review from `@dylan-t2-reviewer` with branch/commit, verification evidence, caveat that real provider/storage configuration remains external.
