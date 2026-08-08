import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadPinyinProgress } from '../lib/pinyinProgress'
import { renderRoute } from '../test/renderRoute'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

describe('PinyinPracticePage', () => {
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

  it('renders the pinyin practice challenge with tone and reference questions', () => {
    renderRoute('/pinyin/practice?module=initials')

    expect(screen.getByRole('heading', { level: 1, name: 'Initials' })).toBeVisible()
    expect(screen.queryByText(/question 1 of 5/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^score 0$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^streak 0$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^lives 3$/i)).not.toBeInTheDocument()
  })

  it('keeps the navigation back to the pinyin lesson page', () => {
    renderRoute('/pinyin/practice')

    expect(screen.getByRole('link', { name: /back to lesson/i })).toHaveAttribute(
      'href',
      '/pinyin',
    )
  })

  it('marks the practice section complete after finishing a challenge', async () => {
    const user = userEvent.setup()

    renderRoute('/pinyin/practice?module=initials')

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

    const progress = loadPinyinProgress()
    expect(progress.moduleProgress['initials']?.completedSections).toContain('practice')
  })
})
