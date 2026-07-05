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
    <div style={{ display: 'grid', gap: '1rem' }}>
      {lines.map((line) => (
        <article
          key={line.id}
          style={{
            padding: '1rem',
            borderRadius: '1rem',
            background: '#f8fafc',
            border: '1px solid #dbeafe',
          }}
        >
          <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>
            {copy.lessonPage.speakerPrefix} {getLocalizedText(line.speaker, language)}
          </p>
          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{line.hanzi}</p>
          <p style={{ margin: '0.25rem 0 0', color: '#1d4ed8' }}>{line.pinyin}</p>
          <p style={{ margin: '0.5rem 0 0' }}>{getLocalizedText(line.translation, language)}</p>
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
