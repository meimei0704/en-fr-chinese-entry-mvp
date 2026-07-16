import { expect, test } from 'playwright/test'

test('stacks journey map nodes into a single column on phone widths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()

  const journeyNodes = page.locator('.journey-map__path > article')

  await expect(journeyNodes).toHaveCount(8)

  const firstNodeBox = await journeyNodes.nth(0).boundingBox()
  const secondNodeBox = await journeyNodes.nth(1).boundingBox()

  expect(firstNodeBox).not.toBeNull()
  expect(secondNodeBox).not.toBeNull()
  expect(Math.abs(firstNodeBox!.x - secondNodeBox!.x)).toBeLessThan(2)
  expect(secondNodeBox!.y).toBeGreaterThan(firstNodeBox!.y + firstNodeBox!.height - 2)
})
