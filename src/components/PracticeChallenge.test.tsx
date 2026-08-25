import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { selfIntroLesson } from '../content/lessons/selfIntro'
import { buildPracticeChallenge } from '../lib/practiceChallenge'
import { speakChinese } from '../lib/speech'
import { PracticeChallenge, type PracticeChallengeCopy } from './PracticeChallenge'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
}))

const copy: PracticeChallengeCopy = {
  playOptionAudio: (option: string) => `Play ${option}`,
  correctFeedback: 'Correct!',
  incorrectFeedback: 'Not quite.',
  correctAnswer: (answer: string) => `Answer: ${answer}`,
  nextQuestion: 'Next question',
  playAgain: 'Play again',
  answerReview: 'Your answers',
  answerReviewCorrect: 'Correct',
  answerReviewIncorrect: 'Incorrect',
}

function renderChallenge(overrides?: { seed?: number }) {
  const seed = overrides?.seed ?? 11

  render(
    <PracticeChallenge
      buildChallenge={(nextSeed) => buildPracticeChallenge(selfIntroLesson, 'en', 5, nextSeed)}
      language="en"
      copy={copy}
      seed={seed}
      onComplete={vi.fn()}
    />,
  )

  return buildPracticeChallenge(selfIntroLesson, 'en', 5, seed)
}

async function answerAllCorrect(
  user: ReturnType<typeof userEvent.setup>,
  challenge: ReturnType<typeof buildPracticeChallenge>,
) {
  for (const question of challenge.questions) {
    const correctLabel =
      question.options.find((option) => option.id === question.correctOptionId)?.label ?? ''
    await user.click(screen.getByRole('button', { name: correctLabel }))

    const nextButton = screen.queryByRole('button', { name: copy.nextQuestion })
    if (nextButton) {
      await user.click(nextButton)
    }
  }
}

describe('PracticeChallenge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the first question without score, streak, lives, or question progress', () => {
    const challenge = renderChallenge()
    const firstQuestion = challenge.questions[0]

    expect(screen.getByText(firstQuestion.prompt.en, { selector: 'p' })).toBeVisible()
    expect(screen.queryByText(/Question 1 of 5/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Score$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Streak$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Lives$/)).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'Play the audio for question 1' }),
    ).not.toBeInTheDocument()
  })

  it('labels every option with an A/B/C letter badge', () => {
    const challenge = renderChallenge()

    const optionLetters = screen.getAllByText(/^[A-D]$/, { selector: '.option-button__letter' })
    expect(optionLetters.map((node) => node.textContent)).toEqual(['A', 'B', 'C', 'D'])

    for (const question of challenge.questions) {
      for (const option of question.options) {
        expect(screen.getByText(option.label, { selector: '.option-button__label' })).toBeVisible()
      }
      break
    }
  })

  it('shows a pronunciation button on hanzi options only', async () => {
    const challenge = renderChallenge()
    const hanziOptions = challenge.questions[0].options.filter((option) =>
      /[\u3400-\u9fff]/.test(option.label),
    )
    const nonHanziOptions = challenge.questions[0].options.filter(
      (option) => !/[\u3400-\u9fff]/.test(option.label),
    )

    for (const option of hanziOptions) {
      if (option.audio) {
        expect(screen.getByRole('button', { name: `Play ${option.label}` })).toBeVisible()
      }
    }
    for (const option of nonHanziOptions) {
      expect(screen.queryByRole('button', { name: `Play ${option.label}` })).not.toBeInTheDocument()
    }
  })

  it('plays option audio without submitting the answer', async () => {
    const user = userEvent.setup()
    const seed = Array.from({ length: 100 }, (_, candidate) => candidate).find((candidate) =>
      buildPracticeChallenge(selfIntroLesson, 'en', 5, candidate)
        .questions[0].options.some((option) => option.audio),
    )
    expect(seed).toBeDefined()

    const challenge = renderChallenge({ seed: seed! })
    const audibleOption = challenge.questions[0].options.find((option) => option.audio)

    expect(audibleOption).toBeDefined()
    vi.mocked(speakChinese).mockClear()

    await user.click(screen.getByRole('button', { name: `Play ${audibleOption!.label}` }))

    expect(speakChinese).toHaveBeenCalledWith(
      expect.objectContaining({
        text: audibleOption!.label,
        audioSrc: audibleOption!.audio,
      }),
    )
    expect(screen.queryByText(copy.correctFeedback)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.incorrectFeedback)).not.toBeInTheDocument()
  })

  it('does not auto-play the correct answer for listen questions', async () => {
    const seed = Array.from({ length: 100 }, (_, candidate) => candidate).find(
      (candidate) =>
        buildPracticeChallenge(selfIntroLesson, 'en', 5, candidate).questions[0]?.kind ===
        'listen',
    )
    expect(seed).toBeDefined()

    renderChallenge({ seed: seed! })

    await waitFor(() => {
      expect(speakChinese).not.toHaveBeenCalled()
    })
  })

  it('advances through choice questions and reports completion once finished', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        buildChallenge={(nextSeed) => buildPracticeChallenge(selfIntroLesson, 'en', 5, nextSeed)}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)
    await answerAllCorrect(user, challenge)

    expect(screen.getByRole('button', { name: copy.playAgain })).toBeVisible()
    expect(screen.getByText(copy.answerReview)).toBeVisible()
    expect(screen.queryByText('Challenge complete')).not.toBeInTheDocument()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows feedback on an incorrect answer and reveals the correct answer', async () => {
    const user = userEvent.setup()
    const challenge = renderChallenge()
    const firstQuestion = challenge.questions[0]

    const wrongLabel =
      firstQuestion.options.find((option) => option.id !== firstQuestion.correctOptionId)?.label ?? ''
    await user.click(screen.getByRole('button', { name: wrongLabel }))

    expect(screen.getByText(copy.incorrectFeedback)).toBeVisible()
    expect(screen.getByText(copy.correctAnswer(firstQuestion.target))).toBeVisible()
  })

  it('shows only the Correct! feedback without a point bonus on a correct answer', async () => {
    const user = userEvent.setup()
    const challenge = renderChallenge()
    const firstQuestion = challenge.questions[0]

    const correctLabel =
      firstQuestion.options.find((option) => option.id === firstQuestion.correctOptionId)?.label ?? ''
    await user.click(screen.getByRole('button', { name: correctLabel }))

    expect(screen.getByText(copy.correctFeedback)).toBeVisible()
    expect(screen.queryByText(/\+.*points/)).not.toBeInTheDocument()
  })

  it('does not finish early when every answer is wrong; result only after all questions', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        buildChallenge={(nextSeed) => buildPracticeChallenge(selfIntroLesson, 'en', 5, nextSeed)}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)

    for (const question of challenge.questions) {
      const wrongLabel =
        question.options.find((option) => option.id !== question.correctOptionId)?.label ?? ''
      await user.click(screen.getByRole('button', { name: wrongLabel }))

      const nextButton = screen.queryByRole('button', { name: copy.nextQuestion })
      if (nextButton) {
        await user.click(nextButton)
      }
    }

    expect(screen.getByRole('button', { name: copy.playAgain })).toBeVisible()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows the answer review with per-question results on the result page', async () => {
    const user = userEvent.setup()
    const challenge = renderChallenge()

    await answerAllCorrect(user, challenge)

    expect(screen.getByText(copy.answerReview)).toBeVisible()
    expect(screen.getAllByText(copy.answerReviewCorrect).length).toBeGreaterThan(0)
  })

  it('re-starts the round with a fresh challenge when replaying', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(
      <PracticeChallenge
        buildChallenge={(nextSeed) => buildPracticeChallenge(selfIntroLesson, 'en', 5, nextSeed)}
        language="en"
        copy={copy}
        seed={11}
        onComplete={onComplete}
      />,
    )

    const challenge = buildPracticeChallenge(selfIntroLesson, 'en', 5, 11)
    await answerAllCorrect(user, challenge)

    expect(screen.getByRole('button', { name: copy.playAgain })).toBeVisible()

    await user.click(screen.getByRole('button', { name: copy.playAgain }))

    expect(screen.getByRole('group', { name: copy.answerOptions })).toBeVisible()
    expect(screen.queryByText(/Question 1 of 5/)).not.toBeInTheDocument()
  })
})
