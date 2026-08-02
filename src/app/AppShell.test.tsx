import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

describe('App shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the Home page on the root route by default', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(
      screen.getByText('Apprenez le mandarin dans la vie quotidienne'),
    ).toBeVisible()
    expect(screen.queryByRole('button', { name: 'English' })).not.toBeInTheDocument()

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).getAllByRole('link')).toHaveLength(10)
    expect(
      within(journeyMap).getByRole('link', { name: /airport immigration basics/i }),
    ).toHaveAttribute('href', '/lesson/self-intro')
  })

  it('keeps the legacy /home route compatible with the same Home page content', () => {
    renderRoute('/home')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.getByRole('link', { name: /continue learning/i })).toHaveAttribute(
      'href',
      '/lesson/self-intro',
    )
  })
})
