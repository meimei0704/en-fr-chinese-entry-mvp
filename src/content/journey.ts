import { course } from './course'
import type { JourneyNode, JourneyNodeId, JourneyStage, LessonContent, LessonId } from './types'

function getLesson(lessonId: LessonId): LessonContent {
  const lesson = course.lessons.find((entry) => entry.id === lessonId)

  if (!lesson) {
    throw new Error(`Missing lesson content for ${lessonId}`)
  }

  return lesson
}

const arrivalAtAirportLesson = getLesson('self-intro')
const taxiToStayLesson = getLesson('ask-directions')
const hotelCheckInLesson = getLesson('order-food')
const phoneAndPaymentLesson = getLesson('phone-and-payment')
const convenienceStoreRunLesson = getLesson('convenience-store-run')
const restaurantOrderLesson = getLesson('restaurant-order')
const metroTicketLesson = getLesson('metro-ticket')
const pharmacyHelpLesson = getLesson('pharmacy-help')
const askForHelpProblemLesson = getLesson('ask-for-help-problem')
const trainStationTicketLesson = getLesson('train-station-ticket')

export const journeyNodeIcons: Record<JourneyNodeId, string> = {
  'airport-immigration': '🧳',
  'taxi-to-stay': '🚕',
  'hotel-check-in': '🏨',
  'phone-and-payment': '📱',
  'convenience-store-run': '🛒',
  'restaurant-order': '🍜',
  'metro-ticket': '🚇',
  'pharmacy-help': '💊',
  'ask-for-help-problem': '🆘',
  'train-station-ticket': '🚄',
}

export const journeyStages: JourneyStage[] = [
  {
    id: 'arrival-in-china',
    title: {
      en: 'Arriving in China',
      fr: 'Arriver en Chine',
    },
    summary: {
      en: 'A compact first-day path from airport arrival to a first small purchase, then food, transit, pharmacy, help, and train ticket survival tasks.',
      fr: 'Un parcours compact du premier jour : arrivée à l’aéroport, premier achat, repas, transports, pharmacie, aide et billet de train.',
    },
  },
]

const journeyNodeData: JourneyNode[] = [
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
    pathOrder: 1,
  },
  {
    id: 'taxi-to-stay',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: taxiToStayLesson.id,
    title: {
      en: 'Taxi to your stay',
      fr: 'Taxi vers son logement',
    },
    eyebrow: {
      en: 'Taxi',
      fr: 'Taxi',
    },
    summary: taxiToStayLesson.scenario,
    pathOrder: 2,
  },
  {
    id: 'hotel-check-in',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: hotelCheckInLesson.id,
    title: {
      en: 'Hotel / apartment check-in',
      fr: 'Check-in hôtel / appartement',
    },
    eyebrow: {
      en: 'Check-in',
      fr: 'Check-in',
    },
    summary: hotelCheckInLesson.scenario,
    pathOrder: 3,
  },
  {
    id: 'phone-and-payment',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: phoneAndPaymentLesson.id,
    title: {
      en: 'Phone number & mobile payment',
      fr: 'Téléphone & paiement mobile',
    },
    eyebrow: {
      en: 'Setup',
      fr: 'Installation',
    },
    summary: phoneAndPaymentLesson.scenario,
    pathOrder: 4,
  },
  {
    id: 'convenience-store-run',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: convenienceStoreRunLesson.id,
    title: {
      en: 'First convenience store run',
      fr: 'Première course en supérette',
    },
    eyebrow: {
      en: 'Store',
      fr: 'Supérette',
    },
    summary: convenienceStoreRunLesson.scenario,
    pathOrder: 5,
  },
  {
    id: 'restaurant-order',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: restaurantOrderLesson.id,
    title: {
      en: 'Order a simple meal',
      fr: 'Commander un repas simple',
    },
    eyebrow: {
      en: 'Restaurant',
      fr: 'Restaurant',
    },
    summary: restaurantOrderLesson.scenario,
    pathOrder: 6,
  },
  {
    id: 'metro-ticket',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: metroTicketLesson.id,
    title: {
      en: 'Buy a metro ticket',
      fr: 'Acheter un ticket de métro',
    },
    eyebrow: {
      en: 'Metro',
      fr: 'Métro',
    },
    summary: metroTicketLesson.scenario,
    pathOrder: 7,
  },
  {
    id: 'pharmacy-help',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: pharmacyHelpLesson.id,
    title: {
      en: 'Ask for help at a pharmacy',
      fr: 'Demander de l’aide à la pharmacie',
    },
    eyebrow: {
      en: 'Pharmacy',
      fr: 'Pharmacie',
    },
    summary: pharmacyHelpLesson.scenario,
    pathOrder: 8,
  },
  {
    id: 'ask-for-help-problem',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: askForHelpProblemLesson.id,
    title: {
      en: 'Ask for help with a problem',
      fr: 'Demander de l’aide pour un problème',
    },
    eyebrow: {
      en: 'Help',
      fr: 'Aide',
    },
    summary: askForHelpProblemLesson.scenario,
    pathOrder: 9,
  },
  {
    id: 'train-station-ticket',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: trainStationTicketLesson.id,
    title: {
      en: 'Buy a train station ticket',
      fr: 'Acheter un billet en gare',
    },
    eyebrow: {
      en: 'Train',
      fr: 'Train',
    },
    summary: trainStationTicketLesson.scenario,
    pathOrder: 10,
  },
]

export const journeyNodes = [...journeyNodeData]
