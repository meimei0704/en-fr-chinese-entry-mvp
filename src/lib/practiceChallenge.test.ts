import { describe, expect, it } from 'vitest'

import { selfIntroLesson } from '../content/lessons/selfIntro'
import { pinyinCourse } from '../content/pinyin/course'
import {
  buildPinyinPracticeChallenge,
  buildPracticeChallenge,
  computeRating,
  createSeededRandom,
  pointsForCorrect,
  remainingPoints,
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
  it('splits a flat 100-point total across all questions', () => {
    expect(pointsForCorrect(5)).toBe(20)
    expect(pointsForCorrect(10)).toBe(10)
    expect(pointsForCorrect(1)).toBe(100)
  })
})

describe('remainingPoints', () => {
  it('is zero for counts that divide 100 evenly', () => {
    expect(remainingPoints(5)).toBe(0)
    expect(remainingPoints(10)).toBe(0)
  })

  it('tops up non-divisible counts so the total stays exactly 100', () => {
    expect(pointsForCorrect(3) * 3 + remainingPoints(3)).toBe(100)
    expect(pointsForCorrect(6) * 6 + remainingPoints(6)).toBe(100)
    expect(pointsForCorrect(7) * 7 + remainingPoints(7)).toBe(100)
  })
})

describe('computeRating', () => {
  it('maps score ratios to S/A/B/C bands', () => {
    expect(computeRating(100, 100)).toBe('S')
    expect(computeRating(90, 100)).toBe('S')
    expect(computeRating(75, 100)).toBe('A')
    expect(computeRating(60, 100)).toBe('B')
    expect(computeRating(10, 100)).toBe('C')
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
    expect(challenge.maxScore).toBe(100)

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

describe('buildPinyinPracticeChallenge', () => {
  it('produces five listen/read questions from tone game and reference content', () => {
    const lesson = pinyinCourse.lessons[0]
    const challenge = buildPinyinPracticeChallenge(lesson, 'en', 5, 2024)

    expect(challenge.questions).toHaveLength(5)
    expect(challenge.maxScore).toBe(100)

    const kinds = new Set(challenge.questions.map((question) => question.kind))
    expect(kinds.has('listen')).toBe(true)
    expect(kinds.has('read')).toBe(true)
  })

  it('is deterministic for the same seed', () => {
    const lesson = pinyinCourse.lessons[0]
    const first = buildPinyinPracticeChallenge(lesson, 'en', 5, 99)
    const second = buildPinyinPracticeChallenge(lesson, 'en', 5, 99)
    expect(first.questions.map((question) => question.id)).toEqual(
      second.questions.map((question) => question.id),
    )
  })

  it('always includes the correct option among the choices', () => {
    const lesson = pinyinCourse.lessons[0]
    const challenge = buildPinyinPracticeChallenge(lesson, 'en', 5, 555)

    for (const question of challenge.questions) {
      const correct = question.options.find(
        (option) => option.id === question.correctOptionId,
      )
      expect(correct).toBeDefined()
      expect(correct?.label).toBe(question.target)
      expect(question.options.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('wires tone questions to their prompt audio and tone labels', () => {
    const lesson = pinyinCourse.lessons[0]
    const challenge = buildPinyinPracticeChallenge(lesson, 'en', 8, 7)
    const toneQuestion = challenge.questions.find((question) =>
      question.id.startsWith('tone-'),
    )
    expect(toneQuestion).toBeDefined()
    expect(toneQuestion?.audio).toMatch(/^\/audio\/pinyin\/lesson-1\/tone-game-/)
    expect(toneQuestion?.options.length).toBe(4)
  })

  it('derives listen and read questions from reference pinyin content', () => {
    const lesson = pinyinCourse.lessons[0]
    const challenge = buildPinyinPracticeChallenge(lesson, 'en', 8, 8080)
    const referenceListen = challenge.questions.find((question) =>
      question.id.endsWith('-listen'),
    )
    expect(referenceListen).toBeDefined()
    expect(referenceListen?.audio).toMatch(/\/audio\/pinyin\/lesson-1\//)
    expect(
      challenge.questions.some((question) => question.kind === 'read' && question.prompt),
    ).toBe(true)
  })
})
