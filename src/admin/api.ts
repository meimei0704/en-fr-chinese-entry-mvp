import type { AdminLessonSnapshot, AdminLessonSummary } from './types.js'

const adminAuthStorageKey = 'content-admin-basic-auth'
const adminClientHeader = 'X-Content-Admin-Client'
const adminClientHeaderValue = 'spa'

export class AdminApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

async function requestJson<T>(input: string, init: RequestInit = {}): Promise<T> {
  const authHeader = readAdminBasicAuthHeader()
  const response = await fetch(input, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      [adminClientHeader]: adminClientHeaderValue,
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  })
  const body = (await response.json()) as T | { error?: string }

  if (!response.ok) {
    const message = typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
      ? body.error
      : 'Content admin request failed'
    throw new AdminApiError(message, response.status)
  }

  return body as T
}

function sessionStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function readAdminBasicAuthHeader() {
  if (!sessionStorageAvailable()) {
    return null
  }

  return window.sessionStorage.getItem(adminAuthStorageKey)
}

export function saveAdminBasicAuth(username: string, password: string) {
  if (!sessionStorageAvailable()) {
    return
  }

  const encoded = window.btoa(`${username}:${password}`)
  window.sessionStorage.setItem(adminAuthStorageKey, `Basic ${encoded}`)
}

export function clearAdminBasicAuth() {
  if (!sessionStorageAvailable()) {
    return
  }

  window.sessionStorage.removeItem(adminAuthStorageKey)
}

export function listAdminLessons() {
  return requestJson<AdminLessonSummary[]>('/api/admin/content/lessons')
}

export function getAdminLessonSnapshot(lessonId: string) {
  return requestJson<AdminLessonSnapshot>(`/api/admin/content/lessons?lessonId=${lessonId}`)
}

export function saveAdminDraftModule(input: {
  lessonId: string
  moduleType: string
  payload: unknown
  note?: string
}) {
  return requestJson<AdminLessonSnapshot>('/api/admin/content/draft', {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function publishAdminModule(input: {
  lessonId: string
  moduleType: string
  note?: string
}) {
  return requestJson<AdminLessonSnapshot>('/api/admin/content/publish', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function rollbackAdminModule(input: {
  lessonId: string
  moduleType: string
  publishedRevisionId: number
  note?: string
}) {
  return requestJson<AdminLessonSnapshot>('/api/admin/content/rollback', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
