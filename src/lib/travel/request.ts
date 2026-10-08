import type { ExplanationLanguage } from '../../content/types'
import type {
  Interest,
  PriceTier,
  TravelDestinationId,
} from '../../content/travel/types'

export type TravelPace = 'relaxed' | 'standard' | 'packed'

export type TravelBudget = PriceTier

export interface TravelRequest {
  destinations: TravelDestinationId[]
  days: number
  interests: Interest[]
  pace: TravelPace
  budget: TravelBudget
  language: ExplanationLanguage
}

/** A sensible, always-valid starting point so the planner page is never empty. */
export const DEFAULT_TRAVEL_REQUEST: TravelRequest = {
  destinations: ['beijing', 'xian'],
  days: 5,
  interests: ['history', 'food'],
  pace: 'standard',
  budget: 'mid',
  language: 'en',
}

export type TravelRequestErrorCode =
  | 'no-destinations'
  | 'too-many-destinations'
  | 'duplicate-destination'
  | 'unknown-destination'
  | 'invalid-days'
  | 'days-less-than-destinations'
  | 'invalid-pace'
  | 'invalid-budget'
  | 'invalid-language'
  | 'unknown-interest'

export interface TravelRequestError {
  code: TravelRequestErrorCode
  message: string
}

/** Thrown by the planner when a request fails validation. Carries typed issues. */
export class TravelRequestValidationError extends Error {
  readonly errors: TravelRequestError[]

  constructor(errors: TravelRequestError[]) {
    super(errors.map((error) => error.message).join(' '))
    this.name = 'TravelRequestValidationError'
    this.errors = errors
  }
}

export const TRAVEL_DESTINATION_IDS: readonly TravelDestinationId[] = [
  'beijing',
  'shanghai',
  'xian',
  'chengdu',
  'hangzhou',
  'guilin',
]

export const TRAVEL_INTERESTS: readonly Interest[] = [
  'history',
  'nature',
  'food',
  'shopping',
  'nightlife',
  'art',
]

export const TRAVEL_PACES: readonly TravelPace[] = ['relaxed', 'standard', 'packed']

export const TRAVEL_BUDGETS: readonly TravelBudget[] = ['budget', 'mid', 'comfort']

export const TRAVEL_LANGUAGES: readonly ExplanationLanguage[] = ['en', 'fr']

export const MAX_TRAVEL_DESTINATIONS = 7
export const MAX_TRAVEL_DAYS = 21

/**
 * Validate a travel request without throwing. Returns a (possibly empty) list of
 * typed errors; an empty list means the request is safe to plan.
 */
export function validateTravelRequest(request: TravelRequest): TravelRequestError[] {
  const errors: TravelRequestError[] = []
  const destinations = request.destinations

  if (!Array.isArray(destinations) || destinations.length === 0) {
    errors.push({ code: 'no-destinations', message: 'Select at least one destination.' })
  } else if (destinations.length > MAX_TRAVEL_DESTINATIONS) {
    errors.push({
      code: 'too-many-destinations',
      message: `Select at most ${MAX_TRAVEL_DESTINATIONS} destinations.`,
    })
  }

  if (Array.isArray(destinations)) {
    const seen = new Set<string>()
    for (const id of destinations) {
      if (!TRAVEL_DESTINATION_IDS.includes(id)) {
        errors.push({
          code: 'unknown-destination',
          message: `Unknown destination: ${String(id)}.`,
        })
        continue
      }
      if (seen.has(id)) {
        errors.push({
          code: 'duplicate-destination',
          message: `Destination selected more than once: ${id}.`,
        })
      }
      seen.add(id)
    }
  }

  const { days } = request
  if (!Number.isInteger(days) || days < 1 || days > MAX_TRAVEL_DAYS) {
    errors.push({
      code: 'invalid-days',
      message: `Choose a trip length between 1 and ${MAX_TRAVEL_DAYS} days.`,
    })
  } else if (Array.isArray(destinations) && days < destinations.length) {
    errors.push({
      code: 'days-less-than-destinations',
      message: 'Your trip must be at least as long as the number of destinations.',
    })
  }

  if (!TRAVEL_PACES.includes(request.pace)) {
    errors.push({ code: 'invalid-pace', message: `Unknown pace: ${String(request.pace)}.` })
  }
  if (!TRAVEL_BUDGETS.includes(request.budget)) {
    errors.push({ code: 'invalid-budget', message: `Unknown budget: ${String(request.budget)}.` })
  }
  if (!TRAVEL_LANGUAGES.includes(request.language)) {
    errors.push({
      code: 'invalid-language',
      message: `Unknown language: ${String(request.language)}.`,
    })
  }

  if (!Array.isArray(request.interests)) {
    errors.push({ code: 'unknown-interest', message: 'Interests must be a list.' })
  } else {
    for (const interest of request.interests) {
      if (!TRAVEL_INTERESTS.includes(interest)) {
        errors.push({
          code: 'unknown-interest',
          message: `Unknown interest: ${String(interest)}.`,
        })
      }
    }
  }

  return errors
}
