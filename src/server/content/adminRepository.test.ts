import { describe, expect, it } from 'vitest'

import { course } from '../../content/course'
import type { LessonContent } from '../../content/types'
import { ContentAdminRepository, NoUnpublishedChangesError } from './adminRepository'
import type {
  AdminLessonSnapshot,
  ContentAdminStore,
  ContentModuleRevisionRow,
  CurrentModuleState,
  InsertModuleRevisionInput,
  InsertedModuleRevision,
  PublishedModuleHistoryEntry,
} from './adminTypes'
import { contentModuleTypes, type ContentModuleType, type ModulePayload } from './types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function modulePayloadsForLesson(lesson: LessonContent) {
  return new Map<ContentModuleType, ModulePayload>([
    [
      'lessonMeta',
      {
        id: lesson.id,
        title: clone(lesson.title),
        scenario: clone(lesson.scenario),
      },
    ],
    ['dialogue', clone(lesson.dialogue)],
    ['sentencePatterns', clone(lesson.sentencePatterns)],
    ['vocabulary', clone(lesson.vocabulary)],
    ['practice', clone(lesson.practice)],
    ['reviewCards', clone(lesson.reviewCards)],
    ['shortInput', clone(lesson.shortInput)],
  ])
}

function createCurrentStates(lesson: LessonContent): CurrentModuleState[] {
  let nextRevisionId = 100
  const rows: CurrentModuleState[] = []
  const payloads = modulePayloadsForLesson(lesson)

  for (const moduleType of contentModuleTypes) {
    const publishedRevisionId = nextRevisionId++
    const draftRevisionId = nextRevisionId++
    const payload = clone(payloads.get(moduleType))

    rows.push({
      lessonId: lesson.id,
      slug: lesson.id,
      displayOrder: 1,
      enabled: true,
      moduleType,
      draftRevisionId,
      draftPayload: clone(payload),
      draftCreatedAt: `2026-07-28T00:00:${draftRevisionId.toString().padStart(2, '0')}Z`,
      draftCreatedBy: 'seed:static-content',
      draftNote: 'Initial draft baseline',
      draftSourceRevisionId: publishedRevisionId,
      publishedRevisionId,
      publishedPayload: clone(payload),
      publishedCreatedAt: `2026-07-28T00:00:${publishedRevisionId.toString().padStart(2, '0')}Z`,
      publishedCreatedBy: 'seed:static-content',
      publishedNote: 'Initial published baseline',
      publishedSourceRevisionId: null,
    })
  }

  return rows
}

function historyKey(lessonId: string, moduleType: ContentModuleType) {
  return `${lessonId}:${moduleType}`
}

function createInMemoryStore(lesson = course.lessons[0]): ContentAdminStore {
  const currentStates = createCurrentStates(lesson)
  const stateByModule = new Map(
    currentStates.map((row) => [historyKey(row.lessonId, row.moduleType), clone(row)]),
  )
  let nextRevisionId = 500
  const publishedHistory = new Map<string, PublishedModuleHistoryEntry[]>()

  for (const row of currentStates) {
    publishedHistory.set(historyKey(row.lessonId, row.moduleType), [
      {
        lessonId: row.lessonId,
        moduleType: row.moduleType,
        revisionId: row.publishedRevisionId,
        payload: clone(row.publishedPayload),
        createdAt: row.publishedCreatedAt,
        createdBy: row.publishedCreatedBy,
        note: row.publishedNote,
        sourceRevisionId: row.publishedSourceRevisionId,
      },
    ])
  }

  function sortedCurrentStates() {
    return [...stateByModule.values()].sort((left, right) => left.moduleType.localeCompare(right.moduleType))
  }

  return {
    async listCurrentModuleStates() {
      return sortedCurrentStates().map((row) => clone(row))
    },
    async listCurrentLessonModuleStates(lessonId: string) {
      return sortedCurrentStates().filter((row) => row.lessonId === lessonId).map((row) => clone(row))
    },
    async getCurrentModuleState(lessonId: string, moduleType: ContentModuleType) {
      return clone(stateByModule.get(historyKey(lessonId, moduleType)) ?? null)
    },
    async listPublishedModuleHistory(lessonId: string, moduleType: ContentModuleType) {
      return clone(publishedHistory.get(historyKey(lessonId, moduleType)) ?? [])
    },
    async insertModuleRevision(input: InsertModuleRevisionInput): Promise<InsertedModuleRevision> {
      const revisionId = nextRevisionId++
      const createdAt = `2026-07-28T01:00:${revisionId.toString().padStart(2, '0')}Z`

      if (input.revisionKind === 'published') {
        const key = historyKey(input.lessonId, input.moduleType)
        const existing = publishedHistory.get(key) ?? []
        publishedHistory.set(key, [
          {
            lessonId: input.lessonId,
            moduleType: input.moduleType,
            revisionId,
            payload: clone(input.payload),
            createdAt,
            createdBy: input.createdBy,
            note: input.note,
            sourceRevisionId: input.sourceRevisionId,
          },
          ...existing,
        ])
      }

      return {
        lessonId: input.lessonId,
        moduleType: input.moduleType,
        revisionId,
        revisionKind: input.revisionKind,
        payload: clone(input.payload),
        createdAt,
        createdBy: input.createdBy,
        note: input.note,
        sourceRevisionId: input.sourceRevisionId,
      }
    },
    async updateCurrentModuleState(row: ContentModuleRevisionRow) {
      const current = stateByModule.get(historyKey(row.lessonId, row.moduleType))

      if (!current) {
        throw new Error(`Missing module ${row.lessonId}:${row.moduleType}`)
      }

      if (row.revisionKind === 'draft') {
        current.draftRevisionId = row.revisionId
        current.draftPayload = clone(row.payload)
        current.draftCreatedAt = row.createdAt
        current.draftCreatedBy = row.createdBy
        current.draftNote = row.note
        current.draftSourceRevisionId = row.sourceRevisionId
      }

      if (row.revisionKind === 'published') {
        current.publishedRevisionId = row.revisionId
        current.publishedPayload = clone(row.payload)
        current.publishedCreatedAt = row.createdAt
        current.publishedCreatedBy = row.createdBy
        current.publishedNote = row.note
        current.publishedSourceRevisionId = row.sourceRevisionId
      }
    },
    async runInTransaction<T>(work: (store: ContentAdminStore) => Promise<T>) {
      return work(this)
    },
  }
}

function findModule(snapshot: AdminLessonSnapshot, moduleType: ContentModuleType) {
  const module = snapshot.modules.find((entry) => entry.moduleType === moduleType)

  expect(module).toBeDefined()
  return module!
}

describe('ContentAdminRepository', () => {
  it('lists editable lessons and exposes draft/published snapshots in learner lesson shape', async () => {
    const repository = new ContentAdminRepository(createInMemoryStore(course.lessons[0]))

    const summaries = await repository.listLessons()
    const snapshot = await repository.getLessonSnapshot(course.lessons[0].id)

    expect(summaries).toEqual([
      expect.objectContaining({
        lessonId: course.lessons[0].id,
        slug: course.lessons[0].id,
        draftChangedModuleCount: 0,
      }),
    ])
    expect(snapshot.publishedLesson?.id).toBe(course.lessons[0].id)
    expect(snapshot.draftLesson?.dialogue.lines[0]?.hanzi).toBe(course.lessons[0].dialogue.lines[0]?.hanzi)
    expect(findModule(snapshot, 'dialogue').hasUnpublishedChanges).toBe(false)
  })

  it('saves a module draft without changing the published lesson snapshot', async () => {
    const repository = new ContentAdminRepository(createInMemoryStore(course.lessons[0]))
    const updatedMeta = {
      id: course.lessons[0].id,
      title: {
        en: 'Updated published-safe admin draft title',
        fr: 'Titre brouillon mis à jour',
      },
      scenario: clone(course.lessons[0].scenario),
    }

    await repository.saveDraftModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      payload: updatedMeta,
      createdBy: 'admin-ui',
      note: 'Adjust lesson title before publish',
    })

    const snapshot = await repository.getLessonSnapshot(course.lessons[0].id)

    expect(snapshot.draftLesson?.title.en).toBe('Updated published-safe admin draft title')
    expect(snapshot.publishedLesson?.title.en).toBe(course.lessons[0].title.en)
    expect(findModule(snapshot, 'lessonMeta').hasUnpublishedChanges).toBe(true)
    expect((await repository.listLessons())[0]?.draftChangedModuleCount).toBe(1)
  })

  it('publishes one module by creating a fresh published revision and clearing the unpublished-change flag', async () => {
    const repository = new ContentAdminRepository(createInMemoryStore(course.lessons[0]))

    await repository.saveDraftModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      payload: {
        id: course.lessons[0].id,
        title: { en: 'Ready to publish', fr: 'Prêt à publier' },
        scenario: clone(course.lessons[0].scenario),
      },
      createdBy: 'admin-ui',
      note: 'Prepare title publish',
    })

    await repository.publishModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      createdBy: 'admin-ui',
      note: 'Publish title change',
    })

    const snapshot = await repository.getLessonSnapshot(course.lessons[0].id)
    const history = snapshot.publishedHistory.lessonMeta

    expect(snapshot.publishedLesson?.title.en).toBe('Ready to publish')
    expect(snapshot.draftLesson?.title.en).toBe('Ready to publish')
    expect(findModule(snapshot, 'lessonMeta').hasUnpublishedChanges).toBe(false)
    expect(history[0]).toEqual(expect.objectContaining({ note: 'Publish title change' }))
    expect(history).toHaveLength(2)
  })

  it('rolls back to an earlier published module revision by cloning that published payload into a new live revision', async () => {
    const repository = new ContentAdminRepository(createInMemoryStore(course.lessons[0]))

    await repository.saveDraftModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      payload: {
        id: course.lessons[0].id,
        title: { en: 'Published version two', fr: 'Version publiée deux' },
        scenario: clone(course.lessons[0].scenario),
      },
      createdBy: 'admin-ui',
      note: 'Prepare V2',
    })
    await repository.publishModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      createdBy: 'admin-ui',
      note: 'Publish V2',
    })

    await repository.saveDraftModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      payload: {
        id: course.lessons[0].id,
        title: { en: 'Published version three', fr: 'Version publiée trois' },
        scenario: clone(course.lessons[0].scenario),
      },
      createdBy: 'admin-ui',
      note: 'Prepare V3',
    })
    await repository.publishModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      createdBy: 'admin-ui',
      note: 'Publish V3',
    })

    const beforeRollback = await repository.getLessonSnapshot(course.lessons[0].id)
    const versionTwoRevisionId = beforeRollback.publishedHistory.lessonMeta.find((entry) => entry.note === 'Publish V2')?.revisionId

    expect(versionTwoRevisionId).toBeDefined()

    await repository.rollbackModule({
      lessonId: course.lessons[0].id,
      moduleType: 'lessonMeta',
      publishedRevisionId: versionTwoRevisionId!,
      createdBy: 'admin-ui',
      note: 'Rollback to V2',
    })

    const snapshot = await repository.getLessonSnapshot(course.lessons[0].id)

    expect(snapshot.publishedLesson?.title.en).toBe('Published version two')
    expect(snapshot.draftLesson?.title.en).toBe('Published version two')
    expect(findModule(snapshot, 'lessonMeta').hasUnpublishedChanges).toBe(false)
    expect(snapshot.publishedHistory.lessonMeta[0]).toEqual(
      expect.objectContaining({ note: 'Rollback to V2', sourceRevisionId: versionTwoRevisionId }),
    )
  })

  it('rejects invalid draft payloads and publishing when nothing has changed', async () => {
    const repository = new ContentAdminRepository(createInMemoryStore(course.lessons[0]))

    await expect(
      repository.saveDraftModule({
        lessonId: course.lessons[0].id,
        moduleType: 'lessonMeta',
        payload: { id: course.lessons[0].id },
        createdBy: 'admin-ui',
        note: 'Invalid payload',
      }),
    ).rejects.toThrow(/lessonMeta/i)

    await expect(
      repository.publishModule({
        lessonId: course.lessons[0].id,
        moduleType: 'dialogue',
        createdBy: 'admin-ui',
        note: 'Should not publish unchanged content',
      }),
    ).rejects.toBeInstanceOf(NoUnpublishedChangesError)
  })
})
