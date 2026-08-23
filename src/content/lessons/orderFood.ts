import type { LessonContent } from '../types.js'

export const orderFoodLesson: LessonContent = {
  id: 'order-food',
  title: {
    en: '酒店入住 / At the hotel',
    fr: '酒店入住 / À l’hôtel',
  },
  scenario: {
    en: 'Check in, ask for hotel service, request room items, and check out.',
    fr: 'Faire le check-in, demander un service d\'hôtel, demander des articles de chambre et régler le départ.',
  },
  dialogue: {
    title: {
      en: 'Check in at the front desk',
      fr: 'Faire le check-in à la réception',
    },
    lines: [
      {
        id: 'order-food-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '您好，我要办理入住。',
        pinyin: 'Nín hǎo, wǒ yào bàn lǐ rù zhù.',
        translation: { en: 'Hello, I want to check in.', fr: 'Bonjour, je veux faire le check-in.' },
        explanation: { en: 'Use this as your first front desk sentence to start the check-in.', fr: 'Utilise cette phrase comme première phrase à la réception pour commencer le check-in.' },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你会说英文吗？',
        pinyin: 'Nǐ huì shuō yīng wén ma?',
        translation: { en: 'Do you speak English?', fr: 'Parlez-vous anglais ?' },
        explanation: { en: 'Ask 你会说英文吗 when you need help in another language.', fr: 'Demande 你会说英文吗 quand tu as besoin d\'aide dans une autre langue.' },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我已经预订了。',
        pinyin: 'Wǒ yǐ jīng yù dìng le.',
        translation: { en: 'I have a reservation.', fr: 'J\'ai une réservation.' },
        explanation: { en: 'Mention 我已经预订了 so the front desk can find your booking.', fr: 'Dis 我已经预订了 pour que la réception trouve ta réservation.' },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hù zhào.',
        translation: { en: 'Here is my passport.', fr: 'Voici mon passeport.' },
        explanation: { en: 'Hand over a document like your passport with 这是我的护照.', fr: 'Présente un document comme ton passeport avec 这是我的护照.' },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: 'Wi-Fi密码是多少？',
        pinyin: 'Wi-Fi mì mǎ shì duō shǎo?',
        translation: { en: 'What is the Wi-Fi password?', fr: 'Quel est le mot de passe Wi-Fi ?' },
        explanation: { en: 'Use …是多少 to ask for a password, price, or room number.', fr: 'Utilise …是多少 pour demander un mot de passe, un prix ou un numéro de chambre.' },
        audio: '/audio/order-food/line-05.mp3',
      },
      {
        id: 'order-food-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '几点吃早餐？',
        pinyin: 'Jǐ diǎn chī zǎo cān?',
        translation: { en: 'What time is breakfast?', fr: 'À quelle heure est le petit-déjeuner ?' },
        explanation: { en: 'Ask 几点吃早餐 to check the breakfast hours at the hotel.', fr: 'Demande 几点吃早餐 pour connaître les horaires du petit-déjeuner à l\'hôtel.' },
        audio: '/audio/order-food/line-06.mp3',
      },
      {
        id: 'order-food-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '电梯在哪里？',
        pinyin: 'Diàn tī zài nǎ lǐ?',
        translation: { en: 'Where is the elevator?', fr: 'Où est l\'ascenseur ?' },
        explanation: { en: 'Ask 电梯在哪里 to find the elevator to your room.', fr: 'Demande 电梯在哪里 pour trouver l\'ascenseur vers ta chambre.' },
        audio: '/audio/order-food/line-07.mp3',
      },
      {
        id: 'order-food-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我需要更多毛巾。',
        pinyin: 'Wǒ xū yào gèng duō máo jīn.',
        translation: { en: 'I need more towels.', fr: 'J\'ai besoin de plus de serviettes.' },
        explanation: { en: 'Use 我需要更多毛巾 to request extra towels from hotel staff.', fr: 'Utilise 我需要更多毛巾 pour demander des serviettes supplémentaires au personnel de l\'hôtel.' },
        audio: '/audio/order-food/line-08.mp3',
      },
      {
        id: 'order-food-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '空调坏了。',
        pinyin: 'Kōng tiáo huài le.',
        translation: { en: 'The air conditioner does not work.', fr: 'La climatisation ne fonctionne pas.' },
        explanation: { en: 'Report a broken appliance in your room with 空调坏了.', fr: 'Signale un appareil en panne dans ta chambre avec 空调坏了.' },
        audio: '/audio/order-food/line-09.mp3',
      },
      {
        id: 'order-food-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我的房卡丢了。',
        pinyin: 'Wǒ de fáng kǎ diū le.',
        translation: { en: 'I lost my room key.', fr: 'J\'ai perdu ma carte de chambre.' },
        explanation: { en: 'Tell the front desk 我的房卡丢了 to get a replacement.', fr: 'Dis à la réception 我的房卡丢了 pour obtenir un remplacement.' },
        audio: '/audio/order-food/line-10.mp3',
      },
      {
        id: 'order-food-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请打扫房间。',
        pinyin: 'Qǐng dǎ sǎo fáng jiān.',
        translation: { en: 'Please clean my room.', fr: 'Veuillez nettoyer ma chambre.' },
        explanation: { en: 'Use 请打扫房间 to request housekeeping service.', fr: 'Utilise 请打扫房间 pour demander le service de ménage.' },
        audio: '/audio/order-food/line-11.mp3',
      },
      {
        id: 'order-food-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我可以寄存行李吗？',
        pinyin: 'Wǒ kě yǐ jì cún xíng li ma?',
        translation: { en: 'Can I store my luggage?', fr: 'Puis-je déposer mes bagages ?' },
        explanation: { en: 'Ask 我可以寄存行李吗 to leave your bags at the hotel.', fr: 'Demande 我可以寄存行李吗 pour laisser tes bagages à l\'hôtel.' },
        audio: '/audio/order-food/line-12.mp3',
      },
      {
        id: 'order-food-line-13',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '需要押金吗？',
        pinyin: 'Xū yào yā jīn ma?',
        translation: { en: 'Is a deposit needed?', fr: 'Une caution est-elle nécessaire ?' },
        explanation: { en: 'Ask 需要押金吗 to check whether the hotel requires a deposit.', fr: 'Demande 需要押金吗 pour vérifier si l\'hôtel exige une caution.' },
        audio: '/audio/order-food/line-13.mp3',
      },
      {
        id: 'order-food-line-14',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '几点退房？',
        pinyin: 'Jǐ diǎn tuì fáng?',
        translation: { en: 'What time is checkout?', fr: 'À quelle heure est le check-out ?' },
        explanation: { en: 'Use 几点 before an action to ask about breakfast or checkout time.', fr: 'Utilise 几点 avant une action pour demander l\'heure du petit-déjeuner ou du check-out.' },
        audio: '/audio/order-food/line-14.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'order-food-pattern-1',
      pattern: '我要办理入住。',
      pinyin: 'Wǒ yào bàn lǐ rù zhù.',
      meaning: {
        en: 'Hello, I want to check in.',
        fr: 'Bonjour, je veux faire le check-in.',
      },
      audio: '/audio/order-food/pattern-01.mp3',
    },
    {
      id: 'order-food-pattern-2',
      pattern: '我已经预订了。',
      pinyin: 'Wǒ yǐ jīng yù dìng le.',
      meaning: {
        en: 'I have a reservation.',
        fr: 'J\'ai une réservation.',
      },
    
      audio: '/audio/order-food/line-03.mp3',},
    {
      id: 'order-food-pattern-3',
      pattern: '这是我的……。',
      pinyin: 'Zhè shì wǒ de ... .',
      meaning: {
        en: 'Here is my ...',
        fr: 'Voici mon / ma ...',
      },
      audio: '/audio/order-food/pattern-03.mp3',
      examples: [
        {
          fill: '护照',
          fillPinyin: 'hùzhào',
          hanzi: '这是我的护照。',
          pinyin: 'Zhè shì wǒ de hù zhào.',
          en: 'passport',
          fr: 'passeport',
          audio: '/audio/order-food/pattern-03-example-01.mp3',
        },
        {
          fill: '身份证',
          fillPinyin: 'shēnfènzhèng',
          hanzi: '这是我的身份证。',
          pinyin: 'Zhè shì wǒ de shēn fèn zhèng.',
          en: 'ID card',
          fr: 'carte d\'identité',
          audio: '/audio/order-food/pattern-03-example-02.mp3',
        },
        {
          fill: '预订确认单',
          fillPinyin: 'yùdìng quèrèn dān',
          hanzi: '这是我的预订确认单。',
          pinyin: 'Zhè shì wǒ de yù dìng què rèn dān.',
          en: 'booking confirmation',
          fr: 'confirmation de réservation',
          audio: '/audio/order-food/pattern-03-example-03.mp3',
        },
      ],
    },
    {
      id: 'order-food-pattern-4',
      pattern: '……是多少？',
      pinyin: '... shì duō shao?',
      meaning: {
        en: 'What is ...?',
        fr: 'Quel est ... ?',
      },
      audio: '/audio/order-food/pattern-04.mp3',
      examples: [
        {
          fill: 'Wi-Fi',
          fillPinyin: '密码 Wi-Fi mìmǎ',
          hanzi: 'Wi-Fi 密码是多少？',
          pinyin: 'Wi-Fi mì mǎ shì duō shao?',
          en: 'Wi-Fi password',
          fr: 'mot de passe Wi-Fi',
          audio: '/audio/order-food/pattern-04-example-01.mp3',
        },
        {
          fill: '房间号',
          fillPinyin: 'fángjiān hào',
          hanzi: '房间号是多少？',
          pinyin: 'Fáng jiān hào shì duō shao?',
          en: 'room number',
          fr: 'numéro de chambre',
          audio: '/audio/order-food/pattern-04-example-02.mp3',
        },
        {
          fill: '房价',
          fillPinyin: 'fángjià',
          hanzi: '房价是多少？',
          pinyin: 'Fáng jià shì duō shao?',
          en: 'room rate',
          fr: 'prix de la chambre',
          audio: '/audio/order-food/pattern-04-example-03.mp3',
        },
      ],
    },
    {
      id: 'order-food-pattern-5',
      pattern: '几点……？',
      pinyin: 'Jǐ diǎn ... ?',
      meaning: {
        en: 'What time ...?',
        fr: 'À quelle heure ... ?',
      },
      audio: '/audio/order-food/pattern-07.mp3',
      examples: [
        {
          fill: '退房',
          fillPinyin: 'tuìfáng',
          hanzi: '几点退房？',
          pinyin: 'Jǐ diǎn tuì fáng?',
          en: 'check out',
          fr: 'le check-out',
          audio: '/audio/order-food/pattern-05-example-01.mp3',
        },
        {
          fill: '吃早餐',
          fillPinyin: 'chī zǎocān',
          hanzi: '几点吃早餐？',
          pinyin: 'Jǐ diǎn chī zǎo cān?',
          en: 'have breakfast',
          fr: 'prendre le petit-déjeuner',
          audio: '/audio/order-food/pattern-05-example-02.mp3',
        },
        {
          fill: '开始',
          fillPinyin: 'kāishǐ',
          hanzi: '几点开始？',
          pinyin: 'Jǐ diǎn kāi shǐ?',
          en: 'start',
          fr: 'commencer',
          audio: '/audio/order-food/pattern-05-example-03.mp3',
        },
      ],
    },
    {
      id: 'order-food-pattern-6',
      pattern: '你会说英文吗？',
      pinyin: 'Nǐ huì shuō Yīng wén ma?',
      meaning: {
        en: 'Do you speak English?',
        fr: 'Parlez-vous anglais ?',
      },
      audio: '/audio/order-food/pattern-06.mp3',
    },
    {
      id: 'order-food-pattern-7',
      pattern: '几点吃早餐？',
      pinyin: 'Jǐ diǎn chī zǎo cān?',
      meaning: {
        en: 'What time is breakfast?',
        fr: 'À quelle heure est le petit-déjeuner ?',
      },
    
      audio: '/audio/order-food/line-06.mp3',},
    {
      id: 'order-food-pattern-8',
      pattern: '电梯在哪里？',
      pinyin: 'Diàn tī zài nǎ lǐ?',
      meaning: {
        en: 'Where is the elevator?',
        fr: 'Où est l\'ascenseur ?',
      },
      audio: '/audio/order-food/pattern-08.mp3',
    },
    {
      id: 'order-food-pattern-9',
      pattern: '我需要更多毛巾。',
      pinyin: 'Wǒ xū yào gèng duō máo jīn.',
      meaning: {
        en: 'I need more towels.',
        fr: 'J\'ai besoin de plus de serviettes.',
      },
    
      audio: '/audio/order-food/line-08.mp3',},
    {
      id: 'order-food-pattern-10',
      pattern: '空调坏了。',
      pinyin: 'Kōng tiáo huài le.',
      meaning: {
        en: 'The air conditioner does not work.',
        fr: 'La climatisation ne fonctionne pas.',
      },
    
      audio: '/audio/order-food/line-09.mp3',},
    {
      id: 'order-food-pattern-11',
      pattern: '我的房卡丢了。',
      pinyin: 'Wǒ de fáng kǎ diū le.',
      meaning: {
        en: 'I lost my room key.',
        fr: 'J\'ai perdu ma carte de chambre.',
      },
    
      audio: '/audio/order-food/line-10.mp3',},
    {
      id: 'order-food-pattern-12',
      pattern: '请打扫房间。',
      pinyin: 'Qǐng dǎ sǎo fáng jiān.',
      meaning: {
        en: 'Please clean my room.',
        fr: 'Veuillez nettoyer ma chambre.',
      },
      audio: '/audio/order-food/pattern-12.mp3',
    },
    {
      id: 'order-food-pattern-13',
      pattern: '我可以寄存行李吗？',
      pinyin: 'Wǒ kě yǐ jì cún xíng li ma?',
      meaning: {
        en: 'Can I store my luggage?',
        fr: 'Puis-je déposer mes bagages ?',
      },
    
      audio: '/audio/order-food/line-12.mp3',},
  ],
  vocabulary: [
    {
      id: 'order-food-vocab-1',
      hanzi: '预订',
      pinyin: 'yù dìng',
      audio: '/audio/order-food/vocab-01.mp3',
      meaning: {
        en: 'reservation',
        fr: 'réservation',
      },
      explanation: {
        en: 'The key word for hotel and apartment booking check-in.',
        fr: 'Le mot clé pour une réservation d\'hôtel ou d\'appartement.',
      },
    },
    {
      id: 'order-food-vocab-2',
      hanzi: '名字',
      pinyin: 'míng zi',
      audio: '/audio/order-food/vocab-02.mp3',
      meaning: {
        en: 'name',
        fr: 'nom / prénom',
      },
      explanation: {
        en: 'The front desk asks for the name on the reservation.',
        fr: 'La réception demande le nom de la réservation.',
      },
    },
    {
      id: 'order-food-vocab-3',
      hanzi: '护照',
      pinyin: 'hù zhào',
      audio: '/audio/order-food/vocab-03.mp3',
      meaning: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'A common check-in document for international travelers.',
        fr: 'Un document courant au check-in pour les voyageurs internationaux.',
      },
    },
    {
      id: 'order-food-vocab-4',
      hanzi: '房卡',
      pinyin: 'fáng kǎ',
      audio: '/audio/order-food/vocab-04.mp3',
      meaning: {
        en: 'room card',
        fr: 'carte de chambre',
      },
      explanation: {
        en: 'The card you use to enter your hotel room.',
        fr: 'La carte utilisée pour entrer dans la chambre d\'hôtel.',
      },
    },
    {
      id: 'order-food-vocab-5',
      hanzi: '前台',
      pinyin: 'qián tái',
      audio: '/audio/order-food/vocab-05.mp3',
      meaning: {
        en: 'front desk',
        fr: 'réception',
      },
      explanation: {
        en: 'The place where hotel check-in happens.',
        fr: 'L\'endroit où se fait le check-in à l\'hôtel.',
      },
    },
    {
      id: 'order-food-vocab-6', hanzi: 'WiFi密码', pinyin: 'WiFi mì mǎ', audio: '/audio/order-food/vocab-06.mp3',
      meaning: { en: 'WiFi password', fr: 'mot de passe WiFi' },
      explanation: { en: 'The first thing to ask after check-in.', fr: 'La première chose à demander après le check-in.' },
    },
    {
      id: 'order-food-vocab-7', hanzi: '早餐', pinyin: 'zǎo cān', audio: '/audio/order-food/vocab-07.mp3',
      meaning: { en: 'breakfast', fr: 'petit-déjeuner' },
      explanation: { en: 'Ask about breakfast time and location at check-in.', fr: 'Demande l\'heure et le lieu du petit-déjeuner au check-in.' },
    },
    {
      id: 'order-food-vocab-8', hanzi: '押金', pinyin: 'yā jīn', audio: '/audio/order-food/vocab-08.mp3',
      meaning: { en: 'deposit', fr: 'caution' },
      explanation: { en: 'Many hotels in China ask for a deposit during check-in.', fr: 'Beaucoup d\'hôtels en Chine demandent une caution au check-in.' },
    },
    {
      id: 'order-food-vocab-9', hanzi: '退房', pinyin: 'tuì fáng', audio: '/audio/order-food/vocab-09.mp3',
      meaning: { en: 'check out', fr: 'check-out / libérer la chambre' },
      explanation: { en: 'Know your 退房 time to avoid extra charges.', fr: 'Connais ton heure de 退房 pour éviter des frais supplémentaires.' },
    },
    {
      id: 'order-food-vocab-10', hanzi: '电梯', pinyin: 'diàn tī', audio: '/audio/order-food/vocab-10.mp3',
      meaning: { en: 'elevator', fr: 'ascenseur' },
      explanation: { en: 'Ask 电梯在哪里？ to find the elevator to your room.', fr: 'Demande 电梯在哪里？ pour trouver l\'ascenseur vers ta chambre.' },
    },
  ],
  practice: {
    listening: [
      {
        id: 'order-food-listening-1',
        prompt: {
          en: 'Which phrase starts a hotel check-in?',
          fr: 'Quelle phrase commence un check-in à l\'hôtel ?',
        },
        target: '你好，我有预订。',
        audio: '/audio/order-food/practice-listening-01.mp3',
        explanation: {
          en: 'This tells the front desk to look for your booking.',
          fr: 'Cette phrase indique à la réception de chercher ta réservation.',
        },
      },
      {
        id: 'order-food-listening-2',
        prompt: { en: 'Which phrase asks for the WiFi password?', fr: 'Quelle phrase demande le mot de passe WiFi ?' },
        target: 'WiFi密码是多少？', audio: '/audio/order-food/practice-listening-02.mp3',
        explanation: { en: 'WiFi密码是多少 is the first follow-up after receiving your room card.', fr: 'WiFi密码是多少 est la première question après avoir reçu ta carte de chambre.' },
      },
    ],
    speaking: [
      {
        id: 'order-food-speaking-1',
        prompt: {
          en: 'Answer the front desk when they ask your name.',
          fr: 'Réponds à la réception quand on te demande ton nom.',
        },
        target: '我叫 Alex。',
        audio: '/audio/order-food/practice-speaking-01.mp3',
        explanation: {
          en: 'Use 我叫 plus the booking name.',
          fr: 'Utilise 我叫 suivi du nom de la réservation.',
        },
      },
      {
        id: 'order-food-speaking-2',
        prompt: { en: 'Ask the front desk what time checkout is.', fr: 'Demande à la réception à quelle heure est le check-out.' },
        target: '几点退房？', audio: '/audio/order-food/practice-speaking-02.mp3',
        explanation: { en: '几点退房 is a short, practical checkout question.', fr: '几点退房 est une question courte et pratique pour le check-out.' },
      },
    ],
    reading: [
      {
        id: 'order-food-reading-1',
        prompt: {
          en: 'Match the item you receive after check-in.',
          fr: 'Associe l\'objet reçu après le check-in.',
        },
        target: '房卡',
        audio: '/audio/order-food/practice-reading-01.mp3',
        explanation: {
          en: '房卡 is the room card for entering the hotel room.',
          fr: '房卡 est la carte pour entrer dans la chambre d\'hôtel.',
        },
      },
      {
        id: 'order-food-reading-2',
        prompt: { en: 'Match the hotel word for deposit.', fr: 'Associe le mot d\'hôtel pour caution.' },
        target: '押金', audio: '/audio/order-food/practice-reading-02.mp3',
        explanation: { en: '押金 is the deposit you may need to pay at check-in.', fr: '押金 est la caution que tu pourrais devoir payer au check-in.' },
      },
    ],
  },
  reviewCards: [
    {
      id: 'order-food-review-1',
      front: '我有预订',
      back: {
        en: 'I have a reservation.',
        fr: 'J\'ai une réservation.',
      },
      explanation: {
        en: 'Your opening sentence at the front desk.',
        fr: 'Ta phrase d\'ouverture à la réception.',
      },
    },
    {
      id: 'order-food-review-2',
      front: '请出示护照',
      back: {
        en: 'Please show your passport.',
        fr: 'Veuillez présenter votre passeport.',
      },
      explanation: {
        en: 'A common request during check-in.',
        fr: 'Une demande courante pendant le check-in.',
      },
    },
    {
      id: 'order-food-review-3',
      front: '房卡',
      back: {
        en: 'room card',
        fr: 'carte de chambre',
      },
      explanation: {
        en: 'The key card for your hotel room.',
        fr: 'La carte clé de ta chambre d\'hôtel.',
      },
    },
    { id: 'order-food-review-4', front: 'WiFi密码', back: { en: 'WiFi password', fr: 'mot de passe WiFi' }, explanation: { en: 'Ask this right after check-in.', fr: 'Demande ceci juste après le check-in.' } },
    { id: 'order-food-review-5', front: '退房', back: { en: 'check out', fr: 'check-out' }, explanation: { en: 'Know your checkout time.', fr: 'Connais ton heure de check-out.' } },
    { id: 'order-food-review-6', front: '押金', back: { en: 'deposit', fr: 'caution' }, explanation: { en: 'You may need to pay this at the front desk.', fr: 'Tu pourrais devoir payer ceci à la réception.' } },
  ],
}
