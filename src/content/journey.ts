import type {
  CourseContent,
  JourneyNode,
  JourneyNodeId,
  JourneyStage,
  LessonContent,
  LessonId,
} from './types'

function getLesson(course: CourseContent, lessonId: LessonId): LessonContent {
  const lesson = course.lessons.find((entry) => entry.id === lessonId)

  if (!lesson) {
    throw new Error(`Missing lesson content for ${lessonId}`)
  }

  return lesson
}

export const journeyNodeIcons: Record<JourneyNodeId, string> = {
  'daily-greetings': '👋',
  'airport-immigration': '✈️',
  'taxi-to-stay': '🚕',
  'hotel-check-in': '🏨',
  'phone-and-payment': '📱',
  'restaurant-order': '🍜',
  'train-station-ticket': '🚄',
  'metro-ticket': '🚇',
  'convenience-store-run': '🛒',
  'ask-for-help-problem': '🆘',
  'pharmacy-help': '💊',
  'small-talk': '💬',
}

export const journeyNodeImages: Record<JourneyNodeId, string> = {
  'daily-greetings': '/images/course/course-01.png',
  'airport-immigration': '/images/course/course-02.png',
  'taxi-to-stay': '/images/course/course-03.png',
  'hotel-check-in': '/images/course/course-04.png',
  'phone-and-payment': '/images/course/course-05.png',
  'restaurant-order': '/images/course/course-06.png',
  'train-station-ticket': '/images/course/course-07.png',
  'metro-ticket': '/images/course/course-08.png',
  'convenience-store-run': '/images/course/course-09.png',
  'ask-for-help-problem': '/images/course/course-10.png',
  'pharmacy-help': '/images/course/course-11.png',
  'small-talk': '/images/course/course-12.png',
}

const journeyStages: JourneyStage[] = [
  {
    id: 'arrival-in-china',
    title: {
      en: 'Arriving in China',
      fr: 'Arriver en Chine',
    },
    summary: {
      en: 'A compact first-day path from hello and airport arrival to a first small purchase, then food, transit, pharmacy, help, and train ticket survival tasks.',
      fr: 'Un parcours compact du premier jour : salutations et arrivée à l’aéroport, premier achat, repas, transports, pharmacie, aide et billet de train.',
    },
  },
]

export function buildJourney(course: CourseContent): {
  stages: JourneyStage[]
  nodes: JourneyNode[]
} {
  const dailyGreetingsLesson = getLesson(course, 'daily-greetings')
  const arrivalAtAirportLesson = getLesson(course, 'self-intro')
  const taxiToStayLesson = getLesson(course, 'ask-directions')
  const hotelCheckInLesson = getLesson(course, 'order-food')
  const phoneAndPaymentLesson = getLesson(course, 'phone-and-payment')
  const restaurantOrderLesson = getLesson(course, 'restaurant-order')
  const trainStationTicketLesson = getLesson(course, 'train-station-ticket')
  const metroTicketLesson = getLesson(course, 'metro-ticket')
  const convenienceStoreRunLesson = getLesson(course, 'convenience-store-run')
  const askForHelpProblemLesson = getLesson(course, 'ask-for-help-problem')
  const pharmacyHelpLesson = getLesson(course, 'pharmacy-help')
  const smallTalkLesson = getLesson(course, 'small-talk')

  const journeyNodeData: JourneyNode[] = [
    {
      id: 'daily-greetings',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: dailyGreetingsLesson.id,
      title: dailyGreetingsLesson.title,
      eyebrow: {
        en: 'Etiquette',
        fr: 'Bonjour',
      },
      summary: dailyGreetingsLesson.scenario,
      pathOrder: 1,
    },
    {
      id: 'airport-immigration',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: arrivalAtAirportLesson.id,
      title: arrivalAtAirportLesson.title,
      eyebrow: {
        en: 'Arrival',
        fr: 'Arrivée',
      },
      summary: arrivalAtAirportLesson.scenario,
      pathOrder: 2,
    },
    {
      id: 'taxi-to-stay',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: taxiToStayLesson.id,
      title: taxiToStayLesson.title,
      eyebrow: {
        en: 'Taxi',
        fr: 'Taxi',
      },
      summary: taxiToStayLesson.scenario,
      pathOrder: 3,
    },
    {
      id: 'hotel-check-in',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: hotelCheckInLesson.id,
      title: hotelCheckInLesson.title,
      eyebrow: {
        en: 'Hotel',
        fr: 'Hôtel',
      },
      summary: hotelCheckInLesson.scenario,
      pathOrder: 4,
    },
    {
      id: 'phone-and-payment',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: phoneAndPaymentLesson.id,
      title: phoneAndPaymentLesson.title,
      eyebrow: {
        en: 'SIM card',
        fr: 'Carte SIM',
      },
      summary: phoneAndPaymentLesson.scenario,
      pathOrder: 5,
    },
    {
      id: 'restaurant-order',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: restaurantOrderLesson.id,
      title: restaurantOrderLesson.title,
      eyebrow: {
        en: 'Restaurant',
        fr: 'Restaurant',
      },
      summary: restaurantOrderLesson.scenario,
      pathOrder: 6,
    },
    {
      id: 'train-station-ticket',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: trainStationTicketLesson.id,
      title: trainStationTicketLesson.title,
      eyebrow: {
        en: 'Train',
        fr: 'Train',
      },
      summary: trainStationTicketLesson.scenario,
      pathOrder: 7,
    },
    {
      id: 'metro-ticket',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: metroTicketLesson.id,
      title: metroTicketLesson.title,
      eyebrow: {
        en: 'Metro',
        fr: 'Métro',
      },
      summary: metroTicketLesson.scenario,
      pathOrder: 8,
    },
    {
      id: 'convenience-store-run',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: convenienceStoreRunLesson.id,
      title: convenienceStoreRunLesson.title,
      eyebrow: {
        en: 'Shopping',
        fr: 'Shopping',
      },
      summary: convenienceStoreRunLesson.scenario,
      pathOrder: 9,
    },
    {
      id: 'ask-for-help-problem',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: askForHelpProblemLesson.id,
      title: askForHelpProblemLesson.title,
      eyebrow: {
        en: 'Help',
        fr: 'Aide',
      },
      summary: askForHelpProblemLesson.scenario,
      pathOrder: 10,
    },
    {
      id: 'pharmacy-help',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: pharmacyHelpLesson.id,
      title: pharmacyHelpLesson.title,
      eyebrow: {
        en: 'Emergency',
        fr: 'Pharmacie',
      },
      summary: pharmacyHelpLesson.scenario,
      pathOrder: 11,
    },
    {
      id: 'small-talk',
      stageId: 'arrival-in-china',
      kind: 'lesson',
      lessonId: smallTalkLesson.id,
      title: smallTalkLesson.title,
      eyebrow: {
        en: 'Small talk',
        fr: 'Conversation',
      },
      summary: smallTalkLesson.scenario,
      pathOrder: 12,
    },
  ]

  return {
    stages: journeyStages,
    nodes: [...journeyNodeData],
  }
}
