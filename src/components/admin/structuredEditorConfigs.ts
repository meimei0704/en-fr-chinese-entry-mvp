import type {
  PracticePrompt,
  ReviewCard,
  SentencePattern,
  ShortInputPrompt,
  VocabularyItem,
} from '../../content/types.js'

export type StructuredFieldConfig<T extends { id: string }> = {
  key: Extract<keyof T, string>
  label: string
  kind: 'text' | 'localized'
  multiline?: boolean
}

export const sentencePatternFields: readonly StructuredFieldConfig<SentencePattern>[] = [
  { key: 'pattern', label: 'Pattern', kind: 'text' },
  { key: 'meaning', label: 'Meaning', kind: 'localized', multiline: true },
  { key: 'example', label: 'Example', kind: 'text', multiline: true },
  { key: 'audio', label: 'Audio URL', kind: 'text' },
  { key: 'explanation', label: 'Explanation', kind: 'localized', multiline: true },
]

export const vocabularyFields: readonly StructuredFieldConfig<VocabularyItem>[] = [
  { key: 'hanzi', label: 'Hanzi', kind: 'text' },
  { key: 'pinyin', label: 'Pinyin', kind: 'text' },
  { key: 'audio', label: 'Audio URL', kind: 'text' },
  { key: 'meaning', label: 'Meaning', kind: 'localized', multiline: true },
  { key: 'explanation', label: 'Explanation', kind: 'localized', multiline: true },
]

export const reviewCardFields: readonly StructuredFieldConfig<ReviewCard>[] = [
  { key: 'front', label: 'Front', kind: 'text', multiline: true },
  { key: 'back', label: 'Back', kind: 'localized', multiline: true },
  { key: 'explanation', label: 'Explanation', kind: 'localized', multiline: true },
]

export const practiceFields: readonly StructuredFieldConfig<PracticePrompt>[] = [
  { key: 'prompt', label: 'Prompt', kind: 'localized', multiline: true },
  { key: 'target', label: 'Target answer', kind: 'text' },
  { key: 'audio', label: 'Audio URL', kind: 'text' },
  { key: 'explanation', label: 'Explanation', kind: 'localized', multiline: true },
]

export const shortInputFields: readonly StructuredFieldConfig<ShortInputPrompt>[] = [
  { key: 'prompt', label: 'Prompt', kind: 'localized', multiline: true },
  { key: 'target', label: 'Target answer', kind: 'text' },
  { key: 'audio', label: 'Audio URL', kind: 'text' },
  { key: 'explanation', label: 'Explanation', kind: 'localized', multiline: true },
]
