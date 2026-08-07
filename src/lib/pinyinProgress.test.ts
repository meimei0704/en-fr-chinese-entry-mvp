import { beforeEach, describe, expect, it } from 'vitest'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const existingCourseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const expectedDefaultProgress = {
  schemaVersion: 2,
  visited: false,
  completedSections: [],
  toneGameLastScore: null,
  toneGameBestScore: null,
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
  lessonProgress: {},
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

  it('persists pinyin progress under the versioned pinyin key with lessonProgress', async () => {
    const { loadPinyinProgress, savePinyinProgress } = await importPinyinProgressModule()
    const existingCourseProgress = JSON.stringify({ completedLessons: ['self-intro'] })

    const updatedProgress = {
      schemaVersion: 2 as const,
      visited: true,
      completedSections: ['reference', 'tone-game'] as const,
      toneGameLastScore: 6,
      toneGameBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao', 'shadow-xie-xie'],
      lastVisitedPromptId: 'shadow-xie-xie',
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference', 'tone-game'] as const,
          toneGameLastScore: 6,
          toneGameBestScore: 7,
          shadowingCompletedPromptIds: ['shadow-ni-hao', 'shadow-xie-xie'],
          lastVisitedPromptId: 'shadow-xie-xie',
        },
      },
    }

    localStorage.setItem(existingCourseProgressStorageKey, existingCourseProgress)

    savePinyinProgress(updatedProgress)

    expect(localStorage.getItem(existingCourseProgressStorageKey)).toBe(existingCourseProgress)
    expect(JSON.parse(localStorage.getItem(pinyinProgressStorageKey) ?? '{}')).toEqual(
      updatedProgress,
    )
    expect(loadPinyinProgress()).toEqual(updatedProgress)
  })

  it('records tone game scores, best score, and completion threshold', async () => {
    const {
      createDefaultPinyinProgress,
      loadPinyinProgress,
      recordPinyinToneGameScore,
      savePinyinProgress,
    } = await importPinyinProgressModule()
    const lessonId = 'pinyin-foundations-1'

    const progressAfterPractice = recordPinyinToneGameScore(createDefaultPinyinProgress(), lessonId, 5)

    expect(progressAfterPractice.lessonProgress[lessonId]).toMatchObject({
      completedSections: [],
      toneGameLastScore: 5,
      toneGameBestScore: 5,
    })
    expect(progressAfterPractice.completedSections).toEqual([])

    const progressAfterPassingScore = recordPinyinToneGameScore(progressAfterPractice, lessonId, 6)

    expect(progressAfterPassingScore.lessonProgress[lessonId]).toMatchObject({
      completedSections: ['tone-game'],
      toneGameLastScore: 6,
      toneGameBestScore: 6,
    })
    expect(progressAfterPassingScore.completedSections).toEqual(['tone-game'])

    const progressAfterLowerRetake = recordPinyinToneGameScore(progressAfterPassingScore, lessonId, 4)

    expect(progressAfterLowerRetake.lessonProgress[lessonId]).toMatchObject({
      completedSections: ['tone-game'],
      toneGameLastScore: 4,
      toneGameBestScore: 6,
    })
    expect(progressAfterLowerRetake.completedSections).toEqual(['tone-game'])

    savePinyinProgress(progressAfterLowerRetake)
    expect(loadPinyinProgress()).toEqual(progressAfterLowerRetake)
  })

  it('records reference completion and reflects in derived legacy fields', async () => {
    const { createDefaultPinyinProgress, recordPinyinReferenceComplete } =
      await importPinyinProgressModule()
    const lessonId = 'pinyin-foundations-1'

    const progress = recordPinyinReferenceComplete(createDefaultPinyinProgress(), lessonId)

    expect(progress.lessonProgress[lessonId]).toMatchObject({
      visited: true,
      completedSections: ['reference'],
    })
    expect(progress.completedSections).toEqual(['reference'])

    const progressAgain = recordPinyinReferenceComplete(progress, lessonId)
    expect(progressAgain.lessonProgress[lessonId]?.completedSections).toEqual(['reference'])
  })

  it('deriveLegacyFields aggregates across multiple lessons', async () => {
    const {
      createDefaultPinyinProgress,
      recordPinyinReferenceComplete,
      recordPinyinToneGameScore,
      savePinyinProgress,
    } = await importPinyinProgressModule()

    let progress = createDefaultPinyinProgress()
    progress = recordPinyinReferenceComplete(progress, 'pinyin-foundations-1')
    progress = recordPinyinToneGameScore(progress, 'pinyin-foundations-1', 6)

    const multiLesson = {
      ...progress,
      lessonProgress: {
        ...progress.lessonProgress,
        'pinyin-sibilants-2': {
          visited: true,
          completedSections: ['reference'] as const,
          toneGameLastScore: 5,
          toneGameBestScore: 7,
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    savePinyinProgress(multiLesson)

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.completedSections.sort()).toEqual(['reference', 'tone-game'])
    expect(result.toneGameLastScore).toBe(5)
    expect(result.toneGameBestScore).toBe(7)
  })

  it('migrates v1 progress to v2 with lessonProgress and derived fields', async () => {
    const v1Progress = {
      schemaVersion: 1,
      visited: true,
      completedSections: ['reference', 'tone-game'],
      toneGameLastScore: 6,
      toneGameBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao'],
      lastVisitedPromptId: 'shadow-ni-hao',
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v1Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(2)
    expect(result.completedSections.sort()).toEqual(['reference', 'tone-game'])
    expect(result.toneGameLastScore).toBe(6)
    expect(result.toneGameBestScore).toBe(7)
    expect(result.lessonProgress['pinyin-foundations-1']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'tone-game'],
      toneGameLastScore: 6,
      toneGameBestScore: 7,
    })
  })

  it('does not re-migrate already-v2 progress', async () => {
    const v2Progress = {
      schemaVersion: 2,
      visited: true,
      completedSections: ['reference'],
      toneGameLastScore: null,
      toneGameBestScore: null,
      shadowingCompletedPromptIds: [],
      lastVisitedPromptId: null,
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference'],
          toneGameLastScore: null,
          toneGameBestScore: null,
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v2Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(2)
    expect(result.completedSections).toEqual(['reference'])
    expect(result.lessonProgress['pinyin-foundations-1']).toMatchObject({
      visited: true,
      completedSections: ['reference'],
    })
  })

  it('falls back to default pinyin progress for invalid stored data', async () => {
    const { loadPinyinProgress } = await importPinyinProgressModule()

    localStorage.setItem(pinyinProgressStorageKey, '{not-valid-json')
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify({ schemaVersion: 3 }))
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)
  })
})
