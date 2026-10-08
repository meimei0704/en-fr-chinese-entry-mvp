import type { ExplanationLanguage, LocalizedText } from '../../content/types'
import type {
  Attraction,
  DisclaimedTravelFact,
  Interest,
  PracticalInfo,
  StayArea,
  TransportOption,
  TravelDestinationId,
} from '../../content/travel/types'
import type { TravelBudget, TravelPace } from './request'

/** An attraction selected for a specific destination, with provenance intact. */
export interface ScheduledAttraction {
  destinationId: TravelDestinationId
  attraction: Attraction
}

/** One inter-city relocation: `fromDestinationId: null` is the international arrival. */
export interface ItineraryLeg {
  fromDestinationId: TravelDestinationId | null
  toDestinationId: TravelDestinationId
  options: TransportOption[]
}

export type ItineraryDayKind = 'attraction' | 'travel' | 'free'

export interface ItineraryDayBase {
  dayNumber: number
  destinationId: TravelDestinationId
  kind: ItineraryDayKind
}

export interface AttractionDay extends ItineraryDayBase {
  kind: 'attraction'
  attractions: ScheduledAttraction[]
}

export interface TravelDay extends ItineraryDayBase {
  kind: 'travel'
  leg: ItineraryLeg
  arrivalAttractions: ScheduledAttraction[]
}

export interface FreeDay extends ItineraryDayBase {
  kind: 'free'
  tips: LocalizedText
  optionalAttractions: ScheduledAttraction[]
}

export type ItineraryDay = AttractionDay | TravelDay | FreeDay

export interface ItinerarySummaryEntry {
  destinationId: TravelDestinationId
  name: LocalizedText
  allocatedDays: number
  attractionDays: number
  freeDays: number
  stayAreaId: string
}

export interface ItinerarySummary {
  title: LocalizedText
  totalDays: number
  freeDays: number
  pace: TravelPace
  budget: TravelBudget
  interests: Interest[]
  language: ExplanationLanguage
  entries: ItinerarySummaryEntry[]
}

export interface ItineraryStay {
  destinationId: TravelDestinationId
  destinationName: LocalizedText
  stayArea: StayArea
}

export interface DestinationPractical {
  destinationId: TravelDestinationId
  practical: PracticalInfo
}

export interface ItineraryPractical {
  country: PracticalInfo
  byDestination: DestinationPractical[]
}

export interface ItineraryDisclaimer {
  kind: 'visaEntry' | 'safety'
  destinationId: TravelDestinationId | null
  fact: DisclaimedTravelFact
}

export interface ItineraryMeta {
  contentVersion: string
  lastVerified: string
  /** Clock-derived; explicitly outside the determinism contract. */
  generatedAt: string
  freeDays: number
}

export interface TravelItinerary {
  summary: ItinerarySummary
  legs: ItineraryLeg[]
  days: ItineraryDay[]
  stays: ItineraryStay[]
  practical: ItineraryPractical
  disclaimers: ItineraryDisclaimer[]
  meta: ItineraryMeta
}
