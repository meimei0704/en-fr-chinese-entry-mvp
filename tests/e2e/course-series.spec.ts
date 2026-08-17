import { expect, test, type Locator, type Page } from 'playwright/test'

const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'
const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'

const seriesCopy = {
  en: {
    label: 'Course series',
    pinyin: 'Mandarin tones and pinyin',
    journey: 'Useful sentences, expressions and Hanzi recognition',
    culture: 'Culture advice for travelers in China',
    pinyinProgress: '1 of 2 sections complete',
    journeyProgress: '1 of 12 lessons completed',
  },
  fr: {
    label: 'Séries de cours',
    pinyin: 'Tons et pinyin du mandarin',
    journey: 'Expressions chinoises essentielles pour voyager sereinement',
    culture: 'Conseils culturels pour les voyageurs en Chine',
    pinyinProgress: '1 section sur 2 terminée',
    journeyProgress: '1 leçon sur 12 terminée',
  },
} as const

type Language = keyof typeof seriesCopy

const pageCases = [
  {
    name: 'home',
    route: '/',
    pathId: 'home-basic-expressions-path',
    nodeSelector: '.journey-map__path > .journey-node',
  },
  {
    name: 'progress',
    route: '/progress',
    pathId: 'progress-basic-expressions-path',
    nodeSelector: '.progress-journey-map__path > .journey-node',
  },
] as const

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 720 },
] as const

const lessonHrefs = [
  '/lesson/daily-greetings',
  '/lesson/self-intro',
  '/lesson/ask-directions',
  '/lesson/order-food',
  '/lesson/phone-and-payment',
  '/lesson/restaurant-order',
  '/lesson/train-station-ticket',
  '/lesson/metro-ticket',
  '/lesson/convenience-store-run',
  '/lesson/ask-for-help-problem',
  '/lesson/pharmacy-help',
  '/lesson/small-talk',
] as const

const singleSectionPinyinProgress = {
  schemaVersion: 4,
  visited: true,
  completedSections: ['reference'],
  shadowingCompletedPromptIds: [],
  lastVisitedPromptId: null,
  moduleProgress: {
    initials: {
      visited: true,
      completedSections: ['reference'],
      shadowingCompletedPromptIds: [],
      lastVisitedPromptId: null,
    },
  },
} as const

function courseProgress(language: Language) {
  return {
    selectedExplanationLanguage: language,
    completedLessons: ['self-intro'],
    reviewQueue: [],
    lastVisitedLesson: 'self-intro',
    lessonStepProgress: {},
  }
}

async function seedProgress(page: Page, language: Language) {
  await page.addInitScript(
    ({ courseKey, learnerProgress, pinyinKey, pinyinProgress }) => {
      localStorage.setItem(courseKey, JSON.stringify(learnerProgress))
      localStorage.setItem(pinyinKey, JSON.stringify(pinyinProgress))
    },
    {
      courseKey: courseProgressStorageKey,
      learnerProgress: courseProgress(language),
      pinyinKey: pinyinProgressStorageKey,
      pinyinProgress: singleSectionPinyinProgress,
    },
  )
}

async function expectKeyboardFocusVisible(page: Page, link: Locator) {
  await link.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()

  const focusStyle = await link.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      outlineOffset: Number.parseFloat(style.outlineOffset),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })

  expect(focusStyle.outlineStyle).toBe('solid')
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3)
  expect(focusStyle.outlineOffset).toBeGreaterThanOrEqual(3)
}

for (const pageCase of pageCases) {
  for (const language of ['en', 'fr'] as const) {
    for (const viewport of viewports) {
      test(`${pageCase.name} ${language} ${viewport.name} keeps equal visible entry anchors`, async ({
        page,
      }, testInfo) => {
        const copy = seriesCopy[language]

        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await seedProgress(page, language)
        await page.goto(pageCase.route)

        const courses = page.getByRole('region', { name: copy.label })
        const list = courses.locator(':scope > .course-series__list')
        const pinyinSection = list.getByRole('region', { name: copy.pinyin })
        const cultureSection = list.getByRole('region', { name: copy.culture })
        const journeySection = list.getByRole('region', { name: copy.journey })
        const pinyinLink = pinyinSection.getByRole('link', { name: copy.pinyin })
        const cultureLink = cultureSection.getByRole('link', { name: copy.culture })
        const journeyLink = journeySection.getByRole('link', { name: copy.journey })
        const path = journeySection.locator(`#${pageCase.pathId}`)
        const journeyNodes = path.locator(pageCase.nodeSelector)
        const lessonLinks = path.locator('a[href^="/lesson/"]')

        await expect(list.locator(':scope > .course-series__panel')).toHaveCount(3)
        await expect(list.locator(':scope > .course-series__entry-card')).toHaveCount(0)
        await expect(courses.locator('.course-series__entry-card')).toHaveCount(3)
        await expect(pinyinLink).toHaveAttribute('href', '/pinyin')
        await expect(cultureLink).toHaveAttribute('href', '/culture')
        await expect(journeyLink).toHaveAttribute('href', `#${pageCase.pathId}`)
        await expect(pinyinLink).toHaveAccessibleName(copy.pinyin)
        await expect(cultureLink).toHaveAccessibleName(copy.culture)
        await expect(journeyLink).toHaveAccessibleName(copy.journey)
        await expect(path).toBeVisible()
        await expect(journeyNodes).toHaveCount(12)
        await expect(lessonLinks).toHaveCount(12)
        expect(await lessonLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
          .toEqual(lessonHrefs)

        const order = await list.evaluate((element, pathId) => {
          const panels = Array.from(element.children)
          const pinyin = element.querySelector('.course-series__pinyin-link')
          const culture = element.querySelector('.course-series__culture-link')
          const journey = element.querySelector('.course-series__journey-link')
          const pathElement = document.getElementById(pathId)

          if (!pinyin || !culture || !journey || !pathElement) {
            throw new Error('Missing course-series ordering target')
          }

          return {
            directPanelCount: panels.length,
            pinyinBeforeJourney: Boolean(
              pinyin.compareDocumentPosition(journey) & Node.DOCUMENT_POSITION_FOLLOWING,
            ),
            journeyBeforeCulture: Boolean(
              journey.compareDocumentPosition(culture) & Node.DOCUMENT_POSITION_FOLLOWING,
            ),
            journeyBeforePath: Boolean(
              journey.compareDocumentPosition(pathElement) & Node.DOCUMENT_POSITION_FOLLOWING,
            ),
          }
        }, pageCase.pathId)

        expect(order).toEqual({
          directPanelCount: 3,
          pinyinBeforeJourney: true,
          journeyBeforeCulture: true,
          journeyBeforePath: true,
        })

        const geometry = await list.evaluate((element, pathId) => {
          const pinyin = element.querySelector<HTMLElement>('.course-series__pinyin-link')
          const culture = element.querySelector<HTMLElement>('.course-series__culture-link')
          const journey = element.querySelector<HTMLElement>('.course-series__journey-link')
          const pinyinPanel = element.querySelector<HTMLElement>('.course-series__panel--pinyin')
          const culturePanel = element.querySelector<HTMLElement>('.course-series__panel--culture')
          const journeyPanel = element.querySelector<HTMLElement>('.course-series__panel--journey')
          const pathElement = document.getElementById(pathId)

          if (!pinyin || !culture || !journey || !pinyinPanel || !culturePanel || !journeyPanel || !pathElement) {
            throw new Error('Missing course-series geometry target')
          }

          const box = (target: Element) => {
            const rect = target.getBoundingClientRect()
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          }
          const rowSizes = window.getComputedStyle(element).gridTemplateRows
            .split(/\s+/u)
            .map((value) => Number.parseFloat(value))

          return {
            basic: box(journey),
            basicPanel: box(journeyPanel),
            culture: box(culture),
            culturePanel: box(culturePanel),
            list: box(element),
            path: box(pathElement),
            pinyin: box(pinyin),
            pinyinPanel: box(pinyinPanel),
            rowSizes,
          }
        }, pageCase.pathId)

        expect(geometry.rowSizes).toHaveLength(4)
        expect(Math.abs(geometry.rowSizes[0] - geometry.rowSizes[1])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.rowSizes[1] - geometry.rowSizes[3])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.x - geometry.culture.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.width - geometry.culture.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.culture.height)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.rowSizes[0])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.culture.height - geometry.rowSizes[3])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.height - geometry.rowSizes[1])).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.height - geometry.pinyinPanel.height)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.culture.height - geometry.culturePanel.height)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.x - geometry.list.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.x - geometry.list.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.pinyin.width - geometry.list.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.width - geometry.list.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.culture.y - geometry.culturePanel.y)).toBeLessThanOrEqual(1)
        expect(Math.abs(geometry.basic.y - geometry.basicPanel.y)).toBeLessThanOrEqual(1)
        expect(geometry.culture.y).toBeGreaterThanOrEqual(
          geometry.pinyin.y + geometry.pinyin.height,
        )
        expect(geometry.culture.y).toBeGreaterThanOrEqual(
          geometry.basic.y + geometry.basic.height,
        )
        expect(geometry.path.y).toBeGreaterThanOrEqual(geometry.basic.y + geometry.basic.height)

        for (const [title, link] of [
          [copy.pinyin, pinyinLink],
          [copy.culture, cultureLink],
          [copy.journey, journeyLink],
        ] as const) {
          const heading = courses.getByRole('heading', { level: 2, name: title })
          const metrics = await heading.evaluate((element) => {
            const card = element.closest<HTMLElement>('.course-series__entry-card')

            if (!card) {
              throw new Error('Missing title entry card')
            }

            const style = window.getComputedStyle(element)
            const tokens = Array.from(
              element.querySelectorAll<HTMLElement>('.course-series__title-token'),
              (token) => {
                const range = document.createRange()
                range.selectNodeContents(token)
                const fragmentCount = Array.from(range.getClientRects()).filter(
                  (rect) => rect.width > 0 && rect.height > 0,
                ).length

                return { fragmentCount, text: token.textContent }
              },
            )

            return {
              cardClientHeight: card.clientHeight,
              cardClientWidth: card.clientWidth,
              cardOverflow: window.getComputedStyle(card).overflow,
              cardScrollHeight: card.scrollHeight,
              cardScrollWidth: card.scrollWidth,
              clientHeight: element.clientHeight,
              clientWidth: element.clientWidth,
              hyphens: style.hyphens,
              overflowWrap: style.overflowWrap,
              scrollHeight: element.scrollHeight,
              scrollWidth: element.scrollWidth,
              text: element.textContent,
              tokens,
              whiteSpace: style.whiteSpace,
              wordBreak: style.wordBreak,
            }
          })

          expect(metrics.text).toBe(title)
          expect(metrics.tokens.map(({ text }) => text)).toEqual(title.split(/\s+/u))
          expect(metrics.tokens.filter(({ fragmentCount }) => fragmentCount !== 1)).toEqual([])
          expect(metrics.whiteSpace).toBe('normal')
          expect(metrics.overflowWrap).toBe('normal')
          expect(metrics.wordBreak).toBe('normal')
          expect(metrics.hyphens).toBe('none')
          expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
          expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1)
          expect(metrics.cardScrollWidth).toBeLessThanOrEqual(metrics.cardClientWidth + 1)
          expect(metrics.cardScrollHeight).toBeLessThanOrEqual(metrics.cardClientHeight + 1)
          expect(metrics.cardOverflow).toBe('visible')
          await expect(link).toHaveAccessibleName(title)
        }

        await expectKeyboardFocusVisible(page, pinyinLink)
        await expectKeyboardFocusVisible(page, cultureLink)
        await expectKeyboardFocusVisible(page, journeyLink)

        if (pageCase.name === 'home') {
          await expect(pinyinLink).not.toContainText(copy.pinyinProgress)
          await expect(cultureLink).not.toContainText(copy.journeyProgress)
          await expect(journeyLink).not.toContainText(copy.journeyProgress)
        } else {
          await expect(pinyinLink).toContainText(copy.pinyinProgress)
          await expect(journeyLink).toContainText(copy.journeyProgress)
          await expect(page.getByRole('region', { name: /learning indicators|indicateurs d’apprentissage/i }))
            .toContainText('1/12')
        }

        const [scrollWidth, clientWidth, supportsSubgrid] = await page.evaluate(() => [
          document.documentElement.scrollWidth,
          document.documentElement.clientWidth,
          CSS.supports('grid-template-rows', 'subgrid'),
        ])
        expect(scrollWidth).toBe(clientWidth)
        expect(supportsSubgrid).toBe(true)

        await testInfo.attach(
          `course-series-${pageCase.name}-${language}-${viewport.name}`,
          {
            body: await courses.screenshot(),
            contentType: 'image/png',
          },
        )
      })
    }
  }
}

for (const pageCase of pageCases) {
  test(`${pageCase.name} entry anchors keep native keyboard route and fragment behavior`, async ({
    page,
  }) => {
    const copy = seriesCopy.en

    await page.setViewportSize({ width: 390, height: 844 })
    await seedProgress(page, 'en')
    await page.goto(pageCase.route)

    const courses = page.getByRole('region', { name: copy.label })
    const journeyLink = courses.getByRole('link', { name: copy.journey })
    const path = courses.locator(`#${pageCase.pathId}`)

    await expect(path.locator(pageCase.nodeSelector)).toHaveCount(12)
    await expectKeyboardFocusVisible(page, journeyLink)
    await journeyLink.press('Enter')

    await expect.poll(() => new URL(page.url()).pathname).toBe(pageCase.route)
    await expect.poll(() => new URL(page.url()).hash).toBe(`#${pageCase.pathId}`)
    await expect(path).toBeVisible()
    await expect(path).not.toHaveAttribute('tabindex')
    await expect(path.locator(pageCase.nodeSelector)).toHaveCount(12)
    expect(await journeyLink.getAttribute('aria-expanded')).toBeNull()

    await page.goto(pageCase.route)
    const freshCourses = page.getByRole('region', { name: copy.label })
    const freshPinyinLink = freshCourses.getByRole('link', { name: copy.pinyin })

    await expectKeyboardFocusVisible(page, freshPinyinLink)
    await freshPinyinLink.press('Enter')
    await expect.poll(() => new URL(page.url()).pathname).toBe('/pinyin')
  })
}
