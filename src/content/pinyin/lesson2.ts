import type {
  PinyinLessonContent,
  ToneGameChoice,
  ToneGameQuestion,
} from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-2'

const groupChoices: ToneGameChoice[] = [
  {
    id: 'retroflex',
    label: 'zh/ch/sh/r',
    toneLabel: {
      en: 'Retroflex: tongue curled back',
      fr: 'Rétroflexe : langue recourbée',
    },
  },
  {
    id: 'alveolar',
    label: 'z/c/s',
    toneLabel: {
      en: 'Alveolar: tongue behind lower teeth',
      fr: 'Alvéolaire : langue derrière les dents inférieures',
    },
  },
  {
    id: 'palatal',
    label: 'j/q/x',
    toneLabel: {
      en: 'Palatal: tongue body raised',
      fr: 'Palatal : corps de la langue levé',
    },
  },
  {
    id: 'unsure',
    label: '?',
    toneLabel: {
      en: 'Can\'t tell',
      fr: 'Je ne sais pas',
    },
  },
]

function groupQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
): ToneGameQuestion {
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices: [...groupChoices],
    correctChoiceId,
  }
}

export const pinyinLesson2: PinyinLessonContent = {
  id: 'pinyin-sibilants-2',
  title: {
    en: 'Sibilants',
    fr: 'Sibilantes',
  },
  summary: {
    en: 'Discriminate retroflex, alveolar, and palatal sibilants — the trickiest contrast in Mandarin.',
    fr: 'Discriminez les sibilantes rétroflexes, alvéolaires et palatales — le contraste le plus délicat du mandarin.',
  },
  reference: [
    {
      id: 'initials-retroflex',
      title: {
        en: 'Retroflex',
        fr: 'Rétroflexes',
      },
      summary: {
        en: 'Curl your tongue back toward the roof of your mouth for these four sounds.',
        fr: 'Recourbez la langue vers le palais pour ces quatre sons.',
      },
      items: [
        {
          id: 'initial-zh',
          label: 'zh',
          pinyin: 'zhi',
          description: {
            en: 'Unaspirated retroflex — tongue curled back, like "j" but further back.',
            fr: 'Rétroflexe non aspirée — langue recourbée, comme « dj » mais plus en arrière.',
          },
          audio: `${lessonAudioBase}/reference-initial-zh.mp3`,
        },
        {
          id: 'initial-ch',
          label: 'ch',
          pinyin: 'chi',
          description: {
            en: 'Aspirated retroflex — same tongue position as zh but with a puff of air.',
            fr: 'Rétroflexe aspirée — même position que zh mais avec un souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-ch.mp3`,
        },
        {
          id: 'initial-sh',
          label: 'sh',
          pinyin: 'shi',
          description: {
            en: 'Retroflex fricative — tongue curled, air flows continuously.',
            fr: 'Fricative rétroflexe — langue recourbée, flux d’air continu.',
          },
          audio: `${lessonAudioBase}/reference-initial-sh.mp3`,
        },
        {
          id: 'initial-r',
          label: 'r',
          pinyin: 'ri',
          description: {
            en: 'Voiced retroflex — same position as sh but with vocal fold vibration.',
            fr: 'Rétroflexe voisée — même position que sh avec vibration des cordes vocales.',
          },
          audio: `${lessonAudioBase}/reference-initial-r.mp3`,
        },
      ],
    },
    {
      id: 'initials-alveolar',
      title: {
        en: 'Alveolar',
        fr: 'Alvéolaires',
      },
      summary: {
        en: 'Keep your tongue tip behind your lower teeth for these three crisp sounds.',
        fr: 'Gardez la pointe de la langue derrière les dents inférieures pour ces trois sons nets.',
      },
      items: [
        {
          id: 'initial-z',
          label: 'z',
          pinyin: 'zi',
          description: {
            en: 'Unaspirated alveolar — tongue behind lower teeth, like "ds".',
            fr: 'Alvéolaire non aspirée — langue derrière les dents inférieures, comme « dz ».',
          },
          audio: `${lessonAudioBase}/reference-initial-z.mp3`,
        },
        {
          id: 'initial-c',
          label: 'c',
          pinyin: 'ci',
          description: {
            en: 'Aspirated alveolar — like "ts" with a strong puff of air.',
            fr: 'Alvéolaire aspirée — comme « ts » avec un fort souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-c.mp3`,
        },
        {
          id: 'initial-s',
          label: 's',
          pinyin: 'si',
          description: {
            en: 'Alveolar fricative — tongue behind teeth with steady airflow.',
            fr: 'Fricative alvéolaire — langue derrière les dents avec flux d’air régulier.',
          },
          audio: `${lessonAudioBase}/reference-initial-s.mp3`,
        },
      ],
    },
    {
      id: 'initials-palatal',
      title: {
        en: 'Palatal',
        fr: 'Palatales',
      },
      summary: {
        en: 'Raise the body of your tongue toward the hard palate for these three sounds.',
        fr: 'Levez le corps de la langue vers le palais dur pour ces trois sons.',
      },
      items: [
        {
          id: 'initial-j',
          label: 'j',
          pinyin: 'ji',
          description: {
            en: 'Unaspirated palatal — tongue body raised, like a soft "jee".',
            fr: 'Palatale non aspirée — corps de la langue levé, comme un « dji » doux.',
          },
          audio: `${lessonAudioBase}/reference-initial-j.mp3`,
        },
        {
          id: 'initial-q',
          label: 'q',
          pinyin: 'qi',
          description: {
            en: 'Aspirated palatal — same position as j but with a strong puff.',
            fr: 'Palatale aspirée — même position que j mais avec un fort souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-q.mp3`,
        },
        {
          id: 'initial-x',
          label: 'x',
          pinyin: 'xi',
          description: {
            en: 'Palatal fricative — tongue body raised, like a soft "sh" with a smile.',
            fr: 'Fricative palatale — corps de la langue levé, comme un « ch » doux en souriant.',
          },
          audio: `${lessonAudioBase}/reference-initial-x.mp3`,
        },
      ],
    },
  ],
  toneGame: {
    title: {
      en: 'Sibilant ear training',
      fr: 'Entraînement des sibilantes',
    },
    instructions: {
      en: 'Hear a syllable, then choose which initial group it belongs to.',
      fr: 'Écoutez une syllabe, puis choisissez le groupe d’initiale auquel elle appartient.',
    },
    questions: [
      groupQuestion('sib-q-01', 'zhā', 'tone-game-zha-retroflex.mp3', 'retroflex'),
      groupQuestion('sib-q-02', 'zā', 'tone-game-za-alveolar.mp3', 'alveolar'),
      groupQuestion('sib-q-03', 'jiā', 'tone-game-jia-palatal.mp3', 'palatal'),
      groupQuestion('sib-q-04', 'chī', 'tone-game-chi-retroflex.mp3', 'retroflex'),
      groupQuestion('sib-q-05', 'cī', 'tone-game-ci-alveolar.mp3', 'alveolar'),
      groupQuestion('sib-q-06', 'qī', 'tone-game-qi-palatal.mp3', 'palatal'),
      groupQuestion('sib-q-07', 'shì', 'tone-game-shi-retroflex.mp3', 'retroflex'),
      groupQuestion('sib-q-08', 'xì', 'tone-game-xi-palatal.mp3', 'palatal'),
    ],
  },
}
