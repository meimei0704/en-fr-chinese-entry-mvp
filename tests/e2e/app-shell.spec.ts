import { expect, test } from 'playwright/test'

test('shows the explanation-language entry screen on first load', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'English' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Français' })).toBeVisible()
  await expect(page.getByRole('button', { name: /start learning/i })).toBeVisible()

  await page.getByRole('button', { name: 'Français' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()

  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { name: 'Accueil' })).toBeVisible()
})
