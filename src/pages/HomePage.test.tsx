import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { course } from '../content/course'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const expectedLessonHrefs = [
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/convenience-store-run',
]

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows all five arrival lesson cards and a review shortcut on the home page', () => {
    renderRoute('/home')

    expect(screen.getByRole('link', { name: /continue learning/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /go to review/i })).toBeVisible()

    const journeyMap = screen.getByLabelText(/journey map/i)
    const journeyLessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(journeyLessonLinks).toHaveLength(5)
    expect(journeyLessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedLessonHrefs)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(
      within(journeyMap).getByRole('heading', { level: 2, name: /airport immigration basics/i }),
    ).toBeVisible()
    expect(within(journeyMap).getByRole('heading', { level: 2, name: /taxi to your stay/i })).toBeVisible()
    expect(
      within(journeyMap).getByRole('heading', { level: 2, name: /hotel \/ apartment check-in/i }),
    ).toBeVisible()
    expect(
      within(journeyMap).getByRole('heading', { level: 2, name: /phone number & mobile payment/i }),
    ).toBeVisible()
    expect(
      within(journeyMap).getByRole('heading', { level: 2, name: /first convenience store run/i }),
    ).toBeVisible()
  })

  it('shows the refreshed hero phrase, five-lesson progress cues, and no preview status copy', () => {
    renderRoute('/home')

    const heroPhrase = screen.getByRole('group', { name: /hero phrase/i })
    expect(heroPhrase).toHaveTextContent('护照')
    expect(heroPhrase).toHaveTextContent('hùzhào')
    expect(screen.getByText(`${course.lessons.length} lessons`)).toBeVisible()
    expect(screen.getByText(/listen & repeat/i)).toBeVisible()

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).getByText(/arrive in china step by step/i)).toBeVisible()
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
        name: /bases de l’immigration à l’aéroport/i,
      }),
    ).toBeVisible()
    expect(screen.getByLabelText(/points clés de l’apprentissage/i)).toHaveTextContent(
      'Guidage anglais/français',
    )
    expect(screen.getByRole('region', { name: /maquette d’aperçu d’apprentissage/i })).toBeVisible()
    expect(screen.getByRole('navigation', { name: /accès rapides d’apprentissage/i })).toBeVisible()
    expect(screen.getByLabelText(/phrase modèle/i)).toHaveTextContent('护照')

    const progressSummary = screen.getByLabelText(/résumé des progrès du cours/i)
    expect(progressSummary).toHaveTextContent(`${course.lessons.length} leçons`)
    expect(progressSummary).toHaveTextContent('0 terminée')
    expect(progressSummary).toHaveTextContent('0 à réviser')

    expect(screen.getByText('Immigration')).toBeVisible()
    expect(screen.getByText('Taxi')).toBeVisible()
    expect(screen.getByText('Installation')).toBeVisible()
    expect(screen.getByText('Supérette')).toBeVisible()
    expect(screen.queryAllByText(/bientôt/i)).toHaveLength(0)
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
    expect(within(learningMockup).getByText('护照')).toBeVisible()
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

  it('continues from lesson three into lesson four after check-in is complete', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'order-food',
    })

    renderRoute('/home')

    expect(screen.getByRole('link', { name: /continue learning/i })).toHaveAttribute(
      'href',
      '/lesson/phone-and-payment',
    )
  })

  it('makes each lesson journey node a whole-card link to its real lesson route', () => {
    renderRoute('/home')

    const journeyMap = screen.getByLabelText(/journey map/i)
    const immigrationCard = within(journeyMap).getByRole('link', { name: /airport immigration basics/i })
    const taxiCard = within(journeyMap).getByRole('link', { name: /taxi to your stay/i })
    const checkInCard = within(journeyMap).getByRole('link', { name: /hotel \/ apartment check-in/i })
    const paymentCard = within(journeyMap).getByRole('link', { name: /phone number & mobile payment/i })
    const storeCard = within(journeyMap).getByRole('link', { name: /first convenience store run/i })

    expect(immigrationCard).toHaveAttribute('href', '/lesson/self-intro')
    expect(taxiCard).toHaveAttribute('href', '/lesson/ask-directions')
    expect(checkInCard).toHaveAttribute('href', '/lesson/order-food')
    expect(paymentCard).toHaveAttribute('href', '/lesson/phone-and-payment')
    expect(storeCard).toHaveAttribute('href', '/lesson/convenience-store-run')
    expect(within(journeyMap).queryByRole('link', { name: /^open lesson$/i })).not.toBeInTheDocument()
  })

  it('keeps the journey map as the only lesson entry section and exposes a stamp illustration slot on each card', () => {
    renderRoute('/home')

    expect(screen.queryByRole('heading', { level: 2, name: /lesson list/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: /lesson list/i })).not.toBeInTheDocument()

    const journeyMap = screen.getByLabelText(/journey map/i)
    const taxiCard = within(journeyMap).getByRole('link', { name: /taxi to your stay/i })
    const paymentCard = within(journeyMap).getByRole('link', { name: /phone number & mobile payment/i })

    expect(
      taxiCard.querySelector(
        '.journey-node__illustration-slot--stamp .journey-node__doodle--stamp',
      ),
    ).toBeInTheDocument()
    expect(
      paymentCard.querySelector(
        '.journey-node__illustration-slot--stamp .journey-node__doodle--stamp',
      ),
    ).toBeInTheDocument()
  })

  it('keeps upgraded phone/payment and convenience-store nodes out of preview affordances', () => {
    renderRoute('/home')

    const journeyMap = screen.getByLabelText(/journey map/i)
    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(within(journeyMap).queryByRole('button', { name: /phone number & mobile payment/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryByRole('button', { name: /first convenience store run/i }))
      .not.toBeInTheDocument()
    expect(within(journeyMap).queryAllByText(/peek inside/i)).toHaveLength(0)
    expect(within(journeyMap).queryAllByText(/coming soon/i)).toHaveLength(0)
  })
})
