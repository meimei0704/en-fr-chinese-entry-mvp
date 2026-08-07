import type {
  DialogueLine,
  LessonContent,
  LessonId,
  PracticePrompt,
  SentencePattern,
  VocabularyItem,
} from '../content/types.js'
import type {
  VoiceAudioModuleType,
  VoiceAudioPracticeSection,
  VoiceAudioTarget,
  VoiceAudioTargetId,
  VoiceGenerationApprovedResult,
  VoiceGenerationBatchPatch,
} from './voiceTypes.js'

const practiceSections: readonly VoiceAudioPracticeSection[] = ['listening', 'speaking', 'reading']
const moduleOrder: readonly VoiceAudioModuleType[] = [
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
]

function targetId<T extends VoiceAudioTargetId>(id: T) {
  return id
}

function requireReplacementUrl(nextAudioUrl: string) {
  const trimmed = nextAudioUrl.trim()

  if (!trimmed) {
    throw new Error('Generated audio URL is required')
  }

  return trimmed
}

function assertNever(value: never): never {
  throw new Error(`Unsupported voice generation target: ${String(value)}`)
}

function originalAudioFor(item: { audio: string; audioFallback?: string }) {
  return item.audioFallback?.trim() || item.audio
}

function withGeneratedAudio<T extends { audio: string; audioFallback?: string }>(item: T, generatedAudioUrl: string): T {
  return {
    ...item,
    audio: generatedAudioUrl,
    audioFallback: originalAudioFor(item),
  }
}

function replaceManyById<T extends { id: string; audio: string; audioFallback?: string }>(
  items: readonly T[],
  replacements: ReadonlyMap<string, string>,
) {
  return items.map((item) => {
    const generatedAudioUrl = replacements.get(item.id)

    if (!generatedAudioUrl) {
      return item
    }

    return withGeneratedAudio(item, generatedAudioUrl)
  }) as T[]
}

function createTarget(input: {
  lessonId: LessonId
  targetId: VoiceAudioTargetId
  moduleType: VoiceAudioModuleType
  itemId: string
  label: string
  text: string
  item: { audio: string; audioFallback?: string }
}): VoiceAudioTarget {
  const originalAudio = originalAudioFor(input.item)

  return {
    targetId: input.targetId,
    lessonId: input.lessonId,
    moduleType: input.moduleType,
    itemId: input.itemId,
    label: input.label,
    text: input.text,
    originalAudio,
    currentAudio: input.item.audio,
    language: 'zh-CN',
    storageKey: deriveVoiceTargetStorageKey(originalAudio),
  }
}

export function deriveVoiceTargetStorageKey(audioPath: string) {
  const trimmed = audioPath.trim()

  if (trimmed.startsWith('/audio/')) {
    return trimmed.slice(1)
  }

  if (trimmed.startsWith('audio/')) {
    return trimmed
  }

  throw new Error(`Voice target storage key must be derived from an existing /audio path: ${audioPath}`)
}

function collectPracticeTargets(lesson: LessonContent) {
  return practiceSections.flatMap((section) =>
    lesson.practice[section].map((prompt, index) =>
      createTarget({
        lessonId: lesson.id,
        targetId: targetId(`practice:${section}:${prompt.id}`),
        moduleType: 'practice',
        itemId: prompt.id,
        label: `${lesson.id} · Practice ${section} ${index + 1}`,
        text: prompt.target,
        item: prompt,
      }),
    ),
  )
}

export function collectLessonVoiceAudioTargets(lesson: LessonContent): VoiceAudioTarget[] {
  return [
    ...lesson.dialogue.lines.map((line, index) =>
      createTarget({
        lessonId: lesson.id,
        targetId: targetId(`dialogue:${line.id}`),
        moduleType: 'dialogue',
        itemId: line.id,
        label: `${lesson.id} · Dialogue line ${index + 1}`,
        text: line.hanzi,
        item: line,
      }),
    ),
    ...lesson.sentencePatterns.map((pattern, index) =>
      createTarget({
        lessonId: lesson.id,
        targetId: targetId(`sentencePatterns:${pattern.id}`),
        moduleType: 'sentencePatterns',
        itemId: pattern.id,
        label: `${lesson.id} · Sentence pattern ${index + 1}`,
        text: pattern.example,
        item: pattern,
      }),
    ),
    ...lesson.vocabulary.map((item, index) =>
      createTarget({
        lessonId: lesson.id,
        targetId: targetId(`vocabulary:${item.id}`),
        moduleType: 'vocabulary',
        itemId: item.id,
        label: `${lesson.id} · Vocabulary ${index + 1}`,
        text: item.hanzi,
        item,
      }),
    ),
    ...collectPracticeTargets(lesson),
  ]
}

export function collectCourseVoiceAudioTargets(lessons: readonly LessonContent[]): VoiceAudioTarget[] {
  return lessons.flatMap((lesson) => collectLessonVoiceAudioTargets(lesson))
}

const adminVoiceVisibleModuleTypes = new Set<VoiceAudioModuleType>([
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
])

export function collectAdminVoiceVisibleTargets(
  lessons: readonly LessonContent[],
): VoiceAudioTarget[] {
  return collectCourseVoiceAudioTargets(lessons).filter((target) =>
    adminVoiceVisibleModuleTypes.has(target.moduleType),
  )
}

function parseTargetId(target: string) {
  const [moduleType, maybeSection, maybeItemId] = target.split(':')

  if (moduleType === 'practice') {
    if (!practiceSections.includes(maybeSection as VoiceAudioPracticeSection) || !maybeItemId) {
      throw new Error(`Unsupported voice generation target: ${target}`)
    }

    return {
      moduleType,
      section: maybeSection as VoiceAudioPracticeSection,
      itemId: maybeItemId,
    } as const
  }

  if (
    moduleType === 'dialogue' ||
    moduleType === 'sentencePatterns' ||
    moduleType === 'vocabulary'
  ) {
    if (!maybeSection || maybeItemId) {
      throw new Error(`Unsupported voice generation target: ${target}`)
    }

    return {
      moduleType,
      itemId: maybeSection,
    } as const
  }

  throw new Error(`Unsupported voice generation target: ${target}`)
}

function groupApprovedResults(lesson: LessonContent, approvedResults: readonly VoiceGenerationApprovedResult[]) {
  const replacementsByModule = new Map<VoiceAudioModuleType, Map<string, string>>()
  const practiceReplacements = new Map<VoiceAudioPracticeSection, Map<string, string>>()

  for (const result of approvedResults) {
    if (result.lessonId !== lesson.id) {
      continue
    }

    const generatedAudioUrl = requireReplacementUrl(result.generatedAudioUrl)
    const parsed = parseTargetId(result.targetId)

    if (parsed.moduleType === 'practice') {
      let sectionMap = practiceReplacements.get(parsed.section)
      if (!sectionMap) {
        sectionMap = new Map()
        practiceReplacements.set(parsed.section, sectionMap)
      }
      sectionMap.set(parsed.itemId, generatedAudioUrl)
      replacementsByModule.set('practice', new Map())
      continue
    }

    let moduleMap = replacementsByModule.get(parsed.moduleType)
    if (!moduleMap) {
      moduleMap = new Map()
      replacementsByModule.set(parsed.moduleType, moduleMap)
    }
    moduleMap.set(parsed.itemId, generatedAudioUrl)
  }

  return { replacementsByModule, practiceReplacements }
}

export function applyVoiceGenerationBatchToLesson(
  lesson: LessonContent,
  approvedResults: readonly VoiceGenerationApprovedResult[],
): VoiceGenerationBatchPatch[] {
  const { replacementsByModule, practiceReplacements } = groupApprovedResults(lesson, approvedResults)
  const patches: VoiceGenerationBatchPatch[] = []

  for (const moduleType of moduleOrder) {
    if (!replacementsByModule.has(moduleType)) {
      continue
    }

    switch (moduleType) {
      case 'dialogue':
        patches.push({
          moduleType,
          payload: {
            ...lesson.dialogue,
            lines: replaceManyById<DialogueLine>(lesson.dialogue.lines, replacementsByModule.get(moduleType)!),
          },
        })
        break
      case 'sentencePatterns':
        patches.push({
          moduleType,
          payload: replaceManyById<SentencePattern>(lesson.sentencePatterns, replacementsByModule.get(moduleType)!),
        })
        break
      case 'vocabulary':
        patches.push({
          moduleType,
          payload: replaceManyById<VocabularyItem>(lesson.vocabulary, replacementsByModule.get(moduleType)!),
        })
        break
      case 'practice': {
        const nextPractice = {
          ...lesson.practice,
        }

        for (const section of practiceSections) {
          const sectionMap = practiceReplacements.get(section)
          if (sectionMap) {
            nextPractice[section] = replaceManyById<PracticePrompt>(lesson.practice[section], sectionMap)
          }
        }

        patches.push({ moduleType, payload: nextPractice })
        break
      }
      default:
        assertNever(moduleType)
    }
  }

  return patches
}
