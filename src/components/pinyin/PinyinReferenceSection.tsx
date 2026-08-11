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
                <article key={item.id} className="study-item pinyin-reference-card">
                  <div className="pinyin-reference-card__main">
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
                    <div className="pinyin-reference-card__example">
                      {item.hanzi ? (
                        <span className="pinyin-reference-card__hanzi" aria-hidden="true">
                          {item.hanzi}
                        </span>
                      ) : null}
                      {item.tone !== undefined ? (
                        <>
                          <p className="pinyin-reference-card__example-label">
                            {getLocalizedText(item.label, language)}
                          </p>
                          <TonePitchVisual
                            tone={item.tone}
                            label={getLocalizedText(item.label, language)}
                          />
                        </>
                      ) : (
                        <p className="pinyin-reference-card__example-pinyin">
                          {item.pinyin}
                        </p>
                      )}
                    </div>
                    {item.emoji ? (
                      <div className="pinyin-reference-card__image">
                        <span className="pinyin-reference-card__emoji" aria-hidden="true">
                          {item.emoji}
                        </span>
                      </div>
                    ) : null}
                  </div>
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
