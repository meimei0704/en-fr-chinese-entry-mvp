import type { Destination, PracticalInfo, TravelContent, TravelFact, TravelSourceRef } from './types'

export class TravelContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TravelContentError'
  }
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

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

function assertLocalizedFields(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertLocalizedFields(item, `${path}[${index}]`))
    return
  }
  if (!isPlainObject(value)) {
    return
  }
  if ('en' in value || 'fr' in value) {
    if (!isNonEmptyString(value.en) || !isNonEmptyString(value.fr)) {
      throw new TravelContentError(`Localized field ${path} must have non-empty en and fr.`)
    }
    return
  }
  for (const [key, child] of Object.entries(value)) {
    assertLocalizedFields(child, `${path}.${key}`)
  }
}

function practicalFacts(practical: PracticalInfo): TravelFact[] {
  return [
    practical.payments,
    practical.connectivity,
    practical.etiquette,
    practical.safety,
    practical.visaEntry,
    practical.emergencyNumbers,
  ]
}

function destinationFacts(destination: Destination): TravelFact[] {
  return [
    ...destination.attractions,
    ...destination.stayAreas,
    ...destination.transport.arrival,
    ...destination.transport.gettingAround,
    ...practicalFacts(destination.practical),
  ]
}

function buildSourceRegistry(
  destinationId: string,
  sources: TravelSourceRef[],
): Map<string, TravelSourceRef> {
  const registry = new Map<string, TravelSourceRef>()
  for (const source of sources) {
    if (registry.has(source.id)) {
      throw new TravelContentError(`Destination ${destinationId} has duplicate source id: ${source.id}.`)
    }
    if (!isValidIsoDate(source.lastChecked)) {
      throw new TravelContentError(
        `Travel source ${source.id} has an invalid lastChecked date: ${String(source.lastChecked)}.`,
      )
    }
    registry.set(source.id, source)
  }
  return registry
}

function assertFact(
  fact: TravelFact,
  registry: Map<string, TravelSourceRef>,
  seenFactIds: Set<string>,
): boolean {
  if (seenFactIds.has(fact.id)) {
    throw new TravelContentError(`Duplicate travel fact id: ${fact.id}.`)
  }
  seenFactIds.add(fact.id)

  if (fact.sourceIds.length === 0) {
    throw new TravelContentError(`Travel fact ${fact.id} must cite at least one source.`)
  }
  if (!isValidIsoDate(fact.lastChecked)) {
    throw new TravelContentError(
      `Travel fact ${fact.id} has an invalid lastChecked date: ${String(fact.lastChecked)}.`,
    )
  }

  for (const sourceId of fact.sourceIds) {
    if (!registry.has(sourceId)) {
      throw new TravelContentError(`Travel fact ${fact.id} references unknown source: ${sourceId}.`)
    }
  }

  if (fact.freshness === 'perishable') {
    const hasOfficialUrl = fact.sourceIds.some((sourceId) => {
      const source = registry.get(sourceId)
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

export function validateTravelContent(content: TravelContent): void {
  if (!isNonEmptyString(content.contentVersion)) {
    throw new TravelContentError('Travel content requires a non-empty contentVersion.')
  }

  assertLocalizedFields(content, 'travelContent')

  const seenDestinationIds = new Set<string>()
  const seenFactIds = new Set<string>()
  const globalSources = new Map<string, TravelSourceRef>()
  let perishableCount = 0

  for (const destination of content.destinations) {
    if (seenDestinationIds.has(destination.id)) {
      throw new TravelContentError(`Duplicate travel destination id: ${destination.id}.`)
    }
    seenDestinationIds.add(destination.id)

    if (!isValidIsoDate(destination.lastVerified)) {
      throw new TravelContentError(
        `Destination ${destination.id} has an invalid lastVerified date: ${String(destination.lastVerified)}.`,
      )
    }

    const registry = buildSourceRegistry(destination.id, destination.sources)
    for (const [id, source] of registry) {
      if (!globalSources.has(id)) {
        globalSources.set(id, source)
      }
    }

    for (const fact of destinationFacts(destination)) {
      if (assertFact(fact, registry, seenFactIds)) {
        perishableCount += 1
      }
    }
  }

  for (const fact of practicalFacts(content.practical)) {
    if (assertFact(fact, globalSources, seenFactIds)) {
      perishableCount += 1
    }
  }

  if (perishableCount === 0) {
    throw new TravelContentError('Travel content must include at least one perishable fact.')
  }
}
