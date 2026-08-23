import type { LessonContent } from '../types.js'

export const restaurantOrderLesson: LessonContent = {
  id: 'restaurant-order',
  title: {
    en: '点餐 / Order a meal',
    fr: '点餐 / Commander un repas',
  },
  scenario: {
    en: 'Ask for a menu, order food and drinks, specify your preference and make the payment.',
    fr: 'Demander un menu, commander plats et boissons, préciser sa préférence et régler l\'addition.',
  },
  dialogue: {
    title: {
      en: 'Order noodles in a small restaurant',
      fr: 'Commander des nouilles dans un petit restaurant',
    },
    lines: [
      {
        id: 'restaurant-order-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '服务员！',
        pinyin: 'Fú wù yuán!',
        translation: { en: 'Waiter!', fr: 'Serveur !' },
        explanation: { en: 'Call 服务员 to get a server\'s attention in a restaurant.', fr: 'Appelle 服务员 pour attirer l\'attention d\'un serveur au restaurant.' },
        audio: '/audio/restaurant-order/line-01.mp3',
      },
      {
        id: 'restaurant-order-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请给我菜单。',
        pinyin: 'Qǐng gěi wǒ cài dān.',
        translation: { en: 'Can I have the menu please.', fr: 'Puis-je avoir le menu, s\'il vous plaît ?' },
        explanation: { en: 'Ask for the menu first with 请给我菜单.', fr: 'Demande d\'abord le menu avec 请给我菜单.' },
        audio: '/audio/restaurant-order/line-02.mp3',
      },
      {
        id: 'restaurant-order-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '可以点餐了吗？',
        pinyin: 'Kě yǐ diǎn cān le ma?',
        translation: { en: 'Can I order now?', fr: 'Puis-je commander maintenant ?' },
        explanation: { en: 'Ask 可以点餐了吗 when you are ready to order.', fr: 'Demande 可以点餐了吗 quand tu es prêt à commander.' },
        audio: '/audio/restaurant-order/line-03.mp3',
      },
      {
        id: 'restaurant-order-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我要这个。',
        pinyin: 'Wǒ yào zhè ge.',
        translation: { en: 'I want this one.', fr: 'Je veux ceci.' },
        explanation: { en: 'Point at an item and say 我要这个 to order it.', fr: 'Montre un article et dis 我要这个 pour le commander.' },
        audio: '/audio/restaurant-order/line-04.mp3',
      },
      {
        id: 'restaurant-order-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我要一碗面条。',
        pinyin: 'Wǒ yào yì wǎn miàn tiáo.',
        translation: { en: 'A bowl of noodles, please.', fr: 'Un bol de nouilles, s\'il vous plaît.' },
        explanation: { en: 'Order noodles or rice by bowl with 我要一碗.', fr: 'Commande des nouilles ou du riz en bol avec 我要一碗.' },
        audio: '/audio/restaurant-order/line-05.mp3',
      },
      {
        id: 'restaurant-order-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '来一碗米饭。',
        pinyin: 'Lái yì wǎn mǐ fàn.',
        translation: { en: 'A bowl of rice, please.', fr: 'Un bol de riz, s\'il vous plaît.' },
        explanation: { en: 'Order a bowl of rice with 来一碗米饭.', fr: 'Commande un bol de riz avec 来一碗米饭.' },
        audio: '/audio/restaurant-order/line-06.mp3',
      },
      {
        id: 'restaurant-order-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请给我一杯水。',
        pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.',
        translation: { en: 'Please give me a glass of water.', fr: 'Un verre d\'eau, s\'il vous plaît.' },
        explanation: { en: 'Use 请给我一杯水 to ask for a glass of water.', fr: 'Utilise 请给我一杯水 pour demander un verre d\'eau.' },
        audio: '/audio/restaurant-order/line-07.mp3',
      },
      {
        id: 'restaurant-order-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '不要辣。',
        pinyin: 'Bú yào là.',
        translation: { en: 'No spicy, please.', fr: 'Sans piment, s\'il vous plaît.' },
        explanation: { en: '不要辣 is the clearest way to avoid spice in a dish.', fr: '不要辣 est la façon la plus claire d\'éviter le piment dans un plat.' },
        audio: '/audio/restaurant-order/line-08.mp3',
      },
      {
        id: 'restaurant-order-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '微辣。',
        pinyin: 'Wēi là.',
        translation: { en: 'Mildly spicy.', fr: 'Légèrement épicé.' },
        explanation: { en: 'Use 微辣 to ask for a mild level of spice.', fr: 'Utilise 微辣 pour demander un niveau de piment léger.' },
        audio: '/audio/restaurant-order/line-09.mp3',
      },
      {
        id: 'restaurant-order-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我对花生过敏。',
        pinyin: 'Wǒ duì huā shēng guò mǐn.',
        translation: { en: 'I am allergic to peanuts.', fr: 'Je suis allergique aux cacahuètes.' },
        explanation: { en: 'Use 我对…过敏 to name an allergy before ordering.', fr: 'Utilise 我对…过敏 pour nommer une allergie avant de commander.' },
        audio: '/audio/restaurant-order/line-10.mp3',
      },
      {
        id: 'restaurant-order-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我是素食主义者。',
        pinyin: 'Wǒ shì sù shí zhǔ yì zhě.',
        translation: { en: 'I am vegetarian.', fr: 'Je suis végétarien(ne).' },
        explanation: { en: 'Tell the server 我是素食主义者 to explain your dietary preference.', fr: 'Dis au serveur 我是素食主义者 pour expliquer ton régime alimentaire.' },
        audio: '/audio/restaurant-order/line-11.mp3',
      },
      {
        id: 'restaurant-order-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '您好，结账。',
        pinyin: 'Nín hǎo, jié zhàng.',
        translation: { en: 'Check, please.', fr: 'Bonjour, l\'addition, s\'il vous plaît.' },
        explanation: { en: 'Ask 您好，结账 to request the bill at the end of a meal.', fr: 'Demande 您好，结账 pour réclamer l\'addition à la fin du repas.' },
        audio: '/audio/restaurant-order/line-12.mp3',
      },
      {
        id: 'restaurant-order-line-13',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我吃饱了。',
        pinyin: 'Wǒ chī bǎo le.',
        translation: { en: 'I am full.', fr: 'Je suis rassasié(e).' },
        explanation: { en: 'Say 我吃饱了 to let the server know you have eaten enough.', fr: 'Dis 我吃饱了 pour faire savoir au serveur que tu as assez mangé.' },
        audio: '/audio/restaurant-order/line-13.mp3',
      },
      {
        id: 'restaurant-order-line-14',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '可以打包带走吗？',
        pinyin: 'Kě yǐ dǎ bāo dài zǒu ma?',
        translation: { en: 'Could you pack it for takeaway?', fr: 'Pouvez-vous l\'emballer pour emporter ?' },
        explanation: { en: 'Ask this at the end of the meal if you want to take the food away.', fr: 'Demande cela à la fin du repas si tu veux emporter la nourriture.' },
        audio: '/audio/restaurant-order/line-14.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'restaurant-order-pattern-1',
      pattern: '请给我……。',
      pinyin: 'Qǐng gěi wǒ ... .',
      meaning: {
        en: 'Could I have ... please?',
        fr: 'Puis-je avoir ... ?',
      },
      audio: '/audio/restaurant-order/pattern-01.mp3',
      examples: [
        {
          fill: '菜单',
          fillPinyin: 'càidān',
          hanzi: '请给我菜单。',
          pinyin: 'Qǐng gěi wǒ cài dān.',
          en: 'the menu',
          fr: 'le menu',
          audio: '/audio/restaurant-order/pattern-01-example-01.mp3',
        },
        {
          fill: '一杯水',
          fillPinyin: 'yì bēi shuǐ',
          hanzi: '请给我一杯水。',
          pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.',
          en: 'a glass of water',
          fr: 'un verre d\'eau',
          audio: '/audio/restaurant-order/pattern-01-example-02.mp3',
        },
        {
          fill: '一碗米饭',
          fillPinyin: 'yì wǎn mǐfàn',
          hanzi: '请给我一碗米饭。',
          pinyin: 'Qǐng gěi wǒ yì wǎn mǐ fàn.',
          en: 'a bowl of rice',
          fr: 'un bol de riz',
          audio: '/audio/restaurant-order/pattern-01-example-03.mp3',
        },
      ],
    },
    {
      id: 'restaurant-order-pattern-2',
      pattern: '我要一碗……。',
      pinyin: 'Wǒ yào yì wǎn ... .',
      meaning: {
        en: 'A bowl of ..., please.',
        fr: 'Un bol de ..., s\'il vous plaît.',
      },
      audio: '/audio/restaurant-order/pattern-02.mp3',
      examples: [
        {
          fill: '面条',
          fillPinyin: 'miàntiáo',
          hanzi: '我要一碗面条。',
          pinyin: 'Wǒ yào yì wǎn miàn tiáo.',
          en: 'noodles',
          fr: 'des nouilles',
          audio: '/audio/restaurant-order/pattern-02-example-01.mp3',
        },
        {
          fill: '米饭',
          fillPinyin: 'mǐfàn',
          hanzi: '我要一碗米饭。',
          pinyin: 'Wǒ yào yì wǎn mǐ fàn.',
          en: 'rice',
          fr: 'du riz',
          audio: '/audio/restaurant-order/pattern-02-example-02.mp3',
        },
        {
          fill: '汤',
          fillPinyin: 'tāng',
          hanzi: '我要一碗汤。',
          pinyin: 'Wǒ yào yì wǎn tāng.',
          en: 'soup',
          fr: 'de la soupe',
          audio: '/audio/restaurant-order/pattern-02-example-03.mp3',
        },
      ],
    },
    {
      id: 'restaurant-order-pattern-3',
      pattern: '不要……。',
      pinyin: 'Bú yào ... .',
      meaning: {
        en: 'No ..., please.',
        fr: 'Sans ..., s\'il vous plaît.',
      },
      audio: '/audio/restaurant-order/pattern-03.mp3',
      examples: [
        {
          fill: '辣',
          fillPinyin: 'là',
          hanzi: '不要辣。',
          pinyin: 'Bú yào là.',
          en: 'spicy',
          fr: 'pimenté',
          audio: '/audio/restaurant-order/pattern-03-example-01.mp3',
        },
        {
          fill: '葱',
          fillPinyin: 'cōng',
          hanzi: '不要葱。',
          pinyin: 'Bú yào cōng.',
          en: 'onion',
          fr: 'd\'oignon',
          audio: '/audio/restaurant-order/pattern-03-example-02.mp3',
        },
        {
          fill: '香菜',
          fillPinyin: 'xiāngcài',
          hanzi: '不要香菜。',
          pinyin: 'Bú yào xiāng cài.',
          en: 'cilantro',
          fr: 'de coriandre',
          audio: '/audio/restaurant-order/pattern-03-example-03.mp3',
        },
      ],
    },
    {
      id: 'restaurant-order-pattern-4',
      pattern: '我对……过敏。',
      pinyin: 'Wǒ duì ... guò mǐn.',
      meaning: {
        en: 'I am allergic to ...',
        fr: 'Je suis allergique à ...',
      },
      audio: '/audio/restaurant-order/pattern-04.mp3',
      examples: [
        {
          fill: '花生',
          fillPinyin: 'huāshēng',
          hanzi: '我对花生过敏。',
          pinyin: 'Wǒ duì huā shēng guò mǐn.',
          en: 'peanuts',
          fr: 'aux cacahuètes',
          audio: '/audio/restaurant-order/pattern-04-example-01.mp3',
        },
        {
          fill: '海鲜',
          fillPinyin: 'hǎixiān',
          hanzi: '我对海鲜过敏。',
          pinyin: 'Wǒ duì hǎi xiān guò mǐn.',
          en: 'seafood',
          fr: 'aux fruits de mer',
          audio: '/audio/restaurant-order/pattern-04-example-02.mp3',
        },
        {
          fill: '牛奶',
          fillPinyin: 'niúnǎi',
          hanzi: '我对牛奶过敏。',
          pinyin: 'Wǒ duì niú nǎi guò mǐn.',
          en: 'milk',
          fr: 'au lait',
          audio: '/audio/restaurant-order/pattern-04-example-03.mp3',
        },
      ],
    },
    {
      id: 'restaurant-order-pattern-5',
      pattern: '可以打包带走吗？',
      pinyin: 'Kě yǐ dǎ bāo dài zǒu ma?',
      meaning: {
        en: 'Could you pack it for takeaway?',
        fr: 'Pouvez-vous l\'emballer pour emporter ?',
      },
      audio: '/audio/restaurant-order/pattern-05.mp3',
    },
    {
      id: 'restaurant-order-pattern-6',
      pattern: '服务员！',
      pinyin: 'Fú wù yuán!',
      meaning: {
        en: 'Waiter!',
        fr: 'Serveur !',
      },
    
      audio: '/audio/restaurant-order/line-01.mp3',},
    {
      id: 'restaurant-order-pattern-7',
      pattern: '可以点餐了吗？',
      pinyin: 'Kě yǐ diǎn cān le ma?',
      meaning: {
        en: 'Can I order now?',
        fr: 'Puis-je commander maintenant ?',
      },
      audio: '/audio/restaurant-order/pattern-07.mp3',
    },
    {
      id: 'restaurant-order-pattern-8',
      pattern: '我要这个。',
      pinyin: 'Wǒ yào zhè ge.',
      meaning: {
        en: 'I want this one.',
        fr: 'Je veux ceci.',
      },
    
      audio: '/audio/restaurant-order/line-04.mp3',},
    {
      id: 'restaurant-order-pattern-9',
      pattern: '来一碗米饭。',
      pinyin: 'Lái yì wǎn mǐ fàn.',
      meaning: {
        en: 'A bowl of rice, please.',
        fr: 'Un bol de riz, s\'il vous plaît.',
      },
    
      audio: '/audio/restaurant-order/line-06.mp3',},
    {
      id: 'restaurant-order-pattern-10',
      pattern: '请给我一杯水。',
      pinyin: 'Qǐng gěi wǒ yì bēi shuǐ.',
      meaning: {
        en: 'Please give me a glass of water.',
        fr: 'Un verre d\'eau, s\'il vous plaît.',
      },
    
      audio: '/audio/restaurant-order/line-07.mp3',},
    {
      id: 'restaurant-order-pattern-11',
      pattern: '微辣。',
      pinyin: 'Wēi là.',
      meaning: {
        en: 'Mildly spicy.',
        fr: 'Légèrement épicé.',
      },
    
      audio: '/audio/restaurant-order/line-09.mp3',},
    {
      id: 'restaurant-order-pattern-12',
      pattern: '我是素食主义者。',
      pinyin: 'Wǒ shì sù shí zhǔ yì zhě.',
      meaning: {
        en: 'I am vegetarian.',
        fr: 'Je suis végétarien(ne).',
      },
    
      audio: '/audio/restaurant-order/line-11.mp3',},
    {
      id: 'restaurant-order-pattern-13',
      pattern: '您好，结账。',
      pinyin: 'Nín hǎo, jié zhàng.',
      meaning: {
        en: 'Hello, the check, please.',
        fr: 'Bonjour, l\'addition, s\'il vous plaît.',
      },
      audio: '/audio/restaurant-order/pattern-13.mp3',
    },
    {
      id: 'restaurant-order-pattern-14',
      pattern: '我吃饱了。',
      pinyin: 'Wǒ chī bǎo le.',
      meaning: {
        en: 'I am full.',
        fr: 'Je suis rassasié(e).',
      },
    
      audio: '/audio/restaurant-order/line-13.mp3',},
  ],
  vocabulary: [
    {
      id: 'restaurant-order-vocab-1',
      hanzi: '菜单',
      pinyin: 'cài dān',
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
      pinyin: 'niú ròu miàn',
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
      pinyin: 'kuài zi',
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
    { id: 'restaurant-order-vocab-8', hanzi: '可乐', pinyin: 'kě lè', audio: '/audio/restaurant-order/vocab-08.mp3', meaning: { en: 'cola', fr: 'cola' }, explanation: { en: 'A common drink to order in restaurants.', fr: 'Une boisson courante à commander au restaurant.' } },
    { id: 'restaurant-order-vocab-9', hanzi: '带走', pinyin: 'dài zǒu', audio: '/audio/restaurant-order/vocab-09.mp3', meaning: { en: 'take away', fr: 'à emporter' }, explanation: { en: 'Use it when you want to take the food with you.', fr: 'Utilise-le quand tu veux emporter la nourriture.' } },
    { id: 'restaurant-order-vocab-10', hanzi: '买单', pinyin: 'mǎi dān', audio: '/audio/restaurant-order/vocab-10.mp3', meaning: { en: 'pay the bill', fr: 'payer l\'addition' }, explanation: { en: 'Say 买单 to ask for the bill at the end of a meal.', fr: 'Dis 买单 pour demander l\'addition à la fin du repas.' } },
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
