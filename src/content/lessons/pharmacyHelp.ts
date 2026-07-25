import type { LessonContent } from '../types'

export const pharmacyHelpLesson: LessonContent = {
  id: 'pharmacy-help',
  title: {
    en: 'Ask for help at a pharmacy',
    fr: 'Demander de l’aide à la pharmacie',
  },
  scenario: {
    en: 'Tell a pharmacy clerk you have a headache, answer whether you have a fever, understand medicine frequency, and ask the price.',
    fr: 'Dire au pharmacien que tu as mal à la tête, répondre si tu as de la fièvre, comprendre la fréquence du médicament et demander le prix.',
  },
  dialogue: {
    title: {
      en: 'Describe a mild symptom',
      fr: 'Décrire un symptôme léger',
    },
    lines: [
      {
        id: 'pharmacy-help-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好，我头疼。',
        pinyin: 'Nǐ hǎo, wǒ tóu téng.',
        translation: {
          en: 'Hello, my head hurts.',
          fr: 'Bonjour, j’ai mal à la tête.',
        },
        explanation: {
          en: '我……疼 is a simple way to name a mild pain.',
          fr: '我……疼 est une façon simple de nommer une douleur légère.',
        },
        audio: '/audio/pharmacy-help/line-01.mp3',
      },
      {
        id: 'pharmacy-help-line-02',
        speaker: {
          en: 'Pharmacist',
          fr: 'Pharmacien',
        },
        hanzi: '你发烧吗？',
        pinyin: 'Nǐ fāshāo ma?',
        translation: {
          en: 'Do you have a fever?',
          fr: 'Avez-vous de la fièvre ?',
        },
        explanation: {
          en: 'The clerk asks a yes/no symptom question with 吗.',
          fr: 'Le pharmacien pose une question oui/non sur un symptôme avec 吗.',
        },
        audio: '/audio/pharmacy-help/line-02.mp3',
      },
      {
        id: 'pharmacy-help-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '不发烧。',
        pinyin: 'Bù fāshāo.',
        translation: {
          en: 'No fever.',
          fr: 'Pas de fièvre.',
        },
        explanation: {
          en: 'A short negative answer is enough for this beginner exchange.',
          fr: 'Une réponse négative courte suffit pour cet échange débutant.',
        },
        audio: '/audio/pharmacy-help/line-03.mp3',
      },
      {
        id: 'pharmacy-help-line-04',
        speaker: {
          en: 'Pharmacist',
          fr: 'Pharmacien',
        },
        hanzi: '这个药，一天两次。',
        pinyin: 'Zhège yào, yì tiān liǎng cì.',
        translation: {
          en: 'This medicine, twice a day.',
          fr: 'Ce médicament, deux fois par jour.',
        },
        explanation: {
          en: '一天两次 gives the frequency without complex medical wording.',
          fr: '一天两次 donne la fréquence sans vocabulaire médical complexe.',
        },
        audio: '/audio/pharmacy-help/line-04.mp3',
      },
      {
        id: 'pharmacy-help-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '多少钱？谢谢。',
        pinyin: 'Duōshao qián? Xièxie.',
        translation: {
          en: 'How much is it? Thank you.',
          fr: 'Combien ça coûte ? Merci.',
        },
        explanation: {
          en: 'The price question closes the pharmacy interaction politely.',
          fr: 'La question du prix termine poliment l’échange à la pharmacie.',
        },
        audio: '/audio/pharmacy-help/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'pharmacy-help-pattern-1',
      pattern: '我……疼。',
      meaning: {
        en: 'My ... hurts.',
        fr: 'J’ai mal à ...',
      },
      example: '我头疼。',
      audio: '/audio/pharmacy-help/pattern-01.mp3',
      explanation: {
        en: 'Put the body part before 疼 for a simple symptom.',
        fr: 'Place la partie du corps avant 疼 pour un symptôme simple.',
      },
    },
    {
      id: 'pharmacy-help-pattern-2',
      pattern: '你……吗？',
      meaning: {
        en: 'Do you ...?',
        fr: 'Est-ce que vous ... ?',
      },
      example: '你发烧吗？',
      audio: '/audio/pharmacy-help/pattern-02.mp3',
      explanation: {
        en: 'Listen for 吗 when a clerk asks a yes/no health question.',
        fr: 'Écoute 吗 quand un employé pose une question de santé oui/non.',
      },
    },
    {
      id: 'pharmacy-help-pattern-3',
      pattern: '一天……次。',
      meaning: {
        en: '... times a day.',
        fr: '... fois par jour.',
      },
      example: '一天两次。',
      audio: '/audio/pharmacy-help/pattern-03.mp3',
      explanation: {
        en: 'This common dosing phrase appears on instructions and in speech.',
        fr: 'Cette phrase de dosage courante apparaît dans les consignes et à l’oral.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'pharmacy-help-vocab-1',
      hanzi: '药店',
      pinyin: 'yàodiàn',
      audio: '/audio/pharmacy-help/vocab-01.mp3',
      meaning: {
        en: 'pharmacy',
        fr: 'pharmacie',
      },
      explanation: {
        en: 'The place to ask for simple medicine help.',
        fr: 'Le lieu pour demander une aide simple avec un médicament.',
      },
    },
    {
      id: 'pharmacy-help-vocab-2',
      hanzi: '药',
      pinyin: 'yào',
      audio: '/audio/pharmacy-help/vocab-02.mp3',
      meaning: {
        en: 'medicine',
        fr: 'médicament',
      },
      explanation: {
        en: 'A core word in pharmacy instructions.',
        fr: 'Un mot essentiel dans les consignes de pharmacie.',
      },
    },
    {
      id: 'pharmacy-help-vocab-3',
      hanzi: '头疼',
      pinyin: 'tóu téng',
      audio: '/audio/pharmacy-help/vocab-03.mp3',
      meaning: {
        en: 'headache',
        fr: 'mal à la tête',
      },
      explanation: {
        en: 'The mild symptom used in the dialogue.',
        fr: 'Le symptôme léger utilisé dans le dialogue.',
      },
    },
    {
      id: 'pharmacy-help-vocab-4',
      hanzi: '发烧',
      pinyin: 'fāshāo',
      audio: '/audio/pharmacy-help/vocab-04.mp3',
      meaning: {
        en: 'to have a fever',
        fr: 'avoir de la fièvre',
      },
      explanation: {
        en: 'A common follow-up symptom question.',
        fr: 'Une question de symptôme fréquente.',
      },
    },
    {
      id: 'pharmacy-help-vocab-5',
      hanzi: '过敏',
      pinyin: 'guòmǐn',
      audio: '/audio/pharmacy-help/vocab-05.mp3',
      meaning: {
        en: 'allergy / allergic',
        fr: 'allergie / allergique',
      },
      explanation: {
        en: 'A safety word to recognize even in a mild-health lesson.',
        fr: 'Un mot de sécurité à reconnaître même dans une leçon de santé légère.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'pharmacy-help-pronunciation-1',
      focus: {
        en: 'Short symptom words',
        fr: 'Mots courts de symptômes',
      },
      audioText: '头疼，发烧，不发烧，一天两次',
      audio: '/audio/pharmacy-help/pronunciation-01.mp3',
      tip: {
        en: 'Keep symptom words short and clear; repeat 不发烧 as one calm answer.',
        fr: 'Garde les mots de symptômes courts et clairs ; répète 不发烧 comme une réponse calme.',
      },
      explanation: {
        en: 'Clarity matters more than speed in pharmacy phrases.',
        fr: 'La clarté compte plus que la vitesse dans les phrases de pharmacie.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'pharmacy-help-hanzi-1',
      hanzi: '药',
      pinyin: 'yào',
      meaning: {
        en: 'medicine',
        fr: 'médicament',
      },
      explanation: {
        en: 'Recognize it in 药店 and 这个药.',
        fr: 'Reconnais-le dans 药店 et 这个药.',
      },
    },
    {
      id: 'pharmacy-help-hanzi-2',
      hanzi: '头',
      pinyin: 'tóu',
      meaning: {
        en: 'head',
        fr: 'tête',
      },
      explanation: {
        en: 'It starts 头疼.',
        fr: 'Il commence 头疼.',
      },
    },
    {
      id: 'pharmacy-help-hanzi-3',
      hanzi: '疼',
      pinyin: 'téng',
      meaning: {
        en: 'hurt / ache',
        fr: 'faire mal',
      },
      explanation: {
        en: 'Use it after a body part for pain.',
        fr: 'Utilise-le après une partie du corps pour une douleur.',
      },
    },
    {
      id: 'pharmacy-help-hanzi-4',
      hanzi: '烧',
      pinyin: 'shāo',
      meaning: {
        en: 'fever / burn',
        fr: 'fièvre / brûler',
      },
      explanation: {
        en: 'It appears in 发烧.',
        fr: 'Il apparaît dans 发烧.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'pharmacy-help-listening-1',
        prompt: {
          en: 'Listen for headache and no fever.',
          fr: 'Écoute “mal à la tête” et “pas de fièvre”.',
        },
        target: '我头疼，不发烧。',
        audio: '/audio/pharmacy-help/practice-listening-01.mp3',
        explanation: {
          en: 'This combines the symptom and the negative fever answer.',
          fr: 'Cela combine le symptôme et la réponse négative sur la fièvre.',
        },
      },
    ],
    speaking: [
      {
        id: 'pharmacy-help-speaking-1',
        prompt: {
          en: 'Say that your head hurts.',
          fr: 'Dis que tu as mal à la tête.',
        },
        target: '我头疼。',
        audio: '/audio/pharmacy-help/practice-speaking-01.mp3',
        explanation: {
          en: 'Start with the shortest clear symptom sentence.',
          fr: 'Commence par la phrase de symptôme la plus courte et claire.',
        },
      },
    ],
    reading: [
      {
        id: 'pharmacy-help-reading-1',
        prompt: {
          en: 'Read the medicine frequency phrase.',
          fr: 'Lis la phrase de fréquence du médicament.',
        },
        target: '一天两次。',
        audio: '/audio/pharmacy-help/practice-reading-01.mp3',
        explanation: {
          en: 'Recognize how many times per day the medicine is used.',
          fr: 'Reconnais combien de fois par jour le médicament est utilisé.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'pharmacy-help-review-1',
      front: '药店',
      back: {
        en: 'pharmacy',
        fr: 'pharmacie',
      },
      explanation: {
        en: 'The place for the help request.',
        fr: 'Le lieu de la demande d’aide.',
      },
    },
    {
      id: 'pharmacy-help-review-2',
      front: '头疼',
      back: {
        en: 'headache',
        fr: 'mal à la tête',
      },
      explanation: {
        en: 'Say 我头疼 to report it.',
        fr: 'Dis 我头疼 pour le signaler.',
      },
    },
    {
      id: 'pharmacy-help-review-3',
      front: '一天两次',
      back: {
        en: 'twice a day',
        fr: 'deux fois par jour',
      },
      explanation: {
        en: 'A common medicine frequency.',
        fr: 'Une fréquence courante pour un médicament.',
      },
    },
  ],
  shortInput: {
    id: 'pharmacy-help-short-input-01',
    prompt: {
      en: 'Say that your head hurts and you do not have a fever.',
      fr: 'Dis que tu as mal à la tête et pas de fièvre.',
    },
    target: '我头疼，不发烧。',
    explanation: {
      en: 'This gives a mild symptom and a clear no-fever answer.',
      fr: 'Cela donne un symptôme léger et une réponse claire sans fièvre.',
    },
    audio: '/audio/pharmacy-help/short-input-01.mp3',
  },
}
