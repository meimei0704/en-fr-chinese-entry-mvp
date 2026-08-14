import { pinyinLesson1 } from './lesson1.js'
import { pinyinLesson2 } from './lesson2.js'
import { pinyinLesson3 } from './lesson3.js'
import { pinyinWholeSyllables } from './wholeSyllables.js'
import type { PinyinCourseContent } from '../types.js'

function pickGroup(
  lesson: (typeof pinyinLesson1 | typeof pinyinLesson2 | typeof pinyinLesson3),
  groupId: string,
) {
  const group = lesson.reference.find((g) => g.id === groupId)
  if (!group) {
    throw new Error(`Missing reference group ${groupId}`)
  }
  return group
}

export const pinyinCourse: PinyinCourseContent = {
  modules: [
    {
      id: 'initials',
      title: {
        en: 'Initials',
        fr: 'Initiales',
      },
      summary: {
        en: '',
        fr: '',
      },
      reference: [
        pickGroup(pinyinLesson1, 'initials-bilabial'),
        pickGroup(pinyinLesson1, 'initials-alveolar'),
        pickGroup(pinyinLesson1, 'initials-velar'),
        pickGroup(pinyinLesson2, 'initials-palatal'),
        pickGroup(pinyinLesson2, 'initials-retroflex'),
        pickGroup(pinyinLesson2, 'initials-flat-tongue'),
        pickGroup(pinyinLesson2, 'initials-yw'),
      ],
    },
    {
      id: 'finals',
      title: {
        en: 'Finals',
        fr: 'Finales',
      },
      summary: {
        en: '',
        fr: '',
      },
      reference: [
        pickGroup(pinyinLesson1, 'finals-simple'),
        pickGroup(pinyinLesson3, 'finals-compound'),
        pickGroup(pinyinLesson3, 'finals-nasal-n'),
        pickGroup(pinyinLesson3, 'finals-nasal-ng'),
      ],
    },
    {
      id: 'whole-syllables',
      title: {
        en: 'Whole Syllables',
        fr: 'Syllabes complètes',
      },
      summary: {
        en: 'Sixteen whole syllables (整体认读音节) read as complete units.',
        fr: 'Seize syllabes complètes (整体认读音节) lues comme des unités entières.',
      },
      intro: {
        en: 'Whole-recognition syllables are 16 special Pinyin syllables. Ordinary Pinyin syllables are formed by combining an initial and a final, while these 16 syllables are memorized and pronounced as whole units.\nRead each syllable as one complete sound directly.',
        fr: 'Les syllabes à reconnaissance globale sont 16 syllabes pinyin spéciales. Les syllabes pinyin ordinaires se forment en combinant une initiale et une finale, tandis que ces 16 syllabes se mémorisent et se prononcent comme des unités entières.\nLisez chaque syllabe comme un son complet, directement.',
      },
      reference: [],
      wholeSyllables: pinyinWholeSyllables,
    },
    {
      id: 'tones',
      title: {
        en: 'Tones',
        fr: 'Tons',
      },
      summary: {
        en: 'Master the four Mandarin pitch shapes — plus the neutral tone.',
        fr: 'Maîtrisez les quatre contours mélodiques du mandarin — plus le ton neutre.',
      },
      intro: {
        en: 'Chinese has specific tone shift rules, so speak aloud as often as you can to improve your oral fluency. Pinyin and tones matter, yet they are less critical than your desire to share your thoughts and the confidence to engage in real conversations.\n\nTone Sandhi (tone shift) Example\nWhen two third tones appear consecutively, the first third tone is pronounced as the second tone. E.g. 你好 nǐ hǎo → ní hǎo',
        fr: 'Le chinois a des règles spécifiques de changement de ton : parlez à voix haute aussi souvent que possible pour améliorer votre aisance orale. Le pinyin et les tons comptent, mais ils comptent moins que votre envie de partager vos idées et votre confiance à participer à de vraies conversations.\n\nExemple de tone sandhi (changement de ton)\nLorsque deux troisièmes tons se suivent, le premier troisième ton se prononce comme un deuxième ton. Ex. : 你好 nǐ hǎo → ní hǎo',
      },
      reference: [pickGroup(pinyinLesson1, 'tones')],
    },
  ],
}
