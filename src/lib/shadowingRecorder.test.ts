import { beforeEach, describe, expect, it, vi } from 'vitest'

function setMediaDevices(getUserMedia: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia },
  })
}

function createStream() {
  const stop = vi.fn()

  return {
    stream: {
      getTracks: () => [{ stop }],
    } as unknown as MediaStream,
    stop,
  }
}

describe('shadowing recorder helper', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports unsupported when MediaRecorder or audio input access is unavailable', async () => {
    const { createShadowingRecorder, isShadowingRecordingSupported } = await import(
      './shadowingRecorder'
    )

    vi.stubGlobal('MediaRecorder', undefined)
    setMediaDevices(vi.fn())

    expect(isShadowingRecordingSupported()).toBe(false)
    await expect(createShadowingRecorder()).rejects.toMatchObject({ code: 'unsupported' })
  })

  it('maps denied microphone access to a permission-denied error', async () => {
    const { createShadowingRecorder } = await import('./shadowingRecorder')
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError'))

    vi.stubGlobal('MediaRecorder', vi.fn())
    setMediaDevices(getUserMedia)

    await expect(createShadowingRecorder()).rejects.toMatchObject({ code: 'permission-denied' })
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
  })

  it('maps recorder construction failures to init-failed and stops the opened stream', async () => {
    const { createShadowingRecorder } = await import('./shadowingRecorder')
    const { stream, stop } = createStream()

    vi.stubGlobal(
      'MediaRecorder',
      vi.fn(function () {
        throw new Error('Recorder init failed')
      }),
    )
    setMediaDevices(vi.fn().mockResolvedValue(stream))

    await expect(createShadowingRecorder()).rejects.toMatchObject({ code: 'init-failed' })
    expect(stop).toHaveBeenCalledTimes(1)
  })

  it('returns the browser recorder and stream when audio recording can start', async () => {
    const { createShadowingRecorder } = await import('./shadowingRecorder')
    const { stream } = createStream()
    const recorder = { start: vi.fn(), stop: vi.fn() }

    vi.stubGlobal(
      'MediaRecorder',
      vi.fn(function () {
        return recorder
      }),
    )
    setMediaDevices(vi.fn().mockResolvedValue(stream))

    await expect(createShadowingRecorder()).resolves.toEqual({ recorder, stream })
  })
})
