import { beforeEach, describe, expect, it } from 'vitest'

import type { LearnerProgress } from './progress'

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



  it('persists progress that references the fourth and fifth formal lessons', async () => {
    const { createDefaultProgress, loadProgress, saveProgress } = await importProgressModule()
    const updatedProgress: LearnerProgress = {
      ...createDefaultProgress(),
      completedLessons: ['phone-and-payment'],
      reviewQueue: [
        'phone-and-payment-review-1',
        'convenience-store-run-review-1',
      ],
      lastVisitedLesson: 'convenience-store-run',
      lessonStepProgress: {
        'phone-and-payment': {
          completedSections: ['dialogue', 'practice'],
          shortInputComplete: true,
        },
        'convenience-store-run': {
          completedSections: ['dialogue'],
          shortInputComplete: false,
        },
      },
    }

    saveProgress(updatedProgress)

    expect(loadProgress()).toEqual(updatedProgress)
  })

  it('continues through the fourth and fifth lessons in canonical course order', async () => {
    const { createDefaultProgress, getContinueLessonId } = await importProgressModule()

    expect(
      getContinueLessonId({
        ...createDefaultProgress(),
        completedLessons: ['self-intro', 'ask-directions', 'order-food'],
        lastVisitedLesson: 'order-food',
      }),
    ).toBe('phone-and-payment')
    expect(
      getContinueLessonId({
        ...createDefaultProgress(),
        completedLessons: ['self-intro', 'ask-directions', 'order-food', 'phone-and-payment'],
        lastVisitedLesson: 'phone-and-payment',
      }),
    ).toBe('convenience-store-run')
  })

  it('completes lessons four and five by queuing their review cards', async () => {
    const { completeLesson, createDefaultProgress } = await importProgressModule()

    const afterPhonePayment = completeLesson('phone-and-payment', createDefaultProgress())
    const afterStoreRun = completeLesson('convenience-store-run', afterPhonePayment)

    expect(afterPhonePayment.completedLessons).toEqual(['phone-and-payment'])
    expect(afterPhonePayment.reviewQueue).toEqual([
      'phone-and-payment-review-1',
      'phone-and-payment-review-2',
      'phone-and-payment-review-3',
    ])
    expect(afterPhonePayment.lessonStepProgress['phone-and-payment']).toEqual({
      completedSections: [],
      shortInputComplete: true,
    })
    expect(afterStoreRun.completedLessons).toEqual([
      'phone-and-payment',
      'convenience-store-run',
    ])
    expect(afterStoreRun.reviewQueue).toEqual([
      'phone-and-payment-review-1',
      'phone-and-payment-review-2',
      'phone-and-payment-review-3',
      'convenience-store-run-review-1',
      'convenience-store-run-review-2',
      'convenience-store-run-review-3',
    ])
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
    expect(updatedProgress.reviewQueue).toEqual([
      'self-intro-review-1',
      'self-intro-review-2',
      'self-intro-review-3',
    ])
    expect(updatedProgress.lastVisitedLesson).toBe('self-intro')
    expect(updatedProgress.lessonStepProgress['self-intro']).toEqual({
      completedSections: ['dialogue', 'practice'],
      shortInputComplete: true,
    })

    const repeatedCompletion = completeLesson('self-intro', updatedProgress)

    expect(repeatedCompletion.completedLessons).toEqual(['self-intro'])
    expect(repeatedCompletion.reviewQueue).toEqual([
      'self-intro-review-1',
      'self-intro-review-2',
      'self-intro-review-3',
    ])
  })
})
