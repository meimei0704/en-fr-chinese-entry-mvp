import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

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
    expect(screen.getAllByRole('button', { name: /play chinese/i }).length).toBeGreaterThan(0)
  })
})
