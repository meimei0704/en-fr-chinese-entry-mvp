import type { PinyinLessonContent } from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-2'

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
          hanzi: '猪',
          label: 'zh',
          pinyin: 'zhū',
          description: {
            en: 'Unaspirated retroflex — tongue curled back, like "j" but further back.',
            fr: 'Rétroflexe non aspirée — langue recourbée, comme « dj » mais plus en arrière.',
          },
          audio: `${lessonAudioBase}/reference-initial-zh.mp3`,
        },
        {
          id: 'initial-ch',
          hanzi: '茶',
          label: 'ch',
          pinyin: 'chá',
          description: {
            en: 'Aspirated retroflex — same tongue position as zh but with a puff of air.',
            fr: 'Rétroflexe aspirée — même position que zh mais avec un souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-ch.mp3`,
        },
        {
          id: 'initial-sh',
          hanzi: '书',
          label: 'sh',
          pinyin: 'shū',
          description: {
            en: 'Retroflex fricative — tongue curled, air flows continuously.',
            fr: 'Fricative rétroflexe — langue recourbée, flux d’air continu.',
          },
          audio: `${lessonAudioBase}/reference-initial-sh.mp3`,
        },
        {
          id: 'initial-r',
          hanzi: '日',
          label: 'r',
          pinyin: 'rì',
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
          hanzi: '字',
          label: 'z',
          pinyin: 'zì',
          description: {
            en: 'Unaspirated alveolar — tongue behind lower teeth, like "ds".',
            fr: 'Alvéolaire non aspirée — langue derrière les dents inférieures, comme « dz ».',
          },
          audio: `${lessonAudioBase}/reference-initial-z.mp3`,
        },
        {
          id: 'initial-c',
          hanzi: '菜',
          label: 'c',
          pinyin: 'cài',
          description: {
            en: 'Aspirated alveolar — like "ts" with a strong puff of air.',
            fr: 'Alvéolaire aspirée — comme « ts » avec un fort souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-c.mp3`,
        },
        {
          id: 'initial-s',
          hanzi: '四',
          label: 's',
          pinyin: 'sì',
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
          hanzi: '家',
          label: 'j',
          pinyin: 'jiā',
          description: {
            en: 'Unaspirated palatal — tongue body raised, like a soft "jee".',
            fr: 'Palatale non aspirée — corps de la langue levé, comme un « dji » doux.',
          },
          audio: `${lessonAudioBase}/reference-initial-j.mp3`,
        },
        {
          id: 'initial-q',
          hanzi: '七',
          label: 'q',
          pinyin: 'qī',
          description: {
            en: 'Aspirated palatal — same position as j but with a strong puff.',
            fr: 'Palatale aspirée — même position que j mais avec un fort souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-q.mp3`,
        },
        {
          id: 'initial-x',
          hanzi: '西',
          label: 'x',
          pinyin: 'xī',
          description: {
            en: 'Palatal fricative — tongue body raised, like a soft "sh" with a smile.',
            fr: 'Fricative palatale — corps de la langue levé, comme un « ch » doux en souriant.',
          },
          audio: `${lessonAudioBase}/reference-initial-x.mp3`,
        },
      ],
    },
    {
      id: 'initials-yw',
      title: {
        en: 'Y and W',
        fr: 'Y et W',
      },
      summary: {
        en: 'Two semi-consonants that always begin syllables on their own.',
        fr: 'Deux semi-consonnes qui commencent toujours une syllabe.',
      },
      items: [
        {
          id: 'initial-y',
          hanzi: '雨',
          label: 'y',
          pinyin: 'yǔ',
          description: {
            en: 'A glide like "y" in "yes".',
            fr: 'Un glissement comme « y » dans « yes ».',
          },
          audio: `${lessonAudioBase}/reference-initial-y.mp3`,
        },
        {
          id: 'initial-w',
          hanzi: '我',
          label: 'w',
          pinyin: 'wǒ',
          description: {
            en: 'A glide like "w" in "water".',
            fr: 'Un glissement comme « w » dans « water ».',
          },
          audio: `${lessonAudioBase}/reference-initial-w.mp3`,
        },
      ],
    },
  ],
}
