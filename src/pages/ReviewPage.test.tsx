import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

function seedProgressWithFirstLessonLearned() {
  saveProgress({
    ...createDefaultProgress(),
    selectedExplanationLanguage: 'fr',
    completedLessons: ['self-intro'],
    reviewQueue: ['self-intro-review-1'],
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
    expect(screen.getByRole('article', { name: /carte de révision en cours/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /recto de la carte/i })).toHaveTextContent('我叫')
    expect(screen.getByRole('region', { name: /verso de la carte/i })).toHaveTextContent(
      /je m[’']appelle/i,
    )
    expect(screen.getByText('我叫')).toBeVisible()
    expect(screen.getByText(/je m[’']appelle/i)).toBeVisible()
    expect(screen.getByText(/utilise-le pour commencer ta présentation\./i)).toBeVisible()
    expect(screen.queryByRole('article', { name: /current review flashcard/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /marquer comme terminée/i }))

    expect(screen.getByText(/1 carte terminée/i)).toHaveClass('success-chip')
    expect(screen.queryByText('我叫')).not.toBeInTheDocument()
    expect(loadProgress().reviewQueue).toEqual([])
  })
})
