import { expect, test } from 'playwright/test'

test('keeps answer audio on the options without leaking it from the question', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 1 / 2 ** 31

    const audioEvents: Array<{ src: string; type: string }> = []
    ;(window as typeof window & { __practiceAudioEvents: typeof audioEvents }).__practiceAudioEvents =
      audioEvents

    class MockAudio {
      currentTime = 0
      preload = ''
      private source = ''

      get src() {
        return this.source
      }

      set src(value: string) {
        this.source = value
        audioEvents.push({ src: value, type: 'src' })
      }

      addEventListener() {}

      getAttribute(name: string) {
        return name === 'src' ? this.source : null
      }

      load() {
        audioEvents.push({ src: this.source, type: 'load' })
      }

      pause() {
        audioEvents.push({ src: this.source, type: 'pause' })
      }

      play() {
        audioEvents.push({ src: this.source, type: 'play' })
        return Promise.resolve()
      }

      removeAttribute(name: string) {
        if (name === 'src') this.source = ''
      }
    }

    Object.defineProperty(window, 'Audio', {
      configurable: true,
      value: MockAudio,
    })
  })

  await page.goto('/lesson/daily-greetings/practice')

  const challenge = page.locator('.practice-challenge')
  const optionSpeechButtons = challenge.locator('.practice-challenge__option .speech-button')

  await expect(challenge.locator('.practice-challenge__prompt .speech-button')).toHaveCount(0)
  await expect(optionSpeechButtons).toHaveCount(4)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __practiceAudioEvents: Array<{ src: string; type: string }>
            }
          ).__practiceAudioEvents.filter((event) => event.type === 'play').length,
      ),
    )
    .toBe(0)

  const firstOptionLabel = await optionSpeechButtons.first().getAttribute('aria-label')
  await optionSpeechButtons.first().click()

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __practiceAudioEvents: Array<{ src: string; type: string }>
            }
          ).__practiceAudioEvents.filter((event) => event.type === 'play'),
      ),
    )
    .toHaveLength(1)
  await expect(challenge.locator('.practice-challenge__feedback')).toHaveCount(0)
  expect(firstOptionLabel).toMatch(/^Play /)
})

test('keeps the practice challenge layout flat and adaptive across widths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
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
  await expect(prompt.locator('.speech-button')).toHaveCount(0)

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
    expect(textBox).not.toBeNull()

    for (const option of await page.locator('.practice-challenge__option').all()) {
      const optionBox = await option.boundingBox()
      const speech = option.locator('.speech-button')
      const letter = option.locator('.option-button__letter')
      const label = option.locator('.option-button__label')
      expect(optionBox).not.toBeNull()
      expect(optionBox!.x).toBeGreaterThanOrEqual(optionsBox!.x - 1)
      expect(optionBox!.x + optionBox!.width).toBeLessThanOrEqual(
        optionsBox!.x + optionsBox!.width + 1,
      )

      const letterBox = await letter.boundingBox()
      expect(letterBox).not.toBeNull()
      expect(letterBox!.x - optionBox!.x).toBeLessThanOrEqual(16)
      expect(await label.evaluate((node) => getComputedStyle(node).whiteSpace)).toBe('nowrap')

      const pinyin = option.locator('.option-button__pinyin')
      if (await pinyin.count()) {
        expect(await pinyin.evaluate((node) => getComputedStyle(node).whiteSpace)).toBe('nowrap')
      }

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
      node.textContent = ['晚安。', '您好。', '谢谢。', '早上好。'][index]
    }
  })
  await page.locator('.option-button__pinyin').evaluateAll((nodes) => {
    const values = ['Wǎn ān.', 'Nín hǎo.', 'Xièxie.', 'Zǎoshang hǎo.']
    for (const [index, node] of nodes.entries()) {
      node.textContent = values[index] ?? 'Zǎoshang hǎo.'
    }
  })

  const compactTops = await cards.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  )
  expect(new Set(compactTops).size).toBe(1)

  await page.setViewportSize({ width: 760, height: 900 })

  const optionsBox = await options.boundingBox()
  expect(optionsBox).not.toBeNull()

  const wrappedTops = await cards.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  )
  expect(new Set(wrappedTops).size).toBeGreaterThan(1)

  for (const label of await labels.all()) {
    expect(await label.evaluate((node) => getComputedStyle(node).whiteSpace)).toBe('nowrap')
    const labelBox = await label.boundingBox()
    expect(labelBox).not.toBeNull()
    expect(labelBox!.height).toBeLessThanOrEqual(24)
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    ),
  ).toBe(true)
})
