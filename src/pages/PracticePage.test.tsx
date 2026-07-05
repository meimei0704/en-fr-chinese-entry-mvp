import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderRoute } from '../test/renderRoute'

describe('PracticePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders listening, speaking, and reading practice in the practice view', () => {
    renderRoute('/lesson/self-intro/practice')

    expect(screen.getByText(/listen and choose/i)).toBeVisible()
    expect(screen.getByText(/repeat aloud/i)).toBeVisible()
    expect(screen.getByText(/match the hanzi/i)).toBeVisible()
  })
})
