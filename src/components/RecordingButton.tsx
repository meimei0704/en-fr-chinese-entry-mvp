import { useEffect, useRef, useState } from 'react'
import {
  createShadowingRecorder,
  isShadowingRecordingSupported,
  stopShadowingStream,
  type ShadowingRecorderErrorCode,
} from '../lib/shadowingRecorder'

interface RecordingButtonProps {
  label: string
  recordLabel: string
  stopLabel: string
  replayLabel: string
  unsupportedLabel: string
  deniedLabel: string
  errorLabel: string
}

type RecordingState =
  | 'idle'
  | 'recording'
  | 'recorded'
  | 'unsupported'
  | 'denied'
  | 'error'

export function RecordingButton({
  label,
  recordLabel,
  stopLabel,
  replayLabel,
  unsupportedLabel,
  deniedLabel,
  errorLabel,
}: RecordingButtonProps) {
  const [state, setState] = useState<RecordingState>(() =>
    isShadowingRecordingSupported() ? 'idle' : 'unsupported',
  )
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      stopStream()
      revokeAudioUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function stopStream() {
    if (streamRef.current) {
      stopShadowingStream(streamRef.current)
      streamRef.current = null
    }
  }

  function revokeAudioUrl() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }

  function fail(code: ShadowingRecorderErrorCode) {
    setState(code === 'permission-denied' ? 'denied' : 'error')
    stopStream()
  }

  async function startRecording() {
    let session
    try {
      session = await createShadowingRecorder()
    } catch (error) {
      const code =
        error instanceof Error && 'code' in error
          ? (error.code as ShadowingRecorderErrorCode)
          : 'init-failed'
      fail(code)
      return
    }

    streamRef.current = session.stream
    chunksRef.current = []

    session.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }
    session.recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: session.recorder.mimeType || 'audio/webm' })
      revokeAudioUrl()
      audioUrlRef.current = URL.createObjectURL(blob)
      setState('recorded')
    }

    mediaRecorderRef.current = session.recorder
    session.recorder.start()
    setState('recording')
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    stopStream()
    setState('recorded')
  }

  function replay() {
    if (!audioUrlRef.current) {
      return
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrlRef.current)
    } else {
      audioRef.current.src = audioUrlRef.current
    }
    void audioRef.current.play()
  }

  if (state === 'unsupported') {
    return (
      <p className="recording-button recording-button--unsupported">{unsupportedLabel}</p>
    )
  }

  if (state === 'denied' || state === 'error') {
    const message =
      state === 'denied' ? deniedLabel : errorLabel
    return (
      <p className="recording-button recording-button--error" role="alert">
        {message}
      </p>
    )
  }

  return (
    <div className="recording-button" aria-label={label}>
      {state !== 'recording' ? (
        <button type="button" className="recording-button__action" onClick={startRecording}>
          {recordLabel}
        </button>
      ) : (
        <button type="button" className="recording-button__action" onClick={stopRecording}>
          {stopLabel}
        </button>
      )}
      {state === 'recorded' && audioUrlRef.current ? (
        <button type="button" className="recording-button__action" onClick={replay}>
          {replayLabel}
        </button>
      ) : null}
    </div>
  )
}
