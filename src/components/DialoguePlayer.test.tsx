import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
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
})
