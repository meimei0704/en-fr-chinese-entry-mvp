import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodeIcons, journeyNodes, journeyStages } from './journey'

const expectedJourneyNodeIds = [
  'airport-immigration',
  'taxi-to-stay',
  'hotel-check-in',
  'phone-and-payment',
  'convenience-store-run',
  'restaurant-order',
  'metro-ticket',
  'pharmacy-help',
  'ask-for-help-problem',
  'train-station-ticket',
] as const

const expectedEnglishTitles = [
  '到达机场 / Arrival at the airport',
  'Taxi to your stay',
  'Hotel / apartment check-in',
  'Phone number & mobile payment',
  'First convenience store run',
  'Order a simple meal',
  'Buy a metro ticket',
  'Ask for help at a pharmacy',
  'Ask for help with a problem',
  'Buy a train station ticket',
]

const expectedFrenchTitles = [
  '到达机场 / Arrivée à l’aéroport',
  'Taxi vers son logement',
  'Check-in hôtel / appartement',
  'Téléphone & paiement mobile',
  'Première course en supérette',
  'Commander un repas simple',
  'Acheter un ticket de métro',
  'Demander de l’aide à la pharmacie',
  'Demander de l’aide pour un problème',
  'Acheter un billet en gare',
]

describe('journey content', () => {
  it('exposes exactly ten ordered lesson nodes and no route node', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])
    expect(journeyNodes).toHaveLength(10)
    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(journeyNodes.map((node) => node.id)).toEqual(expectedJourneyNodeIds)
    expect(journeyNodes.every((node) => node.kind === 'lesson')).toBe(true)
    expect(journeyNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(journeyNodes.every((node) => node.previewDetails === undefined)).toBe(true)
    expect(journeyNodes.every((node) => !Object.hasOwn(node, 'routeDetails'))).toBe(true)
    expect(JSON.stringify(journeyNodes)).not.toContain('/pinyin')
    expect(JSON.stringify(journeyNodes)).not.toContain('pinyin-foundations')
  })

  it('pins the EN/FR Journey copy and icons for the same ten lessons', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual(expectedEnglishTitles)
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'fr'))).toEqual(expectedFrenchTitles)
    expect(journeyNodeIcons).toEqual({
      'airport-immigration': '🧳',
      'taxi-to-stay': '🚕',
      'hotel-check-in': '🏨',
      'phone-and-payment': '📱',
      'convenience-store-run': '🛒',
      'restaurant-order': '🍜',
      'metro-ticket': '🚇',
      'pharmacy-help': '💊',
      'ask-for-help-problem': '🆘',
      'train-station-ticket': '🚄',
    })
  })
})
