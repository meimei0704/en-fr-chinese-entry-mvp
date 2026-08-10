import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContentApiError, fetchCourse, fetchLesson, fetchPinyinCourse } from './contentApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('contentApi', () => {
  it('resolves course from /api/content/course', async () => {
    const payload = { supportedExplanationLanguages: ['zh', 'en'], estimatedDailyMinutes: 15, lessons: [] }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchCourse()

    expect(fetchMock).toHaveBeenCalledWith('/api/content/course', { credentials: 'same-origin' })
    expect(result).toEqual(payload)
  })

  it('encodes lessonId and resolves lesson', async () => {
    const payload = { id: 'self-intro', title: 'T', scenario: 'S', dialogue: { sections: [] }, sentencePatterns: [], vocabulary: [], practice: {}, reviewCards: [] }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchLesson('self intro')

    expect(fetchMock).toHaveBeenCalledWith('/api/content/lessons?lessonId=self%20intro', { credentials: 'same-origin' })
    expect(result).toEqual(payload)
  })

  it('resolves pinyin course from /api/content/pinyin/course', async () => {
    const payload = { modules: [] }
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload))
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchPinyinCourse()

    expect(fetchMock).toHaveBeenCalledWith('/api/content/pinyin/course', { credentials: 'same-origin' })
    expect(result).toEqual(payload)
  })

  it('throws ContentApiError with status and error message on 404', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: 'Not found' }, 404))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchLesson('missing')).rejects.toMatchObject<ContentApiError>({
      name: 'ContentApiError',
      status: 404,
      message: 'Not found',
    })
  })

  it('throws ContentApiError with fallback message on 500 without body error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(null, 500))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCourse()).rejects.toMatchObject<ContentApiError>({
      name: 'ContentApiError',
      status: 500,
      message: 'Content request failed (500)',
    })
  })

  it('propagates network errors', async () => {
    const networkError = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError))

    await expect(fetchCourse()).rejects.toBe(networkError)
  })
})
