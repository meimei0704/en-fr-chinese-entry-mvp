import { describe, expect, it } from 'vitest'

import { course } from './course'

function localizedText(value: string | { en: string; fr: string }, language: 'en' | 'fr') {
  return typeof value === 'string' ? value : value[language]
}

function expectCompleteSentence(value: string, fieldPath: string) {
  expect(value.trim(), `${fieldPath} must be a complete translated sentence`).toMatch(
    /[.!?…][”’"'»)\]]*$/,
  )
}

describe('course copy standard', () => {
  it('gives every phrase a word breakdown followed by usage context', () => {
    for (const lesson of course.lessons) {
      for (const line of lesson.dialogue.lines) {
        for (const language of ['en', 'fr'] as const) {
          const explanation = line.explanation[language]
          const fieldPath = `${lesson.id}/${line.id}.explanation.${language}`

          expect(explanation, `${fieldPath} must include a word or phrase breakdown`).toMatch(
            /\S+\s*=\s*\S+/,
          )
          expect(explanation, `${fieldPath} must explain when or how to use the phrase`).toMatch(
            /[.!?]\s+\S/,
          )
        }
      }
    }
  })

  it('keeps phrase and pattern-example translations as complete sentences', () => {
    for (const lesson of course.lessons) {
      for (const line of lesson.dialogue.lines) {
        for (const language of ['en', 'fr'] as const) {
          expectCompleteSentence(
            localizedText(line.translation, language),
            `${lesson.id}/${line.id}.translation.${language}`,
          )
        }
      }

      for (const pattern of lesson.sentencePatterns) {
        for (const [index, example] of (pattern.examples ?? []).entries()) {
          expectCompleteSentence(
            example.en,
            `${lesson.id}/${pattern.id}.examples[${index}].en`,
          )
          expectCompleteSentence(
            example.fr,
            `${lesson.id}/${pattern.id}.examples[${index}].fr`,
          )
        }
      }
    }
  })

  it('keeps vocabulary explanations focused on usage instead of word-by-word markup', () => {
    for (const lesson of course.lessons) {
      for (const item of lesson.vocabulary) {
        for (const language of ['en', 'fr'] as const) {
          const explanation = item.explanation[language]
          const fieldPath = `${lesson.id}/${item.id}.explanation.${language}`

          expect(explanation, `${fieldPath} must explain the usage scenario`).toMatch(/\S/)
          expect(explanation, `${fieldPath} must not repeat the phrase-breakdown format`).not.toMatch(
            /\S+\s*=\s*\S+/,
          )
        }
      }
    }
  })
})
