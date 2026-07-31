import { describe, expect, it, vi } from 'vitest'

import {
  VoiceStorageNotConfiguredError,
  VoiceStorageWriteError,
  createVercelBlobVoiceStorage,
  createVoiceStorageFromEnv,
} from './storage'

async function bodyToBuffer(body: unknown) {
  if (Buffer.isBuffer(body)) {
    return body
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body)
  }

  if (body instanceof ArrayBuffer) {
    return Buffer.from(body)
  }

  if (body instanceof Blob) {
    return Buffer.from(await body.arrayBuffer())
  }

  throw new Error(`Unsupported body type: ${typeof body}`)
}

describe('VercelBlobVoiceStorage', () => {
  it('saves base64 voice samples to Vercel Blob with an audio content type', async () => {
    const put = vi.fn(async (pathname: string) => ({
      url: `https://blob.example/${pathname}`,
      pathname,
    }))
    const storage = createVercelBlobVoiceStorage(
      { VOICE_BLOB_PREFIX: 'voice', VOICE_BLOB_ACCESS: 'public' },
      { put },
    )

    const result = await storage.saveVoiceSample({
      sampleName: 'Authorized Mandarin sample',
      sampleAudioBase64: Buffer.from('riff bytes').toString('base64'),
      sampleAudioContentType: 'audio/wav',
      sampleAudioFilename: 'authorized-sample.wav',
    })

    expect(result.sampleUrl).toMatch(/^https:\/\/blob\.example\/voice\/samples\//)
    expect(put).toHaveBeenCalledOnce()
    const [pathname, body, options] = put.mock.calls[0]!
    expect(pathname).toMatch(/^voice\/samples\/authorized-mandarin-sample-/)
    expect(pathname).toMatch(/\.wav$/)
    expect(await bodyToBuffer(body)).toEqual(Buffer.from('riff bytes'))
    expect(options).toMatchObject({
      access: 'public',
      contentType: 'audio/wav',
      addRandomSuffix: true,
    })
  })

  it('wraps Vercel Blob sample upload failures in a safe storage error', async () => {
    const put = vi.fn(async () => {
      throw new Error('raw blob token or transport failure')
    })
    const storage = createVercelBlobVoiceStorage(
      { VOICE_BLOB_PREFIX: 'voice', VOICE_BLOB_ACCESS: 'public', BLOB_READ_WRITE_TOKEN: 'test-token' },
      { put },
    )

    await expect(storage.saveVoiceSample({
      sampleName: 'Authorized Mandarin sample',
      sampleAudioBase64: Buffer.from('riff bytes').toString('base64'),
      sampleAudioContentType: 'audio/wav',
      sampleAudioFilename: 'authorized-sample.wav',
    })).rejects.toMatchObject({
      name: 'VoiceStorageWriteError',
      message: 'Vercel Blob voice sample upload failed',
    } satisfies Partial<VoiceStorageWriteError>)
  })

  it('surfaces safe Vercel Blob SDK upload details while redacting token-shaped values', async () => {
    const put = vi.fn(async () => {
      throw new Error('Vercel Blob: Access denied for vercel_blob_rw_secret_store_token.')
    })
    const storage = createVercelBlobVoiceStorage(
      { VOICE_BLOB_PREFIX: 'voice', VOICE_BLOB_ACCESS: 'public', BLOB_READ_WRITE_TOKEN: 'test-token' },
      { put },
    )

    await expect(storage.saveVoiceSample({
      sampleName: 'Authorized Mandarin sample',
      sampleAudioBase64: Buffer.from('riff bytes').toString('base64'),
      sampleAudioContentType: 'audio/wav',
      sampleAudioFilename: 'authorized-sample.wav',
    })).rejects.toMatchObject({
      name: 'VoiceStorageWriteError',
      message: 'Vercel Blob voice sample upload failed: Access denied for [redacted].',
    } satisfies Partial<VoiceStorageWriteError>)
  })

  it('saves generated audio under the target storage key and returns the Blob URL', async () => {
    const put = vi.fn(async (pathname: string) => ({
      url: `https://blob.example/${pathname}`,
      pathname,
    }))
    const storage = createVercelBlobVoiceStorage(
      { VOICE_BLOB_PREFIX: 'voice', VOICE_BLOB_ACCESS: 'public' },
      { put },
    )

    const result = await storage.saveGeneratedAudio({
      profileId: 'ChineseEntry_profile_01',
      target: {
        lessonId: 'self-introduction',
        targetId: 'dialogue:line-01',
        moduleType: 'dialogue',
        originalAudio: '/audio/self-intro/line-01.mp3',
        storageKey: 'audio/self-intro/line-01.mp3',
        language: 'zh-CN',
      },
      audioBase64: Buffer.from('mp3 bytes').toString('base64'),
      contentType: 'audio/mpeg',
    })

    expect(result.audioUrl).toBe('https://blob.example/voice/generated/ChineseEntry_profile_01/audio/self-intro/line-01.mp3')
    expect(put).toHaveBeenCalledOnce()
    const [pathname, body, options] = put.mock.calls[0]!
    expect(pathname).toBe('voice/generated/ChineseEntry_profile_01/audio/self-intro/line-01.mp3')
    expect(await bodyToBuffer(body)).toEqual(Buffer.from('mp3 bytes'))
    expect(options).toMatchObject({
      access: 'public',
      contentType: 'audio/mpeg',
      allowOverwrite: true,
    })
  })

  it('keeps storage disabled unless the env opts into Vercel Blob', async () => {
    const storage = createVoiceStorageFromEnv({})

    await expect(storage.saveVoiceSample({ sampleAudioUrl: 'https://example.com/sample.wav' })).rejects.toBeInstanceOf(
      VoiceStorageNotConfiguredError,
    )
  })
})
