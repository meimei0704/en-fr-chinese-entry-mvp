import { expect, test } from 'playwright/test'

test('a first-time learner can choose a language, finish lesson one, and reach review and progress', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()
  await page.getByRole('link', { name: /continue learning/i }).click()
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
  await expect(learningIndicators).toContainText('1 of 3 lessons completed')
  await expect(learningIndicators).toContainText('2 review items waiting')

  await page.getByRole('link', { name: /back to home/i }).click()
  await page.getByRole('link', { name: /continue learning/i }).click()
  await expect(page).toHaveURL(/\/lesson\/ask-directions$/)
  await expect(page.getByRole('heading', { name: /taxi to your hotel/i })).toBeVisible()
})
