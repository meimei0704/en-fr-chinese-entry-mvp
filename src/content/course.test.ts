import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const expectedDialogueAudioByLesson = {
  'self-intro': [
    '/audio/self-intro/line-01.mp3',
    '/audio/self-intro/line-02.mp3',
    '/audio/self-intro/line-03.mp3',
    '/audio/self-intro/line-04.mp3',
  ],
  'order-food': [
    '/audio/order-food/line-01.mp3',
    '/audio/order-food/line-02.mp3',
    '/audio/order-food/line-03.mp3',
    '/audio/order-food/line-04.mp3',
    '/audio/order-food/line-05.mp3',
  ],
  'ask-directions': [
    '/audio/ask-directions/line-01.mp3',
    '/audio/ask-directions/line-02.mp3',
    '/audio/ask-directions/line-03.mp3',
    '/audio/ask-directions/line-04.mp3',
    '/audio/ask-directions/line-05.mp3',
  ],
} as const

const expectedShortInputAudioByLesson = {
  'self-intro': '/audio/self-intro/short-input-01.mp3',
  'order-food': '/audio/order-food/short-input-01.mp3',
  'ask-directions': '/audio/ask-directions/short-input-01.mp3',
} as const

async function collectAudioPaths() {
  const { course } = await import('./course')

  return course.lessons.flatMap((lesson) => [
    ...lesson.dialogue.lines.map((line) => line.audio),
    lesson.shortInput.audio,
  ])
}

describe('course content', () => {
  it('exposes three lessons with bilingual explanations and static audio paths', async () => {
    const { course } = await import('./course')

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons).toHaveLength(3)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual([
      'self-intro',
      'order-food',
      'ask-directions',
    ])

    const firstLine = course.lessons[0].dialogue.lines[0]
    const firstLesson = course.lessons[0] as unknown as {
      title: { en?: string; fr?: string }
      scenario: { en?: string; fr?: string }
    }
    const localizedFirstLine = firstLine as unknown as {
      translation: { en?: string; fr?: string }
    }

    expect(firstLine.explanation.en.length).toBeGreaterThan(0)
    expect(firstLine.explanation.fr.length).toBeGreaterThan(0)
    expect(firstLesson.title.fr?.length ?? 0).toBeGreaterThan(0)
    expect(firstLesson.scenario.fr?.length ?? 0).toBeGreaterThan(0)
    expect(localizedFirstLine.translation.fr?.length ?? 0).toBeGreaterThan(0)
    expect(firstLine.audio).toMatch(/^\/audio\//)

    for (const lesson of course.lessons) {
      expect(lesson.sentencePatterns.length).toBeGreaterThan(0)
      expect(lesson.vocabulary.length).toBeGreaterThan(0)
      expect(lesson.pronunciation.length).toBeGreaterThan(0)
      expect(lesson.hanziRecognition.length).toBeGreaterThan(0)
      expect(lesson.practice.listening.length).toBeGreaterThan(0)
      expect(lesson.practice.speaking.length).toBeGreaterThan(0)
      expect(lesson.practice.reading.length).toBeGreaterThan(0)
      expect(lesson.reviewCards.length).toBeGreaterThan(0)
      expect(lesson.shortInput.audio).toMatch(/^\/audio\//)

      const expectedDialogueAudio = expectedDialogueAudioByLesson[lesson.id]
      const expectedShortInputAudio = expectedShortInputAudioByLesson[lesson.id]

      expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
        expectedDialogueAudio.map((_, index) => `${lesson.id}-line-0${index + 1}`),
      )
      expect(lesson.dialogue.lines.map((line) => line.audio)).toEqual(expectedDialogueAudio)
      expect(lesson.shortInput.id).toBe(`${lesson.id}-short-input-01`)
      expect(lesson.shortInput.audio).toBe(expectedShortInputAudio)
    }

    const directionsLesson = course.lessons.find((lesson) => lesson.id === 'ask-directions')

    expect(directionsLesson?.dialogue.lines).toHaveLength(5)
    expect(directionsLesson?.dialogue.lines.some((line) => line.hanzi.includes('地铁站'))).toBe(true)
    expect(directionsLesson?.dialogue.lines.some((line) => line.hanzi.includes('往左拐'))).toBe(true)
    expect(directionsLesson?.shortInput.target).toBe('站在哪儿？')
  })

  it('ships placeholder audio files for every dialogue and short-input reference', async () => {
    const audioPaths = await collectAudioPaths()

    expect(new Set(audioPaths).size).toBe(audioPaths.length)

    for (const audioPath of audioPaths) {
      const publicPath = `${process.cwd()}/public${audioPath.replace('/audio', '/audio')}`
      expect(existsSync(publicPath), `missing ${audioPath}`).toBe(true)
    }
  })
})
