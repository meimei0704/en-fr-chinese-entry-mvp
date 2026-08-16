import { useState } from 'react'

import { getLocalizedText } from '../content/copy'
import { cultureAdvice } from '../content/cultureAdvice'
import type { CultureAdviceItem, CultureAdviceSubItem } from '../content/cultureAdvice'
import type { ExplanationLanguage } from '../content/types'

type CultureAdviceProps = {
  language: ExplanationLanguage
}

function CultureAdviceItemContent({
  item,
  language,
}: {
  item: CultureAdviceItem | CultureAdviceSubItem
  language: ExplanationLanguage
}) {
  const lead = item.lead ? getLocalizedText(item.lead, language) : null
  const body = item.body ? getLocalizedText(item.body, language) : null

  return (
    <>
      {lead ? <strong>{lead}</strong> : null}
      {lead && body ? ' ' : null}
      {body ? <span className="culture-advice__body">{body}</span> : null}
    </>
  )
}

export function CultureAdvice({ language }: CultureAdviceProps) {
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(() => new Set())
  const title = getLocalizedText(cultureAdvice.title, language)

  function toggleSection(id: string) {
    setOpenSectionIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(id)) {
        nextIds.delete(id)
      } else {
        nextIds.add(id)
      }
      return nextIds
    })
  }

  return (
    <section className="page-grid culture-advice" aria-label={title}>
      <p className="eyebrow culture-advice__label">{title}</p>

      <div className="culture-advice__list">
        {cultureAdvice.sections.map((section) => {
          const isOpen = openSectionIds.has(section.id)
          const headingId = `culture-advice-${section.id}-title`
          const panelId = `culture-advice-${section.id}-panel`
          const sectionTitle = getLocalizedText(section.title, language)
          const intro = section.intro ? getLocalizedText(section.intro, language) : null

          return (
            <section key={section.id} className="culture-advice__card">
              <h3 className="culture-advice__heading">
                <button
                  type="button"
                  id={headingId}
                  className="culture-advice__toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="culture-advice__toggle-text">{sectionTitle}</span>
                  <span className="culture-advice__toggle-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h3>

              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  className="culture-advice__panel"
                >
                  {intro ? <p className="culture-advice__intro">{intro}</p> : null}

                  {section.kind === 'numbered' ? (
                    <ol className="culture-advice__items culture-advice__items--numbered">
                      {section.items.map((item) => (
                        <li key={item.id} className="culture-advice__item">
                          <CultureAdviceItemContent item={item} language={language} />
                          {item.subItems ? (
                            <ul className="culture-advice__subitems">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.id} className="culture-advice__subitem">
                                  <CultureAdviceItemContent item={subItem} language={language} />
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="culture-advice__items">
                      {section.items.map((item) => (
                        <li key={item.id} className="culture-advice__item">
                          <CultureAdviceItemContent item={item} language={language} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </section>
          )
        })}
      </div>
    </section>
  )
}
