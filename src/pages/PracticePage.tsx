import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { ContentLoading } from '../components/ContentState'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { PracticeChallenge } from '../components/PracticeChallenge'
import type { LessonContent } from '../content/types'
import { fetchLesson } from '../lib/contentApi'
import { buildPracticeChallenge } from '../lib/practiceChallenge'
import { loadProgress, markPracticeSection, saveProgress, completeLesson } from '../lib/progress'
import { useCourse } from '../lib/contentProvider'

function findLesson(course: ReturnType<typeof useCourse>['course'], lessonId?: string): LessonContent | undefined {
  return course?.lessons.find((lesson) => lesson.id === lessonId)
}

export function PracticePage() {
  const { lessonId } = useParams()
  const { course, error, reload } = useCourse()
  const [fallbackLesson, setFallbackLesson] = useState<LessonContent | undefined>(undefined)
  const lesson = fallbackLesson ?? findLesson(course, lessonId)
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31))
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)

  const buildChallenge = useCallback(
    (nextSeed: number) =>
      lesson
        ? buildPracticeChallenge(lesson, selectedLanguage, 5, nextSeed)
        : { questions: [], maxScore: 0 },
    [lesson, selectedLanguage],
  )

  useEffect(() => {
    if (!lessonId) {
      return
    }

    if (course && findLesson(course, lessonId)) {
      return
    }

    let active = true
    fetchLesson(lessonId)
      .then((fetchedLesson) => {
        if (active) {
          setFallbackLesson(fetchedLesson)
        }
      })
      .catch(() => {
        if (active) {
          setFallbackLesson(undefined)
        }
      })
    return () => {
      active = false
    }
  }, [course, lessonId])

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

  if (error) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.contentState.errorEyebrow}</p>
          <h1>{copy.contentState.errorHeading}</h1>
          <button type="button" className="primary-button" onClick={reload}>
            {copy.contentState.retry}
          </button>
        </section>
      </main>
    )
  }

  if (!course && !fallbackLesson) {
    return <ContentLoading />
  }

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
        </header>
      </section>

      <section className="page-grid practice-page__body">
        <PracticeChallenge
          buildChallenge={buildChallenge}
          language={selectedLanguage}
          copy={copy.practiceChallenge}
          seed={seed}
          onComplete={() => {
            saveProgress(markPracticeSection(lesson.id, loadProgress()))
          }}
          onCompleteLesson={() => {
            if (course) {
              saveProgress(completeLesson(course, lesson.id, loadProgress()))
            }
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
