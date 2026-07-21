import type { LessonContent } from '../types'

export const convenienceStoreRunLesson: LessonContent = {
  id: 'convenience-store-run',
  title: {
    en: 'First convenience store run',
    fr: 'Première course en supérette',
  },
  scenario: {
    en: 'Buy a bottle of water, say you do not need anything else, ask the total, and pay.',
    fr: 'Acheter une bouteille d’eau, dire que l’on n’a besoin de rien d’autre, demander le total et payer.',
  },
  dialogue: {
    title: {
      en: 'Buy one simple item',
      fr: 'Acheter un article simple',
    },
    lines: [
      {
        id: 'convenience-store-run-line-01',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '你好，我要一瓶水。',
        pinyin: 'Nǐ hǎo, wǒ yào yì píng shuǐ.',
        translation: {
          en: 'Hello, I want a bottle of water.',
          fr: 'Bonjour, je voudrais une bouteille d’eau.',
        },
        explanation: {
          en: '我要一瓶水 is a direct beginner phrase for a first convenience store purchase.',
          fr: '我要一瓶水 est une phrase directe pour un premier achat en supérette.',
        },
        audio: '/audio/convenience-store-run/line-01.mp3',
      },
      {
        id: 'convenience-store-run-line-02',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '好的，还要别的吗？',
        pinyin: 'Hǎo de, hái yào bié de ma?',
        translation: {
          en: 'Okay, do you want anything else?',
          fr: 'D’accord, vous voulez autre chose ?',
        },
        explanation: {
          en: '还要别的吗 is a common checkout question after you name one item.',
          fr: '还要别的吗 est une question courante à la caisse après avoir nommé un article.',
        },
        audio: '/audio/convenience-store-run/line-02.mp3',
      },
      {
        id: 'convenience-store-run-line-03',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '不要了，一共多少钱？',
        pinyin: 'Bú yào le, yígòng duōshao qián?',
        translation: {
          en: 'No more, how much is it altogether?',
          fr: 'Rien d’autre, ça fait combien au total ?',
        },
        explanation: {
          en: '不要了 closes the shopping list, and 一共多少钱 asks the total price.',
          fr: '不要了 ferme la liste d’achats, et 一共多少钱 demande le prix total.',
        },
        audio: '/audio/convenience-store-run/line-03.mp3',
      },
      {
        id: 'convenience-store-run-line-04',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '五块钱。',
        pinyin: 'Wǔ kuài qián.',
        translation: {
          en: 'Five yuan.',
          fr: 'Cinq yuans.',
        },
        explanation: {
          en: '块 is the everyday word you will hear for yuan in small purchases.',
          fr: '块 est le mot courant que tu entendras pour yuan dans les petits achats.',
        },
        audio: '/audio/convenience-store-run/line-04.mp3',
      },
      {
        id: 'convenience-store-run-line-05',
        speaker: {
          en: 'Customer',
          fr: 'Client',
        },
        hanzi: '可以用手机支付吗？',
        pinyin: 'Kěyǐ yòng shǒujī zhīfù ma?',
        translation: {
          en: 'Can I pay by phone?',
          fr: 'Puis-je payer avec mon téléphone ?',
        },
        explanation: {
          en: 'This reuses the phone payment question from the previous lesson in a store.',
          fr: 'Cette phrase réutilise la question de paiement mobile de la leçon précédente dans un magasin.',
        },
        audio: '/audio/convenience-store-run/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'convenience-store-run-pattern-1',
      pattern: '我要……',
      meaning: {
        en: 'I want ...',
        fr: 'Je veux / je voudrais ...',
      },
      example: '我要一瓶水。',
      explanation: {
        en: 'Use it for one simple item when the context is already clear.',
        fr: 'Utilise cette structure pour un article simple quand le contexte est clair.',
      },
    },
    {
      id: 'convenience-store-run-pattern-2',
      pattern: '还要……吗？',
      meaning: {
        en: 'Do you also want ...?',
        fr: 'Voulez-vous aussi ... ?',
      },
      example: '还要别的吗？',
      explanation: {
        en: 'This is a common question from a clerk before payment.',
        fr: 'C’est une question courante de l’employé avant le paiement.',
      },
    },
    {
      id: 'convenience-store-run-pattern-3',
      pattern: '一共多少钱？',
      meaning: {
        en: 'How much is it altogether?',
        fr: 'Combien ça fait au total ?',
      },
      example: '一共多少钱？',
      explanation: {
        en: 'Ask this when you are ready to pay for the purchase.',
        fr: 'Demande cela quand tu es prêt à payer l’achat.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'convenience-store-run-vocab-1',
      hanzi: '一瓶水',
      pinyin: 'yì píng shuǐ',
      meaning: {
        en: 'a bottle of water',
        fr: 'une bouteille d’eau',
      },
      explanation: {
        en: 'A useful first purchase item after arriving.',
        fr: 'Un premier achat utile après l’arrivée.',
      },
    },
    {
      id: 'convenience-store-run-vocab-2',
      hanzi: '还要别的吗',
      pinyin: 'hái yào bié de ma',
      meaning: {
        en: 'anything else?',
        fr: 'autre chose ?',
      },
      explanation: {
        en: 'Listen for this checkout question after naming your item.',
        fr: 'Écoute cette question à la caisse après avoir nommé ton article.',
      },
    },
    {
      id: 'convenience-store-run-vocab-3',
      hanzi: '不要了',
      pinyin: 'bú yào le',
      meaning: {
        en: 'no more / nothing else',
        fr: 'rien d’autre',
      },
      explanation: {
        en: 'Use it to say you do not need anything else.',
        fr: 'Utilise-le pour dire que tu n’as besoin de rien d’autre.',
      },
    },
    {
      id: 'convenience-store-run-vocab-4',
      hanzi: '一共',
      pinyin: 'yígòng',
      meaning: {
        en: 'altogether / in total',
        fr: 'au total',
      },
      explanation: {
        en: 'This word prepares the total price question.',
        fr: 'Ce mot prépare la question du prix total.',
      },
    },
    {
      id: 'convenience-store-run-vocab-5',
      hanzi: '多少钱',
      pinyin: 'duōshao qián',
      meaning: {
        en: 'how much money?',
        fr: 'combien d’argent ? / combien ça coûte ?',
      },
      explanation: {
        en: 'The key phrase for asking a simple price.',
        fr: 'La phrase clé pour demander un prix simple.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'convenience-store-run-pronunciation-1',
      focus: {
        en: 'Short checkout phrases',
        fr: 'Phrases courtes à la caisse',
      },
      tip: {
        en: 'Keep 一瓶水, 不要了, and 多少钱 short; each phrase can stand alone at checkout.',
        fr: 'Garde 一瓶水, 不要了 et 多少钱 courts ; chaque phrase fonctionne seule à la caisse.',
      },
      explanation: {
        en: 'This first store lesson favors clear survival phrases over a long shopping conversation.',
        fr: 'Cette première leçon de supérette privilégie des phrases de survie claires plutôt qu’une longue conversation.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'convenience-store-run-hanzi-1',
      hanzi: '水',
      pinyin: 'shuǐ',
      meaning: {
        en: 'water',
        fr: 'eau',
      },
      explanation: {
        en: 'Recognize 水 when buying a bottle of water.',
        fr: 'Reconnais 水 quand tu achètes une bouteille d’eau.',
      },
    },
    {
      id: 'convenience-store-run-hanzi-2',
      hanzi: '钱',
      pinyin: 'qián',
      meaning: {
        en: 'money',
        fr: 'argent',
      },
      explanation: {
        en: '钱 appears in the price question 多少钱.',
        fr: '钱 apparaît dans la question de prix 多少钱.',
      },
    },
    {
      id: 'convenience-store-run-hanzi-3',
      hanzi: '要',
      pinyin: 'yào',
      meaning: {
        en: 'want / need',
        fr: 'vouloir / avoir besoin',
      },
      explanation: {
        en: '要 appears in both 我要 and 不要了.',
        fr: '要 apparaît dans 我要 et 不要了.',
      },
    },
    {
      id: 'convenience-store-run-hanzi-4',
      hanzi: '瓶',
      pinyin: 'píng',
      meaning: {
        en: 'bottle',
        fr: 'bouteille',
      },
      explanation: {
        en: '瓶 is the measure word for a bottle in 一瓶水.',
        fr: '瓶 est le classificateur pour une bouteille dans 一瓶水.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'convenience-store-run-listening-1',
        prompt: {
          en: 'Listen for the phrase that means a bottle of water.',
          fr: 'Écoute la phrase qui signifie une bouteille d’eau.',
        },
        target: '一瓶水',
        explanation: {
          en: '一瓶水 is the item you are buying.',
          fr: '一瓶水 est l’article que tu achètes.',
        },
      },
    ],
    speaking: [
      {
        id: 'convenience-store-run-speaking-1',
        prompt: {
          en: 'Say you do not need anything else.',
          fr: 'Dis que tu n’as besoin de rien d’autre.',
        },
        target: '不要了。',
        explanation: {
          en: '不要了 answers the clerk’s “anything else?” question.',
          fr: '不要了 répond à la question « autre chose ? » de l’employé.',
        },
      },
    ],
    reading: [
      {
        id: 'convenience-store-run-reading-1',
        prompt: {
          en: 'Choose the phrase for asking the total price.',
          fr: 'Choisis la phrase pour demander le prix total.',
        },
        target: '一共多少钱？',
        explanation: {
          en: '一共多少钱？ asks how much the purchase costs altogether.',
          fr: '一共多少钱？ demande combien coûte l’achat au total.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'convenience-store-run-review-1',
      front: '一瓶水',
      back: {
        en: 'a bottle of water',
        fr: 'une bouteille d’eau',
      },
      explanation: {
        en: 'A practical first convenience store item.',
        fr: 'Un premier article pratique en supérette.',
      },
    },
    {
      id: 'convenience-store-run-review-2',
      front: '多少钱',
      back: {
        en: 'how much money?',
        fr: 'combien ça coûte ?',
      },
      explanation: {
        en: 'Use this to ask a simple price.',
        fr: 'Utilise cette phrase pour demander un prix simple.',
      },
    },
    {
      id: 'convenience-store-run-review-3',
      front: '不要了',
      back: {
        en: 'no more / nothing else',
        fr: 'rien d’autre',
      },
      explanation: {
        en: 'A short response when the clerk asks if you want anything else.',
        fr: 'Une réponse courte quand l’employé demande si tu veux autre chose.',
      },
    },
  ],
  shortInput: {
    id: 'convenience-store-run-short-input-01',
    prompt: {
      en: 'You want to buy a bottle of water.',
      fr: 'Tu veux acheter une bouteille d’eau.',
    },
    target: '我要一瓶水。',
    explanation: {
      en: 'Use 我要一瓶水。 to ask for one simple item.',
      fr: 'Utilise 我要一瓶水。 pour demander un article simple.',
    },
    audio: '/audio/convenience-store-run/short-input-01.mp3',
  },
}
