import type { LessonContent } from '../types.js'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: '到达机场 / Arrival at the airport',
    fr: '到达机场 / Arrivée à l’aéroport',
  },
  scenario: {
    en: 'Navigate the immigration and customs smoothly and ask for help when need.',
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
        pinyin: 'qǐng wèn nín huì shuō yīng yǔ ma?',
        translation: {
          en: 'Excuse me, do you speak English?',
          fr: 'Excusez-moi, parlez-vous anglais ?',
        },
        explanation: {
          en: '请问 = excuse me / may I ask｜您 = you (polite)｜会 = can / know how to｜说 = speak｜英语 = English｜吗 = question particle. Use it to ask whether someone can speak English when you need help.',
          fr: '请问 = excusez-moi / puis-je demander｜您 = vous (poli)｜会 = savoir / pouvoir｜说 = parler｜英语 = anglais｜吗 = particule interrogative. Utilisez-la pour demander si quelqu’un parle anglais quand vous avez besoin d’aide.',
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
        pinyin: 'xíng li tí qǔ chù zài nǎ lǐ?',
        translation: {
          en: 'Where is baggage claim?',
          fr: 'Où se trouve la récupération des bagages ?',
        },
        explanation: {
          en: '行李提取处 = baggage claim｜在 = to be located｜哪里 = where. Use it to ask where baggage claim is in the airport.',
          fr: '行李提取处 = zone de retrait des bagages｜在 = se trouver｜哪里 = où. Utilisez-la pour demander où se trouve la zone de retrait des bagages à l’aéroport.',
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
        pinyin: 'nín néng bāng wǒ yí xià ma?',
        translation: {
          en: 'Could you help me, please?',
          fr: 'Pourriez-vous m’aider, s’il vous plaît ?',
        },
        explanation: {
          en: '您 = you (polite)｜能 = can / to be able to｜帮 = to help｜我 = me｜一下 = a bit / a moment｜吗 = question particle. Use it to politely ask someone to help you.',
          fr: '您 = vous (poli)｜能 = pouvoir｜帮 = aider｜我 = moi｜一下 = un peu / un instant｜吗 = particule interrogative. Utilisez-la pour demander poliment de l’aide.',
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
        pinyin: 'zhè shì wǒ de hù zhào.',
        translation: {
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
        },
        explanation: {
          en: '这 = this｜是 = is｜我的 = my｜护照 = passport. Use it to hand over your passport at immigration.',
          fr: '这 = ceci / ça｜是 = est｜我的 = mon / ma｜护照 = passeport. Utilisez-la pour présenter votre passeport à l’immigration.',
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
        pinyin: 'wǒ shì lái lǚ yóu de.',
        translation: {
          en: 'I’m here to travel.',
          fr: 'Je suis venu(e) faire du tourisme.',
        },
        explanation: {
          en: '我 = I｜是 = am / to be｜来 = to come｜旅游 = to travel｜的 = (grammar particle). Use it to state your purpose for coming.',
          fr: '我 = je｜是 = (suis) / être｜来 = venir｜旅游 = voyager / tourisme｜的 = (particule grammaticale). Utilisez-la pour indiquer le motif de votre venue.',
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
        pinyin: 'wǒ dà gài dāi liǎng gè xīng qī.',
        translation: {
          en: 'I’ll stay for about two weeks.',
          fr: 'Je resterai environ deux semaines.',
        },
        explanation: {
          en: '我 = I｜大概 = about / approximately｜待 = to stay｜两 = two｜个 = (measure word)｜星期 = week. Use it to tell someone how long you will stay.',
          fr: '我 = je｜大概 = environ / à peu près｜待 = rester｜两 = deux｜个 = (classificateur)｜星期 = semaine. Utilisez-la pour indiquer combien de temps vous resterez.',
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
        pinyin: 'dì tiě zài nǎ lǐ?',
        translation: {
          en: 'Where is the subway?',
          fr: 'Où est le métro ?',
        },
        explanation: {
          en: '地铁 = subway / metro｜在 = to be at｜哪里 = where. Use it to ask where the subway is.',
          fr: '地铁 = métro｜在 = être à / se trouver｜哪里 = où. Utilisez-le pour demander où se trouve le métro.',
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
        pinyin: 'jī chǎng kuài xiàn zài nǎ lǐ?',
        translation: {
          en: 'Where is the airport express?',
          fr: 'Où est l’express de l’aéroport ?',
        },
        explanation: {
          en: '机场 = airport｜快线 = express line｜在 = to be at｜哪里 = where. Use it to ask where the airport express is.',
          fr: '机场 = aéroport｜快线 = ligne express｜在 = être à / se trouver｜哪里 = où. Utilisez-le pour demander où se trouve l’express de l’aéroport.',
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
        pinyin: 'qǐng wèn qù nǎ lǐ dǎ chē?',
        translation: {
          en: 'Excuse me, where can I get a taxi?',
          fr: 'Excusez-moi, où puis-je prendre un taxi ?',
        },
        explanation: {
          en: '请问 = excuse me / may I ask｜去 = to go｜哪里 = where｜打车 = to take a taxi. Use it to ask where you can get a taxi.',
          fr: '请问 = excusez-moi / puis-je demander｜去 = aller｜哪里 = où｜打车 = prendre un taxi. Utilisez-la pour demander où prendre un taxi.',
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
        pinyin: 'qù zhè ge jiǔ diàn zěn me zǒu?',
        translation: {
          en: 'How do I get to this hotel?',
          fr: 'Comment aller à cet hôtel ?',
        },
        explanation: {
          en: '去 = to go to｜这个 = this｜酒店 = hotel｜怎么走 = how to get there. Use it to ask directions to a place, like your hotel.',
          fr: '去 = aller à｜这个 = ce / cet｜酒店 = hôtel｜怎么走 = comment s’y rendre. Utilisez-la pour demander le chemin vers un endroit, comme votre hôtel.',
        },
        audio: '/audio/self-intro/line-10.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '请问……在哪里？',
      pinyin: 'qǐng wèn ... zài nǎ lǐ?',
      meaning: {
        en: 'Excuse me, where is ...?',
        fr: 'Excusez-moi, où est ...?',
      },
      audio: '/audio/self-intro/pattern-01.mp3',
      examples: [
        {
          fill: '行李提取处',
          fillPinyin: 'xíng li tí qǔ chù',
          hanzi: '请问行李提取处在哪里？',
          pinyin: 'qǐng wèn xíng li tí qǔ chù zài nǎ lǐ?',
          en: 'Excuse me, where is baggage claim?',
          fr: 'Excusez-moi, où se trouve la récupération des bagages ?',
          audio: '/audio/self-intro/pattern-01-example-01.mp3',
        },
        {
          fill: '卫生间',
          fillPinyin: 'wèi shēng jiān',
          hanzi: '请问卫生间在哪里？',
          pinyin: 'qǐng wèn wèi shēng jiān zài nǎ lǐ?',
          en: 'Excuse me, where is the restroom?',
          fr: 'Excusez-moi, où sont les toilettes ?',
          audio: '/audio/self-intro/pattern-01-example-02.mp3',
        },
        {
          fill: '机场快线',
          fillPinyin: 'jī chǎng kuài xiàn',
          hanzi: '请问机场快线在哪里？',
          pinyin: 'qǐng wèn jī chǎng kuài xiàn zài nǎ lǐ?',
          en: 'Excuse me, where is the airport express?',
          fr: 'Excusez-moi, où est l\'express de l\'aéroport ?',
          audio: '/audio/self-intro/pattern-01-example-03.mp3',
        },
      ],
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '您能帮我……吗？',
      pinyin: 'nín néng bāng wǒ ... ma?',
      meaning: {
        en: 'Could you help me ...?',
        fr: 'Pourriez-vous m\'aider ...?',
      },
      audio: '/audio/self-intro/pattern-02.mp3',
      examples: [
        {
          fill: '一下',
          fillPinyin: 'yí xià',
          hanzi: '您能帮我一下吗？',
          pinyin: 'nín néng bāng wǒ yí xià ma?',
          en: 'Could you help me, please?',
          fr: 'Pourriez-vous m’aider, s’il vous plaît ?',
          audio: '/audio/self-intro/pattern-02-example-01.mp3',
        },
        {
          fill: '拿行李',
          fillPinyin: 'ná xíng li',
          hanzi: '您能帮我拿行李吗？',
          pinyin: 'nín néng bāng wǒ ná xíng li ma?',
          en: 'Could you help me carry my luggage?',
          fr: 'Pourriez-vous m’aider à porter mes bagages ?',
          audio: '/audio/self-intro/pattern-02-example-02.mp3',
        },
        {
          fill: '打个电话',
          fillPinyin: 'dǎ gè diàn huà',
          hanzi: '您能帮我打个电话吗？',
          pinyin: 'nín néng bāng wǒ dǎ gè diàn huà ma?',
          en: 'Could you help me make a phone call?',
          fr: 'Pourriez-vous m’aider à passer un appel ?',
          audio: '/audio/self-intro/pattern-02-example-03.mp3',
        },
      ],
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '我是来……的。',
      pinyin: 'wǒ shì lái ... de.',
      meaning: {
        en: 'I came here to ...',
        fr: 'Je suis venu(e) pour ...',
      },
      audio: '/audio/self-intro/pattern-03.mp3',
      examples: [
        {
          fill: '旅游',
          fillPinyin: 'lǚ yóu',
          hanzi: '我是来旅游的。',
          pinyin: 'wǒ shì lái lǚ yóu de.',
          en: 'I’m here to travel.',
          fr: 'Je suis venu(e) faire du tourisme.',
          audio: '/audio/self-intro/pattern-03-example-01.mp3',
        },
        {
          fill: '工作',
          fillPinyin: 'gōng zuò',
          hanzi: '我是来工作的。',
          pinyin: 'wǒ shì lái gōng zuò de.',
          en: 'I’m here for work.',
          fr: 'Je suis venu(e) pour le travail.',
          audio: '/audio/self-intro/pattern-03-example-02.mp3',
        },
        {
          fill: '学习',
          fillPinyin: 'xué xí',
          hanzi: '我是来学习的。',
          pinyin: 'wǒ shì lái xué xí de.',
          en: 'I’m here to study.',
          fr: 'Je suis venu(e) pour étudier.',
          audio: '/audio/self-intro/pattern-03-example-03.mp3',
        },
      ],
    },
    {
      id: 'self-intro-pattern-4',
      pattern: '我大概待……。',
      pinyin: 'wǒ dà gài dāi ... .',
      meaning: {
        en: 'I\'ll stay about ...',
        fr: 'Je resterai environ ...',
      },
      audio: '/audio/self-intro/pattern-04.mp3',
      examples: [
        {
          fill: '两个星期',
          fillPinyin: 'liǎng gè xīng qī',
          hanzi: '我大概待两个星期。',
          pinyin: 'wǒ dà gài dāi liǎng gè xīng qī.',
          en: 'I’ll stay for about two weeks.',
          fr: 'Je resterai environ deux semaines.',
          audio: '/audio/self-intro/pattern-04-example-01.mp3',
        },
        {
          fill: '一个月',
          fillPinyin: 'yī gè yuè',
          hanzi: '我大概待一个月。',
          pinyin: 'wǒ dà gài dāi yī gè yuè.',
          en: 'I’ll stay for about a month.',
          fr: 'Je resterai environ un mois.',
          audio: '/audio/self-intro/pattern-04-example-02.mp3',
        },
        {
          fill: '三天',
          fillPinyin: 'sān tiān',
          hanzi: '我大概待三天。',
          pinyin: 'wǒ dà gài dāi sān tiān.',
          en: 'I’ll stay for about three days.',
          fr: 'Je resterai environ trois jours.',
          audio: '/audio/self-intro/pattern-04-example-03.mp3',
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
          fillPinyin: 'qù zhè ge jiǔ diàn',
          hanzi: '去这个酒店怎么走？',
          pinyin: 'qù zhè ge jiǔ diàn zěn me zǒu?',
          en: 'How do I get to this hotel?',
          fr: 'Comment aller à cet hôtel ?',
          audio: '/audio/self-intro/pattern-05-example-01.mp3',
        },
        {
          fill: '去火车站',
          fillPinyin: 'qù huǒ chē zhàn',
          hanzi: '去火车站怎么走？',
          pinyin: 'qù huǒ chē zhàn zěn me zǒu?',
          en: 'How do I get to the train station?',
          fr: 'Comment aller à la gare ?',
          audio: '/audio/self-intro/pattern-05-example-02.mp3',
        },
        {
          fill: '去地铁站',
          fillPinyin: 'qù dì tiě zhàn',
          hanzi: '去地铁站怎么走？',
          pinyin: 'qù dì tiě zhàn zěn me zǒu?',
          en: 'How do I get to the metro station?',
          fr: 'Comment aller à la station de métro ?',
          audio: '/audio/self-intro/pattern-05-example-03.mp3',
        },
      ],
    }
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
        fr: 'm’aider',
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
        en: 'Use this before a language when asking about someone’s language ability—for example, when seeking help at a hotel, shop, or station.',
        fr: 'Utilisez ce mot devant une langue pour vous renseigner sur les compétences linguistiques de quelqu’un, par exemple lorsque vous cherchez de l’aide dans un hôtel, un magasin ou une gare.',
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
        en: 'Use this with a place or length of time when telling a host, hotel staff, or an immigration officer how long you are staying.',
        fr: 'Utilisez ce mot avec un lieu ou une durée pour indiquer à votre hôte, au personnel de l’hôtel ou à un agent d’immigration combien de temps vous comptez rester.',
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
        pinyin: 'qǐng wèn nín huì shuō yīng yǔ ma?',
        audio: '/audio/self-intro/practice-listening-01.mp3',
        explanation: {
          en: '请问 = excuse me / may I ask｜您 = you (polite)｜会 = can / know how to｜说 = speak｜英语 = English｜吗 = question particle. Use it when you need someone who can speak English.',
          fr: '请问 = excusez-moi / puis-je demander｜您 = vous (poli)｜会 = savoir / pouvoir｜说 = parler｜英语 = anglais｜吗 = particule interrogative. Utilisez-la quand vous avez besoin de quelqu’un qui parle anglais.',
        },
      },
      {
        id: 'self-intro-listening-2',
        prompt: {
          en: 'Which sentence asks where baggage claim is?',
          fr: 'Quelle phrase demande où se trouve la récupération des bagages ?',
        },
        target: '行李提取处在哪里？',
        pinyin: 'xíng li tí qǔ chù zài nǎ lǐ?',
        audio: '/audio/self-intro/practice-listening-02.mp3',
        explanation: {
          en: '行李提取处 = baggage claim｜在 = to be located｜哪里 = where. Use it as the first thing to ask after landing.',
          fr: '行李提取处 = zone de retrait des bagages｜在 = se trouver｜哪里 = où. Utilisez-la comme première question après l’atterrissage.',
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
        pinyin: 'wǒ shì lái lǚ yóu de.',
        audio: '/audio/self-intro/practice-speaking-01.mp3',
        explanation: {
          en: '我 = I｜是 = am / to be｜来 = to come｜旅游 = to travel｜的 = (grammar particle). Use it to state your purpose for the trip.',
          fr: '我 = je｜是 = être｜来 = venir｜旅游 = voyager｜的 = (particule grammaticale). Utilisez-la pour indiquer le motif de votre voyage.',
        },
      },
      {
        id: 'self-intro-speaking-2',
        prompt: {
          en: 'Ask where you can get a taxi.',
          fr: 'Demandez où vous pouvez prendre un taxi.',
        },
        target: '请问去哪里打车？',
        pinyin: 'qǐng wèn qù nǎ lǐ dǎ chē?',
        audio: '/audio/self-intro/practice-speaking-02.mp3',
        explanation: {
          en: '请问 = excuse me / may I ask｜去 = to go｜哪里 = where｜打车 = to take a taxi. Use it to ask where to get a taxi.',
          fr: '请问 = excusez-moi / puis-je demander｜去 = aller｜哪里 = où｜打车 = prendre un taxi. Utilisez-la pour demander où prendre un taxi.',
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
          en: '行李提取处 = baggage claim. Use it to follow the signs after landing.',
          fr: '行李提取处 = zone de retrait des bagages. Utilisez-le pour suivre les panneaux après l’atterrissage.',
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
          en: '地 = underground｜铁 = iron / rail. Use it for the subway, useful for city travel.',
          fr: '地 = souterrain｜铁 = fer / rail. Utilisez-le pour le métro, pratique pour se déplacer en ville.',
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
        en: '护 = to protect｜照 = certificate. Use it as the first document word to recognize after landing.',
        fr: '护 = protéger｜照 = certificat. Utilisez-le comme premier mot de document à reconnaître après l’atterrissage.',
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
        en: '行李提取处 = baggage claim. Use it for where you collect your luggage.',
        fr: '行李提取处 = zone de retrait des bagages. Utilisez-le pour l’endroit où récupérer vos bagages.',
      },
    },
    {
      id: 'self-intro-review-3',
      front: '请问您会说英语吗',
      back: {
        en: 'Excuse me, do you speak English?',
        fr: 'Excusez-moi, parlez-vous anglais ?',
      },
      explanation: {
        en: '请问 = excuse me / may I ask｜您 = you (polite)｜会 = can / know how to｜说 = speak｜英语 = English｜吗 = question particle. Use it as a key rescue phrase when you need English help.',
        fr: '请问 = excusez-moi / puis-je demander｜您 = vous (poli)｜会 = savoir / pouvoir｜说 = parler｜英语 = anglais｜吗 = particule interrogative. Utilisez-la comme phrase de secours clé quand vous avez besoin d’aide en anglais.',
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
        en: '我 = I｜是 = am / to be｜来 = to come｜旅游 = to travel｜的 = (grammar particle). Use it to state your travel purpose at immigration.',
        fr: '我 = je｜是 = être｜来 = venir｜旅游 = voyager｜的 = (particule grammaticale). Utilisez-la pour indiquer votre motif de voyage à l’immigration.',
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
        en: '地 = underground｜铁 = iron / rail. Use it for the city transport you may use after the airport.',
        fr: '地 = souterrain｜铁 = fer / rail. Utilisez-le pour le transport en ville que vous pouvez prendre après l’aéroport.',
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
        en: '机场 = airport｜快线 = express line. Use it for a fast train from the airport to the city.',
        fr: '机场 = aéroport｜快线 = ligne express. Utilisez-le pour un train rapide de l’aéroport vers la ville.',
      },
    },
  ],
}
