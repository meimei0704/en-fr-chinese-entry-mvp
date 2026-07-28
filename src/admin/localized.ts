import { getLocalizedText } from '../content/copy.js'
import type { LocalizedField, LocalizedText } from '../content/types.js'

export function toEditableLocalizedText(value: LocalizedField): LocalizedText {
  if (typeof value === 'string') {
    return {
      en: value,
      fr: value,
    }
  }

  return value
}

export function getEnglishText(value: LocalizedField) {
  return getLocalizedText(value, 'en')
}
