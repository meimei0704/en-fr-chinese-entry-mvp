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
import { getEnglishText } from '../admin/localized.js'
import type { AdminLessonSnapshot } from '../admin/types.js'
import type { ContentModuleType } from '../server/content/types.js'
import { AdminAccessForm } from '../components/admin/AdminAccessForm.js'
import { DialogueEditor } from '../components/admin/DialogueEditor.js'
import { JsonModuleEditor } from '../components/admin/JsonModuleEditor.js'
import { LessonMetaEditor } from '../components/admin/LessonMetaEditor.js'
import { ModuleHistoryList } from '../components/admin/ModuleHistoryList.js'
import { LessonPreviewPanel } from '../components/admin/LessonPreviewPanel.js'

const moduleOrder: ContentModuleType[] = [
  'lessonMeta',
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'pronunciation',
  'hanziRecognition',
  'practice',
  'reviewCards',
  'shortInput',
]


const moduleConfig: Record<ContentModuleType, { label: string; description: string }> = {
  lessonMeta: {
    label: 'Lesson Meta',
    description: 'Titles, scenario framing, and top-level lesson copy.',
  },
  dialogue: {
    label: 'Dialogue',
    description: 'Conversation title and first learner-facing line.',
  },
  sentencePatterns: {
    label: 'Sentence Patterns',
    description: 'Pattern list used to reinforce the grammar target.',
  },
  vocabulary: {
    label: 'Vocabulary',
    description: 'Core words and support phrases for this lesson.',
  },
  pronunciation: {
    label: 'Pronunciation',
    description: 'Pronunciation coaching notes and drills.',
  },
  hanziRecognition: {
    label: 'Hanzi Recognition',
    description: 'Reading prompts and recognition checkpoints.',
  },
  practice: {
    label: 'Practice',
    description: 'Guided practice blocks and learner tasks.',
  },
  reviewCards: {
    label: 'Review Cards',
    description: 'Flashcard-style recap content for spaced review.',
  },
  shortInput: {
    label: 'Short Input',
    description: 'Short response prompts and compact learner inputs.',
  },
}

function getPendingModuleCopy(pendingModuleCount: number) {
  if (pendingModuleCount === 0) {
    return 'All modules published'
  }

  if (pendingModuleCount === 1) {
    return '1 module pending publish'
  }

  return `${pendingModuleCount} modules pending publish`
}

function getModuleSummary(snapshot: AdminLessonSnapshot, moduleType: ContentModuleType) {
  const draftLesson = snapshot.draftLesson

  if (!draftLesson) {
    return 'Draft content unavailable'
  }

  switch (moduleType) {
    case 'lessonMeta':
      return `EN title · ${getEnglishText(draftLesson.title)}`
    case 'dialogue':
      return `Preview line · ${draftLesson.dialogue.lines[0]?.hanzi ?? getEnglishText(draftLesson.dialogue.title)}`
    default: {
      const payload = draftLesson[moduleType]

      if (Array.isArray(payload)) {
        return `${payload.length} item${payload.length === 1 ? '' : 's'}`
      }

      if (payload && typeof payload === 'object') {
        const fieldCount = Object.keys(payload as object).length
        return `${fieldCount} field${fieldCount === 1 ? '' : 's'}`
      }

      return 'Ready to edit'
    }
  }
}

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
  const [selectedModuleType, setSelectedModuleType] = useState<ContentModuleType | null>(null)

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
    setSelectedModuleType(null)
  }, [lessonId])

  useEffect(() => {
    void loadSnapshot().catch(() => undefined)
  }, [loadSnapshot])

  const pendingModuleCount = useMemo(
    () => snapshot?.modules.filter((module) => module.hasUnpublishedChanges).length ?? 0,
    [snapshot],
  )

  const selectedModule = useMemo(
    () => (selectedModuleType ? moduleConfig[selectedModuleType] : null),
    [selectedModuleType],
  )

  const moduleSnapshots = useMemo(() => {
    return new Map(snapshot?.modules.map((module) => [module.moduleType, module]) ?? [])
  }, [snapshot])

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

  function renderSelectedModuleEditor() {
    if (!snapshot?.draftLesson || !selectedModuleType) {
      return null
    }

    const draftLesson = snapshot.draftLesson

    switch (selectedModuleType) {
      case 'lessonMeta':
        return (
          <LessonMetaEditor
            lesson={draftLesson}
            onSave={(payload) => handleSaveModule('lessonMeta', payload, 'Save lesson meta draft')}
          />
        )
      case 'dialogue':
        return (
          <DialogueEditor
            dialogue={draftLesson.dialogue}
            onSave={(payload) => handleSaveModule('dialogue', payload, 'Save dialogue draft')}
          />
        )
      default:
        return (
          <JsonModuleEditor
            label={moduleConfig[selectedModuleType].label}
            payload={draftLesson[selectedModuleType]}
            onSave={(payload) =>
              handleSaveModule(
                selectedModuleType,
                payload,
                `Save ${moduleConfig[selectedModuleType].label.toLowerCase()} draft`,
              )
            }
          />
        )
    }
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
            <p className="lede">
              Review the lesson module-by-module, enter one focused editor at a time, then publish
              intentionally.
            </p>
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
            <p>{getPendingModuleCopy(pendingModuleCount)}</p>
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
                <h2>Module directory</h2>
                <p className="muted-text">
                  Start from the overview, then open only the section you want to change.
                </p>
              </div>
              <span className="badge badge--sky">No business logic changes</span>
            </div>
          </section>

          <section
            className="surface-card lesson-section-card admin-module-directory-card"
            data-testid="admin-module-directory"
          >
            <div className="admin-section-heading">
              <div>
                <p className="eyebrow">Lesson outline</p>
                <h2>Choose a module to edit</h2>
                <p className="muted-text">
                  Keep the rest of the lesson collapsed while you work on one focused module.
                </p>
              </div>
              <span className={`badge ${selectedModule ? 'badge--gold' : 'badge--jade'}`}>
                {selectedModule ? `${selectedModule.label} selected` : 'Overview mode'}
              </span>
            </div>
            <div className="admin-module-directory-grid">
              {moduleOrder.map((moduleType) => {
                const module = moduleSnapshots.get(moduleType)
                const config = moduleConfig[moduleType]
                const isSelected = selectedModuleType === moduleType

                return (
                  <article
                    key={moduleType}
                    className={`admin-directory-module ${isSelected ? 'admin-directory-module--selected' : ''}`}
                  >
                    <div className="admin-directory-module__header">
                      <div>
                        <h3>{config.label}</h3>
                        <p className="muted-text">{config.description}</p>
                      </div>
                      <span
                        className={`badge ${module?.hasUnpublishedChanges ? 'badge--gold' : 'badge--jade'}`}
                      >
                        {module?.hasUnpublishedChanges ? 'Needs publish' : 'Published'}
                      </span>
                    </div>
                    <p className="admin-directory-module__summary">{getModuleSummary(snapshot, moduleType)}</p>
                    <div className="admin-directory-module__meta">
                      <span>Draft rev {module?.draftRevisionId ?? '—'}</span>
                      <span>Published rev {module?.publishedRevisionId ?? '—'}</span>
                    </div>
                    <button
                      type="button"
                      className={isSelected ? 'primary-button' : 'secondary-link'}
                      onClick={() => setSelectedModuleType(moduleType)}
                      aria-pressed={isSelected}
                    >
                      Edit {config.label.toLowerCase()}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          {selectedModule ? (
            <section className="surface-card lesson-section-card admin-module-focus-card">
              <div className="admin-section-heading">
                <div>
                  <p className="eyebrow">Active editor</p>
                  <h2>{selectedModule.label}</h2>
                  <p className="muted-text">
                    Only this module is expanded right now. Save here, then use the side rail to publish or
                    roll back when ready.
                  </p>
                </div>
                <button
                  type="button"
                  className="secondary-link"
                  onClick={() => setSelectedModuleType(null)}
                >
                  Back to overview
                </button>
              </div>
            </section>
          ) : (
            <section className="surface-card lesson-section-card admin-module-focus-card admin-module-focus-card--empty">
              <div className="admin-section-heading">
                <div>
                  <p className="eyebrow">Focused editing</p>
                  <h2>Select a module to begin</h2>
                  <p className="muted-text">
                    Choose lesson meta, dialogue, or any JSON module above to open a single focused editor.
                  </p>
                </div>
                <span className="badge badge--sky">One module at a time</span>
              </div>
            </section>
          )}

          {renderSelectedModuleEditor()}
        </section>

        <aside className="admin-editor-side-column" data-testid="admin-editor-side-column">
          <section className="surface-card lesson-section-card admin-workspace-card">
            <div className="admin-section-heading">
              <div>
                <p className="eyebrow">Preview & publish</p>
                <h2>Review before shipping</h2>
                <p className="muted-text">
                  Use this side rail to sanity-check the learner view, publish a module, or roll back safely.
                </p>
              </div>
              <span className="badge badge--gold">
                {selectedModule ? `${selectedModule.label} focus` : 'Review zone'}
              </span>
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
