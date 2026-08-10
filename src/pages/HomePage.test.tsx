import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'
import { createDefaultPinyinProgress, savePinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { MockCourseProvider, MockPinyinCourseProvider } from '../test/mockContentProvider'
import { renderRoute } from '../test/renderRoute'

const expectedLessonHrefs = expectedLessonTopicOrder.map((topic) => `/lesson/${topic.id}`)
const expectedJourneyTitles = expectedLessonTopicOrder.map((topic) =>
  expectedLessonTopicPattern(topic, 'en'),
)

const expectedSeriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Useful sentences, expressions and Hanzi recognition',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
  },
} as const

function getHomeCourseSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].label })
}

function getHomePinyinSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].pinyin })
}

function getHomeJourneySeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].journey })
}

function expectTokenizedSeriesTitle(section: HTMLElement, title: string) {
  const heading = within(section).getByRole('heading', { level: 2, name: title })
  const tokens = Array.from(
    heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    (token) => token.textContent,
  )

  expect(heading.textContent).toBe(title)
  expect(tokens).toEqual(title.split(/\s+/u))
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows only the English hero slogan when English is selected', () => {
    renderRoute('/home')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.getByText('Basic Chinese expressions for a stress-free travel')).toBeVisible()
    expect(
      screen.queryByText('Apprenez les dialogues essentiels pour voyager en Chine'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Real-life Mandarin')).not.toBeInTheDocument()
    expect(screen.queryByText('Mandarin en situation')).not.toBeInTheDocument()
    expect(screen.queryByText(/A focused ten-lesson path/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Un parcours ciblé de dix leçons/i)).not.toBeInTheDocument()
  })

  it('renders vertical full-card course entries before the unchanged Home Journey path', () => {
    renderRoute('/home')

    const courseSeries = getHomeCourseSeries()
    const pinyinSection = getHomePinyinSeries()
    const journeySection = getHomeJourneySeries()
    const list = courseSeries.querySelector<HTMLElement>('.course-series__list')
    const pinyinEntry = within(pinyinSection).getByRole('link', {
      name: expectedSeriesCopy.en.pinyin,
    })
    const journeyEntry = within(journeySection).getByRole('link', {
      name: expectedSeriesCopy.en.journey,
    })
    const journeyPath = journeySection.querySelector<HTMLElement>('#home-basic-expressions-path')

    if (!list || !journeyPath) {
      throw new Error('Expected the Home course-series list and fragment target')
    }

    const journeyLessonLinks = within(journeyPath)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
    expect(Array.from(list.children)).toEqual([pinyinSection, journeySection])
    expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(pinyinEntry).toHaveClass('course-series__entry-card', 'course-series__pinyin-link')
    expect(journeyEntry.tagName).toBe('A')
    expect(journeyEntry).toHaveAttribute('href', '#home-basic-expressions-path')
    expect(journeyEntry).toHaveClass('course-series__entry-card', 'course-series__journey-link')
    expect(journeyPath).toHaveClass('course-series__journey-path', 'journey-map')
    expect(journeyPath.parentElement).toBe(journeySection)
    expect(journeySection.children[0]).toBe(journeyEntry)
    expect(journeySection.children[1]).toBe(journeyPath)
    expect(
      pinyinEntry.compareDocumentPosition(journeyEntry) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      journeyEntry.compareDocumentPosition(journeyPath) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    expectTokenizedSeriesTitle(pinyinSection, expectedSeriesCopy.en.pinyin)
    expectTokenizedSeriesTitle(journeySection, expectedSeriesCopy.en.journey)
    expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(journeyEntry.querySelector('.course-series__journey-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )

    expect(journeyLessonLinks).toHaveLength(12)
    expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
    expect(within(journeyPath).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(journeySection).not.toHaveTextContent(' / ')

    for (const [index, title] of expectedJourneyTitles.entries()) {
      const topic = expectedLessonTopicOrder[index]
      const heading = within(journeyPath).getByRole('heading', { level: 3, name: title })

      expect(heading).toBeVisible()
      expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
      expect(within(heading).getByText(topic.en)).toHaveClass('lesson-topic-title__secondary')
    }
  })

  it('keeps both Home entry cards count-free with non-zero progress in both stores', () => {
    savePinyinProgress({
      ...createDefaultPinyinProgress(),
      visited: true,
      completedSections: ['reference', 'practice'],
    })
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/home')

    const pinyinEntry = within(getHomePinyinSeries()).getByRole('link', {
      name: expectedSeriesCopy.en.pinyin,
    })
    const journeyEntry = within(getHomeJourneySeries()).getByRole('link', {
      name: expectedSeriesCopy.en.journey,
    })

    expect(pinyinEntry).not.toHaveTextContent('2 of 3 sections complete')
    expect(journeyEntry).not.toHaveTextContent('1 of 10 lessons completed')
  })

  it('centers the hero theme and removes the old right-side learning mockup', () => {
    renderRoute('/home')

    const hero = screen.getByRole('region', { name: /home hero/i })

    expect(hero).toHaveClass('home-hero--centered')
    expect(within(hero).getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.queryByRole('region', { name: /learning preview mockup/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /hero phrase/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /listen|écouter/i })).not.toBeInTheDocument()
    expect(screen.queryByText('护照')).not.toBeInTheDocument()

    const journeySeries = getHomeJourneySeries()
    expect(within(journeySeries).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(within(journeySeries).queryByRole('button', { name: /buy a metro ticket/i }))
      .not.toBeInTheDocument()
    expect(within(journeySeries).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.en.journey,
    })).toBeVisible()
    expect(screen.queryByText('Journey Map')).not.toBeInTheDocument()
    expect(screen.queryByText('Arrive in China step by step')).not.toBeInTheDocument()
    expect(within(hero).queryByText(/Real-life Mandarin|Mandarin en situation/i)).not.toBeInTheDocument()
    expect(within(hero).queryByText(/focused ten-lesson|parcours ciblé/i)).not.toBeInTheDocument()
    expect(within(hero).queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
  })

  it('renders one aria-hidden supplied illustration behind unchanged home hero content', () => {
    const { container } = renderRoute('/home')

    const hero = screen.getByRole('region', { name: /home hero/i })
    const illustration = hero.querySelector('.home-hero__illustration')
    const image = illustration?.querySelector('img.home-hero__illustration-image')
    const veil = illustration?.querySelector('.home-hero__illustration-veil')

    expect(hero.querySelectorAll('.home-hero__illustration')).toHaveLength(1)
    expect(illustration).toHaveAttribute('aria-hidden', 'true')
    expect(illustration?.querySelectorAll('img.home-hero__illustration-image')).toHaveLength(1)
    expect(image).toHaveAttribute('src', '/images/home-hero-chinese-elements.webp')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(illustration?.querySelectorAll('.home-hero__illustration-veil')).toHaveLength(1)
    expect(veil).toBeInTheDocument()
    expect(illustration?.querySelectorAll('a, button, [tabindex]')).toHaveLength(0)
    expect(hero.querySelectorAll('.home-hero__scroll-scene, svg.home-hero__scroll-svg')).toHaveLength(0)
    expect(container.querySelectorAll('[data-home-hero-motif]')).toHaveLength(0)
    expect(within(hero).getByRole('group', { name: 'Explanation language' })).toBeVisible()
    expect(within(hero).getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(within(hero).getByText('Basic Chinese expressions for a stress-free travel')).toBeVisible()
  })

  it('renders page-level French copy when the learner chooses French mode', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/home')

    const courseSeries = getHomeCourseSeries('fr')
    const pinyinSeries = getHomePinyinSeries('fr')
    const journeySeries = getHomeJourneySeries('fr')

    expect(within(courseSeries).getByText(expectedSeriesCopy.fr.label)).toBeVisible()
    expect(within(pinyinSeries).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.fr.pinyin,
    })).toBeVisible()
    expect(within(journeySeries).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.fr.journey,
    })).toBeVisible()
    expect(within(pinyinSeries).getByRole('link', {
      name: expectedSeriesCopy.fr.pinyin,
    })).toHaveAttribute('href', '/pinyin')
    expect(screen.queryByText(expectedSeriesCopy.en.label)).not.toBeInTheDocument()
    expect(screen.queryByText(expectedSeriesCopy.en.pinyin)).not.toBeInTheDocument()
    expect(screen.queryByText(expectedSeriesCopy.en.journey)).not.toBeInTheDocument()
    expect(screen.queryByText('Carte du parcours')).not.toBeInTheDocument()
    expect(screen.queryByText('Arriver en Chine étape par étape')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.queryByText('Basic Chinese expressions for a stress-free travel')).not.toBeInTheDocument()
    expect(
      screen.getByText('Apprenez les dialogues essentiels pour voyager en Chine'),
    ).toBeVisible()
    expect(screen.queryByRole('link', { name: /continuer la leçon/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /réviser/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/prochaine leçon/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/file de révision/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/carte du cours/i)).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'fr'),
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'fr'),
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[9], 'fr'),
      }),
    ).toBeVisible()
    expect(getHomeJourneySeries('fr')).not.toHaveTextContent(' / ')
    expect(screen.queryByRole('navigation', { name: /accès rapides d’apprentissage/i }))
      .not.toBeInTheDocument()

    expect(screen.getByText('Bonjour')).toBeVisible()
    expect(screen.getByText('Arrivée')).toBeVisible()
    expect(screen.getByText('Taxi')).toBeVisible()
    expect(screen.getByText('Hôtel')).toBeVisible()
    expect(screen.getByText('Carte SIM')).toBeVisible()
    expect(screen.getByText('Restaurant')).toBeVisible()
    expect(screen.getByText('Train')).toBeVisible()
    expect(screen.getByText('Métro')).toBeVisible()
    expect(screen.getAllByText('Shopping').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Aide')).toBeVisible()
    expect(screen.getByText('Pharmacie')).toBeVisible()
    expect(screen.getByText('Conversation')).toBeVisible()
    expect(screen.queryAllByText(/bientôt/i)).toHaveLength(0)
    expect(screen.queryByText('10 lessons')).not.toBeInTheDocument()
    expect(screen.queryByText('Intro')).not.toBeInTheDocument()
    expect(screen.queryByText('Mandarin en situation')).not.toBeInTheDocument()
    expect(screen.queryByText(/Un parcours ciblé de dix leçons/i)).not.toBeInTheDocument()

    const journeyMap = getHomeJourneySeries('fr')
    expect(within(journeyMap).queryAllByText(/ouvrir la leçon/i)).toHaveLength(0)
    expect(within(journeyMap).queryAllByText(/ouvrir la lecon/i)).toHaveLength(0)
    expect(screen.queryByRole('region', { name: /maquette d’aperçu d’apprentissage/i }))
      .not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /écouter/i })).not.toBeInTheDocument()
  })

  it('persists a global explanation language choice from the Home hero', async () => {
    const user = userEvent.setup()

    renderRoute('/')

    const languageSelector = screen.getByRole('group', { name: /explanation language/i })
    const englishButton = within(languageSelector).getByRole('button', { name: 'English' })
    const frenchButton = within(languageSelector).getByRole('button', { name: 'Français' })

    expect(englishButton).toHaveAttribute('aria-pressed', 'true')
    expect(frenchButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(frenchButton)

    expect(loadProgress().selectedExplanationLanguage).toBe('fr')
    expect(frenchButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByText('Basic Chinese expressions for a stress-free travel')).not.toBeInTheDocument()
    expect(screen.getByText('Apprenez les dialogues essentiels pour voyager en Chine')).toBeVisible()
    expect(getHomeJourneySeries('fr')).toBeVisible()
    expect(screen.queryByRole('navigation', { name: /accès rapides d’apprentissage/i }))
      .not.toBeInTheDocument()

    await user.click(englishButton)

    expect(loadProgress().selectedExplanationLanguage).toBe('en')
    expect(englishButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Basic Chinese expressions for a stress-free travel')).toBeVisible()
    expect(
      screen.queryByText('Apprenez les dialogues essentiels pour voyager en Chine'),
    ).not.toBeInTheDocument()
    expect(getHomeJourneySeries()).toBeVisible()
    expect(screen.queryByRole('navigation', { name: /quick learning paths/i }))
      .not.toBeInTheDocument()
  })

  it('removes hero quick entry cards without changing lesson card destinations', () => {
    saveProgress({
      ...createDefaultProgress(),
      lastVisitedLesson: 'order-food',
      reviewQueue: ['self-intro-review-1'],
    })

    renderRoute('/home')

    expect(screen.queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /go to review/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view progress/i })).not.toBeInTheDocument()

    const journeyMap = getHomeJourneySeries()
    expect(
      within(journeyMap).getByRole('link', {
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'en'),
      }),
    ).toHaveAttribute('href', '/lesson/daily-greetings')
    expect(
      within(journeyMap).getByRole('link', {
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'en'),
      }),
    ).toHaveAttribute('href', '/lesson/restaurant-order')
  })

  it('does not expose next-lesson state on the home page even after lessons are complete', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: [
        'self-intro',
        'ask-directions',
        'order-food',
        'phone-and-payment',
        'convenience-store-run',
      ],
      lastVisitedLesson: 'convenience-store-run',
    })

    renderRoute('/home')

    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/next lesson/i)).not.toBeInTheDocument()

    const journeyMap = getHomeJourneySeries()
    expect(
      within(journeyMap).getByRole('link', {
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'en'),
      }),
    ).toHaveAttribute('href', '/lesson/restaurant-order')
  })

  it('makes each lesson journey node a whole-card link to its real lesson route', () => {
    renderRoute('/home')

    const journeyMap = getHomeJourneySeries()

    for (const [index, title] of expectedJourneyTitles.entries()) {
      const card = within(journeyMap).getByRole('link', { name: title })
      expect(card).toHaveAttribute('href', expectedLessonHrefs[index])
      expect(card).toHaveClass('journey-node--card-link')
      expect(card).not.toHaveTextContent(/open lesson/i)
      expect(card.querySelector('.journey-node__cta')).not.toBeInTheDocument()
    }

    expect(within(journeyMap).queryAllByText(/open lesson/i)).toHaveLength(0)
    expect(within(journeyMap).queryByRole('link', { name: /^open lesson$/i })).not.toBeInTheDocument()
  })

  it('keeps the journey map as the only lesson entry section and exposes a stamp illustration slot on each card', () => {
    renderRoute('/home')

    expect(screen.queryByRole('heading', { level: 2, name: /lesson list/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /lesson list/i })).not.toBeInTheDocument()

    const journeyMap = getHomeJourneySeries()
    const restaurantCard = within(journeyMap).getByRole('link', {
      name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'en'),
    })
    const trainCard = within(journeyMap).getByRole('link', {
      name: expectedLessonTopicPattern(expectedLessonTopicOrder[9], 'en'),
    })

    expect(
      restaurantCard.querySelector(
        '.journey-node__illustration-slot--stamp .journey-node__doodle--stamp',
      ),
    ).toBeInTheDocument()
    expect(
      trainCard.querySelector(
        '.journey-node__illustration-slot--stamp .journey-node__doodle--stamp',
      ),
    ).toBeInTheDocument()
  })

  it('keeps all formal lesson nodes out of preview affordances', () => {
    renderRoute('/home')

    const journeyMap = getHomeJourneySeries()
    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryByRole('button', { name: /buy a metro ticket/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryAllByText(/peek inside/i)).toHaveLength(0)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
  })

  it('shows the loading state while the course is being fetched', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/home'] })

    render(
      <MockCourseProvider course={null}>
        <MockPinyinCourseProvider course={null}>
          <RouterProvider router={router} />
        </MockPinyinCourseProvider>
      </MockCourseProvider>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('轻松学中文')
  })

  it('shows the error state with a retry button when the course fetch fails', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/home'] })

    render(
      <MockCourseProvider course={null} error={new Error('boom')}>
        <MockPinyinCourseProvider course={null}>
          <RouterProvider router={router} />
        </MockPinyinCourseProvider>
      </MockCourseProvider>,
    )

    expect(screen.getByText("We couldn’t load the course.")).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
  })
})
