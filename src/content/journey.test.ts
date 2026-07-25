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
  'Airport immigration basics',
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
  'Bases de l’immigration à l’aéroport',
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
  it('exposes the arrival-in-China path as ten official lessons with no preview nodes', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])

    const lessonNodes = journeyNodes.filter((node) => node.kind === 'lesson')
    const previewNodes = journeyNodes.filter((node) => node.kind === 'preview')

    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(journeyNodes.map((node) => node.id)).toEqual(expectedJourneyNodeIds)
    expect(lessonNodes).toHaveLength(10)
    expect(previewNodes).toHaveLength(0)
    expect(lessonNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(journeyNodes.every((node) => node.previewDetails === undefined)).toBe(true)
  })

  it('pins the EN/FR journey copy and icons for all ten lesson nodes', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual(expectedEnglishTitles)
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'fr'))).toEqual(expectedFrenchTitles)
    expect(journeyNodeIcons).toEqual({
      'airport-immigration': '🛂',
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
