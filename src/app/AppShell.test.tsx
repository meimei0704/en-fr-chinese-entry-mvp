import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
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

    expect(screen.getByRole('button', { name: 'English' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Français' })).toBeVisible()
    expect(screen.getByRole('button', { name: /start learning/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Français' }))

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
