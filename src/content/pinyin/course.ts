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
      ],
      toneGame: pinyinLesson2.toneGame,
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
      toneGame: pinyinLesson3.toneGame,
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
      reference: [pickGroup(pinyinLesson1, 'tones')],
      toneGame: pinyinLesson1.toneGame,
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
      reference: [],
      wholeSyllables: pinyinWholeSyllables,
    },
  ],
}
