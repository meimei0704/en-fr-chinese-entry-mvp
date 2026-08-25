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
        gain: 0.24,
        waveform: 'square',
      }
    case 'streak':
      return {
        frequency: 784,
        endFrequency: 1175,
        durationSeconds: 0.26,
        gain: 0.22,
        waveform: 'square',
      }
    case 'incorrect':
      return {
        frequency: 155,
        endFrequency: 110,
        durationSeconds: 0.3,
        gain: 0.28,
        waveform: 'sawtooth',
      }
    case 'complete':
      return {
        frequency: 523,
        endFrequency: 784,
        durationSeconds: 0.3,
        gain: 0.22,
        waveform: 'square',
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
    const arpeggio: ToneParams[] = [
      { frequency: 523.25, endFrequency: 523.25, durationSeconds: 0.1, gain: 0.24, waveform: 'square' },
      { frequency: 659.25, endFrequency: 659.25, durationSeconds: 0.1, gain: 0.24, waveform: 'square' },
      { frequency: 783.99, endFrequency: 783.99, durationSeconds: 0.1, gain: 0.24, waveform: 'square' },
      { frequency: 1046.5, endFrequency: 1046.5, durationSeconds: 0.12, gain: 0.26, waveform: 'square' },
      { frequency: 1318.51, endFrequency: 1318.51, durationSeconds: 0.22, gain: 0.26, waveform: 'square' },
    ]

    arpeggio.forEach((note, index) => scheduleTone(audioContext, note, now + index * 0.07))
    return
  }

  if (kind === 'incorrect') {
    const params = soundParamsFor('incorrect')
    const buzz: ToneParams[] = [
      { ...params, endFrequency: params.frequency, durationSeconds: 0.16 },
      { ...params, durationSeconds: 0.3 },
      { ...params, frequency: params.endFrequency * 0.9, endFrequency: params.endFrequency * 0.75, durationSeconds: 0.24 },
    ]

    buzz.forEach((note, index) => scheduleTone(audioContext, note, now + index * 0.15))
    return
  }

  scheduleTone(audioContext, soundParamsFor(kind), now)
}
