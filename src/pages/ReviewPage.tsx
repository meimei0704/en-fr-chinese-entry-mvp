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
    <main className="page-shell page-shell--wide">
      <section className="hero-card review-card">
        <header>
          <p className="eyebrow">{copy.reviewPage.eyebrow}</p>
          <h1>{copy.reviewPage.heading}</h1>
          <p className="lede">{copy.reviewPage.cardsDueToday(dueCards.length)}</p>
        </header>

        {finishedCount > 0 ? (
          <p className="success-chip">
            {copy.reviewPage.finishedCount(finishedCount)}
          </p>
        ) : null}

        {currentCard ? (
          <article className="review-flashcard" aria-label="Current review flashcard">
            <section className="review-side" aria-label="Flashcard front">
              <p className="eyebrow">{copy.reviewPage.front}</p>
              <p className="hanzi-display hanzi-display--review">{currentCard.front}</p>
            </section>
            <section className="review-side" aria-label="Flashcard back">
              <p className="eyebrow">{copy.reviewPage.back}</p>
              <p className="review-answer">
                {getLocalizedText(currentCard.back, progress.selectedExplanationLanguage)}
              </p>
              <ExplanationBlock
                explanation={currentCard.explanation}
                language={progress.selectedExplanationLanguage}
              />
            </section>
            <button type="button" className="primary-button" onClick={handleMarkComplete}>
              {copy.reviewPage.markComplete}
            </button>
          </article>
        ) : (
          <section className="review-empty-state">
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
