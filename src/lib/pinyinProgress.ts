import type {
  PinyinLessonProgress,
  PinyinModuleId,
  PinyinModuleKey,
  PinyinProgress,
} from '../content/types'
import { loadJsonFromStorage, saveJsonToStorage } from './storage'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

const legacyLessonToModule: Record<string, PinyinModuleKey[]> = {
  'pinyin-foundations-1': ['initials', 'finals', 'tones'],
  'pinyin-sibilants-2': ['initials'],
  'pinyin-compound-finals-3': ['finals'],
}

export function createDefaultPinyinProgress(): PinyinProgress {
  return {
    schemaVersion: 4,
    visited: false,
    completedSections: [],
    shadowingCompletedPromptIds: [],
    lastVisitedPromptId: null,
    moduleProgress: {},
  }
}

export function createDefaultLessonProgress(): PinyinLessonProgress {
  return {
    visited: false,
    completedSections: [],
    shadowingCompletedPromptIds: [],
    lastVisitedPromptId: null,
  }
}

function isPinyinModuleId(value: unknown): value is PinyinModuleId {
  return (
    value === 'reference' ||
    value === 'tone-game' ||
    value === 'practice' ||
    value === 'shadowing'
  )
}

function isPinyinModuleIdArray(value: unknown): value is PinyinModuleId[] {
  return Array.isArray(value) && value.every(isPinyinModuleId)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isScore(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}

function isPinyinLessonProgress(value: unknown): value is PinyinLessonProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const lp = value as Record<string, unknown>

  return (
    typeof lp.visited === 'boolean' &&
    isPinyinModuleIdArray(lp.completedSections) &&
    isStringArray(lp.shadowingCompletedPromptIds) &&
    (lp.lastVisitedPromptId === null || typeof lp.lastVisitedPromptId === 'string')
  )
}

function migrateModuleId(value: string): PinyinModuleId {
  return value === 'tone-game' ? 'practice' : (value as PinyinModuleId)
}

function deriveLegacyFields(progress: PinyinProgress): PinyinProgress {
  const entries = Object.values(progress.moduleProgress).filter(
    (lp): lp is PinyinLessonProgress => lp !== undefined,
  )

  const completedSections: PinyinModuleId[] = []
  const allSections = new Set<PinyinModuleId>()
  for (const lp of entries) {
    for (const s of lp.completedSections) {
      allSections.add(s)
    }
  }
  completedSections.push(...allSections)

  return {
    ...progress,
    completedSections,
  }
}

function isPinyinProgressV4(value: unknown): value is PinyinProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  const moduleProgress =
    typeof progress.moduleProgress === 'object' && progress.moduleProgress !== null
      ? (progress.moduleProgress as Record<string, unknown>)
      : {}
  const moduleProgressValid = Object.values(moduleProgress).every((entry) =>
    isPinyinLessonProgress(entry),
  )

  return (
    progress.schemaVersion === 4 &&
    typeof progress.visited === 'boolean' &&
    isPinyinModuleIdArray(progress.completedSections) &&
    isStringArray(progress.shadowingCompletedPromptIds) &&
    (progress.lastVisitedPromptId === null || typeof progress.lastVisitedPromptId === 'string') &&
    moduleProgressValid
  )
}

function isV3LessonProgress(value: unknown): value is PinyinLessonProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const lp = value as Record<string, unknown>

  return (
    typeof lp.visited === 'boolean' &&
    isPinyinModuleIdArray(lp.completedSections) &&
    isStringArray(lp.shadowingCompletedPromptIds) &&
    (lp.lastVisitedPromptId === null || typeof lp.lastVisitedPromptId === 'string')
  )
}

function isV3LessonProgressRecord(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return Object.values(record).every((entry) => isV3LessonProgress(entry))
}

function isPinyinProgressV3(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  return (
    progress.schemaVersion === 3 &&
    typeof progress.visited === 'boolean' &&
    isPinyinModuleIdArray(progress.completedSections) &&
    isStringArray(progress.shadowingCompletedPromptIds) &&
    (progress.lastVisitedPromptId === null || typeof progress.lastVisitedPromptId === 'string') &&
    isV3LessonProgressRecord(progress.lessonProgress)
  )
}

function migrateV3ToV4(raw: Record<string, unknown>): PinyinProgress {
  const base = createDefaultPinyinProgress()
  const moduleProgress: Partial<Record<PinyinModuleKey, PinyinLessonProgress>> = {}

  const rawLessonProgress = raw.lessonProgress as
    | Record<string, Record<string, unknown>>
    | undefined

  if (rawLessonProgress) {
    for (const [lessonId, lp] of Object.entries(rawLessonProgress)) {
      if (!lp || !isV3LessonProgress(lp)) {
        continue
      }

      const legacy: PinyinLessonProgress = {
        visited: lp.visited,
        completedSections: lp.completedSections.map(migrateModuleId),
        shadowingCompletedPromptIds: lp.shadowingCompletedPromptIds,
        lastVisitedPromptId: lp.lastVisitedPromptId,
      }

      const targetModules = legacyLessonToModule[lessonId]
      if (!targetModules) {
        continue
      }

      for (const moduleKey of targetModules) {
        const existing = moduleProgress[moduleKey] ?? createDefaultLessonProgress()
        moduleProgress[moduleKey] = {
          ...existing,
          visited: existing.visited || legacy.visited,
          completedSections: Array.from(
            new Set([...existing.completedSections, ...legacy.completedSections]),
          ),
        }
      }
    }
  }

  const migrated: PinyinProgress = {
    ...base,
    visited: typeof raw.visited === 'boolean' ? raw.visited : false,
    moduleProgress,
  }

  return deriveLegacyFields(migrated)
}

interface LegacyV2LessonProgress {
  visited: boolean
  completedSections: PinyinModuleId[]
  toneGameLastScore: number | null
  toneGameBestScore: number | null
  shadowingCompletedPromptIds: string[]
  lastVisitedPromptId: string | null
}

function isV2LessonProgress(value: unknown): value is LegacyV2LessonProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const lp = value as Record<string, unknown>

  return (
    typeof lp.visited === 'boolean' &&
    isPinyinModuleIdArray(lp.completedSections) &&
    isStringArray(lp.shadowingCompletedPromptIds) &&
    (lp.lastVisitedPromptId === null || typeof lp.lastVisitedPromptId === 'string')
  )
}

function isV2LessonProgressRecord(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return Object.values(record).every((entry) => isV2LessonProgress(entry))
}

function isPinyinProgressV2(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  return (
    progress.schemaVersion === 2 &&
    typeof progress.visited === 'boolean' &&
    isPinyinModuleIdArray(progress.completedSections) &&
    isScore(progress.toneGameLastScore) &&
    isScore(progress.toneGameBestScore) &&
    isStringArray(progress.shadowingCompletedPromptIds) &&
    (progress.lastVisitedPromptId === null || typeof progress.lastVisitedPromptId === 'string') &&
    isV2LessonProgressRecord(progress.lessonProgress)
  )
}

function isPinyinProgressV1(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  return (
    progress.schemaVersion === 1 &&
    typeof progress.visited === 'boolean' &&
    isPinyinModuleIdArray(progress.completedSections) &&
    isScore(progress.toneGameLastScore) &&
    isScore(progress.toneGameBestScore) &&
    isStringArray(progress.shadowingCompletedPromptIds) &&
    (progress.lastVisitedPromptId === null || typeof progress.lastVisitedPromptId === 'string')
  )
}

function migrateV2ToV4(raw: Record<string, unknown>): PinyinProgress {
  const base = createDefaultPinyinProgress()
  const moduleProgress: Partial<Record<PinyinModuleKey, PinyinLessonProgress>> = {}

  const rawLessonProgress = raw.lessonProgress as
    | Record<string, Record<string, unknown>>
    | undefined

  if (rawLessonProgress) {
    for (const [lessonId, lp] of Object.entries(rawLessonProgress)) {
      if (!lp || !isV2LessonProgress(lp)) {
        continue
      }

      const legacy: PinyinLessonProgress = {
        visited: lp.visited,
        completedSections: lp.completedSections.map(migrateModuleId),
        shadowingCompletedPromptIds: lp.shadowingCompletedPromptIds,
        lastVisitedPromptId: lp.lastVisitedPromptId,
      }

      const targetModules = legacyLessonToModule[lessonId]
      if (!targetModules) {
        continue
      }

      for (const moduleKey of targetModules) {
        const existing = moduleProgress[moduleKey] ?? createDefaultLessonProgress()
        moduleProgress[moduleKey] = {
          ...existing,
          visited: existing.visited || legacy.visited,
          completedSections: Array.from(
            new Set([...existing.completedSections, ...legacy.completedSections]),
          ),
        }
      }
    }
  }

  const legacyCompletedSections = Array.isArray(raw.completedSections)
    ? (raw.completedSections as string[]).map(migrateModuleId)
    : []

  if (legacyCompletedSections.length > 0 || typeof raw.visited === 'boolean') {
    const foundations = moduleProgress['initials'] ?? createDefaultLessonProgress()
    moduleProgress['initials'] = {
      ...foundations,
      visited: (typeof raw.visited === 'boolean' ? raw.visited : false) || foundations.visited,
      completedSections: legacyCompletedSections,
    }
  }

  const migrated: PinyinProgress = {
    ...base,
    visited: typeof raw.visited === 'boolean' ? raw.visited : false,
    moduleProgress,
  }

  return deriveLegacyFields(migrated)
}

function migrateV1ToV4(raw: Record<string, unknown>): PinyinProgress {
  const legacyCompletedSections = Array.isArray(raw.completedSections)
    ? (raw.completedSections as string[]).map(migrateModuleId)
    : []
  const moduleProgress: Partial<Record<PinyinModuleKey, PinyinLessonProgress>> = {}

  if (legacyCompletedSections.length > 0 || typeof raw.visited === 'boolean') {
    moduleProgress['initials'] = {
      visited: typeof raw.visited === 'boolean' ? raw.visited : false,
      completedSections: legacyCompletedSections,
      shadowingCompletedPromptIds: Array.isArray(raw.shadowingCompletedPromptIds)
        ? (raw.shadowingCompletedPromptIds as string[])
        : [],
      lastVisitedPromptId:
        raw.lastVisitedPromptId !== null && typeof raw.lastVisitedPromptId === 'string'
          ? raw.lastVisitedPromptId
          : null,
    }
  }

  const base = createDefaultPinyinProgress()
  const migrated: PinyinProgress = {
    ...base,
    visited: typeof raw.visited === 'boolean' ? raw.visited : false,
    moduleProgress,
  }

  return deriveLegacyFields(migrated)
}

export function loadPinyinProgress(): PinyinProgress {
  const savedProgress = loadJsonFromStorage<unknown>(pinyinProgressStorageKey)

  if (typeof savedProgress !== 'object' || savedProgress === null) {
    return createDefaultPinyinProgress()
  }

  const raw = savedProgress as Record<string, unknown>

  if (isPinyinProgressV4(savedProgress)) {
    return deriveLegacyFields(savedProgress as PinyinProgress)
  }

  if (isPinyinProgressV3(savedProgress)) {
    return migrateV3ToV4(raw)
  }

  if (isPinyinProgressV2(savedProgress)) {
    return migrateV2ToV4(raw)
  }

  if (isPinyinProgressV1(savedProgress)) {
    return migrateV1ToV4(raw)
  }

  return createDefaultPinyinProgress()
}

export function savePinyinProgress(progress: PinyinProgress) {
  saveJsonToStorage(pinyinProgressStorageKey, deriveLegacyFields(progress))
}

function recordPinyinSectionComplete(
  progress: PinyinProgress,
  moduleKey: PinyinModuleKey,
  sectionId: PinyinModuleId,
): PinyinProgress {
  const mp = progress.moduleProgress[moduleKey] ?? createDefaultLessonProgress()

  if (mp.completedSections.includes(sectionId)) {
    return progress
  }

  const updated: PinyinProgress = {
    ...progress,
    moduleProgress: {
      ...progress.moduleProgress,
      [moduleKey]: {
        ...mp,
        visited: true,
        completedSections: [...mp.completedSections, sectionId],
      },
    },
  }

  return deriveLegacyFields(updated)
}

export function recordPinyinReferenceComplete(
  progress: PinyinProgress,
  moduleKey: PinyinModuleKey,
): PinyinProgress {
  return recordPinyinSectionComplete(progress, moduleKey, 'reference')
}
