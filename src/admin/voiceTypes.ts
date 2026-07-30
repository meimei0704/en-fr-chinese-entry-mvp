import type { LessonContent } from '../content/types.js'
import type { ContentModuleType } from '../server/content/types.js'

export type VoiceReplacementTargetId =
  | `dialogue:${string}`
  | `sentencePatterns:${string}`
  | `vocabulary:${string}`
  | `pronunciation:${string}`
  | `practice:listening:${string}`
  | `practice:speaking:${string}`
  | `practice:reading:${string}`
  | `shortInput:${string}`

export type VoiceReplacementPracticeSection = 'listening' | 'speaking' | 'reading'

export interface VoiceReplacementTarget {
  id: VoiceReplacementTargetId
  moduleType: Exclude<ContentModuleType, 'lessonMeta' | 'hanziRecognition' | 'reviewCards'>
  itemId: string
  label: string
  text: string
  audio: string
}

export interface VoiceReplacementPatch {
  moduleType: VoiceReplacementTarget['moduleType']
  payload:
    | LessonContent['dialogue']
    | LessonContent['sentencePatterns']
    | LessonContent['vocabulary']
    | LessonContent['pronunciation']
    | LessonContent['practice']
    | LessonContent['shortInput']
}

export interface CreateAdminVoiceSampleProfileInput {
  consentConfirmed: boolean
  sampleName?: string
  sampleAudioUrl?: string
  sampleAudioBase64?: string
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
  }
}

export interface AdminVoiceGenerateResponse {
  audioUrl: string
}
