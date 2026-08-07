import { useEffect, useMemo, useState } from 'react'

import { getLocalizedText } from '../content/copy'
import type { ExplanationLanguage, LessonContent } from '../content/types'
import {
  buildPracticeChallenge,
  computeRating,
  pointsForCorrect,
  type PracticeChallengeQuestion,
} from '../lib/practiceChallenge'
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
}

interface PracticeChallengeProps {
  lesson: LessonContent
  language: ExplanationLanguage
  copy: PracticeChallengeCopy
  seed: number
  onComplete: () => void
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
    setFeedback({ correct: isCorrect, points: gained, reveal })

    if (isLastQuestion || nextLives <= 0) {
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
    return (
      <section className="surface-card practice-challenge practice-challenge--result">
        <p className="eyebrow">{copy.resultHeading}</p>
        <p className="practice-challenge__score">{copy.finalScore(score)}</p>
        <dl className="practice-challenge__rating">
          <dt>{copy.ratingLabel}</dt>
          <dd className="practice-challenge__rating-value">{copy.ratingValue(rating)}</dd>
        </dl>
        <p className="muted-text">{copy.encouragement(rating)}</p>
        {lives <= 0 ? <p className="muted-text">{copy.outOfLivesMessage}</p> : null}
        <button type="button" className="primary-button" onClick={restart}>
          {copy.playAgain}
        </button>
      </section>
    )
  }

  return (
    <section className="surface-card practice-challenge">
      <div className="practice-challenge__status">
        <p className="eyebrow">
          {copy.questionProgress(questionNumber, questions.length)}
        </p>
        <p className="practice-challenge__status-line" aria-label={copy.scoreLabel}>
          {copy.scoreLabel} {score}
        </p>
        <p className="practice-challenge__status-line" aria-label={copy.streakLabel}>
          {copy.streakLabel} {streak}
        </p>
        <p className="practice-challenge__status-line" aria-label={copy.livesLabel}>
          {copy.livesLabel} {lives}
        </p>
      </div>

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

      {feedback ? (
        <div
          className={`practice-challenge__feedback practice-challenge__feedback--${
            feedback.correct ? 'correct' : 'incorrect'
          }`}
        >
          <p className="practice-challenge__feedback-heading">
            {feedback.correct
              ? `${copy.correctFeedback} ${copy.pointsGained(feedback.points)}`
              : copy.incorrectFeedback}
          </p>
          {!feedback.correct ? (
            <p className="muted-text">{copy.correctAnswer(feedback.reveal)}</p>
          ) : null}
          <button type="button" className="primary-button" onClick={advance}>
            {copy.nextQuestion}
          </button>
        </div>
      ) : null}

      <ExplanationBlock explanation={currentQuestion.explanation} language={language} />
    </section>
  )
}
