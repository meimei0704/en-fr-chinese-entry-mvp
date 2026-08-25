import { describe, expect, it } from 'vitest'

import { course } from './course'

function countSourceUnits(value: string) {
  const hanziCount = [...value].filter((character) => /[\u3400-\u9fff]/.test(character)).length
  const latinTerms = value.match(/[A-Za-z]+(?:-[A-Za-z]+)*/g) ?? []

  return hanziCount + latinTerms.length
}

function pinyinTokens(value: string) {
  return value
    .replace(/\.{3}|…/g, ' ')
    .replace(/[,.!?;:，。！？；：“”‘’（）()]/g, ' ')
    .replaceAll('/', ' ')
    .replaceAll('[', ' ')
    .replaceAll(']', ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function countExpectedPinyinTokens(hanzi: string, pinyin: string) {
  const erhuaCharacters = [...hanzi].filter((character) => character === '儿').length
  const erhuaTokens = pinyinTokens(pinyin).filter(
    (token) =>
      !/^[eēéěè]r$/i.test(token) && /[a-züāáǎàēéěèīíǐìōóǒòūúǔù]r$/i.test(token),
  ).length

  return countSourceUnits(hanzi) - Math.min(erhuaCharacters, erhuaTokens)
}

describe('course pinyin spacing', () => {
  it('keeps one separated pinyin token per Hanzi or embedded Latin term', () => {
    for (const lesson of course.lessons) {
      const entries = [
        ...lesson.dialogue.lines.map((line) => ({
          id: line.id,
          hanzi: line.hanzi,
          pinyin: line.pinyin,
        })),
        ...lesson.vocabulary.map((item) => ({
          id: item.id,
          hanzi: item.hanzi,
          pinyin: item.pinyin,
        })),
        ...lesson.sentencePatterns.map((pattern) => ({
          id: pattern.id,
          hanzi: pattern.pattern,
          pinyin: pattern.pinyin,
        })),
        ...lesson.sentencePatterns.flatMap((pattern) =>
          (pattern.examples ?? []).map((example, index) => ({
            id: `${pattern.id}.examples[${index}]`,
            hanzi: example.hanzi,
            pinyin: example.pinyin,
          })),
        ),
        ...Object.values(lesson.practice).flatMap((prompts) =>
          prompts.flatMap((prompt) =>
            prompt.pinyin
              ? [{ id: prompt.id, hanzi: prompt.target, pinyin: prompt.pinyin }]
              : [],
          ),
        ),
      ]

      for (const entry of entries) {
        expect(
          pinyinTokens(entry.pinyin).length,
          `${lesson.id}/${entry.id} must separate every spoken unit: ${entry.pinyin}`,
        ).toBe(countExpectedPinyinTokens(entry.hanzi, entry.pinyin))
      }
    }
  })
})
