# Voice Sample Recorder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a browser microphone recorder to `/admin/voice` so admins can capture a self-authorized Mandarin sample and create a voice profile without uploading a file.

**Architecture:** Keep the feature inside `AdminVoiceGenerationPage` for this small slice. Add local recorder state, MediaRecorder helpers, and UI in the existing Authorized voice profile section; submit the resulting base64 through the existing samples API.

**Tech Stack:** React 19, TypeScript, browser `MediaRecorder`, Testing Library/Vitest, Playwright.

---

### Task 1: Recorder design copy and consent gate

**Files:**
- Modify: `src/pages/AdminVoiceGenerationPage.tsx`
- Test: `src/pages/AdminVoiceGenerationPage.test.tsx`

- [ ] **Step 1: Write failing UI test**

Add a test asserting `/admin/voice` shows `Record voice sample`, `Recommended Mandarin prompt`, `You may read your own Mandarin content`, and Start recording is disabled until the consent checkbox is checked.

- [ ] **Step 2: Run red test**

Run: `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx`
Expected: FAIL because recorder UI does not exist.

- [ ] **Step 3: Add static recorder UI**

Add a recorder card under Authorized voice profile with guidance, the recommended prompt, and a Start recording button disabled when consent is false.

- [ ] **Step 4: Run green test**

Run: `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add voice sample recorder guidance`

### Task 2: Browser recording state and profile creation

**Files:**
- Modify: `src/pages/AdminVoiceGenerationPage.tsx`
- Test: `src/pages/AdminVoiceGenerationPage.test.tsx`

- [ ] **Step 1: Write failing recorder flow test**

Mock `navigator.mediaDevices.getUserMedia`, `MediaRecorder`, and `URL.createObjectURL`; click Start recording, Stop recording, verify preview audio appears, then Create voice profile sends `sampleAudioBase64` and no file is committed.

- [ ] **Step 2: Run red test**

Run: `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx`
Expected: FAIL because recording is not implemented.

- [ ] **Step 3: Implement minimal recorder**

Add `recordingState`, `recordedSampleUrl`, `sampleAudioBase64`, `mediaRecorderRef`, and handlers for start/stop/discard. Use `FileReader.readAsDataURL(blob)` to derive base64. Stop tracks after recording.

- [ ] **Step 4: Run green test**

Run: `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: record admin voice samples in browser`

### Task 3: Error handling and E2E smoke

**Files:**
- Modify: `src/pages/AdminVoiceGenerationPage.test.tsx`
- Modify: `tests/e2e/admin-smoke.spec.ts`

- [ ] **Step 1: Add failing error tests**

Test unsupported recorder and microphone denial messages; ensure Create profile remains disabled without usable sample audio.

- [ ] **Step 2: Add e2e smoke assertion**

Assert `/admin/voice` shows the recorder entry, recommendation copy, and the existing URL fallback still works for profile creation and batch flow.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx && npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
Expected: PASS after implementation.

- [ ] **Step 4: Full verification**

Run:
- `npm test -- src/pages/AdminVoiceGenerationPage.test.tsx src/pages/AdminLessonsPage.test.tsx src/server/voice/adminHttp.test.ts`
- `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
- `npm test`
- `npm run build`
- `npm run lint`
- `git diff --check origin/main..HEAD`

- [ ] **Step 5: Commit and push**

Commit remaining test/e2e changes and push `t42-voice-sample-recorder` for review.
