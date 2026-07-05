import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { SpeechButton } from '../components/SpeechButton'
import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { completeLesson, loadProgress, saveProgress } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

export function ShortInputPage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
  const progress = loadProgress()
  const language = progress.selectedExplanationLanguage
  const copy = getUiCopy(language)
  const [finished, setFinished] = useState(
    Boolean(lesson && progress.lessonStepProgress[lesson.id]?.shortInputComplete),
  )

  useEffect(() => {
    if (!lesson) {
      return
    }

    const latestProgress = loadProgress()

    if (latestProgress.lastVisitedLesson === lesson.id) {
      return
    }

    saveProgress({
      ...latestProgress,
      lastVisitedLesson: lesson.id,
    })
  }, [lesson])

  if (!lesson) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.shortInputPage.notFoundEyebrow}</p>
          <h1>{copy.shortInputPage.notFoundHeading}</h1>
          <Link className="secondary-link" to="/home">
            {copy.lessonPage.backToHome}
          </Link>
        </section>
      </main>
    )
  }

  const currentLesson = lesson

  function handleFinish() {
    const latestProgress = loadProgress()
    const updatedProgress = completeLesson(currentLesson.id, latestProgress)

    saveProgress(updatedProgress)
    setFinished(true)
  }

  return (
    <main className="page-shell" style={{ placeItems: 'start center' }}>
      <section className="hero-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <p className="eyebrow">{copy.shortInputPage.eyebrow}</p>
          <h1>{getLocalizedText(currentLesson.title, language)}</h1>
          <p className="lede">{copy.shortInputPage.lede}</p>
        </header>

        <section>
          <h2>{copy.shortInputPage.shortItem}</h2>
          <p>{getLocalizedText(currentLesson.shortInput.prompt, language)}</p>
          <SpeechButton
            label={copy.shortInputPage.listenChinese}
            text={currentLesson.shortInput.target}
            audioSrc={currentLesson.shortInput.audio}
          />
          <p style={{ marginTop: '0.75rem', fontWeight: 700 }}>
            {copy.shortInputPage.targetAnswer}: {currentLesson.shortInput.target}
          </p>
          <ExplanationBlock explanation={currentLesson.shortInput.explanation} language={language} />
        </section>

        <section>
          <h2>{copy.shortInputPage.comprehensionPrompt}</h2>
          <p>{copy.shortInputPage.comprehensionQuestion}</p>
          <p style={{ margin: '0.5rem 0 0', color: '#334155' }}>
            {copy.shortInputPage.answerKey}: {currentLesson.shortInput.target}
          </p>
        </section>

        <div>
          <button type="button" className="primary-button" onClick={handleFinish}>
            {copy.shortInputPage.finishButton}
          </button>
          {finished ? (
            <p style={{ marginTop: '0.75rem', color: '#166534' }}>
              {copy.shortInputPage.finishedMessage}
            </p>
          ) : null}
        </div>

        <nav className="button-row" aria-label={copy.shortInputPage.shortInputActions}>
          <Link className="secondary-link" to={`/lesson/${currentLesson.id}/practice`}>
            {copy.shortInputPage.backToPractice}
          </Link>
          <Link className="secondary-link" to="/review">
            {copy.shortInputPage.goToReview}
          </Link>
          <Link className="secondary-link" to="/progress">
            {copy.shortInputPage.viewProgress}
          </Link>
        </nav>
      </section>
    </main>
  )
}
