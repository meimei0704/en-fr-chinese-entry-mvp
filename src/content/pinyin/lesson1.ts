import type {
  PinyinLessonContent,
  ToneGameChoice,
  ToneGameQuestion,
} from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-1'

const toneChoices: ToneGameChoice[] = [
  {
    id: 'tone-1',
    label: 'mā',
    toneLabel: {
      en: 'First tone: high and level',
      fr: 'Premier ton : haut et plat',
    },
  },
  {
    id: 'tone-2',
    label: 'má',
    toneLabel: {
      en: 'Second tone: rising',
      fr: 'Deuxième ton : montant',
    },
  },
  {
    id: 'tone-3',
    label: 'mǎ',
    toneLabel: {
      en: 'Third tone: low dipping',
      fr: 'Troisième ton : bas avec un creux',
    },
  },
  {
    id: 'tone-4',
    label: 'mà',
    toneLabel: {
      en: 'Fourth tone: sharp falling',
      fr: 'Quatrième ton : descendant net',
    },
  },
]

function toneQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
  explanation: string,
): ToneGameQuestion {
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices: [...toneChoices],
    correctChoiceId,
    explanation,
  }
}

export const pinyinLesson1: PinyinLessonContent = {
  id: 'pinyin-foundations-1',
  title: {
    en: 'Pinyin Foundations',
    fr: 'Bases du pinyin',
  },
  summary: {
    en: 'Hear 11 core initials, 6 single finals, and 4 tones before shadowing practical beginner phrases.',
    fr: 'Écoutez 11 initiales essentielles, 6 finales simples et 4 tons avant de répéter des phrases pratiques.',
  },
  reference: [
    {
      id: 'initials',
      title: {
        en: 'Initials',
        fr: 'Initiales',
      },
      summary: {
        en: 'Master crisp consonant sounds — aspirated vs unaspirated pairs at the heart of Mandarin syllables.',
        fr: 'Maîtrisez les consonnes nettes — paires aspirées vs non aspirées au cœur des syllabes mandarines.',
      },
      items: [
        {
          id: 'initial-b',
          label: 'b',
          pinyin: 'bo',
          description: {
            en: 'Unaspirated b, close to a soft English “p”.',
            fr: 'b non aspiré, proche d’un « p » anglais doux.',
          },
          audio: `${lessonAudioBase}/reference-initial-b.mp3`,
        },
        {
          id: 'initial-p',
          label: 'p',
          pinyin: 'po',
          description: {
            en: 'Aspirated p with a clear puff of air.',
            fr: 'p aspiré avec un souffle bien audible.',
          },
          audio: `${lessonAudioBase}/reference-initial-p.mp3`,
        },
        {
          id: 'initial-m',
          label: 'm',
          pinyin: 'mo',
          description: {
            en: 'Nasal m, steady and relaxed.',
            fr: 'm nasal, stable et détendu.',
          },
          audio: `${lessonAudioBase}/reference-initial-m.mp3`,
        },
        {
          id: 'initial-f',
          label: 'f',
          pinyin: 'fo',
          description: {
            en: 'Light f with the lower lip touching the upper teeth.',
            fr: 'f léger, la lèvre inférieure touchant les dents supérieures.',
          },
          audio: `${lessonAudioBase}/reference-initial-f.mp3`,
        },
        {
          id: 'initial-d',
          label: 'd',
          pinyin: 'de',
          description: {
            en: 'Unaspirated d, soft and unvoiced.',
            fr: 'd non aspiré, doux et non voisé.',
          },
          audio: `${lessonAudioBase}/reference-initial-d.mp3`,
        },
        {
          id: 'initial-t',
          label: 't',
          pinyin: 'te',
          description: {
            en: 'Aspirated t with a strong puff of air.',
            fr: 't aspiré avec un souffle puissant.',
          },
          audio: `${lessonAudioBase}/reference-initial-t.mp3`,
        },
        {
          id: 'initial-n',
          label: 'n',
          pinyin: 'ne',
          description: {
            en: 'Nasal n, tip of tongue behind upper teeth.',
            fr: 'n nasal, pointe de la langue derrière les dents supérieures.',
          },
          audio: `${lessonAudioBase}/reference-initial-n.mp3`,
        },
        {
          id: 'initial-l',
          label: 'l',
          pinyin: 'le',
          description: {
            en: 'Light l, similar to English but clearer.',
            fr: 'l léger, similaire à l’anglais mais plus clair.',
          },
          audio: `${lessonAudioBase}/reference-initial-l.mp3`,
        },
        {
          id: 'initial-g',
          label: 'g',
          pinyin: 'ge',
          description: {
            en: 'Unaspirated g, soft like an English “k” without the puff.',
            fr: 'g non aspiré, doux comme un « k » anglais sans souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-g.mp3`,
        },
        {
          id: 'initial-k',
          label: 'k',
          pinyin: 'ke',
          description: {
            en: 'Aspirated k with a strong burst of air.',
            fr: 'k aspiré avec une forte explosion d’air.',
          },
          audio: `${lessonAudioBase}/reference-initial-k.mp3`,
        },
        {
          id: 'initial-h',
          label: 'h',
          pinyin: 'he',
          description: {
            en: 'Rough h, harsher than English — like the “ch” in Scottish “loch”.',
            fr: 'h rauque, plus dur qu’en anglais — proche du « ch » allemand.',
          },
          audio: `${lessonAudioBase}/reference-initial-h.mp3`,
        },
      ],
    },
    {
      id: 'finals',
      title: {
        en: 'Finals',
        fr: 'Finales',
      },
      summary: {
        en: 'Anchor syllables with clear single-vowel endings including the special ü.',
        fr: 'Stabilisez les syllabes avec des voyelles simples claires, y compris le ü spécial.',
      },
      items: [
        {
          id: 'final-a',
          label: 'a',
          pinyin: 'a',
          description: {
            en: 'Open “ah” sound.',
            fr: 'Son ouvert « a ».',
          },
          audio: `${lessonAudioBase}/reference-final-a.mp3`,
        },
        {
          id: 'final-o',
          label: 'o',
          pinyin: 'o',
          description: {
            en: 'Rounded “oh” sound.',
            fr: 'Son arrondi « o ».',
          },
          audio: `${lessonAudioBase}/reference-final-o.mp3`,
        },
        {
          id: 'final-e',
          label: 'e',
          pinyin: 'e',
          description: {
            en: 'Back vowel, like a relaxed “uh”.',
            fr: 'Voyelle arrière, proche d’un « eu » relâché.',
          },
          audio: `${lessonAudioBase}/reference-final-e.mp3`,
        },
        {
          id: 'final-i',
          label: 'i',
          pinyin: 'yi',
          description: {
            en: 'Clear “ee” sound.',
            fr: 'Son clair « i ».',
          },
          audio: `${lessonAudioBase}/reference-final-i.mp3`,
        },
        {
          id: 'final-u',
          label: 'u',
          pinyin: 'wu',
          description: {
            en: 'Rounded “oo” sound with tight lips.',
            fr: 'Son arrondi « ou » avec les lèvres serrées.',
          },
          audio: `${lessonAudioBase}/reference-final-u.mp3`,
        },
        {
          id: 'final-ue',
          label: 'ü',
          pinyin: 'yu',
          description: {
            en: 'Round your lips as if saying “ee” — a unique Mandarin vowel.',
            fr: 'Arrondissez les lèvres comme pour dire « i » — une voyelle unique au mandarin.',
          },
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
        },
      ],
    },
    {
      id: 'tones',
      title: {
        en: 'Tones',
        fr: 'Tons',
      },
      summary: {
        en: 'Practice the four Mandarin pitch shapes on one syllable.',
        fr: 'Entraînez les quatre contours mélodiques du mandarin sur une syllabe.',
      },
      items: [
        {
          id: 'tone-first',
          label: {
            en: 'First tone',
            fr: 'Premier ton',
          },
          pinyin: 'mā',
          description: {
            en: 'High and level.',
            fr: 'Haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-tone-1.mp3`,
        },
        {
          id: 'tone-second',
          label: {
            en: 'Second tone',
            fr: 'Deuxième ton',
          },
          pinyin: 'má',
          description: {
            en: 'Rising, like asking a short question.',
            fr: 'Montant, comme une courte question.',
          },
          audio: `${lessonAudioBase}/reference-tone-2.mp3`,
        },
        {
          id: 'tone-third',
          label: {
            en: 'Third tone',
            fr: 'Troisième ton',
          },
          pinyin: 'mǎ',
          description: {
            en: 'Low dipping tone.',
            fr: 'Ton bas avec un creux.',
          },
          audio: `${lessonAudioBase}/reference-tone-3.mp3`,
        },
        {
          id: 'tone-fourth',
          label: {
            en: 'Fourth tone',
            fr: 'Quatrième ton',
          },
          pinyin: 'mà',
          description: {
            en: 'Falling, short, and decisive.',
            fr: 'Descendant, court et décidé.',
          },
          audio: `${lessonAudioBase}/reference-tone-4.mp3`,
        },
      ],
    },
  ],
  toneGame: {
    title: {
      en: 'Tone ear check',
      fr: 'Écoute des tons',
    },
    instructions: {
      en: 'Listen, then choose the matching tone mark.',
      fr: 'Écoutez, puis choisissez la marque de ton correspondante.',
    },
    questions: [
      toneQuestion(
        'tone-question-01',
        'mā',
        'tone-game-ma-1.mp3',
        'tone-1',
        'The first tone stays high and level.',
      ),
      toneQuestion(
        'tone-question-02',
        'má',
        'tone-game-ma-2.mp3',
        'tone-2',
        'The second tone rises upward.',
      ),
      toneQuestion(
        'tone-question-03',
        'mǎ',
        'tone-game-ma-3.mp3',
        'tone-3',
        'The third tone dips low before lifting.',
      ),
      toneQuestion(
        'tone-question-04',
        'mà',
        'tone-game-ma-4.mp3',
        'tone-4',
        'The fourth tone falls quickly.',
      ),
      toneQuestion(
        'tone-question-05',
        'dā',
        'tone-game-da-1.mp3',
        'tone-1',
        'First tone stays high from start to finish.',
      ),
      toneQuestion(
        'tone-question-06',
        'tǎ',
        'tone-game-ta-3.mp3',
        'tone-3',
        'Third tone dips low — d and t make an aspirated pair.',
      ),
      toneQuestion(
        'tone-question-07',
        'gá',
        'tone-game-ga-2.mp3',
        'tone-2',
        'Second tone rises — hear g/k as another unaspirated/aspirated pair.',
      ),
      toneQuestion(
        'tone-question-08',
        'nǚ',
        'tone-game-nue-3.mp3',
        'tone-3',
        'Third tone with the ü vowel — round your lips.',
      ),
    ],
  },
}
