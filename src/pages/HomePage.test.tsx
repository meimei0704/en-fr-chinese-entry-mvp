import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { course } from '../content/course'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the three fixed lesson cards and a review shortcut on the home page', () => {
    renderRoute('/home')

    expect(screen.getByRole('link', { name: /continue learning/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /go to review/i })).toBeVisible()

    for (const lesson of course.lessons) {
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: getLocalizedText(lesson.title, 'en'),
        }),
      ).toBeVisible()
    }
  })

  it('renders page-level French copy when the learner chooses French mode', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/home')

    expect(screen.getByRole('heading', { name: /accueil/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /continuer la leçon/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /réviser/i })).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /se présenter/i,
      }),
    ).toBeVisible()
  })
})
