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

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card hero-card--compact">
        <p className="eyebrow">Internal tools</p>
        <h1>Content Admin</h1>
        <p className="lede">Browse lessons, inspect draft state, and enter the edit / preview / publish flow.</p>
      </section>

      {lessons === null ? <p>Loading lessons…</p> : null}
      {requiresAuth ? <AdminAccessForm error={error} onSubmit={handleUnlock} /> : null}
      {error && !requiresAuth ? <p>{error}</p> : null}

      {!requiresAuth && lessons && lessons.length > 0 ? (
        <section className="page-grid">
          {lessons.map((lesson) => (
            <article key={lesson.lessonId} className="surface-card lesson-card">
              <p className="eyebrow">Lesson {lesson.displayOrder}</p>
              <h2>{lesson.lessonId}</h2>
              <p className="muted-text">Slug: {lesson.slug}</p>
              <p>
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
