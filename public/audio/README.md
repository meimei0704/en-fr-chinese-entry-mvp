# Chinese pronunciation audio assets

These MP3 files are used by the lesson Chinese pronunciation buttons. They replace the earlier zero-byte placeholders so the app can play stable audio files before falling back to browser Web Speech TTS.

Current batch:
- Generated on 2026-07-24 for #t24 / #t25, then extended on 2026-07-25 for #t27.
- Voice: `zh-CN-XiaoxiaoNeural`.
- Rate: `-8%`.
- Coverage: all current `DialogueLine.audio`, `SentencePattern.audio`, `VocabularyItem.audio`, `PronunciationTip.audio`, and `ShortInputPrompt.audio` paths under `src/content/lessons/*.ts` (74 files after the #t27 material-audio extension).

If these assets are regenerated, keep the existing content paths unless a coordinated content/test update changes the naming convention.
