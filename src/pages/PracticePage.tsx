import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { PracticeChallenge } from '../components/PracticeChallenge'
import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { loadProgress, markPracticeSection, saveProgress, completeLesson } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

export function PracticePage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31))
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)

  useEffect(() => {
    if (!lesson) {
      return
    }

    const progress = loadProgress()

    if (progress.lastVisitedLesson === lesson.id) {
      return
    }

    saveProgress({
      ...progress,
      lastVisitedLesson: lesson.id,
    })
  }, [lesson])

  if (!lesson) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.practicePage.notFoundEyebrow}</p>
          <h1>{copy.practicePage.notFoundHeading}</h1>
          <Link className="secondary-link" to="/home">
            {copy.lessonPage.backToHome}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell page-shell--wide practice-page">
      <section className="hero-card lesson-header-card practice-page__header">
        <header className="lesson-header-card__title">
          <p className="eyebrow">{copy.practicePage.eyebrow}</p>
          <LessonTopicTitle as="h1" lessonId={lesson.id} language={selectedLanguage} />
          <p className="lede">{copy.practicePage.lede}</p>
        </header>
      </section>

      <section className="page-grid practice-page__body">
        <PracticeChallenge
          lesson={lesson}
          language={selectedLanguage}
          copy={copy.practiceChallenge}
          seed={seed}
          onComplete={() => {
            saveProgress(markPracticeSection(lesson.id, loadProgress()))
          }}
          onCompleteLesson={() => {
            saveProgress(completeLesson(lesson.id, loadProgress()))
          }}
          onLessonCompletedChange={setLessonCompleted}
        />

        <nav className="button-row" aria-label={copy.practicePage.practiceActions}>
          {lessonCompleted ? (
            <>
              <Link className="secondary-link" to="/review">
                {copy.practicePage.goToReview}
              </Link>
              <Link className="secondary-link" to="/progress">
                {copy.practicePage.viewProgress}
              </Link>
            </>
          ) : null}
          <Link className="secondary-link" to={`/lesson/${lesson.id}`}>
            {copy.practicePage.backToLesson}
          </Link>
        </nav>
      </section>
    </main>
  )
}
