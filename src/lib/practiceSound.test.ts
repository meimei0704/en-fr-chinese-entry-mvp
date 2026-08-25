import { describe, expect, it } from 'vitest'

import { soundParamsFor } from './practiceSound'

describe('soundParamsFor', () => {
  it('provides distinct tone parameters for every sound kind', () => {
    const correct = soundParamsFor('correct')
    const incorrect = soundParamsFor('incorrect')
    const streak = soundParamsFor('streak')
    const complete = soundParamsFor('complete')

    expect(correct.frequency).toBeGreaterThan(0)
    expect(correct.durationSeconds).toBeGreaterThan(0)
    expect(incorrect.frequency).toBeLessThan(correct.frequency)
    expect(streak.frequency).toBeGreaterThan(correct.frequency)
    expect(complete.durationSeconds).toBeGreaterThan(correct.durationSeconds)
  })

  it('keeps the incorrect cue low and correct cue rising', () => {
    const incorrect = soundParamsFor('incorrect')
    const correct = soundParamsFor('correct')

    expect(correct.endFrequency).toBeGreaterThan(correct.frequency)
    expect(incorrect.endFrequency).toBeLessThan(incorrect.frequency)
  })

  it('makes the incorrect cue harsher and lower for clear contrast', () => {
    const incorrect = soundParamsFor('incorrect')
    const correct = soundParamsFor('correct')

    expect(incorrect.waveform).toBe('sawtooth')
    expect(incorrect.frequency).toBeLessThan(correct.frequency / 2)
    expect(incorrect.durationSeconds).toBeGreaterThanOrEqual(correct.durationSeconds)
  })

  it('keeps the celebratory and error cues bright and punchy', () => {
    const correct = soundParamsFor('correct')
    const incorrect = soundParamsFor('incorrect')

    expect(correct.waveform).toBe('square')
    expect(incorrect.waveform).toBe('sawtooth')
    expect(correct.gain).toBeGreaterThanOrEqual(0.2)
    expect(incorrect.gain).toBeGreaterThanOrEqual(0.2)
    expect(incorrect.frequency).toBeLessThan(correct.frequency / 2)
  })

  it('keeps all sounds short so they feel like UI cues', () => {
    for (const kind of ['correct', 'incorrect', 'streak', 'complete'] as const) {
      expect(soundParamsFor(kind).durationSeconds).toBeLessThanOrEqual(0.3)
    }
  })
})
