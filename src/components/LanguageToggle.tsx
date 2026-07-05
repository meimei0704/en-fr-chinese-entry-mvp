import { languageNames } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'

interface LanguageToggleProps {
  selectedLanguage: ExplanationLanguage
  onSelect: (language: ExplanationLanguage) => void
  ariaLabel?: string
}

export function LanguageToggle({
  selectedLanguage,
  onSelect,
  ariaLabel = 'Explanation language',
}: LanguageToggleProps) {
  return (
    <div className="button-row" role="group" aria-label={ariaLabel}>
      {(Object.entries(languageNames) as [ExplanationLanguage, string][]).map(
        ([language, label]) => (
          <button
            key={language}
            type="button"
            className={
              selectedLanguage === language
                ? 'option-button option-button--selected'
                : 'option-button'
            }
            aria-pressed={selectedLanguage === language}
            onClick={() => onSelect(language)}
          >
            {label}
          </button>
        ),
      )}
    </div>
  )
}
