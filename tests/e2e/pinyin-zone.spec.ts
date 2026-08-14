import { expect, test, type Page } from 'playwright/test'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const syllableIntroCopy = {
  en: {
    description:
      'A complete Pinyin syllable typically consists of three main components: the Initial, the Final, and the Tone.',
    figureLabel:
      'Pinyin syllable composition example: mā consists of initial m, final a, and the first-tone mark.',
    labels: ['Pinyin', 'Initial', 'Final', 'Tone'],
  },
  fr: {
    description:
      'Une syllabe pinyin complète se compose généralement de trois éléments principaux : l’initiale, la finale et le ton.',
    figureLabel:
      'Exemple de composition d’une syllabe pinyin : mā se compose de l’initiale m, de la finale a et de la marque du premier ton.',
    labels: ['Pinyin', 'Initiale', 'Finale', 'Ton'],
  },
} as const

type IntroLanguage = keyof typeof syllableIntroCopy

const introViewports = [
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 720 },
] as const

async function seedExplanationLanguage(page: Page, language: IntroLanguage) {
  await page.addInitScript(
    ({ key, selectedExplanationLanguage }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          selectedExplanationLanguage,
          completedLessons: [],
          reviewQueue: [],
          lastVisitedLesson: null,
          lessonStepProgress: {},
        }),
      )
    },
    {
      key: courseProgressStorageKey,
      selectedExplanationLanguage: language,
    },
  )
}

async function installPinyinBrowserMocks(page: Page) {
  await page.addInitScript(() => {
    const state = window as typeof window & {
      __pinyinPlayedAudioSources: string[]
    }

    state.__pinyinPlayedAudioSources = []

    class SpyAudio {
      currentTime = 0
      private _src: string

      constructor(src = '') {
        this._src = src
        if (src) {
          state.__pinyinPlayedAudioSources.push(src)
        }
      }

      get src() {
        return this._src
      }

      set src(value: string) {
        this._src = value
        if (value) {
          state.__pinyinPlayedAudioSources.push(value)
        }
      }

      addEventListener() {}
      getAttribute(attribute: string) {
        return attribute === 'src' ? this._src : null
      }
      load() {}
      pause() {}
      play() {
        return Promise.resolve()
      }
      removeAttribute() {}
      setAttribute(attribute: string, value: string) {
        if (attribute === 'src') {
          this._src = value
          state.__pinyinPlayedAudioSources.push(value)
        }
      }
    }

    Object.defineProperty(window, 'Audio', {
      configurable: true,
      value: SpyAudio,
    })
  })
}

test('completes Pinyin Zone from the course entry with reference audio', async ({
  page,
}) => {
  await installPinyinBrowserMocks(page)
  await page.goto('/')

  const pinyinEntry = page.getByRole('link', { name: 'Mandarin tones and pinyin' })

  await expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  await pinyinEntry.click()
  await expect(page).toHaveURL(/\/pinyin$/)
  await expect(
    page.getByRole('heading', { name: 'Pinyin（Mandarin Phonetic System）' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Play bā' }).click()
  await expect
    .poll(() =>
      page.evaluate(() => {
        const state = window as typeof window & { __pinyinPlayedAudioSources: string[] }
        return state.__pinyinPlayedAudioSources
      }),
    )
    .toContain('/audio/pinyin/lesson-1/reference-initial-b.mp3')

  const browserState = await page.evaluate(
    ([pinyinKey, courseKey]) => {
      return {
        courseProgress: localStorage.getItem(courseKey),
        pinyinProgress: JSON.parse(localStorage.getItem(pinyinKey) ?? '{}') as {
          completedSections?: string[]
          moduleProgress?: Record<string, unknown>
        },
      }
    },
    [pinyinProgressStorageKey, courseProgressStorageKey] as const,
  )

  expect(browserState.pinyinProgress.completedSections).toContain('reference')
  expect(browserState.pinyinProgress.moduleProgress?.['initials']).toBeDefined()
  expect(browserState.courseProgress).toBeNull()
})

test('renders four module tabs and switches between modules preserving progress', async ({ page }) => {
  await installPinyinBrowserMocks(page)
  await page.goto('/pinyin')

  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(4)
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false')

  await page.getByRole('button', { name: 'Play bā' }).click()

  await tabs.nth(2).click()
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { level: 2, name: 'Tones' })).toBeVisible()

  await tabs.first().click()
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')

  const browserState = await page.evaluate((key) => {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as {
      completedSections?: string[]
      moduleProgress?: Record<string, unknown>
    }
  }, pinyinProgressStorageKey)

  expect(browserState.completedSections).toContain('reference')
  expect(browserState.moduleProgress).toBeDefined()
  expect(browserState.moduleProgress?.['initials']).toBeDefined()
})

for (const moduleName of ['Initials', 'Finals', 'Tones', 'Whole Syllables']) {
  test(`keeps ${moduleName} cards hanzi-free and equal-sized`, async ({ page }) => {
    await page.goto('/pinyin')

    await page.getByRole('tab', { name: new RegExp(moduleName) }).click()

    const cards = page.getByTestId('pinyin-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    const sizes = await cards.evaluateAll((els) =>
      els.map((el) => {
        const rect = el.getBoundingClientRect()
        return { width: Math.round(rect.width), height: Math.round(rect.height) }
      }),
    )

    const hanziInCards = await cards.evaluateAll((els) =>
      els.map((el) => el.textContent?.match(/[\u4e00-\u9fff]/g)?.length ?? 0),
    )

    expect(sizes.map((s) => s.width)).toEqual(Array(count).fill(sizes[0].width))
    expect(sizes.map((s) => s.height)).toEqual(Array(count).fill(sizes[0].height))
    expect(hanziInCards.every((n) => n === 0)).toBe(true)

    const grid = cards.first().locator('xpath=..')
    const gridBox = (await grid.boundingBox())!
    const firstBox = (await cards.first().boundingBox())!
    expect(Math.abs(firstBox.x - gridBox.x)).toBeLessThanOrEqual(1)
  })
}

for (const language of ['en', 'fr'] as const) {
  for (const viewport of introViewports) {
    test(`renders the localized syllable composition intro in ${language} at ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      const copy = syllableIntroCopy[language]

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await seedExplanationLanguage(page, language)
      await page.goto('/pinyin')

      const figure = page.getByRole('figure', { name: copy.figureLabel })

      await expect(figure).toHaveCount(1)
      await expect(figure).toContainText(copy.description)
      for (const label of copy.labels) {
        await expect(figure.getByText(label, { exact: true })).toBeVisible()
      }
      for (const value of ['mā', '妈', 'm', 'a', '¯']) {
        await expect(figure.getByText(value, { exact: true })).toBeVisible()
      }

      const metrics = await figure.evaluate((element) => {
        const heroElement = element.previousElementSibling
        const tabsElement = element.nextElementSibling
        const diagram = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__diagram',
        )
        const example = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__example',
        )
        const arrow = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__arrow',
        )
        const composition = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__composition',
        )
        const parts = element.querySelector<HTMLElement>(
          '.pinyin-syllable-intro__parts',
        )

        if (
          !heroElement ||
          !tabsElement ||
          !diagram ||
          !example ||
          !arrow ||
          !composition ||
          !parts
        ) {
          throw new Error('Missing Pinyin syllable intro geometry target')
        }

        const box = (target: Element) => {
          const rect = target.getBoundingClientRect()
          return {
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
          }
        }
        const textFits = Array.from(
          element.querySelectorAll<HTMLElement>(
            'figcaption, .pinyin-syllable-intro__pinyin, .pinyin-syllable-intro__hanzi, .pinyin-syllable-intro__heading, dt, dd',
          ),
          (target) =>
            target.scrollWidth <= target.clientWidth + 1 &&
            target.scrollHeight <= target.clientHeight + 1,
        )

        return {
          arrow: box(arrow),
          arrowTransform: window.getComputedStyle(arrow).transform,
          cardClientWidth: element.clientWidth,
          cardScrollWidth: element.scrollWidth,
          composition: box(composition),
          directOrder:
            heroElement.classList.contains('pinyin-hero') &&
            tabsElement.classList.contains('pinyin-lesson-tabs'),
          documentClientWidth: document.documentElement.clientWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          example: box(example),
          partColumns: window.getComputedStyle(parts).gridTemplateColumns,
          textFits,
        }
      })

      expect(metrics.directOrder).toBe(true)
      expect(metrics.documentScrollWidth).toBe(metrics.documentClientWidth)
      expect(metrics.cardScrollWidth).toBeLessThanOrEqual(
        metrics.cardClientWidth + 1,
      )
      expect(metrics.textFits.every(Boolean)).toBe(true)

      if (viewport.width > 640) {
        expect(metrics.example.right).toBeLessThanOrEqual(metrics.arrow.left + 1)
        expect(metrics.arrow.right).toBeLessThanOrEqual(
          metrics.composition.left + 1,
        )
        expect(metrics.arrowTransform).toBe('none')
      } else {
        expect(metrics.example.bottom).toBeLessThanOrEqual(metrics.arrow.top + 1)
        expect(metrics.arrow.bottom).toBeLessThanOrEqual(
          metrics.composition.top + 1,
        )
        expect(metrics.arrowTransform).not.toBe('none')
      }

      const partColumnCount = metrics.partColumns
        .split(/\s+/u)
        .filter(Boolean).length
      expect(partColumnCount).toBe(viewport.width <= 360 ? 1 : 3)

      await testInfo.attach(
        `pinyin-syllable-intro-${language}-${viewport.name}`,
        {
          body: await figure.screenshot(),
          contentType: 'image/png',
        },
      )
    })
  }
}
