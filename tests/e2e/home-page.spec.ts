import { expect, test } from 'playwright/test'

test('keeps the Home journey stamp slot decorative while preserving readable text widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()
  await page.getByRole('button', { name: /start learning/i }).click()

  const journeyNodes = page.locator('.journey-map__path > .journey-node')
  await expect(journeyNodes).toHaveCount(5)
  await expect(page.getByRole('link', { name: /airport immigration basics/i })).toHaveAttribute(
    'href',
    '/lesson/self-intro',
  )
  await expect(page.getByRole('link', { name: /phone number & mobile payment/i })).toHaveAttribute(
    'href',
    '/lesson/phone-and-payment',
  )

  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })

    const firstCard = journeyNodes.first()
    const secondCard = journeyNodes.nth(1)
    const title = firstCard.locator('h2')
    const slot = firstCard.locator('.journey-node__illustration-slot--stamp')

    const [firstCardBox, secondCardBox, titleBox, slotBox] = await Promise.all([
      firstCard.boundingBox(),
      secondCard.boundingBox(),
      title.boundingBox(),
      slot.boundingBox(),
    ])

    expect(firstCardBox).not.toBeNull()
    expect(secondCardBox).not.toBeNull()
    expect(titleBox).not.toBeNull()
    expect(slotBox).not.toBeNull()

    if (width <= 390) {
      expect(Math.abs(firstCardBox!.x - secondCardBox!.x)).toBeLessThan(2)
      expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height - 2)
    }

    expect(slotBox!.width).toBeLessThan(firstCardBox!.width * 0.38)
    expect(titleBox!.width).toBeGreaterThanOrEqual(width >= 1024 ? 150 : 140)
  }
})
