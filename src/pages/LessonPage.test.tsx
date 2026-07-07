import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('LessonPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('wraps the lesson in scannable overview and dialogue regions', () => {
    renderRoute('/lesson/self-intro')

    expect(screen.getByRole('region', { name: /lesson overview/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /dialogue practice/i })).toBeVisible()
    expect(screen.getAllByLabelText(/dialogue line speaker a/i)[0]).toHaveTextContent('你好')
    expect(screen.getAllByLabelText(/dialogue line speaker a/i)[0]).toHaveTextContent('Nǐ hǎo')
  })

  it('renders the full lesson template and lets the user switch explanations without changing progress', async () => {
    const user = userEvent.setup()
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/lesson/self-intro')

    expect(
      screen.getByRole('heading', { level: 1, name: /se présenter/i }),
    ).toBeVisible()
    expect(screen.getByRole('region', { name: /aperçu de la leçon/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /objectif de la scène/i }),
    ).toBeVisible()
    expect(screen.getByRole('region', { name: /pratique du dialogue/i })).toBeVisible()
    expect(screen.getAllByLabelText(/ligne de dialogue, interlocuteur a/i)[0]).toHaveTextContent(
      '你好',
    )
    expect(screen.getByRole('heading', { level: 2, name: /dialogue/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /structures utiles/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /vocabulaire/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /prononciation/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /reconnaissance des hanzi/i }),
    ).toBeVisible()
    expect(screen.getByText(/je m[’']appelle anna\./i)).toBeVisible()
    expect(screen.getByRole('link', { name: /passer à la pratique/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /terminer avec la mini-réponse/i })).toBeVisible()
    expect(screen.queryByRole('region', { name: /lesson overview/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByText(/my name is anna\./i)).toBeVisible()
    expect(loadProgress().selectedExplanationLanguage).toBe('en')
  })
})
