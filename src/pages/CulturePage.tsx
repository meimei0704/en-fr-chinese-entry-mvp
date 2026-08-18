import { useState } from 'react'

import { getLocalizedText, getUiCopy } from '../content/copy'
import { cultureAdvice } from '../content/cultureAdvice'
import type { CultureAdviceItem, CultureAdviceSubItem } from '../content/cultureAdvice'
import type { ExplanationLanguage } from '../content/types'
import { loadProgress } from '../lib/progress'
import { handleTablistKeyDown } from '../lib/tablistKeyboard'

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

export function CulturePage() {
  const language = loadProgress().selectedExplanationLanguage
  const copy = getUiCopy(language).culturePage
  const [selectedSectionId, setSelectedSectionId] = useState(() => cultureAdvice.sections[0].id)

  const selectedSection =
    cultureAdvice.sections.find((section) => section.id === selectedSectionId) ??
    cultureAdvice.sections[0]

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <section className="hero-card pinyin-hero culture-course__hero">
          <h1>{copy.heading}</h1>
          <p className="culture-course__hero-subtitle">{copy.subtitle}</p>
        </section>

        <nav
          role="tablist"
          aria-label={copy.tablistLabel}
          className="pinyin-lesson-tabs"
          onKeyDown={(event) =>
            handleTablistKeyDown(event, {
              tabCount: cultureAdvice.sections.length,
              selectedIndex: Math.max(
                0,
                cultureAdvice.sections.findIndex((section) => section.id === selectedSection.id),
              ),
              onSelect: (index) => setSelectedSectionId(cultureAdvice.sections[index].id),
            })
          }
        >
          {cultureAdvice.sections.map((section, index) => {
            const sectionTitle = getLocalizedText(section.title, language)

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                className={`pinyin-lesson-tab ${
                  section.id === selectedSection.id ? 'pinyin-lesson-tab--selected' : ''
                }`}
                aria-selected={section.id === selectedSection.id}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <span className="pinyin-lesson-tab__badge culture-course__tab-badge" aria-hidden="true">
                  {index + 1}
                </span>
                {sectionTitle}
              </button>
            )
          })}
        </nav>

        <section
          role="tabpanel"
          aria-label={getLocalizedText(selectedSection.title, language)}
          className="surface-card culture-course__panel"
        >
          <h2 className="culture-course__panel-title">
            {getLocalizedText(selectedSection.title, language)}
          </h2>

          {selectedSection.intro ? (
            <p className="culture-advice__intro">{getLocalizedText(selectedSection.intro, language)}</p>
          ) : null}

          {selectedSection.kind === 'numbered' ? (
            <ol className="culture-advice__items culture-advice__items--numbered">
              {selectedSection.items.map((item) => (
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
              {selectedSection.items.map((item) => (
                <li key={item.id} className="culture-advice__item">
                  <CultureAdviceItemContent item={item} language={language} />
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}
