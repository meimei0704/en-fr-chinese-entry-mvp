import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { speakChinese } from './speech'

class MockUtterance {
  lang = ''
  rate = 1
  text: string

  constructor(text: string) {
    this.text = text
  }
}

function installMockAudio(play = vi.fn().mockResolvedValue(undefined)) {
  const audioConstructor = vi.fn()
  const instances: Array<{
    addEventListener: ReturnType<typeof vi.fn>
    currentTime: number
    listeners: Record<string, () => void>
    load: ReturnType<typeof vi.fn>
    pause: ReturnType<typeof vi.fn>
    play: typeof play
    preload: string
    removeAttribute: ReturnType<typeof vi.fn>
    src: string
  }> = []

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
    play = play
    preload = ''
    removeAttribute = vi.fn()
    src: string

    constructor(src = '') {
      audioConstructor(src)
      this.src = src
      instances.push(this)
    }

    getAttribute(name: string) {
      return name === 'src' ? this.src : null
    }
  }

  vi.stubGlobal('Audio', MockAudio)

  return { audioConstructor, instances, play }
}

describe('speakChinese', () => {
  const speak = vi.fn()

  beforeEach(() => {
    speak.mockReset()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      cancel: vi.fn(),
      speak,
      getVoices: () => [],
    })
  })

  afterEach(() => {
    speakChinese({ text: '清理播放状态。' })
    vi.unstubAllGlobals()
  })

  it('plays the provided audio source without touching browser TTS', () => {
    const { audioConstructor, play } = installMockAudio()

    const didStart = speakChinese({
      text: '你好，我来旅游。',
      audioSrc: '/audio/self-intro/line-01.mp3',
    })

    expect(didStart).toBe(true)
    expect(audioConstructor).toHaveBeenCalled()
    expect(play).toHaveBeenCalledTimes(1)
    expect(speak).not.toHaveBeenCalled()
  })

  it('retries with backoff when audio play rejects, then gives up silently', async () => {
    vi.useFakeTimers()
    const rejectPlay = vi.fn().mockRejectedValue(new Error('decode failed'))
    installMockAudio(rejectPlay)

    speakChinese({
      text: '请问，地铁票在哪儿买？',
      audioSrc: '/audio/ask-directions/line-01.mp3',
    })

    await Promise.resolve()
    expect(rejectPlay).toHaveBeenCalledTimes(1)
    expect(speak).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(200)
    expect(rejectPlay).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(500)
    expect(rejectPlay).toHaveBeenCalledTimes(3)

    await vi.advanceTimersByTimeAsync(1000)
    expect(rejectPlay).toHaveBeenCalledTimes(4)

    expect(speak).not.toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('retries via the same audio element without recreating it', async () => {
    vi.useFakeTimers()
    const rejectPlay = vi.fn().mockRejectedValue(new Error('decode failed'))
    const { audioConstructor, instances } = installMockAudio(rejectPlay)

    speakChinese({
      text: '你好。',
      audioSrc: '/audio/daily-greetings/line-01.mp3',
    })

    await vi.advanceTimersByTimeAsync(200)
    expect(audioConstructor).toHaveBeenCalledTimes(1)
    expect(instances).toHaveLength(1)
    expect(instances[0].play).toHaveBeenCalledTimes(2)
    expect(instances[0].src).toBe('/audio/daily-greetings/line-01.mp3')

    vi.useRealTimers()
  })

  it('tries generated audio, original fallback audio, then gives up silently', async () => {
    vi.useFakeTimers()
    const play = vi.fn().mockRejectedValue(new Error('decode failed'))
    const { audioConstructor, instances } = installMockAudio(play)

    speakChinese({
      text: '你好，我来旅游。',
      audioSrc: '/voice/generated/self-intro/line-01.mp3',
      fallbackAudioSrc: '/audio/self-intro/line-01.mp3',
    })

    for (let i = 0; i < 3; i += 1) {
      await vi.advanceTimersByTimeAsync([200, 500, 1000][i])
    }

    expect(audioConstructor).toHaveBeenNthCalledWith(1, '')
    expect(audioConstructor).toHaveBeenNthCalledWith(2, '')
    expect(instances).toHaveLength(2)
    expect(instances[0].src).toBe('/voice/generated/self-intro/line-01.mp3')
    expect(instances[1].src).toBe('/audio/self-intro/line-01.mp3')
    expect(speak).not.toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('falls back to browser TTS when no audio source is available', () => {
    const didStart = speakChinese({ text: '我要一瓶水。' })

    expect(didStart).toBe(true)
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0]![0]).toBeInstanceOf(MockUtterance)
  })

  it('does not fall back to browser TTS when no audio source and no text are available', () => {
    const didStart = speakChinese({ text: '' })

    expect(didStart).toBe(false)
    expect(speak).not.toHaveBeenCalled()
  })

  it('stops previous audio when switching playback', () => {
    const { audioConstructor, instances } = installMockAudio()

    speakChinese({ text: '第一段音频。', audioSrc: '/audio/self-intro/line-01.mp3' })
    instances[0].currentTime = 12

    speakChinese({ text: '第二段音频。', audioSrc: '/audio/self-intro/line-02.mp3' })

    expect(audioConstructor).toHaveBeenCalledTimes(2)
    expect(instances[0].pause).toHaveBeenCalledTimes(1)
    expect(instances[0].removeAttribute).toHaveBeenCalledWith('src')
    expect(instances[0].currentTime).toBe(0)
  })

  it('does not retry a superseded playback after a new sentence starts', async () => {
    vi.useFakeTimers()
    const play = vi
      .fn()
      .mockRejectedValueOnce(new Error('interrupted'))
      .mockResolvedValueOnce(undefined)
    const { instances } = installMockAudio(play)

    speakChinese({
      text: '第一段音频。',
      audioSrc: '/audio/self-intro/line-01.mp3',
    })

    speakChinese({
      text: '第二段音频。',
      audioSrc: '/audio/self-intro/line-02.mp3',
    })

    await vi.advanceTimersByTimeAsync(200)
    expect(play).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(5000)
    expect(play).toHaveBeenCalledTimes(2)
    expect(speak).not.toHaveBeenCalled()
    expect(instances[1].src).toBe('/audio/self-intro/line-02.mp3')

    vi.useRealTimers()
  })

  it('fires onEnd when playback finishes naturally', () => {
    const { instances } = installMockAudio()
    const onEnd = vi.fn()

    speakChinese({
      text: '你好。',
      audioSrc: '/audio/daily-greetings/line-01.mp3',
      onEnd,
    })

    expect(onEnd).not.toHaveBeenCalled()
    instances[0].listeners.ended()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('fires onEnd when a newer playback interrupts the current one', () => {
    const { instances } = installMockAudio()
    const firstEnd = vi.fn()
    const secondEnd = vi.fn()

    speakChinese({
      text: '第一段音频。',
      audioSrc: '/audio/self-intro/line-01.mp3',
      onEnd: firstEnd,
    })

    speakChinese({
      text: '第二段音频。',
      audioSrc: '/audio/self-intro/line-02.mp3',
      onEnd: secondEnd,
    })

    expect(firstEnd).toHaveBeenCalledTimes(1)
    expect(secondEnd).not.toHaveBeenCalled()
    expect(instances[0].listeners.ended).toBeDefined()
  })

  it('fires onEnd after all retries are exhausted without a fallback', async () => {
    vi.useFakeTimers()
    const rejectPlay = vi.fn().mockRejectedValue(new Error('decode failed'))
    installMockAudio(rejectPlay)
    const onEnd = vi.fn()

    speakChinese({
      text: '请问，地铁票在哪儿买？',
      audioSrc: '/audio/ask-directions/line-01.mp3',
      onEnd,
    })

    await vi.advanceTimersByTimeAsync(200)
    await vi.advanceTimersByTimeAsync(500)
    await vi.advanceTimersByTimeAsync(1000)

    expect(onEnd).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
