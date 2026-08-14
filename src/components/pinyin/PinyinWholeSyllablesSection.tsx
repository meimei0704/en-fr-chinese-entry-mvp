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
          <article key={item.id} className="study-item pinyin-reference-card" data-testid="pinyin-card">
            <div className="pinyin-reference-card__target">
              <p className="pinyin-reference-card__phoneme">
                {item.bare}
              </p>
              <SpeechButton
                label={playAudioLabel(item.bare)}
                text={item.bare}
                audioSrc={item.audio}
                onActivate={onReferenceAudioPlay}
              />
            </div>
            <p className="pinyin-reference-card__description muted-text">
              {getLocalizedText(item.description, language)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
