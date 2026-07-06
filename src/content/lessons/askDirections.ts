import type { LessonContent } from '../types'

export const askDirectionsLesson: LessonContent = {
  id: 'ask-directions',
  title: {
    en: 'Ask for directions',
    fr: 'Demander son chemin',
  },
  scenario: {
    en: 'Buying a subway ticket, choosing the right line, transferring, and finding the correct exit.',
    fr: 'Acheter un ticket de métro, choisir la bonne ligne, faire une correspondance et trouver la bonne sortie.',
  },
  dialogue: {
    title: {
      en: 'Find the station',
      fr: 'Trouver la station',
    },
    lines: [
      {
        id: 'ask-directions-line-01',
        speaker: 'Traveler',
        hanzi: '请问，地铁站在哪儿？',
        pinyin: 'Qǐngwèn, dìtiě zhàn zài nǎr?',
        translation: {
          en: 'Excuse me, where is the subway station?',
          fr: 'Excusez-moi, où est la station de métro ?',
        },
        explanation: {
          en: '请问 softens the question and sounds polite with strangers.',
          fr: '请问 adoucit la question et reste poli avec des inconnus.',
        },
        audio: '/audio/ask-directions/line-01.mp3',
      },
      {
        id: 'ask-directions-line-02',
        speaker: 'Local',
        hanzi: '在前面，往左拐，从B出口进去。',
        pinyin: 'Zài qiánmiàn, wǎng zuǒ guǎi, cóng B chūkǒu jìnqù.',
        translation: {
          en: 'It is ahead. Turn left and go in through Exit B.',
          fr: 'C’est devant. Tournez à gauche et entrez par la sortie B.',
        },
        explanation: {
          en: '出口 means exit; metro directions often mention an exit letter or number.',
          fr: '出口 signifie sortie ; les indications de métro mentionnent souvent une lettre ou un numéro de sortie.',
        },
        audio: '/audio/ask-directions/line-02.mp3',
      },
      {
        id: 'ask-directions-line-03',
        speaker: 'Traveler',
        hanzi: '我想买票去人民广场，坐几号线？',
        pinyin: 'Wǒ xiǎng mǎi piào qù Rénmín Guǎngchǎng, zuò jǐ hào xiàn?',
        translation: {
          en: 'I want to buy a ticket to People’s Square. Which line should I take?',
          fr: 'Je veux acheter un ticket pour la place du Peuple. Quelle ligne dois-je prendre ?',
        },
        explanation: {
          en: '买票 means to buy a ticket, and 几号线 asks which numbered subway line.',
          fr: '买票 signifie acheter un ticket, et 几号线 demande quelle ligne numérotée prendre.',
        },
        audio: '/audio/ask-directions/line-03.mp3',
      },
      {
        id: 'ask-directions-line-04',
        speaker: 'Local',
        hanzi: '先买一张地铁票，坐二号线，到中山路换乘一号线。',
        pinyin: 'Xiān mǎi yì zhāng dìtiě piào, zuò èr hào xiàn, dào Zhōngshān Lù huànchéng yī hào xiàn.',
        translation: {
          en: 'First buy a subway ticket, take Line 2, and transfer to Line 1 at Zhongshan Road.',
          fr: 'Achetez d’abord un ticket de métro, prenez la ligne 2, puis faites une correspondance vers la ligne 1 à Zhongshan Road.',
        },
        explanation: {
          en: '换乘 means to transfer from one line to another.',
          fr: '换乘 signifie faire une correspondance d’une ligne à une autre.',
        },
        audio: '/audio/ask-directions/line-04.mp3',
      },
      {
        id: 'ask-directions-line-05',
        speaker: 'Traveler',
        hanzi: '好的，谢谢你！',
        pinyin: 'Hǎo de, xièxie nǐ!',
        translation: {
          en: 'Got it. Thank you!',
          fr: 'D’accord. Merci !',
        },
        explanation: {
          en: 'A short thank-you closes the exchange naturally.',
          fr: 'Un merci court termine naturellement l’échange.',
        },
        audio: '/audio/ask-directions/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'ask-directions-pattern-1',
      pattern: '…在哪儿？',
      meaning: {
        en: 'Where is ...?',
        fr: 'Où est ... ?',
      },
      example: '厕所在哪儿？',
      explanation: {
        en: 'Attach a place before 在哪儿 to ask for its location.',
        fr: 'Ajoute un lieu avant 在哪儿 pour demander où il se trouve.',
      },
    },
    {
      id: 'ask-directions-pattern-2',
      pattern: '坐几号线？',
      meaning: {
        en: 'Which line should I take?',
        fr: 'Quelle ligne dois-je prendre ?',
      },
      example: '去人民广场坐几号线？',
      explanation: {
        en: 'Use this when choosing the correct subway or bus line.',
        fr: 'Utilise cette question pour choisir la bonne ligne de métro ou de bus.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'ask-directions-vocab-1',
      hanzi: '地铁站',
      pinyin: 'dìtiě zhàn',
      meaning: 'subway station',
      explanation: {
        en: 'A practical travel word for moving around a city.',
        fr: 'Un mot pratique de voyage pour se déplacer en ville.',
      },
    },
    {
      id: 'ask-directions-vocab-2',
      hanzi: '买票',
      pinyin: 'mǎi piào',
      meaning: {
        en: 'buy a ticket',
        fr: 'acheter un ticket',
      },
      explanation: {
        en: 'Useful at subway stations, train stations, and ticket counters.',
        fr: 'Utile dans les stations de métro, les gares et les guichets.',
      },
    },
    {
      id: 'ask-directions-vocab-3',
      hanzi: '换乘',
      pinyin: 'huànchéng',
      meaning: {
        en: 'transfer',
        fr: 'faire une correspondance',
      },
      explanation: {
        en: 'Use it when changing from one subway line to another.',
        fr: 'Utilise-le quand tu changes d’une ligne de métro à une autre.',
      },
    },
    {
      id: 'ask-directions-vocab-4',
      hanzi: '出口',
      pinyin: 'chūkǒu',
      meaning: {
        en: 'exit',
        fr: 'sortie',
      },
      explanation: {
        en: 'Subway stations often label exits with letters or numbers.',
        fr: 'Les stations de métro indiquent souvent les sorties avec des lettres ou des numéros.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'ask-directions-pronunciation-1',
      focus: 'Retroflex ending',
      tip: 'Keep 儿 light at the end of 哪儿.',
      explanation: {
        en: 'The ending can be soft and brief in everyday speech.',
        fr: 'La finale peut rester légère et brève dans la langue courante.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'ask-directions-hanzi-1',
      hanzi: '前',
      pinyin: 'qián',
      meaning: 'front / ahead',
      explanation: {
        en: 'Recognize 前 in direction signs and location phrases.',
        fr: 'Reconnais 前 dans les panneaux et les indications de lieu.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'ask-directions-listening-1',
        prompt: {
          en: 'Which sentence mentions the correct exit?',
          fr: 'Quelle phrase mentionne la bonne sortie ?',
        },
        target: '从B出口进去。',
        explanation: {
          en: 'Listen for 出口 when someone explains where to enter or leave.',
          fr: 'Écoute 出口 quand quelqu’un explique par où entrer ou sortir.',
        },
      },
    ],
    speaking: [
      {
        id: 'ask-directions-speaking-1',
        prompt: {
          en: 'Ask which subway line to take.',
          fr: 'Demande quelle ligne de métro prendre.',
        },
        target: '请问，地铁站在哪儿？',
        explanation: {
          en: 'You can swap in 去人民广场坐几号线？ when asking for a specific destination.',
          fr: 'Tu peux remplacer par 去人民广场坐几号线？ pour demander un trajet précis.',
        },
      },
    ],
    reading: [
      {
        id: 'ask-directions-reading-1',
        prompt: {
          en: 'Read aloud: 换乘一号线',
          fr: 'Lis à voix haute : 换乘一号线',
        },
        target: 'Huànchéng yī hào xiàn',
        explanation: {
          en: 'Practice the transfer phrase used in subway directions.',
          fr: 'Entraîne-toi avec l’expression de correspondance utilisée dans le métro.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'ask-directions-review-1',
      front: '在哪儿？',
      back: {
        en: 'Where is it?',
        fr: 'Où est-ce ?',
      },
      explanation: {
        en: 'Use it when asking for locations.',
        fr: 'Utilise-le pour demander un emplacement.',
      },
    },
  ],
  shortInput: {
    id: 'ask-directions-short-input-01',
    prompt: {
      en: 'Type the phrase for “Where is the subway station?”',
      fr: 'Tape la phrase pour « Où est la station de métro ? »',
    },
    target: '地铁站在哪儿？',
    explanation: {
      en: 'Name the place clearly before 在哪儿 so the question is unambiguous.',
      fr: 'Nomme clairement le lieu avant 在哪儿 pour que la question soit sans ambiguïté.',
    },
    audio: '/audio/ask-directions/short-input-01.mp3',
  },
}
