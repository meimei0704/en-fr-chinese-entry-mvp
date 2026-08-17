import type { LocalizedField } from '../content/types'

export function speakerKey(speaker: string): string {
  return speaker
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')
}

export function speakerKeyFromField(speaker: LocalizedField): string {
  return speakerKey(typeof speaker === 'string' ? speaker : speaker.en)
}
