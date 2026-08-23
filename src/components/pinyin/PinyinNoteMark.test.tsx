import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PinyinNoteMark } from './PinyinNoteMark'

describe('PinyinNoteMark', () => {
  it('renders the ink line-art reference mark with its sizing class by default', () => {
    const { container } = render(<PinyinNoteMark />)

    const svg = container.querySelector('svg.pinyin-note-mark')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('data-testid', 'pinyin-note-mark')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the sizing class when an extra className is supplied', () => {
    const { container } = render(<PinyinNoteMark className="extra" />)

    const svg = container.querySelector('svg.pinyin-note-mark')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('extra')
  })
})
