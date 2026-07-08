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
})
