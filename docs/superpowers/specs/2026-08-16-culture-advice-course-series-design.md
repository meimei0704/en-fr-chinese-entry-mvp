# Culture Advice as Course Series Third Course — Design

Date: 2026-08-16
Status: Approved by user (@Dylan, 2026-08-16)

## Problem

The homepage `course-series` block currently exposes two peer courses: the
Pinyin course (拼, route `/pinyin`) and the Journey course (旅, anchored
journey map on the homepage). The user wants "Culture advice for travelers in
China" promoted to a full third course in the series (第一部分 pinyin,
第二部分 旅程, 第三部分 文化), styled after the Pinyin course's tab UI, with UI
polish. The culture content already exists (`src/content/cultureAdvice.ts`,
7 sections, en official + fr placeholder) and is currently rendered as an
accordion on the homepage.

## Requirements

1. Homepage `course-series` gains a third entry card (文) labeled as the
   Culture course, linking to a new `/culture` route.
2. New `/culture` page follows the Pinyin page structure:
   - hero header card (`pinyin-hero`-style),
   - a `tablist` of pill tabs (`pinyin-lesson-tabs`-style) with number badges
     ①–⑦, one per culture section,
   - active tab renders that section's content (numbered / bulleted lists,
     bold lead-ins, nested sub-items),
   - back-to-home action dock.
3. UI polish (optimization) on top of the Pinyin reference:
   - tabs reuse the A2 teal `--color-primary-*` tokens for the selected state
     (keeps the unified primary color system intact — no separate warm-gold
     tab palette, per t1 review; differentiation comes from the entry-card
     badge/icon and the hero subtitle);
   - each section's content renders inside a card using the A1/B4 card
     tokens (`--radius-card`, `--shadow-card`, hover lift), consistent with
     lesson/content cards;
   - the course-series entry card and hero use a warm gold/cinnabar-gold
     accent anchored on `--color-gold` (#f3a53f) so the Culture course reads
     as distinct from Pinyin (teal) and Journey (cinnabar) without touching
     the primary tab system.
4. Content reuse: consume `src/content/cultureAdvice.ts` unchanged; no data
   schema changes, no changes to lesson/pinyin/course data.

## Open questions (resolved)

1. **Homepage accordion fate**: **Remove** the homepage `CultureAdvice`
   accordion; content moves to `/culture`; homepage keeps only the entry card.
2. **Route name**: **`/culture`**.
3. **Tab accent color**: keep the A2 teal `--color-primary-*` for tab active
   state (preserves the unified primary system; do not start a separate warm
   tab palette). Only the entry-card badge/icon and hero subtitle carry a
   warm gold accent for course distinction. (t1 review alignment.)
4. **Tab count**: keep all **7** tabs (badges ①–⑦), one per section.

## Data model

No changes. Reuse:

- `src/content/cultureAdvice.ts` — `cultureAdvice` (title + 7 sections of
  type `CultureAdviceSection`, each with `kind: 'numbered' | 'bulleted'`,
  `items` of `CultureAdviceItem` with optional `lead`/`subItems`).
- `getLocalizedText` for en/fr.

## Component / routing changes (proposed)

- New `src/pages/CulturePage.tsx`: hero + `nav[role=tablist]` (7 tabs) +
  active section content card + back action. Local component state for the
  active tab (like `PinyinPage`'s `selectedModuleKey`), defaulting to the
  first section.
- New `src/components/culture/` folder only if needed for extraction;
  otherwise keep single-page markup to match `PinyinPage`'s flat structure.
- `src/app/router.tsx`: add `{ path: '/culture', element: <CulturePage /> }`.
- `src/pages/HomePage.tsx`: replace `CultureAdvice` with a
  `course-series__culture-link` entry card in the `course-series__list`
  (panelled like the pinyin panel), or keep accordion + add card depending on
  open question 1.
- `src/content/copy.ts`: add `courseSeries.cultureTitle` (en/fr) and culture
  page UI copy keys (tab label, section headings derive from content data).
- `src/styles/global.css`: `.course-series__culture-link`,
  `.culture-course-*` (hero/tab/content card), reusing A1/A2/B4 tokens.

## Accessibility

- Tabs use `role=tablist`/`role=tab`/`aria-selected`/`aria-controls` +
  `role=tabpanel`, matching the Pinyin tab implementation.
- Content cards respect `prefers-reduced-motion` (inherited B4 guard).
- Keep keyboard operable; hover/focus lift only as enhancement.

## Verification

- build, vitest (new tests for `CulturePage`, updated `HomePage` test),
  oxlint, e2e home + culture.
- Review gate before push/deploy, per batch workflow.
