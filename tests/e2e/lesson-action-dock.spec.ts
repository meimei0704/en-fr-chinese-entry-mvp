import { expect, test } from 'playwright/test'

test('centers the Lesson CTA group in its action dock across responsive widths', async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/lesson/self-intro')

    const dock = page.getByRole('navigation', { name: /lesson actions/i })
    const practice = page.getByRole('link', { name: /go to practice/i })
    const shortInput = page.getByRole('link', { name: /finish with short input/i })
    const home = page.getByRole('link', { name: /back to home/i })

    await expect(dock).toBeVisible()
    await expect(practice).toHaveAttribute('href', '/lesson/self-intro/practice')
    await expect(shortInput).toHaveAttribute('href', '/lesson/self-intro/short-input')
    await expect(home).toHaveAttribute('href', '/home')

    await dock.scrollIntoViewIfNeeded()

    const [dockBox, practiceBox, shortInputBox, homeBox] = await Promise.all([
      dock.boundingBox(),
      practice.boundingBox(),
      shortInput.boundingBox(),
      home.boundingBox(),
    ])

    expect(dockBox).not.toBeNull()
    expect(practiceBox).not.toBeNull()
    expect(shortInputBox).not.toBeNull()
    expect(homeBox).not.toBeNull()

    const buttonLeft = Math.min(practiceBox!.x, shortInputBox!.x, homeBox!.x)
    const buttonRight = Math.max(
      practiceBox!.x + practiceBox!.width,
      shortInputBox!.x + shortInputBox!.width,
      homeBox!.x + homeBox!.width,
    )
    const buttonGroupCenter = (buttonLeft + buttonRight) / 2
    const buttonGroupWidth = buttonRight - buttonLeft
    const dockCenter = dockBox!.x + dockBox!.width / 2

    expect(Math.abs(buttonGroupCenter - dockCenter)).toBeLessThanOrEqual(2)
    expect(dockBox!.width - buttonGroupWidth).toBeLessThanOrEqual(64)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBe(clientWidth)

    for (const buttonBox of [practiceBox!, shortInputBox!, homeBox!]) {
      expect(buttonBox.x).toBeGreaterThanOrEqual(dockBox!.x - 1)
      expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(dockBox!.x + dockBox!.width + 1)
    }
  }
})
