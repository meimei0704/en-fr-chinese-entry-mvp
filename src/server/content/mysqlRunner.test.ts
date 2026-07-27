import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  assertSafeMysqlDatabaseTarget,
  redactDatabaseUrl,
  runMysqlFreshBootstrapSqlFiles,
  splitMysqlStatements,
} from './mysqlRunner'
import { contentAdminSqlFiles } from './runMysqlContentAdmin'

function createFakeConnection(existingTables: string[]) {
  const executedStatements: string[] = []
  const connection = {
    async execute(statement: string) {
      executedStatements.push(statement)

      if (/select\s+database\(\)/i.test(statement)) {
        return [[{ databaseName: 'content_admin_test' }], []]
      }

      if (/information_schema\.tables/i.test(statement)) {
        return [existingTables.map((tableName) => ({ tableName })), []]
      }

      return [[], []]
    },
    async end() {
      return undefined
    },
  }

  return { connection, executedStatements }
}

describe('MySQL migration runner helpers', () => {
  it('splits SQL files into executable statements without splitting semicolons in strings', () => {
    const statements = splitMysqlStatements(`
      -- ignored comment
      create table example (payload json not null);
      insert into example (payload) values ('{"text":"keep;semicolon"}');
      /* ignored block; comment */
      update example set payload = '{"done":true}';
    `)

    expect(statements).toEqual([
      'create table example (payload json not null)',
      'insert into example (payload) values (\'{"text":"keep;semicolon"}\')',
      'update example set payload = \'{"done":true}\'',
    ])
  })

  it('redacts database URLs before they can be logged', () => {
    expect(redactDatabaseUrl('mysql://user:password@example.com:4000/content_admin')).toBe(
      'mysql://***:***@example.com:4000/content_admin',
    )
    expect(redactDatabaseUrl('not-a-url')).toBe('[invalid database url]')
  })

  it('rejects unsafe MySQL database targets without echoing credentials', () => {
    const secretUrl = 'mysql://user:super-secret@example.com:4000/sys'

    expect(() => assertSafeMysqlDatabaseTarget(secretUrl)).toThrow(/sys/i)

    try {
      assertSafeMysqlDatabaseTarget(secretUrl)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).not.toContain('super-secret')
      expect((error as Error).message).not.toContain('user:super-secret')
    }

    expect(() => assertSafeMysqlDatabaseTarget('postgres://user:password@example.com/content_admin')).toThrow(
      /mysql/i,
    )
    expect(() => assertSafeMysqlDatabaseTarget('mysql://user:password@example.com')).toThrow(/dedicated/i)
  })

  it('refuses fresh bootstrap before executing SQL when the selected database already has tables', async () => {
    const { connection, executedStatements } = createFakeConnection(['lessons'])

    await expect(
      runMysqlFreshBootstrapSqlFiles({
        connection,
        databaseUrl: 'mysql://user:password@example.com:4000/content_admin_test',
        files: ['db/migrations/0001_content_admin.sql'],
      }),
    ).rejects.toThrow(/fresh.*lessons/i)

    expect(executedStatements).toEqual([
      'select database() as databaseName',
      expect.stringContaining('information_schema.tables'),
    ])
  })

  it('runs SQL files only after a safe target and fresh-schema preflight passes', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'content-mysql-runner-'))
    const sqlFile = join(dir, 'bootstrap.sql')
    const { connection, executedStatements } = createFakeConnection([])

    try {
      await writeFile(
        sqlFile,
        "create table example (id int primary key);\ninsert into example (id) values ('1;2');\n",
      )

      await runMysqlFreshBootstrapSqlFiles({
        connection,
        databaseUrl: 'mysql://user:password@example.com:4000/content_admin_test',
        files: [sqlFile],
      })

      expect(executedStatements.slice(0, 2)).toEqual([
        'select database() as databaseName',
        expect.stringContaining('information_schema.tables'),
      ])
      expect(executedStatements.slice(2)).toEqual([
        'create table example (id int primary key)',
        "insert into example (id) values ('1;2')",
      ])
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('applies migration before seed for the content admin runner', () => {
    expect(contentAdminSqlFiles).toEqual([
      'db/migrations/0001_content_admin.sql',
      'db/seeds/0001_initial_content_admin.sql',
    ])
  })
})
