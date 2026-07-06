import type { LessonContent } from '../types'

export const orderFoodLesson: LessonContent = {
  id: 'order-food',
  title: {
    en: 'Order food',
    fr: 'Commander à manger',
  },
  scenario: {
    en: 'Asking for a menu, ordering food and water, choosing spice level, and asking for takeaway.',
    fr: 'Demander le menu, commander un plat et de l’eau, choisir le niveau d’épices et demander à emporter.',
  },
  dialogue: {
    title: {
      en: 'Order naturally in a small restaurant',
      fr: 'Commander naturellement dans un petit restaurant',
    },
    lines: [
      {
        id: 'order-food-line-01',
        speaker: 'Customer',
        hanzi: '请问，有菜单吗？',
        pinyin: 'Qǐngwèn, yǒu càidān ma?',
        translation: {
          en: 'Excuse me, do you have a menu?',
          fr: 'Excusez-moi, est-ce que vous avez un menu ?',
        },
        explanation: {
          en: '请问 makes the request polite before asking for the menu.',
          fr: '请问 rend la demande polie avant de demander le menu.',
        },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: 'Server',
        hanzi: '有。您想吃什么？',
        pinyin: 'Yǒu. Nín xiǎng chī shénme?',
        translation: {
          en: 'Yes. What would you like to eat?',
          fr: 'Oui. Qu’est-ce que vous voulez manger ?',
        },
        explanation: {
          en: '想吃什么 is a common way to ask what someone wants to eat.',
          fr: '想吃什么 est une façon courante de demander ce que quelqu’un veut manger.',
        },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: 'Customer',
        hanzi: '我想要一碗面，不辣。',
        pinyin: 'Wǒ xiǎng yào yì wǎn miàn, bú là.',
        translation: {
          en: 'I’d like one bowl of noodles, not spicy.',
          fr: 'Je voudrais un bol de nouilles, pas épicé.',
        },
        explanation: {
          en: '我想要 is a natural learner-friendly request, and 不辣 sets a spice preference.',
          fr: '我想要 est une demande naturelle pour débutant, et 不辣 précise la préférence d’épices.',
        },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: 'Server',
        hanzi: '要喝的吗？',
        pinyin: 'Yào hē de ma?',
        translation: {
          en: 'Would you like something to drink?',
          fr: 'Vous voulez quelque chose à boire ?',
        },
        explanation: {
          en: 'The server asks if you want a drink to go with the meal.',
          fr: 'Le serveur demande si tu veux une boisson avec le repas.',
        },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: 'Customer',
        hanzi: '一杯水，谢谢。可以打包吗？',
        pinyin: 'Yì bēi shuǐ, xièxie. Kěyǐ dǎbāo ma?',
        translation: {
          en: 'A glass of water, thanks. Can I get it to go?',
          fr: 'Un verre d’eau, merci. Est-ce possible à emporter ?',
        },
        explanation: {
          en: '水 covers a common drink request, and 打包 asks for takeaway.',
          fr: '水 couvre une demande de boisson fréquente, et 打包 sert à demander à emporter.',
        },
        audio: '/audio/order-food/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'order-food-pattern-1',
      pattern: '我想要…',
      meaning: {
        en: 'I’d like ...',
        fr: 'Je voudrais ...',
      },
      example: '我想要一杯水。',
      explanation: {
        en: 'Use this natural request pattern for food, drinks, and simple choices.',
        fr: 'Utilise cette demande naturelle pour la nourriture, les boissons et les choix simples.',
      },
    },
    {
      id: 'order-food-pattern-2',
      pattern: '不要太辣 / 不辣',
      meaning: {
        en: 'Not too spicy / not spicy',
        fr: 'Pas trop épicé / pas épicé',
      },
      example: '不要太辣，谢谢。',
      explanation: {
        en: 'Use it to control spice level when ordering.',
        fr: 'Utilise cette phrase pour préciser le niveau d’épices.',
      },
    },
    {
      id: 'order-food-pattern-3',
      pattern: '可以打包吗？',
      meaning: {
        en: 'Can I get it to go?',
        fr: 'Est-ce possible à emporter ?',
      },
      example: '这个可以打包吗？',
      explanation: {
        en: 'A practical question when you want takeaway.',
        fr: 'Une question pratique quand tu veux commander à emporter.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'order-food-vocab-1',
      hanzi: '面',
      pinyin: 'miàn',
      meaning: {
        en: 'noodles',
        fr: 'nouilles',
      },
      explanation: {
        en: 'A common beginner food word when ordering meals.',
        fr: 'Un mot courant de débutant pour commander un plat de nouilles.',
      },
    },
    {
      id: 'order-food-vocab-2',
      hanzi: '菜单',
      pinyin: 'càidān',
      meaning: {
        en: 'menu',
        fr: 'menu',
      },
      explanation: {
        en: 'Ask for 菜单 when you need to see the choices.',
        fr: 'Demande 菜单 quand tu veux voir les choix.',
      },
    },
    {
      id: 'order-food-vocab-3',
      hanzi: '水',
      pinyin: 'shuǐ',
      meaning: {
        en: 'water',
        fr: 'eau',
      },
      explanation: {
        en: 'A simple drink word you can use in almost any restaurant.',
        fr: 'Un mot simple pour une boisson utile dans presque tous les restaurants.',
      },
    },
    {
      id: 'order-food-vocab-4',
      hanzi: '不辣',
      pinyin: 'bú là',
      meaning: {
        en: 'not spicy',
        fr: 'pas épicé',
      },
      explanation: {
        en: 'Use it when you want a dish without chili heat.',
        fr: 'Utilise-le quand tu veux un plat sans piment.',
      },
    },
    {
      id: 'order-food-vocab-5',
      hanzi: '打包',
      pinyin: 'dǎbāo',
      meaning: {
        en: 'takeaway / to go',
        fr: 'à emporter',
      },
      explanation: {
        en: 'A practical word for taking leftovers or an order away.',
        fr: 'Un mot pratique pour emporter un plat ou des restes.',
      },
    },
    {
      id: 'order-food-vocab-6',
      hanzi: '买单',
      pinyin: 'mǎidān',
      meaning: {
        en: 'pay the bill',
        fr: 'payer l’addition',
      },
      explanation: {
        en: 'Use it at the end of a restaurant visit when you need the bill.',
        fr: 'Utilise-le à la fin du repas quand tu veux l’addition.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'order-food-pronunciation-1',
      focus: {
        en: 'Measure words',
        fr: 'Mots de mesure',
      },
      tip: {
        en: 'Keep the beat clear in 一碗 and 一杯.',
        fr: 'Garde le rythme clair dans 一碗 et 一杯.',
      },
      explanation: {
        en: 'Food orders often include a number plus a measure word.',
        fr: 'Les commandes utilisent souvent un nombre suivi d’un mot de mesure.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'order-food-hanzi-1',
      hanzi: '水',
      pinyin: 'shuǐ',
      meaning: {
        en: 'water',
        fr: 'eau',
      },
      explanation: {
        en: 'Recognize 水 on menus and drink signs.',
        fr: 'Reconnais 水 sur les menus et les boissons.',
      },
    },
    {
      id: 'order-food-hanzi-2',
      hanzi: '辣',
      pinyin: 'là',
      meaning: {
        en: 'spicy',
        fr: 'épicé',
      },
      explanation: {
        en: 'Spot 辣 when choosing spice level.',
        fr: 'Repère 辣 quand tu choisis le niveau d’épices.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'order-food-listening-1',
        prompt: {
          en: 'Which line asks for a menu?',
          fr: 'Quelle phrase demande le menu ?',
        },
        target: '请问，有菜单吗？',
        explanation: {
          en: 'Listen for 菜单, the word for menu.',
          fr: 'Écoute 菜单, le mot pour menu.',
        },
      },
    ],
    speaking: [
      {
        id: 'order-food-speaking-1',
        prompt: {
          en: 'Say that you’d like one glass of water.',
          fr: 'Dis que tu voudrais un verre d’eau.',
        },
        target: '我想要一杯水。',
        explanation: {
          en: '我想要 keeps the request natural and polite.',
          fr: '我想要 garde la demande naturelle et polie.',
        },
      },
    ],
    reading: [
      {
        id: 'order-food-reading-1',
        prompt: {
          en: 'Read aloud: 不辣，可以打包吗？',
          fr: 'Lis à voix haute : 不辣，可以打包吗？',
        },
        target: '不辣，可以打包吗？',
        explanation: {
          en: 'This combines spice preference with a takeaway request.',
          fr: 'Cette phrase combine une préférence d’épices et une demande à emporter.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'order-food-review-1',
      front: '我想要',
      back: {
        en: 'I’d like',
        fr: 'Je voudrais',
      },
      explanation: {
        en: 'A natural request opener for ordering food and drinks.',
        fr: 'Une formule naturelle pour commander à manger ou à boire.',
      },
    },
  ],
  shortInput: {
    id: 'order-food-short-input-01',
    prompt: {
      en: 'Type the phrase for “I’d like this, not spicy.”',
      fr: 'Tape la phrase pour dire « Je voudrais celui-ci, pas épicé ».',
    },
    target: '我想要这个，不辣。',
    explanation: {
      en: 'Use 我想要 for the request and 不辣 for spice preference.',
      fr: 'Utilise 我想要 pour la demande et 不辣 pour la préférence d’épices.',
    },
    audio: '/audio/order-food/short-input-01.mp3',
  },
}
