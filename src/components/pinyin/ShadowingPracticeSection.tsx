import { useEffect, useRef, useState } from 'react'

import { getLocalizedText } from '../../content/copy'
import type {
  ExplanationLanguage,
  PinyinProgress,
  PinyinShadowing,
} from '../../content/types'
import {
  loadPinyinProgress,
  recordPinyinShadowingPromptComplete,
  savePinyinProgress,
} from '../../lib/pinyinProgress'
import {
  createShadowingRecorder,
  ShadowingRecorderError,
  stopShadowingStream,
  type ShadowingRecorderErrorCode,
} from '../../lib/shadowingRecorder'
import { SpeechButton } from '../SpeechButton'

type RecordingStatus = 'idle' | 'starting' | 'recording'

export interface ShadowingPracticeCopy {
  lessonEyebrow: string
  promptProgress: (current: number, total: number) => string
  promptCompletionProgress: (done: number, total: number) => string
  playPromptAudio: (current: number) => string
  startRecording: string
  stopRecording: string
  recordAgain: string
  nextPrompt: string
  recordingInProgress: string
  localOnlyNotice: string
  localPlaybackLabel: string
  completedMessage: string
  recordingErrors: Record<ShadowingRecorderErrorCode, string>
}

interface ShadowingPracticeSectionProps {
  shadowing: PinyinShadowing
  language: ExplanationLanguage
  progress: PinyinProgress
  copy: ShadowingPracticeCopy
  onProgressChange: (progress: PinyinProgress) => void
}

export function ShadowingPracticeSection({
  shadowing,
  language,
  progress,
  copy,
  onProgressChange,
}: ShadowingPracticeSectionProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle')
  const [errorCode, setErrorCode] = useState<ShadowingRecorderErrorCode | null>(null)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordingUrlRef = useRef<string | null>(null)

  const prompts = shadowing.prompts
  const currentPrompt = prompts[currentPromptIndex]
  const promptIds = prompts.map((prompt) => prompt.id)
  const completedPromptCount = progress.shadowingCompletedPromptIds.length
  const hasRecordedCurrentPrompt = progress.shadowingCompletedPromptIds.includes(currentPrompt.id)
  const allPromptsCompleted =
    prompts.length > 0 && prompts.every((prompt) => progress.shadowingCompletedPromptIds.includes(prompt.id))

  function revokeCurrentRecordingUrl() {
    if (recordingUrlRef.current !== null) {
      URL.revokeObjectURL(recordingUrlRef.current)
      recordingUrlRef.current = null
    }
  }

  function clearLocalRecording() {
    revokeCurrentRecordingUrl()
    setRecordingUrl(null)
  }

  function releaseRecorderSession() {
    if (streamRef.current !== null) {
      stopShadowingStream(streamRef.current)
    }

    streamRef.current = null
    recorderRef.current = null
  }

  useEffect(() => {
    return () => {
      revokeCurrentRecordingUrl()
      releaseRecorderSession()
    }
  }, [])

  function markCurrentPromptComplete() {
    const nextProgress = recordPinyinShadowingPromptComplete(
      loadPinyinProgress(),
      currentPrompt.id,
      promptIds,
    )

    savePinyinProgress(nextProgress)
    onProgressChange(nextProgress)
  }

  function handleRecorderStop() {
    const recordingBlob = new Blob(chunksRef.current, {
      type: chunksRef.current[0]?.type ?? 'audio/webm',
    })
    const nextRecordingUrl = URL.createObjectURL(recordingBlob)

    releaseRecorderSession()
    revokeCurrentRecordingUrl()
    recordingUrlRef.current = nextRecordingUrl
    setRecordingUrl(nextRecordingUrl)
    setRecordingStatus('idle')
    markCurrentPromptComplete()
  }

  function showRecorderError(code: ShadowingRecorderErrorCode) {
    releaseRecorderSession()
    setErrorCode(code)
    setRecordingStatus('idle')
  }

  async function handleStartRecording() {
    setErrorCode(null)
    clearLocalRecording()
    setRecordingStatus('starting')
    chunksRef.current = []

    try {
      const { recorder, stream } = await createShadowingRecorder()

      recorderRef.current = recorder
      streamRef.current = stream
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      recorder.onstop = handleRecorderStop
      recorder.onerror = () => {
        showRecorderError('init-failed')
      }
      recorder.start()
      setRecordingStatus('recording')
    } catch (error) {
      showRecorderError(error instanceof ShadowingRecorderError ? error.code : 'init-failed')
    }
  }

  function handleStopRecording() {
    if (recorderRef.current === null) {
      return
    }

    try {
      recorderRef.current.stop()
    } catch {
      showRecorderError('init-failed')
    }
  }

  function handleNextPrompt() {
    clearLocalRecording()
    setErrorCode(null)
    setCurrentPromptIndex((index) => Math.min(index + 1, prompts.length - 1))
  }

  return (
    <section id="pinyin-shadowing" className="surface-card pinyin-shadowing-section">
      <div className="pinyin-section-heading">
        <p className="eyebrow">{copy.lessonEyebrow}</p>
        <h2>{getLocalizedText(shadowing.title, language)}</h2>
        <p className="muted-text">{getLocalizedText(shadowing.instructions, language)}</p>
      </div>

      <article className="study-item pinyin-shadowing-section__prompt">
        <p className="eyebrow">{copy.promptProgress(currentPromptIndex + 1, prompts.length)}</p>
        <h3>{currentPrompt.promptText}</h3>
        <p className="pinyin-line">{currentPrompt.pinyin}</p>
        <p className="muted-text">{getLocalizedText(currentPrompt.meaning, language)}</p>
        <p className="muted-text">{copy.promptCompletionProgress(completedPromptCount, prompts.length)}</p>

        <div className="button-row">
          <SpeechButton
            label={copy.playPromptAudio(currentPromptIndex + 1)}
            text={currentPrompt.promptText}
            audioSrc={currentPrompt.audio}
          />

          {recordingStatus === 'recording' ? (
            <button className="primary-button" type="button" onClick={handleStopRecording}>
              {copy.stopRecording}
            </button>
          ) : (
            <button
              className="primary-button"
              type="button"
              disabled={recordingStatus === 'starting'}
              onClick={handleStartRecording}
            >
              {recordingUrl === null ? copy.startRecording : copy.recordAgain}
            </button>
          )}

          {recordingUrl !== null && currentPromptIndex < prompts.length - 1 ? (
            <button className="secondary-link" type="button" onClick={handleNextPrompt}>
              {copy.nextPrompt}
            </button>
          ) : null}
        </div>

        <p className="muted-text">{copy.localOnlyNotice}</p>

        {recordingStatus === 'recording' ? (
          <p className="muted-text" aria-live="polite">
            {copy.recordingInProgress}
          </p>
        ) : null}

        {errorCode !== null ? (
          <p className="form-error" role="alert">
            {copy.recordingErrors[errorCode]}
          </p>
        ) : null}

        {recordingUrl !== null ? (
          <audio aria-label={copy.localPlaybackLabel} controls src={recordingUrl} />
        ) : null}

        {hasRecordedCurrentPrompt ? (
          <p className="muted-text" aria-live="polite">
            {allPromptsCompleted ? copy.completedMessage : copy.promptCompletionProgress(completedPromptCount, prompts.length)}
          </p>
        ) : null}
      </article>
    </section>
  )
}
