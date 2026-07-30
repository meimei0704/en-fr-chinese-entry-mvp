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

function buildLessonSnapshot(
  titleEn: string,
  dialogueAudio = lesson.dialogue.lines[0]!.audio,
): AdminLessonSnapshot {
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
      dialogue: {
        ...lesson.dialogue,
        lines: lesson.dialogue.lines.map((line, index) =>
          index === 0 ? { ...line, audio: dialogueAudio } : line,
        ),
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
  let dialogueAudio = lesson.dialogue.lines[0]!.audio
  const generatedVoiceAudio = '/voice/generated/self-intro-line-01.mp3'

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
        body: JSON.stringify(buildLessonSnapshot(draftTitleEn, dialogueAudio)),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSummary()),
    })
  })


  await page.route('**/api/admin/voice/samples', async (route) => {
    const request = route.request()
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
    const body = JSON.parse(request.postData() ?? '{}') as { consentConfirmed?: boolean; sampleAudioUrl?: string }
    expect(body.consentConfirmed).toBe(true)
    expect(body.sampleAudioUrl).toBe('https://storage.example/authorized-sample.wav')

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ profileId: 'profile_self_intro' }),
    })
  })

  await page.route('**/api/admin/voice/generate', async (route) => {
    const request = route.request()
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
    const body = JSON.parse(request.postData() ?? '{}') as {
      consentConfirmed?: boolean
      profileId?: string
      text?: string
      target?: { lessonId?: string; moduleType?: string; targetId?: string }
    }
    expect(body.consentConfirmed).toBe(true)
    expect(body.profileId).toBe('profile_self_intro')
    expect(body.text).toBe(lesson.dialogue.lines[0]!.hanzi)
    expect(body.target).toMatchObject({ lessonId: lesson.id, moduleType: 'dialogue' })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ audioUrl: generatedVoiceAudio }),
    })
  })

  await page.route('**/api/admin/content/draft', async (route) => {
    const request = route.request()
    const auth = await request.headerValue('authorization')
    const client = await request.headerValue('x-content-admin-client')

    expect(auth).toBe(encodedAdminAuth)
    expect(client).toBe('spa')

    const body = JSON.parse(request.postData() ?? '{}') as {
      moduleType?: string
      payload?: { title?: { en?: string }; lines?: Array<{ audio?: string }> }
    }
    draftTitleEn = body.payload?.title?.en ?? draftTitleEn
    if (body.moduleType === 'dialogue') {
      dialogueAudio = body.payload?.lines?.[0]?.audio ?? dialogueAudio
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSnapshot(draftTitleEn, dialogueAudio)),
    })
  })

  await page.goto('/admin')

  const unauthVoiceStatus = await page.evaluate(async () => {
    const response = await fetch('/api/admin/voice/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Admin-Client': 'spa',
      },
      body: JSON.stringify({ profileId: 'missing', text: '你好', target: { lessonId: 'self-intro', targetId: 'dialogue:line-1', moduleType: 'dialogue' } }),
    })
    return response.status
  })
  expect(unauthVoiceStatus).toBe(401)

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

  await page.getByLabel(/i confirm this voice sample is mine or explicitly authorized/i).check()
  await page.getByLabel(/voice sample url/i).fill('https://storage.example/authorized-sample.wav')
  await page.getByRole('button', { name: /create voice profile/i }).click()
  await expect(page.getByText(/voice profile ready/i)).toBeVisible()
  await page.getByRole('button', { name: /generate replacement audio/i }).click()
  await expect(page.getByLabel(/replacement audio url/i)).toHaveValue(generatedVoiceAudio)
  await expect(page.getByLabel(/preview replacement audio/i)).toHaveAttribute('src', generatedVoiceAudio)
  const applyVoiceDraftButton = page.getByRole('button', { name: /apply to draft/i })
  await expect(applyVoiceDraftButton).toBeDisabled()
  await page.getByLabel(/i have previewed and approve this replacement audio/i).check()
  await expect(applyVoiceDraftButton).toBeEnabled()
  await applyVoiceDraftButton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText(/voice replacement saved to dialogue draft/i)).toBeVisible()
  await expect(page.getByTestId('admin-editor-side-column').getByText(generatedVoiceAudio)).toBeVisible()

  expect(dialogCount).toBe(0)
})
