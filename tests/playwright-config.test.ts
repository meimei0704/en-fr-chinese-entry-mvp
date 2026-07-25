import { describe, expect, it } from 'vitest'
import playwrightConfig from '../playwright.config'

const webServer = Array.isArray(playwrightConfig.webServer)
  ? playwrightConfig.webServer[0]
  : playwrightConfig.webServer

describe('Playwright default web server isolation', () => {
  it('does not reuse unrelated services on Vite preview port 4173', () => {
    expect(playwrightConfig.use?.baseURL).not.toBe('http://127.0.0.1:4173')
    expect(webServer?.url).not.toBe('http://127.0.0.1:4173')
    expect(webServer?.reuseExistingServer).toBe(false)
    expect(webServer?.command).toContain('--strictPort')
  })
})
