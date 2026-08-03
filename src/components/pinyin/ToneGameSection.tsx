import { useState, type FormEvent } from 'react'

import { getLocalizedText } from '../../content/copy'
import type {
  ExplanationLanguage,
  PinyinProgress,
  PinyinToneGame,
} from '../../content/types'
import {
  loadPinyinProgress,
  recordPinyinToneGameScore,
  savePinyinProgress,
} from '../../lib/pinyinProgress'
import { SpeechButton } from '../SpeechButton'

interface ToneGameCopy {
  lessonEyebrow: string
  questionProgress: (current: number, total: number) => string
  playPromptAudio: (current: number) => string
  choicesLegend: string
  submitAnswer: string
  resultHeading: string
  correctRate: string
  completedMessage: string
  keepPracticingMessage: string
}

interface ToneGameSectionProps {
  toneGame: PinyinToneGame
  language: ExplanationLanguage
  copy: ToneGameCopy
  onProgressChange: (progress: PinyinProgress) => void
}

export function ToneGameSection({
  toneGame,
  language,
  copy,
  onProgressChange,
}: ToneGameSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = toneGame.questions
  const currentQuestion = questions[currentQuestionIndex]
  const questionNumber = currentQuestionIndex + 1

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (selectedChoiceId === null) {
      return
    }

    const nextCorrectCount =
      selectedChoiceId === currentQuestion.correctChoiceId ? correctCount + 1 : correctCount
    const isFinalQuestion = currentQuestionIndex === questions.length - 1

    if (isFinalQuestion) {
      const nextProgress = recordPinyinToneGameScore(loadPinyinProgress(), nextCorrectCount)

      savePinyinProgress(nextProgress)
      onProgressChange(nextProgress)
      setCorrectCount(nextCorrectCount)
      setFinished(true)
      return
    }

    setCorrectCount(nextCorrectCount)
    setCurrentQuestionIndex((index) => index + 1)
    setSelectedChoiceId(null)
  }

  return (
    <section id="pinyin-tone-game" className="surface-card pinyin-tone-game-section">
      <div className="pinyin-section-heading">
        <p className="eyebrow">{copy.lessonEyebrow}</p>
        <h2>{getLocalizedText(toneGame.title, language)}</h2>
        <p className="muted-text">{getLocalizedText(toneGame.instructions, language)}</p>
      </div>

      {finished ? (
        <div className="study-item pinyin-tone-game-section__result">
          <h3>{copy.resultHeading}</h3>
          <dl>
            <dt>{copy.correctRate}</dt>
            <dd>
              {correctCount}/{questions.length}
            </dd>
          </dl>
          <p className="muted-text">
            {correctCount >= 6 ? copy.completedMessage : copy.keepPracticingMessage}
          </p>
        </div>
      ) : (
        <form className="pinyin-tone-game-section__form" onSubmit={handleSubmit}>
          <div className="study-item pinyin-tone-game-section__prompt">
            <p className="eyebrow">{copy.questionProgress(questionNumber, questions.length)}</p>
            <SpeechButton
              label={copy.playPromptAudio(questionNumber)}
              text={currentQuestion.promptText}
              audioSrc={currentQuestion.promptAudio}
            />
          </div>

          <fieldset>
            <legend>{copy.choicesLegend}</legend>
            <div className="pinyin-tone-game-section__choices">
              {currentQuestion.choices.map((choice) => (
                <label key={choice.id} className="option-button pinyin-tone-game-section__choice">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={choice.id}
                    checked={selectedChoiceId === choice.id}
                    onChange={() => {
                      setSelectedChoiceId(choice.id)
                    }}
                  />
                  <span className="pinyin-line">{choice.label}</span>
                  <span>{choice.toneLabel}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="primary-button" type="submit" disabled={selectedChoiceId === null}>
            {copy.submitAnswer}
          </button>
        </form>
      )}
    </section>
  )
}
