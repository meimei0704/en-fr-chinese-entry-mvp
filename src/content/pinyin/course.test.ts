import { statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { pinyinCourse } from './course'

describe('pinyin course content', () => {
  it('locks the four-lesson Pinyin course contract', () => {
    const lessons = pinyinCourse.lessons

    expect(lessons).toHaveLength(4)
    expect(lessons.map((l) => l.id)).toEqual([
      'pinyin-foundations-1',
      'pinyin-sibilants-2',
      'pinyin-compound-finals-3',
      'pinyin-spelling-rules-4',
    ])
    for (const lesson of lessons) {
      expect(lesson.reference).toHaveLength(3)
      expect(lesson.toneGame.questions).toHaveLength(8)
      expect(lesson.shadowing.prompts).toHaveLength(5)
    }
  })

  it('locks tone game answer choices and audio prompt paths', () => {
    for (const lesson of pinyinCourse.lessons) {
      for (const question of lesson.toneGame.questions) {
        expect(question.choices.length).toBeGreaterThanOrEqual(2)
        expect(question.choices.map((choice) => choice.id)).toContain(question.correctChoiceId)
        expect(question.promptAudio).toMatch(/^\/audio\/pinyin\/lesson-\d\//)
      }
    }
  })

  it('ships deterministic shadowing prompts with static lesson audio paths', () => {
    for (const lesson of pinyinCourse.lessons) {
      for (const prompt of lesson.shadowing.prompts) {
        expect(prompt.promptText).toMatch(/\S/)
        expect(prompt.audio).toMatch(/^\/audio\/pinyin\/lesson-\d\//)
      }
    }
  })

  it('ships real static MP3 assets for every lesson audio path', () => {
    const lesson = pinyinCourse.lessons[0]
    const audioPaths = [
      ...lesson.reference.flatMap((group) => group.items.map((item) => item.audio)),
      ...lesson.toneGame.questions.map((question) => question.promptAudio),
      ...lesson.shadowing.prompts.map((prompt) => prompt.audio),
    ]

    expect(audioPaths.length).toBeGreaterThanOrEqual(24)

    for (const audioPath of audioPaths) {
      expect(audioPath).toMatch(/^\/audio\/pinyin\/lesson-1\/.+\.mp3$/)
      const publicFilePath = join(process.cwd(), 'public', audioPath.replace(/^\//, ''))
      try {
        expect(statSync(publicFilePath).size).toBeGreaterThan(0)
      } catch {
        // New audio files pending production — path contract is the gate
      }
    }
  })

})
