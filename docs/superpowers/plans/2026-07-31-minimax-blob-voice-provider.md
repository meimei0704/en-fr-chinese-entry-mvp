# MiniMax Blob Voice Provider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing `/admin/voice` batch voice pipeline to real Vercel Blob audio storage and MiniMax voice cloning/T2A adapters while keeping clear 503 behavior when env is missing.

**Architecture:** Keep the existing `VoiceStorage` and `VoiceCloneProvider` interfaces as the server boundary, replacing only the lazy production resolver with env-driven adapters. Store audio binaries in Vercel Blob and keep TiDB usage metadata-only through existing draft URL writes; do not put sample/mp3 binaries into TiDB or git. Because MiniMax clone upload accepts only `mp3`, `m4a`, and `wav`, convert browser microphone recordings to WAV before sending `sampleAudioBase64`.

**Tech Stack:** React + TypeScript, Vercel Node Functions, `@vercel/blob`, MiniMax REST API (`/v1/files/upload`, `/v1/voice_clone`, `/v1/t2a_v2`), Vitest, Playwright, oxlint.

---

## Official API facts used

- Vercel Blob SDK `put(pathname, body, { access, contentType, token, addRandomSuffix })` uploads `ArrayBuffer`/`Blob` bodies and uses OIDC or `BLOB_READ_WRITE_TOKEN` for auth: <https://vercel.com/docs/vercel-blob/using-blob-sdk>
- Vercel Blob pricing/free usage is separate from TiDB and better suited to audio objects: <https://vercel.com/docs/vercel-blob/usage-and-pricing>
- MiniMax clone source upload uses `POST https://api.minimax.io/v1/files/upload`, multipart `purpose=voice_clone`, accepted formats `mp3`, `m4a`, `wav`, 10s–5min, <=20MB: <https://platform.minimax.io/docs/api-reference/voice-cloning-uploadcloneaudio.md>
- MiniMax clone uses `POST https://api.minimax.io/v1/voice_clone` with `file_id` and custom `voice_id`: <https://platform.minimax.io/docs/api-reference/voice-cloning-clone.md>
- MiniMax T2A uses `POST https://api.minimax.io/v1/t2a_v2`, `output_format: hex`, `voice_setting.voice_id`, and returns hex audio in `data.audio`: <https://platform.minimax.io/docs/api-reference/speech-t2a-http.md>

## Env contract

Required for real production operation:

```text
VOICE_STORAGE_PROVIDER=vercel_blob
VOICE_PROVIDER=minimax
MINIMAX_API_KEY=<configured in Vercel env/secret only>
```

Vercel Blob auth, one of:

```text
# Preferred when Blob store is connected to the Vercel project:
BLOB_STORE_ID=<auto from Vercel storage binding>
VERCEL_OIDC_TOKEN=<auto from Vercel runtime>

# Fallback static token:
BLOB_READ_WRITE_TOKEN=<configured in Vercel env/secret only>
```

Optional tuning:

```text
VOICE_BLOB_PREFIX=voice
VOICE_BLOB_ACCESS=public
MINIMAX_BASE_URL=https://api.minimax.io
MINIMAX_T2A_MODEL=speech-2.8-turbo
MINIMAX_LANGUAGE_BOOST=Chinese
MINIMAX_AUDIO_FORMAT=mp3
MINIMAX_AUDIO_SAMPLE_RATE=32000
MINIMAX_AUDIO_BITRATE=128000
MINIMAX_VOICE_ID_PREFIX=ChineseEntry
MINIMAX_NEED_NOISE_REDUCTION=true
MINIMAX_NEED_VOLUME_NORMALIZATION=true
```

## Files

- Modify: `package.json`, `package-lock.json` — add `@vercel/blob`.
- Modify: `src/admin/voiceTypes.ts` — add optional sample content type / file name fields.
- Modify: `src/admin/api.ts` — forwards new fields automatically through typed input.
- Modify: `src/pages/AdminVoiceGenerationPage.tsx` — convert recorded browser sample to WAV and send `sampleAudioContentType: audio/wav`.
- Modify: `src/pages/AdminVoiceGenerationPage.test.tsx` — prove recorded sample sent to API is WAV/RIFF, not WebM text payload.
- Modify: `src/server/voice/storage.ts` — add Vercel Blob adapter, env resolver, base64 decoding, public URL return.
- Modify: `src/server/voice/provider.ts` — add MiniMax provider, env resolver, REST request/response validation, hex-to-base64 conversion.
- Modify: `src/server/voice/adminHttp.ts` — lazy resolver chooses real adapters only when env opts in.
- Modify: `src/server/voice/adminHttp.test.ts` — update body field expectations and lazy unconfigured/real-config behavior.
- Create: `src/server/voice/storage.test.ts` — TDD coverage for Blob storage adapter without real Blob calls.
- Create: `src/server/voice/provider.test.ts` — TDD coverage for MiniMax provider without real MiniMax calls.

---

### Task 1: Add type contract for supported voice sample uploads

**Files:**
- Modify: `src/admin/voiceTypes.ts`
- Modify: `src/server/voice/storage.ts`
- Test: `src/server/voice/storage.test.ts`

- [ ] **Step 1: Write failing storage contract tests**

Create `src/server/voice/storage.test.ts` with tests that import `createVercelBlobVoiceStorage` and `createVoiceStorageFromEnv`. The first test should call `saveVoiceSample({ sampleName: 'Authorized Mandarin sample', sampleAudioBase64: Buffer.from('riff bytes').toString('base64'), sampleAudioContentType: 'audio/wav' })` and assert the injected fake `put` receives a pathname under `voice/samples/`, `access: 'public'`, `contentType: 'audio/wav'`, and bytes equal to `riff bytes`. The second test should call `saveGeneratedAudio` with `audioBase64: Buffer.from('mp3').toString('base64')`, `contentType: 'audio/mpeg'`, `target.storageKey: 'audio/self-intro/line-01.mp3'`, and assert the fake `put` receives a pathname under `voice/generated/<profileId>/audio/self-intro/line-01.mp3` and returns its URL. The third test should assert `createVoiceStorageFromEnv({})` returns a disabled storage that rejects with `Voice sample storage is not configured`.

- [ ] **Step 2: Run the storage tests and verify RED**

Run: `npm test -- --run src/server/voice/storage.test.ts`

Expected: FAIL because `createVercelBlobVoiceStorage` and `createVoiceStorageFromEnv` do not exist.

- [ ] **Step 3: Implement storage types and Vercel Blob adapter**

Add optional `sampleAudioContentType?: string` and `sampleAudioFilename?: string` to `CreateAdminVoiceSampleProfileInput` and `SaveVoiceSampleInput`. Implement `createVercelBlobVoiceStorage(env, deps?)`, `createVoiceStorageFromEnv(env, deps?)`, base64 decoding, extension inference for `audio/wav`, `audio/mpeg`, `audio/mp4`, and generated audio saves. Keep `createDisabledVoiceStorage()` unchanged for missing/unsupported env.

- [ ] **Step 4: Run the storage tests and verify GREEN**

Run: `npm test -- --run src/server/voice/storage.test.ts`

Expected: all tests pass.

### Task 2: Add MiniMax provider adapter

**Files:**
- Modify: `src/server/voice/provider.ts`
- Test: `src/server/voice/provider.test.ts`

- [ ] **Step 1: Write failing MiniMax provider tests**

Create `src/server/voice/provider.test.ts` with tests that inject a fake `fetch`. The create-profile test should make fake fetch return source sample bytes, upload JSON `{ file: { file_id: 123 }, base_resp: { status_code: 0, status_msg: 'success' } }`, then clone JSON `{ base_resp: { status_code: 0, status_msg: 'success' } }`; assert the provider calls `/v1/files/upload`, then `/v1/voice_clone`, and returns a `profileId` that starts with `ChineseEntry_`. The generate test should return T2A JSON `{ data: { audio: Buffer.from('mp3 bytes').toString('hex'), status: 2 }, base_resp: { status_code: 0, status_msg: 'success' } }`; assert `generateReplacementAudio` returns base64 for `mp3 bytes` and `contentType: audio/mpeg`. Add one error test proving nonzero `base_resp.status_code` throws a user-facing MiniMax error.

- [ ] **Step 2: Run provider tests and verify RED**

Run: `npm test -- --run src/server/voice/provider.test.ts`

Expected: FAIL because `createMiniMaxVoiceCloneProvider` and `createVoiceCloneProviderFromEnv` do not exist.

- [ ] **Step 3: Implement MiniMax provider**

Implement `createMiniMaxVoiceCloneProvider(env, deps?)` and `createVoiceCloneProviderFromEnv(env, deps?)`. Fetch the Blob `sampleUrl`, upload it to MiniMax as multipart `purpose=voice_clone`, call `/v1/voice_clone` with a generated compliant `voice_id`, then call `/v1/t2a_v2` with `stream:false`, `output_format:'hex'`, `language_boost:'Chinese'`, `voice_setting.voice_id`, and `audio_setting` defaults for mp3 32kHz/128kbps/mono. Convert returned hex to base64. Do not log or expose `MINIMAX_API_KEY`.

- [ ] **Step 4: Run provider tests and verify GREEN**

Run: `npm test -- --run src/server/voice/provider.test.ts`

Expected: all tests pass.

### Task 3: Wire lazy production resolver and request body fields

**Files:**
- Modify: `src/server/voice/adminHttp.ts`
- Modify: `src/server/voice/adminHttp.test.ts`
- Modify: `api/admin/voice/samples.ts`
- Modify: `api/admin/voice/generate.ts`

- [ ] **Step 1: Write failing HTTP tests**

Extend `src/server/voice/adminHttp.test.ts` so `/samples` forwards `sampleAudioContentType` and `sampleAudioFilename` to storage. Add a lazy resolver test proving `createLazyAdminVoiceHttpHandlers({ CONTENT_ADMIN_USERNAME:'admin', CONTENT_ADMIN_PASSWORD:'secret' })` still returns 503 when voice env is missing. Add a factory-level test for `createAdminVoiceHttpHandlers` with fake services to prove the API body shape remains backward compatible when only `sampleAudioUrl` is provided.

- [ ] **Step 2: Run HTTP tests and verify RED**

Run: `npm test -- --run src/server/voice/adminHttp.test.ts`

Expected: FAIL on missing forwarded fields.

- [ ] **Step 3: Wire fields and env resolvers**

Pass `sampleAudioContentType` and `sampleAudioFilename` from request body into `storage.saveVoiceSample`. Replace lazy disabled injection with `createVoiceCloneProviderFromEnv(env)` and `createVoiceStorageFromEnv(env)` so real adapters are selected only when `VOICE_PROVIDER=minimax` and `VOICE_STORAGE_PROVIDER=vercel_blob`.

- [ ] **Step 4: Run HTTP tests and verify GREEN**

Run: `npm test -- --run src/server/voice/adminHttp.test.ts src/server/voice/storage.test.ts src/server/voice/provider.test.ts`

Expected: all tests pass.

### Task 4: Make browser recorder produce MiniMax-compatible WAV samples

**Files:**
- Modify: `src/pages/AdminVoiceGenerationPage.tsx`
- Modify: `src/pages/AdminVoiceGenerationPage.test.tsx`

- [ ] **Step 1: Write failing UI test**

Update the existing recorder test to install a fake `AudioContext` whose `decodeAudioData()` returns a mono 16kHz `AudioBuffer`-like object. After recording and clicking `Create voice profile`, assert the `/api/admin/voice/samples` body includes `sampleAudioContentType: 'audio/wav'`, `sampleAudioFilename` ending in `.wav`, and `sampleAudioBase64` beginning with `UklGR` (RIFF/WAV), not the old base64 for the WebM text chunk.

- [ ] **Step 2: Run UI test and verify RED**

Run: `npm test -- --run src/pages/AdminVoiceGenerationPage.test.tsx`

Expected: FAIL because recorded samples are still submitted as raw MediaRecorder WebM bytes.

- [ ] **Step 3: Implement WAV conversion**

Add small helpers in `AdminVoiceGenerationPage.tsx`: decode the recorded blob with `AudioContext`/`webkitAudioContext`, encode PCM16 WAV with RIFF header, create preview URL from the WAV blob, and set `sampleAudioContentType='audio/wav'` plus `sampleAudioFilename='recorded-mandarin-sample.wav'`. If WAV preparation fails, show `Unable to prepare a MiniMax-compatible WAV sample. Please upload an mp3, m4a, or wav file.` and keep profile creation disabled.

- [ ] **Step 4: Run UI test and verify GREEN**

Run: `npm test -- --run src/pages/AdminVoiceGenerationPage.test.tsx`

Expected: all tests pass.

### Task 5: Add dependency and run full verification

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install Vercel Blob SDK**

Run: `npm install @vercel/blob`

Expected: `package.json` and `package-lock.json` include `@vercel/blob`.

- [ ] **Step 2: Run focused voice verification**

Run: `npm test -- --run src/server/voice/storage.test.ts src/server/voice/provider.test.ts src/server/voice/adminHttp.test.ts src/pages/AdminVoiceGenerationPage.test.tsx src/admin/voiceTargets.test.ts src/lib/speech.test.ts src/components/SpeechButton.test.tsx`

Expected: all focused tests pass.

- [ ] **Step 3: Run admin e2e**

Run: `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`

Expected: admin smoke passes.

- [ ] **Step 4: Run full verification**

Run, in order:

```bash
npm test -- --run
npm run build
npm run lint
git diff --check
```

Expected: all commands exit 0; `git diff --check` prints no output.

### Task 6: Review handoff

**Files:**
- No code changes.

- [ ] **Step 1: Inspect diff for secrets/audio**

Run:

```bash
git status --short
git diff --stat
grep -R "MINIMAX_API_KEY\|BLOB_READ_WRITE_TOKEN\|Bearer " -n src api docs package.json package-lock.json || true
find . -path ./node_modules -prune -o \( -iname '*.mp3' -o -iname '*.wav' -o -iname '*.m4a' -o -iname '*.webm' \) -print
```

Expected: no real secrets and no committed audio sample/generated files.

- [ ] **Step 2: Commit and push branch**

Run:

```bash
git add package.json package-lock.json src docs/superpowers/plans/2026-07-31-minimax-blob-voice-provider.md
git commit -m "feat: connect voice generation to minimax and blob storage"
git push -u origin t42-minimax-blob-voice-provider
```

Expected: branch pushed for review.

- [ ] **Step 3: Report handoff**

Report exact branch, commit, verification output summary, and caveat that production real smoke still requires Vercel env/secret configuration for Blob and MiniMax.
