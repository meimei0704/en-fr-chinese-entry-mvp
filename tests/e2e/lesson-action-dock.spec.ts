import { expect, test } from 'playwright/test'

const dockLessons = ['self-intro', 'restaurant-order', 'train-station-ticket'] as const

test('keeps the three-layer Lesson layout aligned across responsive widths', async ({ page }) => {
  for (const lessonId of dockLessons) {
    for (const width of [1440, 760, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/lesson/${lessonId}`)

      const dock = page.getByRole('navigation', { name: /lesson actions/i })
      const practice = dock.getByRole('link', { name: /go to practice/i })
      const home = dock.getByRole('link', { name: /back to home/i })
      const rail = page.locator('.lesson-page .lesson-progress-preview__rail')
      const steps = rail.getByRole('listitem')

      await expect(dock).toBeVisible()
      await expect(dock.getByRole('link')).toHaveCount(2)
      await expect(practice).toHaveAttribute('href', `/lesson/${lessonId}/practice`)
      await expect(home).toHaveAttribute('href', '/home')
      await expect(
        page.getByRole('link', { name: /finish with short input/i }),
      ).toHaveCount(0)
      await expect(steps).toHaveCount(3)

      await dock.scrollIntoViewIfNeeded()

      const [dockBox, practiceBox, homeBox, railBox] = await Promise.all([
        dock.boundingBox(),
        practice.boundingBox(),
        home.boundingBox(),
        rail.boundingBox(),
      ])

      expect(dockBox).not.toBeNull()
      expect(practiceBox).not.toBeNull()
      expect(homeBox).not.toBeNull()
      expect(railBox).not.toBeNull()

      const buttonBoxes = [practiceBox!, homeBox!]
      const buttonLeft = Math.min(...buttonBoxes.map((box) => box.x))
      const buttonRight = Math.max(...buttonBoxes.map((box) => box.x + box.width))
      const buttonGroupCenter = (buttonLeft + buttonRight) / 2
      const buttonGroupWidth = buttonRight - buttonLeft
      const dockCenter = dockBox!.x + dockBox!.width / 2

      expect(Math.abs(buttonGroupCenter - dockCenter)).toBeLessThanOrEqual(2)
      expect(dockBox!.width - buttonGroupWidth).toBeLessThanOrEqual(64)

      for (const buttonBox of buttonBoxes) {
        expect(buttonBox.x).toBeGreaterThanOrEqual(dockBox!.x - 1)
        expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(
          dockBox!.x + dockBox!.width + 1,
        )
      }

      const stepBoxes = await steps.evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect()
          return { x: box.x, y: box.y, width: box.width }
        }),
      )

      for (const box of stepBoxes) {
        expect(box.x).toBeGreaterThanOrEqual(railBox!.x - 1)
        expect(box.x + box.width).toBeLessThanOrEqual(railBox!.x + railBox!.width + 1)
      }

      if (width > 760) {
        expect(
          Math.max(...stepBoxes.map((box) => box.y)) -
            Math.min(...stepBoxes.map((box) => box.y)),
        ).toBeLessThanOrEqual(1)
        expect(Math.abs(stepBoxes[0].x - railBox!.x)).toBeLessThanOrEqual(1)
      } else {
        expect(Math.abs(stepBoxes[0].x - railBox!.x)).toBeLessThanOrEqual(1)
      }

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBe(clientWidth)
    }
  }
})
