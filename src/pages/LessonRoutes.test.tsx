import '@testing-library/jest-dom/vitest'
import { cleanup, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

const newLessons = [
  {
    id: 'restaurant-order',
    lessonHeading: /点餐\s+Order a meal/i,
  },
  {
    id: 'metro-ticket',
    lessonHeading: /坐地铁\s+Subway ride/i,
  },
  {
    id: 'pharmacy-help',
    lessonHeading: /买药，看医生\s+Hospital and pharmacy/i,
  },
  {
    id: 'ask-for-help-problem',
    lessonHeading: /寻求帮助\s+Ask for help/i,
  },
  {
    id: 'train-station-ticket',
    lessonHeading: /坐火车\s+Take the train/i,
  },
]

describe('expanded lesson routes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each(newLessons)('renders lesson and practice routes for $id', (lesson) => {
    renderRoute(`/lesson/${lesson.id}`)

    expect(screen.getByRole('heading', { level: 1, name: lesson.lessonHeading })).toBeVisible()
    expect(screen.queryByText(/we couldn’t find that lesson/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to practice/i })).toHaveAttribute(
      'href',
      `/lesson/${lesson.id}/practice`,
    )

    cleanup()
    renderRoute(`/lesson/${lesson.id}/practice`)

    expect(screen.queryByText(/question 1 of 5/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^score 0$/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/we couldn’t find that practice set/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to lesson/i })).toHaveAttribute(
      'href',
      `/lesson/${lesson.id}`,
    )
  })
})
