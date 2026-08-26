import type { LessonContent } from '../types.js'

export const askDirectionsLesson: LessonContent = {
  id: 'ask-directions',
  title: {
    en: '打车 / Take a taxi',
    fr: '打车 / Prendre un taxi',
  },
  scenario: {
    en: 'Get to the right destination, ensure comfort and safety, make the payment.',
    fr: 'Arriver à la bonne destination, assurer confort et sécurité, et régler la course.',
  },
  dialogue: {
    title: {
      en: 'Tell the driver your destination',
      fr: 'Indiquer sa destination au chauffeur',
    },
    lines: [
      {
        id: 'ask-directions-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '师傅您好，我要去这里。',
        pinyin: 'Shī fu nín hǎo, wǒ yào qù zhè lǐ.',
        translation: { en: 'Hello, driver. I’d like to go here.', fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller ici.' },
        explanation: { en: '师傅 = driver (polite)｜您 = you (polite)｜好 = good / hello｜我 = I｜要 = want to｜去 = to go to｜这里 = here. Use it to tell the driver your destination at the start of the ride.', fr: '师傅 = chauffeur (poli)｜您 = vous (poli)｜好 = bon / bonjour｜我 = je｜要 = vouloir｜去 = aller à｜这里 = ici. Utilisez-la pour indiquer votre destination au début de la course.' },
        audio: '/audio/ask-directions/line-01.mp3',
      },
      {
        id: 'ask-directions-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '这是地址。',
        pinyin: 'Zhè shì dì zhǐ.',
        translation: { en: 'This is the address.', fr: 'C\'est l\'adresse.' },
        explanation: { en: '这 = this｜是 = is｜地址 = address. Use it while showing the address on your phone.', fr: '这 = ceci｜是 = est｜地址 = adresse. Utilisez-la en montrant l\'adresse sur votre téléphone.' },
        audio: '/audio/ask-directions/line-02.mp3',
      },
      {
        id: 'ask-directions-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请打表。',
        pinyin: 'Qǐng dǎ biǎo.',
        translation: { en: 'Please use the meter.', fr: 'Veuillez utiliser le compteur.' },
        explanation: { en: '请 = please｜打表 = use / turn on the meter. Use it to ask the driver to turn on the meter.', fr: '请 = s\'il vous plaît｜打表 = utiliser / mettre en marche le compteur. Utilisez-la pour demander au chauffeur de mettre le compteur en marche.' },
        audio: '/audio/ask-directions/line-03.mp3',
      },
      {
        id: 'ask-directions-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '大概多久到？',
        pinyin: 'Dà gài duō jiǔ dào?',
        translation: { en: 'How long will it take?', fr: 'Combien de temps le trajet prendra-t-il ?' },
        explanation: { en: '大概 = about / approximately｜多久 = how long｜到 = to arrive. Use it to check the approximate travel time.', fr: '大概 = environ / à peu près｜多久 = combien de temps｜到 = arriver. Utilisez-la pour connaître la durée approximative du trajet.' },
        audio: '/audio/ask-directions/line-04.mp3',
      },
      {
        id: 'ask-directions-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '可以开空调吗?',
        pinyin: 'Kě yǐ kāi kōng tiáo ma?',
        translation: { en: 'Could you please turn on the air-conditioner?', fr: 'Pourriez-vous allumer la climatisation, s\'il vous plaît ?' },
        explanation: { en: '可以 = may / can｜开 = to turn on｜空调 = air-conditioning｜吗 = question particle. Use it to politely ask for comfort in the taxi, like turning on the air-conditioning.', fr: '可以 = pouvoir / être permis｜开 = allumer｜空调 = climatisation｜吗 = particule interrogative. Utilisez-la pour demander poliment un confort dans le taxi, comme allumer la climatisation.' },
        audio: '/audio/ask-directions/line-05.mp3',
      },
      {
        id: 'ask-directions-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请开慢一点。',
        pinyin: 'Qǐng kāi màn yì diǎn.',
        translation: { en: 'Slow down, please.', fr: 'Roulez plus lentement, s’il vous plaît.' },
        explanation: { en: '请 = please｜开 = to drive｜慢 = slow｜一点 = a little. Use it to ask the driver to slow down.', fr: '请 = s\'il vous plaît｜开 = conduire｜慢 = lent｜一点 = un peu. Utilisez-la pour demander au chauffeur de ralentir.' },
        audio: '/audio/ask-directions/line-06.mp3',
      },
      {
        id: 'ask-directions-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '麻烦停下车。',
        pinyin: 'Má fan tíng xià chē.',
        translation: { en: 'Please stop the car.', fr: 'Arrêtez la voiture, s\'il vous plaît.' },
        explanation: { en: '麻烦 = to trouble / excuse me｜停 = to stop｜下 = (verb particle)｜车 = car. Use it to politely ask the taxi to stop.', fr: '麻烦 = déranger / excusez-moi｜停 = s\'arrêter｜下 = (particule verbale)｜车 = voiture. Utilisez-la pour demander poliment au taxi de s\'arrêter.' },
        audio: '/audio/ask-directions/line-07.mp3',
      },
      {
        id: 'ask-directions-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '一共多少钱？',
        pinyin: 'Yí gòng duō shǎo qián?',
        translation: { en: 'How much is it in total?', fr: 'Combien ça fait au total ?' },
        explanation: { en: '一共 = in total｜多少 = how much｜钱 = money. Use it to get the total fare when the ride ends.', fr: '一共 = au total｜多少 = combien｜钱 = argent. Utilisez-la pour connaître le prix total à la fin de la course.' },
        audio: '/audio/ask-directions/line-08.mp3',
      },
      {
        id: 'ask-directions-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '怎么支付呢？',
        pinyin: 'Zěn me zhī fù ne?',
        translation: { en: 'How should I pay?', fr: 'Comment payer ?' },
        explanation: { en: '怎么 = how｜支付 = to pay｜呢 = (softening particle). Use it to learn the accepted payment methods.', fr: '怎么 = comment｜支付 = payer｜呢 = (particule d\'adoucissement). Utilisez-la pour connaître les moyens de paiement acceptés.' },
        audio: '/audio/ask-directions/line-09.mp3',
      },
      {
        id: 'ask-directions-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '可以用微信/支付宝吗？',
        pinyin: 'Kě yǐ yòng Wēi xìn / Zhī fù bǎo ma?',
        translation: { en: 'Can I use WeChat Pay / Alipay?', fr: 'Puis-je payer avec WeChat / Alipay ?' },
        explanation: { en: '可以 = may / can｜用 = to use｜微信 = WeChat｜支付宝 = Alipay｜吗 = question particle. Use it to check if mobile payment apps are accepted.', fr: '可以 = pouvoir｜用 = utiliser｜微信 = WeChat｜支付宝 = Alipay｜吗 = particule interrogative. Utilisez-la pour vérifier si les applications de paiement mobile sont acceptées.' },
        audio: '/audio/ask-directions/line-10.mp3',
      },
      {
        id: 'ask-directions-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请给我发票。',
        pinyin: 'Qǐng gěi wǒ fā piào.',
        translation: { en: 'Please give me a receipt.', fr: 'Veuillez me donner un reçu.' },
        explanation: { en: '请 = please｜给 = to give｜我 = me｜发票 = receipt / invoice. Use it when you need an official receipt for reimbursement.', fr: '请 = s\'il vous plaît｜给 = donner｜我 = moi｜发票 = reçu / facture. Utilisez-la quand vous avez besoin d\'un reçu officiel pour vous faire rembourser.' },
        audio: '/audio/ask-directions/line-11.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'ask-directions-pattern-1',
      pattern: '师傅您好，我要去……。',
      pinyin: 'Shī fu nín hǎo, wǒ yào qù ... .',
      meaning: {
        en: 'Hello, driver. I’d like to go to ...',
        fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller à ...',
      },
      audio: '/audio/ask-directions/pattern-01.mp3',
      examples: [
        {
          fill: '这里',
          fillPinyin: 'zhè lǐ',
          hanzi: '师傅您好，我要去这里。',
          pinyin: 'Shī fu nín hǎo, wǒ yào qù zhè lǐ.',
          en: 'Hello, driver. I’d like to go here.',
          fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller ici.',
          audio: '/audio/ask-directions/pattern-01-example-01.mp3',
        },
        {
          fill: '这个地址',
          fillPinyin: 'zhè ge dì zhǐ',
          hanzi: '师傅您好，我要去这个地址。',
          pinyin: 'Shī fu nín hǎo, wǒ yào qù zhè ge dì zhǐ.',
          en: 'Hello, driver. I’d like to go to this address.',
          fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller à cette adresse.',
          audio: '/audio/ask-directions/pattern-01-example-02.mp3',
        },
        {
          fill: '机场',
          fillPinyin: 'jī chǎng',
          hanzi: '师傅您好，我要去机场。',
          pinyin: 'Shī fu nín hǎo, wǒ yào qù jī chǎng.',
          en: 'Hello, driver. I’d like to go to the airport.',
          fr: 'Bonjour, Monsieur le chauffeur. Je voudrais aller à l\'aéroport.',
          audio: '/audio/ask-directions/pattern-01-example-03.mp3',
        },
      ],
    },
    {
      id: 'ask-directions-pattern-2',
      pattern: '这是……。',
      pinyin: 'Zhè shì ... .',
      meaning: {
        en: 'This is ...',
        fr: 'C\'est ...',
      },
      audio: '/audio/ask-directions/pattern-02.mp3',
      examples: [
        {
          fill: '地址',
          fillPinyin: 'dì zhǐ',
          hanzi: '这是地址。',
          pinyin: 'Zhè shì dì zhǐ.',
          en: 'This is the address.',
          fr: 'C\'est l\'adresse.',
          audio: '/audio/ask-directions/pattern-02-example-01.mp3',
        },
        {
          fill: '我的护照',
          fillPinyin: 'wǒ de hù zhào',
          hanzi: '这是我的护照。',
          pinyin: 'Zhè shì wǒ de hù zhào.',
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
          audio: '/audio/ask-directions/pattern-02-example-02.mp3',
        },
        {
          fill: '酒店',
          fillPinyin: 'jiǔ diàn',
          hanzi: '这是酒店。',
          pinyin: 'Zhè shì jiǔ diàn.',
          en: 'This is the hotel.',
          fr: 'C\'est l\'hôtel.',
          audio: '/audio/ask-directions/pattern-02-example-03.mp3',
        },
      ],
    },
    {
      id: 'ask-directions-pattern-3',
      pattern: '请……。',
      pinyin: 'Qǐng ... .',
      meaning: {
        en: 'Please ...',
        fr: 'S\'il vous plaît, ...',
      },
      audio: '/audio/ask-directions/pattern-03.mp3',
      examples: [
        {
          fill: '打表',
          fillPinyin: 'dǎ biǎo',
          hanzi: '请打表。',
          pinyin: 'Qǐng dǎ biǎo.',
          en: 'Please use the meter.',
          fr: 'Veuillez utiliser le compteur.',
          audio: '/audio/ask-directions/pattern-03-example-01.mp3',
        },
        {
          fill: '开空调',
          fillPinyin: 'kāi kōng tiáo',
          hanzi: '请开空调。',
          pinyin: 'Qǐng kāi kōng tiáo.',
          en: 'Please turn on the air-conditioning.',
          fr: 'Veuillez allumer la climatisation.',
          audio: '/audio/ask-directions/pattern-03-example-02.mp3',
        },
        {
          fill: '等一下',
          fillPinyin: 'děng yí xià',
          hanzi: '请等一下。',
          pinyin: 'Qǐng děng yí xià.',
          en: 'Please wait a moment.',
          fr: 'Veuillez attendre un instant.',
          audio: '/audio/ask-directions/pattern-03-example-03.mp3',
        },
      ],
    },
    {
      id: 'ask-directions-pattern-4',
      pattern: '大概多久到？',
      pinyin: 'Dà gài duō jiǔ dào?',
      meaning: {
        en: 'How long will it take?',
        fr: 'Combien de temps le trajet prendra-t-il ?',
      },
      audio: '/audio/ask-directions/pattern-04.mp3',
    },
    {
      id: 'ask-directions-pattern-5',
      pattern: '可以……吗？',
      pinyin: 'Kě yǐ ... ma?',
      meaning: {
        en: 'Can I ...?',
        fr: 'Puis-je ...?',
      },
      audio: '/audio/ask-directions/pattern-05.mp3',
      examples: [
        {
          fill: '开空调',
          fillPinyin: 'kāi kōng tiáo',
          hanzi: '可以开空调吗？',
          pinyin: 'Kě yǐ kāi kōng tiáo ma?',
          en: 'Could you please turn on the air-conditioner?',
          fr: 'Pourriez-vous allumer la climatisation, s\'il vous plaît ?',
          audio: '/audio/ask-directions/pattern-05-example-01.mp3',
        },
        {
          fill: '用支付宝',
          fillPinyin: 'yòng Zhī fù bǎo',
          hanzi: '可以用支付宝吗？',
          pinyin: 'Kě yǐ yòng Zhī fù bǎo ma?',
          en: 'Can I pay with Alipay?',
          fr: 'Puis-je payer avec Alipay ?',
          audio: '/audio/ask-directions/pattern-05-example-02.mp3',
        },
        {
          fill: '下车',
          fillPinyin: 'xià chē',
          hanzi: '可以下车吗？',
          pinyin: 'Kě yǐ xià chē ma?',
          en: 'Can I get off?',
          fr: 'Puis-je descendre ?',
          audio: '/audio/ask-directions/pattern-05-example-03.mp3',
        },
      ],
    },
    {
      id: 'ask-directions-pattern-6',
      pattern: '请开慢一点。',
      pinyin: 'Qǐng kāi màn yì diǎn.',
      meaning: {
        en: 'Please drive slower.',
        fr: 'Roulez plus lentement, s’il vous plaît.',
      },
    
      audio: '/audio/ask-directions/line-06.mp3',},
    {
      id: 'ask-directions-pattern-7',
      pattern: '麻烦停下车。',
      pinyin: 'Má fan tíng xià chē.',
      meaning: {
        en: 'Please stop the car.',
        fr: 'Arrêtez la voiture, s\'il vous plaît.',
      },
    
      audio: '/audio/ask-directions/line-07.mp3',},
    {
      id: 'ask-directions-pattern-8',
      pattern: '一共多少钱？',
      pinyin: 'Yí gòng duō shǎo qián?',
      meaning: {
        en: 'How much is it altogether?',
        fr: 'Combien ça fait au total ?',
      },
      audio: '/audio/ask-directions/pattern-08.mp3',
    },
    {
      id: 'ask-directions-pattern-9',
      pattern: '怎么支付呢？',
      pinyin: 'Zěn me zhī fù ne?',
      meaning: {
        en: 'How should I pay?',
        fr: 'Comment payer ?',
      },
    
      audio: '/audio/ask-directions/line-09.mp3',},
    {
      id: 'ask-directions-pattern-10',
      pattern: '可以用微信/支付宝吗？',
      pinyin: 'Kě yǐ yòng Wēi xìn / Zhī fù bǎo ma?',
      meaning: {
        en: 'Can I use WeChat Pay / Alipay?',
        fr: 'Puis-je payer avec WeChat / Alipay ?',
      },
    
      audio: '/audio/ask-directions/line-10.mp3',},
    {
      id: 'ask-directions-pattern-11',
      pattern: '请给我发票。',
      pinyin: 'Qǐng gěi wǒ fā piào.',
      meaning: {
        en: 'Please give me a receipt.',
        fr: 'Veuillez me donner un reçu.',
      },
    
      audio: '/audio/ask-directions/line-11.mp3',},
  ],
  vocabulary: [
    {
      id: 'ask-directions-vocab-1',
      hanzi: '师傅',
      pinyin: 'shī fu',
      audio: '/audio/ask-directions/vocab-01.mp3',
      meaning: {
        en: 'driver / master worker',
        fr: 'chauffeur / maître artisan',
      },
      explanation: {
        en: 'A common respectful address for taxi drivers and skilled workers.',
        fr: 'Une appellation respectueuse courante pour les chauffeurs de taxi et les artisans.',
      },
    },
    {
      id: 'ask-directions-vocab-2',
      hanzi: '地址',
      pinyin: 'dì zhǐ',
      audio: '/audio/ask-directions/vocab-02.mp3',
      meaning: {
        en: 'address',
        fr: 'adresse',
      },
      explanation: {
        en: 'The key word when showing a hotel or apartment location.',
        fr: 'Le mot clé quand on montre l\'emplacement d\'un hôtel ou d\'un appartement.',
      },
    },
    {
      id: 'ask-directions-vocab-3',
      hanzi: '酒店',
      pinyin: 'jiǔ diàn',
      audio: '/audio/ask-directions/vocab-03.mp3',
      meaning: {
        en: 'hotel',
        fr: 'hôtel',
      },
      explanation: {
        en: 'Use it as the first arrival destination after the airport.',
        fr: 'Utilise-le pour la première destination après l\'aéroport.',
      },
    },
    {
      id: 'ask-directions-vocab-4',
      hanzi: '多久',
      pinyin: 'duō jiǔ',
      audio: '/audio/ask-directions/vocab-04.mp3',
      meaning: {
        en: 'how long',
        fr: 'combien de temps',
      },
      explanation: {
        en: 'Useful for asking about travel time.',
        fr: 'Utile pour demander la durée d\'un trajet.',
      },
    },
    {
      id: 'ask-directions-vocab-5',
      hanzi: '左右',
      pinyin: 'zuǒ yòu',
      audio: '/audio/ask-directions/vocab-05.mp3',
      meaning: {
        en: 'around / about',
        fr: 'environ / à peu près',
      },
      explanation: {
        en: 'Use it after minutes or money amounts for an estimate.',
        fr: 'Utilise-le après des minutes ou une somme pour donner une estimation.',
      },
    },
    {
      id: 'ask-directions-vocab-6',
      hanzi: '打表',
      pinyin: 'dǎ biǎo',
      audio: '/audio/ask-directions/vocab-06.mp3',
      meaning: { en: 'turn on the meter', fr: 'allumer le compteur' },
      explanation: {
        en: 'Say this to make sure the taxi uses the meter instead of a fixed price.',
        fr: 'Dis ceci pour t\'assurer que le taxi utilise le compteur plutôt qu\'un prix fixe.',
      },
    },
    {
      id: 'ask-directions-vocab-7',
      hanzi: '二维码',
      pinyin: 'èr wéi mǎ',
      audio: '/audio/ask-directions/vocab-07.mp3',
      meaning: { en: 'QR code', fr: 'code QR' },
      explanation: {
        en: 'You will see 二维码 everywhere for payment, menus, and WiFi in China.',
        fr: 'Tu verras 二维码 partout en Chine pour le paiement, les menus et le WiFi.',
      },
    },
    {
      id: 'ask-directions-vocab-8',
      hanzi: '扫码',
      pinyin: 'sǎo mǎ',
      audio: '/audio/ask-directions/vocab-08.mp3',
      meaning: { en: 'scan to pay', fr: 'scanner pour payer' },
      explanation: {
        en: 'The most common payment action: open your app and scan a QR code.',
        fr: 'L\'action de paiement la plus courante : ouvre ton appli et scanne un code QR.',
      },
    },
    {
      id: 'ask-directions-vocab-9',
      hanzi: '发票',
      pinyin: 'fā piào',
      audio: '/audio/ask-directions/vocab-09.mp3',
      meaning: { en: 'receipt / invoice', fr: 'reçu / facture' },
      explanation: {
        en: 'Ask for a 发票 if you need an official receipt for reimbursement.',
        fr: 'Demande un 发票 si tu as besoin d\'un reçu officiel pour te faire rembourser.',
      },
    },
    {
      id: 'ask-directions-vocab-10',
      hanzi: '高速',
      pinyin: 'gāo sù',
      audio: '/audio/ask-directions/vocab-10.mp3',
      meaning: { en: 'highway / expressway', fr: 'autoroute' },
      explanation: {
        en: 'The driver may ask 走高速吗？ to check if you prefer the expressway.',
        fr: 'Le chauffeur peut demander 走高速吗？ pour vérifier si tu préfères l\'autoroute.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'ask-directions-listening-1',
        prompt: {
          en: 'Which phrase tells the driver the destination?',
          fr: 'Quelle phrase indique la destination au chauffeur ?',
        },
        target: '师傅，去这个酒店。',
        audio: '/audio/ask-directions/practice-listening-01.mp3',
        explanation: {
          en: '师傅 = driver (polite)｜去 = to go to｜这个 = this｜酒店 = hotel. Use it as the first taxi sentence to get moving from the airport.',
          fr: '师傅 = chauffeur (poli)｜去 = aller à｜这个 = ce / cet｜酒店 = hôtel. Utilisez-le comme première phrase de taxi pour partir de l\'aéroport.',
        },
      },
      {
        id: 'ask-directions-listening-2',
        prompt: {
          en: 'Which phrase asks to use the meter?',
          fr: 'Quelle phrase demande d\'utiliser le compteur ?',
        },
        target: '请打表。',
        audio: '/audio/ask-directions/practice-listening-02.mp3',
        explanation: {
          en: '请 = please｜打表 = use / turn on the meter. Use it as the key safety phrase before the taxi starts moving.',
          fr: '请 = s\'il vous plaît｜打表 = utiliser / mettre en marche le compteur. Utilisez-la comme phrase de sécurité clé avant que le taxi ne démarre.',
        },
      },
    ],
    speaking: [
      {
        id: 'ask-directions-speaking-1',
        prompt: {
          en: 'Tell the driver to go to this hotel.',
          fr: 'Dis au chauffeur d\'aller à cet hôtel.',
        },
        target: '师傅，去这个酒店。',
        audio: '/audio/ask-directions/practice-speaking-01.mp3',
        explanation: {
          en: '师傅 = driver (polite)｜去 = to go to｜这个 = this｜酒店 = hotel. Use it to tell the driver to go to this hotel; swap 酒店 for 公寓 when going to an apartment.',
          fr: '师傅 = chauffeur (poli)｜去 = aller à｜这个 = ce / cet｜酒店 = hôtel. Utilisez-le pour demander au chauffeur d\'aller à cet hôtel ; remplacez 酒店 par 公寓 si vous allez à un appartement.',
        },
      },
      {
        id: 'ask-directions-speaking-2',
        prompt: {
          en: 'Ask the driver to use the meter.',
          fr: 'Demande au chauffeur d\'utiliser le compteur.',
        },
        target: '请打表。',
        audio: '/audio/ask-directions/practice-speaking-02.mp3',
        explanation: {
          en: '请 = please｜打表 = use / turn on the meter. Use it to ask the driver to use the meter, keeping the request polite and simple.',
          fr: '请 = s\'il vous plaît｜打表 = utiliser / mettre en marche le compteur. Utilisez-la pour demander au chauffeur d\'utiliser le compteur, de façon polie et simple.',
        },
      },
    ],
    reading: [
      {
        id: 'ask-directions-reading-1',
        prompt: {
          en: 'Match the phrase that asks about travel time.',
          fr: 'Associe la phrase qui demande la durée du trajet.',
        },
        target: '大概多久到？',
        audio: '/audio/ask-directions/practice-reading-01.mp3',
        explanation: {
          en: '大概 = about / approximately｜多久 = how long｜到 = to arrive. Use it to ask about the approximate arrival time.',
          fr: '大概 = environ / à peu près｜多久 = combien de temps｜到 = arriver. Utilisez-le pour demander l\'heure ou la durée approximative d\'arrivée.',
        },
      },
      {
        id: 'ask-directions-reading-2',
        prompt: {
          en: 'Match the payment phrase.',
          fr: 'Associe la phrase de paiement.',
        },
        target: '可以扫码吗？',
        audio: '/audio/ask-directions/practice-reading-02.mp3',
        explanation: {
          en: '可以 = may / can｜扫 = to scan｜码 = code｜吗 = question particle. Use it to ask if you can scan a QR code to pay.',
          fr: '可以 = pouvoir｜扫 = scanner｜码 = code｜吗 = particule interrogative. Utilisez-le pour demander si vous pouvez scanner un code QR pour payer.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'ask-directions-review-1',
      front: '去这个酒店',
      back: {
        en: 'Go to this hotel.',
        fr: 'Allez à cet hôtel.',
      },
      explanation: {
        en: '去 = to go to｜这个 = this｜酒店 = hotel. Use it while showing the hotel on your phone.',
        fr: '去 = aller à｜这个 = ce / cet｜酒店 = hôtel. Utilisez-le en montrant l\'hôtel sur votre téléphone.',
      },
    },
    {
      id: 'ask-directions-review-2',
      front: '地址',
      back: {
        en: 'address',
        fr: 'adresse',
      },
      explanation: {
        en: '地 = place / ground｜址 = location / address. Use it when confirming the destination.',
        fr: '地 = lieu / terrain｜址 = emplacement / adresse. Utilisez-le pour confirmer la destination.',
      },
    },
    {
      id: 'ask-directions-review-3',
      front: '大概多久到',
      back: {
        en: 'About how long until we arrive?',
        fr: 'Environ combien de temps pour arriver ?',
      },
      explanation: {
        en: '大概 = about / approximately｜多久 = how long｜到 = to arrive. Use it when you want a rough travel-time estimate.',
        fr: '大概 = environ / à peu près｜多久 = combien de temps｜到 = arriver. Utilisez-le pour obtenir une estimation de durée.',
      },
    },
    {
      id: 'ask-directions-review-4', front: '打表',
      back: { en: 'use the meter', fr: 'utiliser le compteur' },
      explanation: { en: '打表 = use / turn on the meter. Use it as a key taxi safety phrase.', fr: '打表 = utiliser / mettre en marche le compteur. Utilisez cette expression comme phrase de sécurité clé en taxi.' },
    },
    {
      id: 'ask-directions-review-5', front: '扫码',
      back: { en: 'scan to pay', fr: 'scanner pour payer' },
      explanation: { en: '扫 = to scan｜码 = code. Use it as the main way to pay in China.', fr: '扫 = scanner｜码 = code. Utilisez-le comme principal moyen de payer en Chine.' },
    },
    {
      id: 'ask-directions-review-6', front: '发票',
      back: { en: 'receipt / invoice', fr: 'reçu / facture' },
      explanation: { en: '发 = to issue｜票 = ticket / receipt. Use it when you need proof of payment.', fr: '发 = délivrer / émettre｜票 = billet / reçu. Utilisez-le quand vous avez besoin d\'une preuve de paiement.' },
    },
  ],
}
