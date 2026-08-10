import '@testing-library/jest-dom/vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import type { LessonContent } from '../content/types'
import { renderRoute } from '../test/renderRoute'

const profileIdStorageKey = 'adminVoiceGeneration.profileId'
const existingProfileIdFixture = 'ChineseEntry_existing_profile_id'

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
      'practice',
      'reviewCards',
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
      practice: [],
      reviewCards: [],
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

function installEmptyBatchFetchMock() {
  vi.mocked(fetch).mockImplementation(async (input: RequestInfo | URL) => {
    const url = String(input)

    if (url === '/api/admin/content/lessons') {
      return jsonResponse([])
    }

    return jsonResponse({ error: `Unexpected request: ${url}` }, { status: 500 })
  })
}

async function openCreateProfilePanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText(/create new profile/i))
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

function installAudioContextMock() {
  const channel = new Float32Array(16_000)
  channel.fill(0.1)

  class MockAudioContext {
    readonly sampleRate = 16_000
    readonly decodeAudioData = vi.fn(async () => ({
      length: channel.length,
      numberOfChannels: 1,
      sampleRate: 16_000,
      getChannelData: () => channel,
    }))
    readonly close = vi.fn()
  }

  vi.stubGlobal('AudioContext', MockAudioContext)
}

function installMediaRecorderMock(chunkText = 'recorded mandarin sample '.repeat(80)) {
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
      this.ondataavailable?.({ data: new Blob([chunkText], { type: 'audio/webm' }) })
      this.onstop?.()
    }
  }

  vi.stubGlobal('MediaRecorder', MockMediaRecorder)
  stubMediaDevices({ getUserMedia } as unknown as MediaDevices)

  return { getUserMedia, stopTrack }
}

function installPendingMediaRecorderMock() {
  const getUserMedia = vi.fn(() => new Promise<MediaStream>(() => undefined))

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
      this.onstop?.()
    }
  }

  vi.stubGlobal('MediaRecorder', MockMediaRecorder)
  stubMediaDevices({ getUserMedia } as unknown as MediaDevices)

  return { getUserMedia }
}

describe('AdminVoiceGenerationPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    vi.unstubAllGlobals()
    restoreBrowserRecordingGlobals()
    vi.restoreAllMocks()
  })

  it('loads all course snapshots and shows the 368 visible zh-CN audio targets', async () => {
    installBatchFetchMock()

    renderRoute('/admin/voice')

    expect(screen.getByTestId('admin-voice-loading-shell')).toBeVisible()
    expect(await screen.findByRole('heading', { level: 1, name: /original pronunciation is active/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /368 audio targets/i })).toBeVisible()
    expect(screen.getByText(/current course audio uses original files/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /generate all pending/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()
    expect(screen.getByText(/optional cloned voice tools/i)).toBeVisible()
  })

  it('shows 368 targets from the five visible modules while retaining generic pronunciation copy', async () => {
    installBatchFetchMock()

    renderRoute('/admin/voice')

    expect(await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })).toBeVisible()
    const metrics = within(screen.getByTestId('admin-voice-metrics'))
    const targetGrid = screen.getByTestId('admin-voice-target-grid')
    expect(metrics.getByText('368', { selector: 'strong' })).toBeVisible()
    expect(targetGrid.querySelector('[data-testid^="voice-target-row-pronunciation:"]')).toBeNull()
    expect(within(targetGrid).queryByText(/^pronunciation · zh-CN$/i)).not.toBeInTheDocument()
    expect(within(targetGrid).queryByText(/· Pronunciation \d+$/i)).not.toBeInTheDocument()

    for (const targetId of [
      `dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`,
      `sentencePatterns:${course.lessons[0]!.sentencePatterns[0]!.id}`,
      `vocabulary:${course.lessons[0]!.vocabulary[0]!.id}`,
      `practice:listening:${course.lessons[0]!.practice.listening[0]!.id}`,
    ]) {
      expect(screen.getByTestId(`voice-target-row-${targetId}`)).toBeVisible()
    }

    expect(screen.getByRole('heading', { level: 1, name: /original pronunciation is active/i })).toBeVisible()
  })

  it('shows recorder guidance and gates microphone capture behind consent', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    expect(screen.getByRole('heading', { level: 3, name: /record voice sample/i })).toBeVisible()
    expect(screen.getByText(/recommended mandarin prompt/i)).toBeVisible()
    expect(screen.getByText(/you may read your own mandarin content/i)).toBeVisible()
    expect(screen.getByText(/speak clearly in a quiet room/i)).toBeVisible()

    const startRecordingButton = screen.getByRole('button', { name: /start recording/i })
    expect(startRecordingButton).toBeDisabled()
    expect(screen.getByText(/confirm authorization to enable recording/i)).toBeVisible()

    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    expect(startRecordingButton).toBeEnabled()
  })

  it('shows immediate feedback while waiting for the browser microphone prompt', async () => {
    const user = userEvent.setup()
    const { getUserMedia } = installPendingMediaRecorderMock()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(screen.getByRole('button', { name: /requesting microphone/i })).toBeDisabled()
    expect(screen.getByText(/check your browser microphone prompt/i)).toBeVisible()
  })

  it('records a browser microphone sample and submits it as base64 when creating the profile', async () => {
    const user = userEvent.setup()
    let mockNow = 0
    vi.spyOn(performance, 'now').mockImplementation(() => mockNow)
    const { getUserMedia, stopTrack } = installMediaRecorderMock()
    installAudioContextMock()
    installObjectUrlMock()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeVisible()

    mockNow = 15_000
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
      sampleAudioContentType?: string
      sampleAudioFilename?: string
      sampleAudioUrl?: string
    }
    expect(sampleBody.consentConfirmed).toBe(true)
    expect(sampleBody.sampleAudioBase64).toMatch(/^UklGR/)
    expect(sampleBody.sampleAudioContentType).toBe('audio/wav')
    expect(sampleBody.sampleAudioFilename).toMatch(/\.wav$/)
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

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    expect(await screen.findByText(/unable to access microphone/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()
  })

  it('rejects a too-short microphone sample without calling the profile API', async () => {
    const user = userEvent.setup()
    installMediaRecorderMock('tiny')
    installObjectUrlMock()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))
    await user.click(screen.getByRole('button', { name: /stop recording/i }))

    expect(await screen.findByText(/recording is too short/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(false)
  })

  it('rejects microphone samples shorter than the minimum duration even when audio data exists', async () => {
    const user = userEvent.setup()
    let mockNow = 0
    vi.spyOn(performance, 'now').mockImplementation(() => mockNow)
    installMediaRecorderMock()
    installObjectUrlMock()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /start recording/i }))

    mockNow = 1_000
    await user.click(screen.getByRole('button', { name: /stop recording/i }))

    expect(await screen.findByText(/recording is too short/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()
    expect(screen.queryByLabelText(/preview recorded voice sample/i)).not.toBeInTheDocument()
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(false)
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

    expect(await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })).toBeVisible()
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

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/authorized-sample.wav')
    expect(screen.getByRole('button', { name: /create voice profile/i })).toBeDisabled()

    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))
    expect((await screen.findAllByText(/profile id: profile_batch_authorized/i))[0]).toBeVisible()

    await user.click(screen.getByRole('button', { name: /generate all pending/i }))
    expect((await screen.findAllByText(/368 generated/i))[0]).toBeVisible()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()

    const generateBodies = vi.mocked(fetch).mock.calls
      .filter((call) => call[0] === '/api/admin/voice/generate')
      .map((call) => JSON.parse(String(call[1]!.body)) as {
        target: { targetId: string; moduleType: string }
      })

    expect(generateBodies).toHaveLength(368)
    expect(new Set(generateBodies.map((body) => body.target.moduleType))).toEqual(
      new Set(['dialogue', 'sentencePatterns', 'vocabulary', 'practice']),
    )
    expect(generateBodies.some((body) => body.target.targetId.startsWith('pronunciation:'))).toBe(false)
    expect(generateBodies.some((body) => ['pronunciation', 'hanziRecognition'].includes(body.target.moduleType))).toBe(false)

    const representativeTargetIds = [
      `dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`,
      `sentencePatterns:${course.lessons[0]!.sentencePatterns[0]!.id}`,
      `vocabulary:${course.lessons[0]!.vocabulary[0]!.id}`,
      `practice:listening:${course.lessons[0]!.practice.listening[0]!.id}`,
    ]

    for (const targetId of representativeTargetIds) {
      const row = screen.getByTestId(`voice-target-row-${targetId}`)
      await user.click(within(row).getByLabelText(/previewed and approve/i))
    }
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /apply approved to drafts/i }))

    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.filter((call) => call[0] === '/api/admin/content/draft')).toHaveLength(4)
    })
    const draftBodies = vi.mocked(fetch).mock.calls
      .filter((call) => call[0] === '/api/admin/content/draft')
      .map((call) => JSON.parse(String(call[1]!.body)) as {
        lessonId: string
        moduleType: string
        payload: unknown
      })

    const originalLesson = course.lessons[0]!
    const generatedAudioFor = (audio: string) => `/voice/generated${audio}`
    const withGeneratedAudio = <Item extends { audio: string }>(item: Item) => ({
      ...item,
      audio: generatedAudioFor(item.audio),
      audioFallback: item.audio,
    })
    const firstLineId = originalLesson.dialogue.lines[0]!.id
    const firstPatternId = originalLesson.sentencePatterns[0]!.id
    const firstVocabId = originalLesson.vocabulary[0]!.id
    const firstListeningId = originalLesson.practice.listening[0]!.id

    expect(draftBodies).toEqual([
      {
        lessonId: originalLesson.id,
        moduleType: 'dialogue',
        note: 'Apply approved batch voice generation for dialogue',
        payload: {
          ...originalLesson.dialogue,
          lines: originalLesson.dialogue.lines.map((line) =>
            line.id === firstLineId ? withGeneratedAudio(line) : line,
          ),
        },
      },
      {
        lessonId: originalLesson.id,
        moduleType: 'sentencePatterns',
        note: 'Apply approved batch voice generation for sentencePatterns',
        payload: originalLesson.sentencePatterns.map((pattern) =>
          pattern.id === firstPatternId ? withGeneratedAudio(pattern) : pattern,
        ),
      },
      {
        lessonId: originalLesson.id,
        moduleType: 'vocabulary',
        note: 'Apply approved batch voice generation for vocabulary',
        payload: originalLesson.vocabulary.map((item) =>
          item.id === firstVocabId ? withGeneratedAudio(item) : item,
        ),
      },
      {
        lessonId: originalLesson.id,
        moduleType: 'practice',
        note: 'Apply approved batch voice generation for practice',
        payload: {
          ...originalLesson.practice,
          listening: originalLesson.practice.listening.map((prompt) =>
            prompt.id === firstListeningId ? withGeneratedAudio(prompt) : prompt,
          ),
        },
      },
    ])
    expect(await screen.findByText(/applied 4 approved targets/i)).toBeVisible()
  })

  it('loads a saved existing profile id and generates a target without creating another profile', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()
    window.localStorage.setItem(profileIdStorageKey, existingProfileIdFixture)

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    expect(screen.getByLabelText(/use existing profile id/i)).toHaveValue(existingProfileIdFixture)

    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))

    const firstTargetId = `dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`
    const firstRow = screen.getByTestId(`voice-target-row-${firstTargetId}`)
    await user.click(within(firstRow).getByRole('button', { name: /generate this target/i }))

    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/generate')).toBe(true)
    })
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(false)
    const generateCall = vi.mocked(fetch).mock.calls.find((call) => call[0] === '/api/admin/voice/generate')!
    const generateBody = JSON.parse(String(generateCall[1]!.body)) as { profileId?: string }
    expect(generateBody.profileId).toBe(existingProfileIdFixture)
  })

  it('saves a manually entered existing profile id for reuse', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await user.type(screen.getByLabelText(/use existing profile id/i), existingProfileIdFixture)

    expect(window.localStorage.getItem(profileIdStorageKey)).toBe(existingProfileIdFixture)
  })

  it('clears a saved existing profile id without creating or generating audio', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()
    window.localStorage.setItem(profileIdStorageKey, existingProfileIdFixture)

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    expect(screen.getByLabelText(/use existing profile id/i)).toHaveValue(existingProfileIdFixture)

    await user.click(screen.getByRole('button', { name: /clear saved id/i }))

    expect(screen.getByLabelText(/use existing profile id/i)).toHaveValue('')
    expect(window.localStorage.getItem(profileIdStorageKey)).toBeNull()
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(false)
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/generate')).toBe(false)
  })

  it('explains an empty target manifest without blaming the profile id', async () => {
    installEmptyBatchFetchMock()

    renderRoute('/admin/voice')

    expect(await screen.findByRole('heading', { level: 1, name: /original pronunciation is active/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /no audio targets loaded/i })).toBeVisible()
    expect(screen.getByText(/refresh this page or check \/admin/i)).toBeVisible()
    expect(screen.queryByText(/profile id is invalid/i)).not.toBeInTheDocument()
  })

  it('does not create a new profile when the existing-profile fee warning is cancelled', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    installBatchFetchMock()
    window.localStorage.setItem(profileIdStorageKey, existingProfileIdFixture)

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/another-sample.wav')
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/additional voice clone fee/i))
    expect(vi.mocked(fetch).mock.calls.some((call) => call[0] === '/api/admin/voice/samples')).toBe(false)
  })

  it('explains why a row generate button is unavailable before authorization and profile setup', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })

    const firstTargetId = `dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`
    const firstRow = screen.getByTestId(`voice-target-row-${firstTargetId}`)
    const generateButton = within(firstRow).getByRole('button', { name: /generate this target/i })

    expect(generateButton).toBeDisabled()
    expect(
      within(firstRow).getByText(/confirm authorization and enter a Profile id before generating this target/i),
    ).toBeVisible()

    await user.click(generateButton)

    const generateCalls = vi.mocked(fetch).mock.calls.filter((call) => call[0] === '/api/admin/voice/generate')
    expect(generateCalls).toHaveLength(0)
  })

  it('generates one target from a row without triggering the full batch', async () => {
    const user = userEvent.setup()
    installBatchFetchMock()

    renderRoute('/admin/voice')

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/authorized-sample.wav')
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))
    expect((await screen.findAllByText(/profile id: profile_batch_authorized/i))[0]).toBeVisible()

    const firstTargetId = `dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`
    const firstRow = screen.getByTestId(`voice-target-row-${firstTargetId}`)
    await user.click(within(firstRow).getByRole('button', { name: /generate this target/i }))

    expect(await within(firstRow).findByLabelText(/preview generated audio/i)).toHaveAttribute(
      'src',
      `/voice/generated${course.lessons[0]!.dialogue.lines[0]!.audio}`,
    )
    expect((await screen.findAllByText(/^1 generated$/i)).some((element) => element.className.includes('success'))).toBe(true)

    const generateCalls = vi.mocked(fetch).mock.calls.filter((call) => call[0] === '/api/admin/voice/generate')
    expect(generateCalls).toHaveLength(1)
    const generateBody = JSON.parse(String(generateCalls[0]![1]!.body)) as {
      target: { targetId: string }
    }
    expect(generateBody.target.targetId).toBe(firstTargetId)
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

    await screen.findByRole('heading', { level: 2, name: /368 audio targets/i })
    await openCreateProfilePanel(user)
    await user.click(screen.getByLabelText(/i confirm this voice sample is mine or explicitly authorized/i))
    await user.type(screen.getByLabelText(/voice sample url/i), 'https://storage.example/authorized-sample.wav')
    await user.click(screen.getByRole('button', { name: /create voice profile/i }))
    await user.click(await screen.findByRole('button', { name: /generate all pending/i }))

    expect((await screen.findAllByText(/368 failed/i))[0]).toBeVisible()
    const firstRow = screen.getByTestId(`voice-target-row-dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`)
    expect(within(firstRow).getByText(/voice cloning provider is not configured/i)).toBeVisible()
    expect(within(firstRow).getByText(/original audio fallback is preserved/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /apply approved to drafts/i })).toBeDisabled()
  })
})
