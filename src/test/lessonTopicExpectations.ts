import type { ExplanationLanguage, LessonId } from '../content/types'

export const expectedLessonTopicOrder = [
  {
    id: 'daily-greetings',
    hanzi: '打招呼',
    en: 'Daily greetings',
    fr: 'Salutations quotidiennes',
  },
  {
    id: 'self-intro',
    hanzi: '到达机场',
    en: 'Arrival at the airport',
    fr: 'Arrivée à l’aéroport',
  },
  {
    id: 'ask-directions',
    hanzi: '打车',
    en: 'Take a taxi',
    fr: 'Prendre un taxi',
  },
  {
    id: 'order-food',
    hanzi: '酒店入住',
    en: 'At the hotel',
    fr: 'À l’hôtel',
  },
  {
    id: 'phone-and-payment',
    hanzi: '中国电话卡',
    en: 'SIM card setup',
    fr: 'Configuration de la carte SIM',
  },
  {
    id: 'restaurant-order',
    hanzi: '点餐',
    en: 'Order a meal',
    fr: 'Commander un repas',
  },
  {
    id: 'train-station-ticket',
    hanzi: '坐火车',
    en: 'Take the train',
    fr: 'Prendre le train',
  },
  {
    id: 'metro-ticket',
    hanzi: '坐地铁',
    en: 'Subway ride',
    fr: 'En métro',
  },
  {
    id: 'convenience-store-run',
    hanzi: '购物',
    en: 'Shopping',
    fr: 'Shopping',
  },
  {
    id: 'ask-for-help-problem',
    hanzi: '寻求帮助',
    en: 'Ask for help',
    fr: 'Demander de l’aide',
  },
  {
    id: 'pharmacy-help',
    hanzi: '买药，看医生',
    en: 'Hospital and pharmacy',
    fr: 'Hôpital et pharmacie',
  },
  {
    id: 'small-talk',
    hanzi: '闲聊和赞美',
    en: 'Small talk and compliment',
    fr: 'Petite conversation et compliments',
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
