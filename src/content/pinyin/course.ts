import { pinyinLesson1 } from './lesson1.js'
import { pinyinLesson2 } from './lesson2.js'
import { pinyinLesson3 } from './lesson3.js'
import { pinyinLesson4 } from './lesson4.js'
import type { PinyinCourseContent } from '../types.js'

export const pinyinCourse: PinyinCourseContent = {
  lessons: [pinyinLesson1, pinyinLesson2, pinyinLesson3, pinyinLesson4],
}
