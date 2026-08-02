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
    expect(screen.getByRole('region', { name: /home hero/i })).toHaveClass('home-hero--centered')
    expect(screen.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(
      screen.queryByText('Apprenez le mandarin dans la vie quotidienne'),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('group', { name: /explanation language/i })).toBeVisible()
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Français' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.queryByRole('region', { name: /learning preview mockup/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /listen|écouter/i })).not.toBeInTheDocument()
    expect(screen.queryByText('Real-life Mandarin')).not.toBeInTheDocument()
    expect(screen.queryByText('Mandarin en situation')).not.toBeInTheDocument()
    expect(screen.queryByText(/A focused ten-lesson path/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /go to review/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view progress/i })).not.toBeInTheDocument()

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).getAllByRole('link')).toHaveLength(10)
    expect(
      within(journeyMap).getByRole('link', { name: /到达机场 \/ Arrival at the airport/i }),
    ).toHaveAttribute('href', '/lesson/self-intro')
  })

  it('keeps the legacy /home route compatible with the same Home page content', () => {
    renderRoute('/home')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /到达机场 \/ Arrival at the airport/i })).toHaveAttribute(
      'href',
      '/lesson/self-intro',
    )
  })
})
