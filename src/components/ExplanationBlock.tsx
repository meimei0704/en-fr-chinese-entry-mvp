import { getUiCopy } from '../content/copy'
import type { BilingualExplanation, ExplanationLanguage } from '../content/types'

interface ExplanationBlockProps {
  explanation: BilingualExplanation
  language: ExplanationLanguage
  label?: string
}

export function ExplanationBlock({
  explanation,
  language,
  label,
}: ExplanationBlockProps) {
  const resolvedLabel = label ?? getUiCopy(language).common.explanation

  return (
    <p style={{ margin: '0.5rem 0 0', color: '#334155' }}>
      <strong>{resolvedLabel}: </strong>
      <span>{explanation[language]}</span>
    </p>
  )
}
