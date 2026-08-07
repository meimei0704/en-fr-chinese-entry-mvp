import { expect, test, type Page } from 'playwright/test'

const pinyinProgressStorageKey = 'en-fr-chinese-entry-mvp.pinyin-progress.v1'
const courseProgressStorageKey = 'en-fr-chinese-entry-mvp.progress'

const correctToneChoices = [
  /First tone: high and level/,
  /Second tone: rising/,
  /Third tone: low dipping/,
  /Fourth tone: sharp falling/,
  /First tone: high and level/,
  /Third tone: low dipping/,
  /Second tone: rising/,
  /Third tone: low dipping/,
]

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

test('completes Pinyin Zone from the course entry with reference audio and tone game', async ({
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
  await expect(page.getByText('1 of 2 sections complete')).toBeVisible()

  for (const [index, choiceName] of correctToneChoices.entries()) {
    await expect(page.getByText(`Question ${index + 1} of ${correctToneChoices.length}`)).toBeVisible()
    await page.getByRole('radio', { name: choiceName }).check()
    await page.getByRole('button', { name: 'Submit answer' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Tone game result' })).toBeVisible()
  await expect(page.getByText('8/8')).toBeVisible()
  await expect(page.getByText('2 of 2 sections complete')).toBeVisible()

  const browserState = await page.evaluate(
    ([pinyinKey, courseKey]) => {
      return {
        courseProgress: localStorage.getItem(courseKey),
        pinyinProgress: JSON.parse(localStorage.getItem(pinyinKey) ?? '{}') as {
          completedSections?: string[]
          toneGameBestScore?: number
          toneGameLastScore?: number
        },
      }
    },
    [pinyinProgressStorageKey, courseProgressStorageKey] as const,
  )

  expect(browserState.pinyinProgress.completedSections).toEqual([
    'reference',
    'tone-game',
  ])
  expect(browserState.pinyinProgress.toneGameBestScore).toBe(8)
  expect(browserState.pinyinProgress.toneGameLastScore).toBe(8)
  expect(browserState.courseProgress).toBeNull()
})

test('renders three lesson tabs and switches between lessons preserving progress', async ({ page }) => {
  await installPinyinBrowserMocks(page)
  await page.goto('/pinyin')

  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(3)
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false')

  await page.getByRole('button', { name: 'Play bo' }).click()
  await expect(page.getByText('1 of 2 sections complete')).toBeVisible()

  await tabs.nth(1).click()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: 'Sibilant ear training' })).toBeVisible()

  await tabs.first().click()
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('1 of 2 sections complete')).toBeVisible()

  const browserState = await page.evaluate((key) => {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as {
      completedSections?: string[]
      lessonProgress?: Record<string, unknown>
    }
  }, pinyinProgressStorageKey)

  expect(browserState.completedSections).toContain('reference')
  expect(browserState.lessonProgress).toBeDefined()
  expect(browserState.lessonProgress?.['pinyin-foundations-1']).toBeDefined()
})
