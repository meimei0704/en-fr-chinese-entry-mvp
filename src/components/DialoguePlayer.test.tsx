import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import { DialoguePlayer } from './DialoguePlayer'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

describe('DialoguePlayer', () => {
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioPlay = vi.fn()
  const audioConstructor = vi.fn()

  beforeEach(() => {
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

  it('offers a real playback button that plays the Chinese line audio asset', async () => {
    const user = userEvent.setup()
    const firstLine = course.lessons[0].dialogue.lines[0]

    render(
      <DialoguePlayer
        language="fr"
        lines={[firstLine]}
      />,
    )

    const playbackButton = screen.getByRole('button', { name: /écouter le chinois/i })

    expect(playbackButton).toHaveAttribute('title', 'Écouter le chinois')
    expect(playbackButton).not.toHaveTextContent(/écouter le chinois/i)
    expect(screen.queryByText(/écouter le chinois/i)).not.toBeInTheDocument()

    await user.click(playbackButton)

    expect(audioPlay).toHaveBeenCalledTimes(1)
    expect(audioConstructor).toHaveBeenCalled()
    expect(speak).not.toHaveBeenCalled()
  })

  it('uses localized accessible names for dialogue lines in French mode', () => {
    render(
      <DialoguePlayer
        language="fr"
        lines={[
          {
            id: 'line-1',
            speaker: {
              en: 'Traveler',
              fr: 'Voyageuse',
            },
            hanzi: '请问，地铁票在哪儿买？',
            pinyin: 'Qǐngwèn, dìtiě piào zài nǎr mǎi?',
            translation: 'Où est-ce que je peux acheter un ticket de métro ?',
            explanation: {
              en: 'Test explanation',
              fr: 'Explication de test',
            },
            audio: '/audio/test.mp3',
          },
        ]}
      />,
    )

    expect(
      screen.getByRole('article', { name: /ligne de dialogue, interlocuteur voyageuse/i }),
    ).toHaveTextContent('请问，地铁票在哪儿买？')
    expect(
      screen.queryByRole('article', { name: /dialogue line speaker traveler/i }),
    ).not.toBeInTheDocument()
  })

  it('marks played dialogue lines as completed and reports new plays', async () => {
    const user = userEvent.setup()
    const onLinePlayed = vi.fn()
    const firstLine = course.lessons[0].dialogue.lines[0]
    const secondLine = course.lessons[0].dialogue.lines[1]

    const { rerender } = render(
      <DialoguePlayer
        language="en"
        lines={[firstLine, secondLine]}
        completedLineIds={[firstLine.id]}
        onLinePlayed={onLinePlayed}
      />,
    )

    const articles = screen.getAllByRole('article')
    expect(articles[0]).toHaveClass('is-completed')
    expect(articles[1]).not.toHaveClass('is-completed')

    const playButtons = screen.getAllByRole('button', { name: /play chinese/i })
    await user.click(playButtons[1])

    expect(onLinePlayed).toHaveBeenCalledTimes(1)
    expect(onLinePlayed).toHaveBeenCalledWith(secondLine.id)

    rerender(
      <DialoguePlayer
        language="en"
        lines={[firstLine, secondLine]}
        completedLineIds={[firstLine.id, secondLine.id]}
        onLinePlayed={onLinePlayed}
      />,
    )

    expect(screen.getAllByRole('article')[1]).toHaveClass('is-completed')
  })

  it('reports a played line even when no completed set is provided', async () => {
    const user = userEvent.setup()
    const onLinePlayed = vi.fn()
    const firstLine = course.lessons[0].dialogue.lines[0]

    render(<DialoguePlayer language="en" lines={[firstLine]} onLinePlayed={onLinePlayed} />)

    const playButton = screen.getByRole('button', { name: /play chinese/i })
    await user.click(playButton)

    expect(onLinePlayed).toHaveBeenCalledTimes(1)
    expect(onLinePlayed).toHaveBeenCalledWith(firstLine.id)
  })
})
