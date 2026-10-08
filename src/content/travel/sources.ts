import type { TravelDestinationId, TravelSourceRef } from './types'

/**
 * Date the curated seed facts were last reviewed by the authoring pass.
 *
 * This is an authoring/AI checkpoint date, not a claim of human verification.
 * Human review (P2-6) must re-confirm the facts against the cited sources and
 * update this date before merge.
 */
export const seedDate = '2026-10-08'

/**
 * Country-level sources. These are official domains used by the country
 * `practical` facts and are also available to every destination so that
 * cross-cutting perishable facts (visa, emergency, payments) resolve.
 *
 * Only well-known official roots are cited; deep links are intentionally
 * avoided so the "Verify official" affordance always points somewhere stable.
 */
export const countrySources: TravelSourceRef[] = [
  {
    id: 'gov-cn',
    label: 'Government of China — State Council portal',
    url: 'https://www.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'nia-china',
    label: 'National Immigration Administration of China',
    url: 'https://www.nia.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'mct-china',
    label: 'Ministry of Culture and Tourism of China',
    url: 'https://www.mct.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'pboc',
    label: "People's Bank of China",
    url: 'https://www.pbc.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'miit-china',
    label: 'Ministry of Industry and Information Technology of China',
    url: 'https://www.miit.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'mps-china',
    label: 'Ministry of Public Security of China',
    url: 'https://www.mps.gov.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
  {
    id: 'rail-12306',
    label: 'China Railway 12306 ticketing service',
    url: 'https://www.12306.cn',
    kind: 'official',
    lastChecked: seedDate,
  },
]

/**
 * Per-city official sources (municipal government portals). Each destination
 * receives the country sources plus its own city portal so local perishable
 * facts always have an official `url` to verify against.
 */
export const citySources: Record<TravelDestinationId, TravelSourceRef[]> = {
  beijing: [
    {
      id: 'beijing-gov',
      label: 'Beijing Municipal Government',
      url: 'https://www.beijing.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
  shanghai: [
    {
      id: 'shanghai-gov',
      label: 'Shanghai Municipal Government',
      url: 'https://www.shanghai.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
  xian: [
    {
      id: 'xian-gov',
      label: "Xi'an Municipal Government",
      url: 'https://www.xa.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
  chengdu: [
    {
      id: 'chengdu-gov',
      label: 'Chengdu Municipal Government',
      url: 'https://www.chengdu.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
  hangzhou: [
    {
      id: 'hangzhou-gov',
      label: 'Hangzhou Municipal Government',
      url: 'https://www.hangzhou.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
  guilin: [
    {
      id: 'guilin-gov',
      label: 'Guilin Municipal Government',
      url: 'https://www.guilin.gov.cn',
      kind: 'official',
      lastChecked: seedDate,
    },
  ],
}

/** Country sources followed by the destination's own official sources. */
export function sourcesFor(id: TravelDestinationId): TravelSourceRef[] {
  return [...countrySources, ...citySources[id]]
}

/** Flat registry of every source referenced by the seed content. */
export const travelSources: TravelSourceRef[] = [
  ...countrySources,
  ...Object.values(citySources).flat(),
]
