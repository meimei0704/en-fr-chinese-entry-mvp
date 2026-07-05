import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { ExplanationBlock } from '../components/ExplanationBlock'
import { course } from '../content/course'
import type { ReviewCard } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

function findReviewCard(cardId: string): ReviewCard | undefined {
  return course.lessons
    .flatMap((lesson) => lesson.reviewCards)
    .find((card) => card.id === cardId)
}

export function ReviewPage() {
  const [progress, setProgress] = useState(() => loadProgress())
  const [finishedCount, setFinishedCount] = useState(0)
  const copy = getUiCopy(progress.selectedExplanationLanguage)
  const dueCards = progress.reviewQueue
    .map((cardId) => findReviewCard(cardId))
    .filter((card): card is ReviewCard => Boolean(card))
  const currentCard = dueCards[0]

  function handleMarkComplete() {
    if (!currentCard) {
      return
    }

    const updatedProgress = {
      ...progress,
      reviewQueue: progress.reviewQueue.filter((cardId) => cardId !== currentCard.id),
    }

    saveProgress(updatedProgress)
    setProgress(updatedProgress)
    setFinishedCount((count) => count + 1)
  }

  return (
    <main className="page-shell" style={{ placeItems: 'start center' }}>
      <section className="hero-card" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <p className="eyebrow">{copy.reviewPage.eyebrow}</p>
          <h1>{copy.reviewPage.heading}</h1>
          <p className="lede">{copy.reviewPage.cardsDueToday(dueCards.length)}</p>
        </header>

        {finishedCount > 0 ? (
          <p style={{ margin: 0, color: '#166534', fontWeight: 700 }}>
            {copy.reviewPage.finishedCount(finishedCount)}
          </p>
        ) : null}

        {currentCard ? (
          <article
            style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              background: '#f8fafc',
              border: '1px solid #dbeafe',
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{copy.reviewPage.front}</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{currentCard.front}</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{copy.reviewPage.back}</p>
              <p style={{ margin: 0 }}>
                {getLocalizedText(currentCard.back, progress.selectedExplanationLanguage)}
              </p>
              <ExplanationBlock
                explanation={currentCard.explanation}
                language={progress.selectedExplanationLanguage}
              />
            </div>
            <button type="button" className="primary-button" onClick={handleMarkComplete}>
              {copy.reviewPage.markComplete}
            </button>
          </article>
        ) : (
          <section>
            <h2>{copy.reviewPage.queueClear}</h2>
            <p>{copy.reviewPage.noCards}</p>
          </section>
        )}

        <nav className="button-row" aria-label={copy.reviewPage.reviewActions}>
          <Link className="secondary-link" to="/progress">
            {copy.reviewPage.viewProgress}
          </Link>
          <Link className="secondary-link" to="/home">
            {copy.reviewPage.backToHome}
          </Link>
        </nav>
      </section>
    </main>
  )
}
