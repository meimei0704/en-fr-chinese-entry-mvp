import { expect, test } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'
const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

const seriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Basic Chinese expressions for a stress-free journey',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
  },
} as const

const frenchCourseProgress = {
  selectedExplanationLanguage: 'fr',
  completedLessons: ['self-intro'],
  reviewQueue: [],
  lastVisitedLesson: 'self-intro',
  lessonStepProgress: {},
} as const

const twoSectionPinyinProgress = {
  schemaVersion: 1,
  visited: true,
  completedSections: ['reference', 'tone-game'],
  toneGameLastScore: 8,
  toneGameBestScore: 8,
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
} as const

test('shows localized peer series on Home and independent 3-vs-10 progress', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const homeCourses = page.getByRole('region', { name: seriesCopy.en.label })
  const homePinyin = homeCourses.getByRole('region', { name: seriesCopy.en.pinyin })
  const homeJourney = homeCourses.getByRole('region', { name: seriesCopy.en.journey })
  const homePanels = homeCourses.locator(':scope > .course-series__list > .course-series__panel')
  const homePinyinLink = homePinyin.getByRole('link', { name: seriesCopy.en.pinyin })

  await expect(homePanels).toHaveCount(2)
  await expect(homePinyinLink).toHaveAttribute('href', '/pinyin')
  const frenchLanguageButton = page.getByRole('button', { name: 'Français' })
  await frenchLanguageButton.focus()
  await page.keyboard.press('Tab')
  await expect(homePinyinLink).toBeFocused()
  const focusStyle = await homePinyinLink.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })
  expect(focusStyle.outlineStyle).toBe('solid')
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3)
  await expect(homeJourney.locator('.journey-map__path > .journey-node')).toHaveCount(10)
  await expect(homeJourney.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
  await expect(page.getByText('Journey Map', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Arrive in China step by step', { exact: true })).toHaveCount(0)
  await testInfo.attach('course-series-home-desktop', {
    body: await homeCourses.screenshot(),
    contentType: 'image/png',
  })

  await page.getByRole('button', { name: 'Français' }).click()

  const frenchHomeCourses = page.getByRole('region', { name: seriesCopy.fr.label })
  await expect(frenchHomeCourses.getByRole('region', { name: seriesCopy.fr.pinyin })).toBeVisible()
  await expect(frenchHomeCourses.getByRole('region', { name: seriesCopy.fr.journey })).toBeVisible()
  await expect(page.getByText(seriesCopy.en.pinyin, { exact: true })).toHaveCount(0)
  await expect(page.getByText(seriesCopy.en.journey, { exact: true })).toHaveCount(0)

  await page.evaluate(
    ({ courseKey, courseProgress, pinyinKey, pinyinProgress }) => {
      localStorage.setItem(courseKey, JSON.stringify(courseProgress))
      localStorage.setItem(pinyinKey, JSON.stringify(pinyinProgress))
    },
    {
      courseKey: courseProgressStorageKey,
      courseProgress: frenchCourseProgress,
      pinyinKey: pinyinProgressStorageKey,
      pinyinProgress: twoSectionPinyinProgress,
    },
  )
  await page.goto('/progress')

  const progressCourses = page.getByRole('region', { name: seriesCopy.fr.label })
  const pinyinProgress = progressCourses.getByRole('region', { name: seriesCopy.fr.pinyin })
  const journeyProgress = progressCourses.getByRole('region', { name: seriesCopy.fr.journey })
  const progressPanels = progressCourses.locator(
    ':scope > .course-series__list > .course-series__panel',
  )

  await expect(progressPanels).toHaveCount(2)
  await expect(pinyinProgress.getByText('2 sections sur 3 terminées')).toBeVisible()
  await expect(pinyinProgress.getByRole('link', { name: seriesCopy.fr.pinyin })).toHaveAttribute(
    'href',
    '/pinyin',
  )
  await expect(journeyProgress.locator('.progress-journey-map__path > .journey-node')).toHaveCount(
    10,
  )
  await expect(journeyProgress.getByRole('link', { name: /pinyin/i })).toHaveCount(0)
  await expect(page.getByRole('region', { name: /indicateurs d’apprentissage/i })).toContainText(
    '1/10',
  )
  await expect(page.getByText('1 leçon sur 10 terminée').first()).toBeVisible()
  await testInfo.attach('course-series-progress-desktop', {
    body: await progressCourses.screenshot(),
    contentType: 'image/png',
  })
})

test('stacks naturally wrapped French peer panels without overflow at 390px and 320px', async ({
  page,
}, testInfo) => {
  for (const viewport of [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-320', width: 320, height: 720 },
  ] as const) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/')
    await page.evaluate(
      ({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)),
      { key: courseProgressStorageKey, progress: frenchCourseProgress },
    )
    await page.reload()

    for (const route of ['/', '/progress'] as const) {
      if (route === '/progress') {
        await page.goto(route)
      }

      const courses = page.getByRole('region', { name: seriesCopy.fr.label })
      const pinyinPanel = courses.getByRole('region', { name: seriesCopy.fr.pinyin })
      const journeyPanel = courses.getByRole('region', { name: seriesCopy.fr.journey })
      const pinyinBox = await pinyinPanel.boundingBox()
      const journeyBox = await journeyPanel.boundingBox()

      expect(pinyinBox).not.toBeNull()
      expect(journeyBox).not.toBeNull()
      expect(Math.abs(pinyinBox!.x - journeyBox!.x)).toBeLessThanOrEqual(2)
      expect(journeyBox!.y).toBeGreaterThanOrEqual(pinyinBox!.y + pinyinBox!.height - 2)

      for (const title of [seriesCopy.fr.pinyin, seriesCopy.fr.journey]) {
        const metrics = await courses.getByRole('heading', { level: 2, name: title }).evaluate(
          (element) => {
            const style = window.getComputedStyle(element)
            const wordFragments: Array<{ text: string; fragmentCount: number }> = []
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)

            while (walker.nextNode()) {
              const textNode = walker.currentNode
              const text = textNode.textContent ?? ''

              for (const match of text.matchAll(/\S+/g)) {
                const range = document.createRange()
                const start = match.index
                range.setStart(textNode, start)
                range.setEnd(textNode, start + match[0].length)
                const fragmentCount = Array.from(range.getClientRects()).filter(
                  (rect) => rect.width > 0 && rect.height > 0,
                ).length

                wordFragments.push({ text: match[0], fragmentCount })
              }
            }

            return {
              clientWidth: element.clientWidth,
              overflowWrap: style.overflowWrap,
              scrollWidth: element.scrollWidth,
              whiteSpace: style.whiteSpace,
              wordFragments,
            }
          },
        )

        expect(metrics.whiteSpace).toBe('normal')
        expect(metrics.overflowWrap).toBe('anywhere')
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
        expect(
          metrics.wordFragments.filter(({ fragmentCount }) => fragmentCount !== 1),
          `${route} ${viewport.name} "${title}" should wrap only between words`,
        ).toEqual([])
      }

      const [scrollWidth, clientWidth] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ])
      expect(scrollWidth).toBe(clientWidth)

      await testInfo.attach(`course-series-${route === '/' ? 'home' : 'progress'}-${viewport.name}`, {
        body: await courses.screenshot(),
        contentType: 'image/png',
      })
    }
  }
})
