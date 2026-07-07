import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
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

  it('shows the refreshed hero phrase, progress cues, and lesson mini phrase', () => {
    renderRoute('/home')

    expect(screen.getByLabelText(/hero phrase/i)).toHaveTextContent('你好')
    expect(screen.getByLabelText(/hero phrase/i)).toHaveTextContent('nǐ hǎo')
    expect(screen.getByText(`${course.lessons.length} lessons`)).toBeVisible()
    expect(screen.getByText(/listen & repeat/i)).toBeVisible()
    expect(within(screen.getAllByRole('article')[0]).getByText(course.lessons[0].vocabulary[0].hanzi)).toBeVisible()
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
    expect(screen.getByLabelText(/points clés de l’apprentissage/i)).toHaveTextContent(
      'Guidage anglais/français',
    )
    expect(screen.getByLabelText(/phrase modèle/i)).toHaveTextContent('你好')

    const progressSummary = screen.getByLabelText(/résumé des progrès du cours/i)
    expect(progressSummary).toHaveTextContent(`${course.lessons.length} leçons`)
    expect(progressSummary).toHaveTextContent('0 terminée')
    expect(progressSummary).toHaveTextContent('0 à réviser')

    expect(screen.getByText('Présentation')).toBeVisible()
    expect(screen.getByText('Métro')).toBeVisible()
    expect(screen.queryByText(`${course.lessons.length} lessons`)).not.toBeInTheDocument()
    expect(screen.queryByText('Intro')).not.toBeInTheDocument()
  })
})
