export const supportedExplanationLanguages = ['en', 'fr'] as const

export type ExplanationLanguage = (typeof supportedExplanationLanguages)[number]

export type LocalizedText = Record<ExplanationLanguage, string>

export type LocalizedField = string | LocalizedText

export type BilingualExplanation = LocalizedText

export type LessonId =
  | 'daily-greetings'
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
  | 'small-talk'

export type JourneyStageId = 'arrival-in-china'

export type JourneyNodeId =
  | 'daily-greetings'
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
  | 'small-talk'

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

export interface PracticePrompt {
  id: string
  prompt: LocalizedField
  target: string
  pinyin?: string
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

export interface LessonContent {
  id: LessonId
  title: LocalizedField
  scenario: LocalizedField
  dialogue: DialogueSection
  sentencePatterns: SentencePattern[]
  vocabulary: VocabularyItem[]
  practice: LessonPractice
  reviewCards: ReviewCard[]
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

export type PinyinLessonId =
  | 'pinyin-foundations-1'
  | 'pinyin-sibilants-2'
  | 'pinyin-compound-finals-3'

export type PinyinModuleId = 'reference' | 'practice' | 'shadowing'

export type PinyinModuleKey =
  | 'initials'
  | 'finals'
  | 'tones'
  | 'whole-syllables'

export type PinyinReferenceGroupId =
  | 'tones'
  | 'initials-bilabial'
  | 'initials-alveolar'
  | 'initials-velar'
  | 'initials-palatal'
  | 'initials-retroflex'
  | 'initials-flat-tongue'
  | 'initials-yw'
  | 'finals-simple'
  | 'finals-compound'
  | 'finals-nasal-n'
  | 'finals-nasal-ng'

export interface PinyinReferenceItem {
  id: string
  label: LocalizedField
  pinyin: string
  description?: LocalizedField
  audio: string
  tone?: number
}

export interface PinyinReferenceGroup {
  id: PinyinReferenceGroupId
  title: LocalizedField
  summary: LocalizedField
  items: PinyinReferenceItem[]
}

export interface PinyinWholeSyllable {
  id: string
  bare: string
  pinyin: string
  description?: LocalizedField
  audio: string
}

export interface PinyinLessonContent {
  id: PinyinLessonId
  title: LocalizedField
  summary: LocalizedField
  reference: PinyinReferenceGroup[]
}

export interface PinyinModuleContent {
  id: PinyinModuleKey
  title: LocalizedField
  summary: LocalizedField
  intro?: LocalizedField
  reference: PinyinReferenceGroup[]
  wholeSyllables?: PinyinWholeSyllable[]
}

export interface PinyinCourseContent {
  modules: PinyinModuleContent[]
}

export interface PinyinLessonProgress {
  visited: boolean
  completedSections: PinyinModuleId[]
  shadowingCompletedPromptIds: string[]
  lastVisitedPromptId: string | null
}

export interface PinyinProgress {
  schemaVersion: 4
  visited: boolean
  completedSections: PinyinModuleId[]
  shadowingCompletedPromptIds: string[]
  lastVisitedPromptId: string | null
  moduleProgress: Partial<Record<PinyinModuleKey, PinyinLessonProgress>>
}
