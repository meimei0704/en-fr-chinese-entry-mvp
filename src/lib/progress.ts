import { course } from '../content/course'
import type { ExplanationLanguage, LessonId } from '../content/types'
import {
  loadJsonFromStorage,
  removeFromStorage,
  saveJsonToStorage,
} from './storage'

const progressStorageKey = 'en-fr-chinese-entry-mvp.progress'

export interface LessonStepProgress {
  completedSections: string[]
  shortInputComplete: boolean
}

export interface LearnerProgress {
  selectedExplanationLanguage: ExplanationLanguage
  completedLessons: LessonId[]
  reviewQueue: string[]
  lastVisitedLesson: LessonId | null
  lessonStepProgress: Partial<Record<LessonId, LessonStepProgress>>
}

export function createDefaultProgress(): LearnerProgress {
  return {
    selectedExplanationLanguage: 'en',
    completedLessons: [],
    reviewQueue: [],
    lastVisitedLesson: null,
    lessonStepProgress: {},
  }
}

function isExplanationLanguage(value: unknown): value is ExplanationLanguage {
  return value === 'en' || value === 'fr'
}

function isLessonId(value: unknown): value is LessonId {
  return (
    typeof value === 'string' &&
    course.lessons.some((lesson) => lesson.id === value)
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isLessonStepProgress(value: unknown): value is LessonStepProgress {
  return (
    typeof value === 'object' &&
    value !== null &&
    'completedSections' in value &&
    isStringArray(value.completedSections) &&
    'shortInputComplete' in value &&
    typeof value.shortInputComplete === 'boolean'
  )
}

function isLearnerProgress(value: unknown): value is LearnerProgress {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Record<string, unknown>

  if (
    !isExplanationLanguage(progress.selectedExplanationLanguage) ||
    !Array.isArray(progress.completedLessons) ||
    !progress.completedLessons.every(isLessonId) ||
    !isStringArray(progress.reviewQueue) ||
    !(progress.lastVisitedLesson === null || isLessonId(progress.lastVisitedLesson)) ||
    typeof progress.lessonStepProgress !== 'object' ||
    progress.lessonStepProgress === null
  ) {
    return false
  }

  return Object.entries(progress.lessonStepProgress).every(
    ([lessonId, lessonProgress]) => isLessonId(lessonId) && isLessonStepProgress(lessonProgress),
  )
}

export function loadProgress(): LearnerProgress {
  const savedProgress = loadJsonFromStorage<unknown>(progressStorageKey)

  if (!isLearnerProgress(savedProgress)) {
    return createDefaultProgress()
  }

  return savedProgress
}

export function saveProgress(progress: LearnerProgress) {
  saveJsonToStorage(progressStorageKey, progress)
}

export function clearProgress() {
  removeFromStorage(progressStorageKey)
}

export function completeLesson(
  lessonId: LessonId,
  progress: LearnerProgress,
): LearnerProgress {
  const lesson = course.lessons.find((entry) => entry.id === lessonId)

  if (!lesson) {
    return progress
  }

  const lessonProgress = progress.lessonStepProgress[lessonId] ?? {
    completedSections: [],
    shortInputComplete: false,
  }

  return {
    ...progress,
    completedLessons: progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId],
    reviewQueue: Array.from(
      new Set([...progress.reviewQueue, ...lesson.reviewCards.map((card) => card.id)]),
    ),
    lastVisitedLesson: lessonId,
    lessonStepProgress: {
      ...progress.lessonStepProgress,
      [lessonId]: {
        ...lessonProgress,
        shortInputComplete: true,
      },
    },
  }
}

export function getContinueLessonId(progress: LearnerProgress): LessonId | null {
  if (progress.lastVisitedLesson === null) {
    return course.lessons[0]?.id ?? null
  }

  if (!progress.completedLessons.includes(progress.lastVisitedLesson)) {
    return progress.lastVisitedLesson
  }

  const currentLessonIndex = course.lessons.findIndex(
    (lesson) => lesson.id === progress.lastVisitedLesson,
  )
  const nextLesson = course.lessons[currentLessonIndex + 1]

  return nextLesson?.id ?? progress.lastVisitedLesson
}
