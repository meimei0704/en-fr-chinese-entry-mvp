import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { completeLesson, createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

function seedProgressWithFirstLessonLearned(selectedExplanationLanguage: 'en' | 'fr' = 'fr') {
  saveProgress({
    ...createDefaultProgress(),
    selectedExplanationLanguage,
    completedLessons: ['self-intro'],
    reviewQueue: ['self-intro-review-1', 'self-intro-review-2', 'self-intro-review-3'],
    lastVisitedLesson: 'self-intro',
    lessonStepProgress: {
      'self-intro': {
        completedSections: ['dialogue', 'practice'],
        shortInputComplete: true,
      },
    },
  })
}

describe('ReviewPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows review cards from learned lessons and removes one after completion', async () => {
    const user = userEvent.setup()

    seedProgressWithFirstLessonLearned()
    renderRoute('/review')

    expect(screen.getByRole('heading', { name: /révision/i })).toBeVisible()
    expect(screen.getByText(/cartes à revoir aujourd’hui/i)).toBeVisible()
    expect(screen.getByRole('region', { name: /panneau d’état de révision/i })).toBeVisible()
    expect(screen.getByRole('article', { name: /carte de révision en cours/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /recto de la carte/i })).toHaveTextContent('护照')
    expect(screen.getByRole('region', { name: /verso de la carte/i })).toHaveTextContent(
      /passeport/i,
    )
    expect(screen.getByText('护照')).toBeVisible()
    expect(screen.getByText(/passeport/i)).toBeVisible()
    expect(screen.getByText(/premier mot de document/i)).toBeVisible()
    expect(screen.queryByRole('article', { name: /current review flashcard/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /marquer comme terminée/i }))

    expect(screen.getByText(/1 carte terminée/i)).toHaveClass('success-chip')
    expect(screen.queryByText('护照')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: /recto de la carte/i })).toHaveTextContent('我来旅游')
    expect(loadProgress().reviewQueue).toEqual(['self-intro-review-2', 'self-intro-review-3'])
  })



  it('shows review cards enqueued by the fourth and fifth formal lessons after progress reload', async () => {
    const user = userEvent.setup()
    const afterPhonePayment = completeLesson('phone-and-payment', createDefaultProgress())
    const afterStoreRun = completeLesson('convenience-store-run', afterPhonePayment)

    saveProgress(afterStoreRun)
    renderRoute('/review')

    expect(loadProgress().completedLessons).toEqual([
      'phone-and-payment',
      'convenience-store-run',
    ])
    expect(screen.getByText(/cards due today: 6/i)).toBeVisible()
    expect(screen.getByRole('region', { name: /flashcard front/i })).toHaveTextContent('手机卡')

    await user.click(screen.getByRole('button', { name: /mark complete/i }))
    await user.click(screen.getByRole('button', { name: /mark complete/i }))
    await user.click(screen.getByRole('button', { name: /mark complete/i }))

    expect(screen.getByRole('region', { name: /flashcard front/i })).toHaveTextContent('一瓶水')
    expect(loadProgress().reviewQueue).toEqual([
      'convenience-store-run-review-1',
      'convenience-store-run-review-2',
      'convenience-store-run-review-3',
    ])
  })

  it('frames the review queue with status cards and a layered flashcard surface', () => {
    seedProgressWithFirstLessonLearned('en')
    renderRoute('/review')

    const statusPanel = screen.getByRole('region', { name: /review status panel/i })
    expect(statusPanel).toHaveClass('review-status-panel')
    expect(statusPanel).toHaveTextContent(/due now/i)
    expect(statusPanel).toHaveTextContent(/3/)

    const flashcard = screen.getByRole('article', { name: /current review flashcard/i })
    expect(flashcard).toHaveClass('review-flashcard--layered')
    expect(screen.getByRole('region', { name: /flashcard front/i })).toHaveClass(
      'review-side--front',
    )
    expect(screen.getByRole('region', { name: /flashcard back/i })).toHaveClass(
      'review-side--back',
    )
  })
})
