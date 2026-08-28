import type { LessonContent } from '../types.js'

export const smallTalkLesson: LessonContent = {
  id: 'small-talk',
  title: {
    en: '闲聊和赞美 / Small talk and compliment',
    fr: '闲聊和赞美 / Petite conversation et compliments',
  },
  scenario: {
    en: 'Common conversation starters to break the ice, send positive vibes by giving people compliments.',
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
        pinyin: 'jīn tiān tiān qì hěn hǎo.',
        translation: { en: 'The weather is nice today.', fr: 'Le temps est agréable aujourd\'hui.' },
        explanation: { en: '今天 = today｜天气 = weather｜很 = very｜好 = good. Use this positive weather comment to start casual conversation.', fr: '今天 = aujourd’hui｜天气 = temps｜很 = très｜好 = bon. Utilisez ce commentaire positif sur le temps pour engager la conversation.' },
        audio: '/audio/small-talk/line-01.mp3',
      },
      {
        id: 'small-talk-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '今天天气好冷啊。',
        pinyin: 'jīn tiān tiān qì hǎo lěng a.',
        translation: { en: 'It is so cold today.', fr: 'Qu’il fait froid aujourd’hui !' },
        explanation: { en: '今天 = today｜天气 = weather｜好冷 = so cold｜啊 = exclamatory particle. Use this expressive comment as casual weather small talk.', fr: '今天 = aujourd’hui｜天气 = temps｜好冷 = très froid｜啊 = particule exclamative. Utilisez cette remarque expressive pour parler du temps.' },
        audio: '/audio/small-talk/line-02.mp3',
      },
      {
        id: 'small-talk-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你好吗？',
        pinyin: 'nǐ hǎo ma?',
        translation: { en: 'How are you?', fr: 'Comment vas-tu ?' },
        explanation: { en: '你 = you｜好 = well｜吗 = yes-or-no question particle. Use this familiar question to ask how someone is doing.', fr: '你 = tu / vous｜好 = bien｜吗 = particule de question fermée. Utilisez cette question familière pour demander comment va quelqu’un.' },
        audio: '/audio/small-talk/line-03.mp3',
      },
      {
        id: 'small-talk-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你从哪里来的？',
        pinyin: 'nǐ cóng nǎ lǐ lái de?',
        translation: { en: 'Where are you from?', fr: 'D’où viens-tu ?' },
        explanation: { en: '你 = you｜从 = from｜哪里 = where｜来的 = come from. Use this friendly question to ask about someone’s place of origin.', fr: '你 = tu / vous｜从 = de / depuis｜哪里 = où｜来的 = venir de. Utilisez cette question amicale pour demander l’origine de quelqu’un.' },
        audio: '/audio/small-talk/line-04.mp3',
      },
      {
        id: 'small-talk-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你穿的衣服很好看。',
        pinyin: 'nǐ chuān de yī fu hěn hǎo kàn.',
        translation: { en: 'The clothes you’re wearing look very nice.', fr: 'Les vêtements que tu portes sont très beaux.' },
        explanation: { en: '你 = you｜穿的衣服 = the clothes you are wearing｜很 = very｜好看 = look nice. Use this to compliment someone’s clothes.', fr: '你 = tu / vous｜穿的衣服 = les vêtements que tu portes｜很 = très｜好看 = être beau. Utilisez cette phrase pour complimenter les vêtements de quelqu’un.' },
        audio: '/audio/small-talk/line-05.mp3',
      },
      {
        id: 'small-talk-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太幽默了.',
        pinyin: 'nǐ tài yōu mò le.',
        translation: { en: 'You are so funny.', fr: 'Tu es très drôle.' },
        explanation: { en: '你 = you｜太 = so / very｜幽默 = humorous｜了 = emphasis. Use this to compliment someone’s sense of humor.', fr: '你 = tu / vous｜太 = tellement / très｜幽默 = drôle｜了 = insistance. Utilisez cette phrase pour complimenter l’humour de quelqu’un.' },
        audio: '/audio/small-talk/line-06.mp3',
      },
      {
        id: 'small-talk-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太棒了！',
        pinyin: 'nǐ tài bàng le!',
        translation: { en: 'You\'re amazing!', fr: 'Tu es vraiment génial !' },
        explanation: { en: '你 = you｜太 = so｜棒 = amazing｜了 = emphasis. Use this enthusiastic phrase to give strong praise.', fr: '你 = tu / vous｜太 = tellement｜棒 = formidable｜了 = insistance. Utilisez cette phrase enthousiaste pour féliciter vivement quelqu’un.' },
        audio: '/audio/small-talk/line-07.mp3',
      },
      {
        id: 'small-talk-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你真了不起！',
        pinyin: 'nǐ zhēn liǎo bù qǐ!',
        translation: { en: 'You\'re incredible.', fr: 'Tu es incroyable !' },
        explanation: { en: '你 = you｜真 = truly｜了不起 = remarkable / incredible. Use this for strong, sincere praise.', fr: '你 = tu / vous｜真 = vraiment｜了不起 = remarquable / incroyable. Utilisez cette phrase pour exprimer une admiration sincère.' },
        audio: '/audio/small-talk/line-08.mp3',
      },
      {
        id: 'small-talk-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你的皮肤很好！',
        pinyin: 'nǐ de pí fū hěn hǎo!',
        translation: { en: 'Your skin looks great.', fr: 'Ta peau est superbe !' },
        explanation: { en: '你的 = your｜皮肤 = skin｜很 = very｜好 = good. Use this to compliment someone’s complexion.', fr: '你的 = ton / votre｜皮肤 = peau｜很 = très｜好 = belle / bonne. Utilisez cette phrase pour complimenter le teint de quelqu’un.' },
        audio: '/audio/small-talk/line-09.mp3',
      },
      {
        id: 'small-talk-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太热情了。',
        pinyin: 'nǐ tài rè qíng le.',
        translation: { en: 'You are so warm-hearted.', fr: 'Tu es très chaleureux.' },
        explanation: { en: '你 = you｜太 = so / very｜热情 = warm and welcoming｜了 = emphasis. Use this to praise someone’s hospitality or enthusiasm.', fr: '你 = tu / vous｜太 = tellement / très｜热情 = chaleureux et accueillant｜了 = insistance. Utilisez cette phrase pour louer l’accueil ou l’enthousiasme de quelqu’un.' },
        audio: '/audio/small-talk/line-10.mp3',
      },
      {
        id: 'small-talk-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你太乐于助人了.',
        pinyin: 'nǐ tài lè yú zhù rén le.',
        translation: { en: 'You are kind-hearted and helpful.', fr: 'Tu es gentil(le) et serviable.' },
        explanation: { en: '你 = you｜太 = so / very｜乐于助人 = willing to help others｜了 = emphasis. Use this to praise someone who has been especially helpful.', fr: '你 = tu / vous｜太 = tellement / très｜乐于助人 = toujours prêt à aider｜了 = insistance. Utilisez cette phrase pour féliciter quelqu’un qui s’est montré très serviable.' },
        audio: '/audio/small-talk/line-11.mp3',
      },
      {
        id: 'small-talk-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '你们这里的东西很好吃。',
        pinyin: 'nǐ men zhè lǐ de dōng xi hěn hǎo chī.',
        translation: { en: 'The food here is delicious.', fr: 'La nourriture d\'ici est délicieuse.' },
        explanation: { en: '你们这里的东西 = the food / things here｜很 = very｜好吃 = delicious. Use this to compliment local food after tasting it.', fr: '你们这里的东西 = la nourriture / les choses d’ici｜很 = très｜好吃 = délicieux. Utilisez cette phrase pour complimenter la cuisine locale après l’avoir goûtée.' },
        audio: '/audio/small-talk/line-12.mp3',
      },
      {
        id: 'small-talk-line-13',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '祝你玩得开心！再见！',
        pinyin: 'zhù nǐ wán de kāi xīn! zài jiàn!',
        translation: { en: 'Have fun! Goodbye!', fr: 'Amuse-toi bien ! Au revoir !' },
        explanation: { en: '祝 = wish｜你 = you｜玩得开心 = have fun｜再见 = goodbye. Use this friendly wish when parting from someone who is going out or travelling.', fr: '祝 = souhaiter｜你 = à toi / à vous｜玩得开心 = bien s’amuser｜再见 = au revoir. Utilisez ce souhait amical en quittant quelqu’un qui va sortir ou voyager.' },
        audio: '/audio/small-talk/line-13.mp3',
      },
      {
        id: 'small-talk-line-14',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '和你聊天很开心。',
        pinyin: 'hé nǐ liáo tiān hěn kāi xīn.',
        translation: { en: 'I’m having a great time chatting with you.', fr: 'Je suis très heureux / heureuse de discuter avec toi.' },
        explanation: { en: '和 = with｜你 = you｜聊天 = chat｜很开心 = be very happy. Use this warm phrase to say you enjoyed the conversation.', fr: '和 = avec｜你 = toi / vous｜聊天 = discuter｜很开心 = être très heureux. Utilisez cette phrase chaleureuse pour dire que vous avez apprécié la conversation.' },
        audio: '/audio/small-talk/line-14.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'small-talk-pattern-1',
      pattern: '今天天气……。',
      pinyin: 'jīn tiān tiān qì ... .',
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
          pinyin: 'jīn tiān tiān qì hěn hǎo.',
          en: 'The weather is very nice today.',
          fr: 'Il fait très beau aujourd’hui.',
          audio: '/audio/small-talk/pattern-01-example-01.mp3',
        },
        {
          fill: '不错',
          fillPinyin: 'bú cuò',
          hanzi: '今天天气不错。',
          pinyin: 'jīn tiān tiān qì bú cuò.',
          en: 'The weather is nice today.',
          fr: 'Il fait beau aujourd’hui.',
          audio: '/audio/small-talk/pattern-01-example-02.mp3',
        },
        {
          fill: '好冷',
          fillPinyin: 'hǎo lěng',
          hanzi: '今天天气好冷。',
          pinyin: 'jīn tiān tiān qì hǎo lěng.',
          en: 'It is so cold today.',
          fr: 'Qu’il fait froid aujourd’hui !',
          audio: '/audio/small-talk/pattern-01-example-03.mp3',
        },
      ],
    },
    {
      id: 'small-talk-pattern-4',
      pattern: '你太……了！',
      pinyin: 'nǐ tài ... le!',
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
          pinyin: 'nǐ tài bàng le!',
          en: 'You are amazing!',
          fr: 'Tu es formidable !',
          audio: '/audio/small-talk/pattern-04-example-01.mp3',
        },
        {
          fill: '幽默',
          fillPinyin: 'yōu mò',
          hanzi: '你太幽默了。',
          pinyin: 'nǐ tài yōu mò le.',
          en: 'You are so funny.',
          fr: 'Tu es vraiment drôle.',
          audio: '/audio/small-talk/pattern-04-example-02.mp3',
        },
        {
          fill: '热情',
          fillPinyin: 'rè qíng',
          hanzi: '你太热情了。',
          pinyin: 'nǐ tài rè qíng le.',
          en: 'You are so warm and welcoming.',
          fr: 'Tu es vraiment chaleureux et accueillant.',
          audio: '/audio/small-talk/pattern-04-example-03.mp3',
        },
      ],
    },
    {
      id: 'small-talk-pattern-5',
      pattern: '你的……很好！',
      pinyin: 'nǐ de ... hěn hǎo!',
      meaning: {
        en: 'Your ... is great!',
        fr: 'Ton ... est superbe !',
      },
      audio: '/audio/small-talk/pattern-05.mp3',
      examples: [
        {
          fill: '皮肤',
          fillPinyin: 'pí fū',
          hanzi: '你的皮肤很好！',
          pinyin: 'nǐ de pí fū hěn hǎo!',
          en: 'Your skin looks great!',
          fr: 'Ta peau est superbe !',
          audio: '/audio/small-talk/pattern-05-example-01.mp3',
        },
        {
          fill: '中文',
          fillPinyin: 'zhōng wén',
          hanzi: '你的中文很好！',
          pinyin: 'nǐ de zhōng wén hěn hǎo!',
          en: 'Your Chinese is very good!',
          fr: 'Ton chinois est très bon !',
          audio: '/audio/small-talk/pattern-05-example-02.mp3',
        },
        {
          fill: '英语',
          fillPinyin: 'yīng yǔ',
          hanzi: '你的英语很好！',
          pinyin: 'nǐ de yīng yǔ hěn hǎo!',
          en: 'Your English is very good!',
          fr: 'Ton anglais est très bon !',
          audio: '/audio/small-talk/pattern-05-example-03.mp3',
        },
      ],
    },
    {
      id: 'small-talk-pattern-6',
      pattern: '祝你……',
      pinyin: 'zhù nǐ ...',
      meaning: {
        en: 'I wish you ...',
        fr: 'Je te souhaite ...',
      },
      audio: '/audio/small-talk/pattern-11.mp3',
    }
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
        pinyin: 'nǐ shì nǎ lǐ rén?',
        audio: '/audio/small-talk/practice-listening-01.mp3',
        explanation: {
          en: '你 = you｜是 = are｜哪里人 = from where / a person from where. Use this common question to ask where someone is from.',
          fr: '你 = tu / vous｜是 = être｜哪里人 = originaire d’où. Utilisez cette question courante pour demander l’origine de quelqu’un.',
        },
      },
      {
        id: 'small-talk-listening-2',
        prompt: {
          en: 'Which phrase asks about the weather?',
          fr: 'Quelle phrase demande le temps qu’il fait ?',
        },
        target: '天气怎么样？',
        pinyin: 'tiān qì zěn me yàng?',
        audio: '/audio/small-talk/practice-listening-02.mp3',
        explanation: {
          en: '天气 = weather｜怎么样 = how is it. Use this open question to ask what the weather is like.',
          fr: '天气 = temps / météo｜怎么样 = comment est-ce. Utilisez cette question ouverte pour demander quel temps il fait.',
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
        pinyin: 'wǒ shì fǎ guó rén.',
        audio: '/audio/small-talk/practice-speaking-01.mp3',
        explanation: {
          en: '我 = I｜是 = am｜法国人 = French person. Use this sentence to state your nationality.',
          fr: '我 = je｜是 = être｜法国人 = Français / Française. Utilisez cette phrase pour indiquer votre nationalité.',
        },
      },
      {
        id: 'small-talk-speaking-2',
        prompt: {
          en: 'Say you plan to stay for two weeks.',
          fr: 'Dites que vous comptez rester deux semaines.',
        },
        target: '我打算待两个星期。',
        pinyin: 'wǒ dǎ suàn dāi liǎng gè xīng qī.',
        audio: '/audio/small-talk/practice-speaking-02.mp3',
        explanation: {
          en: '我 = I｜打算 = plan to｜待 = stay｜两个星期 = two weeks. Use this to state both your plan and the length of your stay.',
          fr: '我 = je｜打算 = prévoir de｜待 = rester｜两个星期 = deux semaines. Utilisez cette phrase pour indiquer votre projet et la durée du séjour.',
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
        en: '你 = you｜是 = are｜哪里人 = from where. Use this classic small-talk question to ask someone’s origin.',
        fr: '你 = tu / vous｜是 = être｜哪里人 = originaire d’où. Utilisez cette question classique pour demander l’origine de quelqu’un.',
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
        en: '我 = I｜打算 = plan to｜待 = stay｜两个星期 = two weeks. Use this to state your intended length of stay.',
        fr: '我 = je｜打算 = prévoir de｜待 = rester｜两个星期 = deux semaines. Utilisez cette phrase pour indiquer la durée prévue de votre séjour.',
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
        en: '祝 = wish｜你 = you｜玩得开心 = have fun. Use this friendly wish before someone goes out or while saying goodbye.',
        fr: '祝 = souhaiter｜你 = à toi / à vous｜玩得开心 = bien s’amuser. Utilisez ce souhait amical avant une sortie ou au moment de prendre congé.',
      },
    },
  ],
}
