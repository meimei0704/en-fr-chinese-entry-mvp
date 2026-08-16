import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ContentLoading } from '../components/ContentState'
import { DialoguePlayer } from '../components/DialoguePlayer'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { SpeechButton } from '../components/SpeechButton'
import type { LessonContent } from '../content/types'
import { fetchLesson } from '../lib/contentApi'
import { loadProgress, saveProgress } from '../lib/progress'
import { useCourse } from '../lib/contentProvider'

function findLesson(course: ReturnType<typeof useCourse>['course'], lessonId?: string): LessonContent | undefined {
  return course?.lessons.find((lesson) => lesson.id === lessonId)
}

const studyLayerIds = ['lesson-dialogue', 'lesson-patterns', 'lesson-vocabulary'] as const

function renderPatternFormula(pattern: string) {
  const segments = pattern.split('……')
  if (segments.length < 2) {
    return pattern
  }

  return segments.flatMap((segment, index) => {
    const children: Array<string | JSX.Element> = segment ? [segment] : []
    if (index < segments.length - 1) {
      children.push(<em key={`slot-${index}`} className="pattern-slot">……</em>)
    }
    return children
  })
}

export function LessonPage() {
  const { lessonId } = useParams()
  const { course, error, reload } = useCourse()
  const [fallbackLesson, setFallbackLesson] = useState<LessonContent | undefined>(undefined)
  const lesson = fallbackLesson ?? findLesson(course, lessonId)
  const selectedLanguage = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)
  const studyLayers = studyLayerIds.map((id, index) => ({
    id,
    label: [copy.lessonPage.dialogue, copy.lessonPage.sentencePatterns, copy.lessonPage.vocabulary][
      index
    ],
  }))
  const [activeLayerId, setActiveLayerId] = useState<(typeof studyLayerIds)[number]>(
    studyLayers[0].id,
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

  useEffect(() => {
    if (!lesson || typeof IntersectionObserver === 'undefined') {
      return
    }

    const sections = studyLayerIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length !== studyLayerIds.length) {
      return
    }

    const referenceY = () => window.innerHeight * 0.35

    const updateActiveSection = () => {
      const line = referenceY()
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= line && rect.bottom > line) {
          setActiveLayerId(section.id as (typeof studyLayerIds)[number])
          break
        }
      }
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: '0px 0px -65% 0px',
      threshold: [0, 1],
    })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
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
          <LessonTopicTitle as="h1" lessonId={lesson.id} language={selectedLanguage} />
          <p className="lede lesson-header-card__scenario">
            {getLocalizedText(lesson.scenario, selectedLanguage)}
          </p>
        </header>

        <section
          className="lesson-progress-preview"
          aria-label={copy.lessonPage.lessonProgressPreviewLabel}
        >
          <ol className="lesson-progress-preview__rail">
            {studyLayers.map((layer, index) => (
              <li key={layer.id} className={layer.id === activeLayerId ? 'is-current' : undefined}>
                <a
                  className="lesson-progress-preview__rail-link"
                  href={`#${layer.id}`}
                  aria-current={layer.id === activeLayerId ? 'location' : undefined}
                  onClick={() => setActiveLayerId(layer.id)}
                >
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
              {lesson.sentencePatterns.map((pattern, index) => (
                <article key={pattern.id} className="study-item study-item--pattern">
                  <span className="study-item__index">{String(index + 1).padStart(2, '0')}</span>
                  <p className="study-item__title">{renderPatternFormula(pattern.pattern)}</p>
                  <p className="muted-text">{getLocalizedText(pattern.meaning, selectedLanguage)}</p>
                  <p className="study-item__example">{pattern.example}</p>
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
            <ul className="vocabulary-list">
              {lesson.vocabulary.map((item) => (
                <li key={item.id} className="vocabulary-list__item">
                  <div className="vocabulary-list__hanzi-row">
                    <p className="vocabulary-list__hanzi">{item.hanzi}</p>
                    <SpeechButton
                      label={copy.lessonPage.listenChinese}
                      text={item.hanzi}
                      audioSrc={item.audio}
                      fallbackAudioSrc={item.audioFallback}
                    />
                  </div>
                  <p className="vocabulary-list__pinyin">{item.pinyin}</p>
                  <p className="muted-text">{getLocalizedText(item.meaning, selectedLanguage)}</p>
                  <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
                </li>
              ))}
            </ul>
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
