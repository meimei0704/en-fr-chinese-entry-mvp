import { expect, test } from 'playwright/test'

test('shows the explanation-language entry screen on first load', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'English' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Français' })).toBeVisible()
  await expect(page.getByRole('button', { name: /start learning/i })).toBeVisible()

  await page.getByRole('button', { name: 'Français' }).click()
  await page.getByRole('button', { name: /commencer/i }).click()

  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(
    page.getByText('Apprenez le mandarin dans la vie quotidienne'),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /continuer la leçon/i })).toBeVisible()
})
