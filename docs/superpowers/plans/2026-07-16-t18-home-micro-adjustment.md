# #t18 Home Micro-Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Home journey map cards reserve a larger bottom-right illustration slot while removing the separate Home lesson section from rendering.

**Architecture:** Keep the existing Home journey-map semantics intact, but reshape each journey node into a text column plus a fixed illustration slot anchored to the card’s bottom-right corner. Remove the extra lesson-grid section from `HomePage` entirely so the DOM only exposes the hero and journey-map entry points.

**Tech Stack:** React 19, React Router 7, TypeScript, Vitest, Testing Library, shared global CSS

---

### Task 1: Lock the Home-only behavior with failing tests

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Verify: `src/pages/HomePage.tsx`
- Verify: `src/styles/global.css`

- [ ] **Step 1: Add the failing Home assertions**

```tsx
it('keeps the journey map as the only lesson entry section on Home', () => {
  renderRoute('/home')

  expect(screen.queryByRole('heading', { level: 2, name: /lesson previews/i })).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/lesson previews/i)).not.toBeInTheDocument()
})

it('renders each journey card with a dedicated illustration slot', () => {
  renderRoute('/home')

  const journeyMap = screen.getByLabelText(/journey map/i)
  const cityTravelCard = within(journeyMap).getByRole('link', { name: /city travel/i })
  const airportArrivalToggle = within(journeyMap).getByRole('button', { name: /airport arrival/i })

  expect(cityTravelCard.querySelector('.journey-node__illustration-slot')).toBeInTheDocument()
  expect(cityTravelCard.querySelector('.journey-node__body')).toBeInTheDocument()
  expect(airportArrivalToggle.querySelector('.journey-node__illustration-slot')).toBeInTheDocument()
  expect(airportArrivalToggle.querySelector('.journey-node__body')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused test file to verify RED**

Run: `npm test -- --run src/pages/HomePage.test.tsx`
Expected: FAIL because Home still renders the lesson-grid section and the journey cards do not yet expose the new illustration/body wrappers.

- [ ] **Step 3: Keep existing navigation/preview semantics untouched**

Re-check the existing whole-card lesson-link and preview-panel tests in `src/pages/HomePage.test.tsx` so the new assertions extend them instead of changing destinations or progress behavior.

### Task 2: Apply the minimal Home markup and layout changes

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/styles/global.css`
- Re-run: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Remove the separate lesson section from HomePage**

Delete the trailing lesson-grid `<section>` and the unused `LessonCard` / `course` list rendering path so Home no longer renders a duplicate lesson area outside the journey map.

- [ ] **Step 2: Wrap journey-node text content and add the illustration slot**

```tsx
<div className="journey-node__body">
  <div className="journey-node__header">...</div>
  <h2>{nodeTitle}</h2>
  <p className="muted-text">{nodeSummary}</p>
  <span className="journey-node__cta">...</span>
</div>
<span className="journey-node__illustration-slot" aria-hidden="true">
  <span className="journey-node__doodle">{nodeIcon}</span>
</span>
```

Apply the same body/illustration structure to both lesson links and preview buttons so only layout changes.

- [ ] **Step 3: Update the shared Home journey CSS for a bottom-right slot**

```css
.journey-node {
  padding: 1.2rem 1.2rem 1.35rem;
  overflow: hidden;
}

.journey-node__body {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.85rem;
  max-width: min(100%, calc(100% - 7.5rem));
}

.journey-node__illustration-slot {
  position: absolute;
  right: clamp(0.9rem, 2vw, 1.2rem);
  bottom: clamp(0.85rem, 2vw, 1.15rem);
  display: flex;
  align-items: end;
  justify-content: end;
  width: clamp(4.75rem, 18vw, 7.5rem);
  min-height: clamp(4rem, 12vw, 6rem);
  pointer-events: none;
}
```

Keep the icon decorative (`aria-hidden`) and size it with a responsive max-width/max-height so the top-left text remains readable.

- [ ] **Step 4: Keep preview panel spacing safe**

Make sure the expanded preview panel still sits below the button content and does not overlap the absolute illustration slot; add bottom padding or responsive overrides only if the focused tests/manual inspection require it.

### Task 3: Verify the slice without broadening scope

**Files:**
- Verify: `src/pages/HomePage.test.tsx`
- Verify: full repo scripts from `package.json`

- [ ] **Step 1: Re-run the focused Home tests**

Run: `npm test -- --run src/pages/HomePage.test.tsx`
Expected: PASS with the new Home-only assertions plus the existing journey-map behavior tests.

- [ ] **Step 2: Run fresh broader verification**

Run:
- `npm test -- --run`
- `npm run build`
- `npm run lint`

Expected: PASS. If Progress needs any visual sync beyond token reuse, leave that for a later slice instead of expanding this Home task.
