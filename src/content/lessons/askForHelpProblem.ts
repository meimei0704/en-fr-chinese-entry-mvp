import type { LessonContent } from '../types.js'

export const askForHelpProblemLesson: LessonContent = {
  id: 'ask-for-help-problem',
  title: {
    en: 'Ask for help with a problem',
    fr: 'Demander de l’aide pour un problème',
  },
  scenario: {
    en: 'Ask for help with a phone, payment, battery, or lost-item problem, explain what is wrong, ask to speak slowly, and request practical solutions like WiFi or a charger.',
    fr: 'Demander de l’aide pour un téléphone, un paiement, une batterie ou un objet perdu, expliquer ce qui ne va pas, demander de parler lentement et solliciter des solutions pratiques comme le WiFi ou un chargeur.',
  },
  dialogue: {
    title: {
      en: 'Solve a phone problem and ask for practical help',
      fr: 'Résoudre un problème de téléphone et demander une aide pratique',
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
        hanzi: '我帮你看一下。手机还有电吗？',
        pinyin: 'Wǒ bāng nǐ kàn yíxià. Shǒujī hái yǒu diàn ma?',
        translation: {
          en: 'I\'ll take a look. Does your phone still have battery?',
          fr: 'Je vais regarder. Votre téléphone a-t-il encore de la batterie ?',
        },
        explanation: {
          en: '还有电吗 is a practical check before troubleshooting further.',
          fr: '还有电吗 est une vérification pratique avant de dépanner davantage.',
        },
        audio: '/audio/ask-for-help-problem/line-04.mp3',
      },
      {
        id: 'ask-for-help-problem-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '快没电了。这里有无线网吗？',
        pinyin: 'Kuài méi diàn le. Zhèlǐ yǒu wúxiànwǎng ma?',
        translation: {
          en: 'Almost out of battery. Is there WiFi here?',
          fr: 'Presque plus de batterie. Y a-t-il du WiFi ici ?',
        },
        explanation: {
          en: '快没电了 warns about low battery; 无线网 asks for a WiFi connection.',
          fr: '快没电了 avertit que la batterie est faible ; 无线网 demande une connexion WiFi.',
        },
        audio: '/audio/ask-for-help-problem/line-05.mp3',
      },
      {
        id: 'ask-for-help-problem-line-06',
        speaker: { en: 'Helper', fr: 'Aide' },
        hanzi: '有，密码在那边。可以充电吗？',
        pinyin: 'Yǒu, mìmǎ zài nàbiān. Kěyǐ chōngdiàn ma?',
        translation: {
          en: 'Yes, the password is over there. Can you charge your phone?',
          fr: 'Oui, le mot de passe est là-bas. Pouvez-vous recharger votre téléphone ?',
        },
        explanation: {
          en: '密码 in 那边 is a common response; 充电 asks if you can plug in.',
          fr: '密码在那边 est une réponse courante ; 充电 demande si tu peux brancher.',
        },
        audio: '/audio/ask-for-help-problem/line-06.mp3',
      },
      {
        id: 'ask-for-help-problem-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '可以，可是我没有充电器。',
        pinyin: 'Kěyǐ, kěshì wǒ méiyǒu chōngdiànqì.',
        translation: {
          en: 'Yes I can, but I don\'t have a charger.',
          fr: 'Oui je peux, mais je n\'ai pas de chargeur.',
        },
        explanation: {
          en: '可是 introduces a new obstacle in the help exchange.',
          fr: '可是 introduit un nouvel obstacle dans l\'échange d\'aide.',
        },
        audio: '/audio/ask-for-help-problem/line-07.mp3',
      },
      {
        id: 'ask-for-help-problem-line-08',
        speaker: { en: 'Helper', fr: 'Aide' },
        hanzi: '没关系，我这里有。请慢一点说，不着急。',
        pinyin: 'Méi guānxi, wǒ zhèlǐ yǒu. Qǐng màn yìdiǎn shuō, bù zháojí.',
        translation: {
          en: 'No problem, I have one here. Please speak more slowly, no rush.',
          fr: 'Pas de problème, j\'en ai un ici. Parlez un peu plus lentement, sans vous presser.',
        },
        explanation: {
          en: '没关系 keeps the tone friendly; the helper also encourages slower speech.',
          fr: '没关系 garde un ton amical ; la personne encourage aussi une parole plus lente.',
        },
        audio: '/audio/ask-for-help-problem/line-08.mp3',
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
      pattern: '……还有电吗？',
      meaning: {
        en: 'Does ... still have battery?',
        fr: 'Est-ce que ... a encore de la batterie ?',
      },
      example: '手机还有电吗？',
      audio: '/audio/ask-for-help-problem/pattern-03.mp3',
      explanation: {
        en: 'A practical question when a phone-related problem happens.',
        fr: 'Une question pratique quand un problème de téléphone survient.',
      },
    },
    {
      id: 'ask-for-help-problem-pattern-4',
      pattern: '……快没电了。',
      meaning: { en: '... is almost out of battery.', fr: '... est presque déchargé.' },
      example: '手机快没电了。',
      audio: '/audio/ask-for-help-problem/pattern-04.mp3',
      explanation: {
        en: 'Use 快没电了 to warn that battery is running low.',
        fr: 'Utilise 快没电了 pour avertir que la batterie est presque vide.',
      },
    },
    {
      id: 'ask-for-help-problem-pattern-5',
      pattern: '这里有……吗？',
      meaning: { en: 'Is there ... here?', fr: 'Y a-t-il ... ici ?' },
      example: '这里有无线网吗？',
      audio: '/audio/ask-for-help-problem/pattern-05.mp3',
      explanation: {
        en: 'Ask about an available service or item at a location.',
        fr: 'Demande à propos d\'un service ou d\'un article disponible sur place.',
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
    { id: 'ask-for-help-problem-vocab-6', hanzi: '没电', pinyin: 'méi diàn', audio: '/audio/ask-for-help-problem/vocab-06.mp3', meaning: { en: 'out of battery / no power', fr: 'plus de batterie / pas d\'électricité' }, explanation: { en: 'The key phrase for a dead phone or device.', fr: 'La phrase clé pour un téléphone ou un appareil déchargé.' } },
    { id: 'ask-for-help-problem-vocab-7', hanzi: '无线网', pinyin: 'wúxiànwǎng', audio: '/audio/ask-for-help-problem/vocab-07.mp3', meaning: { en: 'WiFi / wireless network', fr: 'WiFi / réseau sans fil' }, explanation: { en: 'A common word for WiFi you will see on signs.', fr: 'Un mot courant pour le WiFi que tu verras sur les panneaux.' } },
    { id: 'ask-for-help-problem-vocab-8', hanzi: '密码', pinyin: 'mìmǎ', audio: '/audio/ask-for-help-problem/vocab-08.mp3', meaning: { en: 'password / PIN', fr: 'mot de passe / code' }, explanation: { en: 'You will hear this when asking for WiFi access.', fr: 'Tu entendras ce mot en demandant l\'accès au WiFi.' } },
    { id: 'ask-for-help-problem-vocab-9', hanzi: '充电', pinyin: 'chōngdiàn', audio: '/audio/ask-for-help-problem/vocab-09.mp3', meaning: { en: 'charge / recharge', fr: 'charger / recharger' }, explanation: { en: 'The action to restore battery power.', fr: 'L\'action pour restaurer la batterie.' } },
    { id: 'ask-for-help-problem-vocab-10', hanzi: '没关系', pinyin: 'méi guānxi', audio: '/audio/ask-for-help-problem/vocab-10.mp3', meaning: { en: 'no problem / it doesn\'t matter', fr: 'pas de problème / ce n\'est pas grave' }, explanation: { en: 'A friendly phrase to keep the help exchange relaxed.', fr: 'Une phrase amicale pour garder l\'échange d\'aide détendu.' } },
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
      { id: 'ask-for-help-problem-listening-2', prompt: { en: 'Which phrase warns about low battery?', fr: 'Quelle phrase avertit d\'une batterie faible ?' }, target: '快没电了。', audio: '/audio/ask-for-help-problem/practice-listening-02.mp3', explanation: { en: '快没电了 is the warning you say or hear when battery is low.', fr: '快没电了 est l\'avertissement que tu dis ou entends quand la batterie est faible.' } },
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
      { id: 'ask-for-help-problem-speaking-2', prompt: { en: 'Ask if there is WiFi here.', fr: 'Demande s\'il y a du WiFi ici.' }, target: '这里有WiFi吗？', audio: '/audio/ask-for-help-problem/practice-speaking-02.mp3', explanation: { en: 'A practical question when you need internet access.', fr: 'Une question pratique quand tu as besoin d\'accès internet.' } },
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
      { id: 'ask-for-help-problem-reading-2', prompt: { en: 'Match the phrase for "no problem".', fr: 'Associe la phrase pour "pas de problème".' }, target: '没关系', audio: '/audio/ask-for-help-problem/practice-reading-02.mp3', explanation: { en: '没关系 is a friendly go-to reply in many situations.', fr: '没关系 est une réponse amicale passe-partout dans de nombreuses situations.' } },
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
    { id: 'ask-for-help-problem-review-4', front: '没电', back: { en: 'out of battery', fr: 'plus de batterie' }, explanation: { en: 'Say this when your phone is dead.', fr: 'Dis ceci quand ton téléphone est déchargé.' } },
    { id: 'ask-for-help-problem-review-5', front: '密码', back: { en: 'password', fr: 'mot de passe' }, explanation: { en: 'Ask for this when connecting to WiFi.', fr: 'Demande ceci pour te connecter au WiFi.' } },
    { id: 'ask-for-help-problem-review-6', front: '没关系', back: { en: 'no problem', fr: 'pas de problème' }, explanation: { en: 'A friendly reply that keeps the exchange relaxed.', fr: 'Une réponse amicale qui garde l\'échange détendu.' } },
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
