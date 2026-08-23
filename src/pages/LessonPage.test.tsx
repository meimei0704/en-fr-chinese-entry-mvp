import '@testing-library/jest-dom/vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'
import { course } from '../content/course'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { MockCourseProvider, MockPinyinCourseProvider } from '../test/mockContentProvider'
import { renderRoute } from '../test/renderRoute'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

describe('LessonPage', () => {
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioPlay = vi.fn()
  const audioConstructor = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    speak.mockReset()
    cancel.mockReset()
    audioPlay.mockReset()
    audioConstructor.mockReset()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [],
    })

    class MockAudio {
      addEventListener = vi.fn()
      currentTime = 0
      load = vi.fn()
      pause = vi.fn()
      play = audioPlay.mockResolvedValue(undefined)
      preload = ''
      removeAttribute = vi.fn()
      src: string

      constructor(src = '') {
        audioConstructor(src)
        this.src = src
      }

      getAttribute(name: string) {
        return name === 'src' ? this.src : null
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  it('wraps the lesson in scannable dialogue region', () => {
    renderRoute('/lesson/self-intro')

    expect(screen.getByRole('region', { name: /dialogue practice/i })).toBeVisible()
    expect(screen.getAllByLabelText(/dialogue line speaker traveler/i)[0]).toHaveTextContent(
      '请问您会说英语吗？',
    )
    expect(screen.getAllByLabelText(/dialogue line speaker traveler/i)[0]).toHaveTextContent(
      'Qǐngwèn nín huì shuō Yīngyǔ ma?',
    )
  })

  it.each([
    ['en', 'We couldn’t find that lesson.', 'Back to home'],
    ['fr', 'Impossible de trouver cette leçon.', 'Retour à l’accueil'],
  ] as const)(
    'keeps progress unchanged for a missing lesson in %s',
    (language, heading, backLabel) => {
      const before = createDefaultProgress()
      before.selectedExplanationLanguage = language
      before.completedLessons = ['self-intro']
      before.reviewQueue = ['self-intro-review-1']
      before.lastVisitedLesson = 'self-intro'
      before.lessonStepProgress = {
        'self-intro': { completedSections: ['dialogue'] },
      }
      saveProgress(before)

      renderRoute('/lesson/not-a-lesson')

      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      expect(screen.getByRole('link', { name: backLabel })).toHaveAttribute('href', '/home')
      expect(loadProgress()).toEqual(before)
    },
  )

  it('updates only lastVisitedLesson when a valid lesson opens', () => {
    const before = createDefaultProgress()
    before.selectedExplanationLanguage = 'fr'
    before.completedLessons = ['self-intro']
    before.reviewQueue = ['self-intro-review-1']
    before.lastVisitedLesson = 'self-intro'
    before.lessonStepProgress = {
      'self-intro': { completedSections: ['dialogue'] },
    }
    saveProgress(before)

    renderRoute('/lesson/ask-directions')

    expect(loadProgress()).toEqual({ ...before, lastVisitedLesson: 'ask-directions' })
  })

  it('renders the full lesson template in the persisted explanation language without a language switcher', async () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/lesson/self-intro')

    expect(
      screen.getByRole('heading', { level: 1, name: /到达机场\s+Arrivée à l’aéroport/i }),
    ).toBeVisible()
    expect(screen.queryByText(/到达机场 \/ Arrivée à l’aéroport/i)).not.toBeInTheDocument()
    expect(screen.getByText('到达机场')).toHaveClass('lesson-topic-title__primary')
    expect(screen.getByText('Arrivée à l’aéroport')).toHaveClass('lesson-topic-title__secondary')
    expect(screen.getByRole('region', { name: /aperçu de progression de la leçon/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /pratique du dialogue/i })).toBeVisible()
    expect(screen.getAllByLabelText(/ligne de dialogue, interlocuteur voyageur/i)[0]).toHaveTextContent(
      '请问您会说英语吗？',
    )
    expect(screen.getByRole('heading', { level: 2, name: /phrases/i })).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /structures utiles/i }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: /vocabulaire/i }),
    ).toBeVisible()
    expect(screen.getByText(/voici mon passeport/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /passer à la pratique/i })).toBeVisible()
    expect(screen.queryByRole('link', { name: /retour à l’accueil/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /explanation language|langue d’explication/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'English' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
    expect(loadProgress().selectedExplanationLanguage).toBe('fr')
  })

  it.each(['en', 'fr'] as const)(
    'renders all lesson page top headings as Chinese plus the %s explanation line',
    (language) => {
      for (const topic of expectedLessonTopicOrder) {
        localStorage.clear()
        saveProgress({
          ...createDefaultProgress(),
          selectedExplanationLanguage: language,
        })

        const { unmount } = renderRoute(`/lesson/${topic.id}`)
        const heading = screen.getByRole('heading', {
          level: 1,
          name: expectedLessonTopicPattern(topic, language),
        })

        expect(heading).toBeVisible()
        expect(heading).not.toHaveTextContent(' / ')
        expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
        expect(within(heading).getByText(topic[language])).toHaveClass(
          'lesson-topic-title__secondary',
        )

        unmount()
      }
    },
  )

  it.each([
    {
      language: 'en',
      removed: /pronunciation|hanzi recognition/i,
      dialogueTitle: 'Asking for help at the airport',
    },
    {
      language: 'fr',
      removed: /prononciation|reconnaissance des hanzi|hanzi à reconnaître/i,
      dialogueTitle: 'Demander de l’aide à l’aéroport',
    },
  ] as const)(
    'shows only the three learner layers in $language',
    ({ language, removed, dialogueTitle }) => {
      saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: language })
      renderRoute('/lesson/self-intro')

      const preview = screen.getByRole('region', {
        name:
          language === 'en'
            ? /lesson progress preview/i
            : /aperçu de progression/i,
      })
      const steps = within(preview).getAllByRole('listitem')
      expect(steps).toHaveLength(3)
      expect(steps.map((step) => step.textContent)).toEqual(
        language === 'en'
          ? ['1Phrases', '2Useful patterns', '3Vocabulary']
          : ['1Phrases', '2Structures utiles', '3Vocabulaire'],
      )
      expect(steps[0]).toHaveClass('is-current')
      expect(preview).not.toHaveTextContent(removed)
      const retainedHeadings =
        language === 'en'
          ? ['Phrases', 'Useful patterns', 'Vocabulary']
          : ['Phrases', 'Structures utiles', 'Vocabulaire']
      for (const heading of retainedHeadings) {
        expect(screen.getByRole('heading', { level: 2, name: heading })).toBeVisible()
      }
      expect(
        screen.queryByRole('heading', { level: 2, name: removed }),
      ).not.toBeInTheDocument()
      expect(screen.queryByText(dialogueTitle)).not.toBeInTheDocument()
    },
  )

  it.each([
    {
      language: 'en',
      railLabel: /lesson progress preview/i,
    },
    {
      language: 'fr',
      railLabel: /aperçu de progression/i,
    },
  ] as const)(
    'links each study layer to its section anchor in $language',
    ({ language, railLabel }) => {
      saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: language })
      renderRoute('/lesson/self-intro')

      const preview = screen.getByRole('region', { name: railLabel })
      const links = within(preview).getAllByRole('link')
      expect(links).toHaveLength(3)
      expect(links.map((link) => link.getAttribute('href'))).toEqual([
        '#lesson-dialogue',
        '#lesson-patterns',
        '#lesson-vocabulary',
      ])

      for (const link of links) {
        const targetId = link.getAttribute('href')?.slice(1)
        expect(targetId).toBeTruthy()
        expect(document.getElementById(targetId!)).not.toBeNull()
      }

      expect(screen.queryByRole('heading', { level: 2, name: /scenario goal|objectif de la scène/i }))
        .not.toBeInTheDocument()
    },
  )

  it('moves the rail highlight to the clicked study layer and keeps it after scrolling', async () => {
    const user = userEvent.setup()
    renderRoute('/lesson/self-intro')

    const preview = screen.getByRole('region', { name: /lesson progress preview/i })
    const steps = within(preview).getAllByRole('listitem')
    const links = within(preview).getAllByRole('link')
    expect(steps[0]).toHaveClass('is-current')
    expect(steps[1]).not.toHaveClass('is-current')
    expect(links[0]).toHaveAttribute('aria-current', 'location')
    expect(links[1]).not.toHaveAttribute('aria-current')

    await user.click(links[1])

    expect(steps[0]).not.toHaveClass('is-current')
    expect(steps[1]).toHaveClass('is-current')
    expect(steps[2]).not.toHaveClass('is-current')
    expect(links[0]).not.toHaveAttribute('aria-current')
    expect(links[1]).toHaveAttribute('aria-current', 'location')

    window.scrollTo(0, 0)
    expect(steps[1]).toHaveClass('is-current')
  })

  it('watches the study layer sections with an IntersectionObserver scrollspy', () => {
    const observe = vi.fn()
    let constructedOptions: IntersectionObserverInit | undefined
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null
      readonly rootMargin = ''
      readonly thresholds: ReadonlyArray<number> = []
      observe = observe
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
      constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        constructedOptions = options
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    try {
      renderRoute('/lesson/self-intro')

      expect(constructedOptions?.rootMargin).toBe('0px 0px -65% 0px')
      expect(constructedOptions?.threshold).toEqual([0, 1])

      const sectionIds = ['lesson-dialogue', 'lesson-patterns', 'lesson-vocabulary']
      for (const id of sectionIds) {
        expect(observe).toHaveBeenCalledWith(expect.objectContaining({ id }))
      }
      expect(observe).toHaveBeenCalledTimes(sectionIds.length)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('keeps the first study layer current when scrolled above its section after layout drift', () => {
    let callback: IntersectionObserverCallback | undefined
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null
      readonly rootMargin = ''
      readonly thresholds: ReadonlyArray<number> = []
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn(() => [])
      constructor(observerCallback: IntersectionObserverCallback) {
        callback = observerCallback
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    try {
      window.innerHeight = 900
      renderRoute('/lesson/self-intro')
      const preview = screen.getByRole('region', { name: /lesson progress preview/i })
      const steps = within(preview).getAllByRole('listitem')

      const rectsBySectionId: Record<string, { top: number; bottom: number }> = {
        'lesson-dialogue': { top: -2500, bottom: -300 },
        'lesson-patterns': { top: 200, bottom: 1200 },
        'lesson-vocabulary': { top: 3000, bottom: 4200 },
      }

      const mockRects = (rects: Record<string, { top: number; bottom: number }>) => {
        for (const id of Object.keys(rects)) {
          const element = document.getElementById(id)
          expect(element).not.toBeNull()
          Object.defineProperty(element, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              left: 0,
              right: 0,
              top: rects[id].top,
              bottom: rects[id].bottom,
            }),
          })
        }
      }

      mockRects(rectsBySectionId)
      act(() => {
        callback?.([] as unknown as IntersectionObserverEntry[], undefined as never)
      })
      expect(steps[1]).toHaveClass('is-current')

      mockRects({
        'lesson-dialogue': { top: 317, bottom: 2731 },
        'lesson-patterns': { top: 2747, bottom: 3773 },
        'lesson-vocabulary': { top: 3789, bottom: 5079 },
      })
      act(() => {
        callback?.([] as unknown as IntersectionObserverEntry[], undefined as never)
      })
      expect(steps[0]).toHaveClass('is-current')
      expect(steps[1]).not.toHaveClass('is-current')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('renders sentence pattern cards with a highlighted placeholder', () => {
    renderRoute('/lesson/daily-greetings')

    const patternSection = screen.getByRole('heading', { level: 2, name: /useful patterns|structures utiles/i })
      .closest('section')!

    const cards = within(patternSection).getAllByRole('article')
    expect(cards.length).toBeGreaterThan(0)

    const first = cards[0]
    expect(first).toHaveClass('study-item--pattern')

    const placeholder = within(first).getByText('……')
    expect(placeholder).toBeVisible()
    expect(placeholder).not.toHaveClass('study-item__title')
  })

  it('shows a completion badge on the lesson header for a completed lesson', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
    })

    renderRoute('/lesson/self-intro')

    expect(screen.getByText('Lesson complete')).toBeVisible()
  })

  it('omits the completion badge for a lesson that is not complete', () => {
    renderRoute('/lesson/self-intro')

    expect(screen.queryByText('Lesson complete')).not.toBeInTheDocument()
  })

  it('keeps only Practice in the lesson action dock', () => {    renderRoute('/lesson/self-intro')
    const actions = screen.getByRole('navigation', { name: /lesson actions/i })

    expect(within(actions).getAllByRole('link')).toHaveLength(1)
    expect(within(actions).getByRole('link', { name: /go to practice/i })).toHaveAttribute(
      'href',
      '/lesson/self-intro/practice',
    )
    expect(within(actions).queryByRole('link', { name: /back to home/i })).not.toBeInTheDocument()
    expect(
      within(actions).queryByRole('link', { name: /finish with short input/i }),
    ).not.toBeInTheDocument()
  })

  it('adds MP3-first playback controls for retained lesson materials', async () => {
    const user = userEvent.setup()
    const lesson = course.lessons[0]
    const patternExampleCount = lesson.sentencePatterns.reduce(
      (count, pattern) => count + (pattern.examples?.length ?? 0),
      0,
    )

    renderRoute(`/lesson/${lesson.id}`)

    const playbackButtons = screen.getAllByRole('button', { name: /play chinese/i })
    expect(playbackButtons).toHaveLength(
      lesson.dialogue.lines.length +
        lesson.sentencePatterns.length +
        patternExampleCount +
        lesson.vocabulary.length,
    )
    expect(screen.queryAllByText(/^Play Chinese$/i)).toHaveLength(0)
    playbackButtons.forEach((button) => {
      expect(button).toHaveAttribute('title', 'Play Chinese')
      expect(button).not.toHaveTextContent(/play chinese/i)
    })

    await user.click(playbackButtons[0])
    await user.click(
      playbackButtons[lesson.dialogue.lines.length + (lesson.sentencePatterns[0]?.examples?.length ?? 0)],
    )
    await user.click(playbackButtons[playbackButtons.length - 1])

    expect(audioPlay).toHaveBeenCalledTimes(3)
    expect(speak).not.toHaveBeenCalled()
  })

  it('fetches the lesson from the API when it is missing from the course context', async () => {
    const lesson = course.lessons.find((entry) => entry.id === 'self-intro')
    if (!lesson) {
      throw new Error('Expected self-intro lesson fixture')
    }
    const courseWithoutLesson = { ...course, lessons: course.lessons.filter((l) => l.id !== lesson.id) }
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(lesson), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/lesson/self-intro'] })

    render(
      <MockCourseProvider course={courseWithoutLesson}>
        <MockPinyinCourseProvider course={null}>
          <RouterProvider router={router} />
        </MockPinyinCourseProvider>
      </MockCourseProvider>,
    )

    expect(await screen.findByRole('link', { name: /go to practice/i })).toBeVisible()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/content/lessons?lessonId=self-intro',
      { credentials: 'same-origin' },
    )
    expect(screen.queryByText(/we couldn’t find that lesson/i)).not.toBeInTheDocument()
  })
})
