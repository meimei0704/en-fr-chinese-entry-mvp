import { getLocalizedText, getUiCopy } from '../content/copy'
import type { DialogueLine, ExplanationLanguage } from '../content/types'
import { ExplanationBlock } from './ExplanationBlock'
import { SpeechButton } from './SpeechButton'

interface DialoguePlayerProps {
  lines: DialogueLine[]
  language: ExplanationLanguage
  completedLineIds?: string[]
  onLinePlayed?: (lineId: string) => void
}

export function DialoguePlayer({
  lines,
  language,
  completedLineIds = [],
  onLinePlayed,
}: DialoguePlayerProps) {
  const copy = getUiCopy(language)

  return (
    <div className="dialogue-list">
      {lines.map((line) => {
        const isCompleted = completedLineIds.includes(line.id)

        return (
          <article
            key={line.id}
            className={`dialogue-card${isCompleted ? ' is-completed' : ''}`}
            aria-label={copy.lessonPage.dialogueLineLabel(getLocalizedText(line.speaker, language))}
          >
            <div className="dialogue-card__hanzi-row">
              <p className="hanzi-display hanzi-display--dialogue">{line.hanzi}</p>
              <SpeechButton
                label={copy.lessonPage.listenChinese}
                text={line.hanzi}
                audioSrc={line.audio}
                fallbackAudioSrc={line.audioFallback}
                onActivate={() => onLinePlayed?.(line.id)}
              />
              {isCompleted && (
                <span
                  className="dialogue-card__done"
                  aria-label={copy.lessonPage.dialogueLineCompleted}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                    />
                  </svg>
                </span>
              )}
            </div>
            <span className="dialogue-card__speaker">{getLocalizedText(line.speaker, language)}</span>
            <p className="pinyin-line">{line.pinyin}</p>
            <p className="muted-text">{getLocalizedText(line.translation, language)}</p>
            <ExplanationBlock collapsible explanation={line.explanation} language={language} />
          </article>
        )
      })}
    </div>
  )
}
