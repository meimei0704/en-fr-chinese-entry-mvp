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

  it('renders listening, speaking, and reading practice in the practice view', () => {
    renderRoute('/lesson/self-intro/practice')

    expect(screen.getByText(/listen and choose/i)).toBeVisible()
    expect(screen.getByText(/repeat aloud/i)).toBeVisible()
    expect(screen.getByText(/match the hanzi/i)).toBeVisible()
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

  it('plays each practice prompt through its same-voice MP3 asset', async () => {
    const user = userEvent.setup()

    renderRoute('/lesson/self-intro/practice')

    const playbackButtons = screen.getAllByRole('button', { name: /play chinese/i })
    expect(playbackButtons).toHaveLength(3)
    expect(screen.queryAllByText(/^Play Chinese$/i)).toHaveLength(0)
    playbackButtons.forEach((button) => {
      expect(button).toHaveAttribute('title', 'Play Chinese')
      expect(button).not.toHaveTextContent(/play chinese/i)
    })

    for (const button of playbackButtons) {
      await user.click(button)
    }

    expect(audioConstructor).toHaveBeenNthCalledWith(
      1,
      '/audio/self-intro/practice-listening-01.mp3',
    )
    expect(audioConstructor).toHaveBeenNthCalledWith(
      2,
      '/audio/self-intro/practice-speaking-01.mp3',
    )
    expect(audioConstructor).toHaveBeenNthCalledWith(
      3,
      '/audio/self-intro/practice-reading-01.mp3',
    )
    expect(audioPlay).toHaveBeenCalledTimes(3)
    expect(cancel).toHaveBeenCalledTimes(3)
    expect(speak).not.toHaveBeenCalled()
  })
})
