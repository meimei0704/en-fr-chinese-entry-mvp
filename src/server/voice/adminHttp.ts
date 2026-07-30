import { collectCourseVoiceAudioTargets } from '../../admin/voiceTargets.js'
import { course } from '../../content/course.js'
import {
  MissingAdminAuthConfigurationError,
  requireAdminAuthorization,
  UnauthorizedAdminAccessError,
  type AdminAuthEnv,
  type HeaderRecord,
} from '../content/adminAuth.js'
import type { ContentAdminApiRequest, ContentAdminApiResponse } from '../content/adminHttp.js'
import { createDisabledVoiceCloneProvider, VoiceProviderNotConfiguredError, type VoiceCloneProvider } from './provider.js'
import { createDisabledVoiceStorage, VoiceStorageNotConfiguredError, type VoiceStorage } from './storage.js'

interface AdminVoiceServices {
  provider: VoiceCloneProvider
  storage: VoiceStorage
}

const manifestMismatchMessage = 'Voice generation target does not match the course audio manifest'
const voiceTargetManifest = collectCourseVoiceAudioTargets(course.lessons)
const voiceTargetManifestByLessonAndTarget = new Map(
  voiceTargetManifest.map((target) => [`${target.lessonId}::${target.targetId}`, target]),
)

export interface AdminVoiceHttpHandlers {
  samples(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
  generate(req: ContentAdminApiRequest, res: ContentAdminApiResponse): Promise<unknown>
}

class AdminVoiceValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AdminVoiceValidationError'
  }
}

function parseBody(body: unknown) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>
    } catch {
      throw new AdminVoiceValidationError('Invalid JSON request body')
    }
  }

  if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
    return body as Record<string, unknown>
  }

  throw new AdminVoiceValidationError('Invalid JSON request body')
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function requireString(value: unknown, fieldName: string) {
  const parsed = optionalString(value)

  if (!parsed) {
    throw new AdminVoiceValidationError(`Missing ${fieldName}`)
  }

  return parsed
}

function requireTarget(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new AdminVoiceValidationError('Missing target')
  }

  const target = value as Record<string, unknown>
  const parsedTarget = {
    lessonId: requireString(target.lessonId, 'target.lessonId'),
    targetId: requireString(target.targetId, 'target.targetId'),
    moduleType: requireString(target.moduleType, 'target.moduleType'),
    originalAudio: requireString(target.originalAudio, 'target.originalAudio'),
    storageKey: requireString(target.storageKey, 'target.storageKey'),
    language: requireString(target.language, 'target.language'),
  }

  if (parsedTarget.language !== 'zh-CN') {
    throw new AdminVoiceValidationError('Voice generation only supports zh-CN targets in this batch')
  }

  return {
    ...parsedTarget,
    language: 'zh-CN' as const,
  }
}

function requireManifestTargetMatch(input: {
  text: string
  target: ReturnType<typeof requireTarget>
}) {
  const manifestTarget = voiceTargetManifestByLessonAndTarget.get(`${input.target.lessonId}::${input.target.targetId}`)

  if (
    !manifestTarget ||
    manifestTarget.text !== input.text ||
    manifestTarget.moduleType !== input.target.moduleType ||
    manifestTarget.originalAudio !== input.target.originalAudio ||
    manifestTarget.storageKey !== input.target.storageKey ||
    manifestTarget.language !== input.target.language
  ) {
    throw new AdminVoiceValidationError(manifestMismatchMessage)
  }

  return {
    lessonId: manifestTarget.lessonId,
    targetId: manifestTarget.targetId,
    moduleType: manifestTarget.moduleType,
    originalAudio: manifestTarget.originalAudio,
    storageKey: manifestTarget.storageKey,
    language: manifestTarget.language,
  }
}

function methodNotAllowed(res: ContentAdminApiResponse, allow: string) {
  res.setHeader('Allow', allow)
  return res.status(405).json({ error: 'Method not allowed' })
}

function shouldSendBrowserAuthChallenge(headers: HeaderRecord | undefined) {
  const adminClient = headers?.['x-content-admin-client'] ?? headers?.['X-Content-Admin-Client']
  const marker = Array.isArray(adminClient) ? adminClient[0] : adminClient
  return marker !== 'spa'
}

function unauthorized(res: ContentAdminApiResponse, headers: HeaderRecord | undefined) {
  if (shouldSendBrowserAuthChallenge(headers)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Content Admin"')
  }

  return res.status(401).json({ error: 'Admin authentication required' })
}

function mapAdminVoiceError(error: unknown, req: ContentAdminApiRequest, res: ContentAdminApiResponse) {
  if (error instanceof MissingAdminAuthConfigurationError) {
    return res.status(503).json({ error: 'Content admin authentication is not configured' })
  }

  if (error instanceof UnauthorizedAdminAccessError) {
    return unauthorized(res, req.headers)
  }

  if (error instanceof AdminVoiceValidationError) {
    return res.status(400).json({ error: error.message })
  }

  if (error instanceof VoiceStorageNotConfiguredError || error instanceof VoiceProviderNotConfiguredError) {
    return res.status(503).json({ error: error.message })
  }

  return res.status(500).json({ error: 'Unable to process admin voice request' })
}

async function withAdminVoiceErrors(
  req: ContentAdminApiRequest,
  res: ContentAdminApiResponse,
  run: () => Promise<unknown>,
) {
  try {
    return await run()
  } catch (error) {
    return mapAdminVoiceError(error, req, res)
  }
}

export function createAdminVoiceHttpHandlers(
  services: AdminVoiceServices,
  env: AdminAuthEnv = process.env,
): AdminVoiceHttpHandlers {
  return {
    async samples(req, res) {
      if (req.method !== 'POST') {
        return methodNotAllowed(res, 'POST')
      }

      return withAdminVoiceErrors(req, res, async () => {
        requireAdminAuthorization(req.headers, env)
        const body = parseBody(req.body)

        if (body.consentConfirmed !== true) {
          throw new AdminVoiceValidationError('Voice sample consent must be confirmed before upload')
        }

        const sampleAudioUrl = optionalString(body.sampleAudioUrl)
        const sampleAudioBase64 = optionalString(body.sampleAudioBase64)

        if (!sampleAudioUrl && !sampleAudioBase64) {
          throw new AdminVoiceValidationError('Missing sample audio')
        }

        const savedSample = await services.storage.saveVoiceSample({
          sampleName: optionalString(body.sampleName),
          sampleAudioUrl,
          sampleAudioBase64,
        })
        const profile = await services.provider.createVoiceProfile({
          sampleName: optionalString(body.sampleName),
          sampleUrl: savedSample.sampleUrl,
        })

        return res.status(200).json({ profileId: profile.profileId })
      })
    },
    async generate(req, res) {
      if (req.method !== 'POST') {
        return methodNotAllowed(res, 'POST')
      }

      return withAdminVoiceErrors(req, res, async () => {
        requireAdminAuthorization(req.headers, env)
        const body = parseBody(req.body)

        if (body.consentConfirmed !== true) {
          throw new AdminVoiceValidationError('Voice generation consent must be confirmed before replacement audio is created')
        }

        const text = requireString(body.text, 'text')
        const target = requireManifestTargetMatch({
          text,
          target: requireTarget(body.target),
        })
        const profileId = requireString(body.profileId, 'profileId')
        const generated = await services.provider.generateReplacementAudio({
          profileId,
          text,
          target,
        })
        const savedAudio = await services.storage.saveGeneratedAudio({
          profileId,
          target,
          audioBase64: generated.audioBase64,
          contentType: generated.contentType,
        })

        return res.status(200).json({ audioUrl: savedAudio.audioUrl })
      })
    },
  }
}

export function createLazyAdminVoiceHttpHandlers(env: AdminAuthEnv = process.env): AdminVoiceHttpHandlers {
  return createAdminVoiceHttpHandlers(
    {
      provider: createDisabledVoiceCloneProvider(),
      storage: createDisabledVoiceStorage(),
    },
    env,
  )
}
