import { useEffect, useMemo, useState } from 'react'

import { getLocalizedText } from '../content/copy'
import type { ExplanationLanguage, LessonContent } from '../content/types'
import {
  buildPracticeChallenge,
  computeRating,
  pointsForCorrect,
  type PracticeChallengeQuestion,
} from '../lib/practiceChallenge'
import { playPracticeSound } from '../lib/practiceSound'
import { ExplanationBlock } from './ExplanationBlock'
import { SpeechButton } from './SpeechButton'

export interface PracticeChallengeCopy {
  scoreLabel: string
  streakLabel: string
  livesLabel: string
  questionProgress: (current: number, total: number) => string
  playPromptAudio: (current: number) => string
  fluentOption: string
  needsPracticeOption: string
  showMeOption: string
  correctFeedback: string
  pointsGained: (points: number) => string
  incorrectFeedback: string
  correctAnswer: (answer: string) => string
  nextQuestion: string
  resultHeading: string
  finalScore: (score: number) => string
  ratingLabel: string
  ratingValue: (rating: string) => string
  outOfLivesMessage: string
  playAgain: string
  encouragement: (rating: string) => string
  answerReview: string
  answerReviewCorrect: string
  answerReviewIncorrect: string
}

interface PracticeChallengeProps {
  lesson: LessonContent
  language: ExplanationLanguage
  copy: PracticeChallengeCopy
  seed: number
  onComplete: () => void
}

interface AnswerRecord {
  question: PracticeChallengeQuestion
  correct: boolean
}

const startingLives = 3

export function PracticeChallenge({
  lesson,
  language,
  copy,
  seed: initialSeed,
  onComplete,
}: PracticeChallengeProps) {
  const [seed, setSeed] = useState(initialSeed)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(startingLives)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [feedback, setFeedback] = useState<{
    correct: boolean
    points: number
    reveal: string
  } | null>(null)
  const [finished, setFinished] = useState(false)
  const [reported, setReported] = useState(false)

  const challenge = useMemo(
    () => buildPracticeChallenge(lesson, language, 5, seed),
    [lesson, language, seed],
  )

  const questions = challenge.questions
  const currentQuestion = questions[questionIndex]
  const questionNumber = questionIndex + 1
  const isLastQuestion = questionIndex === questions.length - 1
  const rating = computeRating(score, challenge.maxScore)

  useEffect(() => {
    if (finished && !reported) {
      setReported(true)
      onComplete()
    }
  }, [finished, reported, onComplete])

  function submitAnswer(isCorrect: boolean, reveal: string) {
    const gained = isCorrect ? pointsForCorrect(streak) : 0
    const nextStreak = isCorrect ? streak + 1 : 0
    const nextLives = isCorrect ? lives : lives - 1
    const nextScore = score + gained

    setScore(nextScore)
    setStreak(nextStreak)
    setLives(nextLives)
    setAnswers((current) => [...current, { question: currentQuestion, correct: isCorrect }])
    setFeedback({ correct: isCorrect, points: gained, reveal })

    if (isCorrect && nextStreak >= 3) {
      playPracticeSound('streak')
    } else if (isCorrect) {
      playPracticeSound('correct')
    } else {
      playPracticeSound('incorrect')
    }

    if (isLastQuestion || nextLives <= 0) {
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
    setScore(0)
    setStreak(0)
    setLives(startingLives)
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

  function handleSelfRating(question: PracticeChallengeQuestion, ratingId: string) {
    if (feedback || finished) {
      return
    }

    submitAnswer(ratingId === 'fluent', question.target)
  }

  if (finished) {
    const correctCount = answers.filter((answer) => answer.correct).length

    return (
      <section className="surface-card practice-challenge practice-challenge--result">
        <div className="practice-challenge__result-summary">
          <div className="practice-challenge__result-main">
            <p className="eyebrow">{copy.resultHeading}</p>
            <p className="practice-challenge__score">{copy.finalScore(score)}</p>
            <dl className="practice-challenge__rating">
              <dt>{copy.ratingLabel}</dt>
              <dd className="practice-challenge__rating-value" aria-label={copy.ratingValue(rating)}>
                {copy.ratingValue(rating)}
              </dd>
            </dl>
            <div className="practice-challenge__stars" aria-label={copy.ratingValue(rating)}>
              {[0, 1, 2].map((starIndex) => (
                <span
                  key={starIndex}
                  aria-hidden="true"
                  className={`practice-challenge__star ${
                    starIndex < Math.ceil((correctCount / questions.length) * 3)
                      ? 'practice-challenge__star--lit'
                      : ''
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="muted-text">{copy.encouragement(rating)}</p>
            {lives <= 0 ? <p className="muted-text">{copy.outOfLivesMessage}</p> : null}
          </div>

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
      <div className="practice-challenge__status">
        <p className="eyebrow">
          {copy.questionProgress(questionNumber, questions.length)}
        </p>
        <div className="practice-challenge__stats">
          <div className="practice-challenge__stat" aria-label={`${copy.scoreLabel} ${score}`}>
            <span className="practice-challenge__stat-label">{copy.scoreLabel}</span>
            <strong className="practice-challenge__stat-value">{score}</strong>
          </div>
          <div className="practice-challenge__stat" aria-label={`${copy.streakLabel} ${streak}`}>
            <span className="practice-challenge__stat-label">{copy.streakLabel}</span>
            <strong className="practice-challenge__stat-value">{streak}</strong>
          </div>
          <div className="practice-challenge__stat" aria-label={`${copy.livesLabel} ${lives}`}>
            <span className="practice-challenge__stat-label">{copy.livesLabel}</span>
            <strong className="practice-challenge__stat-value">{lives}</strong>
          </div>
        </div>
      </div>

      <div className="practice-challenge__question">
        <div className="practice-challenge__prompt">
          <p>{getLocalizedText(currentQuestion.prompt, language)}</p>
          <SpeechButton
            label={copy.playPromptAudio(questionNumber)}
            text={currentQuestion.target}
            audioSrc={currentQuestion.audio}
            fallbackAudioSrc={currentQuestion.audioFallback}
          />
        </div>

        {currentQuestion.kind === 'speak' ? (
          <div className="practice-challenge__options" role="group" aria-label={copy.streakLabel}>
            <button type="button" className="option-button" onClick={() => handleSelfRating(currentQuestion, 'fluent')}>
              {copy.fluentOption}
            </button>
            <button type="button" className="option-button" onClick={() => handleSelfRating(currentQuestion, 'needs-practice')}>
              {copy.needsPracticeOption}
            </button>
            <button type="button" className="option-button" onClick={() => handleSelfRating(currentQuestion, 'show-me')}>
              {copy.showMeOption}
            </button>
          </div>
        ) : (
          <div className="practice-challenge__options" role="group" aria-label={copy.scoreLabel}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="option-button"
                onClick={() => handleChoice(currentQuestion, option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {feedback ? (
        <div
          className={`practice-challenge__feedback practice-challenge__feedback--${
            feedback.correct ? 'correct' : 'incorrect'
          }`}
        >
          <div className="practice-challenge__feedback-body">
            <p className="practice-challenge__feedback-heading">
              {feedback.correct
                ? `${copy.correctFeedback} ${copy.pointsGained(feedback.points)}`
                : copy.incorrectFeedback}
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
