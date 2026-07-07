import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { course } from '../content/course'
import type { LessonId } from '../content/types'
import { loadProgress } from '../lib/progress'

export function ProgressPage() {
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === progress.lastVisitedLesson,
  )
  const completedLessonsCount = progress.completedLessons.length
  const totalLessons = course.lessons.length
  const completionPercent = totalLessons === 0
    ? 0
    : Math.round((completedLessonsCount / totalLessons) * 100)
  const currentLessonTitle = currentLesson
    ? getLocalizedText(currentLesson.title, language)
    : copy.progressPage.notStartedYet

  function getLessonStatus(lessonId: LessonId) {
    if (progress.completedLessons.includes(lessonId)) {
      return copy.progressPage.lessonStatusComplete
    }

    if (progress.lastVisitedLesson === lessonId) {
      return copy.progressPage.lessonStatusCurrent
    }

    return copy.progressPage.lessonStatusUpcoming
  }

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card progress-page-card">
        <header className="progress-hero__header">
          <div>
            <p className="eyebrow">{copy.progressPage.eyebrow}</p>
            <h1>{copy.progressPage.heading}</h1>
            <p className="lede">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </p>
          </div>
          <div className="progress-hero__seal" aria-hidden="true">
            进
          </div>
        </header>

        <section
          className="surface-card progress-summary-card"
          aria-label={copy.progressPage.summaryLabel}
        >
          <div>
            <p className="eyebrow">{copy.progressPage.nextStepEyebrow}</p>
            <h2>{copy.progressPage.currentLesson}</h2>
            <p className="progress-current-lesson">{currentLessonTitle}</p>
            <p className="muted-text">
              {copy.progressPage.reviewItemsWaiting(progress.reviewQueue.length)}
            </p>
          </div>

          <nav className="button-row" aria-label={copy.progressPage.progressActionsLabel}>
            <Link className="primary-button" to="/home">
              {copy.progressPage.backToHome}
            </Link>
            <Link className="secondary-link" to="/review">
              {copy.progressPage.goToReview}
            </Link>
          </nav>
        </section>

        <section
          className="progress-stats-grid"
          aria-label={copy.progressPage.statsLabel}
        >
          <article className="stat-card">
            <p className="stat-card__label">{copy.progressPage.completedLessonsLabel}</p>
            <p className="stat-card__value">
              {completedLessonsCount}/{totalLessons}
            </p>
            <p className="stat-card__meta">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </p>
          </article>

          <article className="stat-card">
            <p className="stat-card__label">{copy.progressPage.reviewQueue}</p>
            <p className="stat-card__value">{progress.reviewQueue.length}</p>
            <p className="stat-card__meta">
              {copy.progressPage.reviewItemsWaiting(progress.reviewQueue.length)}
            </p>
          </article>

          <article className="stat-card stat-card--accent">
            <p className="stat-card__label">{copy.progressPage.masteryLabel}</p>
            <p className="stat-card__value">{completionPercent}%</p>
            <div
              className="progress-bar"
              aria-hidden="true"
            >
              <span
                className="progress-bar__fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </article>
        </section>

        <section
          className="surface-card progress-list-card"
          aria-label={copy.progressPage.lessonProgressLabel}
        >
          <div className="progress-list-card__header">
            <div>
              <p className="eyebrow">{copy.progressPage.lessonProgressEyebrow}</p>
              <h2>{copy.progressPage.lessonProgressLabel}</h2>
            </div>
            <span className="badge badge--sky">
              {copy.progressPage.completedSummary(completedLessonsCount, totalLessons)}
            </span>
          </div>

          <div className="progress-lesson-list">
            {course.lessons.map((lesson, index) => (
              <article key={lesson.id} className="progress-lesson-row">
                <span className="progress-lesson-row__index" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{getLocalizedText(lesson.title, language)}</h3>
                  <p className="muted-text">
                    {getLocalizedText(lesson.scenario, language)}
                  </p>
                </div>
                <span className="badge badge--jade">{getLessonStatus(lesson.id)}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
