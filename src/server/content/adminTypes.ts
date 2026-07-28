import type { LessonContent } from '../../content/types.js'
import type { ContentModuleType } from './types.js'

export interface AdminLessonSummary {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  draftChangedModuleCount: number
}

export interface CurrentModuleState {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  moduleType: ContentModuleType
  draftRevisionId: number
  draftPayload: unknown
  draftCreatedAt: string
  draftCreatedBy: string
  draftNote: string | null
  draftSourceRevisionId: number | null
  publishedRevisionId: number
  publishedPayload: unknown
  publishedCreatedAt: string
  publishedCreatedBy: string
  publishedNote: string | null
  publishedSourceRevisionId: number | null
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

export interface InsertModuleRevisionInput {
  lessonId: string
  moduleType: ContentModuleType
  payload: unknown
  revisionKind: 'draft' | 'published'
  sourceRevisionId: number | null
  createdBy: string
  note: string | null
}

export interface InsertedModuleRevision extends InsertModuleRevisionInput {
  revisionId: number
  createdAt: string
}

export type ContentModuleRevisionRow = InsertedModuleRevision

export interface ModuleSnapshot {
  moduleType: ContentModuleType
  draftRevisionId: number
  publishedRevisionId: number
  hasUnpublishedChanges: boolean
}

export type ModuleHistoryMap = Record<ContentModuleType, PublishedModuleHistoryEntry[]>

export interface AdminLessonSnapshot {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  draftLesson: LessonContent | null
  publishedLesson: LessonContent | null
  modules: ModuleSnapshot[]
  publishedHistory: ModuleHistoryMap
}

export interface SaveDraftModuleInput {
  lessonId: string
  moduleType: ContentModuleType
  payload: unknown
  createdBy: string
  note: string | null
}

export interface PublishModuleInput {
  lessonId: string
  moduleType: ContentModuleType
  createdBy: string
  note: string | null
}

export interface RollbackModuleInput extends PublishModuleInput {
  publishedRevisionId: number
}

export interface ContentAdminStore {
  listCurrentModuleStates(): Promise<CurrentModuleState[]>
  listCurrentLessonModuleStates(lessonId: string): Promise<CurrentModuleState[]>
  getCurrentModuleState(lessonId: string, moduleType: ContentModuleType): Promise<CurrentModuleState | null>
  listPublishedModuleHistory(
    lessonId: string,
    moduleType: ContentModuleType,
  ): Promise<PublishedModuleHistoryEntry[]>
  insertModuleRevision(input: InsertModuleRevisionInput): Promise<InsertedModuleRevision>
  updateCurrentModuleState(row: ContentModuleRevisionRow): Promise<void>
  runInTransaction<T>(work: (store: ContentAdminStore) => Promise<T>): Promise<T>
}
