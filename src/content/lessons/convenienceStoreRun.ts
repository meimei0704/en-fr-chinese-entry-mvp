import type { LessonContent } from '../types.js'

export const convenienceStoreRunLesson: LessonContent = {
  id: 'convenience-store-run',
  title: {
    en: '购物 / Shopping',
    fr: '购物 / Shopping',
  },
  scenario: {
    en: 'Phrases to navigate stores, check prices, bargain and pay smoothly.',
    fr: 'Des phrases pour se repérer en magasin, vérifier les prix, négocier et payer facilement.',
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
        hanzi: '你好，我要一瓶水和一包薯片。',
        pinyin: 'Nǐ hǎo, wǒ yào yì píng shuǐ hé yì bāo shǔpiàn.',
        translation: {
          en: 'Hello, I want a bottle of water and a bag of chips.',
          fr: 'Bonjour, je voudrais une bouteille d\'eau et un paquet de chips.',
        },
        explanation: {
          en: '我要...和... combines two items with 和 in one short sentence.',
          fr: '我要...和... combine deux articles avec 和 dans une phrase courte.',
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
          fr: 'D\'accord, vous voulez autre chose ?',
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
          fr: 'Rien d\'autre, ça fait combien au total ?',
        },
        explanation: {
          en: '不要了 closes the shopping list, and 一共多少钱 asks the total price.',
          fr: '不要了 ferme la liste d\'achats, et 一共多少钱 demande le prix total.',
        },
        audio: '/audio/convenience-store-run/line-03.mp3',
      },
      {
        id: 'convenience-store-run-line-04',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '九块钱。',
        pinyin: 'Jiǔ kuài qián.',
        translation: {
          en: 'Nine yuan.',
          fr: 'Neuf yuans.',
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
      {
        id: 'convenience-store-run-line-06',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '可以，扫码这里。',
        pinyin: 'Kěyǐ, sǎomǎ zhèlǐ.',
        translation: {
          en: 'Yes, scan here.',
          fr: 'Oui, scannez ici.',
        },
        explanation: {
          en: '扫码这里 points to the QR code on the counter or screen.',
          fr: '扫码这里 indique le code QR sur le comptoir ou l\'écran.',
        },
        audio: '/audio/convenience-store-run/line-06.mp3',
      },
      {
        id: 'convenience-store-run-line-07',
        speaker: { en: 'Customer', fr: 'Client' },
        hanzi: '有袋子吗？',
        pinyin: 'Yǒu dàizi ma?',
        translation: {
          en: 'Do you have a bag?',
          fr: 'Avez-vous un sac ?',
        },
        explanation: {
          en: 'Ask 有袋子吗？ if you need a plastic bag for your items.',
          fr: 'Demande 有袋子吗？ si tu as besoin d\'un sac plastique pour tes articles.',
        },
        audio: '/audio/convenience-store-run/line-07.mp3',
      },
      {
        id: 'convenience-store-run-line-08',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '有，两毛钱。',
        pinyin: 'Yǒu, liǎng máo qián.',
        translation: {
          en: 'Yes, twenty cents.',
          fr: 'Oui, vingt centimes.',
        },
        explanation: {
          en: 'Bags in some Chinese stores cost a small extra fee.',
          fr: 'Les sacs dans certains magasins chinois coûtent un petit supplément.',
        },
        audio: '/audio/convenience-store-run/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'convenience-store-run-pattern-1',
      pattern: '……多少钱?',
      meaning: {
        en: 'How much is this?',
        fr: 'C\'est combien ?',
      },
      example: '这个多少钱?',
      audio: '/audio/convenience-store-run/pattern-01.mp3',
      explanation: {
        en: 'Point at an item and ask 这个多少钱 to check the price.',
        fr: 'Montre un article et demande 这个多少钱 pour vérifier le prix.',
      },
    },
    {
      id: 'convenience-store-run-pattern-2',
      pattern: '太……了。',
      meaning: {
        en: 'It\'s too ...',
        fr: 'C\'est trop ...',
      },
      example: '太贵了。',
      audio: '/audio/convenience-store-run/pattern-02.mp3',
      explanation: {
        en: '太贵了 tells the seller the price feels too high.',
        fr: '太贵了 dit au vendeur que le prix est trop élevé.',
      },
    },
    {
      id: 'convenience-store-run-pattern-3',
      pattern: '可以……吗?',
      meaning: {
        en: 'Can you ...?',
        fr: 'Pouvez-vous ... ?',
      },
      example: '可以便宜一点吗?',
      audio: '/audio/convenience-store-run/pattern-03.mp3',
      explanation: {
        en: 'Use 可以…吗 to ask politely for a lower price or other help.',
        fr: 'Utilise 可以…吗 pour demander poliment un prix plus bas ou de l\'aide.',
      },
    },
    {
      id: 'convenience-store-run-pattern-4',
      pattern: '我买这个。',
      meaning: { en: 'I will buy this.', fr: 'Je prends ceci.' },
      example: '我买这个。',
      audio: '/audio/convenience-store-run/pattern-04.mp3',
      explanation: {
        en: 'Say 我买这个 to confirm the item you want.',
        fr: 'Dis 我买这个 pour confirmer l\'article que tu veux.',
      },
    },
    {
      id: 'convenience-store-run-pattern-5',
      pattern: '有……吗?',
      meaning: { en: 'Do you have ...?', fr: 'Avez-vous ... ?' },
      example: '有袋子吗?',
      audio: '/audio/convenience-store-run/pattern-05.mp3',
      explanation: {
        en: 'Use 有…吗 to check if an item or service is available.',
        fr: 'Utilise 有…吗 pour vérifier si un article ou un service est disponible.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'convenience-store-run-vocab-1',
      hanzi: '一瓶水',
      pinyin: 'yì píng shuǐ',
      audio: '/audio/convenience-store-run/vocab-01.mp3',
      meaning: {
        en: 'a bottle of water',
        fr: 'une bouteille d\'eau',
      },
      explanation: {
        en: 'A useful first purchase item after arriving.',
        fr: 'Un premier achat utile après l\'arrivée.',
      },
    },
    {
      id: 'convenience-store-run-vocab-2',
      hanzi: '还要别的吗',
      pinyin: 'hái yào bié de ma',
      audio: '/audio/convenience-store-run/vocab-02.mp3',
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
      audio: '/audio/convenience-store-run/vocab-03.mp3',
      meaning: {
        en: 'no more / nothing else',
        fr: 'rien d\'autre',
      },
      explanation: {
        en: 'Use it to say you do not need anything else.',
        fr: 'Utilise-le pour dire que tu n\'as besoin de rien d\'autre.',
      },
    },
    {
      id: 'convenience-store-run-vocab-4',
      hanzi: '一共',
      pinyin: 'yígòng',
      audio: '/audio/convenience-store-run/vocab-04.mp3',
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
      audio: '/audio/convenience-store-run/vocab-05.mp3',
      meaning: {
        en: 'how much money?',
        fr: 'combien d\'argent ? / combien ça coûte ?',
      },
      explanation: {
        en: 'The key phrase for asking a simple price.',
        fr: 'La phrase clé pour demander un prix simple.',
      },
    },
    { id: 'convenience-store-run-vocab-6', hanzi: '薯片', pinyin: 'shǔpiàn', audio: '/audio/convenience-store-run/vocab-06.mp3', meaning: { en: 'potato chips', fr: 'chips' }, explanation: { en: 'A common snack to buy in convenience stores.', fr: 'Un snack courant à acheter en supérette.' } },
    { id: 'convenience-store-run-vocab-7', hanzi: '袋子', pinyin: 'dàizi', audio: '/audio/convenience-store-run/vocab-07.mp3', meaning: { en: 'bag', fr: 'sac' }, explanation: { en: 'Ask for a 袋子 if you need something to carry your items.', fr: 'Demande un 袋子 si tu as besoin de porter tes articles.' } },
    { id: 'convenience-store-run-vocab-8', hanzi: '扫码', pinyin: 'sǎomǎ', audio: '/audio/convenience-store-run/vocab-08.mp3', meaning: { en: 'scan code / scan to pay', fr: 'scanner le code / scanner pour payer' }, explanation: { en: 'The clerk points to the QR code and says this.', fr: 'L\'employé montre le code QR et dit ceci.' } },
    { id: 'convenience-store-run-vocab-9', hanzi: '毛', pinyin: 'máo', audio: '/audio/convenience-store-run/vocab-09.mp3', meaning: { en: 'dime / one-tenth of a yuan', fr: 'dixième de yuan' }, explanation: { en: '毛 is the smaller unit when a price is under one yuan.', fr: '毛 est la petite unité quand un prix est inférieur à un yuan.' } },
    { id: 'convenience-store-run-vocab-10', hanzi: '小票', pinyin: 'xiǎopiào', audio: '/audio/convenience-store-run/vocab-10.mp3', meaning: { en: 'receipt', fr: 'ticket de caisse' }, explanation: { en: 'The small receipt you get after paying at a store.', fr: 'Le petit reçu que tu obtiens après avoir payé en magasin.' } },
  ],
  practice: {
    listening: [
      {
        id: 'convenience-store-run-listening-1',
        prompt: {
          en: 'Listen for the phrase that means a bottle of water.',
          fr: 'Écoute la phrase qui signifie une bouteille d\'eau.',
        },
        target: '一瓶水',
        audio: '/audio/convenience-store-run/practice-listening-01.mp3',
        explanation: {
          en: '一瓶水 is the item you are buying.',
          fr: '一瓶水 est l\'article que tu achètes.',
        },
      },
      { id: 'convenience-store-run-listening-2', prompt: { en: 'Which phrase asks for a bag?', fr: 'Quelle phrase demande un sac ?' }, target: '有袋子吗？', audio: '/audio/convenience-store-run/practice-listening-02.mp3', explanation: { en: '有袋子吗 checks if the store provides bags.', fr: '有袋子吗 vérifie si le magasin fournit des sacs.' } },
    ],
    speaking: [
      {
        id: 'convenience-store-run-speaking-1',
        prompt: {
          en: 'Say you do not need anything else.',
          fr: 'Dis que tu n\'as besoin de rien d\'autre.',
        },
        target: '不要了。',
        audio: '/audio/convenience-store-run/practice-speaking-01.mp3',
        explanation: {
          en: '不要了 answers the clerk\'s "anything else?" question.',
          fr: '不要了 répond à la question « autre chose ? » de l\'employé.',
        },
      },
      { id: 'convenience-store-run-speaking-2', prompt: { en: 'Ask if they have a bag.', fr: 'Demande s\'ils ont un sac.' }, target: '有袋子吗？', audio: '/audio/convenience-store-run/practice-speaking-02.mp3', explanation: { en: 'A short practical question when buying several items.', fr: 'Une question pratique et courte quand on achète plusieurs articles.' } },
    ],
    reading: [
      {
        id: 'convenience-store-run-reading-1',
        prompt: {
          en: 'Choose the phrase for asking the total price.',
          fr: 'Choisis la phrase pour demander le prix total.',
        },
        target: '一共多少钱？',
        audio: '/audio/convenience-store-run/practice-reading-01.mp3',
        explanation: {
          en: '一共多少钱？ asks how much the purchase costs altogether.',
          fr: '一共多少钱？ demande combien coûte l\'achat au total.',
        },
      },
      { id: 'convenience-store-run-reading-2', prompt: { en: 'Match the word for potato chips.', fr: 'Associe le mot pour chips.' }, target: '薯片', audio: '/audio/convenience-store-run/practice-reading-02.mp3', explanation: { en: '薯片 is a common snack you will see on shelves.', fr: '薯片 est un snack courant que tu verras dans les rayons.' } },
    ],
  },
  reviewCards: [
    {
      id: 'convenience-store-run-review-1',
      front: '一瓶水',
      back: {
        en: 'a bottle of water',
        fr: 'une bouteille d\'eau',
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
        fr: 'rien d\'autre',
      },
      explanation: {
        en: 'A short response when the clerk asks if you want anything else.',
        fr: 'Une réponse courte quand l\'employé demande si tu veux autre chose.',
      },
    },
    { id: 'convenience-store-run-review-4', front: '薯片', back: { en: 'potato chips', fr: 'chips' }, explanation: { en: 'A snack to grab at any convenience store.', fr: 'Un snack à prendre dans n\'importe quelle supérette.' } },
    { id: 'convenience-store-run-review-5', front: '袋子', back: { en: 'bag', fr: 'sac' }, explanation: { en: 'Ask for this when you buy several items.', fr: 'Demande ceci quand tu achètes plusieurs articles.' } },
    { id: 'convenience-store-run-review-6', front: '扫码', back: { en: 'scan to pay', fr: 'scanner pour payer' }, explanation: { en: 'The payment action at the counter.', fr: 'L\'action de paiement au comptoir.' } },
  ],
}
