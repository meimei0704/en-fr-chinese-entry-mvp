import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'

import {
  AdminApiError,
  clearAdminBasicAuth,
  createAdminVoiceSampleProfile,
  generateAdminVoiceReplacement,
  getAdminLessonSnapshot,
  listAdminLessons,
  saveAdminBasicAuth,
  saveAdminDraftModule,
} from '../admin/api.js'
import type { AdminLessonSnapshot } from '../admin/types.js'
import {
  applyVoiceGenerationBatchToLesson,
  collectCourseVoiceAudioTargets,
} from '../admin/voiceTargets.js'
import type { VoiceAudioTarget, VoiceGenerationApprovedResult } from '../admin/voiceTypes.js'
import type { LessonContent } from '../content/types.js'
import { AdminAccessScreen } from '../components/admin/AdminAccessScreen.js'

interface VoiceGenerationRow {
  target: VoiceAudioTarget
  status: 'pending' | 'generating' | 'generated' | 'failed' | 'approved'
  generatedAudioUrl: string
  error: string | null
}

type VoiceSampleRecordingState = 'idle' | 'requesting' | 'recording' | 'recorded'
const MIN_RECORDED_SAMPLE_DURATION_MS = 10_000
const MIN_RECORDED_SAMPLE_BYTES = 1_024
const RECORDED_SAMPLE_FILENAME = 'recorded-mandarin-sample.wav'
const PROFILE_ID_STORAGE_KEY = 'adminVoiceGeneration.profileId'
const CREATE_ADDITIONAL_PROFILE_WARNING =
  'An existing Profile id is already set. Creating a new voice profile can create a new cloned voice and may trigger an additional voice clone fee. Continue?'

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext
}

function getVoiceErrorMessage(error: unknown, fallback: string) {
  return error instanceof AdminApiError ? error.message : fallback
}

function getRecordingNowMs() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now()
}

function buildRows(lessons: readonly LessonContent[]): VoiceGenerationRow[] {
  return collectCourseVoiceAudioTargets(lessons).map((target) => ({
    target,
    status: 'pending',
    generatedAudioUrl: '',
    error: null,
  }))
}

function replaceRow(
  rows: readonly VoiceGenerationRow[],
  targetId: string,
  update: (row: VoiceGenerationRow) => VoiceGenerationRow,
) {
  return rows.map((row) => (row.target.targetId === targetId ? update(row) : row))
}

function getSingleTargetGenerateUnavailableReason(
  consentConfirmed: boolean,
  profileId: string,
  pendingAction: 'profile' | 'generate' | 'apply' | null,
) {
  const hasProfile = profileId.trim() !== ''

  if (!consentConfirmed && !hasProfile) {
    return 'Confirm authorization and enter a Profile id before generating this target.'
  }

  if (!consentConfirmed) {
    return 'Confirm authorization before generating this target.'
  }

  if (!hasProfile) {
    return 'Create a voice profile before generating this target.'
  }

  if (pendingAction !== null) {
    return 'Finish the current voice action before generating another target.'
  }

  return null
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve(result.includes(',') ? result.split(',').at(1) ?? '' : result)
    }
    reader.onerror = () => reject(new Error('Unable to read the selected voice sample file'))
    reader.readAsDataURL(file)
  })
}

function readBlobAsBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve(result.includes(',') ? result.split(',').at(1) ?? '' : result)
    }
    reader.onerror = () => reject(new Error('Unable to prepare recorded voice sample'))
    reader.readAsDataURL(blob)
  })
}

function readSavedProfileId() {
  if (typeof window === 'undefined') {
    return ''
  }

  try {
    return window.localStorage.getItem(PROFILE_ID_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function saveProfileId(profileId: string) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const nextProfileId = profileId.trim()
    if (nextProfileId) {
      window.localStorage.setItem(PROFILE_ID_STORAGE_KEY, nextProfileId)
    } else {
      window.localStorage.removeItem(PROFILE_ID_STORAGE_KEY)
    }
  } catch {
    // localStorage is a convenience cache only; generation still uses React state.
  }
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

function encodeAudioBufferAsWav(audioBuffer: AudioBuffer) {
  const channelCount = Math.min(audioBuffer.numberOfChannels, 2)
  const bytesPerSample = 2
  const blockAlign = channelCount * bytesPerSample
  const dataSize = audioBuffer.length * blockAlign
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  let offset = 0

  writeAscii(view, offset, 'RIFF')
  offset += 4
  view.setUint32(offset, 36 + dataSize, true)
  offset += 4
  writeAscii(view, offset, 'WAVE')
  offset += 4
  writeAscii(view, offset, 'fmt ')
  offset += 4
  view.setUint32(offset, 16, true)
  offset += 4
  view.setUint16(offset, 1, true)
  offset += 2
  view.setUint16(offset, channelCount, true)
  offset += 2
  view.setUint32(offset, audioBuffer.sampleRate, true)
  offset += 4
  view.setUint32(offset, audioBuffer.sampleRate * blockAlign, true)
  offset += 4
  view.setUint16(offset, blockAlign, true)
  offset += 2
  view.setUint16(offset, bytesPerSample * 8, true)
  offset += 2
  writeAscii(view, offset, 'data')
  offset += 4
  view.setUint32(offset, dataSize, true)
  offset += 4

  const channels = Array.from({ length: channelCount }, (_, channelIndex) => audioBuffer.getChannelData(channelIndex))

  for (let sampleIndex = 0; sampleIndex < audioBuffer.length; sampleIndex += 1) {
    for (const channel of channels) {
      const sample = Math.max(-1, Math.min(1, channel[sampleIndex] ?? 0))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += bytesPerSample
    }
  }

  return buffer
}

async function convertRecordedBlobToWav(blob: Blob) {
  const AudioContextCtor = window.AudioContext ?? (window as WindowWithWebkitAudioContext).webkitAudioContext

  if (!AudioContextCtor) {
    throw new Error('Unable to prepare a MiniMax-compatible WAV sample. Please upload an mp3, m4a, or wav file.')
  }

  const audioContext = new AudioContextCtor()

  try {
    const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer())
    return new Blob([encodeAudioBufferAsWav(audioBuffer)], { type: 'audio/wav' })
  } finally {
    const closeResult = audioContext.close()
    if (typeof closeResult?.catch === 'function') {
      await closeResult.catch(() => undefined)
    }
  }
}

export function AdminVoiceGenerationPage() {
  const [snapshots, setSnapshots] = useState<AdminLessonSnapshot[]>([])
  const [rows, setRows] = useState<VoiceGenerationRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [consentConfirmed, setConsentConfirmed] = useState(false)
  const [sampleName, setSampleName] = useState('Authorized admin voice sample')
  const [sampleAudioUrl, setSampleAudioUrl] = useState('')
  const [sampleAudioBase64, setSampleAudioBase64] = useState('')
  const [sampleAudioContentType, setSampleAudioContentType] = useState('')
  const [sampleAudioFilename, setSampleAudioFilename] = useState('')
  const [profileId, setProfileId] = useState(readSavedProfileId)
  const [pendingAction, setPendingAction] = useState<'profile' | 'generate' | 'apply' | null>(null)
  const [recordingState, setRecordingState] = useState<VoiceSampleRecordingState>('idle')
  const [recordedSampleUrl, setRecordedSampleUrl] = useState('')
  const [recorderError, setRecorderError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingStreamRef = useRef<MediaStream | null>(null)
  const recordingStartedAtMsRef = useRef<number | null>(null)

  const draftLessons = useMemo(
    () => snapshots.map((snapshot) => snapshot.draftLesson).filter((lesson): lesson is LessonContent => lesson !== null),
    [snapshots],
  )
  const hasSampleAudio = sampleAudioUrl.trim() !== '' || sampleAudioBase64.trim() !== ''
  const canCreateProfile = consentConfirmed && hasSampleAudio && pendingAction === null
  const canStartRecording =
    consentConfirmed && pendingAction === null && recordingState !== 'requesting' && recordingState !== 'recording'
  const canGenerate = consentConfirmed && profileId.trim() !== '' && pendingAction === null
  const canGenerateAll = canGenerate && rows.some((row) => row.status === 'pending' || row.status === 'failed')
  const approvedRows = rows.filter((row) => row.status === 'approved' && row.generatedAudioUrl.trim() !== '')
  const canApplyApproved = approvedRows.length > 0 && pendingAction === null

  const loadSnapshots = useCallback(async () => {
    setIsLoading(true)
    try {
      const summaries = await listAdminLessons()
      const nextSnapshots = await Promise.all(
        summaries.map((summary) => getAdminLessonSnapshot(summary.lessonId)),
      )
      const nextLessons = nextSnapshots
        .map((snapshot) => snapshot.draftLesson)
        .filter((lesson): lesson is LessonContent => lesson !== null)
      setSnapshots(nextSnapshots)
      setRows(buildRows(nextLessons))
      setRequiresAuth(false)
      setError(null)
      setSuccessMessage(null)
    } catch (requestError) {
      if (requestError instanceof AdminApiError && requestError.status === 401) {
        clearAdminBasicAuth()
        setRequiresAuth(true)
        setError(requestError.message)
        setSnapshots([])
        setRows([])
        return
      }

      setError(requestError instanceof AdminApiError ? requestError.message : 'Unable to load batch voice generation')
      setSnapshots([])
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSnapshots().catch(() => undefined)
  }, [loadSnapshots])

  useEffect(() => {
    return () => {
      recordingStreamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    return () => {
      if (recordedSampleUrl && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(recordedSampleUrl)
      }
    }
  }, [recordedSampleUrl])

  function stopRecordingStream() {
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop())
    recordingStreamRef.current = null
  }

  function clearRecordedSample() {
    setRecordedSampleUrl('')
    setSampleAudioBase64('')
    setSampleAudioContentType('')
    setSampleAudioFilename('')
    recordedChunksRef.current = []
    recordingStartedAtMsRef.current = null
  }

  function updateProfileId(nextProfileId: string) {
    const normalizedProfileId = nextProfileId.trim()
    setProfileId(normalizedProfileId)
    saveProfileId(normalizedProfileId)
  }

  async function finalizeRecordedSample(recorder: MediaRecorder) {
    const chunks = recordedChunksRef.current
    const recordedDurationMs =
      recordingStartedAtMsRef.current === null ? 0 : getRecordingNowMs() - recordingStartedAtMsRef.current
    stopRecordingStream()
    mediaRecorderRef.current = null

    if (chunks.length === 0) {
      recordingStartedAtMsRef.current = null
      setRecordingState('idle')
      setRecorderError('No voice sample was captured. Please record again.')
      return
    }

    const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })

    if (recordedDurationMs < MIN_RECORDED_SAMPLE_DURATION_MS || blob.size < MIN_RECORDED_SAMPLE_BYTES) {
      clearRecordedSample()
      setRecordingState('idle')
      setRecorderError('Recording is too short or empty. Please record a clear 30–60 second Mandarin sample.')
      return
    }

    try {
      const wavBlob = await convertRecordedBlobToWav(blob)
      const objectUrl = typeof URL.createObjectURL === 'function' ? URL.createObjectURL(wavBlob) : ''
      const base64 = await readBlobAsBase64(wavBlob)
      setRecordedSampleUrl(objectUrl)
      setSampleAudioBase64(base64)
      setSampleAudioContentType('audio/wav')
      setSampleAudioFilename(RECORDED_SAMPLE_FILENAME)
      setSampleAudioUrl('')
      recordingStartedAtMsRef.current = null
      setRecordingState('recorded')
      setRecorderError(null)
    } catch (sampleError) {
      clearRecordedSample()
      setRecordingState('idle')
      setRecorderError(sampleError instanceof Error ? sampleError.message : 'Unable to prepare recorded voice sample')
    }
  }

  async function handleStartRecording() {
    if (!canStartRecording) {
      return
    }

    setError(null)
    setSuccessMessage(null)
    setRecorderError(null)
    clearRecordedSample()

    if (!window.navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setRecorderError('Recording is not supported by this browser. Please upload a voice sample file instead.')
      return
    }

    setRecordingState('requesting')

    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new window.MediaRecorder(stream)
      recordingStreamRef.current = stream
      mediaRecorderRef.current = recorder
      recordedChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      recorder.onstop = () => {
        void finalizeRecordedSample(recorder)
      }
      recorder.onerror = () => {
        stopRecordingStream()
        mediaRecorderRef.current = null
        clearRecordedSample()
        setRecordingState('idle')
        setRecorderError('Unable to record voice sample. Please try again or upload a file.')
      }

      recorder.start()
      recordingStartedAtMsRef.current = getRecordingNowMs()
      setRecordingState('recording')
    } catch {
      stopRecordingStream()
      mediaRecorderRef.current = null
      recordingStartedAtMsRef.current = null
      setRecordingState('idle')
      setRecorderError('Unable to access microphone. Check browser permission and try again, or upload a file.')
    }
  }

  function handleStopRecording() {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      setRecordingState('idle')
      return
    }

    recorder.stop()
  }

  function handleDiscardRecording() {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null
      recorder.stop()
    }
    stopRecordingStream()
    mediaRecorderRef.current = null
    recordingStartedAtMsRef.current = null
    clearRecordedSample()
    setRecordingState('idle')
    setRecorderError(null)
  }

  async function handleUnlock(username: string, password: string) {
    saveAdminBasicAuth(username, password)
    await loadSnapshots()
  }

  function handleSignOut() {
    clearAdminBasicAuth()
    setRequiresAuth(true)
    setSnapshots([])
    setRows([])
    setError(null)
    setSuccessMessage(null)
    updateProfileId('')
  }

  async function handleSampleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setSampleAudioBase64('')
      return
    }

    try {
      setError(null)
      setRecorderError(null)
      setRecordedSampleUrl('')
      setRecordingState('idle')
      setSampleAudioUrl('')
      setSampleAudioBase64(await readFileAsBase64(file))
      setSampleAudioContentType(file.type)
      setSampleAudioFilename(file.name)
      setSampleName((current) => current || file.name)
    } catch (fileError) {
      setSampleAudioBase64('')
      setError(fileError instanceof Error ? fileError.message : 'Unable to read the selected voice sample file')
    }
  }

  async function handleCreateProfile() {
    if (!canCreateProfile) {
      return
    }

    if (profileId.trim() !== '' && !window.confirm(CREATE_ADDITIONAL_PROFILE_WARNING)) {
      return
    }

    setPendingAction('profile')
    setError(null)
    setSuccessMessage(null)

    try {
      const result = await createAdminVoiceSampleProfile({
        consentConfirmed,
        sampleName,
        sampleAudioUrl: sampleAudioUrl.trim() || undefined,
        sampleAudioBase64: sampleAudioBase64.trim() || undefined,
        sampleAudioContentType: sampleAudioContentType.trim() || undefined,
        sampleAudioFilename: sampleAudioFilename.trim() || undefined,
      })
      updateProfileId(result.profileId)
      setSuccessMessage(`Profile id: ${result.profileId}`)
    } catch (requestError) {
      setError(getVoiceErrorMessage(requestError, 'Unable to create voice profile'))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleCopyProfileId() {
    const currentProfileId = profileId.trim()
    if (!currentProfileId) {
      return
    }

    if (!window.navigator.clipboard?.writeText) {
      setError('Clipboard copy is not available in this browser. Select and copy the Profile id input instead.')
      return
    }

    try {
      await window.navigator.clipboard.writeText(currentProfileId)
      setError(null)
      setSuccessMessage(`Copied Profile id: ${currentProfileId}`)
    } catch {
      setError('Unable to copy Profile id. Select and copy the Profile id input instead.')
    }
  }

  function handleClearProfileId() {
    updateProfileId('')
    setError(null)
    setSuccessMessage('Saved Profile id cleared.')
  }

  async function generateOne(row: VoiceGenerationRow) {
    setRows((currentRows) => replaceRow(currentRows, row.target.targetId, (currentRow) => ({
      ...currentRow,
      status: 'generating',
      error: null,
    })))

    try {
      const result = await generateAdminVoiceReplacement({
        consentConfirmed,
        profileId: profileId.trim(),
        text: row.target.text,
        target: {
          lessonId: row.target.lessonId,
          targetId: row.target.targetId,
          moduleType: row.target.moduleType,
          originalAudio: row.target.originalAudio,
          storageKey: row.target.storageKey,
          language: row.target.language,
        },
      })
      setRows((currentRows) => replaceRow(currentRows, row.target.targetId, (currentRow) => ({
        ...currentRow,
        status: 'generated',
        generatedAudioUrl: result.audioUrl,
        error: null,
      })))
      return 'generated' as const
    } catch (requestError) {
      setRows((currentRows) => replaceRow(currentRows, row.target.targetId, (currentRow) => ({
        ...currentRow,
        status: 'failed',
        generatedAudioUrl: '',
        error: getVoiceErrorMessage(requestError, 'Unable to generate audio'),
      })))
      return 'failed' as const
    }
  }

  async function handleGenerateAllPending() {
    if (!canGenerateAll) {
      return
    }

    const pendingRows = rows.filter((row) => row.status === 'pending' || row.status === 'failed')
    let generatedCount = 0
    let failedCount = 0
    let cursor = 0

    setPendingAction('generate')
    setError(null)
    setSuccessMessage(null)

    async function worker() {
      while (cursor < pendingRows.length) {
        const row = pendingRows[cursor]
        cursor += 1

        if (!row) {
          return
        }

        const result = await generateOne(row)
        if (result === 'generated') {
          generatedCount += 1
        } else {
          failedCount += 1
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(3, pendingRows.length) }, () => worker()))
    setPendingAction(null)
    setSuccessMessage(
      failedCount > 0 ? `${generatedCount} generated, ${failedCount} failed` : `${generatedCount} generated`,
    )
  }

  async function handleGenerateSingleTarget(row: VoiceGenerationRow) {
    if (!canGenerate || (row.status !== 'pending' && row.status !== 'failed')) {
      return
    }

    setPendingAction('generate')
    setError(null)
    setSuccessMessage(null)

    const result = await generateOne(row)
    setPendingAction(null)
    setSuccessMessage(result === 'generated' ? '1 generated' : '1 failed')
  }

  function handleApprovalChange(row: VoiceGenerationRow, checked: boolean) {
    setRows((currentRows) => replaceRow(currentRows, row.target.targetId, (currentRow) => ({
      ...currentRow,
      status: checked ? 'approved' : 'generated',
    })))
  }

  async function handleApplyApproved() {
    if (!canApplyApproved) {
      return
    }

    setPendingAction('apply')
    setError(null)
    setSuccessMessage(null)

    try {
      const results: VoiceGenerationApprovedResult[] = approvedRows.map((row) => ({
        lessonId: row.target.lessonId,
        targetId: row.target.targetId,
        generatedAudioUrl: row.generatedAudioUrl,
      }))
      const snapshotsByLesson = new Map(snapshots.map((snapshot) => [snapshot.lessonId, snapshot]))
      let latestSnapshots = snapshots

      for (const lesson of draftLessons) {
        const patches = applyVoiceGenerationBatchToLesson(lesson, results)

        for (const patch of patches) {
          const nextSnapshot = await saveAdminDraftModule({
            lessonId: lesson.id,
            moduleType: patch.moduleType,
            payload: patch.payload,
            note: `Apply approved batch voice generation for ${patch.moduleType}`,
          })
          snapshotsByLesson.set(lesson.id, nextSnapshot)
          latestSnapshots = latestSnapshots.map((snapshot) =>
            snapshot.lessonId === lesson.id ? nextSnapshot : snapshot,
          )
        }
      }

      setSnapshots(latestSnapshots)
      setSuccessMessage(`Applied ${approvedRows.length} approved target${approvedRows.length === 1 ? '' : 's'} to drafts.`)
    } catch (requestError) {
      setError(getVoiceErrorMessage(requestError, 'Unable to apply approved generated audio to drafts'))
    } finally {
      setPendingAction(null)
    }
  }

  if (requiresAuth) {
    return (
      <AdminAccessScreen
        heroTitle="Sign in to open batch voice generation"
        heroDescription="Unlock the admin-only batch pipeline to regenerate existing Chinese pronunciation audio."
        formTitle="Admin sign in required"
        formDescription="Enter the content admin credentials to continue into batch voice generation."
        error={error}
        backHref="/admin"
        backLabel="Back to content admin"
        onSubmit={handleUnlock}
      />
    )
  }

  if (isLoading) {
    return (
      <main className="page-shell page-shell--wide admin-page-shell" data-testid="admin-voice-loading-shell">
        <section className="hero-card admin-overview-card admin-loading-card" aria-busy="true">
          <p className="eyebrow">Authorized voice</p>
          <div className="admin-loading-heading">
            <div className="admin-skeleton admin-skeleton--title" />
            <div className="admin-skeleton admin-skeleton--line admin-skeleton--line-wide" />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell page-shell--wide admin-page-shell admin-voice-page-shell">
      <section className="hero-card admin-overview-card admin-voice-hero">
        <div className="admin-overview-card__header">
          <div>
            <p className="eyebrow">Course pronunciation</p>
            <h1>Original pronunciation is active</h1>
            <p className="lede">
              Current course audio uses original files by default. Cloned voice generation stays available as an optional
              admin tool and will not change lessons unless you generate, approve, and apply replacements.
            </p>
          </div>
          <div className="admin-badge-column">
            <span className="badge badge--jade">Original audio</span>
            <span className="badge badge--gold">No extra fee</span>
            <Link className="secondary-link" to="/admin">Back to admin</Link>
            <button type="button" className="secondary-link" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
        <div className="admin-voice-status-grid" data-testid="admin-voice-metrics">
          <article className="admin-voice-status-card admin-voice-status-card--primary">
            <span>Recommended state</span>
            <strong>Original</strong>
            <p>No action needed. Existing `/audio/...` files remain the course pronunciation source.</p>
          </article>
          <article className="admin-voice-status-card">
            <span>Audio targets</span>
            <strong>{rows.length}</strong>
            <p>{rows.length} lesson audio fields available if you intentionally run a cloned-voice batch.</p>
          </article>
          <article className="admin-voice-status-card">
            <span>Optional cloned voice tools</span>
            <strong>{profileId.trim() ? 'Ready' : 'Off'}</strong>
            <p>{profileId.trim() ? 'A saved Profile id is available for manual generation.' : 'No cloned voice is active.'}</p>
          </article>
        </div>
      </section>

      <section className="surface-card lesson-section-card admin-history-card admin-voice-tools-card" aria-label="Optional cloned voice tools">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Optional tool</p>
            <h2>Use cloned voice only when needed</h2>
            <p className="muted-text">
              Keep original pronunciation as the default. If a future run needs cloned audio, paste a Profile id, confirm
              authorization, then generate and apply selected targets manually.
            </p>
          </div>
          <span className="badge badge--sky">Manual only</span>
        </div>

        <div className="admin-voice-tool-grid">
          <article className="admin-voice-tool-card admin-voice-tool-card--primary" aria-label="Existing voice profile tool">
            <div className="admin-section-heading admin-section-heading--compact">
              <div>
                <p className="eyebrow">Reuse existing Profile id</p>
                <h3>Reuse a saved voice</h3>
                <p className="muted-text">
                  Paste a saved Profile id only when you intentionally want cloned-voice replacements. Reuse avoids a new
                  clone fee; generation still consumes MiniMax TTS characters.
                </p>
              </div>
              <span className="badge badge--jade">No new clone</span>
            </div>
            <label className="admin-field">
              <span>Use existing Profile id</span>
              <input
                placeholder="Paste existing profile id"
                value={profileId}
                onChange={(event) => updateProfileId(event.target.value)}
              />
            </label>
            <label className="admin-field admin-consent-field admin-voice-consent-field">
              <span>
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(event) => setConsentConfirmed(event.target.checked)}
                />{' '}
                I confirm this voice sample is mine or explicitly authorized
              </span>
            </label>
            <div className="admin-card-actions admin-card-actions--cluster">
              <span className="muted-text">
                {profileId ? `Current Profile id: ${profileId}` : 'Original pronunciation remains active until a Profile id is used.'}
              </span>
              <div className="admin-voice-inline-actions">
                <button
                  type="button"
                  className="secondary-link"
                  onClick={() => void handleCopyProfileId()}
                  disabled={!profileId.trim()}
                >
                  Copy Profile id
                </button>
                <button
                  type="button"
                  className="secondary-link"
                  onClick={handleClearProfileId}
                  disabled={!profileId.trim()}
                >
                  Clear saved id
                </button>
              </div>
            </div>
          </article>

          <details className="admin-voice-tool-card admin-voice-create-panel">
            <summary>
              <span>
                <span className="eyebrow">Advanced</span>
                <strong>Create new profile</strong>
                <small>Record or upload a new authorized sample. This can create another voice clone fee.</small>
              </span>
            </summary>
            <div className="admin-voice-create-panel__body">
              <article className="surface-card lesson-card admin-lesson-card admin-voice-recorder-card" aria-label="Browser voice sample recorder">
                <div className="admin-section-heading">
                  <div>
                    <p className="eyebrow">Mic capture</p>
                    <h3>Record voice sample</h3>
                    <p className="muted-text">
                      Record a self-authorized Mandarin sample directly in the browser, then use it to create a new voice profile.
                    </p>
                  </div>
                  <span className="badge badge--jade">30–60 sec</span>
                </div>
                <div className="admin-field-grid admin-field-grid--two-column">
                  <div className="admin-field">
                    <span>Recommended Mandarin prompt</span>
                    <p className="muted-text">
                      你好，我正在录制一段普通话声音样本。今天的天气很好，我会用自然的语速清楚地说话。请你帮我确认地址、时间和票价。我们一起练习中文声调：妈、麻、马、骂；也练习常用句子：你好，请问洗手间在哪里？我想买一张车票，谢谢你的帮助。
                    </p>
                  </div>
                  <div className="admin-field">
                    <span>Recording guidance</span>
                    <p className="muted-text">
                      You may read your own Mandarin content instead; the prompt is only a quality guide. Speak clearly in a quiet room for about 30–60 seconds, use natural pacing, and avoid background music.
                    </p>
                  </div>
                </div>
                <div className="admin-card-actions">
                  <button
                    type="button"
                    className="secondary-link"
                    onClick={handleStartRecording}
                    disabled={!canStartRecording}
                  >
                    {recordingState === 'requesting' ? 'Requesting microphone…' : 'Start recording'}
                  </button>
                  {recordingState === 'recording' ? (
                    <button type="button" className="primary-button" onClick={handleStopRecording}>
                      Stop recording
                    </button>
                  ) : null}
                  {recordedSampleUrl ? (
                    <button type="button" className="secondary-link" onClick={handleDiscardRecording}>
                      Re-record
                    </button>
                  ) : null}
                  <span className="muted-text">
                    {recordingState === 'recording'
                      ? 'Recording… read the prompt or your own Mandarin text.'
                      : recordingState === 'requesting'
                        ? 'Check your browser microphone prompt and allow access to start recording.'
                        : recordedSampleUrl
                        ? 'Recorded sample ready. Preview it before creating the profile.'
                        : consentConfirmed
                          ? 'Start recording now, or use the URL/file fallback below.'
                          : 'Confirm authorization to enable recording, or use the URL/file fallback below.'}
                  </span>
                </div>
                {recordedSampleUrl ? (
                  <audio aria-label="Preview recorded voice sample" controls src={recordedSampleUrl} />
                ) : null}
                {recorderError ? (
                  <p className="admin-inline-feedback admin-inline-feedback--error">{recorderError}</p>
                ) : null}
              </article>

              <div className="admin-field-grid admin-field-grid--two-column">
                <label className="admin-field">
                  <span>Voice sample name</span>
                  <input value={sampleName} onChange={(event) => setSampleName(event.target.value)} />
                </label>
                <label className="admin-field">
                  <span>Voice sample URL</span>
                  <input
                    placeholder="https://storage.example/authorized-sample.wav"
                    value={sampleAudioUrl}
                    onChange={(event) => {
                      setSampleAudioUrl(event.target.value)
                      setSampleAudioBase64('')
                      setSampleAudioContentType('')
                      setSampleAudioFilename('')
                    }}
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span>Voice sample file</span>
                  <input type="file" accept=".mp3,.m4a,.wav,audio/mpeg,audio/mp4,audio/wav" onChange={handleSampleFileChange} />
                </label>
              </div>
              <div className="admin-card-actions admin-card-actions--cluster">
                <span className="muted-text">
                  Creating a new voice profile can create a new cloned voice and may add another voice clone fee. Use an
                  existing Profile id for normal cloned-voice runs.
                </span>
                <button type="button" className="secondary-link" onClick={handleCreateProfile} disabled={!canCreateProfile}>
                  {pendingAction === 'profile' ? 'Creating voice profile…' : 'Create voice profile'}
                </button>
              </div>
            </div>
          </details>
        </div>
      </section>

      <section className="surface-card lesson-section-card admin-history-card" aria-label="Batch generation controls">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Step 2</p>
            <h2>Generate and approve targets</h2>
            <p className="muted-text">
              Generate all pending zh-CN targets, preview representative results, then approve rows before draft apply.
            </p>
          </div>
          <span className="badge badge--gold">Fallback preserved</span>
        </div>
        <div className="admin-card-actions">
          <button type="button" className="secondary-link" onClick={handleGenerateAllPending} disabled={!canGenerateAll}>
            {pendingAction === 'generate' ? 'Generating pending audio…' : 'Generate all pending'}
          </button>
          <button type="button" className="primary-button" onClick={handleApplyApproved} disabled={!canApplyApproved}>
            {pendingAction === 'apply' ? 'Applying approved drafts…' : 'Apply approved to drafts'}
          </button>
          <span className="muted-text">For a first provider smoke, generate one target from a row before running the full batch.</span>
        </div>
        {successMessage ? <p className="admin-inline-feedback admin-inline-feedback--success">{successMessage}</p> : null}
        {error ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : null}
      </section>

      {rows.length === 0 ? (
        <section className="surface-card lesson-section-card admin-history-card admin-voice-empty-state" data-testid="admin-voice-target-grid">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow">Target manifest</p>
              <h2>No audio targets loaded</h2>
              <p className="muted-text">
                No lesson audio targets were loaded for this page. Refresh this page or check /admin if lessons are
                missing; this is not a Profile id problem.
              </p>
            </div>
            <span className="badge badge--gold">0 targets</span>
          </div>
        </section>
      ) : (
        <section className="page-grid admin-lessons-grid admin-voice-target-grid" data-testid="admin-voice-target-grid">
          <div className="section-heading admin-voice-target-grid__heading">
            <div>
              <p className="eyebrow">Target manifest</p>
              <h2>{rows.length} audio targets</h2>
            </div>
            <p className="muted-text">Original `/audio/...mp3` paths remain preserved as fallback while you test generated audio.</p>
          </div>
          {rows.map((row) => {
            const singleTargetGenerateUnavailableReason = getSingleTargetGenerateUnavailableReason(
              consentConfirmed,
              profileId,
              pendingAction,
            )
            const singleTargetGenerateHelpId = `voice-target-generate-help-${row.target.targetId}`

            return (
              <article
                key={`${row.target.lessonId}:${row.target.targetId}`}
                className="surface-card lesson-card admin-lesson-card admin-voice-target-card"
                data-testid={`voice-target-row-${row.target.targetId}`}
              >
                <div className="admin-lesson-card__topline">
                  <p className="eyebrow">{row.target.lessonId}</p>
                  <span className={`badge ${row.status === 'failed' ? 'badge--gold' : 'badge--jade'}`}>{row.status}</span>
                </div>
                <div className="admin-lesson-card__title-row">
                  <h3>{row.target.label}</h3>
                  <p className="muted-text">{row.target.moduleType} · {row.target.language}</p>
                </div>
                <p className="hanzi-display hanzi-display--compact">{row.target.text}</p>
                <p className="admin-lesson-card__status">Original audio fallback is preserved.</p>
                <details className="admin-voice-technical-details">
                  <summary>Technical details</summary>
                  <p className="muted-text">Original: {row.target.originalAudio}</p>
                  <p className="muted-text">Storage key: {row.target.storageKey}</p>
                </details>
                {row.status === 'pending' || row.status === 'failed' || row.status === 'generating' ? (
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="secondary-link"
                      onClick={() => void handleGenerateSingleTarget(row)}
                      disabled={singleTargetGenerateUnavailableReason !== null || row.status === 'generating'}
                      aria-describedby={singleTargetGenerateUnavailableReason ? singleTargetGenerateHelpId : undefined}
                    >
                      {row.status === 'generating' ? 'Generating this target…' : 'Generate this target'}
                    </button>
                    {singleTargetGenerateUnavailableReason ? (
                      <span id={singleTargetGenerateHelpId} className="muted-text">
                        {singleTargetGenerateUnavailableReason}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {row.generatedAudioUrl ? (
                  <div className="admin-field-grid">
                    <audio aria-label={`Preview generated audio for ${row.target.label}`} controls src={row.generatedAudioUrl} />
                    <label className="admin-field admin-consent-field">
                      <span>
                        <input
                          type="checkbox"
                          checked={row.status === 'approved'}
                          onChange={(event) => handleApprovalChange(row, event.target.checked)}
                        />{' '}
                        Previewed and approve {row.target.label}
                      </span>
                    </label>
                  </div>
                ) : null}
                {row.error ? <p className="admin-inline-feedback admin-inline-feedback--error">{row.error}</p> : null}
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
