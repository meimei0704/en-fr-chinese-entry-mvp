import type { ExplanationLanguage, LessonId, LocalizedText } from './types'

export interface LessonTopicDisplay {
  hanzi: string
  explanation: LocalizedText
}

export const lessonTopicDisplays = {
  'self-intro': {
    hanzi: '到达机场',
    explanation: {
      en: 'Arrival at the airport',
      fr: 'Arrivée à l’aéroport',
    },
  },
  'ask-directions': {
    hanzi: '打车去酒店',
    explanation: {
      en: 'Take a taxi to your hotel',
      fr: 'Prendre un taxi jusqu’à son hôtel',
    },
  },
  'order-food': {
    hanzi: '酒店或公寓入住',
    explanation: {
      en: 'Hotel or apartment check-in',
      fr: 'Arrivée à l’hôtel ou à l’appartement',
    },
  },
  'phone-and-payment': {
    hanzi: '手机号码和移动支付',
    explanation: {
      en: 'Phone number & mobile payment setup',
      fr: 'Téléphone & paiement mobile',
    },
  },
  'convenience-store-run': {
    hanzi: '第一次便利店购物',
    explanation: {
      en: 'First convenience store run',
      fr: 'Première course en supérette',
    },
  },
  'restaurant-order': {
    hanzi: '点一份简单的饭',
    explanation: {
      en: 'Order a simple meal',
      fr: 'Commander un repas simple',
    },
  },
  'metro-ticket': {
    hanzi: '买地铁票',
    explanation: {
      en: 'Buy a metro ticket',
      fr: 'Acheter un ticket de métro',
    },
  },
  'pharmacy-help': {
    hanzi: '去药店求助',
    explanation: {
      en: 'Ask for help at a pharmacy',
      fr: 'Demander de l’aide à la pharmacie',
    },
  },
  'ask-for-help-problem': {
    hanzi: '遇到问题时求助',
    explanation: {
      en: 'Ask for help with a problem',
      fr: 'Demander de l’aide pour un problème',
    },
  },
  'train-station-ticket': {
    hanzi: '在火车站买票',
    explanation: {
      en: 'Buy a train station ticket',
      fr: 'Acheter un billet en gare',
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
