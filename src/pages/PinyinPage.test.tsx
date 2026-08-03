import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { pinyinCourse } from '../content/pinyin/course'
import { loadPinyinProgress } from '../lib/pinyinProgress'
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

  it('finishes the fixed eight-question tone game and records the score', async () => {
    const user = userEvent.setup()
    const questions = pinyinCourse.lesson.toneGame.questions

    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Tone ear check' })).toBeVisible()

    for (const [index, question] of questions.entries()) {
      const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId)

      expect(correctChoice).toBeDefined()
      expect(screen.getByText(`Question ${index + 1} of ${questions.length}`)).toBeVisible()

      await user.click(screen.getByRole('radio', { name: new RegExp(correctChoice?.toneLabel ?? '') }))
      await user.click(screen.getByRole('button', { name: 'Submit answer' }))
    }

    expect(screen.getByRole('heading', { level: 3, name: 'Tone game result' })).toBeVisible()
    expect(screen.getByText('Correct rate')).toBeVisible()
    expect(screen.getByText('8/8')).toBeVisible()
    expect(screen.getByText('1 of 3 sections complete')).toBeVisible()
    expect(loadPinyinProgress()).toMatchObject({
      toneGameLastScore: 8,
      toneGameBestScore: 8,
      completedSections: ['tone-game'],
    })
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
    expect(screen.getAllByText('Leçon 1')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 2, name: 'Référence' })).toBeVisible()
    expect(screen.getByText(/Construisez une première carte sonore/i)).toBeVisible()
    expect(screen.getByText('Premier ton')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bo' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Écoute des tons' })).toBeVisible()
    expect(screen.getByText('Question 1 sur 8')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter l’extrait de ton 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Valider la réponse' })).toBeVisible()
    expect(screen.getAllByText('Bientôt')).toHaveLength(1)

    expect(screen.queryByText('Reference')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming next')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Chinese' })).not.toBeInTheDocument()
  })
})
