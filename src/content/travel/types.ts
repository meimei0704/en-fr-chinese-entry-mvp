import type { LocalizedField } from '../types'

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
  label: LocalizedField
  url?: string
  kind: TravelSourceKind
  lastChecked: string
}

export interface TravelFact {
  id: string
  title: LocalizedField
  origin: FactOrigin
  freshness: FactFreshness
  sourceIds: string[]
  lastChecked: string
}

export interface Attraction extends TravelFact {
  category: Interest
  area: LocalizedField
  durationHours: number
  description: LocalizedField
  tips?: LocalizedField
}

export interface StayArea extends TravelFact {
  name: LocalizedField
  vibe: LocalizedField
  bestFor: Interest[]
  priceTier: PriceTier
  transportNotes: LocalizedField
}

export interface TransportOption extends TravelFact {
  mode: TransportMode
  notes?: LocalizedField
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
  name: LocalizedField
  region: LocalizedField
  summary: LocalizedField
  bestSeasons: Season[]
  welcome: LocalizedField
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
