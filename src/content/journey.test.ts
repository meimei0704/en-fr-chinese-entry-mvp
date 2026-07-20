import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodes, journeyStages } from './journey'

describe('journey content', () => {
  it('exposes the B1 arrival-in-China loop as three lessons plus two previews', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual(['arrival-in-china'])

    const lessonNodes = journeyNodes.filter((node) => node.kind === 'lesson')
    const previewNodes = journeyNodes.filter((node) => node.kind === 'preview')

    expect(journeyNodes.map((node) => node.pathOrder)).toEqual([1, 2, 3, 4, 5])
    expect(lessonNodes).toHaveLength(3)
    expect(previewNodes).toHaveLength(2)
    expect(lessonNodes.map((node) => node.lessonId)).toEqual([
      'self-intro',
      'ask-directions',
      'order-food',
    ])
    expect(lessonNodes.map((node) => node.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(previewNodes.every((node) => node.lessonId === undefined)).toBe(true)
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
