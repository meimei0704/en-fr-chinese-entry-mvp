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
          hanzi: '爱',
          emoji: '❤️',
          label: 'ai',
          pinyin: 'ài',
          description: { en: 'Like "eye". Love = 爱.', fr: 'Comme « aïe ». Amour = 爱.', },
          audio: `${lessonAudioBase}/reference-final-ai.mp3`,
        },
        {
          id: 'final-ei',
          hanzi: '飞',
          emoji: '🕊️',
          label: 'ei',
          pinyin: 'fēi',
          description: { en: 'Like "ay" in "say". Fly = 飞.', fr: 'Comme « eille ». Voler = 飞.', },
          audio: `${lessonAudioBase}/reference-final-ei.mp3`,
        },
        {
          id: 'final-ao',
          hanzi: '好',
          emoji: '👍',
          label: 'ao',
          pinyin: 'hǎo',
          description: { en: 'Like "ow" in "now". Good = 好.', fr: 'Comme « a-o ». Bien = 好.', },
          audio: `${lessonAudioBase}/reference-final-ao.mp3`,
        },
        {
          id: 'final-ou',
          hanzi: '手',
          emoji: '✋',
          label: 'ou',
          pinyin: 'shǒu',
          description: { en: 'Like "oh" with rounded lips. Hand = 手.', fr: 'Comme « o » avec lèvres arrondies. Main = 手.', },
          audio: `${lessonAudioBase}/reference-final-ou.mp3`,
        },
        {
          id: 'final-ia',
          hanzi: '虾',
          emoji: '🦐',
          label: 'ia',
          pinyin: 'xiā',
          description: { en: 'Glide from "ee" to "ah". Shrimp = 虾.', fr: 'Glissez de « i » vers « a ». Crevette = 虾.', },
          audio: `${lessonAudioBase}/reference-final-ia.mp3`,
        },
        {
          id: 'final-ie',
          hanzi: '鞋',
          emoji: '👟',
          label: 'ie',
          pinyin: 'xié',
          description: { en: 'Like "yeah". Shoe = 鞋.', fr: 'Comme « yé ». Chaussure = 鞋.', },
          audio: `${lessonAudioBase}/reference-final-ie.mp3`,
        },
        {
          id: 'final-ua',
          hanzi: '瓜',
          emoji: '🍉',
          label: 'ua',
          pinyin: 'guā',
          description: { en: 'Glide from "oo" to "ah". Melon = 瓜.', fr: 'Glissez de « ou » vers « a ». Melon = 瓜.', },
          audio: `${lessonAudioBase}/reference-final-ua.mp3`,
        },
        {
          id: 'final-uo',
          hanzi: '我',
          emoji: '🙋',
          label: 'uo',
          pinyin: 'wǒ',
          description: { en: 'Like "war" without the r. I/me = 我.', fr: 'Comme « ouo ». Moi = 我.', },
          audio: `${lessonAudioBase}/reference-final-uo.mp3`,
        },
        {
          id: 'final-ue',
          hanzi: '月',
          emoji: '🌙',
          label: 'üe',
          pinyin: 'yuè',
          description: { en: 'Round lips for ü, then open to e. Moon = 月.', fr: 'Arrondissez pour ü, puis ouvrez vers e. Lune = 月.', },
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
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
          hanzi: '山',
          emoji: '⛰️',
          label: 'an',
          pinyin: 'shān',
          description: { en: 'Open "ah" + n. Mountain = 山.', fr: '« a » ouvert + n. Montagne = 山.', },
          audio: `${lessonAudioBase}/reference-final-an.mp3`,
        },
        {
          id: 'final-en',
          hanzi: '门',
          emoji: '🚪',
          label: 'en',
          pinyin: 'mén',
          description: { en: 'Relaxed "uh" + n. Door = 门.', fr: '« eu » relâché + n. Porte = 门.', },
          audio: `${lessonAudioBase}/reference-final-en.mp3`,
        },
        {
          id: 'final-in',
          hanzi: '心',
          emoji: '❤️',
          label: 'in',
          pinyin: 'xīn',
          description: { en: '"ee" + n. Heart = 心.', fr: '« i » + n. Cœur = 心.', },
          audio: `${lessonAudioBase}/reference-final-in.mp3`,
        },
        {
          id: 'final-un',
          hanzi: '春',
          emoji: '🌸',
          label: 'un',
          pinyin: 'chūn',
          description: { en: '"oo" + n. Spring = 春.', fr: '« ou » + n. Printemps = 春.', },
          audio: `${lessonAudioBase}/reference-final-un.mp3`,
        },
        {
          id: 'final-uen',
          hanzi: '云',
          emoji: '☁️',
          label: 'ün',
          pinyin: 'yún',
          description: { en: 'Round-lip ü + n. Cloud = 云.', fr: 'ü à lèvres arrondies + n. Nuage = 云.', },
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
          hanzi: '羊',
          emoji: '🐑',
          label: 'ang',
          pinyin: 'yáng',
          description: { en: 'Open "ah" + ng. Sheep = 羊.', fr: '« a » ouvert + ng. Mouton = 羊.', },
          audio: `${lessonAudioBase}/reference-final-ang.mp3`,
        },
        {
          id: 'final-eng',
          hanzi: '灯',
          emoji: '💡',
          label: 'eng',
          pinyin: 'dēng',
          description: { en: 'Relaxed "uh" + ng. Lamp = 灯.', fr: '« eu » relâché + ng. Lampe = 灯.', },
          audio: `${lessonAudioBase}/reference-final-eng.mp3`,
        },
        {
          id: 'final-ing',
          hanzi: '星',
          emoji: '⭐',
          label: 'ing',
          pinyin: 'xīng',
          description: { en: '"ee" + ng. Star = 星.', fr: '« i » + ng. Étoile = 星.', },
          audio: `${lessonAudioBase}/reference-final-ing.mp3`,
        },
        {
          id: 'final-ong',
          hanzi: '龙',
          emoji: '🐉',
          label: 'ong',
          pinyin: 'lóng',
          description: { en: 'Rounded "oo" + ng. Dragon = 龙.', fr: '« ou » arrondi + ng. Dragon = 龙.', },
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
