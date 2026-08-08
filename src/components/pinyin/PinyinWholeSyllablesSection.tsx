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
            <div className="pinyin-whole-syllable-card__main">
              <span className="pinyin-whole-syllable-card__emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <p className="pinyin-whole-syllable-card__hanzi">{item.hanzi}</p>
              <p className="pinyin-line">{item.pinyin}</p>
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
