import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { speakChinese } from '../lib/speech'
import { MockCourseProvider, MockPinyinCourseProvider } from '../test/mockContentProvider'
import { renderRoute } from '../test/renderRoute'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
}))

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

describe('PinyinPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(speakChinese).mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the Pinyin lesson hero', () => {
    renderRoute('/pinyin')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pinyin（零基础第一课）' }),
    ).toBeVisible()
  })

  it('renders four numbered module tab badges', () => {
    renderRoute('/pinyin')

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(4)
    expect(tabs.map((tab) => tab.querySelector('span')?.textContent)).toEqual([
      '①',
      '②',
      '③',
      '④',
    ])
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      '①Initials',
      '②Finals',
      '③Tones',
      '④Whole Syllables',
    ])
  })

  it('renders reference cards with audio playback entry points for the default module', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Initials' })).toBeVisible()
    expect(screen.getByText('bā')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play bā' })).toBeVisible()
  })

  it('switches to the whole syllables module and renders all sixteen cards', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    await user.click(screen.getByRole('tab', { name: 'Whole Syllables' }))

    expect(screen.getByText('zhi')).toBeVisible()
    expect(screen.getByText('zhī')).toBeVisible()
    expect(screen.getByText('ying')).toBeVisible()
    expect(screen.getByText('yīng')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play zhi' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play ying' })).toBeVisible()
    expect(screen.getByText('知')).toBeVisible()
    expect(screen.getByText('英')).toBeVisible()
  })

  it('marks the reference section complete after the learner plays a reference audio sample', async () => {
    const user = userEvent.setup()
    const existingCourseProgress = JSON.stringify({
      selectedExplanationLanguage: 'en',
      completedLessons: ['self-intro'],
      reviewQueue: [],
      lastVisitedLesson: 'self-intro',
      lessonStepProgress: {},
    })

    localStorage.setItem(courseProgressStorageKey, existingCourseProgress)
    renderRoute('/pinyin')

    await user.click(screen.getByRole('button', { name: 'Play bā' }))

    expect(vi.mocked(speakChinese)).toHaveBeenCalledWith({
      text: 'bā',
      audioSrc: '/audio/pinyin/lesson-1/reference-initial-b.mp3',
    })
    expect(loadPinyinProgress()).toMatchObject({
      completedSections: ['reference'],
      moduleProgress: {
        initials: {
          visited: true,
          completedSections: ['reference'],
        },
      },
    })
    expect(localStorage.getItem(courseProgressStorageKey)).toBe(existingCourseProgress)
  })

  it('links to the practice page for the selected module', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('link', { name: 'Go to practice' })).toHaveAttribute(
      'href',
      '/pinyin/practice?module=initials',
    )
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home')
  })

  it('does not offer practice for the whole-syllables module', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    await user.click(screen.getByRole('tab', { name: 'Whole Syllables' }))

    expect(screen.queryByRole('link', { name: 'Go to practice' })).not.toBeInTheDocument()
  })

  it('localizes Pinyin page chrome and audio labels for French learners', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Initiales' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bā' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Passer à la pratique' })).toHaveAttribute(
      'href',
      '/pinyin/practice?module=initials',
    )

    expect(screen.queryByText('Reference')).not.toBeInTheDocument()
    expect(screen.queryByText('First tone: high and level')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming next')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Chinese' })).not.toBeInTheDocument()
  })

  it('shows the loading state while the pinyin course is being fetched', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/pinyin'] })

    render(
      <MockCourseProvider course={null}>
        <MockPinyinCourseProvider course={null}>
          <RouterProvider router={router} />
        </MockPinyinCourseProvider>
      </MockCourseProvider>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('轻松学中文')
  })

  it('shows the error state with a retry button when the pinyin course fetch fails', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/pinyin'] })

    render(
      <MockCourseProvider course={null}>
        <MockPinyinCourseProvider course={null} error={new Error('boom')}>
          <RouterProvider router={router} />
        </MockPinyinCourseProvider>
      </MockCourseProvider>,
    )

    expect(screen.getByText("We couldn’t load the course.")).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
  })
})
