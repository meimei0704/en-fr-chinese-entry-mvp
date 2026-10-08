import { describe, expect, it } from 'vitest'

import type {
  Attraction,
  Destination,
  PracticalInfo,
  StayArea,
  TransportOption,
  TravelContent,
  TravelFact,
  TravelSourceRef,
} from './types'
import { TravelContentError, validateTravelContent } from './validate'

function makeSource(overrides: Partial<TravelSourceRef> = {}): TravelSourceRef {
  return {
    id: 'src-official',
    label: 'Official source',
    url: 'https://example.com/official',
    kind: 'official',
    lastChecked: '2026-10-01',
    ...overrides,
  }
}

function makeReputableSource(): TravelSourceRef {
  return makeSource({
    id: 'src-reputable',
    label: 'Reputable guide',
    url: undefined,
    kind: 'reputable',
  })
}

function makeFact(
  id: string,
  freshness: TravelFact['freshness'] = 'stable',
  sourceIds: string[] = ['src-official'],
): TravelFact {
  return {
    id,
    title: { en: `Title ${id}`, fr: `Titre ${id}` },
    origin: 'curated',
    freshness,
    sourceIds,
    lastChecked: '2026-10-01',
  }
}

function makePractical(prefix: string, sourceIds: string[]): PracticalInfo {
  return {
    payments: makeFact(`${prefix}-payments`, 'stable', sourceIds),
    connectivity: makeFact(`${prefix}-connectivity`, 'stable', sourceIds),
    etiquette: makeFact(`${prefix}-etiquette`, 'stable', sourceIds),
    safety: { ...makeFact(`${prefix}-safety`, 'stable', sourceIds), disclaimer: true },
    visaEntry: { ...makeFact(`${prefix}-visaEntry`, 'perishable', sourceIds), disclaimer: true },
    emergencyNumbers: makeFact(`${prefix}-emergency`, 'stable', sourceIds),
  }
}

function makeDestination(): Destination {
  const attractions: Attraction[] = [
    {
      ...makeFact('beijing-forbidden-city'),
      category: 'history',
      area: { en: 'Dongcheng', fr: 'Dongcheng' },
      durationHours: 3,
      description: { en: 'The imperial palace.', fr: 'Le palais impérial.' },
      tips: { en: 'Book ahead.', fr: 'Réservez à l’avance.' },
    },
    {
      ...makeFact('beijing-ticket-price', 'perishable'),
      category: 'history',
      area: { en: 'Dongcheng', fr: 'Dongcheng' },
      durationHours: 3,
      description: { en: 'Current admission price.', fr: 'Prix d’entrée actuel.' },
    },
  ]

  const stayArea: StayArea = {
    ...makeFact('beijing-stay-dongcheng'),
    name: { en: 'Dongcheng', fr: 'Dongcheng' },
    vibe: { en: 'Historic and central.', fr: 'Historique et central.' },
    bestFor: ['history', 'food'],
    priceTier: 'mid',
    transportNotes: { en: 'Metro line 5.', fr: 'Métro ligne 5.' },
  }

  const arrival: TransportOption = {
    ...makeFact('beijing-arrival-rail'),
    mode: 'rail',
    notes: { en: 'High-speed rail.', fr: 'Train à grande vitesse.' },
  }

  const gettingAround: TransportOption = {
    ...makeFact('beijing-metro'),
    mode: 'metro',
  }

  return {
    id: 'beijing',
    name: { en: 'Beijing', fr: 'Pékin' },
    region: { en: 'North China', fr: 'Chine du Nord' },
    summary: { en: 'The capital.', fr: 'La capitale.' },
    bestSeasons: ['spring', 'autumn'],
    welcome: { en: 'Welcome to Beijing.', fr: 'Bienvenue à Pékin.' },
    attractions,
    stayAreas: [stayArea],
    transport: { arrival: [arrival], gettingAround: [gettingAround] },
    practical: makePractical('beijing', ['src-official']),
    sources: [makeSource(), makeReputableSource()],
    lastVerified: '2026-10-01',
  }
}

function makeValidContent(): TravelContent {
  return {
    destinations: [makeDestination()],
    practical: makePractical('china', ['src-official']),
    contentVersion: 'travel-2026-10-08',
    generatedFrom: 'curated seed',
  }
}

describe('validateTravelContent', () => {
  it('accepts valid travel content with provenance and a perishable fact', () => {
    expect(() => validateTravelContent(makeValidContent())).not.toThrow()
  })

  it('rejects a source-less stable fact', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[0].sourceIds = []

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/beijing-forbidden-city.*source/i)
  })

  it('rejects a source-less perishable fact', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[1].sourceIds = []

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/beijing-ticket-price.*source/i)
  })

  it('rejects a perishable fact that only cites a non-official source', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[1].sourceIds = ['src-reputable']

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/beijing-ticket-price.*official/i)
  })

  it('rejects a perishable fact whose official source has an empty url', () => {
    const content = makeValidContent()
    const official = content.destinations[0].sources.find((source) => source.id === 'src-official')
    if (!official) {
      throw new Error('fixture is missing the official source')
    }
    official.url = ''

    expect(() => validateTravelContent(content)).toThrow(/official source with a url/i)
  })

  it('rejects a localized field missing fr', () => {
    const content = makeValidContent()
    content.destinations[0].name = { en: 'Beijing' } as unknown as Destination['name']

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/non-empty en and fr/i)
  })

  it('rejects a plain-string value for a bilingual content field', () => {
    const content = makeValidContent()
    content.destinations[0].summary = 'The capital.' as unknown as Destination['summary']

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/must be an object with non-empty en and fr/i)
  })

  it('rejects a malformed fact whose sourceIds is not an array with the typed error', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[0].sourceIds = 'src-official' as unknown as string[]

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/sourceIds array/i)
  })

  it('rejects non-object content with the typed error instead of a TypeError', () => {
    expect(() => validateTravelContent(null as unknown as TravelContent)).toThrow(TravelContentError)
    expect(() => validateTravelContent(null as unknown as TravelContent)).toThrow(/must be an object/i)
  })

  it('rejects non-array destinations with the typed error instead of a TypeError', () => {
    const content = makeValidContent()
    content.destinations = undefined as unknown as Destination[]

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/destinations must be an array/i)
  })

  it('rejects duplicate fact ids', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[1].id = content.destinations[0].attractions[0].id

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/Duplicate travel fact id/i)
  })

  it('rejects a bad lastVerified date', () => {
    const content = makeValidContent()
    content.destinations[0].lastVerified = '2026-13-40'

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/lastVerified/i)
  })

  it('rejects a bad lastChecked date', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[0].lastChecked = 'not-a-date'

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/lastChecked/i)
  })

  it('rejects an unknown source reference', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[0].sourceIds = ['src-missing']

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/unknown source/i)
  })

  it('rejects an empty contentVersion', () => {
    const content = makeValidContent()
    content.contentVersion = '   '

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/contentVersion/i)
  })

  it('rejects content without any perishable fact', () => {
    const content = makeValidContent()
    content.destinations[0].attractions[1].freshness = 'stable'
    content.destinations[0].practical.visaEntry.freshness = 'stable'
    content.practical.visaEntry.freshness = 'stable'

    expect(() => validateTravelContent(content)).toThrow(TravelContentError)
    expect(() => validateTravelContent(content)).toThrow(/perishable/i)
  })
})
