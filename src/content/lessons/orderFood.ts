import type { LessonContent } from '../types'

export const orderFoodLesson: LessonContent = {
  id: 'order-food',
  title: {
    en: 'Hotel or apartment check-in',
    fr: 'Arrivée à l’hôtel ou à l’appartement',
  },
  scenario: {
    en: 'Complete the simplest front desk check-in: say you have a reservation, give your name, show your passport, and receive the room card.',
    fr: 'Effectuer le check-in le plus simple à la réception : dire que l’on a une réservation, donner son nom, présenter son passeport et recevoir la carte de chambre.',
  },
  dialogue: {
    title: {
      en: 'Check in at the front desk',
      fr: 'Faire le check-in à la réception',
    },
    lines: [
      {
        id: 'order-food-line-01',
        speaker: {
          en: 'Guest',
          fr: 'Client',
        },
        hanzi: '你好，我有预订。',
        pinyin: 'Nǐ hǎo, wǒ yǒu yùdìng.',
        translation: {
          en: 'Hello, I have a reservation.',
          fr: 'Bonjour, j’ai une réservation.',
        },
        explanation: {
          en: '我有预订 is the fastest way to start hotel check-in.',
          fr: '我有预订 est la façon la plus rapide de commencer un check-in à l’hôtel.',
        },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '请问您叫什么名字？',
        pinyin: 'Qǐngwèn nín jiào shénme míngzi?',
        translation: {
          en: 'May I ask your name?',
          fr: 'Puis-je vous demander votre nom ?',
        },
        explanation: {
          en: 'The front desk uses 您 for polite “you” when checking the reservation.',
          fr: 'La réception utilise 您, un « vous » poli, pour vérifier la réservation.',
        },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: {
          en: 'Guest',
          fr: 'Client',
        },
        hanzi: '我叫 Alex。',
        pinyin: 'Wǒ jiào Alex.',
        translation: {
          en: 'My name is Alex.',
          fr: 'Je m’appelle Alex.',
        },
        explanation: {
          en: 'Keep only the name pattern here because the situation is a front desk check-in.',
          fr: 'On garde seulement la structure du nom ici, car le contexte est la réception.',
        },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '请出示护照。',
        pinyin: 'Qǐng chūshì hùzhào.',
        translation: {
          en: 'Please show your passport.',
          fr: 'Veuillez présenter votre passeport.',
        },
        explanation: {
          en: 'Hotels commonly ask for a passport during check-in.',
          fr: 'Les hôtels demandent souvent le passeport pendant le check-in.',
        },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '好的，这是您的房卡。',
        pinyin: 'Hǎo de, zhè shì nín de fángkǎ.',
        translation: {
          en: 'Okay, this is your room card.',
          fr: 'D’accord, voici votre carte de chambre.',
        },
        explanation: {
          en: '房卡 is the room card you need after check-in.',
          fr: '房卡 est la carte de chambre nécessaire après le check-in.',
        },
        audio: '/audio/order-food/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'order-food-pattern-1',
      pattern: '我有预订。',
      meaning: {
        en: 'I have a reservation.',
        fr: 'J’ai une réservation.',
      },
      example: '你好，我有预订。',
      explanation: {
        en: 'Use this as your first front desk sentence.',
        fr: 'Utilise cette phrase comme première phrase à la réception.',
      },
    },
    {
      id: 'order-food-pattern-2',
      pattern: '我叫……',
      meaning: {
        en: 'My name is ...',
        fr: 'Je m’appelle ...',
      },
      example: '我叫 Alex。',
      explanation: {
        en: 'This gives the name attached to the booking.',
        fr: 'Cela donne le nom associé à la réservation.',
      },
    },
    {
      id: 'order-food-pattern-3',
      pattern: '这是您的……',
      meaning: {
        en: 'This is your ...',
        fr: 'Voici votre ...',
      },
      example: '这是您的房卡。',
      explanation: {
        en: 'You may hear this when receiving a room card or document.',
        fr: 'Tu peux entendre cette structure en recevant une carte de chambre ou un document.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'order-food-vocab-1',
      hanzi: '预订',
      pinyin: 'yùdìng',
      meaning: {
        en: 'reservation',
        fr: 'réservation',
      },
      explanation: {
        en: 'The key word for hotel and apartment booking check-in.',
        fr: 'Le mot clé pour une réservation d’hôtel ou d’appartement.',
      },
    },
    {
      id: 'order-food-vocab-2',
      hanzi: '名字',
      pinyin: 'míngzi',
      meaning: {
        en: 'name',
        fr: 'nom / prénom',
      },
      explanation: {
        en: 'The front desk asks for the name on the reservation.',
        fr: 'La réception demande le nom de la réservation.',
      },
    },
    {
      id: 'order-food-vocab-3',
      hanzi: '护照',
      pinyin: 'hùzhào',
      meaning: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'A common check-in document for international travelers.',
        fr: 'Un document courant au check-in pour les voyageurs internationaux.',
      },
    },
    {
      id: 'order-food-vocab-4',
      hanzi: '房卡',
      pinyin: 'fángkǎ',
      meaning: {
        en: 'room card',
        fr: 'carte de chambre',
      },
      explanation: {
        en: 'The card you use to enter your hotel room.',
        fr: 'La carte utilisée pour entrer dans la chambre d’hôtel.',
      },
    },
    {
      id: 'order-food-vocab-5',
      hanzi: '前台',
      pinyin: 'qiántái',
      meaning: {
        en: 'front desk',
        fr: 'réception',
      },
      explanation: {
        en: 'The place where hotel check-in happens.',
        fr: 'L’endroit où se fait le check-in à l’hôtel.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'order-food-pronunciation-1',
      focus: {
        en: 'Name pattern in a front desk context',
        fr: 'Structure du nom à la réception',
      },
      tip: {
        en: 'Say 我叫 plus your name clearly; keep the focus on the booking, not a social self-introduction.',
        fr: 'Dis clairement 我叫 suivi de ton nom ; le contexte reste la réservation, pas une présentation sociale.',
      },
      explanation: {
        en: 'This keeps the old name skill but moves it into the check-in task.',
        fr: 'Cela garde la compétence du nom, mais la déplace dans la tâche de check-in.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'order-food-hanzi-1',
      hanzi: '预',
      pinyin: 'yù',
      meaning: {
        en: 'in advance; first character of reservation',
        fr: 'à l’avance ; premier caractère de réservation',
      },
      explanation: {
        en: 'Recognize 预 as part of 预订.',
        fr: 'Reconnais 预 dans 预订.',
      },
    },
    {
      id: 'order-food-hanzi-2',
      hanzi: '订',
      pinyin: 'dìng',
      meaning: {
        en: 'book / reserve; second character of reservation',
        fr: 'réserver ; deuxième caractère de réservation',
      },
      explanation: {
        en: '订 completes 预订, the word for reservation.',
        fr: '订 complète 预订, le mot pour réservation.',
      },
    },
    {
      id: 'order-food-hanzi-3',
      hanzi: '房',
      pinyin: 'fáng',
      meaning: {
        en: 'room / house',
        fr: 'chambre / maison',
      },
      explanation: {
        en: '房 appears in 房卡, the room card.',
        fr: '房 apparaît dans 房卡, la carte de chambre.',
      },
    },
    {
      id: 'order-food-hanzi-4',
      hanzi: '卡',
      pinyin: 'kǎ',
      meaning: {
        en: 'card',
        fr: 'carte',
      },
      explanation: {
        en: '卡 completes 房卡, the card for your room.',
        fr: '卡 complète 房卡, la carte de chambre.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'order-food-listening-1',
        prompt: {
          en: 'Which phrase starts a hotel check-in?',
          fr: 'Quelle phrase commence un check-in à l’hôtel ?',
        },
        target: '你好，我有预订。',
        explanation: {
          en: 'This tells the front desk to look for your booking.',
          fr: 'Cette phrase indique à la réception de chercher ta réservation.',
        },
      },
    ],
    speaking: [
      {
        id: 'order-food-speaking-1',
        prompt: {
          en: 'Answer the front desk when they ask your name.',
          fr: 'Réponds à la réception quand on te demande ton nom.',
        },
        target: '我叫 Alex。',
        explanation: {
          en: 'Use 我叫 plus the booking name.',
          fr: 'Utilise 我叫 suivi du nom de la réservation.',
        },
      },
    ],
    reading: [
      {
        id: 'order-food-reading-1',
        prompt: {
          en: 'Match the item you receive after check-in.',
          fr: 'Associe l’objet reçu après le check-in.',
        },
        target: '房卡',
        explanation: {
          en: '房卡 is the room card for entering the hotel room.',
          fr: '房卡 est la carte pour entrer dans la chambre d’hôtel.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'order-food-review-1',
      front: '我有预订',
      back: {
        en: 'I have a reservation.',
        fr: 'J’ai une réservation.',
      },
      explanation: {
        en: 'Your opening sentence at the front desk.',
        fr: 'Ta phrase d’ouverture à la réception.',
      },
    },
    {
      id: 'order-food-review-2',
      front: '请出示护照',
      back: {
        en: 'Please show your passport.',
        fr: 'Veuillez présenter votre passeport.',
      },
      explanation: {
        en: 'A common request during check-in.',
        fr: 'Une demande courante pendant le check-in.',
      },
    },
    {
      id: 'order-food-review-3',
      front: '房卡',
      back: {
        en: 'room card',
        fr: 'carte de chambre',
      },
      explanation: {
        en: 'The key card for your hotel room.',
        fr: 'La carte clé de ta chambre d’hôtel.',
      },
    },
  ],
  shortInput: {
    id: 'order-food-short-input-01',
    prompt: {
      en: 'You arrive at the front desk. Say you have a reservation.',
      fr: 'Tu arrives à la réception. Dis que tu as une réservation.',
    },
    target: '你好，我有预订。',
    explanation: {
      en: 'This is the first sentence for a basic check-in.',
      fr: 'C’est la première phrase pour un check-in simple.',
    },
    audio: '/audio/order-food/short-input-01.mp3',
  },
}
