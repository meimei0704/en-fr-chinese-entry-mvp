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

test('dialogue cards render as a multi-column grid on desktop and single column on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/daily-greetings')
  await expect(page.locator('.dialogue-card').first()).toBeVisible()

  const columnsAt = async (width: number) => {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(150)
    return page.evaluate(() => {
      const cards = [...document.querySelectorAll('.dialogue-card')]
      const y0 = cards[0].getBoundingClientRect().y
      return cards.filter((card) => Math.abs(card.getBoundingClientRect().y - y0) < 5).length
    })
  }

  const desktopCols = await columnsAt(1440)
  expect(desktopCols).toBeGreaterThan(1)

  const mobileCols = await columnsAt(390)
  expect(mobileCols).toBe(1)
})
