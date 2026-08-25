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

  const promptText = prompt.locator('p')
  const promptSpeech = prompt.locator('.speech-button')

  for (let attempts = 0; attempts < 5 && (await promptSpeech.count()) === 0; attempts += 1) {
    await page.locator('.practice-challenge__option .option-button').first().click()
    const nextButton = page.locator('.practice-challenge__feedback .primary-button')
    if (await nextButton.count()) {
      await nextButton.click()
    }
  }

  await expect(promptSpeech).toHaveCount(1)
  await promptText.evaluate((node) => {
    node.textContent =
      'Which phrase would you use when you want to ask this deliberately long practice question? '.repeat(
        4,
      )
  })

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

  for (const width of [1280, 760, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })

    const challengeBox = await challenge.boundingBox()
    expect(challengeBox).not.toBeNull()

    const promptBox = await prompt.boundingBox()
    const optionsBox = await options.boundingBox()
    expect(promptBox).not.toBeNull()
    expect(optionsBox).not.toBeNull()

    expect(Math.abs(promptBox!.x - optionsBox!.x)).toBeLessThanOrEqual(2)
    expect(optionsBox!.y).toBeGreaterThanOrEqual(promptBox!.y + promptBox!.height - 1)

    const textBox = await promptText.boundingBox()
    const promptSpeechBox = await promptSpeech.boundingBox()
    expect(textBox).not.toBeNull()
    expect(promptSpeechBox).not.toBeNull()
    expect(promptSpeechBox!.x).toBeGreaterThanOrEqual(textBox!.x + textBox!.width - 1)
    expect(
      Math.abs(
        promptSpeechBox!.y +
          promptSpeechBox!.height / 2 -
          (promptBox!.y + promptBox!.height / 2),
      ),
    ).toBeLessThanOrEqual(2)

    for (const option of await page.locator('.practice-challenge__option').all()) {
      const optionBox = await option.boundingBox()
      const speech = option.locator('.speech-button')
      expect(optionBox).not.toBeNull()
      expect(optionBox!.x).toBeGreaterThanOrEqual(optionsBox!.x - 1)
      expect(optionBox!.x + optionBox!.width).toBeLessThanOrEqual(
        optionsBox!.x + optionsBox!.width + 1,
      )

      if (await speech.count()) {
        const speechBox = await speech.boundingBox()
        expect(speechBox).not.toBeNull()
        expect(speechBox!.width).toBeLessThanOrEqual(28.5)
        expect(
          Math.abs(
            speechBox!.y +
              speechBox!.height / 2 -
              (optionBox!.y + optionBox!.height / 2),
          ),
        ).toBeLessThanOrEqual(2)
      }
    }

    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth === document.documentElement.clientWidth
    })
    expect(noOverflow).toBe(true)
  }
})

test('lets rendered option content choose one row or multiple rows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/lesson/order-food/practice')

  const options = page.locator('.practice-challenge__options')
  const cards = page.locator('.practice-challenge__option')
  const labels = page.locator('.option-button__label')
  await expect(cards).toHaveCount(4)

  await labels.evaluateAll((nodes) => {
    for (const [index, node] of nodes.entries()) {
      node.textContent = ['一', '二', '三', '四'][index]
    }
  })
  await page.locator('.option-button__pinyin').evaluateAll((nodes) => {
    for (const node of nodes) {
      node.textContent = ''
    }
  })

  const compactTops = await cards.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  )
  expect(new Set(compactTops).size).toBe(1)

  await labels.first().evaluate((node) => {
    node.textContent =
      '这是一个用于验证超长选项能够独占整行并在卡片内部安全换行而不会溢出的练习答案'.repeat(
        4,
      )
  })

  const optionsBox = await options.boundingBox()
  const longBox = await cards.first().boundingBox()
  const secondBox = await cards.nth(1).boundingBox()
  expect(optionsBox).not.toBeNull()
  expect(longBox).not.toBeNull()
  expect(secondBox).not.toBeNull()
  expect(Math.abs(longBox!.width - optionsBox!.width)).toBeLessThanOrEqual(2)
  expect(secondBox!.y).toBeGreaterThanOrEqual(longBox!.y + longBox!.height - 1)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    ),
  ).toBe(true)
})
