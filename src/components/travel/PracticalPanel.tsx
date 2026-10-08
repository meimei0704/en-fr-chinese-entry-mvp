import { useState } from 'react'

import { getLocalizedText, getUiCopy } from '../../content/copy'
import type { PracticalInfo, TravelFact } from '../../content/travel/types'
import type { ExplanationLanguage } from '../../content/types'
import type { ItineraryDisclaimer, ItineraryPractical } from '../../lib/travel/itinerary'
import { ProvenanceBadge } from './ProvenanceBadge'

interface PracticalPanelProps {
  practical: ItineraryPractical
  disclaimers: ItineraryDisclaimer[]
  language: ExplanationLanguage
}

type SectionKey = keyof PracticalInfo

const SECTION_ORDER: SectionKey[] = [
  'payments',
  'connectivity',
  'etiquette',
  'safety',
  'visaEntry',
  'emergencyNumbers',
]

export function PracticalPanel({ practical, disclaimers, language }: PracticalPanelProps) {
  const copy = getUiCopy(language).travel.result
  const [openSections, setOpenSections] = useState<SectionKey[]>([])

  function toggle(section: SectionKey) {
    setOpenSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    )
  }

  function disclaimerFor(kind: ItineraryDisclaimer['kind']): string {
    return kind === 'visaEntry' ? copy.disclaimer.visaEntry : copy.disclaimer.safety
  }

  return (
    <section className="practical-panel" aria-label={copy.practicalHeading}>
      <h3>{copy.practicalHeading}</h3>
      <p className="practical-panel__disclaimer" role="note">
        {copy.disclaimer.notLegalAdvice}
      </p>

      <div className="practical-panel__sections">
        {SECTION_ORDER.map((section) => {
          const fact = practical.country[section] as TravelFact
          const isOpen = openSections.includes(section)
          const panelId = `practical-panel-${section}`
          const headingId = `${panelId}-heading`
          const sectionDisclaimers = disclaimers.filter(
            (disclaimer) => disclaimer.kind === section,
          )

          return (
            <div className="practical-panel__section" key={section}>
              <h4 className="practical-panel__heading">
                <button
                  type="button"
                  id={headingId}
                  className={`practical-panel__trigger${
                    isOpen ? ' practical-panel__trigger--open' : ''
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(section)}
                >
                  {copy.practicalSections[section]}
                </button>
              </h4>
              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  className="practical-panel__content"
                >
                  <p>{getLocalizedText(fact.title, language)}</p>
                  {sectionDisclaimers.map((disclaimer) => (
                    <p key={disclaimer.kind} className="practical-panel__legal-note">
                      {disclaimerFor(disclaimer.kind)}
                    </p>
                  ))}
                  <ProvenanceBadge fact={fact} language={language} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
