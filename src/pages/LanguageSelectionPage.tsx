import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { LanguageToggle } from '../components/LanguageToggle'
import type { ExplanationLanguage } from '../content/types'
import { loadProgress, saveProgress } from '../lib/progress'

export function LanguageSelectionPage() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState<ExplanationLanguage>(
    () => loadProgress().selectedExplanationLanguage,
  )
  const copy = getUiCopy(selectedLanguage)

  function handleStartLearning() {
    saveProgress({
      ...loadProgress(),
      selectedExplanationLanguage: selectedLanguage,
    })
    navigate('/home')
  }

  return (
    <main className="page-shell">
      <section className="hero-card selection-hero">
        <div className="selection-hero__content">
          <p className="eyebrow">{copy.selectionPage.eyebrow}</p>
          <h1>{copy.selectionPage.heading}</h1>
          <p className="lede">{copy.selectionPage.lede}</p>

          <section
            className="surface-card selection-options-card"
            aria-label={copy.selectionPage.languageOptionsLabel}
          >
            <div>
              <p className="eyebrow">{copy.selectionPage.languageOptionsHeading}</p>
              <p className="muted-text">{copy.selectionPage.languageOptionsDescription}</p>
            </div>

            <LanguageToggle
              selectedLanguage={selectedLanguage}
              onSelect={setSelectedLanguage}
              ariaLabel={copy.languageToggleLabel}
            />
          </section>

          <button
            type="button"
            className="primary-button selection-primary-button"
            onClick={handleStartLearning}
          >
            {copy.selectionPage.startLearning}
          </button>
        </div>

        <aside className="selection-identity-card" aria-label={copy.selectionPage.identityLabel}>
          <span className="badge badge--gold">{copy.selectionPage.identityBadge}</span>
          <p className="hanzi-display">中文</p>
          <p className="pinyin-line">zhōngwén</p>
        </aside>
      </section>
    </main>
  )
}
