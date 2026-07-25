import type { LessonContent } from '../types'

export const askForHelpProblemLesson: LessonContent = {
  id: 'ask-for-help-problem',
  title: {
    en: 'Ask for help with a problem',
    fr: 'Demander de l’aide pour un problème',
  },
  scenario: {
    en: 'Ask politely for help, explain that your phone has a payment problem, and ask the other person to speak more slowly.',
    fr: 'Demander poliment de l’aide, expliquer que ton téléphone a un problème de paiement et demander à l’autre personne de parler plus lentement.',
  },
  dialogue: {
    title: {
      en: 'Get help with a phone payment problem',
      fr: 'Obtenir de l’aide pour un problème de paiement mobile',
    },
    lines: [
      {
        id: 'ask-for-help-problem-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好，可以帮我一下吗？',
        pinyin: 'Nǐ hǎo, kěyǐ bāng wǒ yíxià ma?',
        translation: {
          en: 'Hello, could you help me for a moment?',
          fr: 'Bonjour, pouvez-vous m’aider un instant ?',
        },
        explanation: {
          en: '可以帮我一下吗 is polite and short when you need help.',
          fr: '可以帮我一下吗 est poli et court quand tu as besoin d’aide.',
        },
        audio: '/audio/ask-for-help-problem/line-01.mp3',
      },
      {
        id: 'ask-for-help-problem-line-02',
        speaker: {
          en: 'Helper',
          fr: 'Aide',
        },
        hanzi: '怎么了？',
        pinyin: 'Zěnme le?',
        translation: {
          en: 'What happened?',
          fr: 'Qu’est-ce qui se passe ?',
        },
        explanation: {
          en: 'This common question invites you to explain the problem.',
          fr: 'Cette question courante t’invite à expliquer le problème.',
        },
        audio: '/audio/ask-for-help-problem/line-02.mp3',
      },
      {
        id: 'ask-for-help-problem-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我的手机有问题，不能支付。',
        pinyin: 'Wǒ de shǒujī yǒu wèntí, bù néng zhīfù.',
        translation: {
          en: 'My phone has a problem and cannot pay.',
          fr: 'Mon téléphone a un problème et ne peut pas payer.',
        },
        explanation: {
          en: '我的……有问题 names the item; 不能支付 names the payment issue.',
          fr: '我的……有问题 nomme l’objet ; 不能支付 nomme le problème de paiement.',
        },
        audio: '/audio/ask-for-help-problem/line-03.mp3',
      },
      {
        id: 'ask-for-help-problem-line-04',
        speaker: {
          en: 'Helper',
          fr: 'Aide',
        },
        hanzi: '我帮你看一下。',
        pinyin: 'Wǒ bāng nǐ kàn yíxià.',
        translation: {
          en: 'I’ll help you take a look.',
          fr: 'Je vais regarder pour vous aider.',
        },
        explanation: {
          en: '看一下 signals a quick check, not a long technical conversation.',
          fr: '看一下 indique une vérification rapide, pas une longue conversation technique.',
        },
        audio: '/audio/ask-for-help-problem/line-04.mp3',
      },
      {
        id: 'ask-for-help-problem-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请慢一点说，谢谢。',
        pinyin: 'Qǐng màn yìdiǎn shuō, xièxie.',
        translation: {
          en: 'Please speak a little more slowly, thank you.',
          fr: 'Parlez un peu plus lentement, s’il vous plaît. Merci.',
        },
        explanation: {
          en: '请慢一点说 helps when the helper answers too quickly.',
          fr: '请慢一点说 aide quand la personne répond trop vite.',
        },
        audio: '/audio/ask-for-help-problem/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'ask-for-help-problem-pattern-1',
      pattern: '可以帮我……吗？',
      meaning: {
        en: 'Could you help me ...?',
        fr: 'Pouvez-vous m’aider à ... ?',
      },
      example: '可以帮我一下吗？',
      audio: '/audio/ask-for-help-problem/pattern-01.mp3',
      explanation: {
        en: 'Use this to open a polite help request.',
        fr: 'Utilise cette structure pour ouvrir une demande d’aide polie.',
      },
    },
    {
      id: 'ask-for-help-problem-pattern-2',
      pattern: '我的……有问题。',
      meaning: {
        en: 'My ... has a problem.',
        fr: 'Mon / ma ... a un problème.',
      },
      example: '我的手机有问题。',
      audio: '/audio/ask-for-help-problem/pattern-02.mp3',
      explanation: {
        en: 'Name the thing first, then say 有问题.',
        fr: 'Nomme d’abord la chose, puis dis 有问题.',
      },
    },
    {
      id: 'ask-for-help-problem-pattern-3',
      pattern: '请……一点。',
      meaning: {
        en: 'Please ... a little.',
        fr: 'Veuillez ... un peu.',
      },
      example: '请慢一点说。',
      audio: '/audio/ask-for-help-problem/pattern-03.mp3',
      explanation: {
        en: 'This makes a repair request when speech is too fast.',
        fr: 'Cela sert à réparer l’échange quand la parole est trop rapide.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'ask-for-help-problem-vocab-1',
      hanzi: '帮忙',
      pinyin: 'bāngmáng',
      audio: '/audio/ask-for-help-problem/vocab-01.mp3',
      meaning: {
        en: 'help',
        fr: 'aide / aider',
      },
      explanation: {
        en: 'The core idea behind 帮我一下.',
        fr: 'L’idée centrale derrière 帮我一下.',
      },
    },
    {
      id: 'ask-for-help-problem-vocab-2',
      hanzi: '问题',
      pinyin: 'wèntí',
      audio: '/audio/ask-for-help-problem/vocab-02.mp3',
      meaning: {
        en: 'problem / question',
        fr: 'problème / question',
      },
      explanation: {
        en: 'Use 有问题 to say something is wrong.',
        fr: 'Utilise 有问题 pour dire que quelque chose ne va pas.',
      },
    },
    {
      id: 'ask-for-help-problem-vocab-3',
      hanzi: '手机',
      pinyin: 'shǒujī',
      audio: '/audio/ask-for-help-problem/vocab-03.mp3',
      meaning: {
        en: 'phone',
        fr: 'téléphone',
      },
      explanation: {
        en: 'The object with the problem in this scenario.',
        fr: 'L’objet qui a un problème dans cette situation.',
      },
    },
    {
      id: 'ask-for-help-problem-vocab-4',
      hanzi: '不能',
      pinyin: 'bù néng',
      audio: '/audio/ask-for-help-problem/vocab-04.mp3',
      meaning: {
        en: 'cannot',
        fr: 'ne pas pouvoir',
      },
      explanation: {
        en: 'Use it before a blocked action like 支付.',
        fr: 'Utilise-le avant une action bloquée comme 支付.',
      },
    },
    {
      id: 'ask-for-help-problem-vocab-5',
      hanzi: '慢一点',
      pinyin: 'màn yìdiǎn',
      audio: '/audio/ask-for-help-problem/vocab-05.mp3',
      meaning: {
        en: 'a little slower',
        fr: 'un peu plus lentement',
      },
      explanation: {
        en: 'A repair phrase for understanding spoken Chinese.',
        fr: 'Une phrase de réparation pour comprendre le chinois parlé.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'ask-for-help-problem-pronunciation-1',
      focus: {
        en: 'Stress in urgent short phrases',
        fr: 'Accent dans les phrases courtes urgentes',
      },
      audioText: '帮我一下，有问题，不能支付，请慢一点说',
      audio: '/audio/ask-for-help-problem/pronunciation-01.mp3',
      tip: {
        en: 'Keep each chunk calm and separated so the request sounds polite, not panicked.',
        fr: 'Garde chaque morceau calme et séparé pour que la demande reste polie, pas paniquée.',
      },
      explanation: {
        en: 'Problem phrases work best when they are short and easy to repeat.',
        fr: 'Les phrases de problème fonctionnent mieux quand elles sont courtes et faciles à répéter.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'ask-for-help-problem-hanzi-1',
      hanzi: '帮',
      pinyin: 'bāng',
      meaning: {
        en: 'help',
        fr: 'aider',
      },
      explanation: {
        en: 'It starts 帮我一下.',
        fr: 'Il commence 帮我一下.',
      },
    },
    {
      id: 'ask-for-help-problem-hanzi-2',
      hanzi: '问',
      pinyin: 'wèn',
      meaning: {
        en: 'ask',
        fr: 'demander',
      },
      explanation: {
        en: 'It is the first character of 问题.',
        fr: 'C’est le premier caractère de 问题.',
      },
    },
    {
      id: 'ask-for-help-problem-hanzi-3',
      hanzi: '题',
      pinyin: 'tí',
      meaning: {
        en: 'topic / problem element',
        fr: 'sujet / élément de problème',
      },
      explanation: {
        en: 'It completes 问题.',
        fr: 'Il complète 问题.',
      },
    },
    {
      id: 'ask-for-help-problem-hanzi-4',
      hanzi: '慢',
      pinyin: 'màn',
      meaning: {
        en: 'slow',
        fr: 'lent',
      },
      explanation: {
        en: 'Use it in 慢一点 to ask for slower speech.',
        fr: 'Utilise-le dans 慢一点 pour demander une parole plus lente.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'ask-for-help-problem-listening-1',
        prompt: {
          en: 'Listen for the sentence that says the phone has a problem.',
          fr: 'Écoute la phrase qui dit que le téléphone a un problème.',
        },
        target: '我的手机有问题，不能支付。',
        audio: '/audio/ask-for-help-problem/practice-listening-01.mp3',
        explanation: {
          en: 'This is the key explanation after asking for help.',
          fr: 'C’est l’explication clé après la demande d’aide.',
        },
      },
    ],
    speaking: [
      {
        id: 'ask-for-help-problem-speaking-1',
        prompt: {
          en: 'Ask someone to help you for a moment.',
          fr: 'Demande à quelqu’un de t’aider un instant.',
        },
        target: '可以帮我一下吗？',
        audio: '/audio/ask-for-help-problem/practice-speaking-01.mp3',
        explanation: {
          en: 'Open with the polite request before explaining the issue.',
          fr: 'Commence par la demande polie avant d’expliquer le problème.',
        },
      },
    ],
    reading: [
      {
        id: 'ask-for-help-problem-reading-1',
        prompt: {
          en: 'Read the slower-speech request.',
          fr: 'Lis la demande de parler plus lentement.',
        },
        target: '请慢一点说。',
        audio: '/audio/ask-for-help-problem/practice-reading-01.mp3',
        explanation: {
          en: 'This helps you keep the conversation understandable.',
          fr: 'Cela t’aide à garder la conversation compréhensible.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'ask-for-help-problem-review-1',
      front: '帮我一下',
      back: {
        en: 'help me for a moment',
        fr: 'aidez-moi un instant',
      },
      explanation: {
        en: 'A polite core help request.',
        fr: 'Une demande d’aide centrale et polie.',
      },
    },
    {
      id: 'ask-for-help-problem-review-2',
      front: '有问题',
      back: {
        en: 'has a problem',
        fr: 'a un problème',
      },
      explanation: {
        en: 'Use it after the item with the issue.',
        fr: 'Utilise-le après l’objet qui pose problème.',
      },
    },
    {
      id: 'ask-for-help-problem-review-3',
      front: '慢一点',
      back: {
        en: 'a little slower',
        fr: 'un peu plus lentement',
      },
      explanation: {
        en: 'A repair phrase when speech is too fast.',
        fr: 'Une phrase de réparation si la parole est trop rapide.',
      },
    },
  ],
  shortInput: {
    id: 'ask-for-help-problem-short-input-01',
    prompt: {
      en: 'Ask someone to help you.',
      fr: 'Demande à quelqu’un de t’aider.',
    },
    target: '可以帮我一下吗？',
    explanation: {
      en: 'This opens the problem-solving exchange politely.',
      fr: 'Cela ouvre l’échange de résolution de problème poliment.',
    },
    audio: '/audio/ask-for-help-problem/short-input-01.mp3',
  },
}
