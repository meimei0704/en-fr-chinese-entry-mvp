import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const expectedLessonIds = [
  'daily-greetings',
  'self-intro',
  'ask-directions',
  'order-food',
  'phone-and-payment',
  'restaurant-order',
  'train-station-ticket',
  'metro-ticket',
  'convenience-store-run',
  'ask-for-help-problem',
  'pharmacy-help',
  'small-talk',
] as const

const newLessonIds = ['pharmacy-help', 'ask-for-help-problem', 'train-station-ticket'] as const

const expectedReviewFrontsByNewLesson = {
  'pharmacy-help': ['药店', '头疼', '一天两次', '肚子疼', '过敏', '饭后'],
  'ask-for-help-problem': ['帮我一下', '有问题', '慢一点', '没电', '密码', '没关系'],
  'train-station-ticket': ['火车站', '车票', '三点出发', '硬座', '站台', '晚点'],
} as const

const expectedKeyChineseByNewLesson = {
  'pharmacy-help': /头疼|发烧|肚子疼|过敏|止疼药|饭前|饭后/,
  'ask-for-help-problem': /帮我一下|手机有问题|不能支付|慢一点|没电|无线网|充电|没关系/,
  'train-station-ticket': /上海|今天下午|护照|硬座|站台|晚点|三点出发/,
} as const

const expectedDailyGreetingsChinese = [
  '你好。',
  '您好。',
  '大家好。',
  '早上好。',
  '下午好。',
  '晚上好。',
  '晚安。',
  '你好吗？',
  '我很好，谢谢。',
  '很高兴认识你。',
  '谢谢。',
  '不客气。',
  '不好意思。',
  '对不起。',
  '没关系。',
  '是的。',
  '不是。',
  '再见。',
] as const

const expectedArrivalChinese = [
  '请问您会说英语吗？',
  '行李提取处在哪里？',
  '您能帮我一下吗？',
  '这是我的护照。',
  '我是来旅游的。',
  '我大概待两个星期。',
  '地铁在哪里？',
  '机场快线在哪里？',
  '请问去哪里打车？',
  '去这个酒店怎么走？',
] as const

async function collectAudioPaths() {
  const { course } = await import('./course')

  return course.lessons.flatMap((lesson) => collectLessonAudioPaths(lesson))
}

function collectLessonAudioPaths(lesson: Awaited<ReturnType<typeof importCourse>>['lessons'][number]) {
  return [
    ...lesson.dialogue.lines.map((line) => line.audio),
    ...lesson.sentencePatterns.flatMap((pattern) =>
      pattern.audio
        ? [pattern.audio, ...(pattern.examples ?? []).map((example) => example.audio)]
        : [...(pattern.examples ?? []).map((example) => example.audio)],
    ),
    ...lesson.vocabulary.map((item) => item.audio),
    ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.audio)),
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

describe('course content', () => {
  it('exposes twelve lessons in canonical journey order with static audio paths', async () => {
    const { course } = await import('./course')

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons).toHaveLength(12)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual(expectedLessonIds)

    const expandedCounts: Record<string, Record<string, number>> = {
      'daily-greetings': { dialogue: 18, patterns: 3, vocab: 11, practice: 2, cards: 6 },
      'self-intro': { dialogue: 10, patterns: 5, vocab: 10, practice: 2, cards: 6 },
      'ask-directions': { dialogue: 11, patterns: 11, vocab: 10, practice: 2, cards: 6 },
      'order-food': { dialogue: 14, patterns: 13, vocab: 10, practice: 2, cards: 6 },
      'phone-and-payment': { dialogue: 9, patterns: 9, vocab: 10, practice: 2, cards: 6 },
      'restaurant-order': { dialogue: 14, patterns: 14, vocab: 10, practice: 2, cards: 6 },
      'train-station-ticket': { dialogue: 12, patterns: 12, vocab: 15, practice: 2, cards: 6 },
      'metro-ticket': { dialogue: 9, patterns: 9, vocab: 14, practice: 2, cards: 6 },
      'convenience-store-run': { dialogue: 14, patterns: 12, vocab: 10, practice: 2, cards: 6 },
      'ask-for-help-problem': { dialogue: 16, patterns: 14, vocab: 10, practice: 2, cards: 6 },
      'pharmacy-help': { dialogue: 13, patterns: 13, vocab: 11, practice: 2, cards: 6 },
      'small-talk': { dialogue: 13, patterns: 11, vocab: 10, practice: 2, cards: 6 },
    }

    for (const lesson of course.lessons) {
      const counts = expandedCounts[lesson.id]
      if (counts) {
        expect(lesson.dialogue.lines).toHaveLength(counts.dialogue)
        expect(lesson.sentencePatterns).toHaveLength(counts.patterns)
        expect(lesson.vocabulary).toHaveLength(counts.vocab)
        expect(lesson.practice.listening).toHaveLength(counts.practice)
        expect(lesson.practice.speaking).toHaveLength(counts.practice)
        expect(lesson.practice.reading).toHaveLength(counts.practice)
        expect(lesson.reviewCards).toHaveLength(counts.cards)
      } else {
        expect(lesson.dialogue.lines).toHaveLength(5)
        expect(lesson.sentencePatterns).toHaveLength(3)
        expect(lesson.vocabulary).toHaveLength(5)
        expect(lesson.practice.listening).toHaveLength(1)
        expect(lesson.practice.speaking).toHaveLength(1)
        expect(lesson.practice.reading).toHaveLength(1)
        expect(lesson.reviewCards).toHaveLength(3)
      }
    }
  })

  it('uses lesson one as the daily greetings lesson with all approved phrases', async () => {
    const { course } = await import('./course')
    const lesson = course.lessons[0]
    const text = [
      lesson.title.en,
      lesson.title.fr,
      lesson.scenario.en,
      lesson.scenario.fr,
      lesson.dialogue.title.en,
      lesson.dialogue.title.fr,
      ...lesson.dialogue.lines.map((line) => line.hanzi),
      ...lesson.sentencePatterns.flatMap((pattern) => [
        pattern.pattern,
        ...(pattern.examples?.map((example) => example.hanzi) ?? []),
      ]),
      ...lesson.vocabulary.map((item) => item.hanzi),
      ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.target)),
      ...lesson.reviewCards.map((card) => card.front),
    ].join('\n')

    expect(lesson.id).toBe('daily-greetings')
    expect(lesson.title).toEqual({
      en: '打招呼 / Daily greetings',
      fr: '打招呼 / Salutations quotidiennes',
    })
    expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
      Array.from({ length: 18 }, (_, index) => `daily-greetings-line-${String(index + 1).padStart(2, '0')}`),
    )

    for (const phrase of expectedDailyGreetingsChinese) {
      expect(text).toContain(phrase)
    }
  })

  it('pins the revised daily-greetings explanations, reply, and useful patterns', async () => {
    const { course } = await import('./course')
    const lesson = course.lessons[0]
    const linesByHanzi = new Map(lesson.dialogue.lines.map((line) => [line.hanzi, line]))
    const vocabularyByHanzi = new Map(lesson.vocabulary.map((item) => [item.hanzi, item]))

    expect(linesByHanzi.get('您好。')?.explanation.en).toBe(
      '您 = polite ‘you’｜好 = good / well. 您好 is a respectful greeting for elders, service staff, superiors, or strangers.',
    )
    expect(linesByHanzi.get('早上好。')?.explanation.en).toBe(
      '早上 = morning｜好 = good. Use 早上好 as a morning greeting, roughly from waking up until noon.',
    )
    expect(linesByHanzi.get('很高兴认识你。')?.explanation.en).toBe(
      '很 = very｜高兴 = glad / happy｜认识 = meet / get to know｜你 = you. Use this when meeting someone for the first time.',
    )

    const apologyIndex = lesson.dialogue.lines.findIndex((line) => line.hanzi === '对不起。')
    expect(lesson.dialogue.lines[apologyIndex + 1]).toEqual(
      expect.objectContaining({
        id: 'daily-greetings-line-15',
        hanzi: '没关系。',
        audio: '/audio/daily-greetings/line-15.mp3',
      }),
    )
    expect(vocabularyByHanzi.get('没关系')).toEqual(
      expect.objectContaining({
        id: 'daily-greetings-vocab-9',
        audio: '/audio/daily-greetings/vocab-09.mp3',
      }),
    )

    expect(lesson.sentencePatterns.map((pattern) => pattern.id)).toEqual([
      'daily-greetings-pattern-2',
      'daily-greetings-pattern-4',
      'daily-greetings-pattern-5',
    ])
    expect(lesson.sentencePatterns.map((pattern) => pattern.pattern)).toEqual([
      '……吗？',
      '很高兴……。',
      '不好意思，……。',
    ])
    expect(lesson.sentencePatterns[0]?.meaning.en).toBe(
      'A particle at the end of a sentence, to make a yes-no question. No real meaning.',
    )
    expect(
      lesson.sentencePatterns.flatMap((pattern) =>
        (pattern.examples ?? []).map(({ hanzi, en, fr }) => ({ hanzi, en, fr })),
      ),
    ).toEqual([
      { hanzi: '你好吗？', en: 'How are you?', fr: 'Comment allez-vous ?' },
      { hanzi: '你有空吗？', en: 'Are you free?', fr: 'Êtes-vous libre ?' },
      { hanzi: '好吃吗？', en: 'Is it tasty?', fr: "Est-ce que c'est bon ?" },
      {
        hanzi: '很高兴认识你。',
        en: 'Nice to meet you.',
        fr: 'Enchanté(e) de faire votre connaissance.',
      },
      {
        hanzi: '很高兴见到你。',
        en: 'Nice to see you.',
        fr: 'Je suis ravi de vous voir.',
      },
      {
        hanzi: '很高兴认识大家。',
        en: 'Nice to meet everyone.',
        fr: 'Enchanté(e) de faire connaissance avec tout le monde.',
      },
      {
        hanzi: '不好意思，打扰一下。',
        en: 'Excuse me for bothering you.',
        fr: 'Excusez-moi de vous déranger.',
      },
      {
        hanzi: '不好意思，借过一下。',
        en: 'Excuse me, may I pass?',
        fr: 'Excusez-moi, puis-je passer ?',
      },
      {
        hanzi: '不好意思，我不会说中文。',
        en: "Excuse me, I don't speak Chinese.",
        fr: 'Excusez-moi, je ne parle pas chinois.',
      },
    ])
  })

  it('uses lesson two as the arrival-at-the-airport lesson with the approved sentences', async () => {
    const { course } = await import('./course')
    const lesson = course.lessons[1]
    const text = [
      lesson.title.en,
      lesson.title.fr,
      lesson.scenario.en,
      lesson.scenario.fr,
      lesson.dialogue.title.en,
      lesson.dialogue.title.fr,
      ...lesson.dialogue.lines.map((line) => line.hanzi),
      ...lesson.sentencePatterns.flatMap((pattern) => [
        pattern.pattern,
        ...(pattern.examples?.map((example) => example.hanzi) ?? []),
      ]),
      ...lesson.vocabulary.map((item) => item.hanzi),
      ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.target)),
      ...lesson.reviewCards.map((card) => card.front),
    ].join('\n')

    expect(lesson.id).toBe('self-intro')
    expect(lesson.title).toEqual({
      en: '到达机场 / Arrival at the airport',
      fr: '到达机场 / Arrivée à l’aéroport',
    })
    expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `self-intro-line-${String(index + 1).padStart(2, '0')}`),
    )

    for (const phrase of expectedArrivalChinese) {
      expect(text).toContain(phrase)
    }
  })

  it('keeps the new small-talk lesson as the final lesson', async () => {
    const { course } = await import('./course')
    const lesson = course.lessons[11]

    expect(lesson.id).toBe('small-talk')
    expect(lesson.title).toEqual({
      en: '闲聊和赞美 / Small talk and compliment',
      fr: '闲聊和赞美 / Petite conversation et compliments',
    })
    expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
      Array.from({ length: 13 }, (_, index) => `small-talk-line-${String(index + 1).padStart(2, '0')}`),
    )
  })

  it('keeps the approved key phrases and review fronts for the later lessons', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    for (const lessonId of newLessonIds) {
      const lesson = byId[lessonId]
      const chineseText = [
        ...lesson.dialogue.lines.map((line) => line.hanzi),
        ...lesson.sentencePatterns.flatMap((pattern) => [
          pattern.pattern,
          ...(pattern.examples?.map((example) => example.hanzi) ?? []),
        ]),
        ...lesson.vocabulary.map((item) => item.hanzi),
        ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.target)),
      ].join('\n')

      expect(chineseText).toMatch(expectedKeyChineseByNewLesson[lessonId])
      expect(lesson.reviewCards.map((card) => card.front)).toEqual(
        expect.arrayContaining(expectedReviewFrontsByNewLesson[lessonId]),
      )
    }
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
        expect(pattern.pinyin, `${pattern.id}.pinyin`).toMatch(/\S/)
        if (pattern.examples && pattern.examples.length > 0) {
          pattern.examples.forEach((example, index) => {
            expect(example.hanzi, `${pattern.id}.examples[${index}].hanzi`).toMatch(/\S/)
            expect(example.pinyin, `${pattern.id}.examples[${index}].pinyin`).toMatch(/\S/)
            expect(example.fill, `${pattern.id}.examples[${index}].fill`).toMatch(/\S/)
            expect(example.en, `${pattern.id}.examples[${index}].en`).toMatch(/\S/)
            expect(example.fr, `${pattern.id}.examples[${index}].fr`).toMatch(/\S/)
          })
        }
      })

      lesson.vocabulary.forEach((item) => {
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
    }
  })

  it('keeps the expanded course beginner-focused in English and French explanations', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    expect(collectLocalizedStrings(byId['daily-greetings'], 'en').join('\n').toLowerCase()).toMatch(
      /hello|goodbye|thank you|polite|greeting/,
    )
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
    expect(collectLocalizedStrings(byId['small-talk'], 'en').join('\n').toLowerCase()).toMatch(
      /where are you from|weather|chat|small talk/,
    )
  })

  it('ships non-empty MP3 audio files for every Chinese playback reference', async () => {
    const audioPaths = await collectAudioPaths()

    expect(audioPaths).toHaveLength(607)
    expect(new Set(audioPaths).size).toBe(553)

    for (const audioPath of audioPaths) {
      expect(audioPath).toMatch(
        /^\/audio\/[a-z0-9-]+\/(?:line|pattern|vocab|practice-(?:listening|speaking|reading)|pattern-\d{2}-example)-\d{2}\.mp3$/,
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
