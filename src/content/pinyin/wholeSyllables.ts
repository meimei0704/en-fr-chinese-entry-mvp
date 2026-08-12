import type { PinyinWholeSyllable } from '../types.js'

const audioBase = '/audio/pinyin/whole-syllables'

export const pinyinWholeSyllables: PinyinWholeSyllable[] = [
  {
    id: 'whole-zhi',
    bare: 'zhi',
    pinyin: 'zhī',
    description: {
      en: 'zhi: retroflex zh with an i, like "jr" with a curled tongue.',
      fr: 'zhi : rétroflexe zh avec un i, comme « dj » avec la langue recourbée.',
    },
    audio: `${audioBase}/reference-whole-zhi.mp3`,
  },
  {
    id: 'whole-chi',
    bare: 'chi',
    pinyin: 'chī',
    description: {
      en: 'chi: aspirated retroflex; hold the whole syllable high and level.',
      fr: 'chi : rétroflexe aspirée ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-chi.mp3`,
  },
  {
    id: 'whole-shi',
    bare: 'shi',
    pinyin: 'shī',
    description: {
      en: 'shi: retroflex fricative; hold the whole syllable high and level.',
      fr: 'shi : fricative rétroflexe ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-shi.mp3`,
  },
  {
    id: 'whole-ri',
    bare: 'ri',
    pinyin: 'rī',
    description: {
      en: 'ri: voiced retroflex; hold the whole syllable high and level.',
      fr: 'ri : rétroflexe voisée ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-ri.mp3`,
  },
  {
    id: 'whole-zi',
    bare: 'zi',
    pinyin: 'zī',
    description: {
      en: 'zi: unaspirated alveolar; hold the whole syllable high and level.',
      fr: 'zi : alvéolaire non aspirée ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-zi.mp3`,
  },
  {
    id: 'whole-ci',
    bare: 'ci',
    pinyin: 'cī',
    description: {
      en: 'ci: aspirated alveolar; hold the whole syllable high and level.',
      fr: 'ci : alvéolaire aspirée ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-ci.mp3`,
  },
  {
    id: 'whole-si',
    bare: 'si',
    pinyin: 'sī',
    description: {
      en: 'si: alveolar fricative; hold the whole syllable high and level.',
      fr: 'si : fricative alvéolaire ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-si.mp3`,
  },
  {
    id: 'whole-yi',
    bare: 'yi',
    pinyin: 'yī',
    description: {
      en: 'yi: a whole syllable starting with y; hold it high and level.',
      fr: 'yi : syllabe complète commençant par y ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yi.mp3`,
  },
  {
    id: 'whole-wu',
    bare: 'wu',
    pinyin: 'wū',
    description: {
      en: 'wu: a whole syllable starting with w; hold it high and level.',
      fr: 'wu : syllabe complète commençant par w ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-wu.mp3`,
  },
  {
    id: 'whole-yu',
    bare: 'yu',
    pinyin: 'yū',
    description: {
      en: 'yu: the ü vowel written as yu; hold the whole syllable high and level.',
      fr: 'yu : la voyelle ü écrite yu ; tenez la syllabe entière haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yu.mp3`,
  },
  {
    id: 'whole-ye',
    bare: 'ye',
    pinyin: 'yē',
    description: {
      en: 'ye: a whole syllable gliding from y to e; hold it high and level.',
      fr: 'ye : syllabe complète glissant de y à e ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-ye.mp3`,
  },
  {
    id: 'whole-yue',
    bare: 'yue',
    pinyin: 'yuē',
    description: {
      en: 'yue: a whole syllable with the üe final; hold it high and level.',
      fr: 'yue : syllabe complète avec la finale üe ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yue.mp3`,
  },
  {
    id: 'whole-yuan',
    bare: 'yuan',
    pinyin: 'yuān',
    description: {
      en: 'yuan: a whole syllable with the üan final; hold it high and level.',
      fr: 'yuan : syllabe complète avec la finale üan ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yuan.mp3`,
  },
  {
    id: 'whole-yin',
    bare: 'yin',
    pinyin: 'yīn',
    description: {
      en: 'yin: a whole syllable ending in n; hold it high and level.',
      fr: 'yin : syllabe complète se terminant par n ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yin.mp3`,
  },
  {
    id: 'whole-yun',
    bare: 'yun',
    pinyin: 'yūn',
    description: {
      en: 'yun: a whole syllable with the ün final; hold it high and level.',
      fr: 'yun : syllabe complète avec la finale ün ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-yun.mp3`,
  },
  {
    id: 'whole-ying',
    bare: 'ying',
    pinyin: 'yīng',
    description: {
      en: 'ying: a whole syllable ending in ng; hold it high and level.',
      fr: 'ying : syllabe complète se terminant par ng ; tenez-la haute et plate.',
    },
    audio: `${audioBase}/reference-whole-ying.mp3`,
  },
]
