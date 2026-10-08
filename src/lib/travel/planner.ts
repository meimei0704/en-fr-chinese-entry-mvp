import type { LocalizedText } from '../../content/types'
import type {
  Attraction,
  Destination,
  Interest,
  PriceTier,
  StayArea,
  TravelContent,
  TravelDestinationId,
} from '../../content/travel/types'
import type {
  ItineraryDay,
  ItineraryDisclaimer,
  ItineraryLeg,
  ItineraryMeta,
  ItineraryPractical,
  ItineraryStay,
  ItinerarySummary,
  ItinerarySummaryEntry,
  ScheduledAttraction,
  TravelItinerary,
} from './itinerary'
import type { TravelPace, TravelRequest } from './request'
import { TravelRequestValidationError, validateTravelRequest } from './request'

export interface PlannerDeps {
  /** Injectable clock so `meta.generatedAt` is stable in tests. Defaults to `Date.now`. */
  now?: () => number
}

const PACE_CAPS: Record<TravelPace, number> = { relaxed: 1, standard: 2, packed: 3 }

const TIER_RANK: Record<PriceTier, number> = { budget: 0, mid: 1, comfort: 2 }

/** Maximum attractions scheduled on a full day for the requested pace. */
export function paceCap(pace: TravelPace): number {
  return PACE_CAPS[pace]
}

/** Arrival half-day capacity for a relocation day (0 for `relaxed`). */
export function arrivalHalfCap(pace: TravelPace): number {
  return Math.floor(paceCap(pace) / 2)
}

function interestScore(attraction: Attraction, interests: Interest[]): number {
  const index = interests.indexOf(attraction.category)
  return index === -1 ? 0 : interests.length - index
}

/**
 * Ordered consumable attraction list for a destination: matching interests first
 * (earlier requested interest wins, then stable id), falling back to all
 * attractions when nothing matches. Never empty for validated content.
 */
export function usable(destination: Destination, interests: Interest[]): Attraction[] {
  const matches = destination.attractions.filter((attraction) =>
    interests.includes(attraction.category),
  )
  const source = matches.length > 0 ? matches : destination.attractions
  return [...source].sort((a, b) => {
    const score = interestScore(b, interests) - interestScore(a, interests)
    if (score !== 0) {
      return score
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
  })
}

/** Number of a destination's attractions whose category is a requested interest. */
export function interestMatchCount(destination: Destination, interests: Interest[]): number {
  return destination.attractions.filter((attraction) =>
    interests.includes(attraction.category),
  ).length
}

/** Full attraction-bearing days available once reserved arrival items are removed. */
export function capacityDays(usableCount: number, arrivalCount: number, pace: TravelPace): number {
  return Math.ceil(Math.max(0, usableCount - arrivalCount) / paceCap(pace))
}

/**
 * Reserve one day per destination, then split the remainder by
 * `weight = 1 + interestMatchCount` using floor + largest fractional remainder
 * (integer modulo), breaking remainder ties by request input order.
 */
export function allocateDays(destinations: Destination[], request: TravelRequest): number[] {
  const extraTotal = request.days - destinations.length
  const weights = destinations.map((destination) => 1 + interestMatchCount(destination, request.interests))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const extras = weights.map((weight) => Math.floor((extraTotal * weight) / totalWeight))
  const remainders = weights.map((weight) => (extraTotal * weight) % totalWeight)

  let leftover = extraTotal - extras.reduce((sum, extra) => sum + extra, 0)
  const order = weights
    .map((_, index) => index)
    .sort((a, b) => {
      if (remainders[b] !== remainders[a]) {
        return remainders[b] - remainders[a]
      }
      return a - b
    })
  for (let slot = 0; slot < order.length && leftover > 0; slot += 1) {
    extras[order[slot]] += 1
    leftover -= 1
  }

  return extras.map((extra) => 1 + extra)
}

/** Budget-matched stay area, then best interest overlap, then stable id. */
export function selectStayArea(destination: Destination, request: TravelRequest): StayArea {
  const requested = TIER_RANK[request.budget]
  const ranked = destination.stayAreas.map((area) => ({
    area,
    tierDistance: Math.abs(TIER_RANK[area.priceTier] - requested),
    interestScore: area.bestFor.filter((interest) => request.interests.includes(interest)).length,
  }))
  ranked.sort((a, b) => {
    if (a.tierDistance !== b.tierDistance) {
      return a.tierDistance - b.tierDistance
    }
    if (a.interestScore !== b.interestScore) {
      return b.interestScore - a.interestScore
    }
    return a.area.id < b.area.id ? -1 : a.area.id > b.area.id ? 1 : 0
  })
  return ranked[0].area
}

function schedule(destinationId: TravelDestinationId, attraction: Attraction): ScheduledAttraction {
  return { destinationId, attraction }
}

function latestVerified(destinations: Destination[]): string {
  return destinations.reduce(
    (latest, destination) => (destination.lastVerified > latest ? destination.lastVerified : latest),
    destinations[0].lastVerified,
  )
}

/**
 * Deterministically plan an itinerary for a validated request. The plan body
 * (`summary`, `legs`, `days`, `stays`, `practical`, `disclaimers`, and the
 * non-clock parts of `meta`) is a pure function of `(request, contentVersion)`;
 * only `meta.generatedAt` depends on the injectable clock.
 */
export function buildItinerary(
  request: TravelRequest,
  content: TravelContent,
  deps: PlannerDeps = {},
): TravelItinerary {
  const errors = validateTravelRequest(request)
  if (errors.length > 0) {
    throw new TravelRequestValidationError(errors)
  }

  const byId = new Map(content.destinations.map((destination) => [destination.id, destination]))
  const destinations = request.destinations.map((id) => {
    const destination = byId.get(id)
    if (!destination) {
      throw new TravelRequestValidationError([
        { code: 'unknown-destination', message: `Unknown destination: ${id}.` },
      ])
    }
    return destination
  })

  const allocations = allocateDays(destinations, request)
  const cap = paceCap(request.pace)

  const days: ItineraryDay[] = []
  const legs: ItineraryLeg[] = []
  const stays: ItineraryStay[] = []
  const summaryEntries: ItinerarySummaryEntry[] = []
  let freeDaysTotal = 0
  let dayNumber = 1

  destinations.forEach((destination, index) => {
    const isFirst = index === 0
    const previous = isFirst ? null : destinations[index - 1]
    const leg: ItineraryLeg = {
      fromDestinationId: previous ? previous.id : null,
      toDestinationId: destination.id,
      options: destination.transport.arrival,
    }
    legs.push(leg)

    const stayArea = selectStayArea(destination, request)
    stays.push({
      destinationId: destination.id,
      destinationName: destination.name,
      stayArea,
    })

    const list = usable(destination, request.interests)
    const usableCount = list.length
    const arrivalCount = isFirst ? 0 : Math.min(arrivalHalfCap(request.pace), usableCount)
    const capacity = capacityDays(usableCount, arrivalCount, request.pace)
    const allocated = allocations[index]
    const arrivalDays = isFirst ? 0 : 1
    const remaining = allocated - arrivalDays
    const attractionDayCount = Math.max(0, Math.min(remaining, capacity))
    const freeDayCount = Math.max(0, remaining - capacity)
    freeDaysTotal += freeDayCount

    let cursor = 0

    if (!isFirst) {
      const reserved = list
        .slice(0, arrivalCount)
        .map((attraction) => schedule(destination.id, attraction))
      cursor = arrivalCount
      days.push({
        kind: 'travel',
        dayNumber: dayNumber++,
        destinationId: destination.id,
        leg,
        arrivalAttractions: reserved,
      })
    }

    const scheduledTotal = Math.min(attractionDayCount * cap, usableCount - arrivalCount)
    let scheduled = 0
    for (let day = 0; day < attractionDayCount; day += 1) {
      const take = Math.min(cap, scheduledTotal - scheduled)
      const items = list
        .slice(cursor, cursor + take)
        .map((attraction) => schedule(destination.id, attraction))
      cursor += take
      scheduled += take
      days.push({
        kind: 'attraction',
        dayNumber: dayNumber++,
        destinationId: destination.id,
        attractions: items,
      })
    }

    const optional = list
      .slice(cursor)
      .map((attraction) => schedule(destination.id, attraction))
    for (let day = 0; day < freeDayCount; day += 1) {
      days.push({
        kind: 'free',
        dayNumber: dayNumber++,
        destinationId: destination.id,
        tips: destination.welcome,
        optionalAttractions: day === 0 ? optional : [],
      })
    }

    summaryEntries.push({
      destinationId: destination.id,
      name: destination.name,
      allocatedDays: allocated,
      attractionDays: attractionDayCount,
      freeDays: freeDayCount,
      stayAreaId: stayArea.id,
    })
  })

  const title: LocalizedText = {
    en: destinations.map((destination) => destination.name.en).join(' · '),
    fr: destinations.map((destination) => destination.name.fr).join(' · '),
  }

  const summary: ItinerarySummary = {
    title,
    totalDays: request.days,
    freeDays: freeDaysTotal,
    pace: request.pace,
    budget: request.budget,
    interests: [...request.interests],
    language: request.language,
    entries: summaryEntries,
  }

  const practical: ItineraryPractical = {
    country: content.practical,
    byDestination: destinations.map((destination) => ({
      destinationId: destination.id,
      practical: destination.practical,
    })),
  }

  const disclaimers: ItineraryDisclaimer[] = [
    { kind: 'visaEntry', destinationId: null, fact: content.practical.visaEntry },
    { kind: 'safety', destinationId: null, fact: content.practical.safety },
  ]

  const clock = deps.now ?? Date.now
  const meta: ItineraryMeta = {
    contentVersion: content.contentVersion,
    lastVerified: latestVerified(destinations),
    generatedAt: new Date(clock()).toISOString(),
    freeDays: freeDaysTotal,
  }

  return { summary, legs, days, stays, practical, disclaimers, meta }
}
