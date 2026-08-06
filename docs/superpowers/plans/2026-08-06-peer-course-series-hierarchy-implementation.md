# Peer Course-Series Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present Pinyin and the ten-lesson Basic Chinese expressions Journey as localized peer course series on Home and Progress, with independent 3-section and 10-lesson progress, while preserving the supplied Home hero and every existing route, lesson, and storage contract.

**Architecture:** Introduce one reusable CSS vocabulary for a top-level course-series group and two sibling panels, then wrap the existing Home and Progress Journey renderers in that semantic shell before changing data. Next make `journeyNodes` lesson-only, compose the Pinyin entry directly from the existing `/pinyin` route and `loadPinyinProgress()`, and finally switch both pages to a shared `copy.courseSeries` contract containing the approved EN/FR label and titles. Keep practical completion/mastery driven by the existing ten Journey lesson IDs and keep Pinyin completion in its existing three-section store; no route, tab, schema, migration, or lesson-order work is involved.

**Tech Stack:** React 19, React Router 6.30, TypeScript 6, shared CSS, Vitest 4 with Testing Library, Playwright 1.61, Vite 8, oxlint

---

## File map

- **Modify:** `src/styles/global.test.ts:43-132` — pin the new peer-panel, wrapping, focus, and narrow-stack CSS hooks without weakening current Home/Progress card contracts.
- **Modify:** `src/styles/global.css:530-545,1303-1385,1540-1827,2634-2788` — add the shared course-series layout, compact Pinyin card, shared panel baseline, and responsive rules; do not edit any `.home-hero*` rule.
- **Modify:** `src/pages/HomePage.test.tsx:10-309` — drive the Home sibling-section shell, ten-card isolation, localized copy, semantics, and unchanged hero contracts.
- **Modify:** `src/pages/HomePage.tsx:1-197` — compose a standalone Pinyin panel and the existing Journey path as sibling sections below the untouched hero.
- **Modify:** `src/pages/ProgressPage.test.tsx:1-312` — drive sibling progress sections and independent Pinyin/Journey denominators.
- **Modify:** `src/pages/ProgressPage.tsx:1-279` — load existing Pinyin progress independently and remove route-node rendering while preserving summary, review, mastery, and Journey status behavior.
- **Modify:** `src/content/types.ts:25-38,151-174` — remove `pinyin-foundations`, `'route'`, `JourneyNodeRouteDetails`, and `routeDetails` from Journey types only.
- **Modify:** `src/content/journey.test.ts:1-78` — require exactly ten lesson nodes in order, with no Pinyin ID/icon/path.
- **Modify:** `src/content/journey.ts:1-229` — remove the Pinyin import, icon, route node, and order 11; retain all ten lesson records unchanged.
- **Create:** `src/content/copy.test.ts` — pin the exact approved EN/FR course-series copy and prove obsolete Home introduction keys are gone.
- **Modify:** `src/content/copy.ts:26-62,145-177,233-269,352-384` — add shared `courseSeries` copy and remove course-area strings made obsolete by it.
- **Modify:** `src/app/AppShell.test.tsx:13-66` — keep root and legacy `/home` routing coverage aligned with the new Home region without changing router behavior.
- **Modify:** `tests/e2e/home-page.spec.ts:49-247` — change the Journey path expectation from eleven to ten and prove the independent Pinyin panel while retaining every #t46 hero/image assertion and screenshot.
- **Modify:** `tests/e2e/pinyin-zone.spec.ts:113-218` — select the renamed Home Pinyin entry and retain the complete existing `/pinyin` flow/storage isolation test.
- **Create:** `tests/e2e/course-series.spec.ts` — cover Home/Progress peer semantics, 3-vs-10 progress, EN/FR switching, 390/320 stacking, wrapping, screenshots, and overflow.
- **Verify only:** `src/components/HomeHeroIllustration.tsx`, `public/images/home-hero-chinese-elements.webp`, `src/app/router.tsx`, `src/lib/pinyinProgress.ts`, `src/lib/progress.ts`, `src/content/course.ts`, `package.json`, `playwright.config.ts` — these existing contracts are consumed or regression-checked, not edited.

## Guardrails and implementation invariants

- Start from the committed plan head on `t45-course-series-hierarchy-design`. That plan commit must descend from rebased spec commit `1dc1c3b`, which is based on `origin/main` `c7a87c6`. Run the baseline checks below first and stop if unrelated commits or working-tree changes are present.
- Do not edit `docs/superpowers/specs/2026-08-05-peer-course-series-hierarchy-design.md`.
- Do not edit `src/components/HomeHeroIllustration.tsx`, `public/images/home-hero-chinese-elements.webp`, the Home hero JSX at `src/pages/HomePage.tsx:36-53`, or any `.home-hero*` CSS declaration. Existing Home hero unit and Playwright assertions remain in place.
- Do not add a route, tab, carousel, persistence field, storage migration, dependency, package script, or course/lesson reorder. `/pinyin` remains the route already declared by `appRoutes` in `src/app/router.tsx`.
- `loadPinyinProgress().completedSections.length` is the Pinyin numerator and literal `3` remains its existing total. The practical numerator is the unique completed IDs found in the ten lesson Journey nodes, and `lessonJourneyNodes.length` remains its denominator.
- Keep `pinyinProgressStorageKey` and the Pinyin validation/default-state code private and unchanged in `src/lib/pinyinProgress.ts`. Do not export a key or create a second progress API for this UI.
- Keep the Home lesson cards, Progress status cards, links, icons, summaries, and course order unchanged. Only the route-node branch disappears.
- The first three implementation phases below are deliberately ordered: **styles and shell**, then **hierarchy/progress**, then **copy**. Do not pull final titles into Tasks 1–2 or data cleanup into Task 2.

## Baseline

- [ ] From the repository root, confirm the expected branch and clean worktree:

```bash
git status --short --branch
PLAN=docs/superpowers/plans/2026-08-06-peer-course-series-hierarchy-implementation.md
PLAN_COMMIT="$(git log -1 --format=%H -- "$PLAN")"

test -n "$PLAN_COMMIT"
test "$(git rev-parse HEAD)" = "$PLAN_COMMIT"
git merge-base --is-ancestor 1dc1c3b "$PLAN_COMMIT"
git diff --name-only 1dc1c3b "$PLAN_COMMIT"
git log -3 --oneline
```

Expected: the branch is ahead of `origin/main` only by the approved spec and this committed plan; `HEAD` equals the commit that last changed the plan; the ancestry check succeeds; the `1dc1c3b..$PLAN_COMMIT` name list contains only this plan file; and there are no working-tree entries.

- [ ] Run the current focused baseline before changing tests:

```bash
npm run test -- --run \
  src/content/journey.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/styles/global.test.ts
```

Expected: **PASS**, currently 4 files and 31 tests. This proves any later red state comes from the new contracts.

### Task 1: Add the peer-series visual foundation first

**Files:**
- Modify: `src/styles/global.test.ts:43-132`
- Modify: `src/styles/global.css:530-545,1303-1385,1540-1827,2634-2788`

- [ ] **Step 1: Add a failing CSS contract for shared panels, full-card focus, wrapping, and mobile stacking**

Append this complete test inside the existing `global color accessibility tokens` describe block in `src/styles/global.test.ts`, immediately after `keeps the original Progress journey CTA pill baseline while Home polish stays scoped`:

```ts
it('defines a shared peer-series panel baseline with a compact focusable Pinyin entry', () => {
  const declarations = [
    ['.course-series', 'width: min(100%, 72rem);'],
    ['.course-series__list', 'grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr);'],
    ['.course-series__panel', 'min-width: 0;'],
    ['.course-series__panel', 'border-radius: var(--radius-lg);'],
    ['.course-series__title', 'overflow-wrap: anywhere;'],
    ['.course-series__pinyin-link', 'min-width: 0;'],
    ['.course-series__pinyin-link', 'min-height: 10rem;'],
    ['.course-series__pinyin-link', 'text-decoration: none;'],
    ['.course-series__pinyin-link:focus-visible', 'outline: 3px solid rgba(47, 111, 186, 0.5);'],
    ['.course-series__pinyin-mark', 'border-radius: 999px;'],
    ['.course-series__progress', 'overflow-wrap: anywhere;'],
  ]

  for (const [selector, declaration] of declarations) {
    expect(hasRule(selector)).toBe(true)
    expect(hasRuleWithDeclaration(selector, declaration)).toBe(true)
  }

  expect(hasRuleWithDeclaration('.course-series__panel--journey', 'overflow: hidden;')).toBe(true)
  expect(hasRuleWithDeclaration('.course-series__list', 'grid-template-columns: 1fr;')).toBe(true)
})
```

This is a source-level CSS contract consistent with the existing `global.test.ts` approach. The last assertion is satisfied by the narrow media-query rule added below; browser geometry is tested separately in Task 5.

- [ ] **Step 2: Run only the new style contract and verify RED**

```bash
npm run test -- --run src/styles/global.test.ts \
  -t "defines a shared peer-series panel baseline with a compact focusable Pinyin entry"
```

Expected: **FAIL** at the first `.course-series` assertion because no peer-series selectors exist yet. Existing color and Journey style tests remain untouched.

- [ ] **Step 3: Add the complete shared course-series styles without changing hero or Journey-card styling**

Insert this block immediately before the current `.journey-map {` rule in `src/styles/global.css`:

```css
.course-series {
  width: min(100%, 72rem);
  display: grid;
  gap: 1rem;
}

.course-series__label {
  margin: 0;
  padding-inline: 0.25rem;
}

.course-series__list {
  display: grid;
  grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.course-series__panel {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: clamp(1rem, 3vw, 1.35rem);
  border: 1px solid rgba(231, 234, 240, 0.92);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-card);
}

.course-series__panel--pinyin {
  background:
    radial-gradient(circle at top right, rgba(95, 143, 247, 0.15), transparent 12rem),
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(238, 244, 255, 0.9));
}

.course-series__panel--journey {
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(255, 138, 61, 0.1), transparent 14rem),
    linear-gradient(145deg, rgba(255, 253, 248, 0.98), rgba(255, 248, 238, 0.94));
}

.course-series__panel-header {
  min-width: 0;
}

.course-series__title {
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.course-series__pinyin-link {
  min-width: 0;
  min-height: 10rem;
  display: grid;
  align-content: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 1px solid rgba(95, 143, 247, 0.24);
  border-radius: 1.35rem;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.course-series__pinyin-link:hover,
.course-series__pinyin-link:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(47, 111, 186, 0.42);
  box-shadow: 0 22px 44px -34px rgba(47, 111, 186, 0.62);
}

.course-series__pinyin-link:focus-visible {
  outline: 3px solid rgba(47, 111, 186, 0.5);
  outline-offset: 3px;
}

.course-series__pinyin-mark {
  display: inline-grid;
  place-items: center;
  width: 3rem;
  aspect-ratio: 1;
  border: 1px solid rgba(95, 143, 247, 0.25);
  border-radius: 999px;
  color: var(--color-sky-ink);
  background: rgba(238, 244, 255, 0.94);
  font-size: 1.5rem;
  font-weight: 900;
  transform: rotate(-4deg);
}

.course-series__progress {
  margin: 0;
  color: var(--color-muted);
  font-weight: 750;
  overflow-wrap: anywhere;
}
```

Inside the existing `@media (max-width: 760px)` block, add `.course-series__list,` immediately before `.selection-hero,` in the one-column selector list, so the start of that rule is exactly:

```css
@media (max-width: 760px) {
  .course-series__list,
  .selection-hero,
  .lesson-grid,
  .card-grid,
  .journey-map__path,
  .progress-journey-map__path,
  .progress-stats-grid,
  .progress-summary-card,
  .lesson-overview-card,
  .lesson-progress-preview__rail,
  .review-status-panel,
  .admin-metric-grid,
  .admin-voice-status-grid,
  .admin-module-directory-grid,
  .admin-editor-hero__summary,
  .admin-editor-layout,
  .admin-field-grid--two-column {
    grid-template-columns: 1fr;
  }
```

Finally, add `.course-series__pinyin-link,` to the existing reduced-motion selector so it becomes:

```css
@media (prefers-reduced-motion: reduce) {
  .option-button,
  .primary-button,
  .secondary-link,
  .chip-button,
  .course-series__pinyin-link,
  .journey-node {
    transition: none;
  }
}
```

Do not move the existing Journey rules into this block and do not touch any `.home-hero*` selector.

- [ ] **Step 4: Run the style contract GREEN and retain all existing global CSS tests**

```bash
npm run test -- --run src/styles/global.test.ts
```

Expected: **PASS** for the complete file. The existing Home-only/Progress-only Journey selector tests still pass, proving this shared baseline did not leak card-specific polish.

- [ ] **Step 5: Commit the visual foundation**

```bash
git add src/styles/global.css src/styles/global.test.ts
git diff --cached --check
git commit -m "style: add peer course series panels"
```

Expected: the staged diff contains only the shared styles and their source-level contract; no hero, component, data, or copy file is included.

### Task 2: Establish the Home and Progress peer DOM skeletons

**Files:**
- Modify: `src/pages/HomePage.test.tsx:10-309`
- Modify: `src/pages/HomePage.tsx:1-197`
- Modify: `src/pages/ProgressPage.test.tsx:1-312`
- Modify: `src/pages/ProgressPage.tsx:1-279`

This phase intentionally keeps the current `Journey Map`, `Arrive in China step by step`, `Lesson progress`, and Pinyin lesson-title strings. It changes DOM hierarchy first; Task 3 changes data/progress and Task 4 introduces the approved copy.

- [ ] **Step 1: Add the failing Home sibling-section contract**

In `src/pages/HomePage.test.tsx`, replace the test named `shows all ten arrival lesson cards without progress or review shortcuts on the home page` with this complete structural test:

```tsx
it('renders Pinyin and the ten-card Journey as sibling course-series sections', () => {
  const { container } = renderRoute('/home')

  expect(screen.queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /go to review/i })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /view progress/i })).not.toBeInTheDocument()
  expect(screen.queryByText(/next lesson/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/review queue/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/course map/i)).not.toBeInTheDocument()

  const courseSeries = container.querySelector('.course-series')
  const pinyinHeading = screen.getByRole('heading', { level: 2, name: 'Pinyin Foundations 1' })
  const journeyHeading = screen.getByRole('heading', { level: 2, name: 'Journey Map' })
  const pinyinSection = pinyinHeading.closest('section')
  const journeySection = journeyHeading.closest('section')

  expect(courseSeries).toBeInTheDocument()
  expect(pinyinSection).toHaveClass('course-series__panel', 'course-series__panel--pinyin')
  expect(journeySection).toHaveClass('course-series__panel', 'course-series__panel--journey')
  expect(pinyinSection?.parentElement).toBe(journeySection?.parentElement)
  expect(pinyinSection?.parentElement).toHaveClass('course-series__list')

  const pinyinEntry = within(pinyinSection as HTMLElement).getByRole('link', {
    name: 'Pinyin Foundations 1',
  })
  const journeyLessonLinks = within(journeySection as HTMLElement)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(pinyinEntry).toHaveClass('course-series__pinyin-link')
  expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(within(journeySection as HTMLElement).queryByRole('link', { name: /pinyin/i }))
    .not.toBeInTheDocument()
  expect(within(pinyinSection as HTMLElement).queryAllByRole('link')).toHaveLength(1)
  expect(journeyLessonLinks).toHaveLength(10)
  expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
  expect(within(journeySection as HTMLElement).queryAllByText(/coming soon/i)).toHaveLength(0)
  expect(journeySection).not.toHaveTextContent(' / ')

  for (const [index, title] of expectedJourneyTitles.entries()) {
    const topic = expectedLessonTopicOrder[index]
    const heading = within(journeySection as HTMLElement).getByRole('heading', {
      level: 3,
      name: title,
    })

    expect(heading).toBeVisible()
    expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
    expect(within(heading).getByText(topic.en)).toHaveClass('lesson-topic-title__secondary')
  }
})
```

The cast is safe because each heading is required before `closest('section')` and the preceding assertions make a missing section fail clearly.

- [ ] **Step 2: Add the failing Progress sibling-section contract and adjust render-only expectations**

In `src/pages/ProgressPage.test.tsx`, immediately after `orderedJourneyNodes`, add:

```ts
const renderedJourneyNodes = orderedJourneyNodes.filter((node) => node.kind !== 'route')
```

Use `renderedJourneyNodes` instead of `orderedJourneyNodes` in the current tests that enumerate rendered cards/headings/statuses. Specifically:

```ts
for (const node of renderedJourneyNodes) {
  // keep the current assertion body unchanged
}
```

and replace the complete test `renders the shared arrival journey map in path order with ten lesson nodes, one bonus route, and zero previews` with:

```tsx
it('renders ten Journey cards in path order while the Pinyin entry is a peer', () => {
  renderRoute('/progress')

  const journeyMap = getJourneyMap()
  const cards = Array.from(journeyMap.querySelectorAll<HTMLElement>('.journey-node'))
  const pinyinHeading = screen.getByRole('heading', { level: 2, name: 'Pinyin Foundations 1' })
  const journeyHeading = within(journeyMap).getByRole('heading', {
    level: 2,
    name: 'Lesson progress',
  })
  const pinyinSection = pinyinHeading.closest('section')
  const journeySection = journeyHeading.closest('section')

  expect(pinyinSection).toHaveClass('course-series__panel', 'course-series__panel--pinyin')
  expect(journeySection).toHaveClass('course-series__panel', 'course-series__panel--journey')
  expect(pinyinSection?.parentElement).toBe(journeySection?.parentElement)
  expect(pinyinSection?.parentElement).toHaveClass('course-series__list')
  expect(within(pinyinSection as HTMLElement).getByRole('link', {
    name: 'Pinyin Foundations 1',
  })).toHaveAttribute('href', '/pinyin')
  expect(within(journeyMap).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()

  expect(cards).toHaveLength(10)
  expect(cards).toHaveLength(renderedJourneyNodes.length)
  expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
    renderedJourneyNodes.map((node) => node.id),
  )
  expect(
    cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
  ).toEqual(renderedJourneyNodes.map((node) => journeyTitle(node)))
  expect(journeyMap).not.toHaveTextContent(' / ')
  expect(within(journeyMap).queryAllByText('Preview')).toHaveLength(0)
  expect(within(journeyMap).getAllByText('Upcoming')).toHaveLength(10)
})
```

Replace `shows the pinyin bonus route without adding it to lesson mastery totals` with:

```tsx
it('keeps the peer Pinyin entry outside Journey mastery totals', () => {
  saveProgress({
    ...createDefaultProgress(),
    completedLessons: ['self-intro'],
    lastVisitedLesson: 'self-intro',
  })

  renderRoute('/progress')

  const pinyinEntry = screen.getByRole('link', { name: 'Pinyin Foundations 1' })

  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(within(getJourneyMap()).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()
  expect(screen.getAllByText(/1 of 10 lessons completed/i)[0]).toBeVisible()
  expect(screen.queryByText(/1 of 11/i)).not.toBeInTheDocument()
})
```

In `reuses the Home hand-drawn/kawaii journey card visual hooks on Progress`, change only the count assertion to:

```tsx
expect(journeyMap.querySelectorAll('.journey-node')).toHaveLength(10)
```

Replace `makes all ten lesson journey nodes and the pinyin bonus node whole-card links` with:

```tsx
it('makes all ten Journey cards and the peer Pinyin entry whole-card links', () => {
  renderRoute('/progress')

  const journeyMap = getJourneyMap()
  const lessonLinks = within(journeyMap)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))
  const pinyinEntry = screen.getByRole('link', { name: 'Pinyin Foundations 1' })

  expect(lessonLinks).toHaveLength(10)
  expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedJourneyLessonHrefs)
  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(within(journeyMap).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()

  for (const node of renderedJourneyNodes) {
    const card = getJourneyNodeCard(journeyTitlePattern(node))
    expect(card).toHaveRole('link')
    expect(card).toHaveClass('journey-node--card-link')
  }

  expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
    .not.toBeInTheDocument()
  expect(within(journeyMap).queryByRole('button', { name: /buy a metro ticket/i }))
    .not.toBeInTheDocument()
})
```

These changes express the render shell only: `journeyNodes` still has its route record until Task 3.

- [ ] **Step 3: Run the two page suites and verify the structural tests are RED**

```bash
npm run test -- --run src/pages/HomePage.test.tsx src/pages/ProgressPage.test.tsx
```

Expected: **FAIL** because neither page has `.course-series__list` or sibling panels, both still render Pinyin as a `.journey-node`, and Home lesson headings are still level 2.

- [ ] **Step 4: Wrap Home in the peer shell while leaving the hero byte-for-byte unchanged**

In `src/pages/HomePage.tsx`, add this import after the Journey import:

```tsx
import { pinyinCourse } from '../content/pinyin/course'
```

After `const copy = getUiCopy(language)`, add the temporary pre-copy-phase values:

```tsx
const pinyinSeriesTitle = getLocalizedText(pinyinCourse.lesson.title, language)
const visibleJourneyNodes = journeyNodes.filter((node) => node.kind !== 'route')
```

Replace the current opening from `<section aria-label={copy.homePage.journeyMapLabel}` through `<div className="journey-map__path">` with:

```tsx
<section className="page-grid course-series">
  <p className="eyebrow course-series__label">{copy.homePage.journeyEyebrow}</p>

  <div className="course-series__list">
    <section
      className="course-series__panel course-series__panel--pinyin"
      aria-labelledby="home-pinyin-series-title"
    >
      <Link
        className="course-series__pinyin-link"
        to="/pinyin"
        aria-labelledby="home-pinyin-series-title"
      >
        <span className="course-series__pinyin-mark" aria-hidden="true">
          拼
        </span>
        <h2 id="home-pinyin-series-title" className="course-series__title">
          {pinyinSeriesTitle}
        </h2>
      </Link>
    </section>

    <section
      aria-label={copy.homePage.journeyMapLabel}
      className="course-series__panel course-series__panel--journey journey-map"
    >
      <div className="section-heading journey-map__intro course-series__panel-header">
        <div>
          <h2>{copy.homePage.journeyMapLabel}</h2>
          <p className="lede">{copy.homePage.journeyIntro}</p>
        </div>
      </div>

      <div className="journey-map__path">
        {visibleJourneyNodes.map((node) => {
```

Keep the current node callback body, except make all three `LessonTopicTitle` calls inside this Journey panel use `as="h3"` instead of `as="h2"`. The three exact final calls are:

```tsx
<LessonTopicTitle as="h3" lessonId={node.lessonId} language={language} />
<LessonTopicTitle as="h3" title={node.title} language={language} />
<LessonTopicTitle as="h3" title={node.title} language={language} />
```

After the callback’s existing `})}`, replace the old two closing tags with these four closing tags:

```tsx
      </div>
    </section>
  </div>
</section>
```

Do not change lines 36–53 containing `<HomeHeroIllustration />`, language controls, title, or slogan.

- [ ] **Step 5: Wrap Progress in the same peer shell, still using its existing labels**

In `src/pages/ProgressPage.tsx`, add:

```tsx
import { pinyinCourse } from '../content/pinyin/course'
```

After the current module-scope `orderedJourneyNodes` sort declaration, add:

```tsx
const visibleJourneyNodes = orderedJourneyNodes.filter((node) => node.kind !== 'route')
```

Inside `ProgressPage`, immediately after `const copy = getUiCopy(language)`, add:

```tsx
const pinyinSeriesTitle = getLocalizedText(pinyinCourse.lesson.title, language)
```

Replace the opening of the current final section whose class is `surface-card progress-journey-card`, including its `aria-label={copy.progressPage.progressJourneyMapLabel}`, through the opening `<div className="progress-journey-map__path">` with:

```tsx
<section className="course-series progress-course-series">
  <p className="eyebrow course-series__label">
    {copy.progressPage.lessonProgressEyebrow}
  </p>

  <div className="course-series__list">
    <section
      className="course-series__panel course-series__panel--pinyin"
      aria-labelledby="progress-pinyin-series-title"
    >
      <Link
        className="course-series__pinyin-link"
        to="/pinyin"
        aria-labelledby="progress-pinyin-series-title"
      >
        <span className="course-series__pinyin-mark" aria-hidden="true">
          拼
        </span>
        <h2 id="progress-pinyin-series-title" className="course-series__title">
          {pinyinSeriesTitle}
        </h2>
      </Link>
    </section>

    <section
      className="surface-card progress-journey-card course-series__panel course-series__panel--journey"
      aria-label={copy.progressPage.progressJourneyMapLabel}
    >
      <div className="progress-list-card__header course-series__panel-header">
        <div>
          <h2>{copy.progressPage.lessonProgressLabel}</h2>
        </div>
        <span className="badge badge--sky">
          {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
        </span>
      </div>

      <div className="progress-journey-map__path">
        {visibleJourneyNodes.map((node) => {
```

Keep the existing node callback body unchanged in this phase. After its existing `})}`, replace the final two closing tags of that area with:

```tsx
      </div>
    </section>
  </div>
</section>
```

The Progress summary, stats, review queue, completion calculation, status mapping, and action links above this area are not moved.

- [ ] **Step 6: Update Home’s remaining lesson-heading assertions to level 3**

In `src/pages/HomePage.test.tsx`, every Journey lesson topic query now targets a heading nested under the series heading. The English loop already uses level 3 in Step 1. Replace the three French topic assertions with this complete block; do not change the hero’s level-1 checks or the two series level-2 checks:

```tsx
expect(
  screen.getByRole('heading', {
    level: 3,
    name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'fr'),
  }),
).toBeVisible()
expect(
  screen.getByRole('heading', {
    level: 3,
    name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'fr'),
  }),
).toBeVisible()
expect(
  screen.getByRole('heading', {
    level: 3,
    name: expectedLessonTopicPattern(expectedLessonTopicOrder[9], 'fr'),
  }),
).toBeVisible()
```

- [ ] **Step 7: Run both page suites GREEN**

```bash
npm run test -- --run src/pages/HomePage.test.tsx src/pages/ProgressPage.test.tsx
```

Expected: **PASS**. Home and Progress now have two sibling panels; each Journey renderer shows ten lesson cards and no Pinyin card even though the route record still exists in data. The current, not-yet-approved course-area strings remain until Task 4.

- [ ] **Step 8: Commit the semantic shell**

```bash
git add \
  src/pages/HomePage.tsx \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.tsx \
  src/pages/ProgressPage.test.tsx
git diff --cached --check
git commit -m "feat: establish peer course series sections"
```

Expected: only Home/Progress page and test files are staged. No copy, Journey data/type, progress library, route, hero component, asset, or hero CSS change is present.

### Task 3: Make Journey data lesson-only and wire independent 3-vs-10 progress

**Files:**
- Modify: `src/content/journey.test.ts:1-78`
- Modify: `src/content/journey.ts:1-229`
- Modify: `src/content/types.ts:25-38,151-174`
- Modify: `src/pages/HomePage.tsx:8-192`
- Modify: `src/pages/ProgressPage.test.tsx:1-312`
- Modify: `src/pages/ProgressPage.tsx:1-279`
- Verify only: `src/lib/pinyinProgress.ts`
- Verify only: `src/lib/progress.ts`

- [ ] **Step 1: Replace the Journey content contract with the complete ten-lesson requirement**

Replace all of `src/content/journey.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodeIcons, journeyNodes, journeyStages } from './journey'

const expectedJourneyNodeIds = [
  'airport-immigration',
  'taxi-to-stay',
  'hotel-check-in',
  'phone-and-payment',
  'convenience-store-run',
  'restaurant-order',
  'metro-ticket',
  'pharmacy-help',
  'ask-for-help-problem',
  'train-station-ticket',
] as const

const expectedEnglishTitles = [
  '到达机场 / Arrival at the airport',
  'Taxi to your stay',
  'Hotel / apartment check-in',
  'Phone number & mobile payment',
  'First convenience store run',
  'Order a simple meal',
  'Buy a metro ticket',
  'Ask for help at a pharmacy',
  'Ask for help with a problem',
  'Buy a train station ticket',
]

const expectedFrenchTitles = [
  '到达机场 / Arrivée à l’aéroport',
  'Taxi vers son logement',
  'Check-in hôtel / appartement',
  'Téléphone & paiement mobile',
  'Première course en supérette',
  'Commander un repas simple',
  'Acheter un ticket de métro',
  'Demander de l’aide à la pharmacie',
  'Demander de l’aide pour un problème',
  'Acheter un billet en gare',
]

describe('journey content', () => {
  it('exposes exactly ten ordered lesson nodes and no route node', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])
    expect(journeyNodes).toHaveLength(10)
    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(journeyNodes.map((node) => node.id)).toEqual(expectedJourneyNodeIds)
    expect(journeyNodes.every((node) => node.kind === 'lesson')).toBe(true)
    expect(journeyNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(journeyNodes.every((node) => node.previewDetails === undefined)).toBe(true)
    expect(journeyNodes.every((node) => !Object.hasOwn(node, 'routeDetails'))).toBe(true)
    expect(JSON.stringify(journeyNodes)).not.toContain('/pinyin')
    expect(JSON.stringify(journeyNodes)).not.toContain('pinyin-foundations')
  })

  it('pins the EN/FR Journey copy and icons for the same ten lessons', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual(expectedEnglishTitles)
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'fr'))).toEqual(expectedFrenchTitles)
    expect(journeyNodeIcons).toEqual({
      'airport-immigration': '🧳',
      'taxi-to-stay': '🚕',
      'hotel-check-in': '🏨',
      'phone-and-payment': '📱',
      'convenience-store-run': '🛒',
      'restaurant-order': '🍜',
      'metro-ticket': '🚇',
      'pharmacy-help': '💊',
      'ask-for-help-problem': '🆘',
      'train-station-ticket': '🚄',
    })
  })
})
```

- [ ] **Step 2: Add a failing Progress test for independent stores and denominators**

Add these imports to `src/pages/ProgressPage.test.tsx`:

```ts
import { createDefaultPinyinProgress, savePinyinProgress } from '../lib/pinyinProgress'
```

Insert this test immediately after `counts mastery from all ten complete lesson nodes`:

```tsx
it('reports Pinyin sections out of three independently from Journey lessons out of ten', () => {
  savePinyinProgress({
    ...createDefaultPinyinProgress(),
    visited: true,
    completedSections: ['reference', 'tone-game'],
  })
  saveProgress({
    ...createDefaultProgress(),
    completedLessons: ['self-intro'],
    lastVisitedLesson: 'self-intro',
  })

  renderRoute('/progress')

  const pinyinHeading = screen.getByRole('heading', { level: 2, name: 'Pinyin Foundations 1' })
  const pinyinSection = pinyinHeading.closest('section')
  const stats = screen.getByRole('region', { name: /learning indicators/i })

  expect(within(pinyinSection as HTMLElement).getByText('2 of 3 sections complete')).toBeVisible()
  expect(within(pinyinSection as HTMLElement).getByRole('link', {
    name: 'Pinyin Foundations 1',
  })).toHaveAttribute('href', '/pinyin')
  expect(within(stats).getByText('1/10')).toBeVisible()
  expect(within(stats).getByText('10%')).toBeVisible()
  expect(screen.getAllByText('1 of 10 lessons completed')[0]).toBeVisible()
  expect(within(getJourneyMap()).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()
})
```

This uses the real public loaders/savers and current schema. It does not expose storage keys or construct a new progress object shape.

- [ ] **Step 3: Run the new data and progress contracts and verify RED**

```bash
npm run test -- --run \
  src/content/journey.test.ts \
  src/pages/ProgressPage.test.tsx
```

Expected: **FAIL**. Journey still has 11 nodes and one route; the peer Progress Pinyin card does not yet show `2 of 3 sections complete`.

- [ ] **Step 4: Remove route concepts from Journey types**

In `src/content/types.ts`, replace `JourneyNodeId` and `JourneyNodeKind` with:

```ts
export type JourneyNodeId =
  | 'airport-immigration'
  | 'taxi-to-stay'
  | 'hotel-check-in'
  | 'phone-and-payment'
  | 'convenience-store-run'
  | 'restaurant-order'
  | 'metro-ticket'
  | 'pharmacy-help'
  | 'ask-for-help-problem'
  | 'train-station-ticket'

export type JourneyNodeKind = 'lesson' | 'preview'
```

Delete this interface completely:

```ts
export interface JourneyNodeRouteDetails {
  href: string
}
```

Replace the final `JourneyNode` interface with:

```ts
export interface JourneyNode {
  /** Stable shared journey node key for downstream progress/review consumers. */
  id: JourneyNodeId
  stageId: JourneyStageId
  kind: JourneyNodeKind
  title: LocalizedField
  eyebrow: LocalizedField
  summary: LocalizedField
  pathOrder: number
  lessonId?: LessonId
  previewDetails?: JourneyNodePreviewDetails
}
```

Do not touch the Pinyin types beginning with `PinyinLessonId`; they remain the Pinyin course/progress schema.

- [ ] **Step 5: Remove the Pinyin route record from Journey data and icons**

In `src/content/journey.ts`, delete:

```ts
import { pinyinCourse } from './pinyin/course'
```

Delete this icon entry:

```ts
'pinyin-foundations': '拼',
```

Delete the complete final object in `journeyNodeData`:

```ts
{
  id: 'pinyin-foundations',
  stageId: 'arrival-in-china',
  kind: 'route',
  title: pinyinCourse.lesson.title,
  eyebrow: {
    en: 'Pinyin',
    fr: 'Pinyin',
  },
  summary: pinyinCourse.lesson.summary,
  pathOrder: 11,
  routeDetails: {
    href: '/pinyin',
  },
},
```

The array now ends immediately after the unchanged `train-station-ticket` object at `pathOrder: 10`. Do not edit any of the ten lesson objects, `journeyStages`, or `getLesson()`.

- [ ] **Step 6: Remove Home’s temporary route filter and unreachable route renderer**

In `src/pages/HomePage.tsx`, delete:

```tsx
const visibleJourneyNodes = journeyNodes.filter((node) => node.kind !== 'route')
```

Change the map source to:

```tsx
{journeyNodes.map((node) => {
```

Delete the entire route branch, from its condition through its closing brace:

```tsx
if (node.kind === 'route' && node.routeDetails) {
  return (
    <Link
      key={node.id}
      className="journey-node journey-node--route journey-node--card-link"
      to={node.routeDetails.href}
    >
      <div className="journey-node__body">
        <div className="journey-node__header">
          <span className="badge badge--sky">{nodeEyebrow}</span>
        </div>

        <LessonTopicTitle as="h3" title={node.title} language={language} />
        <p className="muted-text">{nodeSummary}</p>
      </div>

      <span
        className="journey-node__illustration-slot journey-node__illustration-slot--stamp"
        aria-hidden="true"
      >
        <span className="journey-node__doodle journey-node__doodle--stamp">
          {nodeIcon}
        </span>
      </span>
    </Link>
  )
}
```

The existing lesson branch and preview fallback remain unchanged. The independently composed `/pinyin` link above the Journey panel remains.

- [ ] **Step 7: Load existing Pinyin progress independently on Progress**

In `src/pages/ProgressPage.tsx`, add:

```tsx
import { loadPinyinProgress } from '../lib/pinyinProgress'
```

Delete the route-only type and guard:

```tsx
type RouteJourneyNode = JourneyNode & { kind: 'route'; routeDetails: { href: string } }

function isRouteJourneyNode(node: JourneyNode): node is RouteJourneyNode {
  return node.kind === 'route' && node.routeDetails !== undefined
}
```

Delete the temporary render filter:

```tsx
const visibleJourneyNodes = orderedJourneyNodes.filter((node) => node.kind !== 'route')
```

Inside `ProgressPage`, immediately after `const progress = loadProgress()`, add:

```tsx
const pinyinProgress = loadPinyinProgress()
```

Immediately after `const pinyinSeriesTitle = getLocalizedText(pinyinCourse.lesson.title, language)`, add:

```tsx
const completedPinyinSectionsCount = pinyinProgress.completedSections.length
const totalPinyinSections = 3
```

Inside the Pinyin link, immediately after its `<h2>`, add:

```tsx
<p className="course-series__progress">
  {copy.pinyinPage.sectionProgress(completedPinyinSectionsCount, totalPinyinSections)}
</p>
```

Change the Journey map source to:

```tsx
{orderedJourneyNodes.map((node) => {
```

Delete the complete route branch:

```tsx
if (isRouteJourneyNode(node)) {
  return (
    <Link
      key={node.id}
      className="journey-node progress-journey-node journey-node--route journey-node--card-link progress-journey-node--route"
      data-journey-node-id={node.id}
      to={node.routeDetails.href}
      aria-label={nodeTitle}
    >
      <div className="journey-node__header">
        <span className="badge badge--sky">{nodeEyebrow}</span>
      </div>

      <span className="journey-node__doodle" aria-hidden="true">
        {nodeIcon}
      </span>

      <div>
        <h3>{nodeTitle}</h3>
        <p className="muted-text">{nodeSummary}</p>
      </div>
    </Link>
  )
}
```

Do not change `completedLessonIds`, `completedLessonsCount`, `totalLessons`, or `completionPercent`; with Journey now lesson-only they continue to calculate practical progress from ten Journey lesson IDs.

- [ ] **Step 8: Simplify Progress tests now that render data and source data are identical**

In `src/pages/ProgressPage.test.tsx`, delete:

```ts
const renderedJourneyNodes = orderedJourneyNodes.filter((node) => node.kind !== 'route')
```

Replace every `renderedJourneyNodes` reference added in Task 2 with `orderedJourneyNodes`. The exact count/order assertions become:

```tsx
expect(cards).toHaveLength(10)
expect(cards).toHaveLength(orderedJourneyNodes.length)
expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
  orderedJourneyNodes.map((node) => node.id),
)
expect(
  cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
```

- [ ] **Step 9: Run focused data/page tests and the typechecked production build GREEN**

```bash
npm run test -- --run \
  src/content/journey.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/lib/pinyinProgress.test.ts \
  src/lib/progress.test.ts
npm run build
```

Expected: **PASS**. Build/typecheck finds no `'route'`, `routeDetails`, or `pinyin-foundations` Journey use. Home still reaches `/pinyin` from its independent panel. Progress shows Pinyin `2 of 3 sections complete` while practical stats remain `1/10` and `10%` in the new test.

- [ ] **Step 10: Run a focused stale-hierarchy scan**

```bash
if rg -n "'pinyin-foundations'|JourneyNodeRouteDetails|routeDetails|kind: 'route'|node.kind === 'route'|journey-node--route|progress-journey-node--route" \
  src/content/types.ts \
  src/content/journey.ts \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx; then
  echo "stale Journey route hierarchy remains" >&2
  exit 1
fi
rg -n "pathOrder: (1|2|3|4|5|6|7|8|9|10)" src/content/journey.ts
rg -n "not\\.toContain\\('pinyin-foundations'\\)" src/content/journey.test.ts
```

Expected: the first production-source scan prints nothing and succeeds through the inverted `if`; its quoted old ID pattern does not reject the legitimate Pinyin-only ID `'pinyin-foundations-1'`. The second scan prints the ten existing lesson orders only, and the third proves the exact old Journey ID remains covered by a negative unit assertion rather than being mistaken for production residue. `/pinyin` still exists in `src/app/router.tsx` and the independent page links, which is correct.

- [ ] **Step 11: Commit the data and progress correction**

```bash
git add \
  src/content/types.ts \
  src/content/journey.ts \
  src/content/journey.test.ts \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx \
  src/pages/ProgressPage.test.tsx
git diff --cached --check
git commit -m "feat: separate Pinyin from Journey progress"
```

Expected: no storage library, course content, lesson file, route, hero, asset, or copy file is staged. The commit removes one Journey route record and reads the existing Pinyin store without changing its schema.

### Task 4: Apply the concise, aligned EN/FR copy from one shared contract

**Files:**
- Create: `src/content/copy.test.ts`
- Modify: `src/content/copy.ts:26-62,145-177,233-269,352-384`
- Modify: `src/pages/HomePage.test.tsx:10-309`
- Modify: `src/pages/HomePage.tsx:7-194`
- Modify: `src/pages/ProgressPage.test.tsx:14-330`
- Modify: `src/pages/ProgressPage.tsx:4-270`
- Modify: `src/app/AppShell.test.tsx:13-66`

- [ ] **Step 1: Create the failing exact-copy contract**

Create `src/content/copy.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import { getUiCopy } from './copy'

describe('course-series UI copy', () => {
  it('pins the approved English and French label and titles', () => {
    expect(getUiCopy('en').courseSeries).toEqual({
      label: 'Course series',
      pinyinTitle: 'Mandarin tones and pinyin',
      basicExpressionsTitle: 'Basic Chinese expressions for a stress-free journey',
    })
    expect(getUiCopy('fr').courseSeries).toEqual({
      label: 'Séries de cours',
      pinyinTitle: 'Tons et pinyin du mandarin',
      basicExpressionsTitle: 'Expressions chinoises essentielles pour voyager sereinement',
    })
  })

  it('removes the redundant Home and Progress Journey introduction keys', () => {
    for (const language of ['en', 'fr'] as const) {
      const copy = getUiCopy(language)

      expect(copy.homePage).not.toHaveProperty('journeyEyebrow')
      expect(copy.homePage).not.toHaveProperty('journeyMapLabel')
      expect(copy.homePage).not.toHaveProperty('journeyIntro')
      expect(copy.progressPage).not.toHaveProperty('lessonProgressEyebrow')
      expect(copy.progressPage).not.toHaveProperty('lessonProgressLabel')
      expect(copy.progressPage).not.toHaveProperty('progressJourneyMapLabel')
    }
  })
})
```

- [ ] **Step 2: Add final Home and Progress content/semantics assertions before implementation**

At the top of `src/pages/HomePage.test.tsx`, after `expectedJourneyTitles`, add:

```ts
const expectedSeriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Basic Chinese expressions for a stress-free journey',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
  },
} as const

function getHomeCourseSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].label })
}

function getHomePinyinSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].pinyin })
}

function getHomeJourneySeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].journey })
}
```

Replace the Task 2 structural test with this final complete version:

```tsx
it('renders the approved Pinyin and ten-card Journey series as labeled siblings', () => {
  renderRoute('/home')

  const courseSeries = getHomeCourseSeries()
  const pinyinSection = getHomePinyinSeries()
  const journeySection = getHomeJourneySeries()
  const pinyinEntry = within(pinyinSection).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })
  const journeyLessonLinks = within(journeySection)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

  expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
  expect(within(pinyinSection).getByRole('heading', {
    level: 2,
    name: expectedSeriesCopy.en.pinyin,
  })).toBeVisible()
  expect(within(journeySection).getByRole('heading', {
    level: 2,
    name: expectedSeriesCopy.en.journey,
  })).toBeVisible()
  expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
  expect(pinyinSection.parentElement).toHaveClass('course-series__list')
  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(pinyinEntry).toHaveClass('course-series__pinyin-link')
  expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(within(journeySection).queryByRole('link', { name: /pinyin/i }))
    .not.toBeInTheDocument()
  expect(journeyLessonLinks).toHaveLength(10)
  expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
  expect(within(journeySection).queryAllByText(/coming soon/i)).toHaveLength(0)
  expect(journeySection).not.toHaveTextContent(' / ')
  expect(screen.queryByText('Journey Map')).not.toBeInTheDocument()
  expect(screen.queryByText('Arrive in China step by step')).not.toBeInTheDocument()

  for (const [index, title] of expectedJourneyTitles.entries()) {
    const topic = expectedLessonTopicOrder[index]
    const heading = within(journeySection).getByRole('heading', { level: 3, name: title })

    expect(heading).toBeVisible()
    expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
    expect(within(heading).getByText(topic.en)).toHaveClass('lesson-topic-title__secondary')
  }
})
```

In the French Home test, add these exact final assertions after rendering:

```tsx
const courseSeries = getHomeCourseSeries('fr')
const pinyinSeries = getHomePinyinSeries('fr')
const journeySeries = getHomeJourneySeries('fr')

expect(within(courseSeries).getByText(expectedSeriesCopy.fr.label)).toBeVisible()
expect(within(pinyinSeries).getByRole('heading', {
  level: 2,
  name: expectedSeriesCopy.fr.pinyin,
})).toBeVisible()
expect(within(journeySeries).getByRole('heading', {
  level: 2,
  name: expectedSeriesCopy.fr.journey,
})).toBeVisible()
expect(within(pinyinSeries).getByRole('link', {
  name: expectedSeriesCopy.fr.pinyin,
})).toHaveAttribute('href', '/pinyin')
expect(screen.queryByText(expectedSeriesCopy.en.label)).not.toBeInTheDocument()
expect(screen.queryByText(expectedSeriesCopy.en.pinyin)).not.toBeInTheDocument()
expect(screen.queryByText(expectedSeriesCopy.en.journey)).not.toBeInTheDocument()
expect(screen.queryByText('Carte du parcours')).not.toBeInTheDocument()
expect(screen.queryByText('Arriver en Chine étape par étape')).not.toBeInTheDocument()
```

At the top of `src/pages/ProgressPage.test.tsx`, after `expectedJourneyLessonHrefs`, add the same `expectedSeriesCopy` object shown above, then replace `getJourneyMap()` with these helpers:

```ts
function getProgressCourseSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].label })
}

function getPinyinProgressSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].pinyin })
}

function getJourneyMap(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].journey })
}
```

In the first French Progress test, replace the old direct Journey region query with:

```tsx
const courseSeries = getProgressCourseSeries('fr')
const pinyinSeries = getPinyinProgressSeries('fr')
const journeyMap = getJourneyMap('fr')

expect(within(courseSeries).getByText(expectedSeriesCopy.fr.label)).toBeVisible()
expect(within(pinyinSeries).getByRole('heading', {
  level: 2,
  name: expectedSeriesCopy.fr.pinyin,
})).toBeVisible()
expect(within(journeyMap).getByRole('heading', {
  level: 2,
  name: expectedSeriesCopy.fr.journey,
})).toBeVisible()
```

Replace the Task 2 sibling test with this final complete test:

```tsx
it('renders ten Journey cards in path order while the approved Pinyin series is a peer', () => {
  renderRoute('/progress')

  const courseSeries = getProgressCourseSeries()
  const pinyinSection = getPinyinProgressSeries()
  const journeyMap = getJourneyMap()
  const cards = Array.from(journeyMap.querySelectorAll<HTMLElement>('.journey-node'))

  expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
  expect(within(pinyinSection).getByRole('heading', {
    level: 2,
    name: expectedSeriesCopy.en.pinyin,
  })).toBeVisible()
  expect(within(journeyMap).getByRole('heading', {
    level: 2,
    name: expectedSeriesCopy.en.journey,
  })).toBeVisible()
  expect(pinyinSection.parentElement).toBe(journeyMap.parentElement)
  expect(pinyinSection.parentElement).toHaveClass('course-series__list')
  expect(within(pinyinSection).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })).toHaveAttribute('href', '/pinyin')
  expect(within(journeyMap).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()

  expect(cards).toHaveLength(10)
  expect(cards).toHaveLength(orderedJourneyNodes.length)
  expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
    orderedJourneyNodes.map((node) => node.id),
  )
  expect(
    cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
  ).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
  expect(journeyMap).not.toHaveTextContent(' / ')
  expect(within(journeyMap).queryAllByText('Preview')).toHaveLength(0)
  expect(within(journeyMap).getAllByText('Upcoming')).toHaveLength(10)
})
```

In the remaining `keeps the peer Pinyin entry outside Journey mastery totals` and `makes all ten Journey cards and the peer Pinyin entry whole-card links` tests, replace the exact query with:

```tsx
const pinyinEntry = screen.getByRole('link', { name: expectedSeriesCopy.en.pinyin })
```

In the independent-progress test, replace its heading/`closest()` lookup and following assertions with:

```tsx
const pinyinSection = getPinyinProgressSeries()
const stats = screen.getByRole('region', { name: /learning indicators/i })

expect(within(pinyinSection).getByText('2 of 3 sections complete')).toBeVisible()
expect(within(pinyinSection).getByRole('link', {
  name: expectedSeriesCopy.en.pinyin,
})).toHaveAttribute('href', '/pinyin')
expect(within(stats).getByText('1/10')).toBeVisible()
expect(within(stats).getByText('10%')).toBeVisible()
expect(screen.getAllByText('1 of 10 lessons completed')[0]).toBeVisible()
expect(within(getJourneyMap()).queryByRole('link', { name: /pinyin/i }))
  .not.toBeInTheDocument()
```

- [ ] **Step 3: Run copy and page suites and verify RED**

```bash
npm run test -- --run \
  src/content/copy.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx
```

Expected: **FAIL** because `courseSeries` is absent and the pages still expose the old temporary titles/labels. The independent 3-vs-10 logic itself remains green inside the failing Progress file.

- [ ] **Step 4: Add the shared approved copy and remove only obsolete course-area keys**

In both `uiCopy.en` and `uiCopy.fr`, insert `courseSeries` immediately before `homePage`.

English:

```ts
courseSeries: {
  label: 'Course series',
  pinyinTitle: 'Mandarin tones and pinyin',
  basicExpressionsTitle: 'Basic Chinese expressions for a stress-free journey',
},
```

French:

```ts
courseSeries: {
  label: 'Séries de cours',
  pinyinTitle: 'Tons et pinyin du mandarin',
  basicExpressionsTitle: 'Expressions chinoises essentielles pour voyager sereinement',
},
```

Delete these three properties from both `homePage` objects:

```ts
journeyEyebrow: 'Journey Map',
journeyMapLabel: 'Journey Map',
journeyIntro: 'Arrive in China step by step',
```

```ts
journeyEyebrow: 'Carte du parcours',
journeyMapLabel: 'Carte du parcours',
journeyIntro: 'Arriver en Chine étape par étape',
```

Delete these three properties from both `progressPage` objects:

```ts
lessonProgressLabel: 'Lesson progress',
progressJourneyMapLabel: 'Progress journey map',
lessonProgressEyebrow: 'Course map',
```

```ts
lessonProgressLabel: 'Progression des leçons',
progressJourneyMapLabel: 'Carte de progression du parcours',
lessonProgressEyebrow: 'Carte du parcours',
```

Keep every other Home, Progress, and Pinyin page string and formatter unchanged.

- [ ] **Step 5: Make Home consume only `copy.courseSeries` for its area labels/titles**

In `src/pages/HomePage.tsx`, delete:

```tsx
import { pinyinCourse } from '../content/pinyin/course'
```

and delete:

```tsx
const pinyinSeriesTitle = getLocalizedText(pinyinCourse.lesson.title, language)
```

Replace the complete course-series opening through the Journey panel header with:

```tsx
<section
  className="page-grid course-series"
  aria-label={copy.courseSeries.label}
>
  <p className="eyebrow course-series__label">{copy.courseSeries.label}</p>

  <div className="course-series__list">
    <section
      className="course-series__panel course-series__panel--pinyin"
      aria-labelledby="home-pinyin-series-title"
    >
      <Link
        className="course-series__pinyin-link"
        to="/pinyin"
        aria-labelledby="home-pinyin-series-title"
      >
        <span className="course-series__pinyin-mark" aria-hidden="true">
          拼
        </span>
        <h2 id="home-pinyin-series-title" className="course-series__title">
          {copy.courseSeries.pinyinTitle}
        </h2>
      </Link>
    </section>

    <section
      aria-labelledby="home-journey-series-title"
      className="course-series__panel course-series__panel--journey journey-map"
    >
      <div className="section-heading journey-map__intro course-series__panel-header">
        <div>
          <h2 id="home-journey-series-title" className="course-series__title">
            {copy.courseSeries.basicExpressionsTitle}
          </h2>
        </div>
      </div>
```

The existing `<div className="journey-map__path">` follows immediately. There is no eyebrow or paragraph inside this Journey section. The group label appears once, each series title appears once, and all lesson content below remains unchanged.

- [ ] **Step 6: Make Progress consume the same title objects while retaining counts**

In `src/pages/ProgressPage.tsx`, delete:

```tsx
import { pinyinCourse } from '../content/pinyin/course'
```

and delete:

```tsx
const pinyinSeriesTitle = getLocalizedText(pinyinCourse.lesson.title, language)
```

Replace the complete course-series opening through the Journey header with:

```tsx
<section
  className="course-series progress-course-series"
  aria-label={copy.courseSeries.label}
>
  <p className="eyebrow course-series__label">{copy.courseSeries.label}</p>

  <div className="course-series__list">
    <section
      className="course-series__panel course-series__panel--pinyin"
      aria-labelledby="progress-pinyin-series-title"
    >
      <Link
        className="course-series__pinyin-link"
        to="/pinyin"
        aria-labelledby="progress-pinyin-series-title"
      >
        <span className="course-series__pinyin-mark" aria-hidden="true">
          拼
        </span>
        <h2 id="progress-pinyin-series-title" className="course-series__title">
          {copy.courseSeries.pinyinTitle}
        </h2>
        <p className="course-series__progress">
          {copy.pinyinPage.sectionProgress(completedPinyinSectionsCount, totalPinyinSections)}
        </p>
      </Link>
    </section>

    <section
      className="surface-card progress-journey-card course-series__panel course-series__panel--journey"
      aria-labelledby="progress-journey-series-title"
    >
      <div className="progress-list-card__header course-series__panel-header">
        <div>
          <h2 id="progress-journey-series-title" className="course-series__title">
            {copy.courseSeries.basicExpressionsTitle}
          </h2>
        </div>
        <span className="badge badge--sky">
          {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
        </span>
      </div>
```

Keep the existing Journey path directly after this header. The Pinyin section’s accessible name remains the title alone because `aria-labelledby` points only to its heading, while the visible progress sentence remains inside the full-card link.

- [ ] **Step 7: Align every Home test lookup with the final labeled sections**

In `src/pages/HomePage.test.tsx`, replace every old Home Journey region lookup with `getHomeJourneySeries()` or `getHomeJourneySeries('fr')` as appropriate. The affected named tests are:

- `centers the hero theme and removes the old right-side learning mockup`;
- `renders page-level French copy when the learner chooses French mode`;
- `persists a global explanation language choice from the Home hero` (use French after the French click and English after the English click);
- `removes hero quick entry cards without changing lesson card destinations`;
- `does not expose next-lesson state on the home page even after lessons are complete`;
- `makes each lesson journey node a whole-card link to its real lesson route`;
- `keeps the journey map as the only lesson entry section and exposes a stamp illustration slot on each card`;
- `keeps all formal lesson nodes out of preview affordances`.

For every English test that declares a Journey variable, the exact final declaration is:

```tsx
const journeyMap = getHomeJourneySeries()
```

For the two direct French lookups, use these exact forms:

```tsx
expect(getHomeJourneySeries('fr')).not.toHaveTextContent(' / ')
const journeyMap = getHomeJourneySeries('fr')
```

In the language-persistence test, replace its post-click region assertions with:

```tsx
expect(getHomeJourneySeries('fr')).toBeVisible()
```

and, after switching back to English:

```tsx
expect(getHomeJourneySeries()).toBeVisible()
```

No `getByLabelText(/journey map/i)`, `getByLabelText(/carte du parcours/i)`, or old regex-named Journey `getByRole` lookup remains after these replacements.

In `centers the hero theme and removes the old right-side learning mockup`, replace the old introduction visibility assertion with:

```tsx
const journeySeries = getHomeJourneySeries()
expect(within(journeySeries).queryAllByText(/coming soon/i)).toHaveLength(0)
expect(within(journeySeries).queryByRole('button', { name: /buy a metro ticket/i }))
  .not.toBeInTheDocument()
expect(within(journeySeries).getByRole('heading', {
  level: 2,
  name: expectedSeriesCopy.en.journey,
})).toBeVisible()
expect(screen.queryByText('Journey Map')).not.toBeInTheDocument()
expect(screen.queryByText('Arrive in China step by step')).not.toBeInTheDocument()
```

The existing hero illustration/content assertions in that test and in `renders one aria-hidden supplied illustration behind unchanged home hero content` remain exactly unchanged.

- [ ] **Step 8: Update the App shell root contract without changing routes**

In `src/app/AppShell.test.tsx`, add after the imports:

```ts
const homeSeriesCopy = {
  label: 'Course series',
  pinyin: 'Mandarin tones and pinyin',
  journey: 'Basic Chinese expressions for a stress-free journey',
} as const
```

In `shows the Home page on the root route by default`, replace the old `journeyMap` block with:

```tsx
const courseSeries = screen.getByRole('region', { name: homeSeriesCopy.label })
const pinyinSeries = within(courseSeries).getByRole('region', { name: homeSeriesCopy.pinyin })
const journeySeries = within(courseSeries).getByRole('region', { name: homeSeriesCopy.journey })
const lessonLinks = within(journeySeries)
  .getAllByRole('link')
  .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

expect(lessonLinks).toHaveLength(10)
expect(within(pinyinSeries).getByRole('link', { name: homeSeriesCopy.pinyin })).toHaveAttribute(
  'href',
  '/pinyin',
)
expect(
  within(journeySeries).getByRole('link', {
    name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'en'),
  }),
).toHaveAttribute('href', '/lesson/self-intro')
expect(journeySeries).not.toHaveTextContent(' / ')
```

Keep `keeps the legacy /home route compatible with the same Home page content` unchanged: its route and lesson-link assertion still prove the redirect contract.

- [ ] **Step 9: Run all copy/Home/Progress/App-shell tests GREEN**

```bash
npm run test -- --run \
  src/content/copy.test.ts \
  src/content/journey.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/app/AppShell.test.tsx
```

Expected: **PASS**. Exact English and French titles are pinned, language switching exposes only the selected language, old Journey introduction text is absent, sibling sections have consistent level-2 headings, and Journey cards remain level 3.

- [ ] **Step 10: Scan for stale course-area literals and accidental duplicate implementations**

```bash
if rg -n "Arrive in China step by step|Arriver en Chine étape par étape|journeyEyebrow|journeyMapLabel|journeyIntro|lessonProgressEyebrow|lessonProgressLabel|progressJourneyMapLabel" \
  src/content/copy.ts \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx; then
  echo "obsolete course-area copy remains" >&2
  exit 1
fi
rg -n "Course series|Séries de cours|Mandarin tones and pinyin|Tons et pinyin du mandarin|Basic Chinese expressions for a stress-free journey|Expressions chinoises essentielles pour voyager sereinement" \
  src/content/copy.ts \
  src/content/copy.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx
```

Expected: the obsolete scan prints nothing. Approved production literals occur only in `src/content/copy.ts`; test files repeat them intentionally as independent contracts. Neither page component hard-codes EN/FR copy.

- [ ] **Step 11: Commit the aligned content**

```bash
git add \
  src/content/copy.ts \
  src/content/copy.test.ts \
  src/pages/HomePage.tsx \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.tsx \
  src/pages/ProgressPage.test.tsx \
  src/app/AppShell.test.tsx
git diff --cached --check
git commit -m "feat: align course series copy"
```

Expected: the commit contains shared copy consumption and test updates only. It does not alter hero media/CSS, routes, storage, Pinyin lesson content, practical lesson content, or Journey order.

### Task 5: Add browser-level peer hierarchy, continuity, and responsive evidence

**Files:**
- Modify: `tests/e2e/home-page.spec.ts:49-247`
- Modify: `tests/e2e/pinyin-zone.spec.ts:113-218`
- Create: `tests/e2e/course-series.spec.ts`
- Verify unchanged: `tests/e2e/mvp-flow.spec.ts`

- [ ] **Step 1: Update the existing Home browser contract while retaining every hero check**

In `tests/e2e/home-page.spec.ts`, keep `heroViewports`, all supplied-image selectors/assertions, image dimensions/opacity checks, hero bounding checks, title/slogan/language-control checks, and four hero screenshot attachments unchanged.

Immediately before the current `journeyNodes` locator, add:

```ts
const courseSeries = page.getByRole('region', { name: 'Course series' })
const pinyinSeries = courseSeries.getByRole('region', { name: 'Mandarin tones and pinyin' })
const journeySeries = courseSeries.getByRole('region', {
  name: 'Basic Chinese expressions for a stress-free journey',
})
const pinyinEntry = pinyinSeries.getByRole('link', { name: 'Mandarin tones and pinyin' })
```

Replace the current Journey/Pinyin count block with:

```ts
const journeyNodes = journeySeries.locator('.journey-map__path > .journey-node')
await expect(courseSeries.getByText('Course series', { exact: true })).toBeVisible()
await expect(pinyinSeries.getByRole('heading', {
  level: 2,
  name: 'Mandarin tones and pinyin',
})).toBeVisible()
await expect(journeySeries.getByRole('heading', {
  level: 2,
  name: 'Basic Chinese expressions for a stress-free journey',
})).toBeVisible()
await expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
await expect(journeySeries.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
await expect(journeyNodes).toHaveCount(10)
await expect(page.getByText('Journey Map', { exact: true })).toHaveCount(0)
await expect(page.getByText('Arrive in China step by step', { exact: true })).toHaveCount(0)
```

Delete the old `Pinyin Foundations 1` link assertion later in the test. Change all lesson-title and `not.toContainText(' / ')` locators from `.journey-map` to `journeySeries`, for example:

```ts
await expect(journeySeries.locator('.lesson-topic-title__primary').first()).toHaveText('到达机场')
await expect(journeySeries.locator('.lesson-topic-title__secondary').first()).toHaveText(
  'Arrival at the airport',
)
await expect(journeySeries).not.toContainText(' / ')
```

The existing viewport loop continues using the same `journeyNodes.first()` and `.nth(1)` locators, so it still proves the ten-card Journey’s mobile single-column behavior while all #t46 hero checks remain present.

Inside that viewport loop, change the lesson-title locator from the former level-2 heading:

```ts
const title = firstCard.locator('h2')
```

to the level-3 heading established in Task 2:

```ts
const title = firstCard.locator('h3')
```

Keep the existing title bounding-box and width assertions unchanged.

- [ ] **Step 2: Update the existing complete Pinyin browser flow to use the approved entry title**

In `tests/e2e/pinyin-zone.spec.ts`, replace only:

```ts
const pinyinEntry = page.getByRole('link', { name: /Pinyin Foundations 1/i })
```

with:

```ts
const pinyinEntry = page.getByRole('link', { name: 'Mandarin tones and pinyin' })
```

Keep the subsequent `href="/pinyin"`, click, URL, three-section completion, local-only recording, Pinyin-store, and null practical-store assertions exactly unchanged. This is the route-continuity proof; do not create a new route-oriented test or modify `src/app/router.tsx`.

- [ ] **Step 3: Create the complete Home/Progress peer-series browser spec**

Create `tests/e2e/course-series.spec.ts` with:

```ts
import { expect, test } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'
const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

const seriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Basic Chinese expressions for a stress-free journey',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
  },
} as const

const frenchCourseProgress = {
  selectedExplanationLanguage: 'fr',
  completedLessons: ['self-intro'],
  reviewQueue: [],
  lastVisitedLesson: 'self-intro',
  lessonStepProgress: {},
} as const

const twoSectionPinyinProgress = {
  schemaVersion: 1,
  visited: true,
  completedSections: ['reference', 'tone-game'],
  toneGameLastScore: 8,
  toneGameBestScore: 8,
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
} as const

test('shows localized peer series on Home and independent 3-vs-10 progress', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const homeCourses = page.getByRole('region', { name: seriesCopy.en.label })
  const homePinyin = homeCourses.getByRole('region', { name: seriesCopy.en.pinyin })
  const homeJourney = homeCourses.getByRole('region', { name: seriesCopy.en.journey })
  const homePanels = homeCourses.locator(':scope > .course-series__list > .course-series__panel')
  const homePinyinLink = homePinyin.getByRole('link', { name: seriesCopy.en.pinyin })

  await expect(homePanels).toHaveCount(2)
  await expect(homePinyinLink).toHaveAttribute('href', '/pinyin')
  const frenchLanguageButton = page.getByRole('button', { name: 'Français' })
  await frenchLanguageButton.focus()
  await page.keyboard.press('Tab')
  await expect(homePinyinLink).toBeFocused()
  const focusStyle = await homePinyinLink.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })
  expect(focusStyle.outlineStyle).toBe('solid')
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3)
  await expect(homeJourney.locator('.journey-map__path > .journey-node')).toHaveCount(10)
  await expect(homeJourney.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
  await expect(page.getByText('Journey Map', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Arrive in China step by step', { exact: true })).toHaveCount(0)
  await testInfo.attach('course-series-home-desktop', {
    body: await homeCourses.screenshot(),
    contentType: 'image/png',
  })

  await page.getByRole('button', { name: 'Français' }).click()

  const frenchHomeCourses = page.getByRole('region', { name: seriesCopy.fr.label })
  await expect(frenchHomeCourses.getByRole('region', { name: seriesCopy.fr.pinyin })).toBeVisible()
  await expect(frenchHomeCourses.getByRole('region', { name: seriesCopy.fr.journey })).toBeVisible()
  await expect(page.getByText(seriesCopy.en.pinyin, { exact: true })).toHaveCount(0)
  await expect(page.getByText(seriesCopy.en.journey, { exact: true })).toHaveCount(0)

  await page.evaluate(
    ({ courseKey, courseProgress, pinyinKey, pinyinProgress }) => {
      localStorage.setItem(courseKey, JSON.stringify(courseProgress))
      localStorage.setItem(pinyinKey, JSON.stringify(pinyinProgress))
    },
    {
      courseKey: courseProgressStorageKey,
      courseProgress: frenchCourseProgress,
      pinyinKey: pinyinProgressStorageKey,
      pinyinProgress: twoSectionPinyinProgress,
    },
  )
  await page.goto('/progress')

  const progressCourses = page.getByRole('region', { name: seriesCopy.fr.label })
  const pinyinProgress = progressCourses.getByRole('region', { name: seriesCopy.fr.pinyin })
  const journeyProgress = progressCourses.getByRole('region', { name: seriesCopy.fr.journey })
  const progressPanels = progressCourses.locator(
    ':scope > .course-series__list > .course-series__panel',
  )

  await expect(progressPanels).toHaveCount(2)
  await expect(pinyinProgress.getByText('2 sections sur 3 terminées')).toBeVisible()
  await expect(pinyinProgress.getByRole('link', { name: seriesCopy.fr.pinyin })).toHaveAttribute(
    'href',
    '/pinyin',
  )
  await expect(journeyProgress.locator('.progress-journey-map__path > .journey-node')).toHaveCount(
    10,
  )
  await expect(journeyProgress.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
  await expect(page.getByRole('region', { name: /indicateurs d’apprentissage/i })).toContainText(
    '1/10',
  )
  await expect(page.getByText('1 leçon sur 10 terminée').first()).toBeVisible()
  await testInfo.attach('course-series-progress-desktop', {
    body: await progressCourses.screenshot(),
    contentType: 'image/png',
  })
})

test('stacks naturally wrapped French peer panels without overflow at 390px and 320px', async ({
  page,
}, testInfo) => {
  for (const viewport of [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-320', width: 320, height: 720 },
  ] as const) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await page.evaluate(
      ({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)),
      { key: courseProgressStorageKey, progress: frenchCourseProgress },
    )
    await page.reload()

    for (const route of ['/', '/progress'] as const) {
      if (route === '/progress') {
        await page.goto(route)
      }

      const courses = page.getByRole('region', { name: seriesCopy.fr.label })
      const pinyinPanel = courses.getByRole('region', { name: seriesCopy.fr.pinyin })
      const journeyPanel = courses.getByRole('region', { name: seriesCopy.fr.journey })
      const pinyinBox = await pinyinPanel.boundingBox()
      const journeyBox = await journeyPanel.boundingBox()

      expect(pinyinBox).not.toBeNull()
      expect(journeyBox).not.toBeNull()
      expect(Math.abs(pinyinBox!.x - journeyBox!.x)).toBeLessThanOrEqual(2)
      expect(journeyBox!.y).toBeGreaterThanOrEqual(pinyinBox!.y + pinyinBox!.height - 2)

      for (const title of [seriesCopy.fr.pinyin, seriesCopy.fr.journey]) {
        const metrics = await courses.getByRole('heading', { level: 2, name: title }).evaluate(
          (element) => {
            const style = window.getComputedStyle(element)
            return {
              clientWidth: element.clientWidth,
              overflowWrap: style.overflowWrap,
              scrollWidth: element.scrollWidth,
              whiteSpace: style.whiteSpace,
            }
          },
        )

        expect(metrics.whiteSpace).toBe('normal')
        expect(metrics.overflowWrap).toBe('anywhere')
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
      }

      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ])
      expect(scrollWidth).toBe(clientWidth)

      await testInfo.attach(`course-series-${route === '/' ? 'home' : 'progress'}-${viewport.name}`, {
        body: await courses.screenshot(),
        contentType: 'image/png',
      })
    }
  }
})
```

This browser test intentionally uses the existing storage shapes only to arrange state. It verifies UI isolation, not a migration. The Pinyin flow test remains the authoritative browser test for producing that Pinyin state through real interactions.

- [ ] **Step 4: Run the focused Home, Pinyin, Progress-series, and end-to-end learner files**

```bash
npm run test:e2e -- \
  tests/e2e/home-page.spec.ts \
  tests/e2e/pinyin-zone.spec.ts \
  tests/e2e/course-series.spec.ts \
  tests/e2e/mvp-flow.spec.ts
```

Expected: **PASS**. The existing Pinyin test enters `/pinyin` through the new title and completes all three sections without creating practical progress. The existing MVP flow still completes a practical lesson and reports `1 of 10 lessons completed`. The new file proves peer DOM panels, exact EN/FR copy, independent counts, 390/320 stacking, natural title wrapping, and no horizontal overflow.

- [ ] **Step 5: Inspect the six new desktop/responsive course-area screenshots and four unchanged hero screenshots**

Run the focused files with the HTML reporter if the previous run did not retain convenient attachments:

```bash
rm -rf playwright-report
npm run test:e2e -- \
  tests/e2e/home-page.spec.ts \
  tests/e2e/course-series.spec.ts \
  --reporter=html
npm exec playwright show-report
rm -rf playwright-report
```

Expected visual review:

- Home at 1440/1024/390/320 still shows the supplied #t46 illustration, title, slogan, and language controls with the same image clipping/opacity/composition evidence.
- At 390 and 320, Pinyin appears first and Basic expressions second on both Home and Progress; no panel overlaps, clipped text, ellipsis, horizontal scrollbar, or squeezed artificial eleventh path card appears.
- Both long French titles are fully readable. The Pinyin panel remains compact, while the existing ten-card connected Journey becomes one column on mobile.
- Home contains one visible group label and one title per series; Progress adds count/status text but does not visually nest Pinyin into the path.

If any screenshot fails visual review despite geometry assertions, fix only the new `.course-series*` selectors, add or strengthen a CSS/browser assertion first, and repeat Tasks 1 and 5 checks. Do not tune `.home-hero*` or `.journey-node*` styles to solve a panel problem.

- [ ] **Step 6: Commit browser regression coverage**

```bash
git add \
  tests/e2e/home-page.spec.ts \
  tests/e2e/pinyin-zone.spec.ts \
  tests/e2e/course-series.spec.ts
git diff --cached --check
git commit -m "test: cover peer course series hierarchy"
```

Expected: only browser tests are staged. `tests/e2e/mvp-flow.spec.ts` remains unchanged and passed as a regression check.

### Task 6: Run full regression, visual, diff, and scope verification

**Files:**
- Verify all tracked files changed since the committed plan baseline
- Do not create another product edit unless a failing check is first captured by the most focused relevant test

- [ ] **Step 1: Run all focused unit contracts once more**

```bash
npm run test -- --run \
  src/content/copy.test.ts \
  src/content/journey.test.ts \
  src/content/pinyin/course.test.ts \
  src/lib/pinyinProgress.test.ts \
  src/lib/progress.test.ts \
  src/pages/HomePage.test.tsx \
  src/pages/PinyinPage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/app/AppShell.test.tsx \
  src/styles/global.test.ts
```

Expected: **PASS**. This covers exact copy, ten-node Journey data, unchanged Pinyin content/store, unchanged practical store, Home/Progress hierarchy, `/pinyin` page behavior, root routing, and CSS contracts.

- [ ] **Step 2: Run the complete Vitest suite in non-watch mode**

```bash
npm run test -- --run
```

Expected: **PASS** for every unit/component/content/server test. No snapshot or unrelated test is skipped to make this task pass.

- [ ] **Step 3: Run lint and the typechecked production build**

```bash
npm run lint
npm run build
```

Expected: both **PASS**. `tsc -b` proves no removed Journey route type/property is referenced. Vite emits the production bundle without a new route, dependency, or asset.

- [ ] **Step 4: Run the complete Playwright suite and retain an HTML report for final review**

```bash
rm -rf playwright-report
npm run test:e2e -- --reporter=html
```

Expected: **PASS** for every Playwright file, including Home hero, app shell, practical learner flow, Pinyin flow, new course-series coverage, lesson actions, and admin smoke/layout tests. Playwright starts the existing strict isolated Vite server at `127.0.0.1:4174` from `playwright.config.ts` and writes the report inspected in the next step.

- [ ] **Step 5: Re-open the HTML report and complete final visual review**

```bash
npm exec playwright show-report
rm -rf playwright-report
```

Expected: inspect all `course-series-*` and `home-hero-*` attachments using the visual criteria in Task 5, stop the report server, then remove the generated untracked report directory. Record completion in the PR/task notes; geometry checks alone are not a substitute for checking title legibility, panel peer relationship, and unchanged hero composition.

- [ ] **Step 6: Prove the supplied #t46 hero implementation and styles were not changed**

Run from the repository root:

```bash
export BASE="$(git log -1 --format=%H -- \
  docs/superpowers/plans/2026-08-06-peer-course-series-hierarchy-implementation.md)"

git diff --exit-code "$BASE" -- \
  src/components/HomeHeroIllustration.tsx \
  public/images/home-hero-chinese-elements.webp

python3 - <<'PY'
import re
import subprocess
import os
from pathlib import Path

base = os.environ['BASE']
baseline_page = subprocess.check_output(
    ['git', 'show', f'{base}:src/pages/HomePage.tsx'],
    text=True,
)
current_page = Path('src/pages/HomePage.tsx').read_text()
baseline_css = subprocess.check_output(
    ['git', 'show', f'{base}:src/styles/global.css'],
    text=True,
)
current_css = Path('src/styles/global.css').read_text()

def hero_section(source: str) -> str:
    match = re.search(
        r'<section className="hero-card home-hero home-hero--centered"[\s\S]*?\n\s*</section>',
        source,
    )
    if match is None:
        raise SystemExit('Home hero section was not found')
    return match.group(0)


def hero_rules(source: str) -> list[str]:
    return re.findall(r'(?ms)^[^{}\n]*\.home-hero[^{}]*\{[^{}]*\}', source)

if hero_section(baseline_page) != hero_section(current_page):
    raise SystemExit('Home hero JSX changed')
if hero_rules(baseline_css) != hero_rules(current_css):
    raise SystemExit('Home hero CSS changed')
PY
```

Expected: no diff output and Python exits successfully. This proves the component, runtime asset, exact Home hero JSX subtree, and every `.home-hero*` CSS rule match the post-#t46 baseline.

- [ ] **Step 7: Prove routes, stores, lesson content, and order stayed out of scope**

```bash
BASE="$(git log -1 --format=%H -- \
  docs/superpowers/plans/2026-08-06-peer-course-series-hierarchy-implementation.md)"

git diff --exit-code "$BASE" -- \
  src/app/router.tsx \
  src/lib/pinyinProgress.ts \
  src/lib/progress.ts \
  src/content/course.ts \
  src/content/pinyin/course.ts \
  src/content/pinyin/lesson1.ts \
  src/content/lessons

rg -n "path: '/pinyin'|<Link|to=\"/pinyin\"" \
  src/app/router.tsx \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx
```

Expected: the protected-file diff is empty. The scan shows the existing `/pinyin` route plus one independent Home link and one independent Progress link. No lesson-content or practical-order file changed.

- [ ] **Step 8: Run final hierarchy, copy, and denominator consistency scans**

```bash
if rg -n "'pinyin-foundations'|JourneyNodeRouteDetails|routeDetails|kind: 'route'|node.kind === 'route'|journey-node--route|progress-journey-node--route|pathOrder: 11" \
  src/content/types.ts \
  src/content/journey.ts \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx; then
  echo "stale Pinyin-as-Journey hierarchy remains" >&2
  exit 1
fi

if rg -n "Arrive in China step by step|Arriver en Chine étape par étape|journeyEyebrow|journeyMapLabel|journeyIntro|lessonProgressEyebrow|lessonProgressLabel|progressJourneyMapLabel" \
  src/content/copy.ts \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx; then
  echo "stale verbose course-area copy remains" >&2
  exit 1
fi

rg -n "completedSections.length|totalPinyinSections = 3|lessonJourneyNodes.length|completedLessonsCount / totalLessons" \
  src/pages/ProgressPage.tsx
rg -n "not\\.toContain\\('pinyin-foundations'\\)" src/content/journey.test.ts
rg -n "Course series|Séries de cours|Mandarin tones and pinyin|Tons et pinyin du mandarin|Basic Chinese expressions for a stress-free journey|Expressions chinoises essentielles pour voyager sereinement" \
  src/content/copy.ts \
  src/content/copy.test.ts
```

Expected: both inverted stale production scans print nothing. The denominator scan shows the existing Pinyin completed-section count over 3 and practical completion over `lessonJourneyNodes.length`; the negative-test scan proves the old exact Journey ID remains covered without flagging legitimate Pinyin-only identifiers; and the copy scan shows all six approved strings pinned in production and tests.

- [ ] **Step 9: Check commit order, branch diff, whitespace, and worktree cleanliness**

```bash
BASE="$(git log -1 --format=%H -- \
  docs/superpowers/plans/2026-08-06-peer-course-series-hierarchy-implementation.md)"

git log --oneline --reverse "$BASE"..HEAD
git diff --check "$BASE"..HEAD
git diff --stat "$BASE"..HEAD
git diff --name-only "$BASE"..HEAD
git status --short --branch
```

Expected:

1. five focused commits appear in this order: styles, peer shell, hierarchy/progress, copy, browser coverage;
2. `git diff --check` prints nothing;
3. the name list is limited to the files in this plan’s file map;
4. no spec, hero component/asset, route, store, lesson content, package manifest, lockfile, or configuration file appears;
5. the worktree is clean after the planned commits.

## Acceptance matrix

- **Peer semantics on both pages:** Tasks 2 and 4 create a labeled parent with exactly two direct child `<section>` panels and consistent level-2 headings; unit and Playwright tests assert the panels share a parent.
- **Pinyin removed from Journey:** Task 3 removes the ID, icon, route kind/details, path order 11, data object, and both route render branches; stale scans and the ten-node content contract enforce the result.
- **Route continuity:** Home and Progress still use standard `<Link to="/pinyin">`; the unchanged router and full existing Pinyin Playwright flow prove navigation and all Pinyin lesson behavior.
- **Independent progress:** Progress reads `loadPinyinProgress().completedSections.length` over 3 while practical summary/mastery remains filtered to ten Journey lesson IDs; unit and browser tests pin `2/3` beside `1/10` and `10%`.
- **Concise aligned content:** `copy.courseSeries` is the only production owner for the shared label and titles; exact copy tests pin all six strings, and old repeated Home introduction strings/keys are absent.
- **Order and destinations:** `journey.test.ts`, Home/Progress component tests, existing MVP flow, and full Playwright preserve all ten IDs, links, icons, and path order 1–10.
- **Responsive/accessibility:** Shared panel CSS supplies width protection, natural title wrapping, full-card focus, and a narrow one-column grid. Labeled sibling regions, standard links, decorative `aria-hidden` marks, language switching, 390/320 geometry, screenshot review, and document-width equality cover accessibility and responsive acceptance.
- **#t46 hero preservation:** Existing Home unit/E2E contracts stay present, focused screenshots rerun, and baseline comparisons prove its component, asset, JSX subtree, and CSS rules are unchanged.
- **No out-of-scope model work:** Protected-file diffs prove there is no route, storage schema, migration, Pinyin lesson, practical lesson, dependency, script, or config change.

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-08-06-peer-course-series-hierarchy-implementation.md`. Implement it either with `superpowers:subagent-driven-development` (recommended, one fresh worker and review per task) or `superpowers:executing-plans` (batched execution with checkpoints). In either mode, preserve the six-task order above and do not combine the copy phase into the shell/data commits.
