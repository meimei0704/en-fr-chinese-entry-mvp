import { beforeEach, describe, expect, it } from 'vitest'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const existingCourseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const expectedDefaultProgress = {
  schemaVersion: 4,
  visited: false,
  completedSections: [],
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
  moduleProgress: {},
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

  it('persists pinyin progress under the versioned pinyin key with moduleProgress', async () => {
    const { loadPinyinProgress, savePinyinProgress } = await importPinyinProgressModule()
    const existingCourseProgress = JSON.stringify({ completedLessons: ['self-intro'] })

    const updatedProgress = {
      schemaVersion: 4 as const,
      visited: true,
      completedSections: ['reference'] as const,
      shadowingCompletedPromptIds: ['shadow-ni-hao', 'shadow-xie-xie'],
      lastVisitedPromptId: 'shadow-xie-xie',
      moduleProgress: {
        initials: {
          visited: true,
          completedSections: ['reference'] as const,
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

  it('records reference completion and reflects in derived legacy fields', async () => {
    const { createDefaultPinyinProgress, recordPinyinReferenceComplete } =
      await importPinyinProgressModule()
    const moduleKey = 'tones'

    const progress = recordPinyinReferenceComplete(createDefaultPinyinProgress(), moduleKey)

    expect(progress.moduleProgress[moduleKey]).toMatchObject({
      visited: true,
      completedSections: ['reference'],
    })
    expect(progress.completedSections).toEqual(['reference'])

    const progressAgain = recordPinyinReferenceComplete(progress, moduleKey)
    expect(progressAgain.moduleProgress[moduleKey]?.completedSections).toEqual(['reference'])
  })

  it('deriveLegacyFields aggregates completed sections across multiple modules', async () => {
    const {
      createDefaultPinyinProgress,
      recordPinyinReferenceComplete,
      savePinyinProgress,
    } = await importPinyinProgressModule()

    let progress = createDefaultPinyinProgress()
    progress = recordPinyinReferenceComplete(progress, 'initials')

    const multiModule = {
      ...progress,
      moduleProgress: {
        ...progress.moduleProgress,
        finals: {
          visited: true,
          completedSections: ['reference'] as const,
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    savePinyinProgress(multiModule)

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.completedSections.sort()).toEqual(['reference'])
  })

  it('migrates v3 progress to v4 mapping lesson completion to modules', async () => {
    const v3Progress = {
      schemaVersion: 3,
      visited: true,
      completedSections: ['reference', 'practice'],
      practiceLastScore: 6,
      practiceBestScore: 7,
      shadowingCompletedPromptIds: ['shadow-ni-hao'],
      lastVisitedPromptId: 'shadow-ni-hao',
      lessonProgress: {
        'pinyin-foundations-1': {
          visited: true,
          completedSections: ['reference', 'practice'],
          practiceLastScore: 6,
          practiceBestScore: 7,
          shadowingCompletedPromptIds: ['shadow-ni-hao'],
          lastVisitedPromptId: 'shadow-ni-hao',
        },
      },
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v3Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(4)
    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.moduleProgress['initials']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
    })
    expect(result.moduleProgress['finals']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
    })
    expect(result.moduleProgress['tones']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
    })
  })

  it('migrates v2 progress to v4 with tone-game remapped to practice', async () => {
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

    expect(result.schemaVersion).toBe(4)
    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.moduleProgress['initials']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
    })
  })

  it('migrates v1 progress to v4 with tone-game remapped to practice', async () => {
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

    expect(result.schemaVersion).toBe(4)
    expect(result.completedSections.sort()).toEqual(['practice', 'reference'])
    expect(result.moduleProgress['initials']).toMatchObject({
      visited: true,
      completedSections: ['reference', 'practice'],
    })
  })

  it('does not re-migrate already-v4 progress', async () => {
    const v4Progress = {
      schemaVersion: 4,
      visited: true,
      completedSections: ['reference'],
      shadowingCompletedPromptIds: [],
      lastVisitedPromptId: null,
      moduleProgress: {
        initials: {
          visited: true,
          completedSections: ['reference'],
          shadowingCompletedPromptIds: [],
          lastVisitedPromptId: null,
        },
      },
    }

    localStorage.setItem(pinyinProgressStorageKey, JSON.stringify(v4Progress))

    const { loadPinyinProgress } = await importPinyinProgressModule()
    const result = loadPinyinProgress()

    expect(result.schemaVersion).toBe(4)
    expect(result.completedSections).toEqual(['reference'])
    expect(result.moduleProgress['initials']).toMatchObject({
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
