import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CourseSeriesTitle } from './CourseSeriesTitle'

const titles = [
  {
    id: 'english-course-series-title',
    title: 'Basic Chinese expressions for a stress-free journey',
    tokens: ['Basic', 'Chinese', 'expressions', 'for', 'a', 'stress-free', 'journey'],
  },
  {
    id: 'french-course-series-title',
    title: 'Expressions chinoises essentielles pour voyager sereinement',
    tokens: ['Expressions', 'chinoises', 'essentielles', 'pour', 'voyager', 'sereinement'],
  },
] as const

describe('CourseSeriesTitle', () => {
  it.each(titles)('preserves exact text and accessible meaning for $id', ({ id, title, tokens }) => {
    const { container } = render(<CourseSeriesTitle id={id} title={title} />)
    const heading = screen.getByRole('heading', { level: 2, name: title })
    const tokenElements = Array.from(
      heading.querySelectorAll<HTMLElement>('.course-series__title-token'),
    )

    expect(heading).toHaveAttribute('id', id)
    expect(heading).toHaveClass('course-series__title')
    expect(heading.textContent).toBe(title)
    expect(Array.from(heading.childNodes, (node) => node.textContent)).toEqual(
      title.split(/(\s+)/u),
    )
    expect(tokenElements.map((token) => token.textContent)).toEqual(tokens)
    expect(container.querySelectorAll('.course-series__title-token:empty')).toHaveLength(0)

    for (const token of tokenElements) {
      expect(token).not.toHaveAttribute('aria-label')
      expect(token).not.toHaveAttribute('aria-hidden')
      expect(token).not.toHaveAttribute('role')
    }
  })
})
