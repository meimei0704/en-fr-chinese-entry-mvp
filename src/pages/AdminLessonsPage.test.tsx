import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderRoute } from '../test/renderRoute'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('AdminLessonsPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the internal admin lesson list and links into the editor flow', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse([
        {
          lessonId: 'self-intro',
          slug: 'self-intro',
          displayOrder: 1,
          enabled: true,
          draftChangedModuleCount: 1,
        },
        {
          lessonId: 'order-food',
          slug: 'order-food',
          displayOrder: 2,
          enabled: true,
          draftChangedModuleCount: 0,
        },
      ]),
    )

    renderRoute('/admin')

    expect(screen.getByRole('heading', { level: 1, name: /content admin/i })).toBeVisible()
    expect(screen.getByText(/loading lessons/i)).toBeVisible()

    expect(await screen.findByRole('link', { name: /open self-intro editor/i })).toHaveAttribute(
      'href',
      '/admin/lesson/self-intro',
    )
    expect(screen.getByText(/1 module pending publish/i)).toBeVisible()
    expect(screen.getByText(/all modules published/i)).toBeVisible()
    expect(fetch).toHaveBeenCalledWith('/api/admin/content/lessons', expect.anything())
  })

  it('renders a safe error state when the admin lesson list request fails', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ error: 'Content admin database is not configured' }, { status: 503 }),
    )

    renderRoute('/admin')

    expect(await screen.findByText(/content admin database is not configured/i)).toBeVisible()
    expect(screen.queryByRole('link', { name: /open self-intro editor/i })).not.toBeInTheDocument()
  })
})
