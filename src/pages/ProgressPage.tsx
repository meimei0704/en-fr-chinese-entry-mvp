import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { course } from '../content/course'
import { loadProgress } from '../lib/progress'

export function ProgressPage() {
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === progress.lastVisitedLesson,
  )

  return (
    <main className="page-shell">
      <section className="hero-card hero-card--compact">
        <p className="eyebrow">{copy.progressPage.eyebrow}</p>
        <h1>{copy.progressPage.heading}</h1>
        <p className="lede">
          {copy.progressPage.completedSummary(
            progress.completedLessons.length,
            course.lessons.length,
          )}
        </p>

        <section style={{ marginTop: '1.5rem' }}>
          <h2>{copy.progressPage.currentLesson}</h2>
          <p>
            {currentLesson
              ? getLocalizedText(currentLesson.title, language)
              : copy.progressPage.notStartedYet}
          </p>
        </section>

        <section style={{ marginTop: '1.5rem' }}>
          <h2>{copy.progressPage.reviewQueue}</h2>
          <p>{copy.progressPage.reviewItemsWaiting(progress.reviewQueue.length)}</p>
        </section>

        <div className="button-row">
          <Link className="secondary-link" to="/home">
            {copy.progressPage.backToHome}
          </Link>
          <Link className="secondary-link" to="/review">
            {copy.progressPage.goToReview}
          </Link>
        </div>
      </section>
    </main>
  )
}
