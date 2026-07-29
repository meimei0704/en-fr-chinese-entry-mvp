import { describe, expect, it, vi } from 'vitest'

import {
  ContentAdminNotFoundError,
  ContentAdminValidationError,
  NoUnpublishedChangesError,
  PublishedRevisionNotFoundError,
} from './adminRepository'
import { createAdminHttpHandlers, createLazyDatabaseAdminHttpHandlers } from './adminHttp'

const adminAuthEnv = {
  CONTENT_ADMIN_USERNAME: 'editor',
  CONTENT_ADMIN_PASSWORD: 'secret',
}

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

describe('content admin HTTP handlers', () => {
  it('lists lessons or returns one lesson snapshot from the shared lessons endpoint', async () => {
    const snapshot = {
      lessonId: 'self-intro',
      slug: 'self-intro',
      displayOrder: 1,
      enabled: true,
      draftLesson: { id: 'self-intro' },
      publishedLesson: { id: 'self-intro' },
      modules: [],
      publishedHistory: {
        lessonMeta: [],
        dialogue: [],
        sentencePatterns: [],
        vocabulary: [],
        pronunciation: [],
        hanziRecognition: [],
        practice: [],
        reviewCards: [],
        shortInput: [],
      },
    }
    const repository = {
      listLessons: vi.fn().mockResolvedValue([{ lessonId: 'self-intro', slug: 'self-intro', displayOrder: 1, enabled: true, draftChangedModuleCount: 1 }]),
      getLessonSnapshot: vi.fn().mockResolvedValue(snapshot),
      saveDraftModule: vi.fn(),
      publishModule: vi.fn(),
      rollbackModule: vi.fn(),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)

    const listResponse = createResponseRecorder()
    await handlers.lessons({ method: 'GET', query: {}, headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' } }, listResponse)
    expect(listResponse.statusCode).toBe(200)
    expect(repository.listLessons).toHaveBeenCalledTimes(1)

    const detailResponse = createResponseRecorder()
    await handlers.lessons(
      {
        method: 'GET',
        query: { lessonId: 'self-intro' },
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
      },
      detailResponse,
    )
    expect(detailResponse.statusCode).toBe(200)
    expect(detailResponse.body).toEqual(snapshot)
    expect(repository.getLessonSnapshot).toHaveBeenCalledWith('self-intro')
  })

  it('saves drafts, publishes modules, and rolls back published revisions from JSON request bodies', async () => {
    const repository = {
      listLessons: vi.fn(),
      getLessonSnapshot: vi.fn(),
      saveDraftModule: vi.fn().mockResolvedValue({ ok: 'draft' }),
      publishModule: vi.fn().mockResolvedValue({ ok: 'publish' }),
      rollbackModule: vi.fn().mockResolvedValue({ ok: 'rollback' }),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)

    const draftResponse = createResponseRecorder()
    await handlers.draft(
      {
        method: 'PUT',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: JSON.stringify({
          lessonId: 'self-intro',
          moduleType: 'lessonMeta',
          payload: { id: 'self-intro', title: { en: 'Draft', fr: 'Brouillon' }, scenario: { en: 'Scenario', fr: 'Scénario' } },
          note: 'Save title draft',
        }),
      },
      draftResponse,
    )
    expect(draftResponse.statusCode).toBe(200)
    expect(repository.saveDraftModule).toHaveBeenCalledWith(
      expect.objectContaining({ lessonId: 'self-intro', moduleType: 'lessonMeta', note: 'Save title draft' }),
    )

    const publishResponse = createResponseRecorder()
    await handlers.publish(
      {
        method: 'POST',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta', note: 'Publish title draft' },
      },
      publishResponse,
    )
    expect(publishResponse.statusCode).toBe(200)
    expect(repository.publishModule).toHaveBeenCalledWith(
      expect.objectContaining({ lessonId: 'self-intro', moduleType: 'lessonMeta', note: 'Publish title draft' }),
    )

    const rollbackResponse = createResponseRecorder()
    await handlers.rollback(
      {
        method: 'POST',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta', publishedRevisionId: 901, note: 'Rollback title draft' },
      },
      rollbackResponse,
    )
    expect(rollbackResponse.statusCode).toBe(200)
    expect(repository.rollbackModule).toHaveBeenCalledWith(
      expect.objectContaining({ lessonId: 'self-intro', moduleType: 'lessonMeta', publishedRevisionId: 901 }),
    )
  })

  it('maps admin errors to safe HTTP statuses and keeps method guards strict', async () => {
    const repository = {
      listLessons: vi.fn().mockRejectedValue(new ContentAdminNotFoundError('missing lesson')),
      getLessonSnapshot: vi.fn().mockRejectedValue(new ContentAdminNotFoundError('missing lesson')),
      saveDraftModule: vi.fn().mockRejectedValue(new ContentAdminValidationError('Invalid lessonMeta payload')),
      publishModule: vi.fn().mockRejectedValue(new NoUnpublishedChangesError('self-intro', 'lessonMeta')),
      rollbackModule: vi.fn().mockRejectedValue(new PublishedRevisionNotFoundError('self-intro', 'lessonMeta', 404)),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)

    const methodNotAllowed = createResponseRecorder()
    await handlers.lessons({ method: 'POST', query: {}, headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' } }, methodNotAllowed)
    expect(methodNotAllowed.statusCode).toBe(405)
    expect(methodNotAllowed.headers.Allow).toBe('GET')

    const badDraft = createResponseRecorder()
    await handlers.draft({ method: 'PUT', headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' }, body: {} }, badDraft)
    expect(badDraft.statusCode).toBe(400)

    const missingLesson = createResponseRecorder()
    await handlers.lessons(
      {
        method: 'GET',
        query: { lessonId: 'missing' },
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
      },
      missingLesson,
    )
    expect(missingLesson.statusCode).toBe(404)

    const invalidDraft = createResponseRecorder()
    await handlers.draft(
      {
        method: 'PUT',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta', payload: { id: 'self-intro' } },
      },
      invalidDraft,
    )
    expect(invalidDraft.statusCode).toBe(400)

    const noChanges = createResponseRecorder()
    await handlers.publish(
      {
        method: 'POST',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta' },
      },
      noChanges,
    )
    expect(noChanges.statusCode).toBe(409)

    const missingRevision = createResponseRecorder()
    await handlers.rollback(
      {
        method: 'POST',
        headers: { authorization: 'Basic ZWRpdG9yOnNlY3JldA==' },
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta', publishedRevisionId: 404 },
      },
      missingRevision,
    )
    expect(missingRevision.statusCode).toBe(404)
  })

  it('returns 503 from the lazy database handlers when MySQL env is unavailable', async () => {
    const handlers = createLazyDatabaseAdminHttpHandlers({})
    const response = createResponseRecorder()

    await handlers.lessons({ method: 'GET', query: {} }, response)

    expect(response.statusCode).toBe(503)
    expect(response.body).toEqual({ error: 'Content admin database is not configured' })
  })

  it('rejects unauthenticated admin requests with a 401 challenge before reaching the repository', async () => {
    const repository = {
      listLessons: vi.fn(),
      getLessonSnapshot: vi.fn(),
      saveDraftModule: vi.fn(),
      publishModule: vi.fn(),
      rollbackModule: vi.fn(),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)
    const response = createResponseRecorder()

    await handlers.lessons({ method: 'GET', query: {}, headers: {} }, response)

    expect(response.statusCode).toBe(401)
    expect(response.headers['WWW-Authenticate']).toContain('Basic')
    expect(repository.listLessons).not.toHaveBeenCalled()
  })

  it('returns a plain 401 without a browser auth challenge for admin UI fetch requests', async () => {
    const repository = {
      listLessons: vi.fn(),
      getLessonSnapshot: vi.fn(),
      saveDraftModule: vi.fn(),
      publishModule: vi.fn(),
      rollbackModule: vi.fn(),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)
    const response = createResponseRecorder()

    await handlers.lessons(
      {
        method: 'GET',
        query: {},
        headers: { 'x-content-admin-client': 'spa' },
      },
      response,
    )

    expect(response.statusCode).toBe(401)
    expect(response.headers['WWW-Authenticate']).toBeUndefined()
    expect(response.body).toEqual({ error: 'Admin authentication required' })
    expect(repository.listLessons).not.toHaveBeenCalled()
  })

  it('accepts authenticated admin requests and returns 400 for malformed JSON bodies instead of 500', async () => {
    const repository = {
      listLessons: vi.fn().mockResolvedValue([{ lessonId: 'self-intro' }]),
      getLessonSnapshot: vi.fn(),
      saveDraftModule: vi.fn(),
      publishModule: vi.fn(),
      rollbackModule: vi.fn(),
    }
    const handlers = createAdminHttpHandlers(repository, adminAuthEnv)
    const authHeaders = {
      authorization: 'Basic ZWRpdG9yOnNlY3JldA==',
    }

    const okResponse = createResponseRecorder()
    await handlers.lessons({ method: 'GET', query: {}, headers: authHeaders }, okResponse)
    expect(okResponse.statusCode).toBe(200)
    expect(repository.listLessons).toHaveBeenCalledTimes(1)

    const badJsonResponse = createResponseRecorder()
    await handlers.draft(
      {
        method: 'PUT',
        headers: authHeaders,
        body: '{"lessonId":"self-intro"',
      },
      badJsonResponse,
    )
    expect(badJsonResponse.statusCode).toBe(400)
    expect(badJsonResponse.body).toEqual({ error: 'Invalid JSON request body' })
  })
})
