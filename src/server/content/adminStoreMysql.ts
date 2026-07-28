import {
  createMysqlPoolFromEnv,
  resolveDatabaseUrl,
  type DatabaseEnv,
  type MysqlConnectionClient,
  type MysqlPoolClient,
} from './repository.js'
import type {
  ContentAdminStore,
  ContentModuleRevisionRow,
  CurrentModuleState,
  InsertModuleRevisionInput,
  InsertedModuleRevision,
  PublishedModuleHistoryEntry,
} from './adminTypes.js'
import type { ContentModuleType } from './types.js'

interface MysqlQueryClient {
  execute(query: string, values?: unknown[]): Promise<[unknown, unknown]>
}

function mysqlRows(result: unknown) {
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0] as Record<string, unknown>[]
  }

  if (Array.isArray(result)) {
    return result as Record<string, unknown>[]
  }

  return []
}

function parsePayload(value: unknown) {
  return typeof value === 'string' ? JSON.parse(value) : value
}

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value : String(value ?? '')
}

function toNumberValue(value: unknown) {
  return typeof value === 'number' ? value : Number(value)
}

function normalizeCurrentState(row: Record<string, unknown>): CurrentModuleState {
  return {
    lessonId: toStringValue(row.lessonId),
    slug: toStringValue(row.slug),
    displayOrder: toNumberValue(row.displayOrder),
    enabled: Boolean(row.enabled),
    moduleType: toStringValue(row.moduleType) as ContentModuleType,
    draftRevisionId: toNumberValue(row.draftRevisionId),
    draftPayload: parsePayload(row.draftPayload),
    draftCreatedAt: toStringValue(row.draftCreatedAt),
    draftCreatedBy: toStringValue(row.draftCreatedBy),
    draftNote: row.draftNote === null ? null : toStringValue(row.draftNote),
    draftSourceRevisionId: row.draftSourceRevisionId === null ? null : toNumberValue(row.draftSourceRevisionId),
    publishedRevisionId: toNumberValue(row.publishedRevisionId),
    publishedPayload: parsePayload(row.publishedPayload),
    publishedCreatedAt: toStringValue(row.publishedCreatedAt),
    publishedCreatedBy: toStringValue(row.publishedCreatedBy),
    publishedNote: row.publishedNote === null ? null : toStringValue(row.publishedNote),
    publishedSourceRevisionId:
      row.publishedSourceRevisionId === null ? null : toNumberValue(row.publishedSourceRevisionId),
  }
}

function normalizePublishedHistoryEntry(row: Record<string, unknown>): PublishedModuleHistoryEntry {
  return {
    lessonId: toStringValue(row.lessonId),
    moduleType: toStringValue(row.moduleType) as ContentModuleType,
    revisionId: toNumberValue(row.revisionId),
    payload: parsePayload(row.payload),
    createdAt: toStringValue(row.createdAt),
    createdBy: toStringValue(row.createdBy),
    note: row.note === null ? null : toStringValue(row.note),
    sourceRevisionId: row.sourceRevisionId === null ? null : toNumberValue(row.sourceRevisionId),
  }
}

function insertIdFromResult(result: unknown) {
  if (Array.isArray(result) && result[0] && typeof result[0] === 'object' && 'insertId' in result[0]) {
    const insertId = (result[0] as { insertId?: unknown }).insertId
    return typeof insertId === 'number' ? insertId : Number(insertId)
  }

  if (result && typeof result === 'object' && 'insertId' in result) {
    const insertId = (result as { insertId?: unknown }).insertId
    return typeof insertId === 'number' ? insertId : Number(insertId)
  }

  throw new Error('MySQL insert did not return an insertId')
}

function currentModuleStatesQuery(whereClause = '') {
  return `
    select
      l.lesson_id as lessonId,
      l.slug as slug,
      l.display_order as displayOrder,
      l.enabled as enabled,
      lm.module_type as moduleType,
      dr.revision_id as draftRevisionId,
      dr.payload as draftPayload,
      dr.created_at as draftCreatedAt,
      dr.created_by as draftCreatedBy,
      dr.note as draftNote,
      dr.source_revision_id as draftSourceRevisionId,
      pr.revision_id as publishedRevisionId,
      pr.payload as publishedPayload,
      pr.created_at as publishedCreatedAt,
      pr.created_by as publishedCreatedBy,
      pr.note as publishedNote,
      pr.source_revision_id as publishedSourceRevisionId
    from lessons l
    join lesson_modules lm on lm.lesson_id = l.lesson_id
    join module_revisions dr
      on dr.revision_id = lm.current_draft_revision_id
      and dr.revision_kind = 'draft'
      and dr.lesson_id = lm.lesson_id
      and dr.module_type = lm.module_type
    join module_revisions pr
      on pr.revision_id = lm.current_published_revision_id
      and pr.revision_kind = 'published'
      and pr.lesson_id = lm.lesson_id
      and pr.module_type = lm.module_type
    ${whereClause}
    order by l.display_order asc, l.lesson_id asc, lm.module_type asc
  `
}

export class ContentAdminMysqlStore implements ContentAdminStore {
  private readonly client: MysqlQueryClient
  private readonly pool?: MysqlPoolClient

  constructor(client: MysqlPoolClient | MysqlConnectionClient) {
    this.client = client
    this.pool = 'getConnection' in client ? client : undefined
  }

  static async fromEnv(env: DatabaseEnv) {
    return new ContentAdminMysqlStore(await createMysqlPoolFromEnv(env))
  }

  async listCurrentModuleStates() {
    const [rows] = await this.client.execute(currentModuleStatesQuery())
    return mysqlRows(rows).map(normalizeCurrentState)
  }

  async listCurrentLessonModuleStates(lessonId: string) {
    const [rows] = await this.client.execute(`${currentModuleStatesQuery('where l.lesson_id = ?')}`, [lessonId])
    return mysqlRows(rows).map(normalizeCurrentState)
  }

  async getCurrentModuleState(lessonId: string, moduleType: ContentModuleType) {
    const [rows] = await this.client.execute(
      `${currentModuleStatesQuery('where l.lesson_id = ? and lm.module_type = ?')}`,
      [lessonId, moduleType],
    )
    const normalized = mysqlRows(rows).map(normalizeCurrentState)

    return normalized[0] ?? null
  }

  async listPublishedModuleHistory(lessonId: string, moduleType: ContentModuleType) {
    const [rows] = await this.client.execute(
      `
        select
          lesson_id as lessonId,
          module_type as moduleType,
          revision_id as revisionId,
          payload as payload,
          created_at as createdAt,
          created_by as createdBy,
          note as note,
          source_revision_id as sourceRevisionId
        from module_revisions
        where lesson_id = ?
          and module_type = ?
          and revision_kind = 'published'
        order by created_at desc, revision_id desc
      `,
      [lessonId, moduleType],
    )

    return mysqlRows(rows).map(normalizePublishedHistoryEntry)
  }

  async insertModuleRevision(input: InsertModuleRevisionInput): Promise<InsertedModuleRevision> {
    const [result] = await this.client.execute(
      `
        insert into module_revisions (
          lesson_id,
          module_type,
          payload,
          revision_kind,
          source_revision_id,
          created_by,
          note
        ) values (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.lessonId,
        input.moduleType,
        JSON.stringify(input.payload),
        input.revisionKind,
        input.sourceRevisionId,
        input.createdBy,
        input.note,
      ],
    )
    const revisionId = insertIdFromResult(result)

    return {
      ...input,
      revisionId,
      createdAt: new Date().toISOString(),
    }
  }

  async updateCurrentModuleState(row: ContentModuleRevisionRow) {
    if (row.revisionKind === 'draft') {
      await this.client.execute(
        `
          update lesson_modules
          set current_draft_revision_id = ?
          where lesson_id = ?
            and module_type = ?
        `,
        [row.revisionId, row.lessonId, row.moduleType],
      )
      return
    }

    await this.client.execute(
      `
        update lesson_modules
        set current_published_revision_id = ?
        where lesson_id = ?
          and module_type = ?
      `,
      [row.revisionId, row.lessonId, row.moduleType],
    )
  }

  async runInTransaction<T>(work: (store: ContentAdminStore) => Promise<T>): Promise<T> {
    if (!this.pool) {
      return work(this)
    }

    const connection = await this.pool.getConnection()
    const transactionalStore = new ContentAdminMysqlStore(connection)

    try {
      await connection.beginTransaction()
      const result = await work(transactionalStore)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}

export async function createContentAdminMysqlStoreFromEnv(env: DatabaseEnv = process.env) {
  resolveDatabaseUrl(env)
  return ContentAdminMysqlStore.fromEnv(env)
}
