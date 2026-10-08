import { describe, expect, it } from 'vitest'

import { travelContent, travelSourcesById } from './content'
import { validateTravelContent } from './validate'
import type { Destination, TravelFact, TravelDestinationId } from './types'

const expectedDestinationIds: TravelDestinationId[] = [
  'beijing',
  'shanghai',
  'xian',
  'chengdu',
  'hangzhou',
  'guilin',
]

function collectFacts(destination: Destination): TravelFact[] {
  return [
    ...destination.attractions,
    ...destination.stayAreas,
    ...destination.transport.arrival,
    ...destination.transport.gettingAround,
    ...Object.values(destination.practical),
  ]
}

function officialUrlSourceIds(destination: Destination): Set<string> {
  return new Set(
    destination.sources
      .filter((source) => source.kind === 'official' && (source.url ?? '').trim() !== '')
      .map((source) => source.id),
  )
}

describe('travel seed content', () => {
  it('passes the content validator', () => {
    expect(() => validateTravelContent(travelContent)).not.toThrow()
  })

  it('ships the six curated destinations in a stable order', () => {
    expect(travelContent.destinations.map((destination) => destination.id)).toEqual(
      expectedDestinationIds,
    )
    expect(travelContent.contentVersion).toBe('travel-2026-10-08')
    expect(travelContent.generatedFrom).toBe('curated seed')
  })

  it('gives every destination enough attractions and stay areas across interests', () => {
    for (const destination of travelContent.destinations) {
      expect(destination.attractions.length).toBeGreaterThanOrEqual(4)
      expect(destination.stayAreas.length).toBeGreaterThanOrEqual(2)

      const categories = new Set(destination.attractions.map((attraction) => attraction.category))
      expect(categories.size).toBeGreaterThanOrEqual(3)

      expect(destination.transport.arrival.length).toBeGreaterThanOrEqual(1)
      expect(destination.transport.gettingAround.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('exercises the perishable boundary with an official url per destination', () => {
    for (const destination of travelContent.destinations) {
      const officialIds = officialUrlSourceIds(destination)
      const perishableWithOfficialUrl = collectFacts(destination).filter(
        (fact) =>
          fact.freshness === 'perishable' &&
          fact.sourceIds.some((sourceId) => officialIds.has(sourceId)),
      )
      expect(perishableWithOfficialUrl.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('carries provenance on every destination fact', () => {
    for (const destination of travelContent.destinations) {
      for (const fact of collectFacts(destination)) {
        expect(fact.origin).toBe('curated')
        expect(fact.sourceIds.length).toBeGreaterThanOrEqual(1)
        expect(fact.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
      expect(destination.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('requires the country visa/entry and safety disclaimers', () => {
    expect(travelContent.practical.visaEntry.disclaimer).toBe(true)
    expect(travelContent.practical.safety.disclaimer).toBe(true)
    expect(travelContent.practical.visaEntry.freshness).toBe('perishable')
    expect(travelContent.practical.visaEntry.sourceIds.length).toBeGreaterThanOrEqual(1)
  })

  it('resolves every referenced source through the id-addressable registry', () => {
    const referenced = new Set<string>()
    for (const destination of travelContent.destinations) {
      for (const source of destination.sources) {
        referenced.add(source.id)
      }
      for (const fact of collectFacts(destination)) {
        for (const sourceId of fact.sourceIds) {
          referenced.add(sourceId)
        }
      }
    }
    for (const key of [
      'payments',
      'connectivity',
      'etiquette',
      'safety',
      'visaEntry',
      'emergencyNumbers',
    ] as const) {
      for (const sourceId of travelContent.practical[key].sourceIds) {
        referenced.add(sourceId)
      }
    }

    for (const sourceId of referenced) {
      expect(travelSourcesById[sourceId]).toBeDefined()
    }
  })
})
