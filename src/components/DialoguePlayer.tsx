import { getLocalizedText, getUiCopy } from '../content/copy'
import type { DialogueLine, ExplanationLanguage } from '../content/types'
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
          <p className="speaker-chip">
            {copy.lessonPage.speakerPrefix} {getLocalizedText(line.speaker, language)}
          </p>
          <p className="hanzi-display hanzi-display--dialogue">{line.hanzi}</p>
          <p className="pinyin-line">{line.pinyin}</p>
          <p className="muted-text">{getLocalizedText(line.translation, language)}</p>
          <SpeechButton
            label={copy.lessonPage.listenChinese}
            text={line.hanzi}
            audioSrc={line.audio}
          />
          <ExplanationBlock explanation={line.explanation} language={language} />
        </article>
      ))}
    </div>
  )
}
