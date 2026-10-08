import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import { travelContent } from '../../content/travel/content'
import type { AttractionDay, FreeDay, TravelDay } from '../../lib/travel/itinerary'
import { buildItinerary } from '../../lib/travel/planner'
import { DEFAULT_TRAVEL_REQUEST } from '../../lib/travel/request'
import type { TravelRequest } from '../../lib/travel/request'
import { DayCard } from './DayCard'

const now = () => Date.parse('2026-10-08T00:00:00Z')

function plan(request: TravelRequest) {
  return buildItinerary(request, travelContent, { now })
}

describe('DayCard', () => {
  it('renders an attraction day with duration, tips, and sourcing', () => {
    const itinerary = plan(DEFAULT_TRAVEL_REQUEST)
    const day = itinerary.days.find(
      (candidate): candidate is AttractionDay => candidate.kind === 'attraction',
    )!
    const copy = getUiCopy('en').travel.result
    render(<DayCard day={day} language="en" />)

    const first = day.attractions[0].attraction
    expect(screen.getByRole('heading', { name: copy.dayHeading(day.dayNumber) })).toBeInTheDocument()
    expect(screen.getByText(getLocalizedText(first.title, 'en'))).toBeInTheDocument()
    expect(screen.getByText(`${first.durationHours} h`)).toBeInTheDocument()
    expect(screen.getAllByText('Beijing Municipal Government').length).toBeGreaterThan(0)
  })

  it('labels a food attraction as the meal block', () => {
    const itinerary = plan({
      destinations: ['beijing'],
      days: 1,
      interests: ['food'],
      pace: 'relaxed',
      budget: 'mid',
      language: 'en',
    })
    const day = itinerary.days.find(
      (candidate): candidate is AttractionDay => candidate.kind === 'attraction',
    )!
    const copy = getUiCopy('en').travel.result
    render(<DayCard day={day} language="en" />)

    expect(screen.getByText(copy.blocks.meal)).toBeInTheDocument()
  })

  it('renders grounded getting-around transport options when supplied', () => {
    const itinerary = plan(DEFAULT_TRAVEL_REQUEST)
    const day = itinerary.days.find(
      (candidate): candidate is AttractionDay => candidate.kind === 'attraction',
    )!
    const options = travelContent.destinations.find(
      (destination) => destination.id === 'beijing',
    )!.transport.gettingAround
    render(<DayCard day={day} language="en" transportOptions={options} />)

    expect(screen.getByText(getLocalizedText(options[0].title, 'en'))).toBeInTheDocument()
  })

  it('renders the inter-city leg and arrival half-day on a travel day', () => {
    const itinerary = plan(DEFAULT_TRAVEL_REQUEST)
    const day = itinerary.days.find(
      (candidate): candidate is TravelDay => candidate.kind === 'travel',
    )!
    const copy = getUiCopy('en').travel.result
    render(<DayCard day={day} language="en" />)

    expect(screen.getByText(copy.blocks.transport)).toBeInTheDocument()
    const option = day.leg.options[0]
    expect(screen.getByText(getLocalizedText(option.title, 'en'))).toBeInTheDocument()
  })

  it('renders a distinct free/optional day block for over-capacity requests', () => {
    const itinerary = plan({
      destinations: ['beijing'],
      days: 21,
      interests: [],
      pace: 'relaxed',
      budget: 'mid',
      language: 'en',
    })
    const day = itinerary.days.find(
      (candidate): candidate is FreeDay => candidate.kind === 'free',
    )!
    const copy = getUiCopy('en').travel.result
    render(<DayCard day={day} language="en" />)

    expect(screen.getByText(copy.freeDayLabel)).toBeInTheDocument()
    expect(screen.getByText(copy.freeDayHelper)).toBeInTheDocument()
    expect(screen.getByText(getLocalizedText(day.tips, 'en'), { exact: false })).toBeInTheDocument()
    expect(screen.getByText(`${copy.blocks.tips}:`, { exact: false })).toBeInTheDocument()
  })

  it('requires a "Verify official" badge only for perishable facts', () => {
    const itinerary = plan({
      destinations: ['beijing'],
      days: 1,
      interests: ['food'],
      pace: 'relaxed',
      budget: 'mid',
      language: 'en',
    })
    const day = itinerary.days.find(
      (candidate): candidate is AttractionDay => candidate.kind === 'attraction',
    )!
    const copy = getUiCopy('en').travel.result
    render(<DayCard day={day} language="en" />)

    // The Wangfujing food attraction is stable, so no verify badge.
    const stable = day.attractions.every((item) => item.attraction.freshness === 'stable')
    expect(stable).toBe(true)
    expect(screen.queryByRole('link', { name: copy.verifyOfficial })).not.toBeInTheDocument()
  })
})
