# Vertical Equal Course-Series Entry Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Pinyin and Basic expressions as vertically stacked, content-driven equal-size full-card links before the unchanged ten-lesson Journey path on Home and Progress, preserving exact localized copy, independent progress, routes, content, and the #t46 Home hero.

**Architecture:** Add one presentation-only `CourseSeriesTitle` that preserves each `copy.courseSeries` string while wrapping every non-space token atomically. Reshape only the Home and Progress course-series markup so two sibling semantic sections own full-card anchors and the Basic section also owns its existing path, then let a shared three-row CSS Grid equalize the first two visible anchors through stretched wrappers, a Pinyin `minmax(0, 1fr)` inner row, and a Basic subgrid. Pin semantics and state in Vitest, pin the CSS cascade statically, and pin actual anchor/row geometry, whole-token rendering, focus, navigation, and overflow across all 16 required browser combinations.

**Tech Stack:** React 19, React Router 6.30, TypeScript 6, CSS Grid/subgrid, Vitest 4 with Testing Library, Playwright 1.61, Vite 8, oxlint

---

## File map

- **Create:** `src/components/CourseSeriesTitle.tsx` — render an exact course-series title as original whitespace text nodes plus atomic non-space token spans.
- **Create:** `src/components/CourseSeriesTitle.test.tsx` — pin exact EN/FR text, accessible heading names, whitespace preservation, token order, and token semantics.
- **Modify:** `src/pages/HomePage.tsx:4-10,55-196` — use `CourseSeriesTitle`; render Pinyin and Basic full-card anchors before the unchanged `journeyNodes` mapping; add `#home-basic-expressions-path`; do not touch the hero at lines 36-53.
- **Modify:** `src/pages/HomePage.test.tsx:6-38,59-106` — pin sibling/order/fragment/title-token/decorative contracts, ten unchanged lesson destinations, and absence of counts with both stores seeded.
- **Modify:** `src/pages/ProgressPage.tsx:4-11,157-320` — use `CourseSeriesTitle`; move the existing independent `/3` and `/10` text into the corresponding anchors; add `#progress-basic-expressions-path`; keep calculations and Journey mapping unchanged.
- **Modify:** `src/pages/ProgressPage.test.tsx:71-94,159-194,240-265` — pin sibling/order/fragment/title-token/decorative contracts, title-only link names, ten destinations/statuses, and independently placed `2/3` and `1/10` progress.
- **Modify:** `src/styles/global.test.ts:165-208` — replace the obsolete two-column/fixed-minimum and narrow header contracts with shared rows, wrapper/inner-track/anchor stretch, surface ownership, safe title tokens, no fixed entry height, focus, reduced motion, and retained narrow Journey columns.
- **Modify:** `src/styles/global.css:530-649,2751-2797,2939-2947` — replace the side-by-side panel surface with the vertical equal-row coordinator and full-card surfaces; add token/fragment styles; remove obsolete course header rules; leave every `.home-hero*` rule unchanged.
- **Modify:** `tests/e2e/course-series.spec.ts:1-208` — replace the limited desktop/mobile checks with Home/Progress × EN/FR × 1440/1024/390/320 geometry, token, overflow, focus, count, route, fragment, order, destination, and screenshot coverage.
- **Verify only:** `src/components/HomeHeroIllustration.tsx`, `public/images/home-hero-chinese-elements.webp`, `tests/e2e/home-page.spec.ts`, the hero JSX and hero unit tests in `src/pages/HomePage.tsx`/`src/pages/HomePage.test.tsx`, and all `.home-hero*` declarations in `src/styles/global.css` — preserve #t46 exactly.
- **Verify only:** `src/app/router.tsx`, `src/lib/progress.ts`, `src/lib/pinyinProgress.ts`, `src/content/**`, `api/content/**`, `public/audio/pinyin/**`, `package.json`, `package-lock.json`, `.oxlintrc.json`, `playwright.config.ts`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, and `vercel.json` — routes, stores/schema, Journey/course/Pinyin/lesson content, packages, and configuration remain unchanged.

## Guardrails and fixed implementation decisions

- Commit this plan by itself from `90e5399d71c9a9a471a1bc95110963d10b7c2d2f`, refresh the named-thread review context, and obtain designated plan-review approval before any implementation step runs. Implementation starts only from a clean descendant of that reviewed plan commit, and the only pre-implementation diff from `90e5399` is this plan.
- Do not modify `docs/superpowers/specs/2026-08-07-course-series-vertical-equal-entry-cards-design.md` or rewrite any existing hero assertion.
- Keep `getUiCopy(language)` as the only production source for all six group/title strings. `CourseSeriesTitle` receives the unmodified string and splits it with exactly `/(\s+)/u`; it neither normalizes nor duplicates copy.
- Keep Home count-free even when `loadProgress()` and `loadPinyinProgress()` contain completion. Keep Progress numerators and denominators exactly `pinyinProgress.completedSections.length / 3` and filtered Journey completion / `lessonJourneyNodes.length` (10).
- Keep Pinyin as React Router `Link to="/pinyin"`. Basic is a literal native `<a>` with only the page-local fragment; add no handler, smooth scrolling, focus transfer, measured state, `ResizeObserver`, or storage.
- Preserve both sibling `<section>` elements and their `aria-labelledby` values. Keep the Basic path inside the Basic section and keep every existing Journey mapping branch, card class, icon, status, label, and lesson destination byte-for-byte apart from indentation and the new enclosing path wrapper.
- Equal height must come only from the outer shared rows plus three-level stretch. Do not add a positive `height`, positive `min-height`, `max-height`, clipping, truncation, line clamp, absolute measurement, language override, or title-wide `nowrap` to either entry.
- Replace the baseline `.course-series__panel { align-content: start; }`. A filled outer wrapper is insufficient: browser tests compare each visible anchor with the pixel size of its assigned computed outer row.
- `hyphens: none` is not the word-integrity mechanism. `.course-series__title-token` must be `inline-block` and `nowrap`, and `Range#getClientRects()` must report one rendered fragment for every token, including `stress-free`.
- The four implementation commits below are intentionally focused and green at their stated boundary: title renderer, Home structure, Progress structure, then CSS plus browser acceptance.

## Baseline

- [ ] **Step 1: Confirm the reviewed baseline, plan-only ancestry, and clean worktree**

```bash
BASE=90e5399d71c9a9a471a1bc95110963d10b7c2d2f
PLAN=docs/superpowers/plans/2026-08-07-course-series-vertical-equal-entry-cards-implementation.md

git merge-base --is-ancestor "$BASE" HEAD
git diff --name-only "$BASE"..HEAD
git status --short --branch
```

Expected: the ancestry command succeeds; the committed diff lists only `$PLAN`; the branch is `t53-course-series-vertical-layout-design` or its approved implementation successor; and there are no staged or unstaged entries. Stop if the designated review is not recorded or any other path appears.

- [ ] **Step 2: Run the current focused baseline before changing tests**

```bash
npm run test -- --run \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/styles/global.test.ts \
  src/content/copy.test.ts \
  src/content/journey.test.ts \
  src/lib/progress.test.ts \
  src/lib/pinyinProgress.test.ts \
  src/content/pinyin/course.test.ts
```

Expected: **PASS**, currently 8 files and 54 tests. This establishes a causal baseline for every later red assertion.

### Task 1: Add the exact, accessibility-preserving title renderer

**Files:**
- Create: `src/components/CourseSeriesTitle.test.tsx`
- Create: `src/components/CourseSeriesTitle.tsx`

- [ ] **Step 1: Write the failing focused component test**

Create `src/components/CourseSeriesTitle.test.tsx` with this complete content:

```tsx
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CourseSeriesTitle } from './CourseSeriesTitle'

const titles = [
  {
    id: 'english-course-series-title',
    title: 'Basic Chinese expressions for a stress-free journey',
    tokens: ['Basic', 'Chinese', 'expressions', 'for', 'a', 'stress-free', 'journey'],
  },
  {
    id: 'french-course-series-title',
    title: 'Expressions chinoises essentielles pour voyager sereinement',
    tokens: ['Expressions', 'chinoises', 'essentielles', 'pour', 'voyager', 'sereinement'],
  },
] as const

describe('CourseSeriesTitle', () => {
  it.each(titles)('preserves exact text and accessible meaning for $id', ({ id, title, tokens }) => {
    const { container } = render(<CourseSeriesTitle id={id} title={title} />)
    const heading = screen.getByRole('heading', { level: 2, name: title })
    const tokenElements = Array.from(
      heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    )

    expect(heading).toHaveAttribute('id', id)
    expect(heading).toHaveClass('course-series__title')
    expect(heading.textContent).toBe(title)
    expect(Array.from(heading.childNodes, (node) => node.textContent)).toEqual(
      title.split(/(\s+)/u),
    )
    expect(tokenElements.map((token) => token.textContent)).toEqual(tokens)
    expect(container.querySelectorAll('.course-series__title-token:empty')).toHaveLength(0)

    for (const token of tokenElements) {
      expect(token).not.toHaveAttribute('aria-label')
      expect(token).not.toHaveAttribute('aria-hidden')
      expect(token).not.toHaveAttribute('role')
    }
  })
})
```

- [ ] **Step 2: Run the focused test and verify the red state is causal**

```bash
npm run test -- --run src/components/CourseSeriesTitle.test.tsx
```

Expected: **FAIL** because `./CourseSeriesTitle` does not exist. No pre-existing test fails.

- [ ] **Step 3: Add the minimal title implementation**

Create `src/components/CourseSeriesTitle.tsx` with the reviewed production contract:

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

- [ ] **Step 4: Re-run the focused test and verify green**

```bash
npm run test -- --run src/components/CourseSeriesTitle.test.tsx
```

Expected: **PASS**, 1 file and 2 parameterized cases. Both headings retain exact `textContent` and accessible names while exposing only non-empty non-space token spans.

- [ ] **Step 5: Stage only the renderer slice and commit it**

```bash
git add \
  src/components/CourseSeriesTitle.tsx \
  src/components/CourseSeriesTitle.test.tsx
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: add course series title renderer"
```

Expected: the staged name list contains exactly the two files above; the whitespace check is silent; the focused green test is represented by a single component commit.

### Task 2: Put the Home entry anchors before its unchanged Journey path

**Files:**
- Modify: `src/pages/HomePage.test.tsx:6-38,59-106`
- Modify: `src/pages/HomePage.tsx:4-10,55-196`

- [ ] **Step 1: Add Home helpers and failing structural/count contracts**

In `src/pages/HomePage.test.tsx`, replace the current progress import at line 6 with these imports:

```tsx
import { createDefaultPinyinProgress, savePinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
```

Insert this helper after `getHomeJourneySeries`:

```tsx
function expectTokenizedSeriesTitle(section: HTMLElement, title: string) {
  const heading = within(section).getByRole('heading', { level: 2, name: title })
  const tokens = Array.from(
    heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    (token) => token.textContent,
  )

  expect(heading.textContent).toBe(title)
  expect(tokens).toEqual(title.split(/\s+/u))
}
```

Replace the current test named `renders the approved Pinyin and ten-card Journey series as labeled siblings` with these complete tests:

```tsx
it('renders vertical full-card course entries before the unchanged Home Journey path', () => {
  renderRoute('/home')

  const courseSeries = getHomeCourseSeries()
  const pinyinSection = getHomePinyinSeries()
  const journeySection = getHomeJourneySeries()
  const list = courseSeries.querySelector<HTMLElement>('.course-series__list')
  const pinyinEntry = within(pinyinSection).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })
  const journeyEntry = within(journeySection).getByRole('link', {
    name: expectedSeriesCopy.en.journey,
  })
  const journeyPath = journeySection.querySelector<HTMLElement>('#home-basic-expressions-path')

  if (!list || !journeyPath) {
    throw new Error('Expected the Home course-series list and fragment target')
  }

  const journeyLessonLinks = within(journeyPath)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

  expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
  expect(Array.from(list.children)).toEqual([pinyinSection, journeySection])
  expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(pinyinEntry).toHaveClass('course-series__entry-card', 'course-series__pinyin-link')
  expect(journeyEntry.tagName).toBe('A')
  expect(journeyEntry).toHaveAttribute('href', '#home-basic-expressions-path')
  expect(journeyEntry).toHaveClass('course-series__entry-card', 'course-series__journey-link')
  expect(journeyPath).toHaveClass('course-series__journey-path', 'journey-map')
  expect(journeyPath.parentElement).toBe(journeySection)
  expect(journeySection.children[0]).toBe(journeyEntry)
  expect(journeySection.children[1]).toBe(journeyPath)
  expect(
    pinyinEntry.compareDocumentPosition(journeyEntry) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
  expect(
    journeyEntry.compareDocumentPosition(journeyPath) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()

  expectTokenizedSeriesTitle(pinyinSection, expectedSeriesCopy.en.pinyin)
  expectTokenizedSeriesTitle(journeySection, expectedSeriesCopy.en.journey)
  expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(journeyEntry.querySelector('.course-series__journey-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(pinyinEntry.querySelector('.course-series__entry-cue')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(journeyEntry.querySelector('.course-series__entry-cue')).toHaveAttribute(
    'aria-hidden',
    'true',
  )

  expect(journeyLessonLinks).toHaveLength(10)
  expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
  expect(within(journeyPath).queryAllByText(/coming soon/i)).toHaveLength(0)
  expect(journeySection).not.toHaveTextContent(' / ')

  for (const [index, title] of expectedJourneyTitles.entries()) {
    const topic = expectedLessonTopicOrder[index]
    const heading = within(journeyPath).getByRole('heading', { level: 3, name: title })

    expect(heading).toBeVisible()
    expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
    expect(within(heading).getByText(topic.en)).toHaveClass('lesson-topic-title__secondary')
  }
})

it('keeps both Home entry cards count-free with non-zero progress in both stores', () => {
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

  renderRoute('/home')

  const pinyinEntry = within(getHomePinyinSeries()).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })
  const journeyEntry = within(getHomeJourneySeries()).getByRole('link', {
    name: expectedSeriesCopy.en.journey,
  })

  expect(pinyinEntry).not.toHaveTextContent('2 of 3 sections complete')
  expect(journeyEntry).not.toHaveTextContent('1 of 10 lessons completed')
})
```

- [ ] **Step 2: Run only the new Home contracts and verify causal red failures**

```bash
npm run test -- --run src/pages/HomePage.test.tsx \
  -t "vertical full-card course entries|count-free with non-zero progress"
```

Expected: **FAIL** because the Basic title is not a link/fragment anchor, `.course-series__entry-card`, title-token spans, the `旅` mark/cues, and `#home-basic-expressions-path` do not exist. The existing Journey destinations are not the failure source.

- [ ] **Step 3: Import the shared title renderer in Home**

Add this import immediately before the current `HomeHeroIllustration` import in `src/pages/HomePage.tsx`:

```tsx
import { CourseSeriesTitle } from '../components/CourseSeriesTitle'
```

- [ ] **Step 4: Replace only the Home course-series JSX with the reviewed structure**

Replace `src/pages/HomePage.tsx:55-196`, from the opening course-series `<section>` through its closing tag, with this complete block. Do not edit the hero JSX above it.

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
              className="course-series__entry-card course-series__pinyin-link"
              to="/pinyin"
              aria-labelledby="home-pinyin-series-title"
            >
              <span className="course-series__pinyin-mark" aria-hidden="true">
                拼
              </span>
              <CourseSeriesTitle
                id="home-pinyin-series-title"
                title={copy.courseSeries.pinyinTitle}
              />
              <span className="course-series__entry-cue" aria-hidden="true">
                →
              </span>
            </Link>
          </section>

          <section
            aria-labelledby="home-journey-series-title"
            className="course-series__panel course-series__panel--journey"
          >
            <a
              className="course-series__entry-card course-series__journey-link"
              href="#home-basic-expressions-path"
              aria-labelledby="home-journey-series-title"
            >
              <span className="course-series__journey-mark" aria-hidden="true">
                旅
              </span>
              <CourseSeriesTitle
                id="home-journey-series-title"
                title={copy.courseSeries.basicExpressionsTitle}
              />
              <span className="course-series__entry-cue" aria-hidden="true">
                ↓
              </span>
            </a>

            <div
              id="home-basic-expressions-path"
              className="course-series__journey-path journey-map"
            >
              <div className="journey-map__path">
                {journeyNodes.map((node) => {
                  const nodeSummary = getLocalizedText(node.summary, language)
                  const nodeEyebrow = getLocalizedText(node.eyebrow, language)
                  const nodeIcon = journeyNodeIcons[node.id]

                  if (node.kind === 'lesson' && node.lessonId) {
                    return (
                      <Link
                        key={node.id}
                        className="journey-node journey-node--lesson journey-node--card-link"
                        to={`/lesson/${node.lessonId}`}
                      >
                        <div className="journey-node__body">
                          <div className="journey-node__header">
                            <span className="badge badge--jade">{nodeEyebrow}</span>
                          </div>

                          <LessonTopicTitle as="h3" lessonId={node.lessonId} language={language} />
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

                  const isExpanded = expandedPreviewNodeId === node.id
                  const previewPanelId = `journey-preview-${node.id}`

                  return (
                    <article
                      key={node.id}
                      className={`journey-node journey-node--preview ${isExpanded ? 'journey-node--is-open' : ''}`}
                    >
                      <button
                        type="button"
                        className="journey-node__preview-button"
                        aria-expanded={isExpanded}
                        aria-controls={previewPanelId}
                        onClick={() =>
                          setExpandedPreviewNodeId((currentNodeId) =>
                            currentNodeId === node.id ? null : node.id,
                          )
                        }
                      >
                        <div className="journey-node__body">
                          <div className="journey-node__header">
                            <span className="badge badge--gold">{nodeEyebrow}</span>
                            <span className="journey-node__stamp">{copy.homePage.comingSoon}</span>
                          </div>

                          <LessonTopicTitle as="h3" title={node.title} language={language} />
                          <p className="muted-text">{nodeSummary}</p>
                          <span className="journey-node__cta">
                            {isExpanded ? copy.homePage.previewHide : copy.homePage.previewPeek}
                          </span>
                        </div>

                        <span
                          className="journey-node__illustration-slot journey-node__illustration-slot--stamp"
                          aria-hidden="true"
                        >
                          <span className="journey-node__doodle journey-node__doodle--stamp">
                            {nodeIcon}
                          </span>
                        </span>
                      </button>

                      {node.previewDetails && isExpanded ? (
                        <div id={previewPanelId} className="journey-node__preview-panel" role="note">
                          <span className="journey-node__preview-stamp">
                            {copy.homePage.comingSoon}
                          </span>

                          <div className="journey-node__phrase-card">
                            <span className="journey-node__panel-label">
                              {copy.homePage.previewKeyPhraseLabel}
                            </span>
                            <strong>{node.previewDetails.phrase}</strong>
                            <span className="pinyin-line">{node.previewDetails.pinyin}</span>
                            <span className="journey-node__phrase-meaning">
                              {copy.homePage.previewMeaningLabel}:{' '}
                              {getLocalizedText(node.previewDetails.meaning, language)}
                            </span>
                          </div>

                          <p className="journey-node__goal">
                            <span>{copy.homePage.previewGoalLabel}</span>
                            {getLocalizedText(node.previewDetails.goal, language)}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
```

- [ ] **Step 5: Run the complete Home and title suites and verify green**

```bash
npm run test -- --run \
  src/components/CourseSeriesTitle.test.tsx \
  src/pages/HomePage.test.tsx
```

Expected: **PASS**. The two peer sections are direct siblings; both visible entries are full-card links before the path; the path still has ten exact destinations; EN/FR and language switching still pass; seeded stores add no Home counts; every existing #t46 unit assertion remains unchanged and green.

- [ ] **Step 6: Stage only the Home slice and commit it**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.test.tsx
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: stack Home course series entries"
```

Expected: exactly the two Home files are staged. No hero component, asset, CSS, copy, Journey data, route, or store file is included.

### Task 3: Put the Progress anchors before its unchanged Journey path

**Files:**
- Modify: `src/pages/ProgressPage.test.tsx:71-94,159-194,240-265`
- Modify: `src/pages/ProgressPage.tsx:4-11,157-320`

- [ ] **Step 1: Add the Progress title-token helper**

Insert this helper after `getJourneyNodeCard` in `src/pages/ProgressPage.test.tsx`:

```tsx
function expectTokenizedSeriesTitle(section: HTMLElement, title: string) {
  const heading = within(section).getByRole('heading', { level: 2, name: title })
  const tokens = Array.from(
    heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    (token) => token.textContent,
  )

  expect(heading.textContent).toBe(title)
  expect(tokens).toEqual(title.split(/\s+/u))
}
```

- [ ] **Step 2: Replace the Progress peer test with a failing anchor/path contract**

Replace the current test named `renders ten Journey cards in path order while the approved Pinyin series is a peer` with this complete test:

```tsx
it('renders vertical full-card Progress entries before the unchanged Journey path', () => {
  renderRoute('/progress')

  const courseSeries = getProgressCourseSeries()
  const pinyinSection = getPinyinProgressSeries()
  const journeySection = getJourneyMap()
  const list = courseSeries.querySelector<HTMLElement>('.course-series__list')
  const pinyinEntry = within(pinyinSection).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })
  const journeyEntry = within(journeySection).getByRole('link', {
    name: expectedSeriesCopy.en.journey,
  })
  const journeyPath = journeySection.querySelector<HTMLElement>(
    '#progress-basic-expressions-path',
  )

  if (!list || !journeyPath) {
    throw new Error('Expected the Progress course-series list and fragment target')
  }

  const cards = Array.from(journeyPath.querySelectorAll<HTMLElement>('.journey-node'))
  const lessonLinks = within(journeyPath)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

  expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
  expect(Array.from(list.children)).toEqual([pinyinSection, journeySection])
  expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(pinyinEntry).toHaveClass('course-series__entry-card', 'course-series__pinyin-link')
  expect(pinyinEntry).toHaveAccessibleName(expectedSeriesCopy.en.pinyin)
  expect(pinyinEntry).toHaveTextContent('0 of 3 sections complete')
  expect(journeyEntry.tagName).toBe('A')
  expect(journeyEntry).toHaveAttribute('href', '#progress-basic-expressions-path')
  expect(journeyEntry).toHaveClass('course-series__entry-card', 'course-series__journey-link')
  expect(journeyEntry).toHaveAccessibleName(expectedSeriesCopy.en.journey)
  expect(journeyEntry).toHaveTextContent('0 of 10 lessons completed')
  expect(journeyPath).toHaveClass(
    'surface-card',
    'progress-journey-card',
    'course-series__journey-path',
  )
  expect(journeyPath.parentElement).toBe(journeySection)
  expect(journeySection.children[0]).toBe(journeyEntry)
  expect(journeySection.children[1]).toBe(journeyPath)
  expect(
    pinyinEntry.compareDocumentPosition(journeyEntry) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
  expect(
    journeyEntry.compareDocumentPosition(journeyPath) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()

  expectTokenizedSeriesTitle(pinyinSection, expectedSeriesCopy.en.pinyin)
  expectTokenizedSeriesTitle(journeySection, expectedSeriesCopy.en.journey)
  expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(journeyEntry.querySelector('.course-series__journey-mark')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(pinyinEntry.querySelector('.course-series__entry-cue')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  expect(journeyEntry.querySelector('.course-series__entry-cue')).toHaveAttribute(
    'aria-hidden',
    'true',
  )

  expect(cards).toHaveLength(10)
  expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
    orderedJourneyNodes.map((node) => node.id),
  )
  expect(
    cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
  ).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
  expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(
    expectedJourneyLessonHrefs,
  )
  expect(journeySection).not.toHaveTextContent(' / ')
  expect(within(journeyPath).queryAllByText('Preview')).toHaveLength(0)
  expect(within(journeyPath).getAllByText('Upcoming')).toHaveLength(10)
})
```

- [ ] **Step 3: Strengthen the independent-progress test so each count must be inside its own anchor**

Replace the existing test named `reports Pinyin sections out of three independently from Journey lessons out of ten` with this complete version:

```tsx
it('keeps 2-of-3 Pinyin and 1-of-10 Basic progress inside independent anchors', () => {
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

  const pinyinSection = getPinyinProgressSeries()
  const journeySection = getJourneyMap()
  const pinyinEntry = within(pinyinSection).getByRole('link', {
    name: expectedSeriesCopy.en.pinyin,
  })
  const journeyEntry = within(journeySection).getByRole('link', {
    name: expectedSeriesCopy.en.journey,
  })
  const stats = screen.getByRole('region', { name: /learning indicators/i })

  expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  expect(pinyinEntry).toHaveAccessibleName(expectedSeriesCopy.en.pinyin)
  expect(within(pinyinEntry).getByText('2 of 3 sections complete')).toBeVisible()
  expect(pinyinEntry).not.toHaveTextContent('1 of 10 lessons completed')
  expect(journeyEntry).toHaveAttribute('href', '#progress-basic-expressions-path')
  expect(journeyEntry).toHaveAccessibleName(expectedSeriesCopy.en.journey)
  expect(within(journeyEntry).getByText('1 of 10 lessons completed')).toBeVisible()
  expect(journeyEntry).not.toHaveTextContent('2 of 3 sections complete')
  expect(within(stats).getByText('1/10')).toBeVisible()
  expect(within(stats).getByText('10%')).toBeVisible()
  expect(screen.queryByText(/1 of 11/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 4: Run only the new Progress contracts and verify causal red failures**

```bash
npm run test -- --run src/pages/ProgressPage.test.tsx \
  -t "vertical full-card Progress entries|inside independent anchors"
```

Expected: **FAIL** because Basic is still a noninteractive header/badge, the path target and entry/token/decorative classes do not exist, and the Basic completion sentence is outside an anchor. Existing `2/3`, `1/10`, statuses, and lesson destinations demonstrate that data calculations are not the cause.

- [ ] **Step 5: Import the shared title renderer in Progress**

Add this import immediately before the current `LessonTopicTitle` import in `src/pages/ProgressPage.tsx`:

```tsx
import { CourseSeriesTitle } from '../components/CourseSeriesTitle'
```

- [ ] **Step 6: Replace only the Progress course-series JSX with the reviewed structure**

Replace `src/pages/ProgressPage.tsx:157-320`, from the opening `.progress-course-series` section through its closing tag, with this complete block. Keep lines 24-69, including all progress calculations and status functions, unchanged.

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
                className="course-series__entry-card course-series__pinyin-link"
                to="/pinyin"
                aria-labelledby="progress-pinyin-series-title"
              >
                <span className="course-series__pinyin-mark" aria-hidden="true">
                  拼
                </span>
                <CourseSeriesTitle
                  id="progress-pinyin-series-title"
                  title={copy.courseSeries.pinyinTitle}
                />
                <p className="course-series__progress">
                  {copy.pinyinPage.sectionProgress(
                    completedPinyinSectionsCount,
                    totalPinyinSections,
                  )}
                </p>
                <span className="course-series__entry-cue" aria-hidden="true">
                  →
                </span>
              </Link>
            </section>

            <section
              className="course-series__panel course-series__panel--journey"
              aria-labelledby="progress-journey-series-title"
            >
              <a
                className="course-series__entry-card course-series__journey-link"
                href="#progress-basic-expressions-path"
                aria-labelledby="progress-journey-series-title"
              >
                <span className="course-series__journey-mark" aria-hidden="true">
                  旅
                </span>
                <CourseSeriesTitle
                  id="progress-journey-series-title"
                  title={copy.courseSeries.basicExpressionsTitle}
                />
                <p className="course-series__progress">
                  {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
                </p>
                <span className="course-series__entry-cue" aria-hidden="true">
                  ↓
                </span>
              </a>

              <div
                id="progress-basic-expressions-path"
                className="surface-card progress-journey-card course-series__journey-path"
              >
                <div className="progress-journey-map__path">
                  {orderedJourneyNodes.map((node) => {
                    const nodeTitle = isLessonJourneyNode(node)
                      ? getLessonTopicText(node.lessonId, language)
                      : getLocalizedText(node.title, language)
                    const nodeSummary = getLocalizedText(node.summary, language)
                    const nodeEyebrow = getLocalizedText(node.eyebrow, language)
                    const nodeIcon = journeyNodeIcons[node.id]

                    if (isLessonJourneyNode(node)) {
                      const status = getJourneyNodeStatus(node)
                      const statusLabel = getStatusLabel(status)

                      return (
                        <Link
                          key={node.id}
                          className={`journey-node progress-journey-node journey-node--lesson journey-node--card-link progress-journey-node--lesson progress-journey-node--${status}`}
                          data-journey-node-id={node.id}
                          to={`/lesson/${node.lessonId}`}
                          aria-label={`${nodeTitle}: ${statusLabel}`}
                        >
                          <div className="journey-node__header">
                            <span className="badge badge--jade">{nodeEyebrow}</span>
                            <span className="journey-node__stamp journey-node__stamp--lesson">
                              {copy.progressPage.openLesson}
                            </span>
                          </div>

                          <span className="journey-node__doodle" aria-hidden="true">
                            {nodeIcon}
                          </span>

                          <div>
                            <span className={`progress-status-seal progress-status-seal--${status}`}>
                              {statusLabel}
                            </span>
                            <LessonTopicTitle
                              as="h3"
                              lessonId={node.lessonId}
                              language={language}
                            />
                            <p className="muted-text">{nodeSummary}</p>
                          </div>

                          <span className="journey-node__cta">
                            {copy.progressPage.openLesson} →
                          </span>
                        </Link>
                      )
                    }

                    const status = getJourneyNodeStatus(node)
                    const statusLabel = getStatusLabel(status)
                    const isExpanded = expandedPreviewNodeId === node.id
                    const previewPanelId = `progress-journey-preview-${node.id}`

                    return (
                      <article
                        key={node.id}
                        className={`journey-node progress-journey-node journey-node--preview progress-journey-node--preview progress-journey-node--${status} ${isExpanded ? 'journey-node--is-open' : ''}`}
                        data-journey-node-id={node.id}
                        aria-label={`${nodeTitle}: ${statusLabel}`}
                      >
                        <button
                          type="button"
                          className="journey-node__preview-button"
                          aria-expanded={isExpanded}
                          aria-controls={previewPanelId}
                          onClick={() =>
                            setExpandedPreviewNodeId((currentNodeId) =>
                              currentNodeId === node.id ? null : node.id,
                            )
                          }
                        >
                          <div className="journey-node__header">
                            <span className="badge badge--gold">{nodeEyebrow}</span>
                            <span className="journey-node__stamp">
                              {copy.homePage.comingSoon}
                            </span>
                          </div>

                          <span className="journey-node__doodle" aria-hidden="true">
                            {nodeIcon}
                          </span>

                          <div>
                            <span className={`progress-status-seal progress-status-seal--${status}`}>
                              {statusLabel}
                            </span>
                            <h3>{nodeTitle}</h3>
                            <p className="muted-text">{nodeSummary}</p>
                          </div>

                          <span className="journey-node__cta">
                            {isExpanded ? copy.homePage.previewHide : copy.homePage.previewPeek}
                          </span>
                        </button>

                        {node.previewDetails && isExpanded ? (
                          <div id={previewPanelId} className="journey-node__preview-panel" role="note">
                            <span className="journey-node__preview-stamp">
                              {copy.homePage.comingSoon}
                            </span>

                            <div className="journey-node__phrase-card">
                              <span className="journey-node__panel-label">
                                {copy.homePage.previewKeyPhraseLabel}
                              </span>
                              <strong>{node.previewDetails.phrase}</strong>
                              <span className="pinyin-line">{node.previewDetails.pinyin}</span>
                              <span className="journey-node__phrase-meaning">
                                {copy.homePage.previewMeaningLabel}:{' '}
                                {getLocalizedText(node.previewDetails.meaning, language)}
                              </span>
                            </div>

                            <p className="journey-node__goal">
                              <span>{copy.homePage.previewGoalLabel}</span>
                              {getLocalizedText(node.previewDetails.goal, language)}
                            </p>
                          </div>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        </section>
```

- [ ] **Step 7: Run the complete Progress, store, Journey, and title suites and verify green**

```bash
npm run test -- --run \
  src/components/CourseSeriesTitle.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/lib/progress.test.ts \
  src/lib/pinyinProgress.test.ts \
  src/content/journey.test.ts
```

Expected: **PASS**. Progress link names remain title-only through `aria-labelledby`; visible counts remain independently inside their anchors; stats/mastery/statuses remain out of ten; all ten IDs and destinations remain unchanged.

- [ ] **Step 8: Stage only the Progress slice and commit it**

```bash
git add src/pages/ProgressPage.tsx src/pages/ProgressPage.test.tsx
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: stack Progress course series entries"
```

Expected: exactly the two Progress files are staged. No route, store, schema, copy, Journey/course/Pinyin/lesson content, package, config, or Home hero path is included.

### Task 4: Prove real geometry, then implement the content-driven shared rows

**Files:**
- Modify: `src/styles/global.test.ts:165-208`
- Modify: `tests/e2e/course-series.spec.ts:1-208`
- Modify: `src/styles/global.css:530-649,2751-2797,2939-2947`

- [ ] **Step 1: Replace the obsolete CSS tests with the failing equal-entry contract**

In `src/styles/global.test.ts`, replace both current tests named `defines a shared peer-series panel baseline with a compact focusable Pinyin entry` and `stacks the Progress series heading and badge at the narrow breakpoint` with this complete test:

```ts
it('uses content-driven shared rows with stretched wrappers, anchors, and atomic titles', () => {
  const list = ruleBlock('.course-series__list')
  const panel = ruleBlock('.course-series__panel')
  const pinyinPanel = ruleBlock('.course-series__panel--pinyin')
  const journeyPanel = ruleBlock('.course-series__panel--journey')
  const entryCard = ruleBlock('.course-series__entry-card')
  const title = ruleBlock('.course-series__title')
  const token = ruleBlock('.course-series__title-token')
  const journeyPath = ruleBlock('.course-series__journey-path')

  expect(list).toContain('grid-template-columns: minmax(0, 1fr);')
  expect(list).toContain('grid-template-rows: repeat(2, minmax(auto, 1fr)) auto;')
  expect(list).toContain('align-items: stretch;')

  expect(panel).toContain('align-self: stretch;')
  expect(panel).toContain('align-content: stretch;')
  expect(panel).toContain('padding: 0;')
  expect(panel).toContain('border: 0;')
  expect(panel).toContain('background: none;')
  expect(panel).toContain('box-shadow: none;')
  expect(panel).toContain('overflow: visible;')
  expect(panel).not.toContain('align-content: start;')

  expect(pinyinPanel).toContain('grid-row: 1;')
  expect(pinyinPanel).toContain('display: grid;')
  expect(pinyinPanel).toContain('grid-template-rows: minmax(0, 1fr);')
  expect(pinyinPanel).not.toContain('background:')
  expect(journeyPanel).toContain('grid-row: 2 / span 2;')
  expect(journeyPanel).toContain('display: grid;')
  expect(journeyPanel).toContain('grid-template-rows: subgrid;')
  expect(journeyPanel).not.toContain('background:')
  expect(journeyPanel).not.toContain('overflow: hidden;')

  expect(entryCard).toContain('min-width: 0;')
  expect(entryCard).toContain('min-height: 0;')
  expect(entryCard).toContain('align-self: stretch;')
  expect(entryCard).toContain('justify-self: stretch;')
  expect(entryCard).toContain('text-decoration: none;')
  expect(entryCard).toContain('border-radius: var(--radius-lg);')
  expect(ruleBlock('.course-series__entry-card:focus-visible')).toContain(
    'outline: 3px solid rgba(47, 111, 186, 0.5);',
  )
  expect(ruleBlock('.course-series__entry-card:focus-visible')).toContain('outline-offset: 3px;')

  for (const selector of [
    '.course-series__entry-card',
    '.course-series__pinyin-link',
    '.course-series__journey-link',
  ]) {
    const block = ruleBlock(selector)
    const minHeight = block.match(/min-height:\s*([^;]+);/)?.[1].trim()

    expect(block).not.toMatch(/(^|\n)\s*height\s*:/)
    expect(minHeight === undefined || minHeight === '0').toBe(true)
    expect(block).not.toContain('max-height:')
    expect(block).not.toMatch(/overflow:\s*(?:hidden|clip)/)
    expect(block).not.toContain('line-clamp:')
    expect(block).not.toContain('text-overflow:')
  }

  expect(title).toContain('white-space: normal;')
  expect(title).toContain('overflow-wrap: normal;')
  expect(title).toContain('word-break: normal;')
  expect(title).toContain('hyphens: none;')
  expect(token).toContain('display: inline-block;')
  expect(token).toContain('white-space: nowrap;')

  expect(journeyPath).toContain('display: grid;')
  expect(journeyPath).toContain('align-content: start;')
  expect(journeyPath).toContain('overflow: hidden;')
  expect(journeyPath).toContain('scroll-margin-block-start: 1rem;')
  expect(hasRule('.course-series__panel-header')).toBe(false)
  expect(hasRule('.journey-map__intro')).toBe(false)

  expect(
    hasMediaRuleWithDeclaration(
      '(prefers-reduced-motion: reduce)',
      '.course-series__pinyin-link',
      'transition: none;',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(prefers-reduced-motion: reduce)',
      '.course-series__journey-link',
      'transition: none;',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 760px)',
      '.journey-map__path',
      'grid-template-columns: 1fr;',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 760px)',
      '.progress-journey-map__path',
      'grid-template-columns: 1fr;',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 760px)',
      '.progress-course-series .progress-list-card__header',
      'display: grid;',
    ),
  ).toBe(false)
})
```

- [ ] **Step 2: Run the focused CSS test and verify the blocker-specific red state**

```bash
npm run test -- --run src/styles/global.test.ts \
  -t "content-driven shared rows with stretched wrappers"
```

Expected: **FAIL** on the old two-column list and `.course-series__panel { align-content: start; }`; subsequent failures also expose the fixed `min-height: 10rem`, missing subgrid/entry-card/token/path contracts, and obsolete header rules.

- [ ] **Step 3: Replace the browser file with the complete 16-combination acceptance matrix**

Replace all of `tests/e2e/course-series.spec.ts` with this complete content:

```ts
import { expect, test, type Locator, type Page } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'
const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

const seriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Basic Chinese expressions for a stress-free journey',
    pinyinProgress: '2 of 3 sections complete',
    journeyProgress: '1 of 10 lessons completed',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
    pinyinProgress: '2 sections sur 3 terminées',
    journeyProgress: '1 leçon sur 10 terminée',
  },
} as const

type Language = keyof typeof seriesCopy

const pageCases = [
  {
    name: 'home',
    route: '/',
    pathId: 'home-basic-expressions-path',
    nodeSelector: '.journey-map__path > .journey-node',
  },
  {
    name: 'progress',
    route: '/progress',
    pathId: 'progress-basic-expressions-path',
    nodeSelector: '.progress-journey-map__path > .journey-node',
  },
] as const

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 720 },
] as const

const lessonHrefs = [
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/convenience-store-run',
  '/lesson/restaurant-order',
  '/lesson/metro-ticket',
  '/lesson/pharmacy-help',
  '/lesson/ask-for-help-problem',
  '/lesson/train-station-ticket',
] as const

const twoSectionPinyinProgress = {
  schemaVersion: 1,
  visited: true,
  completedSections: ['reference', 'tone-game'],
  toneGameLastScore: 8,
  toneGameBestScore: 8,
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
} as const

function courseProgress(language: Language) {
  return {
    selectedExplanationLanguage: language,
    completedLessons: ['self-intro'],
    reviewQueue: [],
    lastVisitedLesson: 'self-intro',
    lessonStepProgress: {},
  }
}

async function seedProgress(page: Page, language: Language) {
  await page.addInitScript(
    ({ courseKey, learnerProgress, pinyinKey, pinyinProgress }) => {
      localStorage.setItem(courseKey, JSON.stringify(learnerProgress))
      localStorage.setItem(pinyinKey, JSON.stringify(pinyinProgress))
    },
    {
      courseKey: courseProgressStorageKey,
      learnerProgress: courseProgress(language),
      pinyinKey: pinyinProgressStorageKey,
      pinyinProgress: twoSectionPinyinProgress,
    },
  )
}

async function expectKeyboardFocusVisible(page: Page, link: Locator) {
  await link.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()

  const focusStyle = await link.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      outlineOffset: Number.parseFloat(style.outlineOffset),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })

  expect(focusStyle.outlineStyle).toBe('solid')
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3)
  expect(focusStyle.outlineOffset).toBeGreaterThanOrEqual(3)
}

for (const pageCase of pageCases) {
  for (const language of ['en', 'fr'] as const) {
    for (const viewport of viewports) {
      test(`${pageCase.name} ${language} ${viewport.name} keeps equal visible entry anchors`, async ({
        page,
      }, testInfo) => {
        const copy = seriesCopy[language]

        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await seedProgress(page, language)
        await page.goto(pageCase.route)

        const courses = page.getByRole('region', { name: copy.label })
        const list = courses.locator(':scope > .course-series__list')
        const pinyinSection = list.getByRole('region', { name: copy.pinyin })
        const journeySection = list.getByRole('region', { name: copy.journey })
        const pinyinLink = pinyinSection.getByRole('link', { name: copy.pinyin })
        const journeyLink = journeySection.getByRole('link', { name: copy.journey })
        const path = journeySection.locator(`#${pageCase.pathId}`)
        const journeyNodes = path.locator(pageCase.nodeSelector)
        const lessonLinks = path.locator('a[href^="/lesson/"]')

        await expect(list.locator(':scope > .course-series__panel')).toHaveCount(2)
        await expect(list.locator(':scope > .course-series__entry-card')).toHaveCount(0)
        await expect(courses.locator('.course-series__entry-card')).toHaveCount(2)
        await expect(pinyinLink).toHaveAttribute('href', '/pinyin')
        await expect(journeyLink).toHaveAttribute('href', `#${pageCase.pathId}`)
        await expect(pinyinLink).toHaveAccessibleName(copy.pinyin)
        await expect(journeyLink).toHaveAccessibleName(copy.journey)
        await expect(path).toBeVisible()
        await expect(journeyNodes).toHaveCount(10)
        await expect(lessonLinks).toHaveCount(10)
        expect(await lessonLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
          .toEqual(lessonHrefs)

        const order = await list.evaluate((element, pathId) => {
          const panels = Array.from(element.children)
          const pinyin = element.querySelector('.course-series__pinyin-link')
          const journey = element.querySelector('.course-series__journey-link')
          const pathElement = document.getElementById(pathId)

          if (!pinyin || !journey || !pathElement) {
            throw new Error('Missing course-series ordering target')
          }

          return {
            directPanelCount: panels.length,
            pinyinBeforeJourney: Boolean(
              pinyin.compareDocumentPosition(journey) & Node.DOCUMENT_POSITION_FOLLOWING,
            ),
            journeyBeforePath: Boolean(
              journey.compareDocumentPosition(pathElement) & Node.DOCUMENT_POSITION_FOLLOWING,
            ),
          }
        }, pageCase.pathId)

        expect(order).toEqual({
          directPanelCount: 2,
          pinyinBeforeJourney: true,
          journeyBeforePath: true,
        })

        const geometry = await list.evaluate((element, pathId) => {
          const pinyin = element.querySelector<HTMLElement>('.course-series__pinyin-link')
          const journey = element.querySelector<HTMLElement>('.course-series__journey-link')
          const pinyinPanel = element.querySelector<HTMLElement>('.course-series__panel--pinyin')
          const journeyPanel = element.querySelector<HTMLElement>('.course-series__panel--journey')
          const pathElement = document.getElementById(pathId)

          if (!pinyin || !journey || !pinyinPanel || !journeyPanel || !pathElement) {
            throw new Error('Missing course-series geometry target')
          }

          const box = (target: Element) => {
            const rect = target.getBoundingClientRect()
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          }
          const rowSizes = window.getComputedStyle(element).gridTemplateRows
            .split(/\s+/u)
            .map((value) => Number.parseFloat(value))

          return {
            basic: box(journey),
            basicPanel: box(journeyPanel),
            list: box(element),
            path: box(pathElement),
            pinyin: box(pinyin),
            pinyinPanel: box(pinyinPanel),
            rowSizes,
          }
        }, pageCase.pathId)

        expect(geometry.rowSizes).toHaveLength(3)
        expect(Math.abs(geometry.rowSizes[0] - geometry.rowSizes[1])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.x - geometry.basic.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.width - geometry.basic.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.basic.height)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.rowSizes[0])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.height - geometry.rowSizes[1])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.pinyinPanel.height)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.x - geometry.list.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.x - geometry.list.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.width - geometry.list.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.width - geometry.list.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.y - geometry.basicPanel.y)).toBeLessThanOrEqual(1)
        expect(geometry.basic.y).toBeGreaterThanOrEqual(
          geometry.pinyin.y + geometry.pinyin.height,
        )
        expect(geometry.path.y).toBeGreaterThanOrEqual(geometry.basic.y + geometry.basic.height)

        for (const [title, link] of [
          [copy.pinyin, pinyinLink],
          [copy.journey, journeyLink],
        ] as const) {
          const heading = courses.getByRole('heading', { level: 2, name: title })
          const metrics = await heading.evaluate((element) => {
            const card = element.closest<HTMLElement>('.course-series__entry-card')

            if (!card) {
              throw new Error('Missing title entry card')
            }

            const style = window.getComputedStyle(element)
            const tokens = Array.from(
              element.querySelectorAll<HTMLElement>('.course-series__title-token'),
              (token) => {
                const range = document.createRange()
                range.selectNodeContents(token)
                const fragmentCount = Array.from(range.getClientRects()).filter(
                  (rect) => rect.width > 0 && rect.height > 0,
                ).length

                return { fragmentCount, text: token.textContent }
              },
            )

            return {
              cardClientHeight: card.clientHeight,
              cardClientWidth: card.clientWidth,
              cardOverflow: window.getComputedStyle(card).overflow,
              cardScrollHeight: card.scrollHeight,
              cardScrollWidth: card.scrollWidth,
              clientHeight: element.clientHeight,
              clientWidth: element.clientWidth,
              hyphens: style.hyphens,
              overflowWrap: style.overflowWrap,
              scrollHeight: element.scrollHeight,
              scrollWidth: element.scrollWidth,
              text: element.textContent,
              tokens,
              whiteSpace: style.whiteSpace,
              wordBreak: style.wordBreak,
            }
          })

          expect(metrics.text).toBe(title)
          expect(metrics.tokens.map(({ text }) => text)).toEqual(title.split(/\s+/u))
          expect(metrics.tokens.filter(({ fragmentCount }) => fragmentCount !== 1)).toEqual([])
          expect(metrics.whiteSpace).toBe('normal')
          expect(metrics.overflowWrap).toBe('normal')
          expect(metrics.wordBreak).toBe('normal')
          expect(metrics.hyphens).toBe('none')
          expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
          expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1)
          expect(metrics.cardScrollWidth).toBeLessThanOrEqual(metrics.cardClientWidth + 1)
          expect(metrics.cardScrollHeight).toBeLessThanOrEqual(metrics.cardClientHeight + 1)
          expect(metrics.cardOverflow).toBe('visible')
          await expect(link).toHaveAccessibleName(title)

          if (title.includes('stress-free')) {
            expect(metrics.tokens.find(({ text }) => text === 'stress-free')).toEqual({
              fragmentCount: 1,
              text: 'stress-free',
            })
          }
        }

        await expectKeyboardFocusVisible(page, pinyinLink)
        await expectKeyboardFocusVisible(page, journeyLink)

        if (pageCase.name === 'home') {
          await expect(pinyinLink).not.toContainText(copy.pinyinProgress)
          await expect(journeyLink).not.toContainText(copy.journeyProgress)
        } else {
          await expect(pinyinLink).toContainText(copy.pinyinProgress)
          await expect(journeyLink).toContainText(copy.journeyProgress)
          await expect(page.getByRole('region', { name: /learning indicators|indicateurs d’apprentissage/i }))
            .toContainText('1/10')
        }

        const [scrollWidth, clientWidth, supportsSubgrid] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
          CSS.supports('grid-template-rows', 'subgrid'),
        ])
        expect(scrollWidth).toBe(clientWidth)
        expect(supportsSubgrid).toBe(true)

        await testInfo.attach(
          `course-series-${pageCase.name}-${language}-${viewport.name}`,
          {
            body: await courses.screenshot(),
            contentType: 'image/png',
          },
        )
      })
    }
  }
}

for (const pageCase of pageCases) {
  test(`${pageCase.name} entry anchors keep native keyboard route and fragment behavior`, async ({
    page,
  }) => {
    const copy = seriesCopy.en

    await page.setViewportSize({ width: 390, height: 844 })
    await seedProgress(page, 'en')
    await page.goto(pageCase.route)

    const courses = page.getByRole('region', { name: copy.label })
    const pinyinLink = courses.getByRole('link', { name: copy.pinyin })
    const journeyLink = courses.getByRole('link', { name: copy.journey })
    const path = courses.locator(`#${pageCase.pathId}`)

    await expect(path.locator(pageCase.nodeSelector)).toHaveCount(10)
    await expectKeyboardFocusVisible(page, journeyLink)
    await journeyLink.press('Enter')

    await expect.poll(() => new URL(page.url()).pathname).toBe(pageCase.route)
    await expect.poll(() => new URL(page.url()).hash).toBe(`#${pageCase.pathId}`)
    await expect(journeyLink).toBeFocused()
    await expect(path).toBeVisible()
    await expect(path.locator(pageCase.nodeSelector)).toHaveCount(10)
    expect(await journeyLink.getAttribute('aria-expanded')).toBeNull()

    await page.goto(pageCase.route)
    const freshCourses = page.getByRole('region', { name: copy.label })
    const freshPinyinLink = freshCourses.getByRole('link', { name: copy.pinyin })

    await expectKeyboardFocusVisible(page, freshPinyinLink)
    await freshPinyinLink.press('Enter')
    await expect.poll(() => new URL(page.url()).pathname).toBe('/pinyin')
  })
}
```

- [ ] **Step 4: Run the new browser matrix before CSS and verify geometry is red for the right reason**

```bash
npm run test:e2e -- tests/e2e/course-series.spec.ts
```

Expected: **FAIL** on the matrix geometry because the current CSS still lays the sibling sections in two columns, retains `align-content: start`, has no equal shared rows/subgrid, and does not make both visible anchors fill assigned rows. Structural, exact-copy, destination, and seeded-count setup should reach those geometry assertions without application errors.

- [ ] **Step 5: Replace the shared course-series CSS with the complete equal-row and title-token implementation**

In `src/styles/global.css`, replace the block from `.course-series {` at current line 530 through the end of `.journey-map__intro` at current line 647 with this complete block. The existing `.journey-map__path` rule immediately after it remains unchanged.

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
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: repeat(2, minmax(auto, 1fr)) auto;
  gap: 1rem;
  align-items: stretch;
}

.course-series__panel {
  min-width: 0;
  display: grid;
  align-self: stretch;
  align-content: stretch;
  gap: 1rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  box-shadow: none;
  overflow: visible;
}

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

.course-series__entry-card {
  --course-series-entry-icon-size: clamp(2.5rem, 10vw, 3rem);

  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-columns:
    var(--course-series-entry-icon-size)
    minmax(0, 1fr)
    var(--course-series-entry-icon-size);
  grid-template-rows: auto auto;
  gap: 0.35rem 0.65rem;
  align-content: start;
  align-items: start;
  align-self: stretch;
  justify-self: stretch;
  padding: clamp(1rem, 3vw, 1.35rem);
  border: 1px solid rgba(231, 234, 240, 0.92);
  border-radius: var(--radius-lg);
  color: var(--color-ink);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.course-series__pinyin-link {
  border-color: rgba(95, 143, 247, 0.24);
  background:
    radial-gradient(circle at top right, rgba(95, 143, 247, 0.15), transparent 12rem),
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(238, 244, 255, 0.9));
}

.course-series__journey-link {
  border-color: rgba(214, 181, 150, 0.52);
  background:
    radial-gradient(circle at top right, rgba(255, 138, 61, 0.1), transparent 14rem),
    linear-gradient(145deg, rgba(255, 253, 248, 0.98), rgba(255, 248, 238, 0.94));
}

.course-series__entry-card:focus-visible {
  outline: 3px solid rgba(47, 111, 186, 0.5);
  outline-offset: 3px;
}

.course-series__entry-card:hover,
.course-series__entry-card:focus-visible {
  transform: translateY(-2px);
  border-color: rgba(47, 111, 186, 0.42);
  box-shadow: 0 22px 44px -34px rgba(47, 111, 186, 0.62);
}

.course-series__title {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  max-width: 100%;
  margin: 0;
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

.course-series__pinyin-mark,
.course-series__journey-mark,
.course-series__entry-cue {
  grid-row: 1 / -1;
  display: inline-grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 999px;
}

.course-series__pinyin-mark,
.course-series__journey-mark {
  grid-column: 1;
  font-size: 1.5rem;
  font-weight: 900;
}

.course-series__pinyin-mark {
  border: 1px solid rgba(95, 143, 247, 0.25);
  color: var(--color-sky-ink);
  background: rgba(238, 244, 255, 0.94);
  transform: rotate(-4deg);
}

.course-series__journey-mark {
  border: 1px solid rgba(243, 165, 63, 0.32);
  color: var(--color-cinnabar-dark);
  background: rgba(255, 244, 230, 0.94);
  transform: rotate(4deg);
}

.course-series__entry-cue {
  grid-column: 3;
  border: 1px solid rgba(31, 26, 23, 0.12);
  color: var(--color-ink-soft);
  background: rgba(255, 255, 255, 0.72);
  font-size: 1.2rem;
  font-weight: 900;
}

.course-series__progress {
  grid-column: 2;
  grid-row: 2;
  min-width: 0;
  margin: 0;
  color: var(--color-muted);
  font-weight: 750;
  overflow-wrap: normal;
  word-break: normal;
}

.course-series__journey-path {
  min-width: 0;
  display: grid;
  align-content: start;
  overflow: hidden;
  scroll-margin-block-start: 1rem;
}

.course-series__journey-path.journey-map {
  gap: 1.2rem;
  padding: clamp(1rem, 3vw, 1.35rem);
  border: 1px solid rgba(231, 234, 240, 0.92);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at top right, rgba(255, 138, 61, 0.1), transparent 14rem),
    linear-gradient(145deg, rgba(255, 253, 248, 0.98), rgba(255, 248, 238, 0.94));
  box-shadow: var(--shadow-card);
}

.journey-map {
  gap: 1.2rem;
}
```

This replacement deliberately removes `.course-series__panel-header`, `.journey-map__intro`, the panel modifier backgrounds, panel clipping, `.course-series__pinyin-link { min-height: 10rem; }`, and the baseline `align-content: start`. Surface properties now belong to anchors/path children, while semantic wrappers remain visible and stretched.

- [ ] **Step 6: Remove only the obsolete narrow course-header rules**

Inside `@media (max-width: 760px)`, remove `.course-series__list,` from the grouped selector that starts at current line 2770; the shared list is already one column at every width. Delete these complete obsolete rules:

```css
  .progress-course-series .progress-list-card__header {
    display: grid;
    align-items: start;
  }

  .progress-course-series .progress-list-card__header > .badge {
    justify-self: start;
  }
```

Keep `.journey-map__path` and `.progress-journey-map__path` in the grouped `grid-template-columns: 1fr` rule. Do not change any `.home-hero*` declaration in the same media block.

- [ ] **Step 7: Extend reduced-motion coverage to both full-card link selectors**

In `@media (prefers-reduced-motion: reduce)`, replace only `.course-series__pinyin-link,` with these two selector lines:

```css
  .course-series__pinyin-link,
  .course-series__journey-link,
```

The existing `transition: none;` declaration remains shared with the other listed controls.

- [ ] **Step 8: Re-run the static CSS contract and verify green**

```bash
npm run test -- --run src/styles/global.test.ts \
  -t "content-driven shared rows with stretched wrappers"
```

Expected: **PASS**. The source contract now proves the `align-content: start` blocker is replaced, Pinyin has a full-height inner row, Basic uses subgrid, visible anchors stretch, entry heights remain content-driven, token spans are atomic, and obsolete header rules cannot win later in the cascade.

- [ ] **Step 9: Run the complete rendered matrix and verify all 18 browser cases are green**

```bash
npm run test:e2e -- tests/e2e/course-series.spec.ts
```

Expected: **PASS**, 16 page/language/viewport geometry cases plus 2 page-specific keyboard navigation cases. Every visible anchor pair has x/width/height equality within 1 CSS px; each anchor height equals its assigned outer track; Pinyin, Basic, and path are vertically ordered; every token has one Range fragment; `stress-free` remains whole; titles/cards/documents do not overflow; Home remains count-free; Progress retains `2/3` and `1/10`; focus outlines are computed and visible; Enter reaches `/pinyin` or the stable native fragment.

- [ ] **Step 10: Run all four focused implementation suites together**

```bash
npm run test -- --run \
  src/components/CourseSeriesTitle.test.tsx \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/styles/global.test.ts
```

Expected: **PASS**. JSX semantics, store-dependent placement, exact titles, the CSS cascade, and all pre-existing Home/Progress/hero unit behavior agree.

- [ ] **Step 11: Stage only CSS contracts, CSS implementation, and browser acceptance, then commit**

```bash
git add \
  src/styles/global.test.ts \
  src/styles/global.css \
  tests/e2e/course-series.spec.ts
git diff --cached --check
git diff --cached --name-only
git commit -m "feat: equalize vertical course series cards"
```

Expected: exactly the three files above are staged; static and rendered checks are green; the fourth implementation commit contains no hero, route, store, content, package, or config change.

### Task 5: Run regression, visual, protected-scope, and diff gates

**Files:**
- Verify all files in the file map against baseline `90e5399d71c9a9a471a1bc95110963d10b7c2d2f`
- Do not change production code in this task unless a failing assertion is first added to the narrowest relevant test and observed red

- [ ] **Step 1: Run the complete focused unit/content/store/style set**

```bash
npm run test -- --run \
  src/components/CourseSeriesTitle.test.tsx \
  src/pages/HomePage.test.tsx \
  src/pages/ProgressPage.test.tsx \
  src/content/copy.test.ts \
  src/content/journey.test.ts \
  src/content/course.test.ts \
  src/content/pinyin/course.test.ts \
  src/lib/progress.test.ts \
  src/lib/pinyinProgress.test.ts \
  src/app/AppShell.test.tsx \
  src/pages/PinyinPage.test.tsx \
  src/styles/global.test.ts
```

Expected: **PASS**. This jointly proves exact shared copy, ten-node order, unchanged course/Pinyin content, unchanged stores/schema behavior, root and `/home` routing, `/pinyin`, Home/Progress semantics/counts, title tokens, CSS contracts, and existing hero unit coverage.

- [ ] **Step 2: Run the full Vitest suite in non-watch mode**

```bash
npm run test -- --run
```

Expected: **PASS** for every unit, component, content, server, route, and CSS test with no skipped regression used to hide a failure.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: **PASS** with no oxlint diagnostics in the new renderer, tests, or page markup.

- [ ] **Step 4: Run the typechecked production build**

```bash
npm run build
```

Expected: **PASS**. `tsc -b` accepts all JSX/types and Vite emits the existing application without a new route, dependency, config, or runtime asset.

- [ ] **Step 5: Run the relevant browser regression set, including the unchanged #t46 matrix**

```bash
npm run test:e2e -- \
  tests/e2e/course-series.spec.ts \
  tests/e2e/home-page.spec.ts \
  tests/e2e/app-shell.spec.ts \
  tests/e2e/pinyin-zone.spec.ts
```

Expected: **PASS**. The 18 new course-series cases pass; `home-page.spec.ts` reruns its unchanged 1440/1024/390/320 hero geometry and Journey card checks; app-shell preserves `/` and `/home`; the existing Pinyin flow still enters `/pinyin` and keeps storage independent.

- [ ] **Step 6: Generate and inspect bounded browser screenshots**

```bash
rm -rf /tmp/t53-course-series-playwright-report
PLAYWRIGHT_HTML_OUTPUT_DIR=/tmp/t53-course-series-playwright-report \
  npm run test:e2e -- \
    tests/e2e/course-series.spec.ts \
    tests/e2e/home-page.spec.ts \
    --reporter=html
npm exec playwright show-report /tmp/t53-course-series-playwright-report
rm -rf /tmp/t53-course-series-playwright-report
```

Expected: **PASS**, then visually inspect all 16 `course-series-{home|progress}-{en|fr}-*` attachments and the four existing `home-hero-*` attachments before stopping the report server. Each pair reads as equal peers; no word/card/focus ring is clipped; the path begins after Basic; Progress counts remain independent; and hero image geometry, veil, opacity, copy, and language controls match #t46.

- [ ] **Step 7: Prove the #t46 component, asset, hero JSX/tests, and hero CSS are byte-for-byte protected**

Run from the repository root:

```bash
export BASE=90e5399d71c9a9a471a1bc95110963d10b7c2d2f

git diff --exit-code "$BASE"..HEAD -- \
  src/components/HomeHeroIllustration.tsx \
  public/images/home-hero-chinese-elements.webp \
  tests/e2e/home-page.spec.ts

python3 - <<'PY'
import os
import re
import subprocess
from pathlib import Path

base = os.environ['BASE']

def baseline(path: str) -> str:
    return subprocess.check_output(['git', 'show', f'{base}:{path}'], text=True)

def current(path: str) -> str:
    return Path(path).read_text()

def slice_between(source: str, start: str, end: str) -> str:
    start_index = source.index(start)
    end_index = source.index(end, start_index)
    return source[start_index:end_index]

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

baseline_page = baseline('src/pages/HomePage.tsx')
current_page = current('src/pages/HomePage.tsx')
if hero_section(baseline_page) != hero_section(current_page):
    raise SystemExit('Home hero JSX changed')

hero_test_start = "  it('centers the hero theme and removes the old right-side learning mockup'"
hero_test_end = "  it('renders page-level French copy when the learner chooses French mode'"
baseline_home_test = baseline('src/pages/HomePage.test.tsx')
current_home_test = current('src/pages/HomePage.test.tsx')
if slice_between(baseline_home_test, hero_test_start, hero_test_end) != slice_between(
    current_home_test,
    hero_test_start,
    hero_test_end,
):
    raise SystemExit('Home hero unit tests changed')

baseline_css = baseline('src/styles/global.css')
current_css = current('src/styles/global.css')
if hero_rules(baseline_css) != hero_rules(current_css):
    raise SystemExit('Home hero CSS changed')
PY
```

Expected: no diff output and Python exits successfully. This compares the component, WebP, complete hero browser file, exact hero JSX subtree, both existing hero unit tests, and every base/tablet/mobile `.home-hero*` rule against branch head `90e5399`.

- [ ] **Step 8: Prove routes, both stores/schema, all content, packages, and configuration stayed out of scope**

```bash
BASE=90e5399d71c9a9a471a1bc95110963d10b7c2d2f

git diff --exit-code "$BASE"..HEAD -- \
  src/app/router.tsx \
  src/lib/progress.ts \
  src/lib/pinyinProgress.ts \
  src/content \
  api/content \
  public/audio/pinyin \
  package.json \
  package-lock.json \
  .oxlintrc.json \
  playwright.config.ts \
  vite.config.ts \
  vitest.config.ts \
  tsconfig.json \
  tsconfig.app.json \
  tsconfig.node.json \
  vercel.json
```

Expected: no diff output. This protects `LearnerProgress`, `PinyinProgress.schemaVersion`, storage keys/defaults/validation/persistence, route definitions, exact shared copy, Journey IDs/order/icons/destinations, `course.lessons`, every Pinyin/lesson content record and audio asset, dependency manifests, scripts, and all test/build/deployment configuration.

- [ ] **Step 9: Run focused invariant scans against production markup and CSS**

```bash
rg -n "CourseSeriesTitle|course-series__entry-card|home-basic-expressions-path|progress-basic-expressions-path" \
  src/components/CourseSeriesTitle.tsx \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx

rg -n "completedSections.length|totalPinyinSections = 3|lessonJourneyNodes.length|completedLessonsCount / totalLessons" \
  src/pages/ProgressPage.tsx

if rg -n "onClick|preventDefault|scrollIntoView|ResizeObserver" \
  src/components/CourseSeriesTitle.tsx \
  src/pages/HomePage.tsx \
  src/pages/ProgressPage.tsx | rg "course-series|basic-expressions|CourseSeriesTitle"; then
  echo "imperative course-series behavior found" >&2
  exit 1
fi

if rg -n -U "course-series__(?:entry-card|pinyin-link|journey-link)[^{]*\{[^}]*(?:height:\s*[1-9]|min-height:\s*[1-9]|max-height:|overflow:\s*(?:hidden|clip)|line-clamp:|text-overflow:)" \
  src/styles/global.css; then
  echo "fixed or clipping entry-card CSS found" >&2
  exit 1
fi
```

Expected: the positive scans show one shared renderer, two entry anchors per page, stable page-specific fragments, and the unchanged `3`/ten-lesson calculations. Both inverted scans print nothing: no imperative fragment implementation and no fixed/clipping entry-card rule exists.

- [ ] **Step 10: Prove the implementation diff is limited to the exact file map**

```bash
BASE=90e5399d71c9a9a471a1bc95110963d10b7c2d2f

diff -u \
  <(printf '%s\n' \
    docs/superpowers/plans/2026-08-07-course-series-vertical-equal-entry-cards-implementation.md \
    src/components/CourseSeriesTitle.test.tsx \
    src/components/CourseSeriesTitle.tsx \
    src/pages/HomePage.test.tsx \
    src/pages/HomePage.tsx \
    src/pages/ProgressPage.test.tsx \
    src/pages/ProgressPage.tsx \
    src/styles/global.css \
    src/styles/global.test.ts \
    tests/e2e/course-series.spec.ts | sort) \
  <(git diff --name-only "$BASE"..HEAD | sort)
```

Expected: `diff` prints nothing. No reviewed spec, hero component/asset/browser file, router, store/schema, content, package, lockfile, or config appears.

- [ ] **Step 11: Check focused commit order, whitespace, and clean final state**

```bash
BASE=90e5399d71c9a9a471a1bc95110963d10b7c2d2f

git log --oneline --reverse "$BASE"..HEAD
git diff --check "$BASE"..HEAD
git diff --stat "$BASE"..HEAD
git status --short --branch
```

Expected: after the designated-review plan commit, four focused implementation commits appear in this order: title renderer, Home structure, Progress structure, CSS/browser acceptance. `git diff --check` is silent, the stat matches the exact file gate, and the worktree is clean.

## Acceptance matrix

- **Vertical order and semantics:** Home/Progress unit tests and all 16 matrix cases require two direct sibling sections, Pinyin anchor first, Basic anchor second, then the Basic-owned ten-node path in DOM and geometry order.
- **Visible-anchor equality:** Static CSS pins `repeat(2, minmax(auto, 1fr)) auto`, wrapper stretch, the Pinyin `minmax(0, 1fr)` inner row, Basic subgrid, and anchor stretch. Browser tests compare the two anchor x/width/height values and separately compare each anchor height to its assigned computed row within 1 CSS px.
- **Content safety:** No entry fixed height/minimum/clipping/truncation rule is permitted. EN/FR Home/Progress at 1440×900, 1024×768, 390×844, and 320×720 must have no title/card/document overflow.
- **Whole-token titles:** `CourseSeriesTitle` preserves exact `copy.courseSeries` text and accessible names. Component/unit/browser checks pin whitespace/token order; atomic spans and one Range rectangle per token pin `stress-free` and every other word.
- **Native interactions:** Both full cards receive computed 3 px focus outlines. Enter on Pinyin reaches unchanged `/pinyin`; Enter on Basic retains the current pathname, sets the stable page-local hash, keeps the path rendered, and adds no emulated control or imperative scrolling.
- **Independent state:** Seeded Home anchors contain no `/3` or `/10` sentence. Seeded Progress anchors contain localized `2/3` and `1/10` separately, while stats, mastery, status, and lesson links remain ten-lesson-only.
- **Content/route preservation:** Unit/browser destination arrays and protected diffs keep all ten Journey IDs/order/icons/destinations, course and lesson content, Pinyin content, copy, routes, and both store schemas unchanged.
- **#t46 preservation:** Existing hero unit and browser assertions stay unchanged and green; direct baseline comparisons protect hero JSX, component, WebP, all `.home-hero*` CSS, copy, language switcher, opacity, veil, clipping, and four-viewport geometry.
- **Delivery boundary:** The implementation begins only after designated review approves this plan; it changes no spec, package, configuration, migration, asset, storage, or unrelated content file.

## Execution handoff

Plan complete at `docs/superpowers/plans/2026-08-07-course-series-vertical-equal-entry-cards-implementation.md`. After this plan-only commit receives designated plan-review approval, execute it with `superpowers:subagent-driven-development` (recommended, fresh worker and review per task) or `superpowers:executing-plans` (batched checkpoints), preserving the task and commit order above.
