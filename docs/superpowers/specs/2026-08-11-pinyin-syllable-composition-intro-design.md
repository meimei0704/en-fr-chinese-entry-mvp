# Pinyin Syllable Composition Intro Design

**Date:** 2026-08-11

**Status:** User-approved design, pending written-spec review

**Loop thread:** `#dylan-s-test:ad36590f`

**Baseline:** latest `origin/main` at `b2d09e9`

## Summary

The Pinyin page will add one always-visible teaching card between the existing
`Pinyin（零基础第一课）` hero and the four module tabs. The card explains that a
complete Pinyin syllable contains an Initial, a Final, and a Tone, then uses
`mā / 妈` to show the decomposition `m + a + ¯`.

The card is static, localized for English and French, responsive, and built
from semantic HTML and CSS. It introduces no image asset, API request,
interaction, audio, progress state, or course-data dependency.

## Approved Decisions

The user approved all of the following:

- the card is page-level content, not part of Initials, Finals, Tones, or Whole
  Syllables;
- it appears after the Pinyin hero and before the four module tabs;
- it remains visible when any module is selected;
- English uses the supplied sentence exactly;
- French uses an equivalent localized sentence;
- the diagram is a static teaching visual with no audio, animation, or click
  behavior;
- the implementation uses semantic HTML/CSS rather than inline SVG or a
  raster image;
- the visual style follows the current Pinyin page's macaron colors, rounded
  surfaces, and flat information hierarchy;
- desktop uses a horizontal composition, while narrow screens stack the
  composition vertically.

## Goals

1. Explain the three components of a complete Pinyin syllable before learners
   choose a module.
2. Make the relationship concrete with the example `mā / 妈`.
3. Preserve the explanation across module changes.
4. Localize all explanatory labels for English and French learners.
5. Keep the diagram readable and free of horizontal overflow at desktop,
   390 px, and the product minimum of 320 px.
6. Preserve all existing Pinyin learning, audio, practice, and progress
   behavior.

## Scope Protection and Non-goals

This work does not:

- add, remove, rename, reorder, or otherwise change the four Pinyin modules;
- put the card inside one selected module or hide it when a tab changes;
- change `pkg/pinyincontent/data/pinyin_course.json`, the content API, seed
  data, or the TypeScript Pinyin course model;
- read the example from `lesson1.ts` or any runtime course payload;
- add or replace MP3 files, speech controls, recording, animation, or sound;
- change Pinyin reference cards, Whole Syllables cards, tone visuals, practice
  questions, completion rules, progress storage, or lesson actions;
- add a route, loading state, retry path, error message, analytics event, or
  persistent state;
- add an image, SVG file, icon package, font, or other asset dependency;
- refactor unrelated page, course, practice, admin, or backend code.

## Current Main-Branch Context

The design is grounded in these current paths:

- `src/pages/PinyinPage.tsx`
  - renders `PinyinHero`;
  - renders the four-button `.pinyin-lesson-tabs` tablist;
  - selects module content with `selectedModuleKey`;
  - renders `PinyinReferenceSection` or
    `PinyinWholeSyllablesSection`;
  - owns the existing loading and error returns.
- `src/components/pinyin/PinyinHero.tsx`
  - renders the current page hero.
- `src/content/copy.ts`
  - contains parallel English and French `pinyinPage` copy.
- `src/styles/global.css`
  - contains the Pinyin page layout and the existing Initials, Finals, Tones,
    and Whole Syllables tab palettes.
- `src/pages/PinyinPage.test.tsx`
  - covers page localization, module changes, audio, progress, loading, and
    error behavior.
- `tests/e2e/pinyin-zone.spec.ts`
  - covers the Pinyin route, module switching, audio, practice, and progress
    behavior.

The new card must be rendered directly after `PinyinHero` and before the
tablist. It must not be placed inside either branch of the selected-module
renderer.

## Exact Copy and Static Example

### Visible copy

| Purpose | English | French |
| --- | --- | --- |
| Description | `A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.` | `Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.` |
| Diagram heading | `Pinyin` | `Pinyin` |
| Initial label | `Initial` | `Initiale` |
| Final label | `Final` | `Finale` |
| Tone label | `Tone` | `Ton` |

The visible example is language-independent:

| Role | Value |
| --- | --- |
| Complete syllable | `mā` |
| Hanzi example | `妈` |
| Initial value | `m` |
| Final value | `a` |
| Tone value | `¯` |

`mā` is deliberately the first-tone syllable for `妈`. The unmarked `ma`
neutral-tone form must not be substituted. The Tone value is the horizontal
macron glyph `¯`, not a hyphen-minus `-`, numeric `1`, or the word
`first`.

### Accessible diagram name

The localized copy object also supplies an accessible description:

- English:
  `Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.`
- French:
  `Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.`

This description names the relationship without relying on color or arrow
geometry.

## Component and Data Boundary

Add a presentational component:

`src/components/pinyin/PinyinSyllableIntro.tsx`

It receives localized strings from `PinyinPage`; it does not load content or
progress itself. A compact prop contract may group the copy, but the component
must not accept a Pinyin course module or content-provider result.

The component owns the fixed example values `mā`, `妈`, `m`, `a`, and `¯`.
This intentionally avoids coupling a page-level explanation to lesson data
whose content or load state may change independently.

Add the description, diagram labels, and accessible diagram name under the
existing English and French `pinyinPage` copy objects in
`src/content/copy.ts`. Do not duplicate localized strings as JSX literals.

`PinyinPage` passes the active language's copy to the component and renders it
in this order:

```text
main.pinyin-page
└── div.pinyin-page__content
    ├── PinyinHero
    ├── PinyinSyllableIntro
    ├── nav.pinyin-lesson-tabs [role=tablist]
    ├── selected module content
    └── nav.lesson-actions
```

Because the current page returns its loading or error UI before this tree, the
new card follows the existing loading/error behavior. No new fallback is
needed.

## Semantic Structure

The teaching card is one `figure` with the existing `surface-card` visual
primitive and a dedicated `.pinyin-syllable-intro` class.

Its intended DOM outline is:

```text
figure.surface-card.pinyin-syllable-intro
├── figcaption.pinyin-syllable-intro__description
└── div.pinyin-syllable-intro__diagram
    ├── div.pinyin-syllable-intro__example
    │   ├── span.pinyin-syllable-intro__pinyin  mā
    │   └── span.pinyin-syllable-intro__hanzi   妈
    ├── span.pinyin-syllable-intro__arrow [aria-hidden=true]  →
    └── div.pinyin-syllable-intro__composition
        ├── span.pinyin-syllable-intro__heading  Pinyin
        └── dl.pinyin-syllable-intro__parts
            ├── div.pinyin-syllable-intro__part--initial
            │   ├── dt  Initial / Initiale
            │   └── dd  m
            ├── div.pinyin-syllable-intro__part--final
            │   ├── dt  Final / Finale
            │   └── dd  a
            └── div.pinyin-syllable-intro__part--tone
                ├── dt  Tone / Ton
                └── dd  ¯
```

The `figure` receives the localized accessible diagram name. The
`figcaption`, `dt`, and `dd` text remains real DOM content. The decorative
arrow is excluded from the accessibility tree.

No element has button, link, tab, click, focus, or hover semantics. The card
does not add a keyboard stop.

## Visual and Responsive Contract

### Shared treatment

- Use the existing card radius, border, surface, ink, and muted-text tokens.
- Do not add a second nested surface around the entire diagram.
- Do not use heavy shadows, gradients that compete with the hero, animation,
  or progress styling.
- Keep the description visually first and left-aligned.
- Make `mā` and `妈` the largest content in the example tile.
- Use the existing Whole Syllables purple palette for the spanning `Pinyin`
  heading.
- Use the existing tab palettes for the three parts:

| Part | Background | Foreground |
| --- | --- | --- |
| Initial | `#fff3e0` | `#c2571c` |
| Final | `#e8f5e9` | `#2e7d32` |
| Tone | `#e3f2fd` | `#1565c0` |
| Pinyin heading | `#f3e5f5` | `#6a1b9a` |

The printed labels and values remain present in every colored block, so color
is reinforcement rather than the sole carrier of meaning.

### Desktop and tablet

The diagram uses three horizontal areas:

1. example tile;
2. decorative right arrow;
3. composition block.

The composition block contains a full-width Pinyin heading and three
equal-width part columns. Grid children use `min-width: 0`; sizing is
content-driven rather than fixed-height.

### Narrow screens

At the existing narrow-screen breakpoint, or a dedicated breakpoint no wider
than 640 px:

- the example, arrow, and composition block stack vertically;
- the arrow rotates to point down;
- the three part columns remain a three-column row only when they fit without
  shrinking or clipping labels; otherwise they may stack as three full-width
  rows;
- the card stays within the page shell at 390 px and 320 px;
- no visible text is clipped, ellipsized, or broken inside a word;
- `document.documentElement.scrollWidth` does not exceed the viewport width.

The implementation must not use a fixed width copied from the reference
image.

## Error Handling and State

The component is static and cannot enter an independent loading, empty,
success, or failure state.

- When the Pinyin course is loading, the current `ContentLoading` return
  remains unchanged.
- When the Pinyin course fails, the current error card and retry action remain
  unchanged.
- When the course is available, the intro card renders before the tabs.
- Switching tabs changes only selected module content; it does not recreate a
  second intro card or modify its content.

No local storage, progress record, provider contract, or network request is
added.

## Testing and Acceptance

### Vitest

Extend `src/pages/PinyinPage.test.tsx` to prove:

1. the exact English description and all English labels render;
2. `mā`, `妈`, `m`, `a`, and `¯` render in the intended figure;
3. document order is hero, intro figure, then tablist;
4. only one intro figure exists;
5. the same figure remains visible after switching among all four tabs;
6. French selection renders the exact French description, `Initiale`,
   `Finale`, and `Ton`, while the fixed example remains unchanged;
7. existing loading and error tests remain valid.

If the component contains nontrivial rendering branches, add a focused
component test. Do not duplicate page-level assertions merely to increase test
count.

### Browser verification

Extend `tests/e2e/pinyin-zone.spec.ts` rather than adding an unrelated new
suite. Cover:

- English and French visible copy;
- hero → intro → tablist order;
- one persistent card while each module is selected;
- desktop horizontal composition;
- 390 px and 320 px stacked composition;
- no horizontal overflow at 390 px or 320 px in both languages;
- complete visible text with no clipping at 320 px.

Capture review screenshots at one desktop viewport and at 390 px or 320 px so
the reviewer can inspect palette reuse, hierarchy, wrapping, and arrow
direction. The screenshots are review evidence, not committed product assets.

### Regression commands

At implementation closeout, run at minimum:

```bash
npm test -- --run
npm run lint
npm run build
npm run test:e2e -- tests/e2e/pinyin-zone.spec.ts
go test ./...
```

The reviewer must also confirm no files outside the approved frontend
component, page, copy, styles, and directly related tests changed.

## Delivery Gate

Implementation begins only after the user approves this written spec and the
owner publishes a detailed implementation plan.

The implementation gate closes when:

- the implementer posts the branch and exact commit;
- all required verification is green;
- desktop and mobile screenshots are available for review.

The review gate closes only when the assigned reviewer posts `pass` or
`fix required` against the exact implementation commit.
