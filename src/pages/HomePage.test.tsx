import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

const expectedLessonHrefs = expectedLessonTopicOrder.map((topic) => `/lesson/${topic.id}`)
const expectedJourneyTitles = expectedLessonTopicOrder.map((topic) =>
  expectedLessonTopicPattern(topic, 'en'),
)

const expectedSeriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Basic Chinese expressions for a stress-free journey',
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

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows only the English hero slogan when English is selected', () => {
    renderRoute('/home')

    expect(screen.getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(screen.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(
      screen.queryByText('Apprenez le mandarin dans la vie quotidienne'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Real-life Mandarin')).not.toBeInTheDocument()
    expect(screen.queryByText('Mandarin en situation')).not.toBeInTheDocument()
    expect(screen.queryByText(/A focused ten-lesson path/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Un parcours ciblé de dix leçons/i)).not.toBeInTheDocument()
  })

  it('renders the approved Pinyin and ten-card Journey series as labeled siblings', () => {
    renderRoute('/home')

    const courseSeries = getHomeCourseSeries()
    const pinyinSection = getHomePinyinSeries()
    const journeySection = getHomeJourneySeries()
    const pinyinEntry = within(pinyinSection).getByRole('link', {
      name: expectedSeriesCopy.en.pinyin,
    })
    const journeyLessonLinks = within(journeySection)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
    expect(within(pinyinSection).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.en.pinyin,
    })).toBeVisible()
    expect(within(journeySection).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.en.journey,
    })).toBeVisible()
    expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
    expect(pinyinSection.parentElement).toHaveClass('course-series__list')
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(pinyinEntry).toHaveClass('course-series__pinyin-link')
    expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(within(journeySection).queryByRole('link', { name: /pinyin/i }))
      .not.toBeInTheDocument()
    expect(journeyLessonLinks).toHaveLength(10)
    expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
    expect(within(journeySection).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(journeySection).not.toHaveTextContent(' / ')
    expect(screen.queryByText('Journey Map')).not.toBeInTheDocument()
    expect(screen.queryByText('Arrive in China step by step')).not.toBeInTheDocument()

    for (const [index, title] of expectedJourneyTitles.entries()) {
      const topic = expectedLessonTopicOrder[index]
      const heading = within(journeySection).getByRole('heading', { level: 3, name: title })

      expect(heading).toBeVisible()
      expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
      expect(within(heading).getByText(topic.en)).toHaveClass('lesson-topic-title__secondary')
    }
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
    expect(within(hero).getByText('Learn Mandarin in real life scenarios')).toBeVisible()
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
    expect(screen.queryByText('Learn Mandarin in real life scenarios')).not.toBeInTheDocument()
    expect(
      screen.getByText('Apprenez le mandarin dans la vie quotidienne'),
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

    expect(screen.getByText('Arrivée')).toBeVisible()
    expect(screen.getByText('Taxi')).toBeVisible()
    expect(screen.getByText('Installation')).toBeVisible()
    expect(screen.getByText('Supérette')).toBeVisible()
    expect(screen.getByText('Restaurant')).toBeVisible()
    expect(screen.getByText('Métro')).toBeVisible()
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
    expect(screen.queryByText('Learn Mandarin in real life scenarios')).not.toBeInTheDocument()
    expect(screen.getByText('Apprenez le mandarin dans la vie quotidienne')).toBeVisible()
    expect(getHomeJourneySeries('fr')).toBeVisible()
    expect(screen.queryByRole('navigation', { name: /accès rapides d’apprentissage/i }))
      .not.toBeInTheDocument()

    await user.click(englishButton)

    expect(loadProgress().selectedExplanationLanguage).toBe('en')
    expect(englishButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(
      screen.queryByText('Apprenez le mandarin dans la vie quotidienne'),
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
    ).toHaveAttribute('href', '/lesson/self-intro')
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
})
