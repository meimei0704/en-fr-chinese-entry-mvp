import type { LessonContent } from '../types.js'

export const selfIntroLesson: LessonContent = {
  id: 'self-intro',
  title: {
    en: '到达机场 / Arrival at the airport',
    fr: '到达机场 / Arrivée à l’aéroport',
  },
  scenario: {
    en: 'Move through the first airport steps after landing in China: ask for help politely, find baggage claim, handle a missing bag, leave the terminal, and show an address to a driver.',
    fr: 'Avancer dans les premières étapes à l’aéroport après l’arrivée en Chine : demander de l’aide poliment, trouver les bagages, signaler un bagage manquant, sortir du terminal et montrer une adresse au chauffeur.',
  },
  dialogue: {
    title: {
      en: 'Ask for help from baggage claim to the taxi pickup',
      fr: 'Demander de l’aide des bagages jusqu’au taxi',
    },
    lines: [
      {
        id: 'self-intro-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '您好。请问，您能帮我一下吗？',
        pinyin: 'Nín hǎo. Qǐngwèn, nín néng bāng wǒ yíxià ma?',
        translation: {
          en: 'Hello. Excuse me, could you help me?',
          fr: 'Bonjour. Excusez-moi, pouvez-vous m’aider ?',
        },
        explanation: {
          en: '您好 is the safer polite opener when you need help from airport staff or a driver.',
          fr: '您好 est une formule plus polie et plus sûre pour demander de l’aide au personnel de l’aéroport ou à un chauffeur.',
        },
        audio: '/audio/self-intro/line-01.mp3',
      },
      {
        id: 'self-intro-line-02',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hùzhào.',
        translation: {
          en: 'This is my passport.',
          fr: 'Voici mon passeport.',
        },
        explanation: {
          en: '这是我的… lets you hand over a document clearly without adding extra details.',
          fr: '这是我的… permet de présenter un document clairement sans ajouter de détails inutiles.',
        },
        audio: '/audio/self-intro/line-02.mp3',
      },
      {
        id: 'self-intro-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请问行李提取处在哪里？',
        pinyin: 'Qǐngwèn xíngli tíqǔchù zài nǎlǐ?',
        translation: {
          en: 'Excuse me, where is baggage claim?',
          fr: 'Excusez-moi, où se trouve la zone de récupération des bagages ?',
        },
        explanation: {
          en: '请问…在哪里？ is the main airport navigation pattern in this lesson.',
          fr: '请问…在哪里？ est la structure principale pour s’orienter dans l’aéroport.',
        },
        audio: '/audio/self-intro/line-03.mp3',
      },
      {
        id: 'self-intro-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我的行李还没到。请问问询台在哪里？',
        pinyin: 'Wǒ de xíngli hái méi dào. Qǐngwèn wènxúntái zài nǎlǐ?',
        translation: {
          en: 'My luggage has not arrived yet. Where is the information desk?',
          fr: 'Mon bagage n’est pas encore arrivé. Où se trouve le bureau d’information ?',
        },
        explanation: {
          en: 'Use 还没到 for something expected but not here yet, then ask where to get help.',
          fr: 'Utilise 还没到 pour quelque chose d’attendu mais pas encore arrivé, puis demande où obtenir de l’aide.',
        },
        audio: '/audio/self-intro/line-04.mp3',
      },
      {
        id: 'self-intro-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '请问出口在哪里？请问出租车在哪里？',
        pinyin: 'Qǐngwèn chūkǒu zài nǎlǐ? Qǐngwèn chūzūchē zài nǎlǐ?',
        translation: {
          en: 'Excuse me, where is the exit? Where are the taxis?',
          fr: 'Excusez-moi, où est la sortie ? Où sont les taxis ?',
        },
        explanation: {
          en: 'After baggage, the next useful steps are finding the exit and the taxi area.',
          fr: 'Après les bagages, les étapes utiles sont de trouver la sortie puis la zone des taxis.',
        },
        audio: '/audio/self-intro/line-05.mp3',
      },
      {
        id: 'self-intro-line-06',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '我想去这个地址。请到这里。',
        pinyin: 'Wǒ xiǎng qù zhège dìzhǐ. Qǐng dào zhèlǐ.',
        translation: {
          en: 'I want to go to this address. Please go here.',
          fr: 'Je voudrais aller à cette adresse. Allez ici, s’il vous plaît.',
        },
        explanation: {
          en: 'Point to a saved address and say this instead of explaining where you are staying.',
          fr: 'Montre une adresse enregistrée et dis cela au lieu d’expliquer où tu loges.',
        },
        audio: '/audio/self-intro/line-06.mp3',
      },
      {
        id: 'self-intro-line-07',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '大概需要多久？大概多少钱？',
        pinyin: 'Dàgài xūyào duōjiǔ? Dàgài duōshǎo qián?',
        translation: {
          en: 'About how long will it take? About how much will it cost?',
          fr: 'Cela prend environ combien de temps ? Cela coûte environ combien ?',
        },
        explanation: {
          en: '大概 softens the question when you only need an estimate before the ride starts.',
          fr: '大概 adoucit la question quand tu veux seulement une estimation avant le trajet.',
        },
        audio: '/audio/self-intro/line-07.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'self-intro-pattern-1',
      pattern: '请问……在哪里？',
      meaning: {
        en: 'Excuse me, where is ...?',
        fr: 'Excusez-moi, où est ... ?',
      },
      example: '请问行李提取处在哪里？',
      audio: '/audio/self-intro/pattern-01.mp3',
      explanation: {
        en: 'Swap in 出口, 问询台, or 出租车 to ask for the next airport step.',
        fr: 'Remplace par 出口, 问询台 ou 出租车 pour demander l’étape suivante à l’aéroport.',
      },
    },
    {
      id: 'self-intro-pattern-2',
      pattern: '我想去……',
      meaning: {
        en: 'I want to go to ...',
        fr: 'Je voudrais aller à ...',
      },
      example: '我想去这个地址。',
      audio: '/audio/self-intro/pattern-02.mp3',
      explanation: {
        en: 'Use this with a map pin or written address when you get into a taxi.',
        fr: 'Utilise cette phrase avec une adresse écrite ou un point sur la carte en montant dans un taxi.',
      },
    },
    {
      id: 'self-intro-pattern-3',
      pattern: '大概……？',
      meaning: {
        en: 'About / roughly ...?',
        fr: 'Environ ... ?',
      },
      example: '大概需要多久？',
      audio: '/audio/self-intro/pattern-03.mp3',
      explanation: {
        en: 'Use 大概 before time or price questions when an estimate is enough.',
        fr: 'Place 大概 avant les questions de temps ou de prix quand une estimation suffit.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'self-intro-vocab-1',
      hanzi: '护照',
      pinyin: 'hùzhào',
      audio: '/audio/self-intro/vocab-01.mp3',
      meaning: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'The key document word you may need at counters after landing.',
        fr: 'Le mot clé pour le document que l’on peut demander aux guichets après l’arrivée.',
      },
    },
    {
      id: 'self-intro-vocab-2',
      hanzi: '行李提取处',
      pinyin: 'xíngli tíqǔchù',
      audio: '/audio/self-intro/vocab-02.mp3',
      meaning: {
        en: 'baggage claim',
        fr: 'récupération des bagages',
      },
      explanation: {
        en: 'Look for this after leaving the arrival corridor.',
        fr: 'Cherche cet endroit après le couloir d’arrivée.',
      },
    },
    {
      id: 'self-intro-vocab-3',
      hanzi: '问询台',
      pinyin: 'wènxúntái',
      audio: '/audio/self-intro/vocab-03.mp3',
      meaning: {
        en: 'information desk',
        fr: 'bureau d’information',
      },
      explanation: {
        en: 'A useful place to ask when luggage is delayed or directions are unclear.',
        fr: 'Un endroit utile si les bagages tardent ou si le chemin n’est pas clair.',
      },
    },
    {
      id: 'self-intro-vocab-4',
      hanzi: '出租车',
      pinyin: 'chūzūchē',
      audio: '/audio/self-intro/vocab-04.mp3',
      meaning: {
        en: 'taxi',
        fr: 'taxi',
      },
      explanation: {
        en: 'Use it when asking for the taxi stand or pickup area.',
        fr: 'Utilise ce mot pour demander la station ou la zone de prise en charge des taxis.',
      },
    },
    {
      id: 'self-intro-vocab-5',
      hanzi: '地址',
      pinyin: 'dìzhǐ',
      audio: '/audio/self-intro/vocab-05.mp3',
      meaning: {
        en: 'address',
        fr: 'adresse',
      },
      explanation: {
        en: 'Show the saved address and keep the spoken Chinese simple.',
        fr: 'Montre l’adresse enregistrée et garde la phrase chinoise simple.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'self-intro-pronunciation-1',
      focus: {
        en: 'Polite repair phrase',
        fr: 'Phrase de secours polie',
      },
      audioText: '请说慢一点。',
      audio: '/audio/self-intro/pronunciation-01.mp3',
      tip: {
        en: 'Say 请说 first, then slow down on 慢一点 to ask for slower speech.',
        fr: 'Dis d’abord 请说, puis ralentis sur 慢一点 pour demander de parler plus lentement.',
      },
      explanation: {
        en: 'This phrase is more useful than pretending to understand at a counter or in a taxi.',
        fr: 'Cette phrase est plus utile que de faire semblant de comprendre à un guichet ou dans un taxi.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'self-intro-hanzi-1',
      hanzi: '行',
      pinyin: 'xíng',
      meaning: {
        en: 'first character in luggage',
        fr: 'premier caractère de bagage',
      },
      explanation: {
        en: 'Recognize 行 as part of 行李 on airport signs.',
        fr: 'Reconnais 行 dans 行李 sur les panneaux de l’aéroport.',
      },
    },
    {
      id: 'self-intro-hanzi-2',
      hanzi: '李',
      pinyin: 'li',
      meaning: {
        en: 'second character in luggage',
        fr: 'deuxième caractère de bagage',
      },
      explanation: {
        en: '李 completes 行李, the word for luggage.',
        fr: '李 complète 行李, le mot pour bagage.',
      },
    },
    {
      id: 'self-intro-hanzi-3',
      hanzi: '出',
      pinyin: 'chū',
      meaning: {
        en: 'go out; first character in exit',
        fr: 'sortir ; premier caractère de sortie',
      },
      explanation: {
        en: 'Look for 出 in 出口 when you need the exit.',
        fr: 'Repère 出 dans 出口 quand tu cherches la sortie.',
      },
    },
    {
      id: 'self-intro-hanzi-4',
      hanzi: '口',
      pinyin: 'kǒu',
      meaning: {
        en: 'mouth / opening; second character in exit',
        fr: 'bouche / ouverture ; deuxième caractère de sortie',
      },
      explanation: {
        en: '口 completes 出口, a sign you will see in stations and airports.',
        fr: '口 complète 出口, un panneau fréquent dans les gares et les aéroports.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'self-intro-listening-1',
        prompt: {
          en: 'Which sentence means “I don’t understand”?',
          fr: 'Quelle phrase signifie « Je ne comprends pas » ?',
        },
        target: '我听不懂。',
        audio: '/audio/self-intro/practice-listening-01.mp3',
        explanation: {
          en: 'Use 我听不懂 when the other person is speaking but the meaning is not clear.',
          fr: 'Utilise 我听不懂 quand l’autre personne parle mais que le sens n’est pas clair.',
        },
      },
    ],
    speaking: [
      {
        id: 'self-intro-speaking-1',
        prompt: {
          en: 'Ask the other person to write it down.',
          fr: 'Demande à l’autre personne de l’écrire.',
        },
        target: '可以帮我写下来吗？',
        audio: '/audio/self-intro/practice-speaking-01.mp3',
        explanation: {
          en: 'This gives you a written address, price, or instruction when speech is too fast.',
          fr: 'Cela permet d’obtenir une adresse, un prix ou une instruction par écrit quand l’oral est trop rapide.',
        },
      },
    ],
    reading: [
      {
        id: 'self-intro-reading-1',
        prompt: {
          en: 'Match the airport sign word to “exit”.',
          fr: 'Associe le mot du panneau à « sortie ».',
        },
        target: '出口',
        audio: '/audio/self-intro/practice-reading-01.mp3',
        explanation: {
          en: '出口 is the sign you need after collecting baggage.',
          fr: '出口 est le panneau utile après la récupération des bagages.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'self-intro-review-1',
      front: '护照',
      back: {
        en: 'passport',
        fr: 'passeport',
      },
      explanation: {
        en: 'The first document word to recognize after landing.',
        fr: 'Le premier mot de document à reconnaître après l’arrivée.',
      },
    },
    {
      id: 'self-intro-review-2',
      front: '行李提取处',
      back: {
        en: 'baggage claim',
        fr: 'récupération des bagages',
      },
      explanation: {
        en: 'Use it when asking where to collect luggage.',
        fr: 'Utilise-le pour demander où récupérer les bagages.',
      },
    },
    {
      id: 'self-intro-review-3',
      front: '我听不懂',
      back: {
        en: 'I don’t understand what I’m hearing.',
        fr: 'Je ne comprends pas ce que j’entends.',
      },
      explanation: {
        en: 'A self-rescue phrase when airport or taxi speech is too fast.',
        fr: 'Une phrase de secours quand le personnel ou le chauffeur parle trop vite.',
      },
    },
  ],
  shortInput: {
    id: 'self-intro-short-input-01',
    prompt: {
      en: 'Ask where the exit is.',
      fr: 'Demande où est la sortie.',
    },
    target: '请问出口在哪里？',
    explanation: {
      en: 'Use the same 请问…在哪里？ pattern after baggage claim.',
      fr: 'Utilise la même structure 请问…在哪里？ après les bagages.',
    },
    audio: '/audio/self-intro/short-input-01.mp3',
  },
}
