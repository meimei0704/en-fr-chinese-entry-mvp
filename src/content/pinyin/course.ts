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
        en: 'Crisp consonant sounds — aspirated vs unaspirated pairs at the heart of Mandarin syllables.',
        fr: 'Consonnes nettes — paires aspirées vs non aspirées au cœur des syllabes mandarines.',
      },
      reference: [
        pickGroup(pinyinLesson1, 'initials'),
        pickGroup(pinyinLesson2, 'initials-retroflex'),
        pickGroup(pinyinLesson2, 'initials-alveolar'),
        pickGroup(pinyinLesson2, 'initials-palatal'),
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
        en: 'Anchor syllables with clear vowels — single finals, compound finals, and nasal endings.',
        fr: 'Stabilisez les syllabes avec des voyelles claires — finales simples, composées et nasales.',
      },
      reference: [
        pickGroup(pinyinLesson1, 'finals'),
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
        en: 'A Whole-read syllable is a special group of 16 syllables in Chinese Pinyin. You read them as a single, complete unit straight away. You do not blend an initial (consonant) and a final (vowel) together letter by letter.',
        fr: 'Une syllabe à lecture complète est un groupe spécial de 16 syllabes du pinyin chinois. Vous les lisez directement comme une unité entière, sans assembler lettre par lettre une initiale (consonne) et une finale (voyelle).',
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
        en: 'These are special rules with tones so practice speaking as much as possible to build up your fluency. Pinyin and intonation is important but not as important as your willingness to express your ideas and the courage to speak and practice in conversations.\n\nExamples of tone changes:\nTwo 3rd tones together: the first third tone changes to a second tone. Example: 你好 nǐ hǎo becomes ní hǎo.',
        fr: 'Ce sont des règles particulières liées aux tons : entraînez-vous à parler le plus possible pour gagner en fluidité. Le pinyin et l’intonation sont importants, mais moins que votre envie d’exprimer vos idées et le courage de parler et de pratiquer en conversation.\n\nExemples de changements de ton :\nDeux tons 3 consécutifs : le premier troisième ton devient un deuxième ton. Exemple : 你好 nǐ hǎo devient ní hǎo.',
      },
      reference: [pickGroup(pinyinLesson1, 'tones')],
    },
  ],
}
