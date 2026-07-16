# T1 Home Kawaii Journey Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Home journey map so lesson nodes are whole-card links, preview nodes expand in place with lightweight coming-soon details, and the Home visual language leans more Chinese hand-drawn/kawaii without changing lesson/progress contracts.

**Architecture:** Keep the shared journey data contract stable around `JourneyNode.id`/`JourneyNodeId`, add only the minimal optional preview metadata needed for Home, and implement Home-only interaction state inside `HomePage`. Cover the behavior with focused Home tests first, then layer the CSS token refresh onto the existing Home journey markup.

**Tech Stack:** React, React Router, Vitest, Testing Library, CSS

---

### Task 1: Lock the Home interaction contract with focused tests

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Inspect: `src/pages/HomePage.tsx`, `src/content/journey.ts`, `src/content/copy.ts`

- [ ] Add a failing test that expects each lesson journey node to expose one whole-card link to its existing `/lesson/:lessonId` route instead of a small nested action.
- [ ] Add a failing test that expects each preview journey node to expose an accessible button, stay off routing, and reveal exactly one expandable coming-soon detail panel when toggled.
- [ ] Run `npm test -- --run src/pages/HomePage.test.tsx` and confirm RED before any production code changes.

### Task 2: Implement the Home-only interaction and content updates

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/content/journey.ts`
- Modify: `src/content/types.ts`
- Modify: `src/content/copy.ts`

- [ ] Add the smallest shared preview metadata needed for Home (for example key phrase/goal text) without introducing fake routes or progress/review side effects.
- [ ] Refactor Home journey rendering so lesson nodes are whole-card links and preview nodes use one consistent in-card expand/collapse interaction with keyboard and screen-reader semantics.
- [ ] Keep Progress behavior unchanged while leaving any reusable journey token hooks low-risk and optional.

### Task 3: Refresh the Home journey visuals and verify

**Files:**
- Modify: `src/styles/global.css`
- Verify: `src/pages/HomePage.test.tsx`
- Verify: broader `npm test -- --run` and `npm run build` as needed after the focused Home pass

- [ ] Strengthen the Home journey styling with paper/ink/path/stamp/kawaii CSS-only tokens while avoiding external assets or dependencies.
- [ ] Re-run the focused Home test file to reach GREEN.
- [ ] Run fresh broader verification after the implementation and record any remaining scope intentionally deferred to the later Progress slice.
