import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { selfIntroLesson } from '../content/lessons/selfIntro'
import { buildPracticeChallenge } from '../lib/practiceChallenge'
import { PracticeChallenge, type PracticeChallengeCopy } from './PracticeChallenge'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
}))

const copy: PracticeChallengeCopy = {
  scoreLabel: 'Score',
  streakLabel: 'Streak',
  livesLabel: 'Lives',
  questionProgress: (current: number, total: number) => `Question ${current} of ${total}`,
  playPromptAudio: (current: number) => `Play the audio for question ${current}`,
  fluentOption: 'I can say it fluently',
  needsPracticeOption: 'I need to practice more',
  showMeOption: 'Show me the model answer',
  correctFeedback: 'Correct!',
  pointsGained: (points: number) => `+${points} points`,
  incorrectFeedback: 'Not quite.',
  correctAnswer: (answer: string) => `Answer: ${answer}`,
  nextQuestion: 'Next question',
  resultHeading: 'Challenge complete',
  finalScore: (score: number) => `Final score: ${score}`,
  ratingLabel: 'Rating',
  ratingValue: (rating: string) => `${rating}`,
  outOfLivesMessage: 'You ran out of lives.',
  playAgain: 'Play again',
  answerReview: 'Your answers',
  answerReviewCorrect: 'Correct',
  answerReviewIncorrect: 'Incorrect',
  encouragement: () => 'Keep going.',
}

describe('PracticeChallenge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first question with progress, score, streak, and lives', () => {
    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={vi.fn()}
      />,
    )

    expect(screen.getByText('Question 1 of 5')).toBeVisible()
    expect(screen.getByLabelText('Score 0')).toBeVisible()
    expect(screen.getByLabelText('Streak 0')).toBeVisible()
    expect(screen.getByLabelText('Lives 3')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Play the audio for question 1' })).toBeVisible()
  })

  it('advances through choice questions and reports completion once finished', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)

    for (const question of challenge.questions) {
      const correctLabel =
        question.kind === 'speak'
          ? copy.fluentOption
          : (question.options.find((option) => option.id === question.correctOptionId)?.label ??
            '')
      await user.click(screen.getByRole('button', { name: correctLabel }))

      const nextButton = screen.queryByRole('button', { name: copy.nextQuestion })
      if (nextButton) {
        expect(screen.queryByText(copy.resultHeading)).not.toBeInTheDocument()
        await user.click(nextButton)
      }
    }

    expect(screen.getByText(copy.resultHeading)).toBeVisible()
    expect(screen.getByText(/Final score/)).toBeVisible()
    expect(screen.getByText(copy.ratingLabel)).toBeVisible()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('loses a life on an incorrect answer and reveals the correct answer', async () => {
    const user = userEvent.setup()

    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={vi.fn()}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)
    const firstQuestion = challenge.questions[0]

    const wrongLabel =
      firstQuestion.kind === 'speak'
        ? copy.needsPracticeOption
        : (firstQuestion.options.find((option) => option.id !== firstQuestion.correctOptionId)
            ?.label ?? '')
    await user.click(screen.getByRole('button', { name: wrongLabel }))

    expect(screen.getByText(copy.incorrectFeedback)).toBeVisible()
    expect(screen.getByText(copy.correctAnswer(firstQuestion.target))).toBeVisible()
    expect(screen.getByLabelText('Lives 2')).toBeVisible()
  })

  it('shows the result page early when all lives are lost', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)

    for (const question of challenge.questions) {
      if (screen.queryByText(copy.resultHeading)) {
        break
      }

      const wrongLabel =
        question.kind === 'speak'
          ? copy.needsPracticeOption
          : (question.options.find((option) => option.id !== question.correctOptionId)?.label ??
            '')
      await user.click(screen.getByRole('button', { name: wrongLabel }))

      const nextButton = screen.queryByRole('button', { name: copy.nextQuestion })
      if (nextButton) {
        await user.click(nextButton)
      }
    }

    expect(screen.getByText(copy.resultHeading)).toBeVisible()
    expect(screen.getByText(copy.outOfLivesMessage)).toBeVisible()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows the answer review with per-question results on the result page', async () => {
    const user = userEvent.setup()

    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={vi.fn()}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)

    for (const question of challenge.questions) {
      if (screen.queryByText(copy.resultHeading)) {
        break
      }

      const correctLabel =
        question.kind === 'speak'
          ? copy.fluentOption
          : (question.options.find((option) => option.id === question.correctOptionId)?.label ??
            '')
      await user.click(screen.getByRole('button', { name: correctLabel }))

      const nextButton = screen.queryByRole('button', { name: copy.nextQuestion })
      if (nextButton) {
        await user.click(nextButton)
      }
    }

    expect(screen.getByText(copy.resultHeading)).toBeVisible()
    expect(screen.getByText(copy.answerReview)).toBeVisible()
    expect(screen.getAllByText(copy.answerReviewCorrect).length).toBeGreaterThan(0)
  })

  it('re-starts the round with a fresh challenge when replaying', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        lesson={selfIntroLesson}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)

    for (const question of challenge.questions) {
      const correctLabel =
        question.kind === 'speak'
          ? copy.fluentOption
          : (question.options.find((option) => option.id === question.correctOptionId)?.label ??
            '')
      await user.click(screen.getByRole('button', { name: correctLabel }))

      if (screen.queryByRole('button', { name: copy.nextQuestion })) {
        await user.click(screen.getByRole('button', { name: copy.nextQuestion }))
      }
    }

    expect(screen.getByText(copy.resultHeading)).toBeVisible()

    await user.click(screen.getByRole('button', { name: copy.playAgain }))

    expect(screen.getByText('Question 1 of 5')).toBeVisible()
    expect(screen.getByLabelText('Score 0')).toBeVisible()
    expect(screen.getByLabelText('Lives 3')).toBeVisible()
  })
})
