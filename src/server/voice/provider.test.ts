import { describe, expect, it, vi } from 'vitest'

import {
  VoiceProviderNotConfiguredError,
  VoiceProviderRequestError,
  createMiniMaxVoiceCloneProvider,
  createVoiceCloneProviderFromEnv,
  createVolcengineVoiceCloneProvider,
  isVoiceProviderConfigured,
} from './provider'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

function streamJsonLinesResponse(chunks: unknown[], init: ResponseInit = {}) {
  const encoder = new TextEncoder()

  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`))
      }
      controller.close()
    },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('voice provider adapters', () => {
  it('uploads a stored sample and creates a MiniMax cloned voice profile', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)

      if (url === 'https://blob.example/voice/samples/sample.wav') {
        return new Response(Buffer.from('wav sample'), { headers: { 'Content-Type': 'audio/wav' } })
      }

      if (url === 'https://api.minimax.io/v1/files/upload') {
        expect(init?.method).toBe('POST')
        expect(init?.headers).toEqual(expect.objectContaining({ Authorization: 'Bearer test-minimax-key' }))
        expect(init?.body).toBeInstanceOf(FormData)
        const form = init?.body as FormData
        expect(form.get('purpose')).toBe('voice_clone')
        expect(form.get('file')).toBeInstanceOf(Blob)
        return jsonResponse({
          file: { file_id: 123, bytes: 10, created_at: 1, filename: 'voice-sample.wav', purpose: 'voice_clone' },
          base_resp: { status_code: 0, status_msg: 'success' },
        })
      }

      if (url === 'https://api.minimax.io/v1/voice_clone') {
        expect(init?.method).toBe('POST')
        const body = JSON.parse(String(init?.body ?? '{}')) as { file_id?: number; voice_id?: string; language_boost?: string }
        expect(body.file_id).toBe(123)
        expect(body.voice_id).toMatch(/^ChineseEntry_/)
        expect(body.language_boost).toBe('Chinese')
        return jsonResponse({ base_resp: { status_code: 0, status_msg: 'success' } })
      }

      throw new Error(`Unexpected fetch: ${url}`)
    }) as unknown as typeof fetch
    const provider = createMiniMaxVoiceCloneProvider(
      {
        MINIMAX_API_KEY: 'test-minimax-key',
        MINIMAX_VOICE_ID_PREFIX: 'ChineseEntry',
      },
      { fetch: fetchMock, randomId: () => 'abc123' },
    )

    const result = await provider.createVoiceProfile({
      sampleName: 'Authorized Mandarin sample',
      sampleUrl: 'https://blob.example/voice/samples/sample.wav',
    })

    expect(result.profileId).toBe('ChineseEntry_abc123')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('generates replacement audio with MiniMax T2A and converts returned hex to base64', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe('https://api.minimax.io/v1/t2a_v2')
      expect(init?.method).toBe('POST')
      expect(init?.headers).toEqual(expect.objectContaining({ Authorization: 'Bearer test-minimax-key' }))
      const body = JSON.parse(String(init?.body ?? '{}')) as {
        model?: string
        text?: string
        output_format?: string
        language_boost?: string
        voice_setting?: { voice_id?: string; speed?: number; vol?: number; pitch?: number }
        audio_setting?: { format?: string; sample_rate?: number; bitrate?: number; channel?: number }
      }
      expect(body).toMatchObject({
        model: 'speech-2.8-turbo',
        text: '你好',
        stream: false,
        output_format: 'hex',
        language_boost: 'Chinese',
        voice_setting: { voice_id: 'ChineseEntry_abc123', speed: 1, vol: 1, pitch: 0 },
        audio_setting: { format: 'mp3', sample_rate: 32000, bitrate: 128000, channel: 1 },
      })

      return jsonResponse({
        data: { audio: Buffer.from('mp3 bytes').toString('hex'), status: 2 },
        base_resp: { status_code: 0, status_msg: 'success' },
      })
    }) as unknown as typeof fetch
    const provider = createMiniMaxVoiceCloneProvider({ MINIMAX_API_KEY: 'test-minimax-key' }, { fetch: fetchMock })

    const result = await provider.generateReplacementAudio({
      profileId: 'ChineseEntry_abc123',
      text: '你好',
      target: {
        lessonId: 'self-introduction',
        targetId: 'dialogue:line-01',
        moduleType: 'dialogue',
        originalAudio: '/audio/self-intro/line-01.mp3',
        storageKey: 'audio/self-intro/line-01.mp3',
        language: 'zh-CN',
      },
    })

    expect(result).toEqual({
      audioBase64: Buffer.from('mp3 bytes').toString('base64'),
      contentType: 'audio/mpeg',
    })
  })

  it('surfaces MiniMax base_resp errors without exposing the API key', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ base_resp: { status_code: 1008, status_msg: 'no balance' } })) as unknown as typeof fetch
    const provider = createMiniMaxVoiceCloneProvider({ MINIMAX_API_KEY: 'test-minimax-key' }, { fetch: fetchMock })

    await expect(
      provider.generateReplacementAudio({
        profileId: 'ChineseEntry_abc123',
        text: '你好',
        target: {
          lessonId: 'self-introduction',
          targetId: 'dialogue:line-01',
          moduleType: 'dialogue',
          originalAudio: '/audio/self-intro/line-01.mp3',
          storageKey: 'audio/self-intro/line-01.mp3',
          language: 'zh-CN',
        },
      }),
    ).rejects.toThrow('MiniMax T2A failed: no balance')
  })

  it('wraps MiniMax voice profile request failures in a safe provider error', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url === 'https://blob.example/voice/samples/sample.wav') {
        return new Response(Buffer.from('wav sample'), { headers: { 'Content-Type': 'audio/wav' } })
      }

      throw new Error('raw MiniMax transport failure')
    }) as unknown as typeof fetch
    const provider = createMiniMaxVoiceCloneProvider({ MINIMAX_API_KEY: 'test-minimax-key' }, { fetch: fetchMock })

    await expect(provider.createVoiceProfile({
      sampleName: 'Authorized Mandarin sample',
      sampleUrl: 'https://blob.example/voice/samples/sample.wav',
    })).rejects.toMatchObject({
      name: 'VoiceProviderRequestError',
      message: 'MiniMax voice clone upload failed: request failed',
    } satisfies Partial<VoiceProviderRequestError>)
  })


  it('creates a Volcengine cloned voice profile from inline sample bytes and waits until it is usable', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)

      if (url === 'https://openspeech.bytedance.com/api/v3/tts/voice_clone') {
        expect(init?.method).toBe('POST')
        expect(init?.headers).toEqual(expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Api-Key': 'test-volcengine-key',
        }))
        const body = JSON.parse(String(init?.body ?? '{}')) as {
          speaker_id?: string
          custom_speaker_id?: string
          audio?: { data?: string; format?: string }
          language?: number
        }
        expect(body).toMatchObject({
          speaker_id: 'custom_speaker_id',
          custom_speaker_id: 'ChineseEntry_abc123',
          audio: { data: Buffer.from('wav sample').toString('base64'), format: 'wav' },
          language: 0,
        })
        return jsonResponse({ speaker_id: 'ChineseEntry_abc123', status: 1 })
      }

      if (url === 'https://openspeech.bytedance.com/api/v3/tts/get_voice') {
        expect(init?.method).toBe('POST')
        const body = JSON.parse(String(init?.body ?? '{}')) as { speaker_id?: string; custom_speaker_id?: string }
        expect(body).toEqual({ speaker_id: 'custom_speaker_id', custom_speaker_id: 'ChineseEntry_abc123' })
        return jsonResponse({ speaker_id: 'ChineseEntry_abc123', status: 2 })
      }

      throw new Error(`Unexpected fetch: ${url}`)
    }) as unknown as typeof fetch
    const provider = createVolcengineVoiceCloneProvider(
      {
        VOLCENGINE_API_KEY: 'test-volcengine-key',
        VOLCENGINE_SPEAKER_ID_PREFIX: 'ChineseEntry',
        VOLCENGINE_VOICE_STATUS_POLL_INTERVAL_MS: '0',
      },
      { fetch: fetchMock, randomId: () => 'abc123', sleep: async () => undefined },
    )

    const result = await provider.createVoiceProfile({
      sampleName: 'Authorized Mandarin sample',
      sampleUrl: 'voice-storage://samples/self-intro.wav',
      sampleAudioBase64: Buffer.from('wav sample').toString('base64'),
      sampleAudioContentType: 'audio/wav',
      sampleAudioFilename: 'authorized-sample.wav',
    })

    expect(result.profileId).toBe('ChineseEntry_abc123')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reports a safe Volcengine voice training pending error when the cloned voice is not ready', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url === 'https://openspeech.bytedance.com/api/v3/tts/voice_clone') {
        return jsonResponse({ speaker_id: 'ChineseEntry_abc123', status: 1 })
      }
      if (url === 'https://openspeech.bytedance.com/api/v3/tts/get_voice') {
        return jsonResponse({ speaker_id: 'ChineseEntry_abc123', status: 1 })
      }
      throw new Error(`Unexpected fetch: ${url}`)
    }) as unknown as typeof fetch
    const provider = createVolcengineVoiceCloneProvider(
      {
        VOLCENGINE_API_KEY: 'test-volcengine-key',
        VOLCENGINE_VOICE_STATUS_POLL_ATTEMPTS: '1',
        VOLCENGINE_VOICE_STATUS_POLL_INTERVAL_MS: '0',
      },
      { fetch: fetchMock, randomId: () => 'abc123', sleep: async () => undefined },
    )

    await expect(provider.createVoiceProfile({
      sampleUrl: 'voice-storage://samples/self-intro.wav',
      sampleAudioBase64: Buffer.from('wav sample').toString('base64'),
      sampleAudioContentType: 'audio/wav',
    })).rejects.toThrow('Volcengine voice clone training is not ready: status 1')
  })

  it('generates replacement audio from Volcengine HTTP chunked TTS data chunks', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe('https://openspeech.bytedance.com/api/v3/tts/unidirectional')
      expect(init?.method).toBe('POST')
      expect(init?.headers).toEqual(expect.objectContaining({
        'Content-Type': 'application/json',
        'X-Api-Key': 'test-volcengine-key',
        'X-Api-Resource-Id': 'seed-icl-2.0',
      }))
      const body = JSON.parse(String(init?.body ?? '{}')) as {
        req_params?: {
          text?: string
          speaker?: string
          model?: string
          audio_params?: { format?: string; sample_rate?: number; bit_rate?: number }
        }
      }
      expect(body.req_params).toMatchObject({
        text: '你好',
        speaker: 'ChineseEntry_abc123',
        model: 'seed-tts-2.0-standard',
        audio_params: { format: 'mp3', sample_rate: 32000, bit_rate: 128000 },
      })
      return streamJsonLinesResponse([
        { code: 0, message: '', data: Buffer.from('mp3 ').toString('base64') },
        { code: 0, message: '', data: Buffer.from('bytes').toString('base64') },
        { code: 20000000, message: 'ok', data: null, usage: { text_words: 2 } },
      ])
    }) as unknown as typeof fetch
    const provider = createVolcengineVoiceCloneProvider({ VOLCENGINE_API_KEY: 'test-volcengine-key' }, { fetch: fetchMock })

    const result = await provider.generateReplacementAudio({
      profileId: 'ChineseEntry_abc123',
      text: '你好',
      target: {
        lessonId: 'self-introduction',
        targetId: 'dialogue:line-01',
        moduleType: 'dialogue',
        originalAudio: '/audio/self-intro/line-01.mp3',
        storageKey: 'audio/self-intro/line-01.mp3',
        language: 'zh-CN',
      },
    })

    expect(result).toEqual({ audioBase64: Buffer.from('mp3 bytes').toString('base64'), contentType: 'audio/mpeg' })
  })

  it('surfaces safe Volcengine request errors without exposing API keys', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(
      { code: 40001101, message: 'invalid api key test-volcengine-key VOLCENGINE_API_KEY=secret-value' },
      { status: 401 },
    )) as unknown as typeof fetch
    const provider = createVolcengineVoiceCloneProvider({ VOLCENGINE_API_KEY: 'test-volcengine-key' }, { fetch: fetchMock })

    await expect(provider.generateReplacementAudio({
      profileId: 'ChineseEntry_abc123',
      text: '你好',
      target: {
        lessonId: 'self-introduction',
        targetId: 'dialogue:line-01',
        moduleType: 'dialogue',
        originalAudio: '/audio/self-intro/line-01.mp3',
        storageKey: 'audio/self-intro/line-01.mp3',
        language: 'zh-CN',
      },
    })).rejects.toThrow('Volcengine TTS failed: invalid api key [redacted] VOLCENGINE_API_KEY=[redacted]')
  })

  it('keeps provider disabled unless env opts into a supported provider with required credentials', async () => {
    const provider = createVoiceCloneProviderFromEnv({ VOICE_PROVIDER: 'minimax' })

    await expect(provider.createVoiceProfile({ sampleUrl: 'https://example.com/sample.wav' })).rejects.toBeInstanceOf(
      VoiceProviderNotConfiguredError,
    )

    expect(isVoiceProviderConfigured({ VOICE_PROVIDER: 'volcengine' })).toBe(false)
    expect(isVoiceProviderConfigured({ VOICE_PROVIDER: 'volcengine', VOLCENGINE_API_KEY: 'test-volcengine-key' })).toBe(true)
  })
})
