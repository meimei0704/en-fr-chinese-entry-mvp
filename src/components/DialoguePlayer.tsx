import { getLocalizedText, getUiCopy } from '../content/copy'
import type { DialogueLine, ExplanationLanguage } from '../content/types'
import { speakerKeyFromField } from './speakerKey'
import { ExplanationBlock } from './ExplanationBlock'
import { SpeechButton } from './SpeechButton'

interface DialoguePlayerProps {
  lines: DialogueLine[]
  language: ExplanationLanguage
}

export function DialoguePlayer({ lines, language }: DialoguePlayerProps) {
  const copy = getUiCopy(language)

  return (
    <div className="dialogue-list">
      {lines.map((line) => (
        <article
          key={line.id}
          className="dialogue-card"
          aria-label={copy.lessonPage.dialogueLineLabel(getLocalizedText(line.speaker, language))}
        >
          <div className="dialogue-card__hanzi-row">
            <p className="hanzi-display hanzi-display--dialogue">{line.hanzi}</p>
            <SpeechButton
              label={copy.lessonPage.listenChinese}
              text={line.hanzi}
              audioSrc={line.audio}
              fallbackAudioSrc={line.audioFallback}
            />
          </div>
          <span
            className="dialogue-card__speaker"
            data-speaker={speakerKeyFromField(line.speaker)}
          >
            {getLocalizedText(line.speaker, language)}
          </span>
          <p className="pinyin-line">{line.pinyin}</p>
          <p className="muted-text">{getLocalizedText(line.translation, language)}</p>
          <ExplanationBlock collapsible explanation={line.explanation} language={language} />
        </article>
      ))}
    </div>
  )
}
