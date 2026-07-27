import { readFile } from 'node:fs/promises'
import { createConnection } from 'mysql2/promise'

export interface MysqlRunnerEnv {
  DATABASE_URL?: string
  MYSQL_DATABASE_URL?: string
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
    execute(statement: string): Promise<unknown>
    end(): Promise<unknown>
  }
  databaseUrl: string
  files: string[]
}

export async function runMysqlSqlFiles({ connection, databaseUrl, files }: RunMysqlSqlFilesOptions) {
  const mysql =
    connection ??
    ((await createConnection({
      uri: databaseUrl,
    })) as unknown as NonNullable<RunMysqlSqlFilesOptions['connection']>)

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
