import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import { buildItinerary } from '../../lib/travel/planner'
import { DEFAULT_TRAVEL_REQUEST } from '../../lib/travel/request'
import { StayCard } from './StayCard'

const itinerary = buildItinerary(DEFAULT_TRAVEL_REQUEST, travelContent, {
  now: () => Date.parse('2026-10-08T00:00:00Z'),
})

describe('StayCard', () => {
  it('renders the area, why, and the booking note with sourcing', () => {
    const stay = itinerary.stays[0]
    const copy = getUiCopy('en').travel.result
    render(<StayCard stay={stay} language="en" />)

    expect(
      screen.getByRole('heading', {
        name: getLocalizedText(stay.stayArea.name, 'en'),
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(getLocalizedText(stay.stayArea.vibe, 'en'))).toBeInTheDocument()
    expect(screen.getByText(copy.stayBookingNote)).toBeInTheDocument()
    expect(screen.getByText('Beijing Municipal Government')).toBeInTheDocument()
    expect(screen.getByText(stay.stayArea.lastChecked)).toBeInTheDocument()
  })
})
