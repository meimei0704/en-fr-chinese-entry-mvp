import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { PracticeChecklist } from '../components/PracticeChecklist'
import { course } from '../content/course'
import type { ExplanationLanguage, LessonContent, PracticePrompt } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

function PracticeCard({
  heading,
  prompt,
  answerLabel,
  answer,
  language,
}: {
  heading: string
  prompt: PracticePrompt
  answerLabel: string
  answer: string
  language: ExplanationLanguage
}) {
  return (
    <article
      style={{
        padding: '1rem',
        borderRadius: '1rem',
        background: '#f8fafc',
        border: '1px solid #dbeafe',
      }}
    >
      <h2>{heading}</h2>
      <p>{getLocalizedText(prompt.prompt, language)}</p>
      <p style={{ margin: '0.5rem 0 0', fontWeight: 700 }}>
        {answerLabel}: {answer}
      </p>
      <ExplanationBlock explanation={prompt.explanation} language={language} />
    </article>
  )
}

export function PracticePage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
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

  const listeningPrompt = lesson.practice.listening[0]
  const speakingPrompt = lesson.practice.speaking[0]
  const readingPrompt = lesson.practice.reading[0]

  return (
    <main className="page-shell" style={{ placeItems: 'start center' }}>
      <section className="hero-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <p className="eyebrow">{copy.practicePage.eyebrow}</p>
          <h1>{getLocalizedText(lesson.title, selectedLanguage)}</h1>
          <p className="lede">{copy.practicePage.lede}</p>
        </header>

        <section>
          <h2>{copy.practicePage.checklistHeading}</h2>
          <PracticeChecklist
            ariaLabel={copy.practicePage.checklistLabel}
            items={[
              { label: copy.practicePage.listeningReady, complete: Boolean(listeningPrompt) },
              { label: copy.practicePage.speakingReady, complete: Boolean(speakingPrompt) },
              { label: copy.practicePage.readingReady, complete: Boolean(readingPrompt) },
            ]}
          />
        </section>

        {listeningPrompt ? (
          <PracticeCard
            heading={copy.practicePage.listenAndChoose}
            prompt={listeningPrompt}
            answerLabel={copy.practicePage.answer}
            answer={listeningPrompt.target}
            language={selectedLanguage}
          />
        ) : null}

        {speakingPrompt ? (
          <article
            style={{
              padding: '1rem',
              borderRadius: '1rem',
              background: '#f8fafc',
              border: '1px solid #dbeafe',
            }}
          >
            <h2>{copy.practicePage.repeatAloud}</h2>
            <p>{getLocalizedText(speakingPrompt.prompt, selectedLanguage)}</p>
            <p style={{ margin: '0.5rem 0 0', fontWeight: 700 }}>
              {copy.practicePage.modelAnswer}: {speakingPrompt.target}
            </p>
            <p style={{ margin: '0.75rem 0 0' }}>{copy.practicePage.selfCheck}</p>
            <ExplanationBlock explanation={speakingPrompt.explanation} language={selectedLanguage} />
          </article>
        ) : null}

        {readingPrompt ? (
          <PracticeCard
            heading={copy.practicePage.matchHanzi}
            prompt={readingPrompt}
            answerLabel={copy.practicePage.readingGoal}
            answer={readingPrompt.target}
            language={selectedLanguage}
          />
        ) : null}

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
