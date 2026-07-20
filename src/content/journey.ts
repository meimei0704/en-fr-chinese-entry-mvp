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
    kind: 'preview',
    title: {
      en: 'Phone number & mobile payment',
      fr: 'Téléphone & paiement mobile',
    },
    eyebrow: {
      en: 'Setup preview',
      fr: 'Aperçu installation',
    },
    summary: {
      en: 'Preview the next setup task: opening a phone number and getting ready to pay by phone.',
      fr: 'Aperçu de la prochaine étape : ouvrir une ligne téléphonique et se préparer à payer avec son téléphone.',
    },
    previewDetails: {
      phrase: '可以用手机支付吗？',
      pinyin: 'Kěyǐ yòng shǒujī zhīfù ma?',
      meaning: {
        en: 'Can I pay by phone?',
        fr: 'Puis-je payer avec mon téléphone ?',
      },
      goal: {
        en: 'Recognize the phone/payment setup that comes after arrival without entering the full lesson flow yet.',
        fr: 'Reconnaître l’étape téléphone/paiement qui suit l’arrivée, sans entrer encore dans un vrai parcours de leçon.',
      },
    },
    pathOrder: 4,
  },
  {
    id: 'convenience-store-run',
    stageId: 'arrival-in-china',
    kind: 'preview',
    title: {
      en: 'First convenience store run',
      fr: 'Première course en supérette',
    },
    eyebrow: {
      en: 'Errand preview',
      fr: 'Aperçu courses',
    },
    summary: {
      en: 'Preview buying water or a simple item after you have reached your stay.',
      fr: 'Aperçu de l’achat d’eau ou d’un article simple après l’arrivée au logement.',
    },
    previewDetails: {
      phrase: '我要一瓶水。',
      pinyin: 'Wǒ yào yì píng shuǐ.',
      meaning: {
        en: 'I want a bottle of water.',
        fr: 'Je voudrais une bouteille d’eau.',
      },
      goal: {
        en: 'See the first shopping task without adding a new full lesson in this release.',
        fr: 'Voir la première tâche d’achat sans ajouter une nouvelle leçon complète dans cette version.',
      },
    },
    pathOrder: 5,
  },
]

export const journeyNodes = [...journeyNodeData]
