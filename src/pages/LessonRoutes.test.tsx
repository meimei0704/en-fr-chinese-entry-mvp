import '@testing-library/jest-dom/vitest'
import { cleanup, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

const newLessons = [
  {
    id: 'restaurant-order',
    lessonHeading: /order a simple meal/i,
  },
  {
    id: 'metro-ticket',
    lessonHeading: /buy a metro ticket/i,
  },
  {
    id: 'pharmacy-help',
    lessonHeading: /ask for help at a pharmacy/i,
  },
  {
    id: 'ask-for-help-problem',
    lessonHeading: /ask for help with a problem/i,
  },
  {
    id: 'train-station-ticket',
    lessonHeading: /buy a train station ticket/i,
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

    expect(screen.getByText(/question 1 of 5/i)).toBeVisible()
    expect(screen.getByLabelText(/^score 0$/i)).toBeVisible()
    expect(screen.queryByText(/we couldn’t find that practice set/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to lesson/i })).toHaveAttribute(
      'href',
      `/lesson/${lesson.id}`,
    )
  })
})
