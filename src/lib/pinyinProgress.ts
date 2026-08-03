import type { PinyinModuleId, PinyinProgress } from '../content/types'
import { loadJsonFromStorage, saveJsonToStorage } from './storage'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const toneGameCompletionThreshold = 6

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

export function recordPinyinToneGameScore(
  progress: PinyinProgress,
  score: number,
): PinyinProgress {
  const completedSections: PinyinProgress['completedSections'] =
    score >= toneGameCompletionThreshold && !progress.completedSections.includes('tone-game')
      ? [...progress.completedSections, 'tone-game']
      : progress.completedSections

  return {
    ...progress,
    completedSections,
    toneGameLastScore: score,
    toneGameBestScore:
      progress.toneGameBestScore === null ? score : Math.max(progress.toneGameBestScore, score),
  }
}

export function recordPinyinShadowingPromptComplete(
  progress: PinyinProgress,
  promptId: string,
  promptIds: readonly string[],
): PinyinProgress {
  const shadowingCompletedPromptIds = progress.shadowingCompletedPromptIds.includes(promptId)
    ? progress.shadowingCompletedPromptIds
    : [...progress.shadowingCompletedPromptIds, promptId]
  const completedEveryPrompt =
    promptIds.length > 0 && promptIds.every((id) => shadowingCompletedPromptIds.includes(id))
  const completedSections: PinyinProgress['completedSections'] =
    completedEveryPrompt && !progress.completedSections.includes('shadowing')
      ? [...progress.completedSections, 'shadowing']
      : progress.completedSections

  return {
    ...progress,
    completedSections,
    shadowingCompletedPromptIds,
    lastVisitedPromptId: promptId,
  }
}
