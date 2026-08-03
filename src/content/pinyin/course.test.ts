import { describe, expect, it } from 'vitest'

import { pinyinCourse } from './course'

describe('pinyin course content', () => {
  it('locks the first Pinyin foundations lesson contract', () => {
    const lesson = pinyinCourse.lesson

    expect(lesson.id).toBe('pinyin-foundations-1')
    expect(lesson.reference).toHaveLength(3)
    expect(lesson.reference.map((group) => group.id)).toEqual(['initials', 'finals', 'tones'])
    expect(lesson.toneGame.questions).toHaveLength(8)
    expect(lesson.shadowing.prompts.length).toBeGreaterThan(0)
  })

  it('locks tone game answer choices and audio prompt paths', () => {
    for (const question of pinyinCourse.lesson.toneGame.questions) {
      expect(question.choices).toHaveLength(4)
      expect(question.choices.map((choice) => choice.id)).toContain(question.correctChoiceId)
      expect(question.promptAudio).toMatch(/^\/audio\/pinyin\/lesson-1\//)
    }
  })

  it('ships deterministic shadowing prompts with static lesson audio paths', () => {
    for (const prompt of pinyinCourse.lesson.shadowing.prompts) {
      expect(prompt.promptText).toMatch(/\S/)
      expect(prompt.audio).toMatch(/^\/audio\/pinyin\/lesson-1\//)
    }
  })
})
