import { getUiCopy } from '../content/copy'
import type { BilingualExplanation, ExplanationLanguage } from '../content/types'

interface ExplanationBlockProps {
  explanation: BilingualExplanation
  language: ExplanationLanguage
  label?: string
  collapsible?: boolean
}

export function ExplanationBlock({
  explanation,
  language,
  label,
  collapsible = false,
}: ExplanationBlockProps) {
  const resolvedLabel = label ?? getUiCopy(language).common.explanation

  if (collapsible) {
    return (
      <details className="explanation-block explanation-block--collapsible">
        <summary>{resolvedLabel}</summary>
        <span>{explanation[language]}</span>
      </details>
    )
  }

  return (
    <p className="explanation-block">
      <strong>{resolvedLabel}: </strong>
      <span>{explanation[language]}</span>
    </p>
  )
}
