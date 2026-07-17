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
})
