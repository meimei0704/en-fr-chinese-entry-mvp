import { expect, test } from 'playwright/test'

test('a first-time learner can start from Home, finish lesson one, and reach review and progress', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.getByRole('link', { name: /continue learning/i })).toHaveCount(0)
  await page.getByRole('link', { name: /到达机场\s+Arrival at the airport/i }).click()
  await expect(page.getByText(/到达机场 \/ Arrival at the airport/i)).toHaveCount(0)
  await expect(page.locator('.lesson-header-card .lesson-topic-title__primary')).toHaveText('到达机场')
  await expect(page.locator('.lesson-header-card .lesson-topic-title__secondary')).toHaveText(
    'Arrival at the airport',
  )
  await page.getByRole('link', { name: /go to practice/i }).click()
  await page.getByRole('link', { name: /continue to short input/i }).click()
  await page.getByRole('button', { name: /i finished the short input/i }).click()

  await expect(page.getByText(/lesson complete/i)).toBeVisible()

  await page.getByRole('link', { name: /go to review/i }).click()
  await expect(page.getByText(/cards due today/i)).toBeVisible()
  await expect(page.getByRole('region', { name: /flashcard front/i })).toContainText('护照')

  await page.getByRole('button', { name: /mark complete/i }).click()
  await expect(page.getByText(/1 card finished/i)).toBeVisible()

  await page.getByRole('link', { name: /view progress/i }).click()
  const learningIndicators = page.getByRole('region', { name: /learning indicators/i })
  await expect(learningIndicators).toContainText('1 of 10 lessons completed')
  await expect(learningIndicators).toContainText('2 review items waiting')

  await page.getByRole('link', { name: /back to home/i }).click()
  await expect(page.getByRole('link', { name: /continue learning/i })).toHaveCount(0)
  await page.getByRole('link', { name: /taxi to your stay/i }).click()
  await expect(page).toHaveURL(/\/lesson\/ask-directions$/)
  await expect(page.getByRole('heading', { name: /taxi to your hotel/i })).toBeVisible()
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
