import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  AdminApiError,
  clearAdminBasicAuth,
  getAdminLessonSnapshot,
  publishAdminModule,
  rollbackAdminModule,
  saveAdminBasicAuth,
  saveAdminDraftModule,
} from '../admin/api.js'
import type { AdminLessonSnapshot } from '../admin/types.js'
import { AdminAccessForm } from '../components/admin/AdminAccessForm.js'
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
  const [requiresAuth, setRequiresAuth] = useState(false)

  const loadSnapshot = useCallback(async () => {
    return getAdminLessonSnapshot(lessonId)
      .then((result) => {
        setSnapshot(result)
        setError(null)
        setActionError(null)
        setRequiresAuth(false)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof AdminApiError && requestError.status === 401) {
          clearAdminBasicAuth()
          setRequiresAuth(true)
          setError(requestError.message)
          setSnapshot(null)
          return
        }

        setError(
          requestError instanceof AdminApiError ? requestError.message : 'Unable to load lesson editor',
        )
        setSnapshot(null)
      })
  }, [lessonId])

  useEffect(() => {
    void loadSnapshot().catch(() => undefined)
  }, [loadSnapshot])

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

  async function handleUnlock(username: string, password: string) {
    saveAdminBasicAuth(username, password)
    await loadSnapshot()
  }

  if (error) {
    if (requiresAuth) {
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
          <AdminAccessForm error={error} onSubmit={handleUnlock} />
        </main>
      )
    }

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
    <main className="page-shell page-shell--wide admin-page-shell">
      <section className="hero-card lesson-header-card admin-editor-hero">
        <div className="admin-editor-hero__header">
          <div>
            <p className="eyebrow">Content Admin</p>
            <h1>Edit {snapshot.lessonId}</h1>
            <p className="lede">Polish the draft module-by-module, preview the learner-facing output, then publish intentionally.</p>
          </div>
          <div className="admin-badge-column">
            <span className="badge badge--sky">Lesson {snapshot.displayOrder}</span>
            <span className={`badge ${pendingModuleCount > 0 ? 'badge--gold' : 'badge--jade'}`}>
              {pendingModuleCount > 0 ? `${pendingModuleCount} pending` : 'Published in sync'}
            </span>
          </div>
        </div>
        <div className="admin-editor-hero__summary">
          <article className="admin-metric-card">
            <span>Lesson id</span>
            <strong>{snapshot.lessonId}</strong>
            <p>Slug: {snapshot.slug}</p>
          </article>
          <article className="admin-metric-card admin-metric-card--attention">
            <span>Draft state</span>
            <strong>{pendingModuleCount}</strong>
            <p>
              {pendingModuleCount > 0
                ? `${pendingModuleCount} module pending publish`
                : 'All modules published'}
            </p>
          </article>
        </div>
        <nav className="button-row">
          <Link className="secondary-link" to="/admin">
            Back to admin lesson list
          </Link>
        </nav>
        {actionError ? <p className="admin-inline-feedback admin-inline-feedback--error">{actionError}</p> : null}
      </section>

      <div className="admin-editor-layout" data-testid="admin-editor-layout">
        <section className="admin-editor-main-column" data-testid="admin-editor-main-column">
          <section className="surface-card lesson-section-card admin-workspace-card">
            <div className="admin-section-heading">
              <div>
                <p className="eyebrow">Editing workspace</p>
                <h2>Draft modules</h2>
                <p className="muted-text">Structured fields stay lightweight; flexible modules keep JSON visible but better framed.</p>
              </div>
              <span className="badge badge--sky">No business logic changes</span>
            </div>
          </section>
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
        </section>

        <aside className="admin-editor-side-column" data-testid="admin-editor-side-column">
          <section className="surface-card lesson-section-card admin-workspace-card">
            <div className="admin-section-heading">
              <div>
                <p className="eyebrow">Preview & publish</p>
                <h2>Review before shipping</h2>
                <p className="muted-text">Use this side rail to sanity-check the learner view, publish a module, or roll back safely.</p>
              </div>
              <span className="badge badge--gold">Review zone</span>
            </div>
          </section>

          <LessonPreviewPanel lesson={draftLesson} />
          <ModuleHistoryList
            snapshot={snapshot}
            pendingAction={pendingHistoryAction}
            onPublish={handlePublishModule}
            onRollback={handleRollbackModule}
          />
        </aside>
      </div>
    </main>
  )
}
