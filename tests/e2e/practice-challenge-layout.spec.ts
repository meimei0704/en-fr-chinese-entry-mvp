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
  await expect(statTiles).toHaveCount(0)

  const header = page.locator('.practice-page__header')
  const body = page.locator('.practice-page__body')
  await expect(header).toBeVisible()
  await expect(body).toBeVisible()
  const headerBox = await header.boundingBox()
  const bodyBox = await body.boundingBox()
  expect(headerBox).not.toBeNull()
  expect(bodyBox).not.toBeNull()
  expect(Math.abs(headerBox!.x - bodyBox!.x)).toBeLessThanOrEqual(2)
  expect(Math.abs(headerBox!.width - bodyBox!.width)).toBeLessThanOrEqual(2)

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

    expect(Math.abs(promptBox!.x - optionsBox!.x)).toBeLessThanOrEqual(2)
    expect(optionsBox!.y).toBeGreaterThanOrEqual(promptBox!.y + promptBox!.height - 1)

    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth === document.documentElement.clientWidth
    })
    expect(noOverflow).toBe(true)
  }
})
