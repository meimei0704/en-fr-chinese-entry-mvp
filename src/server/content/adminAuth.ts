export interface AdminAuthEnv {
  CONTENT_ADMIN_USERNAME?: string
  CONTENT_ADMIN_PASSWORD?: string
}

export class MissingAdminAuthConfigurationError extends Error {
  constructor() {
    super('Content admin authentication is not configured')
    this.name = 'MissingAdminAuthConfigurationError'
  }
}

export class UnauthorizedAdminAccessError extends Error {
  constructor() {
    super('Admin authentication required')
    this.name = 'UnauthorizedAdminAccessError'
  }
}

type HeaderValue = string | string[] | undefined

export interface HeaderRecord {
  authorization?: HeaderValue
  Authorization?: HeaderValue
  [key: string]: HeaderValue
}

function getHeaderValue(headers: HeaderRecord | undefined, headerName: string) {
  if (!headers) {
    return undefined
  }

  const direct = headers[headerName] ?? headers[headerName.toLowerCase()]
  return Array.isArray(direct) ? direct[0] : direct
}

function decodeBasicAuthorizationHeader(authorization: string) {
  const [scheme, encodedValue] = authorization.split(' ', 2)

  if (scheme !== 'Basic' || !encodedValue) {
    return null
  }

  try {
    const decoded = Buffer.from(encodedValue, 'base64').toString('utf8')
    const separatorIndex = decoded.indexOf(':')

    if (separatorIndex < 0) {
      return null
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

export function requireAdminAuthorization(headers: HeaderRecord | undefined, env: AdminAuthEnv) {
  if (!env.CONTENT_ADMIN_USERNAME || !env.CONTENT_ADMIN_PASSWORD) {
    throw new MissingAdminAuthConfigurationError()
  }

  const authorization = getHeaderValue(headers, 'authorization')
  const credentials = typeof authorization === 'string' ? decodeBasicAuthorizationHeader(authorization) : null

  if (
    !credentials ||
    credentials.username !== env.CONTENT_ADMIN_USERNAME ||
    credentials.password !== env.CONTENT_ADMIN_PASSWORD
  ) {
    throw new UnauthorizedAdminAccessError()
  }
}
