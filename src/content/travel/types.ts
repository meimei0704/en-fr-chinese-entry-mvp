import type { LocalizedText } from '../types'

export type TravelDestinationId =
  | 'beijing'
  | 'shanghai'
  | 'xian'
  | 'chengdu'
  | 'hangzhou'
  | 'guilin'

export type Interest = 'history' | 'nature' | 'food' | 'shopping' | 'nightlife' | 'art'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type FactFreshness = 'stable' | 'perishable'

export type FactOrigin = 'curated' | 'live'

export type TravelSourceKind = 'official' | 'operator' | 'reputable'

export type TransportMode =
  | 'air'
  | 'rail'
  | 'metro'
  | 'bus'
  | 'taxi'
  | 'rideshare'
  | 'bike'
  | 'walk'

export type PriceTier = 'budget' | 'mid' | 'comfort'

export interface TravelSourceRef {
  id: string
  label: string
  url?: string
  kind: TravelSourceKind
  lastChecked: string
}

export interface TravelFact {
  id: string
  title: LocalizedText
  origin: FactOrigin
  freshness: FactFreshness
  sourceIds: string[]
  lastChecked: string
}

export interface Attraction extends TravelFact {
  category: Interest
  area: LocalizedText
  durationHours: number
  description: LocalizedText
  tips?: LocalizedText
}

export interface StayArea extends TravelFact {
  name: LocalizedText
  vibe: LocalizedText
  bestFor: Interest[]
  priceTier: PriceTier
  transportNotes: LocalizedText
}

export interface TransportOption extends TravelFact {
  mode: TransportMode
  notes?: LocalizedText
}

export interface DisclaimedTravelFact extends TravelFact {
  disclaimer: true
}

export interface PracticalInfo {
  payments: TravelFact
  connectivity: TravelFact
  etiquette: TravelFact
  safety: DisclaimedTravelFact
  visaEntry: DisclaimedTravelFact
  emergencyNumbers: TravelFact
}

export interface DestinationTransport {
  arrival: TransportOption[]
  gettingAround: TransportOption[]
}

export interface Destination {
  id: TravelDestinationId
  name: LocalizedText
  region: LocalizedText
  summary: LocalizedText
  bestSeasons: Season[]
  welcome: LocalizedText
  attractions: Attraction[]
  stayAreas: StayArea[]
  transport: DestinationTransport
  practical: PracticalInfo
  sources: TravelSourceRef[]
  lastVerified: string
}

export interface TravelContent {
  destinations: Destination[]
  practical: PracticalInfo
  contentVersion: string
  generatedFrom: string
}
