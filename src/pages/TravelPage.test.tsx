import '@testing-library/jest-dom/vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { getUiCopy } from '../content/copy'
import { createDefaultProgress, saveProgress } from '../lib/progress'
import { renderRoute } from '../test/renderRoute'

const copy = getUiCopy('en').travel
const frCopy = getUiCopy('fr').travel

describe('TravelPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the heading and the request form by default', () => {
    renderRoute('/travel')

    expect(screen.getByRole('heading', { level: 1, name: copy.heading })).toBeVisible()
    expect(screen.getByRole('button', { name: copy.form.generate })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: copy.result.summaryHeading }),
    ).not.toBeInTheDocument()
  })

  it('renders an itinerary after submitting a valid request', async () => {
    const user = userEvent.setup()
    renderRoute('/travel')

    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(screen.getByRole('heading', { name: copy.result.summaryHeading })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Day 1' })).toBeInTheDocument()
    expect(screen.getAllByText(copy.result.verifyOfficial).length).toBeGreaterThanOrEqual(1)
  })

  it('shows an inline error and no itinerary for invalid input', async () => {
    const user = userEvent.setup()
    renderRoute('/travel')
    const days = screen.getByLabelText(copy.form.daysLabel)

    await user.clear(days)
    await user.type(days, '0')
    await user.click(screen.getByRole('button', { name: copy.form.generate }))

    expect(screen.getByRole('alert')).toHaveTextContent(copy.validation.daysOutOfRange)
    expect(
      screen.queryByRole('heading', { name: copy.result.summaryHeading }),
    ).not.toBeInTheDocument()
  })

  it('switches form and itinerary labels when the language toggle changes', async () => {
    const user = userEvent.setup()
    renderRoute('/travel')

    await user.click(screen.getByRole('button', { name: 'Français' }))
    expect(screen.getByRole('button', { name: frCopy.form.generate })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: frCopy.form.generate }))
    expect(screen.getByRole('heading', { name: frCopy.result.summaryHeading })).toBeVisible()
  })

  it('renders the page heading in French when the explanation language is French', () => {
    saveProgress({ ...createDefaultProgress(), selectedExplanationLanguage: 'fr' })
    renderRoute('/travel')

    expect(screen.getByRole('heading', { level: 1, name: frCopy.heading })).toBeVisible()
    expect(screen.getByRole('button', { name: frCopy.form.generate })).toBeInTheDocument()
  })

  it('marks the Travel nav link active on /travel', () => {
    renderRoute('/travel')

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Travel' })).toHaveClass(
      'site-header__link--active',
    )
  })
})
