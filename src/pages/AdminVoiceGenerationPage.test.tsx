import '@testing-library/jest-dom/vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { renderRoute } from '../test/renderRoute'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

function lessonSummaries() {
  return course.lessons.map((lesson, index) => ({
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: index + 1,
    enabled: true,
    draftChangedModuleCount: 0,
  }))
}

function lessonSnapshot(lesson: LessonContent) {
  return {
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: course.lessons.findIndex((item) => item.id === lesson.id) + 1,
    enabled: true,
    draftLesson: lesson,
    publishedLesson: lesson,
    modules: [
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'pronunciation',
      'hanziRecognition',
      'practice',
      'reviewCards',
      'shortInput',
    ].map((moduleType, index) => ({
      moduleType,
      draftRevisionId: 200 + index * 2,
      publishedRevisionId: 199 + index * 2,
      hasUnpublishedChanges: false,
    })),
    publishedHistory: {
      lessonMeta: [],
      dialogue: [],
      sentencePatterns: [],
      vocabulary: [],
      pronunciation: [],
      hanziRecognition: [],
      practice: [],
      reviewCards: [],
      shortInput: [],
    },
  }
}

function installBatchFetchMock() {
  vi.mocked(fetch).mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'

    if (url === '/api/admin/content/lessons') {
      return jsonResponse(lessonSummaries())
    }

    if (url.startsWith('/api/admin/content/lessons?lessonId=')) {
      const lessonId = new URL(`https://test.local${url}`).searchParams.get('lessonId')
      const lesson = course.lessons.find((item) => item.id === lessonId)
      return jsonResponse(lessonSnapshot(lesson ?? course.lessons[0]!))
    }

    if (url === '/api/admin/voice/samples' && method === 'POST') {
      return jsonResponse({ profileId: 'profile_batch_authorized' })
    }

    if (url === '/api/admin/voice/generate' && method === 'POST') {
      const body = JSON.parse(String(init?.body ?? '{}')) as {
        target: { targetId: string; storageKey: string; language: string; originalAudio: string }
      }
      return jsonResponse({ audioUrl: `/voice/generated/${body.target.storageKey}` })
    }

    if (url === '/api/admin/content/draft' && method === 'PUT') {
      const body = JSON.parse(String(init?.body ?? '{}')) as { lessonId: string }
      const lesson = course.lessons.find((item) => item.id === body.lessonId)
      return jsonResponse(lessonSnapshot(lesson ?? course.lessons[0]!))
    }

    return jsonResponse({ error: `Unexpected request: ${method} ${url}` }, { status: 500 })
  })
}


const originalMediaDevices = window.navigator.mediaDevices
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

function stubMediaDevices(mediaDevices: MediaDevices | undefined) {
  Object.defineProperty(window.navigator, 'mediaDevices', {
    configurable: true,
    value: mediaDevices,
  })
}

function restoreBrowserRecordingGlobals() {
  Object.defineProperty(window.navigator, 'mediaDevices', {
    configurable: true,
    value: originalMediaDevices,
  })

  if (originalCreateObjectURL) {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: originalCreateObjectURL })
  } else {
    delete (URL as unknown as { createObjectURL?: unknown }).createObjectURL
  }

  if (originalRevokeObjectURL) {
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: originalRevokeObjectURL })
  } else {
    delete (URL as unknown as { revokeObjectURL?: unknown }).revokeObjectURL
  }
}

function installObjectUrlMock() {
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: vi.fn(() => 'blob:recorded-mandarin-sample'),
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: vi.fn(),
  })
}

function installMediaRecorderMock() {
  const stopTrack = vi.fn()
  const getUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: stopTrack }],
  })

  class MockMediaRecorder {
    readonly mimeType = 'audio/webm'
    state: RecordingState = 'inactive'
    ondataavailable: ((event: { data: Blob }) => void) | null = null
    onstop: (() => void) | null = null
    onerror: ((event: { error?: Error }) => void) | null = null

    constructor(readonly stream: MediaStream) {}

    start() {
      this.state = 'recording'
    }

    stop() {
      this.state = 'inactive'
      this.ondataavailable?.({ data: new Blob(['recorded mandarin sample'], { type: 'audio/webm' }) })
      this.onstop?.()
    }
  }

  vi.stubGlobal('MediaRecorder', MockMediaRecorder)
  stubMediaDevices({ getUserMedia } as unknown as MediaDevices)

  return { getUserMedia, stopTrack }
}

describe('AdminVoiceGenerationPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    window.sessionStorage.clear()
    vi.unstubAllGlobals()
    restoreBrowserRecordingGlobals()
    vi.restoreAllMocks()
  })

  it('loads all course snapshots and shows the 179 existing zh-CN audio targets', async () => {
    installBatchFetchMock()

    renderRoute('/admin/voice')

    expect(screen.getByTestId('admin-voice-loading-shell')).toBeVisible()
    expect(await screen.findByRole('heading', { level: 1, name: /batch voice generation/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /179 audio targets/i })).toBeVisible()
    expect(screen.getByText(/zh-cn only/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /generate all pending/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()
    expect(screen.queryByText(/voice replacement/i)).not.toBeInTheDocument()
  })

  it('shows recorder guidance and gates microphone capture behind consent', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })
    expect(screen.getByRole('heading', { level: 2, name: /record voice sample/i })).toBeVisible()
    expect(screen.getByText(/recommended mandarin prompt/i)).toBeVisible()
    expect(screen.getByText(/you may read your own mandarin content/i)).toBeVisible()
    expect(screen.getByText(/speak clearly in a quiet room/i)).toBeVisible()

    const startRecordingButton = screen.getByRole('button', { name: /start recording/i })
    expect(startRecordingButton).toBeDisabled()

    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    expect(startRecordingButton).toBeEnabled()
  })

  it('records a browser microphone sample and submits it as base64 when creating the profile', async () => {
    const user = userEvent.setup()
    const { getUserMedia, stopTrack } = installMediaRecorderMock()
    installObjectUrlMock()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: /stop recording/i }))

    expect(await screen.findByLabelText(/preview recorded voice sample/i)).toHaveAttribute('src', 'blob:recorded-mandarin-sample')
    expect(stopTrack).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))

    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(true)
    })
    const sampleCall = vi.mocked(fetch).mock.calls.find((call) => call[0] === '/api/admin/voice/samples')!
    const sampleBody = JSON.parse(String(sampleCall[1]!.body)) as {
      consentConfirmed?: boolean
      sampleAudioBase64?: string
      sampleAudioUrl?: string
    }
    expect(sampleBody.consentConfirmed).toBe(true)
    expect(sampleBody.sampleAudioBase64).toMatch(/^cmVjb3JkZWQgbWFuZGFyaW4gc2FtcGxl/)
    expect(sampleBody.sampleAudioUrl).toBeUndefined()
    expect((await screen.findAllByText(/profile id: profile_batch_authorized/i))[0]).toBeVisible()
  })

  it('shows a microphone permission error without enabling profile creation', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('MediaRecorder', class {})
    stubMediaDevices({
      getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as MediaDevices)
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    expect(await screen.findByText(/unable to access microphone/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()
  })

  it('requires admin auth like the rest of the admin workspace', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ error: 'Admin authentication required' }, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse(lessonSummaries()))
    for (const lesson of course.lessons) {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(lessonSnapshot(lesson)))
    }

    renderRoute('/admin/voice')

    expect(await screen.findByRole('heading', { level: 2, name: /admin sign in required/i })).toBeVisible()
    await user.type(screen.getByLabelText(/admin username/i), 'editor')
    await user.type(screen.getByLabelText(/admin password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /unlock content admin/i }))

    expect(await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })).toBeVisible()
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/lessons',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Basic ZWRpdG9yOnNlY3JldA==' }),
      }),
    )
  })

  it('creates a profile, generates pending rows, requires preview approval, and applies grouped draft patches', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/authorized-sample.wav')
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()

    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))
    expect((await screen.findAllByText(/profile id: profile_batch_authorized/i))[0]).toBeVisible()

    await user.click(screen.getByRole('button', { name: /generate all pending/i }))
    expect((await screen.findAllByText(/179 generated/i))[0]).toBeVisible()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()

    const firstRow = screen.getByTestId(`voice-target-row-dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`)
    await user.click(within(firstRow).getByLabelText(/previewed and approve/i))
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /apply approved to drafts/i }))

    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/content/draft')).toBe(true)
    })
    const draftCall = vi.mocked(fetch).mock.calls.find((call) => call[0] === '/api/admin/content/draft')!
    const draftBody = JSON.parse(String(draftCall[1]!.body)) as {
      lessonId: string
      moduleType: string
      payload: typeof course.lessons[0]['dialogue']
    }
    expect(draftBody.lessonId).toBe('self-intro')
    expect(draftBody.moduleType).toBe('dialogue')
    expect(draftBody.payload.lines[0]!.audio).toBe('/voice/generated/audio/self-intro/line-01.mp3')
    expect(draftBody.payload.lines[0]!.audioFallback).toBe('/audio/self-intro/line-01.mp3')
    expect(draftBody.payload.lines[1]!.audio).toBe('/audio/self-intro/line-02.mp3')
    expect(await screen.findByText(/applied 1 approved target/i)).toBeVisible()
  })

  it('marks provider failures per row without changing original audio targets', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockImplementation(async (input: RequestInfo | URL, _init?: RequestInit) => {
      const url = String(input)
      if (url === '/api/admin/content/lessons') return jsonResponse(lessonSummaries())
      if (url.startsWith('/api/admin/content/lessons?lessonId=')) {
        const lessonId = new URL(`https://test.local${url}`).searchParams.get('lessonId')
        return jsonResponse(lessonSnapshot(course.lessons.find((lesson) => lesson.id === lessonId) ?? course.lessons[0]!))
      }
      if (url === '/api/admin/voice/samples') return jsonResponse({ profileId: 'profile_batch_authorized' })
      if (url === '/api/admin/voice/generate') {
        return jsonResponse({ error: 'Voice cloning provider is not configured' }, { status: 503 })
      }
      return jsonResponse({ error: `Unexpected request: ${String(input)}` }, { status: 500 })
    })

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /179 audio targets/i })
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/authorized-sample.wav')
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))
    await user.click(await screen.findByRole('button', { name: /generate all pending/i }))

    expect((await screen.findAllByText(/179 failed/i))[0]).toBeVisible()
    const firstRow = screen.getByTestId(`voice-target-row-dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`)
    expect(within(firstRow).getByText(/voice cloning provider is not configured/i)).toBeVisible()
    expect(within(firstRow).getByText('/audio/self-intro/line-01.mp3')).toBeVisible()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()
  })
})
