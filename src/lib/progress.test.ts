import { beforeEach, describe, expect, it } from 'vitest'

async function importProgressModule() {
  return import('./progress')
}

describe('learner progress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates default browser progress for a first-time learner', async () => {
    const { createDefaultProgress } = await importProgressModule()

    expect(createDefaultProgress()).toEqual({
      selectedExplanationLanguage: 'en',
      completedLessons: [],
      reviewQueue: [],
      lastVisitedLesson: null,
      lessonStepProgress: {},
    })
  })

  it('loads defaults when no saved browser progress exists', async () => {
    const { loadProgress } = await importProgressModule()

    expect(loadProgress()).toEqual({
      selectedExplanationLanguage: 'en',
      completedLessons: [],
      reviewQueue: [],
      lastVisitedLesson: null,
      lessonStepProgress: {},
    })
  })

  it('persists and clears browser progress through localStorage', async () => {
    const { clearProgress, loadProgress, saveProgress } = await importProgressModule()

    const updatedProgress = {
      selectedExplanationLanguage: 'fr' as const,
      completedLessons: ['self-intro'],
      reviewQueue: ['ni-hao', 'xie-xie'],
      lastVisitedLesson: 'self-intro',
      lessonStepProgress: {
        'self-intro': {
          completedSections: ['dialogue', 'practice'],
          shortInputComplete: false,
        },
      },
    }

    saveProgress(updatedProgress)
    expect(loadProgress()).toEqual(updatedProgress)

    clearProgress()
    expect(loadProgress()).toEqual({
      selectedExplanationLanguage: 'en',
      completedLessons: [],
      reviewQueue: [],
      lastVisitedLesson: null,
      lessonStepProgress: {},
    })
  })

  it('completes a lesson by marking it done and queuing its review cards', async () => {
    const { completeLesson, createDefaultProgress } = await importProgressModule()

    const updatedProgress = completeLesson('self-intro', {
      ...createDefaultProgress(),
      lessonStepProgress: {
        'self-intro': {
          completedSections: ['dialogue', 'practice'],
          shortInputComplete: false,
        },
      },
    })

    expect(updatedProgress.completedLessons).toEqual(['self-intro'])
    expect(updatedProgress.reviewQueue).toEqual(['self-intro-review-1'])
    expect(updatedProgress.lastVisitedLesson).toBe('self-intro')
    expect(updatedProgress.lessonStepProgress['self-intro']).toEqual({
      completedSections: ['dialogue', 'practice'],
      shortInputComplete: true,
    })

    const repeatedCompletion = completeLesson('self-intro', updatedProgress)

    expect(repeatedCompletion.completedLessons).toEqual(['self-intro'])
    expect(repeatedCompletion.reviewQueue).toEqual(['self-intro-review-1'])
  })
})
