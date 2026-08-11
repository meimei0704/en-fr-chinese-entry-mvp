import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { JourneyNodeCourseImage } from './JourneyNodeCourseImage'

describe('JourneyNodeCourseImage', () => {
  it('renders the course image for the stamp slot', () => {
    const { container } = render(<JourneyNodeCourseImage src="/images/course/course-01.png" fallback="👋" />)

    expect(container.querySelector('.journey-node__course-image')).toHaveAttribute(
      'src',
      '/images/course/course-01.png',
    )
    expect(container.querySelector('.journey-node__course-image')).toHaveAttribute('alt', '')
    expect(container.querySelector('.journey-node__doodle--fallback')).not.toBeInTheDocument()
  })

  it('falls back to the emoji icon when the image fails to load', () => {
    const { container } = render(<JourneyNodeCourseImage src="/missing/course.png" fallback="👋" />)

    const image = container.querySelector('.journey-node__course-image')
    expect(image).not.toBeNull()

    fireEvent.error(image!)

    expect(container.querySelector('.journey-node__course-image')).not.toBeInTheDocument()
    expect(container.querySelector('.journey-node__doodle--fallback')).toHaveTextContent('👋')
  })
})
