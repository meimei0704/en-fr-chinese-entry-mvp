import type { PublishedContentRepository, PublishedModuleRow } from './types'

export type Sql = <TRow extends object = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<TRow[]>

export interface DatabaseEnv {
  DATABASE_URL?: string
  POSTGRES_URL?: string
  VERCEL_POSTGRES_URL?: string
  POSTGRES_SSL?: string
}

export class MissingDatabaseUrlError extends Error {
  constructor() {
    super('Missing Postgres connection env. Expected DATABASE_URL, POSTGRES_URL, or VERCEL_POSTGRES_URL.')
    this.name = 'MissingDatabaseUrlError'
  }
}

export function resolveDatabaseUrl(env: DatabaseEnv) {
  return env.DATABASE_URL ?? env.POSTGRES_URL ?? env.VERCEL_POSTGRES_URL
}

function templateToQuery(strings: TemplateStringsArray, values: unknown[]) {
  return strings.reduce(
    (query, chunk, index) => query + chunk + (index < values.length ? `$${index + 1}` : ''),
    '',
  )
}

export async function createSqlFromEnv(env: DatabaseEnv): Promise<Sql> {
  const connectionString = resolveDatabaseUrl(env)

  if (!connectionString) {
    throw new MissingDatabaseUrlError()
  }

  const { Pool } = await import('pg')
  const pool = new Pool({
    connectionString,
    ssl: env.POSTGRES_SSL === 'disable' ? false : { rejectUnauthorized: false },
  })

  return async <TRow extends object = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => {
    const result = await pool.query(templateToQuery(strings, values), values)

    return result.rows as TRow[]
  }
}

export class ContentPostgresRepository implements PublishedContentRepository {
  private readonly sql: Sql

  constructor(sql: Sql) {
    this.sql = sql
  }

  listPublishedCourseModules() {
    return this.sql<PublishedModuleRow>`
      select
        l.lesson_id as "lessonId",
        l.slug as "slug",
        l.display_order as "displayOrder",
        l.enabled as "enabled",
        lm.module_type as "moduleType",
        mr.revision_id as "revisionId",
        mr.payload as "payload"
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
  }

  listPublishedLessonModules(lessonId: string) {
    return this.sql<PublishedModuleRow>`
      select
        l.lesson_id as "lessonId",
        l.slug as "slug",
        l.display_order as "displayOrder",
        l.enabled as "enabled",
        lm.module_type as "moduleType",
        mr.revision_id as "revisionId",
        mr.payload as "payload"
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
  }
}
