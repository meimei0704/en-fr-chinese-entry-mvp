import type { LessonContent } from '../content/types.js'
import type { ContentModuleType } from '../server/content/types.js'

export interface AdminLessonSummary {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  draftChangedModuleCount: number
}

export interface AdminModuleSnapshot {
  moduleType: ContentModuleType
  draftRevisionId: number
  publishedRevisionId: number
  hasUnpublishedChanges: boolean
}

export interface PublishedModuleHistoryEntry {
  lessonId: string
  moduleType: ContentModuleType
  revisionId: number
  payload: unknown
  createdAt: string
  createdBy: string
  note: string | null
  sourceRevisionId: number | null
}

export type AdminPublishedHistory = Record<ContentModuleType, PublishedModuleHistoryEntry[]>

export interface AdminLessonSnapshot {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  draftLesson: LessonContent | null
  publishedLesson: LessonContent | null
  modules: AdminModuleSnapshot[]
  publishedHistory: AdminPublishedHistory
}
