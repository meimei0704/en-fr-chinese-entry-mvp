import { describe, expect, it } from 'vitest'

import { selfIntroLesson } from '../content/lessons/selfIntro'
import {
  buildPracticeChallenge,
  computeRating,
  createSeededRandom,
  pointsForCorrect,
  shuffle,
} from './practiceChallenge'

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

describe('pointsForCorrect', () => {
  it('awards base points early and bonus once streak reaches three', () => {
    expect(pointsForCorrect(0)).toBe(10)
    expect(pointsForCorrect(1)).toBe(10)
    expect(pointsForCorrect(2)).toBe(15)
    expect(pointsForCorrect(5)).toBe(15)
  })
})

describe('computeRating', () => {
  it('maps score ratios to S/A/B/C bands', () => {
    expect(computeRating(65, 65)).toBe('S')
    expect(computeRating(59, 65)).toBe('S')
    expect(computeRating(50, 65)).toBe('A')
    expect(computeRating(35, 65)).toBe('B')
    expect(computeRating(10, 65)).toBe('C')
  })

  it('treats an empty challenge as C', () => {
    expect(computeRating(0, 0)).toBe('C')
  })
})

describe('buildPracticeChallenge', () => {
  it('produces exactly five mixed-type questions without duplicates', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 2024)

    expect(challenge.questions).toHaveLength(5)
    expect(new Set(challenge.questions.map((question) => question.id)).size).toBe(5)

    const kinds = new Set(challenge.questions.map((question) => question.kind))
    expect(kinds.has('listen')).toBe(true)
    expect(kinds.has('read')).toBe(true)
    expect(kinds.has('speak')).toBe(true)
    expect(kinds.has('review')).toBe(true)
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
      if (question.kind === 'speak') {
        continue
      }
      const correct = question.options.find((option) => option.id === question.correctOptionId)
      expect(correct).toBeDefined()
      expect(question.options).toHaveLength(4)
    }
  })

  it('derives distractors from the same lesson only', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 777)

    for (const question of challenge.questions) {
      if (question.kind === 'speak') {
        continue
      }
      for (const option of question.options) {
        expect(option.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('scores speak questions through self-rating options', () => {
    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 8080)
    const speak = challenge.questions.find((question) => question.kind === 'speak')
    expect(speak).toBeDefined()
    expect(speak?.correctOptionId).toBe('fluent')
  })
})
