import { useEffect, useMemo, useState } from 'react'

import { getLocalizedText } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'
import type { PracticeChallenge, PracticeChallengeQuestion } from '../lib/practiceChallenge'
import { playPracticeSound } from '../lib/practiceSound'
import { ExplanationBlock } from './ExplanationBlock'
import { SpeechButton } from './SpeechButton'

export interface PracticeChallengeCopy {
  playOptionAudio: (option: string) => string
  answerOptions: string
  correctFeedback: string
  incorrectFeedback: string
  correctAnswer: (answer: string) => string
  nextQuestion: string
  playAgain: string
  answerReview: string
  answerReviewCorrect: string
  answerReviewIncorrect: string
}

interface PracticeChallengeProps {
  buildChallenge: (seed: number) => PracticeChallenge
  language: ExplanationLanguage
  copy: PracticeChallengeCopy
  seed: number
  onComplete: () => void
}

interface AnswerRecord {
  question: PracticeChallengeQuestion
  correct: boolean
}

export function PracticeChallenge({
  buildChallenge,
  language,
  copy,
  seed: initialSeed,
  onComplete,
}: PracticeChallengeProps) {
  const [seed, setSeed] = useState(initialSeed)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [feedback, setFeedback] = useState<{
    correct: boolean
    reveal: string
  } | null>(null)
  const [finished, setFinished] = useState(false)
  const [reported, setReported] = useState(false)

  const challenge = useMemo(() => buildChallenge(seed), [buildChallenge, seed])

  const questions = challenge.questions
  const currentQuestion = questions[questionIndex]
  const isLastQuestion = questionIndex === questions.length - 1

  useEffect(() => {
    if (finished && !reported) {
      setReported(true)
      onComplete()
    }
  }, [finished, reported, onComplete])

  function submitAnswer(isCorrect: boolean, reveal: string) {
    setAnswers((current) => [...current, { question: currentQuestion, correct: isCorrect }])
    setFeedback({ correct: isCorrect, reveal })

    if (isCorrect) {
      playPracticeSound('correct')
    } else {
      playPracticeSound('incorrect')
    }

    if (isLastQuestion) {
      playPracticeSound('complete')
      setFinished(true)
    }
  }

  function advance() {
    if (finished) {
      return
    }
    setFeedback(null)
    setQuestionIndex((index) => index + 1)
  }

  function restart() {
    setSeed(() => Math.floor(Math.random() * 2 ** 31))
    setQuestionIndex(0)
    setAnswers([])
    setFeedback(null)
    setFinished(false)
    setReported(false)
  }

  function handleChoice(question: PracticeChallengeQuestion, optionId: string) {
    if (feedback || finished) {
      return
    }
    const isCorrect = optionId === question.correctOptionId
    const reveal = isCorrect
      ? question.target
      : (question.options.find((option) => option.id === question.correctOptionId)?.label ??
        question.target)
    submitAnswer(isCorrect, reveal)
  }

  if (finished) {
    return (
      <section className="surface-card practice-challenge practice-challenge--result">
        <div className="practice-challenge__result-actions">
          <button type="button" className="primary-button" onClick={restart}>
            {copy.playAgain}
          </button>
        </div>

        <div className="practice-challenge__review">
          <h3>{copy.answerReview}</h3>
          <ul className="practice-challenge__review-list">
            {answers.map((answer, index) => (
              <li
                key={answer.question.id}
                className={`practice-challenge__review-item ${
                  answer.correct
                    ? 'practice-challenge__review-item--correct'
                    : 'practice-challenge__review-item--incorrect'
                }`}
              >
                <span className="practice-challenge__review-mark" aria-hidden="true">
                  {answer.correct ? '✓' : '✗'}
                </span>
                <span className="practice-challenge__review-question">
                  {index + 1}. {getLocalizedText(answer.question.prompt, language)}
                </span>
                <span className="practice-challenge__review-answer">
                  {answer.correct
                    ? copy.answerReviewCorrect
                    : `${copy.answerReviewIncorrect} — ${copy.correctAnswer(answer.question.target)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section className="surface-card practice-challenge">
      <div className="practice-challenge__question">
        <div className="practice-challenge__prompt">
          <p>{getLocalizedText(currentQuestion.prompt, language)}</p>
        </div>

        <div className="practice-challenge__options" role="group" aria-label={copy.answerOptions}>
          {currentQuestion.options.map((option, index) => (
            <div className="practice-challenge__option" key={option.id}>
              <button
                type="button"
                className="option-button"
                onClick={() => handleChoice(currentQuestion, option.id)}
              >
                <span className="option-button__letter" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-button__label">{option.label}</span>
                {option.pinyin ? (
                  <span className="option-button__pinyin" aria-hidden="true">
                    {option.pinyin}
                  </span>
                ) : null}
              </button>
              {option.audio ? (
                <SpeechButton
                  label={copy.playOptionAudio(option.label)}
                  text={option.label}
                  audioSrc={option.audio}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {feedback ? (
        <div
          className={`practice-challenge__feedback practice-challenge__feedback--${
            feedback.correct ? 'correct' : 'incorrect'
          }`}
        >
          <div className="practice-challenge__feedback-body">
            <p className="practice-challenge__feedback-heading">
              {feedback.correct ? copy.correctFeedback : copy.incorrectFeedback}
            </p>
            {!feedback.correct ? (
              <p className="muted-text">{copy.correctAnswer(feedback.reveal)}</p>
            ) : null}
          </div>
          <button type="button" className="primary-button" onClick={advance}>
            {copy.nextQuestion}
          </button>
        </div>
      ) : null}

      <ExplanationBlock explanation={currentQuestion.explanation} language={language} />
    </section>
  )
}
