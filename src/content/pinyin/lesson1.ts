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
      id: 'initials-bilabial',
      title: {
        en: 'Bilabial',
        fr: 'Bilabiales',
      },
      summary: {
        en: 'These sounds are made with both the upper and lower lips.',
        fr: 'Ces sons sont produits avec les lèvres supérieure et inférieure.',
      },
      items: [
        {
          id: 'initial-b',
          label: 'b',
          pinyin: 'bā',
          audio: `${lessonAudioBase}/reference-initial-b.mp3`,
        },
        {
          id: 'initial-p',
          label: 'p',
          pinyin: 'pǎo',
          audio: `${lessonAudioBase}/reference-initial-p.mp3`,
        },
        {
          id: 'initial-m',
          label: 'm',
          pinyin: 'mā',
          audio: `${lessonAudioBase}/reference-initial-m.mp3`,
        },
        {
          id: 'initial-f',
          label: 'f',
          pinyin: 'fàn',
          audio: `${lessonAudioBase}/reference-initial-f.mp3`,
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
        en: 'The tip of the tongue touches the upper gum ridge.',
        fr: 'La pointe de la langue touche la gencive située au-dessus des dents.',
      },
      items: [
        {
          id: 'initial-d',
          label: 'd',
          pinyin: 'dàn',
          audio: `${lessonAudioBase}/reference-initial-d.mp3`,
        },
        {
          id: 'initial-t',
          label: 't',
          pinyin: 'tiān',
          audio: `${lessonAudioBase}/reference-initial-t.mp3`,
        },
        {
          id: 'initial-n',
          label: 'n',
          pinyin: 'niú',
          audio: `${lessonAudioBase}/reference-initial-n.mp3`,
        },
        {
          id: 'initial-l',
          label: 'l',
          pinyin: 'liù',
          audio: `${lessonAudioBase}/reference-initial-l.mp3`,
        },
      ],
    },
    {
      id: 'initials-velar',
      title: {
        en: 'Velar',
        fr: 'Vélaires',
      },
      summary: {
        en: 'The back part of the tongue rises toward the soft palate.',
        fr: 'L’arrière de la langue se soulève vers le palais mou.',
      },
      items: [
        {
          id: 'initial-g',
          label: 'g',
          pinyin: 'gē',
          audio: `${lessonAudioBase}/reference-initial-g.mp3`,
        },
        {
          id: 'initial-k',
          label: 'k',
          pinyin: 'kàn',
          audio: `${lessonAudioBase}/reference-initial-k.mp3`,
        },
        {
          id: 'initial-h',
          label: 'h',
          pinyin: 'hǎo',
          audio: `${lessonAudioBase}/reference-initial-h.mp3`,
        },
      ],
    },
    {
      id: 'finals-simple',
      title: {
        en: 'Simple Finals',
        fr: 'Finales simples',
      },
      summary: {
        en: '*Spelling rule for ü: When following j, q, x, the dots are omitted in writing, but we still pronounce it as ü. Examples: ju, qu, xu',
        fr: '*Règle d’orthographe pour ü : après j, q, x, les points sont omis à l’écrit, mais on prononce toujours ü. Exemples : ju, qu, xu',
      },
      items: [
        {
          id: 'final-a',
          label: 'a',
          pinyin: 'ā',
          description: {
            en: 'Open your mouth as wide as possible, lower your jaw.',
            fr: 'Ouvrez la bouche le plus grand possible et abaissez la mâchoire.',
          },
          audio: `${lessonAudioBase}/reference-final-a.mp3`,
        },
        {
          id: 'final-o',
          label: 'o',
          pinyin: 'ō',
          description: {
            en: 'Round your lips into a small circle.',
            fr: 'Arrondissez les lèvres en un petit cercle.',
          },
          audio: `${lessonAudioBase}/reference-final-o.mp3`,
        },
        {
          id: 'final-e',
          label: 'e',
          pinyin: 'ē',
          description: {
            en: 'Stretch your mouth flat sideways, keep your tongue stable.',
            fr: 'Étirez la bouche latéralement, gardez la langue stable.',
          },
          audio: `${lessonAudioBase}/reference-final-e.mp3`,
        },
        {
          id: 'final-i',
          label: 'i',
          pinyin: 'ī',
          description: {
            en: 'Smile slightly, close your upper and lower teeth, tongue rests behind lower front teeth.',
            fr: 'Souriez légèrement, rapprochez les dents supérieures et inférieures, la langue repose derrière les dents de devant inférieures.',
          },
          audio: `${lessonAudioBase}/reference-final-i.mp3`,
        },
        {
          id: 'final-u',
          label: 'u',
          pinyin: 'ū',
          description: {
            en: 'Pout your lips forward tightly, like whistling.',
            fr: 'Avancez les lèvres en les pinçant, comme pour siffler.',
          },
          audio: `${lessonAudioBase}/reference-final-u.mp3`,
        },
        {
          id: 'final-ue',
          label: 'ü',
          pinyin: 'ǖ',
          description: {
            en: 'Same rounded lip shape as u, raise the middle of your tongue a little higher.',
            fr: 'Même arrondi des lèvres que pour u, élevez un peu plus le milieu de la langue.',
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
        en: 'We’ll use the syllable ma to practice the tones, pictured as hiking routes:',
        fr: 'Nous utiliserons la syllabe ma pour pratiquer les tons, représentés comme des itinéraires de randonnée :',
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
            en: 'Flat high level, staying steadily on the mountain peak.',
            fr: 'Niveau élevé et plat, restant stable au sommet de la montagne.',
          },
          audio: `${lessonAudioBase}/reference-tone-1-6470708c.mp3`,
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
            en: 'Steadily climbing uphill, a straight rising pitch.',
            fr: 'Montée régulière, une intonation qui s’élève en ligne droite.',
          },
          audio: `${lessonAudioBase}/reference-tone-2-0d561a45.mp3`,
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
            en: 'Go down into a valley first, then climb back up.',
            fr: 'Descendre d’abord dans une vallée, puis remonter.',
          },
          audio: `${lessonAudioBase}/reference-tone-3-4299a7b1.mp3`,
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
            en: 'Drop sharply down a steep cliff, short and firm.',
            fr: 'Chute brutale le long d’une falaise abrupte, courte et ferme.',
          },
          audio: `${lessonAudioBase}/reference-tone-4-86535390.mp3`,
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
            en: 'Light, brief and unstressed pronunciation.',
            fr: 'Prononciation légère, brève et sans accent tonique.',
          },
          audio: `${lessonAudioBase}/reference-tone-neutral-03195e20.mp3`,
        },
      ],
    },
  ],
}
