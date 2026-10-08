import { expect, test } from 'playwright/test'

test('plans a trip fully offline with provenance and the official-source boundary', async ({
  page,
}) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    let hostname: string
    try {
      hostname = new URL(request.url()).hostname
    } catch {
      return
    }
    if (hostname !== '127.0.0.1' && hostname !== 'localhost') {
      externalRequests.push(request.url())
    }
  })

  await page.goto('/travel')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Plan your trip to China' }),
  ).toBeVisible()
  await expect(page.getByLabel('Trip length (days)')).toBeVisible()

  await page.getByRole('button', { name: 'Generate itinerary' }).click()

  const itinerary = page.getByRole('region', { name: 'Trip summary' })
  await expect(itinerary).toBeVisible()
  await expect(itinerary.getByRole('heading', { name: 'Day 1' })).toBeVisible()

  const verifyOfficial = itinerary.getByRole('link', { name: 'Verify official' })
  expect(await verifyOfficial.count()).toBeGreaterThanOrEqual(1)
  await expect(verifyOfficial.first()).toBeVisible()
  await expect(verifyOfficial.first()).toHaveAttribute('href', /^https:\/\//)

  await expect(page.getByRole('note')).toContainText(
    'General information only — not legal advice.',
  )

  expect(externalRequests).toEqual([])
})

test('shows inline validation and no itinerary for an invalid submit', async ({ page }) => {
  await page.goto('/travel')

  await page.getByLabel('Trip length (days)').fill('0')
  await page.getByRole('button', { name: 'Generate itinerary' }).click()

  const alert = page.getByRole('alert')
  await expect(alert).toBeVisible()
  await expect(alert).toContainText('Choose a trip length between 1 and 21 days.')
  await expect(page.getByRole('region', { name: 'Trip summary' })).toHaveCount(0)
})

test('renders the itinerary with real styles and a responsive single column', async ({ page }) => {
  await page.goto('/travel')
  await page.getByRole('button', { name: 'Generate itinerary' }).click()

  const form = page.locator('.travel-form')
  await expect(form).toBeVisible()
  expect(await form.evaluate((element) => getComputedStyle(element).display)).toBe('grid')

  const dayCard = page.locator('.day-card').first()
  await expect(dayCard).toBeVisible()
  const dayStyles = await dayCard.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      borderLeftWidth: styles.borderLeftWidth,
      backgroundColor: styles.backgroundColor,
      boxShadow: styles.boxShadow,
    }
  })
  expect(dayStyles.borderLeftWidth).toBe('4px')
  expect(dayStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(dayStyles.boxShadow).not.toBe('none')

  await page.setViewportSize({ width: 480, height: 900 })
  const columns = await page
    .locator('.itinerary-view__days')
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns)
  expect(columns.split(' ').length).toBe(1)
})
