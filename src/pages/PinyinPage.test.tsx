import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'
import { loadPinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { speakChinese, preloadAudioSources } from '../lib/speech'
import { MockCourseProvider, MockPinyinCourseProvider } from '../test/mockContentProvider'
import { renderRoute } from '../test/renderRoute'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
  preloadAudioSources: vi.fn(),
}))

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const syllableIntroCopy = {
  en: {
    description:
      'Pinyin is the official phonetic system for learning Mandarin Chinese. A syllable can consist of an initial, a final, and a tone. Tones change the meaning of words.',
    figureLabel:
      'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
  },
  fr: {
    description:
      'Le pinyin est le système phonétique officiel pour apprendre le mandarin. Une syllabe peut être composée d’une initiale, d’une finale et d’un ton. Les tons changent le sens des mots.',
    figureLabel:
      'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
  },
} as const

describe('PinyinPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(speakChinese).mockReset()
    vi.mocked(preloadAudioSources).mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the Pinyin lesson hero', () => {
    renderRoute('/pinyin')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pinyin（Mandarin Phonetic System）' }),
    ).toBeVisible()
  })

  it('renders the English syllable composition intro between the hero and module tabs', () => {
    renderRoute('/pinyin')

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Pinyin（Mandarin Phonetic System）',
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
      '③Whole Syllables',
      '④Tones',
    ])
  })

  it('supports ArrowRight/ArrowLeft/Home/End keyboard navigation on the module tablist', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    const tablist = screen.getByRole('tablist', { name: 'Pinyin modules' })
    const selected = within(tablist).getByRole('tab', { selected: true })

    selected.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Finals' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Tones' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Initials' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Tones' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Initials' })).toHaveAttribute('aria-selected', 'true')
  })

  it('renders reference cards with audio playback entry points for the default module', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Bilabial' })).toBeVisible()
    expect(screen.getByText('b', { selector: '.pinyin-reference-card__phoneme' })).toBeVisible()
    expect(screen.queryByText('八')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play bā' })).toBeVisible()
  })

  it('shows annotation markers and footnotes for er and ü in the finals module', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    await user.click(screen.getByRole('tab', { name: 'Finals' }))

    const noteMarkers = screen.getAllByText('※')
    expect(noteMarkers).toHaveLength(4)

    expect(screen.getByText('Spelling rule for ü: when following j, q, x, the dots are omitted in writing, but we still pronounce it as ü. Examples: ju, qu, xu.')).toBeVisible()
    expect(
      screen.getByText('er is an exceptional curled-tongue final. It cannot be combined with any initial consonants. Example: 耳朵 ěr duo — ear.'),
    ).toBeVisible()
  })

  it('renders er/ü rule notes beside their cards instead of inside them', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    await user.click(screen.getByRole('tab', { name: 'Finals' }))

    const notedItems = screen.getAllByTestId('pinyin-noted-item')
    expect(notedItems).toHaveLength(2)

    const spellingRule = screen.getByText(
      /Spelling rule for ü: when following j, q, x/,
    )
    expect(spellingRule).toBeVisible()
    expect(spellingRule.closest('.pinyin-reference-note')).not.toBeNull()

    const üCard = screen.getByText('ü', { selector: '.pinyin-reference-card__phoneme' }).closest(
      '.pinyin-reference-card',
    )
    expect(üCard).not.toBeNull()
    expect(üCard?.querySelector('.pinyin-reference-card__description')?.textContent).not.toContain(
      'Spelling rule for ü',
    )
  })

  it('switches to the whole syllables module and renders all sixteen cards', async () => {
    const user = userEvent.setup()
    renderRoute('/pinyin')

    await user.click(screen.getByRole('tab', { name: 'Whole Syllables' }))

    expect(screen.getByText('zhi', { selector: '.pinyin-reference-card__phoneme' })).toBeVisible()
    expect(screen.getByText('ying', { selector: '.pinyin-reference-card__phoneme' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play zhi' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play ying' })).toBeVisible()
    expect(screen.queryByText('zhī')).not.toBeInTheDocument()
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

  it('omits the bottom back-to-home action since the top nav covers Home', () => {
    renderRoute('/pinyin')

    expect(screen.queryByRole('link', { name: 'Back to home' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Go to practice' })).not.toBeInTheDocument()
  })

  it('localizes Pinyin page chrome and audio labels for French learners', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 2, name: 'Bilabiales' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Écouter bā' })).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Retour à l’accueil' })).not.toBeInTheDocument()

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
