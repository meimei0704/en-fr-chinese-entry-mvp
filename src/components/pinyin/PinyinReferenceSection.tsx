import { Fragment } from 'react'
import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type {
  ExplanationLanguage,
  PinyinReferenceGroup,
  PinyinReferenceItem,
} from '../../content/types'
import { TonePitchVisual } from './TonePitchVisual'
import { PinyinNoteMark } from './PinyinNoteMark'

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
        {groups.map((group) => (
          <article key={group.id} className={`pinyin-reference-group pinyin-reference-group--${group.id}`}>
            <header>
              <h2>{getLocalizedText(group.title, language)}</h2>
              {group.summary ? (
                <p className="muted-text">{getLocalizedText(group.summary, language)}</p>
              ) : null}
            </header>

            <div className="pinyin-reference-group__items">
              {group.items.map((item) => (
                <Fragment key={item.id}>
                  <article
                    className={`study-item pinyin-reference-card${item.description ? ' pinyin-reference-card--with-description' : ''}`}
                    data-testid="pinyin-card"
                  >
                    <div className="pinyin-reference-card__target">
                      <p className="pinyin-reference-card__phoneme">
                        {referenceCardLabel(item, language)}
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
                  {item.note ? (
                    <aside
                      className="pinyin-reference-note"
                      data-testid="pinyin-note"
                      aria-label={`${referenceCardLabel(item, language)} annotation`}
                    >
                      <p className="pinyin-reference-note__marker" aria-hidden="true">
                        <PinyinNoteMark />
                      </p>
                      <p className="pinyin-reference-note__text">
                        {getLocalizedText(item.note, language)}
                      </p>
                    </aside>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
