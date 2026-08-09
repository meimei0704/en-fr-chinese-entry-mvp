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
        pinyin: 'Qǐngwèn nín huì shuō Yīngyǔ ma?',
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
        pinyin: 'Xíngli tíqǔchù zài nǎlǐ?',
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
        pinyin: 'Nín néng bāng wǒ yíxià ma?',
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
        pinyin: 'Zhè shì wǒ de hùzhào.',
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
        pinyin: 'Wǒ shì lái lǚyóu de.',
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
        hanzi: '我大概呆两个星期。',
        pinyin: 'Wǒ dàgài dāi liǎng gè xīngqī.',
        translation: {
          en: 'I’ll stay in China for about two weeks.',
          fr: 'Je resterai en Chine environ deux semaines.',
        },
        explanation: {
          en: '大概 means about, 呆 means to stay, and 两个星期 is two weeks.',
          fr: '大概 signifie environ, 呆 signifie rester, et 两个星期 est deux semaines.',
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
        pinyin: 'Dìtiě zài nǎlǐ?',
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
        pinyin: 'Jīchǎng kuàixiàn zài nǎlǐ?',
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
        pinyin: 'Qǐngwèn qù nǎlǐ dǎchē?',
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
        pinyin: 'Qù zhège jiǔdiàn zěnme zǒu?',
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
      meaning: {
        en: 'Excuse me, where is ...?',
        fr: 'Excusez-moi, où est ... ?',
      },
      example: '行李提取处在哪里？',
      audio: '/audio/self-intro/pattern-01.mp3',
      explanation: {
        en: 'Swap in 行李提取处, 地铁, or 机场快线 to ask for the next step at the airport.',
        fr: 'Remplacez par 行李提取处, 地铁 ou 机场快线 pour demander la prochaine étape à l’aéroport.',
      },
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '您能帮我……吗？',
      meaning: {
        en: 'Could you help me ...?',
        fr: 'Pourriez-vous m’aider ... ?',
      },
      example: '您能帮我一下吗？',
      audio: '/audio/self-intro/pattern-02.mp3',
      explanation: {
        en: 'Use 您能帮我 with a verb phrase to politely ask for help.',
        fr: 'Utilisez 您能帮我 avec un verbe pour demander poliment de l’aide.',
      },
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '我是来……的。',
      meaning: {
        en: 'I came to ... / I am here to ...',
        fr: 'Je suis venu(e) pour ...',
      },
      example: '我是来旅游的。',
      audio: '/audio/self-intro/pattern-03.mp3',
      explanation: {
        en: 'Use this at a counter when asked about your visit purpose; swap 旅游 for 出差 or 学习.',
        fr: 'Utilisez cette structure au guichet quand on vous demande le motif ; remplacez 旅游 par 出差 ou 学习.',
      },
    },
    {
      id: 'self-intro-pattern-4',
      pattern: '我大概呆……。',
      meaning: {
        en: 'I’ll stay about ...',
        fr: 'Je resterai environ ...',
      },
      example: '我大概呆两个星期。',
      audio: '/audio/self-intro/pattern-04.mp3',
      explanation: {
        en: 'Use 大概 to give an approximate length of stay, like 两个星期.',
        fr: 'Utilisez 大概 pour donner une durée approximative, comme 两个星期.',
      },
    },
    {
      id: 'self-intro-pattern-5',
      pattern: '……怎么走？',
      meaning: {
        en: 'How do I get to ...?',
        fr: 'Comment aller à ... ?',
      },
      example: '去这个酒店怎么走？',
      audio: '/audio/self-intro/pattern-05.mp3',
      explanation: {
        en: 'Use 怎么走 to ask for directions, with a place like 这个酒店 or 火车站.',
        fr: 'Utilisez 怎么走 pour demander un itinéraire, avec un lieu comme 这个酒店 ou 火车站.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '护照',
      pinyin: 'hùzhào',
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
      pinyin: 'xíngli tíqǔchù',
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
      pinyin: 'bāng wǒ yíxià',
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
      pinyin: 'lǚyóu',
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
      hanzi: '呆',
      pinyin: 'dāi',
      audio: '/audio/self-intro/vocab-06.mp3',
      meaning: {
        en: 'to stay',
        fr: 'rester',
      },
      explanation: {
        en: '呆两个星期 means stay for two weeks.',
        fr: '呆两个星期 signifie rester deux semaines.',
      },
    },
    {
      id: 'self-intro-vocab-7',
      hanzi: '地铁',
      pinyin: 'dìtiě',
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
      pinyin: 'jīchǎng kuàixiàn',
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
      pinyin: 'dǎchē',
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
      pinyin: 'jiǔdiàn',
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
        pinyin: 'Qǐngwèn nín huì shuō Yīngyǔ ma?',
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
        pinyin: 'Xíngli tíqǔchù zài nǎlǐ?',
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
        pinyin: 'Wǒ shì lái lǚyóu de.',
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
        pinyin: 'Qǐngwèn qù nǎlǐ dǎchē?',
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
        pinyin: 'xíngli tíqǔchù',
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
        pinyin: 'dìtiě',
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
