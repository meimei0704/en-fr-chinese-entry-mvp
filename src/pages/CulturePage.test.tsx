import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'
import { createDefaultProgress, saveProgress } from '../lib/progress'

describe('CulturePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the hero and all 7 section blocks stacked on one page', () => {
    renderRoute('/culture')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Culture advice for travelers in China' }),
    ).toBeVisible()

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(7)
    expect(screen.getByRole('heading', { level: 2, name: 'General Social Tips' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Dining Etiquette' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Conversation Guidelines' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: "Visiting Someone's Home" })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Public Conduct and Behaviour' })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Visiting Temples & Cultural Sites' }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Number Superstitions & Symbolism' }),
    ).toBeVisible()
  })

  it('shows content of multiple sections at once without tabs', () => {
    renderRoute('/culture')

    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()
    expect(screen.getByText(/Do not start eating until the host/)).toBeInTheDocument()
    expect(
      screen.getByText(/Certain numbers carry cultural associations due to Chinese homophones/),
    ).toBeInTheDocument()
  })

  it('renders bold lead-ins and nested sub-items in General Social Tips', () => {
    renderRoute('/culture')

    const formalLead = screen.getByText('For formal visits:')
    expect(formalLead.tagName).toBe('STRONG')
    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()

    const clocksLead = screen.getByText('Clocks:')
    expect(clocksLead.tagName).toBe('STRONG')
    expect(screen.getByText(/The phrase for "giving a clock"/)).toBeInTheDocument()

    const sublist = document.querySelector('.culture-advice__subitems')
    expect(sublist).not.toBeNull()
  })

  it('renders bold 8/6/4 in Number Superstitions with the intro line', () => {
    renderRoute('/culture')

    expect(
      screen.getByText('Certain numbers carry cultural associations due to Chinese homophones:'),
    ).toBeInTheDocument()
    expect(screen.getByText('8:').tagName).toBe('STRONG')
    expect(screen.getByText('6:').tagName).toBe('STRONG')
    expect(screen.getByText('4:').tagName).toBe('STRONG')
    expect(screen.getByText(/Represents wealth, prosperity and good luck/)).toBeInTheDocument()
  })

  it('switches to French copy and French section titles', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/culture')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Conseils culturels pour les voyageurs en Chine',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Conseils sociaux généraux' }),
    ).toBeVisible()
  })

  it('omits the bottom back-to-home action since the top nav covers Home', () => {
    renderRoute('/culture')

    expect(screen.queryByRole('link', { name: 'Back to home' })).not.toBeInTheDocument()
  })
})
