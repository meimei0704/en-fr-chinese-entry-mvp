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
      id: 'initials-palatal',
      title: {
        en: 'Palatal',
        fr: 'Palatales',
      },
      summary: {
        en: 'Raise the body of your tongue toward the hard palate.',
        fr: 'Élevez le corps de la langue vers le palais dur.',
      },
      items: [
        {
          id: 'initial-j',
          label: 'j',
          pinyin: 'jiā',
          audio: `${lessonAudioBase}/reference-initial-j.mp3`,
        },
        {
          id: 'initial-q',
          label: 'q',
          pinyin: 'qī',
          audio: `${lessonAudioBase}/reference-initial-q.mp3`,
        },
        {
          id: 'initial-x',
          label: 'x',
          pinyin: 'xī',
          audio: `${lessonAudioBase}/reference-initial-x.mp3`,
        },
      ],
    },
    {
      id: 'initials-retroflex',
      title: {
        en: 'Retroflex / curled-tongue',
        fr: 'Rétroflexes / langue recourbée',
      },
      summary: {
        en: 'Curl the tip of the tongue upward and backward toward the hard palate.',
        fr: 'Recourbez la pointe de la langue vers le haut et l’arrière, en direction du palais dur.',
      },
      items: [
        {
          id: 'initial-zh',
          label: 'zh',
          pinyin: 'zhū',
          audio: `${lessonAudioBase}/reference-initial-zh.mp3`,
        },
        {
          id: 'initial-ch',
          label: 'ch',
          pinyin: 'chá',
          audio: `${lessonAudioBase}/reference-initial-ch.mp3`,
        },
        {
          id: 'initial-sh',
          label: 'sh',
          pinyin: 'shū',
          audio: `${lessonAudioBase}/reference-initial-sh.mp3`,
        },
        {
          id: 'initial-r',
          label: 'r',
          pinyin: 'rì',
          audio: `${lessonAudioBase}/reference-initial-r.mp3`,
        },
      ],
    },
    {
      id: 'initials-flat-tongue',
      title: {
        en: 'Flat-tongue',
        fr: 'Langue plate',
      },
      summary: {
        en: 'The tongue stays flat behind the upper front teeth.',
        fr: 'La langue reste à plat derrière les dents supérieures de devant.',
      },
      items: [
        {
          id: 'initial-z',
          label: 'z',
          pinyin: 'zì',
          audio: `${lessonAudioBase}/reference-initial-z.mp3`,
        },
        {
          id: 'initial-c',
          label: 'c',
          pinyin: 'cài',
          audio: `${lessonAudioBase}/reference-initial-c.mp3`,
        },
        {
          id: 'initial-s',
          label: 's',
          pinyin: 'sì',
          audio: `${lessonAudioBase}/reference-initial-s.mp3`,
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
        en: 'Y and w are semivowels. In Chinese Pinyin, they can only be placed at the beginning of a syllable.',
        fr: 'Y et w sont des semi-voyelles. En pinyin chinois, ils ne peuvent se placer qu’au début d’une syllabe.',
      },
      items: [
        {
          id: 'initial-y',
          label: 'y',
          pinyin: 'yǔ',
          audio: `${lessonAudioBase}/reference-initial-y.mp3`,
        },
        {
          id: 'initial-w',
          label: 'w',
          pinyin: 'wǒ',
          audio: `${lessonAudioBase}/reference-initial-w.mp3`,
        },
      ],
    },
  ],
}
