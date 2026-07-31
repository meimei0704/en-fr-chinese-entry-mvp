import { describe, expect, it, vi } from 'vitest'

import {
  VoiceProviderNotConfiguredError,
  VoiceProviderRequestError,
  createMiniMaxVoiceCloneProvider,
  createVoiceCloneProviderFromEnv,
} from './provider'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('MiniMaxVoiceCloneProvider', () => {
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

  it('keeps provider disabled unless env opts into MiniMax with an API key', async () => {
    const provider = createVoiceCloneProviderFromEnv({ VOICE_PROVIDER: 'minimax' })

    await expect(provider.createVoiceProfile({ sampleUrl: 'https://example.com/sample.wav' })).rejects.toBeInstanceOf(
      VoiceProviderNotConfiguredError,
    )
  })
})
