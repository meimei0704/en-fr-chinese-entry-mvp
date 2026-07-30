import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
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

function getVoiceErrorMessage(error: unknown, fallback: string) {
  return error instanceof AdminApiError ? error.message : fallback
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
  const [profileId, setProfileId] = useState('')
  const [pendingAction, setPendingAction] = useState<'profile' | 'generate' | 'apply' | null>(null)

  const draftLessons = useMemo(
    () => snapshots.map((snapshot) => snapshot.draftLesson).filter((lesson): lesson is LessonContent => lesson !== null),
    [snapshots],
  )
  const statusCounts = useMemo(() => {
    return rows.reduce(
      (counts, row) => ({
        ...counts,
        [row.status]: counts[row.status] + 1,
      }),
      { pending: 0, generating: 0, generated: 0, failed: 0, approved: 0 },
    )
  }, [rows])
  const hasSampleAudio = sampleAudioUrl.trim() !== '' || sampleAudioBase64.trim() !== ''
  const canCreateProfile = consentConfirmed && hasSampleAudio && pendingAction === null
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
    setProfileId('')
  }

  async function handleSampleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setSampleAudioBase64('')
      return
    }

    try {
      setError(null)
      setSampleAudioBase64(await readFileAsBase64(file))
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

    setPendingAction('profile')
    setError(null)
    setSuccessMessage(null)

    try {
      const result = await createAdminVoiceSampleProfile({
        consentConfirmed,
        sampleName,
        sampleAudioUrl: sampleAudioUrl.trim() || undefined,
        sampleAudioBase64: sampleAudioBase64.trim() || undefined,
      })
      setProfileId(result.profileId)
      setSuccessMessage(`Profile id: ${result.profileId}`)
    } catch (requestError) {
      setError(getVoiceErrorMessage(requestError, 'Unable to create voice profile'))
    } finally {
      setPendingAction(null)
    }
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
    <main className="page-shell page-shell--wide admin-page-shell">
      <section className="hero-card admin-overview-card">
        <div className="admin-overview-card__header">
          <div>
            <p className="eyebrow">Authorized voice</p>
            <h1>Batch Voice Generation</h1>
            <p className="lede">
              Regenerate the existing Chinese pronunciation audio targets from one authorized voice profile.
            </p>
          </div>
          <div className="admin-badge-column">
            <span className="badge badge--jade">zh-CN only</span>
            <span className="badge badge--gold">Draft only</span>
            <Link className="secondary-link" to="/admin">Back to admin</Link>
            <button type="button" className="secondary-link" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
        <div className="admin-metric-grid" data-testid="admin-voice-metrics">
          <article className="admin-metric-card">
            <span>Audio targets</span>
            <strong>{rows.length}</strong>
            <p>{rows.length} audio targets collected from existing lesson audio fields.</p>
          </article>
          <article className="admin-metric-card">
            <span>Generated</span>
            <strong>{statusCounts.generated}</strong>
            <p>{statusCounts.generated} generated</p>
          </article>
          <article className="admin-metric-card admin-metric-card--attention">
            <span>Failed</span>
            <strong>{statusCounts.failed}</strong>
            <p>{statusCounts.failed} failed</p>
          </article>
          <article className="admin-metric-card">
            <span>Approved</span>
            <strong>{statusCounts.approved}</strong>
            <p>{statusCounts.approved} approved</p>
          </article>
        </div>
      </section>

      <section className="surface-card lesson-section-card admin-history-card" aria-label="Batch voice profile setup">
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Authorized voice profile</h2>
            <p className="muted-text">Only use your own voice or a voice you are explicitly authorized to use.</p>
          </div>
          <span className="badge badge--sky">Admin only</span>
        </div>
        <label className="admin-field admin-consent-field">
          <span>
            <input
              type="checkbox"
              checked={consentConfirmed}
              onChange={(event) => setConsentConfirmed(event.target.checked)}
            />{' '}
            I confirm this voice sample is mine or explicitly authorized
          </span>
        </label>
        <div className="admin-field-grid">
          <label className="admin-field">
            <span>Voice sample name</span>
            <input value={sampleName} onChange={(event) => setSampleName(event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Voice sample URL</span>
            <input
              placeholder="https://storage.example/authorized-sample.wav"
              value={sampleAudioUrl}
              onChange={(event) => setSampleAudioUrl(event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Voice sample file</span>
            <input type="file" accept="audio/*" onChange={handleSampleFileChange} />
          </label>
        </div>
        <div className="admin-card-actions">
          <span className="muted-text">
            {profileId ? `Profile id: ${profileId}` : 'Create a voice profile before generating audio.'}
          </span>
          <button type="button" className="secondary-link" onClick={handleCreateProfile} disabled={!canCreateProfile}>
            {pendingAction === 'profile' ? 'Creating voice profile…' : 'Create voice profile'}
          </button>
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
        </div>
        {successMessage ? <p className="admin-inline-feedback admin-inline-feedback--success">{successMessage}</p> : null}
        {error ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : null}
      </section>

      <section className="page-grid admin-lessons-grid" data-testid="admin-voice-target-grid">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Target manifest</p>
            <h2>{rows.length} audio targets</h2>
          </div>
          <p className="muted-text">Existing `/audio/...mp3` paths remain the fallback for generated audio.</p>
        </div>
        {rows.map((row) => (
          <article
            key={`${row.target.lessonId}:${row.target.targetId}`}
            className="surface-card lesson-card admin-lesson-card"
            data-testid={`voice-target-row-${row.target.targetId}`}
          >
            <div className="admin-lesson-card__topline">
              <p className="eyebrow">{row.target.lessonId}</p>
              <span className={`badge ${row.status === 'failed' ? 'badge--gold' : 'badge--jade'}`}>{row.status}</span>
            </div>
            <div className="admin-lesson-card__title-row">
              <h3>{row.target.label}</h3>
              <p className="muted-text">{row.target.language}</p>
            </div>
            <p className="hanzi-display hanzi-display--compact">{row.target.text}</p>
            <p className="admin-lesson-card__status">{row.target.originalAudio}</p>
            <p className="muted-text">Storage key: {row.target.storageKey}</p>
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
        ))}
      </section>
    </main>
  )
}
