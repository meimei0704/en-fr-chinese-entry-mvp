import type { CourseContent, LessonContent, PinyinCourseContent } from '../content/types'

export class ContentApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ContentApiError'
    this.status = status
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin' })
  const body = (await response.json()) as T | { error?: string }
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error?: unknown }).error === 'string'
        ? (body as { error: string }).error
        : `Content request failed (${response.status})`
    throw new ContentApiError(message, response.status)
  }
  return body as T
}

export function fetchCourse(): Promise<CourseContent> {
  return getJson<CourseContent>('/api/content/course')
}

export function fetchLesson(lessonId: string): Promise<LessonContent> {
  return getJson<LessonContent>(`/api/content/lessons?lessonId=${encodeURIComponent(lessonId)}`)
}

export function fetchPinyinCourse(): Promise<PinyinCourseContent> {
  return getJson<PinyinCourseContent>('/api/content/pinyin/course')
}
