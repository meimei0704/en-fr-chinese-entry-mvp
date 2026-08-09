import { askDirectionsLesson } from './lessons/askDirections.js'
import { askForHelpProblemLesson } from './lessons/askForHelpProblem.js'
import { convenienceStoreRunLesson } from './lessons/convenienceStoreRun.js'
import { dailyGreetingsLesson } from './lessons/dailyGreetings.js'
import { metroTicketLesson } from './lessons/metroTicket.js'
import { orderFoodLesson } from './lessons/orderFood.js'
import { pharmacyHelpLesson } from './lessons/pharmacyHelp.js'
import { phoneAndPaymentLesson } from './lessons/phoneAndPayment.js'
import { restaurantOrderLesson } from './lessons/restaurantOrder.js'
import { selfIntroLesson } from './lessons/selfIntro.js'
import { smallTalkLesson } from './lessons/smallTalk.js'
import { trainStationTicketLesson } from './lessons/trainStationTicket.js'
import {
  supportedExplanationLanguages,
  type CourseContent,
} from './types.js'

export const course: CourseContent = {
  supportedExplanationLanguages,
  estimatedDailyMinutes: 10,
  lessons: [
    dailyGreetingsLesson,
    selfIntroLesson,
    askDirectionsLesson,
    orderFoodLesson,
    phoneAndPaymentLesson,
    restaurantOrderLesson,
    trainStationTicketLesson,
    metroTicketLesson,
    convenienceStoreRunLesson,
    askForHelpProblemLesson,
    pharmacyHelpLesson,
    smallTalkLesson,
  ],
}
