import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const expectedNavLinks = [
  ['Home', '/'],
  ['Pinyin', '/pinyin'],
  ['Culture', '/culture'],
  ['Review', '/review'],
  ['Progress', '/progress'],
] as const

describe('SiteHeader', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders main navigation links on public routes', () => {
    renderRoute('/')

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })

    for (const [label, href] of expectedNavLinks) {
      expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('href', href)
    }
  })

  it('marks the Home link active only on the root route', () => {
    renderRoute('/')

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('site-header__link--active')
    expect(screen.getByRole('link', { name: 'Review' })).not.toHaveClass(
      'site-header__link--active',
    )
  })

  it('marks the Review link active on the /review route without highlighting Home', () => {
    renderRoute('/review')

    expect(screen.getByRole('link', { name: 'Review' })).toHaveClass(
      'site-header__link--active',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass(
      'site-header__link--active',
    )
  })

  it('renders French labels when the explanation language is French', () => {
    saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: 'fr' })

    renderRoute('/')

    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'Révision' })).toHaveAttribute('href', '/review')
    expect(within(nav).getByRole('link', { name: 'Progrès' })).toHaveAttribute('href', '/progress')
  })

  it('hides the header on admin routes', () => {
    renderRoute('/admin')

    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument()
    expect(document.querySelector('.site-header')).not.toBeInTheDocument()
  })
})
