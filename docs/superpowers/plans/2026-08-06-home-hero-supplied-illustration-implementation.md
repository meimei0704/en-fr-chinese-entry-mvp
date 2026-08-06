# Home Hero Supplied Illustration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Home hero’s hand-authored inline SVG with the approved clean supplied Chinese-elements illustration while preserving the existing title, localized slogan, language controls, hero layout, and behavior.

**Architecture:** Convert the already-approved local PNG source into one repository-owned, opaque WebP and render it through a focused `HomeHeroIllustration` decorative component mounted before the existing hero controls and content. Keep the wrapper absolute and clipped, apply opacity only to the image, place a paper-colored elliptical veil above it, and use the existing `1023px` and `760px` media-query branches to keep the panda face, main Great Wall curve, and sun visible without page overflow.

**Tech Stack:** React 19, TypeScript, Vite static assets, CSS, Vitest with Testing Library, Playwright, `cwebp`, `webpinfo`

---

## File map

- **Create:** `public/images/home-hero-chinese-elements.webp` — opaque, local runtime derivative of the approved attachment; maximum `1318 × 1226`, maximum `350,000` bytes.
- **Create:** `src/components/HomeHeroIllustration.tsx` — decorative image-and-veil layer only.
- **Delete:** `src/components/HomeHeroScrollScene.tsx` — obsolete hand-authored inline SVG and motif markup.
- **Modify:** `src/pages/HomePage.tsx:4,36-53` — replace the old component import and mount without changing the language switcher, heading, slogan, or their order.
- **Modify:** `src/pages/HomePage.test.tsx:89-126` — replace the old scene and vector-detail contracts with the supplied-image DOM/accessibility contract.
- **Modify:** `src/styles/global.css:411-505,2674-2683,2720-2730` — delete all old scene/motif styling and add the centered image, veil, and responsive rules.
- **Modify:** `tests/e2e/home-page.spec.ts:16-125` — replace old SVG selectors and verify the supplied image, clipping, content visibility, and overflow at `1440`, `1024`, `390`, and `320` CSS pixels; attach a hero screenshot for each viewport.
- **Verify only:** `package.json`, `playwright.config.ts` — use the current `test`, `lint`, `build`, and `test:e2e` scripts and the existing isolated Vite server at `127.0.0.1:4174`; do not add scripts or dependencies.

## Guardrails

- This is a Home hero media-layer replacement only. Do not change Home copy, `handleLanguageSelect`, Journey Map data/layout, lesson routes, progress, review, or course hierarchy.
- Use `.superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png` only as the local conversion input. It is the approved Loop attachment `att_mvafm7v0u5q8w9`, is ignored by Git, and must never be copied into `public/`, `src/`, or `dist/`.
- Preserve the source’s off-white rectangular paper canvas. The source is an RGBA container whose alpha plane is uniformly opaque; do not infer transparency, remove the background, mask white details, or introduce any background-removal tool or service.
- The production asset is exactly `/images/home-hero-chinese-elements.webp`, loaded locally. Do not use a CDN, data URL, remote request, runtime conversion, animation, parallax, drag, or zoom.
- Keep the existing `.home-hero`, `.home-hero::before`, `.home-hero::after`, `.home-hero__content`, `.home-language-switcher`, `.home-hero__title`, and `.home-hero__slogan-stack` structures and behavior except for the explicitly listed scene-selector replacement.
- Do not replace the centered composition with split copy/image columns or a second mobile illustration.

### Task 1: Create and prove the opaque runtime asset

**Files:**
- Create: `public/images/home-hero-chinese-elements.webp`
- Inspect only: `.superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png`
- Inspect only: `docs/superpowers/specs/2026-08-05-home-hero-supplied-illustration-design.md`

- [ ] **Step 1: Verify the conversion input before creating output**

Run from the repository root:

```bash
SOURCE=.superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png
EXPECTED_SOURCE_SHA=0082532b0ebc44c4e1805dd36411e4f96b5c6d5d8cd12922c1c74a1ee1dcf8ff

test -f "$SOURCE"
test "$(stat -f%z "$SOURCE")" -eq 2169130
test "$(shasum -a 256 "$SOURCE" | awk '{print $1}')" = "$EXPECTED_SOURCE_SHA"
file "$SOURCE"
sips -g pixelWidth -g pixelHeight "$SOURCE"
```

Expected: every `test` succeeds; `file` reports `PNG image data, 1318 x 1226, 8-bit/color RGBA`; `sips` reports `pixelWidth: 1318` and `pixelHeight: 1226`. Stop rather than converting if any identity check differs, because that would not be the approved source.

- [ ] **Step 2: Confirm there is no stale runtime output and convert directly with no resize or masking stage**

Run:

```bash
SOURCE=.superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png
OUTPUT=public/images/home-hero-chinese-elements.webp

test ! -e "$OUTPUT"
mkdir -p public/images
cwebp -quiet -q 82 "$SOURCE" -o "$OUTPUT"
```

Expected: `test ! -e` succeeds before conversion, and `cwebp` creates the WebP. There is deliberately no `-resize`, alpha, mask, crop, or background-removal option, so the derivative remains `1318 × 1226` and cannot be upscaled.

- [ ] **Step 3: Verify dimensions, byte budget, and absence of alpha payload**

Run:

```bash
OUTPUT=public/images/home-hero-chinese-elements.webp
WEBP_INFO="$(webpinfo -summary "$OUTPUT")"

printf '%s\n' "$WEBP_INFO"
test "$(stat -f%z "$OUTPUT")" -le 350000
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Width:[[:space:]]+1318'
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Height:[[:space:]]+1226'
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Alpha:[[:space:]]+0'
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Chunk counts:[[:space:]]+1[[:space:]]+0[[:space:]]+0[[:space:]]+0'
sips -g pixelWidth -g pixelHeight -g hasAlpha "$OUTPUT"
```

Expected: size is at most `350,000` bytes (the current encoder produces about `109,028` bytes), dimensions are exactly `1318 × 1226`, `webpinfo` reports `Alpha: 0` with no `VP8X`/`ALPH` chunk, and `sips` reports `hasAlpha: no`. Exact bytes may vary by encoder version; the bounds and opacity contract may not.

- [ ] **Step 4: Compare source and runtime rendering at native size**

Run:

```bash
open .superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png \
  public/images/home-hero-chinese-elements.webp
```

Expected: both images retain the same off-white paper canvas and composition. At 100% zoom, the panda eyes and mouth, Great Wall stair/edge lines, bamboo leaves, sun, and gold linework remain clean; there is no transparency checkerboard, masking halo, color-block replacement, or new watermark.

- [ ] **Step 5: Prove the source is not being staged and commit only the runtime derivative**

Run:

```bash
git status --short
git check-ignore -v .superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png
git add public/images/home-hero-chinese-elements.webp
git diff --cached --stat
git commit -m "feat: add optimized home hero illustration"
```

Expected: the ignored source path is identified by `.git/info/exclude`; the staged diff contains only `public/images/home-hero-chinese-elements.webp`; the commit contains no PNG.

### Task 2: Replace the inline SVG component under a failing DOM contract

**Files:**
- Create: `src/components/HomeHeroIllustration.tsx`
- Delete: `src/components/HomeHeroScrollScene.tsx`
- Modify: `src/pages/HomePage.tsx:4,36-53`
- Modify: `src/pages/HomePage.test.tsx:89-126`

- [ ] **Step 1: Replace both old SVG/motif tests with one failing supplied-image contract**

In `src/pages/HomePage.test.tsx`, replace the tests named `renders one aria-hidden long-scroll scene behind the home hero content` and `builds the long-scroll scene from detailed, recognizable cultural anchors` with this complete test:

```tsx
it('renders one aria-hidden supplied illustration behind unchanged home hero content', () => {
  const { container } = renderRoute('/home')

  const hero = screen.getByRole('region', { name: /home hero/i })
  const illustration = hero.querySelector('.home-hero__illustration')
  const image = illustration?.querySelector('img.home-hero__illustration-image')
  const veil = illustration?.querySelector('.home-hero__illustration-veil')

  expect(hero.querySelectorAll('.home-hero__illustration')).toHaveLength(1)
  expect(illustration).toHaveAttribute('aria-hidden', 'true')
  expect(illustration?.querySelectorAll('img.home-hero__illustration-image')).toHaveLength(1)
  expect(image).toHaveAttribute('src', '/images/home-hero-chinese-elements.webp')
  expect(image).toHaveAttribute('alt', '')
  expect(image).toHaveAttribute('decoding', 'async')
  expect(illustration?.querySelectorAll('.home-hero__illustration-veil')).toHaveLength(1)
  expect(veil).toBeInTheDocument()
  expect(illustration?.querySelectorAll('a, button, [tabindex]')).toHaveLength(0)
  expect(hero.querySelectorAll('.home-hero__scroll-scene, svg.home-hero__scroll-svg')).toHaveLength(0)
  expect(container.querySelectorAll('[data-home-hero-motif]')).toHaveLength(0)
  expect(within(hero).getByRole('group', { name: 'Explanation language' })).toBeVisible()
  expect(within(hero).getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
  expect(within(hero).getByText('Learn Mandarin in real life scenarios')).toBeVisible()
})
```

This removes the obsolete vector-detail loop rather than preserving tests for hand-authored motifs that no longer exist.

- [ ] **Step 2: Run the focused test and observe the intended red state**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx \
  -t "renders one aria-hidden supplied illustration behind unchanged home hero content"
```

Expected: **FAIL** because `.home-hero__illustration` has count `0` while the current page still renders `HomeHeroScrollScene`.

- [ ] **Step 3: Add the focused decorative component**

Create `src/components/HomeHeroIllustration.tsx` with exactly this implementation:

```tsx
export function HomeHeroIllustration() {
  return (
    <div className="home-hero__illustration" aria-hidden="true">
      <img
        className="home-hero__illustration-image"
        src="/images/home-hero-chinese-elements.webp"
        alt=""
        decoding="async"
      />
      <span className="home-hero__illustration-veil" />
    </div>
  )
}
```

The wrapper owns only decorative media. Do not add a caption, cultural label, focus target, click handler, loading state, alternate source, or remote fallback.

- [ ] **Step 4: Replace the import and mount without touching visible content**

In `src/pages/HomePage.tsx`, replace the old import with:

```tsx
import { HomeHeroIllustration } from '../components/HomeHeroIllustration'
```

Then keep the section’s current children and reading order, changing only the first child component:

```tsx
<section className="hero-card home-hero home-hero--centered" aria-label="Home hero">
  <HomeHeroIllustration />

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

Delete `src/components/HomeHeroScrollScene.tsx` in the same step:

```bash
git rm src/components/HomeHeroScrollScene.tsx
```

- [ ] **Step 5: Run the focused and complete Home unit files in the green state**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx \
  -t "renders one aria-hidden supplied illustration behind unchanged home hero content"
npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: **PASS** for the focused contract and all tests in `HomePage.test.tsx`. The image source, empty alternative, async decoding, single veil, unchanged language controls/title/slogan, and removal of old SVG/motif markup are all covered.

- [ ] **Step 6: Commit the DOM replacement**

Run:

```bash
git add src/components/HomeHeroIllustration.tsx \
  src/pages/HomePage.tsx \
  src/pages/HomePage.test.tsx
git diff --cached --check
git commit -m "feat: replace home hero scroll scene"
```

Expected: one commit creates `HomeHeroIllustration`, deletes `HomeHeroScrollScene`, updates only the component mount/import, and replaces the two obsolete unit contracts.

### Task 3: Add four-viewport browser coverage, then implement the centered background wash

**Files:**
- Modify: `tests/e2e/home-page.spec.ts:16-125`
- Modify: `src/styles/global.css:411-505,2674-2683,2720-2730`

- [ ] **Step 1: Name all four required browser viewports**

Add this constant immediately after `expectedTopics` in `tests/e2e/home-page.spec.ts`:

```ts
const heroViewports = [
  { name: 'desktop', width: 1440, height: 900, maximumOpacity: 0.36 },
  { name: 'tablet', width: 1024, height: 900, maximumOpacity: 0.32 },
  { name: 'mobile-390', width: 390, height: 844, maximumOpacity: 0.30 },
  { name: 'mobile-320', width: 320, height: 720, maximumOpacity: 0.30 },
] as const
```

This retains the current desktop, tablet, and two mobile widths while making each visual-evidence attachment and failure report unambiguous.

- [ ] **Step 2: Replace the old browser selectors with the new single-image contract**

Inside the existing test `keeps the Home journey stamp slot decorative while preserving readable text widths`, replace the declarations for `scrollScene` and `scrollSvg` with:

```ts
const illustration = hero.locator('.home-hero__illustration')
const illustrationImage = illustration.locator('img.home-hero__illustration-image')
const illustrationVeil = illustration.locator('.home-hero__illustration-veil')
```

Replace the old `scrollScene`/`scrollSvg` assertions with:

```ts
await expect(illustration).toHaveCount(1)
await expect(illustration).toHaveAttribute('aria-hidden', 'true')
await expect(illustrationImage).toHaveCount(1)
await expect(illustrationImage).toHaveAttribute('alt', '')
await expect(illustrationImage).toHaveAttribute(
  'src',
  '/images/home-hero-chinese-elements.webp',
)
await expect(illustrationVeil).toHaveCount(1)
await expect(hero.locator('.home-hero__scroll-scene, svg.home-hero__scroll-svg')).toHaveCount(0)
```

Keep every existing Journey Map assertion in the test unchanged.

- [ ] **Step 3: Replace the current numeric width loop with complete media-layer and screenshot coverage**

Replace the existing `for (const width of [320, 390, 1024, 1440])` loop in `tests/e2e/home-page.spec.ts` with this complete loop. It preserves the current card/title checks while adding the new layer checks:

```ts
for (const viewport of heroViewports) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height })

  const firstCard = journeyNodes.first()
  const secondCard = journeyNodes.nth(1)
  const heroTitle = page.getByRole('heading', { name: '轻松学中文' })
  const heroSlogan = page.getByText('Learn Mandarin in real life scenarios')
  const languageControls = page.getByRole('group', { name: 'Explanation language' })
  const title = firstCard.locator('h2')
  const slot = firstCard.locator('.journey-node__illustration-slot--stamp')

  await expect(illustrationImage).toBeVisible()
  await expect(illustrationVeil).toBeVisible()
  await expect(heroTitle).toBeVisible()
  await expect(heroSlogan).toBeVisible()
  await expect(languageControls).toBeVisible()

  const [
    firstCardBox,
    secondCardBox,
    heroBox,
    illustrationBox,
    heroTitleBox,
    titleBox,
    slotBox,
  ] = await Promise.all([
    firstCard.boundingBox(),
    secondCard.boundingBox(),
    hero.boundingBox(),
    illustration.boundingBox(),
    heroTitle.boundingBox(),
    title.boundingBox(),
    slot.boundingBox(),
  ])

  expect(firstCardBox).not.toBeNull()
  expect(secondCardBox).not.toBeNull()
  expect(heroBox).not.toBeNull()
  expect(illustrationBox).not.toBeNull()
  expect(heroTitleBox).not.toBeNull()
  expect(titleBox).not.toBeNull()
  expect(slotBox).not.toBeNull()

  const [scrollWidth, clientWidth, layerStyle, imageFacts] = await Promise.all([
    page.evaluate(() => document.documentElement.scrollWidth),
    page.evaluate(() => document.documentElement.clientWidth),
    illustration.evaluate((element) => {
      const style = window.getComputedStyle(element)
      return {
        overflow: style.overflow,
        pointerEvents: style.pointerEvents,
        position: style.position,
      }
    }),
    illustrationImage.evaluate((element) => {
      const image = element as HTMLImageElement
      const style = window.getComputedStyle(image)
      return {
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: style.objectFit,
        opacity: Number.parseFloat(style.opacity),
      }
    }),
  ])

  expect(scrollWidth).toBe(clientWidth)
  expect(layerStyle).toEqual({
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
  })
  expect(imageFacts.complete).toBe(true)
  expect(imageFacts.naturalWidth).toBe(1318)
  expect(imageFacts.naturalHeight).toBe(1226)
  expect(imageFacts.objectFit).toBe('contain')
  expect(imageFacts.opacity).toBeGreaterThanOrEqual(0.28)
  expect(imageFacts.opacity).toBeLessThanOrEqual(viewport.maximumOpacity)
  expect(Math.abs(illustrationBox!.x - heroBox!.x)).toBeLessThanOrEqual(2)
  expect(Math.abs(illustrationBox!.y - heroBox!.y)).toBeLessThanOrEqual(2)
  expect(
    Math.abs(
      illustrationBox!.x + illustrationBox!.width - (heroBox!.x + heroBox!.width),
    ),
  ).toBeLessThanOrEqual(2)
  expect(
    Math.abs(
      illustrationBox!.y + illustrationBox!.height - (heroBox!.y + heroBox!.height),
    ),
  ).toBeLessThanOrEqual(2)

  if (viewport.width <= 390) {
    expect(Math.abs(firstCardBox!.x - secondCardBox!.x)).toBeLessThan(2)
    expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height - 2)
  }

  expect(heroTitleBox!.width).toBeLessThan(clientWidth * 0.92)
  expect(heroTitleBox!.height).toBeLessThan(viewport.width >= 1024 ? 116 : 92)
  expect(slotBox!.width).toBeLessThan(firstCardBox!.width * 0.38)
  expect(titleBox!.width).toBeGreaterThanOrEqual(viewport.width >= 1024 ? 150 : 140)

  await test.info().attach(`home-hero-${viewport.name}-${viewport.width}`, {
    body: await hero.screenshot(),
    contentType: 'image/png',
  })
}
```

The bounding checks prove that the clipping wrapper coincides with the hero, while `overflow: hidden` and document-width equality prove that the oversized centered image cannot create horizontal page overflow. The screenshot attachments provide the required human-verifiable motif evidence rather than pretending that DOM geometry can identify a panda or a Great Wall.

- [ ] **Step 4: Run the focused browser test and observe the intended red state before styling**

Run:

```bash
npm run test:e2e -- tests/e2e/home-page.spec.ts
```

Expected: **FAIL** on the new media-layer CSS contract because the new wrapper has not yet received absolute positioning, clipping, `pointer-events: none`, image opacity, and responsive sizing.

- [ ] **Step 5: Replace every old inline-SVG-only base rule with the three focused illustration selectors**

In `src/styles/global.css`, delete the entire block from `.home-hero__scroll-scene` through `.home-hero__scroll-center-veil` (current lines `411-505`). Put this complete replacement in the same location, before `.home-hero__content`:

```css
.home-hero__illustration {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.home-hero__illustration-image {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  display: block;
  width: auto;
  max-width: none;
  height: 142%;
  object-fit: contain;
  transform: translate(-50%, -50%);
  opacity: 0.32;
  user-select: none;
}

.home-hero__illustration-veil {
  position: absolute;
  inset: 20% 20% 18%;
  z-index: 1;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 250, 245, 0.86) 0%,
    rgba(255, 250, 245, 0.7) 38%,
    rgba(255, 250, 245, 0.28) 62%,
    rgba(255, 250, 245, 0) 78%
  );
}
```

This keeps the source’s complete rectangular paper canvas, applies reduced opacity to that whole canvas, and creates an independent veil above the image. Do not apply opacity to the wrapper, because that would also weaken the veil.

- [ ] **Step 6: Replace the old `1023px` responsive branch**

Inside the current `@media (max-width: 1023px)` block, delete the rules for `.home-hero__scroll-svg` and `.home-hero__scroll-center-veil` and use:

```css
@media (max-width: 1023px) {
  .home-hero__illustration-image {
    height: 136%;
    opacity: 0.3;
  }

  .home-hero__illustration-veil {
    inset: 19% 16% 17%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 250, 245, 0.88) 0%,
      rgba(255, 250, 245, 0.76) 40%,
      rgba(255, 250, 245, 0.3) 64%,
      rgba(255, 250, 245, 0) 80%
    );
  }
}
```

The tablet image is slightly smaller and lighter than desktop while retaining the same center anchor and one DOM/image source.

- [ ] **Step 7: Replace the old `760px` scene and motif rules**

Inside the existing `@media (max-width: 760px)` block, delete `.home-hero__scroll-svg` and the grouped palace/lantern/fan opacity rule. Leave the existing mobile hero sizing, title, and language-switcher rules unchanged, and insert:

```css
.home-hero__illustration-image {
  height: 152%;
  opacity: 0.28;
}

.home-hero__illustration-veil {
  inset: 17% 6% 14%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 250, 245, 0.9) 0%,
    rgba(255, 250, 245, 0.8) 42%,
    rgba(255, 250, 245, 0.34) 66%,
    rgba(255, 250, 245, 0) 82%
  );
}
```

The larger mobile height intentionally crops only the far paper margins, outer bamboo, and minor seals through the already-clipped wrapper. Center anchoring keeps the panda face on the left-center, the main Great Wall curve through the middle/right, and the sun in the upper-right portion of the visible image. Image opacity remains below the tablet value, while the stronger veil preserves title and slogan priority.

- [ ] **Step 8: Re-run browser coverage and review all four attached hero images**

Generate a temporary HTML report with the four attachments:

```bash
PLAYWRIGHT_HTML_OUTPUT_DIR=/tmp/t46-home-hero-playwright-report \
  npm run test:e2e -- tests/e2e/home-page.spec.ts --reporter=html
npx playwright show-report /tmp/t46-home-hero-playwright-report
```

Expected automated result: **PASS** at all four widths; the local image has natural dimensions `1318 × 1226`, the wrapper is absolute/clipped/non-interactive, title/slogan/language controls are visible, and document `scrollWidth` equals `clientWidth`.

Expected visual result in each `home-hero-*` attachment:

- `1440`: full circular composition is recognizable behind centered copy; panda face, main wall curve/watchtowers, and sun are visible; only light outer paper/decorative clipping is acceptable.
- `1024`: the same three anchors remain visible, with slightly lower image opacity and stronger text clearing than desktop.
- `390`: panda face, main wall curve, and sun remain identifiable; only far bamboo leaves, paper margins, and minor seals may clip; language controls, title, and slogan retain their current layout and reading order.
- `320`: the same anchors remain identifiable without horizontal page overflow; no control, title glyph, or slogan is cut off.

Close the report server after review. Do not approve the task from geometry assertions alone; all four attachments must satisfy the visual list.

- [ ] **Step 9: Prove all old SVG CSS and test selectors are gone, then commit the responsive slice**

Run:

```bash
if rg -n 'HomeHeroScrollScene|home-hero__scroll-|data-home-hero-motif' src tests; then
  echo 'Obsolete Home hero scene code remains' >&2
  exit 1
fi

git add src/styles/global.css tests/e2e/home-page.spec.ts
git diff --cached --check
git commit -m "feat: style supplied home hero illustration"
```

Expected: the stale-symbol scan prints nothing; the commit contains only the new centered image/veil CSS, deletion of old motif CSS, and the updated four-viewport browser coverage.

### Task 4: Complete asset, regression, build, and diff verification

**Files:**
- Verify: `public/images/home-hero-chinese-elements.webp`
- Verify: `src/components/HomeHeroIllustration.tsx`
- Verify absence: `src/components/HomeHeroScrollScene.tsx`
- Verify: `src/pages/HomePage.tsx`
- Verify: `src/pages/HomePage.test.tsx`
- Verify: `src/styles/global.css`
- Verify: `tests/e2e/home-page.spec.ts`
- Verify: `dist/images/home-hero-chinese-elements.webp` after build

- [ ] **Step 1: Re-run the source/runtime identity and production-tree safety checks**

Run:

```bash
SOURCE=.superpowers/brainstorm/7077-1785914601/content/chinese-elements-clean.png
ASSET=public/images/home-hero-chinese-elements.webp
SOURCE_SHA=0082532b0ebc44c4e1805dd36411e4f96b5c6d5d8cd12922c1c74a1ee1dcf8ff
WEBP_INFO="$(webpinfo -summary "$ASSET")"

test "$(shasum -a 256 "$SOURCE" | awk '{print $1}')" = "$SOURCE_SHA"
test "$(stat -f%z "$ASSET")" -le 350000
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Width:[[:space:]]+1318'
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Height:[[:space:]]+1226'
printf '%s\n' "$WEBP_INFO" | grep -Eq 'Alpha:[[:space:]]+0'
test "$(git ls-files '*home-hero-chinese-elements*')" = 'public/images/home-hero-chinese-elements.webp'
test -z "$(git ls-files '*chinese-elements-clean.png' '*中国元素 2.png')"
```

Expected: all checks succeed; only the opaque WebP runtime derivative is tracked, it is not upscaled, and neither source filename is tracked.

- [ ] **Step 2: Run the focused Home unit suite and then all Vitest tests**

Run:

```bash
npm run test -- --run src/pages/HomePage.test.tsx
npm run test -- --run
```

Expected: **PASS** for the complete Home file and full Vitest suite. The second command must not be replaced with watch mode.

- [ ] **Step 3: Run repository lint**

Run:

```bash
npm run lint
```

Expected: **PASS** with no oxlint diagnostics.

- [ ] **Step 4: Build production output and verify the exact local asset is shipped**

Run:

```bash
npm run build
test -f dist/images/home-hero-chinese-elements.webp
cmp public/images/home-hero-chinese-elements.webp dist/images/home-hero-chinese-elements.webp
rg -n '/images/home-hero-chinese-elements\.webp' dist

SOURCE_SHA=0082532b0ebc44c4e1805dd36411e4f96b5c6d5d8cd12922c1c74a1ee1dcf8ff
if find public dist -type f -exec shasum -a 256 {} \; | grep -q "^$SOURCE_SHA "; then
  echo 'Approved source PNG was copied into production output' >&2
  exit 1
fi
```

Expected: **PASS**; Vite copies the runtime WebP byte-for-byte to `dist/images`, built JavaScript references the root-relative local URL, and no file in `public` or `dist` matches the source PNG checksum. The existing hero CSS gradient remains in the build, so a missing image would leave readable title, slogan, and controls rather than changing layout.

- [ ] **Step 5: Re-run the focused Home Playwright file**

Run:

```bash
npm run test:e2e -- tests/e2e/home-page.spec.ts
```

Expected: **PASS** at desktop `1440`, tablet `1024`, mobile `390`, and mobile `320`; no viewport gains horizontal overflow and all existing Journey Map browser assertions remain green.

- [ ] **Step 6: Scan the final source/test surface for obsolete or forbidden implementation paths**

Run:

```bash
if rg -n 'HomeHeroScrollScene|home-hero__scroll-|data-home-hero-motif' src tests; then
  echo 'Obsolete inline-SVG implementation remains' >&2
  exit 1
fi

if rg -n 'https?://|data:image|background-removal|removeBackground' \
  src/components/HomeHeroIllustration.tsx src/pages/HomePage.tsx src/styles/global.css; then
  echo 'Unexpected remote, embedded, or background-removal path found' >&2
  exit 1
fi
```

Expected: both scans print nothing and succeed. This confirms removal of old component markup, motif CSS, and motif-detail selectors, and confirms that the new layer has no external image origin or background-separation transform.

- [ ] **Step 7: Run whitespace, patch, and final change-boundary checks**

Run:

```bash
git diff --check
git diff --check origin/main...HEAD
git status --short --branch
git diff --name-status origin/main...HEAD
git log --oneline --decorate -8
```

Expected: both diff checks print nothing; the worktree is clean after the planned commits; the implementation diff contains the runtime WebP, new component, old component deletion, `HomePage` import/mount change, Home unit-test replacement, focused CSS replacement, and Home Playwright update. There must be no changes to copy, language behavior, Journey Map data, course hierarchy, lessons, progress, or review code.

## Spec coverage self-review

- **Only supplied cultural background:** Tasks 1-3 create and mount exactly one approved local image and delete the only hand-authored hero scene.
- **Primary content unchanged:** Task 2 preserves the existing language switcher, heading, slogan JSX, state, handler, copy, and reading order; unit and browser tests assert all three remain visible.
- **Required visual anchors:** Task 3 uses centered `contain` sizing at explicit desktop/tablet/mobile scales and requires human review of four attached hero screenshots for panda face, main Great Wall curve/watchtowers, and sun.
- **Desktop/tablet/mobile treatment:** CSS values are explicit for the base, existing `1023px`, and existing `760px` branches; image opacity is `0.32`, `0.30`, and `0.28`, and the center veil strengthens as width decreases.
- **Opaque optimized local asset:** Task 1 checks the approved source hash/size/dimensions, converts without resize or masking, and proves maximum size, dimensions, and `Alpha: 0`; Task 4 repeats the checks against production output.
- **Source exclusion:** Tasks 1 and 4 stage only the WebP and use both tracked-file and checksum checks to prove the `2,169,130`-byte PNG is absent from production trees.
- **Old implementation cleanup:** Task 2 deletes `HomeHeroScrollScene` and both old unit contracts; Task 3 deletes every `.home-hero__scroll-*` rule and e2e selector; Tasks 3 and 4 run a stale-symbol scan.
- **Accessibility and interaction:** The full component code uses `aria-hidden="true"`, `alt=""`, async decoding, no controls, and no focus attributes; CSS uses `pointer-events: none`; tests lock these contracts.
- **Layout stability and fallback:** The illustration wrapper is absolute, so loading does not affect hero height; image and veil are clipped to the hero; the unchanged hero paper/gradient and normal content layer remain if the image fails.
- **No horizontal overflow:** The four-width Playwright loop checks wrapper/hero coincidence, clipping styles, and `scrollWidth === clientWidth` at `1440`, `1024`, `390`, and `320`.
- **No out-of-scope behavior:** Guardrails and final name/diff scans exclude copy, language, Journey Map, course, lesson, progress, review, external requests, runtime transforms, animation, and split-layout changes.
- **Required verification:** Task 4 runs focused Home unit tests, full Vitest, lint, production build with asset inspection, focused Home Playwright, stale-path scans, and both working-tree and branch diff checks.

## Placeholder and consistency self-review

- Every create, modify, delete, test, asset, and verification action names a current repository path and an existing script/tool.
- Every code-edit step includes the complete new or replacement block; no step delegates unspecified implementation or error handling.
- Component and selector names are consistent throughout: `HomeHeroIllustration`, `.home-hero__illustration`, `.home-hero__illustration-image`, and `.home-hero__illustration-veil`.
- The runtime URL is consistently `/images/home-hero-chinese-elements.webp`; the tracked path is consistently `public/images/home-hero-chinese-elements.webp`.
- Asset limits are consistently `1318 × 1226`, at most `350,000` bytes, and no alpha payload; no step describes transparency or background separation.
- Browser widths are consistently `1440`, `1024`, `390`, and `320`; CSS breakpoints remain the repository’s current `1023px` and `760px` branches.
- Red/green expectations are causal: the unit test fails before the component swap, and browser CSS assertions fail before the new illustration rules.

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-06-home-hero-supplied-illustration-implementation.md`.

Two execution options:

1. **Subagent-Driven (recommended):** use `superpowers:subagent-driven-development`, dispatch a fresh worker per task, and review between tasks.
2. **Inline Execution:** use `superpowers:executing-plans` and execute the tasks in batches with checkpoints.
