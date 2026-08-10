import { expect, test } from 'playwright/test'

test('serves a boot loading placeholder that React removes on mount', async ({ page }) => {
  const response = await page.goto('/')
  const html = await response!.text()
  const servedBootMarkup =
    html.includes('id="app-boot"') && html.includes('轻松学中文') && html.includes('app-boot-shimmer')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.locator('#app-boot')).toHaveCount(0)

  expect(servedBootMarkup).toBe(true)
})

test('shows the branded loading screen instead of text while the course is slow to load', async ({
  page,
}) => {
  await page.route('**/api/content/course', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await route.continue()
  })

  await page.goto('/')

  await expect(page.locator('.brand-loading__logo')).toBeVisible()
  await expect(page.locator('[role="status"]')).toContainText('轻松学中文')
  await expect(page.getByText(/loading the course/i)).toHaveCount(0)
  await expect(page.getByText(/^loading$/i)).toHaveCount(0)

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.locator('.brand-loading')).toHaveCount(0)
})
