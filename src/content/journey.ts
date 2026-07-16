import { course } from './course'
import type { JourneyNode, JourneyNodeId, JourneyStage, LessonContent, LessonId } from './types'

function getLesson(lessonId: LessonId): LessonContent {
  const lesson = course.lessons.find((entry) => entry.id === lessonId)

  if (!lesson) {
    throw new Error(`Missing lesson content for ${lessonId}`)
  }

  return lesson
}

const meetPeopleLesson = getLesson('self-intro')
const restaurantOrderingLesson = getLesson('order-food')
const cityTravelLesson = getLesson('ask-directions')

export const journeyNodeIcons: Record<JourneyNodeId, string> = {
  'airport-arrival': '✈️',
  'city-travel': '🚇',
  'getting-settled': '🏠',
  'meet-people': '👋',
  'restaurant-ordering': '🍜',
  'shopping-and-payment': '🛍️',
  'work-communication': '💼',
  'clinic-and-medicine': '🩺',
}

export const journeyStages: JourneyStage[] = [
  {
    id: 'arrival-and-transit',
    title: {
      en: 'Arrival & transit',
      fr: 'Arrivée & transit',
    },
    summary: {
      en: 'Land smoothly and move through your first city transfer.',
      fr: 'Atterrir sereinement et gérer son premier trajet en ville.',
    },
  },
  {
    id: 'settling-in',
    title: {
      en: 'Settling in',
      fr: 'Installation',
    },
    summary: {
      en: 'Handle the basics that make the first week easier.',
      fr: 'Gérer les bases qui rendent la première semaine plus simple.',
    },
  },
  {
    id: 'daily-life',
    title: {
      en: 'Daily life',
      fr: 'Vie quotidienne',
    },
    summary: {
      en: 'Build confidence for friendly conversations and errands.',
      fr: 'Prendre confiance pour les échanges amicaux et les petites démarches.',
    },
  },
  {
    id: 'work-and-study',
    title: {
      en: 'Work & study',
      fr: 'Travail & études',
    },
    summary: {
      en: 'Preview the language needed for school and office moments.',
      fr: 'Prévisualiser le langage utile pour les moments d’étude et de travail.',
    },
  },
  {
    id: 'health-and-emergency',
    title: {
      en: 'Health & emergency',
      fr: 'Santé & urgences',
    },
    summary: {
      en: 'Prepare for practical health questions before you need them.',
      fr: 'Se préparer aux questions de santé pratiques avant d’en avoir besoin.',
    },
  },
]

const journeyNodeData: JourneyNode[] = [
  {
    id: 'airport-arrival',
    stageId: 'arrival-and-transit',
    kind: 'preview',
    title: {
      en: 'Airport arrival',
      fr: 'Arrivée à l’aéroport',
    },
    eyebrow: {
      en: 'Arrival',
      fr: 'Arrivée',
    },
    summary: {
      en: 'Preview immigration, pickup points, and your first airport questions.',
      fr: 'Aperçu de l’immigration, des points de rendez-vous et des premières questions à l’aéroport.',
    },
    previewDetails: {
      phrase: '出口在哪里？',
      pinyin: 'Chūkǒu zài nǎli?',
      meaning: {
        en: 'Where is the exit?',
        fr: 'Où est la sortie ?',
      },
      goal: {
        en: 'Ask about immigration, pickup points, and the right airport exit.',
        fr: 'Demander l’immigration, le point de rendez-vous et la bonne sortie de l’aéroport.',
      },
    },
    pathOrder: 1,
  },
  {
    id: 'city-travel',
    stageId: 'arrival-and-transit',
    kind: 'lesson',
    lessonId: cityTravelLesson.id,
    title: {
      en: 'City travel',
      fr: 'Trajet en ville',
    },
    eyebrow: {
      en: 'Transit',
      fr: 'Trajet',
    },
    summary: cityTravelLesson.scenario,
    pathOrder: 2,
  },
  {
    id: 'getting-settled',
    stageId: 'settling-in',
    kind: 'preview',
    title: {
      en: 'Getting settled',
      fr: 'Prendre ses repères',
    },
    eyebrow: {
      en: 'Settling in',
      fr: 'Installation',
    },
    summary: {
      en: 'Preview housing check-ins, deliveries, and small setup tasks.',
      fr: 'Aperçu des arrivées dans le logement, des livraisons et des petites installations.',
    },
    previewDetails: {
      phrase: '我到了。',
      pinyin: 'Wǒ dàole.',
      meaning: {
        en: 'I’ve arrived.',
        fr: 'Je suis arrivé·e.',
      },
      goal: {
        en: 'Check in, confirm deliveries, and ask for small apartment help.',
        fr: 'Faire le check-in, confirmer les livraisons et demander une petite aide dans le logement.',
      },
    },
    pathOrder: 3,
  },
  {
    id: 'meet-people',
    stageId: 'daily-life',
    kind: 'lesson',
    lessonId: meetPeopleLesson.id,
    title: {
      en: 'Meet people',
      fr: 'Faire connaissance',
    },
    eyebrow: {
      en: 'Connections',
      fr: 'Rencontres',
    },
    summary: meetPeopleLesson.scenario,
    pathOrder: 4,
  },
  {
    id: 'restaurant-ordering',
    stageId: 'daily-life',
    kind: 'lesson',
    lessonId: restaurantOrderingLesson.id,
    title: {
      en: 'Restaurant ordering',
      fr: 'Commander au restaurant',
    },
    eyebrow: {
      en: 'Dining',
      fr: 'Restaurant',
    },
    summary: restaurantOrderingLesson.scenario,
    pathOrder: 5,
  },
  {
    id: 'shopping-and-payment',
    stageId: 'daily-life',
    kind: 'preview',
    title: {
      en: 'Shopping & payment',
      fr: 'Achats & paiement',
    },
    eyebrow: {
      en: 'Errands',
      fr: 'Courses',
    },
    summary: {
      en: 'Preview asking prices, paying digitally, and confirming amounts.',
      fr: 'Aperçu des prix, du paiement numérique et de la vérification des montants.',
    },
    previewDetails: {
      phrase: '多少钱？',
      pinyin: 'Duōshǎo qián?',
      meaning: {
        en: 'How much is it?',
        fr: 'C’est combien ?',
      },
      goal: {
        en: 'Ask prices, confirm totals, and pay by phone with confidence.',
        fr: 'Demander les prix, confirmer les totaux et payer par téléphone avec assurance.',
      },
    },
    pathOrder: 6,
  },
  {
    id: 'work-communication',
    stageId: 'work-and-study',
    kind: 'preview',
    title: {
      en: 'Work communication',
      fr: 'Communication au travail',
    },
    eyebrow: {
      en: 'Work & study',
      fr: 'Travail',
    },
    summary: {
      en: 'Preview short updates, scheduling, and polite office messages.',
      fr: 'Aperçu des courtes mises à jour, de la planification et des messages polis au bureau.',
    },
    previewDetails: {
      phrase: '我马上发。',
      pinyin: 'Wǒ mǎshàng fā.',
      meaning: {
        en: 'I’ll send it right away.',
        fr: 'Je l’envoie tout de suite.',
      },
      goal: {
        en: 'Give short updates, confirm timing, and sound polite at work.',
        fr: 'Donner de courtes mises à jour, confirmer le timing et rester poli au travail.',
      },
    },
    pathOrder: 7,
  },
  {
    id: 'clinic-and-medicine',
    stageId: 'health-and-emergency',
    kind: 'preview',
    title: {
      en: 'Clinic & medicine',
      fr: 'Clinique & médicaments',
    },
    eyebrow: {
      en: 'Health',
      fr: 'Santé',
    },
    summary: {
      en: 'Preview describing symptoms, asking for medicine, and basic clinic help.',
      fr: 'Aperçu de la description des symptômes, de la demande de médicaments et de l’aide en clinique.',
    },
    previewDetails: {
      phrase: '我不舒服。',
      pinyin: 'Wǒ bù shūfu.',
      meaning: {
        en: 'I don’t feel well.',
        fr: 'Je ne me sens pas bien.',
      },
      goal: {
        en: 'Describe simple symptoms and ask for medicine or clinic support.',
        fr: 'Décrire des symptômes simples et demander des médicaments ou de l’aide en clinique.',
      },
    },
    pathOrder: 8,
  },
]

export const journeyNodes = [...journeyNodeData]
