# Chinese pronunciation audio assets

These MP3 files are used by the lesson Chinese pronunciation buttons. They replace the earlier zero-byte placeholders so the app can play stable audio files before falling back to browser Web Speech TTS.

Current batch:
- Generated on 2026-07-24 for #t24 / #t25, extended on 2026-07-25 for #t27 material and practice prompts, and expanded on 2026-07-25 for #t33 lessons 6-10.
- Voice: `zh-CN-XiaoxiaoNeural`.
- Rate: `-8%`.
- Encoding: MP3 (MPEG Layer III), 48 kbps, 24 kHz, mono.
- Baseline coverage: 182 course files after the original Lesson 1 Arrival sample refresh; 90 files belong to lessons 6-10.
- On 2026-08-07, the expanded Arrival lesson (`self-intro`) was synchronized to all 35 of its current playback paths. Six stale dialogue files were replaced, 15 missing files were added, and the 14 already-correct files were retained byte-for-byte. The checked-in course-audio inventory is now 197 files.
- On 2026-08-09, the course was expanded to 12 lessons. Two new lessons (`daily-greetings`, `small-talk`) were added with full audio (line/pattern/vocab/practice), and the `self-intro` content was replaced with the approved arrival sentences, regenerating its 31 playback paths. The course-audio inventory is now 359 files.
- On 2026-08-11, the useful-patterns text for 8 lessons was aligned with the approved 0810 copy. All 40 `pattern-*.mp3` files were regenerated to match the new example text, and 9 vocabulary files were added (`train-station-ticket/vocab-11..15.mp3`, `metro-ticket/vocab-11..14.mp3`) for the newly added station/metro words. The course-audio inventory is now 368 files.
- On 2026-08-11, the remaining 2 lessons (`pharmacy-help`, `small-talk`) were aligned with the full 0810 copy. All 10 `pattern-*.mp3` files were regenerated to match the new example text, and 1 vocabulary file was added (`pharmacy-help/vocab-11.mp3` = 医院) for the newly added hospital word. The small-talk lesson title was updated to `闲聊和赞美 / Small talk and compliment`. The course-audio inventory is now 369 files.

Pinyin course (`public/audio/pinyin/`):
- Regenerated on 2026-08-07 to fix pronunciation: each MP3 is synthesized from the hanzi whose reading matches the intended pinyin syllable (e.g. `reference-initial-b.mp3` = 波, `reference-tone-1.mp3` = 妈), so the default TTS voice never reads Latin pinyin as English.
- Covers all 73 referenced paths across `src/content/pinyin/lesson1.ts`, `lesson2.ts`, and `lesson3.ts`.
- Orphaned files (old `shadow-*` and legacy `tone-game-*` assets no longer referenced by course content) were removed.
- On 2026-08-09, the 16 whole-recognition syllables (整体认读音节) were added under `whole-syllables/`: each MP3 is synthesized from its example hanzi (zhi→知, chi→吃, shi→十, ri→日, zi→子, ci→词, si→四, yi→一, wu→五, yu→鱼, ye→夜, yue→月, yuan→圆, yin→音, yun→云, ying→英) with the same `zh-CN-XiaoxiaoNeural` voice and `-8%` rate.
- On 2026-08-09, the reference cards switched to common concrete-noun examples (f→饭 fàn, d→蛋 dàn, n→牛 niú, etc.) with complete tone-marked pinyin. The 27 affected `reference-*.mp3` files were regenerated from their new hanzi; the remaining files were unchanged. Paths and naming are unchanged.
- On 2026-08-11, all 23 `reference-initial-*.mp3` files were regenerated to play the initial's own call sound (呼读音) instead of the example word, so every initial card sounds consistent (b→波 bō, d→得 dé, zh→知 zhī, …). Card data (example hanzi/pinyin) is unchanged; only the audio content changed, paths and naming are unchanged. Note: f/d/t/n/l/r call sounds use their standard non-first-tone readings (佛 fó / 得 dé / 特 tè / 讷 nè / 勒 lè / 日 rì) because no first-tone syllables exist for those initials.
- On 2026-08-12, all 24 Finals reference MP3s were replaced by the reviewed standalone final sounds (`a/o/e/i/u/ü`, 9 compound finals, 5 `-n` finals, and 4 `-ng` finals). They use `zh-CN-XiaoxiaoNeural`, a slower source rate, normalized mono MP3 output, and a level first-tone contour. Existing paths remain unchanged; card pinyin now shows each standalone final in first tone instead of an example word.

**Contracts**:
- The 23 `reference-initial-*.mp3` files MUST play the initial's own call sound (呼读音), never the example word; card example hanzi (八/跑/哥 …) are display-only and must not be read into these files. Their live sha256 is locked by `public/audio/pinyin/reference-initial.sha256`.
- The 24 `reference-final-*.mp3` files MUST play the standalone Finals sound in a stable first tone, matching the Finals card label rather than a full example-word reading. Their live sha256 is locked by `public/audio/pinyin/reference-final.sha256`.
- Both manifests are enforced by `src/content/pinyin/course.test.ts`; editing a contracted file without updating the matching manifest turns the test red.

If these assets are regenerated, keep the existing content paths unless a coordinated content/test update changes the naming convention.
