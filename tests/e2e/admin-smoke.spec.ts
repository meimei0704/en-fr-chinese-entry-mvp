import { expect, test } from 'playwright/test'

import { course } from '../../src/content/course'
import type { AdminLessonSnapshot, AdminLessonSummary } from '../../src/admin/types'
import { collectCourseVoiceAudioTargets } from '../../src/admin/voiceTargets'
import type { LessonContent } from '../../src/content/types'

const lesson = course.lessons[0]!
const firstDialogueLine = lesson.dialogue.lines[0]!
const encodedAdminAuth = 'Basic ZWRpdG9yOnNlY3JldA=='
const voiceTargets = collectCourseVoiceAudioTargets(course.lessons)
const voiceTargetById = new Map(voiceTargets.map((target) => [target.targetId, target]))

function buildLessonSummary(lessons: readonly LessonContent[]): AdminLessonSummary[] {
  return lessons.map((item, index) => ({
    lessonId: item.id,
    slug: item.id,
    displayOrder: index + 1,
    enabled: true,
    draftChangedModuleCount: item.id === lesson.id ? 1 : 0,
  }))
}

function buildLessonSnapshot(draftLesson: LessonContent): AdminLessonSnapshot {
  return {
    lessonId: draftLesson.id,
    slug: draftLesson.id,
    displayOrder: course.lessons.findIndex((item) => item.id === draftLesson.id) + 1,
    enabled: true,
    draftLesson,
    publishedLesson: course.lessons.find((item) => item.id === draftLesson.id) ?? draftLesson,
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

test('admin uses the SPA sign-in flow, saves a draft, and runs batch voice generation', async ({
  page,
}) => {
  let dialogCount = 0
  const draftLessonsById = new Map(course.lessons.map((item) => [item.id, item]))
  const draftRequests: Array<{ lessonId: string; moduleType: string; payload: unknown }> = []

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

    const lessonId = url.searchParams.get('lessonId')
    if (lessonId) {
      const draftLesson = draftLessonsById.get(lessonId) ?? lesson
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildLessonSnapshot(draftLesson)),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSummary([...draftLessonsById.values()])),
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
      body: JSON.stringify({ profileId: 'profile_batch_authorized' }),
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
      target?: {
        lessonId?: string
        moduleType?: string
        targetId?: string
        originalAudio?: string
        storageKey?: string
        language?: string
      }
    }
    const target = body.target?.targetId ? voiceTargetById.get(body.target.targetId) : undefined

    expect(body.consentConfirmed).toBe(true)
    expect(body.profileId).toBe('profile_batch_authorized')
    expect(target).toBeDefined()
    expect(body.text).toBe(target!.text)
    expect(body.target).toMatchObject({
      lessonId: target!.lessonId,
      moduleType: target!.moduleType,
      targetId: target!.targetId,
      originalAudio: target!.originalAudio,
      storageKey: target!.storageKey,
      language: 'zh-CN',
    })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ audioUrl: `/voice/generated/${target!.storageKey}` }),
    })
  })

  await page.route('**/api/admin/content/draft', async (route) => {
    const request = route.request()
    const auth = await request.headerValue('authorization')
    const client = await request.headerValue('x-content-admin-client')

    expect(auth).toBe(encodedAdminAuth)
    expect(client).toBe('spa')

    const body = JSON.parse(request.postData() ?? '{}') as {
      lessonId: LessonContent['id']
      moduleType: string
      payload: Partial<LessonContent> | LessonContent[keyof LessonContent]
    }
    const currentLesson = draftLessonsById.get(body.lessonId) ?? lesson

    if (body.moduleType === 'lessonMeta') {
      draftLessonsById.set(body.lessonId, {
        ...currentLesson,
        ...(body.payload as Pick<LessonContent, 'id' | 'title' | 'scenario'>),
      })
    }

    if (body.moduleType === 'dialogue') {
      draftLessonsById.set(body.lessonId, {
        ...currentLesson,
        dialogue: body.payload as LessonContent['dialogue'],
      })
    }

    draftRequests.push({ lessonId: body.lessonId, moduleType: body.moduleType, payload: body.payload })

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildLessonSnapshot(draftLessonsById.get(body.lessonId) ?? currentLesson)),
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
      body: JSON.stringify({
        consentConfirmed: true,
        profileId: 'missing',
        text: '你好',
        target: {
          lessonId: 'self-intro',
          targetId: 'dialogue:self-intro-line-01',
          moduleType: 'dialogue',
          originalAudio: '/audio/self-intro/line-01.mp3',
          storageKey: 'audio/self-intro/line-01.mp3',
          language: 'zh-CN',
        },
      }),
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
  await expect(page.getByRole('link', { name: /batch voice generation/i })).toBeVisible()
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

  await page.getByRole('link', { name: /back to admin lesson list/i }).click()
  await page.getByRole('link', { name: /batch voice generation/i }).click()

  await expect(page).toHaveURL(/\/admin\/voice$/)
  await expect(page.getByRole('heading', { name: /batch voice generation/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /179 audio targets/i })).toBeVisible()
  await expect(page.getByText(/zh-cn only/i)).toBeVisible()
  await expect(page.getByText(/voice replacement/i)).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /record voice sample/i })).toBeVisible()
  await expect(page.getByText(/recommended mandarin prompt/i)).toBeVisible()
  await expect(page.getByText(/you may read your own mandarin content/i)).toBeVisible()

  const generateAllButton = page.getByRole('button', { name: /generate all pending/i })
  const startRecordingButton = page.getByRole('button', { name: /start recording/i })
  await expect(generateAllButton).toBeDisabled()
  await expect(startRecordingButton).toBeDisabled()
  await page.getByLabel(/voice sample url/i).fill('https://storage.example/authorized-sample.wav')
  await expect(page.getByRole('button', { name: /create voice profile/i })).toBeDisabled()
  await page.getByLabel(/i confirm this voice sample is mine or explicitly authorized/i).check()
  await expect(startRecordingButton).toBeEnabled()
  await page.getByRole('button', { name: /create voice profile/i }).click()
  await expect(page.getByText(/profile id: profile_batch_authorized/i).first()).toBeVisible()

  await expect(generateAllButton).toBeEnabled()
  await generateAllButton.click()
  await expect(page.getByText(/179 generated/i).first()).toBeVisible({ timeout: 15_000 })

  const applyApprovedButton = page.getByRole('button', { name: /apply approved to drafts/i })
  await expect(applyApprovedButton).toBeDisabled()

  const firstRow = page.getByTestId(`voice-target-row-dialogue:${firstDialogueLine.id}`)
  const generatedFirstAudio = `/voice/generated/audio/self-intro/line-01.mp3`
  await expect(firstRow.getByLabel(/preview generated audio/i)).toHaveAttribute('src', generatedFirstAudio)
  await firstRow.getByLabel(/previewed and approve/i).check()
  await expect(applyApprovedButton).toBeEnabled()

  await applyApprovedButton.click()
  await expect(page.getByText(/applied 1 approved target/i)).toBeVisible()

  const dialogueDraftRequest = draftRequests.find((request) => request.moduleType === 'dialogue')
  expect(dialogueDraftRequest).toBeDefined()
  const dialoguePayload = dialogueDraftRequest!.payload as LessonContent['dialogue']
  expect(dialogueDraftRequest!.lessonId).toBe('self-intro')
  expect(dialoguePayload.lines[0]!.audio).toBe(generatedFirstAudio)
  expect(dialoguePayload.lines[0]!.audioFallback).toBe('/audio/self-intro/line-01.mp3')
  expect(dialoguePayload.lines[1]!.audio).toBe('/audio/self-intro/line-02.mp3')

  expect(dialogCount).toBe(0)
})
