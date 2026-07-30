import { describe, expect, it, vi } from 'vitest'

import { createAdminVoiceHttpHandlers, createLazyAdminVoiceHttpHandlers } from './adminHttp'
import type { VoiceCloneProvider } from './provider'
import type { VoiceStorage } from './storage'

const adminAuthEnv = {
  CONTENT_ADMIN_USERNAME: 'editor',
  CONTENT_ADMIN_PASSWORD: 'secret',
}

const adminAuthHeader = 'Basic ZWRpdG9yOnNlY3JldA=='
const batchTarget = {
  lessonId: 'self-intro',
  targetId: 'dialogue:line-1',
  moduleType: 'dialogue',
  originalAudio: '/audio/self-intro/line-01.mp3',
  storageKey: 'audio/self-intro/line-01.mp3',
  language: 'zh-CN',
}

function createResponseRecorder() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code
      return this
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value
    },
    json(value: unknown) {
      this.body = value
      return this
    },
  }
}

function createFakeServices() {
  const storage: VoiceStorage = {
    saveVoiceSample: vi.fn().mockResolvedValue({ sampleUrl: 'voice-storage://samples/self-intro.wav' }),
    saveGeneratedAudio: vi.fn().mockResolvedValue({ audioUrl: '/voice/generated/self-intro-line-01.mp3' }),
  }
  const provider: VoiceCloneProvider = {
    createVoiceProfile: vi.fn().mockResolvedValue({ profileId: 'profile_self_intro' }),
    generateReplacementAudio: vi.fn().mockResolvedValue({ audioBase64: 'ZmFrZS1tcDM=', contentType: 'audio/mpeg' }),
  }

  return { provider, storage }
}

describe('admin voice HTTP handlers', () => {
  it('rejects unauthenticated voice requests with admin-only 401 behavior', async () => {
    const handlers = createAdminVoiceHttpHandlers(createFakeServices(), adminAuthEnv)

    const browserResponse = createResponseRecorder()
    await handlers.samples({ method: 'POST', headers: {}, body: { consentConfirmed: true } }, browserResponse)
    expect(browserResponse.statusCode).toBe(401)
    expect(browserResponse.headers['WWW-Authenticate']).toContain('Basic')

    const spaResponse = createResponseRecorder()
    await handlers.generate(
      {
        method: 'POST',
        headers: { 'x-content-admin-client': 'spa' },
        body: { profileId: 'profile_self_intro', text: '你好', target: batchTarget },
      },
      spaResponse,
    )
    expect(spaResponse.statusCode).toBe(401)
    expect(spaResponse.headers['WWW-Authenticate']).toBeUndefined()
    expect(spaResponse.body).toEqual({ error: 'Admin authentication required' })
  })

  it('requires explicit consent before accepting a voice sample', async () => {
    const { provider, storage } = createFakeServices()
    const handlers = createAdminVoiceHttpHandlers({ provider, storage }, adminAuthEnv)
    const response = createResponseRecorder()

    await handlers.samples(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: { consentConfirmed: false, sampleName: '崔秋本人授权样本', sampleAudioBase64: 'ZmFrZQ==' },
      },
      response,
    )

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Voice sample consent must be confirmed before upload' })
    expect(storage.saveVoiceSample).not.toHaveBeenCalled()
    expect(provider.createVoiceProfile).not.toHaveBeenCalled()
  })


  it('requires explicit consent before generating replacement audio for an existing profile', async () => {
    const { provider, storage } = createFakeServices()
    const handlers = createAdminVoiceHttpHandlers({ provider, storage }, adminAuthEnv)
    const response = createResponseRecorder()

    await handlers.generate(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: {
          profileId: 'profile_self_intro',
          text: '你好',
          target: batchTarget,
        },
      },
      response,
    )

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Voice generation consent must be confirmed before replacement audio is created' })
    expect(provider.generateReplacementAudio).not.toHaveBeenCalled()
    expect(storage.saveGeneratedAudio).not.toHaveBeenCalled()
  })


  it('requires batch target metadata before generating audio', async () => {
    const { provider, storage } = createFakeServices()
    const handlers = createAdminVoiceHttpHandlers({ provider, storage }, adminAuthEnv)
    const response = createResponseRecorder()

    await handlers.generate(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: {
          consentConfirmed: true,
          profileId: 'profile_self_intro',
          text: '你好',
          target: { lessonId: 'self-intro', targetId: 'dialogue:line-1', moduleType: 'dialogue' },
        },
      },
      response,
    )

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Missing target.originalAudio' })
    expect(provider.generateReplacementAudio).not.toHaveBeenCalled()
    expect(storage.saveGeneratedAudio).not.toHaveBeenCalled()
  })

  it('returns clear 503 responses when runtime voice provider or storage is not configured', async () => {
    const handlers = createLazyAdminVoiceHttpHandlers(adminAuthEnv)

    const sampleResponse = createResponseRecorder()
    await handlers.samples(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: { consentConfirmed: true, sampleName: 'Authorized sample', sampleAudioBase64: 'ZmFrZQ==' },
      },
      sampleResponse,
    )
    expect(sampleResponse.statusCode).toBe(503)
    expect(sampleResponse.body).toEqual({ error: 'Voice sample storage is not configured' })

    const generateResponse = createResponseRecorder()
    await handlers.generate(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: {
          consentConfirmed: true,
          profileId: 'profile_self_intro',
          text: '你好',
          target: batchTarget,
        },
      },
      generateResponse,
    )
    expect(generateResponse.statusCode).toBe(503)
    expect(generateResponse.body).toEqual({ error: 'Voice cloning provider is not configured' })
  })

  it('creates a profile and generated audio URL with injected storage and provider adapters', async () => {
    const { provider, storage } = createFakeServices()
    const handlers = createAdminVoiceHttpHandlers({ provider, storage }, adminAuthEnv)

    const sampleResponse = createResponseRecorder()
    await handlers.samples(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: { consentConfirmed: true, sampleName: '崔秋本人授权样本', sampleAudioBase64: 'ZmFrZQ==' },
      },
      sampleResponse,
    )
    expect(sampleResponse.statusCode).toBe(200)
    expect(sampleResponse.body).toEqual({ profileId: 'profile_self_intro' })
    expect(storage.saveVoiceSample).toHaveBeenCalledWith(
      expect.objectContaining({ sampleName: '崔秋本人授权样本', sampleAudioBase64: 'ZmFrZQ==' }),
    )
    expect(provider.createVoiceProfile).toHaveBeenCalledWith(
      expect.objectContaining({ sampleUrl: 'voice-storage://samples/self-intro.wav' }),
    )

    const generateResponse = createResponseRecorder()
    await handlers.generate(
      {
        method: 'POST',
        headers: { authorization: adminAuthHeader },
        body: {
          consentConfirmed: true,
          profileId: 'profile_self_intro',
          text: '你好，我叫崔秋',
          target: batchTarget,
        },
      },
      generateResponse,
    )

    expect(generateResponse.statusCode).toBe(200)
    expect(generateResponse.body).toEqual({ audioUrl: '/voice/generated/self-intro-line-01.mp3' })
    expect(provider.generateReplacementAudio).toHaveBeenCalledWith(
      expect.objectContaining({
        profileId: 'profile_self_intro',
        text: '你好，我叫崔秋',
        target: batchTarget,
      }),
    )
    expect(storage.saveGeneratedAudio).toHaveBeenCalledWith(
      expect.objectContaining({
        profileId: 'profile_self_intro',
        target: batchTarget,
        audioBase64: 'ZmFrZS1tcDM=',
        contentType: 'audio/mpeg',
      }),
    )
  })
})
