import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { course } from '../content/course'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the three fixed lesson cards and a review shortcut on the home page', () => {
    renderRoute('/home')

    expect(screen.getByRole('link', { name: /continue learning/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /go to review/i })).toBeVisible()

    const journeyMap = screen.getByLabelText(/journey map/i)
    const journeyLessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(journeyLessonLinks).toHaveLength(3)
    expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/lesson/ask-directions',
      '/lesson/self-intro',
      '/lesson/order-food',
    ])
    expect(within(journeyMap).getAllByText(/coming soon/i)).toHaveLength(5)
    expect(within(journeyMap).getByRole('heading', { level: 2, name: /meet people/i })).toBeVisible()
    expect(within(journeyMap).getByRole('heading', { level: 2, name: /city travel/i })).toBeVisible()
    expect(within(journeyMap).getByRole('heading', { level: 2, name: /airport arrival/i })).toBeVisible()
  })

  it('shows the refreshed hero phrase, progress cues, and journey status copy', () => {
    renderRoute('/home')

    const heroPhrase = screen.getByRole('group', { name: /hero phrase/i })
    expect(heroPhrase).toHaveTextContent('你好')
    expect(heroPhrase).toHaveTextContent('nǐ hǎo')
    expect(screen.getByText(`${course.lessons.length} lessons`)).toBeVisible()
    expect(screen.getByText(/listen & repeat/i)).toBeVisible()

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).getAllByText(/coming soon/i)).toHaveLength(5)
    expect(within(journeyMap).getByText(/first conversations in china/i)).toBeVisible()
  })

  it('renders page-level French copy when the learner chooses French mode', () => {
    saveProgress({
      ...createDefaultProgress(),
      selectedExplanationLanguage: 'fr',
    })

    renderRoute('/home')

    expect(screen.getByRole('heading', { name: /accueil/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /continuer la leçon/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /réviser/i })).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /faire connaissance/i,
      }),
    ).toBeVisible()
    expect(screen.getByLabelText(/points clés de l’apprentissage/i)).toHaveTextContent(
      'Guidage anglais/français',
    )
    expect(screen.getByRole('region', { name: /maquette d’aperçu d’apprentissage/i })).toBeVisible()
    expect(screen.getByRole('navigation', { name: /accès rapides d’apprentissage/i })).toBeVisible()
    expect(screen.getByLabelText(/phrase modèle/i)).toHaveTextContent('你好')

    const progressSummary = screen.getByLabelText(/résumé des progrès du cours/i)
    expect(progressSummary).toHaveTextContent(`${course.lessons.length} leçons`)
    expect(progressSummary).toHaveTextContent('0 terminée')
    expect(progressSummary).toHaveTextContent('0 à réviser')

    expect(screen.getByText('Rencontres')).toBeVisible()
    expect(screen.getByText('Trajet')).toBeVisible()
    expect(screen.getAllByText(/bientôt/i)).toHaveLength(5)
    expect(screen.queryByText(`${course.lessons.length} lessons`)).not.toBeInTheDocument()
    expect(screen.queryByText('Intro')).not.toBeInTheDocument()
  })

  it('presents a learning mockup and card-based quick entry paths without changing destinations', () => {
    saveProgress({
      ...createDefaultProgress(),
      lastVisitedLesson: 'order-food',
      reviewQueue: ['self-intro-review-1'],
    })

    renderRoute('/home')

    const learningMockup = screen.getByRole('region', { name: /learning preview mockup/i })
    expect(learningMockup).toHaveClass('home-learning-mockup')
    expect(within(learningMockup).getByText('你好')).toBeVisible()
    expect(within(learningMockup).getByText(/listen/i)).toBeVisible()

    const quickEntries = screen.getByRole('navigation', { name: /quick learning paths/i })
    expect(quickEntries).toHaveClass('home-quick-entry-grid')
    expect(
      within(quickEntries).getByRole('link', { name: /continue learning/i }),
    ).toHaveAttribute('href', '/lesson/order-food')
    expect(
      within(quickEntries).getByRole('link', { name: /go to review/i }),
    ).toHaveClass('quick-entry-card')
    expect(
      within(quickEntries).getByRole('link', { name: /view progress/i }),
    ).toHaveAttribute('href', '/progress')
  })

  it('makes each lesson journey node a whole-card link to its real lesson route', () => {
    renderRoute('/home')

    const journeyMap = screen.getByLabelText(/journey map/i)
    const cityTravelCard = within(journeyMap).getByRole('link', { name: /city travel/i })
    const meetPeopleCard = within(journeyMap).getByRole('link', { name: /meet people/i })
    const restaurantCard = within(journeyMap).getByRole('link', { name: /restaurant ordering/i })

    expect(cityTravelCard).toHaveAttribute('href', '/lesson/ask-directions')
    expect(meetPeopleCard).toHaveAttribute('href', '/lesson/self-intro')
    expect(restaurantCard).toHaveAttribute('href', '/lesson/order-food')
    expect(within(journeyMap).queryByRole('link', { name: /^open lesson$/i })).not.toBeInTheDocument()
  })

  it('keeps preview journey nodes off routing and expands one in-card coming-soon panel on demand', async () => {
    const user = userEvent.setup()

    renderRoute('/home')

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)

    const airportArrivalToggle = within(journeyMap).getByRole('button', { name: /airport arrival/i })
    expect(airportArrivalToggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(airportArrivalToggle)

    expect(airportArrivalToggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(journeyMap).getAllByRole('note')).toHaveLength(1)

    const airportArrivalCard = airportArrivalToggle.closest('.journey-node')
    expect(airportArrivalCard).not.toBeNull()

    const airportArrivalPreview = within(airportArrivalCard as HTMLElement).getByRole('note')
    expect(airportArrivalPreview).toHaveTextContent(/coming soon/i)
    expect(airportArrivalPreview).toHaveTextContent(/immigration/i)
    expect(within(airportArrivalCard as HTMLElement).queryByRole('link')).not.toBeInTheDocument()

    await user.click(airportArrivalToggle)

    expect(airportArrivalToggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
  })
})
