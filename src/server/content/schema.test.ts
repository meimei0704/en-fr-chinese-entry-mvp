import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migrationSql = () => readFileSync('db/migrations/0001_content_admin.sql', 'utf8')

describe('content admin database migration', () => {
  it('creates the three core tables with published and draft pointers', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/create table if not exists lessons/i)
    expect(sql).toMatch(/create table if not exists lesson_modules/i)
    expect(sql).toMatch(/create table if not exists module_revisions/i)
    expect(sql).toMatch(/current_published_revision_id\s+bigint/i)
    expect(sql).toMatch(/current_draft_revision_id\s+bigint/i)
    expect(sql).toMatch(/payload\s+jsonb\s+not null/i)
  })

  it('supports immutable published history and rollback as a new sourced revision', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/source_revision_id\s+bigint/i)
    expect(sql).toMatch(/revision_kind\s+text\s+not null/i)
    expect(sql).toMatch(/check\s*\(revision_kind in \('draft', 'published'\)\)/i)
    expect(sql).toMatch(/prevent_module_revision_mutation/i)
    expect(sql).toMatch(/before update or delete on module_revisions/i)
  })

  it('guards lesson module pointers by revision kind and same lesson module', () => {
    const sql = migrationSql()

    expect(sql).toMatch(/validate_lesson_module_revision_pointers/i)
    expect(sql).toMatch(/current_published_revision_id[\s\S]+revision_kind <> 'published'/i)
    expect(sql).toMatch(/current_draft_revision_id[\s\S]+revision_kind <> 'draft'/i)
    expect(sql).toMatch(/revision\.lesson_id <> new\.lesson_id/i)
    expect(sql).toMatch(/revision\.module_type <> new\.module_type/i)
    expect(sql).toMatch(/before insert or update on lesson_modules/i)
  })
})
