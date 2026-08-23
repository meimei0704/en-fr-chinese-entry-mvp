import type { LessonContent } from '../types.js'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: '到达机场 / Arrival at the airport',
    fr: '到达机场 / Arrivée à l’aéroport',
  },
  scenario: {
    en: 'Find your luggage, go through customs, ask for help to navigate the airport smoothly.',
    fr: 'Récupérez vos bagages, passez la douane et demandez de l’aide pour vous repérer sereinement à l’aéroport.',
  },
  dialogue: {
    title: {
      en: 'Asking for help at the airport',
      fr: 'Demander de l’aide à l’aéroport',
    },
    lines: [
      {
        id: 'self-intro-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请问您会说英语吗？',
        pinyin: 'Qǐng wèn nín huì shuō Yīng yǔ ma?',
        translation: {
          en: 'Do you speak English?',
          fr: 'Parlez-vous anglais ?',
        },
        explanation: {
          en: '问您会说英语吗 politely asks whether someone can speak English when you need help.',
          fr: '问您会说英语吗 demande poliment si quelqu’un parle anglais quand vous avez besoin d’aide.',
        },
        audio: '/audio/self-intro/line-01.mp3',
      },
      {
        id: 'self-intro-line-02',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '行李提取处在哪里？',
        pinyin: 'Xíng li tí qǔ chù zài nǎ lǐ?',
        translation: {
          en: 'Where is baggage claim?',
          fr: 'Où se trouve la récupération des bagages ?',
        },
        explanation: {
          en: '请问…在哪里 is the key pattern for finding places in the airport, and 行李提取处 is baggage claim.',
          fr: '请问…在哪里 est la structure clé pour trouver des lieux à l’aéroport, et 行李提取处 est la récupération des bagages.',
        },
        audio: '/audio/self-intro/line-02.mp3',
      },
      {
        id: 'self-intro-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '您能帮我一下吗？',
        pinyin: 'Nín néng bāng wǒ yí xià ma?',
        translation: {
          en: 'Could you help me, please?',
          fr: 'Pourriez-vous m’aider, s’il vous plaît ?',
        },
        explanation: {
          en: '您能帮我一下吗 politely asks for help using 能 (can) plus 帮 (help).',
          fr: '您能帮我一下吗 demande poliment de l’aide avec 能 (pouvoir) et 帮 (aider).',
        },
        audio: '/audio/self-intro/line-03.mp3',
      },
      {
        id: 'self-intro-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hù zhào.',
        translation: {
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
        },
        explanation: {
          en: '这是我的护照 hands over your passport, the key document at immigration.',
          fr: '这是我的护照 présente votre passeport, le document clé à l’immigration.',
        },
        audio: '/audio/self-intro/line-04.mp3',
      },
      {
        id: 'self-intro-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我是来旅游的。',
        pinyin: 'Wǒ shì lái lǚ yóu de.',
        translation: {
          en: 'I’m here to travel.',
          fr: 'Je suis venu(e) pour le tourisme.',
        },
        explanation: {
          en: '我是来…的 states your purpose for coming; 旅游 means tourism or travel.',
          fr: '我是来…的 indique le motif de votre venue ; 旅游 signifie tourisme.',
        },
        audio: '/audio/self-intro/line-05.mp3',
      },
      {
        id: 'self-intro-line-06',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我大概待两个星期。',
        pinyin: 'Wǒ dà gài dāi liǎng gè xīng qī.',
        translation: {
          en: 'I’ll stay in China for about two weeks.',
          fr: 'Je resterai en Chine environ deux semaines.',
        },
        explanation: {
          en: '大概 means about, 待 means to stay, and 两个星期 is two weeks.',
          fr: '大概 signifie environ, 待 signifie rester, et 两个星期 est deux semaines.',
        },
        audio: '/audio/self-intro/line-06.mp3',
      },
      {
        id: 'self-intro-line-07',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '地铁在哪里？',
        pinyin: 'Dì tiě zài nǎ lǐ?',
        translation: {
          en: 'Where is the subway?',
          fr: 'Où est le métro ?',
        },
        explanation: {
          en: '地铁在哪里 asks where the subway is when you want to leave the airport by metro.',
          fr: '地铁在哪里 demande où est le métro pour quitter l’aéroport.',
        },
        audio: '/audio/self-intro/line-07.mp3',
      },
      {
        id: 'self-intro-line-08',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '机场快线在哪里？',
        pinyin: 'Jī chǎng kuài xiàn zài nǎ lǐ?',
        translation: {
          en: 'Where is the airport express?',
          fr: 'Où est l’express de l’aéroport ?',
        },
        explanation: {
          en: '机场快线 is the airport express train, a fast way into the city.',
          fr: '机场快线 est le train express de l’aéroport, un moyen rapide d’aller en ville.',
        },
        audio: '/audio/self-intro/line-08.mp3',
      },
      {
        id: 'self-intro-line-09',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请问去哪里打车？',
        pinyin: 'Qǐng wèn qù nǎ lǐ dǎ chē?',
        translation: {
          en: 'Where can I get a taxi?',
          fr: 'Où puis-je prendre un taxi ?',
        },
        explanation: {
          en: '去哪里打车 asks where to take a taxi, useful right outside the terminal.',
          fr: '去哪里打车 demande où prendre un taxi, utile juste à la sortie du terminal.',
        },
        audio: '/audio/self-intro/line-09.mp3',
      },
      {
        id: 'self-intro-line-10',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '去这个酒店怎么走？',
        pinyin: 'Qù zhè ge jiǔ diàn zěn me zǒu?',
        translation: {
          en: 'How do I get to this hotel?',
          fr: 'Comment aller à cet hôtel ?',
        },
        explanation: {
          en: '怎么走 asks how to get somewhere; point to the hotel name or address on your phone.',
          fr: '怎么走 demande comment se rendre quelque part ; montrez le nom ou l’adresse de l’hôtel sur votre téléphone.',
        },
        audio: '/audio/self-intro/line-10.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '请问……在哪里？',
      pinyin: 'Qǐng wèn ... zài nǎ lǐ?',
      meaning: {
        en: 'Excuse me, where is ...?',
        fr: 'Excusez-moi, où est ...?',
      },
      audio: '/audio/self-intro/pattern-01.mp3',
      examples: [
        {
          fill: '行李提取处',
          fillPinyin: 'xíngli tíqǔchù',
          hanzi: '请问行李提取处在哪里？',
          pinyin: 'Qǐng wèn xíng li tí qǔ chù zài nǎ lǐ?',
          en: 'baggage claim',
          fr: 'récupération des bagages',
        },
        {
          fill: '卫生间',
          fillPinyin: 'wèishēngjiān',
          hanzi: '请问卫生间在哪里？',
          pinyin: 'Qǐng wèn wèi shēng jiān zài nǎ lǐ?',
          en: 'toilet',
          fr: 'toilettes',
        },
        {
          fill: '机场快线',
          fillPinyin: 'jīchǎng kuàixiàn',
          hanzi: '请问机场快线在哪里？',
          pinyin: 'Qǐng wèn jī chǎng kuài xiàn zài nǎ lǐ?',
          en: 'airport express',
          fr: 'express de l\'aéroport',
        },
      ],
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '您能帮我……吗？',
      pinyin: 'Nín néng bāng wǒ ... ma?',
      meaning: {
        en: 'Could you help me ...?',
        fr: 'Pourriez-vous m\'aider ...?',
      },
      audio: '/audio/self-intro/pattern-02.mp3',
      examples: [
        {
          fill: '一下',
          fillPinyin: 'yíxià',
          hanzi: '您能帮我一下吗？',
          pinyin: 'Nín néng bāng wǒ yí xià ma?',
          en: 'a bit',
          fr: 'un instant',
        },
        {
          fill: '拿行李',
          fillPinyin: 'ná xíngli',
          hanzi: '您能帮我拿行李吗？',
          pinyin: 'Nín néng bāng wǒ ná xíng li ma?',
          en: 'carry my luggage',
          fr: 'porter mes bagages',
        },
        {
          fill: '打个电话',
          fillPinyin: 'dǎ gè diànhuà',
          hanzi: '您能帮我打个电话吗？',
          pinyin: 'Nín néng bāng wǒ dǎ gè diàn huà ma?',
          en: 'make a phone call',
          fr: 'passer un appel',
        },
      ],
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '我是来……的。',
      pinyin: 'Wǒ shì lái ... de.',
      meaning: {
        en: 'I came here to ...',
        fr: 'Je suis venu(e) pour ...',
      },
      audio: '/audio/self-intro/pattern-03.mp3',
      examples: [
        {
          fill: '旅游',
          fillPinyin: 'lǚyóu',
          hanzi: '我是来旅游的。',
          pinyin: 'Wǒ shì lái lǚ yóu de.',
          en: 'travel',
          fr: 'tourisme',
        },
        {
          fill: '工作',
          fillPinyin: 'gōngzuò',
          hanzi: '我是来工作的。',
          pinyin: 'Wǒ shì lái gōng zuò de.',
          en: 'work',
          fr: 'travail',
        },
        {
          fill: '学习',
          fillPinyin: 'xuéxí',
          hanzi: '我是来学习的。',
          pinyin: 'Wǒ shì lái xué xí de.',
          en: 'study',
          fr: 'études',
        },
      ],
    },
    {
      id: 'self-intro-pattern-4',
      pattern: '我大概待……。',
      pinyin: 'Wǒ dà gài dāi ... .',
      meaning: {
        en: 'I\'ll stay about ...',
        fr: 'Je resterai environ ...',
      },
      audio: '/audio/self-intro/pattern-04.mp3',
      examples: [
        {
          fill: '两个星期',
          fillPinyin: 'liǎng gè xīngqī',
          hanzi: '我大概待两个星期。',
          pinyin: 'Wǒ dà gài dāi liǎng gè xīng qī.',
          en: 'two weeks',
          fr: 'deux semaines',
        },
        {
          fill: '一个月',
          fillPinyin: 'yī gè yuè',
          hanzi: '我大概待一个月。',
          pinyin: 'Wǒ dà gài dāi yī gè yuè.',
          en: 'one month',
          fr: 'un mois',
        },
        {
          fill: '三天',
          fillPinyin: 'sān tiān',
          hanzi: '我大概待三天。',
          pinyin: 'Wǒ dà gài dāi sān tiān.',
          en: 'three days',
          fr: 'trois jours',
        },
      ],
    },
    {
      id: 'self-intro-pattern-5',
      pattern: '……怎么走？',
      pinyin: '... zěn me zǒu?',
      meaning: {
        en: 'How do I get to ...?',
        fr: 'Comment aller à ...?',
      },
      audio: '/audio/self-intro/pattern-05.mp3',
      examples: [
        {
          fill: '去这个酒店',
          fillPinyin: 'qù zhège jiǔdiàn',
          hanzi: '去这个酒店怎么走？',
          pinyin: 'Qù zhè ge jiǔ diàn zěn me zǒu?',
          en: 'to this hotel',
          fr: 'à cet hôtel',
        },
        {
          fill: '去火车站',
          fillPinyin: 'qù huǒchēzhàn',
          hanzi: '去火车站怎么走？',
          pinyin: 'Qù huǒ chē zhàn zěn me zǒu?',
          en: 'to the train station',
          fr: 'à la gare',
        },
        {
          fill: '去地铁站',
          fillPinyin: 'qù dìtiě zhàn',
          hanzi: '去地铁站怎么走？',
          pinyin: 'Qù dì tiě zhàn zěn me zǒu?',
          en: 'to the metro station',
          fr: 'à la station de métro',
        },
      ],
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '护照',
      pinyin: 'hù zhào',
      audio: '/audio/self-intro/vocab-01.mp3',
      meaning: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'The key document you hand over at immigration.',
        fr: 'Le document clé à présenter à l’immigration.',
      },
    },
    {
      id: 'self-intro-vocab-2',
      hanzi: '行李提取处',
      pinyin: 'xíng li tí qǔ chù',
      audio: '/audio/self-intro/vocab-02.mp3',
      meaning: {
        en: 'baggage claim',
        fr: 'récupération des bagages',
      },
      explanation: {
        en: 'Where you collect your luggage after landing.',
        fr: 'L’endroit où récupérer vos bagages après l’atterrissage.',
      },
    },
    {
      id: 'self-intro-vocab-3',
      hanzi: '帮我一下',
      pinyin: 'bāng wǒ yí xià',
      audio: '/audio/self-intro/vocab-03.mp3',
      meaning: {
        en: 'help me',
        fr: 'aider',
      },
      explanation: {
        en: 'Use 帮我一下 when asking anyone to give you a hand.',
        fr: 'Utilisez 帮我一下 pour demander un coup de main.',
      },
    },
    {
      id: 'self-intro-vocab-4',
      hanzi: '会说',
      pinyin: 'huì shuō',
      audio: '/audio/self-intro/vocab-04.mp3',
      meaning: {
        en: 'can speak',
        fr: 'savoir parler',
      },
      explanation: {
        en: '会说英语 means can speak English.',
        fr: '会说英语 signifie savoir parler anglais.',
      },
    },
    {
      id: 'self-intro-vocab-5',
      hanzi: '旅游',
      pinyin: 'lǚ yóu',
      audio: '/audio/self-intro/vocab-05.mp3',
      meaning: {
        en: 'tourism / travel',
        fr: 'tourisme / voyage',
      },
      explanation: {
        en: 'The simplest answer when asked 来中国做什么 at immigration.',
        fr: 'La réponse la plus simple quand on vous demande 来中国做什么 à l’immigration.',
      },
    },
    {
      id: 'self-intro-vocab-6',
      hanzi: '待',
      pinyin: 'dāi',
      audio: '/audio/self-intro/vocab-06.mp3',
      meaning: {
        en: 'to stay',
        fr: 'rester',
      },
      explanation: {
        en: '待两个星期 means stay for two weeks.',
        fr: '待两个星期 signifie rester deux semaines.',
      },
    },
    {
      id: 'self-intro-vocab-7',
      hanzi: '地铁',
      pinyin: 'dì tiě',
      audio: '/audio/self-intro/vocab-07.mp3',
      meaning: {
        en: 'subway / metro',
        fr: 'métro',
      },
      explanation: {
        en: 'A fast way to travel inside the city.',
        fr: 'Un moyen rapide de se déplacer en ville.',
      },
    },
    {
      id: 'self-intro-vocab-8',
      hanzi: '机场快线',
      pinyin: 'jī chǎng kuài xiàn',
      audio: '/audio/self-intro/vocab-08.mp3',
      meaning: {
        en: 'airport express',
        fr: 'express de l’aéroport',
      },
      explanation: {
        en: 'The airport express train links the airport with downtown.',
        fr: 'Le train express relie l’aéroport au centre-ville.',
      },
    },
    {
      id: 'self-intro-vocab-9',
      hanzi: '打车',
      pinyin: 'dǎ chē',
      audio: '/audio/self-intro/vocab-09.mp3',
      meaning: {
        en: 'take a taxi',
        fr: 'prendre un taxi',
      },
      explanation: {
        en: '去哪里打车 asks where the taxi pick-up point is.',
        fr: '去哪里打车 demande où se trouve la prise en charge des taxis.',
      },
    },
    {
      id: 'self-intro-vocab-10',
      hanzi: '酒店',
      pinyin: 'jiǔ diàn',
      audio: '/audio/self-intro/vocab-10.mp3',
      meaning: {
        en: 'hotel',
        fr: 'hôtel',
      },
      explanation: {
        en: 'Point to your hotel when asking 去这个酒店怎么走.',
        fr: 'Montrez votre hôtel en demandant 去这个酒店怎么走.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'self-intro-listening-1',
        prompt: {
          en: 'Which sentence asks “Do you speak English?”?',
          fr: 'Quelle phrase demande « Parlez-vous anglais ? » ?',
        },
        target: '请问您会说英语吗？',
        pinyin: 'Qǐng wèn nín huì shuō Yīng yǔ ma?',
        audio: '/audio/self-intro/practice-listening-01.mp3',
        explanation: {
          en: 'Use 请问您会说英语吗 when you need someone who can speak English.',
          fr: 'Utilisez 请问您会说英语吗 quand vous avez besoin d’un anglophone.',
        },
      },
      {
        id: 'self-intro-listening-2',
        prompt: {
          en: 'Which sentence asks where baggage claim is?',
          fr: 'Quelle phrase demande où se trouve la récupération des bagages ?',
        },
        target: '行李提取处在哪里？',
        pinyin: 'Xíng li tí qǔ chù zài nǎ lǐ?',
        audio: '/audio/self-intro/practice-listening-02.mp3',
        explanation: {
          en: '行李提取处在哪里 is the first thing to ask after landing.',
          fr: '行李提取处在哪里 est la première chose à demander après l’atterrissage.',
        },
      },
    ],
    speaking: [
      {
        id: 'self-intro-speaking-1',
        prompt: {
          en: 'Say that you are here to travel.',
          fr: 'Dites que vous venez pour le tourisme.',
        },
        target: '我是来旅游的。',
        pinyin: 'Wǒ shì lái lǚ yóu de.',
        audio: '/audio/self-intro/practice-speaking-01.mp3',
        explanation: {
          en: '我是来旅游的 states your purpose for the trip.',
          fr: '我是来旅游的 indique le motif de votre voyage.',
        },
      },
      {
        id: 'self-intro-speaking-2',
        prompt: {
          en: 'Ask where you can get a taxi.',
          fr: 'Demandez où vous pouvez prendre un taxi.',
        },
        target: '请问去哪里打车？',
        pinyin: 'Qǐng wèn qù nǎ lǐ dǎ chē?',
        audio: '/audio/self-intro/practice-speaking-02.mp3',
        explanation: {
          en: '请问去哪里打车 asks the taxi pick-up location.',
          fr: '请问去哪里打车 demande l’emplacement des taxis.',
        },
      },
    ],
    reading: [
      {
        id: 'self-intro-reading-1',
        prompt: {
          en: 'Match the airport sign word to “baggage claim”.',
          fr: 'Associe le mot de l’aéroport à « récupération des bagages ».',
        },
        target: '行李提取处',
        pinyin: 'xíng li tí qǔ chù',
        audio: '/audio/self-intro/practice-reading-01.mp3',
        explanation: {
          en: '行李提取处 is the sign to follow after landing.',
          fr: '行李提取处 est le panneau à suivre après l’atterrissage.',
        },
      },
      {
        id: 'self-intro-reading-2',
        prompt: {
          en: 'Match the word to “subway”.',
          fr: 'Associe le mot à « métro ».',
        },
        target: '地铁',
        pinyin: 'dì tiě',
        audio: '/audio/self-intro/practice-reading-02.mp3',
        explanation: {
          en: '地铁 is the subway, useful for city travel.',
          fr: '地铁 est le métro, utile pour les déplacements en ville.',
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
        fr: 'Le premier mot de document à reconnaître après l’atterrissage.',
      },
    },
    {
      id: 'self-intro-review-2',
      front: '行李提取处',
      back: {
        en: 'baggage claim',
        fr: 'récupération des bagages',
      },
      explanation: {
        en: 'Where you collect your luggage.',
        fr: 'L’endroit où récupérer vos bagages.',
      },
    },
    {
      id: 'self-intro-review-3',
      front: '请问您会说英语吗',
      back: {
        en: 'Do you speak English?',
        fr: 'Parlez-vous anglais ?',
      },
      explanation: {
        en: 'A key rescue phrase when you need English help.',
        fr: 'Une phrase de secours clé quand vous avez besoin d’aide en anglais.',
      },
    },
    {
      id: 'self-intro-review-4',
      front: '我是来旅游的',
      back: {
        en: 'I’m here to travel.',
        fr: 'Je viens pour le tourisme.',
      },
      explanation: {
        en: 'State your travel purpose at immigration.',
        fr: 'Indiquez votre motif de voyage à l’immigration.',
      },
    },
    {
      id: 'self-intro-review-5',
      front: '地铁',
      back: {
        en: 'subway / metro',
        fr: 'métro',
      },
      explanation: {
        en: 'The city transport you may use after the airport.',
        fr: 'Le transport en ville après l’aéroport.',
      },
    },
    {
      id: 'self-intro-review-6',
      front: '机场快线',
      back: {
        en: 'airport express',
        fr: 'express de l’aéroport',
      },
      explanation: {
        en: 'A fast train from the airport to the city.',
        fr: 'Un train rapide de l’aéroport vers la ville.',
      },
    },
  ],
}
