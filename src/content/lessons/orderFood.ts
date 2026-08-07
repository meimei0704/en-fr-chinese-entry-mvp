import type { LessonContent } from '../types.js'

export const orderFoodLesson: LessonContent = {
  id: 'order-food',
  title: {
    en: 'Hotel or apartment check-in',
    fr: 'Arrivée à l\'hôtel ou à l\'appartement',
  },
  scenario: {
    en: 'Complete the simplest front desk check-in: say you have a reservation, give your name, show your passport, receive the room card, ask about WiFi, breakfast, deposit, and checkout time.',
    fr: 'Effectuer le check-in le plus simple à la réception : dire que l\'on a une réservation, donner son nom, présenter son passeport, recevoir la carte de chambre, demander le WiFi, le petit-déjeuner, la caution et l\'heure de check-out.',
  },
  dialogue: {
    title: {
      en: 'Check in at the front desk',
      fr: 'Faire le check-in à la réception',
    },
    lines: [
      {
        id: 'order-food-line-01',
        speaker: {
          en: 'Guest',
          fr: 'Client',
        },
        hanzi: '你好，我有预订。',
        pinyin: 'Nǐ hǎo, wǒ yǒu yùdìng.',
        translation: {
          en: 'Hello, I have a reservation.',
          fr: 'Bonjour, j\'ai une réservation.',
        },
        explanation: {
          en: '我有预订 is the fastest way to start hotel check-in.',
          fr: '我有预订 est la façon la plus rapide de commencer un check-in à l\'hôtel.',
        },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '请问您叫什么名字？',
        pinyin: 'Qǐngwèn nín jiào shénme míngzi?',
        translation: {
          en: 'May I ask your name?',
          fr: 'Puis-je vous demander votre nom ?',
        },
        explanation: {
          en: 'The front desk uses 您 for polite "you" when checking the reservation.',
          fr: 'La réception utilise 您, un « vous » poli, pour vérifier la réservation.',
        },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: {
          en: 'Guest',
          fr: 'Client',
        },
        hanzi: '我叫 Alex。',
        pinyin: 'Wǒ jiào Alex.',
        translation: {
          en: 'My name is Alex.',
          fr: 'Je m\'appelle Alex.',
        },
        explanation: {
          en: 'Keep only the name pattern here because the situation is a front desk check-in.',
          fr: 'On garde seulement la structure du nom ici, car le contexte est la réception.',
        },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '请出示护照。',
        pinyin: 'Qǐng chūshì hùzhào.',
        translation: {
          en: 'Please show your passport.',
          fr: 'Veuillez présenter votre passeport.',
        },
        explanation: {
          en: 'Hotels commonly ask for a passport during check-in.',
          fr: 'Les hôtels demandent souvent le passeport pendant le check-in.',
        },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: {
          en: 'Front desk',
          fr: 'Réception',
        },
        hanzi: '好的，这是您的房卡。',
        pinyin: 'Hǎo de, zhè shì nín de fángkǎ.',
        translation: {
          en: 'Okay, this is your room card.',
          fr: 'D\'accord, voici votre carte de chambre.',
        },
        explanation: {
          en: '房卡 is the room card you need after check-in.',
          fr: '房卡 est la carte de chambre nécessaire après le check-in.',
        },
        audio: '/audio/order-food/line-05.mp3',
      },
      {
        id: 'order-food-line-06',
        speaker: { en: 'Guest', fr: 'Client' },
        hanzi: 'WiFi密码是多少？',
        pinyin: 'WiFi mìmǎ shì duōshǎo?',
        translation: {
          en: 'What is the WiFi password?',
          fr: 'Quel est le mot de passe WiFi ?',
        },
        explanation: {
          en: 'WiFi密码是多少 is the most practical hotel check-in follow-up question.',
          fr: 'WiFi密码是多少 est la question de suivi la plus pratique après le check-in.',
        },
        audio: '/audio/order-food/line-06.mp3',
      },
      {
        id: 'order-food-line-07',
        speaker: { en: 'Front desk', fr: 'Réception' },
        hanzi: '在这里，早餐是早上七点到九点。',
        pinyin: 'Zài zhèlǐ, zǎocān shì zǎoshang qī diǎn dào jiǔ diǎn.',
        translation: {
          en: 'Here it is. Breakfast is from 7 to 9 in the morning.',
          fr: 'Le voici. Le petit-déjeuner est de 7h à 9h du matin.',
        },
        explanation: {
          en: 'The front desk gives WiFi and breakfast info in one practical reply.',
          fr: 'La réception donne le WiFi et les infos petit-déjeuner en une réponse pratique.',
        },
        audio: '/audio/order-food/line-07.mp3',
      },
      {
        id: 'order-food-line-08',
        speaker: { en: 'Guest', fr: 'Client' },
        hanzi: '需要押金吗？几点退房？',
        pinyin: 'Xūyào yājīn ma? Jǐ diǎn tuìfáng?',
        translation: {
          en: 'Is a deposit needed? What time is checkout?',
          fr: 'Une caution est-elle nécessaire ? À quelle heure est le check-out ?',
        },
        explanation: {
          en: 'Ask about deposit and checkout time together to finish the check-in quickly.',
          fr: 'Demande la caution et l\'heure de check-out ensemble pour terminer le check-in rapidement.',
        },
        audio: '/audio/order-food/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'order-food-pattern-1',
      pattern: '我有预订。',
      meaning: {
        en: 'I have a reservation.',
        fr: 'J\'ai une réservation.',
      },
      example: '你好，我有预订。',
      audio: '/audio/order-food/pattern-01.mp3',
      explanation: {
        en: 'Use this as your first front desk sentence.',
        fr: 'Utilise cette phrase comme première phrase à la réception.',
      },
    },
    {
      id: 'order-food-pattern-2',
      pattern: '我叫……',
      meaning: {
        en: 'My name is ...',
        fr: 'Je m\'appelle ...',
      },
      example: '我叫 Alex。',
      audio: '/audio/order-food/pattern-02.mp3',
      explanation: {
        en: 'This gives the name attached to the booking.',
        fr: 'Cela donne le nom associé à la réservation.',
      },
    },
    {
      id: 'order-food-pattern-3',
      pattern: '这是您的……',
      meaning: {
        en: 'This is your ...',
        fr: 'Voici votre ...',
      },
      example: '这是您的房卡。',
      audio: '/audio/order-food/pattern-03.mp3',
      explanation: {
        en: 'You may hear this when receiving a room card or document.',
        fr: 'Tu peux entendre cette structure en recevant une carte de chambre ou un document.',
      },
    },
    {
      id: 'order-food-pattern-4',
      pattern: '……是多少？',
      meaning: { en: 'What is ...? (for numbers)', fr: 'Quel est ... ? (pour les chiffres)' },
      example: 'WiFi密码是多少？',
      audio: '/audio/order-food/pattern-04.mp3',
      explanation: {
        en: 'Use …是多少 to ask for a password, price, or room number.',
        fr: 'Utilise …是多少 pour demander un mot de passe, un prix ou un numéro de chambre.',
      },
    },
    {
      id: 'order-food-pattern-5',
      pattern: '需要……吗？',
      meaning: { en: 'Is ... needed? / Do I need ...?', fr: 'Est-ce que ... est nécessaire ?' },
      example: '需要押金吗？',
      audio: '/audio/order-food/pattern-05.mp3',
      explanation: {
        en: 'Use 需要…吗 to ask whether a deposit, passport, or other item is required.',
        fr: 'Utilise 需要…吗 pour demander si une caution, un passeport ou autre est nécessaire.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'order-food-vocab-1',
      hanzi: '预订',
      pinyin: 'yùdìng',
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
      pinyin: 'míngzi',
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
      pinyin: 'hùzhào',
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
      pinyin: 'fángkǎ',
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
      pinyin: 'qiántái',
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
      id: 'order-food-vocab-6', hanzi: 'WiFi密码', pinyin: 'WiFi mìmǎ', audio: '/audio/order-food/vocab-06.mp3',
      meaning: { en: 'WiFi password', fr: 'mot de passe WiFi' },
      explanation: { en: 'The first thing to ask after check-in.', fr: 'La première chose à demander après le check-in.' },
    },
    {
      id: 'order-food-vocab-7', hanzi: '早餐', pinyin: 'zǎocān', audio: '/audio/order-food/vocab-07.mp3',
      meaning: { en: 'breakfast', fr: 'petit-déjeuner' },
      explanation: { en: 'Ask about breakfast time and location at check-in.', fr: 'Demande l\'heure et le lieu du petit-déjeuner au check-in.' },
    },
    {
      id: 'order-food-vocab-8', hanzi: '押金', pinyin: 'yājīn', audio: '/audio/order-food/vocab-08.mp3',
      meaning: { en: 'deposit', fr: 'caution' },
      explanation: { en: 'Many hotels in China ask for a deposit during check-in.', fr: 'Beaucoup d\'hôtels en Chine demandent une caution au check-in.' },
    },
    {
      id: 'order-food-vocab-9', hanzi: '退房', pinyin: 'tuìfáng', audio: '/audio/order-food/vocab-09.mp3',
      meaning: { en: 'check out', fr: 'check-out / libérer la chambre' },
      explanation: { en: 'Know your 退房 time to avoid extra charges.', fr: 'Connais ton heure de 退房 pour éviter des frais supplémentaires.' },
    },
    {
      id: 'order-food-vocab-10', hanzi: '电梯', pinyin: 'diàntī', audio: '/audio/order-food/vocab-10.mp3',
      meaning: { en: 'elevator', fr: 'ascenseur' },
      explanation: { en: 'Ask 电梯在哪里？ to find the elevator to your room.', fr: 'Demande 电梯在哪里？ pour trouver l\'ascenseur vers ta chambre.' },
    },
  ],
  pronunciation: [
    {
      id: 'order-food-pronunciation-1',
      focus: {
        en: 'Name pattern in a front desk context',
        fr: 'Structure du nom à la réception',
      },
      audioText: '我叫',
      audio: '/audio/order-food/pronunciation-01.mp3',
      tip: {
        en: 'Say 我叫 plus your name clearly; keep the focus on the booking, not a social self-introduction.',
        fr: 'Dis clairement 我叫 suivi de ton nom ; le contexte reste la réservation, pas une présentation sociale.',
      },
      explanation: {
        en: 'This keeps the old name skill but moves it into the check-in task.',
        fr: 'Cela garde la compétence du nom, mais la déplace dans la tâche de check-in.',
      },
    },
    {
      id: 'order-food-pronunciation-2',
      focus: { en: 'Second vs fourth tone: 房 vs 放', fr: '2e vs 4e ton : 房 vs 放' },
      audioText: '房卡，退房，放在这里',
      audio: '/audio/order-food/pronunciation-02.mp3',
      tip: {
        en: '房 (fáng) rises gently; 放 (fàng) drops sharply. Mixing them may confuse the front desk.',
        fr: '房 (fáng) monte doucement ; 放 (fàng) descend brusquement. Les confondre peut troubler la réception.',
      },
      explanation: {
        en: '房 and 放 appear often at hotels — getting the tone right avoids misunderstandings.',
        fr: '房 et 放 apparaissent souvent à l\'hôtel — maîtriser le ton évite les malentendus.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'order-food-hanzi-1',
      hanzi: '预',
      pinyin: 'yù',
      meaning: {
        en: 'in advance; first character of reservation',
        fr: 'à l\'avance ; premier caractère de réservation',
      },
      explanation: {
        en: 'Recognize 预 as part of 预订.',
        fr: 'Reconnais 预 dans 预订.',
      },
    },
    {
      id: 'order-food-hanzi-2',
      hanzi: '订',
      pinyin: 'dìng',
      meaning: {
        en: 'book / reserve; second character of reservation',
        fr: 'réserver ; deuxième caractère de réservation',
      },
      explanation: {
        en: '订 completes 预订, the word for reservation.',
        fr: '订 complète 预订, le mot pour réservation.',
      },
    },
    {
      id: 'order-food-hanzi-3',
      hanzi: '房',
      pinyin: 'fáng',
      meaning: {
        en: 'room / house',
        fr: 'chambre / maison',
      },
      explanation: {
        en: '房 appears in 房卡, the room card.',
        fr: '房 apparaît dans 房卡, la carte de chambre.',
      },
    },
    {
      id: 'order-food-hanzi-4',
      hanzi: '卡',
      pinyin: 'kǎ',
      meaning: {
        en: 'card',
        fr: 'carte',
      },
      explanation: {
        en: '卡 completes 房卡, the card for your room.',
        fr: '卡 complète 房卡, la carte de chambre.',
      },
    },
    {
      id: 'order-food-hanzi-5', hanzi: '早', pinyin: 'zǎo',
      meaning: { en: 'morning / early', fr: 'matin / tôt' },
      explanation: { en: 'Recognize 早 in 早餐 on hotel signs.', fr: 'Reconnais 早 dans 早餐 sur les panneaux de l\'hôtel.' },
    },
    {
      id: 'order-food-hanzi-6', hanzi: '金', pinyin: 'jīn',
      meaning: { en: 'money / gold', fr: 'argent / or' },
      explanation: { en: 'Recognize 金 in 押金, the deposit word.', fr: 'Reconnais 金 dans 押金, le mot pour caution.' },
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
  shortInput: {
    id: 'order-food-short-input-01',
    prompt: {
      en: 'You arrive at the front desk. Say you have a reservation.',
      fr: 'Tu arrives à la réception. Dis que tu as une réservation.',
    },
    target: '你好，我有预订。',
    explanation: {
      en: 'This is the first sentence for a basic check-in.',
      fr: 'C\'est la première phrase pour un check-in simple.',
    },
    audio: '/audio/order-food/short-input-01.mp3',
  },
}
