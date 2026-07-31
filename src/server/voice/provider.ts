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

export interface VoiceProviderEnv {
  VOICE_PROVIDER?: string
  MINIMAX_API_KEY?: string
  MINIMAX_BASE_URL?: string
  MINIMAX_T2A_MODEL?: string
  MINIMAX_LANGUAGE_BOOST?: string
  MINIMAX_AUDIO_FORMAT?: string
  MINIMAX_AUDIO_SAMPLE_RATE?: string
  MINIMAX_AUDIO_BITRATE?: string
  MINIMAX_VOICE_ID_PREFIX?: string
  MINIMAX_NEED_NOISE_REDUCTION?: string
  MINIMAX_NEED_VOLUME_NORMALIZATION?: string
}

interface MiniMaxProviderDeps {
  fetch?: typeof fetch
  randomId?: () => string
}

export class VoiceProviderNotConfiguredError extends Error {
  constructor() {
    super('Voice cloning provider is not configured')
    this.name = 'VoiceProviderNotConfiguredError'
  }
}

export class VoiceProviderRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VoiceProviderRequestError'
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

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/g, '')
}

function optionalBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback
  }

  return value === 'true'
}

function optionalInteger(value: string | undefined, fallback: number) {
  if (value === undefined) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sanitizeVoiceIdPart(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function defaultRandomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  }

  return `${Date.now()}${Math.random().toString(16).slice(2, 10)}`
}

function contentTypeFromUrl(url: string) {
  const lower = url.toLowerCase()

  if (lower.endsWith('.wav')) {
    return 'audio/wav'
  }

  if (lower.endsWith('.mp3')) {
    return 'audio/mpeg'
  }

  if (lower.endsWith('.m4a')) {
    return 'audio/mp4'
  }

  return 'application/octet-stream'
}

function extensionForContentType(contentType: string) {
  const normalized = contentType.split(';', 1)[0]?.trim().toLowerCase()

  if (normalized === 'audio/wav' || normalized === 'audio/wave' || normalized === 'audio/x-wav') {
    return 'wav'
  }

  if (normalized === 'audio/mpeg' || normalized === 'audio/mp3') {
    return 'mp3'
  }

  if (normalized === 'audio/mp4' || normalized === 'audio/m4a' || normalized === 'audio/x-m4a') {
    return 'm4a'
  }

  return 'wav'
}

function contentTypeForAudioFormat(format: string) {
  switch (format) {
    case 'mp3':
      return 'audio/mpeg'
    case 'wav':
      return 'audio/wav'
    case 'flac':
      return 'audio/flac'
    case 'opus':
      return 'audio/ogg'
    default:
      return 'application/octet-stream'
  }
}

function getBaseResp(body: unknown) {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const baseResp = (body as { base_resp?: unknown }).base_resp

  if (typeof baseResp !== 'object' || baseResp === null) {
    return null
  }

  return baseResp as { status_code?: unknown; status_msg?: unknown }
}

async function readMiniMaxJson(response: Response, action: string) {
  let body: unknown

  try {
    body = await response.json()
  } catch {
    throw new VoiceProviderRequestError(`MiniMax ${action} failed: invalid JSON response`)
  }

  if (!response.ok) {
    throw new VoiceProviderRequestError(`MiniMax ${action} failed: HTTP ${response.status}`)
  }

  const baseResp = getBaseResp(body)
  const statusCode = typeof baseResp?.status_code === 'number' ? baseResp.status_code : 0

  if (statusCode !== 0) {
    const statusMsg = typeof baseResp?.status_msg === 'string' && baseResp.status_msg.trim()
      ? baseResp.status_msg.trim()
      : `status ${statusCode}`
    throw new VoiceProviderRequestError(`MiniMax ${action} failed: ${statusMsg}`)
  }

  return body
}

class MiniMaxVoiceCloneProvider implements VoiceCloneProvider {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly model: string
  private readonly languageBoost: string
  private readonly audioFormat: string
  private readonly sampleRate: number
  private readonly bitrate: number
  private readonly voiceIdPrefix: string
  private readonly needNoiseReduction: boolean
  private readonly needVolumeNormalization: boolean
  private readonly fetch: typeof fetch
  private readonly randomId: () => string

  constructor(env: VoiceProviderEnv, deps: MiniMaxProviderDeps = {}) {
    if (!env.MINIMAX_API_KEY) {
      throw new VoiceProviderNotConfiguredError()
    }

    this.apiKey = env.MINIMAX_API_KEY
    this.baseUrl = trimTrailingSlash(env.MINIMAX_BASE_URL ?? 'https://api.minimax.io')
    this.model = env.MINIMAX_T2A_MODEL ?? 'speech-2.8-turbo'
    this.languageBoost = env.MINIMAX_LANGUAGE_BOOST ?? 'Chinese'
    this.audioFormat = env.MINIMAX_AUDIO_FORMAT ?? 'mp3'
    this.sampleRate = optionalInteger(env.MINIMAX_AUDIO_SAMPLE_RATE, 32000)
    this.bitrate = optionalInteger(env.MINIMAX_AUDIO_BITRATE, 128000)
    this.voiceIdPrefix = sanitizeVoiceIdPart(env.MINIMAX_VOICE_ID_PREFIX ?? 'ChineseEntry') || 'ChineseEntry'
    this.needNoiseReduction = optionalBoolean(env.MINIMAX_NEED_NOISE_REDUCTION, true)
    this.needVolumeNormalization = optionalBoolean(env.MINIMAX_NEED_VOLUME_NORMALIZATION, true)
    this.fetch = deps.fetch ?? fetch
    this.randomId = deps.randomId ?? defaultRandomId
  }

  async createVoiceProfile(input: CreateVoiceProfileInput): Promise<CreateVoiceProfileResult> {
    const voiceId = this.createVoiceId()
    const source = await this.fetch(input.sampleUrl)

    if (!source.ok) {
      throw new VoiceProviderRequestError(`MiniMax sample download failed: HTTP ${source.status}`)
    }

    const contentType = source.headers.get('content-type') ?? contentTypeFromUrl(input.sampleUrl)
    const extension = extensionForContentType(contentType)
    const formData = new FormData()
    formData.set('purpose', 'voice_clone')
    formData.set('file', new Blob([await source.arrayBuffer()], { type: contentType }), `${voiceId}.${extension}`)

    const uploadResponse = await this.fetch(`${this.baseUrl}/v1/files/upload`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: formData,
    })
    const uploadBody = await readMiniMaxJson(uploadResponse, 'voice clone upload')
    const fileId = this.requireFileId(uploadBody)

    const cloneResponse = await this.fetch(`${this.baseUrl}/v1/voice_clone`, {
      method: 'POST',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        voice_id: voiceId,
        language_boost: this.languageBoost,
        need_noise_reduction: this.needNoiseReduction,
        need_volume_normalization: this.needVolumeNormalization,
        aigc_watermark: false,
      }),
    })
    await readMiniMaxJson(cloneResponse, 'voice clone')

    return { profileId: voiceId }
  }

  async generateReplacementAudio(input: GenerateReplacementAudioInput): Promise<GenerateReplacementAudioResult> {
    const response = await this.fetch(`${this.baseUrl}/v1/t2a_v2`, {
      method: 'POST',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        text: input.text,
        stream: false,
        output_format: 'hex',
        language_boost: this.languageBoost,
        voice_setting: {
          voice_id: input.profileId,
          speed: 1,
          vol: 1,
          pitch: 0,
        },
        audio_setting: {
          sample_rate: this.sampleRate,
          bitrate: this.bitrate,
          format: this.audioFormat,
          channel: 1,
        },
      }),
    })
    const body = await readMiniMaxJson(response, 'T2A')
    const audioHex = this.requireAudioHex(body)

    return {
      audioBase64: Buffer.from(audioHex, 'hex').toString('base64'),
      contentType: contentTypeForAudioFormat(this.audioFormat),
    }
  }

  private createVoiceId() {
    const voiceId = `${this.voiceIdPrefix}_${sanitizeVoiceIdPart(this.randomId())}`
      .replace(/_+$/g, '')
      .slice(0, 256)

    if (/^[a-zA-Z][a-zA-Z0-9_-]{7,255}$/.test(voiceId)) {
      return voiceId
    }

    return `ChineseEntry_${defaultRandomId()}`
  }

  private authHeaders() {
    return { Authorization: `Bearer ${this.apiKey}` }
  }

  private requireFileId(body: unknown) {
    const file = typeof body === 'object' && body !== null ? (body as { file?: unknown }).file : undefined
    const fileId = typeof file === 'object' && file !== null ? (file as { file_id?: unknown }).file_id : undefined

    if (typeof fileId !== 'number') {
      throw new VoiceProviderRequestError('MiniMax voice clone upload failed: missing file_id')
    }

    return fileId
  }

  private requireAudioHex(body: unknown) {
    const data = typeof body === 'object' && body !== null ? (body as { data?: unknown }).data : undefined
    const audio = typeof data === 'object' && data !== null ? (data as { audio?: unknown }).audio : undefined

    if (typeof audio !== 'string' || !audio.trim()) {
      throw new VoiceProviderRequestError('MiniMax T2A failed: missing audio payload')
    }

    return audio
  }
}

export function createMiniMaxVoiceCloneProvider(
  env: VoiceProviderEnv = process.env,
  deps: MiniMaxProviderDeps = {},
): VoiceCloneProvider {
  return new MiniMaxVoiceCloneProvider(env, deps)
}

export function isMiniMaxVoiceProviderConfigured(env: VoiceProviderEnv = process.env) {
  return env.VOICE_PROVIDER === 'minimax' && Boolean(env.MINIMAX_API_KEY)
}

export function createVoiceCloneProviderFromEnv(env: VoiceProviderEnv = process.env, deps: MiniMaxProviderDeps = {}) {
  if (isMiniMaxVoiceProviderConfigured(env)) {
    return createMiniMaxVoiceCloneProvider(env, deps)
  }

  return createDisabledVoiceCloneProvider()
}
