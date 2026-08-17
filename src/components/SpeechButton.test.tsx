import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { speakChinese } from '../lib/speech'
import { SpeechButton } from './SpeechButton'

vi.mock('../lib/speech', () => ({
  speakChinese: vi.fn(),
}))

describe('SpeechButton', () => {
  const speakChineseMock = vi.mocked(speakChinese)

  beforeEach(() => {
    speakChineseMock.mockReset()
  })

  it('renders as an icon-only button while preserving its localized accessible label and title', () => {
    render(
      <SpeechButton
        label="Play Chinese"
        text="你好"
        audioSrc="/audio/self-intro/line-01.mp3"
      />,
    )

    const button = screen.getByRole('button', { name: 'Play Chinese' })

    expect(button).toHaveAttribute('aria-label', 'Play Chinese')
    expect(button).toHaveAttribute('title', 'Play Chinese')
    expect(button).not.toHaveTextContent(/play chinese/i)
    expect(screen.queryByText('Play Chinese')).not.toBeInTheDocument()
  })

  it('keeps the existing playback handoff when clicked', async () => {
    const user = userEvent.setup()

    render(
      <SpeechButton
        label="Play Chinese"
        text="你好"
        audioSrc="/audio/self-intro/line-01.mp3"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Play Chinese' }))

    expect(speakChineseMock).toHaveBeenCalledWith({
      text: '你好',
      audioSrc: '/audio/self-intro/line-01.mp3',
    })
  })


  it('passes generated and fallback audio sources to the playback helper', async () => {
    const user = userEvent.setup()

    render(
      <SpeechButton
        label="Play Chinese"
        text="你好"
        audioSrc="/voice/generated/self-intro/line-01.mp3"
        fallbackAudioSrc="/audio/self-intro/line-01.mp3"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Play Chinese' }))

    expect(speakChineseMock).toHaveBeenCalledWith({
      text: '你好',
      audioSrc: '/voice/generated/self-intro/line-01.mp3',
      fallbackAudioSrc: '/audio/self-intro/line-01.mp3',
    })
  })

  it('preserves native disabled behavior for unavailable playback entry points', async () => {
    const user = userEvent.setup()

    render(
      <SpeechButton
        label="Play Chinese"
        text="你好"
        audioSrc="/audio/self-intro/line-01.mp3"
        disabled
      />,
    )

    const button = screen.getByRole('button', { name: 'Play Chinese' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('title', 'Play Chinese')

    await user.click(button)

    expect(speakChineseMock).not.toHaveBeenCalled()
  })

  it('applies the playing modifier class and forwards playback end handler', async () => {
    const user = userEvent.setup()
    const onPlaybackEnd = vi.fn()

    render(
      <SpeechButton
        label="Play Chinese"
        text="你好"
        audioSrc="/audio/self-intro/line-01.mp3"
        isPlaying
        onPlaybackEnd={onPlaybackEnd}
      />,
    )

    const button = screen.getByRole('button', { name: 'Play Chinese' })

    expect(button).toHaveClass('speech-button', 'speech-button--is-playing')

    await user.click(button)

    expect(speakChineseMock).toHaveBeenCalledWith({
      text: '你好',
      audioSrc: '/audio/self-intro/line-01.mp3',
      onEnd: onPlaybackEnd,
    })
  })
})
