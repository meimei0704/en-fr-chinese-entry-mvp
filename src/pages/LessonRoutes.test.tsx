import '@testing-library/jest-dom/vitest'
import { cleanup, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

const upgradedLessons = [
  {
    id: 'phone-and-payment',
    lessonHeading: /phone number & mobile payment setup/i,
    practicePrompt: /phone payment is possible/i,
    shortInputPrompt: /whether you can pay by phone/i,
    target: '可以用手机支付吗？',
  },
  {
    id: 'convenience-store-run',
    lessonHeading: /first convenience store run/i,
    practicePrompt: /bottle of water/i,
    shortInputPrompt: /buy a bottle of water/i,
    target: '我要一瓶水。',
  },
]

describe('upgraded lesson routes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each(upgradedLessons)('renders lesson, practice, and short-input routes for $id', (lesson) => {
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
