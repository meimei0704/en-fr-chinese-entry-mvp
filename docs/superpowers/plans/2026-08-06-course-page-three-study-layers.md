# Course Page Three Study Layers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the learner `LessonPage` show only Dialogue, Sentence patterns, and Vocabulary in a compact, learner-scoped responsive layout while preserving all data, direct routes, progress behavior, Review, and Admin behavior.

**Architecture:** Preserve routes, data, persistence, localization, and shared components. Remove only learner-page JSX, update two summaries, add a valid-lesson `.lesson-page` hook, and layer compact/responsive CSS beneath it. Verify with DOM/CSS and real-browser tests.

**Tech Stack:** React 19, React Router 6, TypeScript 6, Testing Library/Vitest/jsdom, plain CSS, Playwright.

---

## Baseline and file map

Inspected baseline: approved spec commit `1ed8cdc7d1ac24d7e1c2a8c29d84ef9c1bb1f185`; its `origin/main` ref is `c7a87c6`. Before coding, fetch and create a fresh isolated worktree from current `origin/main`; re-check symbols and do not implement on the design branch.

### Files to modify

1. `src/pages/LessonPage.test.tsx`
   - Fixtures/helpers at 6–54: `course`, progress helpers, `renderRoute`, `MockUtterance`, `MockAudio`, and localStorage reset.
   - Existing tests to revise/extend: bilingual template/language toggle at 65–111; progress preview at 141–158; audio count at 160–191.
2. `src/pages/LessonPage.tsx`
   - `studyLayers` at 25–31.
   - Preserve the `useEffect` last-visited guard/update at 33–48 and `handleSelectLanguage` at 50–56.
   - Preserve not-found return at 58–69.
   - Add the hook to valid lesson `<main>` at 73.
   - Remove duplicate `lesson.dialogue.title` lede at 78.
   - Keep semantic progress `<ol>/<li>` at 81–100.
   - Keep overview and unconditional `copy.lessonPage.sectionSummary` at 102–116.
   - Keep Dialogue/Patterns/Vocabulary blocks at 118–166; remove Pronunciation/Hanzi blocks at 168–201.
   - Keep Practice/Home links and remove only lesson-page short-input link at 204–217.
3. `src/content/copy.ts`
   - Change only English `lessonPage.sectionSummary` at line 76 and French at line 283.
   - Retain `pronunciation`, `hanziRecognition`, and `finishWithShortInput` keys (lines 74–78, 281–285); other screens/admin or future cleanup can still use them.
4. `src/styles/global.test.ts`
   - Reuse `css`, `ruleBlock`, `hasRule`, and `hasRuleWithDeclaration` at lines 5 and 33–54.
   - Add learner-scope/desktop/mobile/non-leak assertions near the existing Lesson action-dock CSS regression at 177–198.
5. `src/styles/global.css`
   - Do not alter shared `.lesson-header-card, .review-card` at 922–927 or naked `.lesson-header-card` at 929–931.
   - Add scoped overrides after learner baseline rules around 922–1022.
   - Keep naked rail baseline `repeat(5, ...)` at 969–976 unchanged; learner override supersedes it.
   - Add a same-specificity learner mobile rail rule inside `@media (max-width: 760px)` at 2634–2781. The pre-existing naked mobile rail member at 2643 is insufficient against a two-class desktop override.
6. `src/pages/AdminLessonEditorPage.test.tsx`
   - Extend the existing “loads the editor shell…” test at 63–81 with a structural non-leak assertion.
   - Admin markup already has `.admin-page-shell` and `.lesson-header-card.admin-editor-hero` at `src/pages/AdminLessonEditorPage.tsx:628–646`; do not change it.
7. `tests/e2e/lesson-action-dock.spec.ts`
   - Update the sole test at 5–60: remove the short-input expectation/box from the lesson action dock, retain Practice/Home geometry checks, and add desktop/mobile rail and overflow checks.

### Explicitly unchanged regression surfaces

- `src/app/router.tsx:20–22`: retain lesson, practice, and `/lesson/:lessonId/short-input` routes.
- `src/pages/LessonRoutes.test.tsx:50–77`: retain Practice → short input and direct short-input route coverage unchanged.
- `tests/e2e/mvp-flow.spec.ts:3–39`: retain Home → Lesson → Practice → short-input → Review → Progress flow unchanged.
- `src/content/types.ts:125–137`, lesson data, schemas, seeds, providers, APIs, admin configs: no edits; hidden modules remain in `LessonContent`.
- `src/lib/progress.ts:16–31,84–96`: no persistence-model edits.
- `src/pages/ReviewPage.tsx` and tests: no edits.

## Task/commit decomposition

### Task 0: Establish the implementation baseline

- [ ] From the primary checkout, fetch the approved design/plan branch and current main:

```bash
git fetch origin main design/t47-course-page-three-layers
```

- [ ] Create the implementation branch in an isolated worktree from the committed design/plan branch, then replay its documentation-only commits onto current `origin/main` if main advanced:

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/en-fr-chinese-entry-mvp-t47-course-page-three-layers"
git worktree add "$WORKTREE_DIR" \
  -b feature/t47-course-page-three-layers \
  origin/design/t47-course-page-three-layers
cd "$WORKTREE_DIR"
git rebase origin/main
git rev-parse --short HEAD
git merge-base --is-ancestor origin/main HEAD
```

Expected: the feature branch contains the approved spec and this plan, `git merge-base` exits 0, and no application source differs from `origin/main` yet.

- [ ] Install the lockfile-resolved dependencies and confirm a clean worktree:

```bash
npm ci
git status --short
```

Expected: installation exits 0 and `git status --short` prints nothing.
- [ ] Run the focused baseline command:

```bash
npm run test -- --run src/pages/LessonPage.test.tsx src/pages/LessonRoutes.test.tsx src/pages/AdminLessonEditorPage.test.tsx src/styles/global.test.ts
```

Expected before edits: PASS. On the inspected baseline this is 4 files / 36 tests passing.

- [ ] Run the browser baseline:

```bash
npm run test:e2e -- tests/e2e/lesson-action-dock.spec.ts
```

Expected before edits: PASS (verified on the inspected baseline).

### Task 1: Lock persistence/error boundaries (green characterization commit)

**Files:** modify only `src/pages/LessonPage.test.tsx`.

- [ ] Add a localized not-found test that proves the invalid route does not save progress:

```tsx
it.each([
  ['en', 'We couldn’t find that lesson.', 'Back to home'],
  ['fr', 'Impossible de trouver cette leçon.', 'Retour à l’accueil'],
] as const)('keeps progress unchanged for a missing lesson in %s', (language, heading, backLabel) => {
  const before = createDefaultProgress()
  before.selectedExplanationLanguage = language
  before.completedLessons = ['self-intro']
  before.reviewQueue = ['self-intro-review-1']
  before.lastVisitedLesson = 'self-intro'
  before.lessonStepProgress = {
    'self-intro': { completedSections: ['dialogue'], shortInputComplete: true },
  }
  saveProgress(before)

  renderRoute('/lesson/not-a-lesson')

  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible()
  expect(screen.getByRole('link', { name: backLabel })).toHaveAttribute('href', '/home')
  expect(loadProgress()).toEqual(before)
})
```

- [ ] Add the valid-route preservation test:

```tsx
it('updates only lastVisitedLesson when a valid lesson opens', () => {
  const before = createDefaultProgress()
  before.selectedExplanationLanguage = 'fr'
  before.completedLessons = ['self-intro']
  before.reviewQueue = ['self-intro-review-1']
  before.lastVisitedLesson = 'self-intro'
  before.lessonStepProgress = {
    'self-intro': { completedSections: ['dialogue'], shortInputComplete: true },
  }
  saveProgress(before)

  renderRoute('/lesson/ask-directions')

  expect(loadProgress()).toEqual({ ...before, lastVisitedLesson: 'ask-directions' })
})
```

- [ ] Run `npm run test -- --run src/pages/LessonPage.test.tsx`.
  - Expected: PASS already. These are deliberate characterization tests for the existing early return at `LessonPage.tsx:34–35` and object-spread update at 44–47, not red feature tests.
- [ ] Commit: `test: lock lesson page progress boundaries`.

### Task 2: Drive the three-layer learner content with failing tests

**Files:** modify `src/pages/LessonPage.test.tsx`, then `src/pages/LessonPage.tsx` and `src/content/copy.ts`.

- [ ] Replace the old five-layer assertions and add bilingual cases. Core assertions should be:

```tsx
it.each([
  {
    language: 'en',
    count: '3 study layers',
    summary: 'This lesson covers dialogue, useful patterns, and vocabulary.',
    removed: /pronunciation|hanzi recognition/i,
    dialogueTitle: 'Ask for help from baggage claim to the taxi pickup',
  },
  {
    language: 'fr',
    count: '3 étapes d’étude',
    summary: 'Cette leçon couvre le dialogue, les structures utiles et le vocabulaire.',
    removed: /prononciation|reconnaissance des hanzi|hanzi à reconnaître/i,
    dialogueTitle: 'Demander de l’aide des bagages jusqu’au taxi',
  },
] as const)('shows only the three learner layers in $language', ({ language, count, summary, removed, dialogueTitle }) => {
  saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: language })
  renderRoute('/lesson/self-intro')

  const preview = screen.getByRole('region', {
    name: language === 'en' ? /lesson progress preview/i : /aperçu de progression/i,
  })
  const steps = within(preview).getAllByRole('listitem')
  expect(preview).toHaveTextContent(count)
  expect(steps).toHaveLength(3)
  expect(steps.map((step) => step.textContent)).toEqual(
    language === 'en'
      ? ['1Dialogue', '2Useful patterns', '3Vocabulary']
      : ['1Dialogue', '2Structures utiles', '3Vocabulaire'],
  )
  expect(steps[0]).toHaveClass('is-current')
  expect(preview).not.toHaveTextContent(removed)
  const retainedHeadings =
    language === 'en'
      ? ['Dialogue', 'Useful patterns', 'Vocabulary']
      : ['Dialogue', 'Structures utiles', 'Vocabulaire']
  for (const heading of retainedHeadings) {
    expect(screen.getByRole('heading', { level: 2, name: heading })).toBeVisible()
  }
  const overview = screen.getByRole('region', {
    name: language === 'en' ? /lesson overview/i : /aperçu de la leçon/i,
  })
  expect(within(overview).getByText(summary)).toBeVisible()
  expect(overview).not.toHaveTextContent(removed)
  expect(screen.queryByRole('heading', { level: 2, name: removed })).not.toBeInTheDocument()
  expect(screen.queryByText(dialogueTitle)).not.toBeInTheDocument()
})
```

These assertions constrain progress items, retained/removed body headings, summary, and duplicate title separately; a page-wide negative alone is insufficient.

- [ ] Add/replace the learner action test:

```tsx
it('keeps only Practice and Home in the lesson action dock', () => {
  renderRoute('/lesson/self-intro')
  const actions = screen.getByRole('navigation', { name: /lesson actions/i })

  expect(within(actions).getAllByRole('link')).toHaveLength(2)
  expect(within(actions).getByRole('link', { name: /go to practice/i })).toHaveAttribute(
    'href', '/lesson/self-intro/practice',
  )
  expect(within(actions).getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/home')
  expect(within(actions).queryByRole('link', { name: /finish with short input/i })).not.toBeInTheDocument()
})
```

Keep the language-toggle persistence assertion and Practice/Home accessible names.

- [ ] Revise the audio test to cover only retained material:

```tsx
const playbackButtons = screen.getAllByRole('button', { name: /play chinese/i })
expect(playbackButtons).toHaveLength(
  lesson.dialogue.lines.length + lesson.sentencePatterns.length + lesson.vocabulary.length,
)
await user.click(playbackButtons[0])
await user.click(playbackButtons[lesson.dialogue.lines.length])
await user.click(playbackButtons[lesson.dialogue.lines.length + lesson.sentencePatterns.length])
expect(audioConstructor).toHaveBeenNthCalledWith(1, '/audio/self-intro/line-01.mp3')
expect(audioConstructor).toHaveBeenNthCalledWith(2, '/audio/self-intro/pattern-01.mp3')
expect(audioConstructor).toHaveBeenNthCalledWith(3, '/audio/self-intro/vocab-01.mp3')
expect(audioPlay).toHaveBeenCalledTimes(3)
expect(cancel).toHaveBeenCalledTimes(3)
expect(speak).not.toHaveBeenCalled()
```

- [ ] Run `npm run test -- --run src/pages/LessonPage.test.tsx` before production edits.
  - Expected RED: current preview says 5 and has 5 list items; Pronunciation/Hanzi headings exist; old summaries fail exact positive assertions and contain forbidden terms; both dialogue titles render; short-input link makes 3 actions; audio count includes `lesson.pronunciation.length`.
  - Persistence/not-found tests should remain green inside the failing file.

- [ ] Make the minimal page implementation:

```tsx
const studyLayers = [
  copy.lessonPage.dialogue,
  copy.lessonPage.sentencePatterns,
  copy.lessonPage.vocabulary,
]
```

Use `<main className="page-shell page-shell--wide lesson-page">` for the valid-lesson return. Delete only:

```tsx
<p className="lede">{getLocalizedText(lesson.dialogue.title, selectedLanguage)}</p>
```

Delete the complete Pronunciation and Hanzi Recognition `<section>` blocks (`LessonPage.tsx:168–201` on baseline), and delete only this action:

```tsx
<Link className="secondary-link" to={`/lesson/${lesson.id}/short-input`}>
  {copy.lessonPage.finishWithShortInput}
</Link>
```

Leave the not-found return, effect, language handler, overview, retained sections, and remaining links intact.

- [ ] Change exactly these values in `copy.ts`:

```ts
sectionSummary: 'This lesson covers dialogue, useful patterns, and vocabulary.',
```

```ts
sectionSummary: 'Cette leçon couvre le dialogue, les structures utiles et le vocabulaire.',
```

- [ ] Run `npm run test -- --run src/pages/LessonPage.test.tsx src/pages/LessonRoutes.test.tsx`.
  - Expected GREEN: all LessonPage tests and unchanged direct-route/Practice → short-input tests pass.
- [ ] Commit: `feat: show three study layers on learner lessons`.

### Task 3: Drive learner-only compact/responsive CSS with tests

**Files:** modify `src/styles/global.test.ts`, `src/pages/AdminLessonEditorPage.test.tsx`, `tests/e2e/lesson-action-dock.spec.ts`; then `src/styles/global.css`.

- [ ] Add a CSS contract test using exact scoped selectors/declarations:

```ts
it('scopes compact three-layer lesson layout away from shared and admin cards', () => {
  const scoped = [
    ['.lesson-page .lesson-header-card', 'gap: clamp(0.9rem, 2vw, 1.25rem);'],
    ['.lesson-page .lesson-header-card', 'padding: clamp(1.25rem, 3vw, 2rem);'],
    ['.lesson-page .lesson-header-card__title', 'gap: 0.1rem;'],
    ['.lesson-page .lesson-header-card__title .eyebrow', 'margin-bottom: 0.25rem;'],
    ['.lesson-page .lesson-progress-preview', 'gap: 0.75rem;'],
    ['.lesson-page .lesson-progress-preview', 'padding: 0.85rem;'],
    ['.lesson-page .lesson-progress-preview__summary', 'gap: 0.5rem;'],
    ['.lesson-page .lesson-progress-preview__rail', 'grid-template-columns: repeat(3, minmax(0, 1fr));'],
    ['.lesson-page .lesson-overview-card', 'gap: 0.75rem;'],
  ] as const
  for (const [selector, declaration] of scoped) {
    expect(ruleBlock(selector)).toContain(declaration)
  }

  expect(ruleBlock('.lesson-progress-preview__rail')).toContain(
    'grid-template-columns: repeat(5, minmax(0, 1fr));',
  )
  expect(ruleBlock('.lesson-progress-preview__rail')).not.toContain('repeat(3')
  expect(ruleBlock('.lesson-header-card,\n.review-card')).not.toContain(
    'gap: clamp(0.9rem, 2vw, 1.25rem);',
  )
  expect(ruleBlock('.lesson-header-card')).not.toContain('padding: clamp(1.25rem, 3vw, 2rem);')
  expect(css).not.toMatch(
    /\.admin-[^{]*\{[^}]*(?:gap: clamp\(0\.9rem, 2vw, 1\.25rem\)|padding: clamp\(1\.25rem, 3vw, 2rem\))/
  )
  expect(css).toMatch(
    /@media \(max-width: 760px\)[\s\S]*?\.lesson-page \.lesson-progress-preview__rail\s*\{[^}]*grid-template-columns:\s*1fr;/,
  )
})
```

- [ ] Extend the Admin shell test after its awaited heading:

```tsx
const main = screen.getByRole('main')
const adminHero = screen.getByRole('heading', { level: 1, name: /edit self-intro/i })
  .closest('.lesson-header-card')
expect(main).toHaveClass('admin-page-shell')
expect(main).not.toHaveClass('lesson-page')
expect(adminHero).toHaveClass('lesson-header-card', 'admin-editor-hero')
expect(adminHero?.closest('.lesson-page')).toBeNull()
```

This passes before CSS and guards Admin structure; do not edit Admin JSX.

- [ ] Replace `tests/e2e/lesson-action-dock.spec.ts` with the following complete two-action, rail-geometry, and overflow contract:

```ts
import { expect, test } from 'playwright/test'

const dockLessons = ['self-intro', 'restaurant-order', 'train-station-ticket'] as const

test('keeps the three-layer Lesson layout aligned across responsive widths', async ({ page }) => {
  for (const lessonId of dockLessons) {
    for (const width of [1440, 760, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/lesson/${lessonId}`)

      const dock = page.getByRole('navigation', { name: /lesson actions/i })
      const practice = dock.getByRole('link', { name: /go to practice/i })
      const home = dock.getByRole('link', { name: /back to home/i })
      const rail = page.locator('.lesson-page .lesson-progress-preview__rail')
      const steps = rail.getByRole('listitem')

      await expect(dock).toBeVisible()
      await expect(dock.getByRole('link')).toHaveCount(2)
      await expect(practice).toHaveAttribute('href', `/lesson/${lessonId}/practice`)
      await expect(home).toHaveAttribute('href', '/home')
      await expect(
        page.getByRole('link', { name: /finish with short input/i }),
      ).toHaveCount(0)
      await expect(steps).toHaveCount(3)

      await dock.scrollIntoViewIfNeeded()

      const [dockBox, practiceBox, homeBox, railBox] = await Promise.all([
        dock.boundingBox(),
        practice.boundingBox(),
        home.boundingBox(),
        rail.boundingBox(),
      ])

      expect(dockBox).not.toBeNull()
      expect(practiceBox).not.toBeNull()
      expect(homeBox).not.toBeNull()
      expect(railBox).not.toBeNull()

      const buttonBoxes = [practiceBox!, homeBox!]
      const buttonLeft = Math.min(...buttonBoxes.map((box) => box.x))
      const buttonRight = Math.max(...buttonBoxes.map((box) => box.x + box.width))
      const buttonGroupCenter = (buttonLeft + buttonRight) / 2
      const buttonGroupWidth = buttonRight - buttonLeft
      const dockCenter = dockBox!.x + dockBox!.width / 2

      expect(Math.abs(buttonGroupCenter - dockCenter)).toBeLessThanOrEqual(2)
      expect(dockBox!.width - buttonGroupWidth).toBeLessThanOrEqual(64)

      for (const buttonBox of buttonBoxes) {
        expect(buttonBox.x).toBeGreaterThanOrEqual(dockBox!.x - 1)
        expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(
          dockBox!.x + dockBox!.width + 1,
        )
      }

      const stepBoxes = await steps.evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect()
          return { x: box.x, y: box.y, width: box.width }
        }),
      )

      if (width > 760) {
        expect(
          Math.max(...stepBoxes.map((box) => box.width)) -
            Math.min(...stepBoxes.map((box) => box.width)),
        ).toBeLessThanOrEqual(1)
        expect(
          Math.max(...stepBoxes.map((box) => box.y)) -
            Math.min(...stepBoxes.map((box) => box.y)),
        ).toBeLessThanOrEqual(1)
        expect(Math.abs(stepBoxes[0].x - railBox!.x)).toBeLessThanOrEqual(1)
        expect(
          Math.abs(
            stepBoxes[2].x + stepBoxes[2].width - railBox!.x - railBox!.width,
          ),
        ).toBeLessThanOrEqual(1)
      } else {
        expect(
          Math.max(...stepBoxes.map((box) => box.x)) -
            Math.min(...stepBoxes.map((box) => box.x)),
        ).toBeLessThanOrEqual(1)
        expect(stepBoxes[1].y).toBeGreaterThan(stepBoxes[0].y)
        expect(stepBoxes[2].y).toBeGreaterThan(stepBoxes[1].y)
      }

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBe(clientWidth)
    }
  }
})
```

- [ ] Run before CSS:

```bash
npm run test -- --run src/styles/global.test.ts src/pages/AdminLessonEditorPage.test.tsx
npm run test:e2e -- tests/e2e/lesson-action-dock.spec.ts
```

Expected RED: scoped CSS rules are absent and the desktop rail uses only 60% of the old five-column grid. Admin structure and post-Task-2 action assertions pass.

- [ ] Add these CSS overrides after the shared lesson overview rules:

```css
.lesson-page .lesson-header-card {
  gap: clamp(0.9rem, 2vw, 1.25rem);
  padding: clamp(1.25rem, 3vw, 2rem);
}

.lesson-page .lesson-header-card__title {
  gap: 0.1rem;
}

.lesson-page .lesson-header-card__title .eyebrow {
  margin-bottom: 0.25rem;
}

.lesson-page .lesson-progress-preview {
  gap: 0.75rem;
  padding: 0.85rem;
}

.lesson-page .lesson-progress-preview__summary {
  gap: 0.5rem;
}

.lesson-page .lesson-progress-preview__rail {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.lesson-page .lesson-overview-card {
  gap: 0.75rem;
}
```

Inside the existing `@media (max-width: 760px)` add:

```css
.lesson-page .lesson-progress-preview__rail {
  grid-template-columns: 1fr;
}
```

No negative margins, fixed heights, clipping, token changes, sticky rail, or horizontal scrolling. Preserve focus/current-step rules.

- [ ] Re-run both commands. Expected GREEN, including 1440px three equal columns, 760/390/320px one column, and `scrollWidth === clientWidth` at 320px.
- [ ] Commit: `style: compact learner lesson pages responsively`.

### Task 4: Full regression and scope audit

- [ ] Run exact focused acceptance:

```bash
npm run test -- --run src/pages/LessonPage.test.tsx src/pages/LessonRoutes.test.tsx src/pages/AdminLessonEditorPage.test.tsx src/styles/global.test.ts
npm run test:e2e -- tests/e2e/lesson-action-dock.spec.ts tests/e2e/mvp-flow.spec.ts
```

- [ ] Run full validation:

```bash
npm run test -- --run
npm run lint
npm run build
npm run test:e2e
```

Expected: all pass. Record an exact environment blocker if full Playwright cannot run; focused Playwright is known executable.

- [ ] Manual/browser smoke at one width `>760px` and exactly `320px`, in English and French:
  - header is visibly tighter without overlap/cropping;
  - only three semantic ordered steps, current step visible;
  - desktop steps are equal/full-width, mobile steps stack;
  - only three body sections and two action links;
  - tab focus remains visible and link accessible names are unchanged;
  - 320px has no horizontal overflow.

- [ ] Scope diff:

```bash
git diff --name-only origin/main...HEAD
git diff --check
git status --short
```

Expected changed paths only:

```text
src/content/copy.ts
src/pages/AdminLessonEditorPage.test.tsx
src/pages/LessonPage.test.tsx
src/pages/LessonPage.tsx
src/styles/global.css
src/styles/global.test.ts
tests/e2e/lesson-action-dock.spec.ts
```

- [ ] Push the implementation branch and attach its committed diff to the existing Loop reply thread for review:

```bash
git push -u origin feature/t47-course-page-three-layers
loop exec review add "$(printf \
  '{"path":"%s","base":"%s","head":"%s","name":"#t47 three-layer lesson implementation","thread":"#dylan-s-test:3d141777"}' \
  "$PWD" "$(git rev-parse origin/main)" "$(git rev-parse HEAD)")"
```

Expected: the remote branch points at local `HEAD`, and Loop reports that the review context was added.

- [ ] Send the implementation handoff with these populated fields and evidence from the commands above:
  - **Scope boundary:** the seven changed paths plus the explicit unchanged route/data/Admin/Review surfaces.
  - **Branch/commit:** `feature/t47-course-page-three-layers` and the exact `git rev-parse HEAD`.
  - **Verification:** focused unit, focused E2E, full unit, lint, build, full E2E, and manual browser smoke results.
  - **Remaining caveats:** exact unavailable dependency or environment blocker, or “none”.
  - **Current gate and exit condition:** implementation review; reviewer must publish `pass` or `fix required`.
  - **Next owner/action:** `dylan-t2-reviewer` reviews; after pass, `dylan-t2-planner` merges, reruns merged-head verification, confirms deployment, and performs production smoke.

The coding owner must not merge or deploy this branch.

## Scope-preservation acceptance checklist

- [ ] Learner page count derives from the three-entry `studyLayers.length`; no hard-coded count.
- [ ] English/French summaries mention exactly Dialogue, useful patterns/structures utiles, Vocabulary and contain no pronunciation/Hanzi-recognition wording.
- [ ] `lesson.dialogue.title` data remains; only its learner-page lede is gone.
- [ ] Pronunciation/Hanzi data, audio paths, types, Admin modules, editor fixtures, seed/schema/provider/API remain unchanged.
- [ ] `finishWithShortInput` copy key, `shortInput` data, direct route, Practice continuation, completion writes, and MVP flow remain unchanged; only the LessonPage entry link is gone.
- [ ] Invalid lesson is localized and does not write progress.
- [ ] Valid lesson changes only `lastVisitedLesson`; completed lessons, review queue, step progress, and selected language remain byte-for-byte equivalent values.
- [ ] Language switching still updates UI and persists `selectedExplanationLanguage`.
- [ ] `.lesson-page` appears on learner valid-lesson `<main>` only; no Admin/Review ancestor gets it.
- [ ] Every new compact/three-column declaration is under `.lesson-page`; shared `.lesson-header-card, .review-card`, tokens, and Admin styles are untouched.
- [ ] Desktop rail is `repeat(3, minmax(0, 1fr))`; `<=760px` scoped rule is `1fr`; 320px has no overflow.
- [ ] Existing `<ol>/<li>`, `.is-current`, focus styles, contrast tests, and accessible action names remain.

## Caveats

1. Rebase this map onto fetched `origin/main`; line numbers are exact for spec commit `1ed8cdc`/main baseline `c7a87c6`, but symbols/selectors are the durable anchors if main moved.
2. Compact values are concrete and content-driven. Visual adjustment must stay in the scoped selectors and update the CSS test; never tune shared rules.
3. The naked mobile rail has lower specificity than the scoped desktop rule; the scoped media rule is mandatory.
4. Keep both the dock’s negative entry assertion and the positive direct-route regression.
5. Do not delete copy/data; `getLocalizedText` remains used by retained content.
