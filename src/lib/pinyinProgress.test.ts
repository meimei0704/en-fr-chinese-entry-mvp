import { beforeEach, describe, expect, it } from 'vitest'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const existingCourseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const expectedDefaultProgress = {
  schemaVersion: 3,
  visited: false,
  completedSections: [],
  practiceLastScore: null,
  practiceBestScore: null,
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
      schemaVersion: 3 as const,
      visited: true,
      completedSections: ['reference', 'practice'] as const,
      practiceLastScore: 6,
      practiceBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao', 'shadow-xie-xie'],
      lastVisitedPromptId: 'shadow-xie-xie',
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference', 'practice'] as const,
          practiceLastScore: 6,
          practiceBestScore: 7,
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

  it('records practice scores, best score, and completion', async () => {
    const {
      createDefaultPinyinProgress,
      loadPinyinProgress,
      recordPinyinPracticeScore,
      savePinyinProgress,
    } = await importPinyinProgressModule()
    const lessonId = 'pinyin-foundations-1'

    const progressAfterPractice = recordPinyinPracticeScore(createDefaultPinyinProgress(), lessonId, 5)

    expect(progressAfterPractice.lessonProgress[lessonId]).toMatchObject({
      completedSections: ['practice'],
      practiceLastScore: 5,
      practiceBestScore: 5,
    })
    expect(progressAfterPractice.completedSections).toEqual(['practice'])

    const progressAfterHigherRetake = recordPinyinPracticeScore(progressAfterPractice, lessonId, 9)

    expect(progressAfterHigherRetake.lessonProgress[lessonId]).toMatchObject({
      completedSections: ['practice'],
      practiceLastScore: 9,
      practiceBestScore: 9,
    })

    const progressAfterLowerRetake = recordPinyinPracticeScore(progressAfterHigherRetake, lessonId, 4)

    expect(progressAfterLowerRetake.lessonProgress[lessonId]).toMatchObject({
      completedSections: ['practice'],
      practiceLastScore: 4,
      practiceBestScore: 9,
    })

    savePinyinProgress(progressAfterLowerRetake)
    expect(loadPinyinProgress()).toEqual(progressAfterLowerRetake)
  })

  it('records practice completion without a score', async () => {
    const { createDefaultPinyinProgress, recordPinyinPracticeComplete } =
      await importPinyinProgressModule()
    const lessonId = 'pinyin-foundations-1'

    const progress = recordPinyinPracticeComplete(createDefaultPinyinProgress(), lessonId)

    expect(progress.lessonProgress[lessonId]).toMatchObject({
      visited: true,
      completedSections: ['practice'],
    })
    expect(progress.completedSections).toEqual(['practice'])
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
      recordPinyinPracticeScore,
      recordPinyinReferenceComplete,
      savePinyinProgress,
    } = await importPinyinProgressModule()

    let progress = createDefaultPinyinProgress()
    progress = recordPinyinReferenceComplete(progress, 'pinyin-foundations-1')
    progress = recordPinyinPracticeScore(progress, 'pinyin-foundations-1', 6)

    const multiLesson = {
      ...progress,
      lessonProgress: {
        ...progress.lessonProgress,
        'pinyin-sibilants-2': {
          visited: true,
          completedSections: ['reference'] as const,
          practiceLastScore: 5,
          practiceBestScore: 7,
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    savePinyinProgress(multiLesson)

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.practiceLastScore).toBe(5)
    expect(result.practiceBestScore).toBe(7)
  })

  it('migrates v2 progress to v3 with tone-game remapped to practice', async () => {
    const v2Progress = {
      schemaVersion: 2,
      visited: true,
      completedSections: ['reference', 'tone-game'],
      toneGameLastScore: 6,
      toneGameBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao'],
      lastVisitedPromptId: 'shadow-ni-hao',
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference', 'tone-game'],
          toneGameLastScore: 6,
          toneGameBestScore: 7,
          shadowingCompletedPromptIds: ['shadow-ni-hao'],
          lastVisitedPromptId: 'shadow-ni-hao',
        },
      },
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v2Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(3)
    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.practiceLastScore).toBe(6)
    expect(result.practiceBestScore).toBe(7)
    expect(result.lessonProgress['pinyin-foundations-1']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
      practiceLastScore: 6,
      practiceBestScore: 7,
    })
  })

  it('migrates v1 progress to v3 with tone-game remapped to practice', async () => {
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

    expect(result.schemaVersion).toBe(3)
    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.practiceLastScore).toBe(6)
    expect(result.practiceBestScore).toBe(7)
    expect(result.lessonProgress['pinyin-foundations-1']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
      practiceLastScore: 6,
      practiceBestScore: 7,
    })
  })

  it('does not re-migrate already-v3 progress', async () => {
    const v3Progress = {
      schemaVersion: 3,
      visited: true,
      completedSections: ['reference'],
      practiceLastScore: null,
      practiceBestScore: null,
      shadowingCompletedPromptIds: [],
      lastVisitedPromptId: null,
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference'],
          practiceLastScore: null,
          practiceBestScore: null,
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v3Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(3)
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

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify({ schemaVersion: 99 }))
    expect(loadPinyinProgress()).toEqual(expectedDefaultProgress)
  })
})
