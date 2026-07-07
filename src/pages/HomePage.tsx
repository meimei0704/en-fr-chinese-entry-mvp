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
  const learningChips =
    language === 'fr'
      ? ['Guidage anglais/français', 'Situations réelles', 'Écouter & répéter']
      : ['English/French explanations', 'Real situations', 'Listen & repeat']

  return (
    <main className="page-shell">
      <section className="hero-card home-hero">
        <div className="home-hero__content">
          <p className="eyebrow">{copy.homePage.eyebrow}</p>
          <h1>{copy.homePage.heading}</h1>
          <p className="lede">{copy.homePage.lede}</p>

          <div className="learning-chip-row" aria-label="Learning highlights">
            {learningChips.map((chip) => (
              <span key={chip} className="badge badge--gold">
                {chip}
              </span>
            ))}
          </div>

          <div className="button-row">
            <Link
              className="primary-button"
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
        </div>

        <aside className="home-hero__phrase" aria-label="Hero phrase">
          <span className="badge badge--jade">{copy.homePage.lessonEyebrow}</span>
          <p className="hanzi-display">你好</p>
          <p className="pinyin-line">nǐ hǎo</p>
          <div className="home-hero__stats" aria-label="Course progress summary">
            <span>{course.lessons.length} lessons</span>
            <span>{progress.completedLessons.length} complete</span>
            <span>{progress.reviewQueue.length} review</span>
          </div>
        </aside>
      </section>

      <section aria-label={copy.homePage.lessonListLabel} className="page-grid lesson-grid">
        <div className="section-heading">
          <p className="eyebrow">{copy.homePage.lessonEyebrow}</p>
          <h2>{copy.homePage.lessonListLabel}</h2>
        </div>

        {course.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} language={language} />
        ))}
      </section>
    </main>
  )
}
