import { describe, expect, it, vi } from 'vitest'

import {
  ContentAdminNotFoundError,
  ContentAdminValidationError,
  NoUnpublishedChangesError,
  PublishedRevisionNotFoundError,
} from './adminRepository'
import { createAdminHttpHandlers, createLazyDatabaseAdminHttpHandlers } from './adminHttp'

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
    const handlers = createAdminHttpHandlers(repository)

    const listResponse = createResponseRecorder()
    await handlers.lessons({ method: 'GET', query: {} }, listResponse)
    expect(listResponse.statusCode).toBe(200)
    expect(repository.listLessons).toHaveBeenCalledTimes(1)

    const detailResponse = createResponseRecorder()
    await handlers.lessons({ method: 'GET', query: { lessonId: 'self-intro' } }, detailResponse)
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
    const handlers = createAdminHttpHandlers(repository)

    const draftResponse = createResponseRecorder()
    await handlers.draft(
      {
        method: 'PUT',
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
    const handlers = createAdminHttpHandlers(repository)

    const methodNotAllowed = createResponseRecorder()
    await handlers.lessons({ method: 'POST', query: {} }, methodNotAllowed)
    expect(methodNotAllowed.statusCode).toBe(405)
    expect(methodNotAllowed.headers.Allow).toBe('GET')

    const badDraft = createResponseRecorder()
    await handlers.draft({ method: 'PUT', body: {} }, badDraft)
    expect(badDraft.statusCode).toBe(400)

    const missingLesson = createResponseRecorder()
    await handlers.lessons({ method: 'GET', query: { lessonId: 'missing' } }, missingLesson)
    expect(missingLesson.statusCode).toBe(404)

    const invalidDraft = createResponseRecorder()
    await handlers.draft(
      {
        method: 'PUT',
        body: { lessonId: 'self-intro', moduleType: 'lessonMeta', payload: { id: 'self-intro' } },
      },
      invalidDraft,
    )
    expect(invalidDraft.statusCode).toBe(400)

    const noChanges = createResponseRecorder()
    await handlers.publish(
      { method: 'POST', body: { lessonId: 'self-intro', moduleType: 'lessonMeta' } },
      noChanges,
    )
    expect(noChanges.statusCode).toBe(409)

    const missingRevision = createResponseRecorder()
    await handlers.rollback(
      { method: 'POST', body: { lessonId: 'self-intro', moduleType: 'lessonMeta', publishedRevisionId: 404 } },
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
})
