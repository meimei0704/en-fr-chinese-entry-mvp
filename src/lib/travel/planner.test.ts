import { describe, expect, it } from 'vitest'

import { travelContent } from '../../content/travel/content'
import type { TravelDestinationId } from '../../content/travel/types'
import type { ScheduledAttraction, TravelItinerary } from './itinerary'
import {
  arrivalHalfCap,
  buildItinerary,
  capacityDays,
  interestMatchCount,
  paceCap,
  selectStayArea,
  usable,
} from './planner'
import {
  DEFAULT_TRAVEL_REQUEST,
  TravelRequestValidationError,
  type TravelRequest,
} from './request'

const fixedClock = { now: () => Date.UTC(2026, 0, 2, 3, 4, 5) }

function request(overrides: Partial<TravelRequest>): TravelRequest {
  return { ...DEFAULT_TRAVEL_REQUEST, ...overrides }
}

function build(overrides: Partial<TravelRequest> = {}, deps = fixedClock): TravelItinerary {
  return buildItinerary(request(overrides), travelContent, deps)
}

/** Plan body with the clock-derived `generatedAt` normalized out. */
function planBody(itinerary: TravelItinerary): TravelItinerary {
  const clone = structuredClone(itinerary)
  clone.meta.generatedAt = 'GENERATED_AT'
  return clone
}

function scheduled(itinerary: TravelItinerary): ScheduledAttraction[] {
  const result: ScheduledAttraction[] = []
  for (const day of itinerary.days) {
    if (day.kind === 'attraction') {
      result.push(...day.attractions)
    } else if (day.kind === 'travel') {
      result.push(...day.arrivalAttractions)
    }
  }
  return result
}

function allocationByDestination(itinerary: TravelItinerary): Record<string, number> {
  return Object.fromEntries(
    itinerary.summary.entries.map((entry) => [entry.destinationId, entry.allocatedDays]),
  )
}

function scheduledIdsForDestination(
  itinerary: TravelItinerary,
  destinationId: TravelDestinationId,
): string[] {
  return scheduled(itinerary)
    .filter((item) => item.destinationId === destinationId)
    .map((item) => item.attraction.id)
}

describe('scoring helpers', () => {
  it('caps attractions per day by pace', () => {
    expect([paceCap('relaxed'), paceCap('standard'), paceCap('packed')]).toEqual([1, 2, 3])
  })

  it('reserves an arrival half-day only for standard and packed paces', () => {
    expect([arrivalHalfCap('relaxed'), arrivalHalfCap('standard'), arrivalHalfCap('packed')]).toEqual([
      0, 1, 1,
    ])
  })

  it('computes capacity days over the remaining attractions', () => {
    expect(capacityDays(5, 0, 'standard')).toBe(3)
    expect(capacityDays(5, 1, 'standard')).toBe(2)
    expect(capacityDays(5, 0, 'relaxed')).toBe(5)
    expect(capacityDays(5, 1, 'packed')).toBe(2)
  })

  it('orders usable attractions by requested interest then stable id', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    const list = usable(beijing, ['food', 'history'])
    expect(list[0].id).toBe('beijing-wangfujing-snacks')
    expect(list.map((attraction) => attraction.id)).toEqual([
      'beijing-wangfujing-snacks',
      'beijing-forbidden-city',
      'beijing-great-wall-mutianyu',
    ])
    expect(usable(beijing, []).map((attraction) => attraction.id)).toEqual(
      [...beijing.attractions].map((attraction) => attraction.id).sort(),
    )
  })

  it('counts matching attractions, not categories', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    expect(interestMatchCount(beijing, ['history'])).toBe(2)
    expect(interestMatchCount(beijing, [])).toBe(0)
  })
})

describe('buildItinerary determinism', () => {
  it('produces identical plans for two calls with a fixed clock', () => {
    const first = build({ destinations: ['beijing', 'xian'], days: 6 })
    const second = build({ destinations: ['beijing', 'xian'], days: 6 })
    expect(first).toEqual(second)
  })

  it('is independent of the clock once generatedAt is excluded', () => {
    const morning = build({ destinations: ['beijing', 'xian', 'shanghai'], days: 7 }, { now: () => 0 })
    const later = build(
      { destinations: ['beijing', 'xian', 'shanghai'], days: 7 },
      { now: () => 1_000_000 },
    )
    expect(morning.meta.generatedAt).not.toBe(later.meta.generatedAt)
    expect(planBody(morning)).toEqual(planBody(later))
  })

  it('uses the injected clock for generatedAt', () => {
    expect(build({ destinations: ['beijing'], days: 3 }).meta.generatedAt).toBe(
      '2026-01-02T03:04:05.000Z',
    )
  })

  it('records content provenance in meta', () => {
    const itinerary = build({ destinations: ['beijing'], days: 3 })
    expect(itinerary.meta.contentVersion).toBe(travelContent.contentVersion)
    expect(itinerary.meta.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches the golden itinerary', () => {
    const golden = build({
      destinations: ['beijing', 'xian'],
      days: 5,
      interests: ['history', 'food'],
      pace: 'standard',
      budget: 'mid',
      language: 'fr',
    })
    expect(planBody(golden)).toMatchInlineSnapshot(`
      {
        "days": [
          {
            "attractions": [
              {
                "attraction": {
                  "area": {
                    "en": "Dongcheng, beside Tiananmen Square",
                    "fr": "Dongcheng, près de la place Tiananmen",
                  },
                  "category": "history",
                  "description": {
                    "en": "The imperial palace of the Ming and Qing dynasties, with 900-plus surviving halls and courtyards along a north–south axis. Entering from the south and exiting the north leads naturally toward Jingshan Park.",
                    "fr": "Le palais impérial des Ming et des Qing, avec plus de 900 salles et cours conservées le long d’un axe nord–sud. Entrer par le sud et sortir par le nord mène naturellement au parc Jingshan.",
                  },
                  "durationHours": 3,
                  "freshness": "perishable",
                  "id": "beijing-forbidden-city",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "beijing-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Entry is by timed, passport-linked reservation and the site is closed on many Mondays; book on the official Palace Museum channel well ahead and carry the passport you booked with.",
                    "fr": "L’entrée se fait sur réservation horodatée liée au passeport et le site ferme souvent le lundi ; réservez longtemps à l’avance sur le canal officiel du musée du Palais et présentez le passeport utilisé pour la réservation.",
                  },
                  "title": {
                    "en": "Forbidden City (Palace Museum)",
                    "fr": "Cité interdite (musée du Palais)",
                  },
                },
                "destinationId": "beijing",
              },
              {
                "attraction": {
                  "area": {
                    "en": "Huairou District, about 70 km from the centre",
                    "fr": "District de Huairou, à environ 70 km du centre",
                  },
                  "category": "history",
                  "description": {
                    "en": "A restored, forested section of the Ming Great Wall with sweeping ridge views and a cable car or chairlift to the ramparts. It is a popular but less crowded alternative to Badaling.",
                    "fr": "Une section restaurée et boisée de la Grande Muraille Ming, avec de larges panoramas sur les crêtes et un téléphérique ou un télésiège jusqu’aux remparts. Une alternative prisée mais moins fréquentée que Badaling.",
                  },
                  "durationHours": 5,
                  "freshness": "perishable",
                  "id": "beijing-great-wall-mutianyu",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "beijing-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Cable-car, shuttle, and last-entry times shift by season, so confirm opening hours and ticket options on the official site the day before. There is little shade on the wall: bring water and sun protection.",
                    "fr": "Les horaires du téléphérique, de la navette et de la dernière entrée varient selon la saison : vérifiez les horaires et les billets sur le site officiel la veille. Il y a peu d’ombre sur la muraille : emportez de l’eau et une protection solaire.",
                  },
                  "title": {
                    "en": "Great Wall at Mutianyu",
                    "fr": "Grande Muraille à Mutianyu",
                  },
                },
                "destinationId": "beijing",
              },
            ],
            "dayNumber": 1,
            "destinationId": "beijing",
            "kind": "attraction",
          },
          {
            "attractions": [
              {
                "attraction": {
                  "area": {
                    "en": "Dongcheng, Wangfujing",
                    "fr": "Dongcheng, Wangfujing",
                  },
                  "category": "food",
                  "description": {
                    "en": "A pedestrian shopping street with a snack lane of skewers, dumplings, and sweets. Beyond the tourist snacks, nearby side streets serve solid Beijing staples such as zhajiangmian noodles and roast duck.",
                    "fr": "Une rue piétonne commerçante avec une allée de snacks : brochettes, raviolis et douceurs. Au-delà des en-cas touristiques, les ruelles voisines servent de solides classiques pékinois comme les nouilles zhajiangmian et le canard laqué.",
                  },
                  "durationHours": 2,
                  "freshness": "stable",
                  "id": "beijing-wangfujing-snacks",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "beijing-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Prices on the main snack lane are tourist-oriented; walk one block off the pedestrian street for better value and calmer seating.",
                    "fr": "Les prix de l’allée principale visent les touristes ; éloignez-vous d’une rue pour un meilleur rapport qualité-prix et plus de calme.",
                  },
                  "title": {
                    "en": "Wangfujing food street",
                    "fr": "Rue gourmande de Wangfujing",
                  },
                },
                "destinationId": "beijing",
              },
            ],
            "dayNumber": 2,
            "destinationId": "beijing",
            "kind": "attraction",
          },
          {
            "arrivalAttractions": [
              {
                "attraction": {
                  "area": {
                    "en": "Yanta District, Ci’en Temple",
                    "fr": "District de Yanta, temple Ci’en",
                  },
                  "category": "history",
                  "description": {
                    "en": "A seventh-century Buddhist pagoda built to house scriptures brought back by the monk Xuanzang, standing over the lively north and south squares with nightly fountain shows.",
                    "fr": "Une pagode bouddhiste du VIIe siècle construite pour abriter les textes rapportés par le moine Xuanzang, dominant les animées places nord et sud et leurs spectacles de fontaines.",
                  },
                  "durationHours": 2,
                  "freshness": "perishable",
                  "id": "xian-big-wild-goose-pagoda",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "xian-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "The temple and pagoda require tickets to climb; the squares are free and busiest around the evening fountain display.",
                    "fr": "Le temple et la pagode demandent un billet pour monter ; les places sont gratuites et plus animées autour du spectacle de fontaines du soir.",
                  },
                  "title": {
                    "en": "Big Wild Goose Pagoda",
                    "fr": "Grande Pagode de l’Oie sauvage",
                  },
                },
                "destinationId": "xian",
              },
            ],
            "dayNumber": 3,
            "destinationId": "xian",
            "kind": "travel",
            "leg": {
              "fromDestinationId": "beijing",
              "options": [
                {
                  "freshness": "perishable",
                  "id": "xian-arrival-air",
                  "lastChecked": "2026-10-08",
                  "mode": "air",
                  "notes": {
                    "en": "Xianyang International Airport (XIY) connects to the city by an intercity airport line and buses; timetables and fares change, so confirm on the official airport or metro site.",
                    "fr": "L’aéroport international de Xianyang (XIY) relie la ville par une ligne intercités et des navettes ; horaires et tarifs changent, vérifiez sur le site officiel de l’aéroport ou du métro.",
                  },
                  "origin": "curated",
                  "sourceIds": [
                    "xian-gov",
                    "mct-china",
                  ],
                  "title": {
                    "en": "Arrive by air",
                    "fr": "Arriver par avion",
                  },
                },
                {
                  "freshness": "perishable",
                  "id": "xian-arrival-rail",
                  "lastChecked": "2026-10-08",
                  "mode": "rail",
                  "notes": {
                    "en": "Xi’an North handles high-speed trains to Beijing, Chengdu, and beyond. Book on 12306 with your passport and arrive early for ID checks.",
                    "fr": "Xi’an-Nord accueille les trains à grande vitesse vers Pékin, Chengdu et au-delà. Réservez sur 12306 avec votre passeport et arrivez tôt pour les contrôles d’identité.",
                  },
                  "origin": "curated",
                  "sourceIds": [
                    "rail-12306",
                    "xian-gov",
                  ],
                  "title": {
                    "en": "Arrive by high-speed rail",
                    "fr": "Arriver en train à grande vitesse",
                  },
                },
              ],
              "toDestinationId": "xian",
            },
          },
          {
            "attractions": [
              {
                "attraction": {
                  "area": {
                    "en": "Beilin, encircling the old city",
                    "fr": "Beilin, ceinturant la vieille ville",
                  },
                  "category": "history",
                  "description": {
                    "en": "A complete 14th-century Ming wall running about 14 km around the old city, wide enough to cycle along the top. Gates and watchtowers frame views over both the historic grid and the modern skyline.",
                    "fr": "Une muraille Ming complète du XIVe siècle, longue d’environ 14 km autour de la vieille ville, assez large pour y rouler à vélo. Portes et tours encadrent des vues sur la trame historique et le skyline moderne.",
                  },
                  "durationHours": 2,
                  "freshness": "perishable",
                  "id": "xian-city-wall",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "xian-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Bike rental points sit at several gates, and sunset from the south gate is a highlight; rental and gate opening hours shift, so check locally.",
                    "fr": "Des points de location de vélos se trouvent à plusieurs portes, et le coucher de soleil depuis la porte sud est un moment fort ; horaires de location et d’ouverture varient, renseignez-vous sur place.",
                  },
                  "title": {
                    "en": "Xi’an City Wall",
                    "fr": "Muraille de Xi’an",
                  },
                },
                "destinationId": "xian",
              },
              {
                "attraction": {
                  "area": {
                    "en": "Lintong District, about 40 km east of the city",
                    "fr": "District de Lintong, à environ 40 km à l’est",
                  },
                  "category": "history",
                  "description": {
                    "en": "Thousands of life-size soldiers, horses, and chariots buried to guard the tomb of China’s first emperor, Qin Shi Huang. The three excavation pits are displayed in vast hangars, with ongoing conservation work.",
                    "fr": "Des milliers de soldats, chevaux et chars grandeur nature enterrés pour garder le tombeau du premier empereur, Qin Shi Huang. Les trois fosses sont présentées dans d’immenses hangars, avec un travail de conservation en cours.",
                  },
                  "durationHours": 4,
                  "freshness": "perishable",
                  "id": "xian-terracotta-army",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "xian-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Opening hours and ticket release change by season and the site is very busy; reserve on the official ticketing channel in advance and carry your passport. Pair the visit with the nearby Lintong sites.",
                    "fr": "Les horaires et la mise en vente des billets varient selon la saison et le site est très fréquenté ; réservez à l’avance sur le canal officiel et présentez votre passeport. Combinez la visite avec les sites voisins de Lintong.",
                  },
                  "title": {
                    "en": "Terracotta Army",
                    "fr": "Armée de terre cuite",
                  },
                },
                "destinationId": "xian",
              },
            ],
            "dayNumber": 4,
            "destinationId": "xian",
            "kind": "attraction",
          },
          {
            "attractions": [
              {
                "attraction": {
                  "area": {
                    "en": "Lianhu, around the Great Mosque",
                    "fr": "Lianhu, autour de la Grande Mosquée",
                  },
                  "category": "food",
                  "description": {
                    "en": "A dense network of lanes around the Great Mosque where the Hui community serves lamb skewers, roujiamo (braised-meat flatbread), and hand-pulled biangbiang noodles.",
                    "fr": "Un dense lacis de ruelles autour de la Grande Mosquée où la communauté hui sert brochettes d’agneau, roujiamo (galette au porc braisé) et nouilles biangbiang étirées à la main.",
                  },
                  "durationHours": 2,
                  "freshness": "stable",
                  "id": "xian-muslim-quarter",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "xian-gov",
                    "mct-china",
                  ],
                  "tips": {
                    "en": "Most stalls take mobile payment rather than cash; eat where the queues are local and go early in the evening for the freshest food.",
                    "fr": "La plupart des étals acceptent le paiement mobile plutôt que les espèces ; mangez là où la file est locale et venez tôt le soir pour la nourriture la plus fraîche.",
                  },
                  "title": {
                    "en": "Muslim Quarter",
                    "fr": "Quartier musulman",
                  },
                },
                "destinationId": "xian",
              },
            ],
            "dayNumber": 5,
            "destinationId": "xian",
            "kind": "attraction",
          },
        ],
        "disclaimers": [
          {
            "destinationId": null,
            "fact": {
              "disclaimer": true,
              "freshness": "perishable",
              "id": "country-visa-entry",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "nia-china",
                "gov-cn",
              ],
              "title": {
                "en": "Entry rules vary by nationality and change often: check your visa or visa-free eligibility, passport validity, and any required onward ticket or proof of accommodation before booking. Rules and fees are set by Chinese authorities and should be confirmed on the official National Immigration Administration or embassy site, not by this reference-only summary.",
                "fr": "Les règles d’entrée varient selon la nationalité et changent souvent : vérifiez votre éligibilité au visa ou à l’exemption de visa, la validité du passeport et tout billet de continuation ou justificatif d’hébergement exigé avant de réserver. Les règles et frais sont fixés par les autorités chinoises et doivent être confirmés sur le site officiel de l’Administration nationale de l’immigration ou de l’ambassade, et non par ce résumé indicatif.",
              },
            },
            "kind": "visaEntry",
          },
          {
            "destinationId": null,
            "fact": {
              "disclaimer": true,
              "freshness": "stable",
              "id": "country-safety",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "gov-cn",
                "mps-china",
              ],
              "title": {
                "en": "China is generally safe for travelers, including at night in major cities, but keep normal precautions: watch valuables in crowds, use licensed taxis or ride-hailing apps, and keep your passport secure. Save your embassy or consulate contact. In an emergency, dial 110 for police, 120 for an ambulance, and 119 for the fire service.",
                "fr": "La Chine est généralement sûre pour les voyageurs, y compris la nuit dans les grandes villes, mais gardez les précautions d’usage : surveillez vos objets dans les foules, utilisez des taxis agréés ou des applications de VTC et conservez votre passeport en lieu sûr. Enregistrez le contact de votre ambassade ou consulat. En urgence, composez le 110 (police), 120 (ambulance) et 119 (pompiers).",
              },
            },
            "kind": "safety",
          },
        ],
        "legs": [
          {
            "fromDestinationId": null,
            "options": [
              {
                "freshness": "perishable",
                "id": "beijing-arrival-air",
                "lastChecked": "2026-10-08",
                "mode": "air",
                "notes": {
                  "en": "Beijing Capital (PEK) and Daxing (PKX) airports both connect to the city by express rail and metro; airport express operating hours and fares can change, so confirm on the official metro/airport site.",
                  "fr": "Les aéroports de Pékin-Capitale (PEK) et Daxing (PKX) relient la ville par train express et métro ; les horaires et tarifs pouvant changer, vérifiez sur le site officiel du métro ou de l’aéroport.",
                },
                "origin": "curated",
                "sourceIds": [
                  "beijing-gov",
                  "mct-china",
                ],
                "title": {
                  "en": "Arrive by air",
                  "fr": "Arriver par avion",
                },
              },
              {
                "freshness": "perishable",
                "id": "beijing-arrival-rail",
                "lastChecked": "2026-10-08",
                "mode": "rail",
                "notes": {
                  "en": "High-speed trains from Shanghai, Xi’an, and many other cities arrive at Beijing South or Beijing West. Book seats on 12306 with your passport and allow time for passport checks at the gate.",
                  "fr": "Les trains à grande vitesse en provenance de Shanghai, Xi’an et bien d’autres villes arrivent à Pékin-Sud ou Pékin-Ouest. Réservez sur 12306 avec votre passeport et prévoyez du temps pour les contrôles à l’entrée.",
                },
                "origin": "curated",
                "sourceIds": [
                  "rail-12306",
                  "beijing-gov",
                ],
                "title": {
                  "en": "Arrive by high-speed rail",
                  "fr": "Arriver en train à grande vitesse",
                },
              },
            ],
            "toDestinationId": "beijing",
          },
          {
            "fromDestinationId": "beijing",
            "options": [
              {
                "freshness": "perishable",
                "id": "xian-arrival-air",
                "lastChecked": "2026-10-08",
                "mode": "air",
                "notes": {
                  "en": "Xianyang International Airport (XIY) connects to the city by an intercity airport line and buses; timetables and fares change, so confirm on the official airport or metro site.",
                  "fr": "L’aéroport international de Xianyang (XIY) relie la ville par une ligne intercités et des navettes ; horaires et tarifs changent, vérifiez sur le site officiel de l’aéroport ou du métro.",
                },
                "origin": "curated",
                "sourceIds": [
                  "xian-gov",
                  "mct-china",
                ],
                "title": {
                  "en": "Arrive by air",
                  "fr": "Arriver par avion",
                },
              },
              {
                "freshness": "perishable",
                "id": "xian-arrival-rail",
                "lastChecked": "2026-10-08",
                "mode": "rail",
                "notes": {
                  "en": "Xi’an North handles high-speed trains to Beijing, Chengdu, and beyond. Book on 12306 with your passport and arrive early for ID checks.",
                  "fr": "Xi’an-Nord accueille les trains à grande vitesse vers Pékin, Chengdu et au-delà. Réservez sur 12306 avec votre passeport et arrivez tôt pour les contrôles d’identité.",
                },
                "origin": "curated",
                "sourceIds": [
                  "rail-12306",
                  "xian-gov",
                ],
                "title": {
                  "en": "Arrive by high-speed rail",
                  "fr": "Arriver en train à grande vitesse",
                },
              },
            ],
            "toDestinationId": "xian",
          },
        ],
        "meta": {
          "contentVersion": "travel-2026-10-08",
          "freeDays": 0,
          "generatedAt": "GENERATED_AT",
          "lastVerified": "2026-10-08",
        },
        "practical": {
          "byDestination": [
            {
              "destinationId": "beijing",
              "practical": {
                "connectivity": {
                  "freshness": "stable",
                  "id": "beijing-practical-connectivity",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "A local SIM or eSIM bought with your passport gives the best data coverage; station and café Wi-Fi exists but is less reliable. Plan for any restricted apps before arrival.",
                    "fr": "Une carte SIM locale ou un eSIM acheté avec votre passeport offre la meilleure couverture data ; le Wi-Fi des gares et cafés existe mais reste moins fiable. Préparez vos applications restreintes avant l’arrivée.",
                  },
                },
                "emergencyNumbers": {
                  "freshness": "stable",
                  "id": "beijing-practical-emergency",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Dial 110 for police, 120 for an ambulance, 119 for fire, and 122 for traffic police.",
                    "fr": "Composez le 110 (police), 120 (ambulance), 119 (pompiers) et 122 (police de la route).",
                  },
                },
                "etiquette": {
                  "freshness": "stable",
                  "id": "beijing-practical-etiquette",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Greet with a nod or a slight bow, offer and receive items with both hands, and dress modestly at temples. Tipping is not expected; a service charge is rare.",
                    "fr": "Saluez d’un signe de tête ou d’une légère inclinaison, offrez et recevez les objets avec les deux mains et couvrez-vous aux temples. Le pourboire n’est pas attendu ; le service est rarement facturé.",
                  },
                },
                "payments": {
                  "freshness": "stable",
                  "id": "beijing-practical-payments",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Mobile payments are the default in shops, cafés, and taxis; set up Alipay or WeChat Pay and keep a little cash for the rare cash-only stall. Larger hotels and malls usually accept international cards.",
                    "fr": "Les paiements mobiles sont la norme dans les commerces, cafés et taxis ; configurez Alipay ou WeChat Pay et gardez un peu d’espèces pour les rares étals sans terminal. Les grands hôtels et centres commerciaux acceptent généralement les cartes internationales.",
                  },
                },
                "safety": {
                  "disclaimer": true,
                  "freshness": "stable",
                  "id": "beijing-practical-safety",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "The city is generally safe day and night, but watch belongings in crowded sights and use licensed taxis or ride-hailing. In an emergency dial 110 (police), 120 (ambulance), or 119 (fire).",
                    "fr": "La ville est généralement sûre de jour comme de nuit, mais surveillez vos affaires dans les sites bondés et utilisez des taxis agréés ou une application de VTC. En urgence, composez le 110 (police), 120 (ambulance) ou 119 (pompiers).",
                  },
                },
                "visaEntry": {
                  "disclaimer": true,
                  "freshness": "perishable",
                  "id": "beijing-practical-visa-entry",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Visa and entry requirements depend on your nationality and can change; confirm current rules with the official immigration authority or your embassy before travel.",
                    "fr": "Les exigences de visa et d’entrée dépendent de votre nationalité et peuvent changer ; confirmez les règles en vigueur auprès de l’autorité officielle d’immigration ou de votre ambassade avant le départ.",
                  },
                },
              },
            },
            {
              "destinationId": "xian",
              "practical": {
                "connectivity": {
                  "freshness": "stable",
                  "id": "xian-practical-connectivity",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "A local SIM or eSIM bought with your passport gives the best data coverage; station and café Wi-Fi exists but is less reliable. Plan for any restricted apps before arrival.",
                    "fr": "Une carte SIM locale ou un eSIM acheté avec votre passeport offre la meilleure couverture data ; le Wi-Fi des gares et cafés existe mais reste moins fiable. Préparez vos applications restreintes avant l’arrivée.",
                  },
                },
                "emergencyNumbers": {
                  "freshness": "stable",
                  "id": "xian-practical-emergency",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Dial 110 for police, 120 for an ambulance, 119 for fire, and 122 for traffic police.",
                    "fr": "Composez le 110 (police), 120 (ambulance), 119 (pompiers) et 122 (police de la route).",
                  },
                },
                "etiquette": {
                  "freshness": "stable",
                  "id": "xian-practical-etiquette",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Greet with a nod or a slight bow, offer and receive items with both hands, and dress modestly at temples. Tipping is not expected; a service charge is rare.",
                    "fr": "Saluez d’un signe de tête ou d’une légère inclinaison, offrez et recevez les objets avec les deux mains et couvrez-vous aux temples. Le pourboire n’est pas attendu ; le service est rarement facturé.",
                  },
                },
                "payments": {
                  "freshness": "stable",
                  "id": "xian-practical-payments",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Mobile payments are the default in shops, cafés, and taxis; set up Alipay or WeChat Pay and keep a little cash for the rare cash-only stall. Larger hotels and malls usually accept international cards.",
                    "fr": "Les paiements mobiles sont la norme dans les commerces, cafés et taxis ; configurez Alipay ou WeChat Pay et gardez un peu d’espèces pour les rares étals sans terminal. Les grands hôtels et centres commerciaux acceptent généralement les cartes internationales.",
                  },
                },
                "safety": {
                  "disclaimer": true,
                  "freshness": "stable",
                  "id": "xian-practical-safety",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "The city is generally safe day and night, but watch belongings in crowded sights and use licensed taxis or ride-hailing. In an emergency dial 110 (police), 120 (ambulance), or 119 (fire).",
                    "fr": "La ville est généralement sûre de jour comme de nuit, mais surveillez vos affaires dans les sites bondés et utilisez des taxis agréés ou une application de VTC. En urgence, composez le 110 (police), 120 (ambulance) ou 119 (pompiers).",
                  },
                },
                "visaEntry": {
                  "disclaimer": true,
                  "freshness": "perishable",
                  "id": "xian-practical-visa-entry",
                  "lastChecked": "2026-10-08",
                  "origin": "curated",
                  "sourceIds": [
                    "nia-china",
                    "gov-cn",
                    "mps-china",
                  ],
                  "title": {
                    "en": "Visa and entry requirements depend on your nationality and can change; confirm current rules with the official immigration authority or your embassy before travel.",
                    "fr": "Les exigences de visa et d’entrée dépendent de votre nationalité et peuvent changer ; confirmez les règles en vigueur auprès de l’autorité officielle d’immigration ou de votre ambassade avant le départ.",
                  },
                },
              },
            },
          ],
          "country": {
            "connectivity": {
              "freshness": "stable",
              "id": "country-connectivity",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "miit-china",
                "mct-china",
              ],
              "title": {
                "en": "Buy a local SIM or eSIM at the airport or an official carrier store (China Mobile, China Unicom, China Telecom); registration needs your passport. Many Western apps and sites are restricted on local networks, so arrange any access you rely on before you travel. Wi-Fi is common in hotels, cafés, and stations.",
                "fr": "Achetez une carte SIM locale ou un eSIM à l’aéroport ou dans une boutique officielle (China Mobile, China Unicom, China Telecom) ; l’enregistrement exige votre passeport. De nombreuses applications et sites occidentaux sont restreints sur les réseaux locaux : préparez vos accès avant le départ. Le Wi-Fi est courant dans les hôtels, cafés et gares.",
              },
            },
            "emergencyNumbers": {
              "freshness": "stable",
              "id": "country-emergency",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "mps-china",
                "gov-cn",
              ],
              "title": {
                "en": "Key emergency numbers: 110 police, 120 ambulance, 119 fire, 122 traffic police. The 12308 hotline is the Chinese foreign ministry’s helpline for consular protection of Chinese citizens; foreign travelers should instead contact their own embassy or consulate.",
                "fr": "Numéros d’urgence principaux : 110 police, 120 ambulance, 119 pompiers, 122 police de la route. La ligne 12308 est le service d’assistance consulaire du ministère chinois des Affaires étrangères pour les citoyens chinois ; les voyageurs étrangers doivent contacter leur propre ambassade ou consulat.",
              },
            },
            "etiquette": {
              "freshness": "stable",
              "id": "country-etiquette",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "mct-china",
                "gov-cn",
              ],
              "title": {
                "en": "Greetings are polite but often reserved. Offer and receive business cards, gifts, or a cup of tea with both hands. Queueing is looser than in Europe and personal space is smaller; stay patient rather than confrontational. Tipping is not expected, and modest dress is appreciated at temples and religious sites.",
                "fr": "Les salutations sont polies mais souvent réservées. Offrez et recevez cartes de visite, cadeaux ou une tasse de thé avec les deux mains. Les files sont plus souples qu’en Europe et l’espace personnel plus réduit : restez patient plutôt que conflictuel. Le pourboire n’est pas attendu et une tenue sobre est appréciée dans les temples et lieux religieux.",
              },
            },
            "payments": {
              "freshness": "stable",
              "id": "country-payments",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "pboc",
                "mct-china",
              ],
              "title": {
                "en": "Mobile payments (Alipay, WeChat Pay) are accepted almost everywhere, from metro gates to street stalls; major international cards can now usually be linked. Visa and Mastercard are accepted mainly at larger hotels, malls, and airports, so keep a small cash backup for small vendors.",
                "fr": "Les paiements mobiles (Alipay, WeChat Pay) sont acceptés presque partout, du métro aux étals de rue ; les grandes cartes internationales peuvent désormais généralement être liées. Visa et Mastercard sont surtout acceptées dans les grands hôtels, centres commerciaux et aéroports : gardez un peu d’espèces en secours pour les petits commerçants.",
              },
            },
            "safety": {
              "disclaimer": true,
              "freshness": "stable",
              "id": "country-safety",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "gov-cn",
                "mps-china",
              ],
              "title": {
                "en": "China is generally safe for travelers, including at night in major cities, but keep normal precautions: watch valuables in crowds, use licensed taxis or ride-hailing apps, and keep your passport secure. Save your embassy or consulate contact. In an emergency, dial 110 for police, 120 for an ambulance, and 119 for the fire service.",
                "fr": "La Chine est généralement sûre pour les voyageurs, y compris la nuit dans les grandes villes, mais gardez les précautions d’usage : surveillez vos objets dans les foules, utilisez des taxis agréés ou des applications de VTC et conservez votre passeport en lieu sûr. Enregistrez le contact de votre ambassade ou consulat. En urgence, composez le 110 (police), 120 (ambulance) et 119 (pompiers).",
              },
            },
            "visaEntry": {
              "disclaimer": true,
              "freshness": "perishable",
              "id": "country-visa-entry",
              "lastChecked": "2026-10-08",
              "origin": "curated",
              "sourceIds": [
                "nia-china",
                "gov-cn",
              ],
              "title": {
                "en": "Entry rules vary by nationality and change often: check your visa or visa-free eligibility, passport validity, and any required onward ticket or proof of accommodation before booking. Rules and fees are set by Chinese authorities and should be confirmed on the official National Immigration Administration or embassy site, not by this reference-only summary.",
                "fr": "Les règles d’entrée varient selon la nationalité et changent souvent : vérifiez votre éligibilité au visa ou à l’exemption de visa, la validité du passeport et tout billet de continuation ou justificatif d’hébergement exigé avant de réserver. Les règles et frais sont fixés par les autorités chinoises et doivent être confirmés sur le site officiel de l’Administration nationale de l’immigration ou de l’ambassade, et non par ce résumé indicatif.",
              },
            },
          },
        },
        "stays": [
          {
            "destinationId": "beijing",
            "destinationName": {
              "en": "Beijing",
              "fr": "Pékin",
            },
            "stayArea": {
              "bestFor": [
                "history",
                "food",
              ],
              "freshness": "stable",
              "id": "beijing-stay-dongcheng",
              "lastChecked": "2026-10-08",
              "name": {
                "en": "Dongcheng / Yonghegong hutongs",
                "fr": "Dongcheng / hutongs de Yonghegong",
              },
              "origin": "curated",
              "priceTier": "mid",
              "sourceIds": [
                "beijing-gov",
                "mct-china",
              ],
              "title": {
                "en": "Dongcheng and the hutongs",
                "fr": "Dongcheng et les hutongs",
              },
              "transportNotes": {
                "en": "Metro lines 2 and 5 run nearby; many sights are walkable, but allow time for lane exploring.",
                "fr": "Les lignes 2 et 5 du métro passent à proximité ; de nombreux sites sont accessibles à pied, mais prévoyez du temps pour flâner dans les ruelles.",
              },
              "vibe": {
                "en": "Historic low-rise lanes, courtyard guesthouses, and easy walking access to the Forbidden City and Drum and Bell Towers.",
                "fr": "Ruelles basses historiques, maisons d’hôtes avec cour et accès à pied à la Cité interdite et aux tours du Tambour et de la Cloche.",
              },
            },
          },
          {
            "destinationId": "xian",
            "destinationName": {
              "en": "Xi’an",
              "fr": "Xi’an",
            },
            "stayArea": {
              "bestFor": [
                "history",
                "food",
              ],
              "freshness": "stable",
              "id": "xian-stay-bell-tower",
              "lastChecked": "2026-10-08",
              "name": {
                "en": "Bell Tower / Drum Tower",
                "fr": "Tour de la Cloche / tour du Tambour",
              },
              "origin": "curated",
              "priceTier": "mid",
              "sourceIds": [
                "xian-gov",
                "mct-china",
              ],
              "title": {
                "en": "Bell Tower and old city",
                "fr": "Tour de la Cloche et vieille ville",
              },
              "transportNotes": {
                "en": "Metro line 2 stops at Bell Tower; much of the old city is walkable or a short taxi ride.",
                "fr": "La ligne 2 s’arrête à la tour de la Cloche ; une bonne partie de la vieille ville se fait à pied ou en court taxi.",
              },
              "vibe": {
                "en": "Central, walkable, and inside the wall, with the Muslim Quarter and City Wall gates on your doorstep.",
                "fr": "Central, à l’intérieur de la muraille et à deux pas du quartier musulman et des portes de la muraille.",
              },
            },
          },
        ],
        "summary": {
          "budget": "mid",
          "entries": [
            {
              "allocatedDays": 2,
              "attractionDays": 2,
              "destinationId": "beijing",
              "freeDays": 0,
              "name": {
                "en": "Beijing",
                "fr": "Pékin",
              },
              "stayAreaId": "beijing-stay-dongcheng",
            },
            {
              "allocatedDays": 3,
              "attractionDays": 2,
              "destinationId": "xian",
              "freeDays": 0,
              "name": {
                "en": "Xi’an",
                "fr": "Xi’an",
              },
              "stayAreaId": "xian-stay-bell-tower",
            },
          ],
          "freeDays": 0,
          "interests": [
            "history",
            "food",
          ],
          "language": "fr",
          "pace": "standard",
          "title": {
            "en": "Beijing · Xi’an",
            "fr": "Pékin · Xi’an",
          },
          "totalDays": 5,
        },
      }
    `)
  })
})

describe('day allocation', () => {
  it('gives a single city every requested day', () => {
    const itinerary = build({ destinations: ['beijing'], days: 5 })
    expect(itinerary.days).toHaveLength(5)
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 5 })
  })

  it('reserves one day per destination for an even three-city split', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 6,
      interests: [],
    })
    expect(itinerary.days).toHaveLength(6)
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 2, xian: 2, shanghai: 2 })
  })

  it('distributes the largest remainders by input order with interest weights', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 8,
      interests: ['history'],
    })
    expect(allocationByDestination(itinerary)).toEqual({ beijing: 3, xian: 3, shanghai: 2 })
    expect(itinerary.days).toHaveLength(8)
  })

  it('never drops a requested day', () => {
    for (const days of [1, 4, 7, 13, 21]) {
      expect(build({ destinations: ['beijing'], days }).days).toHaveLength(days)
    }
  })
})

describe('pace caps and no repeats', () => {
  it.each(['relaxed', 'standard', 'packed'] as const)('respects the %s pace cap', (pace) => {
    const itinerary = build({ destinations: ['beijing'], days: 6, interests: [], pace })
    const attractionDays = itinerary.days.filter((day) => day.kind === 'attraction')
    expect(attractionDays.length).toBeGreaterThan(0)
    for (const day of attractionDays) {
      expect(day.attractions.length).toBeGreaterThan(0)
      expect(day.attractions.length).toBeLessThanOrEqual(paceCap(pace))
    }
  })

  it('schedules no duplicate attractions on a multi-city itinerary with a travel day', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 9,
      interests: [],
      pace: 'packed',
    })
    const ids = scheduled(itinerary).map((item) => item.attraction.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(itinerary.days.some((day) => day.kind === 'travel')).toBe(true)
  })

  it('schedules at most N_d attractions from each city', () => {
    const itinerary = build({
      destinations: ['beijing', 'xian', 'shanghai'],
      days: 12,
      interests: [],
      pace: 'packed',
    })
    for (const entry of itinerary.summary.entries) {
      const destination = travelContent.destinations.find(
        (candidate) => candidate.id === entry.destinationId,
      )!
      const ids = scheduledIdsForDestination(itinerary, entry.destinationId)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids.length).toBeLessThanOrEqual(usable(destination, []).length)
    }
  })

  it('draws the arrival half-day from the same list without reducing capacity incorrectly', () => {
    const itinerary = build({
      destinations: ['xian', 'beijing'],
      days: 4,
      interests: ['history'],
      pace: 'standard',
    })
    const travelDay = itinerary.days.find(
      (day) => day.kind === 'travel' && day.destinationId === 'beijing',
    )
    expect(travelDay?.kind).toBe('travel')
    if (travelDay?.kind !== 'travel') {
      throw new Error('expected a travel day')
    }
    expect(travelDay.arrivalAttractions).toHaveLength(1)
    // beijing has two history attractions; both are scheduled exactly once.
    expect(scheduledIdsForDestination(itinerary, 'beijing')).toHaveLength(2)
    expect(new Set(scheduledIdsForDestination(itinerary, 'beijing')).size).toBe(2)
  })
})

describe('stay areas, free days and validation failures', () => {
  it('selects a different stay area when the budget changes', () => {
    const mid = build({ destinations: ['beijing'], days: 3, budget: 'mid' })
    const comfort = build({ destinations: ['beijing'], days: 3, budget: 'comfort' })
    expect(mid.stays[0].stayArea.id).toBe('beijing-stay-dongcheng')
    expect(comfort.stays[0].stayArea.id).toBe('beijing-stay-sanlitun')
    expect(mid.stays[0].stayArea.id).not.toBe(comfort.stays[0].stayArea.id)
  })

  it('falls back to the nearest tier when no stay matches the budget', () => {
    const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
    expect(selectStayArea(beijing, request({ budget: 'budget' })).id).toBe('beijing-stay-dongcheng')
  })

  it('renders over-capacity days as free days instead of erroring', () => {
    const itinerary = build({ destinations: ['beijing'], days: 21, interests: [], pace: 'standard' })
    expect(itinerary.days).toHaveLength(21)
    expect(itinerary.meta.freeDays).toBe(18)
    expect(itinerary.summary.freeDays).toBe(18)
    expect(itinerary.days.filter((day) => day.kind === 'free')).toHaveLength(18)
  })

  it('carries provenance on every scheduled attraction', () => {
    const itinerary = build({ destinations: ['beijing', 'xian'], days: 6 })
    for (const item of scheduled(itinerary)) {
      expect(item.attraction.origin).toBe('curated')
      expect(item.attraction.sourceIds.length).toBeGreaterThanOrEqual(1)
      expect(item.attraction.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('rejects a request with fewer days than destinations', () => {
    expect(() => build({ destinations: ['beijing', 'xian'], days: 1 })).toThrow(
      TravelRequestValidationError,
    )
  })

  it('rejects an invalid request (out-of-range days)', () => {
    expect(() => build({ destinations: ['beijing'], days: 0 })).toThrow(
      TravelRequestValidationError,
    )
  })

  it('rejects an unknown destination', () => {
    const destinations = ['beijing', 'atlantis'] as unknown as TravelDestinationId[]
    expect(() => build({ destinations, days: 3 })).toThrow(TravelRequestValidationError)
  })
})
