# Vertical Equal Course-Series Entry Cards Design

**Date:** 2026-08-07
**Status:** User-approved design, pending written-spec review
**Loop task:** #t53
**Baseline:** latest `origin/main` at `d95a507`

## Summary

Home and Progress will present the two course-series entries as two vertically stacked peer cards:

1. Pinyin;
2. Basic expressions.

The existing ten-lesson Basic expressions Journey path will render below both entry cards. The Pinyin card remains a full-card React Router `Link` to `/pinyin`. The Basic expressions card becomes a full-card native same-page `<a>` whose fragment target is that page's Journey path. Both cards are keyboard focusable and have the same rendered width and height on their page in either language at every supported viewport.

Equal height is content-safe. A shared CSS Grid owns the two entry rows and sizes them as equal flexible tracks with intrinsic minimums. The taller localized/state-specific card determines both row sizes. No fixed pixel `height` or fixed pixel `min-height` is applied to an entry card, so English, French, and Progress counts can increase the pair's height without clipping.

This is a presentation and in-page navigation change only. It preserves the #t45 peer-series hierarchy, data, copy, routes, and independent progress behavior and leaves the #t46 Home hero unchanged.

## Approved Outcome

The approved option B is final and has no remaining product choices:

- both Home and Progress use the same sequence: Pinyin entry, Basic expressions entry, then the Basic expressions Journey path;
- the two entries are equal-size peers rather than a narrow Pinyin panel beside a large Journey container;
- Home entries show no progress counts;
- Progress entries retain independent Pinyin sections-out-of-3 and Basic expressions lessons-out-of-10 counts;
- Pinyin navigates to `/pinyin`;
- Basic expressions jumps to the Journey path on the current page without JavaScript scrolling;
- English and French titles wrap at whole-word boundaries;
- the same structure remains usable at desktop, 1024 px, 390 px, and the product minimum of 320 px.

## Current Main-Branch Context and Planned Addition

The design is grounded in these current code paths and selectors, plus the one explicitly marked
new renderer:

- `src/pages/HomePage.tsx`
  - renders `.course-series`, `.course-series__list`, the Pinyin peer section, and the Home `.journey-map__path`;
  - obtains all series copy through `getUiCopy(language)`;
  - maps the existing `journeyNodes` directly to lesson links.
- `src/pages/ProgressPage.tsx`
  - renders the same peer-series shell and `.progress-journey-map__path`;
  - obtains Pinyin progress from `loadPinyinProgress()` and Journey progress from `loadProgress()`;
  - computes Pinyin progress against `3` sections and Basic progress against the ten lesson Journey nodes.
- `src/styles/global.css`
  - owns the shared `.course-series*` styles, current two-column `.course-series__list`, entry focus treatment, Home Journey layout, Progress Journey layout, and responsive rules.
- `src/components/CourseSeriesTitle.tsx` (new, course-series-only)
  - will render the exact shared title string as whitespace plus nonbreaking whole-token spans, so explicit hyphens such as the one in `stress-free` cannot become line-break opportunities.
- `src/pages/HomePage.test.tsx` and `src/pages/ProgressPage.test.tsx`
  - pin the peer hierarchy, exact localized copy, ten Journey destinations/order, and independent Progress totals.
- `src/styles/global.test.ts`
  - pins the current shared course-series CSS contract.
- `tests/e2e/course-series.spec.ts`
  - covers localization, peer semantics, focus, mobile wrapping/overflow, path membership, and 3-versus-10 progress.
- `tests/e2e/home-page.spec.ts`
  - covers the #t46 hero and existing Home Journey responsive geometry at 1440, 1024, 390, and 320 px.

The current side-by-side declaration
`grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr)` and the Pinyin link's `min-height: 10rem` are replaced by the content-driven vertical-entry contract below.

## Goals

1. Make the two peer course entries equally prominent on both Home and Progress.
2. Put both entry cards before the Basic expressions Journey path in DOM and visual order.
3. Guarantee equal rendered entry width and height for every page/language/approved-viewport combination without a clipping-prone fixed height.
4. Make the complete Pinyin surface navigate to `/pinyin`.
5. Make the complete Basic expressions surface a native same-page fragment link to its path.
6. Preserve Home's count-free course-entry presentation.
7. Preserve Progress's independent sections-out-of-3 and lessons-out-of-10 presentation.
8. Keep both localized titles readable, naturally wrapped, and unbroken within words.
9. Preserve all #t45 hierarchy/data/content behavior and all #t46 hero behavior.

## Scope Protection and Non-goals

This work does not:

- change any string in `src/content/copy.ts`;
- add, remove, reorder, relabel, or redirect any item in `course.lessons`, `journeyNodes`, or `journeyNodeIcons`;
- change the ten Journey lesson destinations;
- change `/`, the `/home` redirect, `/pinyin`, `/progress`, or any lesson route in `src/app/router.tsx`;
- change `LearnerProgress`, `PinyinProgress`, either storage key, validation, default state, completion rule, or persistence behavior;
- combine Pinyin and Journey progress or alter the `/3` and `/10` denominators;
- change lesson, Pinyin, practice, review, admin, or voice content;
- change `HomeHeroIllustration`, the supplied WebP asset, the Home hero DOM, copy, language switcher, illustration geometry, opacity, veil, clipping, or responsive rules from #t46;
- add an accordion, disclosure, expand/collapse state, tabs, carousel, a new route, or hidden course content;
- add smooth-scroll JavaScript, a click handler for fragment navigation, scroll persistence, or new storage;
- add loading, empty, retry, toast, or error UI;
- refactor unrelated Journey cards or shared page primitives;
- change package, TypeScript, Vite, Vitest, Playwright, or deployment configuration.

The implementation is limited to the Home/Progress course-series markup, one course-series title
renderer, shared course-series CSS, and the directly corresponding tests.

## Copy, Data, and Destination Invariants

### Exact shared visible copy

| Purpose | English | French |
| --- | --- | --- |
| Series group | `Course series` | `Séries de cours` |
| Pinyin entry | `Mandarin tones and pinyin` | `Tons et pinyin du mandarin` |
| Basic entry | `Basic Chinese expressions for a stress-free journey` | `Expressions chinoises essentielles pour voyager sereinement` |

The implementation continues to read these values from `copy.courseSeries`. It does not duplicate
them as JSX literals and does not add an entry subtitle, localized CTA label, new count label, or
Journey introduction. A shared `CourseSeriesTitle` renderer receives the unmodified string and
splits it only for layout; it does not substitute, normalize, or translate any character. Progress
retains its existing localized progress sentences. Directional `→` / `↓` glyphs are decorative and
`aria-hidden`, so they require no new copy.

### Data and route invariants

- `journeyNodes` remains exactly ten `kind: 'lesson'` entries with `pathOrder` 1 through 10.
- Home continues to use `journeyNodes` order and the existing `/lesson/${node.lessonId}` destinations.
- Progress continues to use `orderedJourneyNodes`, the existing status calculation, and the same lesson destinations.
- Pinyin remains outside Journey data and mastery.
- The Pinyin destination remains `/pinyin`.
- Basic expressions receives no route. Its link destination is a page-local fragment only.
- The fragment target IDs are stable, non-localized, and unique:
  - Home: `home-basic-expressions-path`;
  - Progress: `progress-basic-expressions-path`.

## Final Information Architecture

Each page retains one localized course-series region and two direct, semantic peer sections:

1. Pinyin section;
2. Basic expressions section.

The Pinyin section contains its entry card. The Basic expressions section contains, in this order:

1. its entry card;
2. its existing Journey path.

Because the Pinyin section precedes the Basic section, and because the Basic entry precedes its path, the complete document order is:

1. `Course series` / `Séries de cours` label;
2. Pinyin card;
3. Basic expressions card;
4. first through tenth Journey cards.

CSS Grid must not visually reorder these items. Keyboard and screen-reader traversal therefore match the displayed top-to-bottom order.

## Architecture and DOM

### Shared structural contract

Home and Progress retain the current `.course-series`, `.course-series__label`,
`.course-series__list`, `.course-series__panel`, `.course-series__panel--pinyin`, and
`.course-series__panel--journey` hooks. The sections remain siblings at the same DOM depth, preserving #t45 semantics.

The rendered card surface moves to a shared `.course-series__entry-card` class. The current
`.course-series__pinyin-link` remains on the Pinyin card for route-specific styling and existing test continuity. A new `.course-series__journey-link` identifies the native fragment card.

The intended Home shape is shown below as a DOM outline. The final line denotes the ten links
produced by the current `journeyNodes` mapping, not a new abstraction or component:

```text
section.page-grid.course-series [aria-label = localized series-group copy]
├── p.eyebrow.course-series__label
└── div.course-series__list
    ├── section.course-series__panel.course-series__panel--pinyin
    │   └── Link.course-series__entry-card.course-series__pinyin-link [to = /pinyin]
    │       ├── span.course-series__pinyin-mark [aria-hidden = true]
    │       ├── h2#home-pinyin-series-title.course-series__title
    │       │   └── non-space spans.course-series__title-token + original whitespace text nodes
    │       └── span.course-series__entry-cue [aria-hidden = true] →
    └── section.course-series__panel.course-series__panel--journey
        ├── a.course-series__entry-card.course-series__journey-link
        │   [href = #home-basic-expressions-path]
        │   ├── span.course-series__journey-mark [aria-hidden = true] 旅
        │   ├── h2#home-journey-series-title.course-series__title
        │   │   └── non-space spans.course-series__title-token + original whitespace text nodes
        │   └── span.course-series__entry-cue [aria-hidden = true] ↓
        └── div#home-basic-expressions-path.course-series__journey-path.journey-map
            └── div.journey-map__path
                └── ten unchanged .journey-node lesson links in journeyNodes order
```

Progress uses the same shape with `progress-pinyin-series-title` and
`progress-journey-series-title`,
`href="#progress-basic-expressions-path"`, and
`id="progress-basic-expressions-path"`. Its path child has
`className="surface-card progress-journey-card course-series__journey-path"` and contains the
existing `.progress-journey-map__path` grid. This moves `.progress-journey-card` from the semantic
Basic section to the path surface while preserving all current descendant selectors and the
current Progress Journey visual treatment. Home moves the current Basic path spacing/background
responsibility to `.course-series__journey-path.journey-map`.

### Progress count placement

Progress places existing counts inside the corresponding full-card anchors:

- the Pinyin `Link` retains
  `copy.pinyinPage.sectionProgress(completedPinyinSectionsCount, totalPinyinSections)`;
- the Basic native anchor retains
  `copy.progressPage.completedSummary(completedLessonsCount, totalLessons)`.

Both anchors use `aria-labelledby` pointing only to their localized `h2`, so the stable link names remain the series titles. The visible counts remain available as adjacent anchor text without being redundantly folded into the explicit accessible name.

Home renders neither count element. Even when either store contains completed work, its two entry cards contain only the existing title content, equal-size decorative `拼` / `旅` marks, and decorative directional cues.

### Journey ownership

The Basic section owns the Journey path semantically and structurally. The path is not moved into
the Pinyin section or outside the course-series region. No heading is duplicated above the path;
the Basic entry's existing `h2` labels the section once. The semantic section wrapper has no
surface of its own. Home's `.course-series__journey-path` child and Progress's
`.progress-journey-card.course-series__journey-path` child retain the existing page-specific path
surface/spacing below the Basic entry.

The Home and Progress Journey node mappings remain unchanged. This work changes only the path wrapper's position and adds its fragment `id`.

## Equal Width and Content-Safe Equal Height

### Shared track sizing

`.course-series__list` becomes a single-column layout coordinator. Its first two rows are shared equal flexible tracks with intrinsic minimums; its third row is content-sized for the Journey path:

```css
.course-series__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: repeat(2, minmax(auto, 1fr)) auto;
  gap: 1rem;
  align-items: stretch;
}
```

The Pinyin section occupies entry row 1. The Basic section spans entry row 2 and the path row and uses `subgrid` for those rows, so its entry participates in the same outer row-sizing algorithm while its path remains content-sized:

```css
.course-series__panel--pinyin {
  grid-row: 1;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
}

.course-series__panel--journey {
  grid-row: 2 / span 2;
  display: grid;
  grid-template-rows: subgrid;
}
```

The baseline `.course-series__panel` rule contains `align-content: start`; retaining it would make
the Pinyin wrapper fill the equal outer row while its implicit inner row and visible anchor remain
content-height. The implementation therefore explicitly resets the semantic wrappers and stretches
both the wrapper and its inner track:

```css
.course-series__panel {
  align-self: stretch;
  align-content: stretch;
  padding: 0;
  border: 0;
  background: none;
  box-shadow: none;
}

.course-series__entry-card {
  min-width: 0;
  min-height: 0;
  align-self: stretch;
  justify-self: stretch;
}
```

The Pinyin wrapper's explicit `minmax(0, 1fr)` inner row consumes the wrapper's full equalized
outer row. The Basic wrapper's `subgrid` exposes the outer entry and path rows directly, and its
entry anchor stretches within the shared entry row. This is a required three-level contract:
equal outer rows, stretched semantic wrappers/inner tracks, and stretched visible anchors.

The semantic section wrappers add no independent card padding, border, background, shadow, or
height; entry visual surface properties belong to the anchors, while Journey surface properties
belong to the separate path child. The current `.course-series__panel--pinyin` and
`.course-series__panel--journey` background declarations are removed or retargeted to the
corresponding entry/path selectors; no later modifier rule may restore a surface or
`align-content: start` on a semantic wrapper. The current
`.course-series__panel--journey { overflow: hidden; }` does not remain on the semantic wrapper:
the wrapper uses visible overflow so neither entry focus ring can be clipped. Overflow clipping
needed by decorative Journey backgrounds is scoped to `.course-series__journey-path`.

`.course-series__journey-path` is itself a content-sized grid so the moved Home `.journey-map`
gap/background and the moved Progress `.progress-journey-card` surface continue to contain their
existing path grids. It occupies only the outer auto row and does not participate in the two entry
row heights.

This design has these required consequences:

- both cards have exactly the same inline size because they occupy the same grid column;
- both visible anchors have exactly the same block size because rows 1 and 2 are equal `1fr` tracks,
  both section wrappers stretch to those rows, and both inner anchor tracks stretch within their
  wrappers;
- `minmax(auto, 1fr)` honors each card's intrinsic minimum contribution before equalizing the rows;
- if French or a Progress count needs more lines, the grid increases both entry rows to the larger content requirement;
- the Journey row remains `auto` and never affects entry-card equality;
- neither `.course-series__entry-card` nor a page-specific entry selector may set a pixel `height`, pixel `min-height`, `max-height`, clipping overflow, line clamp, or text truncation.

The current `.course-series__pinyin-link { min-height: 10rem; }` is removed. Equal height must not be simulated with `height`, a fixed `min-height`, absolute positioning, JavaScript measurement, `ResizeObserver`, or language-specific overrides.

The amended structure was rendered fresh in Chromium for the full
Home/Progress × English/French × 1440/1024/390/320 matrix. `CSS.supports()` reported subgrid
support. All 16 Pinyin/Basic **anchor** pairs, not only their outer rows or wrappers, had identical
measured width and height; each Pinyin anchor also matched its stretched wrapper height. The path
began after the Basic anchor, every title token—including `stress-free`—occupied one rendered
fragment, and no document overflowed. Content-driven equal anchor height ranged from about 93 px
in the desktop Home fixture to about 180 px in the 320 px French Progress fixture. The
implementation repeats the same matrix against the real application and screenshots.

### Surface and alignment

The two anchors reuse the current course-series panel radius, border, shadow, spacing, and
Pinyin/Basic background families. Each card uses the same internal grid: an equal-size decorative
mark column, a flexible title/count column, and an equal-size decorative cue column. Shared padding
and grid alignment make them read as peers. Inner content differs only as follows:

- Pinyin retains the decorative, `aria-hidden` `拼` mark and `→` cue;
- Basic adds the approved mockup's equal-size decorative `旅` mark and `↓` cue;
- Basic uses its title and, only on Progress, its existing lesson progress text;
- Progress Pinyin retains its existing section progress text.

Inner content aligns consistently from the start of each card. Empty space created by equalization remains inside the shorter card; content is not vertically clipped or overlaid.

## Title Rendering and Wrapping

Both pages render their localized headings through a shared `CourseSeriesTitle` component. Its
input is the exact `copy.courseSeries` string. It splits with `/(\s+)/u`, emits every whitespace
segment unchanged as a text node, and wraps every non-space segment in
`<span className="course-series__title-token">`. The spans have no `aria-label`, `aria-hidden`, or
role. Consequently the heading's `textContent`, computed accessible text, copy source, punctuation,
and spacing remain unchanged; only browser line-break opportunities are constrained.

The component's production contract is:

```tsx
type CourseSeriesTitleProps = {
  id: string
  title: string
}

export function CourseSeriesTitle({ id, title }: CourseSeriesTitleProps) {
  return (
    <h2 id={id} className="course-series__title">
      {title.split(/(\s+)/u).map((segment, index) =>
        /^\s+$/u.test(segment) ? (
          segment
        ) : (
          <span className="course-series__title-token" key={`${index}-${segment}`}>
            {segment}
          </span>
        ),
      )}
    </h2>
  )
}
```

Current copy has no leading or trailing whitespace, so the split produces only non-empty word and
separator segments. The focused component test also pins the absence of empty token spans.

The whole `h2.course-series__title` remains a normal wrapping container:

```css
.course-series__title {
  white-space: normal;
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
  text-wrap: balance;
}

.course-series__title-token {
  display: inline-block;
  white-space: nowrap;
}
```

The inline-block token is atomic, so an explicit hyphen in `stress-free` cannot become an internal
line-break opportunity. Breaks remain available at the original whitespace text nodes between
tokens. The title width remains `100%` of the content area with `min-width: 0` on grid ancestors.
There is no title-level `nowrap`, ellipsis, line clamp, manual `<br>`, copied short label,
font-size override by language, or character-level `overflow-wrap: anywhere`.

At 320 px, the available card content width still accommodates the longest individual token in both approved languages. The full titles therefore wrap to additional content-driven lines rather than splitting a word or overflowing.

## Interaction

### Pinyin

- Implemented with the existing React Router `Link`.
- The entire rendered Pinyin entry card is the link hit target.
- `to="/pinyin"` is unchanged.
- Pointer, Enter-key, and assistive-technology activation use normal link navigation.
- No child control is nested inside the link.

### Basic expressions

- Implemented as a literal native `<a>` with `href="#home-basic-expressions-path"` on Home and
  `href="#progress-basic-expressions-path"` on Progress, not `Link`, `button`, or an element with
  an emulated role.
- The entire rendered Basic entry card is the anchor hit target.
- Activation uses the browser's native fragment behavior and updates only the current URL hash.
- The fragment target is the existing Journey path wrapper immediately after the entry.
- Each target uses `scroll-margin-block-start: 1rem` and does not receive `tabIndex`.
- No `onClick`, `preventDefault`, `scrollIntoView`, smooth-scroll code, focus transfer, expand state, or persistence is added.

### Shared states

- Both anchors have a clearly visible `:focus-visible` outline of at least the current 3 px course-entry treatment with a 3 px offset.
- Hover retains the current subtle border, shadow, and upward translation.
- Focus must not be communicated by translation alone.
- The `→` and `↓` cues and the `拼` / `旅` marks are `aria-hidden` and never become nested controls.
- `prefers-reduced-motion: reduce` continues to disable entry transition animation for both anchor classes.
- Activating Basic does not hide, reveal, expand, or rerender the Journey path; the path is always present.

## Responsive Behavior

The entry-card structure and order do not change at any breakpoint.

### Desktop — 1440 × 900

- The course-series region retains its current maximum width of 72 rem.
- Pinyin and Basic entry cards are one full-width column, vertically stacked.
- Their rendered x-coordinate, width, and height are equal.
- The Journey path starts below the bottom edge of the Basic card and retains its current auto-fit desktop columns and card behavior.
- Home's #t46 hero remains unchanged.

### Tablet/small desktop — 1024 × 768

- The entries remain one full-width column; the former side-by-side series layout is not restored.
- Equal width and equal height remain exact after localized wrapping.
- The Journey path retains current auto-fit behavior at this width.
- Existing #t46 1024 px hero scaling, opacity, veil, clipping, and text geometry remain unchanged.

### Mobile — 390 × 844

- Both entry cards fill the available course-series width and stack Pinyin then Basic.
- The Basic card's top edge is below the Pinyin card's bottom edge; the Journey path begins below the Basic card.
- Entry widths and heights are equal.
- The Journey path retains its existing single-column rule.
- Titles wrap by whole word, focus outlines remain fully visible, and document width does not overflow.
- Home's current #t46 mobile hero remains unchanged.

### Minimum mobile — 320 × 720

- The same DOM and one-column grid are used; there is no compressed alternative.
- Both entries remain equal in width and height, including French Progress where title and count wrapping produce the largest intrinsic requirement.
- All title words remain intact, all visible card text remains unclipped, and both full-card anchors remain usable.
- The Journey path remains below both cards in one column.
- `document.documentElement.scrollWidth` equals `clientWidth`.
- The body minimum width and #t46 hero contract remain unchanged.

## Accessibility and Semantics

- The existing top-level course-series `<section>` remains a localized named region.
- Pinyin and Basic expressions remain sibling `<section>` elements at the same DOM depth.
- Each peer section is named by one localized level-2 heading through its existing page-unique `aria-labelledby`.
- Pinyin remains a real route link; Basic remains a real fragment anchor.
- Link accessible names are the exact localized series titles.
- `CourseSeriesTitle` token spans remain in the accessibility tree; original whitespace text nodes
  remain between them, and unit/browser assertions pin the heading text and link accessible name to
  the exact shared-copy value.
- Reading, focus, and visual order are Pinyin, Basic, then the ten Journey items.
- The decorative `拼` mark remains `aria-hidden="true"`.
- The new equal-size decorative `旅` mark and both directional cues are also `aria-hidden="true"`.
- No decorative surface, count, or path connector becomes focusable.
- No interactive element is nested in either full-card link.
- Journey lesson links retain their current names, heading levels, focus behavior, and destinations.
- Language switching on Home updates the region label, both headings, and both link names through existing React state. Stable fragment IDs do not change with language.
- Native fragment navigation works with pointer, keyboard, and assistive technology without requiring motion.
- Visible focus is tested against computed style, not inferred only from selector presence.

## State and Error Behavior

This change adds no network, asynchronous, or recoverable error state.

### Home

- `loadProgress()` continues to determine the explanation language.
- A missing, malformed, or invalid course-progress value continues to fall back to `createDefaultProgress()`, producing English copy by default.
- Completion data in either current store does not add counts, badges, percentages, or completion styling to Home entry cards.
- Switching language rerenders content; intrinsic grid sizing recalculates automatically and keeps the cards equal without measured state.

### Progress

- `loadPinyinProgress()` continues to validate and fall back to `createDefaultPinyinProgress()`. Its default entry count is the existing 0 of 3.
- `loadProgress()` continues to validate and fall back to `createDefaultProgress()`. Its default Basic entry count is the existing 0 of 10.
- Pinyin completion remains `pinyinProgress.completedSections.length` against `totalPinyinSections = 3`.
- Basic completion remains the filtered set of Journey lesson IDs against `lessonJourneyNodes.length`, which remains 10.
- Existing duplicate/invalid Journey completion filtering, completion percentage guard, current lesson selection, statuses, review queue, and summary behavior are unchanged.
- Neither fragment activation reads nor writes either store.

### Fragment state

- The only new browser state is the URL fragment.
- Stable page-specific IDs prevent duplicate targets and cross-page ambiguity.
- A direct render or activation with the fragment does not alter course state or create an application error.
- If the target is already visible, native activation may result in no material scroll; the hash and focusable-link behavior still satisfy the interaction.

## Testing Design

### `src/pages/HomePage.test.tsx`

Update the course-series contract to assert:

- the localized Pinyin and Basic sections remain sibling regions in Pinyin-first order;
- the Pinyin full-card link has `/pinyin`;
- the Basic full-card anchor has `#home-basic-expressions-path`;
- the Home Journey wrapper has `id="home-basic-expressions-path"` and is inside the Basic section;
- DOM order is Pinyin entry, Basic entry, then Journey path;
- the path still contains exactly ten lesson links in current order and with current destinations;
- both entries use `.course-series__entry-card`;
- each heading retains the exact shared-copy text while rendering each non-space segment as a
  `.course-series__title-token`;
- the equal-size `拼` / `旅` marks and directional cues remain decorative;
- after seeding non-zero Pinyin and Journey progress, Home contains neither the Pinyin sections-out-of-3 copy nor the Basic lessons-out-of-10 copy;
- English/French exact copy and existing language-switch behavior remain pinned;
- all existing #t46 hero tests remain unchanged and passing.

### `src/pages/ProgressPage.test.tsx`

Update the course-series contract to assert:

- sibling peer semantics and Pinyin-first DOM order remain intact;
- the Pinyin full-card link has `/pinyin`;
- the Basic full-card anchor has `#progress-basic-expressions-path`;
- the Progress Journey wrapper has `id="progress-basic-expressions-path"` and follows both entries;
- the Pinyin count remains inside its entry and uses the current sections-out-of-3 copy;
- the Basic count moves into its entry and uses the current lessons-out-of-10 copy;
- each link's accessible name remains only its localized series title;
- each heading retains the exact shared-copy text and nonbreaking token structure;
- the Journey still contains ten cards in existing order with existing IDs, status logic, and destinations;
- Journey mastery, summary, and stats remain out of 10 and independent from Pinyin.

### `src/styles/global.test.ts`

Replace the old side-by-side/fixed-minimum assertions with contracts for:

- one `minmax(0, 1fr)` entry column;
- two `minmax(auto, 1fr)` shared entry rows followed by the auto Journey row;
- Pinyin row placement, its explicit full-height inner row, and Basic section row spanning/subgrid;
- replacement of the baseline `.course-series__panel { align-content: start; }` behavior with
  wrapper stretch;
- shared `.course-series__entry-card` self-stretch, surface, and focus rules;
- visible overflow on the semantic wrappers and path-scoped decorative clipping;
- removal or retargeting of the old panel-modifier background declarations so the cascade cannot
  override the surface-free/stretch wrapper contract;
- content-sized grid behavior for `.course-series__journey-path`;
- absence of fixed `height`, fixed `min-height`, `max-height`, clipping, line clamp, and ellipsis on entry cards;
- normal title-level white-space/overflow wrapping/word breaking, disabled automatic hyphenation,
  and atomic `.course-series__title-token { display: inline-block; white-space: nowrap; }`;
- reduced-motion coverage for both entry link selectors;
- retained single-column Journey paths at the existing narrow breakpoint.

Static CSS tests supplement but do not replace rendered geometry tests.

### `tests/e2e/course-series.spec.ts`

Use a parameterized matrix covering:

- pages: Home and Progress;
- languages: English and French;
- viewports:
  - 1440 × 900;
  - 1024 × 768;
  - 390 × 844;
  - 320 × 720.

For all 16 page/language/viewport combinations:

1. locate the two `.course-series__entry-card` anchors and their path;
2. assert the two **anchor** bounding boxes have equal x-coordinate and width;
3. assert the two **anchor** bounding-box heights are equal, and separately assert that each anchor
   height equals its assigned outer entry-row height so equal wrappers cannot mask a short visible
   card;
4. allow at most 1 CSS px comparison tolerance for fractional device-pixel rounding while requiring the CSS Grid tracks themselves to be equal;
5. assert Basic starts below Pinyin and the path starts below Basic;
6. assert the path contains ten Journey nodes;
7. assert both localized titles have normal white-space and no overflow;
8. assert the heading `textContent` and accessible link name equal the exact shared copy, then use
   `Range#getClientRects()` on every `.course-series__title-token` and require exactly one rendered
   rectangle per token, including the literal `stress-free` token;
9. assert title and card `scrollWidth` do not exceed `clientWidth`;
10. assert document `scrollWidth` equals `clientWidth`;
11. attach bounded screenshots for visual review.

Interaction coverage additionally verifies:

- both anchors expose a visible computed `:focus-visible` outline;
- Enter on Pinyin reaches `/pinyin`;
- Enter on Basic keeps the current pathname, applies the correct hash, and targets the existing path;
- Basic activation does not remove or expand Journey content;
- Home shows no course progress counts even with non-zero seeded stores;
- Progress shows seeded independent sections-out-of-3 and lessons-out-of-10 counts.

### Regression verification

Run:

- focused Home, Progress, copy, Journey, progress-store, Pinyin-progress, and global CSS Vitest coverage;
- full Vitest;
- lint;
- production build;
- `tests/e2e/course-series.spec.ts`;
- existing `tests/e2e/home-page.spec.ts`, `tests/e2e/app-shell.spec.ts`, and `tests/e2e/pinyin-zone.spec.ts`;
- `git diff --check`.

The existing Home hero browser matrix remains the #t46 geometry guard. Course-series work must not rewrite its expected hero dimensions, opacity, image placement, or clipping values.

## Implementation Outline

1. Add `src/components/CourseSeriesTitle.tsx` plus a focused test that first fails for exact
   text/accessibility-preserving whitespace tokenization and then passes with the shared renderer.
2. In `src/pages/HomePage.test.tsx` and `src/pages/ProgressPage.test.tsx`, add failing structural,
   fragment-link, count-placement, order, title-token, and Home-no-count assertions.
3. In `src/styles/global.test.ts`, replace the old two-column/fixed-Pinyin-height contract with
   failing shared-row, explicit wrapper/inner-track stretch, no-fixed-height, full-card focus, and
   atomic-token wrapping assertions.
4. In `tests/e2e/course-series.spec.ts`, add the complete two-page, two-language, four-viewport geometry and interaction matrix.
5. In `src/pages/HomePage.tsx`, use `CourseSeriesTitle`, make the two peer entry anchors precede the
   unchanged Home Journey mapping, add the stable Home fragment target, and remove the old separate
   Basic panel header.
6. In `src/pages/ProgressPage.tsx`, use `CourseSeriesTitle`, apply the same structure, move the
   existing Basic completion badge content into its native anchor, add the stable Progress fragment
   target, and leave all progress calculations and Journey rendering unchanged.
7. In `src/styles/global.css`, convert `.course-series__list` to the one-column shared-row grid,
   explicitly replace the panel `align-content: start` behavior with stretch, give the Pinyin
   wrapper a full-height inner row, use subgrid for the Basic section/path relationship, move the
   visible surface to `.course-series__entry-card`, remove the fixed Pinyin minimum height, and add
   shared focus/token/fragment-target rules. Remove the obsolete
   `.course-series__panel-header` and narrow-screen
   `.progress-course-series .progress-list-card__header` rules after their markup is removed.
8. Run the focused tests, full checks, browser matrix, and screenshot review; make only
   course-series-scoped corrections.

No new route, copy key, store field, schema version, asset, package, or configuration file is
required. `CourseSeriesTitle` is the only new production component and is presentation-only.

## Acceptance Criteria

1. On Home and Progress, Pinyin is the first entry card, Basic expressions is the second entry card, and the ten-lesson Journey path renders after both in DOM and visual order.
2. The two entry cards are semantic peers and have exactly equal rendered width and equal rendered height on their page in English and French at 1440, 1024, 390, and 320 px.
3. Equality is produced by shared CSS Grid track sizing with intrinsic/content-driven row minimums,
   explicit semantic-wrapper/inner-track stretch, and visible-anchor stretch. No entry card uses a
   fixed pixel height or fixed pixel minimum height, and longer localized/state content is not
   clipped.
4. Pinyin is a full-card `Link` to `/pinyin` on both pages.
5. Basic expressions is a full-card native keyboard-focusable same-page anchor to `#home-basic-expressions-path` on Home and `#progress-basic-expressions-path` on Progress.
6. Both entries expose visible keyboard focus, contain no nested controls, and retain localized title-only accessible names.
7. Home displays no Pinyin or Basic progress count, regardless of stored completion.
8. Progress displays the existing independent Pinyin sections-out-of-3 and Basic lessons-out-of-10 counts; Journey summary, stats, mastery, and statuses remain based on ten lessons only.
9. The exact approved English and French group/title copy is unchanged and comes from
   `copy.courseSeries`; tokenized rendering preserves exact heading text and exact localized link
   names.
10. At all four viewports, both EN/FR titles wrap only at original whitespace boundaries; every
    non-space token, including `stress-free`, occupies one rendered fragment, no text is truncated,
    and neither cards nor document overflow horizontally.
11. The Basic path contains exactly the existing ten Journey lessons in the existing order with existing content, icons, statuses, and destinations.
12. Routes, stores, progress schema, completion logic, Journey data, course data, lesson/Pinyin content, packages, and configuration are unchanged.
13. The #t45 peer hierarchy and independence guarantees remain intact.
14. The #t46 Home hero component, asset, DOM, copy, language behavior, illustration treatment, and responsive geometry remain intact, and its existing four-viewport tests pass without expectation changes.
15. Unit, CSS-contract, relevant Playwright, full test, lint, build, and whitespace verification pass with no unrelated diff.
