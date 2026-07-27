import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migrationSql = () => readFileSync('db/migrations/0001_content_admin.sql', 'utf8')

describe('content admin database migration', () => {
  it('creates the three core MySQL tables with published and draft pointers', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/create table if not exists lessons/i)
    expect(sql).toMatch(/create table if not exists lesson_modules/i)
    expect(sql).toMatch(/create table if not exists module_revisions/i)
    expect(sql).toMatch(/current_published_revision_id\s+bigint/i)
    expect(sql).toMatch(/current_draft_revision_id\s+bigint/i)
    expect(sql).toMatch(/payload\s+json\s+not null/i)
    expect(sql).toMatch(/revision_id\s+bigint\s+primary key\s+auto_increment/i)
    expect(sql).toMatch(/engine=innodb/i)
    expect(sql).toMatch(/current_published_revision_kind\s+varchar\(32\)\s+not null default 'published'/i)
    expect(sql).toMatch(/current_draft_revision_kind\s+varchar\(32\)\s+not null default 'draft'/i)
  })

  it('supports immutable published history and rollback as a new sourced revision', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/source_revision_id\s+bigint/i)
    expect(sql).toMatch(/revision_kind\s+varchar\(32\)\s+not null/i)
    expect(sql).toMatch(/check\s*\(revision_kind in \('draft', 'published'\)\)/i)
    expect(sql).toMatch(/module_revisions_source_fk/i)
    expect(sql).not.toMatch(/prevent_module_revision_mutation/i)
  })

  it('guards lesson module pointers by revision kind and same lesson module through composite foreign keys', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/module_revisions_revision_module_kind_uid \(revision_id, lesson_id, module_type, revision_kind\)/i)
    expect(sql).toMatch(/lesson_modules_current_published_revision_fk/i)
    expect(sql).toMatch(
      /foreign key \(current_published_revision_id, lesson_id, module_type, current_published_revision_kind\)/i,
    )
    expect(sql).toMatch(/lesson_modules_current_draft_revision_fk/i)
    expect(sql).toMatch(/foreign key \(current_draft_revision_id, lesson_id, module_type, current_draft_revision_kind\)/i)
  })

  it('is MySQL/TiDB-oriented and avoids PostgreSQL-only syntax', () => {
    const sql = migrationSql()

    expect(sql).not.toMatch(/\bjsonb\b/i)
    expect(sql).not.toMatch(/\btimestamptz\b/i)
    expect(sql).not.toMatch(/\bbigserial\b/i)
    expect(sql).not.toMatch(/language\s+plpgsql/i)
    expect(sql).not.toMatch(/create\s+trigger/i)
    expect(sql).not.toMatch(/\$\$/)
  })
})
