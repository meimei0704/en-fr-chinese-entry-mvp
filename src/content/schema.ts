import { z } from 'zod'

import type { ContentModuleType, ModulePayload } from '../server/content/types.js'

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
  audioFallback: z.string().optional(),
})

const dialogueSectionSchema = z.object({
  title: localizedFieldSchema,
  lines: z.array(dialogueLineSchema),
})

const sentencePatternExampleSchema = z.object({
  fill: z.string(),
  fillPinyin: z.string(),
  hanzi: z.string(),
  pinyin: z.string(),
  en: z.string(),
  fr: z.string(),
  audio: z.string(),
})

const sentencePatternSchema = z.object({
  id: z.string(),
  pattern: z.string(),
  pinyin: z.string(),
  meaning: localizedFieldSchema,
  audio: z.string().optional(),
  audioFallback: z.string().optional(),
  examples: z.array(sentencePatternExampleSchema).optional(),
})

const vocabularyItemSchema = z.object({
  id: z.string(),
  hanzi: z.string(),
  pinyin: z.string(),
  audio: z.string(),
  audioFallback: z.string().optional(),
  meaning: localizedFieldSchema,
  explanation: bilingualExplanationSchema,
})

const practicePromptSchema = z.object({
  id: z.string(),
  prompt: localizedFieldSchema,
  target: z.string(),
  audio: z.string(),
  audioFallback: z.string().optional(),
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
  practice: lessonPracticeSchema,
  reviewCards: z.array(reviewCardSchema),
}

export const lessonContentSchema = z.object({
  id: z.string(),
  title: localizedFieldSchema,
  scenario: localizedFieldSchema,
  dialogue: dialogueSectionSchema,
  sentencePatterns: z.array(sentencePatternSchema),
  vocabulary: z.array(vocabularyItemSchema),
  practice: lessonPracticeSchema,
  reviewCards: z.array(reviewCardSchema),
})

export function parseModulePayload(moduleType: ContentModuleType, payload: unknown): ModulePayload {
  return modulePayloadSchemas[moduleType].parse(payload) as ModulePayload
}
