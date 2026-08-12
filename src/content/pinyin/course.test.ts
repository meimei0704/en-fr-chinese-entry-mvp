import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
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

  it('maps all 24 finals to their approved first-tone reference MP3s', () => {
    const finalsModule = pinyinCourse.modules.find((module) => module.id === 'finals')
    const finalItems = finalsModule?.reference.flatMap((group) => group.items) ?? []
    const expectedFinals = [
      ['a', 'ā', '啊', '/audio/pinyin/lesson-1/reference-final-a.mp3'],
      ['o', 'ō', '喔', '/audio/pinyin/lesson-1/reference-final-o.mp3'],
      ['e', 'ē', '婀', '/audio/pinyin/lesson-1/reference-final-e.mp3'],
      ['i', 'ī', '衣', '/audio/pinyin/lesson-1/reference-final-i.mp3'],
      ['u', 'ū', '乌', '/audio/pinyin/lesson-1/reference-final-u.mp3'],
      ['ü', 'ǖ', '迂', '/audio/pinyin/lesson-1/reference-final-ue.mp3'],
      ['ai', 'āi', '哀', '/audio/pinyin/lesson-3/reference-final-ai.mp3'],
      ['ei', 'ēi', '诶', '/audio/pinyin/lesson-3/reference-final-ei.mp3'],
      ['ui', 'uī', '威', '/audio/pinyin/lesson-3/reference-final-ui.mp3'],
      ['ao', 'āo', '凹', '/audio/pinyin/lesson-3/reference-final-ao.mp3'],
      ['ou', 'ōu', '欧', '/audio/pinyin/lesson-3/reference-final-ou.mp3'],
      ['iu', 'iū', '忧', '/audio/pinyin/lesson-3/reference-final-iu.mp3'],
      ['ie', 'iē', '椰', '/audio/pinyin/lesson-3/reference-final-ie.mp3'],
      ['üe', 'üē', '约', '/audio/pinyin/lesson-3/reference-final-ue.mp3'],
      ['er', 'ēr', '儿', '/audio/pinyin/lesson-3/reference-final-er.mp3'],
      ['an', 'ān', '安', '/audio/pinyin/lesson-3/reference-final-an.mp3'],
      ['en', 'ēn', '恩', '/audio/pinyin/lesson-3/reference-final-en.mp3'],
      ['in', 'īn', '因', '/audio/pinyin/lesson-3/reference-final-in.mp3'],
      ['un', 'ūn', '温', '/audio/pinyin/lesson-3/reference-final-un.mp3'],
      ['ün', 'ǖn', '晕', '/audio/pinyin/lesson-3/reference-final-uen.mp3'],
      ['ang', 'āng', '肮', '/audio/pinyin/lesson-3/reference-final-ang.mp3'],
      ['eng', 'ēng', '鞥', '/audio/pinyin/lesson-3/reference-final-eng.mp3'],
      ['ing', 'īng', '英', '/audio/pinyin/lesson-3/reference-final-ing.mp3'],
      ['ong', 'ōng', '嗡', '/audio/pinyin/lesson-3/reference-final-ong.mp3'],
    ]

    expect(finalItems.map(({ label, pinyin, hanzi, audio }) => [label, pinyin, hanzi, audio])).toEqual(
      expectedFinals,
    )
    expect(finalItems.every((item) => item.emoji === undefined)).toBe(true)
  })

  it('locks the 24 approved finals MP3s to the sha256 manifest', () => {
    const manifestPath = join(
      process.cwd(),
      'public/audio/pinyin/reference-final.sha256',
    )
    const manifest = readFileSync(manifestPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split('  '))
      .map(([hash, relPath]) => ({ hash, relPath }))
    const finalsModule = pinyinCourse.modules.find((module) => module.id === 'finals')
    const referencedPaths = new Set(
      finalsModule?.reference.flatMap((group) =>
        group.items.map((item) => item.audio.replace('/audio/pinyin/', '')),
      ) ?? [],
    )
    const assetPaths = new Set(
      ['lesson-1', 'lesson-3'].flatMap((lesson) =>
        readdirSync(join(process.cwd(), 'public/audio/pinyin', lesson))
          .filter((fileName) => fileName.startsWith('reference-final-') && fileName.endsWith('.mp3'))
          .map((fileName) => `${lesson}/${fileName}`),
      ),
    )
    const manifestPaths = new Set(manifest.map(({ relPath }) => relPath))

    expect(manifest).toHaveLength(24)
    expect(referencedPaths).toEqual(manifestPaths)
    expect(assetPaths).toEqual(manifestPaths)

    for (const { hash, relPath } of manifest) {
      const filePath = join(process.cwd(), 'public/audio/pinyin', relPath)
      const liveHash = createHash('sha256').update(readFileSync(filePath)).digest('hex')
      expect(
        liveHash,
        `${relPath} should play the approved standalone final in first tone`,
      ).toBe(hash)
    }
  })

  it('maps all 16 whole syllables to their approved first-tone MP3s', () => {
    const wholeSyllablesModule = pinyinCourse.modules.find(
      (module) => module.id === 'whole-syllables',
    )
    const expectedWholeSyllables = [
      ['zhi', 'zhī', '/audio/pinyin/whole-syllables/reference-whole-zhi.mp3'],
      ['chi', 'chī', '/audio/pinyin/whole-syllables/reference-whole-chi.mp3'],
      ['shi', 'shī', '/audio/pinyin/whole-syllables/reference-whole-shi.mp3'],
      ['ri', 'rī', '/audio/pinyin/whole-syllables/reference-whole-ri.mp3'],
      ['zi', 'zī', '/audio/pinyin/whole-syllables/reference-whole-zi.mp3'],
      ['ci', 'cī', '/audio/pinyin/whole-syllables/reference-whole-ci.mp3'],
      ['si', 'sī', '/audio/pinyin/whole-syllables/reference-whole-si.mp3'],
      ['yi', 'yī', '/audio/pinyin/whole-syllables/reference-whole-yi.mp3'],
      ['wu', 'wū', '/audio/pinyin/whole-syllables/reference-whole-wu.mp3'],
      ['yu', 'yū', '/audio/pinyin/whole-syllables/reference-whole-yu.mp3'],
      ['ye', 'yē', '/audio/pinyin/whole-syllables/reference-whole-ye.mp3'],
      ['yue', 'yuē', '/audio/pinyin/whole-syllables/reference-whole-yue.mp3'],
      ['yuan', 'yuān', '/audio/pinyin/whole-syllables/reference-whole-yuan.mp3'],
      ['yin', 'yīn', '/audio/pinyin/whole-syllables/reference-whole-yin.mp3'],
      ['yun', 'yūn', '/audio/pinyin/whole-syllables/reference-whole-yun.mp3'],
      ['ying', 'yīng', '/audio/pinyin/whole-syllables/reference-whole-ying.mp3'],
    ]

    expect(
      wholeSyllablesModule?.wholeSyllables?.map(({ bare, pinyin, audio }) => [
        bare,
        pinyin,
        audio,
      ]),
    ).toEqual(expectedWholeSyllables)
    expect(
      wholeSyllablesModule?.wholeSyllables?.every(
        (item) => item.hanzi === undefined && item.emoji === undefined,
      ),
    ).toBe(true)
  })

  it('locks the 16 approved whole syllable MP3s to the sha256 manifest', () => {
    const manifestPath = join(
      process.cwd(),
      'public/audio/pinyin/reference-whole-syllable.sha256',
    )
    const manifest = readFileSync(manifestPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split('  '))
      .map(([hash, relPath]) => ({ hash, relPath }))
    const wholeSyllablesModule = pinyinCourse.modules.find(
      (module) => module.id === 'whole-syllables',
    )
    const referencedPaths = new Set(
      wholeSyllablesModule?.wholeSyllables?.map((item) =>
        item.audio.replace('/audio/pinyin/', ''),
      ) ?? [],
    )
    const assetPaths = new Set(
      readdirSync(join(process.cwd(), 'public/audio/pinyin/whole-syllables'))
        .filter((fileName) => fileName.startsWith('reference-whole-') && fileName.endsWith('.mp3'))
        .map((fileName) => `whole-syllables/${fileName}`),
    )
    const manifestPaths = new Set(manifest.map(({ relPath }) => relPath))

    expect(manifest).toHaveLength(16)
    expect(referencedPaths).toEqual(manifestPaths)
    expect(assetPaths).toEqual(manifestPaths)

    for (const { hash, relPath } of manifest) {
      const filePath = join(process.cwd(), 'public/audio/pinyin', relPath)
      const liveHash = createHash('sha256').update(readFileSync(filePath)).digest('hex')
      expect(
        liveHash,
        `${relPath} should play the approved whole syllable in first tone`,
      ).toBe(hash)
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
