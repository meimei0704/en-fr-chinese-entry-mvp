import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('PinyinPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the Pinyin lesson hero with stable section navigation', () => {
    renderRoute('/pinyin')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pinyin（零基础第一课）' }),
    ).toBeVisible()

    expect(screen.getByRole('link', { name: 'Reference' })).toHaveAttribute(
      'href',
      '#pinyin-reference',
    )
    expect(screen.getByRole('link', { name: 'Tone game' })).toHaveAttribute(
      'href',
      '#pinyin-tone-game',
    )
    expect(screen.getByRole('link', { name: 'Shadowing' })).toHaveAttribute(
      'href',
      '#pinyin-shadowing',
    )
  })

  it('renders reference cards with audio playback entry points', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Reference' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'Initials' })).toBeVisible()
    expect(screen.getByText('bo')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play bo' })).toBeVisible()
  })

  it('localizes Pinyin page chrome and audio labels for French learners', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/pinyin')

    expect(screen.getByRole('link', { name: 'Référence' })).toHaveAttribute(
      'href',
      '#pinyin-reference',
    )
    expect(screen.getByRole('link', { name: 'Jeu des tons' })).toHaveAttribute(
      'href',
      '#pinyin-tone-game',
    )
    expect(screen.getByRole('link', { name: 'Répétition' })).toHaveAttribute(
      'href',
      '#pinyin-shadowing',
    )

    expect(screen.getByText('0 section sur 3 terminée')).toBeVisible()
    expect(screen.getByText('Leçon 1')).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Référence' })).toBeVisible()
    expect(screen.getByText(/Construisez une première carte sonore/i)).toBeVisible()
    expect(screen.getByText('Premier ton')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bo' })).toBeVisible()
    expect(screen.getAllByText('Bientôt')).toHaveLength(2)

    expect(screen.queryByText('Reference')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming next')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Chinese' })).not.toBeInTheDocument()
  })
})
