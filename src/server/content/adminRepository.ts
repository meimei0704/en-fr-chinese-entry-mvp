import { ZodError } from 'zod'

import { parseModulePayload } from '../../content/schema.js'
import { buildLessonFromPublishedModuleRows } from './publicContent.js'
import type {
  AdminLessonSnapshot,
  AdminLessonSummary,
  ContentAdminStore,
  CurrentModuleState,
  ModuleHistoryMap,
  ModuleSnapshot,
  PublishModuleInput,
  RollbackModuleInput,
  SaveDraftModuleInput,
} from './adminTypes.js'
import { contentModuleTypes, type ContentModuleType, type ModulePayload, type PublishedModuleRow } from './types.js'

export class NoUnpublishedChangesError extends Error {
  constructor(lessonId: string, moduleType: ContentModuleType) {
    super(`No unpublished changes for ${lessonId}:${moduleType}.`)
    this.name = 'NoUnpublishedChangesError'
  }
}

export class ContentAdminNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentAdminNotFoundError'
  }
}

export class ContentAdminValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentAdminValidationError'
  }
}

export class PublishedRevisionNotFoundError extends Error {
  constructor(lessonId: string, moduleType: ContentModuleType, revisionId: number) {
    super(`Published revision not found: ${lessonId}:${moduleType}:${revisionId}`)
    this.name = 'PublishedRevisionNotFoundError'
  }
}

function normalizePayload(payload: unknown) {
  return typeof payload === 'string' ? JSON.parse(payload) : payload
}

function stableJson(value: unknown) {
  return JSON.stringify(value)
}

function samePayload(left: unknown, right: unknown) {
  return stableJson(left) === stableJson(right)
}

function asPublishedModuleRow(row: CurrentModuleState, revisionKind: 'draft' | 'published'): PublishedModuleRow {
  const revisionId = revisionKind === 'draft' ? row.draftRevisionId : row.publishedRevisionId
  const payload = revisionKind === 'draft' ? row.draftPayload : row.publishedPayload

  return {
    lessonId: row.lessonId,
    slug: row.slug,
    displayOrder: row.displayOrder,
    enabled: row.enabled,
    moduleType: row.moduleType,
    revisionId,
    payload: normalizePayload(payload),
  }
}

function validateModulePayload(moduleType: ContentModuleType, payload: unknown): ModulePayload {
  try {
    return parseModulePayload(moduleType, normalizePayload(payload))
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ContentAdminValidationError(
        `Invalid ${moduleType} payload: ${error.issues.map((issue) => issue.path.join('.') || issue.message).join(', ')}`,
      )
    }

    throw error
  }
}

function buildLesson(rows: CurrentModuleState[], revisionKind: 'draft' | 'published') {
  return buildLessonFromPublishedModuleRows(rows.map((row) => asPublishedModuleRow(row, revisionKind)))
}

export class ContentAdminRepository {
  private readonly store: ContentAdminStore

  constructor(store: ContentAdminStore) {
    this.store = store
  }

  async listLessons(): Promise<AdminLessonSummary[]> {
    const rows = await this.store.listCurrentModuleStates()
    const grouped = new Map<string, CurrentModuleState[]>()

    for (const row of rows) {
      const existing = grouped.get(row.lessonId) ?? []
      existing.push(row)
      grouped.set(row.lessonId, existing)
    }

    return [...grouped.values()]
      .map((lessonRows) => ({
        lessonId: lessonRows[0]!.lessonId,
        slug: lessonRows[0]!.slug,
        displayOrder: lessonRows[0]!.displayOrder,
        enabled: lessonRows[0]!.enabled,
        draftChangedModuleCount: lessonRows.filter((row) => !samePayload(row.draftPayload, row.publishedPayload)).length,
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder)
  }

  async getLessonSnapshot(lessonId: string): Promise<AdminLessonSnapshot> {
    const rows = await this.store.listCurrentLessonModuleStates(lessonId)

    if (rows.length === 0) {
      throw new ContentAdminNotFoundError(`Editable lesson not found: ${lessonId}`)
    }

    const publishedHistoryEntries = await Promise.all(
      contentModuleTypes.map(async (moduleType) => [moduleType, await this.store.listPublishedModuleHistory(lessonId, moduleType)] as const),
    )
    const publishedHistory = Object.fromEntries(publishedHistoryEntries) as ModuleHistoryMap
    const modules: ModuleSnapshot[] = rows.map((row) => ({
      moduleType: row.moduleType,
      draftRevisionId: row.draftRevisionId,
      publishedRevisionId: row.publishedRevisionId,
      hasUnpublishedChanges: !samePayload(row.draftPayload, row.publishedPayload),
    }))

    return {
      lessonId: rows[0]!.lessonId,
      slug: rows[0]!.slug,
      displayOrder: rows[0]!.displayOrder,
      enabled: rows[0]!.enabled,
      draftLesson: buildLesson(rows, 'draft'),
      publishedLesson: buildLesson(rows, 'published'),
      modules,
      publishedHistory,
    }
  }

  async saveDraftModule(input: SaveDraftModuleInput) {
    const payload = validateModulePayload(input.moduleType, input.payload)
    const current = await this.requireCurrentModuleState(input.lessonId, input.moduleType)

    await this.store.runInTransaction(async (store) => {
      const draftRevision = await store.insertModuleRevision({
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        payload,
        revisionKind: 'draft',
        sourceRevisionId: current.draftRevisionId,
        createdBy: input.createdBy,
        note: input.note,
      })

      await store.updateCurrentModuleState(draftRevision)
    })

    return this.getLessonSnapshot(input.lessonId)
  }

  async publishModule(input: PublishModuleInput) {
    const current = await this.requireCurrentModuleState(input.lessonId, input.moduleType)
    const payload = validateModulePayload(input.moduleType, current.draftPayload)

    if (samePayload(current.draftPayload, current.publishedPayload)) {
      throw new NoUnpublishedChangesError(input.lessonId, input.moduleType)
    }

    await this.store.runInTransaction(async (store) => {
      const publishedRevision = await store.insertModuleRevision({
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        payload,
        revisionKind: 'published',
        sourceRevisionId: current.draftRevisionId,
        createdBy: input.createdBy,
        note: input.note,
      })

      await store.updateCurrentModuleState(publishedRevision)

      const freshDraft = await store.insertModuleRevision({
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        payload,
        revisionKind: 'draft',
        sourceRevisionId: publishedRevision.revisionId,
        createdBy: input.createdBy,
        note: `Draft baseline after publish${input.note ? `: ${input.note}` : ''}`,
      })

      await store.updateCurrentModuleState(freshDraft)
    })

    return this.getLessonSnapshot(input.lessonId)
  }

  async rollbackModule(input: RollbackModuleInput) {
    await this.requireCurrentModuleState(input.lessonId, input.moduleType)
    const target = (await this.store.listPublishedModuleHistory(input.lessonId, input.moduleType)).find(
      (entry) => entry.revisionId === input.publishedRevisionId,
    )

    if (!target) {
      throw new PublishedRevisionNotFoundError(input.lessonId, input.moduleType, input.publishedRevisionId)
    }

    const payload = validateModulePayload(input.moduleType, target.payload)

    await this.store.runInTransaction(async (store) => {
      const publishedRevision = await store.insertModuleRevision({
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        payload,
        revisionKind: 'published',
        sourceRevisionId: target.revisionId,
        createdBy: input.createdBy,
        note: input.note,
      })

      await store.updateCurrentModuleState(publishedRevision)

      const freshDraft = await store.insertModuleRevision({
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        payload,
        revisionKind: 'draft',
        sourceRevisionId: publishedRevision.revisionId,
        createdBy: input.createdBy,
        note: `Draft baseline after rollback${input.note ? `: ${input.note}` : ''}`,
      })

      await store.updateCurrentModuleState(freshDraft)
    })

    return this.getLessonSnapshot(input.lessonId)
  }

  private async requireCurrentModuleState(lessonId: string, moduleType: ContentModuleType) {
    const current = await this.store.getCurrentModuleState(lessonId, moduleType)

    if (!current) {
      throw new ContentAdminNotFoundError(`Editable module not found: ${lessonId}:${moduleType}`)
    }

    return current
  }
}
