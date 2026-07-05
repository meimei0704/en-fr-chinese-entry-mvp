import type { LessonContent } from '../types'

export const orderFoodLesson: LessonContent = {
  id: 'order-food',
  title: {
    en: 'Order food',
    fr: 'Commander à manger',
  },
  scenario: {
    en: 'Ordering one simple dish and drink at a casual restaurant.',
    fr: 'Commander un plat simple et une boisson dans un restaurant décontracté.',
  },
  dialogue: {
    title: {
      en: 'Place a simple order',
      fr: 'Passer une commande simple',
    },
    lines: [
      {
        id: 'order-food-line-01',
        speaker: 'Customer',
        hanzi: '请给我一碗面。',
        pinyin: 'Qǐng gěi wǒ yì wǎn miàn.',
        translation: {
          en: 'Please give me one bowl of noodles.',
          fr: 'Donnez-moi un bol de nouilles, s’il vous plaît.',
        },
        explanation: {
          en: '请给我... is a polite way to ask for an item.',
          fr: '请给我... est une façon polie de demander un article.',
        },
        audio: '/audio/order-food/line-01.mp3',
      },
      {
        id: 'order-food-line-02',
        speaker: 'Server',
        hanzi: '要大碗还是小碗？',
        pinyin: 'Yào dà wǎn háishì xiǎo wǎn?',
        translation: {
          en: 'Would you like a large bowl or a small bowl?',
          fr: 'Vous voulez un grand bol ou un petit bol ?',
        },
        explanation: {
          en: 'The server asks you to choose between two common size options.',
          fr: 'Le serveur te demande de choisir entre deux tailles courantes.',
        },
        audio: '/audio/order-food/line-02.mp3',
      },
      {
        id: 'order-food-line-03',
        speaker: 'Customer',
        hanzi: '小碗，谢谢。',
        pinyin: 'Xiǎo wǎn, xièxie.',
        translation: {
          en: 'A small bowl, thank you.',
          fr: 'Un petit bol, merci.',
        },
        explanation: {
          en: 'Answer briefly with the size you want, then add a polite thank-you.',
          fr: 'Réponds brièvement avec la taille voulue puis ajoute un merci poli.',
        },
        audio: '/audio/order-food/line-03.mp3',
      },
      {
        id: 'order-food-line-04',
        speaker: 'Server',
        hanzi: '要喝的吗？',
        pinyin: 'Yào hē de ma?',
        translation: {
          en: 'Would you like something to drink?',
          fr: 'Vous voulez quelque chose à boire ?',
        },
        explanation: {
          en: 'The server asks if you want a drink to go with the meal.',
          fr: 'Le serveur demande si tu veux une boisson avec le repas.',
        },
        audio: '/audio/order-food/line-04.mp3',
      },
      {
        id: 'order-food-line-05',
        speaker: 'Customer',
        hanzi: '再来一杯茶。',
        pinyin: 'Zài lái yì bēi chá.',
        translation: {
          en: 'And one cup of tea.',
          fr: 'Et une tasse de thé.',
        },
        explanation: {
          en: '再来 adds one more item to the order.',
          fr: '再来 sert à ajouter un autre élément à la commande.',
        },
        audio: '/audio/order-food/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'order-food-pattern-1',
      pattern: '请给我…',
      meaning: 'Please give me ...',
      example: '请给我一杯水。',
      explanation: {
        en: 'Use this pattern to politely request food or drinks.',
        fr: 'Utilise cette structure pour demander poliment de la nourriture ou une boisson.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'order-food-vocab-1',
      hanzi: '面',
      pinyin: 'miàn',
      meaning: 'noodles',
      explanation: {
        en: 'A common beginner food word when ordering meals.',
        fr: 'Un mot courant de débutant pour commander un plat de nouilles.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'order-food-pronunciation-1',
      focus: 'Measure words',
      tip: 'Keep the beat clear in 一碗 and 一杯.',
      explanation: {
        en: 'Food orders often include a number plus a measure word.',
        fr: 'Les commandes utilisent souvent un nombre suivi d’un mot de mesure.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'order-food-hanzi-1',
      hanzi: '茶',
      pinyin: 'chá',
      meaning: 'tea',
      explanation: {
        en: 'Recognize 茶 on menus and drink signs.',
        fr: 'Reconnais 茶 sur les menus et les boissons.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'order-food-listening-1',
        prompt: 'Which line adds tea to the order?',
        target: '再来一杯茶。',
        explanation: {
          en: 'Listen for 再来 to catch an added item.',
          fr: 'Écoute 再来 pour repérer un élément ajouté.',
        },
      },
    ],
    speaking: [
      {
        id: 'order-food-speaking-1',
        prompt: 'Ask for one bowl of noodles.',
        target: '请给我一碗面。',
        explanation: {
          en: 'Use the full polite request pattern.',
          fr: 'Utilise la formule complète de demande polie.',
        },
      },
    ],
    reading: [
      {
        id: 'order-food-reading-1',
        prompt: 'Read aloud: 要喝的吗？',
        target: 'Yào hē de ma?',
        explanation: {
          en: 'Practice the short question asked by the server.',
          fr: 'Entraîne-toi à lire la courte question du serveur.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'order-food-review-1',
      front: '请给我',
      back: {
        en: 'Please give me',
        fr: 'Donnez-moi',
      },
      explanation: {
        en: 'A useful polite opener for many service situations.',
        fr: 'Une formule polie utile dans de nombreuses situations de service.',
      },
    },
  ],
  shortInput: {
    id: 'order-food-short-input-01',
    prompt: 'Type the phrase for “One cup of tea, please.”',
    target: '请给我一杯茶。',
    explanation: {
      en: 'Reuse the request pattern with tea instead of noodles.',
      fr: 'Réutilise la structure de demande avec du thé au lieu des nouilles.',
    },
    audio: '/audio/order-food/short-input-01.mp3',
  },
}
