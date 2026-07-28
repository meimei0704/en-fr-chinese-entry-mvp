import { z } from 'zod'

import type { ContentModuleType, ModulePayload } from '../server/content/types.js'
import type { LessonContent } from './types.js'

const localizedTextSchema = z.object({
  en: z.string(),
  fr: z.string(),
})

const localizedFieldSchema = z.union([z.string(), localizedTextSchema])
const bilingualExplanationSchema = localizedTextSchema

const dialogueLineSchema = z.object({
  id: z.string(),
  speaker: localizedFieldSchema,
  hanzi: z.string(),
  pinyin: z.string(),
  translation: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
  audio: z.string(),
})

const dialogueSectionSchema = z.object({
  title: localizedFieldSchema,
  lines: z.array(dialogueLineSchema),
})

const sentencePatternSchema = z.object({
  id: z.string(),
  pattern: z.string(),
  meaning: localizedFieldSchema,
  example: z.string(),
  audio: z.string(),
  explanation: bilingualExplanationSchema,
})

const vocabularyItemSchema = z.object({
  id: z.string(),
  hanzi: z.string(),
  pinyin: z.string(),
  audio: z.string(),
  meaning: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
})

const pronunciationTipSchema = z.object({
  id: z.string(),
  focus: localizedFieldSchema,
  audioText: z.string(),
  audio: z.string(),
  tip: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
})

const hanziRecognitionItemSchema = z.object({
  id: z.string(),
  hanzi: z.string(),
  pinyin: z.string(),
  meaning: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
})

const practicePromptSchema = z.object({
  id: z.string(),
  prompt: localizedFieldSchema,
  target: z.string(),
  audio: z.string(),
  explanation: bilingualExplanationSchema,
})

const lessonPracticeSchema = z.object({
  listening: z.array(practicePromptSchema),
  speaking: z.array(practicePromptSchema),
  reading: z.array(practicePromptSchema),
})

const reviewCardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
})

const shortInputPromptSchema = z.object({
  id: z.string(),
  prompt: localizedFieldSchema,
  target: z.string(),
  explanation: bilingualExplanationSchema,
  audio: z.string(),
})

export const lessonMetaPayloadSchema = z.object({
  id: z.string(),
  title: localizedFieldSchema,
  scenario: localizedFieldSchema,
})

const modulePayloadSchemas: Record<ContentModuleType, z.ZodType<unknown>> = {
  lessonMeta: lessonMetaPayloadSchema,
  dialogue: dialogueSectionSchema,
  sentencePatterns: z.array(sentencePatternSchema),
  vocabulary: z.array(vocabularyItemSchema),
  pronunciation: z.array(pronunciationTipSchema),
  hanziRecognition: z.array(hanziRecognitionItemSchema),
  practice: lessonPracticeSchema,
  reviewCards: z.array(reviewCardSchema),
  shortInput: shortInputPromptSchema,
}

export const lessonContentSchema = z.object({
  id: z.string(),
  title: localizedFieldSchema,
  scenario: localizedFieldSchema,
  dialogue: dialogueSectionSchema,
  sentencePatterns: z.array(sentencePatternSchema),
  vocabulary: z.array(vocabularyItemSchema),
  pronunciation: z.array(pronunciationTipSchema),
  hanziRecognition: z.array(hanziRecognitionItemSchema),
  practice: lessonPracticeSchema,
  reviewCards: z.array(reviewCardSchema),
  shortInput: shortInputPromptSchema,
})

export function parseModulePayload(moduleType: ContentModuleType, payload: unknown): ModulePayload {
  return modulePayloadSchemas[moduleType].parse(payload) as ModulePayload
}

export function parseLessonContent(payload: unknown): LessonContent {
  return lessonContentSchema.parse(payload) as LessonContent
}
