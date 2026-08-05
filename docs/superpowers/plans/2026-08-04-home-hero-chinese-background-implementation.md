# Home Hero Chinese Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Home hero’s minimal decorative background with one aria-hidden, lightweight horizontal Chinese long-scroll illustration that reads as a single unified scene while keeping the title, slogan, language switcher, and CTA area as the clearest visual focus.

**Architecture:** Keep the existing `HomePage` hero content structure intact and add one dedicated background layer component, `HomeHeroScrollScene`, before the visible hero content. Render the approved long-scroll composition as a single inline SVG scene and let `global.css` handle positioning, fade, blur, z-index, and responsive simplification so the center reading zone stays calm and the implementation stays lightweight.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, shared CSS in `src/styles/global.css`

---

## File map

- **Create:** `src/components/HomeHeroScrollScene.tsx` — one unified aria-hidden SVG long-scroll scene for the Home hero background.
- **Modify:** `src/pages/HomePage.tsx` — mount the decorative scene inside `.home-hero` without changing visible copy or routing.
- **Modify:** `src/styles/global.css` — add scene-layer layout, center fade, motif stroke/fill styling, and mobile/tablet simplification.
- **Modify:** `src/pages/HomePage.test.tsx` — lock the structural contract that the Home hero has one aria-hidden long-scroll scene and no new accessible noise.
- **Modify:** `tests/e2e/home-page.spec.ts` — lock the unified-scene existence plus no-overflow/readability behavior across breakpoints.
- **Verify:** `package.json`, `playwright.config.ts` — use the existing `npm run test`, `npm run test:e2e`, and `npm run build` flows.

## Execution notes

- Keep this slice **Home hero only**. Do not touch journey-map card behavior, routing, copy, lesson data, or progress logic.
- Prefer **one SVG scene** plus CSS support. Do not regress to many detached DOM icons or many independent decorative wrappers.
- The illustration must stay `aria-hidden="true"` and non-interactive.
- If the scene becomes too busy on small screens, remove or fade motifs responsively instead of shrinking everything uniformly.

### Task 1: Lock the Home hero long-scroll structural contract

**Files:**
- Create: `src/components/HomeHeroScrollScene.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.test.tsx`
- Inspect: `src/pages/HomePage.tsx`, `src/styles/global.css`

- [ ] **Step 1: Add a failing unit test for one aria-hidden unified scene**

Add this test near the existing Home hero contract tests in `src/pages/HomePage.test.tsx`:

```ts
it('renders one aria-hidden long-scroll scene behind the home hero content', () => {
  const { container } = renderRoute('/home')

  const hero = screen.getByRole('region', { name: /home hero/i })
  const scene = container.querySelector('.home-hero__scroll-scene')
  const sceneSvg = scene?.querySelector('svg.home-hero__scroll-svg')

  expect(hero.querySelectorAll('.home-hero__scroll-scene')).toHaveLength(1)
  expect(scene).toHaveAttribute('aria-hidden', 'true')
  expect(sceneSvg).toBeInTheDocument()
  expect(within(hero).getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
  expect(within(hero).getByText('Learn Mandarin in real life scenarios')).toBeVisible()
  expect(within(hero).queryByText(/Great Wall|Oriental Pearl|panda/i)).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused unit test and confirm the new contract fails first**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: **FAIL** because `.home-hero__scroll-scene` does not exist yet.

- [ ] **Step 3: Create the scene shell component and mount it in `HomePage.tsx`**

Create `src/components/HomeHeroScrollScene.tsx` with a minimal single-scene shell first:

```tsx
export function HomeHeroScrollScene() {
  return (
    <div className="home-hero__scroll-scene" aria-hidden="true">
      <svg
        className="home-hero__scroll-svg"
        viewBox="0 0 960 420"
        focusable="false"
      >
        <g className="home-hero__scroll-track">
          <path d="M24 286c78-34 134-54 197-50 52 4 92 22 146 24 63 2 110-18 161-42 63-29 129-43 244-14" />
          <path d="M32 320c65-16 118-13 172-1 63 14 115 16 171 2 53-13 101-39 148-57 62-24 126-27 224-7" />
        </g>
      </svg>
    </div>
  )
}
```

Then mount it inside the Home hero in `src/pages/HomePage.tsx` **before** the visible language switcher and hero content:

```tsx
import { HomeHeroScrollScene } from '../components/HomeHeroScrollScene'

// ...inside HomePage()
<section className="hero-card home-hero home-hero--centered" aria-label="Home hero">
  <HomeHeroScrollScene />

  <div className="home-language-switcher home-language-switcher--floating">
    <LanguageToggle
      selectedLanguage={language}
      onSelect={handleLanguageSelect}
      ariaLabel={copy.languageToggleLabel}
    />
  </div>

  <div className="home-hero__content">
    <h1 className="home-hero__title">{copy.homePage.heading}</h1>
    <div className="home-hero__slogan-stack" aria-label="Mandarin learning slogans">
      <p lang={language}>{copy.homePage.heroSlogan}</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Re-run the focused unit test and confirm it passes**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: **PASS**; the new test finds exactly one aria-hidden scene, and the existing Home hero tests remain green.

- [ ] **Step 5: Commit the structural slice**

Run:

```bash
git add src/components/HomeHeroScrollScene.tsx src/pages/HomePage.tsx src/pages/HomePage.test.tsx
git commit -m "feat: add home hero scroll scene shell"
```

Expected: one commit on the feature branch containing the new component shell, the HomePage mount, and the new unit contract.

### Task 2: Turn the shell into the approved unified long-scroll illustration

**Files:**
- Modify: `src/components/HomeHeroScrollScene.tsx`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/home-page.spec.ts`
- Verify: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: Add a failing e2e assertion for the visible unified scene**

Extend `tests/e2e/home-page.spec.ts` inside the existing home-page smoke test with this block after the Home hero assertions:

```ts
  const hero = page.getByRole('region', { name: /home hero/i })
  const scrollScene = hero.locator('.home-hero__scroll-scene')
  const scrollSvg = scrollScene.locator('svg.home-hero__scroll-svg')

  await expect(scrollScene).toHaveAttribute('aria-hidden', 'true')
  await expect(scrollSvg).toBeVisible()
```

Later in the breakpoint loop, keep the existing no-horizontal-scroll checks and add this one bounding-box assertion:

```ts
    const sceneBox = await scrollScene.boundingBox()
    expect(sceneBox).not.toBeNull()
    expect(sceneBox!.width).toBeGreaterThan(clientWidth * 0.82)
```

- [ ] **Step 2: Run the focused e2e file and confirm it fails before the full scene exists**

Run:

```bash
npm run test:e2e -- tests/e2e/home-page.spec.ts
```

Expected: **FAIL** because the current shell SVG is too minimal and/or not yet styled as a visible hero scene across the tested viewport flow.

- [ ] **Step 3: Replace the shell SVG with one unified long-scroll scene and add the CSS support layer**

Update `src/components/HomeHeroScrollScene.tsx` so it renders one SVG scene with one landscape rhythm, embedded motifs, and a center veil instead of detached icons:

```tsx
export function HomeHeroScrollScene() {
  return (
    <div className="home-hero__scroll-scene" aria-hidden="true">
      <svg
        className="home-hero__scroll-svg"
        viewBox="0 0 960 420"
        focusable="false"
      >
        <defs>
          <radialGradient id="homeHeroScrollWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(184,109,85,0.18)" />
            <stop offset="100%" stopColor="rgba(184,109,85,0)" />
          </radialGradient>
          <radialGradient id="homeHeroScrollSky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(95,143,247,0.16)" />
            <stop offset="100%" stopColor="rgba(95,143,247,0)" />
          </radialGradient>
          <radialGradient id="homeHeroScrollJade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(90,141,121,0.16)" />
            <stop offset="100%" stopColor="rgba(90,141,121,0)" />
          </radialGradient>
        </defs>

        <g className="home-hero__scroll-clouds">
          <path d="M118 90c22 5 39 17 52 36" />
          <path d="M274 74c24 6 42 18 56 40" />
          <path d="M448 62c21 4 38 15 53 34" />
          <path d="M640 84c24 5 42 16 57 36" />
          <path d="M786 104c18 4 32 13 43 29" />
        </g>

        <g className="home-hero__scroll-track">
          <path d="M24 286c78-34 134-54 197-50 52 4 92 22 146 24 63 2 110-18 161-42 63-29 129-43 244-14" />
          <path d="M32 320c65-16 118-13 172-1 63 14 115 16 171 2 53-13 101-39 148-57 62-24 126-27 224-7" />
        </g>

        <g className="home-hero__scroll-accents">
          <ellipse cx="92" cy="114" rx="42" ry="42" fill="url(#homeHeroScrollWarm)" />
          <ellipse cx="214" cy="304" rx="40" ry="40" fill="url(#homeHeroScrollJade)" />
          <ellipse cx="776" cy="120" rx="44" ry="44" fill="url(#homeHeroScrollSky)" />
          <ellipse cx="846" cy="286" rx="38" ry="38" fill="url(#homeHeroScrollWarm)" />
        </g>

        <g className="home-hero__scroll-motifs">
          <g className="home-hero__scroll-motif home-hero__scroll-motif--wall">
            <path d="M56 116h78l-10 20H66z" />
            <path d="M84 136v22m18-22v22m18-22v22" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--roof">
            <path d="M164 262h68l-8 18h-52z" />
            <path d="M176 280v18m16-18v18m16-18v18" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--panda">
            <path d="M228 246c18-18 38-26 60-26 19 0 35 8 48 25-17 14-35 21-56 21-20 0-37-6-52-20z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--tea">
            <path d="M344 196h34c11 0 18 6 18 16 0 11-9 19-22 19h-30z" />
            <path d="M394 202c10 1 16 7 16 14 0 8-7 15-18 16" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--music">
            <path d="M420 174v54" />
            <path d="M420 174c18-6 34-8 48-6v42" />
            <path d="M420 228c0 10-8 18-18 18-9 0-16-6-16-14 0-9 7-15 18-15" />
            <path d="M468 210c0 10-8 18-18 18-9 0-16-6-16-14 0-9 7-15 18-15" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--tower">
            <path d="M602 96c26 0 46 14 61 39-18 14-38 21-61 21-26 0-47-8-63-25 13-23 34-35 63-35z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--lantern">
            <path d="M702 154h32l12 18-12 18h-32l-12-18z" />
            <path d="M718 190v18" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--fan">
            <path d="M748 274c14-28 34-42 61-42 22 0 39 8 53 25-17 18-39 27-63 27-19 0-36-3-51-10z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--brush">
            <path d="M810 228l18 42 18-42" />
            <path d="M828 270v32" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--knot">
            <path d="M866 170c16 0 28 8 36 24-9 9-21 14-35 14-16 0-28-5-36-16 8-14 19-22 35-22z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--bamboo">
            <path d="M128 206c12 10 20 22 24 38" />
            <path d="M144 198c16 10 28 24 34 42" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--dumpling">
            <path d="M520 254c18 0 33 10 44 28-12 10-26 15-43 15-18 0-32-5-44-16 10-18 24-27 43-27z" />
          </g>
        </g>

        <rect className="home-hero__scroll-center-veil" x="252" y="72" width="456" height="244" rx="56" />
      </svg>
    </div>
  )
}
```

Add the long-scroll support CSS in `src/styles/global.css` so the scene reads as one unified background and the center stays calm:

```css
.home-hero {
  position: relative;
  isolation: isolate;
}

.home-hero__scroll-scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.home-hero__scroll-svg {
  position: absolute;
  inset: auto 50% 0;
  width: min(100%, 76rem);
  height: auto;
  min-width: 58rem;
  transform: translateX(-50%);
  opacity: 0.92;
}

.home-hero__scroll-track,
.home-hero__scroll-clouds,
.home-hero__scroll-motifs {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.home-hero__scroll-track {
  stroke: rgba(210, 190, 169, 0.78);
  stroke-width: 2;
}

.home-hero__scroll-clouds {
  stroke: rgba(214, 195, 173, 0.72);
  stroke-width: 1.8;
}

.home-hero__scroll-motifs {
  stroke: rgba(125, 98, 81, 0.38);
  stroke-width: 2;
}

.home-hero__scroll-motif--wall,
.home-hero__scroll-motif--roof,
.home-hero__scroll-motif--lantern,
.home-hero__scroll-motif--brush,
.home-hero__scroll-motif--knot {
  stroke: rgba(184, 109, 85, 0.42);
}

.home-hero__scroll-motif--panda,
.home-hero__scroll-motif--bamboo {
  stroke: rgba(90, 141, 121, 0.38);
}

.home-hero__scroll-motif--tower {
  stroke: rgba(95, 143, 247, 0.36);
}

.home-hero__scroll-motif--tea,
.home-hero__scroll-motif--fan,
.home-hero__scroll-motif--music,
.home-hero__scroll-motif--dumpling {
  stroke: rgba(197, 155, 83, 0.34);
}

.home-hero__scroll-center-veil {
  fill: rgba(255, 250, 245, 0.52);
}

.home-language-switcher,
.home-hero__content {
  position: relative;
  z-index: 2;
}

.home-hero::after {
  content: '';
  position: absolute;
  inset: 18% 24% 22%;
  z-index: 1;
  border-radius: 2.2rem;
  background: radial-gradient(circle, rgba(255, 252, 247, 0.66), rgba(255, 252, 247, 0));
  pointer-events: none;
}

@media (max-width: 1023px) {
  .home-hero__scroll-svg {
    min-width: 50rem;
    opacity: 0.82;
  }

  .home-hero__scroll-center-veil {
    fill: rgba(255, 250, 245, 0.62);
  }
}

@media (max-width: 640px) {
  .home-hero__scroll-svg {
    min-width: 42rem;
    opacity: 0.72;
    bottom: -0.35rem;
  }

  .home-hero__scroll-motif--fan,
  .home-hero__scroll-motif--brush,
  .home-hero__scroll-motif--knot,
  .home-hero__scroll-motif--dumpling,
  .home-hero__scroll-motif--tea {
    display: none;
  }

  .home-hero::after {
    inset: 22% 12% 22%;
  }
}
```

- [ ] **Step 4: Re-run the focused e2e and unit tests and confirm both pass**

Run:

```bash
npm run test:e2e -- tests/e2e/home-page.spec.ts
npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: **PASS**. The e2e file sees the scene, the page still has no horizontal overflow, and the unit file keeps the Home hero contract green.

- [ ] **Step 5: Commit the unified-scene implementation**

Run:

```bash
git add src/components/HomeHeroScrollScene.tsx src/styles/global.css tests/e2e/home-page.spec.ts
git commit -m "feat: add unified home hero Chinese scroll background"
```

Expected: one commit containing the final SVG scene, CSS layering, and focused e2e coverage.

### Task 3: Run final verification for the Home-only slice

**Files:**
- Verify: `src/pages/HomePage.tsx`
- Verify: `src/components/HomeHeroScrollScene.tsx`
- Verify: `src/styles/global.css`
- Verify: `src/pages/HomePage.test.tsx`
- Verify: `tests/e2e/home-page.spec.ts`

- [ ] **Step 1: Run the focused unit contract one more time from a clean terminal state**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: **PASS**; all Home hero tests stay green after the full SVG/CSS scene lands.

- [ ] **Step 2: Run the focused e2e smoke again to confirm the final scene stays readable across breakpoints**

Run:

```bash
npm run test:e2e -- tests/e2e/home-page.spec.ts
```

Expected: **PASS**; no horizontal scroll, Home hero title remains visible, and the unified background scene is present.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: **PASS**; TypeScript and Vite build complete without asset or JSX errors.

- [ ] **Step 4: Run diff hygiene**

Run:

```bash
git diff --check
```

Expected: no trailing whitespace, patch-format, or merge-marker issues.

- [ ] **Step 5: Capture the implementation handoff state**

Run:

```bash
git status --short
git rev-parse --short HEAD
```

Expected: a clean working tree (or only intentional follow-up notes if the branch has not been pushed yet) plus a concrete HEAD SHA to include when handing the branch to `dylan-t1-reviewer`.

## Spec coverage self-check

- **Unified composition:** Task 2 forces one SVG long-scroll scene instead of detached decorative icons.
- **A/B hybrid style:** Task 2 uses line-first motifs with sparse warm/jade/sky/gold accent fills.
- **Center reading priority:** Task 2 adds a center veil and keeps scene density strongest toward the outer thirds.
- **Responsive simplification:** Task 2 CSS explicitly removes selected motifs on narrow screens instead of shrinking the entire scene indiscriminately.
- **Home-only boundary:** Tasks touch only `HomePage`, one new Home-specific component, Home CSS, and Home-focused tests.
- **Accessibility/performance:** Task 1 and Task 2 lock `aria-hidden`, non-interactive markup, and inline-SVG/CSS-only implementation.

## Placeholder scan

- No `TBD`, `TODO`, “similar to above”, or open-ended “handle edge cases” placeholders remain.
- All file paths, component names, class names, and commands are explicit.

## Type and naming consistency check

- Component name is consistently `HomeHeroScrollScene`.
- Main DOM class names are consistently `home-hero__scroll-scene` and `home-hero__scroll-svg`.
- The implementation keeps `HomePage` as the integration point and `global.css` as the styling source of truth.

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-04-home-hero-chinese-background-implementation.md`.

Per the approved stage chain in this thread, the next owner after planner closeout is **`@dylan-t1-codex` for implementation** and **`@dylan-t1-reviewer` for review**.
