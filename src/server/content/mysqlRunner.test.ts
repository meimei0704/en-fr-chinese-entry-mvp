import { describe, expect, it } from 'vitest'
import { redactDatabaseUrl, splitMysqlStatements } from './mysqlRunner'
import { contentAdminSqlFiles } from './runMysqlContentAdmin'

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

  it('applies migration before seed for the content admin runner', () => {
    expect(contentAdminSqlFiles).toEqual([
      'db/migrations/0001_content_admin.sql',
      'db/seeds/0001_initial_content_admin.sql',
    ])
  })
})
