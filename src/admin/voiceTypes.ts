import type { LessonContent, LessonId } from '../content/types.js'
import type { ContentModuleType } from '../server/content/types.js'

export type VoiceAudioLanguage = 'zh-CN'

export type VoiceAudioTargetId =
  | `dialogue:${string}`
  | `sentencePatterns:${string}`
  | `vocabulary:${string}`
  | `practice:listening:${string}`
  | `practice:speaking:${string}`
  | `practice:reading:${string}`

export type VoiceAudioPracticeSection = 'listening' | 'speaking' | 'reading'

export type VoiceAudioModuleType = Exclude<ContentModuleType, 'lessonMeta' | 'reviewCards'>

export interface VoiceAudioTarget {
  targetId: VoiceAudioTargetId
  lessonId: LessonId
  moduleType: VoiceAudioModuleType
  itemId: string
  label: string
  text: string
  originalAudio: string
  currentAudio: string
  language: VoiceAudioLanguage
  storageKey: string
}

export interface VoiceGenerationApprovedResult {
  lessonId: string
  targetId: VoiceAudioTargetId | string
  generatedAudioUrl: string
}

export interface VoiceGenerationBatchPatch {
  moduleType: VoiceAudioModuleType
  payload:
    | LessonContent['dialogue']
    | LessonContent['sentencePatterns']
    | LessonContent['vocabulary']
    | LessonContent['practice']
}

export interface CreateAdminVoiceSampleProfileInput {
  consentConfirmed: boolean
  sampleName?: string
  sampleAudioUrl?: string
  sampleAudioBase64?: string
  sampleAudioContentType?: string
  sampleAudioFilename?: string
}

export interface AdminVoiceSampleProfileResponse {
  profileId: string
}

export interface GenerateAdminVoiceReplacementInput {
  consentConfirmed: boolean
  profileId: string
  text: string
  target: {
    lessonId: string
    targetId: string
    moduleType: string
    originalAudio?: string
    storageKey?: string
    language?: VoiceAudioLanguage
  }
}

export interface AdminVoiceGenerateResponse {
  audioUrl: string
}
