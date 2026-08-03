import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type { ExplanationLanguage, PinyinReferenceGroup } from '../../content/types'

interface PinyinReferenceSectionProps {
  groups: PinyinReferenceGroup[]
  language: ExplanationLanguage
}

export function PinyinReferenceSection({ groups, language }: PinyinReferenceSectionProps) {
  return (
    <section id="pinyin-reference" className="surface-card pinyin-reference-section">
      <div className="pinyin-section-heading">
        <p className="eyebrow">Lesson 1</p>
        <h2>Reference</h2>
        <p className="muted-text">
          Build a first sound map from initials, finals, and Mandarin tones.
        </p>
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
                    <p className="pinyin-reference-card__label">{item.label}</p>
                    <p className="pinyin-line">{item.pinyin}</p>
                  </div>
                  <SpeechButton
                    label="Play Chinese"
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
