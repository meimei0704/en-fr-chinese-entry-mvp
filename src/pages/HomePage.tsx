import { Link } from 'react-router-dom'

import { LessonCard } from '../components/LessonCard'
import { getUiCopy } from '../content/copy'
import { course } from '../content/course'
import { getContinueLessonId, loadProgress } from '../lib/progress'

export function HomePage() {
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const continueLessonId = getContinueLessonId(progress)

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">{copy.homePage.eyebrow}</p>
        <h1>{copy.homePage.heading}</h1>
        <p className="lede">{copy.homePage.lede}</p>

        <div className="button-row">
          <Link
            className="secondary-link"
            to={continueLessonId ? `/lesson/${continueLessonId}` : '/'}
          >
            {copy.homePage.continueLearning}
          </Link>
          <Link className="secondary-link" to="/review">
            {copy.homePage.goToReview}
          </Link>
          <Link className="secondary-link" to="/progress">
            {copy.homePage.viewProgress}
          </Link>
        </div>
      </section>

      <section
        aria-label={copy.homePage.lessonListLabel}
        style={{ display: 'grid', gap: '1rem', width: 'min(100%, 38rem)' }}
      >
        {course.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} language={language} />
        ))}
      </section>
    </main>
  )
}
