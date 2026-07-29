import { expect, test } from 'playwright/test'

import { course } from '../../src/content/course'
import type { AdminLessonSnapshot, AdminLessonSummary } from '../../src/admin/types'

const lesson = course.lessons[0]
const encodedAdminAuth = 'Basic ZWRpdG9yOnNlY3JldA=='

function buildLessonSummary(): AdminLessonSummary[] {
  return [
    {
      lessonId: lesson.id,
      slug: lesson.id,
      displayOrder: 1,
      enabled: true,
      draftChangedModuleCount: 1,
    },
  ]
}

function buildLessonSnapshot(titleEn: string): AdminLessonSnapshot {
  return {
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: 1,
    enabled: true,
    draftLesson: {
      ...lesson,
      title: {
        ...lesson.title,
        en: titleEn,
      },
    },
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
      lessonMeta: [
        {
          revisionId: 101,
          createdAt: '2026-07-29T00:00:00.000Z',
          createdBy: 'seed',
          note: 'Initial published baseline',
          sourceRevisionId: null,
          payload: {
            id: lesson.id,
            title: lesson.title,
            scenario: lesson.scenario,
          },
          lessonId: lesson.id,
          moduleType: 'lessonMeta',
        },
      ],
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

test('admin uses the in-page sign-in flow without a browser auth dialog and can save a draft', async ({
  page,
}) => {
  let dialogCount = 0
  let draftTitleEn = typeof lesson.title === 'string' ? lesson.title : lesson.title.en

  page.on('dialog', async (dialog) => {
    dialogCount += 1
    await dialog.dismiss()
  })

  await page.route('**/api/admin/content/lessons*', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const auth = await request.headerValue('authorization')
    const client = await request.headerValue('x-content-admin-client')

    expect(client).toBe('spa')

    if (!auth) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Admin authentication required' }),
      })
      return
    }

    expect(auth).toBe(encodedAdminAuth)

    if (url.searchParams.get('lessonId') === lesson.id) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildLessonSnapshot(draftTitleEn)),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSummary()),
    })
  })

  await page.route('**/api/admin/content/draft', async (route) => {
    const request = route.request()
    const auth = await request.headerValue('authorization')
    const client = await request.headerValue('x-content-admin-client')

    expect(auth).toBe(encodedAdminAuth)
    expect(client).toBe('spa')

    const body = JSON.parse(request.postData() ?? '{}') as {
      payload?: { title?: { en?: string } }
    }
    draftTitleEn = body.payload?.title?.en ?? draftTitleEn

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSnapshot(draftTitleEn)),
    })
  })

  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: /admin sign in required/i })).toBeVisible()
  expect(dialogCount).toBe(0)

  await page.getByLabel(/admin username/i).fill('editor')
  await page.getByLabel(/admin password/i).fill('secret')
  await page.getByRole('button', { name: /unlock content admin/i }).click()

  await expect(page.getByRole('link', { name: /open self-intro editor/i })).toBeVisible()
  expect(dialogCount).toBe(0)

  await page.getByRole('link', { name: /open self-intro editor/i }).click()
  await expect(page).toHaveURL(/\/admin\/lesson\/self-intro$/)
  await expect(page.getByRole('heading', { name: /edit self-intro/i })).toBeVisible()

  await page.getByRole('button', { name: /edit lesson meta/i }).click()

  const titleInput = page.getByLabel(/lesson title \(en\)/i)
  await titleInput.fill('Edited in browser smoke')
  await page.getByRole('button', { name: /save lesson meta draft/i }).click()

  await expect(titleInput).toHaveValue('Edited in browser smoke')
  await expect(page.getByTestId('admin-editor-side-column').getByText('Edited in browser smoke')).toBeVisible()
  expect(dialogCount).toBe(0)
})
