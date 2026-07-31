import { put as vercelBlobPut } from '@vercel/blob'

export interface SaveVoiceSampleInput {
  sampleName?: string
  sampleAudioUrl?: string
  sampleAudioBase64?: string
  sampleAudioContentType?: string
  sampleAudioFilename?: string
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
    originalAudio: string
    storageKey: string
    language: 'zh-CN'
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

export interface VoiceStorageEnv {
  VOICE_STORAGE_PROVIDER?: string
  VOICE_BLOB_PREFIX?: string
  VOICE_BLOB_ACCESS?: string
  BLOB_READ_WRITE_TOKEN?: string
  BLOB_STORE_ID?: string
  VERCEL_OIDC_TOKEN?: string
}

type BlobAccess = 'public' | 'private'

interface VercelBlobPutOptions {
  access: BlobAccess
  addRandomSuffix?: boolean
  allowOverwrite?: boolean
  contentType?: string
  token?: string
}

type VercelBlobPut = (
  pathname: string,
  body: ArrayBuffer | Blob | Buffer | string,
  options: VercelBlobPutOptions,
) => Promise<{ url: string }>

interface VercelBlobVoiceStorageDeps {
  put?: VercelBlobPut
  fetch?: typeof fetch
  now?: () => number
}

export class VoiceStorageNotConfiguredError extends Error {
  constructor() {
    super('Voice sample storage is not configured')
    this.name = 'VoiceStorageNotConfiguredError'
  }
}

export class VoiceStorageWriteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VoiceStorageWriteError'
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

function normalizePrefix(prefix: string | undefined) {
  const trimmed = (prefix ?? 'voice').trim().replace(/^\/+|\/+$/g, '')
  return trimmed || 'voice'
}

function parseBlobAccess(value: string | undefined): BlobAccess {
  return value === 'private' ? 'private' : 'public'
}

function sanitizePathSegment(value: string) {
  const sanitized = value
    .trim()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return sanitized || 'voice-sample'
}

function sanitizeStorageKey(value: string) {
  return value
    .split('/')
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .map((segment) => segment.replace(/[^a-zA-Z0-9_.-]+/g, '-'))
    .join('/')
}

function contentTypeFromFilename(filename: string | undefined) {
  const lower = filename?.toLowerCase() ?? ''

  if (lower.endsWith('.wav')) {
    return 'audio/wav'
  }

  if (lower.endsWith('.mp3')) {
    return 'audio/mpeg'
  }

  if (lower.endsWith('.m4a')) {
    return 'audio/mp4'
  }

  if (lower.endsWith('.webm')) {
    return 'audio/webm'
  }

  return undefined
}

function extensionForContentType(contentType: string | undefined, filename?: string) {
  const normalized = contentType?.split(';', 1)[0]?.trim().toLowerCase()

  if (normalized === 'audio/wav' || normalized === 'audio/wave' || normalized === 'audio/x-wav') {
    return 'wav'
  }

  if (normalized === 'audio/mpeg' || normalized === 'audio/mp3') {
    return 'mp3'
  }

  if (normalized === 'audio/mp4' || normalized === 'audio/m4a' || normalized === 'audio/x-m4a') {
    return 'm4a'
  }

  if (normalized === 'audio/webm') {
    return 'webm'
  }

  const filenameType = contentTypeFromFilename(filename)
  if (filenameType) {
    return extensionForContentType(filenameType)
  }

  return 'bin'
}

function normalizeContentType(contentType: string | undefined, filename?: string) {
  const filenameContentType = contentTypeFromFilename(filename)
  const normalized = contentType?.split(';', 1)[0]?.trim().toLowerCase()
  return normalized || filenameContentType || 'application/octet-stream'
}

function parseBase64Audio(input: SaveVoiceSampleInput) {
  const raw = input.sampleAudioBase64?.trim()

  if (!raw) {
    return null
  }

  const dataUrlMatch = /^data:([^;,]+)(?:;[^,]*)?,(.*)$/s.exec(raw)
  const base64 = dataUrlMatch ? dataUrlMatch[2] : raw
  const contentType = normalizeContentType(dataUrlMatch?.[1] ?? input.sampleAudioContentType, input.sampleAudioFilename)

  return {
    bytes: Buffer.from(base64, 'base64'),
    contentType,
    filename: input.sampleAudioFilename,
  }
}

function safeVercelBlobErrorDetail(error: unknown) {
  const message = error instanceof Error ? error.message : ''
  const prefix = 'Vercel Blob: '

  if (!message.startsWith(prefix)) {
    return ''
  }

  return message
    .slice(prefix.length)
    .replace(/vercel_blob_[a-zA-Z0-9_=-]+/g, '[redacted]')
    .replace(/BLOB_READ_WRITE_TOKEN=\S+/g, 'BLOB_READ_WRITE_TOKEN=[redacted]')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 240)
}

class VercelBlobVoiceStorage implements VoiceStorage {
  private readonly prefix: string
  private readonly access: BlobAccess
  private readonly put: VercelBlobPut
  private readonly fetch: typeof fetch
  private readonly now: () => number
  private readonly token: string | undefined

  constructor(env: VoiceStorageEnv = process.env, deps: VercelBlobVoiceStorageDeps = {}) {
    this.prefix = normalizePrefix(env.VOICE_BLOB_PREFIX)
    this.access = parseBlobAccess(env.VOICE_BLOB_ACCESS)
    this.put = deps.put ?? (vercelBlobPut as VercelBlobPut)
    this.fetch = deps.fetch ?? fetch
    this.now = deps.now ?? Date.now
    this.token = env.BLOB_READ_WRITE_TOKEN
  }

  async saveVoiceSample(input: SaveVoiceSampleInput): Promise<SaveVoiceSampleResult> {
    const sample = await this.readSample(input)
    const sampleName = sanitizePathSegment(input.sampleName ?? input.sampleAudioFilename ?? 'authorized-voice-sample')
      .toLowerCase()
    const extension = extensionForContentType(sample.contentType, sample.filename)
    const pathname = `${this.prefix}/samples/${sampleName}-${this.now()}.${extension}`
    const blob = await this.putBlob(
      pathname,
      sample.bytes,
      {
        access: this.access,
        addRandomSuffix: true,
        contentType: sample.contentType,
        ...(this.token ? { token: this.token } : {}),
      },
      'Vercel Blob voice sample upload failed',
    )

    return { sampleUrl: blob.url }
  }

  async saveGeneratedAudio(input: SaveGeneratedAudioInput): Promise<SaveGeneratedAudioResult> {
    const profileId = sanitizePathSegment(input.profileId)
    const storageKey = sanitizeStorageKey(input.target.storageKey)

    if (!storageKey) {
      throw new VoiceStorageWriteError('Generated voice target storage key is invalid')
    }

    const pathname = `${this.prefix}/generated/${profileId}/${storageKey}`
    const blob = await this.putBlob(
      pathname,
      Buffer.from(input.audioBase64, 'base64'),
      {
        access: this.access,
        allowOverwrite: true,
        contentType: input.contentType,
        ...(this.token ? { token: this.token } : {}),
      },
      'Vercel Blob generated audio upload failed',
    )

    return { audioUrl: blob.url }
  }

  private async putBlob(
    pathname: string,
    body: ArrayBuffer | Blob | Buffer | string,
    options: VercelBlobPutOptions,
    failureMessage: string,
  ) {
    try {
      return await this.put(pathname, body, options)
    } catch (error) {
      const safeDetail = safeVercelBlobErrorDetail(error)
      throw new VoiceStorageWriteError(safeDetail ? `${failureMessage}: ${safeDetail}` : failureMessage)
    }
  }

  private async readSample(input: SaveVoiceSampleInput) {
    const base64Audio = parseBase64Audio(input)

    if (base64Audio) {
      return base64Audio
    }

    if (!input.sampleAudioUrl) {
      throw new VoiceStorageWriteError('Missing voice sample audio')
    }

    const response = await this.fetch(input.sampleAudioUrl)

    if (!response.ok) {
      throw new VoiceStorageWriteError('Unable to fetch voice sample URL for storage')
    }

    const bytes = Buffer.from(await response.arrayBuffer())
    const responseContentType = response.headers.get('content-type') ?? undefined

    return {
      bytes,
      contentType: normalizeContentType(input.sampleAudioContentType ?? responseContentType, input.sampleAudioUrl),
      filename: input.sampleAudioFilename ?? input.sampleAudioUrl,
    }
  }
}

export function createVercelBlobVoiceStorage(
  env: VoiceStorageEnv = process.env,
  deps: VercelBlobVoiceStorageDeps = {},
): VoiceStorage {
  return new VercelBlobVoiceStorage(env, deps)
}

export function isVercelBlobVoiceStorageConfigured(env: VoiceStorageEnv = process.env) {
  const hasReadWriteToken = Boolean(env.BLOB_READ_WRITE_TOKEN)
  const hasOidcBinding = Boolean(env.BLOB_STORE_ID && env.VERCEL_OIDC_TOKEN)
  return env.VOICE_STORAGE_PROVIDER === 'vercel_blob' && (hasReadWriteToken || hasOidcBinding)
}

export function createVoiceStorageFromEnv(env: VoiceStorageEnv = process.env, deps: VercelBlobVoiceStorageDeps = {}) {
  if (isVercelBlobVoiceStorageConfigured(env)) {
    return createVercelBlobVoiceStorage(env, deps)
  }

  return createDisabledVoiceStorage()
}
