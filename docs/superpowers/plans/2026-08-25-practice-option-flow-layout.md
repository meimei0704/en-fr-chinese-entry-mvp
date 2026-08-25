# Practice Option Flow Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace equal-width practice options with readable intrinsic-width flow cards, shrink option audio controls to 28px, and keep prompt audio fixed to the prompt's right side.

**Architecture:** Preserve `PracticeChallenge`'s existing sibling answer/audio buttons and all state behavior. Implement the visual change in scoped CSS: a wrapping flex container sizes each composite option from its rendered content, caps it to the container, and lets internal text wrap safely. Lock the contract with CSS rule tests, component interaction tests, and Playwright geometry checks.

**Tech Stack:** React 19, TypeScript 6, CSS, Vitest + Testing Library, Playwright

## Global Constraints

- Option audio controls must be no larger than `1.75rem` (28px); icons must be `0.78rem`–`0.8rem`.
- Prompt audio must stay to the right of prompt text in one non-wrapping flex row, including long prompts.
- Answer and audio controls remain separate native buttons with non-overlapping click targets.
- Option wrappers must use `max-width: 100%`; answer/text regions must use `min-width: 0`.
- A/B/C/D badges, answer feedback, sounds, and reduced-motion behavior must not change.
- Verify 1280, 760, 390, and 320 widths without document or option overflow.
- Do not add JavaScript text measurement, localization heuristics, or global `SpeechButton` changes.

---

### Task 1: Intrinsic Option Cards and Inline Prompt Audio

**Files:**
- Modify: `src/styles/global.test.ts:680-730`
- Modify: `src/components/PracticeChallenge.test.tsx:85-125`
- Modify: `tests/e2e/practice-challenge-layout.spec.ts:1-70`
- Modify: `src/styles/global.css:4244-4345`

**Interfaces:**
- Consumes: existing `.practice-challenge__prompt`, `.practice-challenge__options`, `.practice-challenge__option`, `.option-button`, and `.speech-button` DOM structure from `PracticeChallenge`.
- Produces: a CSS-only intrinsic flow layout; no TypeScript interface or component-state changes.

- [ ] **Step 1: Add the component regression test for independent click targets**

Add this test after `shows a pronunciation button on hanzi options only`:

```tsx
it('plays option audio without submitting the answer', async () => {
  const user = userEvent.setup()
  const seed = Array.from({ length: 100 }, (_, candidate) => candidate).find((candidate) =>
    buildPracticeChallenge(selfIntroLesson, 'en', 5, candidate)
      .questions[0].options.some((option) => option.audio),
  )
  expect(seed).toBeDefined()

  const challenge = renderChallenge({ seed })
  const audibleOption = challenge.questions[0].options.find((option) => option.audio)

  expect(audibleOption).toBeDefined()
  vi.mocked(speakChinese).mockClear()

  await user.click(screen.getByRole('button', { name: `Play ${audibleOption!.label}` }))

  expect(speakChinese).toHaveBeenCalledWith(
    expect.objectContaining({
      text: audibleOption!.label,
      audioSrc: audibleOption!.audio,
    }),
  )
  expect(screen.queryByText(copy.correctFeedback)).not.toBeInTheDocument()
  expect(screen.queryByText(copy.incorrectFeedback)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Replace the CSS assertions with the new layout contract**

Update the prompt assertion to require `align-items: center`. Replace the option assertion with:

```ts
it('flows practice options by intrinsic width with bounded text and compact audio', () => {
  const options = ruleBlock('.practice-challenge__options')
  const option = ruleBlock('.practice-challenge__option')
  const answerButton = ruleBlock('.practice-challenge__option .option-button')
  const speechButton = ruleBlock('.practice-challenge__option .speech-button')
  const speechIcon = ruleBlock('.practice-challenge__option .speech-button__icon')
  const label = ruleBlock('.option-button__label')

  expect(options).toContain('display: flex;')
  expect(options).toContain('flex-wrap: wrap;')
  expect(option).toContain('flex: 1 0 max-content;')
  expect(option).toContain('max-width: 100%;')
  expect(option).toContain('align-items: center;')
  expect(answerButton).toContain('min-width: 0;')
  expect(speechButton).toContain('width: 1.75rem;')
  expect(speechButton).toContain('min-width: 1.75rem;')
  expect(speechIcon).toContain('width: 0.8rem;')
  expect(label).toContain('min-width: 0;')
})
```

- [ ] **Step 3: Extend Playwright geometry coverage before implementation**

Change the width loop to `[1280, 760, 390, 320]`. Within the loop, assert:

```ts
const promptText = prompt.locator('p')
const promptSpeech = prompt.locator('.speech-button')
if (await promptSpeech.count()) {
  const textBox = await promptText.boundingBox()
  const speechBox = await promptSpeech.boundingBox()
  expect(textBox).not.toBeNull()
  expect(speechBox).not.toBeNull()
  expect(speechBox!.x).toBeGreaterThanOrEqual(textBox!.x + textBox!.width - 1)
  expect(
    Math.abs(
      speechBox!.y + speechBox!.height / 2 -
        (promptBox!.y + promptBox!.height / 2),
    ),
  ).toBeLessThanOrEqual(2)
}

for (const option of await page.locator('.practice-challenge__option').all()) {
  const optionBox = await option.boundingBox()
  const speech = option.locator('.speech-button')
  expect(optionBox).not.toBeNull()
  expect(optionBox!.x).toBeGreaterThanOrEqual(optionsBox!.x - 1)
  expect(optionBox!.x + optionBox!.width).toBeLessThanOrEqual(
    optionsBox!.x + optionsBox!.width + 1,
  )

  if (await speech.count()) {
    const speechBox = await speech.boundingBox()
    expect(speechBox).not.toBeNull()
    expect(speechBox!.width).toBeLessThanOrEqual(28.5)
    expect(
      Math.abs(
        speechBox!.y + speechBox!.height / 2 -
          (optionBox!.y + optionBox!.height / 2),
      ),
    ).toBeLessThanOrEqual(2)
  }
}
```

Add a second test that mutates labels only for deterministic layout geometry:

```ts
test('lets rendered option content choose one row or multiple rows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/lesson/order-food/practice')

  const options = page.locator('.practice-challenge__options')
  const cards = page.locator('.practice-challenge__option')
  const labels = page.locator('.option-button__label')
  await expect(cards).toHaveCount(4)

  await labels.evaluateAll((nodes) => {
    for (const [index, node] of nodes.entries()) {
      node.textContent = ['一', '二', '三', '四'][index]
    }
  })
  await page.locator('.option-button__pinyin').evaluateAll((nodes) => {
    for (const node of nodes) node.textContent = ''
  })

  const compactTops = await cards.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  )
  expect(new Set(compactTops).size).toBe(1)

  await labels.first().evaluate((node) => {
    node.textContent =
      '这是一个用于验证超长选项能够独占整行并在卡片内部安全换行而不会溢出的练习答案'.repeat(4)
  })

  const optionsBox = await options.boundingBox()
  const longBox = await cards.first().boundingBox()
  const secondBox = await cards.nth(1).boundingBox()
  expect(optionsBox).not.toBeNull()
  expect(longBox).not.toBeNull()
  expect(secondBox).not.toBeNull()
  expect(Math.abs(longBox!.width - optionsBox!.width)).toBeLessThanOrEqual(2)
  expect(secondBox!.y).toBeGreaterThanOrEqual(longBox!.y + longBox!.height - 1)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    ),
  ).toBe(true)
})
```

- [ ] **Step 4: Run the new tests and verify the old layout fails**

Run:

```bash
npx vitest run src/styles/global.test.ts src/components/PracticeChallenge.test.tsx
npx playwright test tests/e2e/practice-challenge-layout.spec.ts
```

Expected before implementation:

- CSS test fails because options still use grid, prompt uses `align-items: flex-start`, and option audio is `2.05rem`.
- Playwright fails the 28px audio and content-driven row geometry assertions.
- The sibling-button regression test passes, proving behavior is already correct.

- [ ] **Step 5: Implement the scoped CSS**

Replace the relevant rules with:

```css
.practice-challenge__prompt {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.4rem 0.75rem;
  /* keep existing padding, border, background, and shadow */
}

.practice-challenge__prompt p {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
}

.practice-challenge__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-content: start;
}

.practice-challenge__option {
  flex: 1 0 max-content;
  min-width: min(100%, 12rem);
  max-width: 100%;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    border-color 150ms ease,
    background 150ms ease;
}

.practice-challenge__option:hover,
.practice-challenge__option:focus-within {
  border-color: rgba(var(--color-primary-rgb), 0.48);
  box-shadow: var(--shadow-card-inset);
}

.practice-challenge__option .option-button {
  flex: 1 1 auto;
  align-self: stretch;
  min-width: 0;
  justify-content: center;
  flex-wrap: wrap;
  border: 0;
  background: transparent;
  padding: 0.72rem 0.35rem 0.72rem 0.8rem;
  overflow-wrap: anywhere;
}

.practice-challenge__option .speech-button {
  flex: 0 0 auto;
  width: 1.75rem;
  min-width: 1.75rem;
  min-height: 1.75rem;
  margin: 0 0.65rem 0 0;
}

.practice-challenge__option .speech-button__icon {
  width: 0.8rem;
  height: 0.8rem;
}

.option-button__label,
.practice-challenge__option .option-button__pinyin {
  min-width: 0;
  overflow-wrap: anywhere;
}
```

Remove the old option grid declaration, the answer button's duplicate border/background ownership, and the `2.05rem`/`0.92rem` audio overrides.

- [ ] **Step 6: Run focused tests and adjust only measured layout defects**

Run:

```bash
npx vitest run src/styles/global.test.ts src/components/PracticeChallenge.test.tsx
npx playwright test tests/e2e/practice-challenge-layout.spec.ts tests/e2e/pinyin-zone.spec.ts
```

Expected: all focused unit and E2E tests pass. If geometry differs by subpixel rounding, keep the CSS contract and widen only the Playwright tolerance to at most 2px; do not remove the assertion.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/styles/global.css src/styles/global.test.ts \
  src/components/PracticeChallenge.test.tsx \
  tests/e2e/practice-challenge-layout.spec.ts
git commit -m "feat(practice): flow options by rendered content"
```

---

### Task 2: Full Verification and PR Delivery

**Files:**
- Verify: all files changed by Task 1
- Refresh review context: repository root

**Interfaces:**
- Consumes: Task 1 CSS layout and tests.
- Produces: pushed PR #77 update with reproducible verification evidence.

- [ ] **Step 1: Run full unit, lint, and type checks**

```bash
npm test -- --run
npm run lint
npx tsc -b
```

Expected: all unit tests pass; oxlint and TypeScript exit successfully with no diagnostics.

- [ ] **Step 2: Run the required E2E suites**

```bash
npx playwright test tests/e2e/practice-challenge-layout.spec.ts tests/e2e/pinyin-zone.spec.ts
```

Expected: all tests pass at 1280, 760, 390, and 320 checks with no overflow.

- [ ] **Step 3: Confirm the branch contains only intended changes**

```bash
git status --short
git diff origin/main...HEAD --check
git log --oneline --decorate -6
```

Expected: clean worktree; no whitespace errors; history contains the design and implementation commits on top of PR #77.

- [ ] **Step 4: Push and add review context**

```bash
git push origin feat/lesson-optimization-0825
loop exec review add '{"path":"/Users/cuiqiu/.config/superpowers/worktrees/en-fr-chinese-entry-mvp/feat-lesson-optimization-0825","head":"HEAD","thread":"#dylan-s-test:56d1dcfb"}'
```

Expected: remote branch advances to the implementation commit; review context is available in the thread.

- [ ] **Step 5: Request focused reviewer verification**

Post the commit, changed behavior, test counts, and the exact acceptance checklist to
`#dylan-s-test:56d1dcfb`, mentioning `@dylan-t1-reviewer-ds`.
