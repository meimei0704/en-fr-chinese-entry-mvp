import type { Destination, TravelContent, TravelSourceRef } from './types'

export class TravelContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TravelContentError'
  }
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

const practicalKeys = [
  'payments',
  'connectivity',
  'etiquette',
  'safety',
  'visaEntry',
  'emergencyNumbers',
] as const

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidIsoDate(value: unknown): value is string {
  if (!isNonEmptyString(value) || !isoDatePattern.test(value)) {
    return false
  }
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function assertLocalizedText(value: unknown, path: string): void {
  if (!isPlainObject(value)) {
    throw new TravelContentError(
      `Localized field ${path} must be an object with non-empty en and fr.`,
    )
  }
  if (!isNonEmptyString(value.en) || !isNonEmptyString(value.fr)) {
    throw new TravelContentError(`Localized field ${path} must have non-empty en and fr.`)
  }
}

function assertNonEmptyString(value: unknown, path: string): void {
  if (!isNonEmptyString(value)) {
    throw new TravelContentError(`Field ${path} must be a non-empty string.`)
  }
}

function buildSourceRegistry(
  destinationId: string,
  sources: unknown,
  path: string,
): Map<string, TravelSourceRef> {
  if (!Array.isArray(sources)) {
    throw new TravelContentError(`Destination ${destinationId} sources must be an array.`)
  }

  const registry = new Map<string, TravelSourceRef>()
  sources.forEach((source, index) => {
    const sourcePath = `${path}.sources[${index}]`
    if (!isPlainObject(source)) {
      throw new TravelContentError(`Travel source at ${sourcePath} must be an object.`)
    }
    if (!isNonEmptyString(source.id)) {
      throw new TravelContentError(`Travel source at ${sourcePath} must have a non-empty id.`)
    }
    if (registry.has(source.id)) {
      throw new TravelContentError(`Destination ${destinationId} has duplicate source id: ${source.id}.`)
    }
    assertNonEmptyString(source.label, `${sourcePath}.label`)
    if (!isValidIsoDate(source.lastChecked)) {
      throw new TravelContentError(
        `Travel source ${source.id} has an invalid lastChecked date: ${String(source.lastChecked)}.`,
      )
    }
    registry.set(source.id, source as unknown as TravelSourceRef)
  })
  return registry
}

function assertFact(
  fact: unknown,
  registry: Map<string, TravelSourceRef>,
  seenFactIds: Set<string>,
  path: string,
): boolean {
  if (!isPlainObject(fact)) {
    throw new TravelContentError(`Travel fact at ${path} must be an object.`)
  }
  if (!isNonEmptyString(fact.id)) {
    throw new TravelContentError(`Travel fact at ${path} must have a non-empty id.`)
  }
  if (seenFactIds.has(fact.id)) {
    throw new TravelContentError(`Duplicate travel fact id: ${fact.id}.`)
  }
  seenFactIds.add(fact.id)

  assertLocalizedText(fact.title, `${path}.title`)

  if (!Array.isArray(fact.sourceIds)) {
    throw new TravelContentError(`Travel fact ${fact.id} must have a sourceIds array.`)
  }
  if (fact.sourceIds.length === 0) {
    throw new TravelContentError(`Travel fact ${fact.id} must cite at least one source.`)
  }
  if (!isValidIsoDate(fact.lastChecked)) {
    throw new TravelContentError(
      `Travel fact ${fact.id} has an invalid lastChecked date: ${String(fact.lastChecked)}.`,
    )
  }

  for (const sourceId of fact.sourceIds) {
    if (!isNonEmptyString(sourceId) || !registry.has(sourceId)) {
      throw new TravelContentError(`Travel fact ${fact.id} references unknown source: ${String(sourceId)}.`)
    }
  }

  if (fact.freshness === 'perishable') {
    const hasOfficialUrl = fact.sourceIds.some((sourceId) => {
      const source = registry.get(sourceId as string)
      return source?.kind === 'official' && isNonEmptyString(source.url)
    })
    if (!hasOfficialUrl) {
      throw new TravelContentError(
        `Perishable travel fact ${fact.id} must cite an official source with a url.`,
      )
    }
    return true
  }

  return false
}

function practicalEntries(practical: unknown, path: string): Array<[string, unknown]> {
  if (!isPlainObject(practical)) {
    throw new TravelContentError(`Practical info at ${path} must be an object.`)
  }
  return practicalKeys.map((key) => [key, practical[key]] as [string, unknown])
}

export function validateTravelContent(content: TravelContent): void {
  if (!isPlainObject(content)) {
    throw new TravelContentError('Travel content must be an object.')
  }
  if (!isNonEmptyString(content.contentVersion)) {
    throw new TravelContentError('Travel content requires a non-empty contentVersion.')
  }
  if (!Array.isArray(content.destinations)) {
    throw new TravelContentError('Travel content destinations must be an array.')
  }
  if (!isPlainObject(content.practical)) {
    throw new TravelContentError('Travel content practical must be an object.')
  }

  const seenDestinationIds = new Set<string>()
  const seenFactIds = new Set<string>()
  const globalSources = new Map<string, TravelSourceRef>()
  let perishableCount = 0

  content.destinations.forEach((rawDestination, index) => {
    const path = `travelContent.destinations[${index}]`
    if (!isPlainObject(rawDestination)) {
      throw new TravelContentError(`Destination at ${path} must be an object.`)
    }
    const destination = rawDestination as unknown as Destination

    if (!isNonEmptyString(destination.id)) {
      throw new TravelContentError(`Destination at ${path} must have a non-empty id.`)
    }
    if (seenDestinationIds.has(destination.id)) {
      throw new TravelContentError(`Duplicate travel destination id: ${destination.id}.`)
    }
    seenDestinationIds.add(destination.id)

    assertLocalizedText(destination.name, `${path}.name`)
    assertLocalizedText(destination.region, `${path}.region`)
    assertLocalizedText(destination.summary, `${path}.summary`)
    assertLocalizedText(destination.welcome, `${path}.welcome`)

    if (!isValidIsoDate(destination.lastVerified)) {
      throw new TravelContentError(
        `Destination ${destination.id} has an invalid lastVerified date: ${String(destination.lastVerified)}.`,
      )
    }

    const registry = buildSourceRegistry(destination.id, destination.sources, path)
    for (const [sourceId, source] of registry) {
      if (!globalSources.has(sourceId)) {
        globalSources.set(sourceId, source)
      }
    }

    if (!Array.isArray(destination.attractions)) {
      throw new TravelContentError(`Destination ${destination.id} attractions must be an array.`)
    }
    destination.attractions.forEach((attraction, attractionIndex) => {
      const attractionPath = `${path}.attractions[${attractionIndex}]`
      if (assertFact(attraction, registry, seenFactIds, attractionPath)) {
        perishableCount += 1
      }
      assertLocalizedText(attraction.area, `${attractionPath}.area`)
      assertLocalizedText(attraction.description, `${attractionPath}.description`)
      if (attraction.tips !== undefined) {
        assertLocalizedText(attraction.tips, `${attractionPath}.tips`)
      }
    })

    if (!Array.isArray(destination.stayAreas)) {
      throw new TravelContentError(`Destination ${destination.id} stayAreas must be an array.`)
    }
    destination.stayAreas.forEach((stayArea, stayIndex) => {
      const stayPath = `${path}.stayAreas[${stayIndex}]`
      if (assertFact(stayArea, registry, seenFactIds, stayPath)) {
        perishableCount += 1
      }
      assertLocalizedText(stayArea.name, `${stayPath}.name`)
      assertLocalizedText(stayArea.vibe, `${stayPath}.vibe`)
      assertLocalizedText(stayArea.transportNotes, `${stayPath}.transportNotes`)
    })

    if (!isPlainObject(destination.transport)) {
      throw new TravelContentError(`Destination ${destination.id} transport must be an object.`)
    }
    if (!Array.isArray(destination.transport.arrival)) {
      throw new TravelContentError(`Destination ${destination.id} transport.arrival must be an array.`)
    }
    if (!Array.isArray(destination.transport.gettingAround)) {
      throw new TravelContentError(
        `Destination ${destination.id} transport.gettingAround must be an array.`,
      )
    }
    const transportOptions: Array<[string, Destination['transport']['arrival'][number]]> = [
      ...destination.transport.arrival.map(
        (option, optionIndex): [string, Destination['transport']['arrival'][number]] => [
          `${path}.transport.arrival[${optionIndex}]`,
          option,
        ],
      ),
      ...destination.transport.gettingAround.map(
        (option, optionIndex): [string, Destination['transport']['arrival'][number]] => [
          `${path}.transport.gettingAround[${optionIndex}]`,
          option,
        ],
      ),
    ]
    for (const [optionPath, option] of transportOptions) {
      if (assertFact(option, registry, seenFactIds, optionPath)) {
        perishableCount += 1
      }
      if (option.notes !== undefined) {
        assertLocalizedText(option.notes, `${optionPath}.notes`)
      }
    }

    for (const [key, fact] of practicalEntries(destination.practical, `${path}.practical`)) {
      if (assertFact(fact, registry, seenFactIds, `${path}.practical.${key}`)) {
        perishableCount += 1
      }
    }
  })

  for (const [key, fact] of practicalEntries(content.practical, 'travelContent.practical')) {
    if (assertFact(fact, globalSources, seenFactIds, `travelContent.practical.${key}`)) {
      perishableCount += 1
    }
  }

  if (perishableCount === 0) {
    throw new TravelContentError('Travel content must include at least one perishable fact.')
  }
}
