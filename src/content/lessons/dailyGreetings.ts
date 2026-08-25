import type { LessonContent } from '../types.js'

export const dailyGreetingsLesson: LessonContent = {
  id: 'daily-greetings',
  title: {
    en: '打招呼 / Daily greetings',
    fr: '打招呼 / Salutations quotidiennes',
  },
  scenario: {
    en: 'How to say hello, goodbye and be polite.',
    fr: 'Comment dire bonjour, au revoir et être poli.',
  },
  dialogue: {
    title: {
      en: 'Everyday greetings and polite phrases',
      fr: 'Salutations et formules de politesse du quotidien',
    },
    lines: [
      {
        id: 'daily-greetings-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好。',
        pinyin: 'Nǐ hǎo.',
        translation: {
          en: 'Hello.',
          fr: 'Bonjour.',
        },
        explanation: {
          en: '你 = you｜好 = good / well. Together, 你好 is the standard everyday greeting in casual situations.',
          fr: '你 = tu / vous｜好 = bien. Ensemble, 你好 est la salutation courante dans les situations informelles.',
        },
        audio: '/audio/daily-greetings/line-01.mp3',
      },
      {
        id: 'daily-greetings-line-02',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '您好。',
        pinyin: 'Nín hǎo.',
        translation: {
          en: 'Hello (formal).',
          fr: 'Bonjour (formel).',
        },
        explanation: {
          en: '您 = polite ‘you’｜好 = good / well. 您好 is a respectful greeting for elders, service staff, superiors, or strangers.',
          fr: '您 = « vous » de politesse｜好 = bien. 您好 est une salutation respectueuse pour les aînés, le personnel de service, les supérieurs ou les inconnus.',
        },
        audio: '/audio/daily-greetings/line-02.mp3',
      },
      {
        id: 'daily-greetings-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '大家好。',
        pinyin: 'Dà jiā hǎo.',
        translation: {
          en: 'Hello everyone.',
          fr: 'Bonjour à tous.',
        },
        explanation: {
          en: '大家 = everyone｜好 = hello / good. Use 大家好 to greet a whole group at once.',
          fr: '大家 = tout le monde｜好 = bonjour / bien. Utilisez 大家好 pour saluer tout un groupe à la fois.',
        },
        audio: '/audio/daily-greetings/line-03.mp3',
      },
      {
        id: 'daily-greetings-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '早上好。',
        pinyin: 'Zǎo shang hǎo.',
        translation: {
          en: 'Good morning.',
          fr: 'Bonjour (le matin).',
        },
        explanation: {
          en: '早上 = morning｜好 = good. Use 早上好 as a morning greeting, roughly from waking up until noon.',
          fr: '早上 = matin｜好 = bon / bien. Utilisez 早上好 comme salutation du réveil jusqu’à midi environ.',
        },
        audio: '/audio/daily-greetings/line-04.mp3',
      },
      {
        id: 'daily-greetings-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '下午好。',
        pinyin: 'Xià wǔ hǎo.',
        translation: {
          en: 'Good afternoon.',
          fr: 'Bonjour (l’après-midi).',
        },
        explanation: {
          en: '下午 = afternoon｜好 = good. Use 下午好 as a polite greeting in the afternoon.',
          fr: '下午 = après-midi｜好 = bon / bien. Utilisez 下午好 comme salutation polie l’après-midi.',
        },
        audio: '/audio/daily-greetings/line-05.mp3',
      },
      {
        id: 'daily-greetings-line-06',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '晚上好。',
        pinyin: 'Wǎn shang hǎo.',
        translation: {
          en: 'Good evening.',
          fr: 'Bonsoir.',
        },
        explanation: {
          en: '晚上 = evening｜好 = good. Use 晚上好 when greeting someone in the evening.',
          fr: '晚上 = soir｜好 = bon / bien. Utilisez 晚上好 pour saluer quelqu’un le soir.',
        },
        audio: '/audio/daily-greetings/line-06.mp3',
      },
      {
        id: 'daily-greetings-line-07',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '晚安。',
        pinyin: 'Wǎn ān.',
        translation: {
          en: 'Good night.',
          fr: 'Bonne nuit.',
        },
        explanation: {
          en: '晚 = night / late｜安 = peaceful. Say 晚安 when parting late in the evening or going to bed.',
          fr: '晚 = soir / tard｜安 = paisible. Dites 晚安 en prenant congé tard le soir ou avant de dormir.',
        },
        audio: '/audio/daily-greetings/line-07.mp3',
      },
      {
        id: 'daily-greetings-line-08',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        translation: {
          en: 'How are you?',
          fr: 'Comment allez-vous ?',
        },
        explanation: {
          en: '你 = you｜好 = well｜吗 = yes-or-no question particle. Use 你好吗？ to ask how someone is doing.',
          fr: '你 = tu / vous｜好 = bien｜吗 = particule de question fermée. Utilisez 你好吗？ pour demander comment va quelqu’un.',
        },
        audio: '/audio/daily-greetings/line-08.mp3',
      },
      {
        id: 'daily-greetings-line-09',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我很好，谢谢。',
        pinyin: 'Wǒ hěn hǎo, xiè xie.',
        translation: {
          en: 'I’m very well, thank you.',
          fr: 'Je vais très bien, merci.',
        },
        explanation: {
          en: '我 = I｜很 = very｜好 = well｜谢谢 = thank you. Use this as a polite reply when someone asks how you are.',
          fr: '我 = je｜很 = très｜好 = bien｜谢谢 = merci. Utilisez cette phrase pour répondre poliment quand on vous demande comment vous allez.',
        },
        audio: '/audio/daily-greetings/line-09.mp3',
      },
      {
        id: 'daily-greetings-line-10',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '很高兴认识你。',
        pinyin: 'Hěn gāo xìng rèn shi nǐ.',
        translation: {
          en: 'Nice to meet you.',
          fr: 'Enchanté de faire votre connaissance.',
        },
        explanation: {
          en: '很 = very｜高兴 = glad / happy｜认识 = meet / get to know｜你 = you. Use this when meeting someone for the first time.',
          fr: '很 = très｜高兴 = heureux｜认识 = faire connaissance｜你 = tu / vous. Utilisez cette phrase lorsque vous rencontrez quelqu’un pour la première fois.',
        },
        audio: '/audio/daily-greetings/line-10.mp3',
      },
      {
        id: 'daily-greetings-line-11',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '谢谢。',
        pinyin: 'Xiè xie.',
        translation: {
          en: 'Thank you.',
          fr: 'Merci.',
        },
        explanation: {
          en: '谢谢 = thank you. Use it to express thanks in almost any everyday exchange.',
          fr: '谢谢 = merci. Utilisez-le pour remercier quelqu’un dans presque toutes les situations quotidiennes.',
        },
        audio: '/audio/daily-greetings/line-11.mp3',
      },
      {
        id: 'daily-greetings-line-12',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '不客气。',
        pinyin: 'Bú kè qi.',
        translation: {
          en: 'You are welcome.',
          fr: 'Je vous en prie.',
        },
        explanation: {
          en: '不客气 = you’re welcome. Use it as the standard reply when someone thanks you.',
          fr: '不客气 = je vous en prie. Utilisez cette réponse lorsque quelqu’un vous remercie.',
        },
        audio: '/audio/daily-greetings/line-12.mp3',
      },
      {
        id: 'daily-greetings-line-13',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '不好意思。',
        pinyin: 'Bù hǎo yì si.',
        translation: {
          en: 'Excuse me.',
          fr: 'Excusez-moi.',
        },
        explanation: {
          en: '不好意思 = excuse me / sorry. Use it to get someone’s attention politely or make a light apology.',
          fr: '不好意思 = excusez-moi / désolé. Utilisez cette expression pour attirer poliment l’attention ou présenter une excuse légère.',
        },
        audio: '/audio/daily-greetings/line-13.mp3',
      },
      {
        id: 'daily-greetings-line-14',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '对不起。',
        pinyin: 'Duì bu qǐ.',
        translation: {
          en: 'I’m sorry.',
          fr: 'Je suis désolé.',
        },
        explanation: {
          en: '对不起 = I’m sorry. Use it for a sincere apology after making a mistake.',
          fr: '对不起 = je suis désolé. Utilisez cette expression pour présenter des excuses sincères après une erreur.',
        },
        audio: '/audio/daily-greetings/line-14.mp3',
      },
      {
        id: 'daily-greetings-line-15',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '没关系。',
        pinyin: 'Méi guān xi.',
        translation: {
          en: 'It doesn\'t matter.',
          fr: 'Ce n\'est pas grave.',
        },
        explanation: {
          en: '没关系 = it’s okay / no problem. Use it to reassure someone who has apologized to you.',
          fr: '没关系 = ce n’est pas grave / pas de problème. Utilisez cette réponse pour rassurer quelqu’un qui s’est excusé.',
        },
        audio: '/audio/daily-greetings/line-15.mp3',
      },
      {
        id: 'daily-greetings-line-16',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '是的。',
        pinyin: 'Shì de.',
        translation: {
          en: 'Yes.',
          fr: 'Oui.',
        },
        explanation: {
          en: '是的 = yes / that’s right. Use it to confirm something clearly.',
          fr: '是的 = oui / c’est exact. Utilisez cette expression pour confirmer clairement quelque chose.',
        },
        audio: '/audio/daily-greetings/line-16.mp3',
      },
      {
        id: 'daily-greetings-line-17',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '不是。',
        pinyin: 'Bú shì.',
        translation: {
          en: 'No.',
          fr: 'Non.',
        },
        explanation: {
          en: '不 = not｜是 = be / be correct. Use 不是 to deny or correct something that is not the case.',
          fr: '不 = ne… pas｜是 = être / être exact. Utilisez 不是 pour nier ou corriger une information inexacte.',
        },
        audio: '/audio/daily-greetings/line-17.mp3',
      },
      {
        id: 'daily-greetings-line-18',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '再见。',
        pinyin: 'Zài jiàn.',
        translation: {
          en: 'Goodbye.',
          fr: 'Au revoir.',
        },
        explanation: {
          en: '再 = again｜见 = see. Say 再见 when leaving, with the sense of ‘see you again.’',
          fr: '再 = de nouveau｜见 = voir. Dites 再见 en partant, au sens de « à la prochaine ».',
        },
        audio: '/audio/daily-greetings/line-18.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'daily-greetings-pattern-2',
      pattern: '……吗？',
      pinyin: '... ma?',
      meaning: {
        en: 'A sentence-final particle that turns a statement into a yes-or-no question.',
        fr: 'Une particule finale qui transforme une affirmation en question à réponse oui ou non.',
      },
      audio: '/audio/daily-greetings/pattern-02.mp3',
      examples: [
        {
          fill: '你好',
          fillPinyin: 'nǐ hǎo',
          hanzi: '你好吗？',
          pinyin: 'Nǐ hǎo ma?',
          en: 'How are you?',
          fr: 'Comment allez-vous ?',
          audio: '/audio/daily-greetings/pattern-02-example-01.mp3',
        },
        {
          fill: '你有空',
          fillPinyin: 'nǐ yǒu kòng',
          hanzi: '你有空吗？',
          pinyin: 'Nǐ yǒu kòng ma?',
          en: 'Are you free?',
          fr: 'Êtes-vous libre ?',
          audio: '/audio/daily-greetings/pattern-02-example-02.mp3',
        },
        {
          fill: '好吃',
          fillPinyin: 'hǎo chī',
          hanzi: '好吃吗？',
          pinyin: 'Hǎo chī ma?',
          en: 'Is it tasty?',
          fr: 'Est-ce que c\'est bon ?',
          audio: '/audio/daily-greetings/pattern-02-example-03.mp3',
        },
      ],
    },
    {
      id: 'daily-greetings-pattern-4',
      pattern: '很高兴……。',
      pinyin: 'Hěn gāo xìng ... .',
      meaning: {
        en: 'I am glad to ...',
        fr: 'Je suis ravi de ...',
      },
      audio: '/audio/daily-greetings/pattern-04.mp3',
      examples: [
        {
          fill: '认识你',
          fillPinyin: 'rèn shi nǐ',
          hanzi: '很高兴认识你。',
          pinyin: 'Hěn gāo xìng rèn shi nǐ.',
          en: 'Nice to meet you.',
          fr: 'Enchanté de faire votre connaissance.',
          audio: '/audio/daily-greetings/pattern-04-example-01.mp3',
        },
        {
          fill: '见到你',
          fillPinyin: 'jiàn dào nǐ',
          hanzi: '很高兴见到你。',
          pinyin: 'Hěn gāo xìng jiàn dào nǐ.',
          en: 'Nice to see you.',
          fr: 'Je suis ravi de vous voir.',
          audio: '/audio/daily-greetings/pattern-04-example-02.mp3',
        },
        {
          fill: '认识大家',
          fillPinyin: 'rèn shi dà jiā',
          hanzi: '很高兴认识大家。',
          pinyin: 'Hěn gāo xìng rèn shi dà jiā.',
          en: 'Nice to meet everyone.',
          fr: 'Enchanté de faire connaissance avec tout le monde.',
          audio: '/audio/daily-greetings/pattern-04-example-03.mp3',
        },
      ],
    },
    {
      id: 'daily-greetings-pattern-5',
      pattern: '不好意思，……。',
      pinyin: 'Bù hǎo yì si, ... .',
      meaning: {
        en: 'Excuse me, ...',
        fr: 'Excusez-moi, ...',
      },
      audio: '/audio/daily-greetings/pattern-05.mp3',
      examples: [
        {
          fill: '打扰一下',
          fillPinyin: 'dǎ rǎo yí xià',
          hanzi: '不好意思，打扰一下。',
          pinyin: 'Bù hǎo yì si, dǎ rǎo yí xià.',
          en: 'Excuse me for bothering you.',
          fr: 'Excusez-moi de vous déranger.',
          audio: '/audio/daily-greetings/pattern-05-example-01.mp3',
        },
        {
          fill: '借过一下',
          fillPinyin: 'jiè guò yí xià',
          hanzi: '不好意思，借过一下。',
          pinyin: 'Bù hǎo yì si, jiè guò yí xià.',
          en: 'Excuse me, may I pass?',
          fr: 'Excusez-moi, puis-je passer ?',
          audio: '/audio/daily-greetings/pattern-05-example-02.mp3',
        },
        {
          fill: '我不会说中文',
          fillPinyin: 'wǒ bú huì shuō Zhōng wén',
          hanzi: '不好意思，我不会说中文。',
          pinyin: 'Bù hǎo yì si, wǒ bú huì shuō Zhōng wén.',
          en: 'Excuse me, I don\'t speak Chinese.',
          fr: 'Excusez-moi, je ne parle pas chinois.',
          audio: '/audio/daily-greetings/pattern-05-example-03.mp3',
        },
      ],
    },
  ],
  vocabulary: [
    {
      id: 'daily-greetings-vocab-1',
      hanzi: '你好',
      pinyin: 'nǐ hǎo',
      audio: '/audio/daily-greetings/vocab-01.mp3',
      meaning: {
        en: 'hello',
        fr: 'bonjour',
      },
      explanation: {
        en: 'The everyday greeting for casual situations.',
        fr: 'La salutation quotidienne pour les situations informelles.',
      },
    },
    {
      id: 'daily-greetings-vocab-2',
      hanzi: '您好',
      pinyin: 'nín hǎo',
      audio: '/audio/daily-greetings/vocab-02.mp3',
      meaning: {
        en: 'hello (formal)',
        fr: 'bonjour (formel)',
      },
      explanation: {
        en: 'The polite greeting for staff and elders.',
        fr: 'La salutation polie pour le personnel et les aînés.',
      },
    },
    {
      id: 'daily-greetings-vocab-3',
      hanzi: '早上好',
      pinyin: 'zǎo shang hǎo',
      audio: '/audio/daily-greetings/vocab-03.mp3',
      meaning: {
        en: 'good morning',
        fr: 'bonjour (matin)',
      },
      explanation: {
        en: 'Use this greeting in the morning.',
        fr: 'Utilisez cette salutation le matin.',
      },
    },
    {
      id: 'daily-greetings-vocab-4',
      hanzi: '晚安',
      pinyin: 'wǎn ān',
      audio: '/audio/daily-greetings/vocab-04.mp3',
      meaning: {
        en: 'good night',
        fr: 'bonne nuit',
      },
      explanation: {
        en: 'Say this when parting late at night or before going to sleep.',
        fr: 'Dites cette expression en prenant congé tard le soir ou avant de dormir.',
      },
    },
    {
      id: 'daily-greetings-vocab-5',
      hanzi: '谢谢',
      pinyin: 'xiè xie',
      audio: '/audio/daily-greetings/vocab-05.mp3',
      meaning: {
        en: 'thank you',
        fr: 'merci',
      },
      explanation: {
        en: 'The most useful polite word every day.',
        fr: 'Le mot de politesse le plus utile au quotidien.',
      },
    },
    {
      id: 'daily-greetings-vocab-6',
      hanzi: '不客气',
      pinyin: 'bú kè qi',
      audio: '/audio/daily-greetings/vocab-06.mp3',
      meaning: {
        en: 'you are welcome',
        fr: 'je vous en prie',
      },
      explanation: {
        en: 'The standard reply to thank you.',
        fr: 'La réponse standard à merci.',
      },
    },
    {
      id: 'daily-greetings-vocab-7',
      hanzi: '不好意思',
      pinyin: 'bù hǎo yì si',
      audio: '/audio/daily-greetings/vocab-07.mp3',
      meaning: {
        en: 'excuse me',
        fr: 'excusez-moi',
      },
      explanation: {
        en: 'A light apology or way to get attention.',
        fr: 'Une excuse légère ou une façon d’attirer l’attention.',
      },
    },
    {
      id: 'daily-greetings-vocab-8',
      hanzi: '对不起',
      pinyin: 'duì bu qǐ',
      audio: '/audio/daily-greetings/vocab-08.mp3',
      meaning: {
        en: 'I’m sorry',
        fr: 'je suis désolé',
      },
      explanation: {
        en: 'A sincere apology after a mistake.',
        fr: 'Une excuse sincère après une erreur.',
      },
    },
    {
      id: 'daily-greetings-vocab-9',
      hanzi: '没关系',
      pinyin: 'méi guān xi',
      audio: '/audio/daily-greetings/vocab-09.mp3',
      meaning: {
        en: 'no problem',
        fr: 'pas de problème',
      },
      explanation: {
        en: 'The standard reply when someone apologizes to you.',
        fr: 'La réponse standard quand quelqu’un s’excuse auprès de vous.',
      },
    },
    {
      id: 'daily-greetings-vocab-10',
      hanzi: '再见',
      pinyin: 'zài jiàn',
      audio: '/audio/daily-greetings/vocab-10.mp3',
      meaning: {
        en: 'goodbye',
        fr: 'au revoir',
      },
      explanation: {
        en: 'The everyday word to say when leaving.',
        fr: 'Le mot quotidien à dire en partant.',
      },
    },
    {
      id: 'daily-greetings-vocab-11',
      hanzi: '认识',
      pinyin: 'rèn shi',
      audio: '/audio/daily-greetings/vocab-11.mp3',
      meaning: {
        en: 'to meet / to know',
        fr: 'rencontrer / connaître',
      },
      explanation: {
        en: 'Used in 很高兴认识你 when meeting someone new.',
        fr: 'Utilisé dans 很高兴认识你 lorsqu’on rencontre quelqu’un de nouveau.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'daily-greetings-listening-1',
        prompt: {
          en: 'Which phrase means “Hello everyone”?',
          fr: 'Quelle phrase signifie « Bonjour à tous » ?',
        },
        target: '大家好。',
        pinyin: 'Dà jiā hǎo.',
        audio: '/audio/daily-greetings/practice-listening-01.mp3',
        explanation: {
          en: '大家 = everyone｜好 = hello / good. Use this greeting when addressing a group.',
          fr: '大家 = tout le monde｜好 = bonjour / bien. Utilisez cette salutation pour vous adresser à un groupe.',
        },
      },
      {
        id: 'daily-greetings-listening-2',
        prompt: {
          en: 'Which phrase is the polite formal greeting?',
          fr: 'Quelle phrase est la salutation formelle polie ?',
        },
        target: '您好。',
        pinyin: 'Nín hǎo.',
        audio: '/audio/daily-greetings/practice-listening-02.mp3',
        explanation: {
          en: '您 = polite ‘you’｜好 = good / well. Use 您好 to greet staff, elders, or strangers respectfully.',
          fr: '您 = « vous » de politesse｜好 = bien. Utilisez 您好 pour saluer respectueusement le personnel, les aînés ou les inconnus.',
        },
      },
    ],
    speaking: [
      {
        id: 'daily-greetings-speaking-1',
        prompt: {
          en: 'Say “Good morning” to someone you just met.',
          fr: 'Dites « Bonjour » à quelqu’un que vous venez de rencontrer.',
        },
        target: '早上好。',
        pinyin: 'Zǎo shang hǎo.',
        audio: '/audio/daily-greetings/practice-speaking-01.mp3',
        explanation: {
          en: '早上 = morning｜好 = good. Use 早上好 to greet someone in the morning.',
          fr: '早上 = matin｜好 = bon / bien. Utilisez 早上好 pour saluer quelqu’un le matin.',
        },
      },
      {
        id: 'daily-greetings-speaking-2',
        prompt: {
          en: 'Thank someone and reply when they are welcome.',
          fr: 'Remerciez quelqu’un et répondez-lui poliment.',
        },
        target: '谢谢。不客气。',
        pinyin: 'Xiè xie. Bú kè qi.',
        audio: '/audio/daily-greetings/practice-speaking-02.mp3',
        explanation: {
          en: '谢谢 = thank you｜不客气 = you’re welcome. Use these two phrases as a natural exchange of thanks and response.',
          fr: '谢谢 = merci｜不客气 = je vous en prie. Utilisez ces deux expressions dans un échange naturel de remerciement et de réponse.',
        },
      },
    ],
    reading: [
      {
        id: 'daily-greetings-reading-1',
        prompt: {
          en: 'Match the word to “thank you”.',
          fr: 'Associe le mot à « merci ».',
        },
        target: '谢谢',
        pinyin: 'xiè xie',
        audio: '/audio/daily-greetings/practice-reading-01.mp3',
        explanation: {
          en: 'Use 谢谢 to thank someone in an everyday exchange.',
          fr: 'Utilisez 谢谢 pour remercier quelqu’un dans un échange quotidien.',
        },
      },
      {
        id: 'daily-greetings-reading-2',
        prompt: {
          en: 'Match the word to “goodbye”.',
          fr: 'Associe le mot à « au revoir ».',
        },
        target: '再见',
        pinyin: 'zài jiàn',
        audio: '/audio/daily-greetings/practice-reading-02.mp3',
        explanation: {
          en: 'Use 再见 when saying goodbye and leaving.',
          fr: 'Utilisez 再见 pour dire au revoir en partant.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'daily-greetings-review-1',
      front: '你好',
      back: {
        en: 'hello',
        fr: 'bonjour',
      },
      explanation: {
        en: 'The everyday greeting.',
        fr: 'La salutation quotidienne.',
      },
    },
    {
      id: 'daily-greetings-review-2',
      front: '您好',
      back: {
        en: 'hello (formal)',
        fr: 'bonjour (formel)',
      },
      explanation: {
        en: 'The polite greeting for staff and elders.',
        fr: 'La salutation polie pour le personnel et les aînés.',
      },
    },
    {
      id: 'daily-greetings-review-3',
      front: '谢谢',
      back: {
        en: 'thank you',
        fr: 'merci',
      },
      explanation: {
        en: 'The most useful polite word.',
        fr: 'Le mot de politesse le plus utile.',
      },
    },
    {
      id: 'daily-greetings-review-4',
      front: '不客气',
      back: {
        en: 'you are welcome',
        fr: 'je vous en prie',
      },
      explanation: {
        en: 'The reply when someone thanks you.',
        fr: 'La réponse quand quelqu’un vous remercie.',
      },
    },
    {
      id: 'daily-greetings-review-5',
      front: '再见',
      back: {
        en: 'goodbye',
        fr: 'au revoir',
      },
      explanation: {
        en: 'Say this when leaving.',
        fr: 'Dites ceci en partant.',
      },
    },
    {
      id: 'daily-greetings-review-6',
      front: '对不起',
      back: {
        en: 'I’m sorry',
        fr: 'je suis désolé',
      },
      explanation: {
        en: 'A sincere apology.',
        fr: 'Une excuse sincère.',
      },
    },
  ],
}
