import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodes, journeyStages } from './journey'

describe('journey content', () => {
  it('exposes the B1 arrival-in-China loop as five official lessons with no preview nodes', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])

    const lessonNodes = journeyNodes.filter((node) => node.kind === 'lesson')
    const previewNodes = journeyNodes.filter((node) => node.kind === 'preview')

    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5])
    expect(journeyNodes.map((node) => node.id)).toEqual([
      'airport-immigration',
      'taxi-to-stay',
      'hotel-check-in',
      'phone-and-payment',
      'convenience-store-run',
    ])
    expect(lessonNodes).toHaveLength(5)
    expect(previewNodes).toHaveLength(0)
    expect(lessonNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(journeyNodes.every((node) => node.previewDetails === undefined)).toBe(true)
  })

  it('pins the arrival path copy to immigration, taxi, check-in, phone payment, and convenience store', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual([
      'Airport immigration basics',
      'Taxi to your stay',
      'Hotel / apartment check-in',
      'Phone number & mobile payment',
      'First convenience store run',
    ])

    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'fr'))).toEqual([
      'Bases de l’immigration à l’aéroport',
      'Taxi vers son logement',
      'Check-in hôtel / appartement',
      'Téléphone & paiement mobile',
      'Première course en supérette',
    ])
  })
})
