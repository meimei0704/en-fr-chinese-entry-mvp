import '@testing-library/jest-dom/vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import { DialoguePlayer } from './DialoguePlayer'
import { speakerKey } from './speakerKey'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

interface MockAudioInstance {
  addEventListener: ReturnType<typeof vi.fn>
  currentTime: number
  load: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  play: ReturnType<typeof vi.fn>
  preload: string
  removeAttribute: ReturnType<typeof vi.fn>
  src: string
}

describe('DialoguePlayer', () => {
  const speak = vi.fn()
  const cancel = vi.fn()
  const audioPlay = vi.fn()
  const audioConstructor = vi.fn()
  const audioInstances: MockAudioInstance[] = []

  beforeEach(() => {
    speak.mockReset()
    cancel.mockReset()
    audioPlay.mockReset()
    audioConstructor.mockReset()
    audioInstances.length = 0
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [],
    })
    class MockAudio {
      addEventListener = vi.fn((eventName: string, listener: EventListenerOrEventListenerObject) => {
        this.listeners[eventName] = () => {
          if (typeof listener === 'function') {
            listener(new Event(eventName))
            return
          }

          listener.handleEvent(new Event(eventName))
        }
      })
      currentTime = 0
      listeners: Record<string, () => void> = {}
      load = vi.fn()
      pause = vi.fn()
      play = audioPlay.mockResolvedValue(undefined)
      preload = ''
      removeAttribute = vi.fn()
      src: string

      constructor(src = '') {
        audioConstructor(src)
        this.src = src
        audioInstances.push(this)
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

  it('adds a normalized data-speaker key for chip color assignment', () => {
    render(
      <DialoguePlayer
        language="fr"
        lines={[
          {
            id: 'line-1',
            speaker: {
              en: 'Front desk',
              fr: 'Réception',
            },
            hanzi: '请问，房间号？',
            pinyin: 'Qǐngwèn, fángjiān hào?',
            translation: 'Votre numéro de chambre ?',
            explanation: {
              en: 'Test explanation',
              fr: 'Explication de test',
            },
            audio: '/audio/test.mp3',
          },
        ]}
      />,
    )

    expect(screen.getByText('Réception')).toHaveAttribute('data-speaker', 'front-desk')
  })

  it('normalizes speaker keys to lowercase dashed tokens', () => {
    expect(speakerKey('Traveler')).toBe('traveler')
    expect(speakerKey('Front desk')).toBe('front-desk')
    expect(speakerKey('  Clerk  ')).toBe('clerk')
  })

  it('highlights the playing card and button, then clears on playback end', async () => {
    const user = userEvent.setup()
    const firstLine = course.lessons[0].dialogue.lines[0]

    render(
      <DialoguePlayer
        language="en"
        lines={[firstLine]}
      />,
    )

    const card = screen.getByRole('article', {
      name: /dialogue line speaker traveler/i,
    })
    const playbackButton = screen.getByRole('button', { name: /play chinese/i })

    expect(card).not.toHaveClass('dialogue-card--is-playing')
    expect(playbackButton).not.toHaveClass('speech-button--is-playing')

    await user.click(playbackButton)

    expect(card).toHaveClass('dialogue-card--is-playing')
    expect(playbackButton).toHaveClass('speech-button--is-playing')

    await act(async () => {
      audioInstances[0].listeners.ended()
    })

    expect(card).not.toHaveClass('dialogue-card--is-playing')
    expect(playbackButton).not.toHaveClass('speech-button--is-playing')
  })

  it('moves the playing highlight when a newer line interrupts the current one', async () => {
    const user = userEvent.setup()
    const [firstLine, secondLine] = course.lessons[0].dialogue.lines

    render(
      <DialoguePlayer
        language="en"
        lines={[firstLine, secondLine]}
      />,
    )

    const cards = screen.getAllByRole('article', { name: /dialogue line speaker traveler/i })
    const buttons = screen.getAllByRole('button', { name: /play chinese/i })

    expect(cards).toHaveLength(2)
    expect(buttons).toHaveLength(2)

    await user.click(buttons[0])
    expect(cards[0]).toHaveClass('dialogue-card--is-playing')
    expect(cards[1]).not.toHaveClass('dialogue-card--is-playing')

    await user.click(buttons[1])
    expect(cards[0]).not.toHaveClass('dialogue-card--is-playing')
    expect(cards[1]).toHaveClass('dialogue-card--is-playing')
  })
})
