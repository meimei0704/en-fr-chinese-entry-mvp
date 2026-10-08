import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { travelContent } from '../../content/travel/content'
import { getUiCopy } from '../../content/copy'
import { ProvenanceBadge } from './ProvenanceBadge'

const beijing = travelContent.destinations.find((destination) => destination.id === 'beijing')!
const perishableFact = beijing.attractions[0]
const stableFact = beijing.attractions.find((attraction) => attraction.freshness === 'stable')!

describe('ProvenanceBadge', () => {
  it('shows the source and lastChecked on every fact', () => {
    render(<ProvenanceBadge fact={stableFact} language="en" />)

    expect(screen.getByText('Beijing Municipal Government')).toBeInTheDocument()
    expect(screen.getByText(stableFact.lastChecked)).toBeInTheDocument()
  })

  it('adds a "Verify official" link only on perishable facts, pointing at the official url', () => {
    const copy = getUiCopy('en').travel.result
    render(<ProvenanceBadge fact={perishableFact} language="en" />)

    const link = screen.getByRole('link', { name: copy.verifyOfficial })
    expect(link).toHaveAttribute('href', 'https://www.beijing.gov.cn')
  })

  it('does not render a "Verify official" badge for stable facts', () => {
    const copy = getUiCopy('en').travel.result
    render(<ProvenanceBadge fact={stableFact} language="en" />)

    expect(screen.queryByRole('link', { name: copy.verifyOfficial })).not.toBeInTheDocument()
  })

  it('never renders a per-fact origin chip', () => {
    render(<ProvenanceBadge fact={perishableFact} language="en" />)

    expect(screen.queryByText(/curated/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/live data/i)).not.toBeInTheDocument()
  })
})
