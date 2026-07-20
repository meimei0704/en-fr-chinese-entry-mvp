export const supportedExplanationLanguages = ['en', 'fr'] as const

export type ExplanationLanguage = (typeof supportedExplanationLanguages)[number]

export type LocalizedText = Record<ExplanationLanguage, string>

export type LocalizedField = string | LocalizedText

export type BilingualExplanation = LocalizedText

export type LessonId = 'self-intro' | 'order-food' | 'ask-directions'

export type JourneyStageId = 'arrival-in-china'

export type JourneyNodeId =
  | 'airport-immigration'
  | 'taxi-to-stay'
  | 'hotel-check-in'
  | 'phone-and-payment'
  | 'convenience-store-run'

export type JourneyNodeKind = 'lesson' | 'preview'

export interface DialogueLine {
  id: string
  speaker: LocalizedField
  hanzi: string
  pinyin: string
  translation: LocalizedField
  explanation: BilingualExplanation
  audio: string
}

export interface DialogueSection {
  title: LocalizedField
  lines: DialogueLine[]
}

export interface SentencePattern {
  id: string
  pattern: string
  meaning: LocalizedField
  example: string
  explanation: BilingualExplanation
}

export interface VocabularyItem {
  id: string
  hanzi: string
  pinyin: string
  meaning: LocalizedField
  explanation: BilingualExplanation
}

export interface PronunciationTip {
  id: string
  focus: LocalizedField
  tip: LocalizedField
  explanation: BilingualExplanation
}

export interface HanziRecognitionItem {
  id: string
  hanzi: string
  pinyin: string
  meaning: LocalizedField
  explanation: BilingualExplanation
}

export interface PracticePrompt {
  id: string
  prompt: LocalizedField
  target: string
  explanation: BilingualExplanation
}

export interface LessonPractice {
  listening: PracticePrompt[]
  speaking: PracticePrompt[]
  reading: PracticePrompt[]
}

export interface ReviewCard {
  id: string
  front: string
  back: LocalizedField
  explanation: BilingualExplanation
}

export interface ShortInputPrompt {
  id: string
  prompt: LocalizedField
  target: string
  explanation: BilingualExplanation
  audio: string
}

export interface LessonContent {
  id: LessonId
  title: LocalizedField
  scenario: LocalizedField
  dialogue: DialogueSection
  sentencePatterns: SentencePattern[]
  vocabulary: VocabularyItem[]
  pronunciation: PronunciationTip[]
  hanziRecognition: HanziRecognitionItem[]
  practice: LessonPractice
  reviewCards: ReviewCard[]
  shortInput: ShortInputPrompt
}

export interface CourseContent {
  supportedExplanationLanguages: readonly ExplanationLanguage[]
  estimatedDailyMinutes: number
  lessons: LessonContent[]
}

export interface JourneyStage {
  id: JourneyStageId
  title: LocalizedField
  summary: LocalizedField
}

export interface JourneyNodePreviewDetails {
  phrase: string
  pinyin: string
  meaning: LocalizedField
  goal: LocalizedField
}

export interface JourneyNode {
  /** Stable shared journey node key for downstream progress/review consumers. */
  id: JourneyNodeId
  stageId: JourneyStageId
  kind: JourneyNodeKind
  title: LocalizedField
  eyebrow: LocalizedField
  summary: LocalizedField
  pathOrder: number
  lessonId?: LessonId
  previewDetails?: JourneyNodePreviewDetails
}
