import type { LessonContent } from '../types.js'

export const metroTicketLesson: LessonContent = {
  id: 'metro-ticket',
  title: {
    en: 'Buy a metro ticket',
    fr: 'Acheter un ticket de métro',
  },
  scenario: {
    en: 'Ask how to get to People’s Square, confirm line two, buy one metro ticket, and ask how many stops.',
    fr: 'Demander comment aller à la Place du Peuple, confirmer la ligne 2, acheter un ticket de métro et demander le nombre de stations.',
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
          en: 'How do I get to People’s Square?',
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
          en: 'I want one ticket to People’s Square.',
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
          fr: 'Écoute un nombre suivi de 站 quand quelqu’un répond.',
        },
        audio: '/audio/metro-ticket/line-05.mp3',
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
        fr: 'Utilise cette structure avant d’acheter un ticket si tu as besoin de l’itinéraire.',
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
        fr: 'Garde le nombre clair devant 号线 et 站 pour éviter de confondre l’itinéraire.',
      },
      explanation: {
        en: 'Metro answers often compress to a number plus line or stops.',
        fr: 'Les réponses dans le métro se réduisent souvent à un nombre plus une ligne ou des stations.',
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
  ],
  practice: {
    listening: [
      {
        id: 'metro-ticket-listening-1',
        prompt: {
          en: "Listen for the metro ticket to People's Square.",
          fr: 'Écoute le ticket de métro pour la Place du Peuple.',
        },
        target: '我要一张去人民广场的票。',
        audio: '/audio/metro-ticket/practice-listening-01.mp3',
        explanation: {
          en: 'The destination sits between 去 and 的票.',
          fr: 'La destination se place entre 去 et 的票.',
        },
      },
    ],
    speaking: [
      {
        id: 'metro-ticket-speaking-1',
        prompt: {
          en: 'Ask how to get to People’s Square.',
          fr: 'Demande comment aller à la Place du Peuple.',
        },
        target: '去人民广场怎么走？',
        audio: '/audio/metro-ticket/practice-speaking-01.mp3',
        explanation: {
          en: 'This is the route question before the ticket request.',
          fr: 'C’est la question d’itinéraire avant la demande de ticket.',
        },
      },
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
