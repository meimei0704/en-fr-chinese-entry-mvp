import type { LessonContent } from '../types'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: 'Self introduction',
    fr: 'Se présenter',
  },
  scenario: {
    en: 'Meeting someone for the first time and exchanging basic details.',
    fr: 'Rencontrer quelqu’un pour la première fois et échanger des informations de base.',
  },
  dialogue: {
    title: {
      en: 'Say hello and introduce yourself',
      fr: 'Dire bonjour et se présenter',
    },
    lines: [
      {
        id: 'self-intro-line-01',
        speaker: 'A',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        translation: {
          en: 'Hello!',
          fr: 'Bonjour !',
        },
        explanation: {
          en: 'Use 你好 as a neutral hello when you meet someone.',
          fr: 'Utilise 你好 comme salutation neutre quand tu rencontres quelqu’un.',
        },
        audio: '/audio/self-intro/line-01.mp3',
      },
      {
        id: 'self-intro-line-02',
        speaker: 'B',
        hanzi: '你好！我叫安娜。',
        pinyin: 'Nǐ hǎo! Wǒ jiào Ānnà.',
        translation: {
          en: 'Hello! My name is Anna.',
          fr: 'Bonjour ! Je m’appelle Anna.',
        },
        explanation: {
          en: 'Reply with another hello, then use 我叫 to share your name.',
          fr: 'Réponds avec une autre salutation puis utilise 我叫 pour donner ton nom.',
        },
        audio: '/audio/self-intro/line-02.mp3',
      },
      {
        id: 'self-intro-line-03',
        speaker: 'A',
        hanzi: '我叫马克。',
        pinyin: 'Wǒ jiào Mǎkè.',
        translation: {
          en: 'My name is Mark.',
          fr: 'Je m’appelle Mark.',
        },
        explanation: {
          en: 'Repeat the same pattern with your own name to keep the exchange going.',
          fr: 'Répète la même structure avec ton propre prénom pour poursuivre l’échange.',
        },
        audio: '/audio/self-intro/line-03.mp3',
      },
      {
        id: 'self-intro-line-04',
        speaker: 'B',
        hanzi: '认识你很高兴。',
        pinyin: 'Rènshi nǐ hěn gāoxìng.',
        translation: {
          en: 'Nice to meet you.',
          fr: 'Ravi de te rencontrer.',
        },
        explanation: {
          en: 'This line politely closes the first introduction.',
          fr: 'Cette phrase termine poliment une première présentation.',
        },
        audio: '/audio/self-intro/line-04.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '我叫…',
      meaning: 'My name is ...',
      example: '我叫马克。',
      explanation: {
        en: 'Place your name after 我叫 to introduce yourself.',
        fr: 'Mets ton prénom après 我叫 pour te présenter.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      meaning: 'hello',
      explanation: {
        en: 'A standard greeting for most beginner situations.',
        fr: 'Une salutation standard dans la plupart des situations débutantes.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'self-intro-pronunciation-1',
      focus: 'Third tone',
      tip: 'Keep 你 low and dipping before rising.',
      explanation: {
        en: 'The third tone often sounds low first, then rises slightly.',
        fr: 'Le troisième ton descend souvent avant de remonter légèrement.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'self-intro-hanzi-1',
      hanzi: '我',
      pinyin: 'wǒ',
      meaning: 'I / me',
      explanation: {
        en: 'Recognize 我 as the common pronoun for yourself.',
        fr: 'Reconnais 我 comme le pronom courant pour dire je / moi.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'self-intro-listening-1',
        prompt: 'Which line means “My name is Anna”?',
        target: '我叫安娜。',
        explanation: {
          en: 'Listen for 我叫 followed by the person’s name.',
          fr: 'Écoute 我叫 suivi du prénom de la personne.',
        },
      },
    ],
    speaking: [
      {
        id: 'self-intro-speaking-1',
        prompt: 'Say hello and introduce yourself.',
        target: '你好！我叫……',
        explanation: {
          en: 'Combine a greeting with your name for a natural opener.',
          fr: 'Combine une salutation avec ton prénom pour commencer naturellement.',
        },
      },
    ],
    reading: [
      {
        id: 'self-intro-reading-1',
        prompt: 'Read this aloud: 认识你很高兴。',
        target: 'Rènshi nǐ hěn gāoxìng.',
        explanation: {
          en: 'Practice reading the full polite closing sentence.',
          fr: 'Entraîne-toi à lire toute la phrase de clôture polie.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'self-intro-review-1',
      front: '我叫',
      back: {
        en: 'My name is',
        fr: 'Je m’appelle',
      },
      explanation: {
        en: 'Use it to start your self-introduction.',
        fr: 'Utilise-le pour commencer ta présentation.',
      },
    },
  ],
  shortInput: {
    id: 'self-intro-short-input-01',
    prompt: 'Type the phrase for “My name is Leo.”',
    target: '我叫里奥。',
    explanation: {
      en: 'Reuse the same pattern with a different name.',
      fr: 'Réutilise la même structure avec un autre prénom.',
    },
    audio: '/audio/self-intro/short-input-01.mp3',
  },
}
