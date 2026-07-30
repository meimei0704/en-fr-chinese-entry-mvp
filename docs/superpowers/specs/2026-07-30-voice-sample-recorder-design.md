# Voice Sample Recorder Design

## Goal
Add an in-browser voice sample capture flow to `/admin/voice` so the admin can record a clear self-authorized Mandarin sample without preparing an audio file first, then use that recording to create the existing voice profile for batch generation.

## Scope
- Add a browser microphone recorder to the existing Authorized voice profile step.
- Keep the current Voice sample URL and file upload inputs as fallback paths.
- Use the existing `/api/admin/voice/samples` profile API by sending the recorded audio as `sampleAudioBase64`.
- Continue applying generated audio only to the existing 179 zh-CN targets through the existing batch pipeline.

## Non-goals
- Do not add a real voice clone provider or object storage configuration.
- Do not commit recorded samples or generated audio.
- Do not add English/French audio targets.
- Do not force exact transcript matching for the spoken sample.

## Product behavior
The page shows a “Record voice sample” card with recording guidance and a recommended Mandarin prompt. The copy explains that the prompt is recommended, not mandatory: users may read their own Mandarin content, but should speak clearly in a quiet environment for about 30–60 seconds, using natural speed and no background music.

The recorder is consent-gated. Before consent, Start recording is disabled. After consent, the admin can start recording, stop recording, preview the captured audio, discard/re-record, and then create the voice profile. When a recording is present, the existing Create voice profile button becomes enabled even if no URL/file was supplied.

## Technical behavior
- Use `navigator.mediaDevices.getUserMedia({ audio: true })` and `MediaRecorder` when available.
- Store chunks in memory only.
- On stop, combine chunks into a `Blob`, create an object URL for preview, and convert the blob to base64 for `sampleAudioBase64`.
- Stop all media tracks after recording ends or errors.
- Show clear errors for unsupported browsers, denied microphone permission, and empty recordings.
- Clear recorded sample state when re-recording or discarding.

## Testing
- Unit/UI tests cover recommended prompt copy, consent gating, successful record/stop/profile creation with base64, re-record/discard behavior, and microphone unsupported/permission error states.
- E2E smoke checks the `/admin/voice` recorder UI is present and still supports the batch generation flow via existing URL fallback.
- Existing server tests remain unchanged because the samples API already accepts `sampleAudioBase64` and enforces auth/consent.
