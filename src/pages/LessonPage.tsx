import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { DialoguePlayer } from '../components/DialoguePlayer'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { LanguageToggle } from '../components/LanguageToggle'
import { course } from '../content/course'
import type { ExplanationLanguage, LessonContent } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

export function LessonPage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
  const [selectedLanguage, setSelectedLanguage] = useState<ExplanationLanguage>(
    () => loadProgress().selectedExplanationLanguage,
  )
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

  function handleSelectLanguage(language: ExplanationLanguage) {
    setSelectedLanguage(language)
    saveProgress({
      ...loadProgress(),
      selectedExplanationLanguage: language,
    })
  }

  if (!lesson) {
    return (
      <main className="page-shell">
        <section className="hero-card hero-card--compact">
          <p className="eyebrow">{copy.lessonPage.notFoundEyebrow}</p>
          <h1>{copy.lessonPage.notFoundHeading}</h1>
          <Link className="secondary-link" to="/home">
            {copy.lessonPage.backToHome}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell page-shell--wide">
      <section className="hero-card lesson-header-card">
        <header className="lesson-header-card__title">
          <p className="eyebrow">{copy.lessonPage.eyebrow}</p>
          <h1>{getLocalizedText(lesson.title, selectedLanguage)}</h1>
          <p className="lede">{getLocalizedText(lesson.dialogue.title, selectedLanguage)}</p>
        </header>

        <section
          className="surface-card lesson-overview-card"
          aria-label={copy.lessonPage.lessonOverviewLabel}
        >
          <div>
            <h2>{copy.lessonPage.scenarioGoal}</h2>
            <p className="muted-text">{getLocalizedText(lesson.scenario, selectedLanguage)}</p>
          </div>
          <LanguageToggle
            selectedLanguage={selectedLanguage}
            onSelect={handleSelectLanguage}
            ariaLabel={copy.languageToggleLabel}
          />
          <p className="explanation-block">{copy.lessonPage.sectionSummary}</p>
        </section>

        <div className="section-stack">
          <section
            className="surface-card lesson-section-card"
            aria-label={copy.lessonPage.dialoguePracticeLabel}
          >
            <h2>{copy.lessonPage.dialogue}</h2>
            <DialoguePlayer lines={lesson.dialogue.lines} language={selectedLanguage} />
          </section>

          <section className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.sentencePatterns}</h2>
            <div className="card-grid">
              {lesson.sentencePatterns.map((pattern) => (
                <article key={pattern.id} className="study-item study-item--pattern">
                  <p className="study-item__title">{pattern.pattern}</p>
                  <p className="muted-text">{getLocalizedText(pattern.meaning, selectedLanguage)}</p>
                  <p className="pinyin-line">{pattern.example}</p>
                  <ExplanationBlock explanation={pattern.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>

          <section className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.vocabulary}</h2>
            <div className="card-grid card-grid--compact">
              {lesson.vocabulary.map((item) => (
                <article key={item.id} className="study-item">
                  <p className="study-item__title">
                    {item.hanzi} <span>{item.pinyin}</span>
                  </p>
                  <p className="muted-text">{getLocalizedText(item.meaning, selectedLanguage)}</p>
                  <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>

          <section className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.pronunciation}</h2>
            <div className="card-grid">
              {lesson.pronunciation.map((tip) => (
                <article key={tip.id} className="study-item">
                  <p className="study-item__title">{getLocalizedText(tip.focus, selectedLanguage)}</p>
                  <p className="muted-text">{getLocalizedText(tip.tip, selectedLanguage)}</p>
                  <ExplanationBlock explanation={tip.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>

          <section className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.hanziRecognition}</h2>
            <div className="card-grid card-grid--compact">
              {lesson.hanziRecognition.map((item) => (
                <article key={item.id} className="study-item">
                  <p className="study-item__title">
                    {item.hanzi} <span>{item.pinyin}</span>
                  </p>
                  <p className="muted-text">{getLocalizedText(item.meaning, selectedLanguage)}</p>
                  <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>
        </div>

        <nav className="button-row lesson-actions" aria-label={copy.lessonPage.lessonActions}>
          <Link className="primary-button" to={`/lesson/${lesson.id}/practice`}>
            {copy.lessonPage.goToPractice}
          </Link>
          <Link className="secondary-link" to={`/lesson/${lesson.id}/short-input`}>
            {copy.lessonPage.finishWithShortInput}
          </Link>
          <Link className="secondary-link" to="/home">
            {copy.lessonPage.backToHome}
          </Link>
        </nav>
      </section>
    </main>
  )
}
