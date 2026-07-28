import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  AdminApiError,
  getAdminLessonSnapshot,
  publishAdminModule,
  rollbackAdminModule,
  saveAdminDraftModule,
} from '../admin/api.js'
import type { AdminLessonSnapshot } from '../admin/types.js'
import { DialogueEditor } from '../components/admin/DialogueEditor.js'
import { JsonModuleEditor } from '../components/admin/JsonModuleEditor.js'
import { LessonMetaEditor } from '../components/admin/LessonMetaEditor.js'
import { ModuleHistoryList } from '../components/admin/ModuleHistoryList.js'
import { LessonPreviewPanel } from '../components/admin/LessonPreviewPanel.js'

const jsonModuleConfigs = [
  ['sentencePatterns', 'Sentence Patterns'],
  ['vocabulary', 'Vocabulary'],
  ['pronunciation', 'Pronunciation'],
  ['hanziRecognition', 'Hanzi Recognition'],
  ['practice', 'Practice'],
  ['reviewCards', 'Review Cards'],
  ['shortInput', 'Short Input'],
] as const

export function AdminLessonEditorPage() {
  const { lessonId = '' } = useParams()
  const [snapshot, setSnapshot] = useState<AdminLessonSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingHistoryAction, setPendingHistoryAction] = useState<{
    moduleType: string
    kind: 'publish' | 'rollback'
    revisionId?: number
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    getAdminLessonSnapshot(lessonId)
      .then((result) => {
        if (!cancelled) {
          setSnapshot(result)
          setError(null)
          setActionError(null)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof AdminApiError ? requestError.message : 'Unable to load lesson editor',
          )
          setSnapshot(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [lessonId])

  const pendingModuleCount = useMemo(
    () => snapshot?.modules.filter((module) => module.hasUnpublishedChanges).length ?? 0,
    [snapshot],
  )

  async function handleSaveModule(moduleType: string, payload: unknown, note: string) {
    try {
      const nextSnapshot = await saveAdminDraftModule({
        lessonId,
        moduleType,
        payload,
        note,
      })
      setSnapshot(nextSnapshot)
      setError(null)
      setActionError(null)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError ? requestError.message : `Unable to save ${moduleType} draft`,
      )
    }
  }

  async function handlePublishModule(moduleType: string) {
    setPendingHistoryAction({ moduleType, kind: 'publish' })

    try {
      const nextSnapshot = await publishAdminModule({
        lessonId,
        moduleType,
        note: `Publish ${moduleType} draft`,
      })
      setSnapshot(nextSnapshot)
      setError(null)
      setActionError(null)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError ? requestError.message : `Unable to publish ${moduleType}`,
      )
    } finally {
      setPendingHistoryAction(null)
    }
  }

  async function handleRollbackModule(moduleType: string, publishedRevisionId: number) {
    setPendingHistoryAction({ moduleType, kind: 'rollback', revisionId: publishedRevisionId })

    try {
      const nextSnapshot = await rollbackAdminModule({
        lessonId,
        moduleType,
        publishedRevisionId,
        note: `Rollback to revision ${publishedRevisionId}`,
      })
      setSnapshot(nextSnapshot)
      setError(null)
      setActionError(null)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError
          ? requestError.message
          : `Unable to roll back ${moduleType} to revision ${publishedRevisionId}`,
      )
    } finally {
      setPendingHistoryAction(null)
    }
  }

  if (error) {
    return (
      <main className="page-shell page-shell--wide">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">Content Admin</p>
          <h1>Lesson editor unavailable</h1>
          <p>{error}</p>
          <Link className="secondary-link" to="/admin">
            Back to admin lesson list
          </Link>
        </section>
      </main>
    )
  }

  if (!snapshot || !snapshot.draftLesson) {
    return (
      <main className="page-shell page-shell--wide">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">Content Admin</p>
          <h1>Loading lesson editor…</h1>
        </section>
      </main>
    )
  }

  const draftLesson = snapshot.draftLesson

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card lesson-header-card">
        <p className="eyebrow">Content Admin</p>
        <h1>Edit {snapshot.lessonId}</h1>
        <p>
          {pendingModuleCount > 0
            ? `${pendingModuleCount} module pending publish`
            : 'All modules published'}
        </p>
        <nav className="button-row">
          <Link className="secondary-link" to="/admin">
            Back to admin lesson list
          </Link>
        </nav>
        {actionError ? <p>{actionError}</p> : null}
      </section>

      <LessonPreviewPanel lesson={draftLesson} />
      <LessonMetaEditor
        lesson={draftLesson}
        onSave={(payload) => handleSaveModule('lessonMeta', payload, 'Save lesson meta draft')}
      />
      <DialogueEditor
        dialogue={draftLesson.dialogue}
        onSave={(payload) => handleSaveModule('dialogue', payload, 'Save dialogue draft')}
      />

      {jsonModuleConfigs.map(([moduleType, label]) => (
        <JsonModuleEditor
          key={moduleType}
          label={label}
          payload={draftLesson[moduleType]}
          onSave={(payload) => handleSaveModule(moduleType, payload, `Save ${label.toLowerCase()} draft`)}
        />
      ))}

      <ModuleHistoryList
        snapshot={snapshot}
        pendingAction={pendingHistoryAction}
        onPublish={handlePublishModule}
        onRollback={handleRollbackModule}
      />
    </main>
  )
}
