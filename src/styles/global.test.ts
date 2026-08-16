import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8')

function cssVariable(name: string) {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) {
    throw new Error(`Missing CSS variable ${name}`)
  }
  return match[1]
}

function relativeLuminance(hex: string) {
  const [red, green, blue] = [0, 2, 4]
    .map((offset) => Number.parseInt(hex.slice(1 + offset, 3 + offset), 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )

  return (lighter + 0.05) / (darker + 0.05)
}

function ruleBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escapedSelector}\\s*{([\\s\\S]*?)}`))
  if (!match) {
    throw new Error(`Missing CSS rule ${selector}`)
  }
  return match[1]
}

function hasRule(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|\\n)\\s*${escapedSelector}\\s*{`, 'm').test(css)
}

function hasRuleWithDeclaration(selector: string, declaration: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedDeclaration = declaration.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(
    `(^|\\n)\\s*${escapedSelector}\\s*{[^}]*${escapedDeclaration}`,
    'm',
  ).test(css)
}

function mediaBlock(query: string) {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`@media\\s*${escapedQuery}\\s*{`).exec(css)
  if (!match) {
    throw new Error(`Missing CSS media query ${query}`)
  }

  const openingBrace = match.index + match[0].lastIndexOf('{')
  let depth = 1
  for (let index = openingBrace + 1; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1
    if (css[index] === '}') depth -= 1
    if (depth === 0) return css.slice(openingBrace + 1, index)
  }

  throw new Error(`Unclosed CSS media query ${query}`)
}

function hasMediaRuleWithDeclaration(query: string, selector: string, declaration: string) {
  const rules = mediaBlock(query).matchAll(/([^{}]+)\{([^{}]*)}/g)

  for (const rule of rules) {
    const selectors = rule[1].split(',').map((candidate) => candidate.trim())
    if (selectors.includes(selector) && rule[2].includes(declaration)) {
      return true
    }
  }

  return false
}

function backgroundVariableFor(selector: string) {
  const match = ruleBlock(selector).match(/background:\s*var\((--[a-z-]+)\)/)
  if (!match) {
    throw new Error(`Missing background variable for ${selector}`)
  }
  return match[1]
}

describe('global color accessibility tokens', () => {
  it('keeps text-facing accent tokens readable on white and tinted surfaces', () => {
    const muted = cssVariable('--color-muted')
    const skyInk = cssVariable('--color-sky-ink')
    const jadeInk = cssVariable('--color-jade-ink')
    const cinnabarDark = cssVariable('--color-cinnabar-dark')

    expect(contrastRatio(muted, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(muted, '#f7f8fb')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(muted, '#eef4ff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(muted, '#ebf6f1')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(skyInk, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(skyInk, '#eef4ff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(jadeInk, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(cinnabarDark, '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps small current-step markers readable against their accent fill', () => {
    const currentStepBackground = cssVariable(
      backgroundVariableFor('.lesson-progress-preview__rail li.is-current span'),
    )

    expect(contrastRatio('#ffffff', currentStepBackground)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps Home-only journey card polish scoped away from Progress journey nodes', () => {
    const homeScopedSelectors = [
      ['.journey-map .journey-node .muted-text', 'line-height: 1.5;'],
      ['.journey-map .journey-node__cta', 'margin-top: auto;'],
      ['.journey-map .journey-node--preview .journey-node__cta', 'color: var(--color-cinnabar-dark);'],
      ['.journey-map .journey-node--lesson', 'box-shadow: 0 18px 44px -34px rgba(67, 40, 20, 0.32);'],
      ['.journey-map .journey-node--preview', 'box-shadow: 0 18px 44px -34px rgba(67, 40, 20, 0.32);'],
    ]
    const leakedProgressSelectors = [
      ['.journey-node .muted-text', 'line-height: 1.5;'],
      ['.journey-node__cta', 'margin-top: auto;'],
      ['.journey-node--preview .journey-node__cta', 'color: var(--color-cinnabar-dark);'],
      ['.journey-node--lesson', 'box-shadow: 0 18px 44px -34px rgba(67, 40, 20, 0.32);'],
      ['.journey-node--preview', 'box-shadow: 0 18px 44px -34px rgba(67, 40, 20, 0.32);'],
    ]

    for (const [selector, declaration] of homeScopedSelectors) {
      expect(hasRule(selector)).toBe(true)
      expect(hasRuleWithDeclaration(selector, declaration)).toBe(true)
    }

    for (const [selector, declaration] of leakedProgressSelectors) {
      expect(hasRuleWithDeclaration(selector, declaration)).toBe(false)
    }
  })

  it('keeps the original Progress journey CTA pill baseline while Home polish stays scoped', () => {
    const progressBaselineSelectors = [
      ['.progress-journey-card .journey-node__cta', 'padding: 0.5rem 0.85rem;'],
      ['.progress-journey-card .journey-node__cta', 'border-radius: 999px;'],
      ['.progress-journey-card .journey-node__cta', 'background: rgba(238, 244, 255, 0.9);'],
      ['.progress-journey-card .journey-node--preview .journey-node__cta', 'background: rgba(255, 244, 230, 0.92);'],
      ['.progress-journey-card .journey-node--preview .journey-node__cta', 'border-color: rgba(194, 65, 45, 0.16);'],
      ['.progress-journey-card .journey-node .muted-text', 'margin-top: 0.45rem;'],
      ['.progress-journey-card .journey-node .muted-text', 'color: var(--color-ink-soft);'],
      ['.progress-journey-card .journey-node .muted-text', 'line-height: 1.55;'],
      ['.progress-journey-card .journey-node', 'box-shadow: 0 18px 44px -34px rgba(67, 40, 20, 0.35);'],
    ]

    for (const [selector, declaration] of progressBaselineSelectors) {
      expect(hasRule(selector)).toBe(true)
      expect(hasRuleWithDeclaration(selector, declaration)).toBe(true)
    }
  })

  it('uses content-driven shared rows with stretched wrappers, anchors, and atomic titles', () => {
    const list = ruleBlock('.course-series__list')
    const panel = ruleBlock('.course-series__panel')
    const pinyinPanel = ruleBlock('.course-series__panel--pinyin')
    const journeyPanel = ruleBlock('.course-series__panel--journey')
    const entryCard = ruleBlock('.course-series__entry-card')
    const title = ruleBlock('.course-series__title')
    const token = ruleBlock('.course-series__title-token')
    const journeyPath = ruleBlock('.course-series__journey-path')

    expect(list).toContain('grid-template-columns: minmax(0, 1fr);')
    expect(list).toContain('grid-template-rows: repeat(2, minmax(auto, 1fr)) auto;')
    expect(list).toContain('align-items: stretch;')

    expect(panel).toContain('align-self: stretch;')
    expect(panel).toContain('align-content: stretch;')
    expect(panel).toContain('padding: 0;')
    expect(panel).toContain('border: 0;')
    expect(panel).toContain('background: none;')
    expect(panel).toContain('box-shadow: none;')
    expect(panel).toContain('overflow: visible;')
    expect(panel).not.toContain('align-content: start;')

    expect(pinyinPanel).toContain('grid-row: 1;')
    expect(pinyinPanel).toContain('display: grid;')
    expect(pinyinPanel).toContain('grid-template-rows: minmax(0, 1fr);')
    expect(pinyinPanel).not.toContain('background:')
    expect(journeyPanel).toContain('grid-row: 2 / span 2;')
    expect(journeyPanel).toContain('display: grid;')
    expect(journeyPanel).toContain('grid-template-rows: subgrid;')
    expect(journeyPanel).not.toContain('background:')
    expect(journeyPanel).not.toContain('overflow: hidden;')

    expect(entryCard).toContain('min-width: 0;')
    expect(entryCard).toContain('min-height: 0;')
    expect(entryCard).toContain(
      '--course-series-entry-icon-size: clamp(2.25rem, 10vw, 3rem);',
    )
    expect(entryCard).toContain('align-self: stretch;')
    expect(entryCard).toContain('justify-self: stretch;')
    expect(entryCard).toContain('text-decoration: none;')
    expect(entryCard).toContain('border-radius: var(--radius-lg);')
    expect(ruleBlock('.course-series__entry-card:focus-visible')).toContain(
      'outline: 3px solid rgba(47, 111, 186, 0.5);',
    )
    expect(ruleBlock('.course-series__entry-card:focus-visible')).toContain('outline-offset: 3px;')

    for (const selector of [
      '.course-series__entry-card',
      '.course-series__pinyin-link',
      '.course-series__journey-link',
    ]) {
      const block = ruleBlock(selector)
      const minHeight = block.match(/min-height:\s*([^;]+);/)?.[1].trim()

      expect(block).not.toMatch(/(^|\n)\s*height\s*:/)
      expect(minHeight === undefined || minHeight === '0').toBe(true)
      expect(block).not.toContain('max-height:')
      expect(block).not.toMatch(/overflow:\s*(?:hidden|clip)/)
      expect(block).not.toContain('line-clamp:')
      expect(block).not.toContain('text-overflow:')
    }

    expect(title).toContain('white-space: normal;')
    expect(title).toContain('overflow-wrap: normal;')
    expect(title).toContain('word-break: normal;')
    expect(title).toContain('hyphens: none;')
    expect(token).toContain('display: inline-block;')
    expect(token).toContain('white-space: nowrap;')

    expect(journeyPath).toContain('display: grid;')
    expect(journeyPath).toContain('align-content: start;')
    expect(journeyPath).toContain('overflow: hidden;')
    expect(journeyPath).toContain('scroll-margin-block-start: 1rem;')
    expect(hasRule('.course-series__panel-header')).toBe(false)
    expect(hasRule('.journey-map__intro')).toBe(false)

    expect(
      hasMediaRuleWithDeclaration(
        '(prefers-reduced-motion: reduce)',
        '.course-series__pinyin-link',
        'transition: none;',
      ),
    ).toBe(true)
    expect(
      hasMediaRuleWithDeclaration(
        '(prefers-reduced-motion: reduce)',
        '.course-series__journey-link',
        'transition: none;',
      ),
    ).toBe(true)
    expect(
      hasMediaRuleWithDeclaration(
        '(max-width: 760px)',
        '.journey-map__path',
        'grid-template-columns: 1fr;',
      ),
    ).toBe(true)
    expect(
      hasMediaRuleWithDeclaration(
        '(max-width: 760px)',
        '.progress-journey-map__path',
        'grid-template-columns: 1fr;',
      ),
    ).toBe(true)
    expect(
      hasMediaRuleWithDeclaration(
        '(max-width: 760px)',
        '.progress-course-series .progress-list-card__header',
        'display: grid;',
      ),
    ).toBe(false)
  })

  it('keeps the shared speech button as a small circular icon control with interaction states', () => {
    const speechButtonDeclarations = [
      ['.speech-button', 'width: 2.35rem;'],
      ['.speech-button', 'min-height: 2.35rem;'],
      ['.speech-button', 'padding: 0;'],
      ['.speech-button', 'border-radius: 999px;'],
      ['.speech-button__icon', 'width: 1.05rem;'],
      ['.speech-button:hover:not(:disabled)', 'transform: translateY(-1px);'],
      ['.speech-button:active:not(:disabled)', 'transform: translateY(0);'],
      ['.speech-button:disabled', 'cursor: not-allowed;'],
    ]

    for (const [selector, declaration] of speechButtonDeclarations) {
      expect(hasRule(selector)).toBe(true)
      expect(hasRuleWithDeclaration(selector, declaration)).toBe(true)
    }
  })

  it('keeps the Home hero Chinese title spacious instead of tightly tracked', () => {
    const titleRule = ruleBlock('.home-hero__title')

    expect(titleRule).toContain('font-weight: 760;')
    expect(titleRule).toContain('line-height: 1.1;')
    expect(titleRule).toContain('letter-spacing: 0.02em;')
    expect(titleRule).not.toContain('letter-spacing: -0.07em;')
    expect(hasRuleWithDeclaration('.home-hero__title', 'font-size: clamp(2.7rem, 15vw, 3.75rem);'))
      .toBe(true)
    expect(hasRuleWithDeclaration('.home-hero__title', 'letter-spacing: 0.01em;')).toBe(true)
  })

  it('shows shared button disabled states instead of preserving hover affordance', () => {
    const sharedButtonDeclarations = [
      ['.option-button:hover:not(:disabled),\n.primary-button:hover:not(:disabled),\n.secondary-button:hover:not(:disabled),\n.secondary-link:hover:not(:disabled),\n.chip-button:hover:not(:disabled)', 'transform: translateY(-1px);'],
      ['.option-button:disabled,\n.primary-button:disabled,\n.secondary-button:disabled,\n.secondary-link:disabled,\n.chip-button:disabled', 'cursor: not-allowed;'],
      ['.option-button:disabled,\n.primary-button:disabled,\n.secondary-button:disabled,\n.secondary-link:disabled,\n.chip-button:disabled', 'opacity: 0.55;'],
    ]

    for (const [selector, declaration] of sharedButtonDeclarations) {
      expect(hasRule(selector)).toBe(true)
      expect(hasRuleWithDeclaration(selector, declaration)).toBe(true)
    }
  })

  it('keeps the Lesson action dock centered without forcing full-width CTA pills', () => {
    expect(hasRuleWithDeclaration('.lesson-action-dock', 'width: fit-content;')).toBe(true)
    expect(hasRuleWithDeclaration('.lesson-action-dock', 'max-width: 100%;')).toBe(true)
    expect(hasRuleWithDeclaration('.lesson-action-dock', 'margin-inline: auto;')).toBe(true)
    expect(hasRuleWithDeclaration('.lesson-action-dock', 'box-sizing: border-box;')).toBe(true)
    expect(hasRuleWithDeclaration('.button-row.lesson-action-dock', 'justify-content: center;'))
      .toBe(true)
    expect(hasRuleWithDeclaration('.button-row.lesson-action-dock', 'align-items: center;'))
      .toBe(true)
    expect(
      hasRuleWithDeclaration(
        '.lesson-action-dock .primary-button,\n.lesson-action-dock .secondary-link',
        'width: auto;',
      ),
    ).toBe(true)
    expect(
      hasRuleWithDeclaration(
        '.lesson-action-dock .primary-button,\n.lesson-action-dock .secondary-link',
        'max-width: 100%;',
      ),
    ).toBe(true)
  })

  it('scopes compact three-layer lesson layout away from shared and admin cards', () => {
    const scoped = [
      ['.lesson-page .lesson-header-card', 'gap: clamp(0.9rem, 2vw, 1.25rem);'],
      ['.lesson-page .lesson-header-card', 'padding: clamp(1.25rem, 3vw, 2rem);'],
      ['.lesson-page .lesson-header-card__title', 'gap: 0.1rem;'],
      ['.lesson-page .lesson-progress-preview', 'gap: 0.75rem;'],
      ['.lesson-page .lesson-progress-preview', 'padding: 0.85rem;'],
      ['.lesson-page .lesson-progress-preview', 'position: sticky;'],
      ['.lesson-page .lesson-progress-preview', 'top: 0.75rem;'],
      ['.lesson-page .lesson-progress-preview', 'z-index: 5;'],
    ] as const
    for (const [selector, declaration] of scoped) {
      expect(ruleBlock(selector)).toContain(declaration)
    }

    expect(ruleBlock('.lesson-section-card')).toContain(
      'scroll-margin-block-start: clamp(4.5rem, 12vw, 6rem);',
    )

    expect(ruleBlock('.lesson-progress-preview__rail')).toContain('display: flex;')
    expect(ruleBlock('.lesson-progress-preview__rail')).toContain('flex-wrap: wrap;')
    expect(ruleBlock('.lesson-progress-preview__rail')).not.toContain('grid-template-columns')
    expect(ruleBlock('.lesson-progress-preview__rail li')).toContain('border-radius: 999px;')
    expect(ruleBlock('.lesson-progress-preview__rail li.is-current')).toContain(
      'background: #eef4ff;',
    )
    expect(ruleBlock('.lesson-header-card,\n.review-card')).not.toContain(
      'gap: clamp(0.9rem, 2vw, 1.25rem);',
    )
    expect(ruleBlock('.lesson-header-card')).not.toContain(
      'padding: clamp(1.25rem, 3vw, 2rem);',
    )
    expect(css).not.toMatch(
      /\.admin-[^{]*\{[^}]*(?:gap: clamp\(0\.9rem, 2vw, 1\.25rem\)|padding: clamp\(1\.25rem, 3vw, 2rem\))/,
    )

    expect(ruleBlock('.lesson-section-card__heading')).toContain('display: flex;')
    expect(ruleBlock('.lesson-section-card__heading')).toContain('justify-content: space-between;')
    expect(ruleBlock('.lesson-dialogue-progress')).toContain('border-radius: 999px;')
    expect(ruleBlock('.dialogue-card.is-completed')).toContain(
      'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(224, 242, 232, 0.6));',
    )
  })

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
})
