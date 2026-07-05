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
      <section className="hero-card">
        <p className="eyebrow">{copy.selectionPage.eyebrow}</p>
        <h1>{copy.selectionPage.heading}</h1>
        <p className="lede">{copy.selectionPage.lede}</p>

        <LanguageToggle
          selectedLanguage={selectedLanguage}
          onSelect={setSelectedLanguage}
          ariaLabel={copy.languageToggleLabel}
        />

        <button
          type="button"
          className="primary-button"
          onClick={handleStartLearning}
        >
          {copy.selectionPage.startLearning}
        </button>
      </section>
    </main>
  )
}
