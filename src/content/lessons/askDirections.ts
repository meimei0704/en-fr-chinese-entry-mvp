import type { LessonContent } from '../types'

export const askDirectionsLesson: LessonContent = {
  id: 'ask-directions',
  title: {
    en: 'Take a taxi to your hotel',
    fr: 'Prendre un taxi jusqu’à son hôtel',
  },
  scenario: {
    en: 'Get into a taxi, show the address, and ask roughly how long the ride will take.',
    fr: 'Monter dans un taxi, montrer l’adresse et demander environ combien de temps prendra le trajet.',
  },
  dialogue: {
    title: {
      en: 'Tell the driver your destination',
      fr: 'Indiquer sa destination au chauffeur',
    },
    lines: [
      {
        id: 'ask-directions-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '师傅，去这个酒店。',
        pinyin: 'Shīfu, qù zhège jiǔdiàn.',
        translation: {
          en: 'Driver, please go to this hotel.',
          fr: 'Chauffeur, allez à cet hôtel, s’il vous plaît.',
        },
        explanation: {
          en: '师傅 is a practical way to address a taxi driver politely.',
          fr: '师傅 est une façon pratique et polie de s’adresser à un chauffeur.',
        },
        audio: '/audio/ask-directions/line-01.mp3',
      },
      {
        id: 'ask-directions-line-02',
        speaker: {
          en: 'Driver',
          fr: 'Chauffeur',
        },
        hanzi: '好的，你给我看一下地址。',
        pinyin: 'Hǎo de, nǐ gěi wǒ kàn yíxià dìzhǐ.',
        translation: {
          en: 'Okay, show me the address.',
          fr: 'D’accord, montre-moi l’adresse.',
        },
        explanation: {
          en: '给我看一下 is useful when the driver wants to see your phone or booking address.',
          fr: '给我看一下 est utile quand le chauffeur veut voir l’adresse sur ton téléphone ou ta réservation.',
        },
        audio: '/audio/ask-directions/line-02.mp3',
      },
      {
        id: 'ask-directions-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '在这里。',
        pinyin: 'Zài zhèlǐ.',
        translation: {
          en: 'It is here.',
          fr: 'C’est ici.',
        },
        explanation: {
          en: 'Use 在这里 while pointing to the address on your phone.',
          fr: 'Utilise 在这里 en montrant l’adresse sur ton téléphone.',
        },
        audio: '/audio/ask-directions/line-03.mp3',
      },
      {
        id: 'ask-directions-line-04',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '大概多久到？',
        pinyin: 'Dàgài duōjiǔ dào?',
        translation: {
          en: 'About how long until we arrive?',
          fr: 'Environ combien de temps pour arriver ?',
        },
        explanation: {
          en: '大概多久到 is a short way to ask the approximate travel time.',
          fr: '大概多久到 est une façon courte de demander la durée approximative du trajet.',
        },
        audio: '/audio/ask-directions/line-04.mp3',
      },
      {
        id: 'ask-directions-line-05',
        speaker: {
          en: 'Driver',
          fr: 'Chauffeur',
        },
        hanzi: '四十分钟左右。',
        pinyin: 'Sìshí fēnzhōng zuǒyòu.',
        translation: {
          en: 'Around forty minutes.',
          fr: 'Environ quarante minutes.',
        },
        explanation: {
          en: '左右 means around or about, useful with time and price estimates.',
          fr: '左右 signifie environ ; c’est utile pour les durées et les prix approximatifs.',
        },
        audio: '/audio/ask-directions/line-05.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'ask-directions-pattern-1',
      pattern: '去这个……',
      meaning: {
        en: 'Go to this ...',
        fr: 'Aller à ce / cette ...',
      },
      example: '去这个酒店。',
      explanation: {
        en: 'Point to your map or booking while saying the destination.',
        fr: 'Montre ta carte ou ta réservation en disant la destination.',
      },
    },
    {
      id: 'ask-directions-pattern-2',
      pattern: '给我看一下……',
      meaning: {
        en: 'Show me ... for a moment',
        fr: 'Montre-moi ... un instant',
      },
      example: '给我看一下地址。',
      explanation: {
        en: 'Drivers may use this to ask for the address on your phone.',
        fr: 'Les chauffeurs peuvent utiliser cette phrase pour demander l’adresse sur ton téléphone.',
      },
    },
    {
      id: 'ask-directions-pattern-3',
      pattern: '大概……到？',
      meaning: {
        en: 'About ... until arrival?',
        fr: 'Environ ... pour arriver ?',
      },
      example: '大概多久到？',
      explanation: {
        en: 'Use it to ask a short travel-time question in the taxi.',
        fr: 'Utilise-le pour demander rapidement la durée du trajet en taxi.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'ask-directions-vocab-1',
      hanzi: '师傅',
      pinyin: 'shīfu',
      meaning: {
        en: 'driver / master worker',
        fr: 'chauffeur / maître artisan',
      },
      explanation: {
        en: 'A common respectful address for taxi drivers and skilled workers.',
        fr: 'Une appellation respectueuse courante pour les chauffeurs de taxi et les artisans.',
      },
    },
    {
      id: 'ask-directions-vocab-2',
      hanzi: '地址',
      pinyin: 'dìzhǐ',
      meaning: {
        en: 'address',
        fr: 'adresse',
      },
      explanation: {
        en: 'The key word when showing a hotel or apartment location.',
        fr: 'Le mot clé quand on montre l’emplacement d’un hôtel ou d’un appartement.',
      },
    },
    {
      id: 'ask-directions-vocab-3',
      hanzi: '酒店',
      pinyin: 'jiǔdiàn',
      meaning: {
        en: 'hotel',
        fr: 'hôtel',
      },
      explanation: {
        en: 'Use it as the first arrival destination after the airport.',
        fr: 'Utilise-le pour la première destination après l’aéroport.',
      },
    },
    {
      id: 'ask-directions-vocab-4',
      hanzi: '多久',
      pinyin: 'duōjiǔ',
      meaning: {
        en: 'how long',
        fr: 'combien de temps',
      },
      explanation: {
        en: 'Useful for asking about travel time.',
        fr: 'Utile pour demander la durée d’un trajet.',
      },
    },
    {
      id: 'ask-directions-vocab-5',
      hanzi: '左右',
      pinyin: 'zuǒyòu',
      meaning: {
        en: 'around / about',
        fr: 'environ / à peu près',
      },
      explanation: {
        en: 'Use it after minutes or money amounts for an estimate.',
        fr: 'Utilise-le après des minutes ou une somme pour donner une estimation.',
      },
    },
  ],
  pronunciation: [
    {
      id: 'ask-directions-pronunciation-1',
      focus: {
        en: 'Practical taxi words',
        fr: 'Mots pratiques du taxi',
      },
      tip: {
        en: 'Keep 师傅, 地址, and 左右 clear; avoid adding complex route talk in this first taxi lesson.',
        fr: 'Prononce clairement 师傅, 地址 et 左右 ; n’ajoute pas encore de phrases complexes sur l’itinéraire.',
      },
      explanation: {
        en: 'These words are enough to start the ride and check the arrival time.',
        fr: 'Ces mots suffisent pour démarrer le trajet et vérifier l’heure d’arrivée.',
      },
    },
  ],
  hanziRecognition: [
    {
      id: 'ask-directions-hanzi-1',
      hanzi: '地',
      pinyin: 'dì',
      meaning: {
        en: 'ground / place; first character of address',
        fr: 'sol / lieu ; premier caractère de adresse',
      },
      explanation: {
        en: 'Recognize 地 as part of 地址.',
        fr: 'Reconnais 地 dans 地址.',
      },
    },
    {
      id: 'ask-directions-hanzi-2',
      hanzi: '址',
      pinyin: 'zhǐ',
      meaning: {
        en: 'site; second character of address',
        fr: 'emplacement ; deuxième caractère de adresse',
      },
      explanation: {
        en: '址 completes 地址, the word for address.',
        fr: '址 complète 地址, le mot pour adresse.',
      },
    },
    {
      id: 'ask-directions-hanzi-3',
      hanzi: '多',
      pinyin: 'duō',
      meaning: {
        en: 'many / how much',
        fr: 'beaucoup / combien',
      },
      explanation: {
        en: '多 appears in 多久, the phrase for how long.',
        fr: '多 apparaît dans 多久, l’expression pour combien de temps.',
      },
    },
    {
      id: 'ask-directions-hanzi-4',
      hanzi: '久',
      pinyin: 'jiǔ',
      meaning: {
        en: 'long time',
        fr: 'longtemps',
      },
      explanation: {
        en: '久 completes 多久, a key travel-time question.',
        fr: '久 complète 多久, une question clé sur la durée du trajet.',
      },
    },
  ],
  practice: {
    listening: [
      {
        id: 'ask-directions-listening-1',
        prompt: {
          en: 'Which phrase tells the driver the destination?',
          fr: 'Quelle phrase indique la destination au chauffeur ?',
        },
        target: '师傅，去这个酒店。',
        explanation: {
          en: 'This is the first taxi sentence to get moving from the airport.',
          fr: 'C’est la première phrase de taxi pour partir de l’aéroport.',
        },
      },
    ],
    speaking: [
      {
        id: 'ask-directions-speaking-1',
        prompt: {
          en: 'Tell the driver to go to this hotel.',
          fr: 'Dis au chauffeur d’aller à cet hôtel.',
        },
        target: '师傅，去这个酒店。',
        explanation: {
          en: 'You can swap 酒店 for 公寓 when going to an apartment.',
          fr: 'Tu peux remplacer 酒店 par 公寓 si tu vas à un appartement.',
        },
      },
    ],
    reading: [
      {
        id: 'ask-directions-reading-1',
        prompt: {
          en: 'Match the phrase that asks about travel time.',
          fr: 'Associe la phrase qui demande la durée du trajet.',
        },
        target: '大概多久到？',
        explanation: {
          en: '大概多久到 asks about the approximate arrival time.',
          fr: '大概多久到 demande l’heure ou la durée approximative d’arrivée.',
        },
      },
    ],
  },
  reviewCards: [
    {
      id: 'ask-directions-review-1',
      front: '去这个酒店',
      back: {
        en: 'Go to this hotel.',
        fr: 'Allez à cet hôtel.',
      },
      explanation: {
        en: 'Use it while showing the hotel on your phone.',
        fr: 'Utilise-le en montrant l’hôtel sur ton téléphone.',
      },
    },
    {
      id: 'ask-directions-review-2',
      front: '地址',
      back: {
        en: 'address',
        fr: 'adresse',
      },
      explanation: {
        en: 'A key word when confirming the destination.',
        fr: 'Un mot clé pour confirmer la destination.',
      },
    },
    {
      id: 'ask-directions-review-3',
      front: '大概多久到',
      back: {
        en: 'About how long until we arrive?',
        fr: 'Environ combien de temps pour arriver ?',
      },
      explanation: {
        en: 'Ask this when you want a rough travel-time estimate.',
        fr: 'Pose cette question pour obtenir une estimation de durée.',
      },
    },
  ],
  shortInput: {
    id: 'ask-directions-short-input-01',
    prompt: {
      en: 'You need to tell the driver the destination.',
      fr: 'Tu dois indiquer la destination au chauffeur.',
    },
    target: '师傅，去这个酒店。',
    explanation: {
      en: 'This short taxi sentence is enough to start the ride.',
      fr: 'Cette courte phrase de taxi suffit pour commencer le trajet.',
    },
    audio: '/audio/ask-directions/short-input-01.mp3',
  },
}
