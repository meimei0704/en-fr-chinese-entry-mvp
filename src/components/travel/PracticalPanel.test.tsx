import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import { buildItinerary } from '../../lib/travel/planner'
import { DEFAULT_TRAVEL_REQUEST } from '../../lib/travel/request'
import { PracticalPanel } from './PracticalPanel'

const itinerary = buildItinerary(DEFAULT_TRAVEL_REQUEST, travelContent, {
  now: () => Date.parse('2026-10-08T00:00:00Z'),
})

function renderPanel(language: 'en' | 'fr' = 'en') {
  return render(
    <PracticalPanel
      practical={itinerary.practical}
      disclaimers={itinerary.disclaimers}
      language={language}
    />,
  )
}

describe('PracticalPanel', () => {
  it('renders every practical section as a collapsed accordion heading', () => {
    const copy = getUiCopy('en').travel.result
    renderPanel()

    for (const key of [
      'payments',
      'connectivity',
      'etiquette',
      'safety',
      'visaEntry',
      'emergencyNumbers',
    ] as const) {
      const trigger = screen.getByRole('button', { name: copy.practicalSections[key] })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('always shows the not-legal-advice disclaimer', () => {
    const copy = getUiCopy('en').travel.result
    renderPanel()

    expect(screen.getByText(copy.disclaimer.notLegalAdvice)).toBeInTheDocument()
  })

  it('reveals the section content and its sourcing when expanded', async () => {
    const user = userEvent.setup()
    const copy = getUiCopy('en').travel.result
    renderPanel()

    await user.click(screen.getByRole('button', { name: copy.practicalSections.visaEntry }))

    const region = screen.getByRole('region', { name: copy.practicalSections.visaEntry })
    expect(region).toBeInTheDocument()
    expect(region).toHaveTextContent(getLocalizedText(itinerary.practical.country.visaEntry.title, 'en'))
    expect(region).toHaveTextContent('National Immigration Administration of China')
    expect(
      screen.getByRole('link', { name: copy.verifyOfficial }),
    ).toHaveAttribute('href', 'https://www.nia.gov.cn')
  })

  it('toggles a section with the keyboard', async () => {
    const user = userEvent.setup()
    const copy = getUiCopy('en').travel.result
    renderPanel()

    const trigger = screen.getByRole('button', { name: copy.practicalSections.emergencyNumbers })
    trigger.focus()

    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
