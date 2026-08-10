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
