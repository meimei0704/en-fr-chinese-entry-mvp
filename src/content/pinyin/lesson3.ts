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
          pinyin: 'ai',
          description: { en: 'Like "eye".', fr: 'Comme « aïe ».', },
          audio: `${lessonAudioBase}/reference-final-ai.mp3`,
        },
        {
          id: 'final-ei',
          hanzi: '嘿',
          emoji: '👋',
          label: 'ei',
          pinyin: 'ei',
          description: { en: 'Like "ay" in "say".', fr: 'Comme « eille ».', },
          audio: `${lessonAudioBase}/reference-final-ei.mp3`,
        },
        {
          id: 'final-ao',
          hanzi: '好',
          emoji: '👍',
          label: 'ao',
          pinyin: 'ao',
          description: { en: 'Like "ow" in "now".', fr: 'Comme « a-o ».', },
          audio: `${lessonAudioBase}/reference-final-ao.mp3`,
        },
        {
          id: 'final-ou',
          hanzi: '欧',
          emoji: '🌍',
          label: 'ou',
          pinyin: 'ou',
          description: { en: 'Like "oh" with rounded lips.', fr: 'Comme « o » avec lèvres arrondies.', },
          audio: `${lessonAudioBase}/reference-final-ou.mp3`,
        },
        {
          id: 'final-ia',
          hanzi: '呀',
          emoji: '😲',
          label: 'ia',
          pinyin: 'ia',
          description: { en: 'Glide from "ee" to "ah".', fr: 'Glissez de « i » vers « a ».', },
          audio: `${lessonAudioBase}/reference-final-ia.mp3`,
        },
        {
          id: 'final-ie',
          hanzi: '叶',
          emoji: '🍃',
          label: 'ie',
          pinyin: 'ie',
          description: { en: 'Like "yeah".', fr: 'Comme « yé ».', },
          audio: `${lessonAudioBase}/reference-final-ie.mp3`,
        },
        {
          id: 'final-ua',
          hanzi: '瓜',
          emoji: '🍉',
          label: 'ua',
          pinyin: 'ua',
          description: { en: 'Glide from "oo" to "ah".', fr: 'Glissez de « ou » vers « a ».', },
          audio: `${lessonAudioBase}/reference-final-ua.mp3`,
        },
        {
          id: 'final-uo',
          hanzi: '我',
          emoji: '🙋',
          label: 'uo',
          pinyin: 'uo',
          description: { en: 'Like "war" without the r.', fr: 'Comme « ouo ».', },
          audio: `${lessonAudioBase}/reference-final-uo.mp3`,
        },
        {
          id: 'final-ue',
          hanzi: '月',
          emoji: '🌙',
          label: 'üe',
          pinyin: 'üe',
          description: { en: 'Round lips for ü, then open to e.', fr: 'Arrondissez pour ü, puis ouvrez vers e.', },
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
          hanzi: '安',
          emoji: '🛡️',
          label: 'an',
          pinyin: 'an',
          description: { en: 'Open "ah" + n.', fr: '« a » ouvert + n.', },
          audio: `${lessonAudioBase}/reference-final-an.mp3`,
        },
        {
          id: 'final-en',
          hanzi: '恩',
          emoji: '🙏',
          label: 'en',
          pinyin: 'en',
          description: { en: 'Relaxed "uh" + n.', fr: '« eu » relâché + n.', },
          audio: `${lessonAudioBase}/reference-final-en.mp3`,
        },
        {
          id: 'final-in',
          hanzi: '音',
          emoji: '🎵',
          label: 'in',
          pinyin: 'in',
          description: { en: '"ee" + n.', fr: '« i » + n.', },
          audio: `${lessonAudioBase}/reference-final-in.mp3`,
        },
        {
          id: 'final-un',
          hanzi: '温',
          emoji: '🌡️',
          label: 'un',
          pinyin: 'un',
          description: { en: '"oo" + n.', fr: '« ou » + n.', },
          audio: `${lessonAudioBase}/reference-final-un.mp3`,
        },
        {
          id: 'final-uen',
          hanzi: '云',
          emoji: '☁️',
          label: 'ün',
          pinyin: 'ün',
          description: { en: 'Round-lip ü + n.', fr: 'ü à lèvres arrondies + n.', },
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
          hanzi: '昂',
          emoji: '🆙',
          label: 'ang',
          pinyin: 'ang',
          description: { en: 'Open "ah" + ng.', fr: '« a » ouvert + ng.', },
          audio: `${lessonAudioBase}/reference-final-ang.mp3`,
        },
        {
          id: 'final-eng',
          hanzi: '灯',
          emoji: '💡',
          label: 'eng',
          pinyin: 'eng',
          description: { en: 'Relaxed "uh" + ng.', fr: '« eu » relâché + ng.', },
          audio: `${lessonAudioBase}/reference-final-eng.mp3`,
        },
        {
          id: 'final-ing',
          hanzi: '英',
          emoji: '🇬🇧',
          label: 'ing',
          pinyin: 'ing',
          description: { en: '"ee" + ng.', fr: '« i » + ng.', },
          audio: `${lessonAudioBase}/reference-final-ing.mp3`,
        },
        {
          id: 'final-ong',
          hanzi: '龙',
          emoji: '🐉',
          label: 'ong',
          pinyin: 'ong',
          description: { en: 'Rounded "oo" + ng.', fr: '« ou » arrondi + ng.', },
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
