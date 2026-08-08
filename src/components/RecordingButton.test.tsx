import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RecordingButton } from './RecordingButton'

function installSupportedMediaRecorder() {
  const stop = vi.fn(function stop(this: { state: string }) {
    this.state = 'inactive'
    if (this.onstop) {
      this.onstop(new Event('stop'))
    }
  })
  const start = vi.fn(function start(this: { state: string }) {
    this.state = 'recording'
  })
  const recorder = { start, stop, state: 'inactive', mimeType: 'audio/webm' }

  class MockMediaRecorder {
    state = 'inactive'
    mimeType = 'audio/webm'
    onstop: (() => void) | null = null
    start = start
    stop = stop
  }

  class MockMediaStream {
    getTracks() {
      return [{ stop: vi.fn() }]
    }
  }

  vi.stubGlobal('MediaRecorder', MockMediaRecorder)
  vi.stubGlobal(
    'navigator',
    {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(new MockMediaStream()),
      },
    },
  )
  const createObjectURL = vi.fn(() => 'blob:mock-audio')
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL,
    revokeObjectURL: vi.fn(),
  })

  return { recorder, createObjectURL }
}

describe('RecordingButton', () => {
  const baseProps = {
    label: 'Recording',
    recordLabel: 'Record',
    stopLabel: 'Stop',
    replayLabel: 'Play back',
    unsupportedLabel: 'Recording is not supported in this browser.',
    deniedLabel: 'Microphone access was denied.',
    errorLabel: 'Recording could not start.',
  }

  beforeEach(() => {
    delete (window as unknown as { MediaRecorder?: unknown }).MediaRecorder
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows an unsupported message when MediaRecorder is unavailable', () => {
    render(<RecordingButton {...baseProps} />)

    expect(screen.getByText(baseProps.unsupportedLabel)).toBeVisible()
  })

  it('records, stops, and offers playback when supported', async () => {
    const user = userEvent.setup()
    const { recorder, createObjectURL } = installSupportedMediaRecorder()

    render(<RecordingButton {...baseProps} />)

    await user.click(screen.getByRole('button', { name: baseProps.recordLabel }))
    expect(recorder.start).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: baseProps.stopLabel }))
    expect(recorder.stop).toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalled()

    expect(screen.getByRole('button', { name: baseProps.replayLabel })).toBeVisible()
  })

  it('shows a denial message when permission is denied', async () => {
    const user = userEvent.setup()

    class MockMediaRecorder {
      state = 'inactive'
      mimeType = 'audio/webm'
      onstop: (() => void) | null = null
      start = vi.fn()
      stop = vi.fn()
    }

    vi.stubGlobal('MediaRecorder', MockMediaRecorder)
    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: vi
          .fn()
          .mockRejectedValue(new DOMException('denied', 'NotAllowedError')),
      },
    })

    render(<RecordingButton {...baseProps} />)

    await user.click(screen.getByRole('button', { name: baseProps.recordLabel }))

    expect(screen.getByRole('alert')).toHaveTextContent(baseProps.deniedLabel)
  })
})
