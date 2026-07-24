import type { LessonContent } from '../types'

export const phoneAndPaymentLesson: LessonContent = {
  id: 'phone-and-payment',
  title: {
    en: 'Phone number & mobile payment setup',
    fr: 'Téléphone & paiement mobile',
  },
  scenario: {
    en: 'Ask for a SIM card, confirm a phone number, and ask whether you can pay by phone or use cash first.',
    fr: 'Demander une carte SIM, confirmer un numéro de téléphone et demander si l’on peut payer avec son téléphone ou d’abord en espèces.',
  },
  dialogue: {
    title: {
      en: 'Ask about phone and payment setup',
      fr: 'Demander de l’aide pour le téléphone et le paiement',
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
          fr: '我想办一张手机卡 garde la demande courte et pratique après l’arrivée au logement.',
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
          fr: 'D’accord, veuillez présenter votre passeport.',
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
          fr: 'L’apprenant entend 手机号码 et 支付 dans une question simple, sans guide complet de paiement.',
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
          fr: 'Oui, et vous pouvez aussi utiliser des espèces d’abord.',
        },
        explanation: {
          en: '现金 gives a safe fallback word if phone payment is not ready yet.',
          fr: '现金 donne un mot de secours si le paiement mobile n’est pas encore prêt.',
        },
        audio: '/audio/phone-and-payment/line-04.mp3',
      },
      {
        id: 'phone-and-payment-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '好的，谢谢。',
        pinyin: 'Hǎo de, xièxie.',
        translation: {
          en: 'Okay, thank you.',
          fr: 'D’accord, merci.',
        },
        explanation: {
          en: 'A short closing phrase keeps the exchange beginner friendly.',
          fr: 'Une formule de clôture courte garde l’échange accessible aux débutants.',
        },
        audio: '/audio/phone-and-payment/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'phone-and-payment-pattern-1',
      pattern: '我想办……',
      meaning: {
        en: 'I would like to get / arrange ...',
        fr: 'Je voudrais obtenir / faire ...',
      },
      example: '我想办一张手机卡。',
      explanation: {
        en: 'Use it for a compact service request at a counter.',
        fr: 'Utilise cette structure pour une demande simple au comptoir.',
      },
    },
    {
      id: 'phone-and-payment-pattern-2',
      pattern: '可以用……吗？',
      meaning: {
        en: 'Can I use ...?',
        fr: 'Puis-je utiliser ... ?',
      },
      example: '可以用手机支付吗？',
      explanation: {
        en: 'This is the shortest useful question for checking a payment method.',
        fr: 'C’est la question utile la plus courte pour vérifier un moyen de paiement.',
      },
    },
    {
      id: 'phone-and-payment-pattern-3',
      pattern: '也可以先……',
      meaning: {
        en: 'It is also possible to first ...',
        fr: 'Il est aussi possible de d’abord ...',
      },
      example: '也可以先用现金。',
      explanation: {
        en: 'This pattern introduces a fallback without adding complex payment details.',
        fr: 'Cette structure introduit une solution de secours sans détails de paiement complexes.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'phone-and-payment-vocab-1',
      hanzi: '手机卡',
      pinyin: 'shǒujīkǎ',
      meaning: {
        en: 'SIM card / phone card',
        fr: 'carte SIM / carte de téléphone',
      },
      explanation: {
        en: 'The practical word for asking about phone service after arrival.',
        fr: 'Le mot pratique pour demander un service téléphonique après l’arrivée.',
      },
    },
    {
      id: 'phone-and-payment-vocab-2',
      hanzi: '手机号码',
      pinyin: 'shǒujī hàomǎ',
      meaning: {
        en: 'phone number',
        fr: 'numéro de téléphone',
      },
      explanation: {
        en: 'Recognize it when someone confirms the number attached to the phone.',
        fr: 'Reconnais-le quand quelqu’un confirme le numéro lié au téléphone.',
      },
    },
    {
      id: 'phone-and-payment-vocab-3',
      hanzi: '支付',
      pinyin: 'zhīfù',
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
      meaning: {
        en: 'cash',
        fr: 'espèces',
      },
      explanation: {
        en: 'A useful fallback if phone payment is not ready.',
        fr: 'Une solution utile si le paiement mobile n’est pas prêt.',
      },
    },
    {
      id: 'phone-and-payment-vocab-5',
      hanzi: '可以',
      pinyin: 'kěyǐ',
      meaning: {
        en: 'can / may',
        fr: 'pouvoir / être possible',
      },
      explanation: {
        en: 'Use it to ask if an action or payment method is possible.',
        fr: 'Utilise-le pour demander si une action ou un moyen de paiement est possible.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'phone-and-payment-pronunciation-1',
      focus: {
        en: 'Phone and payment words',
        fr: 'Mots du téléphone et du paiement',
      },
      tip: {
        en: 'Keep 手机, 支付, and 现金 short and clear; they carry the key meaning in this setup exchange.',
        fr: 'Prononce clairement 手机, 支付 et 现金 ; ce sont les mots clés de cet échange.',
      },
      explanation: {
        en: 'This lesson prioritizes recognizing the useful service words over technical setup detail.',
        fr: 'Cette leçon vise la reconnaissance de mots de service utiles, pas les détails techniques.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'phone-and-payment-hanzi-1',
      hanzi: '手',
      pinyin: 'shǒu',
      meaning: {
        en: 'hand; first character of mobile phone',
        fr: 'main ; premier caractère de téléphone portable',
      },
      explanation: {
        en: 'Recognize 手 inside 手机.',
        fr: 'Reconnais 手 dans 手机.',
      },
    },
    {
      id: 'phone-and-payment-hanzi-2',
      hanzi: '机',
      pinyin: 'jī',
      meaning: {
        en: 'machine; second character of mobile phone',
        fr: 'machine ; deuxième caractère de téléphone portable',
      },
      explanation: {
        en: '机 completes 手机, the common word for mobile phone.',
        fr: '机 complète 手机, le mot courant pour téléphone portable.',
      },
    },
    {
      id: 'phone-and-payment-hanzi-3',
      hanzi: '支',
      pinyin: 'zhī',
      meaning: {
        en: 'support; first character of payment',
        fr: 'soutenir ; premier caractère de paiement',
      },
      explanation: {
        en: 'Recognize 支 at the start of 支付.',
        fr: 'Reconnais 支 au début de 支付.',
      },
    },
    {
      id: 'phone-and-payment-hanzi-4',
      hanzi: '付',
      pinyin: 'fù',
      meaning: {
        en: 'pay; second character of payment',
        fr: 'payer ; deuxième caractère de paiement',
      },
      explanation: {
        en: '付 completes 支付, the word for payment.',
        fr: '付 complète 支付, le mot pour paiement.',
      },
    },
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
        explanation: {
          en: '手机卡 is the phone card or SIM card in this service exchange.',
          fr: '手机卡 désigne la carte SIM dans cet échange de service.',
        },
      },
    ],
    speaking: [
      {
        id: 'phone-and-payment-speaking-1',
        prompt: {
          en: 'Ask whether phone payment is possible.',
          fr: 'Demande si le paiement par téléphone est possible.',
        },
        target: '可以用手机支付吗？',
        explanation: {
          en: 'This question is the safest short way to check mobile payment.',
          fr: 'Cette question est la manière courte la plus sûre de vérifier le paiement mobile.',
        },
      },
    ],
    reading: [
      {
        id: 'phone-and-payment-reading-1',
        prompt: {
          en: 'Match 手机号码 with its meaning.',
          fr: 'Associe 手机号码 à son sens.',
        },
        target: '手机号码',
        explanation: {
          en: '手机号码 means phone number.',
          fr: '手机号码 signifie numéro de téléphone.',
        },
      },
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
        fr: 'C’est le numéro lié au téléphone ou à la carte SIM.',
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
  ],
  shortInput: {
    id: 'phone-and-payment-short-input-01',
    prompt: {
      en: 'You want to confirm whether you can pay by phone.',
      fr: 'Tu veux confirmer si tu peux payer avec ton téléphone.',
    },
    target: '可以用手机支付吗？',
    explanation: {
      en: 'Use 可以用手机支付吗？ to ask if mobile payment is accepted.',
      fr: 'Utilise 可以用手机支付吗？ pour demander si le paiement mobile est accepté.',
    },
    audio: '/audio/phone-and-payment/short-input-01.mp3',
  },
}
