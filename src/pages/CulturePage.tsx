import { getLocalizedText, getUiCopy } from '../content/copy'
import { cultureAdvice } from '../content/cultureAdvice'
import type { CultureAdviceItem, CultureAdviceSubItem } from '../content/cultureAdvice'
import type { ExplanationLanguage } from '../content/types'
import { loadProgress } from '../lib/progress'

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

  return (
    <main className="page-shell page-shell--wide pinyin-page">
      <div className="pinyin-page__content">
        <section className="hero-card pinyin-hero culture-course__hero">
          <h1>{copy.heading}</h1>
          <p className="culture-course__hero-subtitle">{copy.subtitle}</p>
        </section>

        <div className="culture-course__sections">
          {cultureAdvice.sections.map((section) => (
            <section
              key={section.id}
              aria-label={getLocalizedText(section.title, language)}
              className="surface-card culture-course__panel"
            >
              <h2 className="culture-course__panel-title">
                {getLocalizedText(section.title, language)}
              </h2>

              {section.intro ? (
                <p className="culture-advice__intro">{getLocalizedText(section.intro, language)}</p>
              ) : null}

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
            </section>
          ))}
        </div>

      </div>
    </main>
  )
}
