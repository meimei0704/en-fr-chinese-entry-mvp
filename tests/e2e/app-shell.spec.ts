import { expect, test } from 'playwright/test'

test('shows the Home page on root and keeps /home compatible', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.getByRole('region', { name: /home hero/i })).toHaveClass(/home-hero--centered/)
  await expect(page.getByText('Basic Chinese expressions for a stress-free travel')).toBeVisible()
  await expect(
    page.getByText('Apprenez les dialogues essentiels pour voyager en Chine'),
  ).toHaveCount(0)
  await expect(page.getByRole('group', { name: /explanation language/i })).toBeVisible()
  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('button', { name: 'Français' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await expect(page.getByRole('region', { name: /learning preview mockup/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /listen|écouter/i })).toHaveCount(0)
  await expect(page.getByText('Real-life Mandarin')).toHaveCount(0)
  await expect(page.getByText('Mandarin en situation')).toHaveCount(0)
  await expect(page.getByText(/A focused ten-lesson path/i)).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: /quick learning paths/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /continue learning/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /go to review/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /view progress/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /打招呼\s+Daily greetings/i })).toHaveAttribute(
    'href',
    '/lesson/daily-greetings',
  )
  await expect(page.getByText(/打招呼 \/ Daily greetings/i)).toHaveCount(0)
  await page.getByRole('button', { name: 'Français' }).click()
  await expect(page.getByText('Basic Chinese expressions for a stress-free travel')).toHaveCount(0)
  await expect(
    page.getByText('Apprenez les dialogues essentiels pour voyager en Chine'),
  ).toBeVisible()

  await page.goto('/home')

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
})
