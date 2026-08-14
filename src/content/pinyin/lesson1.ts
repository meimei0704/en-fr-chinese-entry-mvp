import type { PinyinLessonContent } from '../types.js'

const lessonAudioBase = '/audio/pinyin/lesson-1'

export const pinyinLesson1: PinyinLessonContent = {
  id: 'pinyin-foundations-1',
  title: {
    en: 'Pinyin Foundations',
    fr: 'Bases du pinyin',
  },
  summary: {
    en: 'Hear 11 core initials, 6 single finals, and 4 tones before shadowing practical beginner phrases.',
    fr: 'Écoutez 11 initiales essentielles, 6 finales simples et 4 tons avant de répéter des phrases pratiques.',
  },
  reference: [
    {
      id: 'initials',
      title: {
        en: 'Initials',
        fr: 'Initiales',
      },
      summary: {
        en: 'Master crisp consonant sounds — aspirated vs unaspirated pairs at the heart of Mandarin syllables.',
        fr: 'Maîtrisez les consonnes nettes — paires aspirées vs non aspirées au cœur des syllabes mandarines.',
      },
      items: [
        {
          id: 'initial-b',
          label: 'b',
          pinyin: 'bā',
          description: {
            en: 'Unaspirated b, close to a soft English “p”.',
            fr: 'b non aspiré, proche d’un « p » anglais doux.',
          },
          audio: `${lessonAudioBase}/reference-initial-b.mp3`,
        },
        {
          id: 'initial-p',
          label: 'p',
          pinyin: 'pǎo',
          description: {
            en: 'Aspirated p with a clear puff of air.',
            fr: 'p aspiré avec un souffle bien audible.',
          },
          audio: `${lessonAudioBase}/reference-initial-p.mp3`,
        },
        {
          id: 'initial-m',
          label: 'm',
          pinyin: 'mā',
          description: {
            en: 'Nasal m, steady and relaxed.',
            fr: 'm nasal, stable et détendu.',
          },
          audio: `${lessonAudioBase}/reference-initial-m.mp3`,
        },
        {
          id: 'initial-f',
          label: 'f',
          pinyin: 'fàn',
          description: {
            en: 'Light f with the lower lip touching the upper teeth.',
            fr: 'f léger, la lèvre inférieure touchant les dents supérieures.',
          },
          audio: `${lessonAudioBase}/reference-initial-f.mp3`,
        },
        {
          id: 'initial-d',
          label: 'd',
          pinyin: 'dàn',
          description: {
            en: 'Unaspirated d, soft and unvoiced.',
            fr: 'd non aspiré, doux et non voisé.',
          },
          audio: `${lessonAudioBase}/reference-initial-d.mp3`,
        },
        {
          id: 'initial-t',
          label: 't',
          pinyin: 'tiān',
          description: {
            en: 'Aspirated t with a strong puff of air.',
            fr: 't aspiré avec un souffle puissant.',
          },
          audio: `${lessonAudioBase}/reference-initial-t.mp3`,
        },
        {
          id: 'initial-n',
          label: 'n',
          pinyin: 'niú',
          description: {
            en: 'Nasal n, tip of tongue behind upper teeth.',
            fr: 'n nasal, pointe de la langue derrière les dents supérieures.',
          },
          audio: `${lessonAudioBase}/reference-initial-n.mp3`,
        },
        {
          id: 'initial-l',
          label: 'l',
          pinyin: 'liù',
          description: {
            en: 'Light l, similar to English but clearer.',
            fr: 'l léger, similaire à l’anglais mais plus clair.',
          },
          audio: `${lessonAudioBase}/reference-initial-l.mp3`,
        },
        {
          id: 'initial-g',
          label: 'g',
          pinyin: 'gē',
          description: {
            en: 'Unaspirated g, soft like an English “k” without the puff.',
            fr: 'g non aspiré, doux comme un « k » anglais sans souffle.',
          },
          audio: `${lessonAudioBase}/reference-initial-g.mp3`,
        },
        {
          id: 'initial-k',
          label: 'k',
          pinyin: 'kàn',
          description: {
            en: 'Aspirated k with a strong burst of air.',
            fr: 'k aspiré avec une forte explosion d’air.',
          },
          audio: `${lessonAudioBase}/reference-initial-k.mp3`,
        },
        {
          id: 'initial-h',
          label: 'h',
          pinyin: 'hǎo',
          description: {
            en: 'Rough h, harsher than English — like the “ch” in Scottish “loch”.',
            fr: 'h rauque, plus dur qu’en anglais — proche du « ch » allemand.',
          },
          audio: `${lessonAudioBase}/reference-initial-h.mp3`,
        },
      ],
    },
    {
      id: 'finals',
      title: {
        en: 'Finals',
        fr: 'Finales',
      },
      summary: {
        en: 'Anchor syllables with clear single-vowel endings including the special ü.',
        fr: 'Stabilisez les syllabes avec des voyelles simples claires, y compris le ü spécial.',
      },
      items: [
        {
          id: 'final-a',
          label: 'a',
          pinyin: 'ā',
          description: {
            en: 'Open “ah” sound; hold it high and level.',
            fr: 'Son « a » ouvert, tenu haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-final-a.mp3`,
        },
        {
          id: 'final-o',
          label: 'o',
          pinyin: 'ō',
          description: {
            en: 'Rounded “oh” sound; hold it high and level.',
            fr: 'Son « o » arrondi, tenu haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-final-o.mp3`,
        },
        {
          id: 'final-e',
          label: 'e',
          pinyin: 'ē',
          description: {
            en: 'Back vowel, like a relaxed “uh”; hold it high and level.',
            fr: 'Voyelle arrière, proche d’un « eu » relâché, tenue haute et plate.',
          },
          audio: `${lessonAudioBase}/reference-final-e.mp3`,
        },
        {
          id: 'final-i',
          label: 'i',
          pinyin: 'ī',
          description: {
            en: 'Clear “ee” sound; hold it high and level.',
            fr: 'Son « i » clair, tenu haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-final-i.mp3`,
        },
        {
          id: 'final-u',
          label: 'u',
          pinyin: 'ū',
          description: {
            en: 'Rounded “oo” sound with tight lips; hold it high and level.',
            fr: 'Son « ou » arrondi avec les lèvres serrées, tenu haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-final-u.mp3`,
        },
        {
          id: 'final-ue',
          label: 'ü',
          pinyin: 'ǖ',
          description: {
            en: 'Round your lips as if saying “ee”; hold this Mandarin vowel high and level.',
            fr: 'Arrondissez les lèvres comme pour dire « i » et tenez cette voyelle haute et plate.',
          },
          audio: `${lessonAudioBase}/reference-final-ue.mp3`,
        },
      ],
    },
    {
      id: 'tones',
      title: {
        en: 'Tones',
        fr: 'Tons',
      },
      summary: {
        en: 'Practice the four Mandarin pitch shapes on one syllable.',
        fr: 'Entraînez les quatre contours mélodiques du mandarin sur une syllabe.',
      },
      items: [
        {
          id: 'tone-first',
          label: {
            en: 'First tone',
            fr: 'Premier ton',
          },
          pinyin: 'mā',
          tone: 1,
          description: {
            en: 'High and level.',
            fr: 'Haut et plat.',
          },
          audio: `${lessonAudioBase}/reference-tone-1.mp3`,
        },
        {
          id: 'tone-second',
          label: {
            en: 'Second tone',
            fr: 'Deuxième ton',
          },
          pinyin: 'má',
          tone: 2,
          description: {
            en: 'Rising, like asking a short question.',
            fr: 'Montant, comme une courte question.',
          },
          audio: `${lessonAudioBase}/reference-tone-2.mp3`,
        },
        {
          id: 'tone-third',
          label: {
            en: 'Third tone',
            fr: 'Troisième ton',
          },
          pinyin: 'mǎ',
          tone: 3,
          description: {
            en: 'Low dipping tone.',
            fr: 'Ton bas avec un creux.',
          },
          audio: `${lessonAudioBase}/reference-tone-3.mp3`,
        },
        {
          id: 'tone-fourth',
          label: {
            en: 'Fourth tone',
            fr: 'Quatrième ton',
          },
          pinyin: 'mà',
          tone: 4,
          description: {
            en: 'Falling, short, and decisive.',
            fr: 'Descendant, court et décidé.',
          },
          audio: `${lessonAudioBase}/reference-tone-4.mp3`,
        },
        {
          id: 'tone-neutral',
          label: {
            en: 'Neutral tone',
            fr: 'Ton neutre',
          },
          pinyin: 'ma',
          tone: 0,
          description: {
            en: 'Light, short, and unmarked — a soft "ma" with no contour.',
            fr: 'Léger, court et sans marque — un « ma » doux sans contour.',
          },
          audio: `${lessonAudioBase}/reference-tone-neutral.mp3`,
        },
      ],
    },
  ],
}
