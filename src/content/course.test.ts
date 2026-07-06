import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const expectedDialogueAudioByLesson = {
  'self-intro': [
    '/audio/self-intro/line-01.mp3',
    '/audio/self-intro/line-02.mp3',
    '/audio/self-intro/line-03.mp3',
    '/audio/self-intro/line-04.mp3',
  ],
  'order-food': [
    '/audio/order-food/line-01.mp3',
    '/audio/order-food/line-02.mp3',
    '/audio/order-food/line-03.mp3',
    '/audio/order-food/line-04.mp3',
    '/audio/order-food/line-05.mp3',
  ],
  'ask-directions': [
    '/audio/ask-directions/line-01.mp3',
    '/audio/ask-directions/line-02.mp3',
    '/audio/ask-directions/line-03.mp3',
    '/audio/ask-directions/line-04.mp3',
    '/audio/ask-directions/line-05.mp3',
  ],
} as const

const expectedShortInputAudioByLesson = {
  'self-intro': '/audio/self-intro/short-input-01.mp3',
  'order-food': '/audio/order-food/short-input-01.mp3',
  'ask-directions': '/audio/ask-directions/short-input-01.mp3',
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
  it('exposes three lessons with bilingual explanations and static audio paths', async () => {
    const { course } = await import('./course')

    expect(course.supportedExplanationLanguages).toEqual(['en', 'fr'])
    expect(course.estimatedDailyMinutes).toBe(10)
    expect(course.lessons).toHaveLength(3)
    expect(course.lessons.map((lesson) => lesson.id)).toEqual([
      'self-intro',
      'order-food',
      'ask-directions',
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

    const directionsLesson = course.lessons.find((lesson) => lesson.id === 'ask-directions')

    expect(directionsLesson?.dialogue.lines).toHaveLength(5)
    expect(directionsLesson?.dialogue.lines.some((line) => line.hanzi.includes('地铁站'))).toBe(true)
    expect(directionsLesson?.dialogue.lines.some((line) => line.hanzi.includes('往左拐'))).toBe(true)
    expect(directionsLesson?.shortInput.target).toBe('地铁站在哪儿？')
  })

  it('covers practical subway ticket, line, transfer, and exit concepts in ask-directions copy', async () => {
    const { course } = await import('./course')
    const directionsLesson = course.lessons.find((lesson) => lesson.id === 'ask-directions')

    if (!directionsLesson) {
      throw new Error('ask-directions lesson missing')
    }

    const dialogueHanzi = directionsLesson.dialogue.lines.map((line) => line.hanzi).join('\n')
    const englishCopy = collectLocalizedStrings(directionsLesson, 'en').join('\n').toLowerCase()
    const frenchCopy = collectLocalizedStrings(directionsLesson, 'fr').join('\n').toLowerCase()

    expect(dialogueHanzi, 'Chinese examples should include buying a subway ticket').toMatch(
      /买票|地铁票/,
    )
    expect(dialogueHanzi, 'Chinese examples should include choosing or taking a subway line').toMatch(
      /[一二三四五六七八九十\d]+号线/,
    )
    expect(dialogueHanzi, 'Chinese examples should include transferring lines').toMatch(
      /换乘|换[一二三四五六七八九十\d]+号线/,
    )
    expect(dialogueHanzi, 'Chinese examples should include exits').toContain('出口')

    expect(englishCopy, 'English copy should cover ticket buying').toMatch(/\bticket\b/)
    expect(englishCopy, 'English copy should cover subway line choice').toMatch(/\bline\b/)
    expect(englishCopy, 'English copy should cover transfers').toMatch(/\btransfer\b/)
    expect(englishCopy, 'English copy should cover exits').toMatch(/\bexit\b/)

    expect(frenchCopy, 'French copy should cover ticket buying').toMatch(/\b(ticket|billet)s?\b/)
    expect(frenchCopy, 'French copy should cover subway line choice').toMatch(/\bligne\b/)
    expect(frenchCopy, 'French copy should cover transfers').toMatch(/\b(correspondance|changer)\b/)
    expect(frenchCopy, 'French copy should cover exits').toMatch(/\bsortie\b/)
  })

  it('keeps self-intro and order-food learner-facing copy consistently bilingual', async () => {
    const { course } = await import('./course')
    const targetLessons = course.lessons.filter((lesson) =>
      ['self-intro', 'order-food'].includes(lesson.id),
    )

    expect(targetLessons.map((lesson) => lesson.id)).toEqual(['self-intro', 'order-food'])

    for (const lesson of targetLessons) {
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

  it('adds practical high-frequency examples with natural English and matching French support', async () => {
    const { course } = await import('./course')
    const selfIntroLesson = course.lessons.find((lesson) => lesson.id === 'self-intro')
    const orderFoodLesson = course.lessons.find((lesson) => lesson.id === 'order-food')

    if (!selfIntroLesson || !orderFoodLesson) {
      throw new Error('target lessons missing')
    }

    const selfIntroHanzi = collectLocalizedStrings(selfIntroLesson, 'en').join('\n')
    const selfIntroChinese = [
      ...selfIntroLesson.sentencePatterns.map((pattern) => pattern.example),
      ...selfIntroLesson.vocabulary.map((item) => item.hanzi),
      ...selfIntroLesson.hanziRecognition.map((item) => item.hanzi),
      ...Object.values(selfIntroLesson.practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
      selfIntroLesson.shortInput.target,
    ].join('\n')
    const selfIntroFrench = collectLocalizedStrings(selfIntroLesson, 'fr').join('\n').toLowerCase()
    const orderFoodHanzi = [
      ...orderFoodLesson.sentencePatterns.map((pattern) => pattern.example),
      ...orderFoodLesson.vocabulary.map((item) => item.hanzi),
      ...orderFoodLesson.hanziRecognition.map((item) => item.hanzi),
      ...Object.values(orderFoodLesson.practice).flatMap((prompts) =>
        prompts.map((prompt) => prompt.target),
      ),
      orderFoodLesson.shortInput.target,
    ].join('\n')
    const orderFoodEnglish = collectLocalizedStrings(orderFoodLesson, 'en').join('\n').toLowerCase()
    const orderFoodFrench = collectLocalizedStrings(orderFoodLesson, 'fr').join('\n').toLowerCase()

    expect(selfIntroHanzi.toLowerCase()).toContain('introducing yourself')
    expect(selfIntroHanzi.toLowerCase()).not.toMatch(/\bself introduction\b/)
    expect(selfIntroChinese, 'Self-intro examples should cover saying where you are from').toMatch(
      /我来自|我从.+来/,
    )
    expect(selfIntroChinese, 'Self-intro examples should cover a common identity').toMatch(
      /我是(学生|老师|医生|工程师)/,
    )
    expect(selfIntroChinese, 'Self-intro examples should include asking “and you?”').toContain(
      '你呢',
    )
    expect(selfIntroFrench, 'French self-intro support should mention coming from a place').toMatch(
      /je viens de|je suis de/,
    )
    expect(selfIntroFrench, 'French self-intro support should mention student identity').toMatch(
      /étudiant|étudiante/,
    )
    expect(selfIntroFrench, 'French self-intro support should include “et toi ?”').toContain(
      'et toi',
    )

    expect(orderFoodEnglish, 'English restaurant copy should use natural requests').not.toMatch(
      /\bplease give me\b/,
    )
    expect(orderFoodEnglish, 'English restaurant copy should model “I’d like”').toMatch(
      /\bi(?:'|’)d like\b/,
    )
    expect(orderFoodHanzi, 'Order-food examples should cover asking for a menu').toContain('菜单')
    expect(orderFoodHanzi, 'Order-food examples should cover ordering water').toContain('水')
    expect(orderFoodHanzi, 'Order-food examples should cover spice preferences').toMatch(
      /不辣|少辣/,
    )
    expect(orderFoodHanzi, 'Order-food examples should cover takeaway or paying').toMatch(
      /打包|带走|买单|结账/,
    )
    expect(orderFoodFrench, 'French order-food support should mention a menu').toContain('menu')
    expect(orderFoodFrench, 'French order-food support should mention water').toMatch(/\beau\b/)
    expect(orderFoodFrench, 'French order-food support should mention spice preferences').toMatch(
      /pas épicé|moins épicé/,
    )
    expect(orderFoodFrench, 'French order-food support should mention takeaway or the bill').toMatch(
      /à emporter|addition/,
    )
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
