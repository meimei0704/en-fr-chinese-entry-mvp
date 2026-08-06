# Peer Course-Series Hierarchy and Simplified Copy Design

**Date:** 2026-08-05
**Status:** User-approved design, pending written-spec review
**Loop task:** #t45

## Summary

Correct the course hierarchy so Pinyin and the practical-expression Journey Map are two peer-level course series on both Home and Progress. Remove Pinyin from the Journey Map data model, reduce the visible series copy to one concise title per series, and keep the English and French experiences aligned.

The implementation sequence is fixed by the user:

1. establish the new series layout and visual styles;
2. correct the hierarchy and progress logic;
3. replace the visible English and French content.

Tests still lead each implementation phase; this sequence describes the order in which production behavior is introduced.

## Problem

The current model places `pinyin-foundations` inside `journeyNodes` with:

- `stageId: 'arrival-in-china'`;
- `kind: 'route'`;
- `pathOrder: 11`.

Home and Progress both render the shared `journeyNodes` list. As a result, both pages present Pinyin as the eleventh child of the arrival Journey Map. This is the wrong product hierarchy: Pinyin and the practical-expression Journey Map are separate course series at the same level.

The current Home introduction also repeats three layers of visible copy—`Journey Map`, `Journey Map`, and `Arrive in China step by step`—before the learner reaches the lesson cards. This is more text than the hierarchy needs.

## Goals

1. Model Pinyin and the practical-expression Journey Map as peer course series.
2. Remove every implication that Pinyin is a Journey Map stage, lesson, bonus route, or eleventh node.
3. Present the same peer hierarchy on Home and Progress.
4. Replace the repeated Journey Map introduction with one concise series title.
5. Keep English and French copy semantically aligned.
6. Preserve all existing Pinyin, lesson, progress, review, and navigation behavior that is outside the hierarchy correction.

## Non-goals

- No changes to Pinyin lesson content, exercises, audio, or `/pinyin` routing.
- No changes to the ten practical scenario lessons or their order.
- No new course route, tab interface, carousel, or hidden series view.
- No progress-storage schema migration.
- No redesign of the Home hero or the individual Journey lesson cards.
- No unrelated cleanup of lesson or progress copy.

## Final Information Architecture

The product exposes one top-level course-series group with two direct children:

1. **Pinyin series**
   - destination: `/pinyin`;
   - progress unit: three existing Pinyin sections;
   - independent of every Journey stage and node.
2. **Basic expressions series**
   - content: the existing ten practical scenario lessons;
   - progress unit: ten lessons;
   - retains the connected Journey Map presentation.

The two series must be sibling semantic sections at the same DOM depth. A visual treatment may differ because the Pinyin series is a compact entry and the Basic expressions series contains a ten-card path, but neither may be nested inside the other.

## Data Model

### Journey data

`src/content/journey.ts` becomes Journey-only data:

- `journeyNodes` contains exactly ten `kind: 'lesson'` nodes;
- path order is exactly `1` through `10`;
- `pinyin-foundations` is absent from `JourneyNodeId`, `journeyNodeIcons`, and `journeyNodes`;
- no Journey node points to `/pinyin`;
- `'route'` is removed from `JourneyNodeKind`, `JourneyNodeRouteDetails` is removed, and the Home/Progress route-node render branches are deleted. Current repository inspection confirms Pinyin is their only production consumer.

### Pinyin data

Pinyin continues to use the existing `pinyinCourse` and Pinyin progress store. Its series entry is composed independently from Journey data. Home uses the existing `/pinyin` route; Progress uses the existing count of completed Pinyin sections without changing storage format or completion rules.

### Localized UI copy

The shared UI-copy layer owns the course-series label and both series titles. Home and Progress consume the same localized values rather than duplicating literal strings.

## Final Visible Copy

| Purpose | English | French |
| --- | --- | --- |
| Top-level group | `Course series` | `Séries de cours` |
| Pinyin series | `Mandarin tones and pinyin` | `Tons et pinyin du mandarin` |
| Basic expressions series | `Basic Chinese expressions for a stress-free journey` | `Expressions chinoises essentielles pour voyager sereinement` |

The current visible sequence `Journey Map` / `Journey Map` / `Arrive in China step by step` is removed. No replacement paragraph is added.

## Home Design

Home keeps the existing hero. Immediately below it, the course-series area contains two sibling sections.

### Pinyin series section

- Compact, full-card link to `/pinyin`.
- Shows the localized Pinyin series title and a short visual Pinyin identifier already supported by the product style.
- Does not reuse `.journey-node`, a Journey stage, or Journey path connectors.
- Has a visible keyboard focus state and an accessible name derived from the localized series title.

### Basic expressions series section

- Shows only the localized Basic expressions series title above the path.
- Contains the existing ten Journey lesson cards in their existing order.
- Retains existing lesson destinations, icons, card interaction, connected path, and responsive behavior.
- Does not contain a Pinyin link or route node.

The common `Course series` label introduces the two sections once; it is not repeated inside every card.

## Progress Design

Progress preserves the current summary, review queue, and overall practical-lesson completion calculations. Its course area is split into two sibling sections.

### Pinyin progress section

- Uses the same localized Pinyin series title as Home.
- Shows completed Pinyin sections out of the existing total of three.
- Links to `/pinyin`.
- Does not appear in the practical Journey path or the ten-lesson completion denominator.

### Basic expressions progress section

- Uses the same localized Basic expressions series title as Home.
- Preserves the current ten-lesson completed/current/upcoming logic and connected Journey path.
- Reports completion out of ten lessons only.

The two progress sections share the same course-series parent and heading level. They may use different internal layouts, but neither is nested in or counted by the other.

## Visual and Responsive Rules

- Reuse current paper, jade, sky, gold, radius, shadow, and typography tokens.
- Give both series sections a shared panel baseline so the peer relationship is visible.
- Keep the Pinyin panel compact; do not stretch it into an artificial eleven-card path.
- Keep the Basic expressions path and its mobile single-column behavior.
- At narrow widths, stack the two series sections without changing their DOM or reading order.
- Do not introduce horizontal overflow at 320 px or 390 px.
- The concise titles must wrap naturally; do not truncate either language.

## Accessibility

- The top-level course-series region has the localized `Course series` / `Séries de cours` label.
- Pinyin and Basic expressions are sibling labeled sections with a consistent heading level.
- The Pinyin entry remains a standard link with a visible focus state.
- Journey cards retain their current link semantics and accessible names.
- Decorative marks remain `aria-hidden`.
- Language switching updates every new visible and accessible series label.

## Error and State Handling

This change introduces no network requests or asynchronous states.

- Invalid or missing Pinyin progress continues to use the existing loader's default-state behavior.
- Invalid or missing practical lesson progress continues to use the existing progress loader.
- Pinyin completion is not folded into practical-lesson completion or mastery.
- Practical-lesson completion remains based on the ten Journey lesson IDs.

## Implementation Sequence

### Phase 1 — style and semantic shell

- Add the shared course-series wrapper and sibling-panel style hooks.
- Add responsive stacking, title wrapping, full-card focus, and overflow protection.
- Establish Home and Progress structural shells without yet changing final localized content.

### Phase 2 — hierarchy and logic

- Remove Pinyin from Journey types, data, icons, ordering, and route-node rendering.
- Wire the independent Pinyin series entry on Home.
- Wire the independent Pinyin progress section on Progress.
- Keep Journey totals and progress strictly at ten lessons.

### Phase 3 — content

- Add the approved English and French series copy.
- Remove the redundant Journey Map eyebrow, heading, and introduction copy.
- Update accessible labels and copy contracts.

## Verification Strategy

### Content and type contracts

- `journeyNodes` has ten entries, all lessons, ordered `1` through `10`.
- No Journey ID, icon, data, or route branch references Pinyin.
- Both approved EN/FR series titles are pinned in copy tests.

### Home component tests

- The course-series region contains two sibling labeled sections.
- The Pinyin link is outside the Basic expressions Journey section and points to `/pinyin`.
- The Journey section contains exactly ten lesson links in the existing order.
- English and French modes show only their corresponding approved series copy.
- The removed Journey introduction text is absent.

### Progress component tests

- Pinyin and Basic expressions are sibling progress sections.
- Pinyin shows completed sections out of three using existing Pinyin progress.
- Basic expressions shows completed lessons out of ten.
- Pinyin is absent from the Journey node list and practical-lesson denominator.

### Browser and build verification

- Home browser flow confirms the Pinyin series link reaches `/pinyin` and all Journey cards remain reachable.
- Progress browser flow confirms both peer sections and independent counts.
- Verify desktop plus 390 px and 320 px layouts for readable wrapping and no horizontal overflow.
- Run full Vitest, lint, production build, relevant Home/Pinyin/Progress Playwright tests, and `git diff --check`.

## Acceptance Criteria

1. Home and Progress visibly and semantically present Pinyin and Basic expressions as peer course series.
2. Pinyin is not a Journey node, stage child, bonus route, path item, or part of the ten-lesson denominator.
3. The Journey path contains the same ten practical lessons in the same order and with the same destinations.
4. Visible Home series copy is limited to the common group label and one approved title per series.
5. English and French copy exactly matches the approved table.
6. Existing Pinyin content, Pinyin route, lesson content, progress storage, and Journey card behavior remain intact.
7. Desktop, 390 px, and 320 px layouts remain readable, keyboard accessible, and free of horizontal overflow.
