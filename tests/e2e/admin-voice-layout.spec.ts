import { expect, test, type Page } from 'playwright/test'

import { course } from '../../src/content/course'
import type { LessonContent } from '../../src/content/types'

function lessonSummaries() {
  return course.lessons.map((lesson, index) => ({
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: index + 1,
    enabled: true,
    draftChangedModuleCount: 0,
  }))
}

function lessonSnapshot(lesson: LessonContent) {
  return {
    lessonId: lesson.id,
    slug: lesson.id,
    displayOrder: course.lessons.findIndex((item) => item.id === lesson.id) + 1,
    enabled: true,
    draftLesson: lesson,
    publishedLesson: lesson,
    modules: [
      'lessonMeta',
      'dialogue',
      'sentencePatterns',
      'vocabulary',
      'practice',
      'reviewCards',
    ].map((moduleType, index) => ({
      moduleType,
      draftRevisionId: 200 + index * 2,
      publishedRevisionId: 199 + index * 2,
      hasUnpublishedChanges: false,
    })),
    publishedHistory: {
      lessonMeta: [],
      dialogue: [],
      sentencePatterns: [],
      vocabulary: [],
      practice: [],
      reviewCards: [],
    },
  }
}

async function installVoiceAdminRoutes(page: Page) {
  await page.route('**/api/admin/content/lessons*', async (route) => {
    const url = new URL(route.request().url())
    const lessonId = url.searchParams.get('lessonId')

    if (lessonId) {
      const lesson = course.lessons.find((item) => item.id === lessonId)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(lessonSnapshot(lesson ?? course.lessons[0]!)),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(lessonSummaries()),
    })
  })
}

async function expectVoiceLayoutPolish(page: Page) {
  await expect(page.getByRole('heading', { name: /359 audio targets/i })).toBeVisible()

  const consentField = page.locator('.admin-voice-consent-field').first()
  const consentCheckbox = page.getByLabel(/i confirm this voice sample is mine or explicitly authorized/i)
  const consentFieldBox = await consentField.boundingBox()
  const consentCheckboxBox = await consentCheckbox.boundingBox()
  expect(consentFieldBox).not.toBeNull()
  expect(consentCheckboxBox).not.toBeNull()
  expect(consentCheckboxBox!.width).toBeLessThan(28)
  expect(consentCheckboxBox!.x - consentFieldBox!.x).toBeLessThan(36)

  const clonedVoiceTools = page.getByLabel('Optional cloned voice tools')
  const batchControls = page.getByLabel('Batch generation controls')
  const clonedVoiceToolsBox = await clonedVoiceTools.boundingBox()
  const batchControlsBox = await batchControls.boundingBox()
  expect(clonedVoiceToolsBox).not.toBeNull()
  expect(batchControlsBox).not.toBeNull()
  expect(Math.abs(batchControlsBox!.x - clonedVoiceToolsBox!.x)).toBeLessThanOrEqual(2)
  expect(Math.abs(batchControlsBox!.width - clonedVoiceToolsBox!.width)).toBeLessThanOrEqual(2)

  const firstTarget = page.getByTestId(`voice-target-row-dialogue:${course.lessons[0]!.dialogue.lines[0]!.id}`)
  const targetTextFontSize = await firstTarget.locator('.hanzi-display').evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  )
  expect(targetTextFontSize).toBeLessThanOrEqual(40)

  const generateButton = firstTarget.getByRole('button', { name: /generate this target/i })
  const unavailableReason = firstTarget.getByText(/confirm authorization and enter a Profile id before generating this target/i)
  const generateButtonBox = await generateButton.boundingBox()
  const unavailableReasonBox = await unavailableReason.boundingBox()
  expect(generateButtonBox).not.toBeNull()
  expect(unavailableReasonBox).not.toBeNull()
  expect(generateButtonBox!.y + generateButtonBox!.height + 4).toBeLessThanOrEqual(unavailableReasonBox!.y)
}

for (const viewport of [
  { name: 'desktop wide', width: 2048, height: 1152 },
  { name: 'narrow mobile', width: 390, height: 1200 },
]) {
  test(`admin voice page keeps polish layout aligned without oversized target text on ${viewport.name}`, async ({ page }) => {
    await installVoiceAdminRoutes(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    await page.goto('/admin/voice')
    await expectVoiceLayoutPolish(page)
  })
}
