import type { LessonContent } from '../types.js'

export const trainStationTicketLesson: LessonContent = {
  id: 'train-station-ticket',
  title: {
    en: '坐火车 / Take the train',
    fr: '坐火车 / Prendre le train',
  },
  scenario: {
    en: 'Most train tickets are booked online, but these phrases help you navigate the station.',
    fr: 'La plupart des billets de train se réservent en ligne, mais ces phrases t\'aident à te repérer en gare.',
  },
  dialogue: {
    title: {
      en: 'Buy a train ticket and find your platform',
      fr: 'Acheter un billet de train et trouver son quai',
    },
    lines: [
      {
        id: 'train-station-ticket-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好，我想买一张去上海的票。',
        pinyin: 'Nǐ hǎo, wǒ xiǎng mǎi yì zhāng qù Shànghǎi de piào.',
        translation: {
          en: 'Hello, I would like to buy one ticket to Shanghai.',
          fr: 'Bonjour, je voudrais acheter un billet pour Shanghai.',
        },
        explanation: {
          en: 'This capstone ticket phrase extends the metro ticket pattern with 我想买.',
          fr: 'Cette phrase de billet finale prolonge le modèle du ticket de métro avec 我想买.',
        },
        audio: '/audio/train-station-ticket/line-01.mp3',
      },
      {
        id: 'train-station-ticket-line-02',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '今天还是明天？',
        pinyin: 'Jīntiān háishi míngtiān?',
        translation: {
          en: 'Today or tomorrow?',
          fr: 'Aujourd\'hui ou demain ?',
        },
        explanation: {
          en: '还是 presents two choices in a question.',
          fr: '还是 présente deux choix dans une question.',
        },
        audio: '/audio/train-station-ticket/line-02.mp3',
      },
      {
        id: 'train-station-ticket-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '今天下午，有票吗？',
        pinyin: 'Jīntiān xiàwǔ, yǒu piào ma?',
        translation: {
          en: 'This afternoon, are there tickets?',
          fr: 'Cet après-midi, y a-t-il des billets ?',
        },
        explanation: {
          en: '有票吗 confirms availability for your chosen time.',
          fr: '有票吗 confirme la disponibilité pour l\'horaire choisi.',
        },
        audio: '/audio/train-station-ticket/line-03.mp3',
      },
      {
        id: 'train-station-ticket-line-04',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '有。硬座还是软座？',
        pinyin: 'Yǒu. Yìngzuò háishi ruǎnzuò?',
        translation: {
          en: 'Yes. Hard seat or soft seat?',
          fr: 'Oui. Place dure ou place molle ?',
        },
        explanation: {
          en: '硬座 is the basic seat; 软座 is more comfortable and costs more.',
          fr: '硬座 est la place de base ; 软座 est plus confortable et coûte plus cher.',
        },
        audio: '/audio/train-station-ticket/line-04.mp3',
      },
      {
        id: 'train-station-ticket-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '硬座。请出示护照吗？',
        pinyin: 'Yìngzuò. Qǐng chūshì hùzhào ma?',
        translation: {
          en: 'Hard seat. Do I need to show my passport?',
          fr: 'Place dure. Dois-je présenter mon passeport ?',
        },
        explanation: {
          en: 'The traveler anticipates the passport requirement learned in earlier lessons.',
          fr: 'Le voyageur anticipe la demande de passeport apprise dans les leçons précédentes.',
        },
        audio: '/audio/train-station-ticket/line-05.mp3',
      },
      {
        id: 'train-station-ticket-line-06',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '对，请出示护照。这是您的票。',
        pinyin: 'Duì, qǐng chūshì hùzhào. Zhè shì nín de piào.',
        translation: {
          en: 'Yes, please show your passport. This is your ticket.',
          fr: 'Oui, veuillez présenter votre passeport. Voici votre billet.',
        },
        explanation: {
          en: 'The clerk confirms the passport step and hands over the ticket.',
          fr: 'L\'employé confirme l\'étape du passeport et remet le billet.',
        },
        audio: '/audio/train-station-ticket/line-06.mp3',
      },
      {
        id: 'train-station-ticket-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '在哪个站台？几点出发？',
        pinyin: 'Zài nǎge zhàntái? Jǐ diǎn chūfā?',
        translation: {
          en: 'Which platform? What time does it depart?',
          fr: 'Quel quai ? À quelle heure part-il ?',
        },
        explanation: {
          en: '站台 is the platform; 几点出发 asks for the exact departure time.',
          fr: '站台 est le quai ; 几点出发 demande l\'heure exacte de départ.',
        },
        audio: '/audio/train-station-ticket/line-07.mp3',
      },
      {
        id: 'train-station-ticket-line-08',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '二号站台，三点出发。不会晚点。',
        pinyin: 'Èr hào zhàntái, sān diǎn chūfā. Bú huì wǎndiǎn.',
        translation: {
          en: 'Platform two, departs at three o\'clock. It won\'t be delayed.',
          fr: 'Quai numéro deux, départ à trois heures. Il n\'y aura pas de retard.',
        },
        explanation: {
          en: '不会晚点 reassures you that the train is on time.',
          fr: '不会晚点 te rassure que le train est à l\'heure.',
        },
        audio: '/audio/train-station-ticket/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'train-station-ticket-pattern-1',
      pattern: '……在哪里？',
      meaning: {
        en: 'Where is ...?',
        fr: 'Où est ... ?',
      },
      example: '火车站在哪里？',
      audio: '/audio/train-station-ticket/pattern-01.mp3',
      explanation: {
        en: 'Ask 在哪里 to find the station, ticket office, or dining car.',
        fr: 'Demande 在哪里 pour trouver la gare, le guichet ou la voiture-restaurant.',
      },
    },
    {
      id: 'train-station-ticket-pattern-2',
      pattern: '我要一张去……的票。',
      meaning: {
        en: 'I want to buy one ticket to ...',
        fr: 'Je veux acheter un billet pour ...',
      },
      example: '我要一张去[北京]的票。',
      audio: '/audio/train-station-ticket/pattern-02.mp3',
      explanation: {
        en: 'Swap in the city name for 北京 to name your destination.',
        fr: 'Remplace 北京 par le nom de ta ville pour indiquer ta destination.',
      },
    },
    {
      id: 'train-station-ticket-pattern-3',
      pattern: '……几点开？',
      meaning: {
        en: 'What time does ... leave?',
        fr: 'À quelle heure part ... ?',
      },
      example: '火车几点开？',
      audio: '/audio/train-station-ticket/pattern-03.mp3',
      explanation: {
        en: 'Ask 几点开 to check when the train departs.',
        fr: 'Demande 几点开 pour vérifier l\'heure de départ du train.',
      },
    },
    {
      id: 'train-station-ticket-pattern-4',
      pattern: '……晚点了吗？',
      meaning: { en: 'Is ... delayed?', fr: '... est-il en retard ?' },
      example: '火车晚点了吗？',
      audio: '/audio/train-station-ticket/pattern-04.mp3',
      explanation: {
        en: 'Ask 晚点了吗 to check if the train is running late.',
        fr: 'Demande 晚点了吗 pour vérifier si le train est en retard.',
      },
    },
    {
      id: 'train-station-ticket-pattern-5',
      pattern: '怎么换乘？',
      meaning: { en: 'How do I make a transit?', fr: 'Comment faire une correspondance ?' },
      example: '请问怎么换乘？',
      audio: '/audio/train-station-ticket/pattern-05.mp3',
      explanation: {
        en: 'Ask 怎么换乘 when you need to change trains.',
        fr: 'Demande 怎么换乘 quand tu dois changer de train.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'train-station-ticket-vocab-1',
      hanzi: '火车站',
      pinyin: 'huǒchēzhàn',
      audio: '/audio/train-station-ticket/vocab-01.mp3',
      meaning: {
        en: 'train station',
        fr: 'gare',
      },
      explanation: {
        en: 'The place for this capstone ticketing scene.',
        fr: 'Le lieu de cette scène finale d\'achat de billet.',
      },
    },
    {
      id: 'train-station-ticket-vocab-2',
      hanzi: '车票',
      pinyin: 'chēpiào',
      audio: '/audio/train-station-ticket/vocab-02.mp3',
      meaning: {
        en: 'train ticket / vehicle ticket',
        fr: 'billet de train / ticket de transport',
      },
      explanation: {
        en: 'A ticket word you will see at stations.',
        fr: 'Un mot de billet que tu verras en gare.',
      },
    },
    {
      id: 'train-station-ticket-vocab-3',
      hanzi: '进站口',
      pinyin: 'jìnzhànkǒu',
      audio: '/audio/train-station-ticket/vocab-03.mp3',
      meaning: {
        en: 'entrance',
        fr: 'entrée',
      },
      explanation: {
        en: 'The entrance you use to go into the station.',
        fr: 'L\'entrée que tu utilises pour entrer dans la gare.',
      },
    },
    {
      id: 'train-station-ticket-vocab-4',
      hanzi: '人工通道',
      pinyin: 'réngōng tōngdào',
      audio: '/audio/train-station-ticket/vocab-04.mp3',
      meaning: {
        en: 'manual lane',
        fr: 'voie manuelle',
      },
      explanation: {
        en: 'Use this if automated gates do not read your passport.',
        fr: 'Utilise cette voie si les portiques automatiques ne lisent pas ton passeport.',
      },
    },
    {
      id: 'train-station-ticket-vocab-5',
      hanzi: '检票口',
      pinyin: 'jiǎnpiàokǒu',
      audio: '/audio/train-station-ticket/vocab-05.mp3',
      meaning: {
        en: 'ticket check gate',
        fr: 'portique de contrôle des billets',
      },
      explanation: {
        en: 'The gate where your ticket is checked before the platform.',
        fr: 'Le portique où l\'on vérifie ton billet avant le quai.',
      },
    },
    { id: 'train-station-ticket-vocab-6', hanzi: '车厢号', pinyin: 'chēxiānghào', audio: '/audio/train-station-ticket/vocab-06.mp3', meaning: { en: 'carriage number', fr: 'numéro de voiture' }, explanation: { en: 'Find this number on your ticket to locate your carriage.', fr: 'Trouve ce numéro sur ton billet pour localiser ta voiture.' } },
    { id: 'train-station-ticket-vocab-7', hanzi: '座位号', pinyin: 'zuòwèihào', audio: '/audio/train-station-ticket/vocab-07.mp3', meaning: { en: 'seat number', fr: 'numéro de siège' }, explanation: { en: 'Use this number to find your exact seat on the train.', fr: 'Utilise ce numéro pour trouver ta place exacte dans le train.' } },
    { id: 'train-station-ticket-vocab-8', hanzi: '站台', pinyin: 'zhàntái', audio: '/audio/train-station-ticket/vocab-08.mp3', meaning: { en: 'platform', fr: 'quai' }, explanation: { en: 'The place where you board the train.', fr: 'L\'endroit où tu montes dans le train.' } },
    { id: 'train-station-ticket-vocab-9', hanzi: '晚点', pinyin: 'wǎndiǎn', audio: '/audio/train-station-ticket/vocab-09.mp3', meaning: { en: 'delay / late', fr: 'retard / en retard' }, explanation: { en: 'A word you will see on station displays if a train is late.', fr: 'Un mot que tu verras sur les écrans de gare si un train est en retard.' } },
    { id: 'train-station-ticket-vocab-10', hanzi: '护照', pinyin: 'hùzhào', audio: '/audio/train-station-ticket/vocab-10.mp3', meaning: { en: 'passport', fr: 'passeport' }, explanation: { en: 'You need it for buying long-distance train tickets.', fr: 'Tu en as besoin pour acheter des billets de train longue distance.' } },
  ],
  practice: {
    listening: [
      {
        id: 'train-station-ticket-listening-1',
        prompt: {
          en: 'Listen for the ticket to Shanghai.',
          fr: 'Écoute le billet pour Shanghai.',
        },
        target: '我想买一张去上海的票。',
        audio: '/audio/train-station-ticket/practice-listening-01.mp3',
        explanation: {
          en: 'The destination follows 去 and comes before 的票.',
          fr: 'La destination suit 去 et vient avant 的票.',
        },
      },
      { id: 'train-station-ticket-listening-2', prompt: { en: 'Which phrase says the train won\'t be delayed?', fr: 'Quelle phrase dit que le train n\'aura pas de retard ?' }, target: '不会晚点。', audio: '/audio/train-station-ticket/practice-listening-02.mp3', explanation: { en: '不会晚点 reassures you the train is on schedule.', fr: '不会晚点 te rassure que le train est à l\'heure.' } },
    ],
    speaking: [
      {
        id: 'train-station-ticket-speaking-1',
        prompt: {
          en: 'Say that you want to buy a ticket to Shanghai.',
          fr: 'Dis que tu veux acheter un billet pour Shanghai.',
        },
        target: '我想买一张去上海的票。',
        audio: '/audio/train-station-ticket/practice-speaking-01.mp3',
        explanation: {
          en: 'This is the core capstone ticketing sentence.',
          fr: 'C\'est la phrase principale de billetterie finale.',
        },
      },
      { id: 'train-station-ticket-speaking-2', prompt: { en: 'Ask which platform the train is at.', fr: 'Demande sur quel quai se trouve le train.' }, target: '在哪个站台？', audio: '/audio/train-station-ticket/practice-speaking-02.mp3', explanation: { en: 'A key question after you have your ticket.', fr: 'Une question clé après avoir obtenu ton billet.' } },
    ],
    reading: [
      {
        id: 'train-station-ticket-reading-1',
        prompt: {
          en: 'Read the departure time.',
          fr: 'Lis l\'heure de départ.',
        },
        target: '三点出发。',
        audio: '/audio/train-station-ticket/practice-reading-01.mp3',
        explanation: {
          en: 'Catch the number before 点 and 出发.',
          fr: 'Repère le nombre avant 点 et 出发.',
        },
      },
      { id: 'train-station-ticket-reading-2', prompt: { en: 'Match the word for platform.', fr: 'Associe le mot pour quai.' }, target: '站台', audio: '/audio/train-station-ticket/practice-reading-02.mp3', explanation: { en: '站台 is the platform where you board. Look for it on signs.', fr: '站台 est le quai où tu embarques. Cherche-le sur les panneaux.' } },
    ],
  },
  reviewCards: [
    {
      id: 'train-station-ticket-review-1',
      front: '火车站',
      back: {
        en: 'train station',
        fr: 'gare',
      },
      explanation: {
        en: 'The setting for buying the ticket.',
        fr: 'Le lieu où acheter le billet.',
      },
    },
    {
      id: 'train-station-ticket-review-2',
      front: '车票',
      back: {
        en: 'ticket',
        fr: 'billet',
      },
      explanation: {
        en: 'A station ticket word.',
        fr: 'Un mot de billet en gare.',
      },
    },
    {
      id: 'train-station-ticket-review-3',
      front: '三点出发',
      back: {
        en: 'departs at three o\'clock',
        fr: 'départ à trois heures',
      },
      explanation: {
        en: 'A compact phrase for the departure time.',
        fr: 'Une phrase compacte pour l\'heure de départ.',
      },
    },
    { id: 'train-station-ticket-review-4', front: '硬座', back: { en: 'hard seat', fr: 'place dure' }, explanation: { en: 'The standard train seat class in China.', fr: 'La classe de place standard en train en Chine.' } },
    { id: 'train-station-ticket-review-5', front: '站台', back: { en: 'platform', fr: 'quai' }, explanation: { en: 'Find this word on signs to locate your boarding area.', fr: 'Trouve ce mot sur les panneaux pour localiser ta zone d\'embarquement.' } },
    { id: 'train-station-ticket-review-6', front: '晚点', back: { en: 'delay', fr: 'retard' }, explanation: { en: 'Watch for this word on departure boards.', fr: 'Surveille ce mot sur les panneaux de départ.' } },
  ],
}
