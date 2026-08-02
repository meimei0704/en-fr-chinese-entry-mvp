import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const expectedLessonIds = [
  'self-intro',
  'ask-directions',
  'order-food',
  'phone-and-payment',
  'convenience-store-run',
  'restaurant-order',
  'metro-ticket',
  'pharmacy-help',
  'ask-for-help-problem',
  'train-station-ticket',
] as const

const newLessonIds = expectedLessonIds.slice(5)

const expectedReviewFrontsByNewLesson = {
  'restaurant-order': ['菜单', '牛肉面', '不要辣'],
  'metro-ticket': ['地铁', '二号线', '要几站？'],
  'pharmacy-help': ['药店', '头疼', '一天两次'],
  'ask-for-help-problem': ['帮我一下', '有问题', '慢一点'],
  'train-station-ticket': ['火车站', '车票', '三点出发'],
} as const

const expectedKeyChineseByNewLesson = {
  'restaurant-order': /菜单|牛肉面|不要辣|一共多少钱/,
  'metro-ticket': /人民广场|二号线|一张去人民广场的票|三站/,
  'pharmacy-help': /头疼|发烧|一天两次|多少钱/,
  'ask-for-help-problem': /帮我一下|手机有问题|不能支付|慢一点/,
  'train-station-ticket': /上海|今天下午|护照|三点出发/,
} as const

const expectedArrivalChinese = [
  '您好。',
  '请问，您能帮我一下吗？',
  '这是我的护照。',
  '请问行李提取处在哪里？',
  '我的行李还没到。',
  '请问出口在哪里？',
  '请问问询台在哪里？',
  '请问出租车在哪里？',
  '我想去这个地址。',
  '请到这里。',
  '大概需要多久？',
  '大概多少钱？',
  '请说慢一点。',
  '我听不懂。',
  '可以帮我写下来吗？',
] as const

async function collectAudioPaths() {
  const { course } = await import('./course')

  return course.lessons.flatMap((lesson) => collectLessonAudioPaths(lesson))
}

function collectLessonAudioPaths(lesson: Awaited<ReturnType<typeof importCourse>>['lessons'][number]) {
  return [
    ...lesson.dialogue.lines.map((line) => line.audio),
    ...lesson.sentencePatterns.map((pattern) => pattern.audio),
    ...lesson.vocabulary.map((item) => item.audio),
    ...lesson.pronunciation.map((tip) => tip.audio),
    ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.audio)),
    lesson.shortInput.audio,
  ]
}

async function importCourse() {
  const { course } = await import('./course')

  return course
}

function collectLocalizedStrings(value: unknown, locale: 'en' | 'fr'): string[] {
  if (typeof value !== 'object' || value === null) {
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectLocalizedStrings(item, locale))
  }

  const record = value as Record<string, unknown>
  const localizedValue = typeof record[locale] === 'string' ? [record[locale]] : []
  const nestedValues = Object.entries(record)
    .filter(([key]) => key !== 'en' && key !== 'fr')
    .flatMap(([, item]) => collectLocalizedStrings(item, locale))

  return [...localizedValue, ...nestedValues]
}

function expectLocalizedField(value: unknown, fieldPath: string) {
  expect(value, `${fieldPath} should provide English and French copy`).toEqual(
    expect.objectContaining({
      en: expect.stringMatching(/\S/),
      fr: expect.stringMatching(/\S/),
    }),
  )
}

function numberedAudioPaths(lessonId: string, prefix: string, count: number) {
  return Array.from(
    { length: count },
    (_, index) => `/audio/${lessonId}/${prefix}-${String(index + 1).padStart(2, '0')}.mp3`,
  )
}

function expectedNewLessonAudioPaths(lessonId: string) {
  return [
    ...numberedAudioPaths(lessonId, 'line', 5),
    ...numberedAudioPaths(lessonId, 'pattern', 3),
    ...numberedAudioPaths(lessonId, 'vocab', 5),
    `/audio/${lessonId}/pronunciation-01.mp3`,
    `/audio/${lessonId}/practice-listening-01.mp3`,
    `/audio/${lessonId}/practice-speaking-01.mp3`,
    `/audio/${lessonId}/practice-reading-01.mp3`,
    `/audio/${lessonId}/short-input-01.mp3`,
  ]
}

describe('course content', () => {
  it('exposes ten formal survival lessons in canonical journey order with static audio paths', async () => {
    const { course } = await import('./course')

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons).toHaveLength(10)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual(expectedLessonIds)

    for (const lesson of course.lessons) {
      expect(lesson.sentencePatterns).toHaveLength(3)
      expect(lesson.vocabulary).toHaveLength(5)
      expect(lesson.pronunciation).toHaveLength(1)
      expect(lesson.hanziRecognition).toHaveLength(4)
      expect(lesson.practice.listening).toHaveLength(1)
      expect(lesson.practice.speaking).toHaveLength(1)
      expect(lesson.practice.reading).toHaveLength(1)
      expect(lesson.reviewCards).toHaveLength(3)
      expect(lesson.shortInput.audio).toMatch(/^\/audio\//)
    }
  })

  it('adds complete lesson 6-10 content without renaming the first five lesson ids', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    expect(course.lessons.slice(0, 5).map((lesson) => lesson.id)).toEqual([
      'self-intro',
      'ask-directions',
      'order-food',
      'phone-and-payment',
      'convenience-store-run',
    ])
    expect(byId['order-food'].title.en.toLowerCase()).toMatch(/hotel|apartment|check-in/)

    for (const lessonId of newLessonIds) {
      const lesson = byId[lessonId]
      expect(lesson, `${lessonId} should be present`).toBeDefined()
      expect(lesson.dialogue.lines).toHaveLength(5)
      expect(lesson.sentencePatterns.map((pattern) => pattern.id)).toEqual([
        `${lessonId}-pattern-1`,
        `${lessonId}-pattern-2`,
        `${lessonId}-pattern-3`,
      ])
      expect(lesson.vocabulary.map((item) => item.id)).toEqual([
        `${lessonId}-vocab-1`,
        `${lessonId}-vocab-2`,
        `${lessonId}-vocab-3`,
        `${lessonId}-vocab-4`,
        `${lessonId}-vocab-5`,
      ])
      expect(lesson.pronunciation.map((tip) => tip.id)).toEqual([
        `${lessonId}-pronunciation-1`,
      ])
      expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
        Array.from({ length: 5 }, (_, index) => `${lessonId}-line-0${index + 1}`),
      )
      expect(lesson.shortInput.id).toBe(`${lessonId}-short-input-01`)
      expect(collectLessonAudioPaths(lesson)).toEqual(expectedNewLessonAudioPaths(lessonId))
    }
  })

  it('locks the approved new key phrases and review fronts for lessons 6-10', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    for (const lessonId of newLessonIds) {
      const lesson = byId[lessonId]
      const chineseText = [
        ...lesson.dialogue.lines.map((line) => line.hanzi),
        ...lesson.sentencePatterns.map((pattern) => pattern.example),
        ...lesson.vocabulary.map((item) => item.hanzi),
        ...lesson.pronunciation.map((tip) => tip.audioText),
        ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.target)),
        lesson.shortInput.target,
      ].join('\n')

      expect(chineseText).toMatch(expectedKeyChineseByNewLesson[lessonId])
      expect(lesson.reviewCards.map((card) => card.front)).toEqual(
        expect.arrayContaining(expectedReviewFrontsByNewLesson[lessonId]),
      )
    }
  })

  it('uses lesson one as the approved airport-arrival sample without immigration or hotel-stay copy', async () => {
    const { course } = await import('./course')
    const lesson = course.lessons[0]
    const arrivalText = [
      lesson.title.en,
      lesson.title.fr,
      lesson.scenario.en,
      lesson.scenario.fr,
      lesson.dialogue.title.en,
      lesson.dialogue.title.fr,
      ...lesson.dialogue.lines.map((line) => line.hanzi),
      ...lesson.sentencePatterns.map((pattern) => pattern.example),
      ...lesson.vocabulary.map((item) => item.hanzi),
      ...lesson.pronunciation.map((tip) => tip.audioText),
      ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.target)),
      ...lesson.reviewCards.map((card) => card.front),
      lesson.shortInput.target,
    ].join('\n')

    expect(lesson.id).toBe('self-intro')
    expect(lesson.title).toEqual({
      en: '到达机场 / Arrival at the airport',
      fr: '到达机场 / Arrivée à l’aéroport',
    })
    expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
      Array.from({ length: 7 }, (_, index) => `self-intro-line-0${index + 1}`),
    )

    for (const phrase of expectedArrivalChinese) {
      expect(arrivalText).toContain(phrase)
    }

    expect(arrivalText).not.toContain('你好')
    expect(arrivalText).not.toMatch(/Immigration|immigration|移民/)
    expect(arrivalText).not.toContain('我住在这个酒店')
    expect(arrivalText).not.toContain('住在这个酒店')
  })

  it('keeps all learner-facing copy consistently bilingual', async () => {
    const { course } = await import('./course')

    for (const lesson of course.lessons) {
      expectLocalizedField(lesson.title, `${lesson.id}.title`)
      expectLocalizedField(lesson.scenario, `${lesson.id}.scenario`)
      expectLocalizedField(lesson.dialogue.title, `${lesson.id}.dialogue.title`)

      lesson.dialogue.lines.forEach((line) => {
        expectLocalizedField(line.translation, `${line.id}.translation`)
        expectLocalizedField(line.explanation, `${line.id}.explanation`)
      })

      lesson.sentencePatterns.forEach((pattern) => {
        expectLocalizedField(pattern.meaning, `${pattern.id}.meaning`)
        expectLocalizedField(pattern.explanation, `${pattern.id}.explanation`)
      })

      lesson.vocabulary.forEach((item) => {
        expectLocalizedField(item.meaning, `${item.id}.meaning`)
        expectLocalizedField(item.explanation, `${item.id}.explanation`)
      })

      lesson.pronunciation.forEach((tip) => {
        expectLocalizedField(tip.focus, `${tip.id}.focus`)
        expectLocalizedField(tip.tip, `${tip.id}.tip`)
        expectLocalizedField(tip.explanation, `${tip.id}.explanation`)
      })

      lesson.hanziRecognition.forEach((item) => {
        expectLocalizedField(item.meaning, `${item.id}.meaning`)
        expectLocalizedField(item.explanation, `${item.id}.explanation`)
      })

      Object.entries(lesson.practice).forEach(([section, prompts]) => {
        prompts.forEach((prompt) => {
          expectLocalizedField(prompt.prompt, `${prompt.id}.${section}.prompt`)
          expectLocalizedField(prompt.explanation, `${prompt.id}.${section}.explanation`)
        })
      })

      lesson.reviewCards.forEach((card) => {
        expectLocalizedField(card.back, `${card.id}.back`)
        expectLocalizedField(card.explanation, `${card.id}.explanation`)
      })

      expectLocalizedField(lesson.shortInput.prompt, `${lesson.id}.shortInput.prompt`)
      expectLocalizedField(lesson.shortInput.explanation, `${lesson.id}.shortInput.explanation`)
    }
  })

  it('keeps the expanded course beginner-focused in English and French explanations', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    expect(collectLocalizedStrings(byId['restaurant-order'], 'en').join('\n').toLowerCase()).toMatch(
      /menu|beef noodles|spicy|water/,
    )
    expect(collectLocalizedStrings(byId['metro-ticket'], 'fr').join('\n').toLowerCase()).toMatch(
      /métro|ticket|ligne|stations/,
    )
    expect(collectLocalizedStrings(byId['pharmacy-help'], 'en').join('\n').toLowerCase()).toMatch(
      /pharmacy|headache|fever|medicine/,
    )
    expect(
      collectLocalizedStrings(byId['ask-for-help-problem'], 'fr').join('\n').toLowerCase(),
    ).toMatch(/aider|problème|téléphone|lentement/)
    expect(
      collectLocalizedStrings(byId['train-station-ticket'], 'en').join('\n').toLowerCase(),
    ).toMatch(/train station|ticket|shanghai|passport/)
  })

  it('ships non-empty MP3 audio files for every Chinese playback reference', async () => {
    const audioPaths = await collectAudioPaths()

    expect(audioPaths).toHaveLength(182)
    expect(new Set(audioPaths).size).toBe(audioPaths.length)

    for (const audioPath of audioPaths) {
      expect(audioPath).toMatch(
        /^\/audio\/[a-z0-9-]+\/(?:line|pattern|vocab|pronunciation|short-input|practice-(?:listening|speaking|reading))-\d{2}\.mp3$/,
      )
      const publicPath = `${process.cwd()}/public${audioPath}`
      expect(existsSync(publicPath), `missing ${audioPath}`).toBe(true)
      expect(statSync(publicPath).size, `${audioPath} should not be a placeholder`).toBeGreaterThan(1024)

      const header = readFileSync(publicPath).subarray(0, 3)
      const hasId3Header = header.toString('utf8') === 'ID3'
      const hasFrameSync = header[0] === 0xff && (header[1] & 0xe0) === 0xe0
      expect(hasId3Header || hasFrameSync, `${audioPath} should look like an MP3 file`).toBe(true)
    }
  })
})
