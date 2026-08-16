import { describe, expect, it } from 'vitest'

import { cultureAdvice } from './cultureAdvice'

describe('culture advice content', () => {
  it('has exactly 7 sections in the approved order', () => {
    expect(cultureAdvice.sections.map((section) => section.id)).toEqual([
      'general-social-tips',
      'dining-etiquette',
      'conversation-guidelines',
      'visiting-someones-home',
      'public-conduct',
      'visiting-temples',
      'number-superstitions',
    ])
  })

  it('keeps English copy non-empty and French placeholders present everywhere', () => {
    for (const section of cultureAdvice.sections) {
      expect(section.title.en.trim().length).toBeGreaterThan(0)
      expect(section.title.fr.trim().length).toBeGreaterThan(0)

      if (section.intro) {
        expect(section.intro.en.trim().length).toBeGreaterThan(0)
        expect(section.intro.fr.trim().length).toBeGreaterThan(0)
      }

      for (const item of section.items) {
        if (item.lead) {
          expect(item.lead.en.trim().length).toBeGreaterThan(0)
          expect(item.lead.fr.trim().length).toBeGreaterThan(0)
        }
        if (item.body.en.trim().length > 0) {
          expect(item.body.fr.trim().length).toBeGreaterThan(0)
        }

        for (const subItem of item.subItems ?? []) {
          expect(subItem.body.en.trim().length).toBeGreaterThan(0)
          expect(subItem.body.fr.trim().length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('bolds exactly the approved lead-ins and no others', () => {
    const general = cultureAdvice.sections.find((section) => section.id === 'general-social-tips')
    const dining = cultureAdvice.sections.find((section) => section.id === 'dining-etiquette')
    const numbers = cultureAdvice.sections.find((section) => section.id === 'number-superstitions')

    expect(general?.items.map((item) => item.lead?.en)).toEqual([
      'For formal visits:',
      'Giving and receiving items:',
      'Gifts to avoid (symbolic taboos):',
    ])
    expect(dining?.items.map((item) => item.lead?.en)).toEqual([
      'Wait for the host:',
      'Chopstick rules:',
      'Toasting customs:',
      'Useful phrase:',
    ])
    expect(numbers?.items.map((item) => item.lead?.en)).toEqual(['8:', '6:', '4:'])

    for (const section of cultureAdvice.sections) {
      if (
        section.id === 'general-social-tips' ||
        section.id === 'dining-etiquette' ||
        section.id === 'number-superstitions'
      ) {
        continue
      }
      for (const item of section.items) {
        expect(item.lead).toBeUndefined()
      }
    }
  })

  it('nests the gift taboos sub-points under General Social Tips', () => {
    const general = cultureAdvice.sections.find((section) => section.id === 'general-social-tips')
    const gifts = general?.items.find((item) => item.id === 'gifts-to-avoid')

    expect(gifts?.subItems?.map((subItem) => subItem.lead?.en)).toEqual([
      'Clocks:',
      'White chrysanthemums:',
    ])
    expect(gifts?.body.en).toBe('')
  })

  it('uses a numbered list for General Social Tips and bullets elsewhere', () => {
    for (const section of cultureAdvice.sections) {
      expect(section.kind).toBe(section.id === 'general-social-tips' ? 'numbered' : 'bulleted')
    }
  })

  it('keeps the approved section titles verbatim', () => {
    expect(cultureAdvice.title.en).toBe('Culture advice for travelers in China')
    expect(cultureAdvice.sections.map((section) => section.title.en)).toEqual([
      'General Social Tips',
      'Dining Etiquette',
      'Conversation Guidelines',
      "Visiting Someone's Home",
      'Public Conduct and Behaviour',
      'Visiting Temples & Cultural Sites',
      'Number Superstitions & Symbolism',
    ])
  })
})
