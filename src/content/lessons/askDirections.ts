import type { LessonContent } from '../types'

export const askDirectionsLesson: LessonContent = {
  id: 'ask-directions',
  title: {
    en: 'Ask for directions',
    fr: 'Demander son chemin',
  },
  scenario: {
    en: 'Asking where a nearby station is and understanding a simple answer.',
    fr: 'Demander où se trouve une station proche et comprendre une réponse simple.',
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
        hanzi: '在前面。',
        pinyin: 'Zài qiánmiàn.',
        translation: {
          en: 'It is ahead.',
          fr: 'C’est devant.',
        },
        explanation: {
          en: '前面 means in front or straight ahead.',
          fr: '前面 signifie devant ou tout droit.',
        },
        audio: '/audio/ask-directions/line-02.mp3',
      },
      {
        id: 'ask-directions-line-03',
        speaker: 'Traveler',
        hanzi: '要走很远吗？',
        pinyin: 'Yào zǒu hěn yuǎn ma?',
        translation: {
          en: 'Do I need to walk far?',
          fr: 'Je dois marcher loin ?',
        },
        explanation: {
          en: 'This follow-up checks whether the destination is still far away.',
          fr: 'Cette question de suivi vérifie si la destination est encore loin.',
        },
        audio: '/audio/ask-directions/line-03.mp3',
      },
      {
        id: 'ask-directions-line-04',
        speaker: 'Local',
        hanzi: '不远，往左拐就到了。',
        pinyin: 'Bù yuǎn, wǎng zuǒ guǎi jiù dào le.',
        translation: {
          en: 'Not far—turn left and you will arrive.',
          fr: 'Ce n’est pas loin — tournez à gauche et vous arriverez.',
        },
        explanation: {
          en: 'The answer reassures you and adds one extra direction step.',
          fr: 'La réponse te rassure et ajoute une étape de direction en plus.',
        },
        audio: '/audio/ask-directions/line-04.mp3',
      },
      {
        id: 'ask-directions-line-05',
        speaker: 'Traveler',
        hanzi: '谢谢你！',
        pinyin: 'Xièxie nǐ!',
        translation: {
          en: 'Thank you!',
          fr: 'Merci !',
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
      meaning: 'Where is ...?',
      example: '厕所在哪儿？',
      explanation: {
        en: 'Attach a place before 在哪儿 to ask for its location.',
        fr: 'Ajoute un lieu avant 在哪儿 pour demander où il se trouve.',
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
        prompt: 'Which line answers the direction question?',
        target: '在前面。',
        explanation: {
          en: 'Listen for the short location answer.',
          fr: 'Écoute la réponse courte qui indique l’emplacement.',
        },
      },
    ],
    speaking: [
      {
        id: 'ask-directions-speaking-1',
        prompt: 'Ask where the subway station is.',
        target: '请问，地铁站在哪儿？',
        explanation: {
          en: 'Start politely, then ask the full location question.',
          fr: 'Commence poliment puis pose la question complète sur le lieu.',
        },
      },
    ],
    reading: [
      {
        id: 'ask-directions-reading-1',
        prompt: 'Read aloud: 谢谢你！',
        target: 'Xièxie nǐ!',
        explanation: {
          en: 'Practice the common closing thank-you.',
          fr: 'Entraîne-toi à dire le merci de clôture.',
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
    prompt: 'Type the phrase for “Where is the station?”',
    target: '站在哪儿？',
    explanation: {
      en: 'Keep the location question pattern and swap in the place.',
      fr: 'Garde la structure de question et remplace simplement le lieu.',
    },
    audio: '/audio/ask-directions/short-input-01.mp3',
  },
}
