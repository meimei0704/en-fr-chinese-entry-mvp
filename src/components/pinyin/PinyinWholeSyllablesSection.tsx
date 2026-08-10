import { SpeechButton } from '../SpeechButton'
import { getLocalizedText } from '../../content/copy'
import type { ExplanationLanguage, PinyinWholeSyllable } from '../../content/types'

interface PinyinWholeSyllablesSectionProps {
  items: PinyinWholeSyllable[]
  language: ExplanationLanguage
  playAudioLabel: (label: string) => string
  onReferenceAudioPlay: () => void
}

export function PinyinWholeSyllablesSection({
  items,
  language,
  playAudioLabel,
  onReferenceAudioPlay,
}: PinyinWholeSyllablesSectionProps) {
  return (
    <section id="pinyin-whole-syllables" className="surface-card pinyin-reference-section">
      <div className="pinyin-whole-syllables__grid">
        {items.map((item) => (
          <article key={item.id} className="study-item pinyin-reference-card pinyin-whole-syllable-card">
            <div className="pinyin-reference-card__main">
              <div className="pinyin-reference-card__target">
                <p className="pinyin-reference-card__phoneme">
                  {item.pinyin}
                </p>
              </div>
              <div className="pinyin-reference-card__example">
                <span className="pinyin-reference-card__hanzi" aria-hidden="true">
                  {item.hanzi}
                </span>
                <span className="pinyin-reference-card__emoji" aria-hidden="true">
                  {item.emoji}
                </span>
              </div>
            </div>
            <SpeechButton
              label={playAudioLabel(item.pinyin)}
              text={item.pinyin}
              audioSrc={item.audio}
              onActivate={onReferenceAudioPlay}
            />
            <p className="muted-text">{getLocalizedText(item.description, language)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
