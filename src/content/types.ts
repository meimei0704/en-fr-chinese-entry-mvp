export const supportedExplanationLanguages = ['en', 'fr'] as const

export type ExplanationLanguage = (typeof supportedExplanationLanguages)[number]

export type LocalizedText = Record<ExplanationLanguage, string>

export type LocalizedField = string | LocalizedText

export type BilingualExplanation = LocalizedText

export type LessonId =
  | 'self-intro'
  | 'ask-directions'
  | 'order-food'
  | 'phone-and-payment'
  | 'convenience-store-run'
  | 'restaurant-order'
  | 'metro-ticket'
  | 'pharmacy-help'
  | 'ask-for-help-problem'
  | 'train-station-ticket'

export type JourneyStageId = 'arrival-in-china'

export type JourneyNodeId =
  | 'airport-immigration'
  | 'taxi-to-stay'
  | 'hotel-check-in'
  | 'phone-and-payment'
  | 'convenience-store-run'
  | 'restaurant-order'
  | 'metro-ticket'
  | 'pharmacy-help'
  | 'ask-for-help-problem'
  | 'train-station-ticket'

export type JourneyNodeKind = 'lesson' | 'preview'

export interface DialogueLine {
  id: string
  speaker: LocalizedField
  hanzi: string
  pinyin: string
  translation: LocalizedField
  explanation: BilingualExplanation
  audio: string
  audioFallback?: string
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
  audio: string
  audioFallback?: string
  explanation: BilingualExplanation
}

export interface VocabularyItem {
  id: string
  hanzi: string
  pinyin: string
  audio: string
  audioFallback?: string
  meaning: LocalizedField
  explanation: BilingualExplanation
}

export interface PronunciationTip {
  id: string
  focus: LocalizedField
  audioText: string
  audio: string
  audioFallback?: string
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
  audio: string
  audioFallback?: string
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
  audioFallback?: string
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

export type PinyinLessonId = 'pinyin-foundations-1'

export type PinyinModuleId = 'reference' | 'tone-game' | 'shadowing'

export type PinyinReferenceGroupId = 'initials' | 'finals' | 'tones'

export interface PinyinReferenceItem {
  id: string
  label: string
  pinyin: string
  description: LocalizedField
  audio: string
}

export interface PinyinReferenceGroup {
  id: PinyinReferenceGroupId
  title: LocalizedField
  summary: LocalizedField
  items: PinyinReferenceItem[]
}

export interface ToneGameChoice {
  id: string
  label: string
  toneLabel: string
}

export interface ToneGameQuestion {
  id: string
  promptAudio: string
  promptText: string
  choices: ToneGameChoice[]
  correctChoiceId: string
  explanation?: string
}

export interface PinyinToneGame {
  title: LocalizedField
  instructions: LocalizedField
  questions: ToneGameQuestion[]
}

export interface PinyinShadowingPrompt {
  id: string
  promptText: string
  pinyin: string
  meaning: LocalizedField
  audio: string
}

export interface PinyinShadowing {
  title: LocalizedField
  instructions: LocalizedField
  prompts: PinyinShadowingPrompt[]
}

export interface PinyinLessonContent {
  id: PinyinLessonId
  title: LocalizedField
  summary: LocalizedField
  reference: PinyinReferenceGroup[]
  toneGame: PinyinToneGame
  shadowing: PinyinShadowing
}

export interface PinyinCourseContent {
  lesson: PinyinLessonContent
}

export interface PinyinProgress {
  schemaVersion: 1
  visited: boolean
  completedSections: PinyinModuleId[]
  toneGameLastScore: number | null
  toneGameBestScore: number | null
  shadowingCompletedPromptIds: string[]
  lastVisitedPromptId: string | null
}
