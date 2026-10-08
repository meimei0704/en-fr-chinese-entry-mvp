import { describe, expect, it } from 'vitest'

import { getUiCopy } from './copy'

describe('course-series UI copy', () => {
  it('pins the approved English and French label and titles', () => {
    expect(getUiCopy('en').courseSeries).toEqual({
      label: 'Course series',
      pinyinTitle: 'Mandarin tones and pinyin',
      basicExpressionsTitle: 'Useful sentences, expressions and Hanzi recognition',
      cultureTitle: 'Culture advice for travelers in China',
    })
    expect(getUiCopy('fr').courseSeries).toEqual({
      label: 'Séries de cours',
      pinyinTitle: 'Tons et pinyin du mandarin',
      basicExpressionsTitle: 'Expressions chinoises essentielles pour voyager sereinement',
      cultureTitle: 'Conseils culturels pour les voyageurs en Chine',
    })
  })

  it('removes the redundant Home and Progress Journey introduction keys', () => {
    for (const language of ['en', 'fr'] as const) {
      const copy = getUiCopy(language)

      expect(copy.homePage).not.toHaveProperty('journeyEyebrow')
      expect(copy.homePage).not.toHaveProperty('journeyMapLabel')
      expect(copy.homePage).not.toHaveProperty('journeyIntro')
      expect(copy.progressPage).not.toHaveProperty('lessonProgressEyebrow')
      expect(copy.progressPage).not.toHaveProperty('lessonProgressLabel')
      expect(copy.progressPage).not.toHaveProperty('progressJourneyMapLabel')
    }
  })

  it('drops all course-completion badge copy keys', () => {
    expect(getUiCopy('en').homePage).not.toHaveProperty('lessonComplete')
    expect(getUiCopy('fr').homePage).not.toHaveProperty('lessonComplete')
    expect(getUiCopy('en').lessonPage).not.toHaveProperty('lessonComplete')
    expect(getUiCopy('fr').lessonPage).not.toHaveProperty('lessonComplete')
  })

  it('pins the start-learning empty-state CTA labels', () => {
    expect(getUiCopy('en').reviewPage.startLearning).toBe('Start learning')
    expect(getUiCopy('fr').reviewPage.startLearning).toBe('Commencer à apprendre')
    expect(getUiCopy('en').progressPage.startLearning).toBe('Start learning')
    expect(getUiCopy('fr').progressPage.startLearning).toBe('Commencer à apprendre')
  })

  it('pins the global site navigation labels', () => {
    expect(getUiCopy('en').nav).toEqual({
      siteNavLabel: 'Main navigation',
      home: 'Home',
      pinyin: 'Pinyin',
      journey: 'Journey',
      culture: 'Culture',
      travel: 'Travel',
    })
    expect(getUiCopy('fr').nav).toEqual({
      siteNavLabel: 'Navigation principale',
      home: 'Accueil',
      pinyin: 'Pinyin',
      journey: 'Parcours',
      culture: 'Culture',
      travel: 'Voyage',
    })
  })
})

describe('travel UI copy', () => {
  it('exposes travel copy for both explanation languages', () => {
    expect(getUiCopy('en').travel).toBeDefined()
    expect(getUiCopy('fr').travel).toBeDefined()
  })

  it('pins the travel page headings and request form labels in both languages', () => {
    expect(getUiCopy('en').travel.heading).toBe('Plan your trip to China')
    expect(getUiCopy('fr').travel.heading).toBe('Planifiez votre voyage en Chine')

    const enForm = getUiCopy('en').travel.form
    const frForm = getUiCopy('fr').travel.form

    expect(enForm.destinationsLabel).toBe('Destinations')
    expect(frForm.destinationsLabel).toBe('Destinations')
    expect(enForm.generate).toBe('Generate itinerary')
    expect(frForm.generate).toBe('Générer l’itinéraire')

    expect(Object.values(enForm.interests)).toEqual([
      'History',
      'Nature',
      'Food',
      'Shopping',
      'Nightlife',
      'Art',
    ])
    expect(Object.values(frForm.interests)).toEqual([
      'Histoire',
      'Nature',
      'Gastronomie',
      'Shopping',
      'Vie nocturne',
      'Art',
    ])
    expect(Object.values(enForm.pace)).toEqual(['Relaxed', 'Standard', 'Packed'])
    expect(Object.values(frForm.pace)).toEqual(['Tranquille', 'Standard', 'Intense'])
    expect(Object.values(enForm.budget)).toEqual(['Budget', 'Mid-range', 'Comfort'])
    expect(Object.values(frForm.budget)).toEqual(['Économique', 'Moyen', 'Confort'])
  })

  it('keeps every travel copy key present in both languages', () => {
    function collectKeys(value: unknown, prefix = ''): string[] {
      if (typeof value !== 'object' || value === null) {
        return [prefix]
      }
      return Object.entries(value).flatMap(([key, child]) =>
        collectKeys(child, prefix ? `${prefix}.${key}` : key),
      )
    }

    expect(collectKeys(getUiCopy('fr').travel)).toEqual(collectKeys(getUiCopy('en').travel))
  })

  it('covers validation, result and disclaimer copy', () => {
    for (const language of ['en', 'fr'] as const) {
      const { validation, result } = getUiCopy(language).travel

      expect(validation.noDestinations.length).toBeGreaterThan(0)
      expect(validation.daysOutOfRange.length).toBeGreaterThan(0)
      expect(validation.unknownDestination.length).toBeGreaterThan(0)
      expect(validation.daysBelowDestinations.length).toBeGreaterThan(0)
      expect(validation.generic.length).toBeGreaterThan(0)

      expect(result.summaryHeading.length).toBeGreaterThan(0)
      expect(result.dayHeading(3)).toContain('3')
      expect(result.blocks.morning.length).toBeGreaterThan(0)
      expect(result.freeDayLabel.length).toBeGreaterThan(0)
      expect(result.freeDayHelper.length).toBeGreaterThan(0)
      expect(result.stayBookingNote.length).toBeGreaterThan(0)
      expect(result.practicalHeading.length).toBeGreaterThan(0)
      expect(Object.keys(result.practicalSections)).toEqual([
        'payments',
        'connectivity',
        'etiquette',
        'safety',
        'visaEntry',
        'emergencyNumbers',
      ])
      expect(result.verifyOfficial.length).toBeGreaterThan(0)
      expect(result.verifyOfficialHelper.length).toBeGreaterThan(0)
      expect(result.freshnessBanner('2026-10-08')).toContain('2026-10-08')
      expect(result.staleWarning(180)).toContain('180')
      expect(result.liveIndicator.length).toBeGreaterThan(0)
      expect(result.disclaimer.visaEntry.length).toBeGreaterThan(0)
      expect(result.disclaimer.safety.length).toBeGreaterThan(0)
      expect(result.generatedAt('2026-10-08')).toContain('2026-10-08')
      expect(result.error.length).toBeGreaterThan(0)
      expect(result.retry.length).toBeGreaterThan(0)
    }
  })
})
