import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'
import { createDefaultProgress, saveProgress } from '../lib/progress'

const tablistLabel = 'Culture topics'

describe('CulturePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the hero and all 7 section tabs, with the first selected', () => {
    renderRoute('/culture')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Culture advice for travelers in China' }),
    ).toBeVisible()

    const tablist = screen.getByRole('tablist', { name: tablistLabel })
    const tabs = within(tablist).getAllByRole('tab')

    expect(tabs).toHaveLength(7)
    expect(tabs.map((tab) => tab.querySelector('span')?.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ])
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      '1General Social Tips',
      '2Dining Etiquette',
      '3Conversation Guidelines',
      "4Visiting Someone's Home",
      '5Public Conduct and Behaviour',
      '6Visiting Temples & Cultural Sites',
      '7Number Superstitions & Symbolism',
    ])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'General Social Tips' })).toBeVisible()
  })

  it('switches the tab panel content on selection', async () => {
    const user = userEvent.setup()
    renderRoute('/culture')

    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Dining Etiquette' }))

    expect(screen.getByRole('tab', { name: 'Dining Etiquette' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel', { name: 'Dining Etiquette' })).toBeVisible()
    expect(screen.getByText(/Do not start eating until the host/)).toBeInTheDocument()
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

  it('renders bold 8/6/4 in Number Superstitions with the intro line', async () => {
    const user = userEvent.setup()
    renderRoute('/culture')

    await user.click(screen.getByRole('tab', { name: 'Number Superstitions & Symbolism' }))

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
      screen.getByRole('tablist', { name: 'Sujets culturels' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Conseils sociaux généraux' })).toBeInTheDocument()
  })

  it('links back to the home page', () => {
    renderRoute('/culture')

    const backLink = screen.getByRole('link', { name: 'Back to home' })
    expect(backLink).toHaveAttribute('href', '/home')
  })
})
