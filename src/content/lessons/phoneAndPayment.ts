import type { LessonContent } from '../types.js'

export const phoneAndPaymentLesson: LessonContent = {
  id: 'phone-and-payment',
  title: {
    en: '中国电话卡 / SIM card setup',
    fr: '中国电话卡 / Configuration de la carte SIM',
  },
  scenario: {
    en: 'Ask for a SIM card, set it up, buy data plan and top up.',
    fr: 'Demander une carte SIM, la configurer, acheter un forfait data et recharger.',
  },
  dialogue: {
    title: {
      en: 'Ask about phone and payment setup',
      fr: 'Demander de l\'aide pour le téléphone et le paiement',
    },
    lines: [
      {
        id: 'phone-and-payment-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好，我想办一张手机卡。',
        pinyin: 'Nǐ hǎo, wǒ xiǎng bàn yì zhāng shǒujīkǎ.',
        translation: {
          en: 'Hello, I would like to get a SIM card.',
          fr: 'Bonjour, je voudrais prendre une carte SIM.',
        },
        explanation: {
          en: '我想办一张手机卡 keeps the request short and practical after check-in.',
          fr: '我想办一张手机卡 garde la demande courte et pratique après l\'arrivée au logement.',
        },
        audio: '/audio/phone-and-payment/line-01.mp3',
      },
      {
        id: 'phone-and-payment-line-02',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '好的，请出示护照。',
        pinyin: 'Hǎo de, qǐng chūshì hùzhào.',
        translation: {
          en: 'Okay, please show your passport.',
          fr: 'D\'accord, veuillez présenter votre passeport.',
        },
        explanation: {
          en: 'This reuses the passport phrase from arrival in a phone setup context.',
          fr: 'Cette phrase réutilise le mot passeport dans un contexte de téléphone.',
        },
        audio: '/audio/phone-and-payment/line-02.mp3',
      },
      {
        id: 'phone-and-payment-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '这个号码可以用来支付吗？',
        pinyin: 'Zhège hàomǎ kěyǐ yòng lái zhīfù ma?',
        translation: {
          en: 'Can this number be used for payment?',
          fr: 'Est-ce que ce numéro peut servir au paiement ?',
        },
        explanation: {
          en: 'The learner hears 手机号码 and 支付 as a simple setup question, not a full payment guide.',
          fr: 'L\'apprenant entend 手机号码 et 支付 dans une question simple, sans guide complet de paiement.',
        },
        audio: '/audio/phone-and-payment/line-03.mp3',
      },
      {
        id: 'phone-and-payment-line-04',
        speaker: {
          en: 'Clerk',
          fr: 'Employé',
        },
        hanzi: '可以，也可以先用现金。',
        pinyin: 'Kěyǐ, yě kěyǐ xiān yòng xiànjīn.',
        translation: {
          en: 'Yes, and you can also use cash first.',
          fr: 'Oui, et vous pouvez aussi utiliser des espèces d\'abord.',
        },
        explanation: {
          en: '现金 gives a safe fallback word if phone payment is not ready yet.',
          fr: '现金 donne un mot de secours si le paiement mobile n\'est pas encore prêt.',
        },
        audio: '/audio/phone-and-payment/line-04.mp3',
      },
      {
        id: 'phone-and-payment-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '有什么流量套餐？',
        pinyin: 'Yǒu shénme liúliàng tàocān?',
        translation: {
          en: 'What data plans do you have?',
          fr: 'Quels forfaits data avez-vous ?',
        },
        explanation: {
          en: 'Ask 有什么流量套餐 to compare data plan options at a phone shop.',
          fr: 'Demande 有什么流量套餐 pour comparer les forfaits data dans une boutique.',
        },
        audio: '/audio/phone-and-payment/line-05.mp3',
      },
      {
        id: 'phone-and-payment-line-06',
        speaker: { en: 'Clerk', fr: 'Employé' },
        hanzi: '有10G和30G的，你要哪个？',
        pinyin: 'Yǒu shí G hé sānshí G de, nǐ yào nǎge?',
        translation: {
          en: 'We have 10G and 30G. Which one do you want?',
          fr: 'Nous avons 10 Go et 30 Go. Lequel voulez-vous ?',
        },
        explanation: {
          en: 'The clerk names two plan sizes and asks you to choose.',
          fr: 'L\'employé nomme deux tailles de forfait et te demande de choisir.',
        },
        audio: '/audio/phone-and-payment/line-06.mp3',
      },
      {
        id: 'phone-and-payment-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '怎么充值？',
        pinyin: 'Zěnme chōngzhí?',
        translation: {
          en: 'How do I top up?',
          fr: 'Comment recharger ?',
        },
        explanation: {
          en: 'Ask 怎么充值 to learn how to add credit to your phone.',
          fr: 'Demande 怎么充值 pour savoir comment ajouter du crédit à ton téléphone.',
        },
        audio: '/audio/phone-and-payment/line-07.mp3',
      },
      {
        id: 'phone-and-payment-line-08',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '好的，谢谢。',
        pinyin: 'Hǎo de, xièxie.',
        translation: {
          en: 'Okay, thank you.',
          fr: 'D\'accord, merci.',
        },
        explanation: {
          en: 'A short closing phrase keeps the exchange beginner friendly.',
          fr: 'Une formule de clôture courte garde l\'échange accessible aux débutants.',
        },
        audio: '/audio/phone-and-payment/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'phone-and-payment-pattern-1',
      pattern: '我要买一个……。',
      meaning: {
        en: 'I want to buy a ...',
        fr: 'Je veux acheter un / une ...',
      },
      example: '我要买一个 SIM 卡。',
      audio: '/audio/phone-and-payment/pattern-01.mp3',
      explanation: {
        en: 'Start the SIM card request with 我要买一个 SIM 卡.',
        fr: 'Commence la demande de carte SIM avec 我要买一个 SIM 卡.',
      },
    },
    {
      id: 'phone-and-payment-pattern-2',
      pattern: '能帮我……吗？',
      meaning: {
        en: 'Could you help me ...?',
        fr: 'Pouvez-vous m\'aider à ... ?',
      },
      example: '能帮我安装一下吗？',
      audio: '/audio/phone-and-payment/pattern-02.mp3',
      explanation: {
        en: 'Use 能帮我…吗 to ask for help installing or setting something up.',
        fr: 'Utilise 能帮我…吗 pour demander de l\'aide pour installer ou configurer quelque chose.',
      },
    },
    {
      id: 'phone-and-payment-pattern-3',
      pattern: '我需要……。',
      meaning: {
        en: 'I need ...',
        fr: 'J\'ai besoin de ...',
      },
      example: '我需要流量。',
      audio: '/audio/phone-and-payment/pattern-03.mp3',
      explanation: {
        en: 'Say 我需要流量 to ask for mobile data.',
        fr: 'Dis 我需要流量 pour demander de la data mobile.',
      },
    },
    {
      id: 'phone-and-payment-pattern-4',
      pattern: '……有多少流量？',
      meaning: { en: 'How much data does ... have?', fr: 'Combien de data a ... ?' },
      example: '这个套餐有多少流量？', audio: '/audio/phone-and-payment/pattern-04.mp3',
      explanation: { en: 'Ask about the data allowance of a plan with 有多少流量.', fr: 'Demande le volume de data d\'un forfait avec 有多少流量.' },
    },
    {
      id: 'phone-and-payment-pattern-5',
      pattern: '怎么……？',
      meaning: { en: 'How do I ...?', fr: 'Comment ... ?' },
      example: '怎么充值？', audio: '/audio/phone-and-payment/pattern-05.mp3',
      explanation: { en: 'Use 怎么 before a verb to ask how to do something, like 充值.', fr: 'Utilise 怎么 avant un verbe pour demander comment faire quelque chose, comme 充值.' },
    },
  ],
  vocabulary: [
    {
      id: 'phone-and-payment-vocab-1',
      hanzi: '手机卡',
      pinyin: 'shǒujīkǎ',
      audio: '/audio/phone-and-payment/vocab-01.mp3',
      meaning: {
        en: 'SIM card / phone card',
        fr: 'carte SIM / carte de téléphone',
      },
      explanation: {
        en: 'The practical word for asking about phone service after arrival.',
        fr: 'Le mot pratique pour demander un service téléphonique après l\'arrivée.',
      },
    },
    {
      id: 'phone-and-payment-vocab-2',
      hanzi: '手机号码',
      pinyin: 'shǒujī hàomǎ',
      audio: '/audio/phone-and-payment/vocab-02.mp3',
      meaning: {
        en: 'phone number',
        fr: 'numéro de téléphone',
      },
      explanation: {
        en: 'Recognize it when someone confirms the number attached to the phone.',
        fr: 'Reconnais-le quand quelqu\'un confirme le numéro lié au téléphone.',
      },
    },
    {
      id: 'phone-and-payment-vocab-3',
      hanzi: '支付',
      pinyin: 'zhīfù',
      audio: '/audio/phone-and-payment/vocab-03.mp3',
      meaning: {
        en: 'pay / payment',
        fr: 'payer / paiement',
      },
      explanation: {
        en: 'A core word for mobile payment questions.',
        fr: 'Un mot central pour les questions de paiement mobile.',
      },
    },
    {
      id: 'phone-and-payment-vocab-4',
      hanzi: '现金',
      pinyin: 'xiànjīn',
      audio: '/audio/phone-and-payment/vocab-04.mp3',
      meaning: {
        en: 'cash',
        fr: 'espèces',
      },
      explanation: {
        en: 'A useful fallback if phone payment is not ready.',
        fr: 'Une solution utile si le paiement mobile n\'est pas prêt.',
      },
    },
    {
      id: 'phone-and-payment-vocab-5',
      hanzi: '可以',
      pinyin: 'kěyǐ',
      audio: '/audio/phone-and-payment/vocab-05.mp3',
      meaning: {
        en: 'can / may',
        fr: 'pouvoir / être possible',
      },
      explanation: {
        en: 'Use it to ask if an action or payment method is possible.',
        fr: 'Utilise-le pour demander si une action ou un moyen de paiement est possible.',
      },
    },
    { id: 'phone-and-payment-vocab-6', hanzi: '流量', pinyin: 'liúliàng', audio: '/audio/phone-and-payment/vocab-06.mp3', meaning: { en: 'data / mobile data', fr: 'données mobiles' }, explanation: { en: 'The key word when choosing a phone plan.', fr: 'Le mot clé pour choisir un forfait téléphonique.' } },
    { id: 'phone-and-payment-vocab-7', hanzi: '套餐', pinyin: 'tàocān', audio: '/audio/phone-and-payment/vocab-07.mp3', meaning: { en: 'plan / package', fr: 'forfait' }, explanation: { en: '套餐 means a bundled plan for phone, data, or even meals.', fr: '套餐 désigne un forfait groupé pour le téléphone, les données ou même les repas.' } },
    { id: 'phone-and-payment-vocab-8', hanzi: '充值', pinyin: 'chōngzhí', audio: '/audio/phone-and-payment/vocab-08.mp3', meaning: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'Use 充值 when you need to add credit to your phone or transit card.', fr: 'Utilise 充值 quand tu dois ajouter du crédit à ton téléphone ou ta carte de transport.' } },
    { id: 'phone-and-payment-vocab-9', hanzi: '微信', pinyin: 'Wēixìn', audio: '/audio/phone-and-payment/vocab-09.mp3', meaning: { en: 'WeChat', fr: 'WeChat' }, explanation: { en: 'The most common messaging and payment app in China.', fr: 'L\'application de messagerie et de paiement la plus courante en Chine.' } },
    { id: 'phone-and-payment-vocab-10', hanzi: '余额', pinyin: 'yú\'é', audio: '/audio/phone-and-payment/vocab-10.mp3', meaning: { en: 'balance', fr: 'solde' }, explanation: { en: 'Check your 余额 to know how much credit you have left.', fr: 'Vérifie ton 余额 pour savoir combien de crédit il te reste.' } },
  ],
  practice: {
    listening: [
      {
        id: 'phone-and-payment-listening-1',
        prompt: {
          en: 'Listen for the word that means SIM card.',
          fr: 'Écoute le mot qui signifie carte SIM.',
        },
        target: '手机卡',
        audio: '/audio/phone-and-payment/practice-listening-01.mp3',
        explanation: {
          en: '手机卡 is the phone card or SIM card in this service exchange.',
          fr: '手机卡 désigne la carte SIM dans cet échange de service.',
        },
      },
      { id: 'phone-and-payment-listening-2', prompt: { en: 'Which phrase asks about data plans?', fr: 'Quelle phrase demande les forfaits data ?' }, target: '有什么流量套餐？', audio: '/audio/phone-and-payment/practice-listening-02.mp3', explanation: { en: '有什么流量套餐 helps you compare phone plan options.', fr: '有什么流量套餐 t\'aide à comparer les forfaits téléphoniques.' } },
    ],
    speaking: [
      {
        id: 'phone-and-payment-speaking-1',
        prompt: {
          en: 'Ask whether phone payment is possible.',
          fr: 'Demande si le paiement par téléphone est possible.',
        },
        target: '可以用手机支付吗？',
        audio: '/audio/phone-and-payment/practice-speaking-01.mp3',
        explanation: {
          en: 'This question is the safest short way to check mobile payment.',
          fr: 'Cette question est la manière courte la plus sûre de vérifier le paiement mobile.',
        },
      },
      { id: 'phone-and-payment-speaking-2', prompt: { en: 'Ask how to top up your phone.', fr: 'Demande comment recharger ton téléphone.' }, target: '怎么充值？', audio: '/audio/phone-and-payment/practice-speaking-02.mp3', explanation: { en: '怎么充值 is the fastest way to ask about adding credit.', fr: '怎么充值 est la façon la plus rapide de demander comment ajouter du crédit.' } },
    ],
    reading: [
      {
        id: 'phone-and-payment-reading-1',
        prompt: {
          en: 'Match 手机号码 with its meaning.',
          fr: 'Associe 手机号码 à son sens.',
        },
        target: '手机号码',
        audio: '/audio/phone-and-payment/practice-reading-01.mp3',
        explanation: {
          en: '手机号码 means phone number.',
          fr: '手机号码 signifie numéro de téléphone.',
        },
      },
      { id: 'phone-and-payment-reading-2', prompt: { en: 'Match the payment app name.', fr: 'Associe le nom de l\'appli de paiement.' }, target: '微信', audio: '/audio/phone-and-payment/practice-reading-02.mp3', explanation: { en: '微信 is the most important app name to recognize in China.', fr: '微信 est le nom d\'application le plus important à reconnaître en Chine.' } },
    ],
  },
  reviewCards: [
    {
      id: 'phone-and-payment-review-1',
      front: '手机卡',
      back: {
        en: 'SIM card / phone card',
        fr: 'carte SIM / carte de téléphone',
      },
      explanation: {
        en: 'Use this when asking for basic phone service.',
        fr: 'Utilise ce mot pour demander un service téléphonique de base.',
      },
    },
    {
      id: 'phone-and-payment-review-2',
      front: '手机号码',
      back: {
        en: 'phone number',
        fr: 'numéro de téléphone',
      },
      explanation: {
        en: 'This is the number attached to the phone or SIM card.',
        fr: 'C\'est le numéro lié au téléphone ou à la carte SIM.',
      },
    },
    {
      id: 'phone-and-payment-review-3',
      front: '可以用手机支付吗？',
      back: {
        en: 'Can I pay by phone?',
        fr: 'Puis-je payer avec mon téléphone ?',
      },
      explanation: {
        en: 'A short practical question for shops and counters.',
        fr: 'Une question courte et pratique dans les magasins et aux comptoirs.',
      },
    },
    { id: 'phone-and-payment-review-4', front: '流量', back: { en: 'mobile data', fr: 'données mobiles' }, explanation: { en: 'The word for mobile data.', fr: 'Le mot pour les données mobiles.' } },
    { id: 'phone-and-payment-review-5', front: '充值', back: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'How to add credit to your phone.', fr: 'Comment ajouter du crédit à ton téléphone.' } },
    { id: 'phone-and-payment-review-6', front: '微信', back: { en: 'WeChat', fr: 'WeChat' }, explanation: { en: 'The essential messaging and payment app.', fr: 'L\'application essentielle de messagerie et de paiement.' } },
  ],
}
