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
      __pinyinLocalRecordingUrls: string[]
      __pinyinRevokedRecordingUrls: string[]
      __pinyinGetUserMediaCalls: MediaStreamConstraints[]
      __pinyinStoppedTrackCount: number
    }

    state.__pinyinPlayedAudioSources = []
    state.__pinyinLocalRecordingUrls = []
    state.__pinyinRevokedRecordingUrls = []
    state.__pinyinGetUserMediaCalls = []
    state.__pinyinStoppedTrackCount = 0

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

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value(blob: Blob) {
        const url = `blob:pinyin-local-shadowing-${state.__pinyinLocalRecordingUrls.length}`
        state.__pinyinLocalRecordingUrls.push(`${url}:${blob.size}:${blob.type}`)
        return url
      },
    })

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value(url: string) {
        state.__pinyinRevokedRecordingUrls.push(url)
      },
    })

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: async (constraints: MediaStreamConstraints) => {
          state.__pinyinGetUserMediaCalls.push(constraints)

          return {
            getTracks: () => [
              {
                stop: () => {
                  state.__pinyinStoppedTrackCount += 1
                },
              },
            ],
          }
        },
      },
    })

    class MockMediaRecorder {
      ondataavailable: ((event: BlobEvent) => void) | null = null
      onerror: (() => void) | null = null
      onstop: (() => void) | null = null

      start() {}

      stop() {
        this.ondataavailable?.({
          data: new Blob(['local shadowing audio'], { type: 'audio/webm' }),
        } as BlobEvent)
        this.onstop?.()
      }
    }

    Object.defineProperty(window, 'MediaRecorder', {
      configurable: true,
      value: MockMediaRecorder,
    })
  })
}

test('completes Pinyin Zone from the course entry with reference audio, tone game, and local-only shadowing', async ({
  page,
}) => {
  const unexpectedRecordingRequests: string[] = []

  page.on('request', (request) => {
    const path = new URL(request.url()).pathname

    if (path.startsWith('/api') || path.startsWith('/voice') || path.includes('upload')) {
      unexpectedRecordingRequests.push(path)
    }
  })

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
  await expect(page.getByText('1 of 3 sections complete')).toBeVisible()

  for (const [index, choiceName] of correctToneChoices.entries()) {
    await expect(page.getByText(`Question ${index + 1} of ${correctToneChoices.length}`)).toBeVisible()
    await page.getByRole('radio', { name: choiceName }).check()
    await page.getByRole('button', { name: 'Submit answer' }).click()
  }

  await expect(page.getByRole('heading', { name: 'Tone game result' })).toBeVisible()
  await expect(page.getByText('8/8')).toBeVisible()
  await expect(page.getByText('2 of 3 sections complete')).toBeVisible()

  for (let promptNumber = 1; promptNumber <= 5; promptNumber += 1) {
    await expect(page.getByText(`Prompt ${promptNumber} of 5`)).toBeVisible()
    await page.getByRole('button', { name: `Play shadowing prompt ${promptNumber}` }).click()
    await page.getByRole('button', { name: 'Start recording' }).click()
    await expect(page.getByText('Recording…')).toBeVisible()
    await page.getByRole('button', { name: 'Stop recording' }).click()
    await expect(page.getByLabel('Your recording')).toBeVisible()

    if (promptNumber < 5) {
      await page.getByRole('button', { name: 'Next prompt' }).click()
    }
  }

  await expect(page.getByText('Shadowing section complete.')).toBeVisible()
  await expect(page.getByText('3 of 3 sections complete')).toBeVisible()

  const browserState = await page.evaluate(
    ([pinyinKey, courseKey]) => {
      const state = window as typeof window & {
        __pinyinGetUserMediaCalls: MediaStreamConstraints[]
        __pinyinLocalRecordingUrls: string[]
        __pinyinPlayedAudioSources: string[]
        __pinyinStoppedTrackCount: number
      }

      return {
        courseProgress: localStorage.getItem(courseKey),
        getUserMediaCalls: state.__pinyinGetUserMediaCalls,
        localRecordingUrls: state.__pinyinLocalRecordingUrls,
        pinyinProgress: JSON.parse(localStorage.getItem(pinyinKey) ?? '{}') as {
          completedSections?: string[]
          shadowingCompletedPromptIds?: string[]
          toneGameBestScore?: number
          toneGameLastScore?: number
        },
        playedAudioSources: state.__pinyinPlayedAudioSources,
        stoppedTrackCount: state.__pinyinStoppedTrackCount,
      }
    },
    [pinyinProgressStorageKey, courseProgressStorageKey] as const,
  )

  expect(browserState.pinyinProgress.completedSections).toEqual([
    'reference',
    'tone-game',
    'shadowing',
  ])
  expect(browserState.pinyinProgress.shadowingCompletedPromptIds).toHaveLength(5)
  expect(browserState.pinyinProgress.toneGameBestScore).toBe(8)
  expect(browserState.pinyinProgress.toneGameLastScore).toBe(8)
  expect(browserState.courseProgress).toBeNull()
  expect(browserState.playedAudioSources).toContain('/audio/pinyin/lesson-1/reference-initial-b.mp3')
  expect(browserState.playedAudioSources).toContain('/audio/pinyin/lesson-1/shadow-ni-hao.mp3')
  expect(browserState.getUserMediaCalls).toEqual([
    { audio: true },
    { audio: true },
    { audio: true },
    { audio: true },
    { audio: true },
  ])
  expect(browserState.localRecordingUrls).toHaveLength(5)
  expect(browserState.stoppedTrackCount).toBe(5)
  expect(unexpectedRecordingRequests).toEqual([])
})

test('renders four lesson tabs and switches between lessons preserving progress', async ({ page }) => {
  await installPinyinBrowserMocks(page)
  await page.goto('/pinyin')

  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(4)
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false')

  await page.getByRole('button', { name: 'Play bo' }).click()
  await expect(page.getByText('1 of 3 sections complete')).toBeVisible()

  await tabs.nth(1).click()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('heading', { name: 'Sibilant ear training' })).toBeVisible()

  await tabs.first().click()
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('1 of 3 sections complete')).toBeVisible()

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
