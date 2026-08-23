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
    })
    expect(getUiCopy('fr').nav).toEqual({
      siteNavLabel: 'Navigation principale',
      home: 'Accueil',
      pinyin: 'Pinyin',
      journey: 'Parcours',
      culture: 'Culture',
    })
  })
})
