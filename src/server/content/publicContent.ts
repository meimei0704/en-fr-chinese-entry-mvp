import { supportedExplanationLanguages, type LessonContent } from '../../content/types.js'
import {
  contentModuleTypes,
  type ContentModuleType,
  type LessonMetaPayload,
  type PublishedCourseContent,
  type PublishedModuleRow,
} from './types.js'

const estimatedDailyMinutes = 10

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLessonMetaPayload(value: unknown): value is LessonMetaPayload {
  return isRecord(value) && typeof value.id === 'string' && isRecord(value.title) && isRecord(value.scenario)
}

function rowOrder(rows: PublishedModuleRow[]) {
  return rows.reduce((lowest, row) => Math.min(lowest, row.displayOrder), Number.POSITIVE_INFINITY)
}

function groupByLesson(rows: PublishedModuleRow[]) {
  const groups = new Map<string, PublishedModuleRow[]>()

  for (const row of rows) {
    if (!row.enabled) {
      continue
    }

    const existing = groups.get(row.lessonId) ?? []
    existing.push(row)
    groups.set(row.lessonId, existing)
  }

  return [...groups.values()].sort((left, right) => rowOrder(left) - rowOrder(right))
}

export function buildLessonFromPublishedModuleRows(rows: PublishedModuleRow[]): LessonContent | null {
  const byModule = new Map<ContentModuleType, PublishedModuleRow>()

  for (const row of rows) {
    byModule.set(row.moduleType, row)
  }

  if (!contentModuleTypes.every((moduleType) => byModule.has(moduleType))) {
    return null
  }

  const meta = byModule.get('lessonMeta')?.payload

  if (!isLessonMetaPayload(meta)) {
    return null
  }

  return {
    id: meta.id as LessonContent['id'],
    title: meta.title as LessonContent['title'],
    scenario: meta.scenario as LessonContent['scenario'],
    dialogue: byModule.get('dialogue')?.payload as LessonContent['dialogue'],
    sentencePatterns: byModule.get('sentencePatterns')?.payload as LessonContent['sentencePatterns'],
    vocabulary: byModule.get('vocabulary')?.payload as LessonContent['vocabulary'],
    practice: byModule.get('practice')?.payload as LessonContent['practice'],
    reviewCards: byModule.get('reviewCards')?.payload as LessonContent['reviewCards'],
  }
}

export function buildCourseFromPublishedModuleRows(rows: PublishedModuleRow[]): PublishedCourseContent {
  return {
    supportedExplanationLanguages,
    estimatedDailyMinutes,
    lessons: groupByLesson(rows).flatMap((lessonRows) => {
      const lesson = buildLessonFromPublishedModuleRows(lessonRows)

      return lesson === null ? [] : [lesson]
    }),
  }
}
