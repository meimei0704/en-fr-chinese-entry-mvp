import { describe, expect, it, vi } from 'vitest'

import { ContentAdminMysqlStore } from './adminStoreMysql'
import type { ContentModuleRevisionRow } from './adminTypes'

function createRevisionRow(revisionKind: 'draft' | 'published'): ContentModuleRevisionRow {
  return {
    lessonId: 'self-intro',
    moduleType: 'lessonMeta',
    revisionId: revisionKind === 'draft' ? 701 : 801,
    revisionKind,
    payload: {
      id: 'self-intro',
      title: { en: `${revisionKind} title`, fr: `${revisionKind} titre` },
      scenario: { en: 'Scenario', fr: 'Scénario' },
    },
    sourceRevisionId: revisionKind === 'draft' ? 101 : 201,
    createdBy: 'admin-ui',
    createdAt: '2026-07-28T00:00:00.000Z',
    note: `${revisionKind} note`,
  }
}

describe('ContentAdminMysqlStore', () => {
  it('queries current lesson module states through both draft and published pointers', async () => {
    const execute = vi.fn().mockResolvedValue([
      [
        {
          lessonId: 'self-intro',
          slug: 'self-intro',
          displayOrder: 1,
          enabled: 1,
          moduleType: 'lessonMeta',
          draftRevisionId: 102,
          draftPayload: JSON.stringify({ id: 'self-intro', title: { en: 'Draft', fr: 'Brouillon' }, scenario: { en: 'Draft scenario', fr: 'Scénario brouillon' } }),
          draftCreatedAt: '2026-07-28T00:00:00.000Z',
          draftCreatedBy: 'admin-ui',
          draftNote: 'draft note',
          draftSourceRevisionId: 101,
          publishedRevisionId: 101,
          publishedPayload: JSON.stringify({ id: 'self-intro', title: { en: 'Published', fr: 'Publié' }, scenario: { en: 'Published scenario', fr: 'Scénario publié' } }),
          publishedCreatedAt: '2026-07-28T00:00:00.000Z',
          publishedCreatedBy: 'seed:static-content',
          publishedNote: 'published note',
          publishedSourceRevisionId: null,
        },
      ],
      [],
    ])
    const store = new ContentAdminMysqlStore({ execute, getConnection: vi.fn() })

    const rows = await store.listCurrentLessonModuleStates('self-intro')
    const [query, values] = execute.mock.calls[0]!

    expect(String(query)).toContain('current_draft_revision_id')
    expect(String(query)).toContain('current_published_revision_id')
    expect(String(query)).toContain("dr.revision_kind = 'draft'")
    expect(String(query)).toContain("pr.revision_kind = 'published'")
    expect(values).toEqual(['self-intro'])
    expect(rows[0]?.draftPayload).toEqual(
      expect.objectContaining({ title: { en: 'Draft', fr: 'Brouillon' } }),
    )
    expect(rows[0]?.publishedPayload).toEqual(
      expect.objectContaining({ title: { en: 'Published', fr: 'Publié' } }),
    )
  })

  it('inserts module revisions as JSON strings and returns the inserted revision id', async () => {
    const execute = vi.fn().mockResolvedValue([{ insertId: 901 }, []])
    const store = new ContentAdminMysqlStore({ execute, getConnection: vi.fn() })

    const inserted = await store.insertModuleRevision({
      lessonId: 'self-intro',
      moduleType: 'lessonMeta',
      payload: {
        id: 'self-intro',
        title: { en: 'Draft', fr: 'Brouillon' },
        scenario: { en: 'Scenario', fr: 'Scénario' },
      },
      revisionKind: 'draft',
      sourceRevisionId: 101,
      createdBy: 'admin-ui',
      note: 'Save lesson meta draft',
    })

    const [, values] = execute.mock.calls[0]!

    expect(values?.[2]).toBe(
      JSON.stringify({
        id: 'self-intro',
        title: { en: 'Draft', fr: 'Brouillon' },
        scenario: { en: 'Scenario', fr: 'Scénario' },
      }),
    )
    expect(inserted.revisionId).toBe(901)
  })

  it('updates only the matching current pointer column for draft vs published revisions', async () => {
    const execute = vi.fn().mockResolvedValue([[], []])
    const store = new ContentAdminMysqlStore({ execute, getConnection: vi.fn() })

    await store.updateCurrentModuleState(createRevisionRow('draft'))
    await store.updateCurrentModuleState(createRevisionRow('published'))

    expect(String(execute.mock.calls[0]?.[0])).toContain('current_draft_revision_id = ?')
    expect(String(execute.mock.calls[0]?.[0])).not.toContain('current_published_revision_id = ?')
    expect(String(execute.mock.calls[1]?.[0])).toContain('current_published_revision_id = ?')
  })

  it('uses a transaction-bound store when mutating multi-step publish/rollback flows', async () => {
    const execute = vi.fn().mockResolvedValue([[], []])
    const beginTransaction = vi.fn().mockResolvedValue(undefined)
    const commit = vi.fn().mockResolvedValue(undefined)
    const rollback = vi.fn().mockResolvedValue(undefined)
    const release = vi.fn()
    const connection = { execute, beginTransaction, commit, rollback, release }
    const getConnection = vi.fn().mockResolvedValue(connection)
    const store = new ContentAdminMysqlStore({ execute: vi.fn(), getConnection })

    const result = await store.runInTransaction(async (transactionStore) => {
      await transactionStore.listCurrentLessonModuleStates('self-intro')
      return 'done'
    })

    expect(result).toBe('done')
    expect(beginTransaction).toHaveBeenCalledTimes(1)
    expect(commit).toHaveBeenCalledTimes(1)
    expect(rollback).not.toHaveBeenCalled()
    expect(release).toHaveBeenCalledTimes(1)
  })
})
