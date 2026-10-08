import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { getUiCopy } from '../../content/copy'
import { DEFAULT_TRAVEL_REQUEST } from '../../lib/travel/request'
import { TravelRequestForm } from './TravelRequestForm'

const copy = getUiCopy('en').travel

function setup() {
  const onGenerate = vi.fn()
  render(<TravelRequestForm onGenerate={onGenerate} />)
  return { onGenerate, user: userEvent.setup() }
}

describe('TravelRequestForm', () => {
  it('renders labelled controls with a valid default', () => {
    setup()

    expect(screen.getByRole('group', { name: copy.form.destinationsLabel })).toBeInTheDocument()
    expect(screen.getByLabelText(copy.form.daysLabel)).toHaveValue(5)
    expect(screen.getByRole('group', { name: copy.form.interestsLabel })).toBeInTheDocument()
    expect(screen.getByLabelText(copy.form.paceLabel)).toHaveValue('standard')
    expect(screen.getByLabelText(copy.form.budgetLabel)).toHaveValue('mid')
    expect(screen.getByRole('button', { name: 'Beijing' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Xi’an' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: copy.form.generate })).toBeInTheDocument()
  })

  it('submits the default request when it is valid', async () => {
    const { onGenerate, user } = setup()

    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(onGenerate).toHaveBeenCalledTimes(1)
    expect(onGenerate).toHaveBeenCalledWith(DEFAULT_TRAVEL_REQUEST)
  })

  it('shows an inline error for an out-of-range trip length and does not generate', async () => {
    const { onGenerate, user } = setup()
    const days = screen.getByLabelText(copy.form.daysLabel)

    await user.clear(days)
    await user.type(days, '0')
    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(screen.getByRole('alert')).toHaveTextContent(copy.validation.daysOutOfRange)
    expect(onGenerate).not.toHaveBeenCalled()
  })

  it('shows an inline error when no destination is selected', async () => {
    const { onGenerate, user } = setup()

    await user.click(screen.getByRole('button', { name: 'Beijing' }))
    await user.click(screen.getByRole('button', { name: 'Xi’an' }))
    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(screen.getByRole('alert')).toHaveTextContent(copy.validation.noDestinations)
    expect(onGenerate).not.toHaveBeenCalled()
  })

  it('shows an inline error when the trip is shorter than the number of destinations', async () => {
    const { onGenerate, user } = setup()
    const days = screen.getByLabelText(copy.form.daysLabel)

    await user.clear(days)
    await user.type(days, '1')
    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(screen.getByRole('alert')).toHaveTextContent(copy.validation.daysBelowDestinations)
    expect(onGenerate).not.toHaveBeenCalled()
  })

  it('switches the form labels when the language toggle changes', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Français' }))

    expect(
      screen.getByRole('button', { name: getUiCopy('fr').travel.form.generate }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(getUiCopy('fr').travel.form.daysLabel)).toBeInTheDocument()
  })
})
