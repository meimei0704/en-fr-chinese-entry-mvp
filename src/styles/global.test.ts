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
    `(^|\\n)\\s*${escapedSelector}\\s*{[\\s\\S]*?${escapedDeclaration}`,
    'm',
  ).test(css)
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
      ['.option-button:hover:not(:disabled),\n.primary-button:hover:not(:disabled),\n.secondary-link:hover:not(:disabled),\n.chip-button:hover:not(:disabled)', 'transform: translateY(-1px);'],
      ['.option-button:disabled,\n.primary-button:disabled,\n.secondary-link:disabled,\n.chip-button:disabled', 'cursor: not-allowed;'],
      ['.option-button:disabled,\n.primary-button:disabled,\n.secondary-link:disabled,\n.chip-button:disabled', 'opacity: 0.55;'],
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
      ['.lesson-page .lesson-header-card__title .eyebrow', 'margin-bottom: 0.25rem;'],
      ['.lesson-page .lesson-progress-preview', 'gap: 0.75rem;'],
      ['.lesson-page .lesson-progress-preview', 'padding: 0.85rem;'],
      ['.lesson-page .lesson-progress-preview__summary', 'gap: 0.5rem;'],
      [
        '.lesson-page .lesson-progress-preview__rail',
        'grid-template-columns: repeat(3, minmax(0, 1fr));',
      ],
      ['.lesson-page .lesson-overview-card', 'gap: 0.75rem;'],
    ] as const
    for (const [selector, declaration] of scoped) {
      expect(ruleBlock(selector)).toContain(declaration)
    }

    expect(ruleBlock('.lesson-progress-preview__rail')).toContain(
      'grid-template-columns: repeat(5, minmax(0, 1fr));',
    )
    expect(ruleBlock('.lesson-progress-preview__rail')).not.toContain('repeat(3')
    expect(ruleBlock('.lesson-header-card,\n.review-card')).not.toContain(
      'gap: clamp(0.9rem, 2vw, 1.25rem);',
    )
    expect(ruleBlock('.lesson-header-card')).not.toContain(
      'padding: clamp(1.25rem, 3vw, 2rem);',
    )
    expect(css).not.toMatch(
      /\.admin-[^{]*\{[^}]*(?:gap: clamp\(0\.9rem, 2vw, 1\.25rem\)|padding: clamp\(1\.25rem, 3vw, 2rem\))/,
    )
    expect(css).toMatch(
      /@media \(max-width: 760px\)[\s\S]*?\.lesson-page \.lesson-progress-preview__rail\s*\{[^}]*grid-template-columns:\s*1fr;/,
    )
  })
})
