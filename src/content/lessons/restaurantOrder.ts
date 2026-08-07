import type { LessonContent } from '../types.js'

export const restaurantOrderLesson: LessonContent = {
  id: 'restaurant-order',
  title: {
    en: 'Order a simple meal',
    fr: 'Commander un repas simple',
  },
  scenario: {
    en: 'Ask for a menu, order beef noodles without spice, request water and chopsticks, choose a drink, confirm portion size, ask the total, and ask for takeaway.',
    fr: 'Demander le menu, commander des nouilles au bœuf sans piment, demander de l\'eau et des baguettes, choisir une boisson, confirmer la taille de la portion, demander le total et demander à emporter.',
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
          fr: 'Je voudrais aussi un verre d\'eau et des baguettes.',
        },
        explanation: {
          en: 'This keeps the extra request short: water plus chopsticks.',
          fr: 'La demande supplémentaire reste courte : de l\'eau et des baguettes.',
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
      {
        id: 'restaurant-order-line-06',
        speaker: { en: 'Server', fr: 'Serveur' },
        hanzi: '大份还是小份？',
        pinyin: 'Dà fèn háishì xiǎo fèn?',
        translation: {
          en: 'Large or small portion?',
          fr: 'Grande ou petite portion ?',
        },
        explanation: {
          en: '大份还是小份 is a common question about portion size in small restaurants.',
          fr: '大份还是小份 est une question courante sur la taille des portions dans les petits restaurants.',
        },
        audio: '/audio/restaurant-order/line-06.mp3',
      },
      {
        id: 'restaurant-order-line-07',
        speaker: { en: 'Customer', fr: 'Client' },
        hanzi: '小份。还有可乐吗？',
        pinyin: 'Xiǎo fèn. Hái yǒu kělè ma?',
        translation: {
          en: 'Small portion. And do you have cola?',
          fr: 'Petite portion. Et avez-vous du cola ?',
        },
        explanation: {
          en: 'Confirm the size, then use 还有…吗 to ask about a drink.',
          fr: 'Confirme la taille, puis utilise 还有…吗 pour demander une boisson.',
        },
        audio: '/audio/restaurant-order/line-07.mp3',
      },
      {
        id: 'restaurant-order-line-08',
        speaker: { en: 'Server', fr: 'Serveur' },
        hanzi: '可以。在这儿吃还是带走？',
        pinyin: 'Kěyǐ. Zài zhèr chī háishì dàizǒu?',
        translation: {
          en: 'Sure. Eat here or take away?',
          fr: 'D\'accord. Sur place ou à emporter ?',
        },
        explanation: {
          en: '在这儿吃 means eat here; 带走 means take away.',
          fr: '在这儿吃 signifie manger sur place ; 带走 signifie à emporter.',
        },
        audio: '/audio/restaurant-order/line-08.mp3',
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
    {
      id: 'restaurant-order-pattern-4',
      pattern: '…还是…？',
      meaning: { en: '... or ...?', fr: '... ou ... ?' },
      example: '大份还是小份？',
      audio: '/audio/restaurant-order/pattern-04.mp3',
      explanation: {
        en: 'Use 还是 for a choice between two options in a question.',
        fr: 'Utilise 还是 pour proposer un choix entre deux options dans une question.',
      },
    },
    {
      id: 'restaurant-order-pattern-5',
      pattern: '在这儿……还是……？',
      meaning: { en: 'Here ... or ...? (for location choices)', fr: 'Sur place ... ou ... ? (pour les choix de lieu)' },
      example: '在这儿吃还是带走？',
      audio: '/audio/restaurant-order/pattern-05.mp3',
      explanation: {
        en: 'Use this pattern when the server asks if you want to eat in or take away.',
        fr: 'Utilise cette structure quand le serveur demande si tu manges sur place ou à emporter.',
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
    { id: 'restaurant-order-vocab-6', hanzi: '大份', pinyin: 'dà fèn', audio: '/audio/restaurant-order/vocab-06.mp3', meaning: { en: 'large portion', fr: 'grande portion' }, explanation: { en: 'Choose 大份 for a bigger serving.', fr: 'Choisis 大份 pour une plus grande portion.' } },
    { id: 'restaurant-order-vocab-7', hanzi: '小份', pinyin: 'xiǎo fèn', audio: '/audio/restaurant-order/vocab-07.mp3', meaning: { en: 'small portion', fr: 'petite portion' }, explanation: { en: 'Choose 小份 for a smaller serving.', fr: 'Choisis 小份 pour une plus petite portion.' } },
    { id: 'restaurant-order-vocab-8', hanzi: '可乐', pinyin: 'kělè', audio: '/audio/restaurant-order/vocab-08.mp3', meaning: { en: 'cola', fr: 'cola' }, explanation: { en: 'A common drink to order in restaurants.', fr: 'Une boisson courante à commander au restaurant.' } },
    { id: 'restaurant-order-vocab-9', hanzi: '带走', pinyin: 'dàizǒu', audio: '/audio/restaurant-order/vocab-09.mp3', meaning: { en: 'take away', fr: 'à emporter' }, explanation: { en: 'Use it when you want to take the food with you.', fr: 'Utilise-le quand tu veux emporter la nourriture.' } },
    { id: 'restaurant-order-vocab-10', hanzi: '买单', pinyin: 'mǎidān', audio: '/audio/restaurant-order/vocab-10.mp3', meaning: { en: 'pay the bill', fr: 'payer l\'addition' }, explanation: { en: 'Say 买单 to ask for the bill at the end of a meal.', fr: 'Dis 买单 pour demander l\'addition à la fin du repas.' } },
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
      { id: 'restaurant-order-listening-2', prompt: { en: 'Which phrase means take away?', fr: 'Quelle phrase signifie à emporter ?' }, target: '带走', audio: '/audio/restaurant-order/practice-listening-02.mp3', explanation: { en: '带走 is the word for taking food to go.', fr: '带走 est le mot pour emporter la nourriture.' } },
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
          fr: 'C\'est la phrase principale pour commander sans risque.',
        },
      },
      { id: 'restaurant-order-speaking-2', prompt: { en: 'Ask if they have cola.', fr: 'Demande s\'ils ont du cola.' }, target: '有可乐吗？', audio: '/audio/restaurant-order/practice-speaking-02.mp3', explanation: { en: 'A quick drink question after ordering food.', fr: 'Une question rapide sur les boissons après avoir commandé.' } },
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
      { id: 'restaurant-order-reading-2', prompt: { en: 'Match the word for paying the bill.', fr: 'Associe le mot pour payer l\'addition.' }, target: '买单', audio: '/audio/restaurant-order/practice-reading-02.mp3', explanation: { en: '买单 is how you ask for the check.', fr: '买单 est la façon de demander l\'addition.' } },
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
    { id: 'restaurant-order-review-4', front: '大份 / 小份', back: { en: 'large / small portion', fr: 'grande / petite portion' }, explanation: { en: 'Choose your portion size when ordering.', fr: 'Choisis la taille de ta portion en commandant.' } },
    { id: 'restaurant-order-review-5', front: '带走', back: { en: 'take away', fr: 'à emporter' }, explanation: { en: 'Say this to take the food with you.', fr: 'Dis ceci pour emporter la nourriture.' } },
    { id: 'restaurant-order-review-6', front: '买单', back: { en: 'pay the bill', fr: 'payer l\'addition' }, explanation: { en: 'Ask the server for the check.', fr: 'Demande l\'addition au serveur.' } },
  ],
}
