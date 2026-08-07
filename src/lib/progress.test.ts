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
      lastVisitedLesson: 'self-intro' as const,
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

  it('persists progress that references the new sixth through tenth formal lessons', async () => {
    const { createDefaultProgress, loadProgress, saveProgress } = await importProgressModule()
    const updatedProgress: LearnerProgress = {
      ...createDefaultProgress(),
      completedLessons: ['restaurant-order', 'metro-ticket', 'pharmacy-help'],
      reviewQueue: [
        'restaurant-order-review-1',
        'metro-ticket-review-1',
        'pharmacy-help-review-1',
        'ask-for-help-problem-review-1',
        'train-station-ticket-review-1',
      ],
      lastVisitedLesson: 'train-station-ticket',
      lessonStepProgress: {
        'restaurant-order': {
          completedSections: ['dialogue', 'practice'],
          shortInputComplete: true,
        },
        'metro-ticket': {
          completedSections: ['dialogue'],
          shortInputComplete: false,
        },
        'pharmacy-help': {
          completedSections: ['dialogue', 'patterns'],
          shortInputComplete: true,
        },
        'ask-for-help-problem': {
          completedSections: ['dialogue'],
          shortInputComplete: false,
        },
        'train-station-ticket': {
          completedSections: [],
          shortInputComplete: false,
        },
      },
    }

    saveProgress(updatedProgress)

    expect(loadProgress()).toEqual(updatedProgress)
  })

  it('continues from lesson five to six, lesson nine to ten, and does not overflow after lesson ten', async () => {
    const { createDefaultProgress, getContinueLessonId } = await importProgressModule()

    expect(
      getContinueLessonId({
        ...createDefaultProgress(),
        completedLessons: [
          'self-intro',
          'ask-directions',
          'order-food',
          'phone-and-payment',
          'convenience-store-run',
        ],
        lastVisitedLesson: 'convenience-store-run',
      }),
    ).toBe('restaurant-order')
    expect(
      getContinueLessonId({
        ...createDefaultProgress(),
        completedLessons: [
          'self-intro',
          'ask-directions',
          'order-food',
          'phone-and-payment',
          'convenience-store-run',
          'restaurant-order',
          'metro-ticket',
          'pharmacy-help',
          'ask-for-help-problem',
        ],
        lastVisitedLesson: 'ask-for-help-problem',
      }),
    ).toBe('train-station-ticket')
    expect(
      getContinueLessonId({
        ...createDefaultProgress(),
        completedLessons: [
          'self-intro',
          'ask-directions',
          'order-food',
          'phone-and-payment',
          'convenience-store-run',
          'restaurant-order',
          'metro-ticket',
          'pharmacy-help',
          'ask-for-help-problem',
          'train-station-ticket',
        ],
        lastVisitedLesson: 'train-station-ticket',
      }),
    ).toBe('train-station-ticket')
  })

  it('continues through the original fourth and fifth lessons in canonical course order', async () => {
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

  it('completes new formal lessons by queuing their review cards', async () => {
    const { completeLesson, createDefaultProgress } = await importProgressModule()

    const afterRestaurant = completeLesson('restaurant-order', createDefaultProgress())
    const afterProblemHelp = completeLesson('ask-for-help-problem', afterRestaurant)
    const afterTrainTicket = completeLesson('train-station-ticket', afterProblemHelp)

    expect(afterRestaurant.completedLessons).toEqual(['restaurant-order'])
    expect(afterRestaurant.reviewQueue).toEqual([
      'restaurant-order-review-1',
      'restaurant-order-review-2',
      'restaurant-order-review-3',
      'restaurant-order-review-4',
      'restaurant-order-review-5',
      'restaurant-order-review-6',
    ])
    expect(afterRestaurant.lessonStepProgress['restaurant-order']).toEqual({
      completedSections: [],
      shortInputComplete: true,
    })
    expect(afterTrainTicket.completedLessons).toEqual([
      'restaurant-order',
      'ask-for-help-problem',
      'train-station-ticket',
    ])
    expect(afterTrainTicket.reviewQueue).toEqual([
      'restaurant-order-review-1',
      'restaurant-order-review-2',
      'restaurant-order-review-3',
      'restaurant-order-review-4',
      'restaurant-order-review-5',
      'restaurant-order-review-6',
      'ask-for-help-problem-review-1',
      'ask-for-help-problem-review-2',
      'ask-for-help-problem-review-3',
      'ask-for-help-problem-review-4',
      'ask-for-help-problem-review-5',
      'ask-for-help-problem-review-6',
      'train-station-ticket-review-1',
      'train-station-ticket-review-2',
      'train-station-ticket-review-3',
      'train-station-ticket-review-4',
      'train-station-ticket-review-5',
      'train-station-ticket-review-6',
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
      'self-intro-review-4',
      'self-intro-review-5',
      'self-intro-review-6',
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
      'self-intro-review-4',
      'self-intro-review-5',
      'self-intro-review-6',
    ])
  })
})
