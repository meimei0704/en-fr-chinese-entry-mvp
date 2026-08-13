import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
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

const syllableIntroCopy = {
  en: {
    description:
      'A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.',
    figureLabel:
      'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
  },
  fr: {
    description:
      'Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.',
    figureLabel:
      'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
  },
} as const

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

  it('renders the English syllable composition intro between the hero and module tabs', () => {
    renderRoute('/pinyin')

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Pinyin（零基础第一课）',
    })
    const hero = heading.closest('section')
    const figure = screen.getByRole('figure', {
      name: syllableIntroCopy.en.figureLabel,
    })
    const tabs = screen.getByRole('tablist', { name: 'Pinyin modules' })
    const intro = within(figure)

    if (!hero) {
      throw new Error('Missing Pinyin hero')
    }

    expect(intro.getByText(syllableIntroCopy.en.description)).toBeVisible()
    expect(intro.getByText('Pinyin')).toBeVisible()
    expect(intro.getByText('Initial')).toBeVisible()
    expect(intro.getByText('Final')).toBeVisible()
    expect(intro.getByText('Tone')).toBeVisible()
    expect(intro.getByText('mā')).toBeVisible()
    expect(intro.getByText('妈')).toBeVisible()
    expect(intro.getByText('m')).toBeVisible()
    expect(intro.getByText('a')).toBeVisible()
    expect(intro.getByText('¯')).toBeVisible()
    expect(
      hero.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      figure.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('keeps exactly one syllable composition intro while switching all four modules', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    const figure = screen.getByRole('figure', {
      name: syllableIntroCopy.en.figureLabel,
    })

    for (const moduleName of ['Finals', 'Tones', 'Whole Syllables', 'Initials']) {
      await user.click(screen.getByRole('tab', { name: moduleName }))
      expect(
        screen.getByRole('figure', { name: syllableIntroCopy.en.figureLabel }),
      ).toBe(figure)
      expect(
        screen.getAllByRole('figure', { name: syllableIntroCopy.en.figureLabel }),
      ).toHaveLength(1)
    }
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
    expect(screen.getByText('shī')).toBeVisible()
    expect(screen.getByText('rī')).toBeVisible()
    expect(screen.getByText('wū')).toBeVisible()
    expect(screen.getByText('yūn')).toBeVisible()
    expect(screen.getByText('ying')).toBeVisible()
    expect(screen.getByText('yīng')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play zhi' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play ying' })).toBeVisible()
    expect(screen.queryByText('知')).not.toBeInTheDocument()
    expect(screen.queryByText('英')).not.toBeInTheDocument()
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

  it('links back to home', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home')
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
    expect(screen.getByRole('link', { name: 'Retour à l’accueil' })).toHaveAttribute(
      'href',
      '/home',
    )

    const figure = screen.getByRole('figure', {
      name: syllableIntroCopy.fr.figureLabel,
    })
    const intro = within(figure)

    expect(intro.getByText(syllableIntroCopy.fr.description)).toBeVisible()
    expect(intro.getByText('Initiale')).toBeVisible()
    expect(intro.getByText('Finale')).toBeVisible()
    expect(intro.getByText('Ton')).toBeVisible()
    expect(intro.getByText('mā')).toBeVisible()
    expect(intro.getByText('妈')).toBeVisible()
    expect(intro.getByText('¯')).toBeVisible()

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
