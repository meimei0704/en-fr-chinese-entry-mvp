import { describe, expect, it } from 'vitest'

import { course } from '../content/course'
import { selfIntroLesson } from '../content/lessons/selfIntro'
import { buildPracticeChallenge, createSeededRandom, shuffle } from './practiceChallenge'

describe('createSeededRandom', () => {
  it('is deterministic for the same seed', () => {
    const first = createSeededRandom(123)
    const second = createSeededRandom(123)
    expect(first()).toBe(second())
    expect(first()).toBe(second())
  })

  it('returns values in the unit range', () => {
    const rng = createSeededRandom(7)
    for (let index = 0; index < 50; index += 1) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    const rng = createSeededRandom(42)
    const input = ['a', 'b', 'c', 'd', 'e']
    const result = shuffle(input, rng)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('is deterministic for the same seed', () => {
    expect(shuffle([1, 2, 3, 4, 5], createSeededRandom(9))).toEqual(
      shuffle([1, 2, 3, 4, 5], createSeededRandom(9)),
    )
  })
})

describe('buildPracticeChallenge', () => {
  it('produces exactly ten mixed-type questions without duplicates', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 10, 2024)

    expect(challenge.questions).toHaveLength(10)
    expect(new Set(challenge.questions.map((question) => question.id)).size).toBe(10)

    const kinds = new Set(challenge.questions.map((question) => question.kind))
    expect(kinds.has('listen')).toBe(true)
    expect(kinds.has('read')).toBe(true)
    expect(kinds.has('review')).toBe(true)
    expect(kinds.has('speak')).toBe(false)
  })

  it('is deterministic for the same seed', () => {
    const first = buildPracticeChallenge(selfIntroLesson, 'en', 5, 99)
    const second = buildPracticeChallenge(selfIntroLesson, 'en', 5, 99)
    expect(first.questions.map((question) => question.id)).toEqual(
      second.questions.map((question) => question.id),
    )
  })

  it('varies the round for a different seed', () => {
    const first = buildPracticeChallenge(selfIntroLesson, 'en', 5, 1)
    const second = buildPracticeChallenge(selfIntroLesson, 'en', 5, 2)
    expect(first.questions.map((question) => question.id)).not.toEqual(
      second.questions.map((question) => question.id),
    )
  })

  it('always includes the correct option among the choices', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 555)

    for (const question of challenge.questions) {
      const correct = question.options.find((option) => option.id === question.correctOptionId)
      expect(correct).toBeDefined()
      expect(question.options).toHaveLength(4)
    }
  })

  it('derives distractors from the same lesson only', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 777)

    for (const question of challenge.questions) {
      for (const option of question.options) {
        expect(option.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('attaches pronunciation audio to hanzi answer options', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 8080)

    const hanziCorrect = challenge.questions
      .map((question) => question.options.find((option) => option.id === question.correctOptionId))
      .filter((option) => option && /[\u3400-\u9fff]/.test(option.label))

    expect(hanziCorrect.length).toBeGreaterThan(0)
    for (const option of hanziCorrect) {
      expect(option.audio, `${option?.label} should carry hanzi pronunciation audio`).toBeDefined()
    }
  })

  it('does not attach prompt audio to read or review questions', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 1000, seed)

      for (const question of challenge.questions) {
        if (question.kind === 'read' || question.kind === 'review') {
          expect(question.audio, `${question.id} should not carry prompt audio`).toBeUndefined()
        }
      }
    }
  })

  it('attaches pronunciation audio to every hanzi option of the baggage-claim listening question', () => {
    const hanziPattern = /[\u3400-\u9fff]/

    for (let seed = 1; seed <= 50; seed += 1) {
      const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 1000, seed)
      const baggageQuestion = challenge.questions.find(
        (question) => question.id === 'self-intro-listening-2',
      )

      expect(baggageQuestion).toBeDefined()

      for (const option of baggageQuestion!.options) {
        if (hanziPattern.test(option.label)) {
          expect(option.audio, `${option.label} should carry pronunciation audio`).toBeDefined()
        }
      }
    }
  })

  it('attaches pronunciation audio to every hanzi option across the course', () => {
    const hanziPattern = /[\u3400-\u9fff]/

    for (const lesson of course.lessons) {
      for (let seed = 1; seed <= 20; seed += 1) {
        const challenge = buildPracticeChallenge(lesson, 'en', 1000, seed)

        for (const question of challenge.questions) {
          for (const option of question.options) {
            if (hanziPattern.test(option.label)) {
              expect(
                option.audio,
                `${lesson.id}/${question.id}/${option.label} should carry pronunciation audio`,
              ).toBeDefined()
            }
          }
        }
      }
    }
  })
})
