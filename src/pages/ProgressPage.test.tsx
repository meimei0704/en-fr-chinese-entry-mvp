import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { journeyNodes } from '../content/journey'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import {
  expectedLessonTopic,
  expectedLessonTopicOrder,
  expectedLessonTopicPattern,
} from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

const orderedJourneyNodes = [...journeyNodes].sort((left, right) => left.pathOrder - right.pathOrder)
const expectedJourneyLessonHrefs = [
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/convenience-store-run',
  '/lesson/restaurant-order',
  '/lesson/metro-ticket',
  '/lesson/pharmacy-help',
  '/lesson/ask-for-help-problem',
  '/lesson/train-station-ticket',
]

function journeyTitle(node: (typeof journeyNodes)[number], language: 'en' | 'fr' = 'en') {
  if (node.kind === 'lesson' && node.lessonId) {
    const topic = expectedLessonTopicOrder.find((entry) => entry.id === node.lessonId)

    if (topic) {
      return expectedLessonTopic(topic, language)
    }
  }

  return getLocalizedText(node.title, language)
}

function journeyTitlePattern(node: (typeof journeyNodes)[number], language: 'en' | 'fr' = 'en') {
  if (node.kind === 'lesson' && node.lessonId) {
    const topic = expectedLessonTopicOrder.find((entry) => entry.id === node.lessonId)

    if (topic) {
      return expectedLessonTopicPattern(topic, language)
    }
  }

  return new RegExp(escapeRegExp(getLocalizedText(node.title, language)), 'i')
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getJourneyMap() {
  return screen.getByRole('region', { name: /progress journey map/i })
}

function getProgressSummary() {
  return screen.getByRole('region', { name: /learning path summary/i })
}

function getJourneyNodeCard(title: string | RegExp) {
  const name = typeof title === 'string' ? new RegExp(`^${escapeRegExp(title)}\\b`, 'i') : title

  return (
    within(getJourneyMap()).queryByRole('link', { name }) ??
    within(getJourneyMap()).getByRole('article', { name })
  )
}

describe('ProgressPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows completed lessons, current lesson, review count, and refreshed progress sections', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'order-food',
      reviewQueue: ['order-food-review-1', 'ask-directions-review-1'],
    })

    renderRoute('/progress')

    expect(screen.getByRole('heading', { level: 1, name: /progression/i })).toBeVisible()
    expect(screen.getAllByText(/1 leçon sur 10 terminée/i)[0]).toBeVisible()

    const summary = screen.getByRole('region', { name: /résumé du parcours/i })
    expect(within(summary).getByRole('heading', { name: /leçon en cours/i })).toBeVisible()
    expect(within(summary).getByText('酒店或公寓入住')).toHaveClass('lesson-topic-title__primary')
    expect(within(summary).getByText('Arrivée à l’hôtel ou à l’appartement')).toHaveClass(
      'lesson-topic-title__secondary',
    )
    expect(summary).not.toHaveTextContent(' / ')

    const stats = screen.getByRole('region', { name: /indicateurs d’apprentissage/i })
    expect(within(stats).getByText(/leçons terminées/i)).toBeVisible()
    expect(within(stats).getByText(/1 leçon sur 10 terminée/i)).toBeVisible()
    expect(within(stats).getByText(/file de révision/i)).toBeVisible()
    expect(within(stats).getByText(/2 cartes en attente/i)).toBeVisible()
    expect(within(stats).getByText(/maîtrise du parcours/i)).toBeVisible()
    expect(within(stats).getByText('10%')).toBeVisible()

    const journeyMap = screen.getByRole('region', { name: /carte de progression du parcours/i })
    for (const node of orderedJourneyNodes) {
      expect(
        within(journeyMap).getByRole('heading', {
          level: 3,
          name: journeyTitlePattern(node, 'fr'),
        }),
      ).toBeVisible()
    }
    expect(within(journeyMap).getByText('Terminée')).toBeVisible()
    expect(within(journeyMap).getByText('En cours')).toBeVisible()
    expect(within(journeyMap).getAllByText('À venir')).toHaveLength(8)
    expect(within(journeyMap).queryAllByText('Aperçu')).toHaveLength(0)
  })

  it('renders the shared arrival journey map in path order with ten lesson nodes, one bonus route, and zero previews', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const cards = Array.from(journeyMap.querySelectorAll<HTMLElement>('.journey-node'))

    expect(cards).toHaveLength(11)
    expect(cards).toHaveLength(orderedJourneyNodes.length)
    expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
      orderedJourneyNodes.map((node) => node.id),
    )
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
    expect(journeyMap).not.toHaveTextContent(' / ')
    expect(within(journeyMap).queryAllByText('Preview')).toHaveLength(0)
    expect(within(journeyMap).getAllByText('Upcoming')).toHaveLength(10)
  })

  it('reuses the Home hand-drawn/kawaii journey card visual hooks on Progress', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const taxiCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[1]))
    const restaurantCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))

    expect(journeyMap.querySelectorAll('.journey-node')).toHaveLength(11)
    expect(taxiCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(taxiCard.querySelector('.journey-node__doodle')).toHaveTextContent('🚕')
    expect(within(taxiCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')

    expect(restaurantCard).toHaveRole('link')
    expect(restaurantCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(restaurantCard.querySelector('.journey-node__doodle')).toHaveTextContent('🍜')
    expect(within(restaurantCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')
    expect(within(restaurantCard).queryAllByText(/coming soon/i)).toHaveLength(0)
  })

  it('counts mastery from all ten complete lesson nodes', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const stats = screen.getByRole('region', { name: /learning indicators/i })
    expect(within(stats).getByText('1/10')).toBeVisible()
    expect(within(stats).getByText('10%')).toBeVisible()
    expect(screen.getAllByText(/1 of 10 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 11/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/1 of 5/i)).not.toBeInTheDocument()
  })

  it('shows the pinyin bonus route without adding it to lesson mastery totals', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const pinyinEntry = within(getJourneyMap()).getByRole('link', { name: /pinyin/i })

    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(screen.getAllByText(/1 of 10 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 11/i)).not.toBeInTheDocument()
  })

  it('maps learner progress to completed, current, and upcoming journey statuses only', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'phone-and-payment',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[0]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[1]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[2]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[3]))).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[4]))).getByText('Upcoming')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))).getByText('Upcoming')).toBeVisible()
    expect(within(getJourneyMap()).queryAllByText('Preview')).toHaveLength(0)
  })

  it('uses the next lesson as current after completing lesson 3', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'order-food',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[2]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[3]))).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[4]))).getByText('Upcoming')).toBeVisible()
    expect(within(getProgressSummary()).getByText('手机号码和移动支付')).toHaveClass(
      'lesson-topic-title__primary',
    )
  })

  it('uses lesson six as current after completing lesson five', () => {
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

    renderRoute('/progress')

    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[4]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[6]))).getByText('Upcoming')).toBeVisible()
    expect(within(getProgressSummary()).getByText('点一份简单的饭')).toHaveClass(
      'lesson-topic-title__primary',
    )
  })

  it('makes all ten lesson journey nodes and the pinyin bonus node whole-card links', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const lessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))
    const pinyinEntry = within(journeyMap).getByRole('link', { name: /pinyin/i })

    expect(lessonLinks).toHaveLength(10)
    expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedJourneyLessonHrefs)
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')

    for (const node of orderedJourneyNodes) {
      const card = getJourneyNodeCard(journeyTitlePattern(node))
      expect(card).toHaveRole('link')
      expect(card).toHaveClass('journey-node--card-link')
    }

    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryByRole('button', { name: /buy a metro ticket/i }))
      .not.toBeInTheDocument()
  })

  it('does not render preview panels or preview-only status for formal lesson nodes', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
      reviewQueue: ['self-intro-review-1'],
    })

    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const restaurantCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))
    const trainCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[9]))

    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(restaurantCard).toHaveRole('link')
    expect(trainCard).toHaveRole('link')
    expect(within(restaurantCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(within(trainCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('1/10')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('10%')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent(
      /1 review item waiting/i,
    )
  })
})
