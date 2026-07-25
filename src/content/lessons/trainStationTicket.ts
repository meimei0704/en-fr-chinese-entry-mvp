import type { LessonContent } from '../types'

export const trainStationTicketLesson: LessonContent = {
  id: 'train-station-ticket',
  title: {
    en: 'Buy a train station ticket',
    fr: 'Acheter un billet en gare',
  },
  scenario: {
    en: 'Buy a train ticket to Shanghai, choose today or tomorrow, understand a departure time, and show your passport.',
    fr: 'Acheter un billet de train pour Shanghai, choisir aujourd’hui ou demain, comprendre l’heure de départ et présenter son passeport.',
  },
  dialogue: {
    title: {
      en: 'Buy a same-day train ticket',
      fr: 'Acheter un billet de train pour aujourd’hui',
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
          fr: 'Aujourd’hui ou demain ?',
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
        hanzi: '今天下午。',
        pinyin: 'Jīntiān xiàwǔ.',
        translation: {
          en: 'This afternoon.',
          fr: 'Cet après-midi.',
        },
        explanation: {
          en: 'A short time answer is enough for a first train ticket purchase.',
          fr: 'Une réponse courte de temps suffit pour un premier achat de billet de train.',
        },
        audio: '/audio/train-station-ticket/line-03.mp3',
      },
      {
        id: 'train-station-ticket-line-04',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '请出示护照。',
        pinyin: 'Qǐng chūshì hùzhào.',
        translation: {
          en: 'Please show your passport.',
          fr: 'Veuillez présenter votre passeport.',
        },
        explanation: {
          en: 'Train tickets may require the same passport phrase learned earlier.',
          fr: 'Les billets de train peuvent demander la même phrase du passeport apprise plus tôt.',
        },
        audio: '/audio/train-station-ticket/line-04.mp3',
      },
      {
        id: 'train-station-ticket-line-05',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '这是您的票，三点出发。',
        pinyin: 'Zhè shì nín de piào, sān diǎn chūfā.',
        translation: {
          en: 'This is your ticket; it departs at three o’clock.',
          fr: 'Voici votre billet ; il part à trois heures.',
        },
        explanation: {
          en: '三点出发 gives the key departure time in a compact phrase.',
          fr: '三点出发 donne l’heure de départ clé dans une phrase compacte.',
        },
        audio: '/audio/train-station-ticket/line-05.mp3',
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
      pattern: '今天还是明天？',
      meaning: {
        en: 'Today or tomorrow?',
        fr: 'Aujourd’hui ou demain ?',
      },
      example: '今天还是明天？',
      audio: '/audio/train-station-ticket/pattern-02.mp3',
      explanation: {
        en: 'This choice question helps you answer the travel date.',
        fr: 'Cette question de choix t’aide à répondre sur la date de trajet.',
      },
    },
    {
      id: 'train-station-ticket-pattern-3',
      pattern: '……点出发。',
      meaning: {
        en: 'Departs at ... o’clock.',
        fr: 'Départ à ... heures.',
      },
      example: '三点出发。',
      audio: '/audio/train-station-ticket/pattern-03.mp3',
      explanation: {
        en: 'Listen for a time before 出发 to catch the departure.',
        fr: 'Écoute l’heure avant 出发 pour saisir le départ.',
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
        fr: 'Le lieu de cette scène finale d’achat de billet.',
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
        fr: 'aujourd’hui',
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
        fr: 'Le mot d’action pour le départ du train.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'train-station-ticket-pronunciation-1',
      focus: {
        en: 'Ticketing phrase linking',
        fr: 'Enchaînement des phrases de billetterie',
      },
      audioText: '我想买一张去上海的票，今天下午，三点出发',
      audio: '/audio/train-station-ticket/pronunciation-01.mp3',
      tip: {
        en: 'Group the destination phrase together, then pause before the date and time.',
        fr: 'Groupe la destination, puis marque une pause avant la date et l’heure.',
      },
      explanation: {
        en: 'This final lesson links ticket, date, passport, and departure time.',
        fr: 'Cette dernière leçon relie billet, date, passeport et heure de départ.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'train-station-ticket-hanzi-1',
      hanzi: '火',
      pinyin: 'huǒ',
      meaning: {
        en: 'fire',
        fr: 'feu',
      },
      explanation: {
        en: 'It starts 火车, train.',
        fr: 'Il commence 火车, train.',
      },
    },
    {
      id: 'train-station-ticket-hanzi-2',
      hanzi: '车',
      pinyin: 'chē',
      meaning: {
        en: 'vehicle / train in compounds',
        fr: 'véhicule / train dans les mots composés',
      },
      explanation: {
        en: 'It appears in 火车站 and 车票.',
        fr: 'Il apparaît dans 火车站 et 车票.',
      },
    },
    {
      id: 'train-station-ticket-hanzi-3',
      hanzi: '票',
      pinyin: 'piào',
      meaning: {
        en: 'ticket',
        fr: 'billet / ticket',
      },
      explanation: {
        en: 'The same ticket character from the metro lesson.',
        fr: 'Le même caractère de ticket que dans la leçon de métro.',
      },
    },
    {
      id: 'train-station-ticket-hanzi-4',
      hanzi: '发',
      pinyin: 'fā',
      meaning: {
        en: 'send out / depart element',
        fr: 'envoyer / élément de départ',
      },
      explanation: {
        en: 'It appears in 出发.',
        fr: 'Il apparaît dans 出发.',
      },
    },
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
          fr: 'C’est la phrase principale de billetterie finale.',
        },
      },
    ],
    reading: [
      {
        id: 'train-station-ticket-reading-1',
        prompt: {
          en: 'Read the departure time.',
          fr: 'Lis l’heure de départ.',
        },
        target: '三点出发。',
        audio: '/audio/train-station-ticket/practice-reading-01.mp3',
        explanation: {
          en: 'Catch the number before 点 and 出发.',
          fr: 'Repère le nombre avant 点 et 出发.',
        },
      },
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
        en: 'departs at three o’clock',
        fr: 'départ à trois heures',
      },
      explanation: {
        en: 'A compact phrase for the departure time.',
        fr: 'Une phrase compacte pour l’heure de départ.',
      },
    },
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
      fr: 'Cela combine le verbe acheter, le classificateur d’un billet et la destination.',
    },
    audio: '/audio/train-station-ticket/short-input-01.mp3',
  },
}
