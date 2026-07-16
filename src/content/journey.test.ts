import { describe, expect, it } from 'vitest'

import { getLocalizedText } from './copy'
import { course } from './course'
import { journeyNodes, journeyStages } from './journey'

describe('journey content', () => {
  it('layers a fixed journey map beside the existing three-lesson course model', () => {
    expect(journeyStages.map((stage) => stage.id)).toEqual([
      'arrival-and-transit',
      'settling-in',
      'daily-life',
      'work-and-study',
      'health-and-emergency',
    ])

    const lessonNodes = journeyNodes.filter((node) => node.kind === 'lesson')
    const previewNodes = journeyNodes.filter((node) => node.kind === 'preview')

    expect(lessonNodes).toHaveLength(3)
    expect(previewNodes).toHaveLength(5)
    expect(lessonNodes.map((node) => node.lessonId)).toEqual([
      'ask-directions',
      'self-intro',
      'order-food',
    ])
    expect(
      [...lessonNodes].sort(
        (left, right) =>
          course.lessons.findIndex((lesson) => lesson.id === left.lessonId) -
          course.lessons.findIndex((lesson) => lesson.id === right.lessonId),
      ),
    ).toMatchObject(
      course.lessons.map((lesson) => ({
        lessonId: lesson.id,
      })),
    )
    expect(previewNodes.every((node) => node.lessonId === undefined)).toBe(true)
  })

  it('pins the first journey map copy to the owner-approved complete and preview nodes', () => {
    expect(journeyNodes.map((node) => getLocalizedText(node.title, 'en'))).toEqual([
      'Airport arrival',
      'City travel',
      'Getting settled',
      'Meet people',
      'Restaurant ordering',
      'Shopping & payment',
      'Work communication',
      'Clinic & medicine',
    ])
  })
})
