import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { PracticeChallenge } from '../components/PracticeChallenge'
import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { loadProgress, markPracticeSection, saveProgress } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

export function PracticePage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31))
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
    <main className="page-shell" style={{ placeItems: 'start center' }}>
      <section className="hero-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <p className="eyebrow">{copy.practicePage.eyebrow}</p>
          <LessonTopicTitle as="h1" lessonId={lesson.id} language={selectedLanguage} />
          <p className="lede">{copy.practicePage.lede}</p>
        </header>

        <PracticeChallenge
          lesson={lesson}
          language={selectedLanguage}
          copy={copy.practiceChallenge}
          seed={seed}
          onComplete={() => {
            saveProgress(markPracticeSection(lesson.id, loadProgress()))
          }}
        />

        <nav className="button-row" aria-label={copy.practicePage.practiceActions}>
          <Link className="secondary-link" to={`/lesson/${lesson.id}/short-input`}>
            {copy.practicePage.continueToShortInput}
          </Link>
          <Link className="secondary-link" to={`/lesson/${lesson.id}`}>
            {copy.practicePage.backToLesson}
          </Link>
        </nav>
      </section>
    </main>
  )
}
