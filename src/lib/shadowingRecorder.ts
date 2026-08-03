export type ShadowingRecorderErrorCode = 'unsupported' | 'permission-denied' | 'init-failed'

export class ShadowingRecorderError extends Error {
  code: ShadowingRecorderErrorCode

  constructor(code: ShadowingRecorderErrorCode, message: string) {
    super(message)
    this.name = 'ShadowingRecorderError'
    this.code = code
  }
}

export interface ShadowingRecorderSession {
  recorder: MediaRecorder
  stream: MediaStream
}

export function isShadowingRecordingSupported() {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  )
}

export function stopShadowingStream(stream: MediaStream) {
  for (const track of stream.getTracks()) {
    track.stop()
  }
}

function isPermissionDeniedError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'SecurityError')
  )
}

function createRecorderError(code: ShadowingRecorderErrorCode) {
  return new ShadowingRecorderError(code, `Shadowing recorder ${code}`)
}

export async function createShadowingRecorder(): Promise<ShadowingRecorderSession> {
  if (!isShadowingRecordingSupported()) {
    throw createRecorderError('unsupported')
  }

  let stream: MediaStream

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      throw createRecorderError('permission-denied')
    }

    throw createRecorderError('init-failed')
  }

  try {
    return {
      recorder: new window.MediaRecorder(stream),
      stream,
    }
  } catch {
    stopShadowingStream(stream)
    throw createRecorderError('init-failed')
  }
}
