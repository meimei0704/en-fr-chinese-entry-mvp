# Home Culture Advice Section — Design

Date: 2026-08-16
Status: Approved by user (@Dylan, 2026-08-16)

## Problem

The homepage currently shows a hero, then a `course-series` block with two
peer entry cards (Pinyin 拼 and Journey 旅). The user wants a new section on
the homepage, placed **first** (before the Pinyin entry card), titled
**"Culture advice for travelers in China"**, containing seven parts of
travel-culture guidance.

## Requirements

1. New homepage section titled "Culture advice for travelers in China",
   placed between the hero and the `course-series` block.
2. The section is an accordion: 7 parts, collapsed by default, multiple parts
   may be open simultaneously. Keyboard- and assistive-tech-accessible.
3. Content (English is the official copy):

   - General Social Tips
   - Dining Etiquette
   - Conversation Guidelines
   - Visiting Someone's Home
   - Public Conduct and Behaviour
   - Visiting Temples & Cultural Sites
   - Number Superstitions & Symbolism

4. Bold rules:
   - General Social Tips: bold the lead-ins "For formal visits:",
     "Giving and receiving items:", "Gifts to avoid (symbolic taboos):".
   - Dining Etiquette: bold "Wait for the host:", "Chopstick rules:",
     "Toasting customs:", "Useful phrase:".
   - Number Superstitions & Symbolism: bold "8:", "6:", "4:".
5. Nested detail lines: the third General Social Tips item ("Gifts to avoid")
   has two sub-points (Clocks / White chrysanthemums); render as nested bullets.
6. Language: English is the official copy. French is a placeholder translation
   (`fr` field) to be replaced later with the user-provided official French.
   No other languages.
7. Pure additive front-end change: no route changes, no changes to existing
   course/lesson/pinyin content data.

## Data model

New file `src/content/cultureAdvice.ts`.

```ts
export interface CultureAdviceItem {
  id: string
  lead: LocalizedText  // bold lead-in (may be empty)
  body: LocalizedText  // body text after the lead
  subItems?: CultureAdviceSubItem[]
}

export interface CultureAdviceSubItem {
  id: string
  lead?: LocalizedText // optional bold lead-in
  body: LocalizedText
}

export interface CultureAdviceSection {
  id: string
  title: LocalizedText
  kind: 'numbered' | 'bulleted'
  items: CultureAdviceItem[]
}
```

- `LocalizedText` is `{ en: string; fr: string }` (existing type).
- Sections are ordered as listed in Requirements.
- `kind` controls whether items render as numbered (1./2./3.) or bulleted
  (•). General Social Tips is `numbered`; the rest are `bulleted`.
- Bold lead-ins map to `lead`; the trailing body text maps to `body`.
- Nested sub-points render under their parent item.

## Component

New component `src/components/CultureAdvice.tsx`:

- Renders the section header ("Culture advice for travelers in China")
  plus an accordion list of parts.
- Each part header is a `<button>` toggling open state; state kept in a local
  `Set<string>` of open section ids so multiple parts can be open at once.
- Each item renders: bold `lead` (if any) + `body`, and nested `subItems` as a
  sub-list with bold `lead` + `body`.
- Uses existing semantic/styling conventions (`surface-card`, `eyebrow`,
  existing accordion/`<details>` patterns if present) and the A1 tokens
  (`--radius-card`, `--shadow-card-inset`).
- Accessible: buttons expose `aria-expanded`, sections use `aria-controls`
  and linked ids; keyboard focus visible per existing `:focus-visible` rules.
- Respects `prefers-reduced-motion` for any transition.

## Wiring

- `src/pages/HomePage.tsx`: render `<CultureAdvice />` between the hero section
  and the `course-series` section, inside the existing `page-shell`/grid.
- The section is present on the home route only.

## Styling

- Reuse existing card/accordion tokens and classes where possible.
- New section-level classes namespaced as `culture-advice__*`.
- Radius/shadow via existing CSS variables; no hard-coded colors/radii for
  new surfaces beyond what the token system already allows.

## Testing

- `src/content/cultureAdvice.test.ts`: content shape (sections count = 7,
  titles match, en strings non-empty, fr placeholders present, bold lead-ins
  exactly match the approved set, numbered/bulleted kinds correct).
- `src/components/CultureAdvice.test.tsx`: renders all 7 section titles;
  collapse/expand toggles content; bold lead-ins render in `<strong>`;
  sub-items render as nested list; `aria-expanded` toggles.
- Existing `npm run build`, `npm run lint`, `npm run test` stay green.

## Acceptance criteria

- Homepage shows the Culture Advice section above the Pinyin entry card.
- Accordion works (open/close, multiple open, accessible).
- Bold rules match the approved set exactly.
- English copy matches the user-provided text verbatim.
- French placeholders present and replaceable without structural change.
- No regressions: build/lint/tests green.
