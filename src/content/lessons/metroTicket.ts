import type { LessonContent } from '../types.js'

export const metroTicketLesson: LessonContent = {
  id: 'metro-ticket',
  title: {
    en: 'Buy a metro ticket',
    fr: 'Acheter un ticket de métro',
  },
  scenario: {
    en: 'Ask how to get to People\'s Square, confirm line two, buy one metro ticket, ask how many stops, check for a transfer, ask the price, and confirm the exit.',
    fr: 'Demander comment aller à la Place du Peuple, confirmer la ligne 2, acheter un ticket de métro, demander le nombre de stations, vérifier une correspondance, demander le prix et confirmer la sortie.',
  },
  dialogue: {
    title: {
      en: 'Ask for a route and ticket',
      fr: 'Demander un itinéraire et un ticket',
    },
    lines: [
      {
        id: 'metro-ticket-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '去人民广场怎么走？',
        pinyin: 'Qù Rénmín Guǎngchǎng zěnme zǒu?',
        translation: {
          en: 'How do I get to People\'s Square?',
          fr: 'Comment aller à la Place du Peuple ?',
        },
        explanation: {
          en: '去……怎么走 is the basic route question for a station or place.',
          fr: '去……怎么走 est la question de base pour demander un itinéraire vers une station ou un lieu.',
        },
        audio: '/audio/metro-ticket/line-01.mp3',
      },
      {
        id: 'metro-ticket-line-02',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '坐二号线。',
        pinyin: 'Zuò èr hào xiàn.',
        translation: {
          en: 'Take line two.',
          fr: 'Prenez la ligne 2.',
        },
        explanation: {
          en: '号线 names the numbered metro line.',
          fr: '号线 indique la ligne de métro numérotée.',
        },
        audio: '/audio/metro-ticket/line-02.mp3',
      },
      {
        id: 'metro-ticket-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我要一张去人民广场的票。',
        pinyin: 'Wǒ yào yì zhāng qù Rénmín Guǎngchǎng de piào.',
        translation: {
          en: 'I want one ticket to People\'s Square.',
          fr: 'Je voudrais un ticket pour la Place du Peuple.',
        },
        explanation: {
          en: '一张 is the measure word for one ticket.',
          fr: '一张 est le classificateur pour un ticket.',
        },
        audio: '/audio/metro-ticket/line-03.mp3',
      },
      {
        id: 'metro-ticket-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '要几站？',
        pinyin: 'Yào jǐ zhàn?',
        translation: {
          en: 'How many stops does it take?',
          fr: 'Combien de stations faut-il ?',
        },
        explanation: {
          en: '要几站 is short and useful when you are counting stops.',
          fr: '要几站 est court et utile pour compter les stations.',
        },
        audio: '/audio/metro-ticket/line-04.mp3',
      },
      {
        id: 'metro-ticket-line-05',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '三站。',
        pinyin: 'Sān zhàn.',
        translation: {
          en: 'Three stops.',
          fr: 'Trois stations.',
        },
        explanation: {
          en: 'Listen for a number plus 站 when someone answers.',
          fr: 'Écoute un nombre suivi de 站 quand quelqu\'un répond.',
        },
        audio: '/audio/metro-ticket/line-05.mp3',
      },
      {
        id: 'metro-ticket-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '需要换乘吗？',
        pinyin: 'Xūyào huànchéng ma?',
        translation: {
          en: 'Do I need to transfer?',
          fr: 'Dois-je faire une correspondance ?',
        },
        explanation: {
          en: 'Ask 需要换乘吗 to confirm if the route needs a transfer.',
          fr: 'Demande 需要换乘吗 pour confirmer si le trajet nécessite une correspondance.',
        },
        audio: '/audio/metro-ticket/line-06.mp3',
      },
      {
        id: 'metro-ticket-line-07',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '不需要，一共三块钱。',
        pinyin: 'Bù xūyào, yígòng sān kuài qián.',
        translation: {
          en: 'No transfer needed, three yuan in total.',
          fr: 'Pas de correspondance, trois yuans au total.',
        },
        explanation: {
          en: 'The clerk confirms no transfer and gives the fare price.',
          fr: 'L\'employé confirme qu\'il n\'y a pas de correspondance et donne le prix.',
        },
        audio: '/audio/metro-ticket/line-07.mp3',
      },
      {
        id: 'metro-ticket-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '哪个出口出去？',
        pinyin: 'Nǎge chūkǒu chūqù?',
        translation: {
          en: 'Which exit should I take?',
          fr: 'Quelle sortie dois-je prendre ?',
        },
        explanation: {
          en: 'Ask 哪个出口 when you arrive and need the right exit for your destination.',
          fr: 'Demande 哪个出口 à l\'arrivée pour trouver la bonne sortie vers ta destination.',
        },
        audio: '/audio/metro-ticket/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'metro-ticket-pattern-1',
      pattern: '去……怎么走？',
      meaning: {
        en: 'How do I get to ...?',
        fr: 'Comment aller à ... ?',
      },
      example: '去人民广场怎么走？',
      audio: '/audio/metro-ticket/pattern-01.mp3',
      explanation: {
        en: 'Use it before buying a ticket if you need the route.',
        fr: 'Utilise cette structure avant d\'acheter un ticket si tu as besoin de l\'itinéraire.',
      },
    },
    {
      id: 'metro-ticket-pattern-2',
      pattern: '我要一张去……的票。',
      meaning: {
        en: 'I want one ticket to ...',
        fr: 'Je voudrais un ticket pour ...',
      },
      example: '我要一张去人民广场的票。',
      audio: '/audio/metro-ticket/pattern-02.mp3',
      explanation: {
        en: 'This joins the ticket request and destination in one sentence.',
        fr: 'Cette phrase relie la demande de ticket et la destination.',
      },
    },
    {
      id: 'metro-ticket-pattern-3',
      pattern: '要几站？',
      meaning: {
        en: 'How many stops?',
        fr: 'Combien de stations ?',
      },
      example: '要几站？',
      audio: '/audio/metro-ticket/pattern-03.mp3',
      explanation: {
        en: 'Ask it after you know the metro line.',
        fr: 'Pose cette question après connaître la ligne de métro.',
      },
    },
    {
      id: 'metro-ticket-pattern-4',
      pattern: '需要……吗？',
      meaning: { en: 'Do I need ...? / Is ... needed?', fr: 'Dois-je ... ? / ... est-il nécessaire ?' },
      example: '需要换乘吗？',
      audio: '/audio/metro-ticket/pattern-04.mp3',
      explanation: {
        en: 'Use 需要…吗 to confirm if something is required.',
        fr: 'Utilise 需要…吗 pour confirmer si quelque chose est nécessaire.',
      },
    },
    {
      id: 'metro-ticket-pattern-5',
      pattern: '哪个……？',
      meaning: { en: 'Which ...?', fr: 'Quel / Quelle ... ?' },
      example: '哪个出口出去？',
      audio: '/audio/metro-ticket/pattern-05.mp3',
      explanation: {
        en: 'Use 哪个 to ask which one among visible options like exits or platforms.',
        fr: 'Utilise 哪个 pour demander lequel parmi des options visibles comme les sorties ou les quais.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'metro-ticket-vocab-1',
      hanzi: '地铁',
      pinyin: 'dìtiě',
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
      pinyin: 'huànchéng',
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
    { id: 'metro-ticket-vocab-6', hanzi: '出口', pinyin: 'chūkǒu', audio: '/audio/metro-ticket/vocab-06.mp3', meaning: { en: 'exit', fr: 'sortie' }, explanation: { en: 'Look for 出口 signs to leave the station.', fr: 'Cherche les panneaux 出口 pour sortir de la station.' } },
    { id: 'metro-ticket-vocab-7', hanzi: '公交卡', pinyin: 'gōngjiāokǎ', audio: '/audio/metro-ticket/vocab-07.mp3', meaning: { en: 'transit card', fr: 'carte de transport' }, explanation: { en: 'A rechargeable card for bus and metro rides.', fr: 'Une carte rechargeable pour les trajets en bus et métro.' } },
    { id: 'metro-ticket-vocab-8', hanzi: '一张', pinyin: 'yì zhāng', audio: '/audio/metro-ticket/vocab-08.mp3', meaning: { en: 'one (for flat items like tickets)', fr: 'un (pour les objets plats comme les tickets)' }, explanation: { en: 'Use 张 for tickets, paper, and flat objects.', fr: 'Utilise 张 pour les tickets, le papier et les objets plats.' } },
    { id: 'metro-ticket-vocab-9', hanzi: '充值', pinyin: 'chōngzhí', audio: '/audio/metro-ticket/vocab-09.mp3', meaning: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'Use 充值 to add money to your transit card.', fr: 'Utilise 充值 pour ajouter de l\'argent à ta carte de transport.' } },
    { id: 'metro-ticket-vocab-10', hanzi: '方向', pinyin: 'fāngxiàng', audio: '/audio/metro-ticket/vocab-10.mp3', meaning: { en: 'direction', fr: 'direction' }, explanation: { en: 'Check 方向 on metro signs to know which platform to take.', fr: 'Vérifie 方向 sur les panneaux de métro pour savoir quel quai prendre.' } },
  ],
  pronunciation: [
    {
      id: 'metro-ticket-pronunciation-1',
      focus: {
        en: 'Numbers with lines and stops',
        fr: 'Nombres avec lignes et stations',
      },
      audioText: '二号线，三站，一张票',
      audio: '/audio/metro-ticket/pronunciation-01.mp3',
      tip: {
        en: 'Keep the number clear before 号线 and 站 so the route is not confused.',
        fr: 'Garde le nombre clair devant 号线 et 站 pour éviter de confondre l\'itinéraire.',
      },
      explanation: {
        en: 'Metro answers often compress to a number plus line or stops.',
        fr: 'Les réponses dans le métro se réduisent souvent à un nombre plus une ligne ou des stations.',
      },
    },
    {
      id: 'metro-ticket-pronunciation-2',
      focus: { en: 'zh vs j contrast: 站 vs 见', fr: 'Contraste zh vs j : 站 vs 见' },
      audioText: '三站，不是三见',
      audio: '/audio/metro-ticket/pronunciation-02.mp3',
      tip: {
        en: '站 (zhàn stop) curls your tongue back; 见 (jiàn see) keeps your tongue flat. Practice the difference.',
        fr: '站 (zhàn station) recourbe ta langue ; 见 (jiàn voir) garde la langue plate. Entraîne-toi à la différence.',
      },
      explanation: {
        en: 'zh vs j is a common confusion point when listening to station announcements.',
        fr: 'zh vs j est un point de confusion fréquent à l\'écoute des annonces de station.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'metro-ticket-hanzi-1',
      hanzi: '地',
      pinyin: 'dì',
      meaning: {
        en: 'ground / earth',
        fr: 'sol / terre',
      },
      explanation: {
        en: 'It appears in 地铁.',
        fr: 'Il apparaît dans 地铁.',
      },
    },
    {
      id: 'metro-ticket-hanzi-2',
      hanzi: '铁',
      pinyin: 'tiě',
      meaning: {
        en: 'iron',
        fr: 'fer',
      },
      explanation: {
        en: 'Together with 地 it forms 地铁, metro.',
        fr: 'Avec 地, il forme 地铁, métro.',
      },
    },
    {
      id: 'metro-ticket-hanzi-3',
      hanzi: '票',
      pinyin: 'piào',
      meaning: {
        en: 'ticket',
        fr: 'ticket',
      },
      explanation: {
        en: 'Look for it when buying a fare.',
        fr: 'Repère-le pour acheter un trajet.',
      },
    },
    {
      id: 'metro-ticket-hanzi-4',
      hanzi: '站',
      pinyin: 'zhàn',
      meaning: {
        en: 'station',
        fr: 'station',
      },
      explanation: {
        en: 'It marks stops and station names.',
        fr: 'Il indique les arrêts et les noms de station.',
      },
    },
    { id: 'metro-ticket-hanzi-5', hanzi: '换', pinyin: 'huàn', meaning: { en: 'change / exchange', fr: 'changer / échanger' }, explanation: { en: 'Recognize 换 in 换乘 on transfer signs.', fr: 'Reconnais 换 dans 换乘 sur les panneaux de correspondance.' } },
    { id: 'metro-ticket-hanzi-6', hanzi: '出', pinyin: 'chū', meaning: { en: 'go out / exit', fr: 'sortir' }, explanation: { en: 'Recognize 出 in 出口 when leaving the station.', fr: 'Reconnais 出 dans 出口 en quittant la station.' } },
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
  shortInput: {
    id: 'metro-ticket-short-input-01',
    prompt: {
      en: 'Ask how many stops.',
      fr: 'Demande combien de stations il y a.',
    },
    target: '要几站？',
    explanation: {
      en: 'A short survival question for route checking.',
      fr: 'Une courte question de survie pour vérifier un trajet.',
    },
    audio: '/audio/metro-ticket/short-input-01.mp3',
  },
}
