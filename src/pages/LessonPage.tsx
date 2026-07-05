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
    <main className="page-shell" style={{ placeItems: 'start center' }}>
      <section className="hero-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <p className="eyebrow">{copy.lessonPage.eyebrow}</p>
          <h1>{getLocalizedText(lesson.title, selectedLanguage)}</h1>
          <p className="lede">{getLocalizedText(lesson.dialogue.title, selectedLanguage)}</p>
        </header>

        <section>
          <h2>{copy.lessonPage.scenarioGoal}</h2>
          <p>{getLocalizedText(lesson.scenario, selectedLanguage)}</p>
          <LanguageToggle
            selectedLanguage={selectedLanguage}
            onSelect={handleSelectLanguage}
            ariaLabel={copy.languageToggleLabel}
          />
          <p style={{ marginTop: '1rem', color: '#475569' }}>
            {copy.lessonPage.sectionSummary}
          </p>
        </section>

        <section>
          <h2>{copy.lessonPage.dialogue}</h2>
          <DialoguePlayer lines={lesson.dialogue.lines} language={selectedLanguage} />
        </section>

        <section>
          <h2>{copy.lessonPage.sentencePatterns}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {lesson.sentencePatterns.map((pattern) => (
              <article key={pattern.id} style={{ padding: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{pattern.pattern}</p>
                <p style={{ margin: '0.25rem 0 0' }}>{getLocalizedText(pattern.meaning, selectedLanguage)}</p>
                <p style={{ margin: '0.25rem 0 0', color: '#1d4ed8' }}>{pattern.example}</p>
                <ExplanationBlock explanation={pattern.explanation} language={selectedLanguage} />
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>{copy.lessonPage.vocabulary}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {lesson.vocabulary.map((item) => (
              <article key={item.id} style={{ padding: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {item.hanzi} · {item.pinyin}
                </p>
                <p style={{ margin: '0.25rem 0 0' }}>{getLocalizedText(item.meaning, selectedLanguage)}</p>
                <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>{copy.lessonPage.pronunciation}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {lesson.pronunciation.map((tip) => (
              <article key={tip.id} style={{ padding: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{getLocalizedText(tip.focus, selectedLanguage)}</p>
                <p style={{ margin: '0.25rem 0 0' }}>{getLocalizedText(tip.tip, selectedLanguage)}</p>
                <ExplanationBlock explanation={tip.explanation} language={selectedLanguage} />
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>{copy.lessonPage.hanziRecognition}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {lesson.hanziRecognition.map((item) => (
              <article key={item.id} style={{ padding: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {item.hanzi} · {item.pinyin}
                </p>
                <p style={{ margin: '0.25rem 0 0' }}>{getLocalizedText(item.meaning, selectedLanguage)}</p>
                <ExplanationBlock explanation={item.explanation} language={selectedLanguage} />
              </article>
            ))}
          </div>
        </section>

        <nav className="button-row" aria-label={copy.lessonPage.lessonActions}>
          <Link className="secondary-link" to={`/lesson/${lesson.id}/practice`}>
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
