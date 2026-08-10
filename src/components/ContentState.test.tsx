import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render } from '@testing-library/react'

import { ContentError, ContentLoading } from './ContentState'

describe('ContentState', () => {
  it('renders the branded loading state with an accessible status region', () => {
    const { container } = render(<ContentLoading />)

    expect(screen.getByRole('status')).toHaveTextContent('轻松学中文')
    expect(container.querySelector('.brand-loading__logo')).toBeInTheDocument()
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
