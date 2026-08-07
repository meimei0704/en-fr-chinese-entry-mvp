import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { DialoguePlayer } from '../components/DialoguePlayer'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { SpeechButton } from '../components/SpeechButton'
import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

function findLesson(lessonId?: string): LessonContent | undefined {
  return course.lessons.find((lesson) => lesson.id === lessonId)
}

export function LessonPage() {
  const { lessonId } = useParams()
  const lesson = findLesson(lessonId)
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)
  const studyLayers = [
    { id: 'lesson-dialogue', label: copy.lessonPage.dialogue },
    { id: 'lesson-patterns', label: copy.lessonPage.sentencePatterns },
    { id: 'lesson-vocabulary', label: copy.lessonPage.vocabulary },
  ]

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
    <main className="page-shell page-shell--wide lesson-page">
      <section className="hero-card lesson-header-card">
        <header className="lesson-header-card__title">
          <p className="eyebrow">{copy.lessonPage.eyebrow}</p>
          <LessonTopicTitle as="h1" lessonId={lesson.id} language={selectedLanguage} />
        </header>

        <section
          className="lesson-progress-preview"
          aria-label={copy.lessonPage.lessonProgressPreviewLabel}
        >
          <div className="lesson-progress-preview__summary">
            <span className="badge badge--sky">
              {copy.homePage.lessonScenarioBadges[lesson.id]}
            </span>
            <strong>{copy.lessonPage.studyLayersCount(studyLayers.length)}</strong>
            <span>{copy.lessonPage.practiceNext}</span>
          </div>
          <ol className="lesson-progress-preview__rail">
            {studyLayers.map((layer, index) => (
              <li key={layer.id} className={index === 0 ? 'is-current' : undefined}>
                <a className="lesson-progress-preview__rail-link" href={`#${layer.id}`}>
                  <span>{index + 1}</span>
                  {layer.label}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="section-stack">
          <section
            id="lesson-dialogue"
            className="surface-card lesson-section-card"
            aria-label={copy.lessonPage.dialoguePracticeLabel}
          >
            <h2>{copy.lessonPage.dialogue}</h2>
            <DialoguePlayer lines={lesson.dialogue.lines} language={selectedLanguage} />
          </section>

          <section id="lesson-patterns" className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.sentencePatterns}</h2>
            <div className="card-grid">
              {lesson.sentencePatterns.map((pattern) => (
                <article key={pattern.id} className="study-item study-item--pattern">
                  <p className="study-item__title">{pattern.pattern}</p>
                  <p className="muted-text">{getLocalizedText(pattern.meaning, selectedLanguage)}</p>
                  <p className="pinyin-line">{pattern.example}</p>
                  <SpeechButton
                    label={copy.lessonPage.listenChinese}
                    text={pattern.example}
                    audioSrc={pattern.audio}
                    fallbackAudioSrc={pattern.audioFallback}
                  />
                  <ExplanationBlock explanation={pattern.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>

          <section id="lesson-vocabulary" className="surface-card lesson-section-card">
            <h2>{copy.lessonPage.vocabulary}</h2>
            <div className="card-grid card-grid--compact">
              {lesson.vocabulary.map((item) => (
                <article key={item.id} className="study-item">
                  <p className="study-item__title">
                    {item.hanzi} <span>{item.pinyin}</span>
                  </p>
                  <SpeechButton
                    label={copy.lessonPage.listenChinese}
                    text={item.hanzi}
                    audioSrc={item.audio}
                    fallbackAudioSrc={item.audioFallback}
                  />
                  <p className="muted-text">{getLocalizedText(item.meaning, selectedLanguage)}</p>
                  <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
                </article>
              ))}
            </div>
          </section>

        </div>

        <nav
          className="button-row lesson-actions lesson-action-dock"
          aria-label={copy.lessonPage.lessonActions}
        >
          <Link className="primary-button" to={`/lesson/${lesson.id}/practice`}>
            {copy.lessonPage.goToPractice}
          </Link>
          <Link className="secondary-link" to="/home">
            {copy.lessonPage.backToHome}
          </Link>
        </nav>
      </section>
    </main>
  )
}
