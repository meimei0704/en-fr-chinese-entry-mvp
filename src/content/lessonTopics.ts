import type { ExplanationLanguage, LessonId, LocalizedText } from './types'

export interface LessonTopicDisplay {
  hanzi: string
  explanation: LocalizedText
}

export const lessonTopicDisplays = {
  'daily-greetings': {
    hanzi: '打招呼',
    explanation: {
      en: 'Daily greetings',
      fr: 'Salutations quotidiennes',
    },
  },
  'self-intro': {
    hanzi: '到达机场',
    explanation: {
      en: 'Arrival at the airport',
      fr: 'Arrivée à l’aéroport',
    },
  },
  'ask-directions': {
    hanzi: '打车',
    explanation: {
      en: 'Take a taxi',
      fr: 'Prendre un taxi',
    },
  },
  'order-food': {
    hanzi: '酒店入住',
    explanation: {
      en: 'At the hotel',
      fr: 'À l’hôtel',
    },
  },
  'phone-and-payment': {
    hanzi: '中国电话卡',
    explanation: {
      en: 'SIM card setup',
      fr: 'Configuration de la carte SIM',
    },
  },
  'restaurant-order': {
    hanzi: '点餐',
    explanation: {
      en: 'Order a meal',
      fr: 'Commander un repas',
    },
  },
  'train-station-ticket': {
    hanzi: '坐火车',
    explanation: {
      en: 'Take the train',
      fr: 'Prendre le train',
    },
  },
  'metro-ticket': {
    hanzi: '坐地铁',
    explanation: {
      en: 'Subway ride',
      fr: 'En métro',
    },
  },
  'convenience-store-run': {
    hanzi: '购物',
    explanation: {
      en: 'Shopping',
      fr: 'Shopping',
    },
  },
  'ask-for-help-problem': {
    hanzi: '寻求帮助',
    explanation: {
      en: 'Ask for help',
      fr: 'Demander de l’aide',
    },
  },
  'pharmacy-help': {
    hanzi: '买药，看医生',
    explanation: {
      en: 'Hospital and pharmacy',
      fr: 'Hôpital et pharmacie',
    },
  },
  'small-talk': {
    hanzi: '闲聊和赞美',
    explanation: {
      en: 'Small talk and compliment',
      fr: 'Petite conversation et compliments',
    },
  },
} as const satisfies Record<LessonId, LessonTopicDisplay>

export function getLessonTopicDisplay(lessonId: LessonId, language: ExplanationLanguage) {
  const topic = lessonTopicDisplays[lessonId]

  return {
    primary: topic.hanzi,
    secondary: topic.explanation[language],
  }
}

export function getLessonTopicText(lessonId: LessonId, language: ExplanationLanguage) {
  const topic = getLessonTopicDisplay(lessonId, language)

  return `${topic.primary} ${topic.secondary}`
}
