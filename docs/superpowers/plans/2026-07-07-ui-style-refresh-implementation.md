# UI Style Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved first-pass UI style refresh to Home, Lesson, and Review pages while preserving routes, course data, progress behavior, and learning semantics.

**Architecture:** Keep the existing React/Vite page structure and move presentation into `src/styles/global.css` tokens and reusable classes. Page/component TSX changes are limited to class names, lightweight semantic wrappers, and small presentational labels/chips required by the approved spec.

**Tech Stack:** React 19, React Router, TypeScript, Vitest + Testing Library, Vite, global CSS.

---

## Baseline already required before implementation

- Worktree: `/Users/cuiqiu/.loop/agents/agt_yptl965lm0617vlo3ulu/worktrees/en-fr-chinese-entry-mvp-ui-impl`
- Branch: `t2-ui-refresh-impl`
- Base branch/commit: `design/ui-style-refresh` at `9093470`
- Baseline commands:
  - `npm ci` if `node_modules/` is missing.
  - `npm run test -- --run` must pass before edits.
  - `npm run build` must pass before edits.

## File map

- Modify `src/styles/global.css`: design tokens, warm paper background, shared cards, chips, buttons, home grid, lesson section cards, dialogue cards, review flashcard styles, responsive rules.
- Modify `src/pages/HomePage.tsx`: add hero phrase/progress/chips, replace inline lesson grid styles with `.page-grid`, keep existing home shortcuts and course list.
- Modify `src/components/LessonCard.tsx`: switch to `.lesson-card`, add scenario badge and mini phrase from existing lesson data, keep lesson title/scenario/open link behavior.
- Modify `src/pages/LessonPage.tsx`: replace inline layout with semantic header/section wrappers and reusable classes; keep language toggle, progress save, lesson content, and links unchanged.
- Modify `src/components/DialoguePlayer.tsx`: replace inline dialogue card styles with `.dialogue-card`, speaker chip, `.hanzi-display`, `.pinyin-line`, and `.muted-text`.
- Modify `src/components/ExplanationBlock.tsx`: use `.explanation-block` instead of inline color/margin.
- Modify `src/components/SpeechButton.tsx`: use `.chip-button speech-button` instead of inline spacing.
- Modify `src/pages/ReviewPage.tsx`: replace inline layout with `.review-card`, `.review-flashcard`, front/back regions, `.success-chip`, and calm empty state.
- Test `src/pages/HomePage.test.tsx`: assert new hero phrase/progress/chips and mini phrase are rendered.
- Test `src/pages/LessonPage.test.tsx`: assert lesson overview/dialogue regions and dialogue line labels are rendered while preserving language behavior.
- Test `src/pages/ReviewPage.test.tsx`: assert current flashcard article/front/back regions and success chip behavior.

## Task 1: Home visual structure

**Files:**
- Test: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/LessonCard.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing Home test**

Add a test that renders `/home` and expects:
- `screen.getByLabelText(/hero phrase/i)` contains `你好` and `nǐ hǎo`.
- `screen.getByText('3 lessons')` is visible.
- `screen.getByText(/listen & repeat/i)` is visible.
- The first lesson mini phrase from `course.lessons[0].vocabulary[0].hanzi` is visible.

- [ ] **Step 2: Run RED Home command**

Run: `npm run test -- src/pages/HomePage.test.tsx --run`
Expected before implementation: FAIL because the hero phrase/progress/chip/mini phrase markup does not exist.

- [ ] **Step 3: Implement Home markup and CSS**

In `HomePage.tsx`, keep the existing `main`, `copy.homePage` links, progress loading, and lesson map. Add a hero layout with phrase block (`aria-label="Hero phrase"`), learning chips, progress stats using existing `course` and `progress`, and change the lesson list section to `className="page-grid lesson-grid"`.

In `LessonCard.tsx`, keep the same props and link route. Change the root to `className="lesson-card"`, add a `.badge` scenario label derived from existing lesson id, and show the first existing vocabulary item as a mini phrase.

In `global.css`, add the design tokens and classes needed by Home: `.home-hero`, `.home-hero__content`, `.home-hero__phrase`, `.learning-chip-row`, `.badge`, `.page-grid`, `.lesson-card`, `.lesson-card__phrase`, and updated button/card styles.

- [ ] **Step 4: Run GREEN Home command**

Run: `npm run test -- src/pages/HomePage.test.tsx --run`
Expected after implementation: PASS.

## Task 2: Lesson scan structure

**Files:**
- Test: `src/pages/LessonPage.test.tsx`
- Modify: `src/pages/LessonPage.tsx`
- Modify: `src/components/DialoguePlayer.tsx`
- Modify: `src/components/ExplanationBlock.tsx`
- Modify: `src/components/SpeechButton.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing Lesson test**

Add a test that renders `/lesson/self-intro` and expects:
- `screen.getByRole('region', { name: /lesson overview/i })` is visible.
- `screen.getByRole('region', { name: /dialogue practice/i })` is visible.
- `screen.getByLabelText(/dialogue line speaker a/i)` contains `你好` and `Nǐ hǎo`.

- [ ] **Step 2: Run RED Lesson command**

Run: `npm run test -- src/pages/LessonPage.test.tsx --run`
Expected before implementation: FAIL because the overview/dialogue regions and dialogue line labels do not exist.

- [ ] **Step 3: Implement Lesson markup and CSS**

In `LessonPage.tsx`, remove inline layout styles and wrap sections with `.lesson-header-card`, `.surface-card`, `.lesson-section-card`, `.section-stack`, `.card-grid`, `.study-item`, `.lesson-actions`, and accessible region labels. Preserve every existing heading, localized text lookup, language toggle, progress save, `DialoguePlayer`, `ExplanationBlock`, and nav route.

In `DialoguePlayer.tsx`, replace inline styles with `.dialogue-list`, `.dialogue-card`, `.speaker-chip`, `.hanzi-display`, `.pinyin-line`, `.muted-text`, and add `aria-label` such as `Dialogue line speaker A` to each article.

In `ExplanationBlock.tsx` and `SpeechButton.tsx`, replace inline styling with CSS classes only.

In `global.css`, add the lesson-specific class rules and responsive behavior.

- [ ] **Step 4: Run GREEN Lesson command**

Run: `npm run test -- src/pages/LessonPage.test.tsx --run`
Expected after implementation: PASS.

## Task 3: Review flashcard structure

**Files:**
- Test: `src/pages/ReviewPage.test.tsx`
- Modify: `src/pages/ReviewPage.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing Review test**

Update the existing review test to expect:
- `screen.getByRole('article', { name: /current review flashcard/i })` is visible.
- `screen.getByRole('region', { name: /flashcard front/i })` contains `我叫`.
- After marking complete, the finished-count message has class `success-chip`.

- [ ] **Step 2: Run RED Review command**

Run: `npm run test -- src/pages/ReviewPage.test.tsx --run`
Expected before implementation: FAIL because the flashcard article/regions and success chip class do not exist.

- [ ] **Step 3: Implement Review markup and CSS**

In `ReviewPage.tsx`, replace inline styles with `.review-card`, `.review-flashcard`, `.review-side`, `.review-empty-state`, `.success-chip`, and `.button-row`. Preserve queue calculation, mark-complete behavior, `ExplanationBlock`, and navigation links.

In `global.css`, add review flashcard depth, divider, empty-state, and success-chip styles.

- [ ] **Step 4: Run GREEN Review command**

Run: `npm run test -- src/pages/ReviewPage.test.tsx --run`
Expected after implementation: PASS.

## Final verification and commit gate

- [ ] Run focused touched tests: `npm run test -- src/pages/HomePage.test.tsx src/pages/LessonPage.test.tsx src/pages/ReviewPage.test.tsx src/components/DialoguePlayer.test.tsx --run`
- [ ] Run full unit test suite: `npm run test -- --run`
- [ ] Run production build: `npm run build`
- [ ] Inspect `git diff --stat` and `git status --short` to confirm scope.
- [ ] If all verification passes, commit locally with: `git add docs/superpowers/plans/2026-07-07-ui-style-refresh-implementation.md src/styles/global.css src/pages/HomePage.tsx src/components/LessonCard.tsx src/pages/LessonPage.tsx src/components/DialoguePlayer.tsx src/components/ExplanationBlock.tsx src/components/SpeechButton.tsx src/pages/ReviewPage.tsx src/pages/HomePage.test.tsx src/pages/LessonPage.test.tsx src/pages/ReviewPage.test.tsx && git commit -m "feat: refresh core learning UI"`.
- [ ] Do not push or deploy.
