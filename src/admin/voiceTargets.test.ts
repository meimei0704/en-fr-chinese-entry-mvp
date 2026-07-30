import { describe, expect, it } from 'vitest'

import { course } from '../content/course'
import {
  applyVoiceGenerationBatchToLesson,
  collectCourseVoiceAudioTargets,
  collectLessonVoiceAudioTargets,
  deriveVoiceTargetStorageKey,
} from './voiceTargets'

const lesson = course.lessons[0]!

function audioCountForFixture() {
  return [
    ...lesson.dialogue.lines,
    ...lesson.sentencePatterns,
    ...lesson.vocabulary,
    ...lesson.pronunciation,
    ...lesson.practice.listening,
    ...lesson.practice.speaking,
    ...lesson.practice.reading,
    lesson.shortInput,
  ].length
}

describe('admin batch voice audio targets', () => {
  it('collects every existing lesson Chinese audio field as a stable batch target', () => {
    const targets = collectLessonVoiceAudioTargets(lesson)

    expect(targets).toHaveLength(audioCountForFixture())
    expect(targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          targetId: `dialogue:${lesson.dialogue.lines[0]!.id}`,
          lessonId: lesson.id,
          moduleType: 'dialogue',
          itemId: lesson.dialogue.lines[0]!.id,
          text: lesson.dialogue.lines[0]!.hanzi,
          originalAudio: lesson.dialogue.lines[0]!.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/line-01.mp3',
        }),
        expect.objectContaining({
          targetId: `sentencePatterns:${lesson.sentencePatterns[0]!.id}`,
          lessonId: lesson.id,
          moduleType: 'sentencePatterns',
          itemId: lesson.sentencePatterns[0]!.id,
          text: lesson.sentencePatterns[0]!.example,
          originalAudio: lesson.sentencePatterns[0]!.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/pattern-01.mp3',
        }),
        expect.objectContaining({
          targetId: `vocabulary:${lesson.vocabulary[0]!.id}`,
          lessonId: lesson.id,
          moduleType: 'vocabulary',
          itemId: lesson.vocabulary[0]!.id,
          text: lesson.vocabulary[0]!.hanzi,
          originalAudio: lesson.vocabulary[0]!.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/vocab-01.mp3',
        }),
        expect.objectContaining({
          targetId: `pronunciation:${lesson.pronunciation[0]!.id}`,
          lessonId: lesson.id,
          moduleType: 'pronunciation',
          itemId: lesson.pronunciation[0]!.id,
          text: lesson.pronunciation[0]!.audioText,
          originalAudio: lesson.pronunciation[0]!.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/pronunciation-01.mp3',
        }),
        expect.objectContaining({
          targetId: `practice:listening:${lesson.practice.listening[0]!.id}`,
          lessonId: lesson.id,
          moduleType: 'practice',
          itemId: lesson.practice.listening[0]!.id,
          text: lesson.practice.listening[0]!.target,
          originalAudio: lesson.practice.listening[0]!.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/practice-listening-01.mp3',
        }),
        expect.objectContaining({
          targetId: `shortInput:${lesson.shortInput.id}`,
          lessonId: lesson.id,
          moduleType: 'shortInput',
          itemId: lesson.shortInput.id,
          text: lesson.shortInput.target,
          originalAudio: lesson.shortInput.audio,
          language: 'zh-CN',
          storageKey: 'audio/self-intro/short-input-01.mp3',
        }),
      ]),
    )
  })

  it('locks the course manifest to the 179 existing zh-CN audio targets only', () => {
    const targets = collectCourseVoiceAudioTargets(course.lessons)
    const targetTexts = new Set(targets.map((target) => target.text))

    expect(targets).toHaveLength(179)
    expect(targets.every((target) => target.language === 'zh-CN')).toBe(true)
    expect(targets.every((target) => target.originalAudio.startsWith('/audio/'))).toBe(true)
    expect(targets.every((target) => target.storageKey.startsWith('audio/'))).toBe(true)
    expect(targets.every((target) => /[\u3400-\u9FFF]/.test(target.text))).toBe(true)
    expect(targetTexts).not.toContain(lesson.title.en)
    expect(targetTexts).not.toContain(lesson.scenario.en)
    expect(targetTexts).not.toContain(String(lesson.dialogue.lines[0]!.translation.en))
    expect(targetTexts).not.toContain(lesson.dialogue.lines[0]!.explanation.en)
    expect(targets.some((target) => target.moduleType === 'reviewCards')).toBe(false)
  })

  it('derives stable object-storage keys from existing /audio mp3 paths', () => {
    expect(deriveVoiceTargetStorageKey('/audio/self-intro/line-01.mp3')).toBe('audio/self-intro/line-01.mp3')
    expect(deriveVoiceTargetStorageKey('audio/self-intro/line-02.mp3')).toBe('audio/self-intro/line-02.mp3')
    expect(() => deriveVoiceTargetStorageKey('/voice/generated/line-01.mp3')).toThrow(/existing \/audio/)
  })

  it('batch patches multiple targets in the same module without overwriting sibling changes', () => {
    const firstLine = lesson.dialogue.lines[0]!
    const secondLine = lesson.dialogue.lines[1]!
    const patches = applyVoiceGenerationBatchToLesson(lesson, [
      {
        lessonId: lesson.id,
        targetId: `dialogue:${firstLine.id}`,
        generatedAudioUrl: '/voice/generated/self-intro/line-01.mp3',
      },
      {
        lessonId: lesson.id,
        targetId: `dialogue:${secondLine.id}`,
        generatedAudioUrl: '/voice/generated/self-intro/line-02.mp3',
      },
    ])

    expect(patches).toHaveLength(1)
    expect(patches[0]!.moduleType).toBe('dialogue')
    expect(patches[0]!.payload).toEqual({
      ...lesson.dialogue,
      lines: lesson.dialogue.lines.map((line) => {
        if (line.id === firstLine.id) {
          return { ...line, audio: '/voice/generated/self-intro/line-01.mp3', audioFallback: firstLine.audio }
        }

        if (line.id === secondLine.id) {
          return { ...line, audio: '/voice/generated/self-intro/line-02.mp3', audioFallback: secondLine.audio }
        }

        return line
      }),
    })
  })

  it('preserves the earliest fallback when regenerating a target that already has audioFallback', () => {
    const targetItem = lesson.vocabulary[0]!
    const originalFallback = targetItem.audio
    const lessonWithFallback = {
      ...lesson,
      vocabulary: lesson.vocabulary.map((item) =>
        item.id === targetItem.id
          ? { ...item, audio: '/voice/generated/previous.mp3', audioFallback: originalFallback }
          : item,
      ),
    }

    const patches = applyVoiceGenerationBatchToLesson(lessonWithFallback, [
      {
        lessonId: lesson.id,
        targetId: `vocabulary:${targetItem.id}`,
        generatedAudioUrl: '/voice/generated/current.mp3',
      },
    ])

    expect(patches).toEqual([
      {
        moduleType: 'vocabulary',
        payload: lesson.vocabulary.map((item) =>
          item.id === targetItem.id
            ? { ...item, audio: '/voice/generated/current.mp3', audioFallback: originalFallback }
            : item,
        ),
      },
    ])
  })

  it('returns one patch per affected module when approved results span a lesson', () => {
    const patches = applyVoiceGenerationBatchToLesson(lesson, [
      {
        lessonId: lesson.id,
        targetId: `practice:listening:${lesson.practice.listening[0]!.id}`,
        generatedAudioUrl: '/voice/generated/listening.mp3',
      },
      {
        lessonId: lesson.id,
        targetId: `shortInput:${lesson.shortInput.id}`,
        generatedAudioUrl: '/voice/generated/short-input.mp3',
      },
    ])

    expect(patches.map((patch) => patch.moduleType)).toEqual(['practice', 'shortInput'])
    expect(patches[0]!.payload).toEqual({
      ...lesson.practice,
      listening: lesson.practice.listening.map((prompt, index) =>
        index === 0
          ? { ...prompt, audio: '/voice/generated/listening.mp3', audioFallback: prompt.audio }
          : prompt,
      ),
    })
    expect(patches[1]!.payload).toEqual({
      ...lesson.shortInput,
      audio: '/voice/generated/short-input.mp3',
      audioFallback: lesson.shortInput.audio,
    })
  })
})
