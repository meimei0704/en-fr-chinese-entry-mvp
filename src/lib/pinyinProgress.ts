import type { PinyinModuleId, PinyinProgress } from '../content/types'
import { loadJsonFromStorage, saveJsonToStorage } from './storage'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

export function createDefaultPinyinProgress(): PinyinProgress {
  return {
    schemaVersion: 1,
    visited: false,
    completedSections: [],
    toneGameLastScore: null,
    toneGameBestScore: null,
    shadowingCompletedPromptIds: [],
    lastVisitedPromptId: null,
  }
}

function isPinyinModuleId(value: unknown): value is PinyinModuleId {
  return value === 'reference' || value === 'tone-game' || value === 'shadowing'
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

function isPinyinProgress(value: unknown): value is PinyinProgress {
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

export function loadPinyinProgress(): PinyinProgress {
  const savedProgress = loadJsonFromStorage<unknown>(pinyinProgressStorageKey)

  if (!isPinyinProgress(savedProgress)) {
    return createDefaultPinyinProgress()
  }

  return savedProgress
}

export function savePinyinProgress(progress: PinyinProgress) {
  saveJsonToStorage(pinyinProgressStorageKey, progress)
}
