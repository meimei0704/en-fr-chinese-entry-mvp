import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminApiError, clearAdminBasicAuth, listAdminLessons, saveAdminBasicAuth } from '../admin/api.js'
import type { AdminLessonSummary } from '../admin/types.js'
import { AdminAccessForm } from '../components/admin/AdminAccessForm.js'

export function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLessonSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requiresAuth, setRequiresAuth] = useState(false)

  async function loadLessons() {
    return listAdminLessons()
      .then((result) => {
        setLessons(result)
        setError(null)
        setRequiresAuth(false)
      })
      .catch((requestError: unknown) => {
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
        setLessons([])
      })
  }

  useEffect(() => {
    void loadLessons().catch(() => undefined)
  }, [])

  async function handleUnlock(username: string, password: string) {
    saveAdminBasicAuth(username, password)
    await loadLessons()
  }

  const totalLessons = lessons?.length ?? 0
  const totalPendingModules = lessons?.reduce((count, lesson) => count + lesson.draftChangedModuleCount, 0) ?? 0
  const readyLessons = lessons?.filter((lesson) => lesson.draftChangedModuleCount === 0).length ?? 0

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
          </div>
        </div>
        <div className="admin-metric-grid" data-testid="admin-overview-metrics">
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
        </div>
      </section>

      {lessons === null ? <p className="admin-inline-feedback">Loading lessons…</p> : null}
      {requiresAuth ? <AdminAccessForm error={error} onSubmit={handleUnlock} /> : null}
      {error && !requiresAuth ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : null}

      {!requiresAuth && lessons && lessons.length > 0 ? (
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
