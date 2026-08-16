import { expect, test, type Page } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

async function seedProgress(page: Page) {
  await page.addInitScript(
    (courseKey) => {
      if (localStorage.getItem(courseKey)) {
        return
      }
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

test('persists listened dialogue lines across reloads', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/self-intro')

  const dialogueCards = page.locator('.dialogue-card')
  await expect(dialogueCards.first()).toBeVisible()

  await dialogueCards.nth(0).getByRole('button').click()
  await expect(dialogueCards.nth(0)).toHaveClass(/is-completed/)
  await expect(
    page.locator('.lesson-dialogue-progress'),
  ).toContainText(/1 of \d+ lines listened/)

  await page.reload()

  await expect(dialogueCards.nth(0)).toHaveClass(/is-completed/)
  await expect(page.locator('.lesson-dialogue-progress')).toContainText(
    /1 of \d+ lines listened/,
  )
})

test('shows a continue action while progress is partial and hides it when complete', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await seedProgress(page)
  await page.goto('/lesson/self-intro')

  const dialogueCards = page.locator('.dialogue-card')
  const continueLink = page.locator('.lesson-dialogue-continue')
  await expect(continueLink).not.toBeVisible()

  await dialogueCards.nth(0).getByRole('button').click()
  await expect(continueLink).toBeVisible()
  await expect(continueLink).toHaveAttribute('href', '#lesson-dialogue')

  const lineCount = await dialogueCards.count()
  for (let index = 1; index < lineCount; index += 1) {
    await dialogueCards.nth(index).getByRole('button').click()
  }

  await expect(page.locator('.lesson-dialogue-progress')).toContainText(
    new RegExp(`^${lineCount} of ${lineCount} lines listened`),
  )
  await expect(continueLink).not.toBeVisible()
})
