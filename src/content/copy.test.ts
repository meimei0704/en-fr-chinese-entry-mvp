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
})
