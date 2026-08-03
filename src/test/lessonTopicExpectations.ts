import type { ExplanationLanguage, LessonId } from '../content/types'

export const expectedLessonTopicOrder = [
  {
    id: 'self-intro',
    hanzi: '到达机场',
    en: 'Arrival at the airport',
    fr: 'Arrivée à l’aéroport',
  },
  {
    id: 'ask-directions',
    hanzi: '打车去酒店',
    en: 'Take a taxi to your hotel',
    fr: 'Prendre un taxi jusqu’à son hôtel',
  },
  {
    id: 'order-food',
    hanzi: '酒店或公寓入住',
    en: 'Hotel or apartment check-in',
    fr: 'Arrivée à l’hôtel ou à l’appartement',
  },
  {
    id: 'phone-and-payment',
    hanzi: '手机号码和移动支付',
    en: 'Phone number & mobile payment setup',
    fr: 'Téléphone & paiement mobile',
  },
  {
    id: 'convenience-store-run',
    hanzi: '第一次便利店购物',
    en: 'First convenience store run',
    fr: 'Première course en supérette',
  },
  {
    id: 'restaurant-order',
    hanzi: '点一份简单的饭',
    en: 'Order a simple meal',
    fr: 'Commander un repas simple',
  },
  {
    id: 'metro-ticket',
    hanzi: '买地铁票',
    en: 'Buy a metro ticket',
    fr: 'Acheter un ticket de métro',
  },
  {
    id: 'pharmacy-help',
    hanzi: '去药店求助',
    en: 'Ask for help at a pharmacy',
    fr: 'Demander de l’aide à la pharmacie',
  },
  {
    id: 'ask-for-help-problem',
    hanzi: '遇到问题时求助',
    en: 'Ask for help with a problem',
    fr: 'Demander de l’aide pour un problème',
  },
  {
    id: 'train-station-ticket',
    hanzi: '在火车站买票',
    en: 'Buy a train station ticket',
    fr: 'Acheter un billet en gare',
  },
] as const satisfies ReadonlyArray<{
  id: LessonId
  hanzi: string
  en: string
  fr: string
}>

export function expectedLessonTopic(topic: (typeof expectedLessonTopicOrder)[number], language: ExplanationLanguage) {
  return `${topic.hanzi} ${topic[language]}`
}

export function expectedLessonTopicPattern(
  topic: (typeof expectedLessonTopicOrder)[number],
  language: ExplanationLanguage,
) {
  return new RegExp(`${escapeRegExp(topic.hanzi)}\\s+${escapeRegExp(topic[language])}`, 'i')
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
