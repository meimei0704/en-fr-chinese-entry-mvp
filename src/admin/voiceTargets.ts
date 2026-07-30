import type { LessonContent, PracticePrompt } from '../content/types.js'
import type {
  VoiceReplacementPatch,
  VoiceReplacementPracticeSection,
  VoiceReplacementTarget,
  VoiceReplacementTargetId,
} from './voiceTypes.js'

const practiceSections: readonly VoiceReplacementPracticeSection[] = ['listening', 'speaking', 'reading']

function targetId<T extends VoiceReplacementTargetId>(id: T) {
  return id
}

function requireReplacementUrl(nextAudioUrl: string) {
  const trimmed = nextAudioUrl.trim()

  if (!trimmed) {
    throw new Error('Replacement audio URL is required')
  }

  return trimmed
}

function assertNever(value: never): never {
  throw new Error(`Unsupported voice replacement target: ${String(value)}`)
}

function replaceById<T extends { id: string; audio: string }>(items: readonly T[], itemId: string, nextAudioUrl: string) {
  let found = false
  const nextItems = items.map((item) => {
    if (item.id !== itemId) {
      return item
    }

    found = true
    return { ...item, audio: nextAudioUrl }
  })

  if (!found) {
    throw new Error(`Voice replacement target not found: ${itemId}`)
  }

  return nextItems as T[]
}

function collectPracticeTargets(lesson: LessonContent) {
  return practiceSections.flatMap((section) =>
    lesson.practice[section].map((prompt, index): VoiceReplacementTarget => ({
      id: targetId(`practice:${section}:${prompt.id}`),
      moduleType: 'practice',
      itemId: prompt.id,
      label: `Practice ${section} ${index + 1}`,
      text: prompt.target,
      audio: prompt.audio,
    })),
  )
}

export function collectVoiceReplacementTargets(lesson: LessonContent): VoiceReplacementTarget[] {
  return [
    ...lesson.dialogue.lines.map((line, index): VoiceReplacementTarget => ({
      id: targetId(`dialogue:${line.id}`),
      moduleType: 'dialogue',
      itemId: line.id,
      label: `Dialogue line ${index + 1}`,
      text: line.hanzi,
      audio: line.audio,
    })),
    ...lesson.sentencePatterns.map((pattern, index): VoiceReplacementTarget => ({
      id: targetId(`sentencePatterns:${pattern.id}`),
      moduleType: 'sentencePatterns',
      itemId: pattern.id,
      label: `Sentence pattern ${index + 1}`,
      text: pattern.example,
      audio: pattern.audio,
    })),
    ...lesson.vocabulary.map((item, index): VoiceReplacementTarget => ({
      id: targetId(`vocabulary:${item.id}`),
      moduleType: 'vocabulary',
      itemId: item.id,
      label: `Vocabulary ${index + 1}`,
      text: item.hanzi,
      audio: item.audio,
    })),
    ...lesson.pronunciation.map((tip, index): VoiceReplacementTarget => ({
      id: targetId(`pronunciation:${tip.id}`),
      moduleType: 'pronunciation',
      itemId: tip.id,
      label: `Pronunciation ${index + 1}`,
      text: tip.audioText,
      audio: tip.audio,
    })),
    ...collectPracticeTargets(lesson),
    {
      id: targetId(`shortInput:${lesson.shortInput.id}`),
      moduleType: 'shortInput',
      itemId: lesson.shortInput.id,
      label: 'Short input prompt',
      text: lesson.shortInput.target,
      audio: lesson.shortInput.audio,
    },
  ]
}

function parseTargetId(target: string) {
  const [moduleType, maybeSection, maybeItemId] = target.split(':')

  if (moduleType === 'practice') {
    if (!practiceSections.includes(maybeSection as VoiceReplacementPracticeSection) || !maybeItemId) {
      throw new Error(`Unsupported voice replacement target: ${target}`)
    }

    return {
      moduleType,
      section: maybeSection as VoiceReplacementPracticeSection,
      itemId: maybeItemId,
    } as const
  }

  if (
    moduleType === 'dialogue' ||
    moduleType === 'sentencePatterns' ||
    moduleType === 'vocabulary' ||
    moduleType === 'pronunciation' ||
    moduleType === 'shortInput'
  ) {
    if (!maybeSection || maybeItemId) {
      throw new Error(`Unsupported voice replacement target: ${target}`)
    }

    return {
      moduleType,
      itemId: maybeSection,
    } as const
  }

  throw new Error(`Unsupported voice replacement target: ${target}`)
}

export function applyVoiceReplacementToModule(
  lesson: LessonContent,
  target: string,
  nextAudioUrl: string,
): VoiceReplacementPatch {
  const audio = requireReplacementUrl(nextAudioUrl)
  const parsed = parseTargetId(target)

  switch (parsed.moduleType) {
    case 'dialogue':
      return {
        moduleType: 'dialogue',
        payload: {
          ...lesson.dialogue,
          lines: replaceById(lesson.dialogue.lines, parsed.itemId, audio),
        },
      }
    case 'sentencePatterns':
      return {
        moduleType: 'sentencePatterns',
        payload: replaceById(lesson.sentencePatterns, parsed.itemId, audio),
      }
    case 'vocabulary':
      return {
        moduleType: 'vocabulary',
        payload: replaceById(lesson.vocabulary, parsed.itemId, audio),
      }
    case 'pronunciation':
      return {
        moduleType: 'pronunciation',
        payload: replaceById(lesson.pronunciation, parsed.itemId, audio),
      }
    case 'practice': {
      const section = parsed.section
      const nextSection = replaceById<PracticePrompt>(lesson.practice[section], parsed.itemId, audio)
      return {
        moduleType: 'practice',
        payload: {
          ...lesson.practice,
          [section]: nextSection,
        },
      }
    }
    case 'shortInput':
      if (lesson.shortInput.id !== parsed.itemId) {
        throw new Error(`Voice replacement target not found: ${parsed.itemId}`)
      }

      return {
        moduleType: 'shortInput',
        payload: {
          ...lesson.shortInput,
          audio,
        },
      }
    default:
      return assertNever(parsed)
  }
}
