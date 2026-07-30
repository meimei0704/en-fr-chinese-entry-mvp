import '@testing-library/jest-dom/vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { course } from '../content/course'
import { renderRoute } from '../test/renderRoute'

const lesson = course.lessons[0]

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

function lessonSnapshot() {
  return {
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: 1,
    enabled: true,
    draftLesson: lesson,
    publishedLesson: lesson,
    modules: [
      { moduleType: 'lessonMeta', draftRevisionId: 102, publishedRevisionId: 101, hasUnpublishedChanges: true },
      { moduleType: 'dialogue', draftRevisionId: 104, publishedRevisionId: 103, hasUnpublishedChanges: false },
      { moduleType: 'sentencePatterns', draftRevisionId: 106, publishedRevisionId: 105, hasUnpublishedChanges: false },
      { moduleType: 'vocabulary', draftRevisionId: 108, publishedRevisionId: 107, hasUnpublishedChanges: false },
      { moduleType: 'pronunciation', draftRevisionId: 110, publishedRevisionId: 109, hasUnpublishedChanges: false },
      { moduleType: 'hanziRecognition', draftRevisionId: 112, publishedRevisionId: 111, hasUnpublishedChanges: false },
      { moduleType: 'practice', draftRevisionId: 114, publishedRevisionId: 113, hasUnpublishedChanges: false },
      { moduleType: 'reviewCards', draftRevisionId: 116, publishedRevisionId: 115, hasUnpublishedChanges: false },
      { moduleType: 'shortInput', draftRevisionId: 118, publishedRevisionId: 117, hasUnpublishedChanges: false },
    ],
    publishedHistory: {
      lessonMeta: [{ revisionId: 101, createdAt: '2026-07-28T00:00:00.000Z', createdBy: 'seed', note: 'Initial published baseline', sourceRevisionId: null, payload: { id: lesson.id, title: lesson.title, scenario: lesson.scenario }, lessonId: lesson.id, moduleType: 'lessonMeta' }],
      dialogue: [],
      sentencePatterns: [],
      vocabulary: [],
      pronunciation: [],
      hanziRecognition: [],
      practice: [],
      reviewCards: [],
      shortInput: [],
    },
  }
}

describe('AdminLessonEditorPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    window.sessionStorage.clear()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('loads the editor shell, preview panel, and module sections from the admin lesson route', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    expect(screen.getByTestId('admin-editor-loading-shell')).toBeVisible()
    expect(await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })).toBeVisible()
    expect(screen.getByTestId('admin-editor-layout')).toBeVisible()
    expect(screen.getByTestId('admin-editor-main-column')).toBeVisible()
    expect(screen.getByTestId('admin-editor-side-column')).toBeVisible()
    expect(screen.getByTestId('admin-module-directory')).toBeVisible()
    expect(screen.getByRole('button', { name: /edit lesson meta/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /edit dialogue/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: /draft preview/i })).toBeVisible()
    expect(screen.queryByLabelText(/lesson title \(en\)/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/dialogue title \(en\)/i)).not.toBeInTheDocument()
    expect(screen.getByText(/1 module pending publish/i)).toBeVisible()
    expect(fetch).toHaveBeenCalledWith(`/api/admin/content/lessons?lessonId=${lesson.id}`, expect.anything())
  })



  it('keeps the misleading single-item voice replacement panel out of the lesson editor', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    expect(await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })).toBeVisible()
    expect(screen.queryByRole('heading', { level: 2, name: /voice replacement/i })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/i confirm this voice sample is mine or explicitly authorized/i)).not.toBeInTheDocument()
  })


  it('opens one module editor at a time from the module directory', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit lesson meta/i }))

    const lessonMetaCard = screen.getByTestId('admin-module-card-lessonMeta')
    expect(await within(lessonMetaCard).findByLabelText(/lesson title \(en\)/i)).toBeVisible()
    expect(screen.queryByLabelText(/dialogue title \(en\)/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /edit dialogue/i }))

    const dialogueCard = screen.getByTestId('admin-module-card-dialogue')
    expect(await within(dialogueCard).findByLabelText(/dialogue title \(en\)/i)).toBeVisible()
    expect(within(lessonMetaCard).queryByLabelText(/lesson title \(en\)/i)).not.toBeInTheDocument()
  })

  it('renders an unavailable state when the lesson snapshot request fails', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ error: 'Editable lesson not found: missing' }, { status: 404 }))

    renderRoute('/admin/lesson/missing')

    expect(await screen.findByText(/editable lesson not found/i)).toBeVisible()
    expect(screen.queryByRole('heading', { level: 2, name: /draft preview/i })).not.toBeInTheDocument()
  })

  it('prompts for admin credentials after a 401 on the lesson editor route and retries with auth', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ error: 'Admin authentication required' }, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    expect(await screen.findByRole('heading', { level: 2, name: /admin sign in required/i })).toBeVisible()
    expect(screen.getByTestId('admin-auth-layout')).toBeVisible()
    expect(screen.getByTestId('admin-access-card')).toBeVisible()
    await user.type(screen.getByLabelText(/admin username/i), 'editor')
    await user.type(screen.getByLabelText(/admin password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /unlock content admin/i }))

    expect(await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })).toBeVisible()
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      `/api/admin/content/lessons?lessonId=${lesson.id}`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Basic ZWRpdG9yOnNlY3JldA==',
        }),
      }),
    )
  })

  it('clears stored credentials and returns to the sign-in screen when signing out from the editor', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('content-admin-basic-auth', 'Basic ZWRpdG9yOnNlY3JldA==')
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    expect(await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: /sign out/i }))

    expect(await screen.findByRole('heading', { level: 2, name: /admin sign in required/i })).toBeVisible()
    expect(window.sessionStorage.getItem('content-admin-basic-auth')).toBeNull()
  })

  it('warns before leaving the editor when there are unsaved changes', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit lesson meta/i }))
    const englishTitleInput = await screen.findByLabelText(/lesson title \(en\)/i)
    await user.type(englishTitleInput, ' updated')

    await user.click(screen.getByRole('link', { name: /back to admin lesson list/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/unsaved changes/i))
    expect(screen.getByRole('heading', { level: 1, name: /edit self-intro/i })).toBeVisible()
    expect(screen.getByDisplayValue(/updated/i)).toBeVisible()
  })

  it('warns before browser unload when there are unsaved changes', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit lesson meta/i }))
    const englishTitleInput = await screen.findByLabelText(/lesson title \(en\)/i)
    await user.type(englishTitleInput, ' updated')

    const event = new Event('beforeunload', { cancelable: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })

  it('saves structured lesson meta edits and refreshes the draft preview from the returned snapshot', async () => {
    const user = userEvent.setup()
    const updatedSnapshot = lessonSnapshot()
    updatedSnapshot.draftLesson = {
      ...lesson,
      title: {
        ...lesson.title,
        en: 'Edited admin title',
      },
    }
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(lessonSnapshot()))
      .mockResolvedValueOnce(jsonResponse(updatedSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit lesson meta/i }))

    const englishTitleInput = await screen.findByLabelText(/lesson title \(en\)/i)
    await user.clear(englishTitleInput)
    await user.type(englishTitleInput, 'Edited admin title')
    await user.click(screen.getByRole('button', { name: /save lesson meta draft/i }))

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/draft',
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"moduleType":"lessonMeta"'),
      }),
    )
    expect(await screen.findByText('Edited admin title')).toBeVisible()
  })

  it('renders vocabulary as structured content cards instead of a raw JSON textarea and saves edits', async () => {
    const user = userEvent.setup()
    const updatedSnapshot = lessonSnapshot()
    updatedSnapshot.draftLesson = {
      ...lesson,
      vocabulary: lesson.vocabulary.map((item, index) =>
        index === 0
          ? {
              ...item,
              hanzi: '新护照',
            }
          : item,
      ),
    }
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(lessonSnapshot()))
      .mockResolvedValueOnce(jsonResponse(updatedSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit vocabulary/i }))

    expect(screen.queryByLabelText(/vocabulary json/i)).not.toBeInTheDocument()
    const vocabularyCard = screen.getByTestId('admin-module-item-vocabulary-0')
    const hanziInput = within(vocabularyCard).getByLabelText(/hanzi/i)
    await user.clear(hanziInput)
    await user.type(hanziInput, '新护照')
    await user.click(screen.getByRole('button', { name: /save vocabulary draft/i }))

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/draft',
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('新护照'),
      }),
    )
    expect(await screen.findByDisplayValue('新护照')).toBeVisible()
  })

  it('renders practice as grouped content sections instead of a raw JSON textarea', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(jsonResponse(lessonSnapshot()))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /edit practice/i }))

    expect(screen.queryByLabelText(/practice json/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /listening/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: /speaking/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: /reading/i })).toBeVisible()
    expect(screen.getByLabelText(/listening prompt \(en\)/i)).toBeVisible()
  })

  it('publishes a changed module from the editor and refreshes module status/history', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const changedSnapshot = lessonSnapshot()
    changedSnapshot.draftLesson = {
      ...lesson,
      title: {
        ...lesson.title,
        en: 'Draft title ready to publish',
      },
    }
    changedSnapshot.modules[0] = {
      ...changedSnapshot.modules[0]!,
      hasUnpublishedChanges: true,
    }
    const publishedSnapshot = lessonSnapshot()
    publishedSnapshot.draftLesson = changedSnapshot.draftLesson
    publishedSnapshot.publishedLesson = changedSnapshot.draftLesson
    publishedSnapshot.modules[0] = {
      ...publishedSnapshot.modules[0]!,
      hasUnpublishedChanges: false,
      draftRevisionId: 202,
      publishedRevisionId: 201,
    }
    publishedSnapshot.publishedHistory.lessonMeta = [
      {
        revisionId: 201,
        createdAt: '2026-07-28T01:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Publish lesson meta draft',
        sourceRevisionId: 102,
        payload: {
          id: lesson.id,
          title: changedSnapshot.draftLesson.title,
          scenario: changedSnapshot.draftLesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
      ...publishedSnapshot.publishedHistory.lessonMeta,
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(changedSnapshot))
      .mockResolvedValueOnce(jsonResponse(publishedSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /publish lesson meta/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/publish lesson meta/i))
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/publish',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"moduleType":"lessonMeta"'),
      }),
    )
    expect(await screen.findByText(/all modules published/i)).toBeVisible()
    expect(screen.getByText(/lesson meta published successfully/i)).toBeVisible()
    expect(screen.getByText(/publish lesson meta draft/i)).toBeVisible()
  })

  it('does not publish when the confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const changedSnapshot = lessonSnapshot()
    changedSnapshot.modules[0] = {
      ...changedSnapshot.modules[0]!,
      hasUnpublishedChanges: true,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(changedSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /publish lesson meta/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/publish lesson meta/i))
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('disables publish controls while a module publish request is in flight', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const changedSnapshot = lessonSnapshot()
    changedSnapshot.modules[0] = {
      ...changedSnapshot.modules[0]!,
      hasUnpublishedChanges: true,
    }

    let resolvePublishRequest: ((value: Response) => void) | undefined
    const publishRequest = new Promise<Response>((resolve) => {
      resolvePublishRequest = resolve
    })

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(changedSnapshot))
      .mockReturnValueOnce(publishRequest)

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /publish lesson meta/i }))

    expect(screen.getByRole('button', { name: /publishing lesson meta/i })).toBeDisabled()
    expect(screen.getAllByText(/publishing lesson meta/i)).toHaveLength(2)

    resolvePublishRequest?.(jsonResponse(lessonSnapshot()))
    expect(await screen.findByRole('button', { name: /publish lesson meta/i })).toBeEnabled()
  })

  it('shows an action-specific publish failure message', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const changedSnapshot = lessonSnapshot()
    changedSnapshot.modules[0] = {
      ...changedSnapshot.modules[0]!,
      hasUnpublishedChanges: true,
    }

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(changedSnapshot))
      .mockResolvedValueOnce(jsonResponse({ error: 'Publish service unavailable' }, { status: 503 }))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /publish lesson meta/i }))

    expect(await screen.findByText(/failed to publish lesson meta/i)).toBeVisible()
    expect(screen.getByText(/publish service unavailable/i)).toBeVisible()
  })

  it('rolls back to a historical published revision from the editor history list', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const currentSnapshot = lessonSnapshot()
    currentSnapshot.publishedLesson = {
      ...lesson,
      title: { ...lesson.title, en: 'Current published title' },
    }
    currentSnapshot.draftLesson = currentSnapshot.publishedLesson
    currentSnapshot.modules[0] = {
      ...currentSnapshot.modules[0]!,
      hasUnpublishedChanges: false,
      draftRevisionId: 302,
      publishedRevisionId: 301,
    }
    currentSnapshot.publishedHistory.lessonMeta = [
      {
        revisionId: 301,
        createdAt: '2026-07-28T01:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Current published title',
        sourceRevisionId: 201,
        payload: {
          id: lesson.id,
          title: currentSnapshot.publishedLesson.title,
          scenario: currentSnapshot.publishedLesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
      {
        revisionId: 88,
        createdAt: '2026-07-27T23:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Older published title',
        sourceRevisionId: 77,
        payload: {
          id: lesson.id,
          title: { ...lesson.title, en: 'Older published title' },
          scenario: lesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
    ]
    const rolledBackSnapshot = lessonSnapshot()
    rolledBackSnapshot.publishedLesson = {
      ...lesson,
      title: { ...lesson.title, en: 'Older published title' },
    }
    rolledBackSnapshot.draftLesson = rolledBackSnapshot.publishedLesson
    rolledBackSnapshot.modules[0] = {
      ...rolledBackSnapshot.modules[0]!,
      hasUnpublishedChanges: false,
      draftRevisionId: 402,
      publishedRevisionId: 401,
    }
    rolledBackSnapshot.publishedHistory.lessonMeta = [
      {
        revisionId: 401,
        createdAt: '2026-07-28T02:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Rollback to revision 88',
        sourceRevisionId: 88,
        payload: {
          id: lesson.id,
          title: rolledBackSnapshot.publishedLesson.title,
          scenario: rolledBackSnapshot.publishedLesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
      ...currentSnapshot.publishedHistory.lessonMeta,
    ]

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(currentSnapshot))
      .mockResolvedValueOnce(jsonResponse(rolledBackSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /rollback lesson meta to revision 88/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/revision 88/i))
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/admin/content/rollback',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"publishedRevisionId":88'),
      }),
    )
    await user.click(screen.getByRole('button', { name: /edit lesson meta/i }))
    expect(await screen.findByDisplayValue('Older published title')).toBeVisible()
    expect(screen.getByText(/lesson meta rolled back to revision 88/i)).toBeVisible()
    expect(screen.getByText(/rollback to revision 88/i)).toBeVisible()
  })

  it('does not roll back when the confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const currentSnapshot = lessonSnapshot()
    currentSnapshot.modules[0] = {
      ...currentSnapshot.modules[0]!,
      hasUnpublishedChanges: false,
      draftRevisionId: 302,
      publishedRevisionId: 301,
    }
    currentSnapshot.publishedHistory.lessonMeta = [
      {
        revisionId: 301,
        createdAt: '2026-07-28T01:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Current published title',
        sourceRevisionId: 201,
        payload: {
          id: lesson.id,
          title: lesson.title,
          scenario: lesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
      {
        revisionId: 88,
        createdAt: '2026-07-27T23:00:00.000Z',
        createdBy: 'admin-ui',
        note: 'Older published title',
        sourceRevisionId: 77,
        payload: {
          id: lesson.id,
          title: { ...lesson.title, en: 'Older published title' },
          scenario: lesson.scenario,
        },
        lessonId: lesson.id,
        moduleType: 'lessonMeta',
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(currentSnapshot))

    renderRoute(`/admin/lesson/${lesson.id}`)

    await screen.findByRole('heading', { level: 1, name: /edit self-intro/i })
    await user.click(screen.getByRole('button', { name: /rollback lesson meta to revision 88/i }))

    expect(confirmSpy).toHaveBeenCalledWith(expect.stringMatching(/revision 88/i))
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
