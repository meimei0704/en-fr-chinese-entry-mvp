import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type { ExplanationLanguage, PinyinReferenceGroup } from '../../content/types'

interface PinyinReferenceSectionProps {
  groups: PinyinReferenceGroup[]
  language: ExplanationLanguage
  eyebrow: string
  heading: string
  summary: string
  playAudioLabel: (label: string) => string
}

export function PinyinReferenceSection({
  groups,
  language,
  eyebrow,
  heading,
  summary,
  playAudioLabel,
}: PinyinReferenceSectionProps) {
  return (
    <section id="pinyin-reference" className="surface-card pinyin-reference-section">
      <div className="pinyin-section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        <p className="muted-text">{summary}</p>
      </div>

      <div className="pinyin-reference-section__groups">
        {groups.map((group) => (
          <article key={group.id} className="pinyin-reference-group">
            <header>
              <h3>{getLocalizedText(group.title, language)}</h3>
              <p className="muted-text">{getLocalizedText(group.summary, language)}</p>
            </header>

            <div className="pinyin-reference-group__items">
              {group.items.map((item) => (
                <article key={item.id} className="study-item pinyin-reference-card">
                  <div>
                    <p className="pinyin-reference-card__label">{getLocalizedText(item.label, language)}</p>
                    <p className="pinyin-line">{item.pinyin}</p>
                  </div>
                  <SpeechButton
                    label={playAudioLabel(item.pinyin)}
                    text={item.pinyin}
                    audioSrc={item.audio}
                  />
                  <p className="muted-text">{getLocalizedText(item.description, language)}</p>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
