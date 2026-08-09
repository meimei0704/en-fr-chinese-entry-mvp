import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

const homeSeriesCopy = {
  label: 'Course series',
  pinyin: 'Mandarin tones and pinyin',
  journey: 'Useful sentences, expressions and Hanzi recognition',
} as const

describe('App shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the Home page on the root route by default', () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.getByRole('region', { name: /home hero/i })).toHaveClass('home-hero--centered')
    expect(screen.getByText('Basic Chinese expressions for a stress-free travel')).toBeVisible()
    expect(
      screen.queryByText('Apprenez les dialogues essentiels pour voyager en Chine'),
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

    const courseSeries = screen.getByRole('region', { name: homeSeriesCopy.label })
    const pinyinSeries = within(courseSeries).getByRole('region', { name: homeSeriesCopy.pinyin })
    const journeySeries = within(courseSeries).getByRole('region', { name: homeSeriesCopy.journey })
    const lessonLinks = within(journeySeries)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(lessonLinks).toHaveLength(12)
    expect(within(pinyinSeries).getByRole('link', { name: homeSeriesCopy.pinyin })).toHaveAttribute(
      'href',
      '/pinyin',
    )
    expect(
      within(journeySeries).getByRole('link', {
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'en'),
      }),
    ).toHaveAttribute('href', '/lesson/daily-greetings')
    expect(journeySeries).not.toHaveTextContent(' / ')
  })

  it('keeps the legacy /home route compatible with the same Home page content', () => {
    renderRoute('/home')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', {
      name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'en'),
    })).toHaveAttribute('href', '/lesson/daily-greetings')
  })
})
