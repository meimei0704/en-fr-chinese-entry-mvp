import { expect, test } from 'playwright/test'

test('keeps the Home journey stamp slot decorative while preserving readable text widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  await expect(page.getByRole('region', { name: /home hero/i })).toHaveClass(/home-hero--centered/)
  await expect(page.getByText('Learn Mandarin in real life scenarios')).toBeVisible()
  await expect(
    page.getByText('Apprenez le mandarin dans la vie quotidienne'),
  ).toHaveCount(0)
  await expect(page.getByText(/open lesson/i)).toHaveCount(0)
  await expect(page.getByRole('region', { name: /learning preview mockup/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /listen|écouter/i })).toHaveCount(0)
  await expect(page.getByText('Real-life Mandarin')).toHaveCount(0)
  await expect(page.getByText('Mandarin en situation')).toHaveCount(0)
  await expect(page.getByText(/A focused ten-lesson path/i)).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: /quick learning paths/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /continue learning/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /go to review/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /view progress/i })).toHaveCount(0)

  const journeyNodes = page.locator('.journey-map__path > .journey-node')
  await expect(journeyNodes).toHaveCount(10)
  await expect(page.getByRole('link', { name: /airport immigration basics/i })).toHaveAttribute(
    'href',
    '/lesson/self-intro',
  )
  await expect(page.getByRole('link', { name: /phone number & mobile payment/i })).toHaveAttribute(
    'href',
    '/lesson/phone-and-payment',
  )
  await expect(page.getByRole('link', { name: /order a simple meal/i })).toHaveAttribute(
    'href',
    '/lesson/restaurant-order',
  )
  await expect(page.getByRole('link', { name: /buy a train station ticket/i })).toHaveAttribute(
    'href',
    '/lesson/train-station-ticket',
  )

  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })

    const firstCard = journeyNodes.first()
    const secondCard = journeyNodes.nth(1)
    const heroTitle = page.getByRole('heading', { name: '轻松学中文' })
    const title = firstCard.locator('h2')
    const slot = firstCard.locator('.journey-node__illustration-slot--stamp')

    const [firstCardBox, secondCardBox, heroTitleBox, titleBox, slotBox] = await Promise.all([
      firstCard.boundingBox(),
      secondCard.boundingBox(),
      heroTitle.boundingBox(),
      title.boundingBox(),
      slot.boundingBox(),
    ])

    expect(firstCardBox).not.toBeNull()
    expect(secondCardBox).not.toBeNull()
    expect(heroTitleBox).not.toBeNull()
    expect(titleBox).not.toBeNull()
    expect(slotBox).not.toBeNull()

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBe(clientWidth)

    if (width <= 390) {
      expect(Math.abs(firstCardBox!.x - secondCardBox!.x)).toBeLessThan(2)
      expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height - 2)
    }

    expect(heroTitleBox!.width).toBeLessThan(clientWidth * 0.92)
    expect(heroTitleBox!.height).toBeLessThan(width >= 1024 ? 116 : 92)
    expect(slotBox!.width).toBeLessThan(firstCardBox!.width * 0.38)
    expect(titleBox!.width).toBeGreaterThanOrEqual(width >= 1024 ? 150 : 140)
  }
})
