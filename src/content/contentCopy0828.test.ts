import { describe, expect, it } from 'vitest'

import { course } from './course'

function lesson(id: string) {
  const value = course.lessons.find((candidate) => candidate.id === id)
  expect(value, `missing lesson ${id}`).toBeDefined()
  return value!
}

function line(lessonId: string, hanzi: string) {
  const value = lesson(lessonId).dialogue.lines.find((candidate) => candidate.hanzi === hanzi)
  expect(value, `missing dialogue line ${lessonId}/${hanzi}`).toBeDefined()
  return value!
}

function pattern(lessonId: string, formula: string) {
  const value = lesson(lessonId).sentencePatterns.find(
    (candidate) => candidate.pattern === formula,
  )
  expect(value, `missing pattern ${lessonId}/${formula}`).toBeDefined()
  return value!
}

function vocabulary(lessonId: string, hanzi: string) {
  const value = lesson(lessonId).vocabulary.find((candidate) => candidate.hanzi === hanzi)
  expect(value, `missing vocabulary item ${lessonId}/${hanzi}`).toBeDefined()
  return value!
}

const phoneCardIntro =
  "In China, all SIM cards require real-name registration with your passport. Only official service centers work; small shops can’t help. There are four major telecom operators: China Mobile, China Unicom, China Telecom and China Broadnet. Each operator offers various mobile SIM card options. To monitor your communication expenses, download the operator's app or follow their official WeChat account to check call charges and data usage. Pay attention to billing rules inside and outside your plan, as data charges beyond your plan can be high. Cancel your SIM card at the official store before you leave China. Unpaid debt may prevent you from buying a Chinese SIM card later."

describe('2026-08-28 lesson copy', () => {
  it('uses the requested lesson introductions', () => {
    expect(lesson('self-intro').scenario).toEqual({
      en: 'Navigate the immigration and customs smoothly and ask for help when need.',
      fr: 'Récupérez vos bagages, passez la douane et demandez de l’aide pour vous repérer sereinement à l’aéroport.',
    })
    expect(lesson('ask-directions').scenario.en).toBe(
      'Get to your destination, ensuring comfort and safety.',
    )
    expect(lesson('restaurant-order').scenario.en).toBe(
      'Ask for a menu, order food and drinks, and specify your preference.',
    )
    expect(lesson('small-talk').scenario.en).toBe(
      'Common conversation starters to break the ice, send positive vibes by giving people compliments.',
    )
  })

  it('translates hotel state phrases as whole units without changing other 了 explanations', () => {
    const hotelKey = line('order-food', '我的房卡丢了。')
    const hotelAirConditioner = line('order-food', '空调坏了。')

    expect(hotelKey.explanation.en).toContain('房卡 = room key card｜丢了 = lost')
    expect(hotelKey.explanation.en).not.toContain('丢 =')
    expect(hotelKey.explanation.en).not.toContain('｜了 =')
    expect(hotelAirConditioner.explanation.en).toContain('空调 = air conditioner｜坏了 = broken')
    expect(hotelAirConditioner.explanation.en).not.toContain('坏 =')
    expect(hotelAirConditioner.explanation.en).not.toContain('｜了 =')
    expect(line('restaurant-order', '可以点餐了吗？').explanation.en).toContain(
      '了 = now / change of state',
    )
  })

  it('adds the hotel ellipsis patterns', () => {
    expect(lesson('order-food').sentencePatterns.map(({ pattern: formula }) => formula)).toEqual(
      expect.arrayContaining(['我要……。', '我已经……。', '我可以……吗？']),
    )
  })

  it('adds the phone-card introduction and foreigner phrase', () => {
    const phone = lesson('phone-and-payment')
    expect((phone.dialogue as typeof phone.dialogue & { intro?: unknown }).intro).toEqual(
      expect.objectContaining({ en: phoneCardIntro }),
    )
    expect(line('phone-and-payment', '外国人可以办理吗？').translation.en).toBe(
      'Do you offer services for foreigners?',
    )
  })

  it('uses descriptive phone vocabulary definitions', () => {
    expect(vocabulary('phone-and-payment', '话费').meaning.en).toBe(
      'The fees incurred for communication services.',
    )
    expect(vocabulary('phone-and-payment', '流量').meaning.en).toBe(
      'The amount of mobile internet usage. In China, it\'s commonly referred to as "data".',
    )
    expect(vocabulary('phone-and-payment', '套餐').meaning.en).toBe(
      'Service plans offered by telecom operators, including combinations of call minutes, SMS and data. Most plans auto-renew unless you change or cancel them. You can choose a plan based on your needs.',
    )
  })

  it('updates help explanations and adds its topic-specific state-change pattern', () => {
    expect(line('ask-for-help-problem', '麻烦你了。').explanation.en).toContain(
      '了 = grammatical particle, adding politeness and gratitude',
    )
    expect(line('ask-for-help-problem', '我迷路了。').explanation.en).toContain(
      '了 = grammatical particle showing that a new situation has come about',
    )
    const statePattern = pattern('ask-for-help-problem', '我……了')
    expect(statePattern.examples?.map((example) => example.hanzi)).toEqual(
      expect.arrayContaining(['我迷路了。', '我手机没电了。', '我护照丢了。']),
    )
  })

  it('updates small-talk copy, phrase, pattern, and vocabulary', () => {
    const smallTalk = lesson('small-talk')
    expect(line('small-talk', '你穿的衣服很好看。').translation).toEqual({
      en: 'The clothes you’re wearing look very nice.',
      fr: 'Les vêtements que tu portes sont très beaux.',
    })
    expect(line('small-talk', '和你聊天很开心。').translation).toEqual({
      en: 'I’m having a great time chatting with you.',
      fr: 'Je suis très heureux / heureuse de discuter avec toi.',
    })
    expect(smallTalk.sentencePatterns.map(({ pattern: formula }) => formula)).toContain(
      '祝你……',
    )
    expect(smallTalk.vocabulary.map((item) => item.hanzi)).not.toEqual(
      expect.arrayContaining(['计划', '待', '上海']),
    )
  })

  it('uses the requested train delay examples and translations', () => {
    const delayPattern = pattern('train-station-ticket', '……晚点了吗？')
    expect(delayPattern.examples?.map((example) => [example.hanzi, example.en, example.fr])).toEqual([
      ['我的车晚点了吗？', 'Is my train delayed?', 'Mon train est-il en retard ?'],
      ['火车晚点了吗？', 'Is the train delayed?', 'Le train est-il en retard ?'],
      ['飞机晚点了吗？', 'Is the plane delayed?', 'L’avion est-il en retard ?'],
    ])
  })
})
