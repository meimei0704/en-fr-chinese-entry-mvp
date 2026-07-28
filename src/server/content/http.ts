import { buildCourseFromPublishedModuleRows, buildLessonFromPublishedModuleRows } from './publicContent.js'
import { ContentMysqlRepository, createSqlFromEnv, MissingDatabaseUrlError, type DatabaseEnv } from './repository.js'
import type { PublishedContentRepository } from './types.js'

export interface ContentApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
}

export interface ContentApiResponse {
  status(code: number): ContentApiResponse
  setHeader(name: string, value: string): void
  json(value: unknown): unknown
}

export interface ContentHttpHandlers {
  course(req: ContentApiRequest, res: ContentApiResponse): Promise<unknown>
  lesson(req: ContentApiRequest, res: ContentApiResponse): Promise<unknown>
}

function getQueryString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function methodNotAllowed(res: ContentApiResponse) {
  res.setHeader('Allow', 'GET')

  return res.status(405).json({ error: 'Method not allowed' })
}

function internalServerError(res: ContentApiResponse) {
  return res.status(500).json({ error: 'Unable to read published content' })
}

function serviceUnavailable(res: ContentApiResponse) {
  return res.status(503).json({ error: 'Published content database is not configured' })
}

export function createContentHttpHandlers(repository: PublishedContentRepository): ContentHttpHandlers {
  return {
    async course(req, res) {
      if (req.method !== 'GET') {
        return methodNotAllowed(res)
      }

      try {
        const content = buildCourseFromPublishedModuleRows(await repository.listPublishedCourseModules())

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(content)
      } catch {
        return internalServerError(res)
      }
    },
    async lesson(req, res) {
      if (req.method !== 'GET') {
        return methodNotAllowed(res)
      }

      const lessonId = getQueryString(req.query?.lessonId)

      if (!lessonId) {
        return res.status(400).json({ error: 'Missing lessonId' })
      }

      try {
        const lesson = buildLessonFromPublishedModuleRows(await repository.listPublishedLessonModules(lessonId))

        if (lesson === null) {
          return res.status(404).json({ error: 'Published lesson not found' })
        }

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
        return res.status(200).json(lesson)
      } catch {
        return internalServerError(res)
      }
    },
  }
}

export function createLazyDatabaseContentHttpHandlers(env: DatabaseEnv = process.env): ContentHttpHandlers {
  let handlersPromise: Promise<ContentHttpHandlers> | undefined

  async function resolveHandlers() {
    handlersPromise ??= createSqlFromEnv(env).then((sql) => createContentHttpHandlers(new ContentMysqlRepository(sql)))

    return handlersPromise
  }

  async function withHandlers(
    run: (handlers: ContentHttpHandlers) => Promise<unknown>,
    res: ContentApiResponse,
  ) {
    try {
      return await run(await resolveHandlers())
    } catch (error) {
      if (error instanceof MissingDatabaseUrlError) {
        return serviceUnavailable(res)
      }

      return internalServerError(res)
    }
  }

  return {
    course(req, res) {
      return withHandlers((handlers) => handlers.course(req, res), res)
    },
    lesson(req, res) {
      return withHandlers((handlers) => handlers.lesson(req, res), res)
    },
  }
}
