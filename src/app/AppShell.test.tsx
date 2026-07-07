import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { loadProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('App shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the explanation-language entry screen on first load', async () => {
    const user = userEvent.setup()

    renderRoute('/')

    expect(screen.getByRole('heading', { name: /choose your explanation language/i })).toBeVisible()
    expect(screen.getByText(/learn beginner chinese through practical scenarios/i)).toBeVisible()
    expect(screen.getByRole('group', { name: /explanation language/i })).toBeVisible()

    const languageOptions = screen.getByRole('region', { name: /choose guidance path/i })
    expect(within(languageOptions).getByRole('button', { name: 'English' })).toBeVisible()
    expect(within(languageOptions).getByRole('button', { name: 'Français' })).toBeVisible()
    expect(within(languageOptions).getByText(/switch anytime/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /start learning/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Français' }))

    expect(screen.getByRole('heading', { name: /choisissez votre langue d’explication/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /choisir le parcours d’accompagnement/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /commencer/i })).toBeVisible()
  })

  it('saves the selected explanation language before routing away from the entry screen', async () => {
    const user = userEvent.setup()

    renderRoute('/')

    await user.click(screen.getByRole('button', { name: 'Français' }))
    await user.click(screen.getByRole('button', { name: /commencer/i }))

    expect(loadProgress().selectedExplanationLanguage).toBe('fr')
    expect(screen.queryByRole('button', { name: /commencer/i })).not.toBeInTheDocument()
  })
})
