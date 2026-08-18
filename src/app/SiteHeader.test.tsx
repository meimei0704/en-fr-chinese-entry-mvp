import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const expectedNavLinks = [
  ['Home', '/'],
  ['Pinyin', '/pinyin'],
  ['Journey', '/#home-basic-expressions-path'],
  ['Culture', '/culture'],
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

  it('renders the header with the sticky class so it stays on screen while scrolling', () => {
    renderRoute('/')

    const header = document.querySelector('.site-header')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('site-header--sticky')
  })

  it('omits the Review and Progress entries from the main navigation', () => {
    renderRoute('/')

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).queryByRole('link', { name: 'Review' })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('link', { name: 'Progress' })).not.toBeInTheDocument()
  })

  it('marks the Home link active only on the root route', () => {
    renderRoute('/')

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('site-header__link--active')
    expect(screen.getByRole('link', { name: 'Culture' })).not.toHaveClass(
      'site-header__link--active',
    )
  })

  it('marks the Culture link active on the /culture route without highlighting Home', () => {
    renderRoute('/culture')

    expect(screen.getByRole('link', { name: 'Culture' })).toHaveClass('site-header__link--active')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass(
      'site-header__link--active',
    )
  })

  it('renders French labels when the explanation language is French', () => {
    saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: 'fr' })

    renderRoute('/')

    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'Parcours' })).toHaveAttribute(
      'href',
      '/#home-basic-expressions-path',
    )
    expect(within(nav).getByRole('link', { name: 'Culture' })).toHaveAttribute('href', '/culture')
  })

  it('hides the header on admin routes', () => {
    renderRoute('/admin')

    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument()
    expect(document.querySelector('.site-header')).not.toBeInTheDocument()
  })
})
