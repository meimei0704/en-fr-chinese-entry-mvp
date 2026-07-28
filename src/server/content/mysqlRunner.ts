import { readFile } from 'node:fs/promises'
import { createConnection } from 'mysql2/promise'

const unsafeMysqlDatabaseNames = new Set([
  'default',
  'information_schema',
  'inspection_schema',
  'metrics_schema',
  'mysql',
  'performance_schema',
  'sys',
  'test',
])

export interface MysqlRunnerEnv {
  DATABASE_URL?: string
  MYSQL_DATABASE_URL?: string
  MYSQL_SSL?: string
  MYSQL_URL?: string
}

export function resolveMysqlRunnerUrl(env: MysqlRunnerEnv) {
  return env.MYSQL_DATABASE_URL ?? env.MYSQL_URL ?? env.DATABASE_URL
}

export function redactDatabaseUrl(value: string) {
  try {
    const url = new URL(value)

    if (url.username) {
      url.username = '***'
    }

    if (url.password) {
      url.password = '***'
    }

    return url.toString()
  } catch {
    return '[invalid database url]'
  }
}

function normalizeDatabaseName(databaseName: string) {
  return databaseName.trim().replaceAll('`', '').toLowerCase()
}

function databaseTargetError(message: string) {
  return new Error(`${message} Use MYSQL_DATABASE_URL for a dedicated content-admin application/test database.`)
}

export function assertSafeMysqlDatabaseName(databaseName: string | undefined, source = 'MySQL database target') {
  const normalizedDatabaseName = databaseName === undefined ? '' : normalizeDatabaseName(databaseName)

  if (!normalizedDatabaseName) {
    throw databaseTargetError(`${source} must include a dedicated database name.`)
  }

  if (unsafeMysqlDatabaseNames.has(normalizedDatabaseName)) {
    throw databaseTargetError(`${source} "${databaseName}" is not safe for content-admin DDL/seed.`)
  }

  return databaseName as string
}

export function assertSafeMysqlDatabaseTarget(databaseUrl: string) {
  let url: URL

  try {
    url = new URL(databaseUrl)
  } catch {
    throw databaseTargetError('Invalid MySQL database URL.')
  }

  if (url.protocol !== 'mysql:') {
    throw databaseTargetError(`Invalid MySQL database URL protocol "${url.protocol}".`)
  }

  const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, '').split('/')[0] ?? '')

  return assertSafeMysqlDatabaseName(databaseName)
}

function stripLineComment(sql: string, index: number) {
  let cursor = index + 2

  while (cursor < sql.length && sql[cursor] !== '\n') {
    cursor += 1
  }

  return cursor
}

function stripBlockComment(sql: string, index: number) {
  const end = sql.indexOf('*/', index + 2)

  return end === -1 ? sql.length : end + 2
}

export function splitMysqlStatements(sql: string) {
  const statements: string[] = []
  let current = ''
  let quote: "'" | '"' | '`' | undefined

  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index]
    const next = sql[index + 1]

    if (!quote && char === '-' && next === '-') {
      index = stripLineComment(sql, index)
      continue
    }

    if (!quote && char === '/' && next === '*') {
      index = stripBlockComment(sql, index) - 1
      continue
    }

    if (quote) {
      current += char

      if (char === '\\') {
        index += 1
        current += sql[index] ?? ''
        continue
      }

      if (char === quote) {
        quote = undefined
      }

      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char
      current += char
      continue
    }

    if (char === ';') {
      const statement = current.trim()

      if (statement) {
        statements.push(statement)
      }

      current = ''
      continue
    }

    current += char
  }

  const trailing = current.trim()

  if (trailing) {
    statements.push(trailing)
  }

  return statements
}

export interface RunMysqlSqlFilesOptions {
  connection?: {
    execute(statement: string, values?: unknown[]): Promise<unknown>
    end(): Promise<unknown>
  }
  databaseUrl: string
  files: string[]
  mysqlSsl?: string
}

export function createMysqlConnectionOptions({
  databaseUrl,
  mysqlSsl,
}: Pick<RunMysqlSqlFilesOptions, 'databaseUrl' | 'mysqlSsl'>) {
  return {
    uri: databaseUrl,
    ssl: mysqlSsl === 'required' ? { rejectUnauthorized: true } : undefined,
  }
}

export async function runMysqlSqlFiles({ connection, databaseUrl, files, mysqlSsl }: RunMysqlSqlFilesOptions) {
  const mysql =
    connection ??
    ((await createConnection(
      createMysqlConnectionOptions({ databaseUrl, mysqlSsl }),
    )) as unknown as NonNullable<RunMysqlSqlFilesOptions['connection']>)

  try {
    for (const file of files) {
      const statements = splitMysqlStatements(await readFile(file, 'utf8'))

      for (const statement of statements) {
        await mysql.execute(statement)
      }
    }
  } finally {
    if (!connection) {
      await mysql.end()
    }
  }
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

function firstStringValue(row: Record<string, unknown> | undefined, candidateKeys: string[]) {
  if (!row) {
    return undefined
  }

  for (const key of candidateKeys) {
    const value = row[key]

    if (typeof value === 'string') {
      return value
    }
  }

  const fallback = Object.values(row).find((value) => typeof value === 'string')

  return typeof fallback === 'string' ? fallback : undefined
}

async function selectedMysqlDatabase(connection: NonNullable<RunMysqlSqlFilesOptions['connection']>) {
  const rows = mysqlRows(await connection.execute('select database() as databaseName'))

  return firstStringValue(rows[0], ['databaseName', 'DATABASE()', 'database()'])
}

async function currentSchemaTables(connection: NonNullable<RunMysqlSqlFilesOptions['connection']>) {
  const rows = mysqlRows(
    await connection.execute(`
      select table_name as tableName
      from information_schema.tables
      where table_schema = database()
        and table_type = 'BASE TABLE'
      order by table_name
    `),
  )

  return rows
    .map((row) => firstStringValue(row, ['tableName', 'TABLE_NAME', 'table_name']))
    .filter((tableName): tableName is string => tableName !== undefined)
}

export async function assertFreshMysqlDatabase(
  connection: NonNullable<RunMysqlSqlFilesOptions['connection']>,
  expectedDatabaseName: string,
) {
  const selectedDatabaseName = assertSafeMysqlDatabaseName(
    await selectedMysqlDatabase(connection),
    'Selected MySQL database',
  )

  if (normalizeDatabaseName(selectedDatabaseName) !== normalizeDatabaseName(expectedDatabaseName)) {
    throw databaseTargetError(
      `Selected MySQL database "${selectedDatabaseName}" does not match URL database "${expectedDatabaseName}".`,
    )
  }

  const tableNames = await currentSchemaTables(connection)

  if (tableNames.length > 0) {
    const preview = tableNames.slice(0, 10).join(', ')
    const suffix = tableNames.length > 10 ? ', ...' : ''

    throw databaseTargetError(
      `Refusing content admin MySQL bootstrap because selected database "${selectedDatabaseName}" is not fresh; existing tables: ${preview}${suffix}.`,
    )
  }
}

export async function runMysqlFreshBootstrapSqlFiles({
  connection,
  databaseUrl,
  files,
  mysqlSsl,
}: RunMysqlSqlFilesOptions) {
  const expectedDatabaseName = assertSafeMysqlDatabaseTarget(databaseUrl)
  const mysql =
    connection ??
    ((await createConnection(
      createMysqlConnectionOptions({ databaseUrl, mysqlSsl }),
    )) as unknown as NonNullable<RunMysqlSqlFilesOptions['connection']>)

  try {
    await assertFreshMysqlDatabase(mysql, expectedDatabaseName)
    await runMysqlSqlFiles({ connection: mysql, databaseUrl, files, mysqlSsl })
  } finally {
    if (!connection) {
      await mysql.end()
    }
  }
}
