import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

  beforeEach(() => {
    speak.mockReset()
    cancel.mockReset()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [],
    })
  })

  it('offers a real playback button that speaks the Chinese line through browser TTS', async () => {
    const user = userEvent.setup()

    render(
      <DialoguePlayer
        language="fr"
        lines={[
          {
            id: 'line-1',
            speaker: 'Agent',
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

    await user.click(screen.getByRole('button', { name: /écouter le chinois/i }))

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0]?.[0]).toMatchObject({
      text: '请问，地铁票在哪儿买？',
      lang: 'zh-CN',
    })
  })
})
