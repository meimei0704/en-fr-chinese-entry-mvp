# UI Style Refresh Design — Chinese Entry MVP

## Goal
Make the Chinese learning MVP feel more polished, memorable, and motivating without changing the product scope or lesson data model. The new style should combine:

- **A: 清新东方** — warm paper, ink, cinnabar, jade accents, subtle Chinese-learning identity.
- **B: 明亮学习产品** — rounded cards, progress cues, friendly badges, clear practice affordances.

The result should feel like a modern language-learning product with a light Chinese cultural signature, not a heavy traditional theme.

## Current UI baseline
The app is currently simple and functional:

- One centered white `hero-card` pattern across most pages.
- Blue accent links and light blue card borders.
- Many page sections use inline styles.
- Home, lesson, practice, review, and progress pages share the same visual weight, so the learning flow does not yet feel layered or premium.

This refresh should primarily improve the shared visual system and component presentation. It should not alter routing, persistence, lesson schema, speech behavior, or content ownership.

## Recommended direction: Modern learning cards with light Chinese identity

### Visual mood
- Warm, calm, and inviting: “modern Chinese study notebook”.
- Friendly enough for beginners: visible progress, approachable cards, obvious next actions.
- Distinct from generic SaaS: subtle use of hanzi display blocks, seal-red accents, jade-green highlights, and paper-like backgrounds.

### Palette
Use CSS tokens so the app can be tuned without rewriting components.

| Token | Purpose | Suggested value |
| --- | --- | --- |
| `--color-bg` | app background | `#fff7ed` warm paper |
| `--color-surface` | main cards | `#fffdf8` |
| `--color-ink` | primary text | `#1f1a17` |
| `--color-muted` | secondary text | `#6f6258` |
| `--color-border` | soft borders | `#eadccd` |
| `--color-cinnabar` | primary CTA / key accents | `#c2412d` |
| `--color-cinnabar-dark` | CTA hover | `#9f2f21` |
| `--color-jade` | secondary accent / success | `#2f8f6b` |
| `--color-sky` | learning/progress accent | `#2f6fba` |
| `--color-gold` | small badges / warmth | `#d99a2b` |

Background can use a very subtle radial gradient: warm paper base + light jade/sky glow near the top. Avoid saturated full-page gradients.

### Typography
- Keep system fonts for reliability, but tune hierarchy:
  - Page title: large, high-contrast, slightly tighter tracking.
  - Hanzi display: larger and more calligraphic-feeling through size/weight/spacing, not custom font dependency.
  - Pinyin: small uppercase/mono-like rhythm, colored with sky/jade.
- Avoid adding external font loading for this iteration; keep performance and build simple.

## Page-level design

### 1. Language selection / first screen
Purpose: make the product promise immediately clear.

Layout:
- Two-column hero on desktop; stacked on mobile.
- Left: product promise, short explanation, language selector, primary CTA.
- Right: a “phrase card” showing:
  - `你好`
  - `nǐ hǎo`
  - English/French meaning depending on selected UI language.
- Add small trust/progress chips such as “English/French explanations”, “Real situations”, “Listen & repeat”.

CTA style:
- Primary button in cinnabar.
- Secondary actions in warm outline / ghost style.

### 2. Home page
Purpose: show learning path and motivate continuation.

Layout:
- Top hero summary card with:
  - “Continue your next useful Chinese moment” style message.
  - Continue button, Review button, Progress button.
  - Compact progress strip: lessons count, review queue count, last lesson if available.
- Lesson list becomes a responsive card grid on desktop and single column on mobile.

Lesson card style:
- Warm surface card, rounded corners, soft shadow.
- Small scenario badge: e.g. “Intro”, “Restaurant”, “Metro”.
- One visible mini phrase from the lesson if available.
- Clear primary “Open lesson” action.

### 3. Lesson page
Purpose: make dense lesson content easier to scan.

Layout:
- Lesson header card with title, scenario, language toggle, and a “what you’ll learn” summary.
- Content becomes section cards with consistent classes instead of repeated inline styles.
- Use visual hierarchy:
  - Dialogue cards feel conversational.
  - Sentence pattern cards feel like reusable formulas.
  - Vocabulary cards feel compact and scannable.
  - Pronunciation and hanzi recognition stay supportive, not dominant.

Dialogue card style:
- Speaker chip at top.
- Hanzi large and ink-colored.
- Pinyin below in sky/jade.
- Translation in muted text.
- Listen button as compact pill with icon-like styling.

### 4. Practice page
Purpose: make exercises feel active and less like static text.

Layout:
- Checklist becomes a horizontal/stacked progress module.
- Listening / speaking / reading cards get distinct icon chips or labels.
- Answers should be clearly separated from prompts.

Style:
- Use jade for completion/success states.
- Keep feedback self-check simple; do not add scoring yet.

### 5. Review page
Purpose: make flashcard review feel like a focused action.

Layout:
- One prominent flashcard centered inside the shared app shell.
- Front/back sections separated visually.
- Primary “Mark complete” button prominent.
- If queue is empty, use celebratory but calm empty state.

Style:
- Flashcard can use a slightly deeper border/shadow than ordinary cards.
- Finished count uses jade success chip.

### 6. Progress page
Purpose: give users a simple sense of momentum.

Layout:
- Progress summary card with completed lessons count.
- Simple progress bar based on completed / total lessons.
- Current lesson and review queue shown as two stat cards.

Style:
- Use sky for learning progress and jade for completed/success.

## Component system

Create or standardize shared CSS classes first, then apply them page by page.

Recommended classes:

- Layout:
  - `.app-shell`
  - `.page-shell`
  - `.page-grid`
  - `.section-stack`
- Cards:
  - `.surface-card`
  - `.hero-card`
  - `.lesson-card`
  - `.dialogue-card`
  - `.practice-card`
  - `.review-card`
  - `.stat-card`
- Text:
  - `.eyebrow`
  - `.lede`
  - `.hanzi-display`
  - `.pinyin-line`
  - `.muted-text`
- Actions:
  - `.primary-button`
  - `.secondary-link`
  - `.chip-button`
  - `.button-row`
- Badges/chips:
  - `.badge`
  - `.badge--jade`
  - `.badge--sky`
  - `.badge--gold`
  - `.success-chip`
- Utilities:
  - `.progress-bar`
  - `.progress-bar__fill`
  - `.divider`

Avoid broad inline style rewrites in future feature work. The UI pass should move repeated inline presentation into shared CSS where practical.

## Implementation boundaries

In scope:
- `src/styles/global.css` visual system refresh.
- Component className updates in page/component files.
- Small presentational helper markup where it improves layout, badges, or progress display.
- Tests updated only if accessible names or visible text intentionally change.

Out of scope:
- Changing routing or navigation flow.
- Changing lesson content schema.
- Adding backend/auth/CMS.
- Adding external design libraries or icon packages.
- Adding heavy animation, custom fonts, or image generation dependency.
- Changing browser TTS behavior.

## Accessibility and responsive requirements

- Keep all interactive elements keyboard accessible.
- Maintain semantic `main`, `section`, `article`, `nav`, and headings.
- Color contrast must remain readable on warm backgrounds.
- Mobile layout must remain single-column and comfortable at 320px width.
- Hover effects should not be the only cue.
- Respect `prefers-reduced-motion` by keeping transitions subtle and nonessential.

## Acceptance criteria

- The app visually reads as one coherent product, not separate default cards.
- Homepage has a stronger hero and clearer learning path.
- Lesson pages are easier to scan because dialogue, patterns, vocabulary, and practice sections have distinct card treatments.
- Review page feels like a flashcard interaction.
- Progress page includes a visible progress cue.
- Existing tests still pass after UI changes.
- Production build passes.

## Suggested verification

After implementation:

1. Focused component/page tests likely touched by UI markup:
   - `src/app/AppShell.test.tsx`
   - `src/pages/HomePage.test.tsx`
   - `src/pages/LessonPage.test.tsx`
   - `src/pages/PracticePage.test.tsx`
   - `src/pages/ProgressPage.test.tsx`
   - `src/pages/ReviewPage.test.tsx`
2. Full test suite:
   - `npm run test -- --run`
3. Build:
   - `npm run build`
4. Manual visual smoke:
   - language selection
   - home
   - one lesson page
   - practice
   - review
   - progress
   - mobile width check
