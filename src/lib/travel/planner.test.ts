import { describe, expect, it } from 'vitest'

import { travelContent } from '../../content/travel/content'
import type { TravelDestinationId } from '../../content/travel/types'
import type { ScheduledAttraction, TravelItinerary } from './itinerary'
import {
  arrivalHalfCap,
  buildItinerary,
  capacityDays,
  interestMatchCount,
  paceCap,
  selectStayArea,
  usable,
} from './planner'
import {
  DEFAULT_TRAVEL_REQUEST,
  TravelRequestValidationError,
  type TravelRequest,
} from './request'

const fixedClock = { now: () => Date.UTC(2026, 0, 2, 3, 4, 5) }

function request(overrides: Partial<TravelRequest>): TravelRequest {
  return { ...DEFAULT_TRAVEL_REQUEST, ...overrides }
}

function build(overrides: Partial<TravelRequest> = {}, deps = fixedClock): TravelItinerary {
  return buildItinerary(request(overrides), travelContent, deps)
}

/** Plan body with the clock-derived `generatedAt` normalized out. */
function planBody(itinerary: TravelItinerary): TravelItinerary {
  const clone = structuredClone(itinerary)
  clone.meta.generatedAt = 'GENERATED_AT'
  return clone
}

/** Compact, stable projection of the plan body for golden comparison. */
function planProjection(itinerary: TravelItinerary) {
  return {
    summary: itinerary.summary,
    legs: itinerary.legs.map((leg) => ({
      from: leg.fromDestinationId,
      to: leg.toDestinationId,
      options: leg.options.map((option) => option.id),
    })),
    days: itinerary.days.map((day) => ({
      dayNumber: day.dayNumber,
      destinationId: day.destinationId,
      kind: day.kind,
      attractionIds:
        day.kind === 'attraction'
          ? day.attractions.map((item) => item.attraction.id)
          : day.kind === 'travel'
            ? day.arrivalAttractions.map((item) => item.attraction.id)
            : day.optionalAttractions.map((item) => item.attraction.id),
    })),
    stays: itinerary.stays.map((stay) => stay.stayArea.id),
    practical: Object.values(itinerary.practical.country).map((fact) => fact.id),
    disclaimers: itinerary.disclaimers.map((disclaimer) => disclaimer.kind),
    meta: itinerary.meta,
  }
}

function scheduled(itinerary: TravelItinerary): ScheduledAttraction[] {
  const result: ScheduledAttraction[] = []
  for (const day of itinerary.days) {
    if (day.kind === 'attraction') {
      result.push(...day.attractions)
    } else if (day.kind === 'travel') {
      result.push(...day.arrivalAttractions)
    }
  }
  return result
}

function allocationByDestination(itinerary: TravelItinerary): Record<string, number> {
  return Object.fromEntries(
    itinerary.summary.entries.map((entry) => [entry.destinationId, entry.allocatedDays]),
  )
}

function scheduledIdsForDestination(
  itinerary: TravelItinerary,
  destinationId: TravelDestinationId,
): string[] {
  return scheduled(itinerary)
    .filter((item) => item.destinationId === destinationId)
    .map((item) => item.attraction.id)
}

describe('scoring helpers', () => {
  it('caps attractions per day by pace', () => {
    expect([paceCap('relaxed'), paceCap('standard'), paceCap('packed')]).toEqual([1, 2, 3])
  })

  it('reserves an arrival half-day only for standard and packed paces', () => {
    expect([arrivalHalfCap('relaxed'), arrivalHalfCap('standard'), arrivalHalfCap('packed')]).toEqual([
      0, 1, 1,
    ])
  })

  it('computes capacity days over the remaining attractions', () => {
    expect(capacityDays(5, 0, 'standard')).toBe(3)
    expect(capacityDays(5, 1, 'standard')).toBe(2)
    expect(capacityDays(5, 0, 'relaxed')).toBe(5)
    expect(capacityDays(5, 1, 'packed')).toBe(2)
  })

  it('orders usable attractions by requested interest then stable id', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    const list = usable(beijing, ['food', 'history'])
    expect(list[0].id).toBe('beijing-wangfujing-snacks')
    expect(list.map((attraction) => attraction.id)).toEqual([
      'beijing-wangfujing-snacks',
      'beijing-forbidden-city',
      'beijing-great-wall-mutianyu',
    ])
    expect(usable(beijing, []).map((attraction) => attraction.id)).toEqual(
      [...beijing.attractions].map((attraction) => attraction.id).sort(),
    )
  })

  it('counts matching attractions, not categories', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    expect(interestMatchCount(beijing, ['history'])).toBe(2)
    expect(interestMatchCount(beijing, [])).toBe(0)
  })
})

describe('buildItinerary determinism', () => {
  it('produces identical plans for two calls with a fixed clock', () => {
    const first = build({ destinations: ['beijing', 'xian'], days: 6 })
    const second = build({ destinations: ['beijing', 'xian'], days: 6 })
    expect(first).toEqual(second)
  })

  it('is independent of the clock once generatedAt is excluded', () => {
    const morning = build({ destinations: ['beijing', 'xian', 'shanghai'], days: 7 }, { now: () => 0 })
    const later = build(
      { destinations: ['beijing', 'xian', 'shanghai'], days: 7 },
      { now: () => 1_000_000 },
    )
    expect(morning.meta.generatedAt).not.toBe(later.meta.generatedAt)
    expect(planBody(morning)).toEqual(planBody(later))
  })

  it('uses the injected clock for generatedAt', () => {
    expect(build({ destinations: ['beijing'], days: 3 }).meta.generatedAt).toBe(
      '2026-01-02T03:04:05.000Z',
    )
  })

  it('records content provenance in meta', () => {
    const itinerary = build({ destinations: ['beijing'], days: 3 })
    expect(itinerary.meta.contentVersion).toBe(travelContent.contentVersion)
    expect(itinerary.meta.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches the golden itinerary', () => {
    const golden = build({
      destinations: ['beijing', 'xian'],
      days: 5,
      interests: ['history', 'food'],
      pace: 'standard',
      budget: 'mid',
      language: 'fr',
    })

    const body = planBody(golden)

    expect(body.days.map((day) => day.kind)).toEqual([
      'attraction',
      'attraction',
      'travel',
      'attraction',
      'attraction',
    ])
    expect(body.legs.map((leg) => leg.fromDestinationId)).toEqual([null, 'beijing'])
    expect(Object.keys(body.practical)).toEqual(['country'])
    expect(body.stays.map((stay) => stay.stayArea.id)).toEqual([
      'beijing-stay-dongcheng',
      'xian-stay-bell-tower',
    ])
    expect(planProjection(body)).toMatchInlineSnapshot(`
      {
        "days": [
          {
            "attractionIds": [
              "beijing-forbidden-city",
              "beijing-great-wall-mutianyu",
            ],
            "dayNumber": 1,
            "destinationId": "beijing",
            "kind": "attraction",
          },
          {
            "attractionIds": [
              "beijing-wangfujing-snacks",
            ],
            "dayNumber": 2,
            "destinationId": "beijing",
            "kind": "attraction",
          },
          {
            "attractionIds": [
              "xian-big-wild-goose-pagoda",
            ],
            "dayNumber": 3,
            "destinationId": "xian",
            "kind": "travel",
          },
          {
            "attractionIds": [
              "xian-city-wall",
              "xian-terracotta-army",
            ],
            "dayNumber": 4,
            "destinationId": "xian",
            "kind": "attraction",
          },
          {
            "attractionIds": [
              "xian-muslim-quarter",
            ],
            "dayNumber": 5,
            "destinationId": "xian",
            "kind": "attraction",
          },
        ],
        "disclaimers": [
          "visaEntry",
          "safety",
        ],
        "legs": [
          {
            "from": null,
            "options": [
              "beijing-arrival-air",
              "beijing-arrival-rail",
            ],
            "to": "beijing",
          },
          {
            "from": "beijing",
            "options": [
              "xian-arrival-air",
              "xian-arrival-rail",
            ],
            "to": "xian",
          },
        ],
        "meta": {
          "contentVersion": "travel-2026-10-08",
          "freeDays": 0,
          "generatedAt": "GENERATED_AT",
          "lastVerified": "2026-10-08",
        },
        "practical": [
          "country-payments",
          "country-connectivity",
          "country-etiquette",
          "country-safety",
          "country-visa-entry",
          "country-emergency",
        ],
        "stays": [
          "beijing-stay-dongcheng",
          "xian-stay-bell-tower",
        ],
        "summary": {
          "budget": "mid",
          "entries": [
            {
              "allocatedDays": 2,
              "attractionDays": 2,
              "destinationId": "beijing",
              "freeDays": 0,
              "name": {
                "en": "Beijing",
                "fr": "Pékin",
              },
              "stayAreaId": "beijing-stay-dongcheng",
            },
            {
              "allocatedDays": 3,
              "attractionDays": 2,
              "destinationId": "xian",
              "freeDays": 0,
              "name": {
                "en": "Xi’an",
                "fr": "Xi’an",
              },
              "stayAreaId": "xian-stay-bell-tower",
            },
          ],
          "freeDays": 0,
          "interests": [
            "history",
            "food",
          ],
          "language": "fr",
          "pace": "standard",
          "title": {
            "en": "Beijing · Xi’an",
            "fr": "Pékin · Xi’an",
          },
          "totalDays": 5,
        },
      }
    `)
  })
})

describe('day allocation', () => {
  it('gives a single city every requested day', () => {
    const itinerary = build({ destinations: ['beijing'], days: 5 })
    expect(itinerary.days).toHaveLength(5)
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 5 })
  })

  it('reserves one day per destination for an even three-city split', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 6,
      interests: [],
    })
    expect(itinerary.days).toHaveLength(6)
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 2, xian: 2, shanghai: 2 })
  })

  it('distributes the largest remainders by input order with interest weights', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 8,
      interests: ['history'],
    })
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 3, xian: 3, shanghai: 2 })
    expect(itinerary.days).toHaveLength(8)
  })

  it('never drops a requested day', () => {
    for (const days of [1, 4, 7, 13, 21]) {
      expect(build({ destinations: ['beijing'], days }).days).toHaveLength(days)
    }
  })
})

describe('pace caps and no repeats', () => {
  it.each(['relaxed', 'standard', 'packed'] as const)('respects the %s pace cap', (pace) => {
    const itinerary = build({ destinations: ['beijing'], days: 6, interests: [], pace })
    const attractionDays = itinerary.days.filter((day) => day.kind === 'attraction')
    expect(attractionDays.length).toBeGreaterThan(0)
    for (const day of attractionDays) {
      expect(day.attractions.length).toBeGreaterThan(0)
      expect(day.attractions.length).toBeLessThanOrEqual(paceCap(pace))
    }
  })

  it('schedules no duplicate attractions on a multi-city itinerary with a travel day', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 9,
      interests: [],
      pace: 'packed',
    })
    const ids = scheduled(itinerary).map((item) => item.attraction.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(itinerary.days.some((day) => day.kind === 'travel')).toBe(true)
  })

  it('schedules at most N_d attractions from each city', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 12,
      interests: [],
      pace: 'packed',
    })
    for (const entry of itinerary.summary.entries) {
      const destination = travelContent.destinations.find(
        (candidate) => candidate.id === entry.destinationId,
      )!
      const ids = scheduledIdsForDestination(itinerary, entry.destinationId)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids.length).toBeLessThanOrEqual(usable(destination, []).length)
    }
  })

  it('draws the arrival half-day from the same list without reducing capacity incorrectly', () => {
    const itinerary = build({
      destinations: ['xian', 'beijing'],
      days: 4,
      interests: ['history'],
      pace: 'standard',
    })
    const travelDay = itinerary.days.find(
      (day) => day.kind === 'travel' && day.destinationId === 'beijing',
    )
    expect(travelDay?.kind).toBe('travel')
    if (travelDay?.kind !== 'travel') {
      throw new Error('expected a travel day')
    }
    expect(travelDay.arrivalAttractions).toHaveLength(1)
    // beijing has two history attractions; both are scheduled exactly once.
    expect(scheduledIdsForDestination(itinerary, 'beijing')).toHaveLength(2)
    expect(new Set(scheduledIdsForDestination(itinerary, 'beijing')).size).toBe(2)
  })
})

describe('stay areas, free days and validation failures', () => {
  it('selects a different stay area when the budget changes', () => {
    const mid = build({ destinations: ['beijing'], days: 3, budget: 'mid' })
    const comfort = build({ destinations: ['beijing'], days: 3, budget: 'comfort' })
    expect(mid.stays[0].stayArea.id).toBe('beijing-stay-dongcheng')
    expect(comfort.stays[0].stayArea.id).toBe('beijing-stay-sanlitun')
    expect(mid.stays[0].stayArea.id).not.toBe(comfort.stays[0].stayArea.id)
  })

  it('falls back to the nearest tier when no stay matches the budget', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    expect(selectStayArea(beijing, request({ budget: 'budget' })).id).toBe('beijing-stay-dongcheng')
  })

  it('renders over-capacity days as free days instead of erroring', () => {
    const itinerary = build({ destinations: ['beijing'], days: 21, interests: [], pace: 'standard' })
    expect(itinerary.days).toHaveLength(21)
    expect(itinerary.meta.freeDays).toBe(18)
    expect(itinerary.summary.freeDays).toBe(18)
    expect(itinerary.days.filter((day) => day.kind === 'free')).toHaveLength(18)
  })

  it('carries provenance on every scheduled attraction', () => {
    const itinerary = build({ destinations: ['beijing', 'xian'], days: 6 })
    for (const item of scheduled(itinerary)) {
      expect(item.attraction.origin).toBe('curated')
      expect(item.attraction.sourceIds.length).toBeGreaterThanOrEqual(1)
      expect(item.attraction.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('rejects a request with fewer days than destinations', () => {
    expect(() => build({ destinations: ['beijing', 'xian'], days: 1 })).toThrow(
      TravelRequestValidationError,
    )
  })

  it('rejects an invalid request (out-of-range days)', () => {
    expect(() => build({ destinations: ['beijing'], days: 0 })).toThrow(
      TravelRequestValidationError,
    )
  })

  it('rejects an unknown destination', () => {
    const destinations = ['beijing', 'atlantis'] as unknown as TravelDestinationId[]
    expect(() => build({ destinations, days: 3 })).toThrow(TravelRequestValidationError)
  })
})
