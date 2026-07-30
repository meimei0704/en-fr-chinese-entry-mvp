import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Link, useBeforeUnload, useParams } from 'react-router-dom'

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
import { AdminAccessScreen } from '../components/admin/AdminAccessScreen.js'
import { DialogueEditor } from '../components/admin/DialogueEditor.js'
import { LessonMetaEditor } from '../components/admin/LessonMetaEditor.js'
import { ModuleHistoryList } from '../components/admin/ModuleHistoryList.js'
import {
  PracticeModuleEditor,
  ShortInputModuleEditor,
  StructuredListModuleEditor,
} from '../components/admin/StructuredContentEditors.js'
import {
  hanziRecognitionFields,
  pronunciationFields,
  reviewCardFields,
  sentencePatternFields,
  vocabularyFields,
} from '../components/admin/structuredEditorConfigs.js'
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

const structuredModuleCopy: Partial<
  Record<
    ContentModuleType,
    {
      itemLabel: string
      badgeLabel: string
      description: string
    }
  >
> = {
  sentencePatterns: {
    itemLabel: 'Pattern',
    badgeLabel: 'Pattern cards',
    description: 'Edit each sentence pattern as a content card with meaning, example, audio, and explanation fields.',
  },
  vocabulary: {
    itemLabel: 'Vocabulary item',
    badgeLabel: 'Vocabulary cards',
    description: 'Edit each vocabulary item as readable content fields instead of a raw JSON blob.',
  },
  pronunciation: {
    itemLabel: 'Pronunciation tip',
    badgeLabel: 'Tip cards',
    description: 'Keep pronunciation guidance structured by focus, audio text, tip, and explanation.',
  },
  hanziRecognition: {
    itemLabel: 'Recognition item',
    badgeLabel: 'Recognition cards',
    description: 'Edit each hanzi recognition block with clear fields for hanzi, pinyin, meaning, and explanation.',
  },
  reviewCards: {
    itemLabel: 'Review card',
    badgeLabel: 'Flashcard stack',
    description: 'Manage each review card as front/back content with a learner-facing explanation.',
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

function getModuleLabel(moduleType: string) {
  return moduleConfig[moduleType as ContentModuleType]?.label ?? moduleType
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
  const [actionFeedback, setActionFeedback] = useState<{
    kind: 'info' | 'success'
    message: string
  } | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [selectedModuleType, setSelectedModuleType] = useState<ContentModuleType | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const loadSnapshot = useCallback(async () => {
    return getAdminLessonSnapshot(lessonId)
      .then((result) => {
        setSnapshot(result)
        setError(null)
        setActionError(null)
        setActionFeedback(null)
        setRequiresAuth(false)
        setHasUnsavedChanges(false)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof AdminApiError && requestError.status === 401) {
          clearAdminBasicAuth()
          setRequiresAuth(true)
          setError(requestError.message)
          setSnapshot(null)
          setActionFeedback(null)
          setHasUnsavedChanges(false)
          return
        }

        setError(
          requestError instanceof AdminApiError ? requestError.message : 'Unable to load lesson editor',
        )
        setSnapshot(null)
        setActionFeedback(null)
        setHasUnsavedChanges(false)
      })
  }, [lessonId])

  useEffect(() => {
    setSelectedModuleType(null)
    setHasUnsavedChanges(false)
  }, [lessonId])

  useEffect(() => {
    void loadSnapshot().catch(() => undefined)
  }, [loadSnapshot])

  const pendingModuleCount = useMemo(
    () => snapshot?.modules.filter((module) => module.hasUnpublishedChanges).length ?? 0,
    [snapshot],
  )

  const selectedModule = useMemo(() => (selectedModuleType ? moduleConfig[selectedModuleType] : null), [selectedModuleType])

  const moduleSnapshots = useMemo(() => {
    return new Map(snapshot?.modules.map((module) => [module.moduleType, module]) ?? [])
  }, [snapshot])

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!hasUnsavedChanges) {
          return
        }

        event.preventDefault()
        event.returnValue = ''
      },
      [hasUnsavedChanges],
    ),
    { capture: true },
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
      setActionFeedback(null)
      setHasUnsavedChanges(false)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError ? requestError.message : `Unable to save ${moduleType} draft`,
      )
    }
  }

  async function handlePublishModule(moduleType: string) {
    const moduleLabel = getModuleLabel(moduleType)
    const confirmed = window.confirm(
      `Publish ${moduleLabel} now? This will make the current draft live for learners.`,
    )

    if (!confirmed) {
      return
    }

    setPendingHistoryAction({ moduleType, kind: 'publish' })
    setActionError(null)
    setActionFeedback({ kind: 'info', message: `Publishing ${moduleLabel.toLowerCase()}…` })

    try {
      const nextSnapshot = await publishAdminModule({
        lessonId,
        moduleType,
        note: `Publish ${moduleType} draft`,
      })
      setSnapshot(nextSnapshot)
      setError(null)
      setActionError(null)
      setActionFeedback({ kind: 'success', message: `${moduleLabel} published successfully.` })
      setHasUnsavedChanges(false)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError
          ? `Failed to publish ${moduleLabel}. ${requestError.message}`
          : `Failed to publish ${moduleLabel}. Unable to publish ${moduleType}`,
      )
      setActionFeedback(null)
    } finally {
      setPendingHistoryAction(null)
    }
  }

  async function handleRollbackModule(moduleType: string, publishedRevisionId: number) {
    const moduleLabel = getModuleLabel(moduleType)
    const confirmed = window.confirm(
      `Rollback ${moduleLabel} to revision ${publishedRevisionId}? This will replace the currently published version for learners.`,
    )

    if (!confirmed) {
      return
    }

    setPendingHistoryAction({ moduleType, kind: 'rollback', revisionId: publishedRevisionId })
    setActionError(null)
    setActionFeedback({
      kind: 'info',
      message: `Rolling back ${moduleLabel.toLowerCase()} to revision ${publishedRevisionId}…`,
    })

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
      setActionFeedback({
        kind: 'success',
        message: `${moduleLabel} rolled back to revision ${publishedRevisionId} successfully.`,
      })
      setHasUnsavedChanges(false)
    } catch (requestError: unknown) {
      setActionError(
        requestError instanceof AdminApiError
          ? `Failed to roll back ${moduleLabel} to revision ${publishedRevisionId}. ${requestError.message}`
          : `Failed to roll back ${moduleLabel} to revision ${publishedRevisionId}.`,
      )
      setActionFeedback(null)
    } finally {
      setPendingHistoryAction(null)
    }
  }

  async function handleUnlock(username: string, password: string) {
    saveAdminBasicAuth(username, password)
    await loadSnapshot()
  }

  function confirmDiscardUnsavedChanges() {
    if (!hasUnsavedChanges) {
      return true
    }

    return window.confirm('You have unsaved changes in the current admin editor. Discard them and continue?')
  }

  function handleSelectModule(moduleType: ContentModuleType) {
    if (moduleType === selectedModuleType) {
      return
    }

    if (!confirmDiscardUnsavedChanges()) {
      return
    }

    setSelectedModuleType(moduleType)
    setHasUnsavedChanges(false)
  }

  function handleCollapseModule() {
    if (!confirmDiscardUnsavedChanges()) {
      return
    }

    setSelectedModuleType(null)
    setHasUnsavedChanges(false)
  }

  function handleBackToAdmin(event: MouseEvent<HTMLAnchorElement>) {
    if (confirmDiscardUnsavedChanges()) {
      return
    }

    event.preventDefault()
  }

  function handleSignOut() {
    if (!confirmDiscardUnsavedChanges()) {
      return
    }

    clearAdminBasicAuth()
    setRequiresAuth(true)
    setSnapshot(null)
    setError(null)
    setActionError(null)
    setActionFeedback(null)
    setSelectedModuleType(null)
    setHasUnsavedChanges(false)
  }

  function renderModuleEditor(moduleType: ContentModuleType) {
    if (!snapshot?.draftLesson) {
      return null
    }

    const draftLesson = snapshot.draftLesson

    switch (moduleType) {
      case 'lessonMeta':
        return (
          <LessonMetaEditor
            lesson={draftLesson}
            onSave={(payload) => handleSaveModule('lessonMeta', payload, 'Save lesson meta draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'dialogue':
        return (
          <DialogueEditor
            dialogue={draftLesson.dialogue}
            onSave={(payload) => handleSaveModule('dialogue', payload, 'Save dialogue draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'sentencePatterns':
        return (
          <StructuredListModuleEditor
            moduleKey="sentencePatterns"
            label="Sentence Patterns"
            description={structuredModuleCopy.sentencePatterns?.description ?? ''}
            itemLabel={structuredModuleCopy.sentencePatterns?.itemLabel ?? 'Item'}
            badgeLabel={structuredModuleCopy.sentencePatterns?.badgeLabel ?? 'Structured content'}
            saveLabel="Save sentence patterns draft"
            items={draftLesson.sentencePatterns}
            fields={sentencePatternFields}
            onSave={(payload) => handleSaveModule('sentencePatterns', payload, 'Save sentence patterns draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'vocabulary':
        return (
          <StructuredListModuleEditor
            moduleKey="vocabulary"
            label="Vocabulary"
            description={structuredModuleCopy.vocabulary?.description ?? ''}
            itemLabel={structuredModuleCopy.vocabulary?.itemLabel ?? 'Item'}
            badgeLabel={structuredModuleCopy.vocabulary?.badgeLabel ?? 'Structured content'}
            saveLabel="Save vocabulary draft"
            items={draftLesson.vocabulary}
            fields={vocabularyFields}
            onSave={(payload) => handleSaveModule('vocabulary', payload, 'Save vocabulary draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'pronunciation':
        return (
          <StructuredListModuleEditor
            moduleKey="pronunciation"
            label="Pronunciation"
            description={structuredModuleCopy.pronunciation?.description ?? ''}
            itemLabel={structuredModuleCopy.pronunciation?.itemLabel ?? 'Item'}
            badgeLabel={structuredModuleCopy.pronunciation?.badgeLabel ?? 'Structured content'}
            saveLabel="Save pronunciation draft"
            items={draftLesson.pronunciation}
            fields={pronunciationFields}
            onSave={(payload) => handleSaveModule('pronunciation', payload, 'Save pronunciation draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'hanziRecognition':
        return (
          <StructuredListModuleEditor
            moduleKey="hanziRecognition"
            label="Hanzi Recognition"
            description={structuredModuleCopy.hanziRecognition?.description ?? ''}
            itemLabel={structuredModuleCopy.hanziRecognition?.itemLabel ?? 'Item'}
            badgeLabel={structuredModuleCopy.hanziRecognition?.badgeLabel ?? 'Structured content'}
            saveLabel="Save hanzi recognition draft"
            items={draftLesson.hanziRecognition}
            fields={hanziRecognitionFields}
            onSave={(payload) => handleSaveModule('hanziRecognition', payload, 'Save hanzi recognition draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'practice':
        return (
          <PracticeModuleEditor
            practice={draftLesson.practice}
            onSave={(payload) => handleSaveModule('practice', payload, 'Save practice draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'reviewCards':
        return (
          <StructuredListModuleEditor
            moduleKey="reviewCards"
            label="Review Cards"
            description={structuredModuleCopy.reviewCards?.description ?? ''}
            itemLabel={structuredModuleCopy.reviewCards?.itemLabel ?? 'Item'}
            badgeLabel={structuredModuleCopy.reviewCards?.badgeLabel ?? 'Structured content'}
            saveLabel="Save review cards draft"
            items={draftLesson.reviewCards}
            fields={reviewCardFields}
            onSave={(payload) => handleSaveModule('reviewCards', payload, 'Save review cards draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      case 'shortInput':
        return (
          <ShortInputModuleEditor
            prompt={draftLesson.shortInput}
            onSave={(payload) => handleSaveModule('shortInput', payload, 'Save short input draft')}
            onDirtyChange={setHasUnsavedChanges}
          />
        )
      default:
        return null
    }
  }

  if (requiresAuth) {
    return (
      <AdminAccessScreen
        heroTitle="Sign in to open the lesson editor"
        heroDescription="Unlock this lesson workspace to edit content inline, preview changes, and publish modules intentionally."
        formTitle="Admin sign in required"
        formDescription="Enter the content admin credentials to continue into this lesson editor."
        error={error}
        backHref="/admin"
        backLabel="Back to admin lesson list"
        onSubmit={handleUnlock}
      />
    )
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
      <main className="page-shell page-shell--wide admin-page-shell" data-testid="admin-editor-loading-shell">
        <section className="hero-card lesson-header-card admin-editor-hero admin-loading-card" aria-busy="true">
          <p className="eyebrow">Content Admin</p>
          <div className="admin-loading-heading">
            <div className="admin-skeleton admin-skeleton--title" />
            <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
          </div>
          <div className="admin-editor-hero__summary">
            <article className="admin-metric-card admin-loading-panel">
              <div className="admin-skeleton admin-skeleton--label" />
              <div className="admin-skeleton admin-skeleton--metric" />
              <div className="admin-skeleton admin-skeleton--line" />
            </article>
            <article className="admin-metric-card admin-metric-card--attention admin-loading-panel">
              <div className="admin-skeleton admin-skeleton--label" />
              <div className="admin-skeleton admin-skeleton--metric" />
              <div className="admin-skeleton admin-skeleton--line" />
            </article>
          </div>
        </section>

        <div className="admin-editor-layout">
          <section className="admin-editor-main-column">
            <section className="surface-card lesson-section-card admin-module-directory-card admin-loading-card">
              <div className="admin-loading-shell-grid">
                {Array.from({ length: 4 }).map((_, index) => (
                  <article key={`loading-module-${index}`} className="admin-directory-module admin-loading-panel">
                    <div className="admin-loading-stack">
                      <div className="admin-skeleton admin-skeleton--label" />
                      <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
                      <div className="admin-skeleton admin-skeleton--line" />
                      <div className="admin-skeleton admin-skeleton--button" />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="admin-editor-side-column">
            <section className="surface-card lesson-section-card admin-preview-card admin-loading-panel">
              <div className="admin-loading-stack">
                <div className="admin-skeleton admin-skeleton--label" />
                <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
                <div className="admin-skeleton admin-skeleton--line" />
                <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-short" />
              </div>
            </section>
            <section className="surface-card lesson-section-card admin-history-card admin-loading-panel">
              <div className="admin-loading-stack">
                <div className="admin-skeleton admin-skeleton--label" />
                <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
                <div className="admin-skeleton admin-skeleton--line" />
                <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-short" />
              </div>
            </section>
          </aside>
        </div>
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
          <Link className="secondary-link" to="/admin" onClick={handleBackToAdmin}>
            Back to admin lesson list
          </Link>
          <button type="button" className="secondary-link" onClick={handleSignOut}>
            Sign out
          </button>
        </nav>
        {hasUnsavedChanges ? (
          <p className="admin-inline-feedback admin-inline-feedback--error">
            You have unsaved changes in the open module. Save the draft or confirm before leaving this editor.
          </p>
        ) : null}
        {actionFeedback ? (
          <p
            className={`admin-inline-feedback ${
              actionFeedback.kind === 'success' ? 'admin-inline-feedback--success' : ''
            }`}
          >
            {actionFeedback.message}
          </p>
        ) : null}
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
                    data-testid={`admin-module-card-${moduleType}`}
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
                      onClick={() => handleSelectModule(moduleType)}
                      aria-pressed={isSelected}
                    >
                      Edit {config.label.toLowerCase()}
                    </button>
                    {isSelected ? (
                      <div className="admin-directory-module__editor">
                        <div className="admin-directory-module__editor-header">
                          <div>
                            <p className="eyebrow">Inline editor</p>
                            <h4>Editing {config.label}</h4>
                            <p className="muted-text">
                              Save here, then use the side rail to publish or roll back when ready.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="secondary-link"
                            onClick={handleCollapseModule}
                          >
                            Collapse
                          </button>
                        </div>
                        {renderModuleEditor(moduleType)}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>

          {!selectedModule ? (
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
          ) : null}
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
