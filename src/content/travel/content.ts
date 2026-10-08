import type { TravelContent, TravelSourceRef } from './types'
import { travelSources } from './sources'
import { countryPractical } from './practical'
import { beijing } from './destinations/beijing'
import { shanghai } from './destinations/shanghai'
import { xian } from './destinations/xian'
import { chengdu } from './destinations/chengdu'
import { hangzhou } from './destinations/hangzhou'
import { guilin } from './destinations/guilin'

/** Flat, id-addressable view of every source referenced by the seed content. */
export const travelSourcesById: Record<string, TravelSourceRef> = Object.fromEntries(
  travelSources.map((source) => [source.id, source]),
)

/**
 * Seed travel content. All facts are `origin: 'curated'`; perishable facts cite
 * an official source with a `url` so the UI's "Verify official" action always
 * has a destination.
 */
export const travelContent: TravelContent = {
  destinations: [beijing, shanghai, xian, chengdu, hangzhou, guilin],
  practical: countryPractical,
  contentVersion: 'travel-2026-10-08',
  generatedFrom: 'curated seed',
}
