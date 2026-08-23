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

  it('renders 4 continuous ink lines = 8 rays (horizontal, vertical, both diagonals)', () => {
    const { container } = render(<PinyinNoteMark />)

    const svg = container.querySelector('svg.pinyin-note-mark')
    const paths = svg!.querySelectorAll('path')
    expect(paths).toHaveLength(4)

    const d = Array.from(paths).map((p) => p.getAttribute('d'))
    expect(d).toEqual([
      'M4 12h16',
      'M12 4v16',
      'M6.34 6.34 17.66 17.66',
      'M17.66 6.34 6.34 17.66',
    ])
  })
})
