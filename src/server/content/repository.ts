import type { PublishedContentRepository, PublishedModuleRow } from './types'

export type Sql = <TRow extends object = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<TRow[]>

export interface DatabaseEnv {
  DATABASE_URL?: string
  MYSQL_DATABASE_URL?: string
  MYSQL_URL?: string
  MYSQL_SSL?: string
}

interface MysqlExecutor {
  execute(query: string, values: unknown[]): Promise<[unknown, unknown]>
}

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super('Missing MySQL connection env. Expected MYSQL_DATABASE_URL, MYSQL_URL, or DATABASE_URL.')
    this.name = 'MissingDatabaseUrlError'
  }
}

export function resolveDatabaseUrl(env: DatabaseEnv) {
  return env.MYSQL_DATABASE_URL ?? env.MYSQL_URL ?? env.DATABASE_URL
}

function templateToQuery(strings: TemplateStringsArray, values: unknown[]) {
  return strings.reduce(
    (query, chunk, index) => query + chunk + (index < values.length ? '?' : ''),
    '',
  )
}

export async function createSqlFromEnv(env: DatabaseEnv): Promise<Sql> {
  const connectionString = resolveDatabaseUrl(env)

  if (!connectionString) {
    throw new MissingDatabaseUrlError()
  }

  const { createPool } = await import('mysql2/promise')
  const pool = createPool({
    uri: connectionString,
    waitForConnections: true,
    connectionLimit: 4,
    ssl: env.MYSQL_SSL === 'required' ? { rejectUnauthorized: true } : undefined,
  }) as unknown as MysqlExecutor

  return async <TRow extends object = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => {
    const [rows] = await pool.execute(templateToQuery(strings, values), values)

    return rows as TRow[]
  }
}

function normalizePublishedModuleRow(row: PublishedModuleRow): PublishedModuleRow {
  return {
    ...row,
    enabled: Boolean(row.enabled),
    payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
  }
}

export class ContentMysqlRepository implements PublishedContentRepository {
  private readonly sql: Sql

  constructor(sql: Sql) {
    this.sql = sql
  }

  async listPublishedCourseModules() {
    const rows = await this.sql<PublishedModuleRow>`
      select
        l.lesson_id as lessonId,
        l.slug as slug,
        l.display_order as displayOrder,
        l.enabled as enabled,
        lm.module_type as moduleType,
        mr.revision_id as revisionId,
        mr.payload as payload
      from lessons l
      join lesson_modules lm on lm.lesson_id = l.lesson_id
      join module_revisions mr
        on mr.revision_id = lm.current_published_revision_id
        and mr.revision_kind = 'published'
        and mr.lesson_id = lm.lesson_id
        and mr.module_type = lm.module_type
      where l.enabled = true
      order by l.display_order asc, l.lesson_id asc, lm.module_type asc
    `

    return rows.map(normalizePublishedModuleRow)
  }

  async listPublishedLessonModules(lessonId: string) {
    const rows = await this.sql<PublishedModuleRow>`
      select
        l.lesson_id as lessonId,
        l.slug as slug,
        l.display_order as displayOrder,
        l.enabled as enabled,
        lm.module_type as moduleType,
        mr.revision_id as revisionId,
        mr.payload as payload
      from lessons l
      join lesson_modules lm on lm.lesson_id = l.lesson_id
      join module_revisions mr
        on mr.revision_id = lm.current_published_revision_id
        and mr.revision_kind = 'published'
        and mr.lesson_id = lm.lesson_id
        and mr.module_type = lm.module_type
      where l.enabled = true and l.lesson_id = ${lessonId}
      order by l.display_order asc, l.lesson_id asc, lm.module_type asc
    `

    return rows.map(normalizePublishedModuleRow)
  }
}
