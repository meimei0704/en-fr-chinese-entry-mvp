import { askDirectionsLesson } from './lessons/askDirections'
import { orderFoodLesson } from './lessons/orderFood'
import { selfIntroLesson } from './lessons/selfIntro'
import {
  supportedExplanationLanguages,
  type CourseContent,
} from './types'

export const course: CourseContent = {
  supportedExplanationLanguages,
  estimatedDailyMinutes: 10,
  lessons: [selfIntroLesson, orderFoodLesson, askDirectionsLesson],
}
