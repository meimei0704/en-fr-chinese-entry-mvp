import { expect, test } from 'playwright/test'

test('shows the Home page on root and keeps /home compatible', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
  await expect(
    page.getByText('Apprenez le mandarin dans la vie quotidienne'),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'English' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /airport immigration basics/i })).toHaveAttribute(
    'href',
    '/lesson/self-intro',
  )

  await page.goto('/home')

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
})
