import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { journeyNodes } from '../content/journey'
import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const orderedJourneyNodes = [...journeyNodes].sort((left, right) => left.pathOrder - right.pathOrder)

function journeyTitle(node: (typeof journeyNodes)[number], language: 'en' | 'fr' = 'en') {
  return getLocalizedText(node.title, language)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getJourneyMap() {
  return screen.getByRole('region', { name: /progress journey map/i })
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
    expect(screen.getAllByText(/1 leçon sur 3 terminée/i)[0]).toBeVisible()

    const summary = screen.getByRole('region', { name: /résumé du parcours/i })
    expect(within(summary).getByRole('heading', { name: /leçon en cours/i })).toBeVisible()
    expect(within(summary).getByText(/commander à manger/i)).toBeVisible()

    const stats = screen.getByRole('region', { name: /indicateurs d’apprentissage/i })
    expect(within(stats).getByText(/leçons terminées/i)).toBeVisible()
    expect(within(stats).getByText(/1 leçon sur 3 terminée/i)).toBeVisible()
    expect(within(stats).getByText(/file de révision/i)).toBeVisible()
    expect(within(stats).getByText(/2 cartes en attente/i)).toBeVisible()
    expect(within(stats).getByText(/maîtrise du parcours/i)).toBeVisible()
    expect(within(stats).getByText('33%')).toBeVisible()

    const journeyMap = screen.getByRole('region', { name: /carte de progression du parcours/i })
    const lessonJourneyTitles = orderedJourneyNodes
      .filter((node) => node.kind === 'lesson')
      .map((node) => journeyTitle(node, 'fr'))

    for (const title of lessonJourneyTitles) {
      expect(within(journeyMap).getByText(title)).toBeVisible()
    }
    expect(within(journeyMap).getByText('Terminée')).toBeVisible()
    expect(within(journeyMap).getByText('En cours')).toBeVisible()
    expect(within(journeyMap).getByText('À venir')).toBeVisible()
  })

  it('renders the shared journey map in path order with all complete lesson and preview nodes', () => {
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
    expect(within(journeyMap).getAllByText('Preview')).toHaveLength(5)
    expect(within(journeyMap).getAllByText('Upcoming')).toHaveLength(3)
  })

  it('reuses the Home hand-drawn/kawaii journey card visual hooks on Progress', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const cityTravelCard = getJourneyNodeCard('City travel')
    const airportArrivalCard = getJourneyNodeCard('Airport arrival')

    expect(journeyMap.querySelectorAll('.journey-node')).toHaveLength(orderedJourneyNodes.length)
    expect(cityTravelCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(cityTravelCard.querySelector('.journey-node__doodle')).toHaveTextContent('🚇')
    expect(within(cityTravelCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')

    expect(airportArrivalCard).toHaveClass('journey-node', 'journey-node--preview')
    expect(airportArrivalCard.querySelector('.journey-node__doodle')).toHaveTextContent('✈️')
    expect(within(airportArrivalCard).getByText(/coming soon/i)).toHaveClass(
      'journey-node__stamp',
    )
    expect(
      within(airportArrivalCard).getByRole('button', { name: /airport arrival/i }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('counts mastery from complete lesson nodes only, excluding display-only previews', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['ask-directions'],
      lastVisitedLesson: 'ask-directions',
    })

    renderRoute('/progress')

    const stats = screen.getByRole('region', { name: /learning indicators/i })
    expect(within(stats).getByText('1/3')).toBeVisible()
    expect(within(stats).getByText('33%')).toBeVisible()
    expect(screen.getAllByText(/1 of 3 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 8/i)).not.toBeInTheDocument()
  })

  it('maps learner progress to completed, current, upcoming, and preview journey statuses', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['ask-directions'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard('City travel')).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard('Meet people')).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard('Restaurant ordering')).getByText('Upcoming')).toBeVisible()

    const previewTitles = orderedJourneyNodes
      .filter((node) => node.kind === 'preview')
      .map((node) => journeyTitle(node))

    for (const title of previewTitles) {
      const card = getJourneyNodeCard(title)
      expect(within(card).getByText('Preview')).toBeVisible()
      expect(within(card).queryByText(/Complete|Current|Upcoming/)).not.toBeInTheDocument()
    }
  })

  it('makes lesson journey nodes whole-card links to existing lesson routes while keeping previews off routing', () => {
    renderRoute('/progress')

    for (const node of orderedJourneyNodes) {
      const card = getJourneyNodeCard(journeyTitle(node))

      if (node.kind === 'lesson') {
        expect(card).toHaveRole('link')
        expect(card).toHaveClass('journey-node--card-link')
        expect(card).toHaveAttribute('href', `/lesson/${node.lessonId}`)
      } else {
        expect(within(card).queryByRole('link')).not.toBeInTheDocument()
        expect(within(card).getByRole('button', { name: new RegExp(journeyTitle(node), 'i') }))
          .toBeVisible()
      }
    }
  })

  it('expands preview journey nodes in-card without routing, completion, or review side effects', async () => {
    const user = userEvent.setup()
    const savedProgress = {
      ...createDefaultProgress(),
      completedLessons: ['ask-directions'],
      lastVisitedLesson: 'ask-directions',
      reviewQueue: ['ask-directions-review-1'],
    }
    saveProgress(savedProgress)

    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const airportArrivalCard = getJourneyNodeCard('Airport arrival')
    const airportArrivalToggle = within(airportArrivalCard).getByRole('button', {
      name: /airport arrival/i,
    })

    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(airportArrivalToggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(airportArrivalToggle)

    expect(airportArrivalToggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(journeyMap).getAllByRole('note')).toHaveLength(1)
    expect(within(airportArrivalCard).queryByRole('link')).not.toBeInTheDocument()
    expect(within(airportArrivalCard).getByRole('note')).toHaveTextContent(/coming soon/i)
    expect(within(airportArrivalCard).getByRole('note')).toHaveTextContent('出口在哪里？')
    expect(within(airportArrivalCard).getByRole('note')).toHaveTextContent(/immigration/i)

    expect(loadProgress()).toEqual(savedProgress)
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('1/3')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('33%')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent(
      /1 review item waiting/i,
    )
    expect(screen.queryByText(/1 of 8/i)).not.toBeInTheDocument()
  })
})
