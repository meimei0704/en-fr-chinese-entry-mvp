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
        en: 'Glide smoothly from one vowel to the next — the core of natural Mandarin flow.',
        fr: 'Glissez doucement d’une voyelle à l’autre — le cœur de la fluidité naturelle du mandarin.',
      },
      items: [
        {
          id: 'final-ai',
          label: 'ai',
          pinyin: 'āi',
          description: { en: 'Glide from open “a” to “i”; hold a first-tone contour.', fr: 'Glissez de « a » ouvert vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ai.mp3`,
        },
        {
          id: 'final-ei',
          label: 'ei',
          pinyin: 'ēi',
          description: { en: 'Glide from “e” to “i”; hold a first-tone contour.', fr: 'Glissez de « e » vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ei.mp3`,
        },
        {
          id: 'final-ui',
          label: 'ui',
          pinyin: 'uī',
          description: { en: 'Glide smoothly from “u” through “e” to “i”; hold a first-tone contour.', fr: 'Glissez de « ou » vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ui.mp3`,
        },
        {
          id: 'final-ao',
          label: 'ao',
          pinyin: 'āo',
          description: { en: 'Glide from open “a” to rounded “o”; hold a first-tone contour.', fr: 'Glissez de « a » vers « o » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ao.mp3`,
        },
        {
          id: 'final-ou',
          label: 'ou',
          pinyin: 'ōu',
          description: { en: 'Glide from “o” to rounded “u”; hold a first-tone contour.', fr: 'Glissez de « o » vers « ou » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ou.mp3`,
        },
        {
          id: 'final-iu',
          label: 'iu',
          pinyin: 'iū',
          description: { en: 'Glide from “i” through “o” to “u”; hold a first-tone contour.', fr: 'Glissez de « i » vers « ou » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-iu.mp3`,
        },
        {
          id: 'final-ie',
          label: 'ie',
          pinyin: 'iē',
          description: { en: 'Glide from “i” to an open “e”; hold a first-tone contour.', fr: 'Glissez de « i » vers « e » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ie.mp3`,
        },
        {
          id: 'final-ue',
          label: 'üe',
          pinyin: 'üē',
          description: { en: 'Round your lips for ü, then open to e; hold a first-tone contour.', fr: 'Arrondissez pour ü, puis ouvrez vers e avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
        },
        {
          id: 'final-er',
          label: 'er',
          pinyin: 'ēr',
          description: { en: 'A rhotic “er” with the tongue tip curled; hold a first-tone contour.', fr: 'Un « er » rhotique, pointe de la langue recourbée, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-er.mp3`,
        },
      ],
    },
    {
      id: 'finals-nasal-n',
      title: {
        en: 'Nasal -n Finals',
        fr: 'Finales nasales -n',
      },
      summary: {
        en: 'End with the tongue tip touching behind your upper teeth.',
        fr: 'Terminez avec la pointe de la langue touchant derrière les dents supérieures.',
      },
      items: [
        {
          id: 'final-an',
          label: 'an',
          pinyin: 'ān',
          description: { en: 'Open “ah” + n; hold a first-tone contour.', fr: '« a » ouvert + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-an.mp3`,
        },
        {
          id: 'final-en',
          label: 'en',
          pinyin: 'ēn',
          description: { en: 'Relaxed “uh” + n; hold a first-tone contour.', fr: '« eu » relâché + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-en.mp3`,
        },
        {
          id: 'final-in',
          label: 'in',
          pinyin: 'īn',
          description: { en: '“ee” + n; hold a first-tone contour.', fr: '« i » + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-in.mp3`,
        },
        {
          id: 'final-un',
          label: 'un',
          pinyin: 'ūn',
          description: { en: '“oo” + n; hold a first-tone contour.', fr: '« ou » + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-un.mp3`,
        },
        {
          id: 'final-uen',
          label: 'ün',
          pinyin: 'ǖn',
          description: { en: 'Round-lip ü + n; hold a first-tone contour.', fr: 'ü à lèvres arrondies + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-uen.mp3`,
        },
      ],
    },
    {
      id: 'finals-nasal-ng',
      title: {
        en: 'Nasal -ng Finals',
        fr: 'Finales nasales -ng',
      },
      summary: {
        en: 'End with the back of your tongue raised — a deeper, more resonant nasal.',
        fr: 'Terminez avec l’arrière de la langue levé — un nasal plus profond et résonant.',
      },
      items: [
        {
          id: 'final-ang',
          label: 'ang',
          pinyin: 'āng',
          description: { en: 'Open “ah” + ng; hold a first-tone contour.', fr: '« a » ouvert + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ang.mp3`,
        },
        {
          id: 'final-eng',
          label: 'eng',
          pinyin: 'ēng',
          description: { en: 'Relaxed “uh” + ng; hold a first-tone contour.', fr: '« eu » relâché + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-eng.mp3`,
        },
        {
          id: 'final-ing',
          label: 'ing',
          pinyin: 'īng',
          description: { en: '“ee” + ng; hold a first-tone contour.', fr: '« i » + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ing.mp3`,
        },
        {
          id: 'final-ong',
          label: 'ong',
          pinyin: 'ōng',
          description: { en: 'Rounded “oo” + ng; hold a first-tone contour.', fr: '« ou » arrondi + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ong.mp3`,
        },
      ],
    },
  ],
}
