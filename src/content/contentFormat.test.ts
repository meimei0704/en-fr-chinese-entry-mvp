import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { course } from './course'
import { createInitialContentSeed, renderInitialContentSeedSql } from '../server/content/seed'

type PinyinEntry = {
  path: string
  value: string
}

type PatternContainer = {
  lessons: Array<{
    id: string
    dialogue: { lines: Array<{ hanzi: string }> }
    sentencePatterns: Array<{ id: string; pattern: string; examples?: unknown[] }>
  }>
}

function collectPinyinEntries(value: unknown, path = '$'): PinyinEntry[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectPinyinEntries(item, `${path}[${index}]`))
  }

  if (typeof value !== 'object' || value === null) {
    return []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const childPath = `${path}.${key}`
    const ownEntry =
      (key === 'pinyin' || key === 'fillPinyin') && typeof child === 'string'
        ? [{ path: childPath, value: child }]
        : []

    return [...ownEntry, ...collectPinyinEntries(child, childPath)]
  })
}

function withoutAllowedEnglishTerms(value: string) {
  return value.replaceAll('SIM', '').replaceAll('Wi-Fi', '')
}

function expectLowercasePinyin(entries: PinyinEntry[], source: string) {
  for (const entry of entries) {
    const normalized = withoutAllowedEnglishTerms(entry.value)
    expect(
      normalized,
      `${source} ${entry.path} must use lowercase pinyin: ${entry.value}`,
    ).toBe(normalized.toLocaleLowerCase())
  }
}

function expectUsefulPatternRules(value: PatternContainer, source: string) {
  for (const lesson of value.lessons) {
    const dialogueHanzi = lesson.dialogue.lines.map((line) => line.hanzi)

    for (const pattern of lesson.sentencePatterns) {
      expect(
        pattern.pattern,
        `${source} ${lesson.id}/${pattern.id} must contain an ellipsis placeholder`,
      ).toMatch(/…|\.{3}/)
      expect(
        dialogueHanzi,
        `${source} ${lesson.id}/${pattern.id} must not duplicate a dialogue phrase`,
      ).not.toContain(pattern.pattern)
      expect(
        pattern.examples?.length ?? 0,
        `${source} ${lesson.id}/${pattern.id} must include at least one example`,
      ).toBeGreaterThan(0)
    }
  }
}

describe('course content format', () => {
  it('uses lowercase pinyin except for the approved embedded English terms', () => {
    expectLowercasePinyin(collectPinyinEntries(course), 'course')
  })

  it('keeps Useful patterns to ellipsis formulas instead of repeated complete phrases', () => {
    expectUsefulPatternRules(course, 'course')
  })

  it('keeps generated seed payloads and SQL aligned with the pinyin rule', () => {
    const checkedInSnapshot = JSON.parse(
      readFileSync('pkg/seedgen/data/course.json', 'utf8'),
    ) as PatternContainer
    expectLowercasePinyin(collectPinyinEntries(checkedInSnapshot), 'course.json')
    expectUsefulPatternRules(checkedInSnapshot, 'course.json')

    const seed = createInitialContentSeed(course)
    const seedEntries = collectPinyinEntries(seed.revisions)
    expectLowercasePinyin(seedEntries, 'seed')

    const sqlEntries = [...renderInitialContentSeedSql(course).matchAll(/"(?:pinyin|fillPinyin)":"([^"]*)"/g)].map(
      (match, index) => ({ path: `sql[${index}]`, value: match[1] }),
    )
    expect(sqlEntries.length).toBeGreaterThan(0)
    expectLowercasePinyin(sqlEntries, 'sql')
  })
})
