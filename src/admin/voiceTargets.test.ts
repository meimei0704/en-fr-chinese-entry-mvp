import { describe, expect, it } from 'vitest'

import { course } from '../content/course'
import { applyVoiceReplacementToModule, collectVoiceReplacementTargets } from './voiceTargets'

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

describe('admin voice replacement targets', () => {
  it('collects every lesson audio field as a single-item replacement target', () => {
    const targets = collectVoiceReplacementTargets(lesson)

    expect(targets).toHaveLength(audioCountForFixture())
    expect(targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `dialogue:${lesson.dialogue.lines[0]!.id}`,
          moduleType: 'dialogue',
          itemId: lesson.dialogue.lines[0]!.id,
          text: lesson.dialogue.lines[0]!.hanzi,
          audio: lesson.dialogue.lines[0]!.audio,
        }),
        expect.objectContaining({
          id: `sentencePatterns:${lesson.sentencePatterns[0]!.id}`,
          moduleType: 'sentencePatterns',
          itemId: lesson.sentencePatterns[0]!.id,
          text: lesson.sentencePatterns[0]!.example,
          audio: lesson.sentencePatterns[0]!.audio,
        }),
        expect.objectContaining({
          id: `vocabulary:${lesson.vocabulary[0]!.id}`,
          moduleType: 'vocabulary',
          itemId: lesson.vocabulary[0]!.id,
          text: lesson.vocabulary[0]!.hanzi,
          audio: lesson.vocabulary[0]!.audio,
        }),
        expect.objectContaining({
          id: `pronunciation:${lesson.pronunciation[0]!.id}`,
          moduleType: 'pronunciation',
          itemId: lesson.pronunciation[0]!.id,
          text: lesson.pronunciation[0]!.audioText,
          audio: lesson.pronunciation[0]!.audio,
        }),
        expect.objectContaining({
          id: `practice:listening:${lesson.practice.listening[0]!.id}`,
          moduleType: 'practice',
          itemId: lesson.practice.listening[0]!.id,
          text: lesson.practice.listening[0]!.target,
          audio: lesson.practice.listening[0]!.audio,
        }),
        expect.objectContaining({
          id: `practice:speaking:${lesson.practice.speaking[0]!.id}`,
          moduleType: 'practice',
          itemId: lesson.practice.speaking[0]!.id,
          text: lesson.practice.speaking[0]!.target,
          audio: lesson.practice.speaking[0]!.audio,
        }),
        expect.objectContaining({
          id: `practice:reading:${lesson.practice.reading[0]!.id}`,
          moduleType: 'practice',
          itemId: lesson.practice.reading[0]!.id,
          text: lesson.practice.reading[0]!.target,
          audio: lesson.practice.reading[0]!.audio,
        }),
        expect.objectContaining({
          id: `shortInput:${lesson.shortInput.id}`,
          moduleType: 'shortInput',
          itemId: lesson.shortInput.id,
          text: lesson.shortInput.target,
          audio: lesson.shortInput.audio,
        }),
      ]),
    )
  })

  it('patches one dialogue target without changing other lesson modules or lines', () => {
    const replacementUrl = '/voice/generated/dialogue-line.mp3'
    const result = applyVoiceReplacementToModule(
      lesson,
      `dialogue:${lesson.dialogue.lines[0]!.id}`,
      replacementUrl,
    )

    expect(result.moduleType).toBe('dialogue')
    expect(result.payload).toEqual({
      ...lesson.dialogue,
      lines: lesson.dialogue.lines.map((line, index) =>
        index === 0 ? { ...line, audio: replacementUrl } : line,
      ),
    })
    expect(result.payload).not.toBe(lesson.dialogue)
    expect(result.payload.lines[1]).toEqual(lesson.dialogue.lines[1])
  })

  it('patches one vocabulary target without changing neighboring vocabulary items', () => {
    const replacementUrl = '/voice/generated/vocab.mp3'
    const targetItem = lesson.vocabulary[1]!
    const result = applyVoiceReplacementToModule(lesson, `vocabulary:${targetItem.id}`, replacementUrl)

    expect(result.moduleType).toBe('vocabulary')
    expect(result.payload).toEqual(
      lesson.vocabulary.map((item) => (item.id === targetItem.id ? { ...item, audio: replacementUrl } : item)),
    )
    expect(result.payload[0]).toEqual(lesson.vocabulary[0])
  })

  it('patches one practice target inside its practice section only', () => {
    const replacementUrl = '/voice/generated/practice.mp3'
    const targetPrompt = lesson.practice.listening[0]!
    const result = applyVoiceReplacementToModule(
      lesson,
      `practice:listening:${targetPrompt.id}`,
      replacementUrl,
    )

    expect(result.moduleType).toBe('practice')
    expect(result.payload).toEqual({
      ...lesson.practice,
      listening: lesson.practice.listening.map((prompt) =>
        prompt.id === targetPrompt.id ? { ...prompt, audio: replacementUrl } : prompt,
      ),
    })
    expect(result.payload.speaking).toEqual(lesson.practice.speaking)
    expect(result.payload.reading).toEqual(lesson.practice.reading)
  })

  it('patches the short input target as a single-object module payload', () => {
    const replacementUrl = '/voice/generated/short-input.mp3'
    const result = applyVoiceReplacementToModule(lesson, `shortInput:${lesson.shortInput.id}`, replacementUrl)

    expect(result).toEqual({
      moduleType: 'shortInput',
      payload: {
        ...lesson.shortInput,
        audio: replacementUrl,
      },
    })
  })
})
