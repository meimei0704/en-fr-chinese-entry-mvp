export interface CreateVoiceProfileInput {
  sampleUrl: string
  sampleName?: string
}

export interface CreateVoiceProfileResult {
  profileId: string
}

export interface GenerateReplacementAudioInput {
  profileId: string
  text: string
  target: {
    lessonId: string
    targetId: string
    moduleType: string
    originalAudio: string
    storageKey: string
    language: 'zh-CN'
  }
}

export interface GenerateReplacementAudioResult {
  audioBase64: string
  contentType: string
}

export interface VoiceCloneProvider {
  createVoiceProfile(input: CreateVoiceProfileInput): Promise<CreateVoiceProfileResult>
  generateReplacementAudio(input: GenerateReplacementAudioInput): Promise<GenerateReplacementAudioResult>
}

export class VoiceProviderNotConfiguredError extends Error {
  constructor() {
    super('Voice cloning provider is not configured')
    this.name = 'VoiceProviderNotConfiguredError'
  }
}

class DisabledVoiceCloneProvider implements VoiceCloneProvider {
  async createVoiceProfile(_input: CreateVoiceProfileInput): Promise<CreateVoiceProfileResult> {
    throw new VoiceProviderNotConfiguredError()
  }

  async generateReplacementAudio(_input: GenerateReplacementAudioInput): Promise<GenerateReplacementAudioResult> {
    throw new VoiceProviderNotConfiguredError()
  }
}

export function createDisabledVoiceCloneProvider(): VoiceCloneProvider {
  return new DisabledVoiceCloneProvider()
}
