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

  it('shows all ten arrival lesson cards without progress or review shortcuts on the home page', () => {
    renderRoute('/home')

    expect(screen.queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /continue learning/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /go to review/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view progress/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/next lesson/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/review queue/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/course map/i)).not.toBeInTheDocument()

    const journeyMap = screen.getByLabelText(/journey map/i)
    const journeyLessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))
    const pinyinEntry = within(journeyMap).getByRole('link', { name: /pinyin/i })

    expect(journeyLessonLinks).toHaveLength(10)
    expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(journeyMap).not.toHaveTextContent(' / ')

    for (const [index, title] of expectedJourneyTitles.entries()) {
      const topic = expectedLessonTopicOrder[index]
      const heading = within(journeyMap).getByRole('heading', { level: 2, name: title })

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

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(within(journeyMap).queryByRole('button', { name: /buy a metro ticket/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).getByText(/arrive in china step by step/i)).toBeVisible()
    expect(within(hero).queryByText(/Real-life Mandarin|Mandarin en situation/i)).not.toBeInTheDocument()
    expect(within(hero).queryByText(/focused ten-lesson|parcours ciblé/i)).not.toBeInTheDocument()
    expect(within(hero).queryByRole('navigation', { name: /quick learning paths/i })).not.toBeInTheDocument()
  })

  it('renders one aria-hidden long-scroll scene behind the home hero content', () => {
    const { container } = renderRoute('/home')

    const hero = screen.getByRole('region', { name: /home hero/i })
    const scene = container.querySelector('.home-hero__scroll-scene')
    const sceneSvg = scene?.querySelector('svg.home-hero__scroll-svg')

    expect(hero.querySelectorAll('.home-hero__scroll-scene')).toHaveLength(1)
    expect(scene).toHaveAttribute('aria-hidden', 'true')
    expect(sceneSvg).toBeInTheDocument()
    expect(within(hero).getByRole('heading', { level: 1, name: '轻松学中文' })).toBeVisible()
    expect(within(hero).getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(within(hero).queryByText(/Great Wall|Oriental Pearl|panda/i)).not.toBeInTheDocument()
  })

  it('builds the long-scroll scene from detailed, recognizable cultural anchors', () => {
    const { container } = renderRoute('/home')
    const scene = container.querySelector('.home-hero__scroll-scene')
    const culturalAnchors = [
      'great-wall',
      'palace',
      'panda',
      'oriental-pearl',
      'lantern',
      'fan',
      'bamboo',
    ]

    for (const anchor of culturalAnchors) {
      const motif = scene?.querySelector(`[data-home-hero-motif="${anchor}"]`)

      expect(motif, `${anchor} motif`).toBeInTheDocument()
      expect(
        motif?.querySelectorAll('path, circle, ellipse, line, rect, polyline, polygon').length,
        `${anchor} motif vector detail`,
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('renders page-level French copy when the learner chooses French mode', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/home')

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
        level: 2,
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[0], 'fr'),
      }),
    ).toBeVisible()
    expect(screen.getByRole('heading', {
      level: 2,
      name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'fr'),
    })).toBeVisible()
    expect(screen.getByRole('heading', {
      level: 2,
      name: expectedLessonTopicPattern(expectedLessonTopicOrder[9], 'fr'),
    })).toBeVisible()
    expect(screen.getByLabelText(/carte du parcours/i)).not.toHaveTextContent(' / ')
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

    const journeyMap = screen.getByLabelText(/carte du parcours/i)
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
    expect(
      screen.getByRole('region', { name: /carte du parcours/i }),
    ).toBeVisible()
    expect(screen.queryByRole('navigation', { name: /accès rapides d’apprentissage/i }))
      .not.toBeInTheDocument()

    await user.click(englishButton)

    expect(loadProgress().selectedExplanationLanguage).toBe('en')
    expect(englishButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
    expect(
      screen.queryByText('Apprenez le mandarin dans la vie quotidienne'),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: /journey map/i })).toBeVisible()
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

    const journeyMap = screen.getByLabelText(/journey map/i)
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

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(
      within(journeyMap).getByRole('link', {
        name: expectedLessonTopicPattern(expectedLessonTopicOrder[5], 'en'),
      }),
    ).toHaveAttribute('href', '/lesson/restaurant-order')
  })

  it('makes each lesson journey node a whole-card link to its real lesson route', () => {
    renderRoute('/home')

    const journeyMap = screen.getByLabelText(/journey map/i)

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

    const journeyMap = screen.getByLabelText(/journey map/i)
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

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryByRole('button', { name: /buy a metro ticket/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryAllByText(/peek inside/i)).toHaveLength(0)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
  })
})
