import '@testing-library/jest-dom/vitest'
import { cleanup, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

const newLessons = [
  {
    id: 'restaurant-order',
    lessonHeading: /order a simple meal/i,
    practicePrompt: /menu and order beef noodles/i,
    shortInputPrompt: /order beef noodles without spice/i,
    target: '我要一碗牛肉面，不要辣。',
  },
  {
    id: 'metro-ticket',
    lessonHeading: /buy a metro ticket/i,
    practicePrompt: /metro ticket to people's square/i,
    shortInputPrompt: /ask how many stops/i,
    target: '要几站？',
  },
  {
    id: 'pharmacy-help',
    lessonHeading: /ask for help at a pharmacy/i,
    practicePrompt: /headache and no fever/i,
    shortInputPrompt: /say that your head hurts/i,
    target: '我头疼，不发烧。',
  },
  {
    id: 'ask-for-help-problem',
    lessonHeading: /ask for help with a problem/i,
    practicePrompt: /phone has a problem/i,
    shortInputPrompt: /ask someone to help you/i,
    target: '可以帮我一下吗？',
  },
  {
    id: 'train-station-ticket',
    lessonHeading: /buy a train station ticket/i,
    practicePrompt: /ticket to Shanghai/i,
    shortInputPrompt: /buy a ticket to Shanghai/i,
    target: '我想买一张去上海的票。',
  },
]

describe('expanded lesson routes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each(newLessons)('renders lesson, practice, and short-input routes for $id', (lesson) => {
    renderRoute(`/lesson/${lesson.id}`)

    expect(screen.getByRole('heading', { level: 1, name: lesson.lessonHeading })).toBeVisible()
    expect(screen.queryByText(/we couldn’t find that lesson/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to practice/i })).toHaveAttribute(
      'href',
      `/lesson/${lesson.id}/practice`,
    )

    cleanup()
    renderRoute(`/lesson/${lesson.id}/practice`)

    expect(screen.getByText(/listen and choose/i)).toBeVisible()
    expect(screen.getAllByText(lesson.practicePrompt)[0]).toBeVisible()
    expect(screen.queryByText(/we couldn’t find that practice set/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /continue to short input/i })).toHaveAttribute(
      'href',
      `/lesson/${lesson.id}/short-input`,
    )

    cleanup()
    renderRoute(`/lesson/${lesson.id}/short-input`)

    expect(screen.getAllByText(lesson.shortInputPrompt)[0]).toBeVisible()
    expect(screen.getAllByText(new RegExp(lesson.target))[0]).toBeVisible()
    expect(screen.queryByText(/we couldn’t find that final step/i)).not.toBeInTheDocument()
  })
})
