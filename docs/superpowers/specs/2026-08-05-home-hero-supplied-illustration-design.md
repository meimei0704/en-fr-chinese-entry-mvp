# Home Hero Supplied Illustration Design

**Date:** 2026-08-05
**Status:** User-approved design, pending written-spec re-review
**Loop task:** #t46

## Summary

Replace the current hand-authored inline SVG Home hero scene with the user's clean Chinese-elements illustration. Use the approved **A · centered background wash** treatment: one centered decorative image, reduced opacity, and a paper-colored center veil that keeps the title and slogan as the primary visual focus.

This is an independent Home hero change. It does not include the separate #t45 course-series hierarchy and copy work.

## Approved Source Asset

- Loop attachment: `att_mvafm7v0u5q8w9`
- Source filename: `中国元素 2.png`
- Format: PNG
- Dimensions: `1318 × 1226`
- Pixel format: RGBA container, but the alpha plane is uniformly `255` (the image is fully opaque)
- Source size: `2,169,130` bytes
- SHA-256: `0082532b0ebc44c4e1805dd36411e4f96b5c6d5d8cd12922c1c74a1ee1dcf8ff`
- Visual content: panda, Great Wall, bamboo, mountains, clouds, sun, birds, and decorative seals in a jade/gold/paper palette
- Watermark review: the previously visible `豆包AI生成` watermark is not present in this replacement asset

The user supplied this clean replacement specifically for project use. The original PNG remains the design source and is not shipped as the production runtime asset.

## Current State

Home currently renders one `HomeHeroScrollScene` component behind the centered title. That component contains a large inline SVG with hand-authored Great Wall, palace, panda, Oriental Pearl Tower, lantern, fan, bamboo, cloud, and center-veil groups. CSS separately styles each SVG motif and applies responsive reductions.

The current solution is accessible and lightweight, but it no longer matches the user's selected illustration. Keeping both layers would create a visually noisy double composition and unnecessary DOM/CSS complexity.

## Goals

1. Use the approved supplied illustration as the only Home hero cultural background.
2. Preserve the current centered hero title, slogan, language switcher, height, and interaction.
3. Keep `轻松学中文` and its localized slogan more visually prominent than the illustration.
4. Preserve recognizable panda, Great Wall, and sun anchors across desktop, tablet, 390 px, and 320 px layouts.
5. Ship a substantially smaller opaque runtime asset rather than the 2.17 MB source PNG.
6. Remove the obsolete inline SVG markup, motif CSS, and motif-specific tests.

## Non-goals

- No changes to Home hero copy or language behavior.
- No changes to Journey Map, course hierarchy, lessons, progress, or review behavior.
- No parallax, animation, drag, zoom, or other new interaction.
- No external CDN or third-party image request.
- No attempt to reconstruct, remove, hide, or crop a watermark from the earlier asset.
- No redesign of the Home hero into a left-copy/right-image layout.

## Selected Visual Treatment

The selected direction is **A · centered background wash**.

### Desktop

- Keep the existing centered text composition.
- Center the illustration within the hero and size it to approximately `135–145%` of the hero height.
- Use `object-fit: contain` so the complete circular composition is preserved before the hero's own rounded clipping.
- Allow only light clipping of outer bamboo, off-white paper margins, and decorative edges.
- Keep panda, main Great Wall path, watchtowers, and sun visible.
- Apply an image opacity between `0.30` and `0.36`.
- Place an elliptical paper-colored veil above the image and below the content. The veil is strongest behind the title and fades before the major side motifs.

### Tablet

- Keep the same centered anchor and title position.
- Reduce image opacity to approximately `0.28–0.32`.
- Use a slightly smaller image scale than desktop when needed to retain the panda and sun simultaneously.
- Increase center-veil strength enough to preserve text contrast without flattening the whole illustration.

### Mobile at 390 px and 320 px

- Keep the image centered; do not switch to a different DOM or illustration.
- Permit clipping of the farthest bamboo leaves, off-white paper margins, and minor decorative seals.
- Preserve the panda face, main Great Wall curve, and sun.
- Keep image opacity at or below the tablet value and strengthen the center veil.
- Clip the image inside the hero; the page must not gain horizontal overflow.
- Keep the language switcher, title, and slogan in their current reading order.

## Component and DOM Design

Replace `HomeHeroScrollScene` with a focused `HomeHeroIllustration` component.

The component owns only the decorative media layer:

```tsx
<div className="home-hero__illustration" aria-hidden="true">
  <img
    className="home-hero__illustration-image"
    src="/images/home-hero-chinese-elements.webp"
    alt=""
    decoding="async"
  />
  <span className="home-hero__illustration-veil" />
</div>
```

`HomePage` mounts exactly one `HomeHeroIllustration` immediately inside the Home hero, before the language switcher and text content. The image and veil are non-interactive and cannot receive focus.

The component does not contain cultural labels, captions, or copy because the illustration is decorative rather than required content.

## Asset Pipeline

Create one opaque WebP runtime derivative:

- Output: `public/images/home-hero-chinese-elements.webp`
- Maximum output dimensions: the supplied `1318 × 1226`; do not upscale
- Alpha behavior: the source PNG's RGBA container has no translucent pixels, so the derivative intentionally carries no alpha payload; do not add a background-removal or masking transform
- Target file size: `≤ 350 KB`
- Quality: visually preserve panda facial features, wall edges, bamboo leaves, and gold linework at the hero's rendered size

A fresh direct `cwebp -q 82` conversion of the approved attachment produced a `109,028` byte WebP in the planning environment, and `webpinfo` reported `VP8 Alpha: 0`. This is reference evidence that the size target and opaque output are feasible, not a requirement to reproduce that exact byte count across encoder versions.

Do not place the 2.17 MB source PNG in `public/` or otherwise include it in the production bundle. Record the attachment ID and checksum in this spec so the approved source remains identifiable.

The runtime image is local, immutable repository content. No new dependency or runtime conversion service is introduced.

## CSS Design

### Layer order

1. Existing hero paper/gradient background
2. New illustration image
3. New center veil
4. Existing language switcher and hero content

The illustration wrapper is absolute, fills the hero, clips to the hero boundary, and uses `pointer-events: none`. The content and language switcher retain a higher stacking context.

The asset retains its off-white rectangular paper canvas. Reduced opacity is applied to the complete image layer, allowing that paper tone to blend with the existing hero paper/gradient background; the center veil then restores local contrast behind the title. The implementation must not attempt to infer transparency, remove the background, or mask white panda/cloud details.

### Replacement cleanup

Remove all CSS rules whose only consumer is the old inline SVG, including:

- `.home-hero__scroll-scene`
- `.home-hero__scroll-svg`
- `.home-hero__scroll-track`
- `.home-hero__scroll-clouds`
- `.home-hero__scroll-motifs`
- `.home-hero__scroll-motif*`
- `.home-hero__scroll-wash*`
- `.home-hero__scroll-ink-fill`
- `.home-hero__scroll-paper-dot`
- `.home-hero__scroll-center-veil`

Replace them with the three focused illustration selectors shown in the DOM design. Update the existing 1023 px and 760 px media-query branches to target the new image and veil.

### Layout stability

The wrapper is removed from normal flow, so image loading cannot change hero height or move the title. The existing hero gradient remains visible if the image fails to load.

## Accessibility

- The wrapper is `aria-hidden="true"`.
- The image uses `alt=""`.
- The image and veil are not links or controls and do not receive focus.
- The Home hero keeps its existing accessible label and heading structure.
- Cultural motifs are not announced because they do not convey information required to use the page.
- Language selection continues to update the slogan without changing the decorative layer.

## Performance

- Runtime image must be `≤ 350 KB`.
- No 2.17 MB PNG is shipped to browsers.
- No external network origin is added.
- Image decoding is asynchronous and the absolute layer has no layout impact.
- Production build output must reference the local optimized asset successfully.

## Error and Fallback Behavior

There is no new application state or request error path. If the runtime image fails:

- the hero's existing CSS paper/gradient background remains;
- title, slogan, and language controls remain visible and usable;
- no broken-image icon appears in the reading order because the image is decorative with an empty alternative.

## Test Design

### Home component tests

Replace the old inline-SVG and vector-detail contracts with tests that assert:

- exactly one `.home-hero__illustration` exists;
- it is `aria-hidden="true"`;
- it contains exactly one `img.home-hero__illustration-image`;
- the image has `alt=""` and the approved local WebP source;
- exactly one `.home-hero__illustration-veil` exists;
- no `svg.home-hero__scroll-svg` or old scroll-scene element remains;
- the hero title and current-language slogan remain visible.

### Browser test

At `1440`, `1024`, `390`, and `320` px widths:

- the hero illustration image is visible;
- the hero title and slogan are visible;
- the image remains clipped within the hero bounds;
- document `scrollWidth` equals `clientWidth`;
- the panda/Great Wall composition remains materially visible through visual evidence at desktop and mobile sizes.

### Build and asset checks

- Confirm the WebP exists, is `≤ 350 KB`, is no larger than `1318 × 1226`, and carries no alpha payload (`VP8 Alpha: 0` or equivalent encoder metadata).
- Confirm the source PNG is not shipped in `public/` and no background-removal transform or runtime service is introduced.
- Run Home unit tests, full Vitest, lint, production build, Home Playwright, and `git diff --check`.

## Implementation Outline

1. Add failing Home DOM tests for the new single-image decorative contract.
2. Produce and verify the optimized opaque WebP asset directly from the approved PNG, without background removal.
3. Add `HomeHeroIllustration`, mount it, and delete `HomeHeroScrollScene`.
4. Replace old SVG CSS with centered-image and veil CSS.
5. Update responsive CSS and browser assertions for all four viewport widths.
6. Run full verification and capture desktop/mobile review images.

## Acceptance Criteria

1. The clean user-supplied composition is the only Home hero cultural illustration.
2. The old inline SVG component, markup, CSS, and motif-detail tests are removed.
3. Desktop and tablet retain the centered title with a recognizable full illustration behind it.
4. At 390 px and 320 px, panda face, main Great Wall curve, and sun remain visible while outer decorative edges may crop.
5. Title, slogan, and language switcher remain more prominent than the illustration and keep their current behavior.
6. The runtime asset is a local opaque WebP, not upscaled, and `≤ 350 KB`; it retains the source's off-white paper canvas, carries no alpha payload, and the original 2.17 MB PNG is not shipped.
7. The image layer is decorative, non-interactive, and accessibility-safe.
8. No tested viewport gains horizontal overflow, and Home unit, full Vitest, lint, build, Home Playwright, and `git diff --check` all pass.
