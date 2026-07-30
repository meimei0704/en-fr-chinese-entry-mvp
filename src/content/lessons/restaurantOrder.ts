import type { LessonContent } from '../types.js'

export const restaurantOrderLesson: LessonContent = {
  id: 'restaurant-order',
  title: {
    en: 'Order a simple meal',
    fr: 'Commander un repas simple',
  },
  scenario: {
    en: 'Ask for a menu, order beef noodles without spice, request water and chopsticks, and ask the total price.',
    fr: 'Demander le menu, commander des nouilles au bœuf sans piment, demander de l’eau et des baguettes, puis demander le total.',
  },
  dialogue: {
    title: {
      en: 'Order noodles in a small restaurant',
      fr: 'Commander des nouilles dans un petit restaurant',
    },
    lines: [
      {
        id: 'restaurant-order-line-01',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '你好，有菜单吗？',
        pinyin: 'Nǐ hǎo, yǒu càidān ma?',
        translation: {
          en: 'Hello, do you have a menu?',
          fr: 'Bonjour, avez-vous un menu ?',
        },
        explanation: {
          en: '有……吗 asks whether something is available before you order.',
          fr: '有……吗 sert à demander si quelque chose est disponible avant de commander.',
        },
        audio: '/audio/restaurant-order/line-01.mp3',
      },
      {
        id: 'restaurant-order-line-02',
        speaker: {
          en: 'Server',
          fr: 'Serveur',
        },
        hanzi: '有，这是菜单。',
        pinyin: 'Yǒu, zhè shì càidān.',
        translation: {
          en: 'Yes, here is the menu.',
          fr: 'Oui, voici le menu.',
        },
        explanation: {
          en: '这是菜单 is a short handoff phrase you may hear at a restaurant.',
          fr: '这是菜单 est une phrase courte que tu peux entendre au restaurant.',
        },
        audio: '/audio/restaurant-order/line-02.mp3',
      },
      {
        id: 'restaurant-order-line-03',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '我要一碗牛肉面，不要辣。',
        pinyin: 'Wǒ yào yì wǎn niúròu miàn, bú yào là.',
        translation: {
          en: 'I want one bowl of beef noodles, not spicy.',
          fr: 'Je voudrais un bol de nouilles au bœuf, sans piment.',
        },
        explanation: {
          en: '我要一碗 names one bowl; 不要辣 makes the safety preference clear.',
          fr: '我要一碗 indique un bol ; 不要辣 précise clairement la préférence sans piment.',
        },
        audio: '/audio/restaurant-order/line-03.mp3',
      },
      {
        id: 'restaurant-order-line-04',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '还要一杯水和筷子。',
        pinyin: 'Hái yào yì bēi shuǐ hé kuàizi.',
        translation: {
          en: 'I also want a cup of water and chopsticks.',
          fr: 'Je voudrais aussi un verre d’eau et des baguettes.',
        },
        explanation: {
          en: 'This keeps the extra request short: water plus chopsticks.',
          fr: 'La demande supplémentaire reste courte : de l’eau et des baguettes.',
        },
        audio: '/audio/restaurant-order/line-04.mp3',
      },
      {
        id: 'restaurant-order-line-05',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '一共多少钱？',
        pinyin: 'Yígòng duōshao qián?',
        translation: {
          en: 'How much is it altogether?',
          fr: 'Combien ça fait au total ?',
        },
        explanation: {
          en: 'Reuse 一共多少钱 when you are ready to pay.',
          fr: 'Réutilise 一共多少钱 quand tu es prêt à payer.',
        },
        audio: '/audio/restaurant-order/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'restaurant-order-pattern-1',
      pattern: '我要一碗 / 一份……',
      meaning: {
        en: 'I want one bowl / one portion of ...',
        fr: 'Je voudrais un bol / une portion de ...',
      },
      example: '我要一碗牛肉面。',
      audio: '/audio/restaurant-order/pattern-01.mp3',
      explanation: {
        en: 'Use 一碗 for noodles or soup and 一份 for one portion of food.',
        fr: 'Utilise 一碗 pour les nouilles ou la soupe, et 一份 pour une portion de plat.',
      },
    },
    {
      id: 'restaurant-order-pattern-2',
      pattern: '不要 / 少……',
      meaning: {
        en: 'Do not add ... / less ...',
        fr: 'Sans ... / moins de ...',
      },
      example: '不要辣。',
      audio: '/audio/restaurant-order/pattern-02.mp3',
      explanation: {
        en: '不要 is the clearest survival phrase for avoiding spice.',
        fr: '不要 est la phrase de survie la plus claire pour éviter le piment.',
      },
    },
    {
      id: 'restaurant-order-pattern-3',
      pattern: '有……吗？',
      meaning: {
        en: 'Do you have ...?',
        fr: 'Avez-vous ... ?',
      },
      example: '有菜单吗？',
      audio: '/audio/restaurant-order/pattern-03.mp3',
      explanation: {
        en: 'Ask this before you choose or request something.',
        fr: 'Demande cela avant de choisir ou de demander quelque chose.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'restaurant-order-vocab-1',
      hanzi: '菜单',
      pinyin: 'càidān',
      audio: '/audio/restaurant-order/vocab-01.mp3',
      meaning: {
        en: 'menu',
        fr: 'menu',
      },
      explanation: {
        en: 'The first word to ask for in a restaurant.',
        fr: 'Le premier mot à demander au restaurant.',
      },
    },
    {
      id: 'restaurant-order-vocab-2',
      hanzi: '牛肉面',
      pinyin: 'niúròu miàn',
      audio: '/audio/restaurant-order/vocab-02.mp3',
      meaning: {
        en: 'beef noodles',
        fr: 'nouilles au bœuf',
      },
      explanation: {
        en: 'A common simple meal with a clear measure word.',
        fr: 'Un repas simple courant avec un classificateur clair.',
      },
    },
    {
      id: 'restaurant-order-vocab-3',
      hanzi: '一碗',
      pinyin: 'yì wǎn',
      audio: '/audio/restaurant-order/vocab-03.mp3',
      meaning: {
        en: 'one bowl',
        fr: 'un bol',
      },
      explanation: {
        en: 'Use it when ordering noodles, rice, or soup by the bowl.',
        fr: 'Utilise-le pour commander des nouilles, du riz ou une soupe au bol.',
      },
    },
    {
      id: 'restaurant-order-vocab-4',
      hanzi: '辣',
      pinyin: 'là',
      audio: '/audio/restaurant-order/vocab-04.mp3',
      meaning: {
        en: 'spicy',
        fr: 'pimenté / épicé',
      },
      explanation: {
        en: 'Pair it with 不要 if you need no spice.',
        fr: 'Associe-le à 不要 si tu ne veux pas de piment.',
      },
    },
    {
      id: 'restaurant-order-vocab-5',
      hanzi: '筷子',
      pinyin: 'kuàizi',
      audio: '/audio/restaurant-order/vocab-05.mp3',
      meaning: {
        en: 'chopsticks',
        fr: 'baguettes',
      },
      explanation: {
        en: 'A useful table item to request with your meal.',
        fr: 'Un objet utile à demander avec le repas.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'restaurant-order-pronunciation-1',
      focus: {
        en: '一 tone change with measure words',
        fr: 'Changement de ton de 一 avec les classificateurs',
      },
      audioText: '一碗牛肉面，一杯水，一共多少钱',
      audio: '/audio/restaurant-order/pronunciation-01.mp3',
      tip: {
        en: 'Listen for 一 changing sound before 碗 and 杯; keep 一共 as one quick phrase.',
        fr: 'Écoute le changement de son de 一 devant 碗 et 杯 ; garde 一共 comme une phrase rapide.',
      },
      explanation: {
        en: 'Restaurant orders repeat measure words often, so 一 needs extra listening practice.',
        fr: 'Les commandes au restaurant répètent souvent les classificateurs, donc 一 mérite une écoute spéciale.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'restaurant-order-hanzi-1',
      hanzi: '菜',
      pinyin: 'cài',
      meaning: {
        en: 'dish / food',
        fr: 'plat / cuisine',
      },
      explanation: {
        en: 'It appears inside 菜单, the menu.',
        fr: 'Il apparaît dans 菜单, le menu.',
      },
    },
    {
      id: 'restaurant-order-hanzi-2',
      hanzi: '面',
      pinyin: 'miàn',
      meaning: {
        en: 'noodles',
        fr: 'nouilles',
      },
      explanation: {
        en: 'Recognize it in 牛肉面.',
        fr: 'Reconnais-le dans 牛肉面.',
      },
    },
    {
      id: 'restaurant-order-hanzi-3',
      hanzi: '辣',
      pinyin: 'là',
      meaning: {
        en: 'spicy',
        fr: 'épicé',
      },
      explanation: {
        en: 'A key character for food preferences.',
        fr: 'Un caractère clé pour les préférences alimentaires.',
      },
    },
    {
      id: 'restaurant-order-hanzi-4',
      hanzi: '碗',
      pinyin: 'wǎn',
      meaning: {
        en: 'bowl',
        fr: 'bol',
      },
      explanation: {
        en: 'A measure word and object you see in 一碗.',
        fr: 'Un classificateur et un objet que tu vois dans 一碗.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'restaurant-order-listening-1',
        prompt: {
          en: 'Listen for the request to see the menu and order beef noodles.',
          fr: 'Écoute la demande du menu et la commande de nouilles au bœuf.',
        },
        target: '有菜单吗？我要一碗牛肉面。',
        audio: '/audio/restaurant-order/practice-listening-01.mp3',
        explanation: {
          en: 'The target combines the menu question with a simple food order.',
          fr: 'La cible combine la question du menu avec une commande simple.',
        },
      },
    ],
    speaking: [
      {
        id: 'restaurant-order-speaking-1',
        prompt: {
          en: 'Say you want one bowl of beef noodles and no spice.',
          fr: 'Dis que tu veux un bol de nouilles au bœuf sans piment.',
        },
        target: '我要一碗牛肉面，不要辣。',
        audio: '/audio/restaurant-order/practice-speaking-01.mp3',
        explanation: {
          en: 'This is the core safe ordering sentence.',
          fr: 'C’est la phrase principale pour commander sans risque.',
        },
      },
    ],
    reading: [
      {
        id: 'restaurant-order-reading-1',
        prompt: {
          en: 'Match the total-price question on a small bill.',
          fr: 'Associe la question du prix total sur une petite addition.',
        },
        target: '一共多少钱？',
        audio: '/audio/restaurant-order/practice-reading-01.mp3',
        explanation: {
          en: 'Use this when all items are ready and you need the total.',
          fr: 'Utilise cela quand les articles sont prêts et que tu veux le total.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'restaurant-order-review-1',
      front: '菜单',
      back: {
        en: 'menu',
        fr: 'menu',
      },
      explanation: {
        en: 'Ask 有菜单吗？ to see it.',
        fr: 'Demande 有菜单吗？ pour le voir.',
      },
    },
    {
      id: 'restaurant-order-review-2',
      front: '牛肉面',
      back: {
        en: 'beef noodles',
        fr: 'nouilles au bœuf',
      },
      explanation: {
        en: 'Order it with 我要一碗牛肉面。',
        fr: 'Commande-le avec 我要一碗牛肉面。',
      },
    },
    {
      id: 'restaurant-order-review-3',
      front: '不要辣',
      back: {
        en: 'not spicy / no chili',
        fr: 'sans piment',
      },
      explanation: {
        en: 'A concise food safety preference.',
        fr: 'Une préférence alimentaire concise.',
      },
    },
  ],
  shortInput: {
    id: 'restaurant-order-short-input-01',
    prompt: {
      en: 'Order beef noodles without spice.',
      fr: 'Commande des nouilles au bœuf sans piment.',
    },
    target: '我要一碗牛肉面，不要辣。',
    explanation: {
      en: 'One sentence names the dish and the spice preference.',
      fr: 'Une phrase nomme le plat et la préférence sans piment.',
    },
    audio: '/audio/restaurant-order/short-input-01.mp3',
  },
}
