import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CultureAdvice } from './CultureAdvice'

const sectionTitles = [
  'General Social Tips',
  'Dining Etiquette',
  'Conversation Guidelines',
  "Visiting Someone's Home",
  'Public Conduct and Behaviour',
  'Visiting Temples & Cultural Sites',
  'Number Superstitions & Symbolism',
]

describe('CultureAdvice', () => {
  it('renders the section title and all 7 collapsed part headings', () => {
    render(<CultureAdvice language="en" />)

    expect(
      screen.getByRole('region', { name: 'Culture advice for travelers in China' }),
    ).toBeInTheDocument()

    for (const title of sectionTitles) {
      const toggle = screen.getByRole('button', { name: title })
      expect(toggle).toBeInTheDocument()
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('collapses content by default and expands on click', async () => {
    const user = userEvent.setup()
    render(<CultureAdvice language="en" />)

    const toggle = screen.getByRole('button', { name: 'General Social Tips' })
    expect(screen.queryByText(/Address people by their title plus family name/)).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText(/Address people by their title plus family name/)).not.toBeInTheDocument()
  })

  it('allows multiple parts to be open at once', async () => {
    const user = userEvent.setup()
    render(<CultureAdvice language="en" />)

    await user.click(screen.getByRole('button', { name: 'General Social Tips' }))
    await user.click(screen.getByRole('button', { name: 'Dining Etiquette' }))

    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()
    expect(screen.getByText(/Do not start eating until the host/)).toBeInTheDocument()
  })

  it('renders bold lead-ins and nested sub-items in General Social Tips', async () => {
    const user = userEvent.setup()
    const { container } = render(<CultureAdvice language="en" />)

    await user.click(screen.getByRole('button', { name: 'General Social Tips' }))

    const formalLead = screen.getByText('For formal visits:')
    expect(formalLead.tagName).toBe('STRONG')
    expect(screen.getByText(/Address people by their title plus family name/)).toBeInTheDocument()

    const clocksLead = screen.getByText('Clocks:')
    expect(clocksLead.tagName).toBe('STRONG')
    expect(screen.getByText(/The phrase for "giving a clock"/)).toBeInTheDocument()

    const sublist = container.querySelector('.culture-advice__subitems')
    expect(sublist).not.toBeNull()
  })

  it('renders bold 8/6/4 in Number Superstitions with the intro line', async () => {
    const user = userEvent.setup()
    render(<CultureAdvice language="en" />)

    await user.click(screen.getByRole('button', { name: 'Number Superstitions & Symbolism' }))

    expect(
      screen.getByText('Certain numbers carry cultural associations due to Chinese homophones:'),
    ).toBeInTheDocument()
    expect(screen.getByText('8:').tagName).toBe('STRONG')
    expect(screen.getByText('6:').tagName).toBe('STRONG')
    expect(screen.getByText('4:').tagName).toBe('STRONG')
    expect(screen.getByText(/Represents wealth, prosperity and good luck/)).toBeInTheDocument()
  })

  it('switches to French placeholder copy', () => {
    render(<CultureAdvice language="fr" />)

    expect(
      screen.getByRole('region', {
        name: 'Conseils culturels pour les voyageurs en Chine',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Conseils sociaux généraux' })).toBeInTheDocument()
  })
})
