import {
  ContentAdminNotFoundError,
  ContentAdminRepository,
  ContentAdminValidationError,
  NoUnpublishedChangesError,
  PublishedRevisionNotFoundError,
} from './adminRepository.js'
import { createContentAdminMysqlStoreFromEnv } from './adminStoreMysql.js'
import { MissingDatabaseUrlError, type DatabaseEnv } from './repository.js'

export interface ContentAdminApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
  body?: unknown
}

export interface ContentAdminApiResponse {
  status(code: number): ContentAdminApiResponse
  setHeader(name: string, value: string): void
  json(value: unknown): unknown
}

interface ContentAdminRepositoryLike {
  listLessons(): Promise<unknown>
  getLessonSnapshot(lessonId: string): Promise<unknown>
  saveDraftModule(input: {
    lessonId: string
    moduleType: string
    payload: unknown
    createdBy: string
    note: string | null
  }): Promise<unknown>
  publishModule(input: {
    lessonId: string
    moduleType: string
    createdBy: string
    note: string | null
  }): Promise<unknown>
  rollbackModule(input: {
    lessonId: string
    moduleType: string
    publishedRevisionId: number
    createdBy: string
    note: string | null
  }): Promise<unknown>
}

export interface ContentAdminHttpHandlers {
  lessons(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
  draft(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
  publish(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
  rollback(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
}

function getQueryString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parseBody(body: unknown) {
  if (typeof body === 'string') {
    return JSON.parse(body) as Record<string, unknown>
  }

  if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
    return body as Record<string, unknown>
  }

  throw new ContentAdminValidationError('Invalid JSON request body')
}

function requireString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ContentAdminValidationError(`Missing ${fieldName}`)
  }

  return value
}

function requireNumber(value: unknown, fieldName: string) {
  const parsed = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(parsed)) {
    throw new ContentAdminValidationError(`Missing ${fieldName}`)
  }

  return parsed
}

function methodNotAllowed(res: ContentAdminApiResponse, allow: string) {
  res.setHeader('Allow', allow)
  return res.status(405).json({ error: 'Method not allowed' })
}

function serviceUnavailable(res: ContentAdminApiResponse) {
  return res.status(503).json({ error: 'Content admin database is not configured' })
}

function internalServerError(res: ContentAdminApiResponse) {
  return res.status(500).json({ error: 'Unable to process content admin request' })
}

function mapAdminError(error: unknown, res: ContentAdminApiResponse) {
  if (error instanceof MissingDatabaseUrlError) {
    return serviceUnavailable(res)
  }

  if (error instanceof ContentAdminValidationError) {
    return res.status(400).json({ error: error.message })
  }

  if (error instanceof ContentAdminNotFoundError || error instanceof PublishedRevisionNotFoundError) {
    return res.status(404).json({ error: error.message })
  }

  if (error instanceof NoUnpublishedChangesError) {
    return res.status(409).json({ error: error.message })
  }

  return internalServerError(res)
}

async function withAdminErrors(run: () => Promise<unknown>, res: ContentAdminApiResponse) {
  try {
    return await run()
  } catch (error) {
    return mapAdminError(error, res)
  }
}

export function createAdminHttpHandlers(repository: ContentAdminRepositoryLike): ContentAdminHttpHandlers {
  return {
    async lessons(req, res) {
      if (req.method !== 'GET') {
        return methodNotAllowed(res, 'GET')
      }

      return withAdminErrors(async () => {
        const lessonId = getQueryString(req.query?.lessonId)
        const body = lessonId ? await repository.getLessonSnapshot(lessonId) : await repository.listLessons()
        return res.status(200).json(body)
      }, res)
    },
    async draft(req, res) {
      if (req.method !== 'PUT') {
        return methodNotAllowed(res, 'PUT')
      }

      return withAdminErrors(async () => {
        const body = parseBody(req.body)
        const result = await repository.saveDraftModule({
          lessonId: requireString(body.lessonId, 'lessonId'),
          moduleType: requireString(body.moduleType, 'moduleType'),
          payload: body.payload,
          createdBy: 'admin-ui',
          note: typeof body.note === 'string' ? body.note : null,
        })
        return res.status(200).json(result)
      }, res)
    },
    async publish(req, res) {
      if (req.method !== 'POST') {
        return methodNotAllowed(res, 'POST')
      }

      return withAdminErrors(async () => {
        const body = parseBody(req.body)
        const result = await repository.publishModule({
          lessonId: requireString(body.lessonId, 'lessonId'),
          moduleType: requireString(body.moduleType, 'moduleType'),
          createdBy: 'admin-ui',
          note: typeof body.note === 'string' ? body.note : null,
        })
        return res.status(200).json(result)
      }, res)
    },
    async rollback(req, res) {
      if (req.method !== 'POST') {
        return methodNotAllowed(res, 'POST')
      }

      return withAdminErrors(async () => {
        const body = parseBody(req.body)
        const result = await repository.rollbackModule({
          lessonId: requireString(body.lessonId, 'lessonId'),
          moduleType: requireString(body.moduleType, 'moduleType'),
          publishedRevisionId: requireNumber(body.publishedRevisionId, 'publishedRevisionId'),
          createdBy: 'admin-ui',
          note: typeof body.note === 'string' ? body.note : null,
        })
        return res.status(200).json(result)
      }, res)
    },
  }
}

export function createLazyDatabaseAdminHttpHandlers(env: DatabaseEnv = process.env): ContentAdminHttpHandlers {
  let repositoryPromise: Promise<ContentAdminRepository> | undefined

  async function resolveRepository() {
    repositoryPromise ??= createContentAdminMysqlStoreFromEnv(env).then((store) => new ContentAdminRepository(store))
    return repositoryPromise
  }

  const createHandlers = (repository: ContentAdminRepository) => createAdminHttpHandlers(repository)

  async function withRepository(
    run: (handlers: ContentAdminHttpHandlers) => Promise<unknown>,
    res: ContentAdminApiResponse,
  ) {
    try {
      return await run(createHandlers(await resolveRepository()))
    } catch (error) {
      return mapAdminError(error, res)
    }
  }

  return {
    lessons(req, res) {
      return withRepository((handlers) => handlers.lessons(req, res), res)
    },
    draft(req, res) {
      return withRepository((handlers) => handlers.draft(req, res), res)
    },
    publish(req, res) {
      return withRepository((handlers) => handlers.publish(req, res), res)
    },
    rollback(req, res) {
      return withRepository((handlers) => handlers.rollback(req, res), res)
    },
  }
}
