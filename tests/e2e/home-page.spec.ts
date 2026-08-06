import { expect, test } from 'playwright/test'

const expectedTopics = [
  ['到达机场', 'Arrival at the airport'],
  ['打车去酒店', 'Take a taxi to your hotel'],
  ['酒店或公寓入住', 'Hotel or apartment check-in'],
  ['手机号码和移动支付', 'Phone number & mobile payment setup'],
  ['第一次便利店购物', 'First convenience store run'],
  ['点一份简单的饭', 'Order a simple meal'],
  ['买地铁票', 'Buy a metro ticket'],
  ['去药店求助', 'Ask for help at a pharmacy'],
  ['遇到问题时求助', 'Ask for help with a problem'],
  ['在火车站买票', 'Buy a train station ticket'],
] as const

const heroViewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 900,
    expectedOpacity: 0.32,
    expectedImageHeightRatio: 1.42,
    expectedImageTopRatio: 0.5,
  },
  {
    name: 'tablet',
    width: 1024,
    height: 900,
    expectedOpacity: 0.3,
    expectedImageHeightRatio: 1.36,
    expectedImageTopRatio: 0.5,
  },
  {
    name: 'mobile-390',
    width: 390,
    height: 844,
    expectedOpacity: 0.3,
    expectedImageHeightRatio: 1.16,
    expectedImageTopRatio: 0.8,
  },
  {
    name: 'mobile-320',
    width: 320,
    height: 720,
    expectedOpacity: 0.3,
    expectedImageHeightRatio: 1.16,
    expectedImageTopRatio: 0.8,
  },
] as const

test('keeps the Home journey stamp slot decorative while preserving readable text widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.getByRole('heading', { name: '轻松学中文' })).toBeVisible()
  const hero = page.getByRole('region', { name: /home hero/i })
  const illustration = hero.locator('.home-hero__illustration')
  const illustrationImage = illustration.locator('img.home-hero__illustration-image')
  const illustrationVeil = illustration.locator('.home-hero__illustration-veil')

  await expect(hero).toHaveClass(/home-hero--centered/)
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
  await expect(illustration).toHaveCount(1)
  await expect(illustration).toHaveAttribute('aria-hidden', 'true')
  await expect(illustrationImage).toHaveCount(1)
  await expect(illustrationImage).toHaveAttribute('alt', '')
  await expect(illustrationImage).toHaveAttribute(
    'src',
    '/images/home-hero-chinese-elements.webp',
  )
  await expect(illustrationVeil).toHaveCount(1)
  await expect(hero.locator('.home-hero__scroll-scene, svg.home-hero__scroll-svg')).toHaveCount(0)

  const courseSeries = page.getByRole('region', { name: 'Course series' })
  const pinyinSeries = courseSeries.getByRole('region', { name: 'Mandarin tones and pinyin' })
  const journeySeries = courseSeries.getByRole('region', {
    name: 'Basic Chinese expressions for a stress-free journey',
  })
  const pinyinEntry = pinyinSeries.getByRole('link', { name: 'Mandarin tones and pinyin' })
  const journeyNodes = journeySeries.locator('.journey-map__path > .journey-node')
  await expect(courseSeries.getByText('Course series', { exact: true })).toBeVisible()
  await expect(pinyinSeries.getByRole('heading', {
    level: 2,
    name: 'Mandarin tones and pinyin',
  })).toBeVisible()
  await expect(journeySeries.getByRole('heading', {
    level: 2,
    name: 'Basic Chinese expressions for a stress-free journey',
  })).toBeVisible()
  await expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  await expect(journeySeries.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
  await expect(journeyNodes).toHaveCount(10)
  await expect(page.getByText('Journey Map', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Arrive in China step by step', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /到达机场\s+Arrival at the airport/i })).toHaveAttribute(
    'href',
    '/lesson/self-intro',
  )
  await expect(page.getByText(/到达机场 \/ Arrival at the airport/i)).toHaveCount(0)
  await expect(journeySeries.locator('.lesson-topic-title__primary').first()).toHaveText('到达机场')
  await expect(journeySeries.locator('.lesson-topic-title__secondary').first()).toHaveText(
    'Arrival at the airport',
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
  await expect(journeySeries).not.toContainText(' / ')

  for (const [index, [hanzi, explanation]] of expectedTopics.entries()) {
    const heading = journeySeries.locator('.lesson-topic-title').nth(index)

    await expect(heading).toContainText(hanzi)
    await expect(heading).toContainText(explanation)
    await expect(heading.locator('.lesson-topic-title__primary')).toHaveText(hanzi)
    await expect(heading.locator('.lesson-topic-title__secondary')).toHaveText(explanation)
  }

  for (const viewport of heroViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    const firstCard = journeyNodes.first()
    const secondCard = journeyNodes.nth(1)
    const heroTitle = page.getByRole('heading', { name: '轻松学中文' })
    const heroSlogan = page.getByText('Learn Mandarin in real life scenarios')
    const languageControls = page.getByRole('group', { name: 'Explanation language' })
    const title = firstCard.locator('h3')
    const slot = firstCard.locator('.journey-node__illustration-slot--stamp')

    await expect(illustrationImage).toBeVisible()
    await expect(illustrationVeil).toBeVisible()
    await expect(heroTitle).toBeVisible()
    await expect(heroSlogan).toBeVisible()
    await expect(languageControls).toBeVisible()

    const [
      firstCardBox,
      secondCardBox,
      heroBox,
      illustrationBox,
      heroTitleBox,
      titleBox,
      slotBox,
    ] = await Promise.all([
      firstCard.boundingBox(),
      secondCard.boundingBox(),
      hero.boundingBox(),
      illustration.boundingBox(),
      heroTitle.boundingBox(),
      title.boundingBox(),
      slot.boundingBox(),
    ])

    expect(firstCardBox).not.toBeNull()
    expect(secondCardBox).not.toBeNull()
    expect(heroBox).not.toBeNull()
    expect(illustrationBox).not.toBeNull()
    expect(heroTitleBox).not.toBeNull()
    expect(titleBox).not.toBeNull()
    expect(slotBox).not.toBeNull()

    const [scrollWidth, clientWidth, heroClientHeight, layerStyle, imageFacts] =
      await Promise.all([
        page.evaluate(() => document.documentElement.scrollWidth),
        page.evaluate(() => document.documentElement.clientWidth),
        hero.evaluate((element) => element.clientHeight),
        illustration.evaluate((element) => {
          const style = window.getComputedStyle(element)
          return {
            overflow: style.overflow,
            pointerEvents: style.pointerEvents,
            position: style.position,
          }
        }),
        illustrationImage.evaluate((element) => {
          const image = element as HTMLImageElement
          const style = window.getComputedStyle(image)
          return {
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            objectFit: style.objectFit,
            opacity: Number.parseFloat(style.opacity),
            cssHeight: Number.parseFloat(style.height),
            cssTop: Number.parseFloat(style.top),
          }
        }),
      ])

    expect(scrollWidth).toBe(clientWidth)
    expect(layerStyle).toEqual({
      overflow: 'hidden',
      pointerEvents: 'none',
      position: 'absolute',
    })
    expect(imageFacts.complete).toBe(true)
    expect(imageFacts.naturalWidth).toBe(1318)
    expect(imageFacts.naturalHeight).toBe(1226)
    expect(imageFacts.objectFit).toBe('contain')
    expect(imageFacts.opacity).toBeCloseTo(viewport.expectedOpacity, 2)
    expect(imageFacts.cssHeight / heroClientHeight).toBeCloseTo(
      viewport.expectedImageHeightRatio,
      2,
    )
    expect(imageFacts.cssTop / heroClientHeight).toBeCloseTo(
      viewport.expectedImageTopRatio,
      2,
    )
    expect(Math.abs(illustrationBox!.x - heroBox!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(illustrationBox!.y - heroBox!.y)).toBeLessThanOrEqual(2)
    expect(
      Math.abs(
        illustrationBox!.x + illustrationBox!.width - (heroBox!.x + heroBox!.width),
      ),
    ).toBeLessThanOrEqual(2)
    expect(
      Math.abs(
        illustrationBox!.y + illustrationBox!.height - (heroBox!.y + heroBox!.height),
      ),
    ).toBeLessThanOrEqual(2)

    if (viewport.width <= 390) {
      expect(Math.abs(firstCardBox!.x - secondCardBox!.x)).toBeLessThan(2)
      expect(secondCardBox!.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height - 2)
    }

    expect(heroTitleBox!.width).toBeLessThan(clientWidth * 0.92)
    expect(heroTitleBox!.height).toBeLessThan(viewport.width >= 1024 ? 116 : 92)
    expect(slotBox!.width).toBeLessThan(firstCardBox!.width * 0.38)
    expect(titleBox!.width).toBeGreaterThanOrEqual(viewport.width >= 1024 ? 150 : 140)

    await test.info().attach(`home-hero-${viewport.name}-${viewport.width}`, {
      body: await hero.screenshot(),
      contentType: 'image/png',
    })
  }
})
