import { expect, test, type Page } from 'playwright/test'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

async function installPinyinBrowserMocks(page: Page) {
  await page.addInitScript(() => {
    const state = window as typeof window & {
      __pinyinPlayedAudioSources: string[]
    }

    state.__pinyinPlayedAudioSources = []

    class SpyAudio {
      currentTime = 0
      src: string

      constructor(src = '') {
        this.src = src
        if (src) {
          state.__pinyinPlayedAudioSources.push(src)
        }
      }

      addEventListener() {}
      pause() {}
      play() {
        return Promise.resolve()
      }
    }

    Object.defineProperty(window, 'Audio', {
      configurable: true,
      value: SpyAudio,
    })
  })
}

async function finishPracticeChallenge(page: Page) {
  for (let step = 0; step < 12; step += 1) {
    const resultVisible = await page
      .getByText('Challenge complete')
      .isVisible()
      .catch(() => false)
    if (resultVisible) {
      return
    }

    await page.locator('.option-button').first().click()

    const nextButton = page.getByRole('button', { name: 'Next question' })
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click()
    }
  }
}

test('completes Pinyin Zone from the course entry with reference audio and practice challenge', async ({
  page,
}) => {
  await installPinyinBrowserMocks(page)
  await page.goto('/')

  const pinyinEntry = page.getByRole('link', { name: 'Mandarin tones and pinyin' })

  await expect(pinyinEntry).toHaveAttribute('href', '/pinyin')
  await pinyinEntry.click()
  await expect(page).toHaveURL(/\/pinyin$/)
  await expect(page.getByRole('heading', { name: 'Pinyin（零基础第一课）' })).toBeVisible()

  await page.getByRole('button', { name: 'Play bo' }).click()
  await expect
    .poll(() =>
      page.evaluate(() => {
        const state = window as typeof window & { __pinyinPlayedAudioSources: string[] }
        return state.__pinyinPlayedAudioSources
      }),
    )
    .toContain('/audio/pinyin/lesson-1/reference-initial-b.mp3')

  await page.getByRole('link', { name: 'Go to practice' }).click()
  await expect(page).toHaveURL(/\/pinyin\/practice/)
  await expect(page.getByRole('heading', { level: 1, name: 'Initials' })).toBeVisible()

  await finishPracticeChallenge(page)

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
  expect(browserState.pinyinProgress.completedSections).toContain('practice')
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

  await page.getByRole('button', { name: 'Play bo' }).click()

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
