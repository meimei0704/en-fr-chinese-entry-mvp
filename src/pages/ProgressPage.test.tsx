import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { getLocalizedText } from '../content/copy'
import { course } from '../content/course'
import { buildJourney } from '../content/journey'
import { createDefaultPinyinProgress, recordPinyinReferenceComplete, savePinyinProgress } from '../lib/pinyinProgress'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import {
  expectedLessonTopic,
  expectedLessonTopicOrder,
  expectedLessonTopicPattern,
} from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

const orderedJourneyNodes = [...buildJourney(course).nodes].sort((left, right) => left.pathOrder - right.pathOrder)
const expectedJourneyLessonHrefs = [
  '/lesson/daily-greetings',
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/restaurant-order',
  '/lesson/train-station-ticket',
  '/lesson/metro-ticket',
  '/lesson/convenience-store-run',
  '/lesson/ask-for-help-problem',
  '/lesson/pharmacy-help',
  '/lesson/small-talk',
]

const expectedSeriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Useful sentences, expressions and Hanzi recognition',
    culture: 'Culture advice for travelers in China',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
    culture: 'Conseils culturels pour les voyageurs en Chine',
  },
} as const

function journeyTitle(node: (typeof orderedJourneyNodes)[number], language: 'en' | 'fr' = 'en') {
  if (node.kind === 'lesson' && node.lessonId) {
    const topic = expectedLessonTopicOrder.find((entry) => entry.id === node.lessonId)

    if (topic) {
      return expectedLessonTopic(topic, language)
    }
  }

  return getLocalizedText(node.title, language)
}

function journeyTitlePattern(node: (typeof orderedJourneyNodes)[number], language: 'en' | 'fr' = 'en') {
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

function getProgressCourseSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].label })
}

function getPinyinProgressSeries(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].pinyin })
}

function getJourneyMap(language: keyof typeof expectedSeriesCopy = 'en') {
  return screen.getByRole('region', { name: expectedSeriesCopy[language].journey })
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

function expectTokenizedSeriesTitle(section: HTMLElement, title: string) {
  const heading = within(section).getByRole('heading', { level: 2, name: title })
  const tokens = Array.from(
    heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    (token) => token.textContent,
  )

  expect(heading.textContent).toBe(title)
  expect(tokens).toEqual(title.split(/\s+/u))
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
    expect(screen.getAllByText(/1 leçon sur 12 terminée/i)[0]).toBeVisible()

    const summary = screen.getByRole('region', { name: /résumé du parcours/i })
    expect(within(summary).getByRole('heading', { name: /leçon en cours/i })).toBeVisible()
    expect(within(summary).getByText('酒店入住')).toHaveClass('lesson-topic-title__primary')
    expect(within(summary).getByText('À l’hôtel')).toHaveClass(
      'lesson-topic-title__secondary',
    )
    expect(summary).not.toHaveTextContent(' / ')

    const stats = screen.getByRole('region', { name: /indicateurs d’apprentissage/i })
    expect(within(stats).getByText(/leçons terminées/i)).toBeVisible()
    expect(within(stats).getByText(/1 leçon sur 12 terminée/i)).toBeVisible()
    expect(within(stats).getByText(/file de révision/i)).toBeVisible()
    expect(within(stats).getByText(/2 cartes en attente/i)).toBeVisible()
    expect(within(stats).getByText(/maîtrise du parcours/i)).toBeVisible()
    expect(within(stats).getByText('8%')).toBeVisible()

    const courseSeries = getProgressCourseSeries('fr')
    const pinyinSeries = getPinyinProgressSeries('fr')
    const cultureSeries = screen.getByRole('region', { name: expectedSeriesCopy.fr.culture })
    const journeyMap = getJourneyMap('fr')

    expect(within(courseSeries).getByText(expectedSeriesCopy.fr.label)).toBeVisible()
    expect(within(pinyinSeries).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.fr.pinyin,
    })).toBeVisible()
    expect(within(cultureSeries).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.fr.culture,
    })).toBeVisible()
    expect(within(journeyMap).getByRole('heading', {
      level: 2,
      name: expectedSeriesCopy.fr.journey,
    })).toBeVisible()

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
    expect(within(journeyMap).getAllByText('À venir')).toHaveLength(10)
    expect(within(journeyMap).queryAllByText('Aperçu')).toHaveLength(0)
  })

  it('renders vertical full-card Progress entries before the unchanged Journey path', () => {
    renderRoute('/progress')

    const courseSeries = getProgressCourseSeries()
    const pinyinSection = getPinyinProgressSeries()
    const cultureSection = screen.getByRole('region', {
      name: expectedSeriesCopy.en.culture,
    })
    const journeySection = getJourneyMap()
    const list = courseSeries.querySelector<HTMLElement>('.course-series__list')
    const pinyinEntry = within(pinyinSection).getByRole('link', {
      name: expectedSeriesCopy.en.pinyin,
    })
    const cultureEntry = within(cultureSection).getByRole('link', {
      name: expectedSeriesCopy.en.culture,
    })
    const journeyEntry = within(journeySection).getByRole('link', {
      name: expectedSeriesCopy.en.journey,
    })
    const journeyPath = journeySection.querySelector<HTMLElement>(
      '#progress-basic-expressions-path',
    )

    if (!list || !journeyPath) {
      throw new Error('Expected the Progress course-series list and fragment target')
    }

    const cards = Array.from(journeyPath.querySelectorAll<HTMLElement>('.journey-node'))
    const lessonLinks = within(journeyPath)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))

    expect(within(courseSeries).getByText(expectedSeriesCopy.en.label)).toBeVisible()
    expect(Array.from(list.children)).toEqual([pinyinSection, journeySection, cultureSection])
    expect(pinyinSection.parentElement).toBe(journeySection.parentElement)
    expect(journeySection.parentElement).toBe(cultureSection.parentElement)
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(pinyinEntry).toHaveClass('course-series__entry-card', 'course-series__pinyin-link')
    expect(pinyinEntry).toHaveAccessibleName(expectedSeriesCopy.en.pinyin)
    expect(pinyinEntry).toHaveTextContent('0 of 2 sections complete')
    expect(cultureEntry).toHaveAttribute('href', '/culture')
    expect(cultureEntry).toHaveClass('course-series__entry-card', 'course-series__culture-link')
    expect(cultureEntry).toHaveAccessibleName(expectedSeriesCopy.en.culture)
    expect(journeyEntry.tagName).toBe('A')
    expect(journeyEntry).toHaveAttribute('href', '#progress-basic-expressions-path')
    expect(journeyEntry).toHaveClass('course-series__entry-card', 'course-series__journey-link')
    expect(journeyEntry).toHaveAccessibleName(expectedSeriesCopy.en.journey)
    expect(journeyEntry).toHaveTextContent('0 of 12 lessons completed')
    expect(journeyPath).toHaveClass(
      'surface-card',
      'progress-journey-card',
      'course-series__journey-path',
    )
    expect(journeyPath.parentElement).toBe(journeySection)
    expect(journeySection.children[0]).toBe(journeyEntry)
    expect(journeySection.children[1]).toBe(journeyPath)
    expect(
      pinyinEntry.compareDocumentPosition(journeyEntry) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      journeyEntry.compareDocumentPosition(cultureEntry) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      journeyEntry.compareDocumentPosition(journeyPath) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    expectTokenizedSeriesTitle(pinyinSection, expectedSeriesCopy.en.pinyin)
    expectTokenizedSeriesTitle(cultureSection, expectedSeriesCopy.en.culture)
    expectTokenizedSeriesTitle(journeySection, expectedSeriesCopy.en.journey)
    expect(pinyinEntry.querySelector('.course-series__pinyin-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(cultureEntry.querySelector('.course-series__culture-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(journeyEntry.querySelector('.course-series__journey-mark')).toHaveAttribute(
      'aria-hidden',
      'true',
    )

    expect(cards).toHaveLength(12)
    expect(cards.map((card) => card.getAttribute('data-journey-node-id'))).toEqual(
      orderedJourneyNodes.map((node) => node.id),
    )
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(orderedJourneyNodes.map((node) => journeyTitle(node)))
    expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(
      expectedJourneyLessonHrefs,
    )
    expect(journeySection).not.toHaveTextContent(' / ')
    expect(within(journeyPath).queryAllByText('Preview')).toHaveLength(0)
    expect(within(journeyPath).getAllByText('Upcoming')).toHaveLength(12)
  })

  it('reuses the Home hand-drawn/kawaii journey card visual hooks on Progress', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const taxiCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[2]))
    const restaurantCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))

    expect(journeyMap.querySelectorAll('.journey-node')).toHaveLength(12)
    expect(taxiCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(
      taxiCard.querySelector('.journey-node__doodle .journey-node__course-image'),
    ).toHaveAttribute('src', '/images/course/course-03.png')
    expect(within(taxiCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')

    expect(restaurantCard).toHaveRole('link')
    expect(restaurantCard).toHaveClass(
      'journey-node',
      'journey-node--lesson',
      'journey-node--card-link',
    )
    expect(
      restaurantCard.querySelector('.journey-node__doodle .journey-node__course-image'),
    ).toHaveAttribute('src', '/images/course/course-06.png')
    expect(within(restaurantCard).getByText('Open lesson')).toHaveClass('journey-node__stamp')
    expect(within(restaurantCard).queryAllByText(/coming soon/i)).toHaveLength(0)
  })

  it('counts mastery from all twelve complete lesson nodes', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const stats = screen.getByRole('region', { name: /learning indicators/i })
    expect(within(stats).getByText('1/12')).toBeVisible()
    expect(within(stats).getByText('8%')).toBeVisible()
    expect(screen.getAllByText(/1 of 12 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 13/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/1 of 5/i)).not.toBeInTheDocument()
  })

  it('keeps 1-of-2 Pinyin and 1-of-12 Basic progress inside independent anchors', () => {
    let progress = createDefaultPinyinProgress()
    progress = recordPinyinReferenceComplete(progress, 'initials')
    savePinyinProgress(progress)
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const pinyinSection = getPinyinProgressSeries()
    const journeySection = getJourneyMap()
    const pinyinEntry = within(pinyinSection).getByRole('link', {
      name: expectedSeriesCopy.en.pinyin,
    })
    const journeyEntry = within(journeySection).getByRole('link', {
      name: expectedSeriesCopy.en.journey,
    })
    const stats = screen.getByRole('region', { name: /learning indicators/i })

    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(pinyinEntry).toHaveAccessibleName(expectedSeriesCopy.en.pinyin)
    expect(within(pinyinEntry).getByText('1 of 2 sections complete')).toBeVisible()
    expect(pinyinEntry).not.toHaveTextContent('1 of 12 lessons completed')
    expect(journeyEntry).toHaveAttribute('href', '#progress-basic-expressions-path')
    expect(journeyEntry).toHaveAccessibleName(expectedSeriesCopy.en.journey)
    expect(within(journeyEntry).getByText('1 of 12 lessons completed')).toBeVisible()
    expect(journeyEntry).not.toHaveTextContent('1 of 2 sections complete')
    expect(within(stats).getByText('1/12')).toBeVisible()
    expect(within(stats).getByText('8%')).toBeVisible()
    expect(screen.queryByText(/1 of 13/i)).not.toBeInTheDocument()
  })

  it('keeps the peer Pinyin entry outside Journey mastery totals', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro'],
      lastVisitedLesson: 'self-intro',
    })

    renderRoute('/progress')

    const pinyinEntry = screen.getByRole('link', { name: expectedSeriesCopy.en.pinyin })

    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(within(getJourneyMap()).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()
    expect(screen.getAllByText(/1 of 12 lessons completed/i)[0]).toBeVisible()
    expect(screen.queryByText(/1 of 13/i)).not.toBeInTheDocument()
  })

  it('maps learner progress to completed, current, and upcoming journey statuses only', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: ['self-intro', 'ask-directions', 'order-food'],
      lastVisitedLesson: 'phone-and-payment',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[0]))).getByText('Upcoming')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[1]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[2]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[3]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[4]))).getByText('Current')).toBeVisible()
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
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[3]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[4]))).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[5]))).getByText('Upcoming')).toBeVisible()
    expect(within(getProgressSummary()).getByText('中国电话卡')).toHaveClass(
      'lesson-topic-title__primary',
    )
  })

  it('uses lesson nine as current after completing lesson eight', () => {
    saveProgress({
      ...createDefaultProgress(),
      completedLessons: [
        'daily-greetings',
        'self-intro',
        'ask-directions',
        'order-food',
        'phone-and-payment',
        'restaurant-order',
        'train-station-ticket',
        'metro-ticket',
      ],
      lastVisitedLesson: 'metro-ticket',
    })

    renderRoute('/progress')

    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[7]))).getByText('Complete')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[8]))).getByText('Current')).toBeVisible()
    expect(within(getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[9]))).getByText('Upcoming')).toBeVisible()
    expect(within(getProgressSummary()).getByText('购物')).toHaveClass(
      'lesson-topic-title__primary',
    )
  })

  it('makes all twelve Journey cards and the peer Pinyin entry whole-card links', () => {
    renderRoute('/progress')

    const journeyMap = getJourneyMap()
    const lessonLinks = within(journeyMap)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/lesson/'))
    const pinyinEntry = screen.getByRole('link', { name: expectedSeriesCopy.en.pinyin })

    expect(lessonLinks).toHaveLength(12)
    expect(lessonLinks.map((link) => link.getAttribute('href'))).toEqual(expectedJourneyLessonHrefs)
    expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
    expect(within(journeyMap).queryByRole('link', { name: /pinyin/i })).not.toBeInTheDocument()

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
    const trainCard = getJourneyNodeCard(journeyTitlePattern(orderedJourneyNodes[6]))

    expect(within(journeyMap).queryAllByRole('note')).toHaveLength(0)
    expect(restaurantCard).toHaveRole('link')
    expect(trainCard).toHaveRole('link')
    expect(within(restaurantCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(within(trainCard).queryAllByText(/coming soon|peek inside|preview/i)).toHaveLength(0)
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('1/12')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent('8%')
    expect(screen.getByRole('region', { name: /learning indicators/i })).toHaveTextContent(
      /1 review item waiting/i,
    )
  })
})
