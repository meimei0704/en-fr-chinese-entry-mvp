import { expect, test, type Page } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

async function seedProgress(page: Page) {
  await page.addInitScript(
    (courseKey) => {
      localStorage.setItem(
        courseKey,
        JSON.stringify({
          selectedExplanationLanguage: 'en',
          completedLessons: [],
          reviewQueue: ['daily-greetings-review-1'],
          lastVisitedLesson: 'daily-greetings',
          lessonStepProgress: {},
        }),
      )
    },
    courseProgressStorageKey,
  )
}

async function fontSize(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
}

test('lesson page applies a unified semantic font scale across card contexts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/daily-greetings')
  await expect(page.locator('h1')).toBeVisible()

  const dialogueHanzi = await fontSize(page, '.hanzi-display--dialogue')
  const patternTitle = await fontSize(page, '.study-item--pattern .study-item__title')
  const vocabHanzi = await fontSize(page, '.vocabulary-list__hanzi')

  expect(dialogueHanzi).toBeGreaterThan(0)
  expect(patternTitle).toBeGreaterThan(0)
  expect(vocabHanzi).toBeGreaterThan(0)

  expect(patternTitle).toBeGreaterThanOrEqual(vocabHanzi)
  expect(dialogueHanzi).toBeGreaterThan(patternTitle)
})

test('review flashcard hanzi is the largest step of the same scale', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/review')
  await expect(page.locator('.hanzi-display--review').first()).toBeVisible()

  const reviewHanzi = await fontSize(page, '.hanzi-display--review')

  expect(reviewHanzi).toBeGreaterThanOrEqual(32)
})
