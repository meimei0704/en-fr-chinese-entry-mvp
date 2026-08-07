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
      pause = vi.fn()
      play = audioPlay.mockResolvedValue(undefined)
      src: string

      constructor(src: string) {
        audioConstructor(src)
        this.src = src
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  it('renders the practice challenge in the practice view', () => {
    renderRoute('/lesson/self-intro/practice')

    expect(screen.getByRole('heading', { name: /到达机场/i })).toBeVisible()
    expect(screen.getByText(/question 1 of 5/i)).toBeVisible()
    expect(screen.getByLabelText(/^score 0$/i)).toBeVisible()
    expect(screen.getByLabelText(/^streak 0$/i)).toBeVisible()
    expect(screen.getByLabelText(/^lives 3$/i)).toBeVisible()
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

    for (let questionNumber = 1; questionNumber <= 5; questionNumber += 1) {
      if (screen.queryByText(/challenge complete/i)) {
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
    }

    expect(screen.getByText(/challenge complete/i)).toBeVisible()

    const progress = loadProgress()
    expect(progress.lessonStepProgress['self-intro']?.completedSections).toContain('practice')
  })
})
