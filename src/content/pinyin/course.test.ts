import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { pinyinCourse } from './course'

describe('pinyin course content', () => {
  it('locks the four-module Pinyin course contract', () => {
    const modules = pinyinCourse.modules

    expect(modules.map((m) => m.id)).toEqual([
      'initials',
      'finals',
      'tones',
      'whole-syllables',
    ])
    expect(modules[0].reference.length).toBeGreaterThanOrEqual(4)
    expect(modules[1].reference.length).toBeGreaterThanOrEqual(4)
    expect(modules[2].reference.length).toBe(1)
    expect(modules[2].wholeSyllables).toBeUndefined()
    expect(modules[3].reference).toEqual([])
    expect(modules[3].wholeSyllables).toHaveLength(16)
  })

  it('keeps tone game question counts stable across modules', () => {
    for (const module of pinyinCourse.modules) {
      if (module.toneGame) {
        expect(module.toneGame.questions).toHaveLength(8)
      }
    }
  })

  it('locks tone game answer choices and audio prompt paths', () => {
    for (const module of pinyinCourse.modules) {
      for (const question of module.toneGame?.questions ?? []) {
        expect(question.choices.length).toBeGreaterThanOrEqual(2)
        expect(question.choices.map((choice) => choice.id)).toContain(question.correctChoiceId)
        expect(question.promptAudio).toMatch(/^\/audio\/pinyin\/lesson-\d\//)
      }
    }
  })

  it('ships real static MP3 assets for every module audio path', () => {
    const allAudioPaths = pinyinCourse.modules.flatMap((module) => [
      ...module.reference.flatMap((group) => group.items.map((item) => item.audio)),
      ...(module.toneGame?.questions.map((question) => question.promptAudio) ?? []),
      ...(module.wholeSyllables?.map((item) => item.audio) ?? []),
    ])

    expect(allAudioPaths.length).toBe(92)

    for (const audioPath of allAudioPaths) {
      expect(audioPath).toMatch(/^\/audio\/pinyin\/(lesson-\d|whole-syllables)\/.+\.mp3$/)
      const publicFilePath = join(process.cwd(), 'public', audioPath.replace(/^\//, ''))
      expect(statSync(publicFilePath).size).toBeGreaterThan(0)
    }
  })

  it('locks the 23 initial call-sound MP3s to the sha256 manifest', () => {
    const manifestPath = join(
      process.cwd(),
      'public/audio/pinyin/reference-initial.sha256',
    )
    const manifest = readFileSync(manifestPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split('  '))
      .map(([hash, relPath]) => ({ hash, relPath }))

    expect(manifest).toHaveLength(23)

    for (const { hash, relPath } of manifest) {
      const filePath = join(process.cwd(), 'public/audio/pinyin', relPath)
      const liveHash = createHash('sha256').update(readFileSync(filePath)).digest('hex')
      expect(
        liveHash,
        `${relPath} should play the initial call sound (呼读音), not an example word`,
      ).toBe(hash)
    }
  })

  it('keeps the Go embed pinyin_course.json in sync with the TS source', () => {
    const embedPath = join(process.cwd(), 'pkg/pinyincontent/data/pinyin_course.json')
    const embedded = readFileSync(embedPath, 'utf8')
    expect(embedded).toBe(`${JSON.stringify(pinyinCourse)}\n`)
  })
})
