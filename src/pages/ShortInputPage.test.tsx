import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDefaultProgress, saveProgress } from '../lib/progress'
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

describe('ShortInputPage pronunciation playback', () => {
  const play = vi.fn()
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioConstructor = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    play.mockReset()
    speak.mockReset()
    cancel.mockReset()
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
      play = play.mockResolvedValue(undefined)
      src: string

      constructor(src: string) {
        audioConstructor(src)
        this.src = src
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  it('plays the short-input audio asset from the lesson content', async () => {
    const user = userEvent.setup()

    renderRoute('/lesson/self-intro/short-input')

    const playbackButton = screen.getByRole('button', { name: /play chinese/i })

    expect(playbackButton).toHaveAttribute('title', 'Play Chinese')
    expect(playbackButton).not.toHaveTextContent(/play chinese/i)
    expect(screen.queryByText(/^Play Chinese$/i)).not.toBeInTheDocument()

    await user.click(playbackButton)

    expect(audioConstructor).toHaveBeenCalledWith('/audio/self-intro/short-input-01.mp3')
    expect(play).toHaveBeenCalledTimes(1)
    expect(speak).not.toHaveBeenCalled()
  })

  it.each(['en', 'fr'] as const)(
    'renders all short-input headings as Chinese plus the %s explanation line',
    (language) => {
      for (const topic of expectedLessonTopicOrder) {
        localStorage.clear()
        saveProgress({
          ...createDefaultProgress(),
          selectedExplanationLanguage: language,
        })

        const { unmount } = renderRoute(`/lesson/${topic.id}/short-input`)
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
})
