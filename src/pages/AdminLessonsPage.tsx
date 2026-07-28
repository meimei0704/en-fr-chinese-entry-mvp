import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminApiError, listAdminLessons } from '../admin/api.js'
import type { AdminLessonSummary } from '../admin/types.js'

export function AdminLessonsPage() {
  const [lessons, setLessons] = useState<AdminLessonSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    listAdminLessons()
      .then((result) => {
        if (!cancelled) {
          setLessons(result)
          setError(null)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof AdminApiError ? requestError.message : 'Unable to load content admin lessons',
          )
          setLessons([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card hero-card--compact">
        <p className="eyebrow">Internal tools</p>
        <h1>Content Admin</h1>
        <p className="lede">Browse lessons, inspect draft state, and enter the edit / preview / publish flow.</p>
      </section>

      {lessons === null ? <p>Loading lessons…</p> : null}
      {error ? <p>{error}</p> : null}

      {lessons && lessons.length > 0 ? (
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
