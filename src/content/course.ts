import { askDirectionsLesson } from './lessons/askDirections'
import { askForHelpProblemLesson } from './lessons/askForHelpProblem'
import { convenienceStoreRunLesson } from './lessons/convenienceStoreRun'
import { metroTicketLesson } from './lessons/metroTicket'
import { orderFoodLesson } from './lessons/orderFood'
import { pharmacyHelpLesson } from './lessons/pharmacyHelp'
import { phoneAndPaymentLesson } from './lessons/phoneAndPayment'
import { restaurantOrderLesson } from './lessons/restaurantOrder'
import { selfIntroLesson } from './lessons/selfIntro'
import { trainStationTicketLesson } from './lessons/trainStationTicket'
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
    restaurantOrderLesson,
    metroTicketLesson,
    pharmacyHelpLesson,
    askForHelpProblemLesson,
    trainStationTicketLesson,
  ],
}
