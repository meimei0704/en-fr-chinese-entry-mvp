import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDefaultProgress, loadProgress, saveProgress } from '../lib/progress'
import { expectedLessonTopicOrder, expectedLessonTopicPattern } from '../test/lessonTopicExpectations'
import { renderRoute } from '../test/renderRoute'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

describe('PracticePage', () => {
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioPlay = vi.fn()
  const audioConstructor = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    speak.mockReset()
    cancel.mockReset()
    audioPlay.mockReset()
    audioConstructor.mockReset()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [],
    })

    class MockAudio {
      addEventListener = vi.fn()
      currentTime = 0
      load = vi.fn()
      pause = vi.fn()
      play = audioPlay.mockResolvedValue(undefined)
      preload = ''
      removeAttribute = vi.fn()
      src: string

      constructor(src = '') {
        audioConstructor(src)
        this.src = src
      }

      getAttribute(name: string) {
        return name === 'src' ? this.src : null
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  it('renders the practice challenge in the practice view', () => {
    renderRoute('/lesson/self-intro/practice')

    expect(screen.getByRole('heading', { name: /到达机场/i })).toBeVisible()
    expect(screen.queryByText(/question 1 of 5/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^score 0$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^streak 0$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^lives 3$/i)).not.toBeInTheDocument()
  })

  it('keeps the navigation back to lesson', () => {
    renderRoute('/lesson/self-intro/practice')

    expect(screen.getByRole('link', { name: /back to lesson/i })).toHaveAttribute(
      'href',
      '/lesson/self-intro',
    )
  })

  it.each(['en', 'fr'] as const)(
    'renders all practice headings as Chinese plus the %s explanation line',
    (language) => {
      for (const topic of expectedLessonTopicOrder) {
        localStorage.clear()
        saveProgress({
          ...createDefaultProgress(),
          selectedExplanationLanguage: language,
        })

        const { unmount } = renderRoute(`/lesson/${topic.id}/practice`)
        const heading = screen.getByRole('heading', {
          level: 1,
          name: expectedLessonTopicPattern(topic, language),
        })

        expect(heading).toBeVisible()
        expect(heading).not.toHaveTextContent(' / ')
        expect(within(heading).getByText(topic.hanzi)).toHaveClass('lesson-topic-title__primary')
        expect(within(heading).getByText(topic[language])).toHaveClass(
          'lesson-topic-title__secondary',
        )

        unmount()
      }
    },
  )

  it('marks the practice section complete after finishing a challenge', async () => {
    const user = userEvent.setup()

    saveProgress({
      ...createDefaultProgress(),
      lastVisitedLesson: 'self-intro',
    })
    renderRoute('/lesson/self-intro/practice')

    for (let questionNumber = 1; questionNumber <= 10; questionNumber += 1) {
      if (screen.queryByRole('button', { name: /play again/i })) {
        break
      }

      const options = screen
        .getAllByRole('button', { name: /./ })
        .filter((button) => !button.getAttribute('aria-label'))

      expect(options.length).toBeGreaterThan(0)
      await user.click(options[0])

      const nextButton = screen.queryByRole('button', { name: /next question/i })
      if (nextButton) {
        await user.click(nextButton)
      }
      if (questionNumber === 5) {
        expect(screen.queryByRole('button', { name: /play again/i })).not.toBeInTheDocument()
      }
    }

    expect(screen.getByRole('button', { name: /play again/i })).toBeVisible()
    expect(screen.queryByRole('button', { name: /complete lesson/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /lesson complete/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /go to review/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view progress/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to lesson/i })).toBeVisible()

    const progress = loadProgress()
    expect(progress.lessonStepProgress['self-intro']?.completedSections).toContain('practice')
  })

  it.each([
    {
      language: 'en' as const,
      playAgain: /play again/i,
      completeLesson: /complete lesson|lesson complete/i,
      review: /go to review/i,
      progress: /view progress/i,
      backToLesson: /back to lesson/i,
    },
    {
      language: 'fr' as const,
      playAgain: /rejouer/i,
      completeLesson: /terminer la leçon|leçon terminée/i,
      review: /aller à la révision/i,
      progress: /voir les progrès/i,
      backToLesson: /retour à la leçon/i,
    },
  ])(
    'keeps only replay and back-to-lesson actions after a completed %s practice round',
    async ({ language, playAgain, completeLesson, review, progress, backToLesson }) => {
      const user = userEvent.setup()

      saveProgress({
        ...createDefaultProgress(),
        selectedExplanationLanguage: language,
      })
      renderRoute('/lesson/self-intro/practice')

      for (let questionNumber = 1; questionNumber <= 10; questionNumber += 1) {
        if (screen.queryByRole('button', { name: playAgain })) {
          break
        }

        const options = screen
          .getAllByRole('button', { name: /./ })
          .filter((button) => !button.getAttribute('aria-label'))

        await user.click(options[0])

        const nextButton = screen.queryByRole('button', { name: /next question|question suivante/i })
        if (nextButton) {
          await user.click(nextButton)
        }
        if (questionNumber === 5) {
          expect(screen.queryByRole('button', { name: playAgain })).not.toBeInTheDocument()
        }
      }

      expect(screen.getByRole('button', { name: playAgain })).toBeVisible()
      expect(screen.queryByRole('button', { name: completeLesson })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: review })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: progress })).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: backToLesson })).toBeVisible()
    },
  )
})
