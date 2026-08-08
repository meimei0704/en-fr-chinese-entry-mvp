import type { PinyinLessonId, PinyinLessonProgress, PinyinModuleId, PinyinProgress } from '../content/types'
import { loadJsonFromStorage, saveJsonToStorage } from './storage'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

export function createDefaultPinyinProgress(): PinyinProgress {
  return {
    schemaVersion: 3,
    visited: false,
    completedSections: [],
    practiceLastScore: null,
    practiceBestScore: null,
    shadowingCompletedPromptIds: [],
    lastVisitedPromptId: null,
    lessonProgress: {},
  }
}

export function createDefaultLessonProgress(): PinyinLessonProgress {
  return {
    visited: false,
    completedSections: [],
    practiceLastScore: null,
    practiceBestScore: null,
    shadowingCompletedPromptIds: [],
    lastVisitedPromptId: null,
  }
}

export function ensureLessonProgress(
  progress: PinyinProgress,
  lessonId: PinyinLessonId,
): PinyinLessonProgress {
  if (!progress.lessonProgress[lessonId]) {
    return createDefaultLessonProgress()
  }

  return progress.lessonProgress[lessonId]
}

function deriveLegacyFields(progress: PinyinProgress): PinyinProgress {
  const entries = Object.values(progress.lessonProgress).filter(
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

  const scores = entries
    .map((lp) => lp.practiceLastScore)
    .filter((s): s is number => s !== null)
  const scoresForBest = entries
    .map((lp) => lp.practiceBestScore)
    .filter((s): s is number => s !== null)

  return {
    ...progress,
    completedSections,
    practiceLastScore: scores.length > 0 ? scores[scores.length - 1] : null,
    practiceBestScore: scoresForBest.length > 0 ? Math.max(...scoresForBest) : null,
  }
}

function isPinyinModuleId(value: unknown): value is PinyinModuleId {
  return value === 'reference' || value === 'tone-game' || value === 'practice' || value === 'shadowing'
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
    isScore(lp.practiceLastScore) &&
    isScore(lp.practiceBestScore) &&
    isStringArray(lp.shadowingCompletedPromptIds) &&
    (lp.lastVisitedPromptId === null || typeof lp.lastVisitedPromptId === 'string')
  )
}

function isLessonProgressRecord(
  value: unknown,
): value is Partial<Record<PinyinLessonId, PinyinLessonProgress>> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return Object.values(record).every((entry) => isPinyinLessonProgress(entry))
}

function isPinyinProgressV3(value: unknown): value is PinyinProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  return (
    progress.schemaVersion === 3 &&
    typeof progress.visited === 'boolean' &&
    isPinyinModuleIdArray(progress.completedSections) &&
    isScore(progress.practiceLastScore) &&
    isScore(progress.practiceBestScore) &&
    isStringArray(progress.shadowingCompletedPromptIds) &&
    (progress.lastVisitedPromptId === null || typeof progress.lastVisitedPromptId === 'string') &&
    isLessonProgressRecord(progress.lessonProgress)
  )
}

function isV2LessonProgress(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const lp = value as Record<string, unknown>

  return (
    typeof lp.visited === 'boolean' &&
    isPinyinModuleIdArray(lp.completedSections) &&
    isScore(lp.toneGameLastScore) &&
    isScore(lp.toneGameBestScore) &&
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

function migrateModuleId(value: string): PinyinModuleId {
  return value === 'tone-game' ? 'practice' : (value as PinyinModuleId)
}

function migrateV2ToV3(raw: Record<string, unknown>): PinyinProgress {
  const lessonProgress: Partial<Record<PinyinLessonId, PinyinLessonProgress>> = {}

  const rawLessonProgress = raw.lessonProgress as Record<string, Record<string, unknown>> | undefined
  if (rawLessonProgress) {
    for (const [lessonId, lp] of Object.entries(rawLessonProgress)) {
      if (!lp) {
        continue
      }
      lessonProgress[lessonId as PinyinLessonId] = {
        visited: typeof lp.visited === 'boolean' ? lp.visited : false,
        completedSections: (lp.completedSections as string[]).map(migrateModuleId),
        practiceLastScore: isScore(lp.toneGameLastScore) ? lp.toneGameLastScore : null,
        practiceBestScore: isScore(lp.toneGameBestScore) ? lp.toneGameBestScore : null,
        shadowingCompletedPromptIds: Array.isArray(lp.shadowingCompletedPromptIds)
          ? (lp.shadowingCompletedPromptIds as string[])
          : [],
        lastVisitedPromptId:
          lp.lastVisitedPromptId !== null && typeof lp.lastVisitedPromptId === 'string'
            ? lp.lastVisitedPromptId
            : null,
      }
    }
  }

  const base = createDefaultPinyinProgress()
  const migrated: PinyinProgress = {
    ...base,
    visited: typeof raw.visited === 'boolean' ? raw.visited : false,
    lessonProgress,
  }

  return deriveLegacyFields(migrated)
}

function migrateV1ToV2(raw: Record<string, unknown>): PinyinProgress {
  const legacyCompletedSections = Array.isArray(raw.completedSections)
    ? (raw.completedSections as string[]).map(migrateModuleId)
    : []
  const lessonProgress: PinyinProgress['lessonProgress'] = {}

  if (legacyCompletedSections.length > 0 || typeof raw.visited === 'boolean') {
    lessonProgress['pinyin-foundations-1'] = {
      visited: typeof raw.visited === 'boolean' ? raw.visited : false,
      completedSections: legacyCompletedSections,
      practiceLastScore:
        raw.toneGameLastScore !== null && typeof raw.toneGameLastScore === 'number'
          ? raw.toneGameLastScore
          : null,
      practiceBestScore:
        raw.toneGameBestScore !== null && typeof raw.toneGameBestScore === 'number'
          ? raw.toneGameBestScore
          : null,
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
    lessonProgress,
  }

  return deriveLegacyFields(migrated)
}

export function loadPinyinProgress(): PinyinProgress {
  const savedProgress = loadJsonFromStorage<unknown>(pinyinProgressStorageKey)

  if (typeof savedProgress !== 'object' || savedProgress === null) {
    return createDefaultPinyinProgress()
  }

  const raw = savedProgress as Record<string, unknown>

  if (isPinyinProgressV3(savedProgress)) {
    return deriveLegacyFields(savedProgress as PinyinProgress)
  }

  if (isPinyinProgressV2(savedProgress)) {
    return migrateV2ToV3(raw)
  }

  if (isPinyinProgressV1(savedProgress)) {
    return migrateV1ToV2(raw)
  }

  return createDefaultPinyinProgress()
}

export function savePinyinProgress(progress: PinyinProgress) {
  saveJsonToStorage(pinyinProgressStorageKey, deriveLegacyFields(progress))
}

function recordPinyinSectionComplete(
  progress: PinyinProgress,
  lessonId: PinyinLessonId,
  sectionId: PinyinModuleId,
): PinyinProgress {
  const lp = progress.lessonProgress[lessonId] ?? createDefaultLessonProgress()

  if (lp.completedSections.includes(sectionId)) {
    return progress
  }

  const updated: PinyinProgress = {
    ...progress,
    lessonProgress: {
      ...progress.lessonProgress,
      [lessonId]: {
        ...lp,
        visited: true,
        completedSections: [...lp.completedSections, sectionId],
      },
    },
  }

  return deriveLegacyFields(updated)
}

export function recordPinyinReferenceComplete(
  progress: PinyinProgress,
  lessonId: PinyinLessonId,
): PinyinProgress {
  return recordPinyinSectionComplete(progress, lessonId, 'reference')
}

export function recordPinyinPracticeScore(
  progress: PinyinProgress,
  lessonId: PinyinLessonId,
  score: number,
): PinyinProgress {
  const lp = progress.lessonProgress[lessonId] ?? createDefaultLessonProgress()

  const completedSections: PinyinModuleId[] = lp.completedSections.includes('practice')
    ? lp.completedSections
    : [...lp.completedSections, 'practice']

  const updated: PinyinProgress = {
    ...progress,
    lessonProgress: {
      ...progress.lessonProgress,
      [lessonId]: {
        ...lp,
        visited: true,
        completedSections,
        practiceLastScore: score,
        practiceBestScore:
          lp.practiceBestScore === null ? score : Math.max(lp.practiceBestScore, score),
      },
    },
  }

  return deriveLegacyFields(updated)
}

export function recordPinyinPracticeComplete(
  progress: PinyinProgress,
  lessonId: PinyinLessonId,
): PinyinProgress {
  return recordPinyinSectionComplete(progress, lessonId, 'practice')
}
