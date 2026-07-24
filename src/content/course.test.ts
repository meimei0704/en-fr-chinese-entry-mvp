import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const expectedDialogueAudioByLesson = {
  'self-intro': [
    '/audio/self-intro/line-01.mp3',
    '/audio/self-intro/line-02.mp3',
    '/audio/self-intro/line-03.mp3',
    '/audio/self-intro/line-04.mp3',
  ],
  'ask-directions': [
    '/audio/ask-directions/line-01.mp3',
    '/audio/ask-directions/line-02.mp3',
    '/audio/ask-directions/line-03.mp3',
    '/audio/ask-directions/line-04.mp3',
    '/audio/ask-directions/line-05.mp3',
  ],
  'order-food': [
    '/audio/order-food/line-01.mp3',
    '/audio/order-food/line-02.mp3',
    '/audio/order-food/line-03.mp3',
    '/audio/order-food/line-04.mp3',
    '/audio/order-food/line-05.mp3',
  ],
  'phone-and-payment': [
    '/audio/phone-and-payment/line-01.mp3',
    '/audio/phone-and-payment/line-02.mp3',
    '/audio/phone-and-payment/line-03.mp3',
    '/audio/phone-and-payment/line-04.mp3',
    '/audio/phone-and-payment/line-05.mp3',
  ],
  'convenience-store-run': [
    '/audio/convenience-store-run/line-01.mp3',
    '/audio/convenience-store-run/line-02.mp3',
    '/audio/convenience-store-run/line-03.mp3',
    '/audio/convenience-store-run/line-04.mp3',
    '/audio/convenience-store-run/line-05.mp3',
  ],
} as const

const expectedShortInputAudioByLesson = {
  'self-intro': '/audio/self-intro/short-input-01.mp3',
  'ask-directions': '/audio/ask-directions/short-input-01.mp3',
  'order-food': '/audio/order-food/short-input-01.mp3',
  'phone-and-payment': '/audio/phone-and-payment/short-input-01.mp3',
  'convenience-store-run': '/audio/convenience-store-run/short-input-01.mp3',
} as const

async function collectAudioPaths() {
  const { course } = await import('./course')

  return course.lessons.flatMap((lesson) => [
    ...lesson.dialogue.lines.map((line) => line.audio),
    lesson.shortInput.audio,
  ])
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
  it('exposes five arrival lessons in journey order with bilingual explanations and static audio paths', async () => {
    const { course } = await import('./course')

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons).toHaveLength(5)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual([
      'self-intro',
      'ask-directions',
      'order-food',
      'phone-and-payment',
      'convenience-store-run',
    ])

    const firstLine = course.lessons[0].dialogue.lines[0]
    const firstLesson = course.lessons[0] as unknown as {
      title: { en?: string; fr?: string }
      scenario: { en?: string; fr?: string }
    }
    const localizedFirstLine = firstLine as unknown as {
      translation: { en?: string; fr?: string }
    }

    expect(firstLine.explanation.en.length).toBeGreaterThan(0)
    expect(firstLine.explanation.fr.length).toBeGreaterThan(0)
    expect(firstLesson.title.fr?.length ?? 0).toBeGreaterThan(0)
    expect(firstLesson.scenario.fr?.length ?? 0).toBeGreaterThan(0)
    expect(localizedFirstLine.translation.fr?.length ?? 0).toBeGreaterThan(0)
    expect(firstLine.audio).toMatch(/^\/audio\//)

    for (const lesson of course.lessons) {
      expect(lesson.sentencePatterns.length).toBeGreaterThan(0)
      expect(lesson.vocabulary.length).toBeGreaterThan(0)
      expect(lesson.pronunciation.length).toBeGreaterThan(0)
      expect(lesson.hanziRecognition.length).toBeGreaterThan(0)
      expect(lesson.practice.listening.length).toBeGreaterThan(0)
      expect(lesson.practice.speaking.length).toBeGreaterThan(0)
      expect(lesson.practice.reading.length).toBeGreaterThan(0)
      expect(lesson.reviewCards.length).toBeGreaterThan(0)
      expect(lesson.shortInput.audio).toMatch(/^\/audio\//)

      const expectedDialogueAudio = expectedDialogueAudioByLesson[lesson.id]
      const expectedShortInputAudio = expectedShortInputAudioByLesson[lesson.id]

      expect(lesson.dialogue.lines.map((line) => line.id)).toEqual(
        expectedDialogueAudio.map((_, index) => `${lesson.id}-line-0${index + 1}`),
      )
      expect(lesson.dialogue.lines.map((line) => line.audio)).toEqual(expectedDialogueAudio)
      expect(lesson.shortInput.id).toBe(`${lesson.id}-short-input-01`)
      expect(lesson.shortInput.audio).toBe(expectedShortInputAudio)
    }
  })

  it('maps stable lesson ids onto the five arrival tasks', async () => {
    const { course } = await import('./course')
    const [immigrationLesson, taxiLesson, checkInLesson, phonePaymentLesson, storeRunLesson] =
      course.lessons

    expect(immigrationLesson.id).toBe('self-intro')
    expect(immigrationLesson.title.en.toLowerCase()).toContain('airport')
    expect(immigrationLesson.dialogue.lines).toHaveLength(4)
    expect(immigrationLesson.dialogue.lines.map((line) => line.hanzi).join('\n')).toMatch(
      /护照|你来中国做什么|我来旅游/,
    )
    expect(immigrationLesson.shortInput.prompt.en.toLowerCase()).toContain('why')
    expect(immigrationLesson.shortInput.target).toBe('我来旅游。')

    expect(taxiLesson.id).toBe('ask-directions')
    expect(taxiLesson.title.en.toLowerCase()).toContain('taxi')
    expect(taxiLesson.dialogue.lines).toHaveLength(5)
    expect(taxiLesson.dialogue.lines.map((line) => line.hanzi).join('\n')).toMatch(
      /师傅，去这个酒店|地址|大概多久到|四十分钟左右/,
    )
    expect(taxiLesson.shortInput.target).toBe('师傅，去这个酒店。')

    expect(checkInLesson.id).toBe('order-food')
    expect(checkInLesson.title.en.toLowerCase()).toMatch(/hotel|apartment|check-in/)
    expect(checkInLesson.dialogue.lines).toHaveLength(5)
    expect(checkInLesson.dialogue.lines.map((line) => line.hanzi).join('\n')).toMatch(
      /我有预订|叫什么名字|请出示护照|房卡/,
    )
    expect(checkInLesson.shortInput.target).toBe('你好，我有预订。')

    expect(phonePaymentLesson.id).toBe('phone-and-payment')
    expect(phonePaymentLesson.title.en.toLowerCase()).toMatch(/phone|payment/)
    expect(phonePaymentLesson.dialogue.lines).toHaveLength(5)
    expect(phonePaymentLesson.dialogue.lines.map((line) => line.hanzi).join('\n')).toMatch(
      /手机卡|手机号码|支付|现金/,
    )
    expect(phonePaymentLesson.shortInput.prompt.en.toLowerCase()).toContain('phone')
    expect(phonePaymentLesson.shortInput.target).toBe('可以用手机支付吗？')

    expect(storeRunLesson.id).toBe('convenience-store-run')
    expect(storeRunLesson.title.en.toLowerCase()).toMatch(/convenience store|store/)
    expect(storeRunLesson.dialogue.lines).toHaveLength(5)
    expect(storeRunLesson.dialogue.lines.map((line) => line.hanzi).join('\n')).toMatch(
      /一瓶水|还要别的吗|多少钱|五块钱|手机支付/,
    )
    expect(storeRunLesson.shortInput.prompt.en.toLowerCase()).toContain('bottle of water')
    expect(storeRunLesson.shortInput.target).toBe('我要一瓶水。')
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

  it('locks the minimum review and short-input content for the arrival lessons', async () => {
    const { course } = await import('./course')
    const byId = Object.fromEntries(course.lessons.map((lesson) => [lesson.id, lesson]))

    expect(byId['self-intro'].reviewCards.map((card) => card.front)).toEqual(
      expect.arrayContaining(['护照', '我来旅游', '我住在这个酒店']),
    )
    expect(byId['ask-directions'].reviewCards.map((card) => card.front)).toEqual(
      expect.arrayContaining(['去这个酒店', '地址', '大概多久到']),
    )
    expect(byId['order-food'].reviewCards.map((card) => card.front)).toEqual(
      expect.arrayContaining(['我有预订', '请出示护照', '房卡']),
    )
    expect(byId['phone-and-payment'].reviewCards.map((card) => card.front)).toEqual(
      expect.arrayContaining(['手机卡', '手机号码', '可以用手机支付吗？']),
    )
    expect(byId['convenience-store-run'].reviewCards.map((card) => card.front)).toEqual(
      expect.arrayContaining(['一瓶水', '多少钱', '不要了']),
    )

    const selfIntroChinese = [
      ...byId['self-intro'].sentencePatterns.map((pattern) => pattern.example),
      ...byId['self-intro'].vocabulary.map((item) => item.hanzi),
      ...Object.values(byId['self-intro'].practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
    ].join('\n')
    const taxiChinese = [
      ...byId['ask-directions'].sentencePatterns.map((pattern) => pattern.example),
      ...byId['ask-directions'].vocabulary.map((item) => item.hanzi),
      ...Object.values(byId['ask-directions'].practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
    ].join('\n')
    const checkInChinese = [
      ...byId['order-food'].sentencePatterns.map((pattern) => pattern.example),
      ...byId['order-food'].vocabulary.map((item) => item.hanzi),
      ...Object.values(byId['order-food'].practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
    ].join('\n')
    const phonePaymentChinese = [
      ...byId['phone-and-payment'].sentencePatterns.map((pattern) => pattern.example),
      ...byId['phone-and-payment'].vocabulary.map((item) => item.hanzi),
      ...Object.values(byId['phone-and-payment'].practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
    ].join('\n')
    const storeRunChinese = [
      ...byId['convenience-store-run'].sentencePatterns.map((pattern) => pattern.example),
      ...byId['convenience-store-run'].vocabulary.map((item) => item.hanzi),
      ...Object.values(byId['convenience-store-run'].practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
    ].join('\n')

    expect(selfIntroChinese).toMatch(/护照|旅游|酒店|住在/)
    expect(taxiChinese).toMatch(/酒店|地址|多久|分钟左右/)
    expect(checkInChinese).toMatch(/预订|名字|护照|房卡/)
    expect(phonePaymentChinese).toMatch(/手机卡|手机号码|支付|现金/)
    expect(storeRunChinese).toMatch(/一瓶水|多少钱|不要了|手机支付/)

    expect(collectLocalizedStrings(byId['self-intro'], 'en').join('\n').toLowerCase()).toMatch(
      /passport|travel|hotel/,
    )
    expect(collectLocalizedStrings(byId['ask-directions'], 'fr').join('\n').toLowerCase()).toMatch(
      /chauffeur|adresse|hôtel/,
    )
    expect(collectLocalizedStrings(byId['order-food'], 'en').join('\n').toLowerCase()).toMatch(
      /reservation|room card|front desk/,
    )
    expect(
      collectLocalizedStrings(byId['phone-and-payment'], 'en').join('\n').toLowerCase(),
    ).toMatch(/sim card|phone number|mobile payment|cash/)
    expect(
      collectLocalizedStrings(byId['convenience-store-run'], 'fr').join('\n').toLowerCase(),
    ).toMatch(/bouteille d’eau|combien|supérette/)
  })

  it('ships placeholder audio files for every dialogue and short-input reference', async () => {
    const audioPaths = await collectAudioPaths()

    expect(new Set(audioPaths).size).toBe(audioPaths.length)

    for (const audioPath of audioPaths) {
      const publicPath = `${process.cwd()}/public${audioPath.replace('/audio', '/audio')}`
      expect(existsSync(publicPath), `missing ${audioPath}`).toBe(true)
    }
  })
})
