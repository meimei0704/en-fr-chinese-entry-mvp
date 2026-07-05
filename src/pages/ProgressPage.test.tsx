import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('ProgressPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows completed lessons, current lesson, and review count on the progress page', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'order-food',
      reviewQueue: ['order-food-review-1', 'ask-directions-review-1'],
    })

    renderRoute('/progress')

    expect(screen.getByRole('heading', { name: /progression/i })).toBeVisible()
    expect(screen.getByText(/1 leçon sur 3 terminée/i)).toBeVisible()
    expect(screen.getByText(/leçon en cours/i)).toBeVisible()
    expect(screen.getByText(/commander à manger/i)).toBeVisible()
    expect(screen.getByText(/2 cartes en attente/i)).toBeVisible()
  })
})
