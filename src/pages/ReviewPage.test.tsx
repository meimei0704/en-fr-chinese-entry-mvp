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
    expect(screen.getByText('我叫')).toBeVisible()
    expect(screen.getByText(/je m[’']appelle/i)).toBeVisible()
    expect(screen.getByText(/utilise-le pour commencer ta présentation\./i)).toBeVisible()

    await user.click(screen.getByRole('button', { name: /marquer comme terminée/i }))

    expect(screen.getByText(/1 carte terminée/i)).toBeVisible()
    expect(screen.queryByText('我叫')).not.toBeInTheDocument()
    expect(loadProgress().reviewQueue).toEqual([])
  })
})
