import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { pinyinCourse } from '../content/pinyin/course'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { speakChinese } from '../lib/speech'
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

  it('renders numbered lesson tab badges for every pinyin lesson', () => {
    renderRoute('/pinyin')

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(pinyinCourse.lessons.length)
    expect(tabs.map((tab) => tab.querySelector('span')?.textContent)).toEqual(
      pinyinCourse.lessons.map((_, index) => String(index + 1)),
    )
  })

  it('renders reference cards with audio playback entry points', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Reference' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: 'Initials' })).toBeVisible()
    expect(screen.getByText('bo')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play bo' })).toBeVisible()
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

    await user.click(screen.getByRole('button', { name: 'Play bo' }))

    expect(vi.mocked(speakChinese)).toHaveBeenCalledWith({
      text: 'bo',
      audioSrc: '/audio/pinyin/lesson-1/reference-initial-b.mp3',
    })
    expect(loadPinyinProgress()).toMatchObject({
      completedSections: ['reference'],
    })
    expect(localStorage.getItem(courseProgressStorageKey)).toBe(existingCourseProgress)
  })

  it('links to the practice page for the selected lesson', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('link', { name: 'Go to practice' })).toHaveAttribute(
      'href',
      '/pinyin/practice?lesson=pinyin-foundations-1',
    )
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home')
  })

  it('localizes Pinyin page chrome and audio labels for French learners', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Référence' })).toBeVisible()
    expect(screen.getByText(/Construisez une première carte sonore/i)).toBeVisible()
    expect(screen.getByText('Premier ton')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bo' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Passer à la pratique' })).toHaveAttribute(
      'href',
      '/pinyin/practice?lesson=pinyin-foundations-1',
    )

    expect(screen.queryByText('Reference')).not.toBeInTheDocument()
    expect(screen.queryByText('First tone: high and level')).not.toBeInTheDocument()
    expect(screen.queryByText('Coming next')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play Chinese' })).not.toBeInTheDocument()
  })
})
