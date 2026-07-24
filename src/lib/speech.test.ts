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
    pause: ReturnType<typeof vi.fn>
    play: typeof play
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
    pause = vi.fn()
    play = play
    src: string

    constructor(src: string) {
      audioConstructor(src)
      this.src = src
      instances.push(this)
    }
  }

  vi.stubGlobal('Audio', MockAudio)

  return { audioConstructor, instances, play }
}

describe('speakChinese', () => {
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

  afterEach(() => {
    speakChinese({ text: '清理播放状态。' })
    vi.unstubAllGlobals()
  })

  it('plays the provided audio source before falling back to browser TTS', () => {
    const { audioConstructor, play } = installMockAudio()

    const didStart = speakChinese({
      text: '你好，我来旅游。',
      audioSrc: '/audio/self-intro/line-01.mp3',
    })

    expect(didStart).toBe(true)
    expect(audioConstructor).toHaveBeenCalledWith('/audio/self-intro/line-01.mp3')
    expect(play).toHaveBeenCalledTimes(1)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(speak).not.toHaveBeenCalled()
  })

  it('falls back to browser TTS when audio play rejects', async () => {
    installMockAudio(vi.fn().mockRejectedValue(new Error('decode failed')))

    const didStart = speakChinese({
      text: '请问，地铁票在哪儿买？',
      audioSrc: '/audio/ask-directions/line-01.mp3',
    })
    await Promise.resolve()

    expect(didStart).toBe(true)
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0]?.[0]).toMatchObject({
      text: '请问，地铁票在哪儿买？',
      lang: 'zh-CN',
      rate: 0.9,
    })
  })

  it('falls back to browser TTS when audio emits an error', () => {
    const { instances } = installMockAudio()

    const didStart = speakChinese({
      text: '我有预订。',
      audioSrc: '/audio/order-food/line-01.mp3',
    })

    instances[0].listeners.error()

    expect(didStart).toBe(true)
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0]?.[0]).toMatchObject({
      text: '我有预订。',
      lang: 'zh-CN',
      rate: 0.9,
    })
  })

  it('uses browser TTS when no audio source is available', () => {
    const didStart = speakChinese({ text: '我要一瓶水。' })

    expect(didStart).toBe(true)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0]?.[0]).toMatchObject({
      text: '我要一瓶水。',
      lang: 'zh-CN',
      rate: 0.9,
    })
  })

  it('cancels queued speech and stops previous audio when switching playback', () => {
    const { audioConstructor, instances, play } = installMockAudio()

    speakChinese({ text: '旧的语音。' })
    speakChinese({ text: '第一段音频。', audioSrc: '/audio/self-intro/line-01.mp3' })
    instances[0].currentTime = 12

    speakChinese({ text: '第二段音频。', audioSrc: '/audio/self-intro/line-02.mp3' })

    expect(audioConstructor).toHaveBeenNthCalledWith(1, '/audio/self-intro/line-01.mp3')
    expect(audioConstructor).toHaveBeenNthCalledWith(2, '/audio/self-intro/line-02.mp3')
    expect(instances[0].pause).toHaveBeenCalledTimes(1)
    expect(instances[0].currentTime).toBe(0)
    expect(cancel).toHaveBeenCalledTimes(3)
    expect(play).toHaveBeenCalledTimes(2)
  })
})
