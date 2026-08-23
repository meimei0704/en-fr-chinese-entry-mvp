import type { LessonContent } from '../types.js'

export const smallTalkLesson: LessonContent = {
  id: 'small-talk',
  title: {
    en: '闲聊和赞美 / Small talk and compliment',
    fr: '闲聊和赞美 / Petite conversation et compliments',
  },
  scenario: {
    en: 'Break the ice with common conversation starters and send positive messages by giving people proper compliments.',
    fr: 'Brise la glace avec des amorces de conversation courantes et envoie des messages positifs en faisant des compliments appropriés.',
  },
  dialogue: {
    title: {
      en: 'A friendly chat',
      fr: 'Une conversation amicale',
    },
    lines: [
      {
        id: 'small-talk-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '今天天气很好。',
        pinyin: 'Jīn tiān tiān qì hěn hǎo.',
        translation: { en: 'The weather is nice today.', fr: 'Le temps est agréable aujourd\'hui.' },
        explanation: { en: 'Open a chat with 今天天气 and a word like 很好.', fr: 'Ouvre une conversation avec 今天天气 et un mot comme 很好.' },
        audio: '/audio/small-talk/line-01.mp3',
      },
      {
        id: 'small-talk-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '今天天气好冷啊。',
        pinyin: 'Jīn tiān tiān qì hǎo lěng a.',
        translation: { en: 'The weather is cold today.', fr: 'Il fait froid aujourd\'hui.' },
        explanation: { en: 'Comment on the cold weather with 好冷啊 to keep a chat going.', fr: 'Commente le froid avec 好冷啊 pour poursuivre une conversation.' },
        audio: '/audio/small-talk/line-02.mp3',
      },
      {
        id: 'small-talk-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        translation: { en: 'How are you?', fr: 'Comment vas-tu ?' },
        explanation: { en: 'The classic way to ask how someone is doing.', fr: 'La façon classique de demander comment ça va.' },
        audio: '/audio/small-talk/line-03.mp3',
      },
      {
        id: 'small-talk-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你从哪里来的？',
        pinyin: 'Nǐ cóng nǎ lǐ lái de?',
        translation: { en: 'Where are you from?', fr: 'D’où viens-tu ?' },
        explanation: { en: 'A friendly question about where someone comes from.', fr: 'Une question amicale sur l’origine de quelqu’un.' },
        audio: '/audio/small-talk/line-04.mp3',
      },
      {
        id: 'small-talk-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你穿衣真好看.',
        pinyin: 'Nǐ chuān yī zhēn hǎo kàn.',
        translation: { en: 'I like your outfit.', fr: 'J\'aime beaucoup ta tenue.' },
        explanation: { en: 'Compliment someone\'s outfit with 你穿衣真好看.', fr: 'Complimente la tenue de quelqu\'un avec 你穿衣真好看.' },
        audio: '/audio/small-talk/line-05.mp3',
      },
      {
        id: 'small-talk-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太幽默了.',
        pinyin: 'Nǐ tài yōu mò le.',
        translation: { en: 'You are so funny.', fr: 'Tu es très drôle.' },
        explanation: { en: 'Compliment someone\'s humor with 你太幽默了.', fr: 'Complimente l\'humour de quelqu\'un avec 你太幽默了.' },
        audio: '/audio/small-talk/line-06.mp3',
      },
      {
        id: 'small-talk-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太棒了！',
        pinyin: 'Nǐ tài bàng le!',
        translation: { en: 'You\'re amazing!', fr: 'Tu es vraiment génial !' },
        explanation: { en: 'Use 你太……了 to give a strong compliment.', fr: 'Utilise 你太……了 pour faire un grand compliment.' },
        audio: '/audio/small-talk/line-07.mp3',
      },
      {
        id: 'small-talk-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你真了不起！',
        pinyin: 'Nǐ zhēn liǎo bù qǐ!',
        translation: { en: 'You\'re incredible.', fr: 'Tu es incroyable !' },
        explanation: { en: 'Give a strong compliment with 你真了不起.', fr: 'Fais un grand compliment avec 你真了不起.' },
        audio: '/audio/small-talk/line-08.mp3',
      },
      {
        id: 'small-talk-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你的皮肤很好！',
        pinyin: 'Nǐ de pí fū hěn hǎo!',
        translation: { en: 'Your skin looks great.', fr: 'Ta peau est superbe !' },
        explanation: { en: 'Compliment a trait or feature with 你的……很好.', fr: 'Complimente un trait avec 你的……很好.' },
        audio: '/audio/small-talk/line-09.mp3',
      },
      {
        id: 'small-talk-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太热情了。',
        pinyin: 'Nǐ tài rè qíng le.',
        translation: { en: 'You are so warm-hearted.', fr: 'Tu es très chaleureux.' },
        explanation: { en: 'Compliment someone\'s warm personality with 你太热情了.', fr: 'Complimente la chaleur de quelqu\'un avec 你太热情了.' },
        audio: '/audio/small-talk/line-10.mp3',
      },
      {
        id: 'small-talk-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太乐于助人了.',
        pinyin: 'Nǐ tài lè yú zhù rén le.',
        translation: { en: 'You are kind-hearted and helpful.', fr: 'Tu es gentil(le) et serviable.' },
        explanation: { en: 'Thank someone for being helpful with 你太乐于助人了.', fr: 'Remercie quelqu\'un d\'être serviable avec 你太乐于助人了.' },
        audio: '/audio/small-talk/line-11.mp3',
      },
      {
        id: 'small-talk-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你们这里的东西很好吃。',
        pinyin: 'Nǐ men zhè lǐ de dōng xi hěn hǎo chī.',
        translation: { en: 'Your food is just amazing.', fr: 'La nourriture d\'ici est délicieuse.' },
        explanation: { en: 'Compliment the local food with 很好吃.', fr: 'Complimente la cuisine locale avec 很好吃.' },
        audio: '/audio/small-talk/line-12.mp3',
      },
      {
        id: 'small-talk-line-13',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '祝你玩得开心！再见！',
        pinyin: 'Zhù nǐ wán dé kāi xīn! zài jiàn!',
        translation: { en: 'Enjoy your stay! Goodbye', fr: 'Amuse-toi bien ! Au revoir !' },
        explanation: { en: 'Wish someone a good time with 祝你玩得开心 before 再见.', fr: 'Souhaite un bon moment avec 祝你玩得开心 avant 再见.' },
        audio: '/audio/small-talk/line-13.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'small-talk-pattern-1',
      pattern: '今天天气……。',
      pinyin: 'Jīn tiān tiān qì ... .',
      meaning: {
        en: 'The weather is ... today.',
        fr: 'Le temps est ... aujourd\'hui.',
      },
      audio: '/audio/small-talk/pattern-01.mp3',
      examples: [
        {
          fill: '很好',
          fillPinyin: 'hěn hǎo',
          hanzi: '今天天气很好。',
          pinyin: 'Jīn tiān tiān qì hěn hǎo.',
          en: 'very good',
          fr: 'très bon',
        },
        {
          fill: '不错',
          fillPinyin: 'búcuò',
          hanzi: '今天天气不错。',
          pinyin: 'Jīn tiān tiān qì bú cuò.',
          en: 'nice',
          fr: 'pas mal',
        },
        {
          fill: '好冷',
          fillPinyin: 'hǎo lěng',
          hanzi: '今天天气好冷。',
          pinyin: 'Jīn tiān tiān qì hǎo lěng.',
          en: 'so cold',
          fr: 'très froid',
        },
      ],
    },
    {
      id: 'small-talk-pattern-2',
      pattern: '你好吗？',
      pinyin: 'Nǐ hǎo ma?',
      meaning: {
        en: 'How are you?',
        fr: 'Comment vas-tu ?',
      },
      audio: '/audio/small-talk/pattern-02.mp3',
    },
    {
      id: 'small-talk-pattern-3',
      pattern: '你从哪里来的？',
      pinyin: 'Nǐ cóng nǎ lǐ lái de?',
      meaning: {
        en: 'Where are you from?',
        fr: 'D\'où viens-tu ?',
      },
      audio: '/audio/small-talk/pattern-03.mp3',
    },
    {
      id: 'small-talk-pattern-4',
      pattern: '你太……了！',
      pinyin: 'Nǐ tài ... le!',
      meaning: {
        en: 'You are so ...!',
        fr: 'Tu es vraiment ... !',
      },
      audio: '/audio/small-talk/pattern-04.mp3',
      examples: [
        {
          fill: '棒',
          fillPinyin: 'bàng',
          hanzi: '你太棒了！',
          pinyin: 'Nǐ tài bàng le!',
          en: 'awesome',
          fr: 'génial',
        },
        {
          fill: '幽默',
          fillPinyin: 'yōumò',
          hanzi: '你太幽默了。',
          pinyin: 'Nǐ tài yōu mò le.',
          en: 'funny',
          fr: 'drôle',
        },
        {
          fill: '热情',
          fillPinyin: 'rèqíng',
          hanzi: '你太热情了。',
          pinyin: 'Nǐ tài rè qíng le.',
          en: 'warm-hearted',
          fr: 'chaleureux',
        },
      ],
    },
    {
      id: 'small-talk-pattern-5',
      pattern: '你的……很好！',
      pinyin: 'Nǐ de ... hěn hǎo!',
      meaning: {
        en: 'Your ... is great!',
        fr: 'Ton ... est superbe !',
      },
      audio: '/audio/small-talk/pattern-05.mp3',
      examples: [
        {
          fill: '皮肤',
          fillPinyin: 'pífū',
          hanzi: '你的皮肤很好！',
          pinyin: 'Nǐ de pí fū hěn hǎo!',
          en: 'skin',
          fr: 'la peau',
        },
        {
          fill: '中文',
          fillPinyin: 'Zhōngwén',
          hanzi: '你的中文很好！',
          pinyin: 'Nǐ de Zhōng wén hěn hǎo!',
          en: 'Chinese',
          fr: 'le chinois',
        },
        {
          fill: '英语',
          fillPinyin: 'Yīngyǔ',
          hanzi: '你的英语很好！',
          pinyin: 'Nǐ de Yīng yǔ hěn hǎo!',
          en: 'English',
          fr: 'l\'anglais',
        },
      ],
    },
    {
      id: 'small-talk-pattern-6',
      pattern: '今天天气好冷啊。',
      pinyin: 'Jīn tiān tiān qì hǎo lěng a.',
      meaning: {
        en: 'The weather is cold today.',
        fr: 'Il fait froid aujourd\'hui.',
      },
      audio: '/audio/small-talk/pattern-06.mp3',
    },
    {
      id: 'small-talk-pattern-7',
      pattern: '你穿衣真好看。',
      pinyin: 'Nǐ chuān yī zhēn hǎo kàn.',
      meaning: {
        en: 'I like your outfit.',
        fr: 'J\'aime beaucoup ta tenue.',
      },
      audio: '/audio/small-talk/pattern-07.mp3',
    },
    {
      id: 'small-talk-pattern-8',
      pattern: '你太幽默了。',
      pinyin: 'Nǐ tài yōu mò le.',
      meaning: {
        en: 'You are so funny.',
        fr: 'Tu es très drôle.',
      },
    },
    {
      id: 'small-talk-pattern-9',
      pattern: '你真了不起！',
      pinyin: 'Nǐ zhēn liǎo bu qǐ!',
      meaning: {
        en: 'You are incredible!',
        fr: 'Tu es incroyable !',
      },
    },
    {
      id: 'small-talk-pattern-10',
      pattern: '你太热情了。',
      pinyin: 'Nǐ tài rè qíng le.',
      meaning: {
        en: 'You are so warm-hearted.',
        fr: 'Tu es très chaleureux.',
      },
    },
    {
      id: 'small-talk-pattern-11',
      pattern: '你太乐于助人了。',
      pinyin: 'Nǐ tài lè yú zhù rén le.',
      meaning: {
        en: 'You are kind-hearted and helpful.',
        fr: 'Tu es gentil(le) et serviable.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'small-talk-vocab-1',
      hanzi: '哪里人',
      pinyin: 'nǎ lǐ rén',
      audio: '/audio/small-talk/vocab-01.mp3',
      meaning: {
        en: 'where someone is from',
        fr: 'd’où vient quelqu’un',
      },
      explanation: {
        en: 'Used in 你是哪里人 to ask about origin.',
        fr: 'Utilisé dans 你是哪里人 pour demander l’origine.',
      },
    },
    {
      id: 'small-talk-vocab-2',
      hanzi: '本地',
      pinyin: 'běn dì',
      audio: '/audio/small-talk/vocab-02.mp3',
      meaning: {
        en: 'local',
        fr: 'local / d’ici',
      },
      explanation: {
        en: '本地人 means a local person.',
        fr: '本地人 signifie une personne d’ici.',
      },
    },
    {
      id: 'small-talk-vocab-3',
      hanzi: '天气',
      pinyin: 'tiān qì',
      audio: '/audio/small-talk/vocab-03.mp3',
      meaning: {
        en: 'weather',
        fr: 'temps / météo',
      },
      explanation: {
        en: 'A safe small-talk topic, often asked with 怎么样.',
        fr: 'Un sujet sûr de conversation, souvent demandé avec 怎么样.',
      },
    },
    {
      id: 'small-talk-vocab-4',
      hanzi: '好吃',
      pinyin: 'hǎo chī',
      audio: '/audio/small-talk/vocab-04.mp3',
      meaning: {
        en: 'delicious',
        fr: 'délicieux',
      },
      explanation: {
        en: 'Compliment food with 好吃.',
        fr: 'Complimentez la nourriture avec 好吃.',
      },
    },
    {
      id: 'small-talk-vocab-5',
      hanzi: '计划',
      pinyin: 'jì huà',
      audio: '/audio/small-talk/vocab-05.mp3',
      meaning: {
        en: 'plan',
        fr: 'projet / prévoir',
      },
      explanation: {
        en: '计划 combines with 打算 to talk about plans.',
        fr: '计划 se combine avec 打算 pour parler des projets.',
      },
    },
    {
      id: 'small-talk-vocab-6',
      hanzi: '待',
      pinyin: 'dāi',
      audio: '/audio/small-talk/vocab-06.mp3',
      meaning: {
        en: 'to stay',
        fr: 'rester',
      },
      explanation: {
        en: '待 is used to say how long you will stay.',
        fr: '待 s’utilise pour dire combien de temps vous restez.',
      },
    },
    {
      id: 'small-talk-vocab-7',
      hanzi: '聊天',
      pinyin: 'liáo tiān',
      audio: '/audio/small-talk/vocab-07.mp3',
      meaning: {
        en: 'to chat',
        fr: 'discuter',
      },
      explanation: {
        en: '聊天 is the word for casual chatting.',
        fr: '聊天 est le mot pour une discussion informelle.',
      },
    },
    {
      id: 'small-talk-vocab-8',
      hanzi: '祝你',
      pinyin: 'zhù nǐ',
      audio: '/audio/small-talk/vocab-08.mp3',
      meaning: {
        en: 'wish you',
        fr: 'je te souhaite',
      },
      explanation: {
        en: '祝你 starts a good wish for the other person.',
        fr: '祝你 introduit un bon souhait pour l’autre personne.',
      },
    },
    {
      id: 'small-talk-vocab-9',
      hanzi: '开心',
      pinyin: 'kāi xīn',
      audio: '/audio/small-talk/vocab-09.mp3',
      meaning: {
        en: 'happy',
        fr: 'joyeux / heureux',
      },
      explanation: {
        en: '玩得开心 means have fun.',
        fr: '玩得开心 signifie amuse-toi bien.',
      },
    },
    {
      id: 'small-talk-vocab-10',
      hanzi: '上海',
      pinyin: 'Shàng hǎi',
      audio: '/audio/small-talk/vocab-10.mp3',
      meaning: {
        en: 'Shanghai',
        fr: 'Shanghai',
      },
      explanation: {
        en: 'A common city name to practice saying where you or others are from.',
        fr: 'Un nom de ville courant pour pratiquer l’origine.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'small-talk-listening-1',
        prompt: {
          en: 'Which phrase asks “Where are you from”?',
          fr: 'Quelle phrase demande « D’où venez-vous » ?',
        },
        target: '你是哪里人？',
        pinyin: 'Nǐ shì nǎ lǐ rén?',
        audio: '/audio/small-talk/practice-listening-01.mp3',
        explanation: {
          en: '你是哪里人 is the classic origin question.',
          fr: '你是哪里人 est la question classique sur l’origine.',
        },
      },
      {
        id: 'small-talk-listening-2',
        prompt: {
          en: 'Which phrase asks about the weather?',
          fr: 'Quelle phrase demande le temps qu’il fait ?',
        },
        target: '天气怎么样？',
        pinyin: 'Tiān qì zěn me yàng?',
        audio: '/audio/small-talk/practice-listening-02.mp3',
        explanation: {
          en: '天气怎么样 asks how the weather is.',
          fr: '天气怎么样 demande quel temps il fait.',
        },
      },
    ],
    speaking: [
      {
        id: 'small-talk-speaking-1',
        prompt: {
          en: 'Say that you are from France.',
          fr: 'Dites que vous venez de France.',
        },
        target: '我是法国人。',
        pinyin: 'Wǒ shì Fǎ guó rén.',
        audio: '/audio/small-talk/practice-speaking-01.mp3',
        explanation: {
          en: '我是…人 states your nationality.',
          fr: '我是…人 indique votre nationalité.',
        },
      },
      {
        id: 'small-talk-speaking-2',
        prompt: {
          en: 'Say you plan to stay for two weeks.',
          fr: 'Dites que vous comptez rester deux semaines.',
        },
        target: '我打算待两个星期。',
        pinyin: 'Wǒ dǎ suàn dāi liǎng gè xīng qī.',
        audio: '/audio/small-talk/practice-speaking-02.mp3',
        explanation: {
          en: '我打算 states your plan and 两个星期 the duration.',
          fr: '我打算 indique votre projet et 两个星期 la durée.',
        },
      },
    ],
    reading: [
      {
        id: 'small-talk-reading-1',
        prompt: {
          en: 'Match the word to “weather”.',
          fr: 'Associe le mot à « temps / météo ».',
        },
        target: '天气',
        pinyin: 'tiān qì',
        audio: '/audio/small-talk/practice-reading-01.mp3',
        explanation: {
          en: '天气 means weather.',
          fr: '天气 signifie temps / météo.',
        },
      },
      {
        id: 'small-talk-reading-2',
        prompt: {
          en: 'Match the word to “to chat”.',
          fr: 'Associe le mot à « discuter ».',
        },
        target: '聊天',
        pinyin: 'liáo tiān',
        audio: '/audio/small-talk/practice-reading-02.mp3',
        explanation: {
          en: '聊天 means to chat.',
          fr: '聊天 signifie discuter.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'small-talk-review-1',
      front: '你是哪里人',
      back: {
        en: 'Where are you from?',
        fr: 'D’où venez-vous ?',
      },
      explanation: {
        en: 'The classic small-talk question.',
        fr: 'La question classique de conversation.',
      },
    },
    {
      id: 'small-talk-review-2',
      front: '本地人',
      back: {
        en: 'local person',
        fr: 'personne d’ici',
      },
      explanation: {
        en: '本地人 is someone from the local area.',
        fr: '本地人 est quelqu’un de la région.',
      },
    },
    {
      id: 'small-talk-review-3',
      front: '天气',
      back: {
        en: 'weather',
        fr: 'temps / météo',
      },
      explanation: {
        en: 'A safe small-talk topic.',
        fr: 'Un sujet sûr de conversation.',
      },
    },
    {
      id: 'small-talk-review-4',
      front: '我打算待两个星期',
      back: {
        en: 'I plan to stay two weeks.',
        fr: 'Je compte rester deux semaines.',
      },
      explanation: {
        en: 'State your plan and duration.',
        fr: 'Indiquez votre projet et la durée.',
      },
    },
    {
      id: 'small-talk-review-5',
      front: '聊天',
      back: {
        en: 'to chat',
        fr: 'discuter',
      },
      explanation: {
        en: 'Casual talking with friends.',
        fr: 'Discuter avec des amis.',
      },
    },
    {
      id: 'small-talk-review-6',
      front: '祝你玩得开心',
      back: {
        en: 'Enjoy yourself / have fun.',
        fr: 'Amusez-vous bien.',
      },
      explanation: {
        en: 'A friendly good wish.',
        fr: 'Un souhait amical.',
      },
    },
  ],
}
