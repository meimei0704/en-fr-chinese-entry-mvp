import { expect, test } from 'playwright/test'

test('keeps the practice challenge layout flat and adaptive across widths', async ({ page }) => {
  await page.goto('/lesson/self-intro/practice')

  const challenge = page.locator('.practice-challenge')
  const prompt = page.locator('.practice-challenge__prompt')
  const options = page.locator('.practice-challenge__options')
  const statTiles = page.locator('.practice-challenge__stat')

  await expect(challenge).toBeVisible()
  await expect(prompt).toBeVisible()
  await expect(options).toBeVisible()
  await expect(statTiles).toHaveCount(3)

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBe(clientWidth)

  for (const width of [1280, 760, 320]) {
    await page.setViewportSize({ width, height: 900 })

    const challengeBox = await challenge.boundingBox()
    expect(challengeBox).not.toBeNull()

    const promptBox = await prompt.boundingBox()
    const optionsBox = await options.boundingBox()
    expect(promptBox).not.toBeNull()
    expect(optionsBox).not.toBeNull()

    if (width > 760) {
      expect(optionsBox!.y).toBeGreaterThanOrEqual(promptBox!.y - 1)
      expect(optionsBox!.y).toBeLessThanOrEqual(promptBox!.y + promptBox!.height + 1)
      expect(optionsBox!.x).toBeGreaterThanOrEqual(promptBox!.x + promptBox!.width - 1)
    } else {
      expect(Math.abs(promptBox!.x - optionsBox!.x)).toBeLessThanOrEqual(2)
      expect(optionsBox!.y).toBeGreaterThanOrEqual(promptBox!.y + promptBox!.height - 1)
    }

    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth === document.documentElement.clientWidth
    })
    expect(noOverflow).toBe(true)
  }
})
