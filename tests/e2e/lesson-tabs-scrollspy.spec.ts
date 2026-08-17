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
    document.getElementById('lesson-patterns')!.scrollIntoView({ block: 'start' })
  })

  await expect
    .poll(async () => {
      const stuckTop = await preview.evaluate((element) => element.getBoundingClientRect().top)
      return stuckTop >= 0 && stuckTop < 60
    })
    .toBe(true)
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
  const links = rail.getByRole('link')
  await expect(steps.nth(0)).toHaveClass(/is-current/)
  await expect(links.nth(0)).toHaveAttribute('aria-current', 'location')
  await expect(links.nth(1)).not.toHaveAttribute('aria-current')

  const scrollSectionToUpperViewport = async (sectionId: string, stepIndex: number) => {
    await page.evaluate((id) => {
      document.getElementById(id)!.scrollIntoView({ block: 'start' })
    }, sectionId)
    await expect
      .poll(async () => (await steps.nth(stepIndex).getAttribute('class')) ?? '')
      .toMatch(/is-current/)
  }

  await scrollSectionToUpperViewport('lesson-patterns', 1)
  await expect(links.nth(1)).toHaveAttribute('aria-current', 'location')

  await scrollSectionToUpperViewport('lesson-vocabulary', 2)
  await expect(links.nth(2)).toHaveAttribute('aria-current', 'location')

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect
    .poll(async () => (await steps.nth(0).getAttribute('class')) ?? '')
    .toMatch(/is-current/)
  await expect(links.nth(0)).toHaveAttribute('aria-current', 'location')
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
