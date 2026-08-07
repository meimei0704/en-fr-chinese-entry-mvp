import type { LessonContent } from '../types.js'

export const trainStationTicketLesson: LessonContent = {
  id: 'train-station-ticket',
  title: {
    en: 'Buy a train station ticket',
    fr: 'Acheter un billet en gare',
  },
  scenario: {
    en: 'Buy a train ticket to Shanghai, choose a date and seat type, show your passport, understand the platform and departure time, and ask about delays.',
    fr: 'Acheter un billet de train pour Shanghai, choisir une date et un type de place, présenter son passeport, comprendre le quai et l\'heure de départ, et se renseigner sur les retards.',
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
      pattern: '我想买一张去……的票。',
      meaning: {
        en: 'I would like to buy one ticket to ...',
        fr: 'Je voudrais acheter un billet pour ...',
      },
      example: '我想买一张去上海的票。',
      audio: '/audio/train-station-ticket/pattern-01.mp3',
      explanation: {
        en: 'Use this at a ticket counter with the destination in the middle.',
        fr: 'Utilise cette phrase au guichet avec la destination au milieu.',
      },
    },
    {
      id: 'train-station-ticket-pattern-2',
      pattern: '……还是……？',
      meaning: {
        en: '... or ...?',
        fr: '... ou ... ?',
      },
      example: '硬座还是软座？',
      audio: '/audio/train-station-ticket/pattern-02.mp3',
      explanation: {
        en: '还是 offers you a choice between two options.',
        fr: '还是 te propose un choix entre deux options.',
      },
    },
    {
      id: 'train-station-ticket-pattern-3',
      pattern: '在哪个站台？',
      meaning: {
        en: 'Which platform?',
        fr: 'Quel quai ?',
      },
      example: '在哪个站台？',
      audio: '/audio/train-station-ticket/pattern-03.mp3',
      explanation: {
        en: 'Ask this to find where your train will board.',
        fr: 'Demande cela pour trouver où ton train embarque.',
      },
    },
    {
      id: 'train-station-ticket-pattern-4',
      pattern: '有……的票吗？',
      meaning: { en: 'Are there tickets for ...?', fr: 'Y a-t-il des billets pour ... ?' },
      example: '有今天下午的票吗？',
      audio: '/audio/train-station-ticket/pattern-04.mp3',
      explanation: {
        en: 'Use this to check availability for a specific time.',
        fr: 'Utilise cette structure pour vérifier la disponibilité d\'un horaire précis.',
      },
    },
    {
      id: 'train-station-ticket-pattern-5',
      pattern: '不会晚点。',
      meaning: { en: 'It won\'t be delayed.', fr: 'Il n\'y aura pas de retard.' },
      example: '不会晚点。',
      audio: '/audio/train-station-ticket/pattern-05.mp3',
      explanation: {
        en: 'Listen for this reassuring phrase about train punctuality.',
        fr: 'Écoute cette phrase rassurante sur la ponctualité du train.',
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
      hanzi: '上海',
      pinyin: 'Shànghǎi',
      audio: '/audio/train-station-ticket/vocab-03.mp3',
      meaning: {
        en: 'Shanghai',
        fr: 'Shanghai',
      },
      explanation: {
        en: 'The model destination in the ticket request.',
        fr: 'La destination modèle dans la demande de billet.',
      },
    },
    {
      id: 'train-station-ticket-vocab-4',
      hanzi: '今天',
      pinyin: 'jīntiān',
      audio: '/audio/train-station-ticket/vocab-04.mp3',
      meaning: {
        en: 'today',
        fr: 'aujourd\'hui',
      },
      explanation: {
        en: 'The date answer paired with 明天.',
        fr: 'La réponse de date associée à 明天.',
      },
    },
    {
      id: 'train-station-ticket-vocab-5',
      hanzi: '出发',
      pinyin: 'chūfā',
      audio: '/audio/train-station-ticket/vocab-05.mp3',
      meaning: {
        en: 'depart',
        fr: 'partir / départ',
      },
      explanation: {
        en: 'The action word for the train leaving.',
        fr: 'Le mot d\'action pour le départ du train.',
      },
    },
    { id: 'train-station-ticket-vocab-6', hanzi: '硬座', pinyin: 'yìngzuò', audio: '/audio/train-station-ticket/vocab-06.mp3', meaning: { en: 'hard seat (basic class)', fr: 'place dure (classe de base)' }, explanation: { en: 'The most common and affordable train seat type.', fr: 'Le type de place le plus courant et abordable en train.' } },
    { id: 'train-station-ticket-vocab-7', hanzi: '软座', pinyin: 'ruǎnzuò', audio: '/audio/train-station-ticket/vocab-07.mp3', meaning: { en: 'soft seat (comfort class)', fr: 'place molle (classe confort)' }, explanation: { en: 'A more comfortable seat option that costs a bit more.', fr: 'Une option de place plus confortable qui coûte un peu plus cher.' } },
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
  shortInput: {
    id: 'train-station-ticket-short-input-01',
    prompt: {
      en: 'Buy a ticket to Shanghai.',
      fr: 'Achète un billet pour Shanghai.',
    },
    target: '我想买一张去上海的票。',
    explanation: {
      en: 'This combines the buying verb, one-ticket measure word, and destination.',
      fr: 'Cela combine le verbe acheter, le classificateur d\'un billet et la destination.',
    },
    audio: '/audio/train-station-ticket/short-input-01.mp3',
  },
}
