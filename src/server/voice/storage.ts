export interface SaveVoiceSampleInput {
  sampleName?: string
  sampleAudioUrl?: string
  sampleAudioBase64?: string
}

export interface SaveVoiceSampleResult {
  sampleUrl: string
}

export interface SaveGeneratedAudioInput {
  profileId: string
  target: {
    lessonId: string
    targetId: string
    moduleType: string
  }
  audioBase64: string
  contentType: string
}

export interface SaveGeneratedAudioResult {
  audioUrl: string
}

export interface VoiceStorage {
  saveVoiceSample(input: SaveVoiceSampleInput): Promise<SaveVoiceSampleResult>
  saveGeneratedAudio(input: SaveGeneratedAudioInput): Promise<SaveGeneratedAudioResult>
}

export class VoiceStorageNotConfiguredError extends Error {
  constructor() {
    super('Voice sample storage is not configured')
    this.name = 'VoiceStorageNotConfiguredError'
  }
}

class DisabledVoiceStorage implements VoiceStorage {
  async saveVoiceSample(_input: SaveVoiceSampleInput): Promise<SaveVoiceSampleResult> {
    throw new VoiceStorageNotConfiguredError()
  }

  async saveGeneratedAudio(_input: SaveGeneratedAudioInput): Promise<SaveGeneratedAudioResult> {
    throw new VoiceStorageNotConfiguredError()
  }
}

export function createDisabledVoiceStorage(): VoiceStorage {
  return new DisabledVoiceStorage()
}
