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
        explanation: { en: '您 = you (polite)｜好 = good｜我 = I｜要 = want to｜办理 = to handle / go through｜入住 = to check in. Use it to start the check-in at the front desk.', fr: '您 = vous (poli)｜好 = bon｜我 = je｜要 = vouloir｜办理 = effectuer / s’occuper de｜入住 = s’enregistrer. Utilisez-la pour commencer le check-in à la réception.' },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你会说英文吗？',
        pinyin: 'Nǐ huì shuō yīng wén ma?',
        translation: { en: 'Do you speak English?', fr: 'Parlez-vous anglais ?' },
        explanation: { en: '你 = you｜会 = can / know how to｜说 = to speak｜英文 = English｜吗 = question particle. Use it to ask whether someone speaks English.', fr: '你 = toi / vous｜会 = savoir / pouvoir｜说 = parler｜英文 = anglais｜吗 = particule interrogative. Utilisez-la pour demander si quelqu’un parle anglais.' },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我已经预订了。',
        pinyin: 'Wǒ yǐ jīng yù dìng le.',
        translation: { en: 'I have a reservation.', fr: 'J\'ai une réservation.' },
        explanation: { en: '我 = I｜已经 = already｜预订 = to book / reserve｜了 = (completed-action particle). Use it to tell the front desk you have a reservation.', fr: '我 = je｜已经 = déjà｜预订 = réserver｜了 = (particule d’action accomplie). Utilisez-la pour dire à la réception que vous avez une réservation.' },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hù zhào.',
        translation: { en: 'Here is my passport.', fr: 'Voici mon passeport.' },
        explanation: { en: '这 = this｜是 = is / to be｜我的 = my｜护照 = passport. Use it when handing over your passport.', fr: '这 = ceci / ça｜是 = est / être｜我的 = mon / ma｜护照 = passeport. Utilisez-la en présentant votre passeport.' },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: 'Wi-Fi密码是多少？',
        pinyin: 'Wi-Fi mì mǎ shì duō shǎo?',
        translation: { en: 'What is the Wi-Fi password?', fr: 'Quel est le mot de passe Wi-Fi ?' },
        explanation: { en: 'Wi-Fi = Wi-Fi｜密码 = password｜是 = is / to be｜多少 = how much / what (number). Use it to ask for the Wi-Fi password.', fr: 'Wi-Fi = Wi-Fi｜密码 = mot de passe｜是 = est / être｜多少 = combien. Utilisez-la pour demander le mot de passe Wi-Fi.' },
        audio: '/audio/order-food/line-05.mp3',
      },
      {
        id: 'order-food-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '几点吃早餐？',
        pinyin: 'Jǐ diǎn chī zǎo cān?',
        translation: { en: 'What time is breakfast?', fr: 'À quelle heure est le petit-déjeuner ?' },
        explanation: { en: '几点 = what time｜吃 = to eat｜早餐 = breakfast. Use it to ask what time breakfast is at the hotel.', fr: '几点 = à quelle heure｜吃 = manger｜早餐 = petit-déjeuner. Utilisez-la pour demander l’heure du petit-déjeuner à l’hôtel.' },
        audio: '/audio/order-food/line-06.mp3',
      },
      {
        id: 'order-food-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '电梯在哪里？',
        pinyin: 'Diàn tī zài nǎ lǐ?',
        translation: { en: 'Where is the elevator?', fr: 'Où est l\'ascenseur ?' },
        explanation: { en: '电梯 = elevator｜在 = to be at｜哪里 = where. Use it to ask where the elevator to your room is.', fr: '电梯 = ascenseur｜在 = être à / se trouver｜哪里 = où. Utilisez-la pour demander où se trouve l’ascenseur vers votre chambre.' },
        audio: '/audio/order-food/line-07.mp3',
      },
      {
        id: 'order-food-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我需要更多毛巾。',
        pinyin: 'Wǒ xū yào gèng duō máo jīn.',
        translation: { en: 'I need more towels.', fr: 'J\'ai besoin de plus de serviettes.' },
        explanation: { en: '我 = I｜需要 = to need｜更多 = more｜毛巾 = towel. Use it to request more towels from hotel staff.', fr: '我 = je｜需要 = avoir besoin de｜更多 = plus / davantage de｜毛巾 = serviette. Utilisez-la pour demander plus de serviettes au personnel de l’hôtel.' },
        audio: '/audio/order-food/line-08.mp3',
      },
      {
        id: 'order-food-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '空调坏了。',
        pinyin: 'Kōng tiáo huài le.',
        translation: { en: 'The air conditioner does not work.', fr: 'La climatisation ne fonctionne pas.' },
        explanation: { en: '空调 = air conditioner｜坏 = broken / to break｜了 = (change-of-state particle). Use it to report a broken appliance in your room.', fr: '空调 = climatisation｜坏 = en panne / casser｜了 = (particule de changement d’état). Utilisez-la pour signaler un appareil en panne dans votre chambre.' },
        audio: '/audio/order-food/line-09.mp3',
      },
      {
        id: 'order-food-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我的房卡丢了。',
        pinyin: 'Wǒ de fáng kǎ diū le.',
        translation: { en: 'I lost my room key.', fr: 'J\'ai perdu ma carte de chambre.' },
        explanation: { en: '我的 = my｜房卡 = room card｜丢 = to lose｜了 = (completed-action particle). Use it to tell the front desk you lost your room key.', fr: '我的 = mon / ma｜房卡 = carte de chambre｜丢 = perdre｜了 = (particule d’action accomplie). Utilisez-la pour dire à la réception que vous avez perdu votre carte de chambre.' },
        audio: '/audio/order-food/line-10.mp3',
      },
      {
        id: 'order-food-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请打扫房间。',
        pinyin: 'Qǐng dǎ sǎo fáng jiān.',
        translation: { en: 'Please clean my room.', fr: 'Veuillez nettoyer ma chambre.' },
        explanation: { en: '请 = please｜打扫 = to clean｜房间 = room. Use it to request housekeeping service.', fr: '请 = s’il vous plaît｜打扫 = nettoyer｜房间 = chambre. Utilisez-la pour demander le service de ménage.' },
        audio: '/audio/order-food/line-11.mp3',
      },
      {
        id: 'order-food-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我可以寄存行李吗？',
        pinyin: 'Wǒ kě yǐ jì cún xíng li ma?',
        translation: { en: 'Can I store my luggage?', fr: 'Puis-je déposer mes bagages ?' },
        explanation: { en: '我 = I｜可以 = can / may｜寄存 = to store / leave (luggage)｜行李 = luggage｜吗 = question particle. Use it to ask if you can leave your bags at the hotel.', fr: '我 = je｜可以 = pouvoir｜寄存 = déposer / laisser en dépôt｜行李 = bagages｜吗 = particule interrogative. Utilisez-la pour demander si vous pouvez laisser vos bagages à l’hôtel.' },
        audio: '/audio/order-food/line-12.mp3',
      },
      {
        id: 'order-food-line-13',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '需要押金吗？',
        pinyin: 'Xū yào yā jīn ma?',
        translation: { en: 'Is a deposit needed?', fr: 'Une caution est-elle nécessaire ?' },
        explanation: { en: '需要 = to need / require｜押金 = deposit｜吗 = question particle. Use it to ask whether a deposit is required.', fr: '需要 = nécessiter / avoir besoin de｜押金 = caution｜吗 = particule interrogative. Utilisez-la pour demander si une caution est exigée.' },
        audio: '/audio/order-food/line-13.mp3',
      },
      {
        id: 'order-food-line-14',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '几点退房？',
        pinyin: 'Jǐ diǎn tuì fáng?',
        translation: { en: 'What time is checkout?', fr: 'À quelle heure est le check-out ?' },
        explanation: { en: '几点 = what time｜退房 = to check out. Use it to ask the checkout time.', fr: '几点 = à quelle heure｜退房 = libérer la chambre / check-out. Utilisez-la pour demander l’heure du check-out.' },
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
          fillPinyin: 'hù zhào',
          hanzi: '这是我的护照。',
          pinyin: 'Zhè shì wǒ de hù zhào.',
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
          audio: '/audio/order-food/pattern-03-example-01.mp3',
        },
        {
          fill: '身份证',
          fillPinyin: 'shēn fèn zhèng',
          hanzi: '这是我的身份证。',
          pinyin: 'Zhè shì wǒ de shēn fèn zhèng.',
          en: 'This is my ID card.',
          fr: 'Voici ma carte d’identité.',
          audio: '/audio/order-food/pattern-03-example-02.mp3',
        },
        {
          fill: '预订确认单',
          fillPinyin: 'yù dìng què rèn dān',
          hanzi: '这是我的预订确认单。',
          pinyin: 'Zhè shì wǒ de yù dìng què rèn dān.',
          en: 'This is my booking confirmation.',
          fr: 'Voici ma confirmation de réservation.',
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
          fillPinyin: 'Wi-Fi',
          hanzi: 'Wi-Fi 密码是多少？',
          pinyin: 'Wi-Fi mì mǎ shì duō shao?',
          en: 'What is the Wi-Fi password?',
          fr: 'Quel est le mot de passe Wi-Fi ?',
          audio: '/audio/order-food/pattern-04-example-01.mp3',
        },
        {
          fill: '房间号',
          fillPinyin: 'fáng jiān hào',
          hanzi: '房间号是多少？',
          pinyin: 'Fáng jiān hào shì duō shao?',
          en: 'What is the room number?',
          fr: 'Quel est le numéro de chambre ?',
          audio: '/audio/order-food/pattern-04-example-02.mp3',
        },
        {
          fill: '房价',
          fillPinyin: 'fáng jià',
          hanzi: '房价是多少？',
          pinyin: 'Fáng jià shì duō shao?',
          en: 'What is the room rate?',
          fr: 'Quel est le prix de la chambre ?',
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
          fillPinyin: 'tuì fáng',
          hanzi: '几点退房？',
          pinyin: 'Jǐ diǎn tuì fáng?',
          en: 'What time is checkout?',
          fr: 'À quelle heure est le check-out ?',
          audio: '/audio/order-food/pattern-05-example-01.mp3',
        },
        {
          fill: '吃早餐',
          fillPinyin: 'chī zǎo cān',
          hanzi: '几点吃早餐？',
          pinyin: 'Jǐ diǎn chī zǎo cān?',
          en: 'What time is breakfast?',
          fr: 'À quelle heure est le petit-déjeuner ?',
          audio: '/audio/order-food/pattern-05-example-02.mp3',
        },
        {
          fill: '开始',
          fillPinyin: 'kāi shǐ',
          hanzi: '几点开始？',
          pinyin: 'Jǐ diǎn kāi shǐ?',
          en: 'What time does it start?',
          fr: 'À quelle heure ça commence ?',
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
          en: '你 = you｜好 = good｜我 = I｜有 = to have｜预订 = reservation. Use it to tell the front desk to look for your booking.',
          fr: '你 = toi / vous｜好 = bon｜我 = je｜有 = avoir｜预订 = réservation. Utilisez-la pour dire à la réception de chercher votre réservation.',
        },
      },
      {
        id: 'order-food-listening-2',
        prompt: { en: 'Which phrase asks for the WiFi password?', fr: 'Quelle phrase demande le mot de passe WiFi ?' },
        target: 'WiFi密码是多少？', audio: '/audio/order-food/practice-listening-02.mp3',
        explanation: { en: 'WiFi = Wi-Fi｜密码 = password｜是 = is / to be｜多少 = how much / what (number). Use it right after receiving your room card to ask the Wi-Fi password.', fr: 'WiFi = Wi-Fi｜密码 = mot de passe｜是 = est / être｜多少 = combien. Utilisez-la juste après avoir reçu votre carte de chambre pour demander le mot de passe Wi-Fi.' },
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
          en: '我 = I｜叫 = to be called / to call. Use it with your name when the front desk asks who you are.',
          fr: '我 = je｜叫 = s’appeler. Utilisez-la avec votre nom quand la réception demande qui vous êtes.',
        },
      },
      {
        id: 'order-food-speaking-2',
        prompt: { en: 'Ask the front desk what time checkout is.', fr: 'Demande à la réception à quelle heure est le check-out.' },
        target: '几点退房？', audio: '/audio/order-food/practice-speaking-02.mp3',
        explanation: { en: '几点 = what time｜退房 = to check out. Use it as a short, practical way to ask the checkout time.', fr: '几点 = à quelle heure｜退房 = libérer la chambre / check-out. Utilisez-la comme façon courte et pratique de demander l’heure du check-out.' },
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
          en: '房 = room｜卡 = card. Use it for the card that lets you into your hotel room.',
          fr: '房 = chambre｜卡 = carte. Utilisez-le pour la carte qui permet d’entrer dans votre chambre.',
        },
      },
      {
        id: 'order-food-reading-2',
        prompt: { en: 'Match the hotel word for deposit.', fr: 'Associe le mot d\'hôtel pour caution.' },
        target: '押金', audio: '/audio/order-food/practice-reading-02.mp3',
        explanation: { en: '押 = to deposit / pledge｜金 = money. Use it for the deposit you may need to pay at check-in.', fr: '押 = déposer / cautionner｜金 = argent. Utilisez-le pour la caution que vous pourriez devoir payer au check-in.' },
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
          en: '我 = I｜有 = to have｜预订 = reservation. Use it as your opening sentence at the front desk.',
          fr: '我 = je｜有 = avoir｜预订 = réservation. Utilisez-la comme phrase d’ouverture à la réception.',
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
          en: '请 = please｜出示 = to show / present｜护照 = passport. Use it when you are asked to show your passport at check-in.',
          fr: '请 = s’il vous plaît｜出示 = présenter / montrer｜护照 = passeport. Utilisez-la quand on vous demande de présenter votre passeport au check-in.',
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
          en: '房 = room｜卡 = card. Use it for the key card that opens your hotel room.',
          fr: '房 = chambre｜卡 = carte. Utilisez-le pour la carte clé de votre chambre d’hôtel.',
        },
    },
    { id: 'order-food-review-4', front: 'WiFi密码', back: { en: 'WiFi password', fr: 'mot de passe WiFi' }, explanation: { en: 'WiFi = Wi-Fi｜密码 = password. Use it right after check-in to ask for the Wi-Fi password.', fr: 'WiFi = Wi-Fi｜密码 = mot de passe. Utilisez-le juste après le check-in pour demander le mot de passe Wi-Fi.' } },
    { id: 'order-food-review-5', front: '退房', back: { en: 'check out', fr: 'check-out' }, explanation: { en: '退 = to return / withdraw｜房 = room. Use it to check out of the hotel room.', fr: '退 = rendre / quitter｜房 = chambre. Utilisez-le pour le check-out de la chambre.' } },
    { id: 'order-food-review-6', front: '押金', back: { en: 'deposit', fr: 'caution' }, explanation: { en: '押 = to deposit / pledge｜金 = money. Use it for the deposit you may need to pay at the front desk.', fr: '押 = déposer / cautionner｜金 = argent. Utilisez-le pour la caution que vous pourriez devoir payer à la réception.' } },
  ],
}
