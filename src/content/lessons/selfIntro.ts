import type { LessonContent } from '../types'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: 'Airport immigration basics',
    fr: 'Bases du passage à l’immigration à l’aéroport',
  },
  scenario: {
    en: 'Answer the first immigration questions after arriving in China: show your passport, say why you came, and name where you are staying.',
    fr: 'Répondre aux premières questions d’immigration en arrivant en Chine : présenter son passeport, dire pourquoi on vient et indiquer où l’on loge.',
  },
  dialogue: {
    title: {
      en: 'Show your passport and answer why you are here',
      fr: 'Présenter son passeport et dire pourquoi on est là',
    },
    lines: [
      {
        id: 'self-intro-line-01',
        speaker: {
          en: 'Officer',
          fr: 'Agent',
        },
        hanzi: '你好，请出示护照。',
        pinyin: 'Nǐ hǎo, qǐng chūshì hùzhào.',
        translation: {
          en: 'Hello, please show your passport.',
          fr: 'Bonjour, veuillez présenter votre passeport.',
        },
        explanation: {
          en: '请出示 is a formal but common phrase at airport immigration and counters.',
          fr: '请出示 est une formule courante et plutôt formelle à l’immigration ou aux guichets.',
        },
        audio: '/audio/self-intro/line-01.mp3',
      },
      {
        id: 'self-intro-line-02',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hùzhào.',
        translation: {
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
        },
        explanation: {
          en: '这是我的… lets you hand over an item clearly and politely.',
          fr: '这是我的… permet de remettre un document clairement et poliment.',
        },
        audio: '/audio/self-intro/line-02.mp3',
      },
      {
        id: 'self-intro-line-03',
        speaker: {
          en: 'Officer',
          fr: 'Agent',
        },
        hanzi: '你来中国做什么？',
        pinyin: 'Nǐ lái Zhōngguó zuò shénme?',
        translation: {
          en: 'What are you coming to China for?',
          fr: 'Pourquoi venez-vous en Chine ?',
        },
        explanation: {
          en: '来中国做什么 asks for the purpose of your visit.',
          fr: '来中国做什么 demande le motif du séjour.',
        },
        audio: '/audio/self-intro/line-03.mp3',
      },
      {
        id: 'self-intro-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我来旅游，住在这个酒店。',
        pinyin: 'Wǒ lái lǚyóu, zhù zài zhège jiǔdiàn.',
        translation: {
          en: 'I came for travel, and I am staying at this hotel.',
          fr: 'Je viens pour le tourisme et je loge dans cet hôtel.',
        },
        explanation: {
          en: 'This single sentence covers visit purpose and where you are staying.',
          fr: 'Cette phrase couvre à la fois le motif du séjour et le lieu où vous logez.',
        },
        audio: '/audio/self-intro/line-04.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '请出示……',
      meaning: {
        en: 'Please show / present ...',
        fr: 'Veuillez présenter ...',
      },
      example: '请出示护照。',
      explanation: {
        en: 'You may hear this before handing over a passport, ticket, or booking.',
        fr: 'On peut entendre cette structure avant de présenter un passeport, un billet ou une réservation.',
      },
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '我来……',
      meaning: {
        en: 'I came to ... / I am here for ...',
        fr: 'Je viens pour ...',
      },
      example: '我来旅游。',
      explanation: {
        en: 'Put the visit purpose after 我来, such as 旅游, 工作, or 学习.',
        fr: 'Place le motif après 我来, par exemple 旅游, 工作 ou 学习.',
      },
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '我住在……',
      meaning: {
        en: 'I am staying at ...',
        fr: 'Je loge à ...',
      },
      example: '我住在这个酒店。',
      explanation: {
        en: 'Use it to give a hotel or temporary address.',
        fr: 'Utilise cette phrase pour indiquer un hôtel ou une adresse temporaire.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '护照',
      pinyin: 'hùzhào',
      meaning: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'The key document word for immigration, hotels, and train stations.',
        fr: 'Le mot clé pour les documents à l’immigration, à l’hôtel et en gare.',
      },
    },
    {
      id: 'self-intro-vocab-2',
      hanzi: '出示',
      pinyin: 'chūshì',
      meaning: {
        en: 'show / present',
        fr: 'présenter / montrer',
      },
      explanation: {
        en: 'A common official verb for showing a document.',
        fr: 'Un verbe officiel courant pour présenter un document.',
      },
    },
    {
      id: 'self-intro-vocab-3',
      hanzi: '旅游',
      pinyin: 'lǚyóu',
      meaning: {
        en: 'travel / tourism',
        fr: 'voyage / tourisme',
      },
      explanation: {
        en: 'Use it as a simple purpose for visiting China.',
        fr: 'Utilise-le comme motif simple de visite en Chine.',
      },
    },
    {
      id: 'self-intro-vocab-4',
      hanzi: '酒店',
      pinyin: 'jiǔdiàn',
      meaning: {
        en: 'hotel',
        fr: 'hôtel',
      },
      explanation: {
        en: 'A useful word when giving your stay address.',
        fr: 'Un mot utile pour indiquer où vous logez.',
      },
    },
    {
      id: 'self-intro-vocab-5',
      hanzi: '住在',
      pinyin: 'zhù zài',
      meaning: {
        en: 'stay at / live at',
        fr: 'loger à / habiter à',
      },
      explanation: {
        en: 'Use it with hotels, apartments, or addresses.',
        fr: 'Utilise-le avec un hôtel, un appartement ou une adresse.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'self-intro-pronunciation-1',
      focus: {
        en: 'Linking 住在',
        fr: 'Enchaîner 住在',
      },
      tip: {
        en: 'Say 住在 smoothly as one phrase before the place: 住在这个酒店.',
        fr: 'Dis 住在 de façon fluide avant le lieu : 住在这个酒店.',
      },
      explanation: {
        en: 'For this lesson, focus on a complete usable answer, not grammar detail.',
        fr: 'Dans cette leçon, vise une réponse complète et utilisable, pas les détails de grammaire.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'self-intro-hanzi-1',
      hanzi: '护',
      pinyin: 'hù',
      meaning: {
        en: 'protect; first character of passport',
        fr: 'protéger ; premier caractère de passeport',
      },
      explanation: {
        en: 'Recognize 护 as part of 护照.',
        fr: 'Reconnais 护 dans 护照.',
      },
    },
    {
      id: 'self-intro-hanzi-2',
      hanzi: '照',
      pinyin: 'zhào',
      meaning: {
        en: 'photo / document; second character of passport',
        fr: 'photo / document ; deuxième caractère de passeport',
      },
      explanation: {
        en: '照 completes the word 护照.',
        fr: '照 complète le mot 护照.',
      },
    },
    {
      id: 'self-intro-hanzi-3',
      hanzi: '酒',
      pinyin: 'jiǔ',
      meaning: {
        en: 'first character in hotel',
        fr: 'premier caractère de hôtel',
      },
      explanation: {
        en: 'Recognize 酒 inside 酒店 on hotel names and booking screens.',
        fr: 'Reconnais 酒 dans 酒店 sur les noms d’hôtel et les réservations.',
      },
    },
    {
      id: 'self-intro-hanzi-4',
      hanzi: '店',
      pinyin: 'diàn',
      meaning: {
        en: 'shop / place; second character in hotel',
        fr: 'magasin / lieu ; deuxième caractère de hôtel',
      },
      explanation: {
        en: '店 completes 酒店, the word for hotel.',
        fr: '店 complète 酒店, le mot pour hôtel.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'self-intro-listening-1',
        prompt: {
          en: 'Which answer matches “What are you coming to China for?”',
          fr: 'Quelle réponse correspond à « Pourquoi venez-vous en Chine ? »',
        },
        target: '我来旅游。',
        explanation: {
          en: 'Listen for 我来 followed by the purpose 旅游.',
          fr: 'Écoute 我来 suivi du motif 旅游.',
        },
      },
    ],
    speaking: [
      {
        id: 'self-intro-speaking-1',
        prompt: {
          en: 'Answer the officer with your purpose.',
          fr: 'Réponds à l’agent avec le motif de ton séjour.',
        },
        target: '我来旅游。',
        explanation: {
          en: 'This is the shortest complete answer to the purpose question.',
          fr: 'C’est la réponse complète la plus courte à la question du motif.',
        },
      },
    ],
    reading: [
      {
        id: 'self-intro-reading-1',
        prompt: {
          en: 'Match the document word to “passport”.',
          fr: 'Associe le mot du document à « passeport ».',
        },
        target: '护照',
        explanation: {
          en: '护照 is the word you need at immigration and hotel check-in.',
          fr: '护照 est le mot nécessaire à l’immigration et à l’hôtel.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'self-intro-review-1',
      front: '护照',
      back: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'The first document word to recognize after landing.',
        fr: 'Le premier mot de document à reconnaître après l’arrivée.',
      },
    },
    {
      id: 'self-intro-review-2',
      front: '我来旅游',
      back: {
        en: 'I came for travel / tourism.',
        fr: 'Je viens pour le tourisme.',
      },
      explanation: {
        en: 'A simple answer for the purpose-of-visit question.',
        fr: 'Une réponse simple à la question sur le motif du séjour.',
      },
    },
    {
      id: 'self-intro-review-3',
      front: '我住在这个酒店',
      back: {
        en: 'I am staying at this hotel.',
        fr: 'Je loge dans cet hôtel.',
      },
      explanation: {
        en: 'Use it when asked for your hotel or stay address.',
        fr: 'Utilise-le quand on demande ton hôtel ou ton adresse de séjour.',
      },
    },
  ],
  shortInput: {
    id: 'self-intro-short-input-01',
    prompt: {
      en: 'Why are you coming to China?',
      fr: 'Pourquoi venez-vous en Chine ?',
    },
    target: '我来旅游。',
    explanation: {
      en: 'Type the shortest useful answer for tourism.',
      fr: 'Tape la réponse utile la plus courte pour le tourisme.',
    },
    audio: '/audio/self-intro/short-input-01.mp3',
  },
}
