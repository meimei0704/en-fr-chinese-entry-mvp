import type { LessonContent } from '../types.js'

export const metroTicketLesson: LessonContent = {
  id: 'metro-ticket',
  title: {
    en: '坐地铁 / Subway ride',
    fr: '坐地铁 / En métro',
  },
  scenario: {
    en: 'Buy a ticket, make a transit, ask for help, go in the right direction and find the right exit.',
    fr: 'Acheter un ticket, faire une correspondance, demander de l\'aide, aller dans la bonne direction et trouver la bonne sortie.',
  },
  dialogue: {
    title: {
      en: 'Ask for a route and ticket',
      fr: 'Demander un itinéraire et un ticket',
    },
    lines: [
      {
        id: 'metro-ticket-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请问地铁站在哪里？',
        pinyin: 'Qǐng wèn dì tiě zhàn zài nǎ lǐ?',
        translation: { en: 'Excuse me, where is the subway station?', fr: 'Excusez-moi, où est la station de métro ?' },
        explanation: { en: 'Ask 在哪里 to find the metro station or a place.', fr: 'Demande 在哪里 pour trouver la station de métro ou un lieu.' },
        audio: '/audio/metro-ticket/line-01.mp3',
      },
      {
        id: 'metro-ticket-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '在哪儿买票？',
        pinyin: 'Zài nǎ ér mǎi piào?',
        translation: { en: 'Where can I buy a ticket?', fr: 'Où puis-je acheter un ticket ?' },
        explanation: { en: 'Ask 在哪儿买票 to find where to buy a metro ticket.', fr: 'Demande 在哪儿买票 pour trouver où acheter un ticket de métro.' },
        audio: '/audio/metro-ticket/line-02.mp3',
      },
      {
        id: 'metro-ticket-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '您好，我要一张票。',
        pinyin: 'Nín hǎo, wǒ yào yì zhāng piào.',
        translation: { en: 'Hello, I want to buy a ticket.', fr: 'Bonjour, je voudrais un ticket.' },
        explanation: { en: 'Ask 我要一张票 to buy a single metro ticket.', fr: 'Demande 我要一张票 pour acheter un ticket de métro.' },
        audio: '/audio/metro-ticket/line-03.mp3',
      },
      {
        id: 'metro-ticket-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我要去天安门广场。',
        pinyin: 'Wǒ yào qù Tiān ān mén Guǎng chǎng.',
        translation: { en: 'To Tiananmen Square, please.', fr: 'Je veux aller à la place Tiananmen.' },
        explanation: { en: 'Name your destination with 我要去 to tell the ticket seller.', fr: 'Nomme ta destination avec 我要去 pour la dire au vendeur de tickets.' },
        audio: '/audio/metro-ticket/line-04.mp3',
      },
      {
        id: 'metro-ticket-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '自动售票机怎么用？',
        pinyin: 'Zì dòng shòu piào jī zěn me yòng?',
        translation: { en: 'Could you show me how to use the ticket vending machine?', fr: 'Comment utiliser le distributeur de billets ?' },
        explanation: { en: 'Ask 怎么用 when you need help using a machine.', fr: 'Demande 怎么用 quand tu as besoin d\'aide pour utiliser une machine.' },
        audio: '/audio/metro-ticket/line-05.mp3',
      },
      {
        id: 'metro-ticket-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请问在哪儿换乘？',
        pinyin: 'Qǐng wèn zài nǎ ér huàn chéng?',
        translation: { en: 'Where do I make a transfer?', fr: 'Où faire une correspondance ?' },
        explanation: { en: 'Ask 在哪儿换乘 to find the transfer point.', fr: 'Demande 在哪儿换乘 pour trouver le point de correspondance.' },
        audio: '/audio/metro-ticket/line-06.mp3',
      },
      {
        id: 'metro-ticket-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我要去这里。',
        pinyin: 'Wǒ yào qù zhè lǐ.',
        translation: { en: 'I want to go to this place.', fr: 'Je veux aller à cet endroit.' },
        explanation: { en: 'Point at a map and say 我要去这里 to show your destination.', fr: 'Montre une carte et dis 我要去这里 pour indiquer ta destination.' },
        audio: '/audio/metro-ticket/line-07.mp3',
      },
      {
        id: 'metro-ticket-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '是这个方向吗？',
        pinyin: 'Shì zhè ge fāng xiàng ma?',
        translation: { en: 'Is this the right direction?', fr: 'Est-ce la bonne direction ?' },
        explanation: { en: 'Confirm you are going the right way with 是这个方向吗.', fr: 'Confirme que tu vas dans le bon sens avec 是这个方向吗.' },
        audio: '/audio/metro-ticket/line-08.mp3',
      },
      {
        id: 'metro-ticket-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请问，哪个出口去？',
        pinyin: 'Qǐng wèn, nǎ gè chū kǒu qù?',
        translation: { en: 'Which exit should I take?', fr: 'Excusez-moi, quelle sortie dois-je prendre ?' },
        explanation: { en: 'Ask 哪个出口去 to find the right exit for your destination.', fr: 'Demande 哪个出口去 pour trouver la bonne sortie vers ta destination.' },
        audio: '/audio/metro-ticket/line-09.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'metro-ticket-pattern-1',
      pattern: '……在哪里？',
      pinyin: '... zài nǎ lǐ?',
      meaning: {
        en: 'Excuse me, where is ...?',
        fr: 'Où est ... ?',
      },
      audio: '/audio/metro-ticket/pattern-01.mp3',
      examples: [
        {
          fill: '地铁站',
          fillPinyin: 'dìtiě zhàn',
          hanzi: '地铁站在哪里？',
          pinyin: 'Dì tiě zhàn zài nǎ lǐ?',
          en: 'metro station',
          fr: 'station de métro',
        },
        {
          fill: '售票处',
          fillPinyin: 'shòupiàochù',
          hanzi: '售票处在哪里？',
          pinyin: 'Shòu piào chù zài nǎ lǐ?',
          en: 'ticket office',
          fr: 'guichet',
        },
        {
          fill: '卫生间',
          fillPinyin: 'wèishēngjiān',
          hanzi: '卫生间在哪里？',
          pinyin: 'Wèi shēng jiān zài nǎ lǐ?',
          en: 'toilet',
          fr: 'toilettes',
        },
      ],
    },
    {
      id: 'metro-ticket-pattern-2',
      pattern: '我要去……。',
      pinyin: 'Wǒ yào qù ... .',
      meaning: {
        en: 'I want to go to ...',
        fr: 'Je veux aller à ...',
      },
      audio: '/audio/metro-ticket/pattern-02.mp3',
      examples: [
        {
          fill: '天安门广场',
          fillPinyin: 'Tiān\'ānmén Guǎngchǎng',
          hanzi: '我要去天安门广场。',
          pinyin: 'Wǒ yào qù Tiān ān mén Guǎng chǎng.',
          en: 'Tiananmen Square',
          fr: 'place Tiananmen',
        },
        {
          fill: '王府井',
          fillPinyin: 'Wángfǔjǐng',
          hanzi: '我要去王府井。',
          pinyin: 'Wǒ yào qù Wáng fǔ jǐng.',
          en: 'Wangfujing',
          fr: 'Wangfujing',
        },
        {
          fill: '三里屯',
          fillPinyin: 'Sānlǐtún',
          hanzi: '我要去三里屯。',
          pinyin: 'Wǒ yào qù Sān lǐ tún.',
          en: 'Sanlitun',
          fr: 'Sanlitun',
        },
      ],
    },
    {
      id: 'metro-ticket-pattern-3',
      pattern: '……怎么用？',
      pinyin: '... zěn me yòng?',
      meaning: {
        en: 'Could you show me how to use ...?',
        fr: 'Comment utiliser ... ?',
      },
      audio: '/audio/metro-ticket/pattern-03.mp3',
      examples: [
        {
          fill: '自动售票机',
          fillPinyin: 'zìdòng shòupiàojī',
          hanzi: '自动售票机怎么用？',
          pinyin: 'Zì dòng shòu piào jī zěn me yòng?',
          en: 'ticket vending machine',
          fr: 'distributeur de tickets',
        },
        {
          fill: '公交卡',
          fillPinyin: 'gōngjiāo kǎ',
          hanzi: '公交卡怎么用？',
          pinyin: 'Gōng jiāo kǎ zěn me yòng?',
          en: 'transit card',
          fr: 'carte de transport',
        },
        {
          fill: '共享单车',
          fillPinyin: 'gòngxiǎng dānchē',
          hanzi: '共享单车怎么用？',
          pinyin: 'Gòng xiǎng dān chē zěn me yòng?',
          en: 'shared bike',
          fr: 'vélo partagé',
        },
      ],
    },
    {
      id: 'metro-ticket-pattern-4',
      pattern: '在哪儿换乘？',
      pinyin: 'Zài nǎr huàn chéng?',
      meaning: {
        en: 'Where do I make a transfer?',
        fr: 'Où fait-on la correspondance ?',
      },
      audio: '/audio/metro-ticket/pattern-04.mp3',
    },
    {
      id: 'metro-ticket-pattern-5',
      pattern: '是这个方向吗？',
      pinyin: 'Shì zhè ge fāng xiàng ma?',
      meaning: {
        en: 'Is this the right direction?',
        fr: 'Est-ce la bonne direction ?',
      },
      audio: '/audio/metro-ticket/pattern-05.mp3',
    },
    {
      id: 'metro-ticket-pattern-6',
      pattern: '在哪儿买票？',
      pinyin: 'Zài nǎr mǎi piào?',
      meaning: {
        en: 'Where can I buy a ticket?',
        fr: 'Où puis-je acheter un ticket ?',
      },
    },
    {
      id: 'metro-ticket-pattern-7',
      pattern: '您好，我要一张票。',
      pinyin: 'Nín hǎo, wǒ yào yì zhāng piào.',
      meaning: {
        en: 'Hello, I want to buy a ticket.',
        fr: 'Bonjour, je voudrais un ticket.',
      },
    },
    {
      id: 'metro-ticket-pattern-8',
      pattern: '我要去这里。',
      pinyin: 'Wǒ yào qù zhè lǐ.',
      meaning: {
        en: 'I want to go to this place.',
        fr: 'Je veux aller à cet endroit.',
      },
    },
    {
      id: 'metro-ticket-pattern-9',
      pattern: '请问，哪个出口去？',
      pinyin: 'Qǐng wèn, nǎ ge chū kǒu qù?',
      meaning: {
        en: 'Excuse me, which exit should I take?',
        fr: 'Excusez-moi, quelle sortie dois-je prendre ?',
      },
    },
  ],
  vocabulary: [
    {
      id: 'metro-ticket-vocab-1',
      hanzi: '地铁',
      pinyin: 'dì tiě',
      audio: '/audio/metro-ticket/vocab-01.mp3',
      meaning: {
        en: 'metro / subway',
        fr: 'métro',
      },
      explanation: {
        en: 'The transportation system for this lesson.',
        fr: 'Le moyen de transport de cette leçon.',
      },
    },
    {
      id: 'metro-ticket-vocab-2',
      hanzi: '票',
      pinyin: 'piào',
      audio: '/audio/metro-ticket/vocab-02.mp3',
      meaning: {
        en: 'ticket',
        fr: 'ticket / billet',
      },
      explanation: {
        en: 'A shared word for metro and train tickets.',
        fr: 'Un mot commun pour les tickets de métro et billets de train.',
      },
    },
    {
      id: 'metro-ticket-vocab-3',
      hanzi: '站',
      pinyin: 'zhàn',
      audio: '/audio/metro-ticket/vocab-03.mp3',
      meaning: {
        en: 'stop / station',
        fr: 'station / arrêt',
      },
      explanation: {
        en: 'Count stops with a number plus 站.',
        fr: 'Compte les stations avec un nombre suivi de 站.',
      },
    },
    {
      id: 'metro-ticket-vocab-4',
      hanzi: '二号线',
      pinyin: 'èr hào xiàn',
      audio: '/audio/metro-ticket/vocab-04.mp3',
      meaning: {
        en: 'Line 2',
        fr: 'ligne 2',
      },
      explanation: {
        en: 'A model phrase for numbered metro lines.',
        fr: 'Une phrase modèle pour les lignes de métro numérotées.',
      },
    },
    {
      id: 'metro-ticket-vocab-5',
      hanzi: '换乘',
      pinyin: 'huàn chéng',
      audio: '/audio/metro-ticket/vocab-05.mp3',
      meaning: {
        en: 'transfer',
        fr: 'correspondance',
      },
      explanation: {
        en: 'Recognize it on signs even if this first route stays simple.',
        fr: 'Reconnais-le sur les panneaux même si ce premier trajet reste simple.',
      },
    },
    { id: 'metro-ticket-vocab-6', hanzi: '出口', pinyin: 'chū kǒu', audio: '/audio/metro-ticket/vocab-06.mp3', meaning: { en: 'exit', fr: 'sortie' }, explanation: { en: 'Look for 出口 signs to leave the station.', fr: 'Cherche les panneaux 出口 pour sortir de la station.' } },
    { id: 'metro-ticket-vocab-7', hanzi: '公交卡', pinyin: 'gōng jiāo kǎ', audio: '/audio/metro-ticket/vocab-07.mp3', meaning: { en: 'transit card', fr: 'carte de transport' }, explanation: { en: 'A rechargeable card for bus and metro rides.', fr: 'Une carte rechargeable pour les trajets en bus et métro.' } },
    { id: 'metro-ticket-vocab-8', hanzi: '一张', pinyin: 'yì zhāng', audio: '/audio/metro-ticket/vocab-08.mp3', meaning: { en: 'one (for flat items like tickets)', fr: 'un (pour les objets plats comme les tickets)' }, explanation: { en: 'Use 张 for tickets, paper, and flat objects.', fr: 'Utilise 张 pour les tickets, le papier et les objets plats.' } },
    { id: 'metro-ticket-vocab-9', hanzi: '充值', pinyin: 'chōng zhí', audio: '/audio/metro-ticket/vocab-09.mp3', meaning: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'Use 充值 to add money to your transit card.', fr: 'Utilise 充值 pour ajouter de l\'argent à ta carte de transport.' } },
    { id: 'metro-ticket-vocab-10', hanzi: '方向', pinyin: 'fāng xiàng', audio: '/audio/metro-ticket/vocab-10.mp3', meaning: { en: 'direction', fr: 'direction' }, explanation: { en: 'Check 方向 on metro signs to know which platform to take.', fr: 'Vérifie 方向 sur les panneaux de métro pour savoir quel quai prendre.' } },
    { id: 'metro-ticket-vocab-11', hanzi: '入口', pinyin: 'rù kǒu', audio: '/audio/metro-ticket/vocab-11.mp3', meaning: { en: 'entrance', fr: 'entrée' }, explanation: { en: 'The entrance you use to go into the metro station.', fr: 'L\'entrée que tu utilises pour entrer dans la station de métro.' } },
    { id: 'metro-ticket-vocab-12', hanzi: '自动售票机', pinyin: 'zì dòng shòu piào jī', audio: '/audio/metro-ticket/vocab-12.mp3', meaning: { en: 'ticket vending machine', fr: 'distributeur de tickets' }, explanation: { en: 'A machine where you buy your metro ticket.', fr: 'Une machine où tu achètes ton ticket de métro.' } },
    { id: 'metro-ticket-vocab-13', hanzi: '上车', pinyin: 'shàng chē', audio: '/audio/metro-ticket/vocab-13.mp3', meaning: { en: 'get on the train', fr: 'monter dans le train' }, explanation: { en: 'The action of boarding the train or metro.', fr: 'L\'action de monter dans le train ou le métro.' } },
    { id: 'metro-ticket-vocab-14', hanzi: '下车', pinyin: 'xià chē', audio: '/audio/metro-ticket/vocab-14.mp3', meaning: { en: 'get off the train', fr: 'descendre du train' }, explanation: { en: 'The action of getting off at your stop.', fr: 'L\'action de descendre à ton arrêt.' } },
  ],
  practice: {
    listening: [
      {
        id: 'metro-ticket-listening-1',
        prompt: {
          en: 'Listen for the metro ticket to People\'s Square.',
          fr: 'Écoute le ticket de métro pour la Place du Peuple.',
        },
        target: '我要一张去人民广场的票。',
        audio: '/audio/metro-ticket/practice-listening-01.mp3',
        explanation: {
          en: 'The destination sits between 去 and 的票.',
          fr: 'La destination se place entre 去 et 的票.',
        },
      },
      { id: 'metro-ticket-listening-2', prompt: { en: 'Which phrase asks about a transfer?', fr: 'Quelle phrase demande une correspondance ?' }, target: '需要换乘吗？', audio: '/audio/metro-ticket/practice-listening-02.mp3', explanation: { en: '需要换乘吗 confirms if you need to change lines.', fr: '需要换乘吗 confirme si tu dois changer de ligne.' } },
    ],
    speaking: [
      {
        id: 'metro-ticket-speaking-1',
        prompt: {
          en: 'Ask how to get to People\'s Square.',
          fr: 'Demande comment aller à la Place du Peuple.',
        },
        target: '去人民广场怎么走？',
        audio: '/audio/metro-ticket/practice-speaking-01.mp3',
        explanation: {
          en: 'This is the route question before the ticket request.',
          fr: 'C\'est la question d\'itinéraire avant la demande de ticket.',
        },
      },
      { id: 'metro-ticket-speaking-2', prompt: { en: 'Ask which exit to take.', fr: 'Demande quelle sortie prendre.' }, target: '哪个出口出去？', audio: '/audio/metro-ticket/practice-speaking-02.mp3', explanation: { en: 'Ask this when you arrive at the destination station.', fr: 'Demande ceci en arrivant à la station de destination.' } },
    ],
    reading: [
      {
        id: 'metro-ticket-reading-1',
        prompt: {
          en: 'Read the short stop-count question.',
          fr: 'Lis la question courte sur le nombre de stations.',
        },
        target: '要几站？',
        audio: '/audio/metro-ticket/practice-reading-01.mp3',
        explanation: {
          en: 'This phrase helps you track how far the ride is.',
          fr: 'Cette phrase aide à suivre la distance du trajet.',
        },
      },
      { id: 'metro-ticket-reading-2', prompt: { en: 'Match the word for transit card.', fr: 'Associe le mot pour carte de transport.' }, target: '公交卡', audio: '/audio/metro-ticket/practice-reading-02.mp3', explanation: { en: '公交卡 is a reusable card for buses and metro.', fr: '公交卡 est une carte réutilisable pour les bus et le métro.' } },
    ],
  },
  reviewCards: [
    {
      id: 'metro-ticket-review-1',
      front: '地铁',
      back: {
        en: 'metro / subway',
        fr: 'métro',
      },
      explanation: {
        en: 'The transport word for the lesson.',
        fr: 'Le mot de transport de la leçon.',
      },
    },
    {
      id: 'metro-ticket-review-2',
      front: '二号线',
      back: {
        en: 'Line 2',
        fr: 'ligne 2',
      },
      explanation: {
        en: 'A model for numbered metro lines.',
        fr: 'Un modèle pour les lignes de métro numérotées.',
      },
    },
    {
      id: 'metro-ticket-review-3',
      front: '要几站？',
      back: {
        en: 'How many stops?',
        fr: 'Combien de stations ?',
      },
      explanation: {
        en: 'Ask this after hearing the line.',
        fr: 'Demande cela après avoir entendu la ligne.',
      },
    },
    { id: 'metro-ticket-review-4', front: '换乘', back: { en: 'transfer', fr: 'correspondance' }, explanation: { en: 'Look for this on signs when changing lines.', fr: 'Cherche ceci sur les panneaux en changeant de ligne.' } },
    { id: 'metro-ticket-review-5', front: '出口', back: { en: 'exit', fr: 'sortie' }, explanation: { en: 'Follow this sign to leave the station.', fr: 'Suis ce panneau pour quitter la station.' } },
    { id: 'metro-ticket-review-6', front: '公交卡', back: { en: 'transit card', fr: 'carte de transport' }, explanation: { en: 'A card for bus and metro rides.', fr: 'Une carte pour les trajets en bus et métro.' } },
  ],
}
