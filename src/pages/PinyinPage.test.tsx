import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

describe('PinyinPage', () => {
  it('renders the pinyin route shell', () => {
    renderRoute('/pinyin')

    expect(screen.getByRole('heading', { level: 1, name: /pinyin/i })).toBeVisible()
  })
})
