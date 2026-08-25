# Practice Option Flow Layout Design

**Date:** 2026-08-25  
**Scope:** PR #77, `PracticeChallenge` option and prompt audio layout

## Goal

Make practice answers readable at every supported width:

- short options may share a row;
- wider options receive more horizontal room and wrap to another row when the available space is insufficient;
- very wide options are capped to the container and wrap internally instead of overflowing;
- option audio controls are visually secondary and no larger than `1.75rem` (28px);
- the prompt audio control always remains to the right of the prompt text in the same flex row.

The existing A/B/C/D badges, answer behavior, audio behavior, feedback animation, and reduced-motion behavior remain unchanged.

## Chosen Approach

Use CSS intrinsic sizing rather than JavaScript character-count classes.

`.practice-challenge__options` becomes a wrapping flex container. Each
`.practice-challenge__option` uses its rendered max-content width as its flex basis, with:

- a practical minimum width for short options;
- `max-width: 100%` for long options;
- no shrinking into a narrow, fragmented pill;
- normal wrapping to a new row when the row lacks space.

This lets the browser account for actual Chinese, pinyin, English, and French glyph widths. It avoids brittle `short`/`medium`/`long` thresholds. Options are not forced to a new row merely because they cross an arbitrary character count; they move when their rendered content no longer fits the available row.

## Component and Interaction Design

The existing sibling-button semantics remain:

1. the answer `<button>` occupies all card space except the audio control;
2. the `SpeechButton` remains a separate sibling button;
3. clicking the answer submits it;
4. clicking audio only plays pronunciation and cannot submit the answer.

The option wrapper becomes one visually unified pill/card with two functional regions. This avoids invalid nested buttons and prevents overlapping click targets.

No answer, sound, feedback, or completion state logic changes are required.

## Visual Layout

### Options

- The wrapper supplies the shared border, background, radius, and hover/focus surface.
- The answer button uses a transparent internal surface and `min-width: 0`.
- The A/B/C/D badge remains at the leading edge.
- Label and pinyin may wrap normally; long unbroken content uses safe overflow wrapping.
- The audio button sits at the trailing edge, vertically centered.
- The audio control is `1.75rem` square with a `0.78rem`–`0.8rem` icon.
- Gaps and padding are tightened so audio does not dominate the card.

At wide widths, multiple short options can share one row. As intrinsic widths or the viewport grow tighter, options wrap in source order. At 390px and 320px, options may naturally become one card per row.

### Prompt

The prompt remains a non-wrapping flex row:

- the text region is flexible, `min-width: 0`, and may wrap internally;
- the audio button is non-shrinking and stays at the trailing edge;
- both regions are vertically centered;
- long text cannot push the audio button onto a second flex line.

## Responsive and Overflow Rules

- Option wrappers use `max-width: 100%`.
- Answer buttons and text spans use `min-width: 0`.
- Long tokens receive safe wrapping rather than page overflow.
- Source order and A/B/C/D order remain identical at every width.
- No `grid-auto-flow: dense` or visual reordering is used.

## Accessibility

- Existing accessible audio labels remain unchanged.
- A/B/C/D stays `aria-hidden`, so it does not pollute the answer name.
- Answer and audio controls remain separate native buttons with independent focus.
- Focus styling applies to the unified wrapper through `:focus-within`.
- Reduced-motion guards are untouched.

## Verification

### Automated

- Update CSS unit assertions for the wrapping intrinsic-width container, long-item bounds, smaller audio control, and inline prompt.
- Keep component tests proving A/B/C/D rendering and separate answer/audio controls.
- Extend Playwright coverage across 1280, 760, 390, and 320 widths:
  - no document or option overflow;
  - prompt audio remains to the right of prompt text;
  - option audio is at most 28px and vertically centered;
  - source order is unchanged;
  - short and long content can wrap into the browser-selected row count.
- Run focused tests, full unit tests, oxlint, `tsc -b`, and the existing practice/pinyin E2E suites.

### Manual

Inspect representative short, mixed, and long option sets in the practice flow at all four widths. Confirm that audio clicks never submit an answer and answer clicks still trigger feedback and sound.

## Non-Goals

- No practice content changes.
- No scoring, feedback, sound synthesis, or animation changes.
- No global `SpeechButton` size changes outside practice options.
- No JavaScript text measurement or localization-specific length heuristics.
