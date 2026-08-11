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
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '师傅，去这个酒店。',
        pinyin: 'Shīfu, qù zhège jiǔdiàn.',
        translation: {
          en: 'Driver, please go to this hotel.',
          fr: 'Chauffeur, allez à cet hôtel, s\'il vous plaît.',
        },
        explanation: {
          en: '师傅 is a practical way to address a taxi driver politely.',
          fr: '师傅 est une façon pratique et polie de s\'adresser à un chauffeur.',
        },
        audio: '/audio/ask-directions/line-01.mp3',
      },
      {
        id: 'ask-directions-line-02',
        speaker: {
          en: 'Driver',
          fr: 'Chauffeur',
        },
        hanzi: '好的，你给我看一下地址。',
        pinyin: 'Hǎo de, nǐ gěi wǒ kàn yíxià dìzhǐ.',
        translation: {
          en: 'Okay, show me the address.',
          fr: 'D\'accord, montre-moi l\'adresse.',
        },
        explanation: {
          en: '给我看一下 is useful when the driver wants to see your phone or booking address.',
          fr: '给我看一下 est utile quand le chauffeur veut voir l\'adresse sur ton téléphone ou ta réservation.',
        },
        audio: '/audio/ask-directions/line-02.mp3',
      },
      {
        id: 'ask-directions-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '在这里。',
        pinyin: 'Zài zhèlǐ.',
        translation: {
          en: 'It is here.',
          fr: 'C\'est ici.',
        },
        explanation: {
          en: 'Use 在这里 while pointing to the address on your phone.',
          fr: 'Utilise 在这里 en montrant l\'adresse sur ton téléphone.',
        },
        audio: '/audio/ask-directions/line-03.mp3',
      },
      {
        id: 'ask-directions-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请打表。',
        pinyin: 'Qǐng dǎbiǎo.',
        translation: {
          en: 'Please use the meter.',
          fr: 'Veuillez utiliser le compteur.',
        },
        explanation: {
          en: 'Say 请打表 when you get in to make sure the driver starts the meter.',
          fr: 'Dis 请打表 en montant pour t\'assurer que le chauffeur démarre le compteur.',
        },
        audio: '/audio/ask-directions/line-04.mp3',
      },
      {
        id: 'ask-directions-line-05',
        speaker: {
          en: 'Driver',
          fr: 'Chauffeur',
        },
        hanzi: '好的，打表。',
        pinyin: 'Hǎo de, dǎbiǎo.',
        translation: {
          en: 'Okay, the meter is on.',
          fr: 'D\'accord, le compteur est allumé.',
        },
        explanation: {
          en: 'The driver confirms the meter is running.',
          fr: 'Le chauffeur confirme que le compteur fonctionne.',
        },
        audio: '/audio/ask-directions/line-05.mp3',
      },
      {
        id: 'ask-directions-line-06',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '大概多久到？',
        pinyin: 'Dàgài duōjiǔ dào?',
        translation: {
          en: 'About how long until we arrive?',
          fr: 'Environ combien de temps pour arriver ?',
        },
        explanation: {
          en: '大概多久到 is a short way to ask the approximate travel time.',
          fr: '大概多久到 est une façon courte de demander la durée approximative du trajet.',
        },
        audio: '/audio/ask-directions/line-06.mp3',
      },
      {
        id: 'ask-directions-line-07',
        speaker: {
          en: 'Driver',
          fr: 'Chauffeur',
        },
        hanzi: '四十分钟左右。',
        pinyin: 'Sìshí fēnzhōng zuǒyòu.',
        translation: {
          en: 'Around forty minutes.',
          fr: 'Environ quarante minutes.',
        },
        explanation: {
          en: '左右 means around or about, useful with time and price estimates.',
          fr: '左右 signifie environ ; c\'est utile pour les durées et les prix approximatifs.',
        },
        audio: '/audio/ask-directions/line-07.mp3',
      },
      {
        id: 'ask-directions-line-08',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '多少钱？可以扫码吗？',
        pinyin: 'Duōshǎo qián? Kěyǐ sǎomǎ ma?',
        translation: {
          en: 'How much? Can I scan to pay?',
          fr: 'Combien ? Je peux scanner pour payer ?',
        },
        explanation: {
          en: 'Ask 多少钱 for the fare, then 可以扫码吗 to check if QR payment is accepted.',
          fr: 'Demande 多少钱 pour le prix, puis 可以扫码吗 pour vérifier si le paiement par QR est accepté.',
        },
        audio: '/audio/ask-directions/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'ask-directions-pattern-1',
      pattern: '师傅您好，我要去……。',
      meaning: {
        en: 'Hello, please go to ...',
        fr: 'Bonjour, conduisez-moi à ..., s\'il vous plaît.',
      },
      example: '师傅您好，我要去这里。',
      audio: '/audio/ask-directions/pattern-01.mp3',
      explanation: {
        en: 'Say 我要去这里 and point to the destination to start the ride.',
        fr: 'Dis 我要去这里 et montre la destination pour commencer la course.',
      },
    },
    {
      id: 'ask-directions-pattern-2',
      pattern: '这是……。',
      meaning: {
        en: 'This is ...',
        fr: 'C\'est ...',
      },
      example: '这是地址。',
      audio: '/audio/ask-directions/pattern-02.mp3',
      explanation: {
        en: 'Use 这是地址 while showing the address on your phone.',
        fr: 'Utilise 这是地址 en montrant l\'adresse sur ton téléphone.',
      },
    },
    {
      id: 'ask-directions-pattern-3',
      pattern: '请……。',
      meaning: {
        en: 'Please ... (polite request)',
        fr: 'S\'il vous plaît ... (demande polie)',
      },
      example: '请打表。',
      audio: '/audio/ask-directions/pattern-03.mp3',
      explanation: {
        en: 'Put 请 before a short action to make a polite request, like turning on the meter.',
        fr: 'Mets 请 devant une action courte pour faire une demande polie, comme allumer le compteur.',
      },
    },
    {
      id: 'ask-directions-pattern-4',
      pattern: '大概多久到？',
      meaning: {
        en: 'How long will it take?',
        fr: 'Combien de temps pour arriver ?',
      },
      example: '大概多久到？',
      audio: '/audio/ask-directions/pattern-04.mp3',
      explanation: {
        en: 'Ask 大概多久到 to check the approximate travel time.',
        fr: 'Demande 大概多久到 pour connaître la durée approximative du trajet.',
      },
    },
    {
      id: 'ask-directions-pattern-5',
      pattern: '可以……吗？',
      meaning: {
        en: 'Can I ...? / Could you please ...?',
        fr: 'Puis-je ... ? / Pourriez-vous ... ?',
      },
      example: '可以开空调吗？',
      audio: '/audio/ask-directions/pattern-05.mp3',
      explanation: {
        en: 'Use 可以…吗 to ask politely for comfort or payment options in the taxi.',
        fr: 'Utilise 可以…吗 pour demander poliment un confort ou un moyen de paiement dans le taxi.',
      },
    },
    {
      id: 'ask-directions-pattern-6',
      pattern: '请开慢一点。',
      meaning: {
        en: 'Please drive slower.',
        fr: 'Allez plus lentement, s\'il vous plaît.',
      },
      example: '请开慢一点。',
      audio: '/audio/ask-directions/pattern-06.mp3',
      explanation: {
        en: 'Ask the driver to slow down if the ride feels too fast.',
        fr: 'Demande au chauffeur de ralentir si la course te semble trop rapide.',
      },
    },
    {
      id: 'ask-directions-pattern-7',
      pattern: '麻烦停下车。',
      meaning: {
        en: 'Please stop the car.',
        fr: 'Arrêtez la voiture, s\'il vous plaît.',
      },
      example: '麻烦停下车。',
      audio: '/audio/ask-directions/pattern-07.mp3',
      explanation: {
        en: 'Use 麻烦停车 to politely ask the taxi to stop.',
        fr: 'Utilise 麻烦停车 pour demander poliment au taxi de s\'arrêter.',
      },
    },
    {
      id: 'ask-directions-pattern-8',
      pattern: '一共多少钱？',
      meaning: {
        en: 'How much is it altogether?',
        fr: 'Combien ça fait au total ?',
      },
      example: '一共多少钱？',
      audio: '/audio/ask-directions/pattern-08.mp3',
      explanation: {
        en: 'Ask 一共多少钱 to get the total fare when the ride ends.',
        fr: 'Demande 一共多少钱 pour connaître le prix total à la fin de la course.',
      },
    },
    {
      id: 'ask-directions-pattern-9',
      pattern: '怎么支付呢？',
      meaning: {
        en: 'How should I pay?',
        fr: 'Comment payer ?',
      },
      example: '怎么支付呢？',
      audio: '/audio/ask-directions/pattern-09.mp3',
      explanation: {
        en: 'Ask 怎么支付 to learn the accepted payment methods.',
        fr: 'Demande 怎么支付 pour connaître les moyens de paiement acceptés.',
      },
    },
    {
      id: 'ask-directions-pattern-10',
      pattern: '可以用微信/支付宝吗？',
      meaning: {
        en: 'Can I use WeChat Pay / Alipay?',
        fr: 'Puis-je payer avec WeChat / Alipay ?',
      },
      example: '可以用微信/支付宝吗？',
      audio: '/audio/ask-directions/pattern-10.mp3',
      explanation: {
        en: 'Check if mobile payment apps are accepted before paying.',
        fr: 'Vérifie si les applications de paiement mobile sont acceptées avant de payer.',
      },
    },
    {
      id: 'ask-directions-pattern-11',
      pattern: '请给我发票。',
      meaning: {
        en: 'Please give me a receipt.',
        fr: 'Un reçu, s\'il vous plaît.',
      },
      example: '请给我发票。',
      audio: '/audio/ask-directions/pattern-11.mp3',
      explanation: {
        en: 'Ask 请给我发票 when you need an official receipt for reimbursement.',
        fr: 'Demande 请给我发票 si tu as besoin d\'un reçu officiel pour te faire rembourser.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'ask-directions-vocab-1',
      hanzi: '师傅',
      pinyin: 'shīfu',
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
      pinyin: 'dìzhǐ',
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
      pinyin: 'jiǔdiàn',
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
      pinyin: 'duōjiǔ',
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
      pinyin: 'zuǒyòu',
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
      pinyin: 'dǎbiǎo',
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
      pinyin: 'èrwéimǎ',
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
      pinyin: 'sǎomǎ',
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
      pinyin: 'fāpiào',
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
      pinyin: 'gāosù',
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
          en: 'This is the first taxi sentence to get moving from the airport.',
          fr: 'C\'est la première phrase de taxi pour partir de l\'aéroport.',
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
          en: '请打表 is the key safety phrase before the taxi starts moving.',
          fr: '请打表 est la phrase de sécurité clé avant que le taxi ne démarre.',
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
          en: 'You can swap 酒店 for 公寓 when going to an apartment.',
          fr: 'Tu peux remplacer 酒店 par 公寓 si tu vas à un appartement.',
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
          en: 'A short 请 before an action keeps the request polite and simple.',
          fr: 'Un 请 court avant une action garde la demande polie et simple.',
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
          en: '大概多久到 asks about the approximate arrival time.',
          fr: '大概多久到 demande l\'heure ou la durée approximative d\'arrivée.',
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
          en: 'Recognize 扫码 as the scan-to-pay action.',
          fr: 'Reconnais 扫码 comme l\'action de scanner pour payer.',
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
        en: 'Use it while showing the hotel on your phone.',
        fr: 'Utilise-le en montrant l\'hôtel sur ton téléphone.',
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
        en: 'A key word when confirming the destination.',
        fr: 'Un mot clé pour confirmer la destination.',
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
        en: 'Ask this when you want a rough travel-time estimate.',
        fr: 'Pose cette question pour obtenir une estimation de durée.',
      },
    },
    {
      id: 'ask-directions-review-4', front: '打表',
      back: { en: 'use the meter', fr: 'utiliser le compteur' },
      explanation: { en: 'A key taxi safety word.', fr: 'Un mot clé de sécurité en taxi.' },
    },
    {
      id: 'ask-directions-review-5', front: '扫码',
      back: { en: 'scan to pay', fr: 'scanner pour payer' },
      explanation: { en: 'The main way to pay in China.', fr: 'Le principal moyen de payer en Chine.' },
    },
    {
      id: 'ask-directions-review-6', front: '发票',
      back: { en: 'receipt / invoice', fr: 'reçu / facture' },
      explanation: { en: 'Ask for this if you need proof of payment.', fr: 'Demande ceci si tu as besoin d\'une preuve de paiement.' },
    },
  ],
}
