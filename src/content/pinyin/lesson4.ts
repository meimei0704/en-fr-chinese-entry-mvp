import type {
  PinyinLessonContent,
  ToneGameChoice,
  ToneGameQuestion,
} from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-4'

function spellingQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
  wrongChoiceId: string,
): ToneGameQuestion {
  const choices: ToneGameChoice[] = [
    { id: correctChoiceId, label: correctChoiceId, toneLabel: { en: 'Correct', fr: 'Correct' } },
    { id: wrongChoiceId, label: wrongChoiceId, toneLabel: { en: 'Incorrect', fr: 'Incorrect' } },
  ]
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices,
    correctChoiceId,
    explanation: `The correct spelling is ${correctChoiceId}.`,
  }
}

function sandhiQuestion(
  id: string,
  promptText: string,
  audioFile: string,
  correctChoiceId: string,
): ToneGameQuestion {
  const choices: ToneGameChoice[] = [
    { id: '2-3', label: '2-3', toneLabel: { en: 'Second + Third (sandhi)', fr: 'Deuxième + Troisième (sandhi)' } },
    { id: '3-3', label: '3-3', toneLabel: { en: 'Third + Third (original)', fr: 'Troisième + Troisième (original)' } },
    { id: '4-2', label: '4-2', toneLabel: { en: 'Fourth + Second (bu sandhi)', fr: 'Quatrième + Deuxième (sandhi)' } },
    { id: '1-1', label: '1-1', toneLabel: { en: 'First + First (yi sandhi)', fr: 'Premier + Premier (sandhi)' } },
  ]
  return {
    id,
    promptAudio: `${lessonAudioBase}/${audioFile}`,
    promptText,
    choices,
    correctChoiceId,
  }
}

export const pinyinLesson4: PinyinLessonContent = {
  id: 'pinyin-spelling-rules-4',
  title: {
    en: 'Spelling Rules & Tone Sandhi',
    fr: 'Règles d\'orthographe et sandhi tonal',
  },
  summary: {
    en: 'Learn when ü hides behind j/q/x/y, how abbreviations work, and when tones change in connected speech.',
    fr: 'Apprenez quand ü se cache derrière j/q/x/y, comment fonctionnent les abréviations et quand les tons changent en parole continue.',
  },
  reference: [
    {
      id: 'spelling-u',
      title: {
        en: 'ü Spelling Rules',
        fr: 'Règles d\'orthographe du ü',
      },
      summary: {
        en: 'The ü vowel disappears from pinyin spelling after j, q, x, and y — but the sound stays.',
        fr: 'La voyelle ü disparaît de l\'orthographe pinyin après j, q, x et y — mais le son reste.',
      },
      items: [
        {
          id: 'rule-ju',
          label: 'ju → jü',
          pinyin: 'jū',
          description: {
            en: 'Spelled "ju" but pronounced with rounded ü. j + u always means ü.',
            fr: 'Écrit « ju » mais prononcé avec ü arrondi. j + u signifie toujours ü.',
          },
          audio: `${lessonAudioBase}/reference-spelling-ju.mp3`,
        },
        {
          id: 'rule-qu',
          label: 'qu → qü',
          pinyin: 'qù',
          description: {
            en: 'Spelled "qu" — the dots are omitted after q, x, and y.',
            fr: 'Écrit « qu » — les points sont omis après q, x et y.',
          },
          audio: `${lessonAudioBase}/reference-spelling-qu.mp3`,
        },
        {
          id: 'rule-xu',
          label: 'xu → xü',
          pinyin: 'xué',
          description: {
            en: 'Spelled "xu" — j/q/x/y all trigger hidden ü.',
            fr: 'Écrit « xu » — j/q/x/y déclenchent tous le ü caché.',
          },
          audio: `${lessonAudioBase}/reference-spelling-xu.mp3`,
        },
        {
          id: 'rule-nu-lu',
          label: 'nü vs nu / lü vs lu',
          pinyin: 'nǚ — lǜ',
          description: {
            en: 'After n and l, both u and ü are possible — dots must be shown: nǚ (woman) vs nǔ (effort).',
            fr: 'Après n et l, u et ü sont tous deux possibles — les points doivent être affichés : nǚ (femme) vs nǔ (effort).',
          },
          audio: `${lessonAudioBase}/reference-spelling-nu-lu.mp3`,
        },
      ],
    },
    {
      id: 'spelling-abbrev',
      title: {
        en: 'Abbreviations',
        fr: 'Abréviations',
      },
      summary: {
        en: 'Three common finals are spelled shorter than they sound — learn to read them correctly.',
        fr: 'Trois finales courantes s\'écrivent plus court qu\'elles ne sonnent — apprenez à les lire correctement.',
      },
      items: [
        {
          id: 'rule-iu',
          label: '-iu ← iou',
          pinyin: 'liù',
          description: {
            en: 'Spelled "iu" but pronounced "iou" — the middle "o" is hidden. Still tone-marked on u.',
            fr: 'Écrit « iu » mais prononcé « iou » — le « o » central est caché. Le ton reste sur u.',
          },
          audio: `${lessonAudioBase}/reference-spelling-iu.mp3`,
        },
        {
          id: 'rule-ui',
          label: '-ui ← uei',
          pinyin: 'duì',
          description: {
            en: 'Spelled "ui" but pronounced "uei" — the middle "e" is hidden.',
            fr: 'Écrit « ui » mais prononcé « uei » — le « e » central est caché.',
          },
          audio: `${lessonAudioBase}/reference-spelling-ui.mp3`,
        },
        {
          id: 'rule-un',
          label: '-un ← uen',
          pinyin: 'lùn',
          description: {
            en: 'Spelled "un" but pronounced "uen" — the middle "e" is hidden.',
            fr: 'Écrit « un » mais prononcé « uen » — le « e » central est caché.',
          },
          audio: `${lessonAudioBase}/reference-spelling-un.mp3`,
        },
      ],
    },
    {
      id: 'sandhi-rules',
      title: {
        en: 'Tone Sandhi',
        fr: 'Sandhi tonal',
      },
      summary: {
        en: 'When tones meet, they sometimes change — master the three essential patterns.',
        fr: 'Quand les tons se rencontrent, ils changent parfois — maîtrisez les trois motifs essentiels.',
      },
      items: [
        {
          id: 'rule-3-3',
          label: '3 + 3 → 2 + 3',
          pinyin: 'nǐ hǎo → ní hǎo',
          description: {
            en: 'When two third tones are back-to-back, the first becomes second tone.',
            fr: 'Quand deux troisièmes tons se suivent, le premier devient un deuxième ton.',
          },
          audio: `${lessonAudioBase}/reference-sandhi-3-3.mp3`,
        },
        {
          id: 'rule-bu',
          label: '不 tone change',
          pinyin: 'bù → bú',
          description: {
            en: '不 (bù) becomes bú before another fourth tone: bú shì, bú duì.',
            fr: '不 (bù) devient bú devant un autre quatrième ton : bú shì, bú duì.',
          },
          audio: `${lessonAudioBase}/reference-sandhi-bu.mp3`,
        },
        {
          id: 'rule-yi',
          label: '一 tone change',
          pinyin: 'yī → yí / yì',
          description: {
            en: '一 (yī) becomes yí before fourth tone, yì before other tones: yí gè, yì tiān.',
            fr: '一 (yī) devient yí devant quatrième ton, yì devant les autres tons : yí gè, yì tiān.',
          },
          audio: `${lessonAudioBase}/reference-sandhi-yi.mp3`,
        },
      ],
    },
  ],
  toneGame: {
    title: {
      en: 'Spelling & sandhi challenge',
      fr: 'Défi d\'orthographe et sandhi',
    },
    instructions: {
      en: 'Hear a syllable or phrase — choose the correct pinyin spelling or tone pattern.',
      fr: 'Écoutez une syllabe ou phrase — choisissez l\'orthographe pinyin ou le motif tonal correct.',
    },
    questions: [
      spellingQuestion('spell-q-01', 'xué', 'tone-game-xue-spelling.mp3', 'xué', 'xüé'),
      spellingQuestion('spell-q-02', 'nǚ', 'tone-game-nue-spelling.mp3', 'nǚ', 'nǔ'),
      sandhiQuestion('sandhi-q-01', 'nǐ hǎo', 'tone-game-nihao-sandhi.mp3', '2-3'),
      sandhiQuestion('sandhi-q-02', 'bú shì', 'tone-game-bushi-sandhi.mp3', '4-2'),
      sandhiQuestion('sandhi-q-03', 'yí gè', 'tone-game-yige-sandhi.mp3', '4-2'),
      sandhiQuestion('sandhi-q-04', 'dà xué', 'tone-game-daxue-no-sandhi.mp3', '4-2'),
      spellingQuestion('spell-q-03', 'liù', 'tone-game-liu-spelling.mp3', 'liù', 'liòu'),
      spellingQuestion('spell-q-04', 'duì', 'tone-game-dui-spelling.mp3', 'duì', 'duèi'),
    ],
  },
  shadowing: {
    title: {
      en: 'Shadow rule-driven phrases',
      fr: 'Répéter des phrases avec règles',
    },
    instructions: {
      en: 'Play each prompt, pause, and repeat — apply the spelling and sandhi rules you just learned.',
      fr: 'Lancez chaque phrase, faites pause, puis répétez — appliquez les règles d\'orthographe et de sandhi.',
    },
    prompts: [
      {
        id: 'shadow-ni-hao-2',
        promptText: '你好',
        pinyin: 'nǐ hǎo → ní hǎo',
        meaning: { en: 'Hello (with sandhi).', fr: 'Bonjour (avec sandhi).', },
        audio: `${lessonAudioBase}/shadow-ni-hao-2.mp3`,
      },
      {
        id: 'shadow-bu-ke-qi-2',
        promptText: '不客气',
        pinyin: 'bú kè qì',
        meaning: { en: 'You\'re welcome (bu sandhi).', fr: 'Je vous en prie (sandhi).', },
        audio: `${lessonAudioBase}/shadow-bu-ke-qi-2.mp3`,
      },
      {
        id: 'shadow-yi-ge',
        promptText: '一个',
        pinyin: 'yí gè',
        meaning: { en: 'One (yi sandhi).', fr: 'Un (sandhi).', },
        audio: `${lessonAudioBase}/shadow-yi-ge.mp3`,
      },
      {
        id: 'shadow-chu-qu',
        promptText: '出去',
        pinyin: 'chū qù',
        meaning: { en: 'Go out (ü hidden after q).', fr: 'Sortir (ü caché).', },
        audio: `${lessonAudioBase}/shadow-chu-qu.mp3`,
      },
      {
        id: 'shadow-yu-san',
        promptText: '雨伞',
        pinyin: 'yǔ sǎn',
        meaning: { en: 'Umbrella (sandhi: yǔ sǎn).', fr: 'Parapluie (sandhi).', },
        audio: `${lessonAudioBase}/shadow-yu-san.mp3`,
      },
    ],
  },
}
