import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { journeyNodes } from '../content/journey'
import { createDefaultProgress, saveProgress } from '../lib/progress'
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
  return within(getJourneyMap()).getByRole('article', {
    name: new RegExp(`^${escapeRegExp(title)}\\b`, 'i'),
  })
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
    const cards = within(journeyMap).getAllByRole('article')

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

  it('links complete lesson nodes to their existing lesson routes but keeps preview nodes display-only', () => {
    renderRoute('/progress')

    for (const node of orderedJourneyNodes) {
      const card = getJourneyNodeCard(journeyTitle(node))

      if (node.kind === 'lesson') {
        const lessonLink = within(card).getByRole('link', {
          name: new RegExp(`open ${escapeRegExp(journeyTitle(node))}`, 'i'),
        })

        expect(lessonLink).toHaveAttribute('href', `/lesson/${node.lessonId}`)
      } else {
        expect(within(card).queryByRole('link')).not.toBeInTheDocument()
        expect(within(card).getByText(/display-only preview/i)).toBeVisible()
      }
    }
  })
})
