# Home Hero Chinese Background Design

## Goal
Make the homepage hero feel more distinctly "learn Chinese" by adding a background illustration built from iconic Chinese cultural elements, while keeping the hero headline, slogan, language switcher, and CTA area as the primary visual focus.

This round is a **homepage-hero-only** visual enhancement. It should create a more memorable first impression without changing routing, copy structure, lesson data, progress logic, or overall product flow.

## Current baseline
The current homepage hero in `src/pages/HomePage.tsx` / `.home-hero` in `src/styles/global.css` is centered, calm, and readable, but the decorative layer is still minimal:

- a warm paper gradient
- soft radial color glows
- a border inset
- one oversized `中文` watermark

That baseline is clean, but it does not yet deliver the richer Chinese-cultural atmosphere requested in the thread.

## Approved direction from thread
The thread converged on these decisions:

1. **Density:** use the previously preferred **B-level density** — the background should feel present and culturally recognizable, but not crowded.
2. **Composition:** do **not** use many detached icons floating independently around the hero.
3. **Unified image:** instead, the background should read as **one complete horizontal scroll-like illustration**.
4. **Style:** use an **A/B hybrid**:
   - mainly **fine line / seal-stamp / sketch-like outlines**
   - with only **small amounts of soft color backing** on selected focal motifs
5. **Mood:** the final effect should feel like a **light cultural long-scroll watermark**, not a sticker wall, tourist collage, or children’s poster.

## Core design concept
### A single horizontal long-scroll scene behind the hero
The hero background should be reworked into a continuous left-to-right composition, similar to a modernized Chinese landscape scroll.

Instead of treating the Great Wall, panda, Oriental Pearl Tower, palace roofline, calligraphy, music, tea, and food as separate badges, those motifs should be organized into **one connected scene** with a shared rhythm, horizon, and visual language.

The composition should feel like:
- one continuous illustration layer
- gently spanning the hero width
- fading behind the central content card area
- becoming more noticeable near the side edges and outer thirds

The user should feel “this is one Chinese-themed background painting” rather than “these are 12 unrelated icons.”

## Visual composition rules
### 1. Reading priority stays centered on content
The hero’s readable content remains the top priority:
- `轻松学中文` heading
- slogan text
- language switcher
- CTA / primary learning entry area

The illustration must be composed so the **center reading zone remains visually quiet**.

That means:
- highest decorative density belongs in the left / right outer areas
- the illustration can pass behind the center, but only at much lower contrast / opacity
- no dark lines, sharp corners, or saturated accents may sit directly under the main heading

### 2. One shared horizon / landscape rhythm
To avoid a fragmented result, the motifs should be tied together by one or more unifying devices:
- a continuous terrain / skyline / scroll baseline
- repeated cloud / ribbon / wind / brush curves
- consistent line thickness
- consistent blur and opacity treatment

The motifs should not look like independently placed stamps.

### 3. Cultural motifs should be embedded, not spotlighted
Each Chinese element should feel like part of the same illustration world.

Recommended first-pass motif set (approximately 10–12 embedded motifs):
- Great Wall
- panda
- Oriental Pearl Tower
- Forbidden City roofline / palace gate
- lantern
- folding fan
- calligraphy brush
- music / traditional-music cue
- tea cup
- dumpling / food accent
- Chinese knot
- bamboo leaf or auspicious cloud shape

The exact count can flex slightly during implementation if the final composition is more unified with fewer or merged motifs.

### 4. Style: line-first, color-second
The visual language should be primarily:
- thin or medium-thin outlines
- low-contrast strokes
- seal / sketch / refined doodle feeling
- lightly blurred and partially faded

Color should be secondary and used sparingly:
- a muted cinnabar / clay red
- a pale jade green
- a soft sky blue
- a light muted gold

Those colors should appear as small backing shapes, washes, or soft highlight zones behind selected motifs, not as strong filled icons.

## Layout and responsive behavior
### Desktop / wide screens
- The long-scroll illustration can span nearly the full hero width.
- Left and right zones should carry most of the visible structure.
- The central content area should sit on top of the calmest part of the illustration.

### Tablet
- The same composition should remain recognizable, but outer motifs may need to shift inward slightly.
- Decorative complexity should reduce before it starts competing with the centered content.

### Mobile
- The hero must still feel decorated, but the illustration should simplify aggressively.
- Fewer visible motifs are acceptable on narrow screens if the composition still reads as one continuous background scene.
- The background should never make the title or slogan harder to read at 320px width.

## Implementation intent
This design should be implemented with a **lightweight, maintainable decorative layer**, not with heavy assets.

Preferred implementation direction:
- keep the existing hero structure in `src/pages/HomePage.tsx`
- add one dedicated decorative wrapper or illustration layer for the hero background
- render the long-scroll scene as **inline SVG and/or CSS-assisted decorative shapes**
- keep it `aria-hidden`
- avoid external image dependencies
- avoid animation-heavy or resource-heavy treatments

This should remain a presentation-only change.

## Explicit boundaries
### In scope
- homepage hero decorative background only
- new unified long-scroll illustration layer
- CSS updates needed to support layering, opacity, blur, positioning, and responsive behavior
- small markup additions in `HomePage.tsx` if needed for the decorative layer
- test updates only if hero structure or accessible querying needs to acknowledge the new decorative container

### Out of scope
- changing hero copy or information architecture
- adding separate clickable decorative items
- adding heavy bitmap illustration assets
- changing lesson grid / journey map behavior
- changing routing, progress, content schema, or data logic
- introducing animation as a primary part of the effect

## Accessibility and performance requirements
- The decorative illustration must be **non-interactive** and `aria-hidden`.
- It must not create noisy accessible text or extra focus targets.
- Heading and slogan contrast must remain strong.
- The effect should remain lightweight enough that the homepage still loads and paints quickly.
- The background must degrade gracefully if blur or advanced rendering is limited.

## Acceptance criteria
The design is successful when:

1. The homepage hero clearly feels more Chinese-culturally distinctive than the current version.
2. The background reads as **one complete horizontal illustration**, not many separate scattered icons.
3. The central hero title / slogan area is still the first thing the eye lands on.
4. The visual tone remains **elegant, soft, and product-like**, not busy or childish.
5. Mobile and desktop both preserve readability and compositional unity.
6. The implementation remains lightweight and maintainable.

## Reviewer focus
When this goes to implementation and review, the reviewer should especially check:
- whether the composition really reads as one picture
- whether any motif still feels isolated or pasted on
- whether the background steals attention from the main hero content
- whether responsiveness simplifies the scene cleanly on small screens
- whether the chosen implementation is easy to extend or prune later

## Likely implementation touchpoints
Expected implementation is likely to involve:
- `src/pages/HomePage.tsx`
- `src/styles/global.css`
- `src/pages/HomePage.test.tsx`
- possibly a focused homepage visual smoke / e2e check if the DOM contract changes enough to justify it

## Suggested verification after implementation
- `npm run test -- --run src/pages/HomePage.test.tsx`
- broader relevant UI regression tests if markup changes affect shared layout behavior
- `npm run build`
- manual visual check at mobile and desktop widths
- explicit check that the hero remains readable and visually centered
