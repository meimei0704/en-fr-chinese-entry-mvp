export interface CreateVoiceProfileInput {
  sampleUrl: string
  sampleName?: string
  sampleAudioBase64?: string
  sampleAudioContentType?: string
  sampleAudioFilename?: string
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
  VOLCENGINE_API_KEY?: string
  VOLCENGINE_BASE_URL?: string
  VOLCENGINE_TTS_RESOURCE_ID?: string
  VOLCENGINE_TTS_MODEL?: string
  VOLCENGINE_AUDIO_FORMAT?: string
  VOLCENGINE_AUDIO_SAMPLE_RATE?: string
  VOLCENGINE_AUDIO_BITRATE?: string
  VOLCENGINE_SPEAKER_ID_PREFIX?: string
  VOLCENGINE_VOICE_STATUS_POLL_ATTEMPTS?: string
  VOLCENGINE_VOICE_STATUS_POLL_INTERVAL_MS?: string
  VOLCENGINE_ENABLE_AUDIO_DENOISE?: string
}

interface MiniMaxProviderDeps {
  fetch?: typeof fetch
  randomId?: () => string
}

interface VolcengineProviderDeps {
  fetch?: typeof fetch
  randomId?: () => string
  sleep?: (durationMs: number) => Promise<void>
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

function defaultSleep(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs)
  })
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
    case 'ogg_opus':
    case 'opus':
      return 'audio/ogg'
    default:
      return 'application/octet-stream'
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function safeProviderErrorDetail(message: string, secrets: string[] = []) {
  let detail = message

  for (const secret of secrets) {
    if (secret.trim().length >= 4) {
      detail = detail.replace(new RegExp(escapeRegExp(secret), 'g'), '[redacted]')
    }
  }

  return detail
    .replace(/(MINIMAX_API_KEY|VOLCENGINE_API_KEY)=\S+/g, '$1=[redacted]')
    .replace(/(Bearer\s+)[^\s"']+/gi, '$1[redacted]')
    .replace(/(X-Api-Key["':=\s]+)[^\s"',}]+/gi, '$1[redacted]')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 240)
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

async function fetchForMiniMax(
  fetchImpl: typeof fetch,
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1],
  action: string,
) {
  try {
    return await fetchImpl(input, init)
  } catch {
    throw new VoiceProviderRequestError(`MiniMax ${action} failed: request failed`)
  }
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
    const source = await fetchForMiniMax(this.fetch, input.sampleUrl, undefined, 'sample download')

    if (!source.ok) {
      throw new VoiceProviderRequestError(`MiniMax sample download failed: HTTP ${source.status}`)
    }

    const contentType = source.headers.get('content-type') ?? contentTypeFromUrl(input.sampleUrl)
    const extension = extensionForContentType(contentType)
    const formData = new FormData()
    formData.set('purpose', 'voice_clone')
    formData.set('file', new Blob([await source.arrayBuffer()], { type: contentType }), `${voiceId}.${extension}`)

    const uploadResponse = await fetchForMiniMax(
      this.fetch,
      `${this.baseUrl}/v1/files/upload`,
      {
        method: 'POST',
        headers: this.authHeaders(),
        body: formData,
      },
      'voice clone upload',
    )
    const uploadBody = await readMiniMaxJson(uploadResponse, 'voice clone upload')
    const fileId = this.requireFileId(uploadBody)

    const cloneResponse = await fetchForMiniMax(
      this.fetch,
      `${this.baseUrl}/v1/voice_clone`,
      {
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
      },
      'voice clone',
    )
    await readMiniMaxJson(cloneResponse, 'voice clone')

    return { profileId: voiceId }
  }

  async generateReplacementAudio(input: GenerateReplacementAudioInput): Promise<GenerateReplacementAudioResult> {
    const response = await fetchForMiniMax(
      this.fetch,
      `${this.baseUrl}/v1/t2a_v2`,
      {
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
      },
      'T2A',
    )
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

async function fetchForVolcengine(
  fetchImpl: typeof fetch,
  input: Parameters<typeof fetch>[0],
  init: Parameters<typeof fetch>[1],
  action: string,
) {
  try {
    return await fetchImpl(input, init)
  } catch {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: request failed`)
  }
}

async function readVolcengineJson(response: Response, action: string, secrets: string[] = []) {
  let body: unknown

  try {
    body = await response.json()
  } catch {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: invalid JSON response`)
  }

  const message = typeof body === 'object' && body !== null && typeof (body as { message?: unknown }).message === 'string'
    ? safeProviderErrorDetail((body as { message: string }).message, secrets)
    : ''
  const code = typeof body === 'object' && body !== null && typeof (body as { code?: unknown }).code === 'number'
    ? (body as { code: number }).code
    : 0

  if (!response.ok || code !== 0) {
    const detail = message || `HTTP ${response.status}`
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: ${detail}`)
  }

  return body
}

const VOLCENGINE_TTS_COMPLETION_CODE = 20000000

function parseVolcengineStreamJson(value: string, action: string) {
  try {
    return JSON.parse(value) as unknown
  } catch {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: invalid JSON response`)
  }
}

function findCompleteJsonValueEnd(value: string) {
  let depth = 0
  let inString = false
  let escaped = false
  let started = false

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]

    if (!started) {
      if (/\s/.test(character)) {
        continue
      }

      if (character !== '{' && character !== '[') {
        return null
      }

      started = true
      depth = 1
      continue
    }

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === '"') {
        inString = false
      }
      continue
    }

    if (character === '"') {
      inString = true
      continue
    }

    if (character === '{' || character === '[') {
      depth += 1
    } else if (character === '}' || character === ']') {
      depth -= 1
      if (depth === 0) {
        return index + 1
      }
    }
  }

  return null
}

function consumeVolcengineStreamMessages(buffer: string, action: string) {
  const messages: unknown[] = []
  let remaining = buffer

  while (remaining.trimStart()) {
    remaining = remaining.trimStart()

    const lineEnd = remaining.search(/\r?\n/)
    const lineEndLength = lineEnd >= 0 && remaining[lineEnd] === '\r' && remaining[lineEnd + 1] === '\n' ? 2 : 1
    const line = lineEnd >= 0 ? remaining.slice(0, lineEnd).trim() : ''

    if (line.startsWith('event:') || line.startsWith('id:') || line.startsWith('retry:')) {
      remaining = remaining.slice(lineEnd + lineEndLength)
      continue
    }

    if (line.startsWith('data:')) {
      const payload = line.replace(/^data:\s*/u, '').trim()
      remaining = remaining.slice(lineEnd + lineEndLength)

      if (!payload || payload === '[DONE]') {
        continue
      }

      messages.push(parseVolcengineStreamJson(payload, action))
      continue
    }

    if (remaining.startsWith('data:')) {
      break
    }

    const jsonEnd = findCompleteJsonValueEnd(remaining)
    if (jsonEnd === null) {
      break
    }

    messages.push(parseVolcengineStreamJson(remaining.slice(0, jsonEnd), action))
    remaining = remaining.slice(jsonEnd)
  }

  return { messages, remaining }
}

function getVolcengineMessage(body: unknown, secrets: string[] = []) {
  if (typeof body !== 'object' || body === null) {
    return { code: undefined, message: '' }
  }

  return {
    code: typeof (body as { code?: unknown }).code === 'number'
      ? (body as { code: number }).code
      : undefined,
    message: typeof (body as { message?: unknown }).message === 'string'
      ? safeProviderErrorDetail((body as { message: string }).message, secrets)
      : '',
  }
}

function getVolcengineAudioBase64(body: unknown) {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const data = (body as { data?: unknown }).data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data === 'object' && data !== null) {
    const audio = (data as { audio?: unknown }).audio
    if (typeof audio === 'string' && audio.trim()) {
      return audio
    }
  }

  return null
}

async function readVolcengineTtsStream(response: Response, action: string, secrets: string[] = []) {
  const audioChunks: Buffer[] = []
  let pending = ''
  let sawMessage = false

  const processMessages = () => {
    const parsed = consumeVolcengineStreamMessages(pending, action)
    pending = parsed.remaining

    for (const body of parsed.messages) {
      sawMessage = true
      const { code, message } = getVolcengineMessage(body, secrets)

      if (!response.ok && code === 0) {
        throw new VoiceProviderRequestError(`Volcengine ${action} failed: ${message || `HTTP ${response.status}`}`)
      }

      if (code === VOLCENGINE_TTS_COMPLETION_CODE) {
        continue
      }

      if (code !== 0) {
        const detail = message || (typeof code === 'number' ? `code ${code}` : `HTTP ${response.status}`)
        throw new VoiceProviderRequestError(`Volcengine ${action} failed: ${detail}`)
      }

      const audioBase64 = getVolcengineAudioBase64(body)
      if (audioBase64) {
        audioChunks.push(Buffer.from(audioBase64.replace(/\s+/g, ''), 'base64'))
      }
    }
  }

  if (response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    for (;;) {
      const { done, value } = await reader.read()
      if (done) {
        pending += decoder.decode()
        break
      }

      pending += decoder.decode(value, { stream: true })
      processMessages()
    }
  } else {
    pending = await response.text()
  }

  processMessages()

  if (pending.trim()) {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: invalid JSON response`)
  }

  if (!response.ok && !sawMessage) {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: HTTP ${response.status}`)
  }

  if (audioChunks.length === 0) {
    throw new VoiceProviderRequestError(`Volcengine ${action} failed: missing audio payload`)
  }

  return Buffer.concat(audioChunks).toString('base64')
}

function audioFormatFromContentType(contentType: string | undefined, filenameOrUrl?: string) {
  const extension = extensionForContentType(contentType ?? contentTypeFromUrl(filenameOrUrl ?? ''))

  if (extension === 'mp3' || extension === 'wav' || extension === 'm4a') {
    return extension
  }

  if (filenameOrUrl?.toLowerCase().endsWith('.ogg')) {
    return 'ogg'
  }

  if (filenameOrUrl?.toLowerCase().endsWith('.aac')) {
    return 'aac'
  }

  return 'wav'
}

function parseInlineSampleAudio(input: CreateVoiceProfileInput) {
  const raw = input.sampleAudioBase64?.trim()

  if (!raw) {
    return null
  }

  const dataUrlMatch = /^data:([^;,]+)(?:;[^,]*)?,(.*)$/s.exec(raw)
  const contentType = dataUrlMatch?.[1] ?? input.sampleAudioContentType ?? contentTypeFromUrl(input.sampleAudioFilename ?? '')
  const base64 = (dataUrlMatch?.[2] ?? raw).replace(/\s+/g, '')

  return {
    base64,
    format: audioFormatFromContentType(contentType, input.sampleAudioFilename),
  }
}

class VolcengineVoiceCloneProvider implements VoiceCloneProvider {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly ttsResourceId: string
  private readonly ttsModel: string
  private readonly audioFormat: string
  private readonly sampleRate: number
  private readonly bitrate: number
  private readonly speakerIdPrefix: string
  private readonly voiceStatusPollAttempts: number
  private readonly voiceStatusPollIntervalMs: number
  private readonly enableAudioDenoise: boolean
  private readonly fetch: typeof fetch
  private readonly randomId: () => string
  private readonly sleep: (durationMs: number) => Promise<void>

  constructor(env: VoiceProviderEnv, deps: VolcengineProviderDeps = {}) {
    if (!env.VOLCENGINE_API_KEY) {
      throw new VoiceProviderNotConfiguredError()
    }

    this.apiKey = env.VOLCENGINE_API_KEY
    this.baseUrl = trimTrailingSlash(env.VOLCENGINE_BASE_URL ?? 'https://openspeech.bytedance.com')
    this.ttsResourceId = env.VOLCENGINE_TTS_RESOURCE_ID ?? 'seed-icl-2.0'
    this.ttsModel = env.VOLCENGINE_TTS_MODEL ?? 'seed-tts-2.0-standard'
    this.audioFormat = env.VOLCENGINE_AUDIO_FORMAT ?? 'mp3'
    this.sampleRate = optionalInteger(env.VOLCENGINE_AUDIO_SAMPLE_RATE, 32000)
    this.bitrate = optionalInteger(env.VOLCENGINE_AUDIO_BITRATE, 128000)
    this.speakerIdPrefix = sanitizeVoiceIdPart(env.VOLCENGINE_SPEAKER_ID_PREFIX ?? 'ChineseEntry') || 'ChineseEntry'
    this.voiceStatusPollAttempts = Math.max(1, optionalInteger(env.VOLCENGINE_VOICE_STATUS_POLL_ATTEMPTS, 3))
    this.voiceStatusPollIntervalMs = Math.max(0, optionalInteger(env.VOLCENGINE_VOICE_STATUS_POLL_INTERVAL_MS, 1500))
    this.enableAudioDenoise = optionalBoolean(env.VOLCENGINE_ENABLE_AUDIO_DENOISE, false)
    this.fetch = deps.fetch ?? fetch
    this.randomId = deps.randomId ?? defaultRandomId
    this.sleep = deps.sleep ?? defaultSleep
  }

  async createVoiceProfile(input: CreateVoiceProfileInput): Promise<CreateVoiceProfileResult> {
    const speakerId = this.createSpeakerId()
    const sample = await this.readSample(input)
    const voiceCloneResponse = await fetchForVolcengine(
      this.fetch,
      `${this.baseUrl}/api/v3/tts/voice_clone`,
      {
        method: 'POST',
        headers: this.jsonHeaders(),
        body: JSON.stringify({
          speaker_id: 'custom_speaker_id',
          custom_speaker_id: speakerId,
          audio: {
            data: sample.base64,
            format: sample.format,
          },
          language: 0,
          extra_params: {
            enable_audio_denoise: this.enableAudioDenoise,
          },
        }),
      },
      'voice clone',
    )
    const voiceCloneBody = await readVolcengineJson(voiceCloneResponse, 'voice clone', [this.apiKey])

    if (this.isVoiceReady(voiceCloneBody)) {
      return { profileId: speakerId }
    }

    let lastStatus = this.voiceStatus(voiceCloneBody)
    for (let attempt = 0; attempt < this.voiceStatusPollAttempts; attempt += 1) {
      if (attempt > 0 && this.voiceStatusPollIntervalMs > 0) {
        await this.sleep(this.voiceStatusPollIntervalMs)
      }

      const statusBody = await this.getVoiceStatus(speakerId)
      lastStatus = this.voiceStatus(statusBody)

      if (this.isVoiceReady(statusBody)) {
        return { profileId: speakerId }
      }

      if (lastStatus === 3) {
        throw new VoiceProviderRequestError('Volcengine voice clone training failed: status 3')
      }
    }

    const status = lastStatus ?? 'unknown'
    throw new VoiceProviderRequestError(`Volcengine voice clone training is not ready: status ${status}`)
  }

  async generateReplacementAudio(input: GenerateReplacementAudioInput): Promise<GenerateReplacementAudioResult> {
    const response = await fetchForVolcengine(
      this.fetch,
      `${this.baseUrl}/api/v3/tts/unidirectional`,
      {
        method: 'POST',
        headers: {
          ...this.jsonHeaders(),
          'X-Api-Resource-Id': this.ttsResourceId,
        },
        body: JSON.stringify({
          req_params: {
            text: input.text,
            speaker: input.profileId,
            model: this.ttsModel,
            explicit_language: 'zh-cn',
            audio_params: {
              format: this.audioFormat,
              sample_rate: this.sampleRate,
              bit_rate: this.bitrate,
            },
          },
        }),
      },
      'TTS',
    )
    const audioBase64 = await readVolcengineTtsStream(response, 'TTS', [this.apiKey])

    return {
      audioBase64,
      contentType: contentTypeForAudioFormat(this.audioFormat),
    }
  }

  private async readSample(input: CreateVoiceProfileInput) {
    const inlineSample = parseInlineSampleAudio(input)
    if (inlineSample) {
      return inlineSample
    }

    const source = await fetchForVolcengine(this.fetch, input.sampleUrl, undefined, 'sample download')
    if (!source.ok) {
      throw new VoiceProviderRequestError(`Volcengine sample download failed: HTTP ${source.status}`)
    }

    const contentType = source.headers.get('content-type') ?? contentTypeFromUrl(input.sampleUrl)
    return {
      base64: Buffer.from(await source.arrayBuffer()).toString('base64'),
      format: audioFormatFromContentType(contentType, input.sampleUrl),
    }
  }

  private async getVoiceStatus(speakerId: string) {
    const response = await fetchForVolcengine(
      this.fetch,
      `${this.baseUrl}/api/v3/tts/get_voice`,
      {
        method: 'POST',
        headers: this.jsonHeaders(),
        body: JSON.stringify({
          speaker_id: 'custom_speaker_id',
          custom_speaker_id: speakerId,
        }),
      },
      'voice status',
    )
    return readVolcengineJson(response, 'voice status', [this.apiKey])
  }

  private createSpeakerId() {
    const speakerId = `${this.speakerIdPrefix}_${sanitizeVoiceIdPart(this.randomId())}`
      .replace(/_+$/g, '')
      .slice(0, 256)

    if (/^[a-zA-Z][a-zA-Z0-9_-]{7,255}$/.test(speakerId)) {
      return speakerId
    }

    return `ChineseEntry_${defaultRandomId()}`
  }

  private jsonHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
      'X-Api-Request-Id': defaultRandomId(),
    }
  }

  private isVoiceReady(body: unknown) {
    const status = this.voiceStatus(body)
    return status === 2 || status === 4
  }

  private voiceStatus(body: unknown) {
    if (typeof body !== 'object' || body === null) {
      return undefined
    }

    const status = (body as { status?: unknown }).status
    return typeof status === 'number' ? status : undefined
  }
}

export function createMiniMaxVoiceCloneProvider(
  env: VoiceProviderEnv = process.env,
  deps: MiniMaxProviderDeps = {},
): VoiceCloneProvider {
  return new MiniMaxVoiceCloneProvider(env, deps)
}

export function createVolcengineVoiceCloneProvider(
  env: VoiceProviderEnv = process.env,
  deps: VolcengineProviderDeps = {},
): VoiceCloneProvider {
  return new VolcengineVoiceCloneProvider(env, deps)
}

export function isMiniMaxVoiceProviderConfigured(env: VoiceProviderEnv = process.env) {
  return env.VOICE_PROVIDER === 'minimax' && Boolean(env.MINIMAX_API_KEY)
}

export function isVolcengineVoiceProviderConfigured(env: VoiceProviderEnv = process.env) {
  return env.VOICE_PROVIDER === 'volcengine' && Boolean(env.VOLCENGINE_API_KEY)
}

export function isVoiceProviderConfigured(env: VoiceProviderEnv = process.env) {
  return isMiniMaxVoiceProviderConfigured(env) || isVolcengineVoiceProviderConfigured(env)
}

export function createVoiceCloneProviderFromEnv(
  env: VoiceProviderEnv = process.env,
  deps: MiniMaxProviderDeps & VolcengineProviderDeps = {},
) {
  if (isMiniMaxVoiceProviderConfigured(env)) {
    return createMiniMaxVoiceCloneProvider(env, deps)
  }

  if (isVolcengineVoiceProviderConfigured(env)) {
    return createVolcengineVoiceCloneProvider(env, deps)
  }

  return createDisabledVoiceCloneProvider()
}
