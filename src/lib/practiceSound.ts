export type PracticeSoundKind = 'correct' | 'incorrect' | 'streak' | 'complete'

export interface ToneParams {
  frequency: number
  endFrequency: number
  durationSeconds: number
  gain: number
  waveform: OscillatorType
}

export function soundParamsFor(kind: PracticeSoundKind): ToneParams {
  switch (kind) {
    case 'correct':
      return {
        frequency: 587,
        endFrequency: 1175,
        durationSeconds: 0.18,
        gain: 0.18,
        waveform: 'sine',
      }
    case 'streak':
      return {
        frequency: 784,
        endFrequency: 990,
        durationSeconds: 0.24,
        gain: 0.18,
        waveform: 'triangle',
      }
    case 'incorrect':
      return {
        frequency: 220,
        endFrequency: 180,
        durationSeconds: 0.2,
        gain: 0.14,
        waveform: 'sawtooth',
      }
    case 'complete':
      return {
        frequency: 523,
        endFrequency: 784,
        durationSeconds: 0.3,
        gain: 0.18,
        waveform: 'sine',
      }
  }
}

function buildAudioContext(): AudioContext | null {
  const windowWithAudio = window as Window & { AudioContext?: typeof AudioContext }

  const AudioContextImpl =
    windowWithAudio.AudioContext ??
    (windowWithAudio as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!AudioContextImpl) {
    return null
  }

  return new AudioContextImpl()
}

function scheduleTone(audioContext: AudioContext, params: ToneParams, startAt: number) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = params.waveform
  oscillator.frequency.setValueAtTime(params.frequency, startAt)
  oscillator.frequency.exponentialRampToValueAtTime(
    params.endFrequency,
    startAt + params.durationSeconds,
  )

  gainNode.gain.setValueAtTime(0.0001, startAt)
  gainNode.gain.exponentialRampToValueAtTime(params.gain, startAt + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + params.durationSeconds)

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + params.durationSeconds)
}

export function playPracticeSound(kind: PracticeSoundKind) {
  const audioContext = buildAudioContext()

  if (!audioContext) {
    return
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }

  const now = audioContext.currentTime

  if (kind === 'correct') {
    const notes: ToneParams[] = [
      { frequency: 587, endFrequency: 587, durationSeconds: 0.1, gain: 0.16, waveform: 'sine' },
      { frequency: 880, endFrequency: 880, durationSeconds: 0.16, gain: 0.16, waveform: 'sine' },
    ]

    notes.forEach((note, index) => scheduleTone(audioContext, note, now + index * 0.1))
    return
  }

  scheduleTone(audioContext, soundParamsFor(kind), now)
}
