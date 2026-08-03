import { beforeEach, describe, expect, it } from 'vitest'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const existingCourseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const expectedDefaultProgress = {
  schemaVersion: 1,
  visited: false,
  completedSections: [],
  toneGameLastScore: null,
  toneGameBestScore: null,
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
}

async function importPinyinProgressModule() {
  return import('./pinyinProgress')
}

describe('pinyin progress storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads default pinyin progress when storage is empty', async () => {
    const { createDefaultPinyinProgress, loadPinyinProgress } = await importPinyinProgressModule()

    expect(createDefaultPinyinProgress()).toEqual(expectedDefaultProgress)
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)
  })

  it('persists only pinyin progress under the versioned pinyin key', async () => {
    const { loadPinyinProgress, savePinyinProgress } = await importPinyinProgressModule()
    const existingCourseProgress = JSON.stringify({ completedLessons: ['self-intro'] })
    const updatedProgress = {
      schemaVersion: 1 as const,
      visited: true,
      completedSections: ['reference', 'tone-game'] as const,
      toneGameLastScore: 6,
      toneGameBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao', 'shadow-xie-xie'],
      lastVisitedPromptId: 'shadow-xie-xie',
    }

    localStorage.setItem(existingCourseProgressStorageKey, existingCourseProgress)

    savePinyinProgress(updatedProgress)

    expect(localStorage.getItem(existingCourseProgressStorageKey)).toBe(existingCourseProgress)
    expect(JSON.parse(localStorage.getItem(pinyinProgressStorageKey) ?? '{}')).toEqual(updatedProgress)
    expect(loadPinyinProgress()).toEqual(updatedProgress)
  })

  it('falls back to default pinyin progress for invalid stored data', async () => {
    const { loadPinyinProgress } = await importPinyinProgressModule()

    localStorage.setItem(pinyinProgressStorageKey, '{not-valid-json')
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify({ schemaVersion: 2 }))
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)
  })
})
