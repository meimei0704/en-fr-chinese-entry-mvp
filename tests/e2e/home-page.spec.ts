import { expect, test } from 'playwright/test'

test('stacks journey map nodes into a single column on phone widths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()

  const journeyNodes = page.locator('.journey-map__path > .journey-node')

  await expect(journeyNodes).toHaveCount(8)

  const firstNodeBox = await journeyNodes.nth(0).boundingBox()
  const secondNodeBox = await journeyNodes.nth(1).boundingBox()

  expect(firstNodeBox).not.toBeNull()
  expect(secondNodeBox).not.toBeNull()
  expect(Math.abs(firstNodeBox!.x - secondNodeBox!.x)).toBeLessThan(2)
  expect(secondNodeBox!.y).toBeGreaterThan(firstNodeBox!.y + firstNodeBox!.height - 2)
})

test('keeps Home journey cards readable at 1024px by avoiding a cramped four-column row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()

  const journeyNodes = page.locator('.journey-map__path > .journey-node')

  await expect(journeyNodes).toHaveCount(8)

  const [firstNodeBox, secondNodeBox, thirdNodeBox, fourthNodeBox] = await Promise.all(
    [0, 1, 2, 3].map((index) => journeyNodes.nth(index).boundingBox()),
  )

  expect(firstNodeBox).not.toBeNull()
  expect(secondNodeBox).not.toBeNull()
  expect(thirdNodeBox).not.toBeNull()
  expect(fourthNodeBox).not.toBeNull()

  expect(Math.abs(firstNodeBox!.y - secondNodeBox!.y)).toBeLessThan(2)
  expect(Math.abs(secondNodeBox!.y - thirdNodeBox!.y)).toBeLessThan(2)
  expect(fourthNodeBox!.y).toBeGreaterThan(firstNodeBox!.y + firstNodeBox!.height - 2)

  const titleWidths = await journeyNodes.evaluateAll((nodes) =>
    nodes.map((node) => {
      const title = node.querySelector('h2, h3')
      return title ? Math.round(title.getBoundingClientRect().width) : 0
    }),
  )

  expect(Math.min(...titleWidths)).toBeGreaterThanOrEqual(140)
})
