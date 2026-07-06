import type { LessonContent } from '../types'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: 'Introducing yourself',
    fr: 'Se présenter',
  },
  scenario: {
    en: 'Introducing yourself with your name, where you are from, and a simple identity.',
    fr: 'Se présenter avec son prénom, son origine et une identité simple.',
  },
  dialogue: {
    title: {
      en: 'Say hello, share basic details, and ask back',
      fr: 'Dire bonjour et se présenter',
    },
    lines: [
      {
        id: 'self-intro-line-01',
        speaker: 'A',
        hanzi: '你好！我叫马克。你呢？',
        pinyin: 'Nǐ hǎo! Wǒ jiào Mǎkè. Nǐ ne?',
        translation: {
          en: 'Hi! My name is Mark. And you?',
          fr: 'Salut ! Je m’appelle Mark. Et toi ?',
        },
        explanation: {
          en: 'Combine 你好, 我叫, and 你呢 to open a friendly first exchange.',
          fr: 'Combine 你好, 我叫 et 你呢 pour lancer un premier échange amical.',
        },
        audio: '/audio/self-intro/line-01.mp3',
      },
      {
        id: 'self-intro-line-02',
        speaker: 'B',
        hanzi: '你好！我叫安娜。我来自法国。',
        pinyin: 'Nǐ hǎo! Wǒ jiào Ānnà. Wǒ láizì Fǎguó.',
        translation: {
          en: 'Hi! My name is Anna. I come from France.',
          fr: 'Salut ! Je m’appelle Anna. Je viens de France.',
        },
        explanation: {
          en: 'Use 我来自 followed by a place to say where you are from.',
          fr: 'Utilise 我来自 suivi d’un lieu pour dire d’où tu viens.',
        },
        audio: '/audio/self-intro/line-02.mp3',
      },
      {
        id: 'self-intro-line-03',
        speaker: 'A',
        hanzi: '我是学生。认识你很高兴。',
        pinyin: 'Wǒ shì xuésheng. Rènshi nǐ hěn gāoxìng.',
        translation: {
          en: 'I’m a student. Nice to meet you.',
          fr: 'Je suis étudiant. Ravi de te rencontrer.',
        },
        explanation: {
          en: '我是 plus a role is a simple way to share your identity.',
          fr: '我是 suivi d’un rôle est une façon simple de donner ton identité.',
        },
        audio: '/audio/self-intro/line-03.mp3',
      },
      {
        id: 'self-intro-line-04',
        speaker: 'B',
        hanzi: '我也是学生，认识你很高兴。',
        pinyin: 'Wǒ yě shì xuésheng, rènshi nǐ hěn gāoxìng.',
        translation: {
          en: 'I’m a student too. Nice to meet you.',
          fr: 'Je suis aussi étudiante. Ravie de te rencontrer.',
        },
        explanation: {
          en: '也 means “also” or “too” and helps you connect your answer to the other person.',
          fr: '也 signifie « aussi » et permet de relier ta réponse à celle de l’autre personne.',
        },
        audio: '/audio/self-intro/line-04.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '我叫…',
      meaning: {
        en: 'My name is ...',
        fr: 'Je m’appelle ...',
      },
      example: '我叫马克。',
      explanation: {
        en: 'Place your name after 我叫 to introduce yourself.',
        fr: 'Mets ton prénom après 我叫 pour te présenter.',
      },
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '我来自…',
      meaning: {
        en: 'I come from ...',
        fr: 'Je viens de ...',
      },
      example: '我来自法国。',
      explanation: {
        en: 'Use this pattern to share your country, city, or hometown.',
        fr: 'Utilise cette structure pour indiquer ton pays, ta ville ou ta ville natale.',
      },
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '我是…',
      meaning: {
        en: 'I am ...',
        fr: 'Je suis ...',
      },
      example: '我是学生。',
      explanation: {
        en: 'Add a simple role such as student, teacher, doctor, or engineer.',
        fr: 'Ajoute un rôle simple comme étudiant, professeur, médecin ou ingénieur.',
      },
    },
    {
      id: 'self-intro-pattern-4',
      pattern: '你呢？',
      meaning: {
        en: 'And you?',
        fr: 'Et toi ?',
      },
      example: '我叫安娜。你呢？',
      explanation: {
        en: 'Use 你呢 to invite the other person to answer the same question.',
        fr: 'Utilise 你呢 pour inviter l’autre personne à répondre à la même question.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      meaning: {
        en: 'hello',
        fr: 'bonjour',
      },
      explanation: {
        en: 'A standard greeting for most beginner situations.',
        fr: 'Une salutation standard dans la plupart des situations débutantes.',
      },
    },
    {
      id: 'self-intro-vocab-2',
      hanzi: '来自',
      pinyin: 'láizì',
      meaning: {
        en: 'come from',
        fr: 'venir de',
      },
      explanation: {
        en: 'Use it with places when introducing where you are from.',
        fr: 'Utilise-le avec les lieux pour dire d’où tu viens.',
      },
    },
    {
      id: 'self-intro-vocab-3',
      hanzi: '学生',
      pinyin: 'xuésheng',
      meaning: {
        en: 'student',
        fr: 'étudiant / étudiante',
      },
      explanation: {
        en: 'A high-frequency identity word for beginner introductions.',
        fr: 'Un mot d’identité très fréquent pour les présentations de débutant.',
      },
    },
    {
      id: 'self-intro-vocab-4',
      hanzi: '你呢',
      pinyin: 'nǐ ne',
      meaning: {
        en: 'and you?',
        fr: 'et toi ?',
      },
      explanation: {
        en: 'A short follow-up that keeps the conversation going.',
        fr: 'Une courte relance qui fait continuer la conversation.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'self-intro-pronunciation-1',
      focus: {
        en: 'Third tone in 你好',
        fr: 'Troisième ton dans 你好',
      },
      tip: {
        en: 'Keep 你 low and dipping before rising into 好.',
        fr: 'Garde 你 bas et descendant avant de remonter vers 好.',
      },
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
      meaning: {
        en: 'I / me',
        fr: 'je / moi',
      },
      explanation: {
        en: 'Recognize 我 as the common pronoun for yourself.',
        fr: 'Reconnais 我 comme le pronom courant pour dire je / moi.',
      },
    },
    {
      id: 'self-intro-hanzi-2',
      hanzi: '学',
      pinyin: 'xué',
      meaning: {
        en: 'study / learn',
        fr: 'étudier / apprendre',
      },
      explanation: {
        en: '学 appears in 学生, the word for student.',
        fr: '学 apparaît dans 学生, le mot pour étudiant.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'self-intro-listening-1',
        prompt: {
          en: 'Which line means “I come from France”?',
          fr: 'Quelle phrase signifie « Je viens de France » ?',
        },
        target: '我来自法国。',
        explanation: {
          en: 'Listen for 我来自 followed by the place name.',
          fr: 'Écoute 我来自 suivi du nom du lieu.',
        },
      },
    ],
    speaking: [
      {
        id: 'self-intro-speaking-1',
        prompt: {
          en: 'Say hello, introduce yourself, and ask “and you?”',
          fr: 'Dis bonjour, présente-toi et demande « et toi ? »',
        },
        target: '你好！我叫……。你呢？',
        explanation: {
          en: 'This short turn is more natural than stopping after your name.',
          fr: 'Cette courte réplique est plus naturelle que de s’arrêter après le prénom.',
        },
      },
    ],
    reading: [
      {
        id: 'self-intro-reading-1',
        prompt: {
          en: 'Read this aloud: 我是学生。',
          fr: 'Lis cette phrase à voix haute : 我是学生。',
        },
        target: '我是学生。',
        explanation: {
          en: 'Focus on the identity pattern 我是 plus a role.',
          fr: 'Concentre-toi sur la structure d’identité 我是 suivie d’un rôle.',
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
    prompt: {
      en: 'Type the phrase for “I come from Canada.”',
      fr: 'Tape la phrase pour dire « Je viens du Canada ».',
    },
    target: '我来自加拿大。',
    explanation: {
      en: 'Reuse 我来自 with a different place name.',
      fr: 'Réutilise 我来自 avec un autre nom de lieu.',
    },
    audio: '/audio/self-intro/short-input-01.mp3',
  },
}
