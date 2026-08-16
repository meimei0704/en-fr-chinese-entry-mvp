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
          reviewQueue: [],
          lastVisitedLesson: 'self-intro',
          lessonStepProgress: {},
        }),
      )
    },
    courseProgressStorageKey,
  )
}

test('entering a lesson page scrolls to the very top after navigating from the home page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/')

  const lessonLink = page.locator('#home-basic-expressions-path a[href^="/lesson/"]').first()
  await expect(lessonLink).toBeVisible()
  await lessonLink.scrollIntoViewIfNeeded()

  const homeScrollY = await page.evaluate(() => window.scrollY)
  expect(homeScrollY).toBeGreaterThan(0)

  await lessonLink.click()
  await page.waitForURL(/\/lesson\/daily-greetings$/)

  await expect(page).toHaveURL(/\/lesson\/daily-greetings$/)
  await expect(page.locator('h1')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('study layer links scroll to their matching sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/self-intro')

  const dialogueSection = page.locator('#lesson-dialogue')
  const patternsSection = page.locator('#lesson-patterns')
  const vocabularySection = page.locator('#lesson-vocabulary')
  await expect(dialogueSection).toBeVisible()
  await expect(patternsSection).toBeVisible()
  await expect(vocabularySection).toBeVisible()

  const rail = page.locator('.lesson-page .lesson-progress-preview__rail')
  const links = rail.getByRole('link')
  await expect(links).toHaveCount(3)
  await expect(links.nth(0)).toHaveAttribute('href', '#lesson-dialogue')
  await expect(links.nth(1)).toHaveAttribute('href', '#lesson-patterns')
  await expect(links.nth(2)).toHaveAttribute('href', '#lesson-vocabulary')

  for (const [index, section, sectionId] of [
    [0, dialogueSection, '#lesson-dialogue'],
    [1, patternsSection, '#lesson-patterns'],
    [2, vocabularySection, '#lesson-vocabulary'],
  ] as const) {
    await page.evaluate(() => window.scrollTo(0, 0))
    await links.nth(index).click()
    await expect.poll(() => new URL(page.url()).hash).toBe(sectionId)
    await expect
      .poll(() =>
        section.evaluate(
          (element) => element.getBoundingClientRect().top < window.innerHeight,
        ),
      )
      .toBe(true)

    await expect(rail.getByRole('listitem').nth(index)).toHaveClass(/is-current/)
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => rail.getByRole('listitem').nth(0).getAttribute('class')).toMatch(
    /is-current/,
  )
})
