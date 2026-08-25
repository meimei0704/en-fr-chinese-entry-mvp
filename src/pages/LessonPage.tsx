import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ContentError, ContentLoading } from '../components/ContentState'
import { DialoguePlayer } from '../components/DialoguePlayer'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { LessonTopicTitle } from '../components/LessonTopicTitle'
import { SpeechButton } from '../components/SpeechButton'
import type { LessonContent } from '../content/types'
import { fetchLesson } from '../lib/contentApi'
import { loadProgress, saveProgress } from '../lib/progress'
import { useCourse } from '../lib/contentContext'

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
  const [progress, setProgress] = useState(() => loadProgress())
  const lesson = fallbackLesson ?? findLesson(course, lessonId)
  const selectedLanguage = progress.selectedExplanationLanguage
  const copy = getUiCopy(selectedLanguage)
  const usesApprovedPatternTemplate = lesson?.id === 'daily-greetings'
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

    setProgress((currentProgress) => {
      if (currentProgress.lastVisitedLesson === lesson.id) {
        return currentProgress
      }

      const nextProgress = {
        ...currentProgress,
        lastVisitedLesson: lesson.id,
      }

      saveProgress(nextProgress)
      return nextProgress
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
      let nextActiveLayerId: (typeof studyLayerIds)[number] = studyLayerIds[0]
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= line) {
          nextActiveLayerId = section.id as (typeof studyLayerIds)[number]
        } else {
          break
        }
      }
      setActiveLayerId(nextActiveLayerId)
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: '0px 0px -65% 0px',
      threshold: [0, 1],
    })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [lesson])

  if (error) {
    return <ContentError language={selectedLanguage} onRetry={reload} />
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
              {lesson.sentencePatterns.map((pattern) => (
                <article key={pattern.id} className="study-item study-item--pattern">
                  <p className="study-item__title">{renderPatternFormula(pattern.pattern)}</p>
                  <p className={usesApprovedPatternTemplate ? 'pinyin-line' : 'study-item__pinyin'}>
                    {pattern.pinyin}
                  </p>
                  <p className="muted-text">{getLocalizedText(pattern.meaning, selectedLanguage)}</p>
                  {pattern.examples && pattern.examples.length > 0 ? (
                    <ul className="pattern-examples">
                      {pattern.examples.map((example) => (
                        <li key={example.hanzi} className="pattern-example">
                          {!usesApprovedPatternTemplate ? (
                            <div className="pattern-example__fill">
                              <span className="pattern-example__fill-hanzi">{example.fill}</span>
                              <span className="pattern-example__fill-pinyin">
                                {example.fillPinyin}
                              </span>
                              <span className="pattern-example__fill-translation">
                                {selectedLanguage === 'en' ? example.en : example.fr}
                              </span>
                            </div>
                          ) : null}
                          <div className="pattern-example__sentence">
                            {usesApprovedPatternTemplate ? (
                              <div>
                                <p>{example.hanzi}</p>
                                <p className="pinyin-line">{example.pinyin}</p>
                                <p className="muted-text">
                                  {selectedLanguage === 'en' ? example.en : example.fr}
                                </p>
                              </div>
                            ) : (
                              <>
                                <p>{example.hanzi}</p>
                                <p className="pattern-example__pinyin">{example.pinyin}</p>
                              </>
                            )}
                            <SpeechButton
                              label={copy.lessonPage.listenChinese}
                              text={example.hanzi}
                              audioSrc={example.audio}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : pattern.audio ? (
                    <div className="pattern-example pattern-example--standalone">
                      <div className="pattern-example__sentence">
                        <p>{pattern.pattern}</p>
                        <SpeechButton
                          label={copy.lessonPage.listenChinese}
                          text={pattern.pattern}
                          audioSrc={pattern.audio}
                          fallbackAudioSrc={pattern.audioFallback}
                        />
                      </div>
                    </div>
                  ) : null}
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
        </nav>
      </section>
    </main>
  )
}
