import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { render } from '@testing-library/react'

import { ContentError, ContentLoading } from './ContentState'

function renderError(props: { language?: 'en' | 'fr'; onRetry: () => void }) {
  return render(
    <MemoryRouter>
      <ContentError {...props} />
    </MemoryRouter>,
  )
}

describe('ContentState', () => {
  it('renders the branded loading state with an accessible status region', () => {
    const { container } = render(<ContentLoading />)

    expect(screen.getByRole('status')).toHaveTextContent('轻松学中文')
    expect(container.querySelector('.brand-loading__logo')).toBeInTheDocument()
  })

  it('renders the error state with a working retry button', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    renderError({ onRetry })

    expect(screen.getByText("We couldn’t load the course.")).toBeVisible()
    expect(screen.getByText('Check your connection and try again.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/home')
    expect(screen.getByAltText('')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders the error state in French copy when requested', () => {
    renderError({ language: 'fr', onRetry: vi.fn() })

    expect(screen.getByText('Impossible de charger le cours.')).toBeVisible()
    expect(screen.getByText('Vérifie ta connexion puis réessaie.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Retour à l’accueil' })).toHaveAttribute('href', '/home')
  })
})
