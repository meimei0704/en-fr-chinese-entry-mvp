import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    window.sessionStorage.clear()
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
    expect(screen.getByTestId('admin-lessons-loading-shell')).toBeVisible()

    expect(await screen.findByRole('link', { name: /open self-intro editor/i })).toHaveAttribute(
      'href',
      '/admin/lesson/self-intro',
    )
    expect(screen.getByRole('link', { name: /batch voice generation/i })).toHaveAttribute('href', '/admin/voice')
    expect(screen.getByTestId('admin-overview-metrics')).toBeVisible()
    expect(screen.getByText(/2 lessons/i)).toBeVisible()
    expect(screen.getByText(/1 pending module/i)).toBeVisible()
    expect(screen.getByTestId('admin-lessons-grid')).toBeVisible()
    expect(screen.getByText(/1 module pending publish/i)).toBeVisible()
    expect(screen.getByText(/all modules published/i)).toBeVisible()
    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/content/lessons',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Content-Admin-Client': 'spa',
        }),
      }),
    )
  })

  it('renders a safe error state when the admin lesson list request fails', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ error: 'Content admin database is not configured' }, { status: 503 }),
    )

    renderRoute('/admin')

    expect(await screen.findByText(/content admin database is not configured/i)).toBeVisible()
    expect(screen.queryByRole('link', { name: /open self-intro editor/i })).not.toBeInTheDocument()
  })

  it('prompts for admin credentials after a 401 and retries the request with a basic auth header', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ error: 'Admin authentication required' }, { status: 401 }))
      .mockResolvedValueOnce(
        jsonResponse([
          {
            lessonId: 'self-intro',
            slug: 'self-intro',
            displayOrder: 1,
            enabled: true,
            draftChangedModuleCount: 0,
          },
        ]),
      )

    renderRoute('/admin')

    expect(await screen.findByRole('heading', { level: 2, name: /admin sign in required/i })).toBeVisible()
    expect(screen.getByTestId('admin-auth-layout')).toBeVisible()
    expect(screen.getByTestId('admin-access-card')).toBeVisible()

    await user.type(screen.getByLabelText(/admin username/i), 'editor')
    await user.type(screen.getByLabelText(/admin password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /unlock content admin/i }))

    expect(await screen.findByRole('link', { name: /open self-intro editor/i })).toBeVisible()
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/lessons',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Basic ZWRpdG9yOnNlY3JldA==',
        }),
      }),
    )
  })

  it('clears stored credentials and returns to the sign-in screen when signing out from the lesson list', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('content-admin-basic-auth', 'Basic ZWRpdG9yOnNlY3JldA==')
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse([
        {
          lessonId: 'self-intro',
          slug: 'self-intro',
          displayOrder: 1,
          enabled: true,
          draftChangedModuleCount: 0,
        },
      ]),
    )

    renderRoute('/admin')

    expect(await screen.findByRole('link', { name: /open self-intro editor/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: /sign out/i }))

    expect(await screen.findByRole('heading', { level: 2, name: /admin sign in required/i })).toBeVisible()
    expect(window.sessionStorage.getItem('content-admin-basic-auth')).toBeNull()
  })
})
