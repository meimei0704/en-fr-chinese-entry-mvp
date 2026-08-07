import type { CourseContent, LessonContent } from '../../content/types.js'

export const contentModuleTypes = [
  'lessonMeta',
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'reviewCards',
] as const

export type ContentModuleType = (typeof contentModuleTypes)[number]

export type RevisionKind = 'draft' | 'published'

export interface LessonMetaPayload {
  id: LessonContent['id'] | string
  title: LessonContent['title']
  scenario: LessonContent['scenario']
}

export type ModulePayload =
  | LessonMetaPayload
  | LessonContent['dialogue']
  | LessonContent['sentencePatterns']
  | LessonContent['vocabulary']
  | LessonContent['practice']
  | LessonContent['reviewCards']

export interface LessonSeedRow {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
}

export interface LessonModuleSeedRow {
  lessonId: string
  moduleType: ContentModuleType
  currentDraftRevisionId: number
  currentPublishedRevisionId: number
}

export interface ModuleRevisionSeedRow {
  revisionId: number
  lessonId: string
  moduleType: ContentModuleType
  payload: ModulePayload
  revisionKind: RevisionKind
  sourceRevisionId: number | null
  createdBy: string
  createdAt: string
  note: string
}

export interface InitialContentSeed {
  lessons: LessonSeedRow[]
  lessonModules: LessonModuleSeedRow[]
  revisions: ModuleRevisionSeedRow[]
}

export interface PublishedModuleRow {
  lessonId: string
  slug: string
  displayOrder: number
  enabled: boolean
  moduleType: ContentModuleType
  revisionId: number
  payload: unknown
}

export interface PublishedContentRepository {
  listPublishedCourseModules(): Promise<PublishedModuleRow[]>
  listPublishedLessonModules(lessonId: string): Promise<PublishedModuleRow[]>
}

export type PublishedCourseContent = CourseContent
