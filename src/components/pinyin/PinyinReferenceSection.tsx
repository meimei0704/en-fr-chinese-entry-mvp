import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type { ExplanationLanguage, PinyinReferenceGroup } from '../../content/types'
import { TonePitchVisual } from './TonePitchVisual'

interface PinyinReferenceSectionProps {
  groups: PinyinReferenceGroup[]
  language: ExplanationLanguage
  playAudioLabel: (label: string) => string
  onReferenceAudioPlay: () => void
}

export function PinyinReferenceSection({
  groups,
  language,
  playAudioLabel,
  onReferenceAudioPlay,
}: PinyinReferenceSectionProps) {
  return (
    <section id="pinyin-reference" className="surface-card pinyin-reference-section">
      <div className="pinyin-reference-section__groups">
        {groups.map((group) => (
          <article key={group.id} className={`pinyin-reference-group pinyin-reference-group--${group.id}`}>
            <header>
              <h2>{getLocalizedText(group.title, language)}</h2>
              <p className="muted-text">{getLocalizedText(group.summary, language)}</p>
            </header>

            <div className="pinyin-reference-group__items">
              {group.items.map((item) => (
                <article key={item.id} className="study-item pinyin-reference-card" data-testid="pinyin-card">
                  <div className="pinyin-reference-card__target">
                    <p className="pinyin-reference-card__phoneme">
                      {item.tone !== undefined ? item.pinyin : getLocalizedText(item.label, language)}
                    </p>
                    <SpeechButton
                      label={playAudioLabel(item.pinyin)}
                      text={item.pinyin}
                      audioSrc={item.audio}
                      onActivate={onReferenceAudioPlay}
                    />
                  </div>
                  {item.tone !== undefined ? (
                    <div className="pinyin-reference-card__tone">
                      <p className="pinyin-reference-card__tone-label">
                        {getLocalizedText(item.label, language)}
                      </p>
                      <TonePitchVisual
                        tone={item.tone}
                        label={getLocalizedText(item.label, language)}
                      />
                    </div>
                  ) : null}
                  {item.description ? (
                    <p className="pinyin-reference-card__description muted-text">
                      {getLocalizedText(item.description, language)}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
