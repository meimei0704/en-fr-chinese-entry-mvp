import type { CourseContent, LessonContent } from '../../content/types'
import {
  contentModuleTypes,
  type ContentModuleType,
  type InitialContentSeed,
  type ModulePayload,
} from './types'

export interface LessonModulePayload {
  moduleType: ContentModuleType
  payload: ModulePayload
}

export function lessonToModulePayloads(lesson: LessonContent): LessonModulePayload[] {
  return [
    {
      moduleType: 'lessonMeta',
      payload: {
        id: lesson.id,
        title: lesson.title,
        scenario: lesson.scenario,
      },
    },
    { moduleType: 'dialogue', payload: lesson.dialogue },
    { moduleType: 'sentencePatterns', payload: lesson.sentencePatterns },
    { moduleType: 'vocabulary', payload: lesson.vocabulary },
    { moduleType: 'practice', payload: lesson.practice },
    { moduleType: 'reviewCards', payload: lesson.reviewCards },
  ]
}

export function createInitialContentSeed(
  course: CourseContent,
  now = '2026-07-26T00:00:00.000Z',
): InitialContentSeed {
  let nextRevisionId = 1
  const lessons = course.lessons.map((lesson, index) => ({
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: index + 1,
    enabled: true,
  }))
  const lessonModules: InitialContentSeed['lessonModules'] = []
  const revisions: InitialContentSeed['revisions'] = []

  for (const lesson of course.lessons) {
    for (const { moduleType, payload } of lessonToModulePayloads(lesson)) {
      const publishedRevisionId = nextRevisionId++
      const draftRevisionId = nextRevisionId++

      revisions.push({
        revisionId: publishedRevisionId,
        lessonId: lesson.id,
        moduleType,
        payload,
        revisionKind: 'published',
        sourceRevisionId: null,
        createdBy: 'seed:static-content',
        createdAt: now,
        note: 'Initial published content imported from static lesson source.',
      })
      revisions.push({
        revisionId: draftRevisionId,
        lessonId: lesson.id,
        moduleType,
        payload,
        revisionKind: 'draft',
        sourceRevisionId: publishedRevisionId,
        createdBy: 'seed:static-content',
        createdAt: now,
        note: 'Initial editable draft copied from the published baseline.',
      })
      lessonModules.push({
        lessonId: lesson.id,
        moduleType,
        currentDraftRevisionId: draftRevisionId,
        currentPublishedRevisionId: publishedRevisionId,
      })
    }
  }

  return { lessons, lessonModules, revisions }
}

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`
}

function sqlJson(value: unknown) {
  return sqlString(JSON.stringify(value))
}

export function renderInitialContentSeedSql(course: CourseContent) {
  const seed = createInitialContentSeed(course)
  const lessonValues = seed.lessons
    .map(
      (lesson) =>
        `(${sqlString(lesson.lessonId)}, ${sqlString(lesson.slug)}, ${lesson.displayOrder}, ${lesson.enabled})`,
    )
    .join(',\n')
  const moduleValues = seed.lessonModules
    .map((module) => `(${sqlString(module.lessonId)}, ${sqlString(module.moduleType)})`)
    .join(',\n')
  const revisionValues = seed.revisions
    .map(
      (revision) =>
        `(${revision.revisionId}, ${sqlString(revision.lessonId)}, ${sqlString(revision.moduleType)}, ${sqlJson(
          revision.payload,
        )}, ${sqlString(revision.revisionKind)}, ${
          revision.sourceRevisionId === null ? 'null' : revision.sourceRevisionId
        }, ${sqlString(revision.createdBy)}, ${sqlString(revision.createdAt)}, ${sqlString(
          revision.note,
        )})`,
    )
    .join(',\n')
  const pointerUpdates = seed.lessonModules
    .map(
      (module) => `update lesson_modules
set current_published_revision_id = ${module.currentPublishedRevisionId},
    current_draft_revision_id = ${module.currentDraftRevisionId}
where lesson_id = ${sqlString(module.lessonId)}
  and module_type = ${sqlString(module.moduleType)}
  and current_published_revision_id is null
  and current_draft_revision_id is null;`,
    )
    .join('\n')

  return `begin;

insert into lessons (lesson_id, slug, display_order, enabled)
values
${lessonValues}
on duplicate key update
  lesson_id = lesson_id;

insert into lesson_modules (lesson_id, module_type)
values
${moduleValues}
on duplicate key update
  lesson_id = values(lesson_id);

insert into module_revisions (
  revision_id,
  lesson_id,
  module_type,
  payload,
  revision_kind,
  source_revision_id,
  created_by,
  created_at,
  note
)
values
${revisionValues}
on duplicate key update
  revision_id = revision_id;

${pointerUpdates}

commit;
`
}

export { contentModuleTypes }
