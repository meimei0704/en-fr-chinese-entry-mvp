import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render } from '@testing-library/react'

import { ContentError, ContentLoading } from './ContentState'

describe('ContentState', () => {
  it('renders the loading state in English by default', () => {
    render(<ContentLoading />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading the course…')
  })

  it('renders the loading state in French when requested', () => {
    render(<ContentLoading language="fr" />)

    expect(screen.getByRole('status')).toHaveTextContent('Chargement du cours…')
  })

  it('renders the error state with a working retry button', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ContentError onRetry={onRetry} />)

    expect(screen.getByText("We couldn’t load the course.")).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
