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
          lastVisitedLesson: 'daily-greetings',
          lessonStepProgress: {},
        }),
      )
    },
    courseProgressStorageKey,
  )
}

test('study layer tab bar stays stuck near the top of the viewport while scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/daily-greetings')
  const preview = page.locator('.lesson-page .lesson-progress-preview')
  await expect(preview).toBeVisible()

  await page.evaluate(() => {
    const section = document.getElementById('lesson-patterns')!
    window.scrollTo(0, section.offsetTop - window.innerHeight * 0.3)
  })
  await page.waitForTimeout(150)

  const stuckTop = await preview.evaluate((element) => element.getBoundingClientRect().top)
  expect(stuckTop).toBeGreaterThanOrEqual(0)
  expect(stuckTop).toBeLessThan(60)
  await expect(preview).toBeInViewport()
})

test('scrollspy highlights the study layer whose section is in view while scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/daily-greetings')

  const rail = page.locator('.lesson-page .lesson-progress-preview__rail')
  const steps = rail.getByRole('listitem')
  await expect(steps.nth(0)).toHaveClass(/is-current/)

  const scrollSectionToUpperViewport = async (sectionId: string) => {
    await page.evaluate((id) => {
      const section = document.getElementById(id)!
      window.scrollTo(0, section.offsetTop - window.innerHeight * 0.3)
    }, sectionId)
    await page.waitForTimeout(150)
  }

  await scrollSectionToUpperViewport('lesson-patterns')
  await expect(steps.nth(1)).toHaveClass(/is-current/)

  await scrollSectionToUpperViewport('lesson-vocabulary')
  await expect(steps.nth(2)).toHaveClass(/is-current/)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(150)
  await expect(steps.nth(0)).toHaveClass(/is-current/)
})

test('clicking a study layer tab still highlights that tab after scroll settles', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/daily-greetings')

  const rail = page.locator('.lesson-page .lesson-progress-preview__rail')
  const steps = rail.getByRole('listitem')
  const links = rail.getByRole('link')

  await links.nth(1).click()
  await expect(steps.nth(1)).toHaveClass(/is-current/)
})
