import type {
  PinyinLessonContent,
  ToneGameChoice,
  ToneGameQuestion,
} from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-3'

function nasalQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
): ToneGameQuestion {
  const choices: ToneGameChoice[] = [
    { id: 'n', label: '-n', toneLabel: { en: '-n ending', fr: 'Terminaison -n' } },
    { id: 'ng', label: '-ng', toneLabel: { en: '-ng ending', fr: 'Terminaison -ng' } },
  ]
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices,
    correctChoiceId,
  }
}

function tonePairQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
): ToneGameQuestion {
  const choices: ToneGameChoice[] = [
    { id: '1-1', label: '1-1', toneLabel: { en: 'First + First', fr: 'Premier + Premier' } },
    { id: '2-4', label: '2-4', toneLabel: { en: 'Second + Fourth', fr: 'Deuxième + Quatrième' } },
    { id: '3-1', label: '3-1', toneLabel: { en: 'Third + First', fr: 'Troisième + Premier' } },
    { id: '4-4', label: '4-4', toneLabel: { en: 'Fourth + Fourth', fr: 'Quatrième + Quatrième' } },
  ]
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices,
    correctChoiceId,
  }
}

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
          hanzi: '哀',
          label: 'ai',
          pinyin: 'āi',
          description: { en: 'Glide from open “a” to “i”; hold a first-tone contour.', fr: 'Glissez de « a » ouvert vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ai.mp3`,
        },
        {
          id: 'final-ei',
          hanzi: '诶',
          label: 'ei',
          pinyin: 'ēi',
          description: { en: 'Glide from “e” to “i”; hold a first-tone contour.', fr: 'Glissez de « e » vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ei.mp3`,
        },
        {
          id: 'final-ui',
          hanzi: '威',
          label: 'ui',
          pinyin: 'uī',
          description: { en: 'Glide smoothly from “u” through “e” to “i”; hold a first-tone contour.', fr: 'Glissez de « ou » vers « i » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ui.mp3`,
        },
        {
          id: 'final-ao',
          hanzi: '凹',
          label: 'ao',
          pinyin: 'āo',
          description: { en: 'Glide from open “a” to rounded “o”; hold a first-tone contour.', fr: 'Glissez de « a » vers « o » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ao.mp3`,
        },
        {
          id: 'final-ou',
          hanzi: '欧',
          label: 'ou',
          pinyin: 'ōu',
          description: { en: 'Glide from “o” to rounded “u”; hold a first-tone contour.', fr: 'Glissez de « o » vers « ou » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ou.mp3`,
        },
        {
          id: 'final-iu',
          hanzi: '忧',
          label: 'iu',
          pinyin: 'iū',
          description: { en: 'Glide from “i” through “o” to “u”; hold a first-tone contour.', fr: 'Glissez de « i » vers « ou » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-iu.mp3`,
        },
        {
          id: 'final-ie',
          hanzi: '椰',
          label: 'ie',
          pinyin: 'iē',
          description: { en: 'Glide from “i” to an open “e”; hold a first-tone contour.', fr: 'Glissez de « i » vers « e » avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ie.mp3`,
        },
        {
          id: 'final-ue',
          hanzi: '约',
          label: 'üe',
          pinyin: 'üē',
          description: { en: 'Round your lips for ü, then open to e; hold a first-tone contour.', fr: 'Arrondissez pour ü, puis ouvrez vers e avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
        },
        {
          id: 'final-er',
          hanzi: '儿',
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
          hanzi: '安',
          label: 'an',
          pinyin: 'ān',
          description: { en: 'Open “ah” + n; hold a first-tone contour.', fr: '« a » ouvert + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-an.mp3`,
        },
        {
          id: 'final-en',
          hanzi: '恩',
          label: 'en',
          pinyin: 'ēn',
          description: { en: 'Relaxed “uh” + n; hold a first-tone contour.', fr: '« eu » relâché + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-en.mp3`,
        },
        {
          id: 'final-in',
          hanzi: '因',
          label: 'in',
          pinyin: 'īn',
          description: { en: '“ee” + n; hold a first-tone contour.', fr: '« i » + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-in.mp3`,
        },
        {
          id: 'final-un',
          hanzi: '温',
          label: 'un',
          pinyin: 'ūn',
          description: { en: '“oo” + n; hold a first-tone contour.', fr: '« ou » + n, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-un.mp3`,
        },
        {
          id: 'final-uen',
          hanzi: '晕',
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
          hanzi: '肮',
          label: 'ang',
          pinyin: 'āng',
          description: { en: 'Open “ah” + ng; hold a first-tone contour.', fr: '« a » ouvert + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ang.mp3`,
        },
        {
          id: 'final-eng',
          hanzi: '鞥',
          label: 'eng',
          pinyin: 'ēng',
          description: { en: 'Relaxed “uh” + ng; hold a first-tone contour.', fr: '« eu » relâché + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-eng.mp3`,
        },
        {
          id: 'final-ing',
          hanzi: '英',
          label: 'ing',
          pinyin: 'īng',
          description: { en: '“ee” + ng; hold a first-tone contour.', fr: '« i » + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ing.mp3`,
        },
        {
          id: 'final-ong',
          hanzi: '嗡',
          label: 'ong',
          pinyin: 'ōng',
          description: { en: 'Rounded “oo” + ng; hold a first-tone contour.', fr: '« ou » arrondi + ng, avec un premier ton plat.', },
          audio: `${lessonAudioBase}/reference-final-ong.mp3`,
        },
      ],
    },
  ],
  toneGame: {
    title: {
      en: 'Nasal & tone pair ear training',
      fr: 'Entraînement nasal et paires tonales',
    },
    instructions: {
      en: 'Hear a syllable and pick the correct nasal ending or tone pattern.',
      fr: 'Écoutez une syllabe et choisissez la terminaison nasale ou le motif tonal correct.',
    },
    questions: [
      nasalQuestion('nasal-q-01', 'bān', 'tone-game-ban-n.mp3', 'n'),
      nasalQuestion('nasal-q-02', 'bāng', 'tone-game-bang-ng.mp3', 'ng'),
      nasalQuestion('nasal-q-03', 'jīn', 'tone-game-jin-n.mp3', 'n'),
      nasalQuestion('nasal-q-04', 'jīng', 'tone-game-jing-ng.mp3', 'ng'),
      tonePairQuestion('tone-pair-01', 'māma', 'tone-game-mama-11.mp3', '1-1'),
      tonePairQuestion('tone-pair-02', 'xuéxiào', 'tone-game-xuexiao-24.mp3', '2-4'),
      tonePairQuestion('tone-pair-03', 'hǎochī', 'tone-game-haochi-31.mp3', '3-1'),
      tonePairQuestion('tone-pair-04', 'diànhuà', 'tone-game-dianhua-44.mp3', '4-4'),
    ],
  },
}
