import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminApiError, clearAdminBasicAuth, listAdminLessons, saveAdminBasicAuth } from '../admin/api.js'
import type { AdminLessonSummary } from '../admin/types.js'
import { AdminAccessScreen } from '../components/admin/AdminAccessScreen.js'

export function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLessonSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)

  async function loadLessons() {
    setIsLoading(true)

    try {
      const result = await listAdminLessons()
      setLessons(result)
      setError(null)
      setRequiresAuth(false)
    } catch (requestError: unknown) {
      if (requestError instanceof AdminApiError && requestError.status === 401) {
        clearAdminBasicAuth()
        setRequiresAuth(true)
        setError(requestError.message)
        setLessons([])
        return
      }

      setError(
        requestError instanceof AdminApiError ? requestError.message : 'Unable to load content admin lessons',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadLessons().catch(() => undefined)
  }, [])

  async function handleUnlock(username: string, password: string) {
    saveAdminBasicAuth(username, password)
    await loadLessons()
  }

  function handleSignOut() {
    clearAdminBasicAuth()
    setRequiresAuth(true)
    setError(null)
    setLessons([])
    setIsLoading(false)
  }

  if (requiresAuth) {
    return (
      <AdminAccessScreen
        heroTitle="Sign in to open content admin"
        heroDescription="Unlock the centered admin workspace to edit lessons, preview changes, and publish intentionally."
        formTitle="Admin sign in required"
        formDescription="Enter the content admin credentials to continue into the lesson management workspace."
        error={error}
        onSubmit={handleUnlock}
      />
    )
  }

  const totalLessons = lessons?.length ?? 0
  const totalPendingModules = lessons?.reduce((count, lesson) => count + lesson.draftChangedModuleCount, 0) ?? 0
  const readyLessons = lessons?.filter((lesson) => lesson.draftChangedModuleCount === 0).length ?? 0
  const hasLoadError = error !== null && !requiresAuth && !isLoading

  return (
    <main className="page-shell page-shell--wide admin-page-shell">
      <section className="hero-card admin-overview-card">
        <div className="admin-overview-card__header">
          <div>
            <p className="eyebrow">Internal tools</p>
            <h1>Content Admin</h1>
            <p className="lede">Browse lessons, inspect draft state, and enter the edit / preview / publish flow.</p>
          </div>
          <div className="admin-badge-column">
            <span className="badge badge--sky">Draft workflow</span>
            <span className="badge badge--jade">Published data stays read-only</span>
            <Link className="secondary-link" to="/admin/voice">
              Batch voice generation
            </Link>
            <button type="button" className="secondary-link" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="admin-metric-grid" data-testid="admin-overview-metrics">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <article key={`loading-metric-${index}`} className="admin-metric-card admin-loading-panel">
                <div className="admin-skeleton admin-skeleton--label" />
                <div className="admin-skeleton admin-skeleton--metric" />
                <div className="admin-skeleton admin-skeleton--line" />
              </article>
            ))
          ) : hasLoadError ? (
            <>
              <article className="admin-metric-card admin-metric-card--attention">
                <span>Lessons</span>
                <strong>Unavailable</strong>
                <p>Admin content could not be loaded from the database.</p>
              </article>
              <article className="admin-metric-card">
                <span>Draft state</span>
                <strong>Unknown</strong>
                <p>Your lessons were not cleared; the request failed before data could load.</p>
              </article>
              <article className="admin-metric-card">
                <span>Next step</span>
                <strong>Retry</strong>
                <p>Try again after the database connection recovers.</p>
              </article>
            </>
          ) : (
            <>
              <article className="admin-metric-card">
                <span>Lessons</span>
                <strong>{totalLessons}</strong>
                <p>{totalLessons === 1 ? '1 lesson ready for editing' : `${totalLessons} lessons in the workspace`}</p>
              </article>
              <article className="admin-metric-card admin-metric-card--attention">
                <span>Pending modules</span>
                <strong>{totalPendingModules}</strong>
                <p>{totalPendingModules === 1 ? '1 pending module' : `${totalPendingModules} pending modules`}</p>
              </article>
              <article className="admin-metric-card">
                <span>Published in sync</span>
                <strong>{readyLessons}</strong>
                <p>{readyLessons === 1 ? '1 lesson has no draft delta' : `${readyLessons} lessons have no draft delta`}</p>
              </article>
            </>
          )}
        </div>
      </section>

      {isLoading ? (
        <section
          className="page-grid admin-lessons-grid admin-loading-shell-grid"
          data-testid="admin-lessons-loading-shell"
          aria-busy="true"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={`loading-lesson-${index}`} className="surface-card lesson-card admin-lesson-card admin-loading-panel">
              <div className="admin-loading-stack">
                <div className="admin-skeleton admin-skeleton--label" />
                <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
                <div className="admin-skeleton admin-skeleton--line" />
                <div className="admin-skeleton admin-skeleton--button" />
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {hasLoadError ? (
        <section className="surface-card lesson-section-card admin-history-card admin-load-error-card" role="alert" aria-live="polite">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Load failed</p>
              <h2>Unable to load course content</h2>
              <p className="muted-text">
                The database connection may be temporarily unavailable. Your lessons were not cleared; the admin request
                failed before lesson data could load.
              </p>
            </div>
            <span className="badge badge--gold">DB connection</span>
          </div>
          <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p>
          <div className="admin-card-actions">
            <span className="muted-text">Retry after the MySQL connection recovers.</span>
            <button type="button" className="primary-button" onClick={() => void loadLessons()} disabled={isLoading}>
              Retry loading lessons
            </button>
          </div>
        </section>
      ) : null}

      {!requiresAuth && !hasLoadError && lessons.length > 0 ? (
        <section className="page-grid admin-lessons-grid" data-testid="admin-lessons-grid">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Editing queue</p>
              <h2>Choose a lesson to edit</h2>
            </div>
            <p className="muted-text">Draft changes stay scoped per module until you explicitly publish them.</p>
          </div>
          {lessons.map((lesson) => (
            <article key={lesson.lessonId} className="surface-card lesson-card admin-lesson-card">
              <div className="admin-lesson-card__topline">
                <p className="eyebrow">Lesson {lesson.displayOrder}</p>
                <span className={`badge ${lesson.draftChangedModuleCount > 0 ? 'badge--gold' : 'badge--jade'}`}>
                  {lesson.draftChangedModuleCount > 0 ? 'Needs publish' : 'Published'}
                </span>
              </div>
              <div className="admin-lesson-card__title-row">
                <h2>{lesson.lessonId}</h2>
                <p className="muted-text">Slug: {lesson.slug}</p>
              </div>
              <p className="admin-lesson-card__status">
                {lesson.draftChangedModuleCount > 0
                  ? `${lesson.draftChangedModuleCount} module pending publish`
                  : 'All modules published'}
              </p>
              <Link className="primary-button" to={`/admin/lesson/${lesson.lessonId}`}>
                Open {lesson.lessonId} editor
              </Link>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  )
}
