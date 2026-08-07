# Chinese pronunciation audio assets

These MP3 files are used by the lesson Chinese pronunciation buttons. They replace the earlier zero-byte placeholders so the app can play stable audio files before falling back to browser Web Speech TTS.

Current batch:
- Generated on 2026-07-24 for #t24 / #t25, extended on 2026-07-25 for #t27 material and practice prompts, and expanded on 2026-07-25 for #t33 lessons 6-10.
- Voice: `zh-CN-XiaoxiaoNeural`.
- Rate: `-8%`.
- Encoding: MP3 (MPEG Layer III), 48 kbps, 24 kHz, mono.
- Baseline coverage: 182 course files after the original Lesson 1 Arrival sample refresh; 90 files belong to lessons 6-10.
- On 2026-08-07, the expanded Arrival lesson (`self-intro`) was synchronized to all 35 of its current playback paths. Six stale dialogue files were replaced, 15 missing files were added, and the 14 already-correct files were retained byte-for-byte. The checked-in course-audio inventory is now 197 files.

Pinyin course (`public/audio/pinyin/`):
- Regenerated on 2026-08-07 to fix pronunciation: each MP3 is synthesized from the hanzi whose reading matches the intended pinyin syllable (e.g. `reference-initial-b.mp3` = 波, `reference-tone-1.mp3` = 妈), so the default TTS voice never reads Latin pinyin as English.
- Covers all 73 referenced paths across `src/content/pinyin/lesson1.ts`, `lesson2.ts`, and `lesson3.ts`.
- Orphaned files (old `shadow-*` and legacy `tone-game-*` assets no longer referenced by course content) were removed.

If these assets are regenerated, keep the existing content paths unless a coordinated content/test update changes the naming convention.
