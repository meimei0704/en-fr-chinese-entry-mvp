import { expect, test } from 'playwright/test'

test('a first-time learner can start from Home, finish practice, and return to the lesson', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.getByRole('link', { name: /continue learning/i })).toHaveCount(0)
  await page.getByRole('link', { name: /打招呼\s+Daily greetings/i }).click()
  await expect(page.getByText(/打招呼 \/ Daily greetings/i)).toHaveCount(0)
  await expect(page.locator('.lesson-header-card .lesson-topic-title__primary')).toHaveText('打招呼')
  await expect(page.locator('.lesson-header-card .lesson-topic-title__secondary')).toHaveText(
    'Daily greetings',
  )
  await page.getByRole('link', { name: /go to practice/i }).click()

  const resultCard = page.locator('.practice-challenge--result')
  for (let attempt = 0; attempt < 10 && !(await resultCard.isVisible()); attempt += 1) {
    const firstOption = page.locator('.practice-challenge__options .option-button').first()
    await firstOption.click()
    if (await resultCard.isVisible()) {
      break
    }
    const nextButton = page.getByRole('button', { name: /next question/i })
    await expect(nextButton).toBeVisible()
    await nextButton.click()
  }
  await expect(resultCard).toBeVisible()

  await expect(page.getByRole('button', { name: /complete lesson|lesson complete/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /go to review|view progress/i })).toHaveCount(0)
  await page.getByRole('link', { name: /back to lesson/i }).click()
  await expect(page).toHaveURL(/\/lesson\/daily-greetings$/)
})

test('keeps the French arrival lesson header within a 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Français' }).click()
  await page.getByRole('link', { name: /到达机场\s+Arrivée à l’aéroport/i }).click()

  await expect(page).toHaveURL(/\/lesson\/self-intro$/)
  await expect(page.getByText(/到达机场 \/ Arrivée à l’aéroport/i)).toHaveCount(0)
  await expect(page.locator('.lesson-header-card .lesson-topic-title__primary')).toHaveText(
    '到达机场',
  )
  await expect(page.locator('.lesson-header-card .lesson-topic-title__secondary')).toHaveText(
    'Arrivée à l’aéroport',
  )

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBe(clientWidth)
})
