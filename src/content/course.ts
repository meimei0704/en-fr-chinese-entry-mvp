import { askDirectionsLesson } from './lessons/askDirections'
import { convenienceStoreRunLesson } from './lessons/convenienceStoreRun'
import { orderFoodLesson } from './lessons/orderFood'
import { phoneAndPaymentLesson } from './lessons/phoneAndPayment'
import { selfIntroLesson } from './lessons/selfIntro'
import {
  supportedExplanationLanguages,
  type CourseContent,
} from './types'

export const course: CourseContent = {
  supportedExplanationLanguages,
  estimatedDailyMinutes: 10,
  lessons: [
    selfIntroLesson,
    askDirectionsLesson,
    orderFoodLesson,
    phoneAndPaymentLesson,
    convenienceStoreRunLesson,
  ],
}
