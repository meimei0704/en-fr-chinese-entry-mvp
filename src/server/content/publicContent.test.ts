import { describe, expect, it } from 'vitest'
import { createContentHttpHandlers } from './http'
import { ContentMysqlRepository, resolveDatabaseUrl } from './repository'
import { buildCourseFromPublishedModuleRows, buildLessonFromPublishedModuleRows } from './publicContent'
import type { PublishedModuleRow, PublishedContentRepository } from './types'

const publishedRows = (lessonId = 'self-intro'): PublishedModuleRow[] => [
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'lessonMeta',
    revisionId: 101,
    payload: {
      id: lessonId,
      title: { en: 'Published title', fr: 'Titre publié' },
      scenario: { en: 'Published scenario', fr: 'Scénario publié' },
    },
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'dialogue',
    revisionId: 102,
    payload: { title: { en: 'Dialogue', fr: 'Dialogue' }, lines: [] },
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'sentencePatterns',
    revisionId: 103,
    payload: [],
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'vocabulary',
    revisionId: 104,
    payload: [],
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'pronunciation',
    revisionId: 105,
    payload: [],
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'hanziRecognition',
    revisionId: 106,
    payload: [],
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'practice',
    revisionId: 107,
    payload: { listening: [], speaking: [], reading: [] },
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'reviewCards',
    revisionId: 108,
    payload: [],
  },
  {
    lessonId,
    slug: lessonId,
    displayOrder: 1,
    enabled: true,
    moduleType: 'shortInput',
    revisionId: 109,
    payload: {
      id: `${lessonId}-short-input-01`,
      prompt: { en: 'Published prompt', fr: 'Invite publiée' },
      target: '发布',
      explanation: { en: 'Published only', fr: 'Publié seulement' },
      audio: `/audio/${lessonId}/short-input-01.mp3`,
    },
  },
]

function createResponseRecorder() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code
      return this
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value
    },
    json(value: unknown) {
      this.body = value
      return this
    },
  }
}

describe('published public content reader', () => {
  it('reconstructs course payloads from published module rows in lesson order', () => {
    const course = buildCourseFromPublishedModuleRows([
      ...publishedRows('order-food').map((row) => ({ ...row, displayOrder: 2 })),
      ...publishedRows('self-intro'),
    ])

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual(['self-intro', 'order-food'])
    expect(course.lessons[0].title.en).toBe('Published title')
  })

  it('returns null when a lesson has no complete published module set', () => {
    const incompleteRows = publishedRows().filter((row) => row.moduleType !== 'practice')

    expect(buildLessonFromPublishedModuleRows(incompleteRows)).toBeNull()
  })

  it('public HTTP handlers only use published repository methods and never expose draft payloads', async () => {
    const draftPayload = 'DRAFT SHOULD NOT LEAK'
    const repository: PublishedContentRepository = {
      async listPublishedCourseModules() {
        return publishedRows()
      },
      async listPublishedLessonModules(lessonId: string) {
        expect(lessonId).toBe('self-intro')
        return publishedRows(lessonId)
      },
    }
    const handlers = createContentHttpHandlers(repository)

    const courseResponse = createResponseRecorder()
    await handlers.course({ method: 'GET', query: {} }, courseResponse)
    expect(courseResponse.statusCode).toBe(200)
    expect(JSON.stringify(courseResponse.body)).not.toContain(draftPayload)

    const lessonResponse = createResponseRecorder()
    await handlers.lesson({ method: 'GET', query: { lessonId: 'self-intro', draftPayload } }, lessonResponse)
    expect(lessonResponse.statusCode).toBe(200)
    expect(JSON.stringify(lessonResponse.body)).not.toContain(draftPayload)
  })

  it('returns 404 for unpublished lessons and 405 for unsupported methods', async () => {
    const repository: PublishedContentRepository = {
      async listPublishedCourseModules() {
        return []
      },
      async listPublishedLessonModules() {
        return []
      },
    }
    const handlers = createContentHttpHandlers(repository)

    const notFound = createResponseRecorder()
    await handlers.lesson({ method: 'GET', query: { lessonId: 'missing-lesson' } }, notFound)
    expect(notFound.statusCode).toBe(404)

    const methodNotAllowed = createResponseRecorder()
    await handlers.course({ method: 'POST', query: {} }, methodNotAllowed)
    expect(methodNotAllowed.statusCode).toBe(405)
  })
})

describe('ContentMysqlRepository published queries', () => {
  it('joins through same-module published revisions and not current_draft_revision_id', async () => {
    const queries: string[] = []
    const sql = async (strings: TemplateStringsArray, ...values: unknown[]) => {
      queries.push(String.raw({ raw: [...strings] }, ...values.map(() => '?')))
      return publishedRows()
    }
    const repository = new ContentMysqlRepository(sql)

    await repository.listPublishedCourseModules()
    await repository.listPublishedLessonModules('self-intro')

    const queryText = queries.join('\n')
    expect(queryText).toContain('current_published_revision_id')
    expect(queryText).toContain("mr.revision_kind = 'published'")
    expect(queryText).toContain('mr.lesson_id = lm.lesson_id')
    expect(queryText).toContain('mr.module_type = lm.module_type')
    expect(queryText).not.toContain('current_draft_revision_id')
    expect(queryText).not.toContain("revision_kind = 'draft'")
    expect(queryText).toContain('l.lesson_id = ?')
  })

  it('resolves MySQL env names and does not depend on PostgreSQL env names', () => {
    expect(resolveDatabaseUrl({ MYSQL_DATABASE_URL: 'mysql://example/db', POSTGRES_URL: 'postgres://wrong/db' })).toBe(
      'mysql://example/db',
    )
    expect(resolveDatabaseUrl({ MYSQL_URL: 'mysql://fallback/db' })).toBe('mysql://fallback/db')
    expect(resolveDatabaseUrl({ DATABASE_URL: 'mysql://generic/db' })).toBe('mysql://generic/db')
    expect(resolveDatabaseUrl({ POSTGRES_URL: 'postgres://wrong/db' })).toBeUndefined()
  })
})
