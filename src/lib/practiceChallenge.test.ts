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
    const module = pinyinCourse.modules[2]
    const challenge = buildPinyinPracticeChallenge(module, 'en', 5, 2024)

    expect(challenge.questions).toHaveLength(5)
    expect(challenge.maxScore).toBe(100)

    const kinds = new Set(challenge.questions.map((question) => question.kind))
    expect(kinds.has('listen')).toBe(true)
    expect(kinds.has('read')).toBe(true)
  })

  it('is deterministic for the same seed', () => {
    const module = pinyinCourse.modules[2]
    const first = buildPinyinPracticeChallenge(module, 'en', 5, 99)
    const second = buildPinyinPracticeChallenge(module, 'en', 5, 99)
    expect(first.questions.map((question) => question.id)).toEqual(
      second.questions.map((question) => question.id),
    )
  })

  it('always includes the correct option among the choices', () => {
    const module = pinyinCourse.modules[2]
    const challenge = buildPinyinPracticeChallenge(module, 'en', 5, 555)

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
    const module = pinyinCourse.modules[2]
    const challenge = buildPinyinPracticeChallenge(module, 'en', 26, 7)
    const toneQuestion = challenge.questions.find((question) =>
      question.id.startsWith('tone-'),
    )
    expect(toneQuestion).toBeDefined()
    expect(toneQuestion?.audio).toMatch(/^\/audio\/pinyin\/lesson-1\/tone-game-/)
    expect(toneQuestion?.options.length).toBe(4)
  })

  it('derives listen and read questions from reference pinyin content', () => {
    const module = pinyinCourse.modules[2]
    const challenge = buildPinyinPracticeChallenge(module, 'en', 8, 8080)
    const referenceListen = challenge.questions.find((question) =>
      question.id.endsWith('-listen'),
    )
    expect(referenceListen).toBeDefined()
    expect(referenceListen?.audio).toMatch(/\/audio\/pinyin\/lesson-1\//)
    expect(
      challenge.questions.some((question) => question.kind === 'read' && question.prompt),
    ).toBe(true)
  })

  it('uses the approved first-tone final labels as every Finals practice answer', () => {
    const module = pinyinCourse.modules.find((candidate) => candidate.id === 'finals')
    if (!module) {
      throw new Error('Missing Finals module')
    }

    const expectedAnswers = new Map([
      ['/audio/pinyin/lesson-1/reference-final-a.mp3', 'ā'],
      ['/audio/pinyin/lesson-1/reference-final-o.mp3', 'ō'],
      ['/audio/pinyin/lesson-1/reference-final-e.mp3', 'ē'],
      ['/audio/pinyin/lesson-1/reference-final-i.mp3', 'ī'],
      ['/audio/pinyin/lesson-1/reference-final-u.mp3', 'ū'],
      ['/audio/pinyin/lesson-1/reference-final-ue.mp3', 'ǖ'],
      ['/audio/pinyin/lesson-3/reference-final-ai.mp3', 'āi'],
      ['/audio/pinyin/lesson-3/reference-final-ei.mp3', 'ēi'],
      ['/audio/pinyin/lesson-3/reference-final-ui.mp3', 'uī'],
      ['/audio/pinyin/lesson-3/reference-final-ao.mp3', 'āo'],
      ['/audio/pinyin/lesson-3/reference-final-ou.mp3', 'ōu'],
      ['/audio/pinyin/lesson-3/reference-final-iu.mp3', 'iū'],
      ['/audio/pinyin/lesson-3/reference-final-ie.mp3', 'iē'],
      ['/audio/pinyin/lesson-3/reference-final-ue.mp3', 'üē'],
      ['/audio/pinyin/lesson-3/reference-final-er.mp3', 'ēr'],
      ['/audio/pinyin/lesson-3/reference-final-an.mp3', 'ān'],
      ['/audio/pinyin/lesson-3/reference-final-en.mp3', 'ēn'],
      ['/audio/pinyin/lesson-3/reference-final-in.mp3', 'īn'],
      ['/audio/pinyin/lesson-3/reference-final-un.mp3', 'ūn'],
      ['/audio/pinyin/lesson-3/reference-final-uen.mp3', 'ǖn'],
      ['/audio/pinyin/lesson-3/reference-final-ang.mp3', 'āng'],
      ['/audio/pinyin/lesson-3/reference-final-eng.mp3', 'ēng'],
      ['/audio/pinyin/lesson-3/reference-final-ing.mp3', 'īng'],
      ['/audio/pinyin/lesson-3/reference-final-ong.mp3', 'ōng'],
    ])
    const challenge = buildPinyinPracticeChallenge(module, 'en', 56, 20260812)

    for (const [audio, answer] of expectedAnswers) {
      for (const suffix of ['listen', 'read']) {
        const question = challenge.questions.find(
          (candidate) => candidate.audio === audio && candidate.id.endsWith(`-${suffix}`),
        )
        expect(question, `${audio} ${suffix} should be in the complete challenge`).toBeDefined()
        expect(question?.target).toBe(answer)
        expect(
          question?.options.find((option) => option.id === question.correctOptionId)?.label,
        ).toBe(answer)
      }
    }
  })
})
