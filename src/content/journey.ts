import { course } from './course'
import type { JourneyNode, JourneyNodeId, JourneyStage, LessonContent, LessonId } from './types'

function getLesson(lessonId: LessonId): LessonContent {
  const lesson = course.lessons.find((entry) => entry.id === lessonId)

  if (!lesson) {
    throw new Error(`Missing lesson content for ${lessonId}`)
  }

  return lesson
}

const airportImmigrationLesson = getLesson('self-intro')
const taxiToStayLesson = getLesson('ask-directions')
const hotelCheckInLesson = getLesson('order-food')
const phoneAndPaymentLesson = getLesson('phone-and-payment')
const convenienceStoreRunLesson = getLesson('convenience-store-run')

export const journeyNodeIcons: Record<JourneyNodeId, string> = {
  'airport-immigration': '🛂',
  'taxi-to-stay': '🚕',
  'hotel-check-in': '🏨',
  'phone-and-payment': '📱',
  'convenience-store-run': '🛒',
}

export const journeyStages: JourneyStage[] = [
  {
    id: 'arrival-in-china',
    title: {
      en: 'Arriving in China',
      fr: 'Arriver en Chine',
    },
    summary: {
      en: 'A compact first-day path from immigration to a first small purchase.',
      fr: 'Un parcours compact du premier jour, de l’immigration au premier petit achat.',
    },
  },
]

const journeyNodeData: JourneyNode[] = [
  {
    id: 'airport-immigration',
    stageId: 'arrival-in-china',
    kind: 'lesson',
    lessonId: airportImmigrationLesson.id,
    title: {
      en: 'Airport immigration basics',
      fr: 'Bases de l’immigration à l’aéroport',
    },
    eyebrow: {
      en: 'Immigration',
      fr: 'Immigration',
    },
    summary: airportImmigrationLesson.scenario,
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
]

export const journeyNodes = [...journeyNodeData]
