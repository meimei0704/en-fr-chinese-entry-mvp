import type { PinyinLessonContent } from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-3'

export const pinyinLesson3: PinyinLessonContent = {
  id: 'pinyin-compound-finals-3',
  title: {
    en: 'Compound & Nasal Finals',
    fr: 'Finales composées et nasales',
  },
  summary: {
    en: 'Master compound vowels and the critical -n vs -ng nasal distinction with tone pairs.',
    fr: 'Maîtrisez les voyelles composées et la distinction nasale cruciale -n vs -ng avec des paires tonales.',
  },
  reference: [
    {
      id: 'finals-compound',
      title: {
        en: 'Compound Finals',
        fr: 'Finales composées',
      },
      summary: {
        en: 'They consist of two simple vowels. Pronounce with one smooth glide from the first vowel to the second, no break in between.',
        fr: 'Elles se composent de deux voyelles simples. Prononcez d’un seul glissement fluide de la première voyelle à la seconde, sans interruption.',
      },
      items: [
        {
          id: 'final-ai',
          label: 'ai',
          pinyin: 'āi',
          audio: `${lessonAudioBase}/reference-final-ai.mp3`,
        },
        {
          id: 'final-ei',
          label: 'ei',
          pinyin: 'ēi',
          audio: `${lessonAudioBase}/reference-final-ei.mp3`,
        },
        {
          id: 'final-ui',
          label: 'ui',
          pinyin: 'uī',
          audio: `${lessonAudioBase}/reference-final-ui.mp3`,
        },
        {
          id: 'final-ao',
          label: 'ao',
          pinyin: 'āo',
          audio: `${lessonAudioBase}/reference-final-ao.mp3`,
        },
        {
          id: 'final-ou',
          label: 'ou',
          pinyin: 'ōu',
          audio: `${lessonAudioBase}/reference-final-ou.mp3`,
        },
        {
          id: 'final-iu',
          label: 'iu',
          pinyin: 'iū',
          audio: `${lessonAudioBase}/reference-final-iu.mp3`,
        },
        {
          id: 'final-ie',
          label: 'ie',
          pinyin: 'iē',
          audio: `${lessonAudioBase}/reference-final-ie.mp3`,
        },
        {
          id: 'final-ue',
          label: 'üe',
          pinyin: 'üē',
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
        },
        {
          id: 'final-er',
          label: 'er',
          pinyin: 'ēr',
          description: {
            en: 'Curve the tongue tip up and back toward the hard palate.',
            fr: 'Recourbez la pointe de la langue vers le haut et l’arrière, en direction du palais dur.',
          },
          note: {
            en: 'er is an exceptional curled-tongue final. It cannot be combined with any initial consonants. Example: 耳朵 ěr duo — ear.',
            fr: 'er est une finale exceptionnelle à langue recourbée. Elle ne peut se combiner à aucune consonne initiale. Exemple : 耳朵 ěr duo — oreille.',
          },
          audio: `${lessonAudioBase}/reference-final-er.mp3`,
        },
      ],
    },
    {
      id: 'finals-nasal-n',
      title: {
        en: 'Front-nasal Finals',
        fr: 'Finales nasales antérieures',
      },
      summary: {
        en: 'Finish the sound by touching your tongue tip to the upper gum; resonance comes from the front nasal cavity.',
        fr: 'Terminez le son en touchant la gencive supérieure avec la pointe de la langue ; la résonance provient de la cavité nasale antérieure.',
      },
      items: [
        {
          id: 'final-an',
          label: 'an',
          pinyin: 'ān',
          audio: `${lessonAudioBase}/reference-final-an.mp3`,
        },
        {
          id: 'final-en',
          label: 'en',
          pinyin: 'ēn',
          audio: `${lessonAudioBase}/reference-final-en.mp3`,
        },
        {
          id: 'final-in',
          label: 'in',
          pinyin: 'īn',
          audio: `${lessonAudioBase}/reference-final-in.mp3`,
        },
        {
          id: 'final-un',
          label: 'un',
          pinyin: 'ūn',
          audio: `${lessonAudioBase}/reference-final-un.mp3`,
        },
        {
          id: 'final-uen',
          label: 'ün',
          pinyin: 'ǖn',
          audio: `${lessonAudioBase}/reference-final-uen.mp3`,
        },
      ],
    },
    {
      id: 'finals-nasal-ng',
      title: {
        en: 'Back-nasal Finals',
        fr: 'Finales nasales postérieures',
      },
      summary: {
        en: 'Finish the sound by lifting the back of your tongue to block the throat; resonance comes from the deep back nasal cavity.',
        fr: 'Terminez le son en soulevant l’arrière de la langue pour bloquer la gorge ; la résonance provient de la cavité nasale arrière profonde.',
      },
      items: [
        {
          id: 'final-ang',
          label: 'ang',
          pinyin: 'āng',
          audio: `${lessonAudioBase}/reference-final-ang.mp3`,
        },
        {
          id: 'final-eng',
          label: 'eng',
          pinyin: 'ēng',
          audio: `${lessonAudioBase}/reference-final-eng.mp3`,
        },
        {
          id: 'final-ing',
          label: 'ing',
          pinyin: 'īng',
          audio: `${lessonAudioBase}/reference-final-ing.mp3`,
        },
        {
          id: 'final-ong',
          label: 'ong',
          pinyin: 'ōng',
          audio: `${lessonAudioBase}/reference-final-ong.mp3`,
        },
      ],
    },
  ],
}
