# Pinyin Syllable Composition Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an always-visible, localized, static `mā / 妈 → Initial m + Final a + Tone ¯` teaching card between the Pinyin hero and module tabs.

**Architecture:** `PinyinPage` passes localized UI copy into one new presentational `PinyinSyllableIntro` component. The component owns only the fixed example values and semantic DOM; `global.css` owns the horizontal-to-stacked responsive layout. Existing Vitest and Pinyin Playwright suites pin copy, document order, persistence across tabs, geometry, and narrow-screen overflow.

**Tech Stack:** React 19, TypeScript, React Router, CSS Grid, Vitest + Testing Library, Playwright, Go regression tests

## Global Constraints

- Start from `origin/main` `b2d09e9` plus the approved spec in `docs/superpowers/specs/2026-08-11-pinyin-syllable-composition-intro-design.md`.
- Render the intro directly after `PinyinHero` and before `.pinyin-lesson-tabs`; never put it inside selected-module content.
- English description must be exactly `A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.`
- French description must be exactly `Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.`
- The fixed example is exactly `mā`, `妈`, `m`, `a`, and the macron glyph `¯`; do not substitute neutral-tone `ma`, hyphen-minus `-`, `1`, or `first`.
- Keep the card static: no button, link, audio, animation, API request, progress write, local storage, or selected-module dependency.
- Use semantic HTML/CSS only; add no PNG, SVG, icon, font, or package dependency.
- Use existing Pinyin palettes: Initial `#fff3e0/#c2571c`, Final `#e8f5e9/#2e7d32`, Tone `#e3f2fd/#1565c0`, and Pinyin `#f3e5f5/#6a1b9a`.
- Desktop is horizontal; narrow screens stack vertically. English and French must have no clipping or horizontal overflow at 390 px and 320 px.
- Do not change Pinyin modules, course JSON, providers, audio, practice, progress, routes, loading, error, backend, or unrelated styles.
- Use test-driven development: observe every new focused test fail before adding the production code that makes it pass.

---

## File Structure

- Create `src/components/pinyin/PinyinSyllableIntro.tsx`
  - Owns the semantic figure and the fixed `mā / 妈 / m / a / ¯` example.
  - Consumes localized labels only; it has no provider or state dependency.
- Modify `src/content/copy.ts`
  - Adds parallel English and French `pinyinPage.syllableIntro` copy.
- Modify `src/pages/PinyinPage.tsx`
  - Inserts the new component between `PinyinHero` and the tablist.
- Modify `src/pages/PinyinPage.test.tsx`
  - Pins exact copy, semantics, DOM order, one persistent figure, and French localization.
- Modify `src/styles/global.css`
  - Adds the card, example, decomposition, palette, and responsive layout.
- Modify `src/styles/global.test.ts`
  - Pins the CSS grid, palette, and 640 px / 360 px responsive contracts.
- Modify `tests/e2e/pinyin-zone.spec.ts`
  - Pins real-browser localization, order, geometry, text fit, overflow, and review screenshots.

No other file is in scope.

---

### Task 1: Localized Semantic Intro and Page Placement

**Files:**
- Create: `src/components/pinyin/PinyinSyllableIntro.tsx`
- Modify: `src/content/copy.ts:164-173,332-341`
- Modify: `src/pages/PinyinPage.tsx:7-10,74-100`
- Test: `src/pages/PinyinPage.test.tsx`

**Interfaces:**
- Consumes:

```ts
export interface PinyinSyllableIntroCopy {
  description: string
  figureLabel: string
  pinyinLabel: string
  initialLabel: string
  finalLabel: string
  toneLabel: string
}
```

- Produces:

```ts
interface PinyinSyllableIntroProps {
  copy: PinyinSyllableIntroCopy
}

export function PinyinSyllableIntro({ copy }: PinyinSyllableIntroProps)
```

- `getUiCopy(language).pinyinPage.syllableIntro` supplies the prop in both languages.

- [ ] **Step 1: Add failing English, order, persistence, and French page tests**

In `src/pages/PinyinPage.test.tsx`, import `within`:

```ts
import { render, screen, within } from '@testing-library/react'
```

Add shared exact copy near the existing storage-key constant:

```ts
const syllableIntroCopy = {
  en: {
    description:
      'A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.',
    figureLabel:
      'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
  },
  fr: {
    description:
      'Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.',
    figureLabel:
      'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
  },
} as const
```

Add these tests inside `describe('PinyinPage', ...)`:

```ts
it('renders the English syllable composition intro between the hero and module tabs', () => {
  renderRoute('/pinyin')

  const heading = screen.getByRole('heading', {
    level: 1,
    name: 'Pinyin（零基础第一课）',
  })
  const hero = heading.closest('section')
  const figure = screen.getByRole('figure', {
    name: syllableIntroCopy.en.figureLabel,
  })
  const tabs = screen.getByRole('tablist', { name: 'Pinyin modules' })
  const intro = within(figure)

  if (!hero) {
    throw new Error('Missing Pinyin hero')
  }

  expect(intro.getByText(syllableIntroCopy.en.description)).toBeVisible()
  expect(intro.getByText('Pinyin')).toBeVisible()
  expect(intro.getByText('Initial')).toBeVisible()
  expect(intro.getByText('Final')).toBeVisible()
  expect(intro.getByText('Tone')).toBeVisible()
  expect(intro.getByText('mā')).toBeVisible()
  expect(intro.getByText('妈')).toBeVisible()
  expect(intro.getByText('m')).toBeVisible()
  expect(intro.getByText('a')).toBeVisible()
  expect(intro.getByText('¯')).toBeVisible()
  expect(
    hero.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
  expect(
    figure.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
})

it('keeps exactly one syllable composition intro while switching all four modules', async () => {
  const user = userEvent.setup()
  renderRoute('/pinyin')

  const figure = screen.getByRole('figure', {
    name: syllableIntroCopy.en.figureLabel,
  })

  for (const moduleName of ['Finals', 'Tones', 'Whole Syllables', 'Initials']) {
    await user.click(screen.getByRole('tab', { name: moduleName }))
    expect(
      screen.getByRole('figure', { name: syllableIntroCopy.en.figureLabel }),
    ).toBe(figure)
    expect(
      screen.getAllByRole('figure', { name: syllableIntroCopy.en.figureLabel }),
    ).toHaveLength(1)
  }
})
```

Extend the existing French test after `renderRoute('/pinyin')`:

```ts
const figure = screen.getByRole('figure', {
  name: syllableIntroCopy.fr.figureLabel,
})
const intro = within(figure)

expect(intro.getByText(syllableIntroCopy.fr.description)).toBeVisible()
expect(intro.getByText('Initiale')).toBeVisible()
expect(intro.getByText('Finale')).toBeVisible()
expect(intro.getByText('Ton')).toBeVisible()
expect(intro.getByText('mā')).toBeVisible()
expect(intro.getByText('妈')).toBeVisible()
expect(intro.getByText('¯')).toBeVisible()
```

- [ ] **Step 2: Run the focused page test and verify the red state**

Run:

```bash
npm test -- --run src/pages/PinyinPage.test.tsx
```

Expected: FAIL because no accessible syllable-composition `figure` exists.

- [ ] **Step 3: Add exact localized copy**

Inside both `pinyinPage` objects in `src/content/copy.ts`, add a
`syllableIntro` object immediately after `heading`.

English:

```ts
syllableIntro: {
  description:
    'A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.',
  figureLabel:
    'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
  pinyinLabel: 'Pinyin',
  initialLabel: 'Initial',
  finalLabel: 'Final',
  toneLabel: 'Tone',
},
```

French:

```ts
syllableIntro: {
  description:
    'Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.',
  figureLabel:
    'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
  pinyinLabel: 'Pinyin',
  initialLabel: 'Initiale',
  finalLabel: 'Finale',
  toneLabel: 'Ton',
},
```

- [ ] **Step 4: Create the semantic presentational component**

Create `src/components/pinyin/PinyinSyllableIntro.tsx` with:

```tsx
export interface PinyinSyllableIntroCopy {
  description: string
  figureLabel: string
  pinyinLabel: string
  initialLabel: string
  finalLabel: string
  toneLabel: string
}

interface PinyinSyllableIntroProps {
  copy: PinyinSyllableIntroCopy
}

export function PinyinSyllableIntro({ copy }: PinyinSyllableIntroProps) {
  const parts = [
    {
      key: 'initial',
      label: copy.initialLabel,
      value: 'm',
    },
    {
      key: 'final',
      label: copy.finalLabel,
      value: 'a',
    },
    {
      key: 'tone',
      label: copy.toneLabel,
      value: '¯',
    },
  ] as const

  return (
    <figure
      className="surface-card pinyin-syllable-intro"
      aria-label={copy.figureLabel}
    >
      <figcaption className="pinyin-syllable-intro__description">
        {copy.description}
      </figcaption>

      <div className="pinyin-syllable-intro__diagram">
        <div className="pinyin-syllable-intro__example">
          <span className="pinyin-syllable-intro__pinyin">mā</span>
          <span className="pinyin-syllable-intro__hanzi" lang="zh-Hans">
            妈
          </span>
        </div>

        <span className="pinyin-syllable-intro__arrow" aria-hidden="true">
          →
        </span>

        <div className="pinyin-syllable-intro__composition">
          <p className="pinyin-syllable-intro__heading">
            {copy.pinyinLabel}
          </p>
          <dl className="pinyin-syllable-intro__parts">
            {parts.map((part) => (
              <div
                key={part.key}
                className={`pinyin-syllable-intro__part pinyin-syllable-intro__part--${part.key}`}
              >
                <dt>{part.label}</dt>
                <dd>{part.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  )
}
```

Keep the component state-free. Do not import course data, providers, progress,
speech, or React hooks.

- [ ] **Step 5: Insert the component at the page-level boundary**

In `src/pages/PinyinPage.tsx`, add:

```ts
import { PinyinSyllableIntro } from '../components/pinyin/PinyinSyllableIntro'
```

Render it immediately after `PinyinHero` and before the tablist:

```tsx
<PinyinHero eyebrow={pinyinCopy.eyebrow} heading={pinyinCopy.heading} />

<PinyinSyllableIntro copy={pinyinCopy.syllableIntro} />

<nav role="tablist" aria-label="Pinyin modules" className="pinyin-lesson-tabs">
```

Do not move the tablist or either selected-module rendering branch.

- [ ] **Step 6: Run focused tests, type/build checks, and verify green**

Run:

```bash
npm test -- --run src/pages/PinyinPage.test.tsx
npm run build
```

Expected: all `PinyinPage` tests PASS and the TypeScript/Vite build exits 0.

- [ ] **Step 7: Commit the semantic and localized slice**

```bash
git add \
  src/components/pinyin/PinyinSyllableIntro.tsx \
  src/content/copy.ts \
  src/pages/PinyinPage.tsx \
  src/pages/PinyinPage.test.tsx
git commit -m "feat: add localized pinyin syllable intro"
```

---

### Task 2: Responsive Visual Contract and Real-Browser Coverage

**Files:**
- Modify: `src/styles/global.css:2989-3291`
- Modify: `src/styles/global.test.ts`
- Modify: `tests/e2e/pinyin-zone.spec.ts`

**Interfaces:**
- Consumes:
  - `.pinyin-syllable-intro*` DOM classes from Task 1.
  - The localized accessible figure labels from Task 1.
- Produces:
  - Horizontal desktop grid.
  - Vertical layout at `max-width: 640px`.
  - One-column part list at `max-width: 360px`.
  - Playwright review attachments for desktop, 390 px, and 320 px in English
    and French.

- [ ] **Step 1: Add a failing CSS contract test**

Add this test inside `describe('global color accessibility tokens', ...)` in
`src/styles/global.test.ts`:

```ts
it('keeps the Pinyin syllable intro responsive and tied to module palettes', () => {
  const intro = ruleBlock('.pinyin-syllable-intro')
  const diagram = ruleBlock('.pinyin-syllable-intro__diagram')
  const parts = ruleBlock('.pinyin-syllable-intro__parts')
  const initial = ruleBlock('.pinyin-syllable-intro__part--initial')
  const final = ruleBlock('.pinyin-syllable-intro__part--final')
  const tone = ruleBlock('.pinyin-syllable-intro__part--tone')
  const heading = ruleBlock('.pinyin-syllable-intro__heading')
  const initialLabel = ruleBlock('.pinyin-syllable-intro__part--initial dt')

  expect(intro).toContain('min-width: 0;')
  expect(diagram).toContain(
    'grid-template-columns: minmax(0, 0.8fr) auto minmax(0, 1.4fr);',
  )
  expect(diagram).toContain('min-width: 0;')
  expect(parts).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));')
  expect(parts).toContain('min-width: 0;')
  expect(initial).toContain('background: #fff3e0;')
  expect(initial).toContain('color: #c2571c;')
  expect(initialLabel).toContain('color: #a34a16;')
  expect(final).toContain('background: #e8f5e9;')
  expect(final).toContain('color: #2e7d32;')
  expect(tone).toContain('background: #e3f2fd;')
  expect(tone).toContain('color: #1565c0;')
  expect(heading).toContain('background: #f3e5f5;')
  expect(heading).toContain('color: #6a1b9a;')
  expect(contrastRatio('#a34a16', '#fff3e0')).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio('#2e7d32', '#e8f5e9')).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio('#1565c0', '#e3f2fd')).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio('#6a1b9a', '#f3e5f5')).toBeGreaterThanOrEqual(4.5)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 640px)',
      '.pinyin-syllable-intro__diagram',
      'grid-template-columns: minmax(0, 1fr);',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 640px)',
      '.pinyin-syllable-intro__arrow',
      'transform: rotate(90deg);',
    ),
  ).toBe(true)
  expect(
    hasMediaRuleWithDeclaration(
      '(max-width: 360px)',
      '.pinyin-syllable-intro__parts',
      'grid-template-columns: minmax(0, 1fr);',
    ),
  ).toBe(true)
})
```

- [ ] **Step 2: Add failing Playwright localization and geometry coverage**

At the top of `tests/e2e/pinyin-zone.spec.ts`, add:

```ts
const syllableIntroCopy = {
  en: {
    description:
      'A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.',
    figureLabel:
      'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
    labels: ['Pinyin', 'Initial', 'Final', 'Tone'],
  },
  fr: {
    description:
      'Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.',
    figureLabel:
      'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
    labels: ['Pinyin', 'Initiale', 'Finale', 'Ton'],
  },
} as const

type IntroLanguage = keyof typeof syllableIntroCopy

const introViewports = [
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 720 },
] as const

async function seedExplanationLanguage(page: Page, language: IntroLanguage) {
  await page.addInitScript(
    ({ key, selectedExplanationLanguage }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          selectedExplanationLanguage,
          completedLessons: [],
          reviewQueue: [],
          lastVisitedLesson: null,
          lessonStepProgress: {},
        }),
      )
    },
    {
      key: courseProgressStorageKey,
      selectedExplanationLanguage: language,
    },
  )
}
```

Append this matrix after the current module-switching test:

```ts
for (const language of ['en', 'fr'] as const) {
  for (const viewport of introViewports) {
    test(`renders the localized syllable composition intro in ${language} at ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      const copy = syllableIntroCopy[language]

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await seedExplanationLanguage(page, language)
      await page.goto('/pinyin')

      const figure = page.getByRole('figure', { name: copy.figureLabel })

      await expect(figure).toHaveCount(1)
      await expect(figure).toContainText(copy.description)
      for (const label of copy.labels) {
        await expect(figure.getByText(label, { exact: true })).toBeVisible()
      }
      for (const value of ['mā', '妈', 'm', 'a', '¯']) {
        await expect(figure.getByText(value, { exact: true })).toBeVisible()
      }

      const metrics = await figure.evaluate((element) => {
        const heroElement = element.previousElementSibling
        const tabsElement = element.nextElementSibling
        const diagram = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__diagram',
        )
        const example = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__example',
        )
        const arrow = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__arrow',
        )
        const composition = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__composition',
        )
        const parts = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__parts',
        )

        if (
          !heroElement ||
          !tabsElement ||
          !diagram ||
          !example ||
          !arrow ||
          !composition ||
          !parts
        ) {
          throw new Error('Missing Pinyin syllable intro geometry target')
        }

        const box = (target: Element) => {
          const rect = target.getBoundingClientRect()
          return {
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
          }
        }
        const textFits = Array.from(
          element.querySelectorAll<HTMLElement>(
            'figcaption, .pinyin-syllable-intro__pinyin, .pinyin-syllable-intro__hanzi, .pinyin-syllable-intro__heading, dt, dd',
          ),
          (target) =>
            target.scrollWidth <= target.clientWidth + 1 &&
            target.scrollHeight <= target.clientHeight + 1,
        )

        return {
          arrow: box(arrow),
          arrowTransform: window.getComputedStyle(arrow).transform,
          cardClientWidth: element.clientWidth,
          cardScrollWidth: element.scrollWidth,
          composition: box(composition),
          directOrder:
            heroElement.classList.contains('pinyin-hero') &&
            tabsElement.classList.contains('pinyin-lesson-tabs'),
          documentClientWidth: document.documentElement.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          example: box(example),
          partColumns: window.getComputedStyle(parts).gridTemplateColumns,
          textFits,
        }
      })

      expect(metrics.directOrder).toBe(true)
      expect(metrics.documentScrollWidth).toBe(metrics.documentClientWidth)
      expect(metrics.cardScrollWidth).toBeLessThanOrEqual(
        metrics.cardClientWidth + 1,
      )
      expect(metrics.textFits.every(Boolean)).toBe(true)

      if (viewport.width > 640) {
        expect(metrics.example.right).toBeLessThanOrEqual(metrics.arrow.left + 1)
        expect(metrics.arrow.right).toBeLessThanOrEqual(
          metrics.composition.left + 1,
        )
        expect(metrics.arrowTransform).toBe('none')
      } else {
        expect(metrics.example.bottom).toBeLessThanOrEqual(metrics.arrow.top + 1)
        expect(metrics.arrow.bottom).toBeLessThanOrEqual(
          metrics.composition.top + 1,
        )
        expect(metrics.arrowTransform).not.toBe('none')
      }

      const partColumnCount = metrics.partColumns
        .split(/\s+/u)
        .filter(Boolean).length
      expect(partColumnCount).toBe(viewport.width <= 360 ? 1 : 3)

      await testInfo.attach(
        `pinyin-syllable-intro-${language}-${viewport.name}`,
        {
          body: await figure.screenshot(),
          contentType: 'image/png',
        },
      )
    })
  }
}
```

The DOM-order assertion is intentionally performed inside `figure.evaluate`
against direct siblings.

- [ ] **Step 3: Run focused CSS and browser tests and verify the red state**

Run:

```bash
npm test -- --run src/styles/global.test.ts
npm run test:e2e -- tests/e2e/pinyin-zone.spec.ts --grep "localized syllable composition intro"
```

Expected:

- Vitest FAILS because `.pinyin-syllable-intro` CSS rules do not exist.
- Playwright FAILS the horizontal/stacked geometry assertions because the
  component has no dedicated grid or responsive layout.

- [ ] **Step 4: Add the exact base and responsive CSS**

Insert the following block in `src/styles/global.css` after `.pinyin-hero` and
before the existing Pinyin reference styles:

```css
.pinyin-syllable-intro {
  width: min(100%, 72rem);
  min-width: 0;
  margin: 0;
  display: grid;
  gap: clamp(0.9rem, 2vw, 1.2rem);
  overflow: visible;
}

.pinyin-syllable-intro__description {
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(1rem, 2vw, 1.12rem);
  font-weight: 700;
  line-height: 1.65;
}

.pinyin-syllable-intro__diagram {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) auto minmax(0, 1.4fr);
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.pinyin-syllable-intro__example {
  min-width: 0;
  display: grid;
  place-items: center;
  gap: 0.2rem;
  padding: clamp(0.9rem, 2.5vw, 1.25rem);
  border: 1px solid rgba(194, 87, 28, 0.18);
  border-radius: var(--radius-lg);
  background: #fffaf4;
}

.pinyin-syllable-intro__pinyin,
.pinyin-syllable-intro__hanzi {
  display: block;
}

.pinyin-syllable-intro__pinyin {
  color: #c2571c;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
}

.pinyin-syllable-intro__hanzi {
  color: var(--color-ink);
  font-size: clamp(2.8rem, 7vw, 4.6rem);
  font-weight: 900;
  line-height: 1.05;
}

.pinyin-syllable-intro__arrow {
  display: grid;
  place-items: center;
  color: var(--color-muted);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
  line-height: 1;
  transform-origin: center;
}

.pinyin-syllable-intro__composition {
  min-width: 0;
  display: grid;
  gap: 0.55rem;
}

.pinyin-syllable-intro__heading {
  margin: 0;
  padding: 0.55rem 0.8rem;
  border: 1px solid rgba(106, 27, 154, 0.18);
  border-radius: var(--radius-md);
  background: #f3e5f5;
  color: #6a1b9a;
  font-size: 0.95rem;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
}

.pinyin-syllable-intro__parts {
  min-width: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
}

.pinyin-syllable-intro__part {
  min-width: 0;
  display: grid;
  gap: 0.3rem;
  padding: 0.65rem 0.55rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  text-align: center;
}

.pinyin-syllable-intro__part dt,
.pinyin-syllable-intro__part dd {
  margin: 0;
  overflow-wrap: normal;
  word-break: normal;
}

.pinyin-syllable-intro__part dt {
  font-size: clamp(0.78rem, 1.6vw, 0.9rem);
  font-weight: 800;
  line-height: 1.25;
}

.pinyin-syllable-intro__part dd {
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  font-weight: 900;
  line-height: 1;
}

.pinyin-syllable-intro__part--initial {
  border-color: rgba(194, 87, 28, 0.18);
  background: #fff3e0;
  color: #c2571c;
}

.pinyin-syllable-intro__part--initial dt {
  color: #a34a16;
}

.pinyin-syllable-intro__part--final {
  border-color: rgba(46, 125, 50, 0.18);
  background: #e8f5e9;
  color: #2e7d32;
}

.pinyin-syllable-intro__part--tone {
  border-color: rgba(21, 101, 192, 0.18);
  background: #e3f2fd;
  color: #1565c0;
}

@media (max-width: 640px) {
  .pinyin-syllable-intro__diagram {
    grid-template-columns: minmax(0, 1fr);
  }

  .pinyin-syllable-intro__arrow {
    justify-self: center;
    transform: rotate(90deg);
  }
}

@media (max-width: 360px) {
  .pinyin-syllable-intro__parts {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

Do not change the existing tab palettes; the new component intentionally
duplicates their approved literal palette values so `global.test.ts` detects
future divergence.

- [ ] **Step 5: Run focused unit, CSS, and browser tests and verify green**

Run:

```bash
npm test -- --run src/pages/PinyinPage.test.tsx src/styles/global.test.ts
npm run test:e2e -- tests/e2e/pinyin-zone.spec.ts
npm run lint
npm run build
```

Expected: every command exits 0. Inspect the six attached intro screenshots:

- English desktop 1280;
- French desktop 1280;
- English mobile 390;
- French mobile 390;
- English mobile 320;
- French mobile 320.

Reject the slice if any screenshot shows clipped copy, an off-center arrow,
unexpected nested surfaces, palette mismatch, or horizontal scrolling even
when automated assertions are green.

- [ ] **Step 6: Commit the responsive and browser-verified slice**

```bash
git add \
  src/styles/global.css \
  src/styles/global.test.ts \
  tests/e2e/pinyin-zone.spec.ts
git commit -m "feat: style responsive pinyin syllable intro"
```

---

### Task 3: Full Regression and Review Handoff

**Files:**
- Verify only; no production or test file should be added in this task.

**Interfaces:**
- Consumes: the two implementation commits from Tasks 1 and 2.
- Produces: one exact implementation head for independent review.

- [ ] **Step 1: Run the complete frontend and backend regression set**

```bash
npm test -- --run
npm run lint
npm run build
npm run test:e2e -- tests/e2e/pinyin-zone.spec.ts
go test ./...
```

Expected: all commands exit 0 with no skipped failure.

- [ ] **Step 2: Verify scope and repository cleanliness**

```bash
git diff --check origin/main...HEAD
git diff --name-only origin/main...HEAD
git status --short
```

Expected changed implementation files are limited to:

```text
docs/superpowers/specs/2026-08-11-pinyin-syllable-composition-intro-design.md
docs/superpowers/plans/2026-08-11-pinyin-syllable-composition-intro-implementation.md
src/components/pinyin/PinyinSyllableIntro.tsx
src/content/copy.ts
src/pages/PinyinPage.tsx
src/pages/PinyinPage.test.tsx
src/styles/global.css
src/styles/global.test.ts
tests/e2e/pinyin-zone.spec.ts
```

`git status --short` must be empty. Generated Playwright reports,
screenshots, `test-results`, build output, and temporary scripts must not be
committed.

- [ ] **Step 3: Publish the exact implementation evidence**

Collect exact branch, commit, and changed-file evidence:

```bash
git branch --show-current
git rev-parse HEAD
git diff --name-only origin/main...HEAD
```

Post those command outputs in `#dylan-s-test:ad36590f` together with:

- the exact Vitest passed file/test counts from Step 1;
- lint exit 0;
- build exit 0;
- the exact Pinyin Playwright passed count from Step 1;
- the successful Go package summary from Step 1;
- the six attached English/French desktop 1280, mobile 390, and mobile 320
  screenshots.

- [ ] **Step 4: Open the independent review gate**

The owner adds review context for the exact implementation head. The assigned
reviewer checks:

- exact copy and fixed glyphs;
- page-level placement and single-card persistence;
- semantic figure and noninteractive behavior;
- desktop/mobile geometry and screenshots;
- English/French 320 px wrapping and overflow;
- unchanged Pinyin audio, practice, progress, provider, routes, and backend;
- exact changed-file scope and all verification evidence.

The gate closes only when the reviewer posts `pass` or `fix required` against
the exact implementation commit.

---

## Execution Handoff

The user already assigned implementation to `@dylan-t2-opencode-ds` and
review to `@dylan-t2-reviewer-ds`; no alternate execution choice is needed.

The implementer must:

1. create or enter an isolated worktree from the pushed planning branch;
2. invoke `superpowers:executing-plans`;
3. execute Tasks 1–3 in order with the listed red/green evidence;
4. post the exact branch, commit, test counts, and screenshots.

The planner remains owner of the delivery chain and advances the review,
merge, merged-main verification, deploy, and production smoke gates only
after each prior gate has a visible conclusion.
