import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import type { TravelItinerary } from '../../lib/travel/itinerary'
import { buildItinerary } from '../../lib/travel/planner'
import { DEFAULT_TRAVEL_REQUEST } from '../../lib/travel/request'
import { ItineraryView } from './ItineraryView'

const itinerary = buildItinerary(DEFAULT_TRAVEL_REQUEST, travelContent, {
  now: () => Date.parse('2026-10-08T00:00:00Z'),
})

function withLiveFact(source: TravelItinerary): TravelItinerary {
  const clone = JSON.parse(JSON.stringify(source)) as TravelItinerary
  const attractionDay = clone.days.find((day) => day.kind === 'attraction')
  if (attractionDay && attractionDay.kind === 'attraction') {
    attractionDay.attractions[0].attraction.origin = 'live'
  }
  return clone
}

describe('ItineraryView', () => {
  it('renders the summary, day cards, stays, practical panel, and freshness banner', () => {
    const copy = getUiCopy('en').travel.result
    render(<ItineraryView itinerary={itinerary} language="en" />)

    expect(screen.getByRole('heading', { name: copy.summaryHeading })).toBeInTheDocument()
    expect(
      screen.getByText(getLocalizedText(itinerary.summary.title, 'en')),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.dayHeading(1) })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.stayHeading })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: copy.practicalHeading })).toBeInTheDocument()
    expect(screen.getByText(copy.freshnessBanner(itinerary.meta.lastVerified))).toBeInTheDocument()
  })

  it('renders the Getting there block from the first leg with provenance', () => {
    const copy = getUiCopy('en').travel.result
    render(<ItineraryView itinerary={itinerary} language="en" />)

    const firstLeg = itinerary.legs[0]
    expect(firstLeg.fromDestinationId).toBeNull()
    expect(screen.getByRole('heading', { name: copy.gettingThereHeading })).toBeInTheDocument()

    for (const option of firstLeg.options) {
      expect(screen.getAllByText(getLocalizedText(option.title, 'en')).length).toBeGreaterThan(0)
      expect(
        screen.getAllByText(getLocalizedText(option.title, 'en'))[0].closest('li'),
      ).not.toBeNull()
    }
  })

  it('does not render an origin indicator for a pure-curated plan', () => {
    const copy = getUiCopy('en').travel.result
    render(<ItineraryView itinerary={itinerary} language="en" />)

    expect(screen.queryByText(copy.liveIndicator)).not.toBeInTheDocument()
  })

  it('renders a single origin indicator when the plan contains a live fact', () => {
    const copy = getUiCopy('en').travel.result
    render(<ItineraryView itinerary={withLiveFact(itinerary)} language="en" />)

    expect(screen.getAllByText(copy.liveIndicator)).toHaveLength(1)
  })

  it('shows the stale warning through the injected clock', () => {
    const copy = getUiCopy('en').travel.result
    const verifiedAt = Date.parse(itinerary.meta.lastVerified)
    render(
      <ItineraryView
        itinerary={itinerary}
        language="en"
        now={() => verifiedAt + 400 * 24 * 60 * 60 * 1000}
      />,
    )

    expect(screen.getByText(copy.staleWarning(180))).toBeInTheDocument()
  })
})
