import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { journeyNodes } from '../content/journey'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const orderedJourneyNodes = [...journeyNodes].sort((left, right) => left.pathOrder - right.pathOrder)
const expectedJourneyLessonHrefs = [
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/convenience-store-run',
]

function journeyTitle(node: (typeof journeyNodes)[number], language: 'en' | 'fr' = 'en') {
  return getLocalizedText(node.title, language)
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

function getJourneyNodeCard(title: string) {
  const name = new RegExp(`^${escapeRegExp(title)}\\b`, 'i')

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
    expect(screen.getAllByText(/1 leçon sur 5 terminée/i)[0]).toBeVisible()

    const summary = screen.getByRole('region', { name: /résumé du parcours/i })
    expect(within(summary).getByRole('heading', { name: /leçon en cours/i })).toBeVisible()
    expect(within(summary).getByText(/arrivée à l’hôtel ou à l’appartement/i)).toBeVisible()

    const stats = screen.getByRole('region', { name: /indicateurs d’apprentissage/i })
    expect(within(stats).getByText(/leçons terminées/i)).toBeVisible()
    expect(within(stats).getByText(/1 leçon sur 5 terminée/i)).toBeVisible()
    expect(within(stats).getByText(/file de révision/i)).toBeVisible()
    expect(within(stats).getByText(/2 cartes en attente/i)).toBeVisible()
    expect(within(stats).getByText(/maîtrise du parcours/i)).toBeVisible()
    expect(within(stats).getByText('20%')).toBeVisible()

    const journeyMap = screen.getByRole('region', { name: /carte de progression du parcours/i })
    const lessonJourneyTitles = orderedJourneyNodes.map((node) => journeyTitle(node, 'fr'))

    for (const title of lessonJourneyTitles) {
      expect(within(journeyMap).getByText(title)).toBeVisible()
    }
    expect(within(journeyMap).getByText('Terminée')).toBeVisible()
    expect(within(journeyMap).getByText('En cours')).toBeVisible()
    expect(within(journeyMap).getAllByText('À venir')).toHaveLength(3)
    expect(within(journeyMap).queryAllByText('Aperçu')).toHaveLength(0)
  })

  it('renders the shared arrival journey map in path order with five lesson nodes and zero previews', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const cards = Array.from(journeyMap.querySelectorAll<HTMLElement>('.journey-node'))

    expect(cards).toHaveLength(orderedJourneyNodes.length)
    expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
      orderedJourneyNodes.map((node) => node.id),
    )
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
    expect(within(journeyMap).queryAllByText('Preview')).toHaveLength(0)
    expect(within(journeyMap).getAllByText('Upcoming')).toHaveLength(5)
  })

  it('reuses the Home hand-drawn/kawaii journey card visual hooks on Progress', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const taxiCard = getJourneyNodeCard('Taxi to your stay')
    const paymentCard = getJourneyNodeCard('Phone number & mobile payment')

    expect(journeyMap.querySelectorAll('.journey-node')).toHaveLength(orderedJourneyNodes.length)
    expect(taxiCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(taxiCard.querySelector('.journey-node__doodle')).toHaveTextContent('🚕')
    expect(within(taxiCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')

    expect(paymentCard).toHaveRole('link')
    expect(paymentCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(paymentCard.querySelector('.journey-node__doodle')).toHaveTextContent('📱')
    expect(within(paymentCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')
    expect(within(paymentCard).queryAllByText(/coming soon/i)).toHaveLength(0)
  })

  it('counts mastery from all five complete lesson nodes', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const stats = screen.getByRole('region', { name: /learning indicators/i })
    expect(within(stats).getByText('1/5')).toBeVisible()
    expect(within(stats).getByText('20%')).toBeVisible()
    expect(screen.getAllByText(/1 of 5 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 3/i)).not.toBeInTheDocument()
  })

  it('maps learner progress to completed, current, and upcoming journey statuses only', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'phone-and-payment',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard('Airport immigration basics')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('Taxi to your stay')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('Hotel / apartment check-in')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('Phone number & mobile payment')).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard('First convenience store run')).getByText('Upcoming')).toBeVisible()
    expect(within(getJourneyMap()).queryAllByText('Preview')).toHaveLength(0)
  })

  it('uses the next lesson as current after completing lesson 3', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'order-food',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard('Hotel / apartment check-in')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('Phone number & mobile payment')).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard('First convenience store run')).getByText('Upcoming')).toBeVisible()
    expect(within(getProgressSummary()).getByText(/phone number & mobile payment/i)).toBeVisible()
  })

  it('uses the final lesson as current after completing lesson 4', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food', 'phone-and-payment'],
      lastVisitedLesson: 'phone-and-payment',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard('Phone number & mobile payment')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('First convenience store run')).getByText('Current')).toBeVisible()
    expect(within(getProgressSummary()).getByText('First convenience store run')).toBeVisible()
  })

  it('makes all five journey nodes whole-card links to existing lesson routes', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const lessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(lessonLinks).toHaveLength(5)
    expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedJourneyLessonHrefs)

    for (const node of orderedJourneyNodes) {
      const card = getJourneyNodeCard(journeyTitle(node))
      expect(card).toHaveRole('link')
      expect(card).toHaveClass('journey-node--card-link')
    }

    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryByRole('button', { name: /first convenience store run/i }))
      .not.toBeInTheDocument()
  })

  it('does not render preview panels or preview-only status for the upgraded lesson nodes', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
      reviewQueue: ['self-intro-review-1'],
    })

    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const paymentCard = getJourneyNodeCard('Phone number & mobile payment')
    const storeCard = getJourneyNodeCard('First convenience store run')

    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(paymentCard).toHaveRole('link')
    expect(storeCard).toHaveRole('link')
    expect(within(paymentCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(within(storeCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('1/5')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('20%')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent(
      /1 review item waiting/i,
    )
  })
})
