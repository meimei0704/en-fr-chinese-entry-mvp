import type {
  PinyinLessonContent,
  ToneGameChoice,
  ToneGameQuestion,
} from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-1'

const toneChoices: ToneGameChoice[] = [
  { id: 'tone-1', label: 'mā', toneLabel: 'First tone: high and level' },
  { id: 'tone-2', label: 'má', toneLabel: 'Second tone: rising' },
  { id: 'tone-3', label: 'mǎ', toneLabel: 'Third tone: low dipping' },
  { id: 'tone-4', label: 'mà', toneLabel: 'Fourth tone: sharp falling' },
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
    en: 'Pinyin Foundations 1',
    fr: 'Bases du pinyin 1',
  },
  summary: {
    en: 'Hear core initials, finals, and tones before shadowing short beginner phrases.',
    fr: 'Écoutez les initiales, finales et tons essentiels avant de répéter de courtes phrases débutantes.',
  },
  reference: [
    {
      id: 'initials',
      title: {
        en: 'Initials',
        fr: 'Initiales',
      },
      summary: {
        en: 'Start with crisp consonant sounds that open common syllables.',
        fr: 'Commencez par les consonnes nettes qui ouvrent des syllabes fréquentes.',
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
      ],
    },
    {
      id: 'finals',
      title: {
        en: 'Finals',
        fr: 'Finales',
      },
      summary: {
        en: 'Anchor syllables with open vowel endings.',
        fr: 'Stabilisez les syllabes avec des voyelles finales ouvertes.',
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
          label: 'First tone',
          pinyin: 'mā',
          description: {
            en: 'High and level.',
            fr: 'Haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-tone-1.mp3`,
        },
        {
          id: 'tone-second',
          label: 'Second tone',
          pinyin: 'má',
          description: {
            en: 'Rising, like asking a short question.',
            fr: 'Montant, comme une courte question.',
          },
          audio: `${lessonAudioBase}/reference-tone-2.mp3`,
        },
        {
          id: 'tone-third',
          label: 'Third tone',
          pinyin: 'mǎ',
          description: {
            en: 'Low dipping tone.',
            fr: 'Ton bas avec un creux.',
          },
          audio: `${lessonAudioBase}/reference-tone-3.mp3`,
        },
        {
          id: 'tone-fourth',
          label: 'Fourth tone',
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
        'bā',
        'tone-game-ba-1.mp3',
        'tone-1',
        'Keep the pitch high and steady for first tone.',
      ),
      toneQuestion(
        'tone-question-06',
        'pó',
        'tone-game-po-2.mp3',
        'tone-2',
        'The rising pitch marks second tone.',
      ),
      toneQuestion(
        'tone-question-07',
        'mǐ',
        'tone-game-mi-3.mp3',
        'tone-3',
        'The low dipping shape marks third tone.',
      ),
      toneQuestion(
        'tone-question-08',
        'fù',
        'tone-game-fu-4.mp3',
        'tone-4',
        'The sharp fall marks fourth tone.',
      ),
    ],
  },
  shadowing: {
    title: {
      en: 'Shadow short phrases',
      fr: 'Répéter de courtes phrases',
    },
    instructions: {
      en: 'Play each prompt, pause, and repeat with the same rhythm.',
      fr: 'Lancez chaque phrase, faites pause, puis répétez avec le même rythme.',
    },
    prompts: [
      {
        id: 'shadow-ni-hao',
        promptText: '你好',
        pinyin: 'nǐ hǎo',
        meaning: {
          en: 'Hello.',
          fr: 'Bonjour.',
        },
        audio: `${lessonAudioBase}/shadow-ni-hao.mp3`,
      },
      {
        id: 'shadow-xie-xie',
        promptText: '谢谢',
        pinyin: 'xiè xie',
        meaning: {
          en: 'Thank you.',
          fr: 'Merci.',
        },
        audio: `${lessonAudioBase}/shadow-xie-xie.mp3`,
      },
      {
        id: 'shadow-dui-bu-qi',
        promptText: '对不起',
        pinyin: 'duì bu qǐ',
        meaning: {
          en: 'Sorry.',
          fr: 'Pardon.',
        },
        audio: `${lessonAudioBase}/shadow-dui-bu-qi.mp3`,
      },
      {
        id: 'shadow-qing',
        promptText: '请',
        pinyin: 'qǐng',
        meaning: {
          en: 'Please.',
          fr: 'S’il vous plaît.',
        },
        audio: `${lessonAudioBase}/shadow-qing.mp3`,
      },
    ],
  },
}
