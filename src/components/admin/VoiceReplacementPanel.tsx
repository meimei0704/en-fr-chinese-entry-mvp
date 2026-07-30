import { useMemo, useState, type ChangeEvent } from 'react'

import {
  AdminApiError,
  createAdminVoiceSampleProfile,
  generateAdminVoiceReplacement,
} from '../../admin/api.js'
import {
  applyVoiceReplacementToModule,
  collectVoiceReplacementTargets,
} from '../../admin/voiceTargets.js'
import type { VoiceReplacementPatch, VoiceReplacementTarget } from '../../admin/voiceTypes.js'
import type { LessonContent } from '../../content/types.js'

interface VoiceReplacementPanelProps {
  lesson: LessonContent
  lessonId: string
  onApply(input: VoiceReplacementPatch & { targetId: string }): Promise<void>
}

function getVoiceErrorMessage(error: unknown, fallback: string) {
  return error instanceof AdminApiError ? error.message : fallback
}

function getSelectedTarget(targets: VoiceReplacementTarget[], targetId: string) {
  return targets.find((target) => target.id === targetId) ?? targets[0] ?? null
}

export function VoiceReplacementPanel({ lesson, lessonId, onApply }: VoiceReplacementPanelProps) {
  const targets = useMemo(() => collectVoiceReplacementTargets(lesson), [lesson])
  const [consentConfirmed, setConsentConfirmed] = useState(false)
  const [sampleName, setSampleName] = useState('Authorized admin voice sample')
  const [sampleAudioUrl, setSampleAudioUrl] = useState('')
  const [sampleAudioBase64, setSampleAudioBase64] = useState('')
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id ?? '')
  const [profileId, setProfileId] = useState('')
  const [replacementAudioUrl, setReplacementAudioUrl] = useState('')
  const [previewConfirmed, setPreviewConfirmed] = useState(false)
  const [pendingAction, setPendingAction] = useState<'profile' | 'generate' | 'apply' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const selectedTarget = getSelectedTarget(targets, selectedTargetId)
  const hasSampleAudio = sampleAudioUrl.trim() !== '' || sampleAudioBase64.trim() !== ''
  const canCreateProfile = consentConfirmed && hasSampleAudio && pendingAction === null
  const canGenerate = consentConfirmed && profileId.trim() !== '' && selectedTarget !== null && pendingAction === null
  const canApply = consentConfirmed && previewConfirmed && selectedTarget !== null && replacementAudioUrl.trim() !== '' && pendingAction === null

  async function handleSampleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setSampleAudioBase64('')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      setSampleAudioBase64(result.includes(',') ? result.split(',').at(1) ?? '' : result)
      setSampleName((current) => current || file.name)
    }
    reader.onerror = () => {
      setError('Unable to read the selected voice sample file')
      setSampleAudioBase64('')
    }
    reader.readAsDataURL(file)
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
      setSuccessMessage('Voice profile ready for authorized replacement generation.')
    } catch (requestError) {
      setError(getVoiceErrorMessage(requestError, 'Unable to create voice profile'))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleGenerateReplacement() {
    if (!canGenerate || !selectedTarget) {
      return
    }

    setPendingAction('generate')
    setError(null)
    setSuccessMessage(null)

    try {
      const result = await generateAdminVoiceReplacement({
        consentConfirmed,
        profileId: profileId.trim(),
        text: selectedTarget.text,
        target: {
          lessonId,
          targetId: selectedTarget.id,
          moduleType: selectedTarget.moduleType,
        },
      })
      setReplacementAudioUrl(result.audioUrl)
      setPreviewConfirmed(false)
      setSuccessMessage('Replacement audio generated. Preview it before applying to the draft.')
    } catch (requestError) {
      setReplacementAudioUrl('')
      setPreviewConfirmed(false)
      setError(getVoiceErrorMessage(requestError, 'Unable to generate replacement audio'))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleApplyToDraft() {
    if (!canApply || !selectedTarget) {
      return
    }

    setPendingAction('apply')
    setError(null)
    setSuccessMessage(null)

    try {
      const patch = applyVoiceReplacementToModule(lesson, selectedTarget.id, replacementAudioUrl)
      await onApply({
        ...patch,
        targetId: selectedTarget.id,
      })
    } catch (requestError) {
      setError(getVoiceErrorMessage(requestError, 'Unable to apply replacement audio to the draft'))
    } finally {
      setPendingAction(null)
    }
  }

  function handleTargetChange(nextTargetId: string) {
    setSelectedTargetId(nextTargetId)
    setReplacementAudioUrl('')
    setPreviewConfirmed(false)
    setError(null)
    setSuccessMessage(null)
  }

  return (
    <section className="surface-card lesson-section-card admin-history-card" aria-label="Voice replacement">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Authorized voice</p>
          <h2>Voice Replacement</h2>
          <p className="muted-text">
            Admin-only MVP for replacing one existing lesson audio item with a generated or uploaded authorized voice.
          </p>
        </div>
        <span className="badge badge--gold">Draft only</span>
      </div>

      <p className="admin-inline-feedback">
        Only use your own voice or a voice you are explicitly authorized to use. Do not upload celebrity,
        third-party, or impersonation samples. Apply saves a draft only; publishing still uses the existing review flow.
      </p>

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
          {profileId ? `Profile id: ${profileId}` : 'Create a profile after consent and sample upload.'}
        </span>
        <button type="button" className="secondary-link" onClick={handleCreateProfile} disabled={!canCreateProfile}>
          {pendingAction === 'profile' ? 'Creating voice profile…' : 'Create voice profile'}
        </button>
      </div>

      <div className="admin-field-grid">
        <label className="admin-field">
          <span>Audio item to replace</span>
          <select value={selectedTarget?.id ?? ''} onChange={(event) => handleTargetChange(event.target.value)}>
            {targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.label} · {target.text}
              </option>
            ))}
          </select>
        </label>
        {selectedTarget ? (
          <div className="admin-preview-callout">
            <span>Current audio URL</span>
            <p>{selectedTarget.audio}</p>
          </div>
        ) : null}
        <label className="admin-field">
          <span>Replacement audio URL</span>
          <input
            placeholder="Generated URL or already-uploaded authorized replacement"
            value={replacementAudioUrl}
            onChange={(event) => {
              setReplacementAudioUrl(event.target.value)
              setPreviewConfirmed(false)
            }}
          />
        </label>
      </div>

      <div className="admin-card-actions">
        <span className="muted-text">
          Generate from the configured provider, or paste an already-uploaded authorized replacement URL.
        </span>
        <button type="button" className="secondary-link" onClick={handleGenerateReplacement} disabled={!canGenerate}>
          {pendingAction === 'generate' ? 'Generating replacement audio…' : 'Generate replacement audio'}
        </button>
      </div>

      {replacementAudioUrl.trim() ? (
        <div className="admin-field-grid">
          <audio aria-label="Preview replacement audio" controls src={replacementAudioUrl.trim()} />
          <label className="admin-field admin-consent-field">
            <span>
              <input
                type="checkbox"
                checked={previewConfirmed}
                onChange={(event) => setPreviewConfirmed(event.target.checked)}
              />{' '}
              I have previewed and approve this replacement audio
            </span>
          </label>
        </div>
      ) : null}

      <div className="admin-card-actions">
        <span className="muted-text">Apply updates one module draft. It does not publish learner-facing content.</span>
        <button type="button" className="primary-button" onClick={handleApplyToDraft} disabled={!canApply}>
          {pendingAction === 'apply' ? 'Applying to draft…' : 'Apply to draft'}
        </button>
      </div>

      {successMessage ? <p className="admin-inline-feedback admin-inline-feedback--success">{successMessage}</p> : null}
      {error ? <p className="admin-inline-feedback admin-inline-feedback--error">{error}</p> : null}
    </section>
  )
}
