import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type {
  ExplanationLanguage,
  PinyinReferenceGroup,
  PinyinReferenceItem,
} from '../../content/types'
import { TonePitchVisual } from './TonePitchVisual'

interface PinyinReferenceSectionProps {
  groups: PinyinReferenceGroup[]
  language: ExplanationLanguage
  playAudioLabel: (label: string) => string
  onReferenceAudioPlay: () => void
}

function referenceCardLabel(item: PinyinReferenceItem, language: ExplanationLanguage): string {
  return item.tone !== undefined ? item.pinyin : getLocalizedText(item.label, language)
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
        {groups.map((group) => {
          const notedItems = group.items.filter((item) => item.note !== undefined)

          return (
            <article key={group.id} className={`pinyin-reference-group pinyin-reference-group--${group.id}`}>
              <header>
                <h2>{getLocalizedText(group.title, language)}</h2>
                {group.summary ? (
                  <p className="muted-text">{getLocalizedText(group.summary, language)}</p>
                ) : null}
              </header>

              <div className="pinyin-reference-group__items">
                {group.items.map((item) => (
                  <article
                    key={item.id}
                    className={`study-item pinyin-reference-card${item.description ? ' pinyin-reference-card--with-description' : ''}`}
                    data-testid="pinyin-card"
                  >
                    <div className="pinyin-reference-card__target">
                      <p className="pinyin-reference-card__phoneme">
                        {referenceCardLabel(item, language)}
                        {item.note ? (
                          <sup
                            className="pinyin-note-marker"
                            aria-label="annotation"
                            aria-hidden="true"
                          >
                            ※
                          </sup>
                        ) : null}
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

              {notedItems.length > 0 ? (
                <ul className="pinyin-reference-group__notes">
                  {notedItems.map((item) => (
                    <li key={item.id} className="pinyin-reference-note">
                      <span className="pinyin-reference-note__marker" aria-hidden="true">
                        ※
                      </span>
                      <span className="pinyin-reference-note__target">
                        {referenceCardLabel(item, language)}
                      </span>
                      <span className="pinyin-reference-note__text">
                        {getLocalizedText(item.note as NonNullable<typeof item.note>, language)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
