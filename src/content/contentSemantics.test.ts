import { describe, expect, it } from 'vitest'

import { course } from './course'

function lesson(id: string) {
  const value = course.lessons.find((candidate) => candidate.id === id)
  expect(value, `missing lesson ${id}`).toBeDefined()
  return value!
}

function line(lessonId: string, id: string) {
  const value = lesson(lessonId).dialogue.lines.find((candidate) => candidate.id === id)
  expect(value, `missing dialogue line ${lessonId}/${id}`).toBeDefined()
  return value!
}

function pattern(lessonId: string, id: string) {
  const value = lesson(lessonId).sentencePatterns.find((candidate) => candidate.id === id)
  expect(value, `missing sentence pattern ${lessonId}/${id}`).toBeDefined()
  return value!
}

function vocab(lessonId: string, id: string) {
  const value = lesson(lessonId).vocabulary.find((candidate) => candidate.id === id)
  expect(value, `missing vocabulary item ${lessonId}/${id}`).toBeDefined()
  return value!
}

describe('audited course semantics', () => {
  it('uses the approved gender-compatible French greeting', () => {
    const greetings = lesson('daily-greetings')
    expect(line('daily-greetings', 'daily-greetings-line-10').translation.fr).toBe(
      'Enchanté(e) de faire votre connaissance.',
    )
    expect(pattern('daily-greetings', 'daily-greetings-pattern-4').examples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hanzi: '很高兴认识你。',
          fr: 'Enchanté(e) de faire votre connaissance.',
        }),
        expect.objectContaining({
          hanzi: '很高兴认识大家。',
          fr: 'Enchanté(e) de faire connaissance avec tout le monde.',
        }),
      ]),
    )
    expect(JSON.stringify(greetings)).not.toContain(':"Enchanté de ')
  })

  it('keeps the airport phrases faithful and natural', () => {
    const airport = lesson('self-intro')
    expect(line('self-intro', 'self-intro-line-01').translation).toEqual({
      en: 'Excuse me, do you speak English?',
      fr: 'Excusez-moi, parlez-vous anglais ?',
    })
    expect(line('self-intro', 'self-intro-line-02').explanation).toEqual(
      expect.objectContaining({
        en: expect.stringContaining('行李提取处 = baggage claim'),
        fr: expect.stringContaining('行李提取处 = zone de retrait des bagages'),
      }),
    )
    expect(line('self-intro', 'self-intro-line-05').translation.fr).toBe(
      'Je suis venu(e) faire du tourisme.',
    )
    expect(line('self-intro', 'self-intro-line-09').translation).toEqual({
      en: 'Excuse me, where can I get a taxi?',
      fr: 'Excusez-moi, où puis-je prendre un taxi ?',
    })
    expect(vocab('self-intro', 'self-intro-vocab-3').meaning.fr).toBe('m’aider')
    expect(JSON.stringify(airport)).not.toContain('行李 = luggage｜提取处')
    expect(JSON.stringify(airport)).not.toContain('行李 = bagages｜提取处')
    expect(airport.reviewCards.find(({ id }) => id === 'self-intro-review-3')?.back).toEqual({
      en: 'Excuse me, do you speak English?',
      fr: 'Excusez-moi, parlez-vous anglais ?',
    })
  })

  it('keeps taxi phrases faithful and idiomatic', () => {
    expect(line('ask-directions', 'ask-directions-line-01').translation).toEqual({
      en: 'Hello, driver. I’d like to go here.',
      fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller ici.',
    })
    expect(line('ask-directions', 'ask-directions-line-03').explanation.en).toContain(
      '打表 = use / turn on the meter',
    )
    expect(line('ask-directions', 'ask-directions-line-04').translation.fr).toBe(
      'Combien de temps le trajet prendra-t-il ?',
    )
    expect(line('ask-directions', 'ask-directions-line-06').translation.fr).toBe(
      'Roulez plus lentement, s’il vous plaît.',
    )
    expect(line('ask-directions', 'ask-directions-line-08').translation.en).toBe(
      'How much is it in total?',
    )
    expect(line('ask-directions', 'ask-directions-line-11').translation).toEqual({
      en: 'Please give me a receipt.',
      fr: 'Veuillez me donner un reçu.',
    })
  })

  it('uses natural hotel terminology', () => {
    const hotel = lesson('order-food')
    expect(line('order-food', 'order-food-line-01').translation).toEqual({
      en: 'Hello, I’d like to check in.',
      fr: 'Bonjour, je voudrais m’enregistrer.',
    })
    expect(line('order-food', 'order-food-line-10').translation.fr).toBe(
      'J’ai perdu la carte d’accès à ma chambre.',
    )
    expect(vocab('order-food', 'order-food-vocab-4').meaning).toEqual({
      en: 'room key card',
      fr: 'carte d’accès à la chambre',
    })
    expect(JSON.stringify(hotel)).not.toContain('room card')
    expect(JSON.stringify(hotel)).not.toContain('carte de chambre')
  })

  it('uses correct SIM-card terminology and question phrasing', () => {
    expect(line('phone-and-payment', 'phone-and-payment-line-01').explanation).toEqual(
      expect.objectContaining({
        en: expect.stringContaining('SIM 卡 = SIM card'),
        fr: expect.stringContaining('SIM 卡 = carte SIM'),
      }),
    )
    expect(line('phone-and-payment', 'phone-and-payment-line-02').translation.en).toBe(
      'Could you help me install it?',
    )
    expect(line('phone-and-payment', 'phone-and-payment-line-03').translation.fr).toBe(
      'J’ai besoin de données mobiles.',
    )
    expect(pattern('phone-and-payment', 'phone-and-payment-pattern-1').examples?.[0]).toEqual(
      expect.objectContaining({ fill: 'SIM 卡', fillPinyin: 'SIM kǎ' }),
    )
    expect(vocab('phone-and-payment', 'phone-and-payment-vocab-1').meaning).toEqual({
      en: 'SIM card',
      fr: 'carte SIM',
    })
  })

  it('keeps restaurant copy complete and grammatically accurate', () => {
    const restaurant = lesson('restaurant-order')
    expect(line('restaurant-order', 'restaurant-order-line-02').translation.en).toBe(
      'Can I have the menu, please?',
    )
    expect(line('restaurant-order', 'restaurant-order-line-03').explanation.en).toContain(
      '点餐 = order food｜了 = now / change of state',
    )
    expect(line('restaurant-order', 'restaurant-order-line-05').translation).toEqual({
      en: 'I’d like a bowl of noodles.',
      fr: 'Je voudrais un bol de nouilles.',
    })
    expect(line('restaurant-order', 'restaurant-order-line-07').translation.fr).toBe(
      'Veuillez me donner un verre d’eau.',
    )
    expect(line('restaurant-order', 'restaurant-order-line-08').translation.en).toBe(
      'Not spicy, please.',
    )
    expect(line('restaurant-order', 'restaurant-order-line-12').translation.en).toBe(
      'Hello, could I have the check, please?',
    )
    expect(line('restaurant-order', 'restaurant-order-line-13').explanation.en).toContain(
      '了 = change-of-state particle',
    )
    expect(JSON.stringify(restaurant)).not.toContain('with a clear measure word')
    expect(pattern('restaurant-order', 'restaurant-order-pattern-3').examples?.[1]).toEqual(
      expect.objectContaining({
        en: 'No green onions, please.',
        fr: 'Sans oignons verts, s’il vous plaît.',
      }),
    )
  })

  it('keeps transport terminology precise', () => {
    expect(line('train-station-ticket', 'train-station-ticket-line-03').explanation.en).toContain(
      '一 = one｜张 = measure word for tickets｜去北京的票 = a ticket to Beijing',
    )
    expect(line('train-station-ticket', 'train-station-ticket-line-12').translation.fr).toBe(
      'Comment annuler mon billet et me faire rembourser ?',
    )
    expect(vocab('train-station-ticket', 'train-station-ticket-vocab-12').meaning).toEqual({
      en: 'staffed lane / manual inspection lane',
      fr: 'passage avec contrôle manuel',
    })
    expect(line('metro-ticket', 'metro-ticket-line-02').pinyin).toBe('zài nǎr mǎi piào?')
    expect(line('metro-ticket', 'metro-ticket-line-06').pinyin).toBe(
      'qǐng wèn zài nǎr huàn chéng?',
    )
    expect(vocab('metro-ticket', 'metro-ticket-vocab-1').explanation).toEqual({
      en: 'Use this word when asking for or talking about subway travel.',
      fr: 'Utilisez ce mot pour demander ou parler des déplacements en métro.',
    })
  })

  it('keeps remaining vocabulary and pinyin corrections stable', () => {
    expect(vocab('ask-for-help-problem', 'ask-for-help-problem-vocab-6').meaning.en).toBe(
      'out of power / dead battery',
    )
    expect(JSON.stringify(lesson('ask-for-help-problem'))).not.toContain('out of battery')
    expect(line('pharmacy-help', 'pharmacy-help-line-12').pinyin).toBe(
      'fàn qián chī hái shì fàn hòu chī?',
    )
    expect(line('small-talk', 'small-talk-line-13').pinyin).toBe(
      'zhù nǐ wán de kāi xīn! zài jiàn!',
    )
    expect(JSON.stringify(course)).not.toContain('duō shao')
  })
})
